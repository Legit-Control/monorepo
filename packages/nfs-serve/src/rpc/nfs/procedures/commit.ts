import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

/**
 * Errors:
 * NFS3ERR_IO
  NFS3ERR_STALE
  NFS3ERR_BADHANDLE
  NFS3ERR_SERVERFAULT
 */

export type CommitResult =
  | { status: nfsstat3.OK; statsAfter: fs.Stats & { fileId: bigint } }
  | {
      status: nfsstat3.ERR_STALE | nfsstat3.ERR_NOENT | nfsstat3.ERR_ISDIR;
      statsAfter?: never;
    };

/**
 * Procedure COMMIT forces or flushes data to stable storage
 * that was previously written with a WRITE procedure call
 * with the stable field set to UNSTABLE.
 */
export type CommitHandler = ({
  /**
   * The file handle for the file to which data is to be
   * flushed (committed). This must identify a file system
   * object of type, NF3REG.
   */
  handle,
  /**
   * The offset in the file at which to start committing
   * data. This is the byte offset from the beginning of
   * the file.
   */
  offset,
  /**
   * The number of bytes of data to flush. If count is undefined, a
   * flush from offset to the end of file is done.
   */
  count,
}: {
  handle: Buffer;
  offset?: number;
  count?: number;
}) => Promise<CommitResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.21
 *
 * Procedure COMMIT forces or flushes data to stable storage
 * that was previously written with a WRITE procedure call
 * with the stable field set to UNSTABLE.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 */
export async function commit(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  commitHandler: CommitHandler
): Promise<void> {
  try {
    // console.log("NFS COMMIT procedure");

    // Read the file handle from the data
    const handle = readHandle(data);

    const result = await commitHandler({ handle });

    if (result.status !== 0) {
      console.error('Error committing data:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // WCC data for file - simplified for now
    const wccDataPreBuf = Buffer.alloc(4);
    wccDataPreBuf.writeUInt32BE(0, 0); // pre-operation attributes: no

    const wccDataPostBuf = Buffer.alloc(4);
    wccDataPostBuf.writeUInt32BE(1, 0); // post-operation attributes: yes

    // Get file attributes
    const attrBuf = getAttributeBuffer(result.statsAfter);

    // Write verifier - should be consistent per server instance
    // Just use a fixed value for now
    const verifierBuf = Buffer.alloc(8);
    verifierBuf.writeUInt32BE(0xdeadbeef, 0);
    verifierBuf.writeUInt32BE(0xfeedface, 4);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      wccDataPreBuf,
      wccDataPostBuf,
      attrBuf,
      verifierBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply);
  } catch (err) {
    console.error('Error handling COMMIT request:', err);
    sendNfsError(socket, xid, 10006); // NFS3ERR_SERVERFAULT
  }
}
