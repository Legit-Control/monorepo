import * as fsDisk from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import { GnfsInterface as GnfsInterface } from './gnfs-interface.js';
import { BackingStateInterface } from '../state/state-provider.js';
import { IndexBody } from '../state/index-body.js';

import { GnfsFileHandle } from './gnfs-filehandle.js';

type HeaderData = {
  type: 'index' | 'file' | 'symlink';
  ctime: Date;
  mtime: Date;
  atime: Date;
  size: number;
  fileId: number;
};

interface WatcherController {
  done: boolean;
  push: (event: {
    eventType: 'create' | 'update' | 'headerUpdate' | 'delete';
    filename?: string;
  }) => void;
}

export class Gnfs implements GnfsInterface {
  // #region Sate bus logic

  backingState: BackingStateInterface | undefined;

  // Track active watchers for file system events
  private watchers = new Map<string, Set<WatcherController>>();

  public peerId: string;

  constructor(peerId?: string) {
    this.peerId = peerId || Math.random().toString(36).substring(2, 11);
  }

  connect(stateProvider: BackingStateInterface) {
    stateProvider.connectReceiver(this);

    this.backingState?.put('/', { type: 'index' }, this.peerId);
    this.backingState = stateProvider;
  }

  /**
   * Called by the state provider when it has an update for us, we use this to resolve pending gets for file content and headers, and to close file handles when files are deleted
   */
  send(
    resourceMessage:
      | {
          update:
            | {
                path: string;
                body: string | null | undefined;
                headers: { type: 'body' };
              }
            | {
                path: string;
                body: {
                  ctime: Date;
                  mtime: Date;
                  atime: Date;
                  size: number;
                } | null;
                headers: { type: 'header' };
              }
            | {
                path: string;
                body: IndexBody | null | undefined;
                headers: { type: 'index' };
              };
        }
      | {
          delete: { path: string };
        }
  ): void {
    // called when receiving an update from the state provider
    if ('update' in resourceMessage) {
      if (
        resourceMessage.update.headers.type === 'body' &&
        this.fileAsks[resourceMessage.update.path]
      ) {
        const { path, body } = resourceMessage.update;
        console.log(
          'Received body update for path',
          resourceMessage.update.path,
          body
        );
        const asks = this.fileAsks[path] || [];
        asks.forEach(({ resolve }) =>
          resolve(body as string | null | undefined)
        );
        delete this.fileAsks[path];
        return;
      } else if (
        resourceMessage.update.headers.type === 'header' &&
        this.fileHeaderAsks[resourceMessage.update.path]
      ) {
        const { path, body } = resourceMessage.update;
        const todoCast = body as any;
        // console.log('Received header update for path', path, todoCast);
        const asks = this.fileHeaderAsks[path] || [];
        asks.forEach(({ resolve }) =>
          resolve(
            todoCast !== null
              ? {
                  type: todoCast.type,
                  ctime: todoCast.ctime,
                  mtime: todoCast.mtime,
                  atime: todoCast.atime,
                  size: todoCast.size,
                  fileId: todoCast.fileId,
                }
              : null
          )
        );
        delete this.fileHeaderAsks[path];
        return;
      } else if (
        resourceMessage.update.headers.type === 'index' &&
        this.indexAsks[resourceMessage.update.path]
      ) {
        const { path, body } = resourceMessage.update;
        const todoCast = body as any;
        const asks = this.indexAsks[path] || [];
        asks.forEach(({ resolve }) => resolve(todoCast));
        delete this.indexAsks[path];
        return;
      }
    } else if ('delete' in resourceMessage) {
      const { path } = resourceMessage.delete;
      const fileHandle = this.openFiles.get(path);
      if (fileHandle) {
        fileHandle.close();
        this.openFiles.delete(path);
      }
    }

    // Notify watchers of file system events
    this.notifyWatchers(resourceMessage);
  }

  private fileHeaderAsks: Record<
    string,
    {
      resolve: (value: HeaderData | null) => void;
      reject: (reason?: any) => void;
    }[]
  > = {};

  private async putFileHeader(path: string, headerData: Partial<HeaderData>) {
    this.backingState?.put(
      path,
      {
        type: 'headers',
        headers: headerData,
      },
      this.peerId
    );
  }

  private async getFileHeader(path: string): Promise<HeaderData | null> {
    const fileHeaders = new Promise<HeaderData | null>((resolve, reject) => {
      if (!this.fileHeaderAsks[path]) {
        this.fileHeaderAsks[path] = [];
      }

      this.fileHeaderAsks[path].push({ resolve, reject });
    });

    // we only request a resource once per tick
    if (this.fileHeaderAsks[path].length === 1) {
      this.backingState?.get(path, { type: 'header' }, false, this.peerId);
    }

    return await fileHeaders;
  }

