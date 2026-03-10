import * as fsDisk from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import { GitGatewayFileHandle } from './git-gateway-filehandle.js';

/**
 * Valid characters for each level of sharding
 */
const FIRST_LEVEL_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'; // No dash at start
const MIDDLE_LEVEL_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789-'; // Dash allowed in middle

const serverStartDate = new Date();

/**
 * Repository metadata
 */
interface RepoMetadata {
  domain: string;
  username: string;
  repoName: string;
  isBookmarked: boolean;
  clonePath?: string; // Local path where repo is cloned
}

/**
 * Bookmark state file info
 */
interface BookmarkState {
  path: string;
  isBookmarked: boolean;
}

/**
 * GitGateway - Virtual filesystem for browsing GitHub repositories via NFS
 */
export class GitGateway {
  private cacheBasePath: string; // Where to cache cloned repositories
  private repos: Map<string, RepoMetadata> = new Map();
  private bookmarkStates: Map<string, BookmarkState> = new Map();
  private nextFileId = 1;

  constructor(cacheBasePath: string) {
    this.cacheBasePath = cacheBasePath;
  }

  /**
   * Dummy function to get users with a given prefix
   * This will be replaced with actual GitHub API calls later
   * @param prefix - The prefix to search for (e.g., "mar" for users starting with "mar")
   * @returns Array of usernames with the given prefix
   */
  async getUsers(prefix: string): Promise<string[]> {
    // Dummy data - in production this would call GitHub API
    const dummyUsers: Record<string, string[]> = {
      'mar': ['martin-lysk', 'mario', 'mark', 'martha', 'marcus-w', 'maria'],
      'ma': ['martin-lysk', 'mario', 'mark', 'martha', 'marcus-w', 'maria', 'matthew', 'mary', 'max', 'maya'],
      'm': ['martin-lysk', 'mario', 'mark', 'martha', 'marcus-w', 'maria', 'matthew', 'mary', 'max', 'maya', 'michael', 'michelle'],
      'pl': ['plate', 'playground', 'plasma', 'player', 'plugin'],
      'p': ['plate', 'playground', 'plasma', 'player', 'plugin', 'python', 'project', 'patrick'],
      '': ['martin-lysk', 'mario', 'plate', 'playground', 'python', 'patrick', 'aaron', 'zack'],
    };

    // Simulate async API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = dummyUsers[prefix] || dummyUsers[''] || [];
        resolve(users);
      }, 0);
    });
  }

  /**
   * Initialize with some sample repositories
   */
  initializeSampleData() {
    // Add sample repos (for testing purposes)
    this.addRepo('github.com', 'martin-lysk', 'my-repo', false);
    this.addRepo('github.com', 'martin-lysk', 'about-me', false);
    this.addRepo('github.com', 'plate', 'plate-sdk', false);
  }

  /**
   * Add a repository to the virtual filesystem
   */
  addRepo(
    domain: string,
    username: string,
    repoName: string,
    isBookmarked: boolean
  ) {
    const key = `${domain}/${username}/${repoName}`;
    this.repos.set(key, {
      domain,
      username,
      repoName,
      isBookmarked,
    });

    // Initialize bookmark state
    const bookmarkPath = this.getBookmarkPath(domain, username, repoName);
    this.bookmarkStates.set(bookmarkPath, {
      path: bookmarkPath,
      isBookmarked,
    });
  }

  /**
   * Get the sharded path for a repo
   */
  getRepoShardedPath(
    domain: string,
    username: string,
    repoName: string
  ): string {
    const shards = this.getShardsForUsername(username);
    return `/${domain}/${shards.join('/')}/${repoName}`;
  }

  /**
   * Get bookmark state path for a repo
   */
  getBookmarkPath(domain: string, username: string, repoName: string): string {
    const repoPath = this.getRepoShardedPath(domain, username, repoName);
    return `${repoPath}/.gateway-bookmarked`;
  }

  /**
   * Get bookmarked section path for a repo
   */
  getBookmarkedSectionPath(
    domain: string,
    username: string,
    repoName: string
  ): string {
    return `/bookmarked/${domain}/${username}/${repoName}`;
  }

  /**
   * Get the shard components for a username
   * Examples: "martin-lysk" -> ["m", "a", "r", "tin-lysk"]
   *           "ab" -> ["_repos", "ab"]
   *           "a" -> ["_repos", "a"]
   */
  getShardsForUsername(username: string): string[] {
    if (username.length <= 3) {
      // Short usernames go into _repos
      return ['_repos', username];
    }
    // Long usernames are sharded by first 3 characters
    return [username[0], username[1], username[2], username.slice(3)];
  }

  /**
   * Parse a path to determine its type and extract components
   */
  parsePath(virtualPath: string): {
    type:
      | 'root'
      | 'domain'
      | 'first-shard'
      | 'second-shard'
      | 'third-shard'
      | 'username-shard'
      | 'repos-shard'
      | 'repo'
      | 'bookmark-dir'
      | 'bookmarked-section'
      | 'bookmarked-root'
      | 'file'
      | 'bookmark-file'
      | 'not-found';
    domain?: string;
    username?: string;
    repoName?: string;
    shardLevel?: number;
    prefix?: string;
    bookmarkFile?: 'no' | 'yes';
  } {
    const normalizedPath = virtualPath.replace(/^\/+/, '').replace(/\/+$/, '');
    const parts = normalizedPath.split('/').filter(p => p);

    // Root directory
    if (parts.length === 0) {
      return { type: 'root' };
    }

    // Bookmarked section
    if (parts[0] === 'bookmarked') {
      if (parts.length === 1) {
        return { type: 'bookmarked-root' };
      }
      if (parts.length >= 4) {
        const domain = parts[1];
        const username = parts[2];
        const repoName = parts[3];
        const key = `${domain}/${username}/${repoName}`;
        const repo = this.repos.get(key);

        if (!repo || !repo.isBookmarked) {
          return { type: 'not-found' };
        }

        if (parts.length === 4) {
          return { type: 'bookmarked-section', domain, username, repoName };
        }

        return {
          type: 'file',
          domain,
          username,
          repoName,
        };
      }
    }

    // Regular domain path (github.com/...)
    const domain = parts[0];
    if (parts.length === 1) {
      return { type: 'domain', domain };
    }

    // Shard levels
    if (parts[1] === '_repos') {
      // Short username path: github.com/_repos/username
      if (parts.length === 2) {
        return { type: 'repos-shard', domain, shardLevel: 0 };
      }
      const username = parts[2];
      if (parts.length === 3) {
        return { type: 'username-shard', domain, username, shardLevel: 0 };
      }
      // Check if it's a repo
      const repoName = parts[3];
      const key = `${domain}/${username}/${repoName}`;
      const repo = this.repos.get(key);
      if (repo) {
        if (parts.length === 4) {
          return { type: 'repo', domain, username, repoName };
        }
        if (parts.length === 5 && parts[4] === '.gateway-bookmarked') {
          return { type: 'bookmark-dir', domain, username, repoName };
        }
        if (parts.length === 6 && parts[4] === '.gateway-bookmarked') {
          const bookmarkFile = parts[5] as 'no' | 'yes';
          if (bookmarkFile === 'no' || bookmarkFile === 'yes') {
            return { type: 'bookmark-file', domain, username, repoName, bookmarkFile };
          }
        }
      }
    } else {
      // Long username sharded path: github.com/a/b/r/...
      if (parts.length === 2) {
        return { type: 'first-shard', domain, shardLevel: 1, prefix: parts[1] };
      }
      if (parts.length === 3) {
        return { type: 'second-shard', domain, shardLevel: 2, prefix: parts[1] + parts[2] };
      }
      if (parts.length === 4) {
        // Check if it's _repos at third level
        if (parts[3] === '_repos') {
          return { type: 'repos-shard', domain, shardLevel: 3, prefix: parts[1] + parts[2] };
        }
        return { type: 'third-shard', domain, shardLevel: 3, prefix: parts[1] + parts[2] + parts[3] };
      }
      if (parts.length === 5) {
        // Check if it's _repos or username shard
        if (parts[4] === '_repos') {
          return { type: 'repos-shard', domain, shardLevel: 4, prefix: parts[1] + parts[2] + parts[3] };
        }
        // Username shard (remainder of username after first 3 chars)
        const username = parts[1] + parts[2] + parts[3] + parts[4];
        return { type: 'username-shard', domain, username, shardLevel: 4, prefix: username };
      }
      if (parts.length >= 6) {
        // Reconstruct username from first 5 parts
        const username = parts[1] + parts[2] + parts[3] + parts[4];
        const repoName = parts[5];
        const key = `${domain}/${username}/${repoName}`;
        const repo = this.repos.get(key);
        if (repo) {
          if (parts.length === 6) {
            return { type: 'repo', domain, username, repoName };
          }
          if (parts.length === 7 && parts[6] === '.gateway-bookmarked') {
            return { type: 'bookmark-dir', domain, username, repoName };
          }
          if (parts.length === 8 && parts[6] === '.gateway-bookmarked') {
            const bookmarkFile = parts[7] as 'no' | 'yes';
            if (bookmarkFile === 'no' || bookmarkFile === 'yes') {
              return { type: 'bookmark-file', domain, username, repoName, bookmarkFile };
            }
          }
        }
      }
    }

    return { type: 'not-found' };
  }

  // #region File system operations

  async lstat(pathStr: string): Promise<fsDisk.Stats> {
    return this.stat(pathStr);
  }

  async stat(pathStr: string): Promise<fsDisk.Stats> {
    const parsed = this.parsePath(pathStr);

    
    const fileId = this.nextFileId++;

    switch (parsed.type) {
      case 'root':
      case 'bookmarked-root':
      case 'domain':
      case 'first-shard':
      case 'second-shard':
      case 'third-shard':
      case 'username-shard':
      case 'repos-shard':
      case 'repo':
      case 'bookmarked-section':
      case 'bookmark-dir':
        return this.createDirStats(fileId, serverStartDate);

      case 'bookmark-file':
        return this.createBookmarkFileStats(fileId, serverStartDate, parsed.bookmarkFile === 'yes');

      case 'file':
        const e = new Error(`ENOENT: no such file or directory, stat ${pathStr}`);
        (e as any).code = 'ENOENT';
        throw e;

      case 'not-found':
        const e2 = new Error(`ENOENT: no such file or directory, stat ${pathStr}`);
        (e2 as any).code = 'ENOENT';
        throw e2;

      default:
        const e3 = new Error(`ENOENT: no such file or directory, stat ${pathStr}`);
        (e3 as any).code = 'ENOENT';
        throw e3;
    }
  }

  async readdir(pathStr: string): Promise<string[]> {
    const parsed = this.parsePath(pathStr);

    console.log(`readdir called for '${pathStr}' (parsed as type '${parsed.type}')`);

    switch (parsed.type) {
      case 'root':
        return ['github.com', 'bookmarked'];

      case 'bookmarked-root': {
        // Return domains that have bookmarked repos
        const domains = new Set<string>();
        for (const repo of this.repos.values()) {
          if (repo.isBookmarked) {
            domains.add(repo.domain);
          }
        }
        return Array.from(domains);
      }

      case 'domain':
        // First level: return a-z0-9 (no dash)
        return FIRST_LEVEL_CHARS.split('');

      case 'first-shard': {
        // Second level: return a-z0-9- (including dash) and _repos
        const result = MIDDLE_LEVEL_CHARS.split('');
        result.push('_repos');
        return result;
      }

      case 'second-shard': {
        // Third level: return a-z0-9- (including dash) and _repos
        const result = MIDDLE_LEVEL_CHARS.split('');
        result.push('_repos');
        return result;
      }

      case 'third-shard':
      case 'repos-shard': {
        // At this point, we need to return either:
        // - _repos (for usernames that continue)
        // - Usernames that match the prefix (for final shard level)
        const result: string[] = [];

        // Add _repos if it makes sense
        if (parsed.shardLevel === 3 || parsed.shardLevel === 4) {
          result.push('_repos');
        }

        // Get users with the current prefix
        if (parsed.prefix) {
          const users = await this.getUsers(parsed.prefix);
          // Filter and transform users based on shard level
          for (const user of users) {
            if (user.startsWith(parsed.prefix)) {
              if (parsed.shardLevel === 4) {
                // At username shard level, return the remainder of the username
                const remainder = user.slice(parsed.prefix.length);
                if (remainder && !result.includes(remainder)) {
                  result.push(remainder);
                }
              } else if (parsed.shardLevel === 0 && user.length <= 3) {
                // At _repos level, return short usernames
                result.push(user);
              }
            }
          }
        }

        // Remove duplicates
        return [...new Set(result)];
      }

      case 'username-shard': {
        // Return repos for this username
        const repos: string[] = [];
        for (const [key, repo] of this.repos.entries()) {
          if (repo.domain === parsed.domain && repo.username === parsed.username) {
            repos.push(repo.repoName);
          }
        }
        return repos;
      }

      case 'repo':
        return ['.gateway-bookmarked'];

      case 'bookmark-dir': {
        // Return 'no' or 'yes' based on bookmark state
        const bookmarkPath = this.getBookmarkPath(
          parsed.domain!,
          parsed.username!,
          parsed.repoName!
        );
        const state = this.bookmarkStates.get(bookmarkPath);
        return [state?.isBookmarked ? 'yes' : 'no'];
      }

      default:
        return [];
    }
  }

  async mkdir(pathStr: string, options?: { mode: number }): Promise<void> {
    // We don't support creating directories in this version
    throw new Error(`EPERM: operation not permitted, mkdir '${pathStr}'`);
  }

  async rmdir(pathStr: string): Promise<void> {
    // We don't support removing directories in this version
    throw new Error(`EPERM: operation not permitted, rmdir '${pathStr}'`);
  }

  async unlink(pathStr: string): Promise<void> {
    const parsed = this.parsePath(pathStr);

    // Only allow unlinking bookmark state files
    if (parsed.type === 'bookmark-file') {
      await this.handleBookmarkFileDelete(
        parsed.domain!,
        parsed.username!,
        parsed.repoName!,
        parsed.bookmarkFile!
      );
      return;
    }

    throw new Error(`EPERM: operation not permitted, unlink '${pathStr}'`);
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    // We don't support rename in this version
    throw new Error(
      `EPERM: operation not permitted, rename '${oldPath}' -> '${newPath}'`
    );
  }

  async link(target: string, path: string): Promise<void> {
    // Hard links not supported
    throw new Error(
      `EPERM: operation not permitted, link '${target}' -> '${path}'`
    );
  }

  async symlink(target: string, path: string): Promise<void> {
    // Symlinks not supported in this version (except internally)
    throw new Error(
      `EPERM: operation not permitted, symlink '${target}' -> '${path}'`
    );
  }

  async readlink(pathStr: string): Promise<string> {
    const parsed = this.parsePath(pathStr);

    // Handle bookmarked section symlinks
    if (parsed.type === 'bookmarked-section') {
      const shardedPath = this.getRepoShardedPath(
        parsed.domain!,
        parsed.username!,
        parsed.repoName!
      );
      return shardedPath;
    }

    // Handle bookmark state files (they're broken symlinks with no target)
    if (parsed.type === 'bookmark-file') {
      return ''; // Empty string = no target
    }

    throw new Error(`EINVAL: invalid argument, readlink '${pathStr}'`);
  }

  async chmod(path: string, mode: number): Promise<void> {
    // chmod not supported
    throw new Error(`EPERM: operation not permitted, chmod '${path}'`);
  }

  async utimes(path: string, atime: Date, mtime: Date): Promise<void> {
    // utimes not supported (files are read-only)
  }

  async lutimes(path: string, atime: Date, mtime: Date): Promise<void> {
    // lutimes not supported
  }

  async open(pathStr: string, flags: string): Promise<FileHandle> {
    const parsed = this.parsePath(pathStr);

    // For now, we don't support opening files
    // In a full implementation, this would open files from cloned repos
    const e = new Error(`ENOENT: no such file or directory, open '${pathStr}'`);
    (e as any).code = 'ENOENT';
    throw e;
  }

  // #endregion

  // #region Helper methods

  /**
   * Handle deletion of bookmark state file (toggle bookmark state)
   */
  private async handleBookmarkFileDelete(
    domain: string,
    username: string,
    repoName: string,
    bookmarkFile: 'no' | 'yes'
  ) {
    const bookmarkPath = this.getBookmarkPath(domain, username, repoName);
    const state = this.bookmarkStates.get(bookmarkPath);

    if (!state) {
      return;
    }

    // If 'no' was deleted, bookmark the repo
    if (bookmarkFile === 'no' && !state.isBookmarked) {
      state.isBookmarked = true;
      const repoKey = `${domain}/${username}/${repoName}`;
      const repo = this.repos.get(repoKey);
      if (repo) {
        repo.isBookmarked = true;
      }
    }

    // If 'yes' was deleted, unbookmark the repo
    if (bookmarkFile === 'yes' && state.isBookmarked) {
      state.isBookmarked = false;
      const repoKey = `${domain}/${username}/${repoName}`;
      const repo = this.repos.get(repoKey);
      if (repo) {
        repo.isBookmarked = false;
      }
    }
  }

  /**
   * Create Stats object for a directory
   */
  private createDirStats(fileId: number, now: Date): fsDisk.Stats {
    return {
      mode: 0o755,
      size: 4096,
      atimeMs: now.getTime(),
      mtimeMs: now.getTime(),
      ctimeMs: now.getTime(),
      birthtimeMs: now.getTime(),
      atime: now,
      mtime: now,
      ctime: now,
      birthtime: now,
      isFile: () => false,
      isDirectory: () => true,
      isSymbolicLink: () => false,
      isBlockDevice: () => false,
      isCharacterDevice: () => false,
      isSocket: () => false,
      isFIFO: () => false,
      dev: 0,
      ino: fileId,
      nlink: 2,
      uid: 0,
      gid: 0,
      rdev: 0,
      blksize: 4096,
      blocks: 8,
    } as fsDisk.Stats;
  }

  /**
   * Create Stats object for a bookmark state file
   */
  private createBookmarkFileStats(
    fileId: number,
    now: Date,
    isBookmarked: boolean
  ): fsDisk.Stats {
    return {
      mode: 0o777 | 0o120000, // Symlink
      size: 0, // Broken symlink has no target
      atimeMs: now.getTime(),
      mtimeMs: now.getTime(),
      ctimeMs: now.getTime(),
      birthtimeMs: now.getTime(),
      atime: now,
      mtime: now,
      ctime: now,
      birthtime: now,
      isFile: () => false,
      isDirectory: () => false,
      isSymbolicLink: () => true,
      isBlockDevice: () => false,
      isCharacterDevice: () => false,
      isSocket: () => false,
      isFIFO: () => false,
      dev: 0,
      ino: fileId,
      nlink: 1,
      uid: 0,
      gid: 0,
      rdev: 0,
      blksize: 4096,
      blocks: 0,
    } as fsDisk.Stats;
  }

  // #endregion
}
