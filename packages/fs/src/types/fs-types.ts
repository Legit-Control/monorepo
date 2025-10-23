import type {
  IFileHandle,
  IStats,
  TData,
  TDataOut,
  TMode,
  IDir,
  PathLike,
  IDirent,
  TCallback,
} from "memfs/lib/node/types/misc.js";
import type {
  IAppendFileOptions,
  IMkdirOptions,
  IReadFileOptions,
  IWriteFileOptions,
  IStatOptions,
} from "memfs/lib/node/types/options.js";

// Re-export memfs types
export type {
  IFileHandle,
  IReadFileOptions,
  IWriteFileOptions,
  IStats,
  IStatOptions,
  TData,
  TDataOut,
  TMode,
  IDir,
  PathLike,
  TCallback,
  IAppendFileOptions,
  IMkdirOptions,
};

// Define OpenMode type that's missing
export type OpenMode = string | number;

// Define unified readFile signature that works with both memfs and node fs
export interface IReadFileFn {
  (
    path: PathLike | IFileHandle,
    options?: IReadFileOptions | string,
  ): Promise<TDataOut>;
  (path: PathLike | IFileHandle, options: BufferEncoding): Promise<string>;
  (path: PathLike | IFileHandle): Promise<Buffer>;
}

// Define unified writeFile signature
export interface IWriteFileFn {
  (
    path: PathLike | IFileHandle,
    data: TData,
    options?: IWriteFileOptions | string,
  ): Promise<void>;
}

// Define unified stat signature
export interface IStatFn {
  (path: PathLike, opts?: IStatOptions): Promise<IStats>;
}

// Define unified symlink signature that accepts null
export interface ISymlinkFn {
  (target: PathLike, path: PathLike, type?: string | null): Promise<void>;
}

// Extend IDir to include missing methods
export interface ICompositeFsDir extends IDir {
  closeSync(): void;
  readSync(): IDirent | null;
}

// Type for CompositeSubFsDir that is compatible with both
export type CompositeSubFsDir = Pick<
  IDir,
  "path" | "close" | "read" | typeof Symbol.asyncIterator
>;

// Define FileHandle type that includes fd
export interface ICompositeFsFileHandle extends IFileHandle {
  fd: number;
}
