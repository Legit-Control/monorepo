import git from '@legit-sdk/isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';
import * as nodeFs from 'node:fs';
import { getCurrentBranch, setCurrentBranch } from './getCurrentBranch.js';
import { tryResolveRef } from './utils.js';
import { getReferenceBranch } from './getReferenceBranch.js';
import { decodeBranchNameFromVfs } from './operations/nameEncoding.js';
import { CompositeSubFsAdapter } from '../../CompositeSubFsAdapter.js';

/**
 * Creates a CompositeSubFsAdapter for current branch operations
 *
 * This adapter handles reading and writing the current branch name.
 *
 * @example
 * ```ts
 * const adapter = createCurrentBranchAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 * ```
 */
export function createCurrentBranchAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const adapter = new CompositeSubFsAdapter({
    name: 'current-branch',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'gitCurrentBranchVirtualFile',
      rootType: 'file',

  getStats: async ({ gitRoot, nodeFs }) => {
    const branchName = await getCurrentBranch(gitRoot, nodeFs);
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

  getFile: async ({ gitRoot, nodeFs }) => {
    const branchName = await getCurrentBranch(gitRoot, nodeFs);
    return {
      type: 'file',
      content: branchName + '\n',
      mode: 0o644,
      size: branchName.length + 1,
    };
  },

  writeFile: async ({ gitRoot, nodeFs, content }) => {
    const newBranchName = content.toString().trim();

    // Check that the branch exists before setting it

    const ref = await tryResolveRef(nodeFs, gitRoot, newBranchName);
    if (!ref) {
      const sourceBranch = await getReferenceBranch(gitRoot, nodeFs);

      const sourceBranchRef = await tryResolveRef(
        nodeFs,
        gitRoot,
        sourceBranch
      );

      if (!sourceBranchRef) {
        throw new Error(
          `Ref branch ${sourceBranch} does not exist in the repository`
        );
      }
      await git.branch({
        fs: nodeFs,
        dir: gitRoot,
        ref: decodeBranchNameFromVfs(newBranchName),
        object: sourceBranchRef,
      });
    }

    // Use setCurrentBranch to set the new branch
    await setCurrentBranch(gitRoot, nodeFs, newBranchName);
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
