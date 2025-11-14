import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';
import { getWccAttributeBuffer } from './util/getWccAttributeBuffer.js';

export type RmdirResult =
  | {
      status:
        | nfsstat3.ERR_NOENT
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_INVAL
        | nfsstat3.ERR_EXIST
        | nfsstat3.ERR_NOTDIR
        | nfsstat3.ERR_NAMETOOLONG
        | nfsstat3.ERR_ROFS
        | nfsstat3.ERR_NOTEMPTY
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_NOTSUPP
        | nfsstat3.ERR_SERVERFAULT;
      dirStatsBeforeChange?: never;
      dirStatsAfterChange?: never;
    }
  | {
      status: number;
      dirStatsBeforeChange: fs.Stats & { fileId: bigint };
      dirStatsAfterChange: fs.Stats & { fileId: bigint };
    };

export type RmdirHandler = (
  parentHandle: Buffer,
  name: string
) => Promise<RmdirResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.13
 *
 * Procedure RMDIR removes (deletes) a subdirectory from a
 * directory. If the directory entry of the subdirectory is
 * the last reference to the subdirectory, the subdirectory
 * may be destroyed. On entry, the arguments in RMDIR3args are:
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param rmdirHandler the handler to use for removing the directory
 */
export async function rmdir(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  rmdirHandler?: RmdirHandler
): Promise<void> {
  try {
    console.log('NFS RMDIR procedure');

    // Read the parent directory handle from the data
    const parentHandle = readHandle(data);

    // Extract the directory name to remove
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Read name length
    const nameLength = data.readUInt32BE(offset);
    offset += 4;

    // Read name
    const name = data
      .toString('utf8', offset, offset + nameLength)
      .normalize('NFC');

    console.log(
      `RMDIR request: parentHandle=${parentHandle.toString(
        'hex'
      )}, name=${name}`
    );

    // Call the handler to remove the directory
    let result: RmdirResult;

    if (rmdirHandler) {
      // Use provided handler
      result = await rmdirHandler(parentHandle, name);
    } else {
      // Fallback to default behavior
      console.log('Using fallback RMDIR implementation');
      sendNfsError(socket, xid, nfsstat3.ERR_NOTSUPP);
      return;
    }

    if (result.status !== 0) {
      console.error('Error removing directory:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // WCC data for parent directory (pre-operation attributes)
    const wccDataPreBuf = Buffer.alloc(4);
    wccDataPreBuf.writeUInt32BE(1, 0); // pre-operation attributes: no
    const dirAttrPreBuf = getWccAttributeBuffer(result.dirStatsAfterChange);

    // Parent directory post-operation attributes follow (1 = yes)
    const wccDataPostBuf = Buffer.alloc(4);
    wccDataPostBuf.writeUInt32BE(1, 0); // post-operation attributes: yes

    // Parent directory attributes buffer
    const dirAttrPostBuf = getAttributeBuffer(result.dirStatsAfterChange);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      wccDataPreBuf,
      dirAttrPreBuf,
      wccDataPostBuf,
      dirAttrPostBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply);
    console.log(`Sent RMDIR reply for ${name}`);
  } catch (err) {
    console.error('Error handling RMDIR request:', err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
