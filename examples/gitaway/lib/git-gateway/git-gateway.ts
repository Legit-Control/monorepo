import * as fsDisk from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import { GitGatewayFileHandle } from './git-gateway-filehandle.js';

/**
 * GitGateway - Virtual filesystem for browsing GitHub repositories via NFS
 */
export class GitGateway {
  private nextFileId = 1;
  private storageBasePath: string;
  private storageFs: typeof fsDisk; // replace type with nodefs type
  private serverStartDate: Date;
  private unmaterializedUsers: Map<string, string[]> = new Map(); // username -> repos
  private materializedUserRepos: Map<string, string[]> = new Map(); // username -> repos cache for materialized users
  private githubToken: string | undefined;

  constructor(
    storageFs: typeof fsDisk,
    storageBasePath: string,
    githubToken?: string
  ) {
    this.storageBasePath = storageBasePath;
    this.storageFs = storageFs;
    this.serverStartDate = new Date();
    this.githubToken = githubToken;
  }

  // #region File system operations

  async lstat(pathStr: string): Promise<fsDisk.Stats> {
    return this.stat(pathStr);
  }

  async stat(pathStr: string): Promise<fsDisk.Stats> {
    // Normalize path
    const normalizedPath = pathStr === '' ? '/' : pathStr;
    const pathParts = normalizedPath.split('/').filter(part => part.length > 0);

    // Root directory
    if (pathParts.length === 0 || normalizedPath === '/') {
      const fileId = this.nextFileId++;
      return this.createDirStats(fileId, this.serverStartDate);
    }

    const firstPart = pathParts[0];

    // /config directory
    if (firstPart === 'config') {
      if (pathParts.length === 1) {
        const fileId = this.nextFileId++;
        return this.createDirStats(fileId, this.serverStartDate);
      }
      throw new Error(`ENOENT: no such file or directory, stat '${pathStr}'`);
    }

    // /github.com directory
    if (firstPart === 'github.com') {
      // Ensure storage folder exists
      const bookmarksPath = this.storageBasePath + '/bookmarks/github.com';
      await this.ensureDir(bookmarksPath);

      if (pathParts.length === 1) {
        const fileId = this.nextFileId++;
        return this.createDirStats(fileId, this.serverStartDate);
      }

      // /github.com/username directory
      if (pathParts.length === 2) {
        const username = pathParts[1];
        const userPath = `${bookmarksPath}/${username}`;

        // Check if user is materialized (storage folder exists)
        const isMaterialized = await this.pathExists(userPath);

        if (isMaterialized) {
          // User is bookmarked, return stats
          const fileId = this.nextFileId++;
          return this.createDirStats(fileId, this.serverStartDate);
        }

        // Check if user is unmaterialized (in memory)
        if (this.unmaterializedUsers.has(username)) {
          // User exists in GitHub but not materialized yet
          const fileId = this.nextFileId++;
          return this.createDirStats(fileId, this.serverStartDate);
        }

        // Check GitHub API for user existence
        const userExists = await this.checkGitHubUserExists(username);

        if (userExists) {
          // User exists on GitHub, add to unmaterialized map
          // (we'll fetch repos when readdir is called)
          this.unmaterializedUsers.set(username, []);

          const fileId = this.nextFileId++;
          return this.createDirStats(fileId, this.serverStartDate);
        }

        // User doesn't exist on GitHub
        throw new Error(`ENOENT: no such file or directory, stat '${pathStr}'`);
      }

      // /github.com/username/repo - materialize on access
      if (pathParts.length === 3) {
        const username = pathParts[1];
        const repoName = pathParts[2];
        const userPath = `${bookmarksPath}/${username}`;

        // Check if user exists (materialized or unmaterialized)
        const isMaterialized = await this.pathExists(userPath);
        const isUnmaterialized = this.unmaterializedUsers.has(username);

        if (!isMaterialized && !isUnmaterialized) {
          // User doesn't exist, check GitHub
          const userExists = await this.checkGitHubUserExists(username);
          if (!userExists) {
            throw new Error(
              `ENOENT: no such file or directory, stat '${pathStr}'`
            );
          }
          this.unmaterializedUsers.set(username, []);
        }

        // Check if repo exists in unmaterialized map before materializing
        if (!isMaterialized && this.unmaterializedUsers.has(username)) {
          const userRepos = this.unmaterializedUsers.get(username);

          // If repos array is empty, fetch from GitHub API
          if (!userRepos || userRepos.length === 0) {
            const repos = await this.fetchGitHubUserRepos(username);
            this.unmaterializedUsers.set(username, repos);
          }

          const updatedRepos = this.unmaterializedUsers.get(username);
          if (updatedRepos && !updatedRepos.includes(repoName)) {
            // Repo doesn't exist in user's repo list from GitHub API
            throw new Error(
              `ENOENT: no such file or directory, stat '${pathStr}'`
            );
          }
          // Repo exists in unmaterialized map, return stats without materializing
          const fileId = this.nextFileId++;
          return this.createDirStats(fileId, this.serverStartDate);
        }

        // User is materialized - check repo cache or fetch from GitHub API
        if (isMaterialized) {
          // Check if we have cached repos for this materialized user
          if (!this.materializedUserRepos.has(username)) {
            // First time accessing a repo for this materialized user - fetch and cache repos
            const repos = await this.fetchGitHubUserRepos(username);
            this.materializedUserRepos.set(username, repos);
          }

          const cachedRepos = this.materializedUserRepos.get(username);

          if (cachedRepos && !cachedRepos.includes(repoName)) {
            // Repo doesn't exist in user's repo list from GitHub API
            throw new Error(
              `ENOENT: no such file or directory, stat '${pathStr}'`
            );
          }

          // Repo exists in cached list, return stats
          const fileId = this.nextFileId++;
          return this.createDirStats(fileId, this.serverStartDate);
        }

        // Should not reach here, but handle gracefully
        throw new Error(
          `ENOENT: no such file or directory, stat '${pathStr}'`
        );
      }

      // Deeper paths not supported yet
      throw new Error(`ENOENT: no such file or directory, stat '${pathStr}'`);
    }

    // Non-existent path
    throw new Error(`ENOENT: no such file or directory, stat '${pathStr}'`);
  }

