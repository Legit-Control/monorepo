import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';
import { getWccAttributeBuffer } from './util/getWccAttributeBuffer.js';

export type RemoveResult =
  | {
      status:
        | nfsstat3.ERR_NOENT
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_NOTDIR
        | nfsstat3.ERR_NAMETOOLONG
        | nfsstat3.ERR_ROFS
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      dirStatsBeforeChange?: never;
      dirStatsAfterChange?: never;
    }
  | {
      status: number;
      dirStatsBeforeChange: fs.Stats & { fileId: bigint };
      dirStatsAfterChange: fs.Stats & { fileId: bigint };
    };

export type RemoveHandler = (
  dirHandle: Buffer,
  name: string
) => Promise<RemoveResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.12
 *
 * Procedure REMOVE removes (deletes) an entry from a directory.
 * If the entry in the directory was the last reference to the
 * object, the object may be destroyed. On entry, the arguments
 * in REMOVE3args are:
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param removeHandler the handler to use for removing the file
 */
export async function remove(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  removeHandler?: RemoveHandler
): Promise<void> {
  try {
    // console.log('NFS REMOVE procedure');

    // Read the directory handle from the data
    const handle = readHandle(data);

    // Read file name to remove
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Read name length
    const nameLength = data.readUInt32BE(offset);
    offset += 4;

    // Read name
    const name = data
      .toString('utf8', offset, offset + nameLength)
      .normalize('NFC');

    // console.log(
    //   `REMOVE request: dirHandle=${handle.toString('hex')}, name=${name}`
    // );

    // Get the removal result from handler or use fallback
    let result: RemoveResult;

    if (removeHandler) {
      // Use provided handler
      result = await removeHandler(handle, name);
      
    } else {
      // Fallback to default behavior
      // console.log('Using fallback REMOVE implementation');
      sendNfsError(socket, xid, nfsstat3.ERR_NOTSUPP);
      return;
    }

    if (result.status !== 0) {
      console.error('Error removing file:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // WCC data for directory (pre-operation attributes)
    const wccDataPreBuf = Buffer.alloc(4);
    wccDataPreBuf.writeUInt32BE(1, 0); // pre-operation attributes: yes
    const dirAttrBeforBuf = getWccAttributeBuffer(result.dirStatsBeforeChange);

    // console.log('dirAttrBeforBuf', dirAttrBeforBuf);

    // Directory post-operation attributes
    const dirPostOpAttrBuf = Buffer.alloc(4);
    dirPostOpAttrBuf.writeUInt32BE(1, 0); // attributes follow: yes

    // Directory attributes buffer
    const dirAttAfterBuf = getAttributeBuffer(result.dirStatsAfterChange);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      wccDataPreBuf,
      dirAttrBeforBuf,
      dirPostOpAttrBuf,
      dirAttAfterBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply);
    // console.log(`Sent REMOVE reply for ${name}`);
  } catch (err) {
    console.error('Error handling REMOVE request:', err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
