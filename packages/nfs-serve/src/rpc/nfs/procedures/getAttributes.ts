import * as net from 'net';
import fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

export type GetAttributesResult =
  | {
      status:
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      stats?: never;
    }
  | { status: nfsstat3.OK; stats: fs.Stats & { fileId: bigint } };

export type GetAttributesHandler = (
  handle: Buffer
) => Promise<GetAttributesResult>;

/**
 * Source:  https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.1
 *
 * Procedure GETATTR retrieves the attributes for a specified
 * file system object. The object is identified by the file
 * handle that the server returned as part of the response
 * from a LOOKUP, CREATE, MKDIR, SYMLINK, MKNOD, or
 * READDIRPLUS procedure (or from the MOUNT service,
 * described elsewhere). On entry, the arguments in
 * GETATTR3args are:
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client (not including the xid or tcp header)
 * @param getAttributesHandler the handler to use for getting attributes
 */
export async function getAttributes(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  getAttributesHandler: GetAttributesHandler
): Promise<void> {
  try {
    // Read the file handle from the data
    const handle = readHandle(data);

    const result = await getAttributesHandler(handle);
    // // console.log("GETATTR result:", result);

    if (result.status !== 0) {
      console.error('Error getting attributes:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Create the GETATTR3res structure
    // First the status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // Combine all parts: RPC header + NFS status + file attributes
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      getAttributeBuffer(result.stats),
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply with proper flushing
    socket.write(reply, err => {
      if (err) {
        console.error(`Error sending GETATTR reply: ${err}`);
      }
    });
  } catch (err) {
    console.error('Error handling GETATTR request:', err);
    sendNfsError(socket, xid, 10006); // NFS3ERR_SERVERFAULT
  }
}
