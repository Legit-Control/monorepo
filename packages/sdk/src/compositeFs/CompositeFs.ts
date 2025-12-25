import * as nodeFs from 'node:fs';

import * as path from 'path';
import CompositFsFileHandle from './CompositeFsFileHandle.js';
import { CompositeSubFs } from './CompositeSubFs.js';
import { CompositeFsDir } from './CompositeFsDir.js';
import { IStats } from 'memfs/lib/node/types/misc.js';
import { FsOperationLogger } from './utils/fs-operation-logger.js';

/**
 *
 * The CompositFs handles distribution of file operations to its sub filesystems and keeps track of open file handles.
 * 
 * open() returns a CompositFsFileHandle that wraps the real filehandle from the responsible SubFs and allows
 * to forward operations
 *
 * Each SubFs determines if it is responsible for a given path. The Composite fs probes each subsystem for responsibility.
 *
 * The responisbility is probed in the following order:
 *
 * hiddenFilesFileSystem -> ephemeralFilesFileSystem -> other subFs in order of addition -> passThroughFileSystem
 *
 * Composit fs consists of two special sub filesystems:
 *
 * HiddenFilesSubFs - a filesystem that makes files inaccessible from the user
 *   -> this is useful if you want to protect files like .git from being accessed or modified by the user
 *
 * EphemeralFilesSubFs - a filesystem that provides files that only exist in memory and are not persisted
 *   -> this is usefull when you mount the compositfs as a Network drive for example via NFS to provide a space OS specific User files like .DS_
 *
 * Beyond those special subsystems additional systems cann be plugged in - the order matters
 * and "the other" sub systems added via addSubFs
 *
 
 * 
 * Renames over subfs bounderies are are managed by this fs
 * 
 * writeFile and readFile open a short living filehandle to execute the operations
 * 
 * 
 */
export class CompositeFs {
  promises: {
    access: (filePath: string, mode?: number) => Promise<void>;
    opendir: (
      dirPath: nodeFs.PathLike,
      options?: nodeFs.OpenDirOptions
    ) => Promise<CompositeFsDir>;
    mkdir: (dirPath: string, options?: any) => Promise<void>;
    readdir: {
      (
        dirPath: nodeFs.PathLike,
        options?: string | { withFileTypes?: false }
      ): Promise<string[]>;

      (
        dirPath: nodeFs.PathLike,
        options: { withFileTypes: true }
      ): Promise<nodeFs.Dirent[]>;
    };
    open: (
      filePath: string,
      flags: string,
      mode?: number
    ) => Promise<CompositFsFileHandle>;
    stat: (
      path: nodeFs.PathLike,
      opts?: { bigint?: boolean }
    ) => Promise<nodeFs.Stats | nodeFs.BigIntStats>;
    lstat: (
      path: nodeFs.PathLike,
      opts?: { bigint?: boolean }
    ) => Promise<nodeFs.Stats | nodeFs.BigIntStats>;
    link: (
      existingPath: nodeFs.PathLike,
      newPath: nodeFs.PathLike
    ) => Promise<void>;
    readlink: (
      path: nodeFs.PathLike,
      options?: nodeFs.ObjectEncodingOptions | BufferEncoding | null
    ) => Promise<any>;
    unlink: (filePath: nodeFs.PathLike) => Promise<void>;
    rename: (
      oldPath: nodeFs.PathLike,
      newPath: nodeFs.PathLike
    ) => Promise<void>;
    rmdir: (
      dirPath: nodeFs.PathLike,
      options?: nodeFs.RmDirOptions
    ) => Promise<void>;
    symlink: (
      target: nodeFs.PathLike,
      path: nodeFs.PathLike,
      type?: string | null
    ) => Promise<void>;
    readFile: (typeof nodeFs.promises)['readFile'];
    writeFile: (
      file: nodeFs.PathOrFileDescriptor,
      data: string | Buffer | Uint8Array,
      options?: any
    ) => Promise<void>;
    getFilehandle: (fd: number) => CompositFsFileHandle | undefined;
  };
  ephemeralFilesFileSystem: CompositeSubFs | undefined;
  hiddenFilesFileSystem: CompositeSubFs | undefined;
  subFilesystems: CompositeSubFs[] = [];
  parentFs: CompositeFs | undefined;
  name: string;
  
