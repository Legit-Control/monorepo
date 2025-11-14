import * as net from 'net';
import * as fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';

export enum LinkResultErr {
  ERR_IO = nfsstat3.ERR_IO,
  ERR_ACCES = nfsstat3.ERR_ACCES,
  ERR_EXIST = nfsstat3.ERR_EXIST,
  ERR_XDEV = nfsstat3.ERR_XDEV,
  ERR_NOTDIR = nfsstat3.ERR_NOTDIR,
  ERR_INVAL = nfsstat3.ERR_INVAL,
  ERR_NOSPC = nfsstat3.ERR_NOSPC,
  ERR_ROFS = nfsstat3.ERR_ROFS,
  ERR_MLINK = nfsstat3.ERR_MLINK,
  ERR_NAMETOOLONG = nfsstat3.ERR_NAMETOOLONG,
  ERR_DQUOT = nfsstat3.ERR_DQUOT,
  ERR_STALE = nfsstat3.ERR_STALE,
  ERR_BADHANDLE = nfsstat3.ERR_BADHANDLE,
  ERR_NOTSUPP = nfsstat3.ERR_NOTSUPP,
  ERR_SERVERFAULT = nfsstat3.ERR_SERVERFAULT,
}

export type LinkResult =
  | {
      status: LinkResultErr;
      fileStats?: never;
      dirStats?: never;
    }
  | {
      status: number;
      fileStats: fs.Stats & { fileId: bigint };
      dirStats: fs.Stats & { fileId: bigint };
    };

export type LinkHandler = (
  fileHandle: Buffer,
  dirHandle: Buffer,
  name: string
) => Promise<LinkResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.15
 *
 * Procedure LINK creates a hard link from one file to another.
 * The link procedure creates a hard link from file to the name,
 * which is a component in the directory dir. The file handle for
 * the link is returned by the server in the response. On
 * entry, the arguments in LINK are:
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param linkHandler the handler to use for creating a hard link
 */
export async function link(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  linkHandler: LinkHandler
): Promise<void> {
  try {
    console.log('NFS LINK procedure');

    // Read the file handle from the data
    const fileHandle = readHandle(data);

    // Get handle length to calculate offset
    const fileHandleLength = data.readUInt32BE(0);
    let offset = 4 + fileHandleLength;

    // Read the target directory handle
    const dirHandleLength = data.readUInt32BE(offset);
    offset += 4;
    const dirHandle = data.slice(offset, offset + dirHandleLength);
    offset += dirHandleLength;

    // Read the target name
    const nameLength = data.readUInt32BE(offset);
    offset += 4;
    const name = data
      .toString('utf8', offset, offset + nameLength)
      .normalize('NFC');

    console.log(
      `LINK request: fileHandle=${fileHandle.toString(
        'hex'
      )}, dirHandle=${dirHandle.toString('hex')}, name=${name}`
    );

    const result = await linkHandler(fileHandle, dirHandle, name);

    if (result.status !== 0) {
      console.error('Error creating hard link:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // File attributes
    const filePostOpAttrBuf = Buffer.alloc(4);
    filePostOpAttrBuf.writeUInt32BE(1, 0); // attributes follow: yes

    // File attributes buffer
    const fileAttrBuf = getAttributeBuffer(result.fileStats!);

    // Directory wcc data (pre-operation attributes)
    const dirWccDataBuf = Buffer.alloc(4);
    dirWccDataBuf.writeUInt32BE(0, 0); // no pre-op attributes

    // Directory post-operation attributes
    const dirPostOpAttrBuf = Buffer.alloc(4);
    dirPostOpAttrBuf.writeUInt32BE(1, 0); // attributes follow: yes

    // Directory attributes buffer
    const dirAttrBuf = getAttributeBuffer(result.dirStats!);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      filePostOpAttrBuf,
      fileAttrBuf,
      dirWccDataBuf,
      dirPostOpAttrBuf,
      dirAttrBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply, err => {
      if (err) {
        console.error(`Error sending LINK reply: ${err}`);
      }
    });
    console.log('Sent LINK reply');
  } catch (err) {
    console.error('Error handling LINK request:', err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
