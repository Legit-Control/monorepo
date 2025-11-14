import fs from "fs";

export function getWccAttributeBuffer(stats: fs.Stats) {
  // Create the NFS3FileAttrs structure (attributes)
  const attrBuf = Buffer.alloc(24);

  // Size (hyper/uint64) - high 32 bits first, then low 32 bits
  if (typeof stats.size === "bigint") {
    attrBuf.writeUInt32BE(Number(stats.size >> 32n), 0);
    attrBuf.writeUInt32BE(Number(stats.size & 0xffffffffn), 4);
  } else {
    attrBuf.writeUInt32BE(Math.floor(stats.size / 0x100000000), 0);
    attrBuf.writeUInt32BE(stats.size % 0x100000000, 4);
  }

  // Modification time (TimeVal struct - seconds, nseconds)
  const mtime = stats.mtime;
  attrBuf.writeUInt32BE(Math.floor(mtime.getTime() / 1000), 8);
  attrBuf.writeUInt32BE(mtime.getMilliseconds() * 1000000, 12);

  // change time of the attributes
  const ctime = stats.ctime;
  attrBuf.writeUInt32BE(Math.floor(ctime.getTime() / 1000), 16);
  attrBuf.writeUInt32BE(ctime.getMilliseconds() * 1000000, 20);

  return attrBuf;
}
