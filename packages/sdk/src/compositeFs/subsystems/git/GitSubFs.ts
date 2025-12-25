import git from 'isomorphic-git';
import { CompositeSubFs } from '../../CompositeSubFs.js';
import CompositFsFileHandle from '../../CompositeFsFileHandle.js';
import * as path from 'path';

import { createFsFromVolume, IFs, memfs, Volume } from 'memfs';
import {
  IStats,
  TFileHandleReadResult,
  TFileHandleWriteResult,
  TTime,
} from 'memfs/lib/node/types/misc.js';
import { CompositeFs } from '../../CompositeFs.js';
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
} from '../../../types/fs-types.js';

import { BaseCompositeSubFs } from '../BaseCompositeSubFs.js';
import * as nodeFs from 'node:fs';

import {
  LegitPathRouter,
  LegitRouteFolder,
  MatchResult,
} from './LegitPathRouter.js';
import { toDirEntry } from './virtualFiles/utils.js';

const stub = async () => undefined;
const stubStats = async () =>
  ({
    isFile: () => true,
    isDirectory: () => false,
    size: 0,
    mode: 0,
    mtime: new Date(),
    ctime: new Date(),
    atime: new Date(),
    birthtime: new Date(),
  }) as any;

const noAdditionalFiles = {
  type: 'directory',
  pattern: /.*/,
  getFile: stub,
  getStats: stubStats,
  rename: stub,
  mkdir: stub,
};

/**
 * Topics to discuss:
 * # Ref space polution
 *  - Local vs Remote (we dont push all refs all the time)
 *  - required refs (what are the miniumum refs required to keep the repo healthy)
 *  - ref branch concept (branch pointing to oids to keep refs alive withouth poluting refs)
 *
 * # Performance (we tackle whens appear)
 *  - Git operations (especially history traversal) can be expensive
 *  - Current memfs caching might not scale for large repos
 *  - Consider lazy loading and bounded caches
 */

/**
 * Git-backed CompositeSubFs implementation.
 *
 *
 * docx file
 *  - we unpack the docx and store xml files as blobs in git
 * mpeg file
 *  - we chunk the file and sstsore chunks as blobs in git
 **/
export class GitSubFs extends BaseCompositeSubFs implements CompositeSubFs {
  private static readonly LEGIT_DIR = '.legit';

  private pathRouter: LegitPathRouter;

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