  gitRoot: string;
  defaultBranch: string;
  gitCache: any;

  pathToFileDescriptors: Map<
    /** path */
    string,
    number[]
  > = new Map();

  openFileHandles: Map<number, CompositFsFileHandle> = new Map();
  logOperation: FsOperationLogger | undefined;

  private getNextFileDescriptor() {
    const fds = Array.from(this.openFileHandles.keys());
    return fds.length === 0 ? 1 : Math.max(...fds) + 1;
  }

  constructor({
    name,
    gitRoot,
    defaultBranch = 'main',
  }: {
    name: string;
    gitRoot: string;
    defaultBranch?: string;
  }) {
    this.name = name;
    this.gitRoot = gitRoot;
    this.defaultBranch = defaultBranch;

    this.promises = {
      access: this.access.bind(this),
      opendir: this.opendir.bind(this),
      mkdir: this.mkdir.bind(this),
      readdir: this.readdir.bind(this),
      open: this.open.bind(this),
      stat: this.stat.bind(this),
      lstat: this.lstat.bind(this),
      link: this.link.bind(this),
      readlink: this.readlink.bind(this),
      unlink: this.unlink.bind(this),
      rename: this.rename.bind(this),
      rmdir: this.rmdir.bind(this),
      symlink: this.symlink.bind(this),
      readFile: this.readFile.bind(this),
      writeFile: this.writeFile.bind(this),
      getFilehandle: this.getFilehandle.bind(this),
    } as any;

    return;
  }

  setLoggger(logger: FsOperationLogger | undefined) {
    this.logOperation = logger;
  }

  async logOperationOnFileDescsriptor(
    fd: CompositFsFileHandle,
    operation: string,
    args: any
  ) {
    if (!this.logOperation) {
      return;
    }

    const paths = [];
    for (const [filePath, fds] of this.pathToFileDescriptors.entries()) {
      if (fds.includes(fd.fd)) {
        paths.push(filePath);
      }
    }

    if (paths.length === 0) {
      return;
    }

    return this.logOperation?.({
      fsName: fd.delegate.name,
      fd,
      path: paths[0]!,
      operation,
      operationArgs: args,
    });
  }

  getFilehandle(fd: number) {
    return this.openFileHandles.get(fd);
  }

  setEphemeralFilesSubFs(subFs: CompositeSubFs) {
    this.ephemeralFilesFileSystem = subFs;
  }

  setHiddenFilesSubFs(subFs: CompositeSubFs) {
    this.hiddenFilesFileSystem = subFs;
  }

  addSubFs(subFs: CompositeSubFs) {
    this.subFilesystems.push(subFs);
  }

  /**
   * Helper function that takes a filePath and returns the sub fs that is responsible for it.
   * 
   * Order is: 
   * hidden -> if hidden no more questions - hide it! 
   * 
   * ephemeral -> file is marked as ephemeral *.DS_STORE and lock files - ignore if versioned at some point - always handle it as ephemeral
   * versioned -> 
   * nonVersioned -> files 
   * 
   * other subFs in order of addition -> passThrough
   * @param filePath
   * @returns
   */
  private async getResponsibleFs(filePath: nodeFs.PathLike) {
    if (
      !filePath.toString().startsWith(this.gitRoot) &&
      // TODO fix path for browserfs
      this.gitRoot !== './'
    ) {
      throw new Error(
        'tried to access a file (' +
          filePath +
          ') outside of the legit folder: ' +
          this.gitRoot
      );
    }

    if (!this.hiddenFilesFileSystem) {
      throw new Error(this.name + ' intialize hidden fs first!');
    }

    if (!this.ephemeralFilesFileSystem) {
      throw new Error(this.name + ' intialize ephemeral fs first!');
    }

    if (await this.hiddenFilesFileSystem.responsible(filePath.toString())) {
      return this.hiddenFilesFileSystem;
    }
    if (await this.ephemeralFilesFileSystem.responsible(filePath.toString())) {
      return this.ephemeralFilesFileSystem;
    }
    for (const fileSystem of this.subFilesystems) {
      if (await fileSystem.responsible(filePath.toString())) {
        return fileSystem;
      }
    }

    throw new Error('No sub filesystem responsible for ' + filePath);
  }