  async readdir(pathStr: string): Promise<string[]> {
    // Normalize path - handle empty string as root
    const normalizedPath = pathStr === '' ? '/' : pathStr;
    const pathParts = normalizedPath.split('/').filter(part => part.length > 0);

    // Root directory - list domains
    if (pathParts.length === 0 || normalizedPath === '/') {
      return ['config', 'github.com'];
    }

    const firstPart = pathParts[0];

    // /config directory
    if (firstPart === 'config') {
      if (pathParts.length === 1) {
        // For now, return empty array - config.json doesn't exist yet
        // TODO: Create config.json if it doesn't exist
        return [];
      }
      throw new Error(
        `ENOENT: no such file or directory, readdir '${pathStr}'`
      );
    }

    // /github.com directory
    if (firstPart === 'github.com') {
      // Ensure storage folder exists
      const bookmarksPath = this.storageBasePath + '/bookmarks/github.com';
      await this.ensureDir(bookmarksPath);

      // List users in storage
      if (pathParts.length === 1) {
        try {
          const entries = await this.storageFs.promises.readdir(bookmarksPath) as string[];
          return entries.map(entry => {
            if (typeof entry !== 'string') throw new Error('Expected string entry name');
            return entry;
          });
        } catch (error) {
          // If directory doesn't exist or can't be read, return empty array
          return [];
        }
      }

      // /github.com/username directory
      if (pathParts.length === 2) {
        const username = pathParts[1];
        const userPath = `${bookmarksPath}/${username}`;

        // Check if user is materialized in storage
        const isMaterialized = await this.pathExists(userPath);

        if (isMaterialized) {
          // User is materialized - check cache first
          if (this.materializedUserRepos.has(username)) {
            // Return cached repos
            return this.materializedUserRepos.get(username)!;
          }

          // No cache yet, try to fetch from GitHub API
          try {
            const repos = await this.fetchGitHubUserRepos(username);
            this.materializedUserRepos.set(username, repos);
            return repos;
          } catch (error) {
            // GitHub API failed, fall through to storage fallback
            console.debug(`GitHub API fetch failed for ${username}, falling back to storage:`, error);
          }

          // Fallback to storage for materialized users
          try {
            const entries = (await this.storageFs.promises.readdir(
              userPath
            )) as string[];
            const repos = entries.map(entry => {
              if (typeof entry !== 'string')
                throw new Error('Expected string entry name');
              return entry;
            });
            // Cache the storage results
            this.materializedUserRepos.set(username, repos);
            return repos;
          } catch (error) {
            return [];
          }
        }

        // User is not materialized - use GitHub API
        try {
          const repos = await this.fetchGitHubUserRepos(username);

          // Successfully fetched from GitHub API (even if empty - user might have no repos)
          // Update unmaterialized map and return results
          this.unmaterializedUsers.set(username, repos);
          return repos;
        } catch (error) {
          // GitHub API failed, fall through to storage fallback
          console.debug(`GitHub API fetch failed for ${username}, falling back to storage:`, error);
        }

        // Check unmaterialized map as fallback
        if (this.unmaterializedUsers.has(username)) {
          return this.unmaterializedUsers.get(username)!;
        }

        // User doesn't exist in GitHub or storage
        throw new Error(
          `ENOENT: no such file or directory, readdir '${pathStr}'`
        );
      }

      // /github.com/username/repo - return contents from git repo
      if (pathParts.length === 3) {
        const username = pathParts[1];
        const repoName = pathParts[2];
        const userPath = `${bookmarksPath}/${username}`;

        // Check if user exists (materialized or unmaterialized)
        const isMaterialized = await this.pathExists(userPath);
        const isUnmaterialized = this.unmaterializedUsers.has(username);

        if (!isMaterialized && !isUnmaterialized) {
          // User doesn't exist, check GitHub
          const userExists = await this.checkGitHubUserExists(username);
          if (!userExists) {
            throw new Error(
              `ENOENT: no such file or directory, readdir '${pathStr}'`
            );
          }
          this.unmaterializedUsers.set(username, []);
        }

        // For unmaterialized users, validate repo exists
        if (!isMaterialized && this.unmaterializedUsers.has(username)) {
          const userRepos = this.unmaterializedUsers.get(username);

          // If repos array is empty, fetch from GitHub API
          if (!userRepos || userRepos.length === 0) {
            const repos = await this.fetchGitHubUserRepos(username);
            this.unmaterializedUsers.set(username, repos);
          }

          const updatedRepos = this.unmaterializedUsers.get(username);
          if (updatedRepos && !updatedRepos.includes(repoName)) {
            // Repo doesn't exist in user's repo list from GitHub API
            throw new Error(
              `ENOENT: no such file or directory, readdir '${pathStr}'`
            );
          }
          // Repo exists, return empty array (files not implemented yet)
          return [];
        }

        // For materialized users, check cache or validate repo
        if (isMaterialized) {
          // Check if we have cached repos
          if (!this.materializedUserRepos.has(username)) {
            // First time - fetch and cache repos
            const repos = await this.fetchGitHubUserRepos(username);
            this.materializedUserRepos.set(username, repos);
          }

          const cachedRepos = this.materializedUserRepos.get(username);

          if (cachedRepos && !cachedRepos.includes(repoName)) {
            // Repo doesn't exist in user's repo list from GitHub API
            throw new Error(
              `ENOENT: no such file or directory, readdir '${pathStr}'`
            );
          }

          // Repo exists, return empty array (files not implemented yet)
          // TODO: Read actual files from git repository
          return [];
        }

        // Should not reach here
        throw new Error(
          `ENOENT: no such file or directory, readdir '${pathStr}'`
        );
      }

      // Nested paths under /github.com/username/repo/... not supported yet
      if (pathParts.length >= 4) {
        throw new Error(
          `ENOENT: no such file or directory, readdir '${pathStr}'`
        );
      }
    }

    // Non-existent directory
    throw new Error(`ENOENT: no such file or directory, readdir '${pathStr}'`);
  }

