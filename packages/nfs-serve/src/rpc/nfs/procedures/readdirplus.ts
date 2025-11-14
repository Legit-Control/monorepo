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

export type DirEntryPlus = {
  name: string;
  handle: Buffer;
  stats: fs.Stats & { fileId: bigint };
};

export type ReaddirplusResult =
  | {
      status:
        | nfsstat3.ERR_IO
        | nfsstat3.ERR_ACCES
        | nfsstat3.ERR_NOTDIR
        | nfsstat3.ERR_BAD_COOKIE
        | nfsstat3.ERR_TOOSMALL
        | nfsstat3.ERR_STALE
        | nfsstat3.ERR_BADHANDLE
        | nfsstat3.ERR_SERVERFAULT;
      dirStats?: never;
      entries?: never;
      cookieVerifier?: never;
      eof?: never;
    }
  | {
      status: nfsstat3.OK;
      dirStats: fs.Stats & { fileId: bigint };
      entries: DirEntryPlus[];
      cookieVerifier: Buffer;
      eof: boolean;
    };

export type ReaddirplusHandler = (
  dirHandle: Buffer,
  cookie: bigint,
  cookieVerifier: Buffer,
  dirCount: number,
  maxCount: number,
) => Promise<ReaddirplusResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.17
 *
 * Procedure READDIRPLUS retrieves a variable number of entries
 * from a file system directory and returns complete information
 * about each along with information to allow the client to
 * request additional directory entries in a subsequent
 * READDIRPLUS. READDIRPLUS differs from READDIR only in the
 * amount of information returned for each entry. In
 * READDIR, each entry returns the filename and the fileid.
 * In READDIRPLUS, each entry returns the name, the fileid,
 * attributes (including the fileid), and file handle.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param readdirplusHandler the handler to use for reading directory entries
 */
export async function readdirplus(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  readdirplusHandler: ReaddirplusHandler,
): Promise<void> {
  try {
    const now = new Date();
    console.log(
      `[${now.toISOString()}] NFS READDIRPLUS procedure (XID: ${xid})`,
    );

    // Read the directory handle
    const handle = readHandle(data);

    // Parse the request parameters
    const handleLength = data.readUInt32BE(0);
    let offset = 4 + handleLength;

    // Get the cookie (starting point)
    const cookie = data.readBigUInt64BE(offset);
    offset += 8;

    // Cookie verifier (8 bytes)
    const cookieVerifier = data.subarray(offset, offset + 8);
    offset += 8;

    // dircount (limit on directory info)
    const dircount = data.readUInt32BE(offset);
    offset += 4;

    // maxcount (total response size limit)
    const maxcount = data.readUInt32BE(offset);
    offset += 4;

    console.log(
      `Cookie: ${cookie}, dircount: ${dircount}, maxcount: ${maxcount}`,
    );

    // Get directory entries from handler or use fallback
    let result = await readdirplusHandler(
      handle,
      cookie,
      cookieVerifier,
      dircount,
      maxcount,
    );

    if (result.status !== nfsstat3.OK) {
      console.error("Error reading directory plus:", result);
      sendNfsError(socket, xid, result.status);
      return;
    }

    // Create header components
    const headerBuf = createSuccessHeader();
    const statusBuf = Buffer.alloc(4);
    statusBuf.writeUInt32BE(0, 0); // NFS3_OK

    // Directory attributes
    const dirAttrFollowBuf = Buffer.alloc(4);
    dirAttrFollowBuf.writeUInt32BE(1, 0); // Attributes follow: yes
    const dirAttrBuf = getAttributeBuffer(result.dirStats);

    // Entry buffers
    const entryBuffers: any[] = [];

    // Limit the number of entries to process
    const entries = result.entries; // .slice(0, MAX_ENTRIES_PER_RESPONSE);

    // EOF flag - yes if we're returning all available entries
    // const eofFlag = entries.length < MAX_ENTRIES_PER_RESPONSE ? 1 : 0;

    let index = 0;
    // Process each entry
    for (const entry of entries) {
      // Entry follows (1 = yes)
      const entryMarkerBuf = Buffer.alloc(4);
      entryMarkerBuf.writeUInt32BE(1, 0);

      // FileID
      const fileIdBuf = Buffer.alloc(8);
      fileIdBuf.writeBigUInt64BE(entry.stats.fileId, 0);

      // Name with proper XDR padding
      const { length: nameLength, buffer: paddedNameBuf } =
        createPaddedXdrString(entry.name);

      // Set the actual length in the length buffer
      const nameLenBuf = Buffer.alloc(4);
      nameLenBuf.writeUInt32BE(nameLength, 0);

      // Cookie - calculate the next cookie value
      const nextCookie = BigInt(Number(cookie) + index + 1);
      const cookieBuf = Buffer.alloc(8);
      cookieBuf.writeBigUInt64BE(nextCookie, 0);

      // Attributes follow (1 = yes)
      const attrFollowBuf = Buffer.alloc(4);
      attrFollowBuf.writeUInt32BE(1, 0);

      // Attributes
      const attrBuf = getAttributeBuffer(entry.stats);

      // File handle follows (1 = yes)
      const handleFollowBuf = Buffer.alloc(4);
      handleFollowBuf.writeUInt32BE(1, 0);

      // File handle length and data
      const handleLenBuf = Buffer.alloc(4);
      handleLenBuf.writeUInt32BE(entry.handle.length, 0);

      // Combine all parts of this entry with proper XDR padding
      const entryBuf = Buffer.concat([
        entryMarkerBuf,
        fileIdBuf,
        nameLenBuf,
        paddedNameBuf, // Use the padded name buffer for XDR alignment
        cookieBuf,
        attrFollowBuf,
        attrBuf,
        handleFollowBuf,
        handleLenBuf,
        entry.handle,
      ]);

      entryBuffers.push(entryBuf);
      index += 1;
    }

    // End of entries marker (0 = no more entries)
    const endMarkerBuf = Buffer.alloc(4);
    endMarkerBuf.writeUInt32BE(0, 0);

    // EOF flag (1 = yes, 0 = no)
    const eofBuf = Buffer.alloc(4);
    eofBuf.writeUInt32BE(result.eof ? 1 : 0, 0);

    // Combine the full response
    const replyBuf = Buffer.concat([
      headerBuf,
      statusBuf,
      dirAttrFollowBuf,
      dirAttrBuf,
      result.cookieVerifier,
      ...entryBuffers,
      endMarkerBuf,
      eofBuf,
    ]);

    // Create the RPC reply
    const reply = createRpcReply(xid, replyBuf);

    // Send it
    socket.write(reply);

    console.log(
      `Sent READDIRPLUS reply with ${entryBuffers.length} entries, EOF=${
        result.eof ? "true" : "false"
      }`,
    );
  } catch (err) {
    console.error(`Error in READDIRPLUS: ${err}`);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}