  async getAuthor(): Promise<{
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

  protected gitRoot: string;

  constructor({
    name,
    parentFs,
    gitStorageFs,
    gitRoot,
    routerConfig,
  }: {
    name: string;
    parentFs: CompositeFs;
    gitStorageFs: any;
    gitRoot: string;
    routerConfig: LegitRouteFolder;
  }) {
    super({ name, parentFs });

    this.pathRouter = new LegitPathRouter(routerConfig);

    this.gitRoot = gitRoot;
    this.storageFs = gitStorageFs;
    this.memFs = createFsFromVolume(new Volume());
  }

  async responsible(filePath: string): Promise<boolean> {
    return true;
    // return true this.isLegitPath(filePath);
  }

  private getRouteHandler(filePath: string): MatchResult | undefined {
    // Remove gitRoot prefix from filePath if present
    let normalizedPath = filePath;
    if (this.gitRoot && filePath.startsWith(this.gitRoot)) {
      if (this.gitRoot === '/') {
        normalizedPath = filePath.slice(this.gitRoot.length);
      } else {
        normalizedPath = filePath.slice(this.gitRoot.length + 1);
      }
    }
    const firstLegitIndex = normalizedPath.indexOf(`/${GitSubFs.LEGIT_DIR}`);
    if (firstLegitIndex === -1) {
      return this.pathRouter.match(normalizedPath);
    }

    const filePathWithoutLegit = normalizedPath.slice(firstLegitIndex + 1);
    return this.pathRouter.match(normalizedPath);
  }

  /**
   * Opens a virtual file from the Git-based virtual file system.
   *
   * This method retrieves a virtual file descriptor for the given `filePath`, checks if the file is writable
   * based on its type and the provided `flags`, and ensures that write operations are only allowed for
   * certain file types (e.g., "branch-file", "branch-head", "branch-tip"). It then loads the file's content
   * into the in-memory file system (`memFs`), ensures parent directories exist, and finally opens the file,
   * returning a `CompositFsFileHandle` for further operations.
   *
   * @param filePath - The path to the virtual file to open.
   * @param flags - The file system flags indicating the desired open mode (e.g., "r" for read, "w" for write, "a" for append, "x" for exclusive creation).
   *   - "r": Open file for reading. An exception occurs if the file does not exist.
   *   - "w": Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
   *   - "a": Open file for appending. The file is created if it does not exist.
   *   - "x": Exclusive flag. Used with "w" or "a" to fail if the file exists.
   *   - Combinations like "wx", "ax", etc., are also supported.
   * @param mode - Optional file mode (permission and sticky bits) to use if creating a file.
   * @returns A promise that resolves to a `CompositFsFileHandle` for the opened file.
   * @throws If the file is not a virtual legit file, if write operations are not allowed for the file type,
   *         or if the file does not exist.
   */
  override async open(
    filePath: string,
    flags: string,
    mode?: number
  ): Promise<CompositFsFileHandle> {
    const parsed = this.getRouteHandler(filePath);
    if (!parsed) throw new Error('Not a virtual legit file');
    const isWritable = parsed?.handler.writeFile !== undefined;
    if (!isWritable && (flags.includes('w') || flags.includes('a'))) {
      throw new Error(
        `Write operations not allowed for ${parsed?.handler.type}`
      );
    }

    // TODO add flags to handler definition
    if (
      flags.includes('x') &&
      parsed?.handler.type !== 'gitBranchFileVirtualFile' &&
      parsed?.handler.type !== 'claudeVirtualSessionFileVirtualFile'
    ) {
      throw new Error(
        `Exclusive operations not allowed for ${parsed?.handler.type}`
      );
    }

    const author = await this.getAuthor();
    const fileFromGit = await parsed.handler.getFile({
      cacheFs: this.memFs,
      filePath,
      userSpaceFs: this.compositFs,
      gitRoot: this.gitRoot,
      nodeFs: this.storageFs,
      pathParams: parsed.params,
      author: author,
    });

    let fileExistsInCache = false;
    for (const fh of Object.values(this.openFh)) {
      if (fh.path === filePath) {
        fileExistsInCache = true;
      }
    }

    // fileFromFs
    // this.memFs.promises.

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
      compositeFs: this.compositFs,
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
    const branchFileVf = this.getRouteHandler(pathStr);

    const optionsToPass = options ? { options: options } : {};

    try {
      const author = await this.getAuthor();
      await branchFileVf?.handler.mkdir({
        cacheFs: this.memFs,
        filePath: path.toString(),
        userSpaceFs: this.compositFs,
        nodeFs: this.storageFs,
        gitRoot: this.gitRoot,
        pathParams: branchFileVf.params,
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

    const parsed = this.getRouteHandler(pathStr);

    if (!parsed) {
      throw new Error(`ENOENT: no such file or directory, stat '${pathStr}'`);
    }

    const author = await this.getAuthor();
    const stats = await parsed.handler.getStats({
      cacheFs: this.memFs,
      filePath: pathStr,
      userSpaceFs: this.compositFs,
      gitRoot: this.gitRoot,
      nodeFs: this.storageFs,
      pathParams: parsed.params,
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

    // if (!this.isLegitPath(pathStr)) {
    //   return ['.legit'] as string[];
    // }

    const parsed = this.getRouteHandler(pathStr);

    if (!parsed) {
      throw new Error(
        `ENOENT: no such file or directory, scandir '${pathStr}'`
      );
    }

    const author = await this.getAuthor();
    const result = await parsed?.handler.getFile({
      cacheFs: this.memFs,
      filePath: pathStr,
      userSpaceFs: this.compositFs,
      gitRoot: this.gitRoot,
      nodeFs: this.storageFs,
      pathParams: parsed.params,
      author,
    });

    if (result) {
      if (result.type !== 'directory') {
        throw new Error('not a folder');
      }

      const siblings = parsed?.staticSiblings ?? [];

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

    // // TODO return an empty file if it was just created

    // if (openFh.openSha === undefined) {
    //   if (fileFromGit === undefined) {
    //     // file didn't extist on open and still doesnt exist
    //     return await openFh.fh.read(buffer, offset, length, position);
    //   } else {
    //     // file didn't exist on open but does now?
    //     // 1. file was written in the meantime
    //     // 2. same file was created in the meantime - via pull?
    //   }
    // } else if (openFh.openSha === fileFromGit?.oid) {
    //   // git hasn't changed yet
    //   if (openFh.readSha === undefined) {
    //     // TODO realize the file and return it
    //   } else if (openFh.readSha === fileFromGit?.oid) {
    //     // cool - use the cache
    //     return await openFh.fh.read(buffer, offset, length, position);
    //   } else {
    //     // ok the file has changed in git
    //     if (openFh.unflushed.length > 0) {
    //       // writes have taken place but also changes in git appeared
    //       // TODO what to return?
    //       // Option A: the curent written file from cache - flush will win
    //       // Option B: the state from git -> unflushed changes gonna loose
    //       // Option C: merge the state from git with the unflushed changes?
    //     } else {
    //     }
    //   }
    // }

    // if there is no unflushed change - read the object directly from git
    if (openFh.unflushed.length === 0) {
      const parsed = this.getRouteHandler(openFh.path);
      const author = await this.getAuthor();
      const fileFromGit = await parsed!.handler.getFile({
        cacheFs: this.memFs,
        filePath: openFh.path,
        userSpaceFs: this.compositFs,
        gitRoot: this.gitRoot,
        nodeFs: this.storageFs,
        pathParams: parsed?.params,
        author,
      });

      if (!fileFromGit?.content) {
        throw new Error('couldnt access content');
      }

      if (fileFromGit.type !== 'file') {
        throw new Error('not a file');
      }

      const contentBuffer =
        typeof fileFromGit.content === 'string'
          ? Buffer.from(fileFromGit.content)
          : fileFromGit.content;
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

      const parsed = this.getRouteHandler(openFh.path);
      const author = await this.getAuthor();
      const fileFromGit = await parsed!.handler.getFile({
        cacheFs: this.memFs,
        filePath: openFh!.path,
        userSpaceFs: this.compositFs,
        gitRoot: this.gitRoot,
        nodeFs: this.storageFs,
        pathParams: parsed!.params,
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
      const pathHandler = this.getRouteHandler(openFh.path);
      if (pathHandler && pathHandler.handler.writeFile) {
        // Read the content from memfs
        const content = await this.memFs.promises.readFile(openFh.path);

        // Write to git using the virtual file descriptor
        const author = await this.getAuthor();
        await pathHandler.handler.writeFile({
          cacheFs: this.memFs,
          filePath: openFh.path,
          userSpaceFs: this.compositFs,
          gitRoot: this.gitRoot,
          nodeFs: this.storageFs,
          content: content,
          pathParams: pathHandler.params,
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

    const oldParsed = this.getRouteHandler(oldPathStr);
    const newParsed = this.getRouteHandler(newPathStr);

    // Check if both paths are branch files
    if (
      oldParsed?.handler.type === 'gitBranchFileVirtualFile' &&
      newParsed?.handler.type === 'gitBranchFileVirtualFile'
    ) {
      // open question how do we want to deal with flushing?
      // a rename leads to a commit independent from open writes!?

      let newExistsInMemory = true;
      try {
        await this.memFs.promises.access(newPathStr);
      } catch (e) {
        newExistsInMemory = false;
      }

      let newExistsInBranch = true;
      try {
        await this.stat(newPathStr);
      } catch (e) {
        newExistsInBranch = false;
      }

      let oldExistsInBranch = true;
      try {
        await this.stat(oldPathStr);
      } catch (e) {
        oldExistsInBranch = false;
      }

      let oldExistsInMemory = true;
      try {
        await this.memFs.promises.access(oldPathStr);
      } catch (e) {
        oldExistsInMemory = false;
      }

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

      const branchFileVf = this.getRouteHandler(oldPathStr);
      if (!branchFileVf) {
        throw new Error('VF not found');
      }

      const author = await this.getAuthor();
      const result = await branchFileVf.handler.rename({
        cacheFs: this.memFs,
        filePath: oldPathStr,
        userSpaceFs: this.compositFs,
        gitRoot: this.gitRoot,
        nodeFs: this.storageFs,
        newPath: newPathStr,
        pathParams: branchFileVf?.params ?? {},
        newPathParams: newParsed?.params ?? {},
        author,
      });

      // } else if (oldParsed.type === "branch-file" && !newParsed.isLegitPath) {
      // Branch file to regular file - extract from branch
      // await this.extractBranchFileToRegular(oldPathStr, newPathStr, oldParsed);
      // } else if (!oldParsed.isLegitPath && newParsed.type === "branch-file") {
      // Regular file to branch file - add to branch
      // await this.addRegularFileToBranch(oldPathStr, newPathStr, newParsed);
    } else {
      throw new Error(
        `Unsupported rename operation from ${oldParsed?.handler.type} to ${newParsed?.handler.type}`
      );
    }
  }

  override async fchmod(fh: CompositFsFileHandle, mode: TMode): Promise<void> {
    // noop
  }

  override async unlink(path: PathLike): Promise<void> {
    const pathStr = path.toString();

    const parsed = this.getRouteHandler(pathStr);

    if (parsed?.handler.unlink !== undefined) {
      try {
        const author = await this.getAuthor();
        await parsed.handler.unlink({
          cacheFs: this.memFs,
          filePath: pathStr,
          userSpaceFs: this.compositFs,
          nodeFs: this.storageFs,
          gitRoot: this.gitRoot,
          pathParams: parsed.params,
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
    } else {
      throw new Error(`Cannot unlink ${parsed?.handler.type} files`);
    }
  }

  override async rmdir(path: PathLike, ...args: any[]): Promise<void> {
    const pathStr = path.toString();

    const parsed = this.getRouteHandler(pathStr);

    if (parsed?.handler.rmdir !== undefined) {
      const author = await this.getAuthor();
      await parsed.handler.rmdir({
        cacheFs: this.memFs,
        filePath: pathStr,
        userSpaceFs: this.compositFs,
        nodeFs: this.storageFs,
        gitRoot: this.gitRoot,
        pathParams: parsed.params,
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
    } else {
      throw new Error(`Cannot rmdir 
       ${parsed?.handler.type} directories`);
    }
  }

  fileType(): number {
    return 10; // Unique type for GitLegitVirtualFileSubFs
  }
}
