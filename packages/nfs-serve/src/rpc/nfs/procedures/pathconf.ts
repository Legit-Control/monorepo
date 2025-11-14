import * as net from "net";
import * as fs from "fs";
import { createRpcReply } from "../../createRpcReply.js";
import { sendNfsError } from "../sendNfsError.js";
import { readHandle } from "./util/readHandle.js";
import { createSuccessHeader } from "./util/createSuccessHeader.js";
import { nfsstat3 } from "./errors.js";
import { getAttributeBuffer } from "./util/getAttributeBuffer.js";

export type PathconfResult =
  | {
      status:
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      stats?: never;
      linkMax?: never;
      nameMax?: never;
      noTrunc?: never;
      chownRestricted?: never;
      caseInsensitive?: never;
      casePreserving?: never;
    }
  | {
      status: nfsstat3.OK;
      stats: fs.Stats & { fileId: bigint };
      linkMax: number;
      nameMax: number;
      noTrunc: boolean;
      chownRestricted: boolean;
      caseInsensitive: boolean;
      casePreserving: boolean;
    };

export type PathconfHandler = (handle: Buffer) => Promise<PathconfResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.20
 *
 * Procedure PATHCONF retrieves the pathconf information for
 * a file or directory. If the file system object specified
 * does not have a corresponding pathconf, the information
 * returned is based on the defaults for that server.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param pathconfHandler the handler to use for retrieving pathconf information
 */
export async function pathconf(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  pathconfHandler?: PathconfHandler,
): Promise<void> {
  try {
    console.log("NFS PATHCONF procedure");

    // Read the file handle from the data
    const handle = readHandle(data);

    // Get pathconf information
    let result: PathconfResult;

    if (pathconfHandler) {
      // Use provided handler
      result = await pathconfHandler(handle);
    } else {
      // Fallback to default behavior - just return not supported
      console.log("Using fallback PATHCONF implementation");
      sendNfsError(socket, xid, nfsstat3.ERR_NOTSUPP);
      return;
    }

    if (result.status !== 0) {
      console.error("Error getting pathconf info:", result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create proper RPC accepted reply header
    const headerBuf = createSuccessHeader();

    // Status (0 = success)
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // Post-op attributes
    const postOpAttrBuf = Buffer.alloc(4);
    postOpAttrBuf.writeUInt32BE(1, 0); // attributes follow: yes

    // File attributes
    const attrBuf = getAttributeBuffer(result.stats);

    // linkmax - maximum number of hard links (4 bytes)
    const linkmaxBuf = Buffer.alloc(4);
    linkmaxBuf.writeUInt32BE(result.linkMax, 0);

    // name_max - maximum filename length (4 bytes)
    const nameMaxBuf = Buffer.alloc(4);
    nameMaxBuf.writeUInt32BE(result.nameMax, 0);

    // no_trunc - no_trunc flag (4 bytes) (1 = TRUE, 0 = FALSE)
    const noTruncBuf = Buffer.alloc(4);
    noTruncBuf.writeUInt32BE(result.noTrunc ? 1 : 0, 0);

    // chown_restricted - chown_restricted flag (4 bytes) (1 = TRUE, 0 = FALSE)
    const chownRestrictedBuf = Buffer.alloc(4);
    chownRestrictedBuf.writeUInt32BE(result.chownRestricted ? 1 : 0, 0);

    // case_insensitive - case_insensitive flag (4 bytes) (1 = TRUE, 0 = FALSE)
    const caseInsensitiveBuf = Buffer.alloc(4);
    caseInsensitiveBuf.writeUInt32BE(result.caseInsensitive ? 1 : 0, 0);

    // case_preserving - case_preserving flag (4 bytes) (1 = TRUE, 0 = FALSE)
    const casePreservingBuf = Buffer.alloc(4);
    casePreservingBuf.writeUInt32BE(result.casePreserving ? 1 : 0, 0);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      postOpAttrBuf,
      attrBuf,
      linkmaxBuf,
      nameMaxBuf,
      noTruncBuf,
      chownRestrictedBuf,
      caseInsensitiveBuf,
      casePreservingBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply);
    console.log("Sent PATHCONF reply");
  } catch (err) {
    console.error("Error handling PATHCONF request:", err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
