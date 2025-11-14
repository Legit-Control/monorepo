import * as net from "net";
import * as fs from "fs";
import { createRpcReply } from "../../createRpcReply.js";
import { sendNfsError } from "../sendNfsError.js";
import { readHandle } from "./util/readHandle.js";
import { createSuccessHeader } from "./util/createSuccessHeader.js";
import { nfsstat3 } from "./errors.js";
import { getAttributeBuffer } from "./util/getAttributeBuffer.js";

export type LookupResult =
  | {
      status:
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_NOENT
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_NOTDIR
        | nfsstat3.ERR_NAMETOOLONG
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;

      fileHandle?: never;
      fileStats?: never;
      dirStats?: fs.Stats & {fileId: bigint };
    }
  | {
      status: nfsstat3.OK;
      fileHandle: Buffer;
      fileStats: fs.Stats & {fileId: bigint };
      dirStats: fs.Stats & {fileId: bigint };
    };

export type LookupHandler = (
  dirHandle: Buffer,
  name: string,
) => Promise<LookupResult>;

/**
 * Implements the NFS3 LOOKUP procedure
 * RFC 1813 section 3.3.3
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param lookupHandler the handler to use for looking up files
 */
export async function lookup(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  lookupHandler: LookupHandler,
): Promise<void> {
  try {
    console.log("NFS LOOKUP procedure");

    // Read the directory handle
    const dirHandle = readHandle(data);

    // Parse the request parameters
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Get the filename from the request
    const nameLength = data.readUInt32BE(offset);
    offset += 4;

    if (nameLength > 255) {
      console.error("Name too long");
      sendNfsError(socket, xid, 63); // NFS3ERR_NAMETOOLONG
      return;
    }

    const name = data.toString("utf8", offset, offset + nameLength).normalize('NFC');
    console.log(`Looking up name: ${name}`);

    const result = await lookupHandler(dirHandle, name);

    if (result.status !== 0) {
      // console.error(`Lookup error for ${name}:`, result);
      sendNfsError(socket, xid, result.status, result.dirStats);
      return;
    }

    // Create the response
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // According to RFC 1813, the LOOKUP3res structure is:
    // 1. status
    // 2. if status = NFS3_OK:
    //    a. object (file handle with post_op_fh3 structure)
    //    b. obj_attributes (post_op_attr for the object)
    //    c. dir_attributes (post_op_attr for the directory)

    // Then the handle length
    const handleLenBuf = Buffer.alloc(4);
    handleLenBuf.writeUInt32BE(result.fileHandle.length, 0);

    // Now handle the file's attributes (post_op_attr)
    // Flag indicating attributes follow (1 = yes)
    const objAttrFollowBuf = Buffer.alloc(4);
    objAttrFollowBuf.writeUInt32BE(1, 0);

    // The attributes themselves
    const objAttrBuf = getAttributeBuffer(result.fileStats);

    // Finally, handle the directory's attributes (post_op_attr)
    let dirAttrsBuf;

    if (result.dirStats) {
      // Directory attributes follow flag (1 = yes)
      const dirAttrFollowBuf = Buffer.alloc(4);
      dirAttrFollowBuf.writeUInt32BE(1, 0);

      // Directory attributes
      const attrsBuf = getAttributeBuffer(result.dirStats);

      dirAttrsBuf = Buffer.concat([dirAttrFollowBuf, attrsBuf]);
    } else {
      // No attributes - just set follow flag to 0
      dirAttrsBuf = Buffer.alloc(4);
      dirAttrsBuf.writeUInt32BE(0, 0);
    }

    // Combine all parts in the correct order per the NFS3 spec
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      // Object handle structure (post_op_fh3)
      handleLenBuf,
      result.fileHandle,
      // Object attributes (post_op_attr)
      objAttrFollowBuf,
      objAttrBuf,
      // Directory attributes (post_op_attr)
      dirAttrsBuf,
    ]);

    // Create and send the RPC reply
    const reply = createRpcReply(xid, replyBuf);
    console.log(`Lookup reply size: ${reply.length} bytes`);

    // Ensure proper flushing of data by using callback
    socket.write(reply, (err) => {
      if (err) {
        console.error(`Error sending LOOKUP reply: ${err}`);
      } else {
        console.log(
          `LOOKUP reply successfully flushed for ${name} xid: ${xid}`,
        );
      }
    });

    console.log(
      `Sent LOOKUP reply for ${name} (${result.fileHandle.toString("hex")})`,
    );
  } catch (err) {
    console.error(`Error in LOOKUP: ${err}`);
    sendNfsError(socket, xid, 10006); // NFS3ERR_SERVERFAULT
  }
}
