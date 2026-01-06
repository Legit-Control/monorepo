import git from '@legit-sdk/isomorphic-git';
import {
  tryResolveRef,
  resolveGitObjAtPath,
  buildUpdatedTree,
} from '../utils.js';
import { VirtualFileArgs, VirtualFileDefinition } from '../gitVirtualFiles.js';

import { ENOENTError } from '../../../../errors/ENOENTError.js';
import * as nodeFs from 'node:fs';
import { CompositeFs } from '../../../../CompositeFs.js';
import {
  resolveOperationBranchName,
  operationBranchNamePostfix,
} from './resolveOperationBranchName.js';
import { getCurrentBranch } from '../getCurrentBranch.js';
import { CompositeSubFsAdapter } from '../../../CompositeSubFsAdapter.js';

export type Operation = {
  oid: string;
  parentOids: string[];
  message: string;
  originBranchOid?: string;
};

function folderStats(
  size: number,
  aTimeMs: number,
  mTimeMs: number,
  cTimeMs: number,
  birthtimeMs: number
) {
  return {
    mode: 0o644,
    size: size,
    atimeMs: aTimeMs,
    mtimeMs: mTimeMs,
    ctimeMs: cTimeMs,
    birthtimeMs: birthtimeMs,
    atime: new Date(aTimeMs),
    mtime: new Date(mTimeMs),
    ctime: new Date(cTimeMs),
    birthtime: new Date(birthtimeMs), // hardcoded to epoch as Date object
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
    blocks: 0,
  };
}

// .legit/branches/[branch-name]/[[...filepath]] -> file or folder at path in branch

/**
 * Creates a CompositeSubFsAdapter for branch operations history
 *
 * This adapter handles reading the history of branch operations.
 *
 * @example
 * ```ts
 * const adapter = createBranchOperationsAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 * ```
 */
export function createBranchOperationsAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const handler: CompositeSubFsAdapter['handler'] = {
    type: 'gitBranchOperationsVirtualFile',
    rootType: 'file',

    getStats: async args => {
      const { gitRoot, nodeFs, pathParams } = args;

      if (pathParams.branchName === undefined) {
        pathParams.branchName = await getCurrentBranch(gitRoot, nodeFs);
      }

      let operationBranchName = await resolveOperationBranchName(
        nodeFs,
        gitRoot,
        pathParams.branchName
      );

      let headCommit: string;
      let hasOperations = false;

      if (operationBranchName) {
        try {
          headCommit = await git.resolveRef({
            fs: nodeFs,
            dir: gitRoot,
            ref: operationBranchName,
          });
          hasOperations = true;
        } catch {
          try {
            headCommit = await git.resolveRef({
              fs: nodeFs,
              dir: gitRoot,
              ref: `refs/heads/${operationBranchName}`,
            });
            hasOperations = true;
          } catch {
            throw new Error(
              `Base Branch ${pathParams.branchName} for operations does not exis`
            );
          }
        }
      } else {
        try {
          headCommit = await git.resolveRef({
            fs: nodeFs,
            dir: gitRoot,
            ref: `refs/heads/${pathParams.branchName}`,
          });
        } catch {
          throw new Error(
            `Base Branch ${pathParams.branchName} for operations does not exis`
          );
        }
      }

      const commit = await git.readCommit({
        fs: nodeFs,
        dir: gitRoot,
        oid: headCommit,
      });
      const { commit: commitObj } = commit;
      const commitTimeMs = commitObj.committer.timestamp * 1000;

      try {
        const file = hasOperations
          ? await adapter.handler.getFile(args)
          : undefined;
        const size = file?.content?.length ?? 0;
        // Modify the stats object to represent a file instead of a directory
        return {
          mode: 0o644,
          size: size,
          atimeMs: commitTimeMs,
          mtimeMs: commitTimeMs,
          ctimeMs: commitTimeMs,
          birthtimeMs: commitTimeMs,
          atime: new Date(commitTimeMs),
          mtime: new Date(commitTimeMs),
          ctime: new Date(commitTimeMs),
          birthtime: new Date(commitTimeMs), // hardcoded to epoch as Date object
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
          blocks: 0,
        };
      } catch (err) {
        // If .git does not exist, propagate as ENOENT
        throw new Error(
          `ENOENT: no such file or directory, stat operationHistory`
        );
      }
    },

    getFile: async args => {
      const { gitRoot, nodeFs, pathParams } = args;

      if (pathParams.branchName === undefined) {
        pathParams.branchName = await getCurrentBranch(gitRoot, nodeFs);
      }

      // Read all commits from the operation branch and collect their messages
      let operationBranchName = await resolveOperationBranchName(
        nodeFs,
        gitRoot,
        pathParams.branchName
      );

      let operations: Operation[] = [];

      if (operationBranchName) {
        // Resolve the operation branch ref
        const operationBranchRef = await git.resolveRef({
          fs: nodeFs,
          dir: gitRoot,
          ref: `refs/heads/${operationBranchName}`,
        });

        let isFirstOperation = false;

        // Walk through the commits in the operation branch
        let oid: string | null = operationBranchRef;
        while (oid && !isFirstOperation) {
          const commit = await git.readCommit({
            fs: nodeFs,
            dir: gitRoot,
            oid,
          });
          operations.push({
            oid: commit.oid,
            parentOids: commit.commit.parent,
            message: commit.commit.message,
            originBranchOid: 'unset',
          });

          // Get parent commit (first parent)
          oid =
            commit.commit.parent && commit.commit.parent.length > 0
              ? commit.commit.parent[0]!
              : null;

          if (
            commit.commit.parent.length === 2 &&
            commit.commit.parent[0] === commit.commit.parent[1]
          ) {
            isFirstOperation = true;
          }
        }
      }

      let currentOringinBranchState: string | undefined = undefined;

      for (let i = operations.length - 1; i >= 0; i--) {
        const op = operations[i]!;
        if (currentOringinBranchState === undefined) {
          // we expect the first opration to have two parents
          if (
            op.parentOids.length !== 2 &&
            op.parentOids[0] !== op.parentOids[1]
          ) {
            throw new Error(
              `Operation commit ${op.oid} does not have two parents as expected`
            );
          }
          currentOringinBranchState = op.parentOids[1];
        }

        if (op.parentOids.length === 2) {
          currentOringinBranchState = op.parentOids[1];
        }

        op.originBranchOid = currentOringinBranchState;
      }

      const content = Buffer.from(JSON.stringify(operations, null, 2), 'utf-8');

      return {
        type: 'file',
        content,
        mode: 0o644,
        size: content.length,
      };
    },

    rename: async function (args): Promise<void> {
      throw new Error('not implemented');
    },

    mkdir: async function (args): Promise<void> {
      throw new Error('not implemented');
    },
  };
  const adapter = new CompositeSubFsAdapter({
    name: 'branch-operations',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: handler,
  });

  return adapter;
}
