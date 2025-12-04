import git from 'isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';
import { getCurrentBranch } from './getCurrentBranch.js';

function getGitCacheFromArgs(args: VirtualFileArgs): any {
  // Access gitCache through the userSpaceFs hierarchy
  if (args.userSpaceFs && args.userSpaceFs.gitCache !== undefined) {
    return args.userSpaceFs.gitCache;
  }
  // If it has a parent, traverse up to find the gitCache
  if (args.userSpaceFs && args.userSpaceFs.parentFs) {
    return getGitCacheFromFs(args.userSpaceFs.parentFs);
  }
  // Default to empty object if no cache found
  return {};
}

function getGitCacheFromFs(fs: any): any {
  // If it's a CompositeFs with gitCache, use it
  if (fs && fs.gitCache !== undefined) {
    return fs.gitCache;
  }
  // If it has a parent, traverse up to find the gitCache
  if (fs && fs.parentFs) {
    return getGitCacheFromFs(fs.parentFs);
  }
  // Default to empty object if no cache found
  return {};
}

export const gitBranchHeadVirtualFile: VirtualFileDefinition = {
  type: 'gitBranchHeadVirtualFile',

  getStats: async ({ gitRoot, nodeFs, pathParams, userSpaceFs }) => {
    if (pathParams.branchName === undefined) {
      pathParams.branchName = await getCurrentBranch(gitRoot, nodeFs);
    }

    let headCommit: string;

    try {
      headCommit = await git.resolveRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: pathParams.branchName,
      });
    } catch {
      headCommit = await git.resolveRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: `refs/heads/${pathParams.branchName}`,
      });
    }

    const commit = await git.readCommit({
      fs: nodeFs,
      dir: gitRoot,
      oid: headCommit,
      cache: getGitCacheFromFs(userSpaceFs),
    });
    const { commit: commitObj } = commit;
    const commitTimeMs = commitObj.committer.timestamp * 1000;

    // TODO use the head information of the commit
    return {
      mode: 0o644,
      size: 40,
      isFile: () => true,
      isDirectory: () => false,
      isSymbolicLink: () => false,
      isBlockDevice: () => false,
      isCharacterDevice: () => false,
      isSocket: () => false,
      isFIFO: () => false,
      isFileSync: () => true,
      isDirectorySync: () => false,
      dev: 0,
      ino: 0,
      nlink: 1,
      uid: 0,
      gid: 0,
      rdev: 0,
      blksize: 4096,
      blocks: Math.ceil(40 / 4096),
      atimeMs: commitTimeMs,
      mtimeMs: commitTimeMs,
      ctimeMs: commitTimeMs,
      birthtimeMs: commitTimeMs,
      atime: new Date(commitTimeMs),
      mtime: new Date(commitTimeMs),
      ctime: new Date(commitTimeMs),
      birthtime: new Date(commitTimeMs),
    } as any;
  },
  getFile: async ({ gitRoot, nodeFs, pathParams, userSpaceFs }) => {
    if (pathParams.branchName === undefined) {
      pathParams.branchName = await getCurrentBranch(gitRoot, nodeFs);
    }

    try {
      let headCommit: string;

      try {
        headCommit = await git.resolveRef({
          fs: nodeFs,
          dir: gitRoot,
          ref: pathParams.branchName,
        });
      } catch {
        headCommit = await git.resolveRef({
          fs: nodeFs,
          dir: gitRoot,
          ref: `refs/heads/${pathParams.branchName}`,
        });
      }

      return {
        type: 'file',
        content: headCommit + '\n',
        mode: 0o644,
        size: headCommit.length,
      };
    } catch (error) {
      return undefined;
    }
  },

  writeFile: async ({
    filePath,
    gitRoot,
    nodeFs,
    content,
    cacheFs,
    pathParams,
    userSpaceFs,
  }) => {
    console.log('gitBranchHeadVirtualFile writeFile called', {
      pathParams,
      content,
    });
    if (pathParams.branchName === undefined) {
      pathParams.branchName = await getCurrentBranch(gitRoot, nodeFs);
    }

    const newHead = content.toString().trim();

    // Check if the new head commit exists
    try {
      await git.readCommit({
        fs: nodeFs,
        dir: gitRoot,
        oid: newHead,
        cache: getGitCacheFromFs(userSpaceFs),
      });
    } catch (error) {
      throw new Error(`Commit ${newHead} does not exist in the repository`);
    }

    await git.writeRef({
      fs: nodeFs,
      dir: gitRoot,
      ref: 'refs/heads/' + pathParams.branchName,
      value: newHead,
      force: true,
    });
  },

  rename(args) {
    throw new Error('not implementsd');
  },
  mkdir: async function (
    args: VirtualFileArgs & {
      options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null;
    }
  ): Promise<void> {
    throw new Error('not implemented');
  },
};
