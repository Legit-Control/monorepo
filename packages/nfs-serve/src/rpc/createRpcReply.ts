// Create a proper RPC reply
export function createRpcReply(xid: number, data: Buffer): Buffer {
  // RPC header
  const header = Buffer.alloc(8);

  // Write XID (transaction ID)
  header.writeUInt32BE(xid, 0);

  // Message type (1 = REPLY)
  header.writeUInt32BE(1, 4);

  // Combine header and data
  const rpcMessage = Buffer.concat([header, data]);

  // Add record marker for TCP (RFC 5531 section 11)
  // 4-byte length with MSB set to indicate last fragment
  const recordMarker = Buffer.alloc(4);

  // RFC 5531: The most significant bit (MSB) of the record mark is used to indicate the last record fragment
  // Length of message = rpcMessage.length (excluding the record marker itself)
  // We need to use >>> 0 to ensure correct unsigned 32-bit representation
  const fragmentFlag = 0x80000000; // MSB set to 1 for last/only fragment
  const length = rpcMessage.length;
  const recordMarkValue = (length | fragmentFlag) >>> 0;

  recordMarker.writeUInt32BE(recordMarkValue, 0);

  // // Debug log for record marker
  // // console.log(
  //   `Record marker: 0x${recordMarkValue.toString(16)}, length: ${length}, last fragment: true`,
  // );

  // Combine record marker and RPC message
  const result = Buffer.concat([recordMarker, rpcMessage]);
  // // console.log(
  //   `Reply size: ${result.length} bytes, XID: ${xid}, rpcMessage length: ${rpcMessage.length}`,
  // );

  // Log the first 32 bytes of the reply for debugging
  // if (result.length > 32) {
  //   // console.log(`Reply start: ${result.slice(0, 32).toString("hex")}`);
  // } else {
  //   // console.log(`Reply full: ${result.toString("hex")}`);
  // }

  return result;
}