  private fileAsks: Record<
    string,
    {
      resolve: (value: string | null | undefined) => void;
      reject: (reason?: any) => void;
    }[]
  > = {};

  async putFile(path: string, content: string) {
    this.backingState?.put(path, { type: 'file', body: content }, this.peerId);
  }

  async getFile(path: string): Promise<string | null | undefined> {
    const fileContent = new Promise<string | null | undefined>(
      (resolve, reject) => {
        if (!this.fileAsks[path]) {
          this.fileAsks[path] = [];
        }

        this.fileAsks[path].push({ resolve, reject });
      }
    );
    // we only request a resource once per tick
    if (this.fileAsks[path].length === 1) {
      this.backingState?.get(path, { type: 'body' }, false, this.peerId);
    }

    return await fileContent;
  }

  private indexAsks: Record<
    string,
    { resolve: (value: IndexBody) => void; reject: (reason?: any) => void }[]
  > = {};

  private async getIndex(path: string): Promise<IndexBody> {
    const indexContent = new Promise<IndexBody>((resolve, reject) => {
      if (!this.indexAsks[path]) {
        this.indexAsks[path] = [];
      }

      this.indexAsks[path].push({ resolve, reject });
    });
    // we only request a resource once per tick
    if (this.indexAsks[path].length === 1) {
      this.backingState?.get(path, { type: 'index' }, false, this.peerId);
    }

    return await indexContent;
  }

  /**
   * Watch a file or directory for changes
   * Implements Node.js fs.watch() API
   */
  async *watch(
    filename: string,
    options?: {
      signal?: AbortSignal;
    }
  ): AsyncIterable<{
    eventType: 'create' | 'update' | 'headerUpdate' | 'delete';
    filename?: string;
  }> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    const normalizedPath = this.normalizePath(filename);
    const eventQueue: {
      eventType: 'create' | 'update' | 'headerUpdate' | 'delete';
      filename?: string;
    }[] = [];
    const controller: WatcherController = {
      done: false,
      push: event => eventQueue.push(event),
    };

    // Register this watcher
    if (!this.watchers.has(normalizedPath)) {
      this.watchers.set(normalizedPath, new Set());
      // subscribe to the path for all types on the first type
      this.backingState.get(
        normalizedPath,
        { type: 'header' },
        true,
        this.peerId
      );

      this.backingState.get(
        normalizedPath,
        { type: 'index' },
        true,
        this.peerId
      );

      this.backingState.get(
        normalizedPath,
        { type: 'body' },
        true,
        this.peerId
      );
    }
    this.watchers.get(normalizedPath)!.add(controller);

    console.log(`[GNFS] Started watching: ${normalizedPath}`);

    // Handle abort signal for cleanup
    if (options?.signal) {
      const abortHandler = () => {
        console.log(`[GNFS] Aborted watching: ${normalizedPath}`);
        controller.done = true;
        this.watchers.get(normalizedPath)!.delete(controller);

        if (this.watchers.get(normalizedPath)?.size === 0) {
          this.backingState?.forget(
            normalizedPath,
            { type: 'header' },
            this.peerId
          );
          this.backingState?.forget(
            normalizedPath,
            { type: 'index' },
            this.peerId
          );
          this.backingState?.forget(
            normalizedPath,
            { type: 'body' },
            this.peerId
          );
        }
      };
      options.signal.addEventListener('abort', abortHandler, { once: true });

      // Remove listener if signal is already aborted
      if (options.signal.aborted) {
        controller.done = true;
      }
    }

    try {
      // Yield events from queue
      while (!controller.done) {
        while (eventQueue.length > 0) {
          yield eventQueue.shift()!;
        }
        // Wait a bit before checking again
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } finally {
      // Cleanup: unsubscribe from backing state
      console.log(`[GNFS] Stopped watching: ${normalizedPath}`);
      this.watchers.get(normalizedPath)!.delete(controller);

      if (this.watchers.get(normalizedPath)?.size === 0) {
        this.backingState?.forget(
          normalizedPath,
          { type: 'header' },
          this.peerId
        );
        this.backingState?.forget(
          normalizedPath,
          { type: 'index' },
          this.peerId
        );
        this.backingState?.forget(
          normalizedPath,
          { type: 'body' },
          this.peerId
        );
      }
    }
  }

