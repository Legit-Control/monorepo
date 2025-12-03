import * as nodeFs from 'node:fs';
import CompositFsFileHandle from '../CompositeFsFileHandle.js';
import type { PathLike } from 'fs';
import * as path from 'path';
import { createFsFromVolume, Volume } from 'memfs';
import { BaseCompositeSubFs } from './BaseCompositeSubFs.js';
import {
  TMode,
  TFileHandleReadResult,
  TFileHandleWriteResult,
  TFileHandleWritevResult,
  TFileHandleReadvResult,
  IStats,
  TTime,
} from 'memfs/lib/node/types/misc.js';
import { IStatOptions } from 'memfs/lib/node/types/options.js';
import type {
  IReadFileOptions,
  IWriteFileOptions,
  TData,
  TDataOut,
  IFileHandle,
} from '../../types/fs-types.js';
import { CompositeFs } from '../CompositeFs.js';
import { CompositeSubFsDir } from '../CompositeSubFs.js';

/**
 * FS utilized to provide pass-through access to the underlying filesystem
 */
export class PassThroughSubFs extends BaseCompositeSubFs {
  private openFh = new Map<number, CompositFsFileHandle>();
  private memFs = createFsFromVolume(new Volume());

  private targetFs: CompositeFs;

  constructor({
    name,
    parentFs,
    gitRoot,
  }: {
    name: string;
    parentFs: CompositeFs;
    gitRoot: string;
  }) {
    super({
      name,
      parentFs,
      gitRoot,
    });

    this.compositFs = parentFs;
    this.gitRoot = gitRoot;

    if (this.compositFs.parentFs === undefined) {
      throw new Error('PassThroughSubFs not allowed in root fs');
    }
    this.targetFs = this.compositFs.parentFs;
  }

  override async responsible(filePath: string): Promise<boolean> {
    // pass through is the catch all fs
    return true;
  }

  override fileType(): number {
    return 4; // Arbitrary type for pass-through
  }

  override async open(
    filePath: string,
    flags: string,
    mode?: number
  ): Promise<CompositFsFileHandle> {
    const parentPath = path.dirname(filePath as string);
    // the parent folder should have been open before
    // const parentFileHandle = this.fileHandleManager.getHandleByPath(parentPath);

    // pass the open call through the composite fs directly to its parent
    const fh = await this.targetFs.promises.open(filePath, flags, mode);

    this.openFh.set(fh.fd, fh);

    const filehandle = new CompositFsFileHandle({
      fs: this,
      compositeFs: this.compositFs,
      subFsFileDescriptor: fh.fd,
      parentFsFileDescriptors: [fh.fd],
    });
    return filehandle;
  }

  override async access(filePath: PathLike, mode?: number): Promise<void> {
    return await this.targetFs.promises.access(filePath as string, mode);
  }

  override async stat(
    path: PathLike,
    opts?: { bigint?: false }
  ): Promise<nodeFs.Stats>;
  override async stat(
    path: PathLike,
    opts: { bigint: true }
  ): Promise<nodeFs.BigIntStats>;
  override async stat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;
  override async stat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats> {
    return this.targetFs.promises.stat(path, {
      // NOTE we don't support bigint for now
      bigint: false,
    }) as any;
  }

  override async lstat(
    path: PathLike,
    opts?: { bigint?: false }
  ): Promise<nodeFs.Stats>;
  override async lstat(
    path: PathLike,
    opts: { bigint: true }
  ): Promise<nodeFs.BigIntStats>;
  override async lstat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;
  override async lstat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats> {
    return this.targetFs.promises.lstat(path, {
      // NOTE we don't support bigint for now
      bigint: false,
    }) as any;
  }

  override async opendir(
    folderPath: nodeFs.PathLike,
    options?: nodeFs.OpenDirOptions
  ) {
    return await this.targetFs.promises.opendir(folderPath, options);
  }

  override async link(
    existingPath: PathLike,
    newPath: PathLike
  ): Promise<void> {
    return await this.targetFs.promises.link(existingPath, newPath);
  }

  override async mkdir(
    dirPath: PathLike,
    options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null
  ): Promise<void> {
    const pathStr = typeof dirPath === 'string' ? dirPath : dirPath.toString();
    return await this.targetFs.promises.mkdir(pathStr, options);
  }

  override async readdir(path: PathLike, ...args: any[]): Promise<any> {
    return this.targetFs.promises.readdir(path, ...args) as any;
  }

  override async readlink(path: PathLike, ...args: any[]): Promise<any> {
    throw new Error('not implemented');
    // return await this.fs.promises.readlink(path, ...args) as any;
  }

  override async unlink(path: PathLike): Promise<void> {
    return await this.targetFs.promises.unlink(path);
  }

