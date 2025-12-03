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
import ignore from 'ignore';

/**
 * FS utilized to provide ephemeral storage using in-memory filesystem
 * Files matching ephemeralPatterns are stored in memory and lost on restart
 */
export class EphemeralSubFs extends BaseCompositeSubFs {
  private openFh = new Map<number, IFileHandle>();
  private memFs = createFsFromVolume(new Volume());
  private ig: ReturnType<typeof ignore>;
  patterns: string[];

  private normalizePath(filePath: string | PathLike): string {
    const pathStr =
      typeof filePath === 'string' ? filePath : filePath.toString();
    // Ensure paths are absolute for memfs
    if (!pathStr.startsWith('/')) {
      return '/' + pathStr;
    }
    return pathStr;
  }

  constructor({
    name,
    parentFs,
    gitRoot,
    ephemeralPatterns,
  }: {
    name: string;
    parentFs: CompositeFs;
    gitRoot: string;
    ephemeralPatterns: string[];
  }) {
    super({
      name,
      parentFs,
      gitRoot,
    });

    this.compositFs = parentFs;
    this.gitRoot = gitRoot;

    this.ig = ignore();
    this.ig.add(ephemeralPatterns);
    this.patterns = ephemeralPatterns;

    // if (this.compositFs.parentFs === undefined) {
    // throw new Error("EphemeralSubFs not allowed in root fs");
    // }
  }

  override async responsible(filePath: string): Promise<boolean> {
    // Use same logic as HiddenFileSubFs for pattern matching
    const normalized = filePath.replace(/\\/g, '/');
    let relative = normalized.startsWith('./')
      ? normalized.slice(2)
      : normalized;
    relative = relative.startsWith('/') ? relative.slice(1) : relative;

    if (relative === '' || relative === '.') {
      return false;
    }
    const ignores = this.ig.ignores(relative);
    return ignores;
  }

  override fileType(): number {
    return 5; // Arbitrary type for ephemeral
  }

  override async open(
    filePath: string,
    flags: string,
    mode?: number
  ): Promise<CompositFsFileHandle> {
    const normalizedPath = this.normalizePath(filePath);

    // Ensure parent directory exists by creating the full path hierarchy
    const parentPath = path.dirname(normalizedPath);
    if (parentPath && parentPath !== '/' && parentPath !== '.') {
      await this.memFs.promises.mkdir(parentPath, { recursive: true });
    }

    // Use memFs instead of targetFs
    const fh = await this.memFs.promises.open(normalizedPath, flags, mode);

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
    const normalizedPath = this.normalizePath(filePath);
    return await this.memFs.promises.access(normalizedPath, mode);
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
    const normalizedPath = this.normalizePath(path);
    return this.memFs.promises.stat(normalizedPath, {
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
    const normalizedPath = this.normalizePath(path);
    return this.memFs.promises.lstat(normalizedPath, {
      // NOTE we don't support bigint for now
      bigint: false,
    }) as any;
  }

  override async opendir(
    folderPath: nodeFs.PathLike,
    options?: nodeFs.OpenDirOptions
  ) {
    const normalizedPath = this.normalizePath(folderPath);
    return await this.memFs.promises.opendir(normalizedPath, options);
  }

  override async link(
    existingPath: PathLike,
    newPath: PathLike
  ): Promise<void> {
    const normalizedExisting = this.normalizePath(existingPath);
    const normalizedNew = this.normalizePath(newPath);
    return await this.memFs.promises.link(normalizedExisting, normalizedNew);
  }

  override async mkdir(
    dirPath: PathLike,
    options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null
  ): Promise<void> {
    const normalizedPath = this.normalizePath(dirPath);
    // If not recursive, we need to ensure parent exists
    const isRecursive =
      typeof options === 'object' &&
      options &&
      'recursive' in options &&
      options.recursive;
    if (!isRecursive) {
      const parentPath = path.dirname(normalizedPath);
      if (parentPath && parentPath !== '/' && parentPath !== '.') {
        try {
          await this.memFs.promises.stat(parentPath);
        } catch (e) {
          // Parent doesn't exist, create it recursively
          await this.memFs.promises.mkdir(parentPath, { recursive: true });
        }
      }
    }
    await this.memFs.promises.mkdir(normalizedPath, options as any);
  }

  override async readdir(path: PathLike, ...args: any[]): Promise<any> {
    const normalizedPath = this.normalizePath(path);

    const dirs = (await this.memFs.promises.readdir(
      normalizedPath,
      ...args
    )) as any;
    console.log('EPHEMERAL: READDIR: ', dirs);
    return dirs;
  }

  override async readlink(path: PathLike): Promise<any> {
    throw new Error('readlink is not implemented for EphemeralFileSubFs');
  }

  override async unlink(path: PathLike): Promise<void> {
    const normalizedPath = this.normalizePath(path);
    return await this.memFs.promises.unlink(normalizedPath);
  }

  override async rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
    const normalizedOld = this.normalizePath(oldPath);
    const normalizedNew = this.normalizePath(newPath);
    return await this.memFs.promises.rename(normalizedOld, normalizedNew);
  }

  override async rmdir(
    path: PathLike,
    options?: nodeFs.RmDirOptions
  ): Promise<void> {
    const normalizedPath = this.normalizePath(path);
    return await this.memFs.promises.rmdir(normalizedPath, options);
  }

  override async symlink(
    target: PathLike,
    path: PathLike,
    type?: string | null
  ): Promise<void> {
    const normalizedTarget = this.normalizePath(target);
    const normalizedPath = this.normalizePath(path);
    return await this.memFs.promises.symlink(
      normalizedTarget,
      normalizedPath,
      type as any
    );
  }

  override async lookup(filePath: string): Promise<number> {
    // No direct equivalent in fs.promises, so throw error or implement as needed
    throw new Error(`lookup is not implemented for: ${this.toStr(filePath)}`);
  }

  override async close(fh: CompositFsFileHandle): Promise<void> {
    // delegate for the filehandle close function:
    // close the memfs filehandle itself
    // close all parentFileHandles

    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      await fileHandle.close();
      this.openFh.delete(fh.subFsFileDescriptor);
    }

    // Don't call compositFs.close for ephemeral files
  }

  override async dataSync(fh: CompositFsFileHandle): Promise<void> {
    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      // memfs file handles have datasync method
      return await (fileHandle as any).datasync();
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
    // Use memFs readFile if it's a path
    if (typeof path === 'string' || Buffer.isBuffer(path)) {
      const normalizedPath = this.normalizePath(path);
      return this.memFs.promises.readFile(normalizedPath, options as any);
    }
    // For file handles, delegate to base implementation
    return super.readFile(path, options);
  }

  override async writeFile(
    filePath: string,
    data: TData,
    options: IWriteFileOptions | string
  ): Promise<void> {
    const normalizedPath = this.normalizePath(filePath);

    // Ensure parent directory exists
    const parentPath = path.dirname(normalizedPath);
    if (parentPath && parentPath !== '/' && parentPath !== '.') {
      await this.memFs.promises.mkdir(parentPath, { recursive: true });
    }

    // Use memFs writeFile directly
    return this.memFs.promises.writeFile(normalizedPath, data, options as any);
  }
}
