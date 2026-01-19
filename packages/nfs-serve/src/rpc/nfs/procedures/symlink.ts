import * as net from 'net';
import * as fs from 'fs';

import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

export type SymlinkResult =
  | {
      status:
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_EXIST
        | nfsstat3.ERR_NOTDIR
        | nfsstat3.ERR_NOSPC
        | nfsstat3.ERR_ROFS
        | nfsstat3.ERR_NAMETOOLONG
        | nfsstat3.ERR_DQUOT
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_NOTSUPP
        | nfsstat3.ERR_SERVERFAULT;
      handle?: never;
      stats?: never;
      dirStats?: never;
    }
  | {
      status: number;
      handle: Buffer;
      stats: fs.Stats & { fileId: bigint };
      dirStats: fs.Stats & { fileId: bigint };
    };

export type SymlinkHandler = (
  dirHandle: Buffer,
  name: string,
  symlink: string,
  attributes?: any
) => Promise<SymlinkResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.10
 *
 * Procedure SYMLINK creates a symbolic link. On entry, the
 * arguments in SYMLINK3args are:
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param symlinkHandler the handler to use for creating the symbolic link
 */
export async function symlink(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  symlinkHandler?: SymlinkHandler
): Promise<void> {
  try {
    // console.log('NFS SYMLINK procedure');

    // Read the directory handle from the data
    const dirHandle = readHandle(data);

    // Extract the symlink name (target name)
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Read name length
    const nameLength = data.readUInt32BE(offset);
    offset += 4;

    // Read name
    const name = data
      .toString('utf8', offset, offset + nameLength)
      .normalize('NFC');
    offset += Math.ceil(nameLength / 4) * 4; // Move offset, aligned to 4 bytes

    // Skip over symlink attributes for now
    offset += 4; // Skip attributes_follow flag
    // TODO: Parse symlink attributes if needed

    // Read symlink data length
    const linkDataLength = data.readUInt32BE(offset);
    offset += 4;

    // Read symlink data (the path that the symlink points to)
    const linkData = data.toString('utf8', offset, offset + linkDataLength);

    // console.log(
    //   `SYMLINK request: dirHandle=${dirHandle.toString(
    //     'hex'
    //   )}, name=${name}, target=${linkData}`
    // );

    // Call the handler to create the symlink
    let result: SymlinkResult;

    if (symlinkHandler) {
      // Use provided handler
      result = await symlinkHandler(dirHandle, name, linkData);
    } else {
      // Fallback to default behavior
      // console.log('Using fallback SYMLINK implementation');
      sendNfsError(socket, xid, nfsstat3.ERR_NOTSUPP);
      return;
    }

    if (result.status !== 0) {
      console.error('Error creating symlink:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // File handle created status (1 = handle follows)
    const handleStatusBuf = Buffer.alloc(4);
    handleStatusBuf.writeUInt32BE(1, 0);

    // File handle
    const handleLenBuf = Buffer.alloc(4);
    handleLenBuf.writeUInt32BE(result.handle.length, 0);

    // Post-op symlink attributes
    const postOpAttrBuf = Buffer.alloc(4);
    postOpAttrBuf.writeUInt32BE(1, 0); // attributes follow: yes

    // Attributes buffer
    const attrBuf = getAttributeBuffer(result.stats);

    // Parent directory wcc data (pre-operation attributes)
    const wccDataBuf = Buffer.alloc(4);
    wccDataBuf.writeUInt32BE(0, 0); // no pre-op attributes

    // Parent directory post-operation attributes
    const dirPostOpAttrBuf = Buffer.alloc(4);
    dirPostOpAttrBuf.writeUInt32BE(1, 0); // attributes follow: yes

    // Parent directory attributes buffer
    const dirAttrBuf = getAttributeBuffer(result.dirStats);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      handleStatusBuf,
      handleLenBuf,
      result.handle,
      postOpAttrBuf,
      attrBuf,
      wccDataBuf,
      dirPostOpAttrBuf,
      dirAttrBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply);
    // console.log(`Sent SYMLINK reply for ${name}`);
  } catch (err) {
    console.error('Error handling SYMLINK request:', err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
