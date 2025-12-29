import * as nodeFs from 'node:fs';
import CompositFsFileHandle from '../CompositeFsFileHandle.js';
import type { PathLike } from 'fs';
import * as path from 'path';
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
import { BaseCompositeSubFs } from './BaseCompositeSubFs.js';
import type {
  IReadFileOptions,
  IWriteFileOptions,
  TData,
  TDataOut,
  IFileHandle,
  CompositeSubFsDir,
} from '../../types/fs-types.js';
import { CompositeFs } from '../CompositeFs.js';
import { CompositeFsDir } from '../CompositeFsDir.js';
import ignore from 'ignore';
import { pathToString } from '../utils/path-helper.js';

/**
 * Copy-on-Write filesystem implementation
 *
 * This SubFs provides copy-on-write semantics:
 * - Reads check copyToFs first, then fall back to sourceFs
 * - Writes always go to copyToFs (creating a copy if needed)
 * - Configured with patterns to determine which files to track
 * - Original files in sourceFs are never modified
 */
export class CopyOnWriteSubFs extends BaseCompositeSubFs {
  private openFh = new Map<number, IFileHandle>();
  private sourceFs: any; // The underlying source filesystem
  private copyToFs: any; // The filesystem where copies are stored
  private copyPath: string; // Path inside copyToFs to store copies
  private ig: ReturnType<typeof ignore>;
  patterns: string[];

  constructor({
    name,
    sourceFs,
    copyToFs,
    copyToRootPath,
    rootPath,

    patterns,
  }: {
    name: string;
    sourceFs: any;
    copyToFs: any;
    copyToRootPath: string;
    rootPath: string;
    patterns: string[];
  }) {
    super({
      rootPath,
      name,
    });

    this.sourceFs = sourceFs;
    this.copyToFs = copyToFs;
    this.copyPath = copyToRootPath;
    this.patterns = patterns;

    this.ig = ignore();
    this.ig.add(patterns);
  }

  private normalizeCopyPath(filePath: string | PathLike): string {
    const pathStr =
      typeof filePath === 'string' ? filePath : filePath.toString();
    // Convert to absolute path for copy filesystem
    const normalized = pathStr.startsWith('/') ? pathStr : '/' + pathStr;
    return path.join(this.copyPath, normalized);
  }

  private normalizePath(filePath: string | PathLike): string {
    const pathStr =
      typeof filePath === 'string' ? filePath : filePath.toString();
    // Ensure paths are absolute
    if (!pathStr.startsWith('/')) {
      return '/' + pathStr;
    }
    return pathStr;
  }

  override async responsible(filePath: string): Promise<boolean> {
    const normalized = filePath.replace(/\\/g, '/');

    // If sourceRootPath is provided, strip it from the path before pattern matching
    let relative = normalized;
    if (this.compositeFs.rootPath) {
      const rootPath = this.compositeFs.rootPath;
      // Remove the root path prefix if present
      if (normalized.startsWith(rootPath + '/')) {
        relative = normalized.slice(rootPath.length + 1);
      } else if (normalized.startsWith(rootPath)) {
        relative = normalized.slice(rootPath.length);
      }
    }

    // Remove leading ./ or /
    relative = relative.startsWith('./') ? relative.slice(2) : relative;
    relative = relative.startsWith('/') ? relative.slice(1) : relative;

    if (relative === '' || relative === '.') {
      return false;
    }
    return this.ig.ignores(relative);
  }

  override fileType(): number {
    return 6; // Unique type for copy-on-write
  }

