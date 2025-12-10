import git from 'isomorphic-git';
import { CompositeSubFs } from '../../CompositeSubFs.js';
import CompositFsFileHandle from '../../CompositeFsFileHandle.js';
import type { Stats, BigIntStats } from 'fs';
import * as path from 'path';

import { createFsFromVolume, IFs, memfs, Volume } from 'memfs';
import {
  IStats,
  TFileHandleReadResult,
  TFileHandleWriteResult,
  TTime,
} from 'memfs/lib/node/types/misc.js';
import { CompositeFs } from '../../CompositeFs.js';
import {
  IStatOptions,
  IWriteFileOptions,
} from 'memfs/lib/node/types/options.js';
import type {
  PathLike,
  IFileHandle,
  TData,
  TDataOut,
  IReadFileOptions,
  TMode,
} from '../../../types/fs-types.js';

import {
  VirtualFileArgs,
  VirtualFileDefinition,
} from './virtualFiles/gitVirtualFiles.js';
import { allGitVirtualFiles } from './virtualFiles/gitVirtualFiles.js';
import { BaseCompositeSubFs } from '../BaseCompositeSubFs.js';
import * as nodeFs from 'node:fs';
import { gitBranchFileVirtualFile } from './virtualFiles/gitBranchFileVirtualFile.js';
import { LegitPathRouter, MatchResult } from './LegitPathRouter.js';
import { gitBranchesListVirtualFile } from './virtualFiles/gitBranchesListVirtualFile.js';
import { gitBranchHeadVirtualFile } from './virtualFiles/gitBranchHeadVirtualFile.js';
import { legitVirtualFile } from './virtualFiles/legitVirtualFile.js';
import { gitCommitFileVirtualFile } from './virtualFiles/gitCommitFileVirtualFile.js';
import { gitCommitVirtualFolder } from './virtualFiles/gitCommitVirtualFolder.js';
import { gitBranchOperationVirtualFile } from './virtualFiles/operations/gitBranchOperationVirtualFile.js';

import { gitBranchOperationsVirtualFile } from './virtualFiles/operations/gitBranchOperationsVirtualFile.js';
import { getThreadName } from './virtualFiles/operations/getThreadName.js';
import { gitBranchHistory } from './virtualFiles/gitBranchHistory.js';
import { gitBranchOperationHeadVirtualFile } from './virtualFiles/operations/gitBranchOperationHeadVirtualFile.js';
import { gitCurrentBranchVirtualFile } from './virtualFiles/gitCurrentBranchVirtualFile.js';
import { claudeVirtualSessionFileVirtualFile } from './virtualFiles/claudeVirtualSessionFileVirtualFile.js';
import { toDirEntry } from './virtualFiles/utils.js';

function getGitCache(fs: any): any {
  // If it's a CompositeFs with gitCache, use it
  if (fs && fs.gitCache !== undefined) {
    return fs.gitCache;
  }
  // If it has a parent, traverse up to find the gitCache
  if (fs && fs.parentFs) {
    return getGitCache(fs.parentFs);
  }
  // Default to empty object if no cache found
  return {};
}

const handlers = {
  noAdditionalFiles: () => [],
  listBranches: () => ['main', 'dev', 'feature-x', 'feature/login'],
  branchFile: () => 'branch file',
  branchHead: () => 'branch head',
  branchTip: () => 'branch tip',
  branchOperation: () => 'branch operation',
  commitFile: () => 'commit file',
  commitsTwoChars: () => ['ab', 'cd', 'ef'],
  commitsThirtyEightChars: () => [
    'dsdasdasdasdasdasdasdasdasdasdasdasdasdas',
    'abcdefghijklmnopqrstuvwxyz123456',
  ],
};

const stub = async () => undefined;
const stubStats = async () =>
  ({
    isFile: () => true,
    isDirectory: () => false,
    size: 0,
    mode: 0,
    mtime: new Date(),
    ctime: new Date(),
    atime: new Date(),
    birthtime: new Date(),
  }) as any;

const noAdditionalFiles = {
  type: 'directory',
  pattern: /.*/,
  getFile: stub,
  getStats: stubStats,
  rename: stub,
  mkdir: stub,
};

