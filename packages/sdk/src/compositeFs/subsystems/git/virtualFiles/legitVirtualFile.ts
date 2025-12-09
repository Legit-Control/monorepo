import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';

export const legitVirtualFile: VirtualFileDefinition = {
  type: 'legitVirtualFile',
  rootType: 'folder',
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
    // return {
    //   type: 'directory',
    //   content: [],
    //   mode: 0o755,
    //   size: 0,
    // };
    throw new Error('not implemented');
  },
  rename(args) {
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
