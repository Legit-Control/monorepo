import git from '@legit-sdk/isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';
import { getCurrentBranch } from './getCurrentBranch.js';
import { tryResolveRef } from './utils.js';
import { decodeBranchNameFromVfs } from './operations/nameEncoding.js';
import { getReferenceBranch } from './getReferenceBranch.js';
import { CompositeSubFsAdapter } from './CompositeSubFsAdapter.js';

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

/**
 * Creates a CompositeSubFsAdapter for applying changes operations
 *
 * This adapter handles applying changes from the current branch to the reference branch.
 *
 * @example
 * ```ts
 * const adapter = createApplyChangesAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 * ```
 */
export function createApplyChangesAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const adapter = new CompositeSubFsAdapter({
    name: 'apply-changes',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'gitApplyCurrentChangesToVirtualFile',
      rootType: 'file',

      getStats: async ({ pathParams, userSpaceFs }) => {
        const epoch = new Date(0);

        // TODO use the head information of the commit
        return {
          mode: 0o644,
          size: 40,
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
          blocks: Math.ceil(40 / 4096),
          atimeMs: epoch,
          mtimeMs: epoch,
          ctimeMs: epoch,
          birthtimeMs: epoch,
          atime: epoch,
          mtime: epoch,
          ctime: epoch,
          birthtime: epoch,
        } as any;
      },
      getFile: async ({ pathParams, userSpaceFs }) => {
        try {
          return {
            type: 'file',
            content: '' + '\n',
            mode: 0o644,
            size: 2,
          };
        } catch (error) {
          return undefined;
        }
      },

      writeFile: async args => {
        const { content, userSpaceFs } = args;
        const sourceBranch = await getCurrentBranch(gitRoot, gitStorageFs);
        const targetBranch = await getReferenceBranch(gitRoot, gitStorageFs);
        const commitMessage = content.toString().trim();

        // NOTE: NFS3 does truncate the file - we expect the file to be written fully anyway - ignor zero length wirtes
        if (commitMessage.length === 0) {
          return;
        }

        const source = await tryResolveRef(gitStorageFs, gitRoot, sourceBranch);

        if (!source) {
          throw new Error(`Source branch ${sourceBranch} does not exist`);
        }

        const target = await tryResolveRef(gitStorageFs, gitRoot, targetBranch);

        if (!target) {
          throw new Error(`Target branch ${targetBranch} does not exist`);
        }

        // read tree also accepts a git commit - it will resolve the tree within the commit
        const sourceTree = await git.readTree({
          fs: gitStorageFs,
          dir: gitRoot,
          oid: source,
        });

        const targetTree = await git.readTree({
          fs: gitStorageFs,
          dir: gitRoot,
          oid: target,
        });

        if (targetTree === sourceTree) {
          // No changes to apply
          return;
        }

        const time = Math.floor(Date.now() / 1000);

        const applyCommitOid = await git.commit({
          fs: gitStorageFs,
          dir: gitRoot,
          message: commitMessage,
          tree: sourceTree.oid,
          noUpdateBranch: true,
          author: { ...args.author, timestamp: time },
          // TODO only reference the branch commit if the commit has changed since last operation commit referencing the branch commit
          parent: [target],
        });

        const refApplyCommitOid = await git.commit({
          fs: gitStorageFs,
          dir: gitRoot,
          message:
            'Changes from ' + sourceBranch + ' applied to ' + targetBranch,
          tree: sourceTree.oid,
          noUpdateBranch: true,

          author: { ...args.author, timestamp: time - 3 },
          // TODO only reference the branch commit if the commit has changed since last operation commit referencing the branch commit
          parent: [source, applyCommitOid],
        });

        await git.writeRef({
          fs: gitStorageFs,
          dir: gitRoot,
          ref: 'refs/heads/' + decodeBranchNameFromVfs(targetBranch),
          value: applyCommitOid,
          force: true,
        });

        await git.writeRef({
          fs: gitStorageFs,
          dir: gitRoot,
          ref: 'refs/heads/' + decodeBranchNameFromVfs(sourceBranch),
          value: refApplyCommitOid,
          force: true,
        });
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
    },
  });

  return adapter;
}
