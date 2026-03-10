import { type GitGateway } from './git-gateway';
import * as fsDisk from 'node:fs';
import { Buffer } from 'node:buffer';

/**
 * FileHandle implementation for GitGateway
 *
 * In a full implementation, this would handle:
 * - Reading files from cloned git repositories
 * - Writing files back to git
 * - Managing file handles and cleanup
 *
 * For the initial version, most file operations are not implemented
 * since we're focusing on the directory structure and bookmarking functionality.
 */
export class GitGatewayFileHandle {
  constructor(
    public path: string,
    private originFs: GitGateway
  ) {}

  // FileHandle methods needed by createAsyncNfsHandler

  async stat(): Promise<fsDisk.Stats> {
    return this.originFs.stat(this.path);
  }

  async close(): Promise<void> {
    // In a full implementation, this would clean up resources
    // For now, file handles are not tracked
  }

  async read(
    buffer: Buffer,
    offset: number = 0,
    length: number = buffer.length,
    position: number | null = null
  ): Promise<{ bytesRead: number; buffer: Buffer }> {
    // File reading not implemented in this version
    // In a full implementation, this would read from cloned git repositories
    throw new Error(`ENOTSUP: Reading files not implemented yet for '${this.path}'`);
  }

  async write(
    buffer: Buffer,
    offset: number = 0,
    length: number = buffer.length,
    position: number = 0
  ): Promise<{ bytesWritten: number }> {
    // File writing not implemented in this version
    // In a full implementation, this would write to cloned git repositories
    throw new Error(`ENOTSUP: Writing files not implemented yet for '${this.path}'`);
  }

  async sync(): Promise<void> {
    // No-op - no data to sync in this version
  }

  async chmod(mode: number): Promise<void> {
    // chmod not supported
    throw new Error(`EPERM: operation not permitted, chmod '${this.path}'`);
  }

  async truncate(len: number): Promise<void> {
    // truncate not supported
    throw new Error(`EPERM: operation not permitted, truncate '${this.path}'`);
  }

  async utimes(atime: Date, mtime: Date): Promise<void> {
    await this.originFs.utimes(this.path, atime, mtime);
  }
}