/**
 * 1. Path Structure Complexity
  - Your nested .legit paths (e.g., /.legit/branch/my-branch-name/.legit/head) create redundancy
  - Consider flattening: /.legit/branches/my-branch-name/head vs /.legit/branch/my-branch-name/.legit/head

Reason for the concept: i need to distinguish .legit files from other folders, therefore i wanted to introduce .letgit as a reserved folder independent from the depth or if repeated
Any problems you see with this?


  2. Write Operations on Historical Data
  - Writing to /.legit/history/commits/... paths is conceptually problematic - commits are immutable
  - Consider read-only for historical data, write-only for branch operations

  100% with you commits should be read only folders

  3. Branch Head Management
  - Using git tags for head tracking (my-branch-name_legithead) pollutes the tag namespace
  - Alternative: Use a dedicated ref namespace like refs/legit/heads/my-branch-name

Reason for the concept: i see the point with pollution of tag namespace BUT this will help existing tools to display the concept - i would start with tags and move refs to a later point in time
 - what speaks against this?

  4. Conflict with Existing Virtual Files
  - Current implementation has .status.gitbox, .branch.gitbox files
  - Need strategy to migrate or maintain compatibility

Context: the hole thing is a non published poc so no need to migrate - just an implementation change needed

  Architectural Challenges

  1. Performance
  - Git operations (especially history traversal) can be expensive
  - Current memfs caching might not scale for large repos
  - Consider lazy loading and bounded caches

   Future problem - lets not premature optimation or clear doubts?

  2. Consistency
  - Multiple write paths (working copy, branches) need careful coordination
  - Race conditions between git operations and filesystem operations

  Lets postpone this for now

  3. Error Handling
  - Git operations can fail (conflicts, invalid commits)
  - Need clear error propagation through the FS layer

  Lets discuss this deeper - dont understand the problem here.

  Implementation Approach

  Phase 1: Read-Only Git Views
  // Start with immutable views
  /.legit/status                    // Current git status
  /.legit/commits/{sha}/path/to/file // Historical file access
  /.legit/branches/                  // List branches
  /.legit/refs/heads/{branch}/path   // Branch file access

  Phase 2: Branch Operations
  // Add write capabilities
  /.legit/refs/heads/{branch}/.meta/head  // Track branch head
  /.legit/refs/heads/{branch}/path        // Write to branch

  Phase 3: Advanced Features
  // Commit creation, branch management
  /.legit/stage/                    // Staging area
  /.legit/commit                    // Trigger commit

  Plan sounds good!


  Next Steps

  1. Refine the path structure - Simplify and avoid nested .legit directories
    - no please take my points into consideratio
   
  2. Create a proof-of-concept - Start with read-only status and commit access
 - sounds good

  3. Build test infrastructure - Set up git fixture creation and FS testing utilities
- absolutly

  4. Implement incrementally - Phase approach to reduce complexity

  alreight

  The architecture supports your vision, but consider starting simpler and evolving based on real usage patterns.



  /.legit/status                              // Git status info
  /.legit/commits/{sha(0,1)}/{sha(2..20)}/path/to/file  // Historical files
  /.legit/branches/                            // List branches
  /.legit/branches/{name}/path/to/file     // Branch files (read/write)
  /.legit/branches/{name}/.legit/head // read/write of the head commit of the branch {name}
  /.legit/branches/{name}/.legit/tip // read/write of the tip of the branch {name} - keeping this allows undo redo ops

  
 */
export class GitSubFs extends BaseCompositeSubFs implements CompositeSubFs {
  private static readonly LEGIT_DIR = '.legit';

  /**
   * how to handle branches with slashes in them?
   *
   * Lets say i have a branch called my/branch/name
   * this means i am not allowed to have a branch called my because this would conflict with
   */

  // .legit/branches/main/
  private static pathRouter = new LegitPathRouter({
    '.legit': {
      '.': legitVirtualFile,
      operation: gitBranchOperationVirtualFile,
      head: gitBranchHeadVirtualFile,
      operationHead: gitBranchOperationHeadVirtualFile,
      operationHistory: gitBranchOperationsVirtualFile,
      history: gitBranchHistory,
      currentBranch: gitCurrentBranchVirtualFile,
      branches: {
        '.': gitBranchesListVirtualFile,
        '[branchName]': {
          // branch names could include / so this is not a good delimiter here
          '.legit': {
            '.': legitVirtualFile,
            operation: gitBranchOperationVirtualFile,
            head: gitBranchHeadVirtualFile,
            operationHead: gitBranchOperationHeadVirtualFile,
            operationHistory: gitBranchOperationsVirtualFile,
            history: gitBranchHistory,
            threadName: getThreadName,
          },
          '[[...filePath]]': gitBranchFileVirtualFile,
        },
      },
      commits: {
        '.': gitCommitVirtualFolder,
        '[sha_1_1_2]': {
          '.': gitCommitVirtualFolder,
          '[sha1_3__40]': {
            '[[...filePath]]': gitCommitFileVirtualFile,
          },
        },
      },
      // TODO add a compare setup
      // compare: {
      //   '[[aWithB]]': {
      //     '.legit': {
      //       'changelist': getChangeList,
      //     }, // gitCompareVirtualFile,
      //     '[...filePath]': gitCompareVirtualFile,
      //   }
      // }
    },
    '.claude': {
      '[[...filePath]]': claudeVirtualSessionFileVirtualFile,
    },
    '[[...filePath]]': gitBranchFileVirtualFile,
  });

  private memFs: IFs;
  private openFh: Record<
    number,
    {
      path: string;
      mode: string;
      fh: IFileHandle;
      openSha: string | undefined;
      readSha: string | undefined;
      unflushed: { start: number; length: number }[];
    }
  > = {};

  private virtualFiles: VirtualFileDefinition[];
  private legitFileNames: string[];
  storageFs: CompositeFs;

