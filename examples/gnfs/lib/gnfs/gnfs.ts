import * as fsDisk from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import { GnfsInterface as GnfsInterface } from './gnfs-interface.js';
import { BackingStateInterface } from '../state/state-provider.js';
import { IndexBody } from '../state/index-body.js';

import { GnfsFileHandle } from './gnfs-filehandle.js';

type HeaderData = {
  type: 'index' | 'file';
  ctime: Date;
  mtime: Date;
  atime: Date;
  size: number;
  fileId: number;
};

export class Gnfs implements GnfsInterface {
  // #region Sate bus logic

  backingState: BackingStateInterface | undefined;

  connect(stateProvider: BackingStateInterface) {
    stateProvider.connectReceiver(this);

    this.backingState?.put('/', { body: undefined });
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
      if (resourceMessage.update.headers.type === 'body') {
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
      } else if (resourceMessage.update.headers.type === 'header') {
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
      } else if (resourceMessage.update.headers.type === 'index') {
        const { path, body } = resourceMessage.update;
        const todoCast = body as any;
        const asks = this.indexAsks[path] || [];
        asks.forEach(({ resolve }) => resolve(todoCast));
        delete this.indexAsks[path];
      }
    } else if ('delete' in resourceMessage) {
      const { path } = resourceMessage.delete;
      const fileHandle = this.openFiles.get(path);
      if (fileHandle) {
        fileHandle.close();
        this.openFiles.delete(path);
      }
    }
  }

  private fileHeaderAsks: Record<
    string,
    {
      resolve: (value: HeaderData | null) => void;
      reject: (reason?: any) => void;
    }[]
  > = {};

  private async putFileHeader(path: string, headerData: Partial<HeaderData>) {
    this.backingState?.put(path, {
      type: 'headers',
      headers: headerData,
    });
  }

  private async getFileHeader(path: string): Promise<HeaderData | null> {
    const fileHeaders = new Promise<HeaderData | null>((resolve, reject) => {
      if (!this.fileHeaderAsks[path]) {
        this.fileHeaderAsks[path] = [];
      }

      this.fileHeaderAsks[path].push({ resolve, reject });
    });
    this.backingState?.get(path, { type: 'header' }, false);

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
    this.backingState?.put(path, { type: 'file', body: content });
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
    this.backingState?.get(path, { type: 'body' }, false);

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
    this.backingState?.get(path, { type: 'index' }, false);

    return await indexContent;
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
      mode: headerData.type === 'file' ? 0o644 : 0o755,
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
      isSymbolicLink: () => false,
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
    this.backingState?.put(path, {
      type: 'index',
    });
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

    this.backingState.del(path);
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

    this.backingState.del(path);
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
        this.backingState?.put(newPath, { type: 'file', body: content });
        // Write metadata to new path
        this.backingState?.put(newPath, {
          type: 'headers',
          headers: {
            ctime: metadata.ctime,
            mtime: metadata.mtime,
            atime: metadata.atime,
            size: metadata.size,
          },
        });
      }
    } else if (stats.isDirectory()) {
      // It's a directory: create the new directory
      this.backingState?.put(newPath, { type: 'index' });

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
    this.backingState?.del(oldPath);
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
    this.backingState.put(path, {
      type: 'symlink',
      body: target,
    });
  }

  async readlink(path: string): Promise<string> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    const content = await this.getFile(path);

    if (content === null || content === undefined) {
      const e = new Error('ENOENT: no such file or directory, readlink ' + path);
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
