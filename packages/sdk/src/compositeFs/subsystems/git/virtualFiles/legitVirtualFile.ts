import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';
import { CompositeSubFsAdapter } from '../../CompositeSubFsAdapter.js';

/**
 * Creates a CompositeSubFsAdapter for legit virtual folder operations
 *
 * This adapter handles the .legit folder, which serves as the root
 * for all legit-related virtual files and operations.
 *
 * @example
 * ```ts
 * const adapter = createLegitVirtualFileAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 *
 * // Use in CompositeFs routes
 * const compositeFs = new CompositeFs({
 *   routes: {
 *     '.legit': adapter,
 *   },
 * });
 * ```
 */
export function createLegitVirtualFileAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const adapter = new CompositeSubFsAdapter({
    name: 'legit-virtual-file',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'legitVirtualFile',
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

      getFile: async ({ gitRoot, nodeFs }) => {
        return {
          type: 'directory',
          content: [],
          mode: 0o755,
          size: 0,
        };
        // throw new Error('not implemented');
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
    },
  });

  return adapter;
}
