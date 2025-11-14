import * as net from "net";
import { createRpcReply } from "./createRpcReply.js";

// Send an RPC error response
export function sendRpcSuccess(
  socket: net.Socket,
  xid: number,
  body: Buffer,
): void {
  // Create an RPC reply with error
  const replyBuf = Buffer.alloc(16);

  // Reply status (0 = accepted, 1 = denied) -> accepted_reply
  replyBuf.writeUInt32BE(0, 0);

  // accepted_reply.opaque_auth - Verifier (AUTH_NONE)
  replyBuf.writeUInt32BE(0, 4);

  // accepted_reply.opaque_auth.body  - length 0
  replyBuf.writeUInt32BE(0, 8);

  //  accepted_reply.accept_stat Accept status (0 = success)
  replyBuf.writeUInt32BE(0, 12);

  // Reserved bytes (should be zero) - unclear? i guess this is opaque results[0];
  // replyBuf.writeUInt32BE(0, 16);
  // replyBuf.writeUInt32BE(0, 20);

  const fullReplyBuf = Buffer.concat([replyBuf, body]);

  // console.log("body: ", body, "length: ", body.length);
  // console.log("replyBuf: ", replyBuf, "length: ", replyBuf.length);
  // console.log("fullReplyBuf: ", fullReplyBuf, "length: ", fullReplyBuf.length);
  const reply = createRpcReply(xid, fullReplyBuf);

  // Send the reply
  socket.write(reply);
}
