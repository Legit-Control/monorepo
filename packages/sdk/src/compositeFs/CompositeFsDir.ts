import * as nodeFs from 'node:fs';
import { CompositeFs } from './CompositeFs.js';
import { IDirent } from 'memfs/lib/node/types/misc.js';

interface DirEntry {
  name: string;
  path: string;
}

export class CompositeFsDir {
  private entries: DirEntry[] = [];
  private currentIndex = 0;
  private closed = false;
  private compositFs: CompositeFs;
  private dirPath: string;
  private initialized = false;

  constructor(compositFs: CompositeFs, dirPath: string) {
    this.compositFs = compositFs;
    this.dirPath = dirPath;
  }

  private async initialize() {
    if (this.initialized) return;

    // Collect all entries from all sub-filesystems
    const fileNames: Set<string> = new Set<string>();

    // Iterate through filesystems in reverse order (same as readdir)
    for (const fileSystem of [...this.compositFs.subFilesystems].reverse()) {
      const subFsDirEntries = await fileSystem.readdir(this.dirPath);
      for (const fileName of subFsDirEntries) {
        fileNames.add(fileName);
      }
    }

    // Filter out hidden files
    for (const fileName of Array.from(fileNames)) {
      const fullPath = this.dirPath + '/' + fileName;
      if (
        !(await this.compositFs.hiddenFilesFileSystem?.responsible(fullPath))
      ) {
        this.entries.push({
          name: fileName,
          path: fullPath,
        });
      }
    }

    this.initialized = true;
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<IDirent> {
    await this.initialize();

    while (this.currentIndex < this.entries.length && !this.closed) {
      const entry = this.entries[this.currentIndex++]!;

      // Get stats to determine if it's a file or directory
      try {
        const stats = await this.compositFs.stat(entry.path);

        // Create a Dirent-like object
        const dirent: nodeFs.Dirent = {
          name: entry.name,
          isFile: () => stats.isFile(),
          isDirectory: () => stats.isDirectory(),
          isBlockDevice: () => stats.isBlockDevice(),
          isCharacterDevice: () => stats.isCharacterDevice(),
          isSymbolicLink: () => stats.isSymbolicLink(),
          isFIFO: () => stats.isFIFO(),
          isSocket: () => stats.isSocket(),
        } as nodeFs.Dirent;

        yield dirent;
      } catch (error) {
        // Skip entries that can't be stat'd
        console.debug(`Failed to stat ${entry.path}:`, error);
      }
    }
  }

  async read(): Promise<nodeFs.Dirent | null> {
    if (this.closed) {
      throw new Error('Directory handle is closed');
    }

    await this.initialize();

    if (this.currentIndex >= this.entries.length) {
      return null;
    }

    const entry = this.entries[this.currentIndex++]!;

    try {
      const stats = await this.compositFs.stat(entry.path);

      const dirent: nodeFs.Dirent = {
        name: entry.name,
        isFile: () => stats.isFile(),
        isDirectory: () => stats.isDirectory(),
        isBlockDevice: () => stats.isBlockDevice(),
        isCharacterDevice: () => stats.isCharacterDevice(),
        isSymbolicLink: () => stats.isSymbolicLink(),
        isFIFO: () => stats.isFIFO(),
        isSocket: () => stats.isSocket(),
      } as nodeFs.Dirent;

      return dirent;
    } catch (error) {
      // Skip this entry and try the next one
      return this.read();
    }
  }

  async close(): Promise<void> {
    this.closed = true;
    this.entries = [];
  }

  get path(): string {
    return this.dirPath;
  }
}
