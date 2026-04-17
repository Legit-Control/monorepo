import type { FileHandle } from 'node:fs/promises';
import type * as fs from 'node:fs';

/**
 * Interface that a git gateway filesystem must implement to be compatible with
 * the createAsyncNfsHandler from @legit-sdk/nfs-serve
 *
 * This extends the Node.js fs promises API with additional methods needed by the
 * NFS handler implementation.
 */
export interface GitGatewayInterface {
  // Basic file operations
  lstat(path: string): Promise<fs.Stats>;
  stat(path: string): Promise<fs.Stats>;
  open(path: string, flags: string): Promise<FileHandle>;

  // Directory operations
  readdir(path: string): Promise<string[]>;
  mkdir(path: string, options?: { mode: number }): Promise<void>;
  rmdir(path: string): Promise<void>;

  // File manipulation
  unlink(path: string): Promise<void>;
  rename(oldPath: string, newPath: string): Promise<void>;

  // Links and symlinks
  link(target: string, path: string): Promise<void>;
  symlink(target: string, path: string): Promise<void>;
  readlink(path: string): Promise<string>;

  // File metadata
  chmod(path: string, mode: number): Promise<void>;
  utimes(path: string, atime: Date, mtime: Date): Promise<void>;
  lutimes(path: string, atime: Date, mtime: Date): Promise<void>;
}
