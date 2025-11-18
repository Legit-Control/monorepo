import {
  IFileHandle,
  IStats,
  TData,
  TFileHandleReadResult,
  TFileHandleReadvResult,
  TFileHandleWriteResult,
  TFileHandleWritevResult,
  TMode,
  TTime,
} from "memfs/lib/node/types/misc.js";
import {
  IAppendFileOptions,
  IReadableWebStreamOptions,
  IStatOptions,
} from "memfs/lib/node/types/options.js";
import { CompositeSubFs, FileHandleDelegate } from "./CompositeSubFs.js";

export interface ICompositFsFileHandle {
  subFsFileDescriptor: number;
  fsType: number;
  fd: number;
  appendFile(data: TData, options?: IAppendFileOptions | string): Promise<void>;
  chmod(mode: TMode): Promise<void>;
  chown(uid: number, gid: number): Promise<void>;
  close(): Promise<void>;
  datasync(): Promise<void>;
  readableWebStream(options?: IReadableWebStreamOptions): ReadableStream;
  read(
    buffer: Buffer | Uint8Array,
    offset: number,
    length: number,
    position: number,
  ): Promise<TFileHandleReadResult>;
  readv(
    buffers: ArrayBufferView[],
    position?: number | null,
  ): Promise<TFileHandleReadvResult>;
  // readFile(options?: IReadFileOptions | string): Promise<TDataOut>;
  stat(options?: IStatOptions): Promise<IStats>;
  truncate(len?: number): Promise<void>;
  utimes(atime: TTime, mtime: TTime): Promise<void>;
  write(
    buffer: Buffer | ArrayBufferView | DataView,
    offset?: number,
    length?: number,
    position?: number,
  ): Promise<TFileHandleWriteResult>;
  writev(
    buffers: ArrayBufferView[],
    position?: number | null,
  ): Promise<TFileHandleWritevResult>;
  // writeFile(data: TData, options?: IWriteFileOptions): Promise<void>;
  sync(): Promise<void>;
}

/**
 * While a filehandle in node env usually is an independent entity (from its fs) to keep fs operatons colocated per type (vritual, managed... files) we
 * wrap the filehandle in a SubFsFileHandle and forward all operations to there origin filesystem
 */
export default class CompositFsFileHandle implements ICompositFsFileHandle {
  private delegate: FileHandleDelegate;

  get fsType() {
    return this.delegate.fileType();
  }

  // private async _openFd(flags: any): Promise<IFileHandle> {
  //   const path = this._fs.resolvePath(this._fd);
  //   return (await this._fs.open(path, flags)) as unknown as IFileHandle;
  // }

  // the filedescriptor from the sub fs
  private _subFsFileDescriptor: number;


  get subFsFileDescriptor(): number {
    return this._subFsFileDescriptor;
  }

  handleType = "file";

  private _compositFsFileDescriptor: number = -1;
  get fd(): number {
    return this._compositFsFileDescriptor;
  }

  realize(compositeFd: number) {
    if (this._compositFsFileDescriptor !== -1) {
      throw new Error("was already realized");
    }
    this._compositFsFileDescriptor = compositeFd;
  }

  constructor(args: {
    fs: FileHandleDelegate;
    subFsFileDescriptor: number;
    parentFsFileDescriptors: number[];
  }) {
    this.delegate = args.fs;
    this._subFsFileDescriptor = args.subFsFileDescriptor;
    this._compositFsFileDescriptor = -1;

    let typeNumber = args.fs.fileType();

    // Write the fd in the last 4 bytes (offset 60)
    const fd = this._subFsFileDescriptor; // number // Big-endian, or use LE if you prefer
  }

  readableWebStream(options?: IReadableWebStreamOptions): ReadableStream {
    throw new Error("Method not implemented.");
  }

  async appendFile(
    data: TData,
    options?: IAppendFileOptions | string,
  ): Promise<void> {
    return await this.delegate.appendFile(this, data, options);
  }

  async chmod(mode: TMode): Promise<void> {
    return this.delegate.fchmod(this, mode);
  }

  async chown(uid: number, gid: number): Promise<void> {
    return this.delegate.fchown(this, uid, gid);
  }

  async close(): Promise<void> {
    return this.delegate.close(this);
  }

  async datasync(): Promise<void> {
    return this.delegate.dataSync(this);
  }

  async read(
    buffer: Buffer | Uint8Array,
    offset: number,
    length: number,
    position: number,
  ): Promise<TFileHandleReadResult> {
    return await this.delegate.read(this, buffer, offset, length, position);
  }

  readv(
    buffers: ArrayBufferView[],
    position?: number | null,
  ): Promise<TFileHandleReadvResult> {
    return this.delegate.readv(this, buffers, position);
  }
  // async readFile(options?: IReadFileOptions | string): Promise<TDataOut> {
  //   return this._fs.readFile(this, options);
  // }
  async stat(options?: IStatOptions): Promise<IStats> {
    return this.delegate.fstat(this, options);
  }
  async truncate(len?: number): Promise<void> {
    return this.delegate.ftruncate(this, len);
  }
  async utimes(atime: TTime, mtime: TTime): Promise<void> {
    return this.delegate.futimes(this, atime, mtime);
  }
  async write(
    buffer: Buffer | ArrayBufferView | DataView,
    offset?: number,
    length?: number,
    position?: number,
  ): Promise<TFileHandleWriteResult> {
    return this.delegate.write(this, buffer, offset, length, position);
  }
  async writev(
    buffers: ArrayBufferView[],
    position?: number | null,
  ): Promise<TFileHandleWritevResult> {
    return this.delegate.writev(this, buffers, position);
  }

  async sync(): Promise<void> {
    return this.delegate.dataSync(this);
  }
}
