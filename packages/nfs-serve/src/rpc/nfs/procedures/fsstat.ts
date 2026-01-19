import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

export type FSStatResult =
  | {
      status:
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      stats?: never;
      tbytes?: never;
      fbytes?: never;
      abytes?: never;
      tfiles?: never;
      ffiles?: never;
      afiles?: never;
      invarsec?: never;
    }
  | {
      status: number;
      stats: fs.Stats & { fileId: bigint };
      tbytes: bigint;
      fbytes: bigint;
      abytes: bigint;
      tfiles: bigint;
      ffiles: bigint;
      afiles: bigint;
      invarsec: number;
    };

export type FSStatHandler = (handle: Buffer) => Promise<FSStatResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.18
 *
 * Procedure FSSTAT retrieves volatile file system state
 * information.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param fsstatHandler the handler to use for getting filesystem statistics
 */
export async function fsstat(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  fsstatHandler: FSStatHandler
): Promise<void> {
  try {
    // console.log("NFS FSSTAT procedure");

    // Read the file handle from the data
    const handle = readHandle(data);
    // console.log(`FSSTAT request: handle=${handle.toString("hex")}`);

    // Check if handle contains only zeros (invalid handle)
    const isZeroHandle = handle.every(byte => byte === 0);
    if (isZeroHandle) {
      console.error('Invalid handle: contains only zeros');
      sendNfsError(socket, xid, nfsstat3.ERR_BADHANDLE);
      return;
    }

    const result = await fsstatHandler(handle);

    if (result.status !== 0) {
      console.error('Error getting filesystem stats:', result);
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

    // console.log("Post-op attributes follow", result.stats);
    // Attributes buffer
    const attrBuf = getAttributeBuffer(result.stats);

    // FSstat specific fields
    const statBlockBuf = Buffer.alloc(52); // 52 bytes for all fsstat values
    let offset = 0;

    // tbytes - Total size (bytes) of the filesystem
    statBlockBuf.writeUInt32BE(Number(result.tbytes >> BigInt(32)), offset);
    offset += 4;
    statBlockBuf.writeUInt32BE(
      Number(result.tbytes & BigInt(0xffffffff)),
      offset
    );
    offset += 4;

    // fbytes - Free space (bytes) in the filesystem
    statBlockBuf.writeUInt32BE(Number(result.fbytes >> BigInt(32)), offset);
    offset += 4;
    statBlockBuf.writeUInt32BE(
      Number(result.fbytes & BigInt(0xffffffff)),
      offset
    );
    offset += 4;

    // abytes - Free space (bytes) available to non-privileged users
    statBlockBuf.writeUInt32BE(Number(result.abytes >> BigInt(32)), offset);
    offset += 4;
    statBlockBuf.writeUInt32BE(
      Number(result.abytes & BigInt(0xffffffff)),
      offset
    );
    offset += 4;

    // tfiles - Total number of file slots
    statBlockBuf.writeUInt32BE(Number(result.tfiles >> BigInt(32)), offset);
    offset += 4;
    statBlockBuf.writeUInt32BE(
      Number(result.tfiles & BigInt(0xffffffff)),
      offset
    );
    offset += 4;

    // ffiles - Free file slots
    statBlockBuf.writeUInt32BE(Number(result.ffiles >> BigInt(32)), offset);
    offset += 4;
    statBlockBuf.writeUInt32BE(
      Number(result.ffiles & BigInt(0xffffffff)),
      offset
    );
    offset += 4;

    // afiles - Free file slots available to non-privileged users
    statBlockBuf.writeUInt32BE(Number(result.afiles >> BigInt(32)), offset);
    offset += 4;
    statBlockBuf.writeUInt32BE(
      Number(result.afiles & BigInt(0xffffffff)),
      offset
    );
    offset += 4;

    // invarsec - Time of unchanged state before refresh (seconds)
    statBlockBuf.writeUInt32BE(result.invarsec, offset);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      postOpAttrBuf,
      attrBuf,
      statBlockBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply, err => {
      if (err) {
        console.error(`Error sending FSSTAT reply: ${err}`);
      }
    });
    // console.log("Sent FSSTAT reply");
  } catch (err) {
    console.error('Error handling FSSTAT request:', err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
