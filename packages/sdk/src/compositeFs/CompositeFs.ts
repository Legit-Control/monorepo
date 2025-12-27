import * as nodeFs from 'node:fs';

import * as path from 'path';
import CompositFsFileHandle from './CompositeFsFileHandle.js';
import { CompositeSubFs } from './CompositeSubFs.js';
import { CompositeFsDir } from './CompositeFsDir.js';
import { IStats } from 'memfs/lib/node/types/misc.js';
import { FsOperationLogger } from './utils/fs-operation-logger.js';

type FileSystem = any;

export interface LegitRouteFolder {
  [key: string]: LegitRouteDescriptor;
}

type LegitRouteDescriptor = CompositeSubFs | LegitRouteFolder;

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
 * hiddenFilesFileSystem -> ephemeralFilesFileSystem -> other subFs in order of addition
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

  filterLayers: CompositeSubFs[] = [];
  routes: LegitRouteDescriptor;
  parentFs: CompositeFs | undefined;
  name: string;

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
    filterLayers,
    routes,
  }: {
    name: string;
    filterLayers: CompositeSubFs[];
    routes: LegitRouteDescriptor;
  }) {
    this.name = name;

    for (const subFs of filterLayers) {
      this.filterLayers.push(subFs);
      subFs.attach(this);
    }

    this.routes = routes;

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
    for (const fileSystem of this.filterLayers) {
      if (await fileSystem.responsible(filePath.toString())) {
        return fileSystem;
      }
    }

    const router = Object.values(this.routes)[0] as CompositeSubFs;
    router.attach(this);

    return router;
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

    const router = Object.values(this.routes)[0] as CompositeSubFs;
    router.attach(this);

    let fileNames = new Set(await router.readdir(dirPath, options));

    // Create a Union of all files from the filesystems
    // NOTE - for the list of filenames only this is enought
    // -> for stats we need to skip files we already got from a previous subFs

    for (const fileSystem of [...this.filterLayers].reverse()) {
      if (fileSystem.readDirFiltering) {
        fileNames = new Set(
          await fileSystem.readDirFiltering(dirPath, Array.from(fileNames))
        );
      } else {
        const subFsdirEntries = await fileSystem.readdir(dirPath, options);
        for (const fileName of subFsdirEntries) {
          fileNames.add(fileName);
        }
      }
    }

    //

    // TODO instead of utilizing the normal read dir - pass the files written by previous subFs to allow hiding files to get filtered out
    // for (const fileName of fileNames) {
    //   const fullPath = (dirPath == '/' ? '' : dirPath) + '/' + fileName;
    //   if (await this.hiddenFilesFileSystem!.responsible(fullPath)) {
    //     fileNames.delete(fileName);
    //   }
    // }
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

      // TODO check if we can unlink the oldPath first (to fail early) before writing to new location
      // - a file in .legit/commits/ is immutable and can not be unlinked for example

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
