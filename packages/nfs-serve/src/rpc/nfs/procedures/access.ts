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
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.4
 *
 * Procedure ACCESS determines the access rights that a user,
 * as identified by the credentials in the request, has with
 * respect to a file system object. The client encodes the
 * set of permissions that are to be checked in a bit mask.
 * The server checks the permissions encoded in the bit mask.
 * A status of NFS3_OK is returned along with a bit mask
 * encoded with the permissions that the client is allowed.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param accessHandler the handler to use for checking access
 */
export async function access(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  accessHandler: AccessHandler,
): Promise<void> {
  try {
    console.log("NFS ACCESS procedure");

    // Read the file handle from the data
    const handle = readHandle(data);

    // Parse requested access mask
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Read access mask (4 bytes)
    const requestedAccess = data.readUInt32BE(offset);
    console.log(
      `ACCESS request: handle=${handle.toString(
        "hex",
      )}, requestedAccess=${requestedAccess}`,
    );

    const result = await accessHandler(handle, requestedAccess);

    if (result.status !== 0) {
      console.error("Error checking access:", result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // Post-op attributes (we're skipping for simplicity)
    const postOpAttrBuf = Buffer.alloc(4);
    postOpAttrBuf.writeUInt32BE(1, 0); // attributes follow: no

    const postOpAttr = getAttributeBuffer(result.statsAfter);

    // Access rights granted
    const accessRightsBuf = Buffer.alloc(4);
    accessRightsBuf.writeUInt32BE(result.access, 0);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      postOpAttrBuf,
      postOpAttr,
      accessRightsBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
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
