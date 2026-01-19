// Simple type for NFS SETATTR attributes
export interface SetAttrParams {
  mode?: number; // File mode/permissions
  uid?: number; // User ID
  gid?: number; // Group ID
  size?: number; // File size
  atime?: Date; // Access time
  mtime?: Date; // Modification time
}

export function readAttributes(
  data: Buffer,
  offset: number
): { offset: number; attrs: SetAttrParams } {
  // Parse the sattr3 structure (new_attributes)
  const mode =
    data.readUInt32BE(offset) === 1 ? data.readUInt32BE(offset + 4) : undefined;
  if (mode !== undefined) {
    offset += 8;
  } else {
    offset += 4;
  }

  const uid =
    data.readUInt32BE(offset) === 1 ? data.readUInt32BE(offset + 4) : undefined;
  if (uid !== undefined) {
    offset += 8;
  } else {
    offset += 4;
  }

  const gid =
    data.readUInt32BE(offset) === 1 ? data.readUInt32BE(offset + 4) : undefined;
  if (gid !== undefined) {
    offset += 8;
  } else {
    offset += 4;
  }

  const size64 =
    data.readUInt32BE(offset) === 1
      ? data.readBigUInt64BE(offset + 4)
      : undefined;
  if (size64 !== undefined) {
    offset += 12;
  } else {
    offset += 4;
  }

  const size =
    size64 !== undefined
      ? (() => {
          if (size64 > 0x7fffffff) {
            throw new Error('File size exceeds maximum supported size (2GB)');
          }
          return Number(size64);
        })()
      : undefined;

  const atimeSeconds =
    data.readUInt32BE(offset) === 2 ? data.readUInt32BE(offset + 4) : undefined;
  const atimeNanos =
    data.readUInt32BE(offset) === 2
      ? data.readUInt32BE(offset + 4 + 4)
      : undefined;
  if (atimeSeconds !== undefined) {
    offset += 12;
  } else {
    offset += 4;
  }
  const atime =
    atimeSeconds !== undefined && atimeNanos !== undefined
      ? new Date(atimeSeconds * 1000 + atimeNanos / 1e6)
      : undefined;

  const mtimeSeconds =
    data.readUInt32BE(offset) === 2 ? data.readUInt32BE(offset + 4) : undefined;
  const mtimeNanos =
    data.readUInt32BE(offset) === 2
      ? data.readUInt32BE(offset + 4 + 4)
      : undefined;
  if (mtimeNanos !== undefined) {
    offset += 12;
  } else {
    offset += 4;
  }
  const mtime =
    mtimeSeconds !== undefined && mtimeNanos !== undefined
      ? new Date(mtimeSeconds * 1000 + mtimeNanos / 1e6)
      : undefined;

  const attrs: SetAttrParams = {
    mode: mode,
    uid: uid,
    gid: gid,
    size: size,
    atime,
    mtime,
  };

  return {
    offset,
    attrs,
  };
}
