import {
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
  CompositeSubFsDir,
  TData,
  IWriteFileOptions,
  IFileHandle,
  IReadFileOptions,
  TDataOut,
} from '../types/fs-types.js';
import * as fsDisk from 'node:fs';
import CompositFsFileHandle from './CompositeFsFileHandle.js';
import { MakeDirectoryOptions, Mode } from 'node:fs';
import { CompositeFs } from './CompositeFs.js';

export type FileHandleDelegate = {
  name: string;
  fileType: () => number;
  open: (
    filePath: string,
    flags: string,
    mode?: number
  ) => Promise<CompositFsFileHandle>;

  /**
   * @returns a unique number per subfs
   */
  close: (fh: CompositFsFileHandle) => Promise<void>;
  dataSync: (fh: CompositFsFileHandle) => Promise<void>;
  read: (
    fh: CompositFsFileHandle,
    buffer: Buffer | Uint8Array,
    offset: number,
    length: number,
    position: number
  ) => Promise<TFileHandleReadResult>;
  appendFile: (
    fh: CompositFsFileHandle,
    data: TData,
    options?: IAppendFileOptions | string
  ) => Promise<void>;
  fchmod: (fh: CompositFsFileHandle, mode: TMode) => Promise<void>;
  fchown: (fh: CompositFsFileHandle, uid: number, gid: number) => Promise<void>;
  ftruncate(fh: CompositFsFileHandle, len?: number): Promise<void>;
  fstat(fh: CompositFsFileHandle, options?: IStatOptions): Promise<IStats>;
  futimes(fh: CompositFsFileHandle, atime: TTime, mtime: TTime): Promise<void>;
  write(
    fh: CompositFsFileHandle,
    buffer: Buffer | ArrayBufferView | DataView,
    offset?: number,
    length?: number,
    position?: number
  ): Promise<TFileHandleWriteResult>;
  writev(
    fh: CompositFsFileHandle,
    buffers: ArrayBufferView[],
    position?: number | null
  ): Promise<TFileHandleWritevResult>;
  readv(
    fh: CompositFsFileHandle,
    buffers: ArrayBufferView[],
    position?: number | null
  ): Promise<TFileHandleReadvResult>;
};

/**
 * A sub fs is repsonsible for a subset of files or folders within a composit filesystem
 *
 * It exposes filehandles via the async open function. modifcation should than always pass the filehndle
 * - which forwards the opreations to the corresponding async filehanlde methdos
 */
export { CompositeSubFsDir };

export type CompositeSubFs = Pick<
  typeof fsDisk.promises,
  | 'access'
  // NOTE: since we don't have a folder handle we need to expose the method
  | 'link'
  | 'readdir'
  | 'readlink' // TODO check if readlink
  | 'unlink'
  | 'rename'
  | 'rmdir'
  | 'symlink'
> & {
  name: string;

  attach(compositFs: CompositeFs): void;

  readDirFiltering?(
    path: fsDisk.PathLike,
    entries: string[]
  ): Promise<string[]>;

  readFile(
    path: fsDisk.PathLike | IFileHandle,
    options?: IReadFileOptions | string
  ): Promise<TDataOut>;

  stat(
    path: fsDisk.PathLike,
    opts?: IStatOptions & { bigint?: false }
  ): Promise<IStats<number>>;
  stat(
    path: fsDisk.PathLike,
    opts: IStatOptions & { bigint: true }
  ): Promise<IStats<bigint>>;
  stat(
    path: fsDisk.PathLike,
    opts?: IStatOptions
  ): Promise<IStats<number> | IStats<bigint>>;

  lstat(
    path: fsDisk.PathLike,
    opts?: IStatOptions & { bigint?: false }
  ): Promise<IStats<number>>;
  lstat(
    path: fsDisk.PathLike,
    opts: IStatOptions & { bigint: true }
  ): Promise<IStats<bigint>>;
  lstat(
    path: fsDisk.PathLike,
    opts?: IStatOptions
  ): Promise<IStats<number> | IStats<bigint>>;

  mkdir: (
    path: fsDisk.PathLike,
    options?: MakeDirectoryOptions | Mode | null
  ) => Promise<void>;
  fileType: () => number;

  writeFile: (
    path: string,
    data: TData,
    options: IWriteFileOptions | string
  ) => Promise<void>;
  opendir(
    dirPath: fsDisk.PathLike,
    options?: fsDisk.OpenDirOptions
  ): Promise<CompositeSubFsDir>;
  lookup: (path: string) => Promise<number>;
  responsible(filePath: string): Promise<boolean>;
  resolvePath: (fd: number) => string;
} & FileHandleDelegate;
