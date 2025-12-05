export default class CompositFsFolderHandle {
  handleType = "folder";

  private _compositFsFileDescriptor: Buffer;
  get compositFsFileDescriptor(): Buffer {
    return this._compositFsFileDescriptor;
  }

  private _fsType: number;

  get fsType() {
    return this._fsType;
  }

  constructor(folderId: number, fsType: number) {
    this._compositFsFileDescriptor = Buffer.alloc(64);
    this._fsType = fsType;

    this.compositFsFileDescriptor.writeUInt8(fsType, 0); // 1st byte is the type

    const fd = folderId; // number
    this.compositFsFileDescriptor.writeUInt32BE(fd, 60); // Big-endian, or use LE if you prefer
  }
}
