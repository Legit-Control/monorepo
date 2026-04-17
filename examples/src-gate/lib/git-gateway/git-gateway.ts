import * as fsDisk from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import { GitGatewayFileHandle } from './git-gateway-filehandle.js';
import * as git from '@legit-sdk/isomorphic-git';
import http from '@legit-sdk/isomorphic-git/http/node';
import pLimit from 'p-limit';

/**
 * Path type enumeration for resolvePath
 */
type PathType =
  | 'root'
  | 'configFile'
  | 'host'
  | 'user'
  | 'repo'
  | 'branch'
  | 'oid'
  | 'gitFile'
  | 'gitFolder';

/**
 * Result object from resolvePath operation
 */
interface PathResult {
  pathType: PathType;
  host?: string;
  username?: string;
  repoName?: string;
  branch?: string;
  commitOid?: string;
  filePath?: string;
  folderPath?: string;
}

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
  private clonedRepos: Set<string> = new Set(); // Track cloned repos "username/repo"
  private fileSizeCache: Map<string, number> = new Map(); // Cache file sizes to avoid repeated blob reads
  private githubToken: string | undefined;
  private cloneLimit = pLimit(5); // Limit concurrent clones

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

  // #region Path resolution

  /**
   * Resolve a path and determine its type and components
   *
   * This function clones the repository if needed to properly resolve branches
   * (including branches with slashes like "branch/with/slash")
   *
   * @param pathStr - The path to resolve (e.g., '/github.com/user/repo/main/file.txt')
   * @returns A PathResult object containing the path type and relevant components
   * @throws Error if the path is invalid or outside the supported structure
   */
  async resolvePath(pathStr: string): Promise<PathResult> {
    // console.log(`[GitGateway] Resolving path: '${pathStr}'`);
    // Normalize path
    const normalizedPath = pathStr === '' ? '/' : pathStr.replace(/\/+$/, '');
    const pathParts = normalizedPath.split('/').filter(part => part.length > 0);

    // Root directory
    if (pathParts.length === 0 || normalizedPath === '/') {
      return { pathType: 'root' };
    }

    const firstPart = pathParts[0];

    // Config directory
    if (firstPart === 'config') {
      if (pathParts.length === 1) {
        return { pathType: 'configFile' };
      }
      throw new Error(
        `ENOENT: no such file or directory, resolve '${pathStr}'`
      );
    }

    // GitHub host
    if (firstPart === 'github.com') {
      if (pathParts.length === 1) {
        return { pathType: 'host', host: 'github.com' };
      }

      // User path
      if (pathParts.length === 2) {
        return {
          pathType: 'user',
          host: 'github.com',
          username: pathParts[1],
        };
      }

      // Repo path
      if (pathParts.length === 3) {
        return {
          pathType: 'repo',
          host: 'github.com',
          username: pathParts[1],
          repoName: pathParts[2],
        };
      }

      // Branch or OID path (with optional file/folder path)
      if (pathParts.length >= 4) {
        const username = pathParts[1];
        const repoName = pathParts[2];

        // Ensure repo is cloned to properly resolve branches
        await this.ensureRepoCloned(username, repoName);

        // Get list of branches to handle branches with slashes
        const branches = await git.listBranches({
          fs: this.storageFs,
          dir: `${this.storageBasePath}/bookmarks/github.com/${username}/${repoName}`,
        });

        // Try to match the longest branch name first (greedy matching)
        // This handles branches like "branch/with/slash" vs "branch"
        let matchedBranch: string | undefined;
        let filePath = '';
        let isBranchNamespace = false; // Track if this is a branch namespace prefix

        // First, check for exact match (simple branch name without slashes)
        // This prioritizes exact matches over greedy matching
        const firstPart = pathParts[3];
        if (branches.includes(firstPart) && pathParts.length === 4) {
          matchedBranch = firstPart;
          filePath = '';
        } else {
          // No exact match, do greedy matching for branches with slashes
          // Start from the end and work backwards to find the longest matching branch
          // pathParts.length - 3 is the maximum number of parts that could be part of the branch
          // We go down to 1 because at minimum we need one part for the branch name
          for (let i = pathParts.length - 3; i >= 1; i--) {
            const potentialBranch = pathParts.slice(3, 3 + i).join('/');
            if (branches.includes(potentialBranch)) {
              matchedBranch = potentialBranch;
              filePath = pathParts.slice(3 + i).join('/');
              break;
            }
          }
        }

        // If no branch matched, check if it's an OID or treat as branch namespace
        if (!matchedBranch) {
          // Build the full path after the repo name (could be 'branch', 'branch/with', etc.)
          const pathAfterRepo = pathParts.slice(3).join('/');
          const firstPart = pathParts[3];
          const isOid =
            firstPart.length === 40 && /^[a-f0-9]{40}$/i.test(firstPart);

          if (isOid) {
            matchedBranch = undefined; // OID
            filePath = pathParts.slice(4).join('/');
          } else {
            // Check if this could be a branch namespace (part of a branch with slashes)
            // For example, if we have 'branch/with/slash' and user accesses '/repo/branch' or '/repo/branch/with'
            const hasBranchesWithPrefix = branches.some(b =>
              b.startsWith(pathAfterRepo + '/')
            );
            if (hasBranchesWithPrefix) {
              // Treat as branch namespace folder (not a complete branch)
              matchedBranch = pathAfterRepo;
              filePath = '';
              isBranchNamespace = true;
            } else {
              // Assume it's a simple branch name without slashes
              matchedBranch = firstPart;
              filePath = pathParts.slice(4).join('/');
            }
          }
        }

        // Determine if it's a file or folder based on the path
        if (filePath === '') {
          // Root of repo (branch or OID) - always a folder
          if (matchedBranch === undefined) {
            // OID with no file path
            return {
              pathType: 'oid',
              host: 'github.com',
              username,
              repoName,
              commitOid: pathParts[3],
            };
          } else if (isBranchNamespace) {
            // Branch namespace folder (e.g., 'branch' when we have 'branch/with/slash')
            return {
              pathType: 'gitFolder',
              host: 'github.com',
              username,
              repoName,
              branch: matchedBranch,
              folderPath: '',
            };
          } else {
            // Complete branch with no file path
            return {
              pathType: 'branch',
              host: 'github.com',
              username,
              repoName,
              branch: matchedBranch,
            };
          }
        }

        // Has a file/folder path - need to check if it's a file or folder
        // by reading the git tree instead of using extension heuristic
        const repoDir = `${this.storageBasePath}/bookmarks/github.com/${username}/${repoName}`;

        // Get the commit OID for the branch or use the provided OID
        let commitOid: string;
        if (matchedBranch === undefined) {
          commitOid = pathParts[3];
        } else {
          commitOid = await git.resolveRef({
            fs: this.storageFs,
            dir: repoDir,
            ref: matchedBranch,
          });
        }

        // Split the file path to get parent path and target name
        const pathSegments = filePath.split('/');
        const targetName = pathSegments[pathSegments.length - 1];
        const parentPath = pathSegments.slice(0, -1).join('/');

        // Check if it's a file or folder by reading the parent tree
        const pathType = await this.getPathTypeInTree(
          repoDir,
          parentPath,
          targetName,
          commitOid
        );

        if (matchedBranch === undefined) {
          // OID-based path

          if (pathType === 'file') {
            return {
              pathType: 'gitFile',
              host: 'github.com',
              username,
              repoName,
              commitOid: commitOid,
              filePath,
            };
          } else {
            return {
              pathType: 'gitFolder',
              host: 'github.com',
              username,
              repoName,
              commitOid: commitOid,
              folderPath: filePath,
            };
          }
        } else {
          // Branch-based path
          if (pathType === 'file') {
            return {
              pathType: 'gitFile',
              host: 'github.com',
              username,
              repoName,
              branch: matchedBranch,
              commitOid: commitOid,
              filePath,
            };
          } else {
            return {
              pathType: 'gitFolder',
              host: 'github.com',
              username,
              repoName,
              branch: matchedBranch,
              commitOid: commitOid,
              folderPath: filePath,
            };
          }
        }
      }
    }

    // Invalid path
    throw new Error(`ENOENT: no such file or directory, resolve '${pathStr}'`);
  }

  // #region File system operations

  async lstat(pathStr: string): Promise<fsDisk.Stats> {
    console.log(`[GitGateway] lstat('${pathStr}')`);
    return this.stat(pathStr);
  }

  async stat(pathStr: string): Promise<fsDisk.Stats> {
    console.log(`[GitGateway] stat('${pathStr}')`);
    // Use resolvePath to parse the path
    const resolved = await this.resolvePath(pathStr);

    const fileId = this.nextFileId++;

    // For branch/OID paths, resolvePath already validated and cloned
    // For user/repo paths, we need to validate existence
    switch (resolved.pathType) {
      case 'root':
      case 'configFile':
        return this.createDirStats(fileId, this.serverStartDate);

      case 'host':
        // Ensure storage folder exists
        if (resolved.host === 'github.com') {
          const bookmarksPath = `${this.storageBasePath}/bookmarks/github.com`;
          await this.ensureDir(bookmarksPath);
        }
        return this.createDirStats(fileId, this.serverStartDate);

      case 'user': {
        // Validate user exists (materialized, unmaterialized, or on GitHub)
        const userPath = `${this.storageBasePath}/bookmarks/${resolved.host}/${resolved.username}`;
        const isMaterialized = await this.pathExists(userPath);

        if (isMaterialized || this.unmaterializedUsers.has(resolved.username)) {
          return this.createDirStats(fileId, this.serverStartDate);
        }

        // Check GitHub API for user existence
        const userExists = await this.checkGitHubUserExists(resolved.username);
        if (!userExists) {
          throw new Error(
            `ENOENT: no such file or directory, stat '${pathStr}'`
          );
        }

        // User exists on GitHub, add to unmaterialized map
        this.unmaterializedUsers.set(resolved.username, []);
        return this.createDirStats(fileId, this.serverStartDate);
      }

      case 'repo': {
        // Validate repo exists for user
        const userPath = `${this.storageBasePath}/bookmarks/${resolved.host}/${resolved.username}`;
        const isMaterialized = await this.pathExists(userPath);
        const isUnmaterialized = this.unmaterializedUsers.has(
          resolved.username
        );

        if (!isMaterialized && !isUnmaterialized) {
          const userExists = await this.checkGitHubUserExists(
            resolved.username
          );
          if (!userExists) {
            throw new Error(
              `ENOENT: no such file or directory, stat '${pathStr}'`
            );
          }
          this.unmaterializedUsers.set(resolved.username, []);
        }

        // Check if repo exists in user's repo list
        if (isUnmaterialized || !isMaterialized) {
          const userRepos = this.unmaterializedUsers.get(resolved.username);
          if (!userRepos || userRepos.length === 0) {
            const repos = await this.fetchGitHubUserRepos(resolved.username);
            this.unmaterializedUsers.set(resolved.username, repos);
          }

          const updatedRepos = this.unmaterializedUsers.get(resolved.username);
          if (updatedRepos && !updatedRepos.includes(resolved.repoName!)) {
            throw new Error(
              `ENOENT: no such file or directory, stat '${pathStr}'`
            );
          }
          return this.createDirStats(fileId, this.serverStartDate);
        }

        // User is materialized - check cached repos
        if (!this.materializedUserRepos.has(resolved.username)) {
          const repos = await this.fetchGitHubUserRepos(resolved.username);
          this.materializedUserRepos.set(resolved.username, repos);
        }

        const cachedRepos = this.materializedUserRepos.get(resolved.username);
        if (cachedRepos && !cachedRepos.includes(resolved.repoName!)) {
          throw new Error(
            `ENOENT: no such file or directory, stat '${pathStr}'`
          );
        }

        return this.createDirStats(fileId, this.serverStartDate);
      }

      case 'branch':
      case 'oid':
      case 'gitFolder':
        // resolvePath already validated and cloned
        return this.createDirStats(fileId, this.serverStartDate);

      case 'gitFile':
        // resolvePath already validated and cloned
        return this.createFileStats(fileId, this.serverStartDate, resolved);

      default:
        throw new Error(`ENOENT: no such file or directory, stat '${pathStr}'`);
    }
  }

  async readdir(pathStr: string): Promise<string[]> {
    console.log(`[GitGateway] readdir('${pathStr}')`);
    // Use resolvePath to parse the path
    let resolved: PathResult;
    try {
      resolved = await this.resolvePath(pathStr);
    } catch (error) {
      // Re-throw with readdir context
      const err = error as Error;
      if (err.message.includes('resolve')) {
        throw new Error(err.message.replace('resolve', 'readdir'));
      }
      throw new Error(
        `ENOENT: no such file or directory, readdir '${pathStr}'`
      );
    }

    switch (resolved.pathType) {
      case 'root':
        return ['config', 'github.com'];

      case 'configFile':
        return [];

      case 'host':
        // List materialized and unmaterialized users
        if (resolved.host !== 'github.com') {
          throw new Error(
            `ENOENT: no such file or directory, readdir '${pathStr}'`
          );
        }
        const bookmarksPath = `${this.storageBasePath}/bookmarks/github.com`;
        await this.ensureDir(bookmarksPath);
        const materializedUsers =
          await this.storageFs.promises.readdir(bookmarksPath);
        const allUsers = new Set([...materializedUsers]);
        for (const username of this.unmaterializedUsers.keys()) {
          allUsers.add(username);
        }
        return Array.from(allUsers);

      case 'user':
        // List repos for user
        const userPath = `${this.storageBasePath}/bookmarks/${resolved.host}/${resolved.username}`;
        const isMaterialized = await this.pathExists(userPath);

        if (isMaterialized) {
          // User is materialized - check cache first
          if (this.materializedUserRepos.has(resolved.username)) {
            return this.materializedUserRepos.get(resolved.username)!;
          }

          // No cache yet, try to fetch from GitHub API
          try {
            const repos = await this.fetchGitHubUserRepos(resolved.username);
            this.materializedUserRepos.set(resolved.username, repos);
            return repos;
          } catch (error) {
            // GitHub API failed, fall through to storage fallback
            console.debug(
              `GitHub API fetch failed for ${resolved.username}, falling back to storage:`,
              error
            );
          }

          // Fallback to storage for materialized users
          try {
            const entries = await this.storageFs.promises.readdir(userPath);
            const repos = entries.map((entry: any) => {
              if (typeof entry !== 'string')
                throw new Error('Expected string entry name');
              return entry;
            });
            // Cache the storage results
            this.materializedUserRepos.set(resolved.username, repos);
            return repos;
          } catch (error) {
            return [];
          }
        }

        // User is not materialized - use GitHub API
        try {
          const repos = await this.fetchGitHubUserRepos(resolved.username);
          this.unmaterializedUsers.set(resolved.username, repos);
          return repos;
        } catch (error) {
          // Check unmaterialized map as fallback
          if (this.unmaterializedUsers.has(resolved.username)) {
            return this.unmaterializedUsers.get(resolved.username)!;
          }

          // User doesn't exist in GitHub or storage
          throw new Error(
            `ENOENT: no such file or directory, readdir '${pathStr}'`
          );
        }

      case 'repo':
        // List branches for repo, but represent branches with slashes as nested folders
        await this.ensureRepoCloned(resolved.username!, resolved.repoName!);
        const repoDir = `${this.storageBasePath}/bookmarks/${resolved.host}/${resolved.username}/${resolved.repoName}`;
        const branches = await git.listBranches({
          fs: this.storageFs,
          dir: repoDir,
        });
        console.log(
          `[GitGateway] Found ${branches.length} branches:`,
          branches
        );

        // Extract unique first parts of branch names
        // For example:
        // - 'main' -> 'main'
        // - 'branch/with/slash' -> 'branch'
        // - 'copilot/branch-with-slash' -> 'copilot'
        const firstParts = new Set<string>();
        for (const branch of branches) {
          const firstPart = branch.split('/')[0];
          firstParts.add(firstPart);
        }

        console.log(
          `[GitGateway] Returning branch folders:`,
          Array.from(firstParts)
        );
        return Array.from(firstParts);

      case 'branch': {
        // List files at root of branch
        await this.ensureRepoCloned(resolved.username!, resolved.repoName!);
        const repoDirBranch = `${this.storageBasePath}/bookmarks/${resolved.host}/${resolved.username}/${resolved.repoName}`;
        const oid = await git.resolveRef({
          fs: this.storageFs,
          dir: repoDirBranch,
          ref: resolved.branch!,
        });
        const tree = await git.readTree({
          fs: this.storageFs,
          dir: repoDirBranch,
          oid,
        });
        return tree.tree.map(entry => entry.path);
      }

      case 'oid': {
        // List files at root of OID
        await this.ensureRepoCloned(resolved.username!, resolved.repoName!);
        const repoDirOid = `${this.storageBasePath}/bookmarks/${resolved.host}/${resolved.username}/${resolved.repoName}`;
        const treeOid = await git.readTree({
          fs: this.storageFs,
          dir: repoDirOid,
          oid: resolved.commitOid!,
        });
        return treeOid.tree.map(entry => entry.path);
      }

      case 'gitFolder': {
        // List files in a folder within a branch/OID
        await this.ensureRepoCloned(resolved.username!, resolved.repoName!);
        const repoDirFolder = `${this.storageBasePath}/bookmarks/${resolved.host}/${resolved.username}/${resolved.repoName}`;

        // Special case: if folderPath is empty and this is a branch namespace
        // (e.g., /repo/branch where 'branch' is part of 'branch/with/slash')
        // We should return the next parts of matching branch names
        if (resolved.branch && resolved.folderPath === '') {
          const allBranches = await git.listBranches({
            fs: this.storageFs,
            dir: repoDirFolder,
          });

          // Find branches that start with this branch name + '/'
          const prefix = resolved.branch + '/';
          const nextParts = new Set<string>();

          for (const branch of allBranches) {
            if (branch.startsWith(prefix)) {
              // Extract the next part after the prefix
              const remaining = branch.slice(prefix.length);
              const nextPart = remaining.split('/')[0];
              nextParts.add(nextPart);
            }
          }

          if (nextParts.size > 0) {
            // This is a branch namespace folder
            console.log(
              `[GitGateway] Branch namespace '${resolved.branch}' contains:`,
              Array.from(nextParts)
            );
            return Array.from(nextParts);
          }
        }

        // Get the commit OID
        let commitOid: string;
        if (resolved.branch) {
          commitOid = await git.resolveRef({
            fs: this.storageFs,
            dir: repoDirFolder,
            ref: resolved.branch,
          });
        } else {
          commitOid = resolved.commitOid!;
        }

        return await this.readFolderAtPathInRepo(
          repoDirFolder,
          resolved.folderPath!,
          commitOid
        );
      }

      case 'gitFile':
        throw new Error(`ENOTDIR: not a directory, readdir '${pathStr}'`);

      default:
        throw new Error(
          `ENOENT: no such file or directory, readdir '${pathStr}'`
        );
    }
  }

  async mkdir(pathStr: string, options?: { mode: number }): Promise<void> {
    console.log(`[GitGateway] mkdir('${pathStr}')`);
    // We don't support creating directories in this version
    throw new Error(`EPERM: operation not permitted, mkdir '${pathStr}'`);
  }

  async rmdir(pathStr: string): Promise<void> {
    console.log(`[GitGateway] rmdir('${pathStr}')`);
    // TODO check if this is a delte of a user like /github.com/username
    // -> remove the user folder in the config dir
    // TODO check if this is a delete of a repo like /github.com/username/repo
    // -> remove the repo folder in the config dir

    // else throw

    // We don't support removing directories in this version
    throw new Error(`EPERM: operation not permitted, rmdir '${pathStr}'`);
  }

  async unlink(pathStr: string): Promise<void> {
    console.log(`[GitGateway] unlink('${pathStr}')`);
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
    console.log(
      `[GitGateway] open() called with path='${pathStr}', flags='${flags}'`
    );
    // Normalize path
    const normalizedPath = pathStr === '' ? '/' : pathStr;
    console.log(`[GitGateway] Normalized path to '${normalizedPath}'`);

    // Use resolvePath to parse the path
    const resolved = await this.resolvePath(normalizedPath);

    // Only support opening files
    if (resolved.pathType !== 'gitFile') {
      const e = new Error(
        `EISDIR: illegal operation on a directory, open '${pathStr}'`
      );
      (e as any).code = 'EISDIR';
      throw e;
    }

    // Ensure repo is cloned
    await this.ensureRepoCloned(resolved.username!, resolved.repoName!);

    // Get the commit OID for the branch or use the provided OID
    const repoDir = `${this.storageBasePath}/bookmarks/${resolved.host}/${resolved.username}/${resolved.repoName}`;
    let commitOid: string;
    if (resolved.branch) {
      commitOid = await git.resolveRef({
        fs: this.storageFs,
        dir: repoDir,
        ref: resolved.branch,
      });
    } else {
      commitOid = resolved.commitOid!;
    }

    // Create a file handle with the commit OID
    const fileHandle = new GitGatewayFileHandle(
      this.storageFs,
      repoDir,
      resolved.filePath!,
      commitOid,
      this.githubToken
    );
    return fileHandle as any;
  }

  // #endregion

  // #region Helper methods

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
   * Fetch repositories for a GitHub user from the GitHub API with pagination
   */
  private async fetchGitHubUserRepos(username: string): Promise<string[]> {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (this.githubToken) {
        headers['Authorization'] = `Bearer ${this.githubToken}`;
      }

      const allRepos: string[] = [];
      let page = 1;
      const perPage = 100;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`,
          { headers }
        );

        if (!response.ok) {
          // If we got some repos, return them; otherwise return empty array
          return allRepos;
        }

        const repos = (await response.json()) as { name: string }[];

        // Add repos from this page
        const repoNames = repos.map((repo: any) => repo.name);
        allRepos.push(...repoNames);

        // Check if we should continue pagination
        // If we got less than per_page items, we're done
        if (repos.length < perPage) {
          hasMore = false;
        } else {
          page++;
        }

        // Safety limit: don't fetch more than 10 pages (1000 repos)
        if (page > 10) {
          console.warn(
            `[GitGateway] User ${username} has more than 1000 repos, stopping pagination`
          );
          hasMore = false;
        }
      }

      return allRepos;
    } catch (error) {
      // On network error, return empty array
      console.error(`[GitGateway] Error fetching repos for ${username}:`, error);
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

  /**
   * Check if a repository is already cloned
   */
  private isRepoCloned(username: string, repoName: string): boolean {
    const key = `${username}/${repoName}`;
    return this.clonedRepos.has(key);
  }

  /**
   * Mark a repository as cloned
   */
  private markRepoAsCloned(username: string, repoName: string): void {
    const key = `${username}/${repoName}`;
    this.clonedRepos.add(key);
  }

  /**
   * Perform a partial clone of a repository (trees and commits only, no blobs)
   * Uses progressive depth fetching to ensure all necessary objects are downloaded
   */
  private async partialClone(
    username: string,
    repoName: string,
    repoDir: string
  ): Promise<void> {
    console.log(`[GitGateway] Partial cloning ${username}/${repoName}...`);

    try {
      // Initial shallow clone
      await git.clone({
        fs: this.storageFs,
        http,
        dir: repoDir,
        url: `https://github.com/${username}/${repoName}`,
        depth: 1,
        filter: 'blob:none', // Don't fetch file contents
        noCheckout: true, // Don't checkout files
        onAuth: () => {
          if (!this.githubToken) {
            return undefined;
          }
          return {
            username: 'token',
            password: this.githubToken,
          };
        },
      });

      // Fetch all remote branches to support branches with slashes
      try {
        const refs = await git.listServerRefs({
          http,
          url: `https://github.com/${username}/${repoName}`,
          onAuth: () => {
            if (!this.githubToken) {
              return undefined;
            }
            return {
              username: 'token',
              password: this.githubToken,
            };
          },
        });

        // Filter to only get branch refs (refs/heads/*)
        const branchRefs = refs
          .map((r: any) => r.ref)
          .filter((ref: string) => ref.startsWith('refs/heads/'));

        console.log(
          `[GitGateway] Creating local refs for ${branchRefs.length} branches...`
        );

        // Create local branch references directly from server refs
        for (const ref of branchRefs) {
          const branchName = ref.replace('refs/heads/', '');
          try {
            // Find the OID from the server refs
            const serverRef = refs.find((r: any) => r.ref === ref);
            if (!serverRef) {
              console.warn(
                `[GitGateway] Could not find server ref for ${branchName}`
              );
              continue;
            }

            // Create local branch reference pointing to the commit
            await git.writeRef({
              fs: this.storageFs,
              dir: repoDir,
              ref: `refs/heads/${branchName}`,
              value: serverRef.oid,
              force: true,
            });

            console.log(
              `[GitGateway] Created local ref for branch '${branchName}' -> ${serverRef.oid}`
            );
          } catch (error) {
            // Skip branches that fail, but log the error
            const err = error as Error;
            console.warn(
              `[GitGateway] Failed to create local ref for branch '${branchName}': ${err.message}`
            );
          }
        }

        console.log(
          `[GitGateway] Created local refs for ${branchRefs.length} branches`
        );
      } catch (error) {
        console.warn(
          '[GitGateway] Failed to fetch all branches, using default branch only:',
          error
        );
      }

      this.markRepoAsCloned(username, repoName);
      console.log(
        `[GitGateway] Partial clone complete for ${username}/${repoName}`
      );
    } catch (error) {
      const err = error as Error;
      console.error(
        `[GitGateway] Partial clone failed for ${username}/${repoName}:`,
        err.message
      );
      throw error;
    }
  }

  private async getPathTypeInTree(
    repoDir: string,
    parentPath: string,
    targetName: string,
    commitOid: string
  ): Promise<'file' | 'folder'> {
    try {
      const result = await git.readTree({
        fs: this.storageFs,
        dir: repoDir,
        gitdir: `${repoDir}/.git`,
        oid: commitOid,
        filepath: parentPath,
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

      if (!result || !result.tree) {
        throw new Error(`Path '${parentPath}' not found in repository`);
      }

      // Find the target entry in the tree
      const entry = result.tree.find((e: any) => e.path === targetName);

      if (!entry) {
        throw new Error(`'${targetName}' not found in '${parentPath}'`);
      }

      // Return type based on the entry type
      return entry.type === 'blob' ? 'file' : 'folder';
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to read tree at '${parentPath}': ${err.message}`);
    }
  }

  private async readFolderAtPathInRepo(
    repoDir: string,
    folderPath: string,
    commitOid: string
  ): Promise<string[]> {
    try {
      const result = await git.readTree({
        fs: this.storageFs,
        dir: repoDir,
        gitdir: `${repoDir}/.git`,
        oid: commitOid,
        filepath: folderPath,
        cache: {
          _lazyFetchEnabled: true,
          _lazyCacheSize: 100, // Keep last 100 trees in cache
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

      if (!result || !result.tree) {
        throw new Error(`Directory '${folderPath}' not found in repository`);
      }

      return result.tree.map(entry => entry.path);
    } catch (error) {
      const err = error as Error;
      throw new Error(
        `Failed to read directory '${folderPath}' in repository: ${err.message}`
      );
    }
  }


  /**
   * Ensure a repository is cloned (clone if not already cloned)
   */
  private async ensureRepoCloned(
    username: string,
    repoName: string
  ): Promise<void> {
    if (this.isRepoCloned(username, repoName)) {
      // console.debug(
      //   `[GitGateway] Ensuring repo is cloned: ${username}/${repoName} - already cloned`
      // );
      return; // Already cloned
    }

    const userPath = `${this.storageBasePath}/bookmarks/github.com/${username}`;
    const repoDir = `${userPath}/${repoName}`;

    // Perform partial clone
    await this.partialClone(username, repoName, repoDir);
    console.debug(`[GitGateway] Repo is now cloned: ${username}/${repoName}`);
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
   * Create Stats object for a file
   */
  private async createFileStats(
    fileId: number,
    now: Date,
    resolved: PathResult
  ): Promise<fsDisk.Stats> {
    // Fetch the actual file size from git
    let fileSize = 1;
    try {
      const repoDir = `${this.storageBasePath}/bookmarks/${resolved.host}/${resolved.username}/${resolved.repoName}`;

      const sizeCacheKey = `${repoDir}:${resolved.commitOid}:${resolved.filePath}`;
      if (!this.fileSizeCache.has(sizeCacheKey)) {
        // Get the commit OID for the branch or use the provided OID
        let commitOid = resolved.commitOid!;

        // Read the blob to get the file size
        const result = await git.readBlob({
          fs: this.storageFs,
          dir: repoDir,
          oid: commitOid,
          filepath: resolved.filePath!,
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
          this.fileSizeCache.set(sizeCacheKey, result.blob.length);
          fileSize = this.fileSizeCache.get(sizeCacheKey)!;
        }
      } else {
        fileSize = this.fileSizeCache.get(sizeCacheKey)!;
      }
    } catch (error) {
      // If we can't read the blob, default to size 1 (will be fetched on read)
      console.warn(
        `[GitGateway] Failed to fetch file size for stat: ${error}. Defaulting to size 1.`
      );
      fileSize = 1;
    }

    return {
      mode: 0o644,
      size: fileSize,
      atimeMs: now.getTime(),
      mtimeMs: now.getTime(),
      ctimeMs: now.getTime(),
      birthtimeMs: now.getTime(),
      atime: now,
      mtime: now,
      ctime: now,
      birthtime: now,
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
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
      blocks: Math.ceil(fileSize / 512) || 8,
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