  /**
   * Ensure a directory exists, create it if it doesn't
   */
  private async ensureDir(dirPath: string): Promise<void> {
    try {
      await this.storageFs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Ignore error if directory already exists
      const errorCode = (error as any)?.code;
      if (errorCode !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * Check if a path exists in storage
   */
  private async pathExists(filePath: string): Promise<boolean> {
    try {
      await this.storageFs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a GitHub user exists by calling the GitHub API
   */
  private async checkGitHubUserExists(username: string): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (this.githubToken) {
        headers['Authorization'] = `Bearer ${this.githubToken}`;
      }

      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers,
      });

      return response.ok;
    } catch (error) {
      // On network error, assume user doesn't exist
      return false;
    }
  }

  /**
   * Fetch repositories for a GitHub user from the GitHub API
   */
  private async fetchGitHubUserRepos(username: string): Promise<string[]> {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (this.githubToken) {
        headers['Authorization'] = `Bearer ${this.githubToken}`;
      }

      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100`,
        { headers }
      );

      if (!response.ok) {
        return [];
      }

      const repos = (await response.json()) as { name: string }[];
      return repos.map((repo: any) => repo.name);
    } catch (error) {
      // On network error, return empty array
      return [];
    }
  }

  /**
   * Materialize a user by creating storage folder and fetching repos
   */
  private async materializeUser(username: string): Promise<void> {
    // If already materialized, return
    const userPath = `${this.storageBasePath}/bookmarks/github.com/${username}`;
    if (await this.pathExists(userPath)) {
      return;
    }

    // Create storage folder
    await this.ensureDir(userPath);

    // Fetch repos from GitHub API
    const repos = await this.fetchGitHubUserRepos(username);

    // Update unmaterialized map (removes from unmaterialized, now materialized)
    this.unmaterializedUsers.delete(username);

    // Create repo folders in storage (empty for now, will be cloned on access)
    for (const repo of repos) {
      const repoPath = `${userPath}/${repo}`;
      await this.ensureDir(repoPath);
    }
  }

  async mkdir(pathStr: string, options?: { mode: number }): Promise<void> {
    // We don't support creating directories in this version
    throw new Error(`EPERM: operation not permitted, mkdir '${pathStr}'`);
  }

  async rmdir(pathStr: string): Promise<void> {
    // TODO check if this is a delte of a user like /github.com/username
    // -> remove the user folder in the config dir
    // TODO check if this is a delete of a repo like /github.com/username/repo
    // -> remove the repo folder in the config dir

    // else throw

    // We don't support removing directories in this version
    throw new Error(`EPERM: operation not permitted, rmdir '${pathStr}'`);
  }

  async unlink(pathStr: string): Promise<void> {
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
    // For now, we don't support opening files
    // In a full implementation, this would open files from cloned repos
    const e = new Error(`ENOENT: no such file or directory, open '${pathStr}'`);
    (e as any).code = 'ENOENT';
    throw e;
  }

  // #endregion

  // #region Helper methods

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
