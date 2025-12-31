import git from '@legit-sdk/isomorphic-git';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import * as nodeFs from 'node:fs';
import { PathLike } from 'node:fs';
import { getCurrentBranch } from './getCurrentBranch.js';
import { tryResolveRef } from './utils.js';

// .legit/branches -> list of branches

export const gitBranchHistory: VirtualFileDefinition = {
  type: 'gitBranchHistory',
  rootType: 'file',

  getStats: async ({ gitRoot, nodeFs, pathParams }) => {
    if (pathParams.branchName === undefined) {
      pathParams.branchName = await getCurrentBranch(gitRoot, nodeFs);
    }

    let headCommit = await tryResolveRef(
      nodeFs,
      gitRoot,
      pathParams.branchName
    );

    if (!headCommit) {
      throw new Error(`Branch ${pathParams.branchName} does not exist`);
    }

    const commit = await git.readCommit({
      fs: nodeFs,
      dir: gitRoot,
      oid: headCommit,
    });
    const { commit: commitObj } = commit;
    const commitTimeMs = commitObj.committer.timestamp * 1000;

    // TODO use the head information of the commit
    return {
      mode: 0o644,
      size: 100000,
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
    const { gitRoot, nodeFs, pathParams } = args;

    // Read all commits from the operation branch and collect their messages
    let branchName = pathParams.branchName;

    if (branchName === undefined) {
      branchName = await getCurrentBranch(gitRoot, nodeFs);
    }

    const commits: any[] = [];
    if (branchName) {
      // Resolve the operation branch ref
      const operationBranchRef = await tryResolveRef(
        nodeFs,
        gitRoot,
        branchName
      );
      let isFirstOperation = false;

      // Walk through the commits in the operation branch
      let oid: string | undefined = operationBranchRef;
      while (oid && !isFirstOperation) {
        const commit = await git.readCommit({ fs: nodeFs, dir: gitRoot, oid });
        commits.push({
          oid: commit.oid,
          ...commit.commit,
        });

        // Get parent commit (first parent)
        oid = commit.commit.parent[0];
      }
    }

    const content = Buffer.from(JSON.stringify(commits, null, 2), 'utf-8');

    return {
      type: 'file',
      content,
      mode: 0o644,
      size: content.length,
    };
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
};
