import {
  IDir,
  IStats,
  TFileHandleReadResult,
  TFileHandleReadvResult,
  TFileHandleWriteResult,
  TFileHandleWritevResult,
  TMode,
  TTime,
} from 'memfs/lib/node/types/misc.js';
import {
  IStatOptions,
  IAppendFileOptions,
} from 'memfs/lib/node/types/options.js';
import type {
  PathLike,
  TDataOut,
  TData,
  IReadFileOptions,
  IWriteFileOptions,
  IFileHandle,
} from '../../types/fs-types.js';
import * as nodeFs from 'node:fs';
import CompositFsFileHandle from '../CompositeFsFileHandle.js';
import { CompositeSubFs, CompositeSubFsDir } from '../CompositeSubFs.js';
import { CompositeFs } from '../CompositeFs.js';

export abstract class BaseCompositeSubFs implements CompositeSubFs {
  protected toStr(p: any): string {
    if (typeof p === 'string') return p;
    if (Buffer.isBuffer(p)) return p.toString();
    if (p && typeof p === 'object' && 'fd' in p)
      return `FileHandle(fd=${p.fd})`;
    return String(p);
  }

  protected compositFs: CompositeFs;

  name: string;

  constructor({ name, parentFs }: { name: string; parentFs: CompositeFs }) {
    this.name = name;
    this.compositFs = parentFs;
  }

  abstract responsible(filePath: string): Promise<boolean>;
  abstract fileType(): number;

  async open(
    path: PathLike,
    flags: string,
    mode?: number
  ): Promise<CompositFsFileHandle> {
    throw new Error(`open not implemented for: ${this.toStr(path)}`);
  }

  async access(path: PathLike, mode?: number): Promise<void> {
    throw new Error(`access not implemented for: ${this.toStr(path)}`);
  }

  stat(path: PathLike, opts?: { bigint?: false }): Promise<nodeFs.Stats>;
  stat(path: PathLike, opts: { bigint: true }): Promise<nodeFs.BigIntStats>;
  stat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;

  async stat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats> {
    throw new Error(`lstat not implemented for: ${this.toStr(path)}`);
  }

  lstat(path: PathLike, opts?: { bigint?: false }): Promise<nodeFs.Stats>;
  lstat(path: PathLike, opts: { bigint: true }): Promise<nodeFs.BigIntStats>;
  lstat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;

  async lstat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats> {
    throw new Error(`lstat not implemented for: ${this.toStr(path)}`);
  }

  async opendir(
    path: PathLike,
    options?: nodeFs.OpenDirOptions
  ): Promise<CompositeSubFsDir> {
    throw new Error(`opendir not implemented for: ${this.toStr(path)}`);
  }

  async link(existingPath: PathLike, newPath: PathLike): Promise<void> {
    throw new Error(`link not implemented for: ${this.toStr(existingPath)}`);
  }

  async mkdir(
    path: PathLike,
    options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null
  ): Promise<void> {
    throw new Error(`mkdir not implemented for: ${this.toStr(path)}`);
  }

