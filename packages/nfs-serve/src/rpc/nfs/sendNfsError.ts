import * as net from "net";
import * as fs from "fs";
import { createRpcReply } from "../createRpcReply.js";
import { createSuccessHeader } from "./procedures/util/createSuccessHeader.js";
import { getAttributeBuffer } from "./procedures/util/getAttributeBuffer.js";

// Send an NFS error response
export function sendNfsError(
  socket: net.Socket,
  xid: number,
  status: number,
  dirStats?: fs.Stats & { fileId: bigint },
): void {
  // Create a header for the NFS response
  const headerBuf = createSuccessHeader();

  // Status code
  const statusBuf = Buffer.alloc(4);
  statusBuf.writeUInt32BE(status, 0);

  let dirAttrsBuf;

  if (dirStats) {
    // Attrs follow flag (1 = yes)
    const attrFollowBuf = Buffer.alloc(4);
    attrFollowBuf.writeUInt32BE(1, 0);

    // Directory attributes
    const attrsBuf = getAttributeBuffer(dirStats);

    // Combine
    dirAttrsBuf = Buffer.concat([attrFollowBuf, attrsBuf]);
  } else {
    // No attributes - just set follow flag to 0
    dirAttrsBuf = Buffer.alloc(4);
    dirAttrsBuf.writeUInt32BE(0, 0);
  }

  // For most NFS3 operations, we need to include weak cache consistency data
  // This consists of pre-op attributes (0 = not included) and post-op attributes

  // Pre-op attributes follow flag (0 = no)
  const preOpAttrBuf = Buffer.alloc(4);
  preOpAttrBuf.writeUInt32BE(0, 0);

  // Combine WCC_DATA parts first for clarity
  const wccData = Buffer.concat([preOpAttrBuf, dirAttrsBuf]);

  // Combine all parts for the complete error response - we follow the NFSv3 spec order:
  // 1. status
  // 2. wcc_data for directory (consistently in this order)
  const replyBuf = Buffer.concat([headerBuf, statusBuf, wccData]);

  // Create the full RPC reply
  const reply = createRpcReply(xid, replyBuf);

  // Send the reply
  socket.write(reply);

  // Map status to readable error name
  const errorNames = {
    1: "NFS3ERR_PERM",
    2: "NFS3ERR_NOENT",
    5: "NFS3ERR_IO",
    6: "NFS3ERR_NXIO",
    11: "NFS3ERR_BADNAME",
    13: "NFS3ERR_ACCES",
    17: "NFS3ERR_EXIST",
    18: "NFS3ERR_XDEV",
    19: "NFS3ERR_NODEV",
    20: "NFS3ERR_NOTDIR",
    21: "NFS3ERR_ISDIR",
    22: "NFS3ERR_INVAL",
    27: "NFS3ERR_FBIG",
    28: "NFS3ERR_NOSPC",
    30: "NFS3ERR_ROFS",
    31: "NFS3ERR_MLINK",
    63: "NFS3ERR_NAMETOOLONG",
    66: "NFS3ERR_NOTEMPTY",
    69: "NFS3ERR_DQUOT",
    70: "NFS3ERR_STALE",
    71: "NFS3ERR_REMOTE",
    10001: "NFS3ERR_BADHANDLE",
    10002: "NFS3ERR_NOT_SYNC",
    10003: "NFS3ERR_BAD_COOKIE",
    10004: "NFS3ERR_NOTSUPP",
    10005: "NFS3ERR_TOOSMALL",
    10006: "NFS3ERR_SERVERFAULT",
    10007: "NFS3ERR_BADTYPE",
    10008: "NFS3ERR_JUKEBOX",
  };

  const errorName =
    errorNames[status as keyof typeof errorNames] || `UNKNOWN_ERROR(${status})`;
  console.log(`Sent NFS error reply: ${errorName} (${status})`);
  console.log(`Error reply size: ${reply.length} bytes`);
}
