import git from '@legit-sdk/isomorphic-git';
import { CompositeSubFs } from '../CompositeSubFs.js';
import CompositFsFileHandle from '../CompositeFsFileHandle.js';
import * as path from 'path';

import { createFsFromVolume, IFs, Volume } from 'memfs';
import {
  IStats,
  TFileHandleReadResult,
  TFileHandleWriteResult,
  TTime,
} from 'memfs/lib/node/types/misc.js';
import {
  IStatOptions,
  IWriteFileOptions,
} from 'memfs/lib/node/types/options.js';
import type {
  PathLike,
  IFileHandle,
  TData,
  TDataOut,
  IReadFileOptions,
  TMode,
} from '../../types/fs-types.js';

import { BaseCompositeSubFs } from './BaseCompositeSubFs.js';
import * as nodeFs from 'node:fs';
import { VirtualFileDefinition } from './git/virtualFiles/gitVirtualFiles.js';
import { toDirEntry } from './git/virtualFiles/utils.js';

/**
 * CompositeSubFsAdapter - Adapts a virtual file handler to work as a SubFS
 *
 * This class adapts a single VirtualFileDefinition to work as a CompositeSubFs.
 * It receives routing context (extracted parameters) from CompositeFs, eliminating the need for internal routing.
 *
 * Each virtual file type (branch file, commit file, etc.) gets its own adapter instance.
 */
