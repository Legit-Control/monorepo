import * as net from "net";
import * as fs from "fs";
import { createRpcReply } from "../../createRpcReply.js";
import { sendNfsError } from "../sendNfsError.js";
import { readHandle } from "./util/readHandle.js";
import { createSuccessHeader } from "./util/createSuccessHeader.js";
import { nfsstat3 } from "./errors.js";
import { getAttributeBuffer } from "./util/getAttributeBuffer.js";

// Access constants as defined in RFC 1813
export enum AccessMode {
  READ = 0x01, // Read data from file or read a directory
  LOOKUP = 0x02, // Look up a name in a directory (only for directories)
  MODIFY = 0x04, // Rewrite existing file data or modify directory entries
  EXTEND = 0x08, // Write new data or add directory entries
  DELETE = 0x10, // Delete an existing directory entry
  EXECUTE = 0x20, // Execute file (only for regular files) or search directory
}

export type AccessResult =
  | { status: nfsstat3.OK; access: number; statsAfter: fs.Stats & {fileId: bigint } }
  | {
      status:
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      access?: never;
      statsAfter?: never;
    };

export type AccessHandler = (
  handle: Buffer,
  requestedAccess: number,
) => Promise<AccessResult>;

/**
 * NFS ACCESS Procedure (RFC 1813 Section 3.3.4)
 *
 * This function implements the complete ACCESS procedure following the
 * Self-Contained Procedure Pattern:
 *
 * PHASE 1: DECODE - Extract parameters from XDR-encoded buffer
 * PHASE 2: EXECUTE - Call business logic handler
 * PHASE 3: RESPOND - Encode result and write to socket
 *
 * RFC 1813 Specification:
 * "Procedure ACCESS determines the access rights that a user, as identified
 * by the credentials in the request, has with respect to a file system object.
 * The client encodes the set of permissions that are to be checked in a bit mask.
 * The server checks the permissions encoded in the bit mask. A status of NFS3_OK
 * is returned along with a bit mask encoded with the permissions that the client
 * is allowed."
 *
 * Buffer Layout (RFC 1813 Section 3.3.4):
 *   [handle_length (4 bytes)] [handle (variable)] [access (4 bytes)]
 *
 * Response Layout:
 *   [status (4 bytes)] [post_op_attr] [access (4 bytes)]
 *
 * @param xid - RPC transaction ID for response matching
 * @param socket - TCP socket to send response to
 * @param data - XDR-encoded request buffer
 * @param accessHandler - Business logic handler (injected from createAsyncNfsHandler.ts)
 *
 * @see https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.4
 */
export async function access(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  accessHandler: AccessHandler,
): Promise<void> {
  try {
    // ========== PHASE 1: DECODE ==========
    // Extract parameters from XDR-encoded request buffer

    // Read the file handle (variable-length field with length prefix)
    const handle = readHandle(data);

    // Parse requested access mask (fixed-length field after handle)
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;
    const requestedAccess = data.readUInt32BE(offset);

    // ========== PHASE 2: EXECUTE ==========
    // Call business logic handler with extracted parameters
    // Handler performs actual filesystem access check
    const result = await accessHandler(handle, requestedAccess);

    // ========== PHASE 3: RESPOND ==========
    // Encode result into XDR format and send response

    // Check for error status
    if (result.status !== 0) {
      console.error("Error checking access:", result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Pack response into XDR format (RFC 1813 Section 3.3.4)
    const headerBuf = createSuccessHeader();              // RPC accepted reply header

    // Status (0 = NFS3_OK)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0);

    // Post-operation attributes
    const postOpAttrBuf = Buffer.alloc(4);
    postOpAttrBuf.writeUInt32BE(1, 0);  // attributes follow: yes
    const postOpAttr = getAttributeBuffer(result.statsAfter);

    // Access rights granted (bit mask)
    const accessRightsBuf = Buffer.alloc(4);
    accessRightsBuf.writeUInt32BE(result.access, 0);

    // Combine all response parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      postOpAttrBuf,
      postOpAttr,
      accessRightsBuf,
    ]);

    // Wrap in RPC reply message with XID
    const reply = createRpcReply(xid, replyBuf);

    // Send response to client
    socket.write(reply, (err) => {
      if (err) {
        console.error(`Error sending ACCESS reply: ${err}`);
      }
    });
  } catch (err) {
    console.error("Error handling ACCESS request:", err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