  /**
   * Notify watchers of file system events
   *
   *
   *
   */
  private notifyWatchers(
    resourceMessage:
      | {
          update: {
            path: string;
            body: any;
            headers: { type: 'body' | 'header' | 'index' };
          };
        }
      | { delete: { path: string } }
  ): void {
    const path =
      'update' in resourceMessage
        ? resourceMessage.update.path
        : resourceMessage.delete.path;

    const normalizedPath = this.normalizePath(path);

    const controllers = this.watchers.get(normalizedPath);
    if (!controllers) {
      return;
    }

    const filename = this.getBaseName(normalizedPath);

    const event = { eventType, filename };
    for (const controller of controllers) {
      controller.push(event);
    }

    // skip body updates
    if (
      'update' in resourceMessage &&
      resourceMessage.update.headers.type === 'body'
    ) {
      return;
    }

    if ('update' in resourceMessage) {
      const { path, body, headers } = resourceMessage.update;
      const normalizedPath = this.normalizePath(path);

      // Map backing state update types to watch event types
      let eventType: 'rename' | 'change';
      if (headers.type === 'header') {
        // Metadata changed (mtime, size, etc.)
        eventType = 'change';
        this.notifyWatchersAtPath(normalizedPath, eventType, 'header');
      } else if (headers.type === 'index') {
        // Directory listing changed - something was created/deleted/renamed
        // Notify parent directory watchers
        this.notifyWatchersAtPath(normalizedPath, 'change', 'index');

        // Extract filename from path and include it in the event
        // const filename = this.getBaseName(normalizedPath);
        // this.notifyWatchersAtPath(normalizedPath, 'rename', filename);
      }
    } else if ('delete' in resourceMessage) {
      const { path } = resourceMessage.delete;
      const normalizedPath = this.normalizePath(path);

      // File/directory deleted - notify as rename event
      this.notifyWatchersAtPath(normalizedPath, 'change', 'delete');

      // Also notify parent directory
      // const parentPath = this.getParentPath(normalizedPath);
      // if (parentPath !== normalizedPath) {
      //   const filename = this.getBaseName(normalizedPath);
      //   this.notifyWatchersAtPath(parentPath, 'rename', filename);
      // }
    }
  }

  /**
   * Normalize path to remove leading/trailing slashes and resolve duplicate slashes
   */
  private normalizePath(path: string): string {
    return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  /**
   * Get parent directory path
   */
  private getParentPath(path: string): string {
    const normalized = this.normalizePath(path);
    if (normalized === '/') {
      return '/';
    }
    const lastSlash = normalized.lastIndexOf('/');
    if (lastSlash === 0) {
      return '/';
    }
    return normalized.substring(0, lastSlash) || '/';
  }

  /**
   * Get base name (filename) from path
   */
  private getBaseName(path: string): string {
    const normalized = this.normalizePath(path);
    if (normalized === '/') {
      return '';
    }
    const lastSlash = normalized.lastIndexOf('/');
    return normalized.substring(lastSlash + 1);
  }

  // #endregion Sate bus logic

  // #region File system operation needed by createAsyncNfsHandler

  openFiles: Map<string, GnfsFileHandle> = new Map();

  async lstat(path: string): Promise<fsDisk.Stats> {
    return this.stat(path);
  }

  async stat(path: string): Promise<fsDisk.Stats> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    const headerData = await this.getFileHeader(path);

    if (headerData === null) {
      const e = new Error('ENOENT: no such file or directory, stat ' + path);
      (e as any).code = 'ENOENT';
      throw e;
    }

    return {
      mode:
        headerData.type === 'file'
          ? 0o644
          : headerData.type === 'symlink'
            ? 0o777 | 0o120000
            : 0o755,
      size: headerData.size,
      atimeMs: headerData.atime.getTime(),
      mtimeMs: headerData.mtime.getTime(),
      ctimeMs: headerData.ctime.getTime(),
      birthtimeMs: headerData.ctime.getTime(),
      atime: new Date(headerData.atime.getTime()),
      mtime: new Date(headerData.mtime.getTime()),
      ctime: new Date(headerData.ctime.getTime()),
      birthtime: new Date(headerData.ctime.getTime()),
      isFile: () => headerData.type === 'file',
      isDirectory: () => {
        return headerData.type === 'index';
      },
      isSymbolicLink: () => headerData.type === 'symlink',
      isBlockDevice: () => false,
      isCharacterDevice: () => false,
      isSocket: () => false,
      isFIFO: () => false,
      dev: 0,
      ino: headerData.fileId,
      nlink: 1,
      uid: 0,
      gid: 0,
      rdev: 0,
      blksize: 4096,
      blocks: 0,
    } as fsDisk.Stats;
  }

