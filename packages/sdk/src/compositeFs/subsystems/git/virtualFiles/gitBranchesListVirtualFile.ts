import git from '@legit-sdk/isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';
import { toDirEntry } from './utils.js';
import { encodeBranchNameForVfs } from './operations/nameEncoding.js';
import { CompositeSubFsAdapter } from '../../CompositeSubFsAdapter.js';

/**
 * Creates a CompositeSubFsAdapter for listing git branches
 *
 * This adapter handles the .legit/branches directory, providing a list
 * of all branches in the repository. Each branch is represented as a
 * directory entry that can be accessed to view files within that branch.
 *
 * @example
 * ```ts
 * const adapter = createBranchesListAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 *
 * // Use in CompositeFs routes
 * const compositeFs = new CompositeFs({
 *   routes: {
 *     '.legit': {
 *       branches: {
 *         '.': adapter,
 *       },
 *     },
 *   },
 * });
 * ```
 */
export function createBranchesListAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const adapter = new CompositeSubFsAdapter({
    name: 'branches-list',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'gitBranchesListVirtualFile',
      rootType: 'folder',

      getStats: async () => {
        const gitDir = gitRoot + '/' + '.git';
        try {
          const gitStats = await gitStorageFs.promises.stat(gitDir);
          return gitStats;
        } catch (err) {
          // If .git does not exist, propagate as ENOENT
          throw new Error(
            `ENOENT: no such file or directory, stat '${gitDir}'`
          );
        }
      },

      getFile: async ({ filePath }) => {
        try {
          const branches = await git.listBranches({
            fs: gitStorageFs,
            dir: gitRoot,
          });

          const branchesInfo = await Promise.all(
            branches.map(async branch => {
              const oid = await git.resolveRef({
                fs: gitStorageFs,
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
    },
  });

  return adapter;
}
