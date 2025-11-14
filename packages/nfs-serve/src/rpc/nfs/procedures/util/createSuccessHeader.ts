export const createSuccessHeader = () => {
  const headerBuf = Buffer.alloc(16);
  // Reply status (0 = accepted)
  headerBuf.writeUInt32BE(0, 0);
  // Verifier (AUTH_NONE)
  headerBuf.writeUInt32BE(0, 4);
  headerBuf.writeUInt32BE(0, 8);
  // Accept status (0 = success)
  headerBuf.writeUInt32BE(0, 12);
  return headerBuf;
};

/**
 * Create a properly padded buffer for XDR string encoding
 * XDR requires strings to be padded to 4-byte boundaries
 * @param str The string to encode and pad
 * @returns A buffer containing the string with proper XDR padding
 */
export function createPaddedXdrString(str: string | Buffer): { 
  length: number;  // The actual string length
  buffer: Buffer;  // The padded buffer with 4-byte alignment
} {
  const buf = Buffer.isBuffer(str) ? str : Buffer.from(str);
  const length = buf.length;
  
  // XDR requires 4-byte alignment for strings
  const paddedLength = Math.ceil(length / 4) * 4;
  
  // Create a new buffer with padding
  const paddedBuf = Buffer.alloc(paddedLength);
  buf.copy(paddedBuf);  // Copy original content, rest is zero-filled
  
  return {
    length,
    buffer: paddedBuf
  };
}

/**
 * Create a properly padded buffer for XDR opaque data encoding
 * XDR requires opaque data to be padded to 4-byte boundaries
 * @param data The data buffer to pad
 * @returns A padded buffer with proper 4-byte alignment
 */
export function createPaddedXdrData(data: Buffer): {
  length: number;   // Original data length
  buffer: Buffer;   // Padded buffer
} {
  const length = data.length;
  
  // XDR requires 4-byte alignment for opaque data
  const paddedLength = Math.ceil(length / 4) * 4;
  
  if (paddedLength === length) {
    // No padding needed
    return { length, buffer: data };
  }
  
  // Create a new buffer with padding
  const paddedBuf = Buffer.alloc(paddedLength);
  data.copy(paddedBuf);  // Copy original data, rest is zero-filled
  
  return {
    length,
    buffer: paddedBuf
  };
}
