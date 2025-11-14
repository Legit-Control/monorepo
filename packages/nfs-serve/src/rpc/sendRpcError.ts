import * as net from "net";
import { createRpcReply } from "./createRpcReply.js";

// Send an RPC error response
export function sendRpcError(
  socket: net.Socket,
  xid: number,
  replyStatus: number,
  acceptStatus: number,
): void {
  // Create an RPC reply with error
  const replyBuf = Buffer.alloc(24);

  // Message type = 1 (reply)
  replyBuf.writeUInt32BE(1, 0);

  // Reply status (0 = accepted, 1 = denied)
  replyBuf.writeUInt32BE(replyStatus, 4);

  if (replyStatus === 0) {
    // Verifier (AUTH_NONE)
    replyBuf.writeUInt32BE(0, 8);
    replyBuf.writeUInt32BE(0, 12);

    // Accept status
    replyBuf.writeUInt32BE(acceptStatus, 16);
  } else {
    // Reject status
    replyBuf.writeUInt32BE(0, 8);

    // Auth status
    replyBuf.writeUInt32BE(replyStatus, 12);
  }

  // Create the full RPC reply
  const reply = createRpcReply(xid, replyBuf);

  // Send the reply
  socket.write(reply);
}
