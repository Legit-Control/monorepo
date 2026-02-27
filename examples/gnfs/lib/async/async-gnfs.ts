import * as fsDisk from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import {
  StateProvider,
  StateReceiver,
  IndexBody,
} from './memory-state-provider.js';

export class AsyncGnfsFileHandle {
  constructor(
    public path: string,
    private originFs: AsyncGnfs
  ) {}

  // FileHandle methods needed by createAsyncNfsHandler
  async stat(): Promise<fsDisk.Stats> {
    return this.originFs.stat(this.path);
  }

  async close(): Promise<void> {
    this.originFs.closeFileHandle(this);
  }

  async read(
    buffer: Buffer,
    offset: number = 0,
    length: number = buffer.length,
    position: number | null = null // NOTE null is not behaving a standard node, where a file has a current position that is used when position is null, here we just treat null as 0
  ): Promise<{ bytesRead: number; buffer: Buffer }> {
    const fileContent = await this.originFs.getFile(this.path);

    if (fileContent === null) {
      throw new Error('File not found: ' + this.path);
    }

    if (fileContent === undefined) {
      // its a directory, not a file
      throw new Error('Not a file: ' + this.path);
    }

    const contentBuffer = Buffer.from(fileContent, 'utf8');
    const bytesToRead = Math.min(
      length,
      contentBuffer.length - (position ?? 0)
    );
    contentBuffer.copy(
      buffer,
      offset,
      position ?? 0,
      (position ?? 0) + bytesToRead
    );

    return { bytesRead: bytesToRead, buffer };
  }

  async write(
    buffer: Buffer,
    offset: number = 0,
    length: number = buffer.length,
    position: number = 0
  ): Promise<{ bytesWritten: number }> {
    const fileContent = await this.originFs.getFile(this.path);

    if (fileContent === null) {
      throw new Error('File not found: ' + this.path);
    }

    if (fileContent === undefined) {
      // its a directory, not a file
      throw new Error('Not a file: ' + this.path);
    }

    // for now we load the whole file content, apply the changes and write the whole file back
    // later we want to send range patches

    let contentBuffer = Buffer.from(fileContent, 'utf8');

    const targetBufferSize = Math.max(contentBuffer.length, position + length);
    if (contentBuffer.length < targetBufferSize) {
      // need to grow the buffer
      const newBuffer = Buffer.alloc(targetBufferSize);
      contentBuffer.copy(newBuffer, 0, 0, contentBuffer.length);
      buffer.copy(newBuffer, offset, position, length);
      contentBuffer = newBuffer;
    } else {
      buffer.copy(contentBuffer, position, offset, offset + length);
    }

    this.originFs.putFile(this.path, contentBuffer.toString('utf8'));
    return { bytesWritten: length };
  }

  async sync(): Promise<void> {
    console.warn('nooop');
  }

  async chmod(mode: number): Promise<void> {
    throw new Error('Method not implemented: chmod');
  }

  async truncate(len: number): Promise<void> {
    if (len > 0) {
      const content = await this.read(Buffer.alloc(len), 0, len, 0);

      this.originFs.putFile(this.path, content.buffer.toString('utf8'));
    } else {
      this.originFs.putFile(this.path, '');
    }
  }

  async utimes(atime: Date, mtime: Date): Promise<void> {
    await this.originFs.utimes(this.path, atime, mtime);
  }
}

type HeaderData = {
  type: 'index' | 'body';
  ctime: Date;
  mtime: Date;
  atime: Date;
  size: number;
  fileId: number;
};

export class AsyncGnfs implements StateReceiver {
  backingState: StateProvider | undefined;

  openFiles: Map<string, AsyncGnfsFileHandle> = new Map();

  connect(stateProvider: StateProvider) {
    stateProvider.connectReceiver(this);

    this.backingState?.upsert('/', { body: undefined });
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
    this.backingState?.upsert(path, {
      headers: headerData,
    });
  }

  private async getFileHeader(path: string): Promise<HeaderData | null> {
    const fileContent = new Promise<HeaderData | null>((resolve, reject) => {
      if (!this.fileHeaderAsks[path]) {
        this.fileHeaderAsks[path] = [];
      }

      this.fileHeaderAsks[path].push({ resolve, reject });
    });
    this.backingState?.request(path, { type: 'header' }, false);

    return await fileContent;
  }

  private fileAsks: Record<
    string,
    {
      resolve: (value: string | null | undefined) => void;
      reject: (reason?: any) => void;
    }[]
  > = {};

  async putFile(path: string, content: string) {
    this.backingState?.upsert(path, { body: content });
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
    this.backingState?.request(path, { type: 'body' }, false);

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
    this.backingState?.request(path, { type: 'index' }, false);

    return await indexContent;
  }

  // File system operation stubs needed by createAsyncNfsHandler
  async lstat(path: string): Promise<fsDisk.Stats> {
    return this.stat(path);
  }

  async stat(path: string): Promise<fsDisk.Stats> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    const headerData = await this.getFileHeader(path);

    if (headerData === null) {
      throw new Error('ENOENT: no such file or directory, stat ' + path);
    }

    return {
      mode: headerData.type === 'body' ? 0o644 : 0o755,
      size: headerData.size,
      atimeMs: headerData.atime.getTime(),
      mtimeMs: headerData.mtime.getTime(),
      ctimeMs: headerData.ctime.getTime(),
      birthtimeMs: headerData.ctime.getTime(),
      atime: new Date(headerData.atime.getTime()),
      mtime: new Date(headerData.mtime.getTime()),
      ctime: new Date(headerData.ctime.getTime()),
      birthtime: new Date(headerData.ctime.getTime()),
      isFile: () => headerData.type === 'body',
      isDirectory: () => headerData.type === 'index',
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
    const fileHandle = new AsyncGnfsFileHandle(path, this);

    // Track the open file handle
    this.openFiles.set(path, fileHandle);

    return fileHandle as unknown as FileHandle;
  }

  closeFileHandle(fileHandle: AsyncGnfsFileHandle) {
    this.openFiles.delete(fileHandle.path);
  }

  async readdir(path: string): Promise<string[]> {
    const index = await this.getIndex(path); // TODO use the result to return the correct index
    return index.map(entry => entry.link);
  }

  async mkdir(path: string, options: { mode: number }): Promise<void> {
    this.backingState?.upsert(path, {
      body: undefined,
    });
    throw new Error('Method not implemented: mkdir');
  }

  async rmdir(path: string): Promise<void> {
    throw new Error('Method not implemented: rmdir');
  }

  async unlink(path: string): Promise<void> {
    throw new Error('Method not implemented: unlink');
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    throw new Error('Method not implemented: rename');
  }

  async link(target: string, path: string): Promise<void> {
    throw new Error('Method not implemented: link');
  }

  async symlink(target: string, path: string): Promise<void> {
    throw new Error('Method not implemented: symlink');
  }

  async readlink(path: string): Promise<string> {
    throw new Error('Method not implemented: readlink');
  }

  async chmod(path: string, mode: number): Promise<void> {
    throw new Error('Method not implemented: chmod');
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

  async writeFile(path, content) {
    throw new Error('Method not implemented: writeFile');
  }
}
