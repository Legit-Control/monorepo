import * as nodeFs from 'node:fs';
import { Stats } from 'node:fs';
import { ASimpleCompositeSubfs, toDirEntry } from '@legit-sdk/core';

/**
 * SimpleMemorySubFs - A simple in-memory filesystem implementation
 *
 * This class extends ASimpleCompositeSubfs and stores all files and directories
 * in a JavaScript Map in memory. It's useful for testing, caching, or temporary
 * file storage that doesn't need to persist.
 */
export class SimpleMemorySubFs extends ASimpleCompositeSubfs {
  storage = new Map();
  nextFileType = 1;

  /**
   * Debug method to inspect internal storage
   */
  _debugGetStorage() {
    return this.storage;
  }

  constructor({ name, rootPath, initialData }) {
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
      this._populateFromInitialData(initialData, '/');
    }
  }

  /**
   * Populate the filesystem from initial data structure
   * @param data - The data structure to populate from (string = file, object = folder)
   * @param currentPath - The current path in the filesystem
   */
  _populateFromInitialData(data, currentPath) {
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
      const parentPath = this._getParentPath(currentPath);
      if (parentPath) {
        const parent = this.storage.get(parentPath);
        if (parent && parent.type === 'directory') {
          parent.entries.add(this._getBaseName(currentPath));
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
          this._populateFromInitialData(value, childPath);
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
        const parentPath = this._getParentPath(currentPath);
        if (parentPath) {
          const parent = this.storage.get(parentPath);
          if (parent && parent.type === 'directory') {
            parent.entries.add(this._getBaseName(currentPath));
          }
        }

        // Recursively populate children
        const dirNode = this.storage.get(currentPath);
        if (dirNode && dirNode.type === 'directory') {
          for (const [name, value] of Object.entries(data)) {
            const childPath =
              currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
            dirNode.entries.add(name);
            this._populateFromInitialData(value, childPath);
          }
        }
      }
    }
  }

  fileType() {
    return this.nextFileType;
  }

  async createDirectory({ path, recursive = false, context }) {
    const normalizedPath = this._normalizePath(path);

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
      const parentPath = this._getParentPath(normalizedPath);
      if (
        parentPath &&
        parentPath !== normalizedPath &&
        !this.storage.has(parentPath)
      ) {
        await this.createDirectory({
          path: parentPath,
          recursive: true,
          context,
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
    const parentPath2 = this._getParentPath(normalizedPath);
    if (parentPath2) {
      const parent = this.storage.get(parentPath2);
      if (parent && parent.type === 'directory') {
        parent.entries.add(this._getBaseName(normalizedPath));
        parent.modifiedAt = now;
      }
    }
  }

  async getStats({ path, context }) {
    const normalizedPath = this._normalizePath(path);
    const node = this.storage.get(normalizedPath);

    if (!node) {
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, stat '${path}'`),
        {
          code: 'ENOENT',
          errno: -2,
          syscall: 'stat',
          path: normalizedPath,
        }
      );
    }

    const stats = new Stats();
    const mode = node.type === 'directory' ? 0o755 | 0o40000 : 0o644 | 0o100000;

    stats.mode = mode;
    stats.size = node.type === 'file' ? node.content.length : 4096;
    stats.mtimeMs = node.modifiedAt.getTime();
    stats.birthtimeMs = node.createdAt.getTime();
    stats.ctimeMs = node.modifiedAt.getTime();

    return stats;
  }

  async readFileContent({ path, context }) {
    const normalizedPath = this._normalizePath(path);
    const node = this.storage.get(normalizedPath);

    if (!node || node.type !== 'file') {
      return undefined;
    }

    return {
      content: node.content,
      oid: undefined, // No git OID in memory fs
    };
  }

  async writeFileContent({ path, content, context }) {
    const normalizedPath = this._normalizePath(path);
    const now = new Date();
    const contentBuffer =
      typeof content === 'string' ? Buffer.from(content, 'utf8') : content;

    // Check if file exists
    const existingNode = this.storage.get(normalizedPath);

    if (existingNode) {
      if (existingNode.type === 'directory') {
        throw Object.assign(
          new Error(
            `EISDIR: illegal operation on a directory, write '${path}'`
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
      const parentPath = this._getParentPath(normalizedPath);
      if (parentPath) {
        let parent = this.storage.get(parentPath);

        // Create parent if it doesn't exist
        if (!parent) {
          await this.createDirectory({
            path: parentPath,
            recursive: true,
            context,
          });
          parent = this.storage.get(parentPath);
        }

        if (parent && parent.type === 'directory') {
          parent.entries.add(this._getBaseName(normalizedPath));
          parent.modifiedAt = now;
        }
      }
    }
  }

  async readDirectory({ path, context }) {
    const normalizedPath = this._normalizePath(path);
    const node = this.storage.get(normalizedPath);

    if (!node) {
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, scandir '${path}'`),
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
        new Error(`ENOTDIR: not a directory, scandir '${path}'`),
        {
          code: 'ENOTDIR',
          errno: -20,
          syscall: 'scandir',
          path: normalizedPath,
        }
      );
    }

    // Convert directory entries to Dirent-like objects
    const entries = [];
    for (const name of node.entries) {
      // Construct child path - handle root specially
      let childPath;
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

  async renamePath({ oldPath, newPath, oldContext, newContext }) {
    const oldNormalized = this._normalizePath(oldPath);
    const newNormalized = this._normalizePath(newPath);

    const node = this.storage.get(oldNormalized);
    if (!node) {
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, rename '${oldPath}'`),
        {
          code: 'ENOENT',
          errno: -2,
          syscall: 'rename',
          path: oldNormalized,
        }
      );
    }

    // Remove from old parent
    const oldParent = this._getParentPath(oldNormalized);
    if (oldParent) {
      const oldParentNode = this.storage.get(oldParent);
      if (oldParentNode && oldParentNode.type === 'directory') {
        oldParentNode.entries.delete(this._getBaseName(oldNormalized));
      }
    }

    // Move to new location
    this.storage.delete(oldNormalized);
    this.storage.set(newNormalized, node);
    node.modifiedAt = new Date();

    // Add to new parent
    const newParent = this._getParentPath(newNormalized);
    if (newParent) {
      const newParentNode = this.storage.get(newParent);
      if (newParentNode && newParentNode.type === 'directory') {
        newParentNode.entries.add(this._getBaseName(newNormalized));
        newParentNode.modifiedAt = new Date();
      }
    }

    // If it's a directory, update all children paths
    if (node.type === 'directory') {
      const children = Array.from(node.entries);
      for (const childName of children) {
        const oldChildPath = this._joinPath(oldNormalized, childName);
        const newChildPath = this._joinPath(newNormalized, childName);
        await this.renamePath({
          oldPath: oldChildPath,
          newPath: newChildPath,
          oldContext,
          newContext,
        });
      }
    }
  }

  async deleteFile({ path, context }) {
    const normalizedPath = this._normalizePath(path);
    const node = this.storage.get(normalizedPath);

    if (!node) {
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, unlink '${path}'`),
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
        new Error(`EISDIR: illegal operation on a directory, unlink '${path}'`),
        {
          code: 'EISDIR',
          errno: -21,
          syscall: 'unlink',
          path: normalizedPath,
        }
      );
    }

    // Remove from parent's entries
    const parentPath = this._getParentPath(normalizedPath);
    if (parentPath) {
      const parent = this.storage.get(parentPath);
      if (parent && parent.type === 'directory') {
        parent.entries.delete(this._getBaseName(normalizedPath));
        parent.modifiedAt = new Date();
      }
    }

    this.storage.delete(normalizedPath);
  }

  async removeDirectory({ path, context }) {
    const normalizedPath = this._normalizePath(path);
    const node = this.storage.get(normalizedPath);

    if (!node) {
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, rmdir '${path}'`),
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
        new Error(`ENOTDIR: not a directory, rmdir '${path}'`),
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
      const childPath = this._joinPath(normalizedPath, childName);
      const childNode = this.storage.get(childPath);

      if (childNode) {
        if (childNode.type === 'directory') {
          await this.removeDirectory({
            path: childPath,
            context,
          });
        } else {
          await this.deleteFile({ path: childPath, context });
        }
      }
    }

    // Remove from parent's entries
    const parentPath = this._getParentPath(normalizedPath);
    if (parentPath) {
      const parent = this.storage.get(parentPath);
      if (parent && parent.type === 'directory') {
        parent.entries.delete(this._getBaseName(normalizedPath));
        parent.modifiedAt = new Date();
      }
    }

    this.storage.delete(normalizedPath);
  }

  /**
   * Normalize a path to ensure consistent format
   */
  _normalizePath(path) {
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
    const resolved = [];

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
  _getParentPath(path) {
    const normalized = this._normalizePath(path);
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
  _getBaseName(path) {
    const normalized = this._normalizePath(path);
    if (normalized === '/') {
      return '';
    }

    const lastSlash = normalized.lastIndexOf('/');
    return normalized.substring(lastSlash + 1);
  }

  /**
   * Join path segments
   */
  _joinPath(...parts) {
    const normalized = parts
      .filter(Boolean)
      .map(p => (p.startsWith('/') ? p.slice(1) : p))
      .filter(p => p !== '.')
      .join('/');

    return '/' + normalized;
  }
}
