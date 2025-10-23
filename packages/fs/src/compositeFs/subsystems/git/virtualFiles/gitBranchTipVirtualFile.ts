import git from 'isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';

export const gitBranchTipVirtualFile: VirtualFileDefinition = {
  type: 'gitBranchTipVirtualFile',
  getStats: async args => {
    // TODO use the information within the tip tag
    const gitDir = args.gitRoot + '/' + '.git';
    try {
      const gitStats = await args.fs.stat(gitDir);
      return gitStats;
    } catch (err) {
      // If .git does not exist, propagate as ENOENT
      throw new Error(`ENOENT: no such file or directory, stat '${gitDir}'`);
    }
  },

  getFile: async ({ filePath, gitRoot, nodeFs, pathParams }) => {
    
    if (!pathParams.branchName) {
      throw new Error('branchName should be in pathParams');
    }

    try {
      const tipCommit = await git.resolveRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: `refs/heads/${pathParams.branchName}`,
      });

      return {
        type: 'file',
        content: tipCommit + '\n',
        mode: 0o644,
        size: tipCommit.length + 1,
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