  async access(filePath: string, mode?: number) {
    const fsToUse = await this.getResponsibleFs(filePath);
    await this.logOperation?.({
      fsName: fsToUse.name,
      path: filePath,
      operation: 'access',
      operationArgs: { mode },
    });
    return fsToUse.access(filePath, mode);
  }

  async stat(
    path: nodeFs.PathLike,
    opts?: { bigint?: false }
  ): Promise<nodeFs.Stats>;
  async stat(
    path: nodeFs.PathLike,
    opts: { bigint: true }
  ): Promise<nodeFs.BigIntStats>;
  async stat(
    path: nodeFs.PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;
  async stat(
    path: nodeFs.PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats> {
    const pathStr = path.toString();

    const fsToUse = await this.getResponsibleFs(path);
    await this.logOperation?.({
      fsName: fsToUse.name,
      path: pathStr,
      operation: 'stat',
      operationArgs: { opts },
    });
    return fsToUse.stat(path);
  }

  async lstat(
    path: nodeFs.PathLike,
    opts?: { bigint?: false }
  ): Promise<nodeFs.Stats>;
  async lstat(
    path: nodeFs.PathLike,
    opts: { bigint: true }
  ): Promise<nodeFs.BigIntStats>;
  async lstat(
    path: nodeFs.PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;
  async lstat(
    path: nodeFs.PathLike,
    opts?: { bigint?: boolean }
  ): Promise<IStats<number> | IStats<bigint>> {
    const fsToUse = await this.getResponsibleFs(path);
    await this.logOperation?.({
      fsName: fsToUse.name,
      path: path.toString(),
      operation: 'lstat',
      operationArgs: { opts },
    });
    return fsToUse.lstat(path, opts);
  }

  async unlink(filePath: nodeFs.PathLike) {
    const fsToUse = await this.getResponsibleFs(filePath);
    await this.logOperation?.({
      fsName: fsToUse.name,
      path: filePath.toString(),
      operation: 'unlink',
      operationArgs: {},
    });

    // TODO shouldn't this also remove all open filehandles for this path?
    return fsToUse.unlink(filePath);
  }

  async mkdir(dirPath: string, options?: any) {
    const fsToUse = await this.getResponsibleFs(dirPath);
    await this.logOperation?.({
      fsName: fsToUse.name,
      path: dirPath.toString(),
      operation: 'mkdir',
      operationArgs: { options },
    });
    return fsToUse.mkdir(dirPath, options);
  }

  async rmdir(dirPath: nodeFs.PathLike, options?: nodeFs.RmDirOptions) {
    const fsToUse = await this.getResponsibleFs(dirPath);
    await this.logOperation?.({
      fsName: fsToUse.name,
      path: dirPath.toString(),
      operation: 'rmdir',
      operationArgs: { dirPath, options },
    });
    return fsToUse.rmdir(dirPath, options);
  }

  async opendir(
    dirPath: nodeFs.PathLike,
    options?: nodeFs.OpenDirOptions
  ): Promise<CompositeFsDir> {
    await this.logOperation?.({
      fsName: this.name,
      path: dirPath.toString(),
      operation: 'opendir',
      operationArgs: { options },
    });
    // Ensure the directory path is within gitRoot
    const dirPathStr = dirPath.toString();
    if (!dirPathStr.startsWith(this.gitRoot)) {
      throw new Error(
        'tried to access a directory (' +
          dirPathStr +
          ') outside of the legit folder: ' +
          this.gitRoot
      );
    }

    // Create and return a CompositeFsDir instance
    return new CompositeFsDir(this, dirPathStr);
  }

  /**
   * Read dir needs to check if one subfs takes control.
   *
   * @param dirPath
   * @param options
   * @returns
   */
  async readdir(dirPath: nodeFs.PathLike, options?: any) {
    await this.logOperation?.({
      fsName: this.name,
      path: dirPath.toString(),
      operation: 'readdir',
      operationArgs: { options },
    });
    // Create a Union of all files from the filesystems
    // NOTE - for the list of filenames only this is enought
    // -> for stats we need to skip files we already got from a previous subFs
    const fileNames: Set<string> = new Set<string>();
    for (const fileSystem of [...this.subFilesystems].reverse()) {
      const subFsdirEntries = await fileSystem.readdir(dirPath, options);
      for (const fileName of subFsdirEntries) {
        if (
          !(await this.ephemeralFilesFileSystem?.responsible(
            (dirPath == '/' ? '' : dirPath) + '/' + fileName
          ))
        ) {
          fileNames.add(fileName);
        }
      }
    }

    //
    try {
      const ephemeralEntries = await this.ephemeralFilesFileSystem!.readdir(
        dirPath,
        options
      );

      for (const fileName of ephemeralEntries) {
        fileNames.add(fileName);
      }
    } catch (err) {
      if ((err as unknown as any).code !== 'ENOENT') {
        throw new Error('error reading ephemeral fs: ' + err);
      }
    }

    for (const fileName of fileNames) {
      const fullPath = (dirPath == '/' ? '' : dirPath) + '/' + fileName;
      if (await this.hiddenFilesFileSystem!.responsible(fullPath)) {
        fileNames.delete(fileName);
      }
    }
    return Array.from(fileNames);
  }

  async open(filePath: string, flags: string, mode?: number) {
    const responsibleFs = await this.getResponsibleFs(filePath);
    await this.logOperation?.({
      fsName: responsibleFs.name,
      path: filePath,
      operation: 'open',
      operationArgs: { flags, mode },
    });
    const fileHandle = await responsibleFs.open(filePath, flags, mode);

    const nextDescriptor = this.getNextFileDescriptor();
    fileHandle.realize(nextDescriptor);
    this.openFileHandles.set(nextDescriptor, fileHandle);

    if (!this.pathToFileDescriptors.get(filePath)) {
      this.pathToFileDescriptors.set(filePath, []);
    }
    this.pathToFileDescriptors.get(filePath)!.push(nextDescriptor);
    return fileHandle;
  }

  async close(fh: CompositFsFileHandle): Promise<void> {
    try {
      await fh.delegate.close(fh);
    } catch (error) {
      throw error;
    } finally {
      for (const [filePath, handles] of this.pathToFileDescriptors.entries()) {
        const index = handles.indexOf(fh.fd);
        if (index !== -1) {
          handles.splice(index, 1);
          if (handles.length === 0) {
            this.pathToFileDescriptors.delete(filePath);
          }
          break;
        }
      }
      this.openFileHandles.delete(fh.fd);
    }
  }

  async link(existingPath: nodeFs.PathLike, newPath: nodeFs.PathLike) {
    throw new Error('not implemented');
  }

  async readlink(
    path: nodeFs.PathLike,
    options?: nodeFs.ObjectEncodingOptions | BufferEncoding | null
  ) {
    throw new Error('not implemented');
  }

  async rename(oldPath: nodeFs.PathLike, newPath: nodeFs.PathLike) {
    // Check if hidden filesystem is involved
    if (this.hiddenFilesFileSystem) {
      if (
        await this.hiddenFilesFileSystem.responsible(
          path.basename(oldPath.toString())
        )
      ) {
        throw new Error('Renaming of hidden Files is not allowed ' + oldPath);
      }
      if (
        await this.hiddenFilesFileSystem.responsible(
          path.basename(newPath.toString())
        )
      ) {
        throw new Error('Renaming to hidden Files is not allowed ' + newPath);
      }
    }

    // Get responsible filesystems for both paths
    const oldFs = await this.getResponsibleFs(oldPath);
    const newFs = await this.getResponsibleFs(newPath);

    // If both paths are in the same filesystem, use that filesystem's rename
    if (oldFs === newFs) {
      await this.logOperation?.({
        fsName: oldFs.name,
        path: oldPath.toString(),
        operation: 'rename',
        operationArgs: { oldPath, newPath },
      });
      return oldFs.rename(oldPath, newPath);
    }

    // Cross-filesystem rename: read from old, write to new, delete old
    const fh = await oldFs.open(oldPath.toString(), 'r');
    try {
      const stats = await oldFs.fstat(fh);
      const buffer = Buffer.alloc(stats.size as number);
      await oldFs.read(fh, buffer, 0, stats.size as number, 0);
      await oldFs.close(fh);

      // Write to new location
      await newFs.writeFile(newPath.toString(), buffer, 'utf8');

      // Delete from old location
      await oldFs.unlink(oldPath);
    } catch (error) {
      // Clean up on error
      try {
        await oldFs.close(fh);
      } catch (closeError) {
        // Ignore close errors
      }
      throw error;
    }
  }

  async symlink(
    target: nodeFs.PathLike,
    path: nodeFs.PathLike,
    type?: string | null
  ) {
    throw new Error('not implemented');
  }

  async readFile(
    path: nodeFs.PathOrFileDescriptor,
    options?: { encoding?: null; flag?: string } | null
  ): Promise<Buffer>;
  async readFile(
    path: nodeFs.PathOrFileDescriptor,
    options: { encoding: BufferEncoding; flag?: string } | BufferEncoding
  ): Promise<string>;
  async readFile(
    path: nodeFs.PathOrFileDescriptor,
    options?: any
  ): Promise<Buffer | string> {
    await this.logOperation?.({
      fsName: this.name,
      path: path.toString(),
      operation: 'readFile',
      operationArgs: { path, options },
    });
    let closeAfter = true;
    let fileHandle: CompositFsFileHandle;
    if (typeof path === 'number') {
      closeAfter = false;
      const fh = this.getFilehandle(path);
      if (!fh) {
        throw new Error('Invalid file descriptor');
      }
      fileHandle = fh;
    } else if (typeof path === 'string') {
      fileHandle = await this.open(path, 'r');
    } else {
      throw new Error('only filehandle and path are supported atm');
    }

    try {
      // Get file size
      const stat = await fileHandle.stat();
      let length = stat.size;
      if (typeof length === 'bigint') {
        if (length > BigInt(Number.MAX_SAFE_INTEGER)) {
          throw new Error('File too large to read into buffer');
        }
        length = Number(length);
      }
      const buffer = Buffer.alloc(length);
      const { bytesRead } = await fileHandle.read(buffer, 0, length, 0);
      if (options && typeof options.encoding === 'string') {
        return buffer.slice(0, bytesRead).toString(options.encoding);
      }
      if (typeof options === 'string') {
        if (options === 'utf8' || options === 'utf-8') {
          return buffer.slice(0, bytesRead).toString(options);
        } else {
          throw new Error('Unsupported encoding: ' + options);
        }
      }
      return buffer.slice(0, bytesRead);
    } finally {
      if (fileHandle && closeAfter) {
        await fileHandle.close();
      }
    }
  }

  async writeFile(
    file: nodeFs.PathOrFileDescriptor,
    data: string | Buffer | Uint8Array,
    options?:
      | { encoding?: BufferEncoding; mode?: number; flag?: string }
      | BufferEncoding
      | null
  ): Promise<void> {
    await this.logOperation?.({
      fsName: this.name,
      path: file.toString(),
      operation: 'writeFile',
      operationArgs: { data, options },
    });
    // in case we write to a path - ensure we close the handle we use
    let closeAfter = typeof file !== 'number';
    let fileHandle: CompositFsFileHandle;
    let encoding: BufferEncoding | undefined;
    let mode: number | undefined;
    let flag: string = 'w';

    // Parse options
    if (typeof options === 'string') {
      encoding = options;
    } else if (options && typeof options === 'object') {
      encoding = options.encoding;
      mode = options.mode;
      flag = options.flag || 'w';
    }

    // Handle file descriptor vs path
    if (typeof file === 'number') {
      const fh = this.getFilehandle(file);
      if (!fh) {
        throw new Error('Invalid file descriptor');
      }
      fileHandle = fh;
    } else if (typeof file === 'string') {
      fileHandle = await this.open(file, flag, mode);
    } else {
      throw new Error('only filehandle and path are supported atm');
    }

    try {
      // Convert data to Buffer if needed
      let buffer: Buffer;
      if (typeof data === 'string') {
        buffer = Buffer.from(data, encoding || 'utf8');
      } else if (data instanceof Buffer) {
        buffer = data;
      } else if (data instanceof Uint8Array) {
        buffer = Buffer.from(data);
      } else {
        throw new Error('Invalid data type for writeFile');
      }

      // Write the entire buffer
      let written = 0;
      while (written < buffer.length) {
        const { bytesWritten } = await fileHandle.write(
          buffer,
          written,
          buffer.length - written,
          written
        );
        written += bytesWritten;
      }
    } finally {
      if (fileHandle && closeAfter) {
        await fileHandle.close();
      }
    }
  }
}