  async getAuthor(): Promise<{
    name: string;
    email: string;
    date: number;
    timezoneOffset: number;
  }> {
    const name = await git.getConfig({
      fs: this.storageFs,
      dir: this.gitRoot,
      path: 'user.name',
    });
    const email = await git.getConfig({
      fs: this.storageFs,
      dir: this.gitRoot,
      path: 'user.email',
    });
    const date = Math.floor(Date.now() / 1000);
    const timezoneOffset = new Date().getTimezoneOffset();

    return { name, email, date, timezoneOffset };
  }

  constructor({
    name,
    parentFs,
    gitStorageFs,
    gitRoot,
    virtualFiles = allGitVirtualFiles,
  }: {
    name: string;
    parentFs: CompositeFs;
    gitStorageFs: CompositeFs;
    gitRoot: string;
    virtualFiles?: VirtualFileDefinition[];
  }) {
    super({ name, parentFs, gitRoot });

    this.gitRoot = gitRoot;
    this.storageFs = gitStorageFs;
    this.memFs = createFsFromVolume(new Volume());
    this.virtualFiles = virtualFiles;

    // TODO source this from the virtual files directly
    this.legitFileNames = ['branches', 'commits'];
  }

  async responsible(filePath: string): Promise<boolean> {
    return true;
    // return true this.isLegitPath(filePath);
  }

  private isLegitPath(path: string): boolean {
    return (
      path.includes(`/${GitSubFs.LEGIT_DIR}/`) ||
      path.includes(`/${GitSubFs.LEGIT_DIR}`)
    );
  }

  private getRouteHandler(filePath: string): MatchResult | undefined {
    // Remove gitRoot prefix from filePath if present
    let normalizedPath = filePath;
    if (this.gitRoot && filePath.startsWith(this.gitRoot)) {
      if (this.gitRoot === '/') {
        normalizedPath = filePath.slice(this.gitRoot.length);
      } else {
        normalizedPath = filePath.slice(this.gitRoot.length + 1);
      }
    }
    const firstLegitIndex = normalizedPath.indexOf(`/${GitSubFs.LEGIT_DIR}`);
    if (firstLegitIndex === -1) {
      return GitSubFs.pathRouter.match(normalizedPath);
    }

    const filePathWithoutLegit = normalizedPath.slice(firstLegitIndex + 1);
    return GitSubFs.pathRouter.match(normalizedPath);
  }

  /**
   * Opens a virtual file from the Git-based virtual file system.
   *
   * This method retrieves a virtual file descriptor for the given `filePath`, checks if the file is writable
   * based on its type and the provided `flags`, and ensures that write operations are only allowed for
   * certain file types (e.g., "branch-file", "branch-head", "branch-tip"). It then loads the file's content
   * into the in-memory file system (`memFs`), ensures parent directories exist, and finally opens the file,
   * returning a `CompositFsFileHandle` for further operations.
   *
   * @param filePath - The path to the virtual file to open.
   * @param flags - The file system flags indicating the desired open mode (e.g., "r" for read, "w" for write, "a" for append, "x" for exclusive creation).
   *   - "r": Open file for reading. An exception occurs if the file does not exist.
   *   - "w": Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
   *   - "a": Open file for appending. The file is created if it does not exist.
   *   - "x": Exclusive flag. Used with "w" or "a" to fail if the file exists.
   *   - Combinations like "wx", "ax", etc., are also supported.
   * @param mode - Optional file mode (permission and sticky bits) to use if creating a file.
   * @returns A promise that resolves to a `CompositFsFileHandle` for the opened file.
   * @throws If the file is not a virtual legit file, if write operations are not allowed for the file type,
   *         or if the file does not exist.
   */
  override async open(
    filePath: string,
    flags: string,
    mode?: number
  ): Promise<CompositFsFileHandle> {
    const parsed = this.getRouteHandler(filePath);
    if (!parsed) throw new Error('Not a virtual legit file');
    const isWritable = parsed?.handler.writeFile !== undefined;
    if (!isWritable && (flags.includes('w') || flags.includes('a'))) {
      throw new Error(
        `Write operations not allowed for ${parsed?.handler.type}`
      );
    }

    // TODO add flags to handler definition
    if (
      flags.includes('x') &&
      parsed?.handler.type !== 'gitBranchFileVirtualFile'
    ) {
      throw new Error(
        `Exclusive operations not allowed for ${parsed?.handler.type}`
      );
    }

    const fileFromGit = await parsed.handler.getFile({
      cacheFs: this.memFs,
      filePath,
      userSpaceFs: this.compositFs,
      gitRoot: this.gitRoot,
      nodeFs: this.storageFs,
      pathParams: parsed.params,
      author: await this.getAuthor(),
    });

    let fileExistsInCache = false;
    for (const fh of Object.values(this.openFh)) {
      if (fh.path === filePath) {
        fileExistsInCache = true;
      }
    }

    // fileFromFs
    // this.memFs.promises.

    // assert flags / file existence state
    if ((fileFromGit || fileExistsInCache) && flags.includes('x')) {
      throw Object.assign(
        new Error(`EEXIST: file already exists, open '${filePath}'`),
        { code: 'EEXIST', errno: -17, syscall: 'open', path: filePath }
      );
    }

    if (
      !fileFromGit &&
      !fileExistsInCache &&
      !(flags.includes('w') || flags.includes('a'))
    ) {
      // in case the file doesnt exist but planned to
      throw Object.assign(
        new Error(`ENOENT: no such file or directory, open '${filePath}'`),
        { code: 'ENOENT', errno: -2, syscall: 'open', path: filePath }
      );
    }

    // Ensure parent directories exist in memfs
    const dir = path.dirname(filePath);
    await this.memFs.promises.mkdir(dir, { recursive: true });

    // Write the virtual file content to memfs if the file existed
    if (
      (fileFromGit === undefined && !flags.includes('x')) ||
      (fileFromGit && fileFromGit.type === 'file')
    ) {
      try {
        const access = await this.memFs.promises.access(filePath);
      } catch (err) {
        // file did not exist - create it
        await this.memFs.promises.writeFile(
          filePath,
          '' // we start with an empty string and use the memfs file only as placeholder
        );
      }
    }

    const fh = await this.memFs.promises.open(filePath, flags, mode);
    const fd = fh.fd;
    const filehandle = new CompositFsFileHandle({
      fs: this,
      compositeFs: this.compositFs,
      subFsFileDescriptor: fd,
      parentFsFileDescriptors: [],
    });
    this.openFh[fd] = {
      path: filePath,
      mode: flags,
      fh: fh,
      // NOTE consider using empty content sha instead of undefined
      openSha: fileFromGit?.oid,
      readSha: undefined,
      unflushed: [],
    };
    if (flags.includes('x') || flags.includes('w')) {
      // NOTE workaround for created files that don't exist in the git history yet
      // Added to allow stats call (that is used in the create call) that is not aware of the open flags
      // to return the stats from the memory file
      this.openFh[fd].unflushed.push({
        length: 0,
        start: 0,
      });
    }
    return filehandle;
  }