export class CompositeSubFsAdapter
  extends BaseCompositeSubFs
  implements CompositeSubFs
{
  private memFs: IFs;
  private openFh: Record<
    number,
    {
      path: string;
      mode: string;
      fh: IFileHandle;
      openSha: string | undefined;
      readSha: string | undefined;
      unflushed: { start: number; length: number }[];
    }
  > = {};

  storageFs: any;
  protected gitRoot: string;

  /**
   * The virtual file handler for this adapter
   * This defines how to read/write/stat the virtual file
   */
  public handler: VirtualFileDefinition;

  public async getAuthor(): Promise<{
    name: string;
    email: string;
    date: number;
    timezoneOffset: number;
  }> {
    const name = await git.getConfig({
      fs: this.storageFs,
      dir: this.gitRoot,
      path: 'user.name',
    });
    const email = await git.getConfig({
      fs: this.storageFs,
      dir: this.gitRoot,
      path: 'user.email',
    });
    const date = Math.floor(Date.now() / 1000);
    const timezoneOffset = new Date().getTimezoneOffset();

    return { name, email, date, timezoneOffset };
  }

  constructor({
    name,
    gitStorageFs,
    gitRoot,
    handler,
    rootPath,
  }: {
    name: string;
    gitStorageFs: any;
    gitRoot: string;
    handler: VirtualFileDefinition;
    rootPath: string;
  }) {
    super({ name, rootPath });

    this.handler = handler;
    this.gitRoot = gitRoot;
    this.storageFs = gitStorageFs;
    this.memFs = createFsFromVolume(new Volume());
  }

  async responsible(filePath: string): Promise<boolean> {
    // This adapter is responsible for all paths routed to it by CompositeFs
    // The routing happens at the CompositeFs level based on route patterns
    return true;
  }

  /**
   * Get route parameters from the operation context
   * CompositeFs sets this context when routing to this adapter
   */
  private getRouteParams(): Record<string, string> {
    return this.context?.params || {};
  }

  /**
   * Get static siblings from the operation context
   * These are static entries that should appear in directory listings
   */
  private getStaticSiblings(): { segment: string; type: 'folder' | 'file' }[] {
    return this.context?.staticSiblings || [];
  }

  /**
   * Opens a virtual file using the configured handler.
   *
   * The handler receives route parameters via context set by CompositeFs.
   */
  override async open(
    filePath: string,
    flags: string,
    mode?: number
  ): Promise<CompositFsFileHandle> {
    const isWritable = this.handler.writeFile !== undefined;
    if (!isWritable && (flags.includes('w') || flags.includes('a'))) {
      throw new Error(`Write operations not allowed for ${this.handler.type}`);
    }

    // TODO add flags to handler definition
    if (
      flags.includes('x') &&
      this.handler.type !== 'gitBranchFileVirtualFile' &&
      this.handler.type !== 'claudeVirtualSessionFileVirtualFile'
    ) {
      throw new Error(
        `Exclusive operations not allowed for ${this.handler.type}`
      );
    }

    const author = await this.getAuthor();
    const routeParams = this.getRouteParams();
    const fileFromGit = await this.handler.getFile({
      cacheFs: this.memFs,
      filePath,
      userSpaceFs: this.compositeFs,

      pathParams: routeParams,
      author: author,
    });

    let fileExistsInCache = false;
    for (const fh of Object.values(this.openFh)) {
      if (fh.path === filePath) {
        fileExistsInCache = true;
      }
    }

    // assert flags / file existence state
    if ((fileFromGit || fileExistsInCache) && flags.includes('x')) {
      throw Object.assign(
        new Error(`EEXIST: file already exists, open '${filePath}'`),
        { code: 'EEXIST', errno: -17, syscall: 'open', path: filePath }
      );
    }

    if (
      !fileFromGit &&
      !fileExistsInCache &&
      !(flags.includes('w') || flags.includes('a'))
    ) {
      // in case the file doesnt exist but planned to
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, open '${filePath}'`),
        { code: 'ENOENT', errno: -2, syscall: 'open', path: filePath }
      );
    }

    // Ensure parent directories exist in memfs
    const dir = path.dirname(filePath);
    await this.memFs.promises.mkdir(dir, { recursive: true });

    // Write the virtual file content to memfs if the file existed
    if (
      (fileFromGit === undefined && !flags.includes('x')) ||
      (fileFromGit && fileFromGit.type === 'file')
    ) {
      try {
        const access = await this.memFs.promises.access(filePath);
      } catch (err) {
        // file did not exist - create it
        await this.memFs.promises.writeFile(
          filePath,
          '' // we start with an empty string and use the memfs file only as placeholder
        );
      }
    }

    const fh = await this.memFs.promises.open(filePath, flags, mode);
    const fd = fh.fd;
    const filehandle = new CompositFsFileHandle({
      fs: this,
      compositeFs: this.compositeFs,
      subFsFileDescriptor: fd,
      parentFsFileDescriptors: [],
    });
    this.openFh[fd] = {
      path: filePath,
      mode: flags,
      fh: fh,
      // NOTE consider using empty content sha instead of undefined
      openSha: fileFromGit?.oid,
      readSha: undefined,
      unflushed: [],
    };
    if (flags.includes('x') || flags.includes('w')) {
      // NOTE workaround for created files that don't exist in the git history yet
      // Added to allow stats call (that is used in the create call) that is not aware of the open flags
      // to return the stats from the memory file
      this.openFh[fd].unflushed.push({
        length: 0,
        start: 0,
      });
    }
    return filehandle;
  }

  override async mkdir(
    path: PathLike,
    options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null
  ): Promise<void> {
    const pathStr = path.toString();
    const routeParams = this.getRouteParams();

    const optionsToPass = options ? { options: options } : {};

    try {
      const author = await this.getAuthor();
      await this.handler.mkdir({
        cacheFs: this.memFs,
        filePath: path.toString(),
        userSpaceFs: this.compositeFs,

        pathParams: routeParams,
        ...optionsToPass,
        author: author,
      });

      const optionsToPassToMemfs =
        typeof options === 'object'
          ? { ...options, recursive: true }
          : { recursive: true };

      await this.memFs.promises.mkdir(path, optionsToPassToMemfs);
      // Create file handles for every folder on the path
      const parts = pathStr.split('/');
      let current = '';
      for (let i = 1; i <= parts.length; i++) {
        current = parts.slice(0, i).join('/');
        // Only create if not already open and is a directory
        try {
          const stats = await this.memFs.promises.stat(current);
          if (stats.isDirectory()) {
            const fh = await this.memFs.promises.open(current, 'r');
            this.openFh[fh.fd] = {
              path: current,
              mode: 'r',
              fh: fh,
              openSha: undefined,
              readSha: undefined,
              unflushed: [],
            };
          }
        } catch {
          // Ignore if not exists or not a directory
        }
      }
    } catch (e) {
      throw e;
    }
  }

  override async access(path: PathLike, mode?: number): Promise<void> {
    // for now just use the stats call
    await this.stat(path);
  }

  override async futimes(
    fh: CompositFsFileHandle,
    atime: TTime,
    mtime: TTime
  ): Promise<void> {
    const openFh = this.openFh[fh.subFsFileDescriptor];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }
    return await openFh.fh.utimes(atime, mtime);
  }

  override async fstat(
    fh: CompositFsFileHandle,
    options?: IStatOptions
  ): Promise<IStats> {
    const openFh = this.openFh[fh.subFsFileDescriptor];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }
    // TODO get the stats from the filehandles path instead?
    return this.stat(openFh.path, options);
  }

  override async ftruncate(
    fh: CompositFsFileHandle,
    len?: number
  ): Promise<void> {
    const openFh = this.openFh[fh.subFsFileDescriptor];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }
    openFh.unflushed.push({
      length: 0,
      start: 0,
    });
    return await openFh.fh.truncate(len);
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
    const pathStr = path.toString();

    // Check if there is an open file handle for this path
    const openFhEntry = Object.values(this.openFh).find(
      fh => fh.path === pathStr && fh.unflushed.length > 0
    );
    if (openFhEntry && openFhEntry.unflushed.length > 0) {
      return (await openFhEntry.fh.stat(opts)) as any; // TODO fix type
    }

    const routeParams = this.getRouteParams();
    const author = await this.getAuthor();
    const stats = await this.handler.getStats({
      cacheFs: this.memFs,
      filePath: pathStr,
      userSpaceFs: this.compositeFs,

      pathParams: routeParams,
      author,
    });

    return stats;
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
    return this.stat(path, opts);
  }

  override async readdir(
    path: PathLike,
    options?:
      | (nodeFs.ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        })
      | BufferEncoding
      | null
  ): Promise<string[]>;
  override async readdir(
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
  override async readdir(
    path: PathLike,
    options?:
      | (nodeFs.ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        })
      | BufferEncoding
      | null
  ): Promise<string[] | Buffer[]>;
  override async readdir(
    path: PathLike,
    options: nodeFs.ObjectEncodingOptions & {
      withFileTypes: true;
      recursive?: boolean | undefined;
    }
  ): Promise<nodeFs.Dirent[]>;
  override async readdir(
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
    const pathStr = path.toString();

    const routeParams = this.getRouteParams();
    const siblings = this.getStaticSiblings();
    const author = await this.getAuthor();
    const result = await this.handler.getFile({
      cacheFs: this.memFs,
      filePath: pathStr,
      userSpaceFs: this.compositeFs,

      pathParams: routeParams,
      author,
    });

    if (result) {
      if (result.type !== 'directory') {
        throw new Error('not a folder');
      }

      // Merge siblings and entries, remove duplicates, and sort POSIX-style
      const allFolders = Array.from(
        new Set([
          ...result.content,
          ...siblings.map(s =>
            toDirEntry({
              name: s.segment,
              parent: pathStr,
              isDir: s.type === 'folder',
            })
          ),
        ])
      ).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );

      // @ts-ignore
      if (options?.withFileTypes) {
        // TODO implement Dirent return type
        return allFolders;
      }
      return allFolders.map(entry => entry.name);
    }

    return [];
  }

  // write not implemented - we do this when we implement branches

  override async read(
    fh: CompositFsFileHandle,
    buffer: Buffer | Uint8Array,
    offset: number,
    length: number,
    position: number
  ): Promise<TFileHandleReadResult> {
    const subFsFd = fh.subFsFileDescriptor;
    const openFh = this.openFh[subFsFd];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }

    // if there is no unflushed change - read the object directly from git
    if (openFh.unflushed.length === 0) {
      const routeParams = this.getRouteParams();
      const author = await this.getAuthor();
      const fileFromHandler = await this.handler.getFile({
        cacheFs: this.memFs,
        filePath: openFh.path,
        userSpaceFs: this.compositeFs,

        pathParams: routeParams,
        author,
      });

      if (!fileFromHandler?.content) {
        throw new Error('couldnt access content');
      }

      if (fileFromHandler.type !== 'file') {
        throw new Error('not a file');
      }

      const contentBuffer =
        typeof fileFromHandler.content === 'string'
          ? Buffer.from(fileFromHandler.content)
          : fileFromHandler.content;
      const start = typeof position === 'number' ? position : 0;
      const end = Math.min(start + length, contentBuffer.length);
      const bytesToRead = Math.max(0, end - start);

      contentBuffer.copy(buffer, offset, start, start + bytesToRead);

      return { bytesRead: bytesToRead, buffer };
    }

    // read the state from memfs that is used as write surface
    return await openFh.fh.read(buffer, offset, length, position);
  }

  /**
   *
   * Writes (parts) of a buffer to a specific position in the file
   *
   * - a write leads to a new commit and on flush since the point in time a flush may occur may vary a read operation may
   *  not see changed done on the read lays.
   *
   *
   * @param fh
   * @param buffer
   * @param offset
   * @param length
   * @param position
   * @returns
   */
  override async write(
    fh: CompositFsFileHandle,
    buffer: Buffer | ArrayBufferView | DataView,
    offset?: number,
    length?: number,
    position?: number
  ): Promise<TFileHandleWriteResult> {
    const openFh = this.openFh[fh.subFsFileDescriptor];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }

    // Check if the file was opened with write permissions
    const flags = openFh.mode;
    if (!flags.includes('w') && !flags.includes('a') && !flags.includes('+')) {
      throw Object.assign(new Error(`EBADF: bad file descriptor, write`), {
        code: 'EBADF',
        errno: -9,
        syscall: 'write',
      });
    }

    if (openFh.unflushed.length === 0) {
      // no write was excuted before -> read the file first
      // NOTE for no we realize the whole file

      const routeParams = this.getRouteParams();
      const author = await this.getAuthor();
      const fileFromGit = await this.handler.getFile({
        cacheFs: this.memFs,
        filePath: openFh!.path,
        userSpaceFs: this.compositeFs,

        pathParams: routeParams,
        author: author,
      });

      if (fileFromGit && fileFromGit.oid) {
        // update the memFs content to represent the git content
        await this.memFs.promises.writeFile(
          openFh.path,
          fileFromGit.content as string
        );
        openFh.readSha = fileFromGit.oid;
      }
    }

    // Write to the memfs file handle
    const result = await openFh.fh.write(buffer, offset, length, position);

    const setOffset = offset ?? 0;
    const startPos = position ?? 0;

    // Mark as dirty by adding the written range to unflushed
    openFh.unflushed.push({
      start: startPos,
      length: length ? length : buffer.byteLength - setOffset + startPos,
    });

    return result;
  }

  override async close(fh: CompositFsFileHandle): Promise<void> {
    const subFsFd = fh.subFsFileDescriptor;
    const openFh = this.openFh[subFsFd];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }

    try {
      await this.dataSync(fh);
      await openFh.fh.close();
    } finally {
      delete this.openFh[subFsFd];
    }
  }

  override async dataSync(fh: CompositFsFileHandle): Promise<void> {
    const subFsFd = fh.subFsFileDescriptor;
    const openFh = this.openFh[subFsFd];

    if (!openFh) {
      throw new Error('Invalid file handle');
    }

    if (openFh.unflushed.length > 0) {
      // File was written to, need to commit changes to git
      if (this.handler.writeFile) {
        // Read the content from memfs
        const content = await this.memFs.promises.readFile(openFh.path);

        // Write to git using the virtual file descriptor
        const routeParams = this.getRouteParams();
        const author = await this.getAuthor();
        await this.handler.writeFile({
          cacheFs: this.memFs,
          filePath: openFh.path,
          userSpaceFs: this.compositeFs,

          content: content,
          pathParams: routeParams,
          author: author,
        });
      }

      // remove the write cache
      openFh.unflushed = [];
    }
  }

  override async readFile(
    path: PathLike | IFileHandle,
    options?: IReadFileOptions | string
  ): Promise<TDataOut> {
    // Convert path to string
    const pathStr =
      typeof path === 'string'
        ? path
        : Buffer.isBuffer(path)
          ? path.toString()
          : (path as IFileHandle).fd
            ? `FileHandle(${(path as IFileHandle).fd})`
            : path.toString();

    // Extract encoding from options
    let encoding: BufferEncoding | null = null;

    if (typeof options === 'string') {
      encoding = options as BufferEncoding;
    } else if (options && typeof options === 'object') {
      if (options.encoding) encoding = options.encoding as BufferEncoding;
    }

    // Open the file for reading
    const fh = await this.open(pathStr, 'r');

    try {
      // Get the file stats to know the size
      const stats = await this.fstat(fh);
      const size = stats.size;

      // Create a buffer to read the entire file
      // @ts-expect-error -- we only support number for now big int follows later
      const buffer = Buffer.alloc(size);

      // Read the entire file
      // @ts-expect-error -- we only support number for now big int follows later
      await this.read(fh, buffer, 0, size, 0);

      // Close the file handle
      await this.close(fh);

      // Return the content with proper encoding
      if (encoding) {
        return buffer.toString(encoding);
      }
      return buffer;
    } catch (error) {
      // Make sure to close the file handle even if read fails
      try {
        await this.close(fh);
      } catch (closeError) {
        // Ignore close errors
      }
      throw error;
    }
  }

  override async writeFile(
    path: string,
    data: TData,
    options: IWriteFileOptions | string
  ): Promise<void> {
    // Extract flags and encoding from options
    let flags = 'w';
    let encoding: BufferEncoding = 'utf8';
    let mode: number | undefined;

    if (typeof options === 'string') {
      encoding = options as BufferEncoding;
    } else if (options && typeof options === 'object') {
      if (options.flag) flags = String(options.flag);
      if (options.encoding) encoding = options.encoding as BufferEncoding;
      if (options.mode)
        mode =
          typeof options.mode === 'string'
            ? parseInt(options.mode, 8)
            : options.mode;
    }

    // Open the file with the extracted flags
    const fh = await this.open(path, flags, mode);

    try {
      // Convert data to Buffer if needed
      let buffer: Buffer;
      if (typeof data === 'string') {
        buffer = Buffer.from(data, encoding);
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
      } else if (data instanceof Uint8Array) {
        buffer = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        buffer = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buffer = Buffer.from(data as any);
      }

      // Write the data using the write method
      await this.write(fh, buffer, 0, buffer.length, 0);
    } finally {
      // Make sure to close the file handle even if write fails
      await this.close(fh);
    }
  }

  override async rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
    const oldPathStr = oldPath.toString();
    const newPathStr = newPath.toString();

    // Get the new context for newPath (might have different route params)
    // For now, we use the current handler and assume old/new paths are compatible
    // TODO: Handle cross-adapter renames properly

    // Check if handler supports rename
    if (!this.handler.rename) {
      throw new Error(`Rename not supported for ${this.handler.type} files`);
    }
    // open question how do we want to deal with flushing?
    // a rename leads to a commit independent from open writes!?

    const newExistsInMemory = await this.memFs.promises
      .access(newPathStr)
      .then(() => true)
      .catch(() => false);

    const newExistsInBranch = await this.stat(newPathStr)
      .then(() => true)
      .catch(() => false);

    const oldExistsInBranch = await this.stat(oldPathStr)
      .then(() => true)
      .catch(() => false);

    const oldExistsInMemory = await this.memFs.promises
      .access(oldPathStr)
      .then(() => true)
      .catch(() => false);

    // id

    // todo check if the source file exists in memory
    // todo check if the target file exists in memory

    if (oldExistsInMemory) {
      // Ensure the target directory exists
      const targetDir = path.dirname(newPathStr);
      try {
        await this.memFs.promises.access(targetDir);
      } catch {
        await this.memFs.promises.mkdir(targetDir, { recursive: true });
      }
      await this.memFs.promises.rename(oldPath, newPath);
    }

    const routeParams = this.getRouteParams();
    const author = await this.getAuthor();
    await this.handler.rename({
      cacheFs: this.memFs,
      filePath: oldPathStr,
      userSpaceFs: this.compositeFs,

      newPath: newPathStr,
      pathParams: routeParams,
      newPathParams: this.newContext?.params || {}, // TODO: Extract new path params
      author,
    });

    // } else if (oldParsed.type === "branch-file" && !newParsed.isLegitPath) {
    // Branch file to regular file - extract from branch
    // await this.extractBranchFileToRegular(oldPathStr, newPathStr, oldParsed);
    // } else if (!oldParsed.isLegitPath && newParsed.type === "branch-file") {
    // Regular file to branch file - add to branch
    // await this.addRegularFileToBranch(oldPathStr, newPathStr, newParsed);
  }

  override async fchmod(fh: CompositFsFileHandle, mode: TMode): Promise<void> {
    // noop
  }

  override async unlink(path: PathLike): Promise<void> {
    const pathStr = path.toString();

    if (!this.handler.unlink) {
      throw new Error(`Cannot unlink ${this.handler.type} files`);
    }
    try {
      const routeParams = this.getRouteParams();
      const author = await this.getAuthor();
      await this.handler.unlink({
        cacheFs: this.memFs,
        filePath: pathStr,
        userSpaceFs: this.compositeFs,

        pathParams: routeParams,
        author,
      });
    } catch (err) {
      // if the file was only written i memory unlink will fail
      let unflused = false;
      for (const [fd, fh] of Object.entries(this.openFh)) {
        if (fh.path === pathStr && fh.unflushed.length > 0) {
          unflused = true;
        }
      }
      if (!unflused) {
        throw err;
      }
    } finally {
      let existsInMem = false;
      for (const [fd, fh] of Object.entries(this.openFh)) {
        if (fh.path === pathStr) {
          existsInMem = true;
          await fh.fh.close();
          delete this.openFh[Number(fd)];
        }
      }
      if (existsInMem) {
        // file existed in memory and was removed
        await this.memFs.promises.unlink(pathStr);
      }
    }
  }

  override async rmdir(path: PathLike, ...args: any[]): Promise<void> {
    const pathStr = path.toString();

    if (!this.handler.rmdir) {
      throw new Error(`Cannot rmdir ${this.handler.type} directories`);
    }
    const routeParams = this.getRouteParams();
    const author = await this.getAuthor();
    await this.handler.rmdir({
      cacheFs: this.memFs,
      filePath: pathStr,
      userSpaceFs: this.compositeFs,

      pathParams: routeParams,
      author,
    });
    let existsInMem = false;
    for (const [fd, fh] of Object.entries(this.openFh)) {
      if (fh.path === pathStr) {
        existsInMem = true;
        await fh.fh.close();
        delete this.openFh[Number(fd)];
      }
    }
    if (existsInMem) {
      // file existed in memory and was removed
      await this.memFs.promises.rmdir(pathStr, { recursive: true });
    }
  }

  fileType(): number {
    return 10; // Unique type for GitLegitVirtualFileSubFs
  }
}
