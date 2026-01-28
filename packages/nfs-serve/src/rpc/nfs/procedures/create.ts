import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';
import { readAttributes, SetAttrParams } from './util/readAttributes.js';
import { off } from 'process';

export type CreateResult =
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
      dirStats?: never;
    }
  | {
      status: number;
      handle: Buffer;
      stats: fs.Stats & { fileId: bigint };
      dirStats: fs.Stats & { fileId: bigint };
    };

export type CreateHandler = (
  parentHandle: Buffer,
  name: string,
  mode: number,
  attributesOrVerifier: SetAttrParams | Buffer
) => Promise<CreateResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.8
 *
 * Procedure CREATE creates a regular file. If the file already
 * exists, the server performs the create request either by
 * replacing the existing file or returning an error.
 *
 * The server creates the regular file in the directory specified
 * by the "where" argument and creates a new file handle for it.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param createHandler the handler to use for creating the file
 */
export async function create(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  createHandler: CreateHandler
): Promise<void> {
  try {
    // console.log('NFS CREATE procedure');

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

    // Read create mode (how)
    const createMode = data.readUInt32BE(offset);
    offset += 4;

    // Read file attributes or create verifier depending on mode
    let mode = 0o644; // Default mode for regular files

    let attributesOrVerifier: SetAttrParams | Buffer;

    if (createMode === 0) {
      // UNCHECKED
      // means that the file should be created without checking
      // for the existence of a duplicate file in the same
      // directory. In this case, how.obj_attributes is a sattr3
      // describing the initial attributes for the file.
      //
      // Read mode from sattr3

      const readAttr = readAttributes(data, offset);
      offset = readAttr.offset;
      attributesOrVerifier = readAttr.attrs;
    } else if (createMode === 1) {
      // GUARDED
      // checks if the file exists - if it does - fail - also ask get the attributes

      const readAttr = readAttributes(data, offset);
      offset = readAttr.offset;
      attributesOrVerifier = readAttr.attrs;
    } else if (createMode === 2) {
      // EXCLUSIVE
      // TODO read the verifier - this should be stored on the file to allow this call to be idempotent
      const verifier = data.slice(offset, offset + 8);
      offset += 8;
      attributesOrVerifier = verifier;
    } else {
      throw new Error('Invalid create mode');
    }

    // Call the handler to create the file
    const result = await createHandler(
      parentHandle,
      name,
      createMode,
      attributesOrVerifier
    );

    if (result.status !== 0) {
      console.error('Error creating file:', result);
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

    // Directory wcc data (pre-operation attributes)
    const wccDataBuf = Buffer.alloc(4);
    wccDataBuf.writeUInt32BE(0, 0); // no pre-op attributes

    // Directory post-operation attributes
    const dirPostOpAttrBuf = Buffer.alloc(4);
    dirPostOpAttrBuf.writeUInt32BE(1, 0); // attributes follow: yes

    // Directory attributes buffer
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
        console.error(`Error sending CREATE reply: ${err}`);
      }
    });
    // console.log('Sent CREATE reply');
  } catch (err) {
    console.error('Error handling CREATE request:', err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