  override async mkdir(
    path: PathLike,
    options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null
  ): Promise<void> {
    const pathStr = path.toString();
    const branchFileVf = this.getRouteHandler(pathStr);

    const optionsToPass = options ? { options: options } : {};

    try {
      await branchFileVf?.handler.mkdir({
        cacheFs: this.memFs,
        filePath: path.toString(),
        userSpaceFs: this.compositFs,
        nodeFs: this.storageFs,
        gitRoot: this.gitRoot,
        pathParams: branchFileVf.params,
        ...optionsToPass,
        author: await this.getAuthor(),
      });

      const optionsToPassToMemfs =
        typeof options === 'object'
          ? { ...options, recursive: true }
          : { recursive: true };

      await this.memFs.promises.mkdir(path, optionsToPassToMemfs);
      // Create file handles for every folder on the path
      const parts = pathStr.split('/');
      let current = '';
      for (let i = 1; i <= parts.length; i++) {
        current = parts.slice(0, i).join('/');
        // Only create if not already open and is a directory
        try {
          const stats = await this.memFs.promises.stat(current);
          if (stats.isDirectory()) {
            const fh = await this.memFs.promises.open(current, 'r');
            this.openFh[fh.fd] = {
              path: current,
              mode: 'r',
              fh: fh,
              openSha: undefined,
              readSha: undefined,
              unflushed: [],
            };
          }
        } catch {
          // Ignore if not exists or not a directory
        }
      }
    } catch (e) {
      throw e;
    }
  }

  override async access(path: PathLike, mode?: number): Promise<void> {
    // for now just use the stats call
    await this.stat(path);

    // const pathStr = path.toString();
    // const vFileDescriptor = this.getVirtualDescriptor(pathStr);
    // if (!vFileDescriptor) {
    //   const legitDirMatch = this.legitFileNames.some((fn) =>
    //     pathStr.endsWith(`.legit/${fn}`),
    //   );
    //   if (!legitDirMatch) {
    //     throw new Error(`ENOENT: no such file or directory, stat '${pathStr}'`);
    //   }
    // }
  }

