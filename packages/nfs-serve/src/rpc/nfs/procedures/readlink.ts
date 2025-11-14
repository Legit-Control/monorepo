import * as net from "net";
import * as fs from "fs";
import { createRpcReply } from "../../createRpcReply.js";
import { sendNfsError } from "../sendNfsError.js";
import { readHandle } from "./util/readHandle.js";
import {
  createPaddedXdrString,
  createSuccessHeader,
} from "./util/createSuccessHeader.js";
import { nfsstat3 } from "./errors.js";
import { getAttributeBuffer } from "./util/getAttributeBuffer.js";

export type ReadlinkResult =
  | {
      status:
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_INVAL
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_NOTSUPP
        | nfsstat3.ERR_SERVERFAULT;
      path?: never;
      stats?: never;
    }
  | { status: 0; path: string; stats: fs.Stats & {fileId: bigint } };

export type ReadlinkHandler = (handle: Buffer) => Promise<ReadlinkResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.7
 *
 * Procedure READLINK reads the data associated with a symbolic
 * link. The data is an ASCII string that is opaque to the
 * server. That is, whether created by the NFS version 3
 * protocol software from a client or created locally on the
 * server, the data in a symbolic link is not interpreted
 * when it is created, but is simply stored.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param readlinkHandler the handler to use for reading the symbolic link
 */
export async function readlink(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  readlinkHandler: ReadlinkHandler,
): Promise<void> {
  try {
    console.log("NFS READLINK procedure");

    // Read the file handle from the data
    const handle = readHandle(data);
    console.log(`READLINK request: handle=${handle.toString("hex")}`);

    const result = await readlinkHandler(handle);

    if (result.status !== 0) {
      console.error("Error reading symbolic link:", result);
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

    // Attributes buffer
    const attrBuf = getAttributeBuffer(result.stats);

    // Symlink data
    const { length, buffer: pathBuf } = createPaddedXdrString(result.path);
    const pathLenBuf = Buffer.alloc(4);
    pathLenBuf.writeUInt32BE(length, 0);

    // Combine all parts
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      postOpAttrBuf,
      attrBuf,
      pathLenBuf,
      pathBuf,
    ]);

    // Create the full RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send the reply
    socket.write(reply, (err) => {
      if (err) {
        console.error(`Error sending READLINK reply: ${err}`);
      }
    });
    console.log("Sent READLINK reply");
  } catch (err) {
    console.error("Error handling READLINK request:", err);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
