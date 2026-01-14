import * as nodeFs from 'node:fs';
import { Stats } from 'node:fs';
import { ASimpleCompositeSubfs } from './base-simple-sub-fs.js';
import { toDirEntry } from '../../utils/toDirEntry.js';

interface MemoryFile {
  type: 'file';
  content: Buffer;
  mode: number;
  createdAt: Date;
  modifiedAt: Date;
}

interface MemoryDirectory {
  type: 'directory';
  entries: Set<string>;
  mode: number;
  createdAt: Date;
  modifiedAt: Date;
}

type MemoryNode = MemoryFile | MemoryDirectory;

export type FileSystemData = string | { [key: string]: FileSystemData };

/**
 * SimpleMemorySubFs - A simple in-memory filesystem implementation
 *
 * This class extends ASimpleCompositeSubfs and stores all files and directories
 * in a JavaScript Map in memory. It's useful for testing, caching, or temporary
 * file storage that doesn't need to persist.
 */
export class SimpleMemorySubFs extends ASimpleCompositeSubfs {
  private storage: Map<string, MemoryNode> = new Map();
  private nextFileType = 1;

  /**
   * Debug method to inspect internal storage
   */
  _debugGetStorage(): Map<string, MemoryNode> {
    return this.storage;
  }

  constructor({
    name,
    rootPath,
    initialData,
  }: {
    name: string;
    rootPath: string;
    initialData?: FileSystemData;
  }) {
    super({ name, rootPath });

    // Initialize root directory
    this.storage.set('/', {
      type: 'directory',
      entries: new Set(),
      mode: 0o755,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });

    // Populate with initial data if provided
    if (initialData) {
      this.populateFromInitialData(initialData, '/');
    }
  }

  /**
   * Populate the filesystem from initial data structure
   * @param data - The data structure to populate from (string = file, object = folder)
   * @param currentPath - The current path in the filesystem
   */
  private populateFromInitialData(
    data: FileSystemData,
    currentPath: string
  ): void {
    if (typeof data === 'string') {
      // It's a file
      this.storage.set(currentPath, {
        type: 'file',
        content: Buffer.from(data, 'utf8'),
        mode: 0o644,
        createdAt: new Date(),
        modifiedAt: new Date(),
      });

      // Add to parent directory's entries
      const parentPath = this.getParentPath(currentPath);
      if (parentPath) {
        const parent = this.storage.get(parentPath);
        if (parent && parent.type === 'directory') {
          parent.entries.add(this.getBaseName(currentPath));
        }
      }
    } else {
      // It's a directory
      const node = this.storage.get(currentPath);
      if (node && node.type === 'directory') {
        // Directory already exists (e.g., root), just add entries
        for (const [name, value] of Object.entries(data)) {
          const childPath =
            currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
          node.entries.add(name);
          this.populateFromInitialData(value, childPath);
        }
      } else {
        // Create new directory
        const now = new Date();
        this.storage.set(currentPath, {
          type: 'directory',
          entries: new Set(),
          mode: 0o755,
          createdAt: now,
          modifiedAt: now,
        });

        // Add to parent directory's entries
        const parentPath = this.getParentPath(currentPath);
        if (parentPath) {
          const parent = this.storage.get(parentPath);
          if (parent && parent.type === 'directory') {
            parent.entries.add(this.getBaseName(currentPath));
          }
        }

        // Recursively populate children
        const dirNode = this.storage.get(currentPath);
        if (dirNode && dirNode.type === 'directory') {
          for (const [name, value] of Object.entries(data)) {
            const childPath =
              currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
            dirNode.entries.add(name);
            this.populateFromInitialData(value, childPath);
          }
        }
      }
    }
  }

  override fileType(): number {
    return this.nextFileType;
  }

