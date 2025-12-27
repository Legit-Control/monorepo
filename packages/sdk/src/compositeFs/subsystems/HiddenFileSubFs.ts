import { CompositeSubFs } from '../CompositeSubFs.js';
import CompositFsFileHandle from '../CompositeFsFileHandle.js';
import type { PathLike } from 'fs';
import ignore from 'ignore';
import { BaseCompositeSubFs } from './BaseCompositeSubFs.js';
import { CompositeFs } from '../CompositeFs.js';

/**
 * FS utilized to hide files, it is responsible for files found in hiddenFiles
 *
 * For those files it fails on open, close etc.
 */
export class HiddenFileSubFs extends BaseCompositeSubFs {
  private ig: ReturnType<typeof ignore>;

  constructor({
    name,

    hiddenFiles,
  }: {
    name: string;

    hiddenFiles: string[];
  }) {
    super({
      name,
    });
    this.ig = ignore();
    this.ig.add(hiddenFiles);
  }

  override async responsible(filePath: string): Promise<boolean> {
    // always use posix-style paths for ignore

    const normalized = filePath.replace(/\\/g, '/');
    let relative = normalized.startsWith('./')
      ? normalized.slice(2)
      : normalized;
    relative = relative.startsWith('/') ? relative.slice(1) : relative;

    if (relative === '' || relative === '.') {
      return false;
    }
    const ignores = this.ig.ignores(relative);
    return ignores;
  }

  override fileType(): number {
    return 0xff; // Arbitrary type for hidden
  }

  private error(path: any): Error {
    return new Error(
      `Access to hidden file is not allowed: ${this.toStr(path)}`
    );
  }

  override async open(
    path: PathLike,
    flags: string,
    mode?: number
  ): Promise<CompositFsFileHandle> {
    throw this.error(path);
  }

  override async access(path: PathLike): Promise<void> {
    throw this.error(path);
  }

  override async stat(path: PathLike): Promise<any> {
    throw this.error(path);
  }

  override async lstat(path: PathLike): Promise<any> {
    throw this.error(path);
  }

  override async opendir(path: PathLike): Promise<any> {
    throw this.error(path);
  }

  override async link(existingPath: PathLike): Promise<void> {
    throw this.error(existingPath);
  }

  override async mkdir(path: PathLike): Promise<any> {
    throw this.error(path);
  }

  override async readDirFiltering?(
    path: PathLike,
    entries: string[]
  ): Promise<string[]> {
    // go through all entries, attach the path to them, and check if it matches with the ignore pattern - if so remove them from the array
    const result: string[] = [];
    for (const entry of entries) {
      const fullPath =
        this.toStr(path) !== '/' ? this.toStr(path) + '/' + entry : '/' + entry;
      const isIgnored = await this.responsible(fullPath);
      if (!isIgnored) {
        result.push(entry);
      }
    }
    return result;
  }

  override async readdir(path: PathLike): Promise<any> {
    throw this.error(path);
  }

  override async readlink(path: PathLike): Promise<any> {
    throw this.error(path);
  }

  override async unlink(path: PathLike): Promise<void> {
    throw this.error(path);
  }

  override async rename(oldPath: PathLike): Promise<void> {
    throw this.error(oldPath);
  }

  override async rmdir(path: PathLike): Promise<void> {
    throw this.error(path);
  }

  override async symlink(_target: PathLike, path: PathLike): Promise<void> {
    throw this.error(path);
  }

  override async lookup(filePath: string): Promise<number> {
    throw this.error(filePath);
  }

  override resolvePath(fd: number): string {
    throw new Error(`Access to hidden file is not allowed: resolvePath(${fd})`);
  }

  override async close(fh: CompositFsFileHandle): Promise<void> {
    throw new Error(
      'Access to hidden file is not allowed: close: ' + fh.subFsFileDescriptor
    );
  }

  override async dataSync(fh: CompositFsFileHandle): Promise<void> {
    throw new Error(
      'Access to hidden file is not allowed: dataSync: ' +
        fh.subFsFileDescriptor
    );
  }

  override async read(
    fh: CompositFsFileHandle,
    buffer: Buffer | Uint8Array,
    offset: number,
    length: number,
    position: number
  ): Promise<any> {
    throw new Error(
      'Access to hidden file is not allowed: readFileHandle: ' +
        fh.subFsFileDescriptor
    );
  }
}
