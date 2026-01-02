import git from '@legit-sdk/isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';
import * as nodeFs from 'node:fs';
import { getTargetBranch, setTargetBranch } from './getTargetBranch.js';
import { tryResolveRef } from './utils.js';

export const gitTargetBranchVirtualFile: VirtualFileDefinition = {
  type: 'gitTargetBranchVirtualFile',
  rootType: 'file',

  getStats: async ({ gitRoot, nodeFs }) => {
    const branchName = await getTargetBranch(gitRoot, nodeFs);
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
    const branchName = await getTargetBranch(gitRoot, nodeFs);
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
      throw new Error(
        `Branch ${newBranchName} does not exist in the repository`
      );
    }

    // Use setTargetBranch to set the new branch
    await setTargetBranch(gitRoot, nodeFs, newBranchName);
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