  override async createDirectory(args: {
    path: string;
    recursive?: boolean;
    context: ASimpleCompositeSubfs['context'];
  }): Promise<void> {
    const { path, recursive = false } = args;
    const normalizedPath = this.normalizePath(path);

    // Check if already exists
    if (this.storage.has(normalizedPath)) {
      const node = this.storage.get(normalizedPath);
      if (node?.type === 'directory') {
        return; // Already exists
      }
      throw Object.assign(
        new Error(`EEXIST: file already exists, mkdir '${path}'`),
        {
          code: 'EEXIST',
          errno: -17,
          syscall: 'mkdir',
          path: normalizedPath,
        }
      );
    }

    // Create parent directories if recursive
    if (recursive) {
      const parentPath = this.getParentPath(normalizedPath);
      if (
        parentPath &&
        parentPath !== normalizedPath &&
        !this.storage.has(parentPath)
      ) {
        await this.createDirectory({
          path: parentPath,
          recursive: true,
          context: args.context,
        });
      }
    }

    // Create the directory
    const now = new Date();
    this.storage.set(normalizedPath, {
      type: 'directory',
      entries: new Set(),
      mode: 0o755,
      createdAt: now,
      modifiedAt: now,
    });

    // Add to parent's entries
    const parentPath = this.getParentPath(normalizedPath);
    if (parentPath) {
      const parent = this.storage.get(parentPath);
      if (parent && parent.type === 'directory') {
        parent.entries.add(this.getBaseName(normalizedPath));
        parent.modifiedAt = now;
      }
    }
  }

