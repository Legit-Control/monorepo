import git from 'isomorphic-git';
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

import { encodeName, decodeName } from './nameEncoding.js';

export const getThreadName: VirtualFileDefinition = {
  type: 'getThreadName',

  getStats: async args => {
    const { gitRoot, nodeFs, pathParams } = args;

    let headCommit: string;

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

    let operationBranchName = await resolveOperationBranchName(
      nodeFs,
      gitRoot,
      pathParams.branchName
    );

    let operationName: string | undefined = undefined;
    if (operationBranchName) {
      const prefix = 'legit/';
      const postfix = `__${pathParams.branchName}-operation`;
      if (
        operationBranchName.startsWith(prefix) &&
        operationBranchName.endsWith(postfix)
      ) {
        operationName = operationBranchName.slice(
          prefix.length,
          operationBranchName.length - postfix.length
        );
      } else {
        operationName = operationBranchName;
      }

      return {
        type: 'file',
        content: Buffer.from(decodeName(operationName)),
        mode: 0o644,
        size: operationName.length,
      };
    }

    return {
      type: 'file',
      content: Buffer.from(''),
      mode: 0o644,
      size: 0,
    };
  },

  writeFile: async ({
    filePath,
    gitRoot,
    nodeFs,
    content,
    cacheFs,
    pathParams,
  }) => {
    // Parse the path to get branch name and file path
    if (pathParams.branchName === undefined) {
      throw new Error('branchName should be in pathParams');
    }

    let operationBranchName = await resolveOperationBranchName(
      nodeFs,
      gitRoot,
      pathParams.branchName
    );

    if (operationBranchName) {
      // Convert buffer to string and trim whitespace

      const newOperationBranchName = `legit/${encodeName(content.toString())}__${pathParams.branchName}-operation`;
      await git.renameBranch({
        fs: nodeFs,
        dir: gitRoot,
        oldref: operationBranchName,
        ref: newOperationBranchName,
      });
      operationBranchName = newOperationBranchName;
    }

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
