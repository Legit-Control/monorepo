import {
  IDir,
  IStats,
  TFileHandleReadResult,
  TFileHandleReadvResult,
  TFileHandleWriteResult,
  TFileHandleWritevResult,
  TMode,
  TTime,
} from '@jsonjoy.com/fs-node-utils';
import {
  IStatOptions,
  IAppendFileOptions,
} from  '@jsonjoy.com/fs-node-utils/lib/types/options.js';
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
import {
  CompositeSubFs,
  CompositeSubFsDir,
  FsType,
} from '../CompositeSubFs.js';
import { CompositeFs } from '../CompositeFs.js';
import { FsOperationContext } from '../context.js';
import { pathToString } from '../utils/path-helper.js';

export abstract class BaseCompositeSubFs implements CompositeSubFs {
  /** Reference to the parent CompositeFs instance - late init */
  public compositeFs!: CompositeFs;

  /** Context for the current filesystem operation */
  public context?: FsOperationContext;

  // NOTE: set if rename happens in the same fs
  public newContext?: FsOperationContext;

  public fsType: FsType = 'fs';

  /**
   * Unique instance ID that persists across contextual instances
   * This allows us to check if two contextual instances wrap the same base SubFS
   */
  readonly rootInstanceId: string;

  name: string;
  rootPath: string;

  constructor({ name, rootPath }: { name: string; rootPath: string }) {
    this.name = name;
    this.rootPath = rootPath;
    // Generate a unique ID for this instance
    this.rootInstanceId = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  attach(compositFs: CompositeFs) {
    this.compositeFs = compositFs;
  }

  /**
   * Create a new instance with context bound to it
   * This creates a shallow copy where all mutable state (like open file handles)
   * is shared between the original and the contextual instance, but the context
   * is unique to this instance.
   *
   * Each operation gets its own contextual instance, ensuring that concurrent
   * operations don't interfere with each other's context.
   */
  withContext(context: FsOperationContext): this {
    // Create a shallow copy that has context pre-set
    const contextual = Object.create(Object.getPrototypeOf(this));
    Object.assign(contextual, this);
    contextual.context = context;
    // Note: instanceId is copied via Object.assign, so it persists
    return contextual as this;
  }

  abstract responsible(filePath: string): Promise<boolean>;
  abstract fileType(): number;

  async open(
    path: PathLike,
    flags: string,
    mode?: number
  ): Promise<CompositFsFileHandle> {
    throw new Error(`open not implemented for: ${pathToString(path)}`);
  }

  async access(path: PathLike, mode?: number): Promise<void> {
    throw new Error(`access not implemented for: ${pathToString(path)}`);
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
    throw new Error(`lstat not implemented for: ${pathToString(path)}`);
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
    throw new Error(`lstat not implemented for: ${pathToString(path)}`);
  }

  async opendir(
    path: PathLike,
    options?: nodeFs.OpenDirOptions
  ): Promise<CompositeSubFsDir> {
    throw new Error(`opendir not implemented for: ${pathToString(path)}`);
  }

  async link(existingPath: PathLike, newPath: PathLike): Promise<void> {
    throw new Error(`link not implemented for: ${pathToString(existingPath)}`);
  }

  async mkdir(
    path: PathLike,
    options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null
  ): Promise<void> {
    throw new Error(`mkdir not implemented for: ${pathToString(path)}`);
  }

  async readDirFiltering?(
    path: PathLike,
    entries: IDir[] | string[]
  ): Promise<string[]>;

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
    throw new Error(`readdir not implemented for: ${pathToString(path)}`);
  }

  async readlink(path: PathLike, ...args: any[]): Promise<any> {
    throw new Error(`readlink not implemented for: ${pathToString(path)}`);
  }

  async unlink(path: PathLike): Promise<void> {
    throw new Error(`unlink not implemented for: ${pathToString(path)}`);
  }

  async rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
    throw new Error(`rename not implemented for: ${pathToString(oldPath)}`);
  }

  async rmdir(path: PathLike, ...args: any[]): Promise<void> {
    throw new Error(`rmdir not implemented for: ${pathToString(path)}`);
  }

  async symlink(
    target: PathLike,
    path: PathLike,
    type?: string | null
  ): Promise<void> {
    throw new Error(`symlink not implemented for: ${pathToString(path)}`);
  }

  async lookup(filePath: string): Promise<number> {
    throw new Error(`lookup not implemented for: ${pathToString(filePath)}`);
  }

  resolvePath(fd: number): string {
    throw new Error(`resolvePath not implemented for fd: ${fd}`);
  }

  async close(fh: CompositFsFileHandle): Promise<void> {
    this.compositeFs.close(fh);
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
    throw new Error(`readFile not implemented for: ${path}`);
  }

  async writeFile(
    path: string,
    data: TData,
    options: IWriteFileOptions | string
  ): Promise<void> {
    throw new Error(`writeFile not implemented for: ${path}`);
  }
}
