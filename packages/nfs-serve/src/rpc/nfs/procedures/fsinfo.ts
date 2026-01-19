import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

export type FSInfoResult =
  | {
      status:
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      stats?: never;
      rtmax?: never;
      rtpref?: never;
      rtmult?: never;
      wtmax?: never;
      wtpref?: never;
      wtmult?: never;
      dtpref?: never;
      maxfilesize?: never;
      timeDelta?: never;
      properties?: never;
    }
  | {
      status: number;
      stats: fs.Stats & { fileId: bigint };
      rtmax: number;
      rtpref: number;
      rtmult: number;
      wtmax: number;
      wtpref: number;
      wtmult: number;
      dtpref: number;
      maxfilesize: bigint;
      timeDelta: { seconds: number; nseconds: number };
      properties: number;
    };

export type FSInfoHandler = (handle: Buffer) => Promise<FSInfoResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.19
 *
 * Procedure FSINFO retrieves nonvolatile file system state
 * information and general information about the NFS version 3
 * protocol server implementation.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param fsinfoHandler the handler to use for getting filesystem info
 */
export async function fsinfo(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  fsinfoHandler: FSInfoHandler
): Promise<void> {
  try {
    // console.log("NFS FSINFO procedure");

    // Read the file handle from the data
    const handle = readHandle(data);
    // console.log(`FSINFO request: handle=${handle.toString('hex')}`);

    const result = await fsinfoHandler(handle);

    if (result.status !== 0) {
      console.error('Error getting filesystem info:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // Post-op attributes
    const postOpAttrBuf = Buffer.alloc(4);
    postOpAttrBuf.writeUInt32BE(1, 0); // attributes follow: yes

    // Attributes buffer
    const attrBuf = getAttributeBuffer(result.stats);

    // FSInfo specific fields
    const infoBlockBuf = Buffer.alloc(72); // 72 bytes for all fsinfo values
    let offset = 0;

    // rtmax - Max read transfer size
    infoBlockBuf.writeUInt32BE(result.rtmax, offset);
    offset += 4;

    // rtpref - Preferred read transfer size
    infoBlockBuf.writeUInt32BE(result.rtpref, offset);
    offset += 4;

    // rtmult - Suggested multiple for read transfer size
    infoBlockBuf.writeUInt32BE(result.rtmult, offset);
    offset += 4;

    // wtmax - Max write transfer size
    infoBlockBuf.writeUInt32BE(result.wtmax, offset);
    offset += 4;

    // wtpref - Preferred write transfer size
    infoBlockBuf.writeUInt32BE(result.wtpref, offset);
    offset += 4;

    // wtmult - Suggested multiple for write transfer size
    infoBlockBuf.writeUInt32BE(result.wtmult, offset);
    offset += 4;

    // dtpref - Preferred READDIR request size
    infoBlockBuf.writeUInt32BE(result.dtpref, offset);
    offset += 4;

    // maxfilesize - Maximum file size
    const maxFileSize = result.maxfilesize;
    infoBlockBuf.writeUInt32BE(Number(maxFileSize >> BigInt(32)), offset);
    offset += 4;
    infoBlockBuf.writeUInt32BE(
      Number(maxFileSize & BigInt(0xffffffff)),
      offset
    );
    offset += 4;

    // time_delta - Server time granularity
    infoBlockBuf.writeUInt32BE(result.timeDelta.seconds, offset);
    offset += 4;
    infoBlockBuf.writeUInt32BE(result.timeDelta.nseconds, offset);
    offset += 4;

    // Properties - Bitmap of supported operations
    infoBlockBuf.writeUInt32BE(result.properties, offset);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      postOpAttrBuf,
      attrBuf,
      infoBlockBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply, err => {
      if (err) {
        console.error(`Error sending FSINFO reply: ${err}`);
      }
    });
    // console.log("Sent FSINFO reply");
  } catch (err) {
    console.error('Error handling FSINFO request:', err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
