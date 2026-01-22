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
import { CompositeFs } from '../CompositeFs.js';
import { CompositeFsDir } from '../CompositeFsDir.js';
import type {
  CompositeSubFsDir,
  IReadFileOptions,
  IWriteFileOptions,
  TData,
  TDataOut,
  IFileHandle,
} from '../../types/fs-types.js';
import { CompositeSubFs } from '../CompositeSubFs.js';
import { pathToString } from '../utils/path-helper.js';

/**
 * FS utilized to provide pass-through access to the underlying filesystem
 */
export class PassThroughToAsyncFsSubFs
  extends BaseCompositeSubFs
  implements CompositeSubFs
{
  private openFh = new Map<number, nodeFs.promises.FileHandle>();

  private passThroughFs: typeof nodeFs;

  constructor({
    name,
    rootPath,
    passThroughFs,
  }: {
    name: string;
    rootPath: string;
    passThroughFs: typeof nodeFs;
  }) {
    super({
      name,
      rootPath,
    });

    this.passThroughFs = passThroughFs;
  }

  /**
   * Project a user-facing path to the actual path in the pass-through filesystem.
   * If rootPath is '/repo', then '/file.txt' becomes '/repo/file.txt'.
   */
  private projectPath(filePath: string | PathLike): string {
    const pathStr =
      typeof filePath === 'string' ? filePath : filePath.toString();

    // If rootPath is '/', no projection needed
    if (this.rootPath === '/' || this.rootPath === '') {
      return pathStr;
    }

    // Ensure filePath starts with /
    const normalizedPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;

    // If rootPath already matches the start of filePath, don't prepend
    if (normalizedPath.startsWith(this.rootPath)) {
      return normalizedPath;
    }

    // Prepend rootPath to the user-facing path
    // Remove trailing slash from rootPath if present
    const basePath = this.rootPath.endsWith('/')
      ? this.rootPath.slice(0, -1)
      : this.rootPath;
    return `${basePath}${normalizedPath}`;
  }

  /**
   * Swap the pass-through filesystem to a new one.
   * Closes all open file handles before swapping.
   * Used by swapStorage to move to a new storage backend.
   */
  async swapPassThroughFs(
    newPassThroughFs: typeof nodeFs,
    rootPath: string
  ): Promise<void> {
    // Close all open file handles
    for (const [fd, handle] of this.openFh) {
      try {
        await handle.close();
      } catch (error) {
        // Log but continue - we're cleaning up anyway
        console.warn(`Failed to close file handle ${fd}:`, error);
      }
    }
    this.openFh.clear();

    // Swap the target filesystem
    this.passThroughFs = newPassThroughFs;
    this.rootPath = rootPath;
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
    const projectedPath = this.projectPath(filePath);
    const fh = await this.passThroughFs.promises.open(
      projectedPath,
      flags,
      mode
    );

    this.openFh.set(fh.fd, fh);

    const filehandle = new CompositFsFileHandle({
      fs: this,
      compositeFs: this.compositeFs,
      subFsFileDescriptor: fh.fd,
      parentFsFileDescriptors: [],
    });
    return filehandle;
  }

  override async access(filePath: PathLike, mode?: number): Promise<void> {
    return await this.passThroughFs.promises.access(
      this.projectPath(filePath),
      mode
    );
  }

  override async stat(path: PathLike, ...args: any[]): Promise<any> {
    return this.passThroughFs.promises.stat(this.projectPath(path), {
      // NOTE we don't support bigint for now
      bigint: false,
    }) as any;
  }

  override async lstat(path: PathLike, ...args: any[]): Promise<any> {
    return this.passThroughFs.promises.lstat(this.projectPath(path), {
      // NOTE we don't support bigint for now
      bigint: false,
    }) as any;
  }

  override async opendir(
    folderPath: nodeFs.PathLike,
    options?: nodeFs.OpenDirOptions
  ): Promise<CompositeSubFsDir> {
    const projectedPath = this.projectPath(folderPath);
    const dir = await this.passThroughFs.promises.opendir(
      projectedPath,
      options
    );
    return new CompositeFsDir(this.compositeFs, folderPath.toString());
  }

  override async link(
    existingPath: PathLike,
    newPath: PathLike
  ): Promise<void> {
    return await this.passThroughFs.promises.link(
      this.projectPath(existingPath),
      this.projectPath(newPath)
    );
  }

  override async mkdir(
    path: PathLike,
    options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null
  ): Promise<void> {
    await this.passThroughFs.promises.mkdir(this.projectPath(path), options);
  }

  override async readdir(path: PathLike, ...args: any[]): Promise<any> {
    return this.passThroughFs.promises.readdir(
      this.projectPath(path),
      ...args
    ) as any;
  }

  override async readlink(path: PathLike, ...args: any[]): Promise<any> {
    throw new Error('not implemented');
    // return await this.fs.promises.readlink(path, ...args) as any;
  }

  override async unlink(path: PathLike): Promise<void> {
    return await this.passThroughFs.promises.unlink(this.projectPath(path));
  }

  override async rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
    return await this.passThroughFs.promises.rename(
      this.projectPath(oldPath),
      this.projectPath(newPath)
    );
  }

  override async rmdir(
    path: PathLike,
    options?: nodeFs.RmDirOptions
  ): Promise<void> {
    return await this.passThroughFs.promises.rmdir(
      this.projectPath(path),
      options
    );
  }

  override async symlink(
    target: PathLike,
    path: PathLike,
    type?: string | null
  ): Promise<void> {
    return await this.passThroughFs.promises.symlink(
      target,
      this.projectPath(path),
      type
    );
  }

  override async lookup(filePath: string): Promise<number> {
    // No direct equivalent in fs.promises, so throw error or implement as needed
    throw new Error(`lookup is not implemented for: ${pathToString(filePath)}`);
  }

  override async close(fh: CompositFsFileHandle): Promise<void> {
    // delegate for the filehandle close function:
    // close the fubfs filehandle it self (xsync?)
    // close all parentFileHandles

    const fileHandle = this.openFh.get(fh.subFsFileDescriptor);
    if (fileHandle) {
      this.openFh.delete(fh.subFsFileDescriptor);
      await fileHandle.close();
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
    return this.passThroughFs.promises.readFile(
      this.projectPath(path as PathLike),
      options as any
    );
  }

  override async writeFile(
    path: string,
    data: TData,
    options: IWriteFileOptions | string
  ): Promise<void> {
    return this.passThroughFs.promises.writeFile(
      this.projectPath(path),
      data as any,
      options as any
    );
  }
}
