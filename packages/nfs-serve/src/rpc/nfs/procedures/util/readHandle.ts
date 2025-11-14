export const rootHandle = Buffer.alloc(64).fill(0);

export const readHandle = (data: Buffer): Buffer => {
  // Extract handle length
  const handleLength = data.readUInt32BE(0);

  // This is a workaround for the macOS NFS client
  if (handleLength === 0 || data.length < 4 + handleLength) {
    return rootHandle;
  } else {
    // // Normal handle processing
    // if (handleLength > 64) {
    //   // Using 64 as max length from NFS3FileHandle definition
    //   console.error("Handle too long");
    //   sendNfsError(socket, xid, 22); // NFS3ERR_INVAL
    //   return;
    // }

    // Extract the handle
    return data.slice(4, 4 + handleLength);
  }
};
