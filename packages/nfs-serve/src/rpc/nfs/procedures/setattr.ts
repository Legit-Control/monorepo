import * as net from 'net';

import fs from 'fs';
import { createRpcReply } from '../../createRpcReply.js';
import { sendNfsError } from '../sendNfsError.js';
import { readHandle } from './util/readHandle.js';
import { createSuccessHeader } from './util/createSuccessHeader.js';
import { nfsstat3 } from './errors.js';
import { getAttributeBuffer } from './util/getAttributeBuffer.js';
import { readAttributes, SetAttrParams } from './util/readAttributes.js';
import { off } from 'process';

export type SetAttrResult =
  | {
      status:
        | nfsstat3.ERR_PERM
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_INVAL
        | nfsstat3.ERR_NOSPC
        | nfsstat3.ERR_ROFS
        | nfsstat3.ERR_DQUOT
        | nfsstat3.ERR_NOT_SYNC
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      stats?: never;
    }
  | { status: nfsstat3.OK; stats: fs.Stats & { fileId: bigint } };

export type SetAttrHandler = (
  handle: Buffer,
  attributes: SetAttrParams,
  guardCtime?: Date
) => Promise<SetAttrResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.2
 *
 * Procedure SETATTR changes one or more of the attributes of a
 * file system object on the server. The new attributes are
 * specified by a sattr3 structure. On entry, the arguments in
 * SETATTR3args are:
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param setAttrHandler the handler to use for setting attributes
 */
export async function setattr(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  setAttrHandler: SetAttrHandler
): Promise<void> {
  try {
    console.log('NFS SETATTR procedure');

    // Read the file handle from the data
    const handle = readHandle(data);

    // Parse the attribute data from the request
    let offset = handle.length + 4;
    
    const { offset: newOffset, attrs } = readAttributes(data, offset);
    offset = newOffset;

    // Parse the sattrguard3 structure (guard)
    const guardCheck = data.readUInt32BE(offset);
    offset += 4;
    const guardCtime =
      guardCheck === 1
        ? new Date(
            data.readUInt32BE(offset) * 1000 +
              data.readUInt32BE(offset + 4) / 1e6
          )
        : undefined;
    offset += guardCheck === 1 ? 8 : 0;

    // Guard time is not implemented yet

    const result = await setAttrHandler(handle, attrs, guardCtime);

    if (result.status !== 0) {
      console.error('Error setting attributes:', result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // WCC data - we should implement this properly
    // For now just indicate attributes follow (1 = yes)
    const wccDataPreBuf = Buffer.alloc(4);
    wccDataPreBuf.writeUInt32BE(0, 0); // pre-operation attributes: no

    const wccDataPostBuf = Buffer.alloc(4);
    wccDataPostBuf.writeUInt32BE(1, 0); // post-operation attributes: yes

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      wccDataPreBuf,
      wccDataPostBuf,
      getAttributeBuffer(result.stats),
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply);
    console.log('Sent SETATTR reply');
  } catch (err) {
    console.error('Error handling SETATTR request:', err);
    sendNfsError(socket, xid, 10006); // NFS3ERR_SERVERFAULT
  }
}
