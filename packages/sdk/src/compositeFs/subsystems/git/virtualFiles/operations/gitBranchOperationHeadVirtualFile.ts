import git from '@legit-sdk/isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from '../gitVirtualFiles.js';
import {
  resolveOperationBranchName,
  operationBranchNamePostfix,
} from './resolveOperationBranchName.js';
import * as nodeFs from 'node:fs';
import { getCurrentBranch } from '../getCurrentBranch.js';
import { tryResolveRef } from '../utils.js';
import { CompositeSubFsAdapter } from '../../../CompositeSubFsAdapter.js';

/**
 * Creates a CompositeSubFsAdapter for branch operation head operations
 *
 * This adapter handles reading and writing the operation branch head.
 *
 * @example
 * ```ts
 * const adapter = createBranchOperationHeadAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 * ```
 */
export function createBranchOperationHeadAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const adapter = new CompositeSubFsAdapter({
    name: 'branch-operation-head',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'gitBranchOperationHeadVirtualFile',
      rootType: 'file',

      getStats: async args => {
        const { pathParams } = args;
        if (pathParams.branchName === undefined) {
          pathParams.branchName = await getCurrentBranch(gitRoot, gitStorageFs);
        }

        let operationBranchName = await resolveOperationBranchName(
          gitStorageFs,
          gitRoot,
          pathParams.branchName
        );

        // no branch exists - no head to return
        if (!operationBranchName) {
          const beginningOfTime = new Date(0);
          return {
            mode: 0o644,
            size: 0,
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
            atimeMs: beginningOfTime.getTime(),
            mtimeMs: beginningOfTime.getTime(),
            ctimeMs: beginningOfTime.getTime(),
            birthtimeMs: beginningOfTime.getTime(),
            atime: beginningOfTime,
            mtime: beginningOfTime,
            ctime: beginningOfTime,
            birthtime: beginningOfTime,
          } as any;
        }

        let headCommit: string;

        try {
          headCommit = await git.resolveRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: operationBranchName!,
          });
        } catch {
          headCommit = await git.resolveRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: `refs/heads/${operationBranchName}`,
          });
        }

        const commit = await git.readCommit({
          fs: gitStorageFs,
          dir: gitRoot,
          oid: headCommit,
        });
        const { commit: commitObj } = commit;
        const commitTimeMs = commitObj.committer.timestamp * 1000;

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
          atimeMs: commitTimeMs,
          mtimeMs: commitTimeMs,
          ctimeMs: commitTimeMs,
          birthtimeMs: commitTimeMs,
          atime: new Date(commitTimeMs),
          mtime: new Date(commitTimeMs),
          ctime: new Date(commitTimeMs),
          birthtime: new Date(commitTimeMs),
        } as any;
      },

      getFile: async args => {
        const { pathParams } = args;
        if (pathParams.branchName === undefined) {
          pathParams.branchName = await getCurrentBranch(gitRoot, gitStorageFs);
        }

        let operationBranchName = await resolveOperationBranchName(
          gitStorageFs,
          gitRoot,
          pathParams.branchName
        );
        if (!operationBranchName) {
          return {
            type: 'file',
            content: '',
            mode: 0o644,
            size: 0,
          };
        }

        try {
          let headCommit: string;

          try {
            headCommit = await git.resolveRef({
              fs: gitStorageFs,
              dir: gitRoot,
              ref: operationBranchName,
            });
          } catch {
            headCommit = await git.resolveRef({
              fs: gitStorageFs,
              dir: gitRoot,
              ref: `refs/heads/${operationBranchName}`,
            });
          }

          return {
            type: 'file',
            content: headCommit + '\n',
            mode: 0o644,
            size: headCommit.length,
          };
        } catch (error) {
          return undefined;
        }
      },

      writeFile: async args => {
        const { content, pathParams } = args;
        if (pathParams.branchName === undefined) {
          pathParams.branchName = await getCurrentBranch(gitRoot, gitStorageFs);
        }

        let operationBranchName = await resolveOperationBranchName(
          gitStorageFs,
          gitRoot,
          pathParams.branchName
        );

        // TODO think about an empty file to remove the branch again?
        if (!operationBranchName) {
          throw new Error(
            `Operation branch name could not be resolved for branch ${pathParams.branchName}`
          );
        }

        const operationBranchRef = await tryResolveRef(
          gitStorageFs,
          gitRoot,
          operationBranchName
        );

        const requestedOperationBranchHead = content.toString().trim();
        let newOperationBranchHead: string | undefined = undefined;
        let newBranchHead: string | undefined = undefined;

        let isFirstOperation = false;

        if (!operationBranchRef) {
          throw new Error(
            `Operation branch ref could not be resolved for branch ${operationBranchName}`
          );
        }

        let oid: string | null = operationBranchRef;
        while (oid && !isFirstOperation) {
          const commit = await git.readCommit({
            fs: gitStorageFs,
            dir: gitRoot,
            oid,
          });

          if (commit.oid === requestedOperationBranchHead) {
            newOperationBranchHead = commit.oid;
          }

          // Get parent commit (first parent)
          oid =
            commit.commit.parent && commit.commit.parent.length > 0
              ? commit.commit.parent[0]!
              : null;

          if (commit.commit.parent.length === 2) {
            if (commit.commit.parent[0] === commit.commit.parent[1]) {
              isFirstOperation = true;
            } else {
              if (newOperationBranchHead !== undefined) {
                newBranchHead = commit.commit.parent[1];
                break;
              }
            }
          }
        }

        if (newOperationBranchHead === undefined) {
          throw new Error(
            `Cant rollback to ${requestedOperationBranchHead} couldn't find newOperationBranchHead ${newOperationBranchHead}`
          );
        }

        if (newBranchHead === undefined) {
          throw new Error(
            `Cant rollback to ${requestedOperationBranchHead} couldn't find newBranchHead ${newBranchHead}`
          );
        }

        await git.writeRef({
          fs: gitStorageFs,
          dir: gitRoot,
          ref: 'refs/heads/' + operationBranchName,
          value: newOperationBranchHead,
          force: true,
        });

        await git.writeRef({
          fs: gitStorageFs,
          dir: gitRoot,
          ref: 'refs/heads/' + pathParams.branchName,
          value: newBranchHead,
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
