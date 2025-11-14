import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

export type MknodResult =
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
        | nfsstat3.ERR_SERVERFAULT
        | nfsstat3.ERR_BADTYPE;
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

export type MknodHandler = (
  parentHandle: Buffer,
  name: string,
  type: number,
  mode: number,
  rdev?: { major: number; minor: number }
) => Promise<MknodResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.11
 *
 * Procedure MKNOD creates a special device file. On entry, the
 * arguments in MKNOD3args are:
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param mknodHandler the handler to use for creating the special file
 */
export async function mknod(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  mknodHandler?: MknodHandler
): Promise<void> {
  try {
    console.log('NFS MKNOD procedure');

    // Read the parent directory handle from the data
    const parentHandle = readHandle(data);

    // Get handle length to calculate offset
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Read file name
    const nameLength = data.readUInt32BE(offset);
    offset += 4;
    const name = data
      .toString('utf8', offset, offset + nameLength)
      .normalize('NFC');
    offset += Math.ceil(nameLength / 4) * 4; // Move offset, aligned to 4 bytes

    // Read the type of node to create
    const type = data.readUInt32BE(offset);
    offset += 4;

    // Default mode
    let mode = 0o644;
    let rdev: any = undefined;

    // Parse type-specific data
    if (type === 1) {
      // NF3CHR - character device
      offset += 4; // Skip setMode field
      mode = data.readUInt32BE(offset);
      offset += 4;

      // Skip other sattr3 fields we don't use
      offset += 36;

      // Read device info
      const specData = {
        major: data.readUInt32BE(offset),
        minor: data.readUInt32BE(offset + 4),
      };
      rdev = specData;
    } else if (type === 2) {
      // NF3BLK - block device
      offset += 4; // Skip setMode field
      mode = data.readUInt32BE(offset);
      offset += 4;

      // Skip other sattr3 fields we don't use
      offset += 36;

      // Read device info
      const specData = {
        major: data.readUInt32BE(offset),
        minor: data.readUInt32BE(offset + 4),
      };
      rdev = specData;
    } else if (type === 3) {
      // NF3SOCK - socket
      // Read mode from sattr3
      const setMode = data.readUInt32BE(offset);
      offset += 4;
      if (setMode === 1) {
        mode = data.readUInt32BE(offset);
      }
    } else if (type === 4) {
      // NF3FIFO - FIFO/named pipe
      // Read mode from sattr3
      const setMode = data.readUInt32BE(offset);
      offset += 4;
      if (setMode === 1) {
        mode = data.readUInt32BE(offset);
      }
    }

    console.log(
      `MKNOD request: parentHandle=${parentHandle.toString(
        'hex'
      )}, name=${name}, type=${type}, mode=${mode.toString(8)}`
    );

    let result: MknodResult;

    if (mknodHandler) {
      // Call the provided handler
      result = await mknodHandler(parentHandle, name, type, mode, rdev);
    } else {
      // Fallback implementation
      console.log('Using fallback MKNOD implementation');
      sendNfsError(socket, xid, nfsstat3.ERR_NOTSUPP);
      return;
    }

    if (result.status !== 0) {
      console.error('Error creating special file:', result);
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

    // Post-op file attributes
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
    socket.write(reply, err => {
      if (err) {
        console.error(`Error sending MKNOD reply: ${err}`);
      }
    });
    console.log('Sent MKNOD reply');
  } catch (err) {
    console.error('Error handling MKNOD request:', err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
