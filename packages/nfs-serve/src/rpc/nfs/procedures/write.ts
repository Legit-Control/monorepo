import * as net from 'net';
import * as fs from 'fs';

import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

export type WriteResult =
  | {
      status:
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_FBIG
        | nfsstat3.ERR_DQUOT
        | nfsstat3.ERR_NOSPC
        | nfsstat3.ERR_ROFS
        | nfsstat3.ERR_INVAL
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      bytesWritten?: never;
      stats?: never;
    }
  | {
      status: number;
      bytesWritten: number;
      stats: fs.Stats & { fileId: bigint };
    };

export type WriteHandler = (
  handle: Buffer,
  offset: bigint,
  data: Buffer,
  count: number,
  stableHow: number
) => Promise<WriteResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.7
 *
 * Procedure WRITE writes data to a file. On entry, the arguments in
 * WRITE3args are:
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param writeHandler the handler to use for writing the file
 */
export async function write(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  writeHandler: WriteHandler
): Promise<void> {
  try {
    const now = new Date();
    // console.log(`[${now.toISOString()}] NFS WRITE procedure (XID: ${xid})`);

    // Read the file handle from the data
    const handle = readHandle(data);
    // console.log(`File handle: ${handle.toString('hex')}`);

    // Parse offset, stable, and count
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Read offset (8 bytes)
    const writeOffset = data.readBigUInt64BE(offset);
    offset += 8;

    // Read count (4 bytes)
    const writeCount = data.readUInt32BE(offset);
    offset += 4;

    // Read stable how (4 bytes): 0=UNSTABLE, 1=DATA_SYNC, 2=FILE_SYNC
    const stableHow = data.readUInt32BE(offset);
    const stableHowNames = ['UNSTABLE', 'DATA_SYNC', 'FILE_SYNC'];
    const stableName = stableHowNames[stableHow] || 'UNKNOWN';
    offset += 4;

    // Read data length (4 bytes) - should be same as writeCount
    const dataLength = data.readUInt32BE(offset);
    offset += 4;

    if (dataLength != writeCount) {
      console.error(`Data length (${dataLength}) != count (${writeCount})`);
      sendNfsError(socket, xid, 22); // NFS3ERR_INVAL
      return;
    }

    // Get the data to write - need to handle XDR padding in the input
    const paddedDataOffset = offset;

    // Extract data from the request, respecting proper XDR padding
    const writeData = data.slice(
      paddedDataOffset,
      paddedDataOffset + dataLength
    );

    const result = await writeHandler(
      handle,
      writeOffset,
      writeData,
      writeCount,
      stableHow
    );

    if (result.status !== 0) {
      console.error('Error writing to file:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // WCC data - we should implement this properly
    // For now just indicate attributes follow (1 = yes for post-op attrs)
    const wccDataPreBuf = Buffer.alloc(4);
    wccDataPreBuf.writeUInt32BE(0, 0); // pre-operation attributes: no

    const wccDataPostBuf = Buffer.alloc(4);
    wccDataPostBuf.writeUInt32BE(1, 0); // post-operation attributes: yes

    // File attributes after the write
    const attrBuf = getAttributeBuffer(result.stats);

    // Count of bytes written
    const countBuf = Buffer.alloc(4);
    countBuf.writeUInt32BE(result.bytesWritten, 0);

    // Write's stability level (same as requested by client)
    const commitBuf = Buffer.alloc(4);
    commitBuf.writeUInt32BE(stableHow, 0);

    // Write verifier - should be consistent per server instance
    // The verifier needs to be the same for the same server instance
    // It's used by clients to detect server restarts
    const verifierBuf = Buffer.alloc(8);
    verifierBuf.writeUInt32BE(0xdeadbeef, 0); // Use consistent values for the same server instance
    verifierBuf.writeUInt32BE(0xfeedface, 4);

    // Create a properly structured reply that follows XDR alignment rules
    const replyBuf = Buffer.concat([
      headerBuf, // RPC success header
      statusBuf, // NFS status (success)
      wccDataPreBuf, // Pre-op attributes (none)
      wccDataPostBuf, // Post-op attributes follow (yes)
      attrBuf, // File attributes after write
      countBuf, // Number of bytes written
      commitBuf, // Commitment level (as requested)
      verifierBuf, // Write verifier
    ]);

    // Create the full RPC reply with transaction ID
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply);

    // Log success with details
    // console.log(
    //   `Sent WRITE reply: ${result.bytesWritten} bytes written at offset ${writeOffset}, commit=${stableName}, XID=${xid}`
    // );
  } catch (err) {
    console.error('Error handling WRITE request:', err);
    sendNfsError(socket, xid, 10006); // NFS3ERR_SERVERFAULT
  }
}
