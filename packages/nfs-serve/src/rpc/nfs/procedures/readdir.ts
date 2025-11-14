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

// Maximum number of entries to return in a single response
// A conservative value to ensure we don't exceed buffer limits
const MAX_ENTRIES_PER_RESPONSE = 16;

export type DirEntry = {
  name: string;
  fileId: bigint;
};

export type ReaddirResult =
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
    }
  | {
      status: number;
      dirStats: fs.Stats & {fileId: bigint };
      entries: DirEntry[];
      cookieVerifier: Buffer;
    };

export type ReaddirHandler = (
  dirHandle: Buffer,
  cookie: bigint,
  cookieVerifier: Buffer,
  count: number,
) => Promise<ReaddirResult>;

/**
 * Source: https://datatracker.ietf.org/doc/html/rfc1813#section-3.3.16
 *
 * Procedure READDIR retrieves a variable number of entries, in
 * sequence, from a directory and returns the name and file
 * identifier for each, with information to allow the client to
 * request additional directory entries in a subsequent READDIR
 * request.
 *
 * @param xid the transaction ID
 * @param socket the socket to send the response to
 * @param data the data received from the client
 * @param readdirHandler the handler to use for reading directory entries
 */
export async function readdir(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  readdirHandler?: ReaddirHandler,
): Promise<void> {
  try {
    const now = new Date();
    console.log(`[${now.toISOString()}] NFS READDIR procedure (XID: ${xid})`);

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

    // count (max bytes to return)
    const count = data.readUInt32BE(offset);
    offset += 4;

    console.log(`Cookie: ${cookie}, count: ${count}`);

    // Get directory entries from handler or use fallback
    let result: ReaddirResult;

    if (readdirHandler) {
      // Use provided handler
      result = await readdirHandler(handle, cookie, cookieVerifier, count);
    } else {
      // Fallback to default behavior
      console.log("Using fallback READDIR implementation");
      sendNfsError(socket, xid, nfsstat3.ERR_NOTSUPP);
      return;
    }

    if (result.status !== 0) {
      console.error("Error reading directory:", result);
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
    const entries = result.entries.slice(0, MAX_ENTRIES_PER_RESPONSE);

    // EOF flag - yes if we're returning all available entries
    const eofFlag = entries.length < MAX_ENTRIES_PER_RESPONSE ? 1 : 0;

    let index = 0;
    // Process each entry
    for (const entry of entries) {
      // Entry follows (1 = yes)
      const entryMarkerBuf = Buffer.alloc(4);
      entryMarkerBuf.writeUInt32BE(1, 0);

      // FileID
      const fileIdBuf = Buffer.alloc(8);
      fileIdBuf.writeBigUInt64BE(entry.fileId, 0);

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

      // Combine all parts of this entry with proper XDR padding
      const entryBuf = Buffer.concat([
        entryMarkerBuf,
        fileIdBuf,
        nameLenBuf,
        paddedNameBuf, // Use the padded name buffer for XDR alignment
        cookieBuf,
      ]);

      entryBuffers.push(entryBuf);
      index += 1;
    }

    // End of entries marker (0 = no more entries)
    const endMarkerBuf = Buffer.alloc(4);
    endMarkerBuf.writeUInt32BE(0, 0);

    // EOF flag (1 = yes, 0 = no)
    const eofBuf = Buffer.alloc(4);
    eofBuf.writeUInt32BE(eofFlag, 0);

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
      `Sent READDIR reply with ${entryBuffers.length} entries, EOF=${
        eofFlag ? "true" : "false"
      }`,
    );
  } catch (err) {
    console.error(`Error in READDIR: ${err}`);
    sendNfsError(socket, xid, nfsstat3.ERR_SERVERFAULT);
  }
}

// Simple string hash function (utility for implementations that need to generate file IDs)
export function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