  /**
   * Check if a file has been copied (exists in copyToFs)
   */
  private async isCopied(filePath: string): Promise<boolean> {
    const copyPath = this.normalizeCopyPath(filePath);
    try {
      await this.copyToFs.promises.access(copyPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Copy a file from sourceFs to copyToFs
   */
  private async copyFromSource(filePath: string): Promise<void> {
    const copyPath = this.normalizeCopyPath(filePath);
    const normalizedPath = this.normalizePath(filePath);

    // Ensure parent directory exists in copyToFs
    const parentPath = path.dirname(copyPath);
    if (parentPath && parentPath !== '/' && parentPath !== '.') {
      await this.copyToFs.promises.mkdir(parentPath, { recursive: true });
    }

    // Check if file exists in source
    try {
      const data = await this.sourceFs.promises.readFile(normalizedPath);
      await this.copyToFs.promises.writeFile(copyPath, data);
    } catch (error: any) {
      // If file doesn't exist in source, that's okay - we'll create it new
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  override async open(
    filePath: string,
    flags: string,
    mode?: number
  ): Promise<CompositFsFileHandle> {
    const normalizedPath = this.normalizePath(filePath);
    const copyPath = this.normalizeCopyPath(filePath);

    // Check if this is a write operation
    const isWrite =
      flags.includes('w') || flags.includes('a') || flags.includes('+');

    if (isWrite) {
      // Ensure parent directory exists in copyToFs first
      const parentPath = path.dirname(copyPath);
      if (parentPath && parentPath !== '/' && parentPath !== '.') {
        await this.copyToFs.promises.mkdir(parentPath, { recursive: true });
      }

      // Copy from source if file exists there and hasn't been copied yet
      const copied = await this.isCopied(filePath);
      if (!copied) {
        try {
          await this.sourceFs.promises.access(normalizedPath);
          // File exists in source, copy it
          await this.copyFromSource(filePath);
        } catch (error: any) {
          // File doesn't exist in source, will create new in copyToFs
        }
      }

      // For write operations, always use copyToFs
      const fh = await this.copyToFs.promises.open(copyPath, flags, mode);
      this.openFh.set(fh.fd, fh);

      const filehandle = new CompositFsFileHandle({
        fs: this,
        compositeFs: this.compositeFs,
        subFsFileDescriptor: fh.fd,
        parentFsFileDescriptors: [fh.fd],
      });
      return filehandle;
    } else {
      // For read-only operations, check copyToFs first, then sourceFs
      const isFileCopied = await this.isCopied(filePath);
      const targetFs = isFileCopied ? this.copyToFs : this.sourceFs;
      const targetPath = isFileCopied ? copyPath : normalizedPath;

      const fh = await targetFs.promises.open(targetPath, flags, mode);
      this.openFh.set(fh.fd, fh);

      const filehandle = new CompositFsFileHandle({
        fs: this,
        compositeFs: this.compositeFs,
        subFsFileDescriptor: fh.fd,
        parentFsFileDescriptors: [fh.fd],
      });
      return filehandle;
    }
  }

  override async access(filePath: PathLike, mode?: number): Promise<void> {
    const normalizedPath = this.normalizePath(filePath);
    const copyPath = this.normalizeCopyPath(filePath);

    // Check copyToFs first
    try {
      await this.copyToFs.promises.access(copyPath, mode);
      return;
    } catch {
      // Fall back to sourceFs
      return await this.sourceFs.promises.access(normalizedPath, mode);
    }
  }

  override async stat(
    statPath: PathLike,
    opts?: { bigint?: false }
  ): Promise<nodeFs.Stats>;
  override async stat(
    statPath: PathLike,
    opts: { bigint: true }
  ): Promise<nodeFs.BigIntStats>;
  override async stat(
    statPath: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;
  override async stat(
    statPath: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats> {
    const normalizedPath = this.normalizePath(statPath);
    const copyPath = this.normalizeCopyPath(statPath);

    // Check copyToFs first
    try {
      return (await this.copyToFs.promises.stat(copyPath, {
        bigint: opts?.bigint ?? false,
      })) as any;
    } catch {
      // Fall back to sourceFs
      return this.sourceFs.promises.stat(normalizedPath, {
        bigint: opts?.bigint ?? false,
      }) as any;
    }
  }

  override async lstat(
    lstatPath: PathLike,
    opts?: { bigint?: false }
  ): Promise<nodeFs.Stats>;
  override async lstat(
    lstatPath: PathLike,
    opts: { bigint: true }
  ): Promise<nodeFs.BigIntStats>;
  override async lstat(
    lstatPath: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;
  override async lstat(
    lstatPath: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats> {
    const normalizedPath = this.normalizePath(lstatPath);
    const copyPath = this.normalizeCopyPath(lstatPath);

    // Check copyToFs first
    try {
      return (await this.copyToFs.promises.lstat(copyPath, {
        bigint: opts?.bigint ?? false,
      })) as any;
    } catch {
      // Fall back to sourceFs
      return this.sourceFs.promises.lstat(normalizedPath, {
        bigint: opts?.bigint ?? false,
      }) as any;
    }
  }

  override async opendir(
    folderPath: nodeFs.PathLike,
    options?: nodeFs.OpenDirOptions
  ): Promise<CompositeSubFsDir> {
    const normalizedPath = this.normalizePath(folderPath);
    return new CompositeFsDir(this.compositeFs, normalizedPath);
  }

  override async link(
    existingPath: PathLike,
    newPath: PathLike
  ): Promise<void> {
    const copyExisting = this.normalizeCopyPath(existingPath);
    const copyNew = this.normalizeCopyPath(newPath);

    // Links should be created in copyToFs
    return await this.copyToFs.promises.link(copyExisting, copyNew);
  }

  override async mkdir(
    dirPath: PathLike,
    options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null
  ): Promise<void> {
    const copyPath = this.normalizeCopyPath(dirPath);

    const isRecursive =
      typeof options === 'object' &&
      options &&
      'recursive' in options &&
      options.recursive;
    if (!isRecursive) {
      const parentPath = path.dirname(copyPath);
      if (parentPath && parentPath !== '/' && parentPath !== '.') {
        try {
          await this.copyToFs.promises.stat(parentPath);
        } catch (e) {
          await this.copyToFs.promises.mkdir(parentPath, { recursive: true });
        }
      }
    }
    await this.copyToFs.promises.mkdir(copyPath, options as any);
  }

  override async readdir(readdirPath: PathLike, ...args: any[]): Promise<any> {
    const normalizedPath = this.normalizePath(readdirPath);
    const copyPath = this.normalizeCopyPath(readdirPath);

    // Merge entries from both filesystems
    const sourceEntries = new Set<string>();
    const copyEntries = new Set<string>();

    try {
      const sourceResult = await this.sourceFs.promises.readdir(
        normalizedPath,
        ...args
      );
      if (Array.isArray(sourceResult)) {
        sourceResult.forEach((e: any) =>
          sourceEntries.add(typeof e === 'string' ? e : e.name)
        );
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') throw error;
    }

    try {
      const copyResult = await this.copyToFs.promises.readdir(
        copyPath,
        ...args
      );
      if (Array.isArray(copyResult)) {
        copyResult.forEach((e: any) =>
          copyEntries.add(typeof e === 'string' ? e : e.name)
        );
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') throw error;
    }

    // Merge: copy entries take precedence
    const merged = Array.from(new Set([...sourceEntries, ...copyEntries]));
    return merged;
  }

  override async readlink(readlinkPath: PathLike): Promise<any> {
    throw new Error('readlink is not implemented for CopyOnWriteSubFs');
  }

  override async unlink(unlinkPath: PathLike): Promise<void> {
    const copyPath = this.normalizeCopyPath(unlinkPath);
    return await this.copyToFs.promises.unlink(copyPath);
  }

  override async rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
    const copyOld = this.normalizeCopyPath(oldPath);
    const copyNew = this.normalizeCopyPath(newPath);
    return await this.copyToFs.promises.rename(copyOld, copyNew);
  }

  override async rmdir(
    rmdirPath: PathLike,
    options?: nodeFs.RmDirOptions
  ): Promise<void> {
    const copyPath = this.normalizeCopyPath(rmdirPath);
    return await this.copyToFs.promises.rmdir(copyPath, options);
  }

  override async symlink(
    target: PathLike,
    linkPath: PathLike,
    type?: string | null
  ): Promise<void> {
    const copyTarget = this.normalizeCopyPath(target);
    const copyPath = this.normalizeCopyPath(linkPath);
    return await this.copyToFs.promises.symlink(
      copyTarget,
      copyPath,
      type as any
    );
  }

  override async lookup(filePath: string): Promise<number> {
    throw new Error(`lookup is not implemented for: ${pathToString(filePath)}`);
  }

  override resolvePath(fd: number): string {
    throw new Error(`resolvePath is not implemented: resolvePath(${fd})`);
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
    filePath: PathLike | IFileHandle,
    options?: IReadFileOptions | string
  ): Promise<TDataOut> {
    if (typeof filePath !== 'string' && !Buffer.isBuffer(filePath)) {
      return super.readFile(filePath, options);
    }

    const normalizedPath = this.normalizePath(filePath);
    const copyPath = this.normalizeCopyPath(filePath);

    // Try copyToFs first
    try {
      return await this.copyToFs.promises.readFile(copyPath, options as any);
    } catch {
      // Fall back to sourceFs
      return this.sourceFs.promises.readFile(normalizedPath, options as any);
    }
  }

  override async writeFile(
    filePath: string,
    data: TData,
    options: IWriteFileOptions | string
  ): Promise<void> {
    const copyPath = this.normalizeCopyPath(filePath);

    // Copy from source on first write if file exists there
    const copied = await this.isCopied(filePath);
    if (!copied) {
      await this.copyFromSource(filePath);
    }

    // Ensure parent directory exists
    const parentPath = path.dirname(copyPath);
    if (parentPath && parentPath !== '/' && parentPath !== '.') {
      await this.copyToFs.promises.mkdir(parentPath, { recursive: true });
    }

    // Write to copy
    await this.copyToFs.promises.writeFile(copyPath, data, options as any);
  }
}