  async open(path: string, flags: string): Promise<FileHandle> {
    // Check if file exists
    const fileExists = await this.stat(path)
      .then(() => true)
      .catch(() => false);

    console.log(
      `Opening file ${path} with flags ${flags}, file exists: ${fileExists}`
    );

    // Validate flags against file existence
    if (flags === 'wx') {
      // Write, exclusively create - fail if file exists
      if (fileExists) {
        throw new Error("EEXIST: file already exists, open '" + path + "'");
      }
    } else if (flags === 'r+' || flags === 'a+') {
      // Read/write or append - file must exist
      if (!fileExists) {
        throw new Error(
          "ENOENT: no such file or directory, open '" + path + "'"
        );
      }
    }

    // Create new file handle
    const fileHandle = new GnfsFileHandle(path, this);

    // Track the open file handle
    this.openFiles.set(path, fileHandle);

    return fileHandle as unknown as FileHandle;
  }

  closeFileHandle(fileHandle: GnfsFileHandle) {
    this.openFiles.delete(fileHandle.path);
  }

  async readdir(path: string): Promise<string[]> {
    const index = await this.getIndex(path); // TODO use the result to return the correct index
    return index.map(entry => entry.link);
  }

  async mkdir(path: string, options?: { mode: number }): Promise<void> {
    this.backingState?.put(
      path,
      {
        type: 'index',
      },
      this.peerId
    );
  }

  async rmdir(path: string): Promise<void> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    // Check if path exists and is a directory
    const stats = await this.stat(path);
    if (!stats.isDirectory()) {
      throw new Error(`ENOTDIR: not a directory, rmdir '${path}'`);
    }

    // Check if directory is empty
    const entries = await this.readdir(path);
    if (entries.length > 0) {
      throw new Error(`ENOTEMPTY: directory not empty, rmdir '${path}'`);
    }

    this.backingState.del(path, this.peerId);
  }

  async unlink(path: string): Promise<void> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    // Check if path exists and is a file
    const stats = await this.stat(path);
    if (stats.isDirectory()) {
      throw new Error(
        `EISDIR: illegal operation on a directory, unlink '${path}'`
      );
    }

    this.backingState.del(path, this.peerId);
  }

  private async recursiveRename(
    oldPath: string,
    newPath: string
  ): Promise<void> {
    // Check if oldPath exists
    const stats = await this.stat(oldPath);

    if (stats.isFile()) {
      // It's a file: copy content and metadata, then delete old
      const content = (await this.getFile(oldPath)) as string; // its a file (we checked the stats before)
      const metadata = await this.getFileHeader(oldPath);

      if (metadata && content !== undefined) {
        // Write content to new path
        this.backingState?.put(
          newPath,
          { type: 'file', body: content },
          this.peerId
        );
        // Write metadata to new path
        this.backingState?.put(
          newPath,
          {
            type: 'headers',
            headers: {
              ctime: metadata.ctime,
              mtime: metadata.mtime,
              atime: metadata.atime,
              size: metadata.size,
            },
          },
          this.peerId
        );
      }
    } else if (stats.isDirectory()) {
      // It's a directory: create the new directory
      this.backingState?.put(newPath, { type: 'index' }, this.peerId);

      // Recursively rename all children
      const children = await this.readdir(oldPath);
      for (const child of children) {
        const childOldPath =
          oldPath === '/' ? `/${child}` : `${oldPath}/${child}`;
        const childNewPath =
          newPath === '/' ? `/${child}` : `${newPath}/${child}`;
        await this.recursiveRename(childOldPath, childNewPath);
      }
    }

    // Delete the old path (for directories, this should only delete the directory itself, not children)
    this.backingState?.del(oldPath, this.peerId);
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    await this.recursiveRename(oldPath, newPath);
  }

  async link(target: string, path: string): Promise<void> {
    throw new Error(
      'Hard links are not supported by the memory-backed state provider'
    );
  }

  async symlink(target: string, path: string): Promise<void> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    // Create symlink by storing target path as content
    this.backingState.put(
      path,
      {
        type: 'symlink',
        body: target,
      },
      this.peerId
    );
  }

  async readlink(path: string): Promise<string> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    const content = await this.getFile(path);

    if (content === null || content === undefined) {
      const e = new Error(
        'ENOENT: no such file or directory, readlink ' + path
      );
      (e as any).code = 'ENOENT';
      throw e;
    }

    return content; // Return the symlink target
  }

  async chmod(path: string, mode: number): Promise<void> {
    throw new Error(
      'File permissions (chmod) are not supported by the memory-backed state provider'
    );
  }

  async utimes(path: string, atime: Date, mtime: Date): Promise<void> {
    this.putFileHeader(path, {
      mtime,
      atime,
    });
  }

  async lutimes(path: string, atime: Date, mtime: Date): Promise<void> {
    this.putFileHeader(path, {
      mtime,
      atime,
    });
  }

  // async writeFile(path, content) {
  //   throw new Error('Method not implemented: writeFile');
  // }

  // #endregion
}
