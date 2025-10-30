import git from 'isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';
import { PathLike } from 'node:fs';

// .legit/branches -> list of branches

export const gitBranchesListVirtualFile: VirtualFileDefinition = {
  type: 'gitBranchesListVirtualFile',

  getStats: async ({ gitRoot, nodeFs }) => {
    const gitDir = gitRoot + '/' + '.git';
    try {
      const gitStats = await nodeFs.stat(gitDir);
      return gitStats;
    } catch (err) {
      // If .git does not exist, propagate as ENOENT
      throw new Error(`ENOENT: no such file or directory, stat '${gitDir}'`);
    }
  },
  getFile: async ({ gitRoot, nodeFs }) => {
    try {
      const branches = await git.listBranches({ fs: nodeFs, dir: gitRoot });
      const currentBranch = await git.currentBranch({
        fs: nodeFs,
        dir: gitRoot,
      });

      const branchesInfo = await Promise.all(
        branches.map(async branch => {
          const oid = await git.resolveRef({
            fs: nodeFs,
            dir: gitRoot,
            ref: branch,
          });
          return branch;
        })
      );

      return {
        type: 'directory',
        content: branchesInfo,
        mode: 0o755,
        size: branchesInfo,
      };
    } catch (error) {
      throw error;
    }
  },

  rename: async (args: VirtualFileArgs & { newPath: string }) => {
    throw new Error('not implemented');
  },
  mkdir: async function (
    args: VirtualFileArgs & {
      options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null;
    }
  ): Promise<void> {
    throw new Error('not implemented');
  },
};
