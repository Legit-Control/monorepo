import * as net from 'net';
import * as fs from 'fs';

import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';
import { getWccAttributeBuffer } from './util/getWccAttributeBuffer.js';

export type RenameResult =
  | {
      status:
        | nfsstat3.ERR_NOENT
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_EXIST
        | nfsstat3.ERR_XDEV
        | nfsstat3.ERR_NOTDIR
        | nfsstat3.ERR_ISDIR
        | nfsstat3.ERR_INVAL
        | nfsstat3.ERR_NOSPC
        | nfsstat3.ERR_ROFS
        | nfsstat3.ERR_MLINK
        | nfsstat3.ERR_NAMETOOLONG
        | nfsstat3.ERR_NOTEMPTY
        | nfsstat3.ERR_DQUOT
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_NOTSUPP
        | nfsstat3.ERR_SERVERFAULT;
      fromDirStats?: never;
      toDirStats?: never;
    }
  | {
      status: number;
      fromDirStatsBeforeChange: fs.Stats & { fileId: bigint };
      fromDirStatsAfterChange: fs.Stats & { fileId: bigint };
      toDirStatsBeforeChange: fs.Stats & { fileId: bigint };
      toDirStatsAfterChange: fs.Stats & { fileId: bigint };
    };

export type RenameHandler = (
  fromDirHandle: Buffer,
  fromName: string,
  toDirHandle: Buffer,
  toName: string
) => Promise<RenameResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.14
 *
 * Procedure RENAME renames the object identified by from.name
 * in the directory, from.dir, to to.name in the directory,
 * to.dir. The operation is required to be atomic to the client.
 * fromName and toName must both be strings and must not be null.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param renameHandler the handler to use for renaming the file
 */
export async function rename(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  renameHandler?: RenameHandler
): Promise<void> {
  // try {
  const now = new Date();
  // console.log(`[${now.toISOString()}] NFS RENAME procedure (XID: ${xid})`);

  // Read the source directory handle from the data
  const fromDirHandle = readHandle(data);
  // console.log(`From directory handle: ${fromDirHandle.toString('hex')}`);

  // Extract the source name
  const fromHandleLength = data.readUInt32BE(0);
  let offset = 4 + fromHandleLength;

  // Read source name length
  const fromNameLength = data.readUInt32BE(offset);
  offset += 4;

  // Read source name
  const fromName = data.toString('utf8', offset, offset + fromNameLength);

  // Account for XDR padding - names are padded to 4-byte boundaries
  const paddedFromNameLength = Math.ceil(fromNameLength / 4) * 4;
  offset += paddedFromNameLength;

  // Now read the destination directory handle
  const toDirHandleLength = data.readUInt32BE(offset);
  offset += 4;

  // Read destination directory handle
  const toDirHandle = data.slice(offset, offset + toDirHandleLength);
  // console.log(`To directory handle: ${toDirHandle.toString('hex')}`);
  offset += toDirHandleLength;

  // Read destination name length
  const toNameLength = data.readUInt32BE(offset);
  offset += 4;

  // Read destination name
  const toName = data.toString('utf8', offset, offset + toNameLength);

  // console.log(`Renaming from "${fromName}" to "${toName}"`);

  // Call the handler to perform the rename operation
  let result: RenameResult;

  if (renameHandler) {
    // Use provided handler
    result = await renameHandler(fromDirHandle, fromName, toDirHandle, toName);
  } else {
    // Fallback to default behavior
    // console.log('Using fallback RENAME implementation');
    sendNfsError(socket, xid, nfsstat3.ERR_NOTSUPP);
    return;
  }

  if (result.status !== 0) {
    console.error('Error renaming:', result);
    sendNfsError(socket, xid, result.status);
    return;
  }

  // Create proper RPC accepted reply header
  const headerBuf = createSuccessHeader();

  // Status (0 = success)
  const statusBuf = Buffer.alloc(4);
  statusBuf.writeUInt32BE(0, 0); // NFS3_OK

  // WCC data for source directory - pre-operation attributes
  const fromWccDataPreBuf = Buffer.alloc(4);
  fromWccDataPreBuf.writeUInt32BE(1, 0); // pre-operation attributes: yes

  const fromDirAttrBufPre = getWccAttributeBuffer(
    result.fromDirStatsBeforeChange
  );

  // Source directory post-op attributes follow (1 = yes)
  const fromWccDataPostBuf = Buffer.alloc(4);
  fromWccDataPostBuf.writeUInt32BE(1, 0); // post-operation attributes: yes

  // Source directory attributes buffer
  const fromDirAttrBufPost = getAttributeBuffer(result.fromDirStatsAfterChange);

  // WCC data for destination directory - pre-operation attributes
  const toWccDataPreBuf = Buffer.alloc(4);
  toWccDataPreBuf.writeUInt32BE(1, 0); // pre-operation attributes: no

  const toDirAttrBufPre = getWccAttributeBuffer(result.toDirStatsBeforeChange);

  // Destination directory post-op attributes follow (1 = yes)
  const toWccDataPostBuf = Buffer.alloc(4);
  toWccDataPostBuf.writeUInt32BE(1, 0); // post-operation attributes: yes

  // Destination directory attributes buffer
  const toDirAttrBufPost = getAttributeBuffer(result.toDirStatsAfterChange);

  // Combine all parts in proper order per the NFS3 spec
  const replyBuf = Buffer.concat([
    headerBuf,
    statusBuf,
    fromWccDataPreBuf,
    fromDirAttrBufPre,
    fromWccDataPostBuf,
    fromDirAttrBufPost,
    toWccDataPreBuf,
    toDirAttrBufPre,
    toWccDataPostBuf,
    toDirAttrBufPost,
  ]);

  // Create the full RPC reply
  const reply = createRpcReply(xid, replyBuf);

  // Send the reply
  socket.write(reply);
  // console.log(
  //   `Sent RENAME reply for "${fromName}" to "${toName}" (XID: ${xid})`
  // );
  // } catch (err) {
  //   console.error(`Error handling RENAME request: ${err}`);
  //   sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  // }
}
