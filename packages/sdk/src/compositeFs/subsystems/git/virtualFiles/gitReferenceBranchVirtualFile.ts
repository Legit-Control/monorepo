import git from '@legit-sdk/isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';
import * as nodeFs from 'node:fs';
import {
  getReferenceBranch,
  setReferenceBranch,
} from './getReferenceBranch.js';
import { tryResolveRef } from './utils.js';
import { CompositeSubFsAdapter } from './CompositeSubFsAdapter.js';

/**
 * Creates a CompositeSubFsAdapter for reference branch operations
 *
 * This adapter handles reading and writing the reference branch name.
 *
 * @example
 * ```ts
 * const adapter = createReferenceBranchAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 * ```
 */
export function createReferenceBranchAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const adapter = new CompositeSubFsAdapter({
    name: 'reference-branch',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'gitReferenceBranchVirtualFile',
      rootType: 'file',

      getStats: async args => {
        const branchName = await getReferenceBranch(gitRoot, gitStorageFs);
        const size = branchName.length;

        return {
          mode: 0o644,
          size: size,
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
          blocks: Math.ceil(size / 4096),
          atimeMs: Date.now(),
          mtimeMs: Date.now(),
          ctimeMs: Date.now(),
          birthtimeMs: Date.now(),
          atime: new Date(),
          mtime: new Date(),
          ctime: new Date(),
          birthtime: new Date(),
        } as any;
      },

      getFile: async args => {
        const branchName = await getReferenceBranch(gitRoot, gitStorageFs);
        return {
          type: 'file',
          content: branchName + '\n',
          mode: 0o644,
          size: branchName.length + 1,
        };
      },

      writeFile: async args => {
        const { content } = args;
        const newBranchName = content.toString().trim();

        // NOTE: NFS3 does truncate the file - we expect the file to be written fully anyway - ignor zero length wirtes
        if (newBranchName.length === 0) {
          return;
        }

        // Check that the branch exists before setting it

        const ref = await tryResolveRef(gitStorageFs, gitRoot, newBranchName);
        if (!ref) {
          throw new Error(
            `Branch ${newBranchName} does not exist in the repository`
          );
        }

        // Use setTargetBranch to set the new branch
        await setReferenceBranch(gitRoot, gitStorageFs, newBranchName);
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
