import * as fsDisk from 'node:fs';
import { Buffer } from 'node:buffer';
import * as git from '@legit-sdk/isomorphic-git';
import http from '@legit-sdk/isomorphic-git/http/node';

/**
 * FileHandle implementation for GitGateway
 *
 * Handles reading files from cloned git repositories with lazy blob fetching
 */
export class GitGatewayFileHandle {
  constructor(
    private fs: typeof fsDisk,
    private repoDir: string,
    private filePath: string,
    private commitOid: string,
    private githubToken?: string
  ) {}

  // FileHandle methods needed by createAsyncNfsHandler

  async stat(): Promise<fsDisk.Stats> {
    // Fetch the blob to get the actual file size
    let fileSize = 0;
    try {
      const result = await git.readBlob({
        fs: this.fs,
        http,
        dir: this.repoDir,
        oid: this.commitOid,
        filepath: this.filePath,
        cache: {
          _lazyFetchEnabled: true,
          _lazyCacheSize: 100,
          onAuth: () => {
            if (!this.githubToken) {
              return undefined;
            }
            return {
              username: 'token',
              password: this.githubToken,
            };
          },
          http,
          remote: 'origin',
        },
      });

      if (result && result.blob) {
        fileSize = result.blob.length;
      }
    } catch (error) {
      // If we can't read the blob, keep size as 0
      console.error(`[GitGatewayFileHandle] Failed to stat file: ${error}`);
    }

    // Return file stats with actual size
    return {
      mode: 0o644,
      size: fileSize,
      atimeMs: Date.now(),
      mtimeMs: Date.now(),
      ctimeMs: Date.now(),
      birthtimeMs: Date.now(),
      atime: new Date(),
      mtime: new Date(),
      ctime: new Date(),
      birthtime: new Date(),
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
      isBlockDevice: () => false,
      isCharacterDevice: () => false,
      isSocket: () => false,
      isFIFO: () => false,
      dev: 0,
      ino: 1,
      nlink: 1,
      uid: 0,
      gid: 0,
      rdev: 0,
      blksize: 4096,
      blocks: Math.ceil(fileSize / 512) || 8,
    } as fsDisk.Stats;
  }

  async close(): Promise<void> {
    // File handles are not tracked in this version
  }

  async read(
    buffer: Buffer,
    offset: number = 0,
    length: number = buffer.length,
    position: number | null = null
  ): Promise<{ bytesRead: number; buffer: Buffer }> {
    try {
      // Lazy fetch the blob with proper cache configuration
      const result = await git.readBlob({
        fs: this.fs,
        http,
        dir: this.repoDir,
        oid: this.commitOid,
        filepath: this.filePath,
        cache: {
          _lazyFetchEnabled: true,
          _lazyCacheSize: 100, // Keep last 100 blobs in cache
          onAuth: () => {
            if (!this.githubToken) {
              return undefined;
            }
            return {
              username: 'token',
              password: this.githubToken,
            };
          },
          http,
          remote: 'origin',
        },
      });

      if (!result || !result.blob) {
        // File doesn't exist or is empty
        return { bytesRead: 0, buffer };
      }

      // Copy blob content to buffer
      const blob = result.blob;
      const bytesRead = Math.min(length, blob.length);
      const sourceBuffer = Buffer.from(blob);

      sourceBuffer.copy(buffer, offset, 0, bytesRead);

      return { bytesRead, buffer };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to read file '${this.filePath}': ${err.message}`);
    }
  }

  async write(
    buffer: Buffer,
    offset: number = 0,
    length: number = buffer.length,
    position: number = 0
  ): Promise<{ bytesWritten: number }> {
    // File writing not implemented
    throw new Error(`EPERM: operation not permitted, write '${this.filePath}'`);
  }

  async sync(): Promise<void> {
    // No-op - no data to sync in this version
  }

  async chmod(mode: number): Promise<void> {
    // chmod not supported
    throw new Error(`EPERM: operation not permitted, chmod '${this.filePath}'`);
  }

  async truncate(len: number): Promise<void> {
    // truncate not supported
    throw new Error(`EPERM: operation not permitted, truncate '${this.filePath}'`);
  }

  async utimes(atime: Date, mtime: Date): Promise<void> {
    // utimes not supported for read-only files
  }
}
