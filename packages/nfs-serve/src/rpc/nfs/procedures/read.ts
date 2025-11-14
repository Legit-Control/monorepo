import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import {
  createPaddedXdrData,
  createSuccessHeader,
} from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

export type ReadResult =
  | {
      status:
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_NXIO
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_INVAL
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      data?: never;
      stats?: never;
      eof?: never;
    }
  | {
      status: number;
      data: Buffer;
      stats: fs.Stats & { fileId: bigint };
      eof: boolean;
    };

export type ReadHandler = (
  handle: Buffer,
  offset: bigint,
  count: number
) => Promise<ReadResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.6
 *
 * Procedure READ reads data from a file. On entry, the
 * arguments in READ3args are:
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param readHandler the handler to use for reading the file
 */
export async function read(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  readHandler: ReadHandler
): Promise<void> {
  try {
    const now = new Date();
    console.log(`[${now.toISOString()}] NFS READ procedure (XID: ${xid})`);

    // Read the file handle from the data
    const handle = readHandle(data);

    // Parse offset and count
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Read offset (8 bytes)
    const readOffset = data.readBigUInt64BE(offset);
    offset += 8;

    // Read count (4 bytes)
    const readCount = data.readUInt32BE(offset);
    offset += 4;

    console.log(
      `READ request: handle=${handle.toString(
        'hex'
      )}, offset=${readOffset}, count=${readCount} bytes`
    );

    const result = await readHandler(handle, readOffset, readCount);

    if (result.status !== 0) {
      console.error('Error reading file:', result);
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

    // File attributes
    const attrBuf = getAttributeBuffer(result.stats);

    // Count of bytes read
    const bytesRead = result.data.length;
    const countBuf = Buffer.alloc(4);
    countBuf.writeUInt32BE(bytesRead, 0);

    // EOF flag (1 if we've reached EOF, 0 otherwise)
    const eofBuf = Buffer.alloc(4);
    eofBuf.writeUInt32BE(result.eof ? 1 : 0, 0);

    // Data length
    const dataLenBuf = Buffer.alloc(4);
    dataLenBuf.writeUInt32BE(bytesRead, 0);

    // Use our utility function to properly pad the data for XDR compliance
    const { buffer: paddedDataBuf } = createPaddedXdrData(result.data);

    console.log(
      `Read ${bytesRead} bytes, padded to ${paddedDataBuf.length} bytes`
    );

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      postOpAttrBuf,
      attrBuf,
      countBuf,
      eofBuf,
      dataLenBuf,
      paddedDataBuf, // Use padded buffer for XDR alignment
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply);
    console.log(`Sent READ reply: ${bytesRead} bytes`);
  } catch (err) {
    console.error('Error handling READ request:', err);
    sendNfsError(socket, xid, 10006); // NFS3ERR_SERVERFAULT
  }
}