  readdir(
    path: PathLike,
    options?:
      | (nodeFs.ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        })
      | BufferEncoding
      | null
  ): Promise<string[]>;

  readdir(
    path: PathLike,
    options?:
      | {
          encoding: 'buffer';
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | 'buffer'
      | null
  ): Promise<Buffer[]>;

  readdir(
    path: PathLike,
    options?:
      | (nodeFs.ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        })
      | BufferEncoding
      | null
  ): Promise<string[] | Buffer[]>;

  readdir(
    path: PathLike,
    options: nodeFs.ObjectEncodingOptions & {
      withFileTypes: true;
      recursive?: boolean | undefined;
    }
  ): Promise<nodeFs.Dirent[]>;

  async readdir(
    path: PathLike,
    options?:
      | {
          encoding: 'buffer';
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | (nodeFs.ObjectEncodingOptions & {
          withFileTypes?: boolean;
          recursive?: boolean;
        })
      | BufferEncoding
      | 'buffer'
      | null
  ): Promise<string[] | Buffer[] | nodeFs.Dirent[]> {
    throw new Error(`readdir not implemented for: ${this.toStr(path)}`);
  }

  async readlink(path: PathLike, ...args: any[]): Promise<any> {
    throw new Error(`readlink not implemented for: ${this.toStr(path)}`);
  }

  async unlink(path: PathLike): Promise<void> {
    throw new Error(`unlink not implemented for: ${this.toStr(path)}`);
  }

  async rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
    throw new Error(`rename not implemented for: ${this.toStr(oldPath)}`);
  }

  async rmdir(path: PathLike, ...args: any[]): Promise<void> {
    throw new Error(`rmdir not implemented for: ${this.toStr(path)}`);
  }

  async symlink(
    target: PathLike,
    path: PathLike,
    type?: string | null
  ): Promise<void> {
    throw new Error(`symlink not implemented for: ${this.toStr(path)}`);
  }

  async lookup(filePath: string): Promise<number> {
    throw new Error(`lookup not implemented for: ${this.toStr(filePath)}`);
  }

  resolvePath(fd: number): string {
    throw new Error(`resolvePath not implemented for fd: ${fd}`);
  }

  async close(fh: CompositFsFileHandle): Promise<void> {
    this.compositFs.close(fh);
  }

  async dataSync(fh: CompositFsFileHandle): Promise<void> {
    throw new Error(`dataSync not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async read(
    fh: CompositFsFileHandle,
    buffer: Buffer | Uint8Array,
    offset: number,
    length: number,
    position: number
  ): Promise<TFileHandleReadResult> {
    throw new Error(`read not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async appendFile(
    fh: CompositFsFileHandle,
    data: TData,
    options?: IAppendFileOptions | string
  ): Promise<void> {
    throw new Error(
      `appendFile not implemented for: ${fh.subFsFileDescriptor}`
    );
  }

  async fchmod(fh: CompositFsFileHandle, mode: TMode): Promise<void> {
    throw new Error(`fchmod not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async fchown(
    fh: CompositFsFileHandle,
    uid: number,
    gid: number
  ): Promise<void> {
    throw new Error(`fchown not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async ftruncate(fh: CompositFsFileHandle, len?: number): Promise<void> {
    throw new Error(`ftruncate not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async fstat(
    fh: CompositFsFileHandle,
    options?: IStatOptions
  ): Promise<IStats> {
    throw new Error(`fstat not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async futimes(
    fh: CompositFsFileHandle,
    atime: TTime,
    mtime: TTime
  ): Promise<void> {
    throw new Error(`futimes not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async write(
    fh: CompositFsFileHandle,
    buffer: Buffer | ArrayBufferView | DataView,
    offset?: number,
    length?: number,
    position?: number
  ): Promise<TFileHandleWriteResult> {
    throw new Error(`write not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async writev(
    fh: CompositFsFileHandle,
    buffers: ArrayBufferView[],
    position?: number | null
  ): Promise<TFileHandleWritevResult> {
    throw new Error(`writev not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async readv(
    fh: CompositFsFileHandle,
    buffers: ArrayBufferView[],
    position?: number | null
  ): Promise<TFileHandleReadvResult> {
    throw new Error(`readv not implemented for: ${fh.subFsFileDescriptor}`);
  }

  async readFile(
    path: PathLike | IFileHandle,
    options?: IReadFileOptions | string
  ): Promise<TDataOut> {
    throw new Error(`readFile not implemented for: ${this.toStr(path)}`);
  }

  async writeFile(
    path: string,
    data: TData,
    options: IWriteFileOptions | string
  ): Promise<void> {
    throw new Error(`writeFile not implemented for: ${this.toStr(path)}`);
  }
}