  override async rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
    return await this.targetFs.promises.rename(oldPath, newPath);
  }

  override async rmdir(
    path: PathLike,
    options?: nodeFs.RmDirOptions
  ): Promise<void> {
    return await this.targetFs.promises.rmdir(path, options);
  }

  override async symlink(
    target: PathLike,
    path: PathLike,
    type?: string | null
  ): Promise<void> {
    return await this.targetFs.promises.symlink(target, path, type);
  }

  override async lookup(filePath: string): Promise<number> {
    // No direct equivalent in fs.promises, so throw error or implement as needed
    throw new Error(`lookup is not implemented for: ${this.toStr(filePath)}`);
  }

  override async close(fh: CompositFsFileHandle): Promise<void> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      await fileHandle.close();
      this.openFh.delete(fh.subFsFileDescriptor);
    }
  }

  override async dataSync(fh: CompositFsFileHandle): Promise<void> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return await fileHandle.sync();
    }
  }

  override async read(
    fh: CompositFsFileHandle,
    buffer: Buffer | Uint8Array,
    offset: number,
    length: number,
    position: number
  ): Promise<TFileHandleReadResult> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return await fileHandle.read(buffer, offset, length, position);
    }
    throw new Error(`File handle not found: ${fh.subFsFileDescriptor}`);
  }

  override async fchmod(fh: CompositFsFileHandle, mode: TMode): Promise<void> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return await fileHandle.chmod(mode);
    }
  }

  override async fchown(
    fh: CompositFsFileHandle,
    uid: number,
    gid: number
  ): Promise<void> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return await fileHandle.chown(uid, gid);
    }
  }

  override async write(
    fh: CompositFsFileHandle,
    buffer: Buffer | ArrayBufferView | DataView,
    offset?: number,
    length?: number,
    position?: number
  ): Promise<TFileHandleWriteResult> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return (await fileHandle.write(
        buffer as any,
        offset,
        length,
        position
      )) as any;
    }
    throw new Error(`File handle not found: ${fh.subFsFileDescriptor}`);
  }

  override async ftruncate(
    fh: CompositFsFileHandle,
    len?: number
  ): Promise<void> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return await fileHandle.truncate(len);
    }
  }

  override resolvePath(fd: number): string {
    throw new Error(`resolvePath is not implemented: resolvePath(${fd})`);
  }

  override async fstat(
    fh: CompositFsFileHandle,
    options?: IStatOptions
  ): Promise<IStats> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return await fileHandle.stat(options);
    }
    throw new Error(`File handle not found: ${fh.subFsFileDescriptor}`);
  }

  override async futimes(
    fh: CompositFsFileHandle,
    atime: TTime,
    mtime: TTime
  ): Promise<void> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return await fileHandle.utimes(atime, mtime);
    }
  }

  override async writev(
    fh: CompositFsFileHandle,
    buffers: ArrayBufferView[],
    position?: number | null
  ): Promise<TFileHandleWritevResult> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return await fileHandle.writev(buffers as any, position ?? undefined);
    }
    throw new Error(`File handle not found: ${fh.subFsFileDescriptor}`);
  }

  override async readv(
    fh: CompositFsFileHandle,
    buffers: ArrayBufferView[],
    position?: number | null
  ): Promise<TFileHandleReadvResult> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      return await fileHandle.readv(buffers as any, position ?? undefined);
    }
    throw new Error(`File handle not found: ${fh.subFsFileDescriptor}`);
  }

  override async readFile(
    path: PathLike | IFileHandle,
    options?: IReadFileOptions | string
  ): Promise<TDataOut> {
    // Use targetFs readFile if it's a path
    if (typeof path === 'string' || Buffer.isBuffer(path)) {
      return this.targetFs.readFile(path.toString(), options as any);
    }
    // For file handles, delegate to base implementation
    return super.readFile(path, options);
  }

  override async writeFile(
    path: string,
    data: TData,
    options: IWriteFileOptions | string
  ): Promise<void> {
    // Open file with write flag
    const flags =
      typeof options === 'object' && options.flag ? options.flag : 'w';
    const fh = await this.targetFs.open(path, flags as string);

    try {
      // Convert data to Buffer
      let buffer: Buffer;
      if (typeof data === 'string') {
        const encoding =
          typeof options === 'object' && options.encoding
            ? options.encoding
            : 'utf8';
        buffer = Buffer.from(data, encoding as BufferEncoding);
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
      } else {
        buffer = Buffer.from(data as any);
      }

      // Write the data
      await fh.write(buffer, 0, buffer.length, 0);
    } finally {
      // Always close the file handle
      await this.targetFs.close(fh);
    }
  }
}
