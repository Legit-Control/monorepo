import git from '@legit-sdk/isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';
import { toDirEntry } from './utils.js';
import { encodeBranchNameForVfs } from './operations/nameEncoding.js';

// .legit/branches -> list of branches

export const gitBranchesListVirtualFile: VirtualFileDefinition = {
  type: 'gitBranchesListVirtualFile',
  rootType: 'folder',

  getStats: async ({ gitRoot, nodeFs }) => {
    const gitDir = gitRoot + '/' + '.git';
    try {
      const gitStats = await nodeFs.promises.stat(gitDir);
      return gitStats;
    } catch (err) {
      // If .git does not exist, propagate as ENOENT
      throw new Error(`ENOENT: no such file or directory, stat '${gitDir}'`);
    }
  },
  getFile: async ({ gitRoot, nodeFs, filePath }) => {
    try {
      const branches = await git.listBranches({ fs: nodeFs, dir: gitRoot });

      const branchesInfo = await Promise.all(
        branches.map(async branch => {
          const oid = await git.resolveRef({
            fs: nodeFs,
            dir: gitRoot,
            ref: branch,
          });
          return toDirEntry({
            parent: filePath,
            name: encodeBranchNameForVfs(branch),
            isDir: true,
          });
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
