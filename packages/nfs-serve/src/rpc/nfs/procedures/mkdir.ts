import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

export type MkdirResult =
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
      parentStats?: never;
    }
  | {
      status: number;
      handle: Buffer;
      stats: fs.Stats & { fileId: bigint };
      parentStats: fs.Stats & { fileId: bigint };
    };

export type MkdirHandler = (
  parentHandle: Buffer,
  name: string,
  mode: number
) => Promise<MkdirResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.9
 *
 * Procedure MKDIR creates a new subdirectory.
 * The server creates the directory specified by the
 * diropargs3 structure, parent and name, and returns
 * a file handle for it. The mode field is used as
 * initial permission bits for the directory.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param mkdirHandler the handler to use for creating the directory
 */
export async function mkdir(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  mkdirHandler: MkdirHandler
): Promise<void> {
  try {
    // console.log('NFS MKDIR procedure');

    // Read the parent directory handle from the data
    const parentHandle = readHandle(data);

    // Get handle length to calculate offset
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Read directory name
    const nameLength = data.readUInt32BE(offset);
    offset += 4;
    const name = data
      .toString('utf8', offset, offset + nameLength)
      .normalize('NFC');
    offset += Math.ceil(nameLength / 4) * 4; // Move offset, aligned to 4 bytes

    // Read directory attributes
    let mode = 0o755; // Default mode for directories

    // Read mode from sattr3
    const setMode = data.readUInt32BE(offset);
    offset += 4;
    if (setMode === 1) {
      mode = data.readUInt32BE(offset);
      offset += 4;
    }

    // Skip other attributes (we don't handle them in this simple implementation)
    // In a real implementation, you'd read uid, gid, etc.

    // console.log(
    //   `MKDIR request: parentHandle=${parentHandle.toString(
    //     'hex'
    //   )}, name=${name}, mode=${mode}`
    // );

    // Call the handler to create the directory
    const result = await mkdirHandler(parentHandle, name, mode);

    if (result.status !== 0) {
      console.error('Error creating directory:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // Directory handle created status (1 = handle follows)
    const handleStatusBuf = Buffer.alloc(4);
    handleStatusBuf.writeUInt32BE(1, 0);

    // Directory handle
    const handleLenBuf = Buffer.alloc(4);
    handleLenBuf.writeUInt32BE(result.handle.length, 0);

    // Post-op directory attributes
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
    const dirAttrBuf = getAttributeBuffer(result.parentStats);

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
    socket.write(reply, err => {
      if (err) {
        console.error(`Error sending MKDIR reply: ${err}`);
      }
    });
    // console.log('Sent MKDIR reply');
  } catch (err) {
    console.error('Error handling MKDIR request:', err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