  override async getStats(args: {
    path: string;
    context: ASimpleCompositeSubfs['context'];
  }): Promise<nodeFs.Stats> {
    const normalizedPath = this.normalizePath(args.path);
    const node = this.storage.get(normalizedPath);

    if (!node) {
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, stat '${args.path}'`),
        {
          code: 'ENOENT',
          errno: -2,
          syscall: 'stat',
          path: normalizedPath,
        }
      );
    }

    // @ts-expect-error -- todo fix error
    const stats = new Stats();
    const mode = node.type === 'directory' ? 0o755 | 0o40000 : 0o644 | 0o100000;

    stats.mode = mode;
    stats.size = node.type === 'file' ? node.content.length : 4096;
    stats.mtimeMs = node.modifiedAt.getTime();
    stats.birthtimeMs = node.createdAt.getTime();
    stats.ctimeMs = node.modifiedAt.getTime();

    return stats;
  }

  override async readFileContent(args: {
    path: string;
    context: ASimpleCompositeSubfs['context'];
  }): Promise<{ content: string | Buffer; oid?: string } | undefined> {
    const normalizedPath = this.normalizePath(args.path);
    const node = this.storage.get(normalizedPath);

    if (!node || node.type !== 'file') {
      return undefined;
    }

    return {
      content: node.content,
    };
  }

  override async writeFileContent(args: {
    path: string;
    content: Buffer | string;
    context: ASimpleCompositeSubfs['context'];
  }): Promise<void> {
    const normalizedPath = this.normalizePath(args.path);
    const now = new Date();
    const contentBuffer =
      typeof args.content === 'string'
        ? Buffer.from(args.content, 'utf8')
        : args.content;

    // Check if file exists
    const existingNode = this.storage.get(normalizedPath);

    if (existingNode) {
      if (existingNode.type === 'directory') {
        throw Object.assign(
          new Error(
            `EISDIR: illegal operation on a directory, write '${args.path}'`
          ),
          {
            code: 'EISDIR',
            errno: -21,
            syscall: 'write',
            path: normalizedPath,
          }
        );
      }
      // Update existing file
      existingNode.content = contentBuffer;
      existingNode.modifiedAt = now;
    } else {
      // Create new file
      this.storage.set(normalizedPath, {
        type: 'file',
        content: contentBuffer,
        mode: 0o644,
        createdAt: now,
        modifiedAt: now,
      });

      // Add to parent's entries
      const parentPath = this.getParentPath(normalizedPath);
      if (parentPath) {
        let parent = this.storage.get(parentPath);

        // Create parent if it doesn't exist
        if (!parent) {
          await this.createDirectory({
            path: parentPath,
            recursive: true,
            context: args.context,
          });
          parent = this.storage.get(parentPath)!;
        }

        if (parent && parent.type === 'directory') {
          parent.entries.add(this.getBaseName(normalizedPath));
          parent.modifiedAt = now;
        }
      }
    }
  }

  override async readDirectory(args: {
    path: string;
    context: ASimpleCompositeSubfs['context'];
  }): Promise<nodeFs.Dirent[]> {
    const normalizedPath = this.normalizePath(args.path);
    const node = this.storage.get(normalizedPath);

    if (!node) {
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, scandir '${args.path}'`),
        {
          code: 'ENOENT',
          errno: -2,
          syscall: 'scandir',
          path: normalizedPath,
        }
      );
    }

    if (node.type !== 'directory') {
      throw Object.assign(
        new Error(`ENOTDIR: not a directory, scandir '${args.path}'`),
        {
          code: 'ENOTDIR',
          errno: -20,
          syscall: 'scandir',
          path: normalizedPath,
        }
      );
    }

    // Convert directory entries to Dirent-like objects
    const entries: nodeFs.Dirent[] = [];
    for (const name of node.entries) {
      // Construct child path - handle root specially
      let childPath: string;
      if (normalizedPath === '/') {
        childPath = '/' + name;
      } else {
        childPath = normalizedPath + '/' + name;
      }

      const childNode = this.storage.get(childPath);

      if (childNode) {
        entries.push(
          toDirEntry({
            name,
            parent: normalizedPath,
            isDir: childNode.type === 'directory',
          })
        );
      }
    }

    return entries;
  }

  override async renamePath(args: {
    oldPath: string;
    newPath: string;
    oldContext: ASimpleCompositeSubfs['context'];
    newContext: ASimpleCompositeSubfs['context'];
  }): Promise<void> {
    const oldNormalized = this.normalizePath(args.oldPath);
    const newNormalized = this.normalizePath(args.newPath);

    const node = this.storage.get(oldNormalized);
    if (!node) {
      throw Object.assign(
        new Error(
          `ENOENT: no such file or directory, rename '${args.oldPath}'`
        ),
        {
          code: 'ENOENT',
          errno: -2,
          syscall: 'rename',
          path: oldNormalized,
        }
      );
    }

    // Remove from old parent
    const oldParent = this.getParentPath(oldNormalized);
    if (oldParent) {
      const oldParentNode = this.storage.get(oldParent);
      if (oldParentNode && oldParentNode.type === 'directory') {
        oldParentNode.entries.delete(this.getBaseName(oldNormalized));
      }
    }

    // Move to new location
    this.storage.delete(oldNormalized);
    this.storage.set(newNormalized, node);
    node.modifiedAt = new Date();

    // Add to new parent
    const newParent = this.getParentPath(newNormalized);
    if (newParent) {
      const newParentNode = this.storage.get(newParent);
      if (newParentNode && newParentNode.type === 'directory') {
        newParentNode.entries.add(this.getBaseName(newNormalized));
        newParentNode.modifiedAt = new Date();
      }
    }

    // If it's a directory, update all children paths
    if (node.type === 'directory') {
      const children = Array.from(node.entries);
      for (const childName of children) {
        const oldChildPath = this.joinPath(oldNormalized, childName);
        const newChildPath = this.joinPath(newNormalized, childName);
        await this.renamePath({
          oldPath: oldChildPath,
          newPath: newChildPath,
          oldContext: args.oldContext,
          newContext: args.newContext,
        });
      }
    }
  }

  override async deleteFile(args: {
    path: string;
    context: ASimpleCompositeSubfs['context'];
  }): Promise<void> {
    const normalizedPath = this.normalizePath(args.path);
    const node = this.storage.get(normalizedPath);

    if (!node) {
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, unlink '${args.path}'`),
        {
          code: 'ENOENT',
          errno: -2,
          syscall: 'unlink',
          path: normalizedPath,
        }
      );
    }

    if (node.type === 'directory') {
      throw Object.assign(
        new Error(
          `EISDIR: illegal operation on a directory, unlink '${args.path}'`
        ),
        {
          code: 'EISDIR',
          errno: -21,
          syscall: 'unlink',
          path: normalizedPath,
        }
      );
    }

    // Remove from parent's entries
    const parentPath = this.getParentPath(normalizedPath);
    if (parentPath) {
      const parent = this.storage.get(parentPath);
      if (parent && parent.type === 'directory') {
        parent.entries.delete(this.getBaseName(normalizedPath));
        parent.modifiedAt = new Date();
      }
    }

    this.storage.delete(normalizedPath);
  }

  override async removeDirectory(args: {
    path: string;
    context: ASimpleCompositeSubfs['context'];
  }): Promise<void> {
    const normalizedPath = this.normalizePath(args.path);
    const node = this.storage.get(normalizedPath);

    if (!node) {
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, rmdir '${args.path}'`),
        {
          code: 'ENOENT',
          errno: -2,
          syscall: 'rmdir',
          path: normalizedPath,
        }
      );
    }

    if (node.type !== 'directory') {
      throw Object.assign(
        new Error(`ENOTDIR: not a directory, rmdir '${args.path}'`),
        {
          code: 'ENOTDIR',
          errno: -20,
          syscall: 'rmdir',
          path: normalizedPath,
        }
      );
    }

    // Recursively remove all children
    const children = Array.from(node.entries);
    for (const childName of children) {
      const childPath = this.joinPath(normalizedPath, childName);
      const childNode = this.storage.get(childPath);

      if (childNode) {
        if (childNode.type === 'directory') {
          await this.removeDirectory({
            path: childPath,
            context: args.context,
          });
        } else {
          await this.deleteFile({ path: childPath, context: args.context });
        }
      }
    }

    // Remove from parent's entries
    const parentPath = this.getParentPath(normalizedPath);
    if (parentPath) {
      const parent = this.storage.get(parentPath);
      if (parent && parent.type === 'directory') {
        parent.entries.delete(this.getBaseName(normalizedPath));
        parent.modifiedAt = new Date();
      }
    }

    this.storage.delete(normalizedPath);
  }

  /**
   * Normalize a path to ensure consistent format
   */
  private normalizePath(path: string): string {
    if (!path || path === '.') {
      return '/';
    }

    // Remove leading slash if present for processing
    let normalized = path.startsWith('/') ? path : '/' + path;

    // Remove trailing slash unless it's root
    if (normalized !== '/' && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }

    // Resolve . and ..
    const parts = normalized.split('/').filter(Boolean);
    const resolved: string[] = [];

    for (const part of parts) {
      if (part === '.') {
        continue;
      } else if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }

    return '/' + resolved.join('/');
  }

  /**
   * Get the parent directory path
   */
  private getParentPath(path: string): string | null {
    const normalized = this.normalizePath(path);
    if (normalized === '/') {
      return null;
    }

    const lastSlash = normalized.lastIndexOf('/');
    if (lastSlash === 0) {
      return '/';
    }

    return normalized.substring(0, lastSlash) || '/';
  }

  /**
   * Get the base name of a path
   */
  private getBaseName(path: string): string {
    const normalized = this.normalizePath(path);
    if (normalized === '/') {
      return '';
    }

    const lastSlash = normalized.lastIndexOf('/');
    return normalized.substring(lastSlash + 1);
  }

  /**
   * Join path segments
   */
  private joinPath(...parts: string[]): string {
    const normalized = parts
      .filter(Boolean)
      .map(p => (p.startsWith('/') ? p.slice(1) : p))
      .filter(p => p !== '.')
      .join('/');

    return '/' + normalized;
  }
}
