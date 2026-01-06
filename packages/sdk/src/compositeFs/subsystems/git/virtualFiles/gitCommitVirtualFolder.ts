import git from '@legit-sdk/isomorphic-git';

import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';
import * as nodeFs from 'node:fs';
import { toDirEntry } from './utils.js';
import { CompositeSubFsAdapter } from '../../CompositeSubFsAdapter.js';

/**
 * Creates a CompositeSubFsAdapter for commit virtual folder operations
 *
 * This adapter handles browsing git commits organized by their SHA hashes.
 *
 * @example
 * ```ts
 * const adapter = createCommitFolderAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 * ```
 */
export function createCommitFolderAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const adapter = new CompositeSubFsAdapter({
    name: 'commit-folder',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'gitCommitVirtualFolder',
      rootType: 'folder',

  getStats: async args => {
    // TODO use the commit where the file was changed last as base
    const gitDir = args.gitRoot + '/' + '.git';
    try {
      const gitStats = await args.nodeFs.promises.stat(gitDir);
      return gitStats;
    } catch (err) {
      // If .git does not exist, propagate as ENOENT
      throw new Error(`ENOENT: no such file or directory, stat '${gitDir}'`);
    }
  },
  getFile: async ({ filePath, gitRoot, nodeFs, pathParams }) => {
    const branchNames = await git.listBranches({ fs: nodeFs, dir: gitRoot });
    const headCommits = new Set<string>();
    const commits = new Set<string>();

    for (const branch of branchNames) {
      const ref = `refs/heads/${branch}`;
      try {
        const commitOid = await git.resolveRef({
          fs: nodeFs,
          dir: gitRoot,
          ref,
        });
        headCommits.add(commitOid);
      } catch (err) {
        // skip branches that can't be resolved
      }
    }

    for (const headCommit of headCommits) {
      const commitsFromHead = await git.log({
        fs: nodeFs,
        dir: gitRoot,
        ref: headCommit,
      });
      for (const commit of commitsFromHead) {
        commits.add(commit.oid);
      }
    }

    if (!pathParams.sha_1_1_2) {
      const fistTwo = new Set<string>();
      for (const commit of commits) {
        fistTwo.add(commit.slice(0, 2));
        if (fistTwo.size >= 256) {
          break;
        }
      }
      const content = Array.from(fistTwo)
        .sort()
        .map(sha =>
          toDirEntry({
            parent: filePath,
            name: sha,
            isDir: true,
          })
        );
      return {
        type: 'directory',
        content,
        mode: 0o755,
        size: content,
      };
    }

    const lastThrityEight = new Set<string>();
    for (const commit of commits) {
      if (commit.startsWith(pathParams.sha_1_1_2)) {
        lastThrityEight.add(commit.slice(2, 40));
      }
    }
    const content = Array.from(lastThrityEight)
      .sort()
      .map(sha =>
        toDirEntry({
          parent: filePath,
          name: sha,
          isDir: true,
        })
      );
    return {
      type: 'directory',
      content,
      mode: 0o755,
      size: content.length,
    };
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
