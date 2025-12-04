import git from 'isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';
import { getCurrentBranch } from './getCurrentBranch.js';

export const gitBranchHeadVirtualFile: VirtualFileDefinition = {
  type: 'gitBranchHeadVirtualFile',

  getStats: async ({ gitRoot, nodeFs, pathParams }) => {
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
  getFile: async ({ gitRoot, nodeFs, pathParams }) => {
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
