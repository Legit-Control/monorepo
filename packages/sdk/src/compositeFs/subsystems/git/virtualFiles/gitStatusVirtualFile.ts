import git from 'isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';

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

export function getFileStatus(
  head: number,
  workdir: number,
  stage: number
): string {
  if (head === 0 && workdir === 2 && stage === 0) return 'untracked';
  if (head === 1 && workdir === 0 && stage === 0) return 'deleted';
  if (head === 1 && workdir === 2 && stage !== 0) return 'modified';
  if (head === 0 && workdir === 2 && stage === 2) return 'added';
  return 'unknown';
}

export const gitStatusVirtualFile: VirtualFileDefinition = {
  type: 'gitStatusVirtualFile',
  rootType: 'file',

  getStats: async args => {
    const gitDir = args.gitRoot + '/' + '.git';
    try {
      const gitStats = await args.nodeFs.stat(gitDir);
      return gitStats;
    } catch (err) {
      // If .git does not exist, propagate as ENOENT
      throw new Error(`ENOENT: no such file or directory, stat '${gitDir}'`);
    }
  },
  getFile: async ({ gitRoot, nodeFs, userSpaceFs }) => {
    // Get overall repository status

    try {
      const currentBranch =
        (await git.currentBranch({ fs: nodeFs, dir: gitRoot })) || 'HEAD';
      const headCommit = await git.resolveRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: 'HEAD',
      });

      const statusMatrix = await git.statusMatrix({
        fs: nodeFs,
        dir: gitRoot,
        cache: getGitCacheFromFs(userSpaceFs),
      });

      const modifiedFiles = statusMatrix
        .filter(
          ([, head, workdir, stage]) => head !== workdir || workdir !== stage
        )
        .map(([filepath, head, workdir, stage]) => ({
          path: filepath,
          status: getFileStatus(head, workdir, stage),
        }));

      const content = JSON.stringify(
        {
          branch: currentBranch,
          commit: headCommit,
          clean: modifiedFiles.length === 0,
          files: modifiedFiles,
        },
        null,
        2
      );

      return {
        type: 'file',
        content,
        mode: 33188,
        size: Buffer.byteLength(content),
      };
    } catch (err) {
      console.error(err);
      throw err;
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
