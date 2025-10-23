import git from 'isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';

export const gitCompareVirtualFile: VirtualFileDefinition = {
  type: 'gitCompareVirtualFile',

  getStats: async ({ gitRoot, nodeFs, pathParams }) => {
    if (pathParams.branchName === undefined) {
      throw new Error('branchName should be in pathParams');
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
      throw new Error('branchName should be in pathParams');
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