  override async futimes(
    fh: CompositFsFileHandle,
    atime: TTime,
    mtime: TTime
  ): Promise<void> {
    const openFh = this.openFh[fh.subFsFileDescriptor];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }
    return await openFh.fh.utimes(atime, mtime);
  }

  override async fstat(
    fh: CompositFsFileHandle,
    options?: IStatOptions
  ): Promise<IStats> {
    const openFh = this.openFh[fh.subFsFileDescriptor];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }
    // TODO get the stats from the filehandles path instead?
    return this.stat(openFh.path, options);
  }

  override async ftruncate(
    fh: CompositFsFileHandle,
    len?: number
  ): Promise<void> {
    const openFh = this.openFh[fh.subFsFileDescriptor];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }
    openFh.unflushed.push({
      length: 0,
      start: 0,
    });
    return await openFh.fh.truncate(len);
  }

  override async stat(
    path: PathLike,
    opts?: { bigint?: false }
  ): Promise<nodeFs.Stats>;
  override async stat(
    path: PathLike,
    opts: { bigint: true }
  ): Promise<nodeFs.BigIntStats>;
  override async stat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;
  override async stat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats> {
    const pathStr = path.toString();

    // Check if there is an open file handle for this path
    const openFhEntry = Object.values(this.openFh).find(
      fh => fh.path === pathStr && fh.unflushed.length > 0
    );
    if (openFhEntry && openFhEntry.unflushed.length > 0) {
      return (await openFhEntry.fh.stat(opts)) as any; // TODO fix type
    }

    const parsed = this.getRouteHandler(pathStr);

    if (!parsed) {
      throw new Error(`ENOENT: no such file or directory, stat '${pathStr}'`);
    }

    const stats = await parsed.handler.getStats({
      cacheFs: this.memFs,
      filePath: pathStr,
      userSpaceFs: this.compositFs,
      gitRoot: this.gitRoot,
      nodeFs: this.storageFs,
      pathParams: parsed.params,
      author: await this.getAuthor(),
    });

    return stats;

    // Create synthetic stats
    // const now = new Date();
    // const stats: Stats = {
    //   dev: 0,
    //   ino: 0,
    //   mode: file.mode || (file.type === "directory" ? 0o755 : 0o644),
    //   nlink: 1,
    //   uid: process.getuid ? process.getuid() : 0,
    //   gid: process.getgid ? process.getgid() : 0,
    //   rdev: 0,
    //   size: file.size || (file.content ? Buffer.byteLength(file.content) : 0),
    //   blksize: 4096,
    //   blocks: 0,
    //   atimeMs: now.getTime(),
    //   mtimeMs: now.getTime(),
    //   ctimeMs: now.getTime(),
    //   birthtimeMs: now.getTime(),
    //   atime: now,
    //   mtime: now,
    //   ctime: now,
    //   birthtime: now,
    //   isBlockDevice: () => false,
    //   isCharacterDevice: () => false,
    //   isDirectory: () => file.type === "directory",
    //   isFIFO: () => false,
    //   isFile: () => file.type === "file",
    //   isSocket: () => false,
    //   isSymbolicLink: () => false,
    // };

    // if (opts && (opts as any).bigint) {
    //   // Convert to BigIntStats
    //   return {
    //     ...stats,
    //     dev: BigInt(stats.dev),
    //     ino: BigInt(stats.ino),
    //     mode: BigInt(stats.mode),
    //     nlink: BigInt(stats.nlink),
    //     uid: BigInt(stats.uid),
    //     gid: BigInt(stats.gid),
    //     rdev: BigInt(stats.rdev),
    //     size: BigInt(stats.size),
    //     blksize: BigInt(stats.blksize),
    //     blocks: BigInt(stats.blocks),
    //     atimeMs: BigInt(stats.atimeMs),
    //     mtimeMs: BigInt(stats.mtimeMs),
    //     ctimeMs: BigInt(stats.ctimeMs),
    //     birthtimeMs: BigInt(stats.birthtimeMs),
    //     atimeNs: BigInt(stats.atimeMs * 1000000),
    //     mtimeNs: BigInt(stats.mtimeMs * 1000000),
    //     ctimeNs: BigInt(stats.ctimeMs * 1000000),
    //     birthtimeNs: BigInt(stats.birthtimeMs * 1000000),
    //   } as BigIntStats;
    // }

    // return stats;
  }

  override async lstat(
    path: PathLike,
    opts?: { bigint?: false }
  ): Promise<nodeFs.Stats>;
  override async lstat(
    path: PathLike,
    opts: { bigint: true }
  ): Promise<nodeFs.BigIntStats>;
  override async lstat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats>;
  override async lstat(
    path: PathLike,
    opts?: { bigint?: boolean }
  ): Promise<nodeFs.Stats | nodeFs.BigIntStats> {
    return this.stat(path, opts);
  }

  override async readdir(
    path: PathLike,
    options?:
      | (nodeFs.ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        })
      | BufferEncoding
      | null
  ): Promise<string[]>;
  override async readdir(
    path: PathLike,
    options?:
      | {
          encoding: 'buffer';
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | 'buffer'
      | null
  ): Promise<Buffer[]>;
  override async readdir(
    path: PathLike,
    options?:
      | (nodeFs.ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        })
      | BufferEncoding
      | null
  ): Promise<string[] | Buffer[]>;
  override async readdir(
    path: PathLike,
    options: nodeFs.ObjectEncodingOptions & {
      withFileTypes: true;
      recursive?: boolean | undefined;
    }
  ): Promise<nodeFs.Dirent[]>;
  override async readdir(
    path: PathLike,
    options?:
      | {
          encoding: 'buffer';
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | (nodeFs.ObjectEncodingOptions & {
          withFileTypes?: boolean;
          recursive?: boolean;
        })
      | BufferEncoding
      | 'buffer'
      | null
  ): Promise<string[] | Buffer[] | nodeFs.Dirent[]> {
    const pathStr = path.toString();

    // if (!this.isLegitPath(pathStr)) {
    //   return ['.legit'] as string[];
    // }

    const parsed = this.getRouteHandler(pathStr);

    if (!parsed) {
      throw new Error(
        `ENOENT: no such file or directory, scandir '${pathStr}'`
      );
    }

    const result = await parsed?.handler.getFile({
      cacheFs: this.memFs,
      filePath: pathStr,
      userSpaceFs: this.compositFs,
      gitRoot: this.gitRoot,
      nodeFs: this.storageFs,
      pathParams: parsed.params,
      author: await this.getAuthor(),
    });

    if (result) {
      if (result.type !== 'directory') {
        throw new Error('not a folder');
      }

      const siblings = parsed?.staticSiblings ?? [];

      // Merge siblings and entries, remove duplicates, and sort POSIX-style
      const allFolders = Array.from(
        new Set([
          ...result.content,
          ...siblings.map(s =>
            toDirEntry({
              name: s.segment,
              parent: pathStr,
              isDir: s.type === 'folder',
            })
          ),
        ])
      ).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );

      // @ts-ignore
      if (options?.withFileTypes) {
        // TODO implement Dirent return type
        return allFolders;
      }
      return allFolders.map(entry => entry.name);
    }

    return [];
  }

  // write not implemented - we do this when we implement branches

  override async read(
    fh: CompositFsFileHandle,
    buffer: Buffer | Uint8Array,
    offset: number,
    length: number,
    position: number
  ): Promise<TFileHandleReadResult> {
    const subFsFd = fh.subFsFileDescriptor;
    const openFh = this.openFh[subFsFd];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }

    // // TODO return an empty file if it was just created

    // if (openFh.openSha === undefined) {
    //   if (fileFromGit === undefined) {
    //     // file didn't extist on open and still doesnt exist
    //     return await openFh.fh.read(buffer, offset, length, position);
    //   } else {
    //     // file didn't exist on open but does now?
    //     // 1. file was written in the meantime
    //     // 2. same file was created in the meantime - via pull?
    //   }
    // } else if (openFh.openSha === fileFromGit?.oid) {
    //   // git hasn't changed yet
    //   if (openFh.readSha === undefined) {
    //     // TODO realize the file and return it
    //   } else if (openFh.readSha === fileFromGit?.oid) {
    //     // cool - use the cache
    //     return await openFh.fh.read(buffer, offset, length, position);
    //   } else {
    //     // ok the file has changed in git
    //     if (openFh.unflushed.length > 0) {
    //       // writes have taken place but also changes in git appeared
    //       // TODO what to return?
    //       // Option A: the curent written file from cache - flush will win
    //       // Option B: the state from git -> unflushed changes gonna loose
    //       // Option C: merge the state from git with the unflushed changes?
    //     } else {
    //     }
    //   }
    // }

    // if there is no unflushed change - read the object directly from git
    if (openFh.unflushed.length === 0) {
      const parsed = this.getRouteHandler(openFh.path);
      const fileFromGit = await parsed!.handler.getFile({
        cacheFs: this.memFs,
        filePath: openFh.path,
        userSpaceFs: this.compositFs,
        gitRoot: this.gitRoot,
        nodeFs: this.storageFs,
        pathParams: parsed?.params,
        author: await this.getAuthor(),
      });

      if (!fileFromGit?.content) {
        throw new Error('couldnt access content');
      }

      if (fileFromGit.type !== 'file') {
        throw new Error('not a file');
      }

      const contentBuffer =
        typeof fileFromGit.content === 'string'
          ? Buffer.from(fileFromGit.content)
          : fileFromGit.content;
      const start = typeof position === 'number' ? position : 0;
      const end = Math.min(start + length, contentBuffer.length);
      const bytesToRead = Math.max(0, end - start);

      contentBuffer.copy(buffer, offset, start, start + bytesToRead);

      return { bytesRead: bytesToRead, buffer };
    }

    // read the state from memfs that is used as write surface
    return await openFh.fh.read(buffer, offset, length, position);
  }

  /**
   *
   * Writes (parts) of a buffer to a specific position in the file
   *
   * - a write leads to a new commit and on flush since the point in time a flush may occur may vary a read operation may
   *  not see changed done on the read lays.
   *
   *
   * @param fh
   * @param buffer
   * @param offset
   * @param length
   * @param position
   * @returns
   */
  override async write(
    fh: CompositFsFileHandle,
    buffer: Buffer | ArrayBufferView | DataView,
    offset?: number,
    length?: number,
    position?: number
  ): Promise<TFileHandleWriteResult> {
    const openFh = this.openFh[fh.subFsFileDescriptor];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }

    // Check if the file was opened with write permissions
    const flags = openFh.mode;
    if (!flags.includes('w') && !flags.includes('a') && !flags.includes('+')) {
      throw Object.assign(new Error(`EBADF: bad file descriptor, write`), {
        code: 'EBADF',
        errno: -9,
        syscall: 'write',
      });
    }

    if (openFh.unflushed.length === 0) {
      // no write was excuted before -> read the file first
      // NOTE for no we realize the whole file

      const parsed = this.getRouteHandler(openFh.path);
      const fileFromGit = await parsed!.handler.getFile({
        cacheFs: this.memFs,
        filePath: openFh!.path,
        userSpaceFs: this.compositFs,
        gitRoot: this.gitRoot,
        nodeFs: this.storageFs,
        pathParams: parsed!.params,
        author: await this.getAuthor(),
      });

      if (fileFromGit && fileFromGit.oid) {
        // update the memFs content to represent the git content
        await this.memFs.promises.writeFile(
          openFh.path,
          fileFromGit.content as string
        );
        openFh.readSha = fileFromGit.oid;
      }
    }

    // Write to the memfs file handle
    const result = await openFh.fh.write(buffer, offset, length, position);

    const setOffset = offset ?? 0;
    const startPos = position ?? 0;

    // Mark as dirty by adding the written range to unflushed
    openFh.unflushed.push({
      start: startPos,
      length: length ? length : buffer.byteLength - setOffset + startPos,
    });

    return result;
  }

  override async close(fh: CompositFsFileHandle): Promise<void> {
    const subFsFd = fh.subFsFileDescriptor;
    const openFh = this.openFh[subFsFd];
    if (!openFh) {
      throw new Error('Invalid file handle');
    }

    try {
      await this.dataSync(fh);
      await openFh.fh.close();
    } finally {
      delete this.openFh[subFsFd];
    }
  }

  override async dataSync(fh: CompositFsFileHandle): Promise<void> {
    const subFsFd = fh.subFsFileDescriptor;
    const openFh = this.openFh[subFsFd];

    if (!openFh) {
      throw new Error('Invalid file handle');
    }

    if (openFh.unflushed.length > 0) {
      // File was written to, need to commit changes to git
      const pathHandler = this.getRouteHandler(openFh.path);
      if (pathHandler && pathHandler.handler.writeFile) {
        // Read the content from memfs
        const content = await this.memFs.promises.readFile(openFh.path);

        // Write to git using the virtual file descriptor
        await pathHandler.handler.writeFile({
          cacheFs: this.memFs,
          filePath: openFh.path,
          userSpaceFs: this.compositFs,
          gitRoot: this.gitRoot,
          nodeFs: this.storageFs,
          content: content,
          pathParams: pathHandler.params,
          author: await this.getAuthor(),
        });
      }

      // remove the write cache
      openFh.unflushed = [];
    }
  }

  override async readFile(
    path: PathLike | IFileHandle,
    options?: IReadFileOptions | string
  ): Promise<TDataOut> {
    // Convert path to string
    const pathStr =
      typeof path === 'string'
        ? path
        : Buffer.isBuffer(path)
          ? path.toString()
          : (path as IFileHandle).fd
            ? `FileHandle(${(path as IFileHandle).fd})`
            : path.toString();

    // Extract encoding from options
    let encoding: BufferEncoding | null = null;

    if (typeof options === 'string') {
      encoding = options as BufferEncoding;
    } else if (options && typeof options === 'object') {
      if (options.encoding) encoding = options.encoding as BufferEncoding;
    }

    // Open the file for reading
    const fh = await this.open(pathStr, 'r');

    try {
      // Get the file stats to know the size
      const stats = await this.fstat(fh);
      const size = stats.size;

      // Create a buffer to read the entire file
      // @ts-expect-error -- we only support number for now big int follows later
      const buffer = Buffer.alloc(size);

      // Read the entire file
      // @ts-expect-error -- we only support number for now big int follows later
      await this.read(fh, buffer, 0, size, 0);

      // Close the file handle
      await this.close(fh);

      // Return the content with proper encoding
      if (encoding) {
        return buffer.toString(encoding);
      }
      return buffer;
    } catch (error) {
      // Make sure to close the file handle even if read fails
      try {
        await this.close(fh);
      } catch (closeError) {
        // Ignore close errors
      }
      throw error;
    }
  }

  override async writeFile(
    path: string,
    data: TData,
    options: IWriteFileOptions | string
  ): Promise<void> {
    // Extract flags and encoding from options
    let flags = 'w';
    let encoding: BufferEncoding = 'utf8';
    let mode: number | undefined;

    if (typeof options === 'string') {
      encoding = options as BufferEncoding;
    } else if (options && typeof options === 'object') {
      if (options.flag) flags = String(options.flag);
      if (options.encoding) encoding = options.encoding as BufferEncoding;
      if (options.mode)
        mode =
          typeof options.mode === 'string'
            ? parseInt(options.mode, 8)
            : options.mode;
    }

    // Open the file with the extracted flags
    const fh = await this.open(path, flags, mode);

    try {
      // Convert data to Buffer if needed
      let buffer: Buffer;
      if (typeof data === 'string') {
        buffer = Buffer.from(data, encoding);
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
      } else if (data instanceof Uint8Array) {
        buffer = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        buffer = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buffer = Buffer.from(data as any);
      }

      // Write the data using the write method
      await this.write(fh, buffer, 0, buffer.length, 0);
    } finally {
      // Make sure to close the file handle even if write fails
      await this.close(fh);
    }
  }

  override async rename(oldPath: PathLike, newPath: PathLike): Promise<void> {
    const oldPathStr = oldPath.toString();
    const newPathStr = newPath.toString();

    const oldParsed = this.getRouteHandler(oldPathStr);
    const newParsed = this.getRouteHandler(newPathStr);

    // Check if both paths are branch files
    if (
      oldParsed?.handler.type === 'gitBranchFileVirtualFile' &&
      newParsed?.handler.type === 'gitBranchFileVirtualFile'
    ) {
      // open question how do we want to deal with flushing?
      // a rename leads to a commit independent from open writes!?

      let newExistsInMemory = true;
      try {
        await this.memFs.promises.access(newPathStr);
      } catch (e) {
        newExistsInMemory = false;
      }

      let newExistsInBranch = true;
      try {
        await this.stat(newPathStr);
      } catch (e) {
        newExistsInBranch = false;
      }

      let oldExistsInBranch = true;
      try {
        await this.stat(oldPathStr);
      } catch (e) {
        oldExistsInBranch = false;
      }

      let oldExistsInMemory = true;
      try {
        await this.memFs.promises.access(oldPathStr);
      } catch (e) {
        oldExistsInMemory = false;
      }

      // id

      // todo check if the source file exists in memory
      // todo check if the target file exists in memory

      if (oldExistsInMemory) {
        // Ensure the target directory exists
        const targetDir = path.dirname(newPathStr);
        try {
          await this.memFs.promises.access(targetDir);
        } catch {
          await this.memFs.promises.mkdir(targetDir, { recursive: true });
        }
        await this.memFs.promises.rename(oldPath, newPath);
      }

      const branchFileVf = this.getRouteHandler(oldPathStr);
      if (!branchFileVf) {
        throw new Error('VF not found');
      }

      const result = await branchFileVf.handler.rename({
        cacheFs: this.memFs,
        filePath: oldPathStr,
        userSpaceFs: this.compositFs,
        gitRoot: this.gitRoot,
        nodeFs: this.storageFs,
        newPath: newPathStr,
        pathParams: branchFileVf?.params ?? {},
        newPathParams: newParsed?.params ?? {},
        author: await this.getAuthor(),
      });

      // } else if (oldParsed.type === "branch-file" && !newParsed.isLegitPath) {
      // Branch file to regular file - extract from branch
      // await this.extractBranchFileToRegular(oldPathStr, newPathStr, oldParsed);
      // } else if (!oldParsed.isLegitPath && newParsed.type === "branch-file") {
      // Regular file to branch file - add to branch
      // await this.addRegularFileToBranch(oldPathStr, newPathStr, newParsed);
    } else {
      throw new Error(
        `Unsupported rename operation from ${oldParsed?.handler.type} to ${newParsed?.handler.type}`
      );
    }
  }

  override async fchmod(fh: CompositFsFileHandle, mode: TMode): Promise<void> {
    // noop
  }

  override async unlink(path: PathLike): Promise<void> {
    const pathStr = path.toString();

    const parsed = this.getRouteHandler(pathStr);

    if (parsed?.handler.unlink !== undefined) {
      try {
        await parsed.handler.unlink({
          cacheFs: this.memFs,
          filePath: pathStr,
          userSpaceFs: this.compositFs,
          nodeFs: this.storageFs,
          gitRoot: this.gitRoot,
          pathParams: parsed.params,
          author: await this.getAuthor(),
        });
      } catch (err) {
        // if the file was only written i memory unlink will fail
        let unflused = false;
        for (const [fd, fh] of Object.entries(this.openFh)) {
          if (fh.path === pathStr && fh.unflushed.length > 0) {
            unflused = true;
          }
        }
        if (!unflused) {
          throw err;
        }
      } finally {
        let existsInMem = false;
        for (const [fd, fh] of Object.entries(this.openFh)) {
          if (fh.path === pathStr) {
            existsInMem = true;
            await fh.fh.close();
            delete this.openFh[Number(fd)];
          }
        }
        if (existsInMem) {
          // file existed in memory and was removed
          await this.memFs.promises.unlink(pathStr);
        }
      }
    } else {
      throw new Error(`Cannot unlink ${parsed?.handler.type} files`);
    }
  }

  override async rmdir(path: PathLike, ...args: any[]): Promise<void> {
    const pathStr = path.toString();

    const parsed = this.getRouteHandler(pathStr);

    if (parsed?.handler.rmdir !== undefined) {
      await parsed.handler.rmdir({
        cacheFs: this.memFs,
        filePath: pathStr,
        userSpaceFs: this.compositFs,
        nodeFs: this.storageFs,
        gitRoot: this.gitRoot,
        pathParams: parsed.params,
        author: await this.getAuthor(),
      });
      let existsInMem = false;
      for (const [fd, fh] of Object.entries(this.openFh)) {
        if (fh.path === pathStr) {
          existsInMem = true;
          await fh.fh.close();
          delete this.openFh[Number(fd)];
        }
      }
      if (existsInMem) {
        // file existed in memory and was removed

        await this.memFs.promises.rmdir(pathStr, { recursive: true });
      }
    } else {
      throw new Error(`Cannot rmdir 
       ${parsed?.handler.type} directories`);
    }
  }

  fileType(): number {
    return 10; // Unique type for GitLegitVirtualFileSubFs
  }
}
