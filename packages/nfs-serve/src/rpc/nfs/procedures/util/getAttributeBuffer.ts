import fs from "fs";

export function getAttributeBuffer(stats: fs.Stats & { fileId: bigint }) {
  // Determine file type
  let fileType = 1; // NF3REG (regular file)
  if (stats.isDirectory()) {
    fileType = 2; // NF3DIR
  } else if (stats.isBlockDevice()) {
    fileType = 3; // NF3BLK
  } else if (stats.isCharacterDevice()) {
    fileType = 4; // NF3CHR
  } else if (stats.isSymbolicLink()) {
    fileType = 5; // NF3LNK
  } else if (stats.isSocket()) {
    fileType = 6; // NF3SOCK
  } else if (stats.isFIFO()) {
    fileType = 7; // NF3FIFO
  }

  // Create the NFS3FileAttrs structure (attributes)
  const attrBuf = Buffer.alloc(84);

  // File type
  attrBuf.writeUInt32BE(fileType, 0);

  // Mode
  attrBuf.writeUInt32BE(stats.mode & 0o777, 4);

  // Link count
  attrBuf.writeUInt32BE(stats.nlink, 8);

  // UID
  attrBuf.writeUInt32BE(stats.uid, 12);

  // GID
  attrBuf.writeUInt32BE(stats.gid, 16);

  // Size (hyper/uint64) - high 32 bits first, then low 32 bits
  if (typeof stats.size === "bigint") {
    attrBuf.writeUInt32BE(Number(stats.size >> 32n), 20);
    attrBuf.writeUInt32BE(Number(stats.size & 0xffffffffn), 24);
  } else {
    attrBuf.writeUInt32BE(Math.floor(stats.size / 0x100000000), 20);
    attrBuf.writeUInt32BE(stats.size % 0x100000000, 24);
  }

  // Used space (hyper/uint64) - high 32 bits first, then low 32 bits
  const used = stats.blocks * 512;
  if (used > 0xffffffff) {
    attrBuf.writeUInt32BE(Math.floor(used / 0x100000000), 28);
    attrBuf.writeUInt32BE(used % 0x100000000, 32);
  } else {
    attrBuf.writeUInt32BE(0, 28);
    attrBuf.writeUInt32BE(used, 32);
  }

  // Device (rdev) - specdata1 and specdata2
  attrBuf.writeUInt32BE(stats.dev >>> 8, 36);
  attrBuf.writeUInt32BE(stats.dev & 0xff, 40);

  // FSID (hyper/uint64) - just use a fixed value for now
  attrBuf.writeUInt32BE(0, 44);
  attrBuf.writeUInt32BE(1, 48);

  // File ID (inode) (hyper/uint64)
  if (typeof stats.fileId === "bigint") {
    attrBuf.writeUInt32BE(Number(stats.fileId >> 32n), 52);
    attrBuf.writeUInt32BE(Number(stats.fileId & 0xffffffffn), 56);
  } else {
    attrBuf.writeUInt32BE(0, 52);
    attrBuf.writeUInt32BE(stats.fileId, 56);
  }

  // Access time (TimeVal struct - seconds, nseconds)
  const atime = stats.atime;
  attrBuf.writeUInt32BE(Math.floor(atime.getTime() / 1000), 60);
  attrBuf.writeUInt32BE(atime.getMilliseconds() * 1000000, 64);

  // Modification time (TimeVal struct - seconds, nseconds)
  const mtime = stats.mtime;
  attrBuf.writeUInt32BE(Math.floor(mtime.getTime() / 1000), 68);
  attrBuf.writeUInt32BE(mtime.getMilliseconds() * 1000000, 72);

  // change time of the attributes (TimeVal struct - seconds, nseconds)
  const ctime = stats.ctime;
  attrBuf.writeUInt32BE(Math.floor(ctime.getTime() / 1000), 76);
  attrBuf.writeUInt32BE(ctime.getMilliseconds() * 1000000, 80);

  return attrBuf;
}
