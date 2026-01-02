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

export const gitBranchOperationVirtualFile: VirtualFileDefinition = {
  type: 'gitBranchOperationVirtualFile',
  rootType: 'file',

  getStats: async args => {
    const { gitRoot, nodeFs, pathParams } = args;

    if (pathParams.branchName === undefined) {
      pathParams.branchName = await getCurrentBranch(gitRoot, nodeFs);
    }

    let headCommit = await tryResolveRef(
      nodeFs,
      gitRoot,
      pathParams.branchName
    );
    if (!headCommit) {
      throw new Error(
        `Base Branch ${pathParams.branchName} for operations does not exis`
      );
    }

    let operationBranchName = await resolveOperationBranchName(
      nodeFs,
      gitRoot,
      pathParams.branchName
    );

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
          // if the operation branch does not exists - fall back to the branch and zero size
        }
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
      // Modify the stats object to represent a file instead of a directory
      return {
        mode: 0o644,
        size: 40, // sha length
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

    let operationBranchName = await resolveOperationBranchName(
      nodeFs,
      gitRoot,
      pathParams.branchName
    );

    let headCommit: string | undefined = undefined;
    let hasOperations = false;

    if (operationBranchName) {
      headCommit = await tryResolveRef(nodeFs, gitRoot, operationBranchName);
      hasOperations = true;

      if (!headCommit) {
        throw new Error(
          `Base Branch ${operationBranchName} for operations does not exis`
        );
      }
    } else {
      headCommit = await tryResolveRef(nodeFs, gitRoot, pathParams.branchName);
      if (!headCommit) {
        throw new Error(
          `Base Branch ${pathParams.branchName} for operations does not exis`
        );
      }
    }

    return {
      type: 'file',
      content: Buffer.from(headCommit),
      mode: 0o644,
      size: headCommit.length,
    };
  },

  writeFile: async ({
    filePath,
    gitRoot,
    nodeFs,
    content,
    cacheFs,
    pathParams,
    author,
  }) => {
    // Parse the path to get branch name and file path
    if (pathParams.branchName === undefined) {
      pathParams.branchName = await getCurrentBranch(gitRoot, nodeFs);
    }

    // Convert content to Uint8Array for isomorphic-git
    let blob: Uint8Array;
    if (typeof content === 'string') {
      blob = new TextEncoder().encode(content);
    } else {
      blob = new Uint8Array(content);
    }

    // Step 1: Create the OID of the content hash
    const newOid = await git.writeBlob({
      fs: nodeFs,
      dir: gitRoot,
      blob: blob,
    });

    // Step 2: Get the current branch commit
    let branchCommit = await tryResolveRef(
      nodeFs,
      gitRoot,
      pathParams.branchName
    );

    if (!branchCommit) {
      throw new Error("Invalid branch file path - branch doesn't exist");
    }

    // Step 3: check if operation branch exists
    let operationBranchName = await resolveOperationBranchName(
      nodeFs,
      gitRoot,
      pathParams.branchName
    );

    let firstOperation = false;

    if (!operationBranchName) {
      operationBranchName =
        'legit/__' + pathParams.branchName + operationBranchNamePostfix;
      // Create branch if it doesn't exist
      await git.branch({
        fs: nodeFs,
        dir: gitRoot,
        ref: operationBranchName,
        object: branchCommit,
      });

      firstOperation = true;
    }

    const operationBranchCommit = await git.resolveRef({
      fs: nodeFs,
      dir: gitRoot,
      ref: `refs/heads/${operationBranchName}`,
    });
    // read tree also accepts a git commit - it will resolve the tree within the commit
    const currentTree = await git.readTree({
      fs: nodeFs,
      dir: gitRoot,
      oid: branchCommit,
    });

    // Step 5: Create an opertaion commit
    // If content is ArrayBuffer, encode it as string for commit message
    let commitMessage: string;
    if (content instanceof ArrayBuffer) {
      commitMessage = Buffer.from(content).toString('utf-8');
    } else if (typeof content === 'string') {
      commitMessage = content;
    } else if (content instanceof Uint8Array) {
      commitMessage = Buffer.from(content).toString('utf-8');
    } else {
      commitMessage = String(content);
    }

    let branchUnchanged = false;

    if (!firstOperation) {
      const mergeBase = await git.findMergeBase({
        fs: nodeFs,
        dir: gitRoot,
        oids: branchUnchanged
          ? [operationBranchCommit]
          : [operationBranchCommit, branchCommit],
      });

      if (mergeBase.length === 1 && mergeBase[0] === branchCommit) {
        branchUnchanged = true;
      }
    }

    const newCommitOid = await git.commit({
      fs: nodeFs,
      dir: gitRoot,
      message: commitMessage,
      tree: currentTree.oid,
      noUpdateBranch: true,
      author,
      // TODO only reference the branch commit if the commit has changed since last operation commit referencing the branch commit
      parent: branchUnchanged
        ? firstOperation
          ? [branchCommit, branchCommit]
          : [operationBranchCommit]
        : [operationBranchCommit, branchCommit],
    });

    // Update the branch reference
    await git.writeRef({
      fs: nodeFs,
      dir: gitRoot,
      ref: `refs/heads/${operationBranchName}`,
      value: newCommitOid,
      force: true,
    });

    // try {
    //   await cacheFs.promises.unlink(filePath);
    // } catch (e) {
    //   // ignore cache errors
    // }
  },

  rename: async function ({
    filePath,
    newPath,
    gitRoot,
    nodeFs,
    pathParams,
    newPathParams,
  }): Promise<void> {
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
