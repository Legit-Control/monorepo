import git from '@legit-sdk/isomorphic-git';

import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';
import * as nodeFs from 'node:fs';
import { resolveGitObjAtPath, resolveGitObjAtPathFromArgs } from './utils.js';
import { ENOENTError } from '../../../errors/ENOENTError.js';
import { CompositeSubFsAdapter } from '../../CompositeSubFsAdapter.js';

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
 * Creates a CompositeSubFsAdapter for commit file operations
 *
 * This adapter handles reading files from specific commits in git history.
 *
 * @example
 * ```ts
 * const adapter = createCommitFileAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 * ```
 */
export function createCommitFileAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const adapter = new CompositeSubFsAdapter({
    name: 'commit-file',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'gitCommitFileVirtualFile',
      rootType: 'file',

  getStats: async ({ filePath, gitRoot, nodeFs, pathParams, userSpaceFs }) => {
    if (!pathParams.sha_1_1_2) {
      throw new Error('sha_1_1_2 should be in pathParams');
    }

    if (!pathParams.sha1_3__40) {
      throw new Error('sha1_3__40 should be in pathParams');
    }

    const commitSha = pathParams.sha_1_1_2 + pathParams.sha1_3__40;

    const fileOrFolder = await resolveGitObjAtPath({
      filePath,
      gitRoot,
      nodeFs,
      commitSha,
      pathParams,
      gitCache: getGitCacheFromFs(userSpaceFs),
    });

    if (!fileOrFolder) {
      throw new ENOENTError(
        `ENOENT: no such file or directory, stat '${filePath}'`,
        filePath
      );
    }

    const commit = await git.readCommit({
      fs: nodeFs,
      dir: gitRoot,
      oid: commitSha,
    });
    const { commit: commitObj } = commit;
    const commitTimeMs = commitObj.committer.timestamp * 1000;

    if (fileOrFolder.type === 'tree') {
      return {
        mode: 0o644,
        size: 0, // start with no time,
        isFile: () => true,
        isDirectory: () => true,
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
        atimeMs: commitTimeMs,
        mtimeMs: commitTimeMs,
        ctimeMs: commitTimeMs,
        birthtimeMs: commitTimeMs,
        atime: new Date(commitTimeMs),
        mtime: new Date(commitTimeMs),
        ctime: new Date(commitTimeMs),
        birthtime: new Date(commitTimeMs),
      } as any;
    } else {
      // NOTE we could extract the size by only reading the header from loose object https://github.com/isomorphic-git/isomorphic-git/blob/main/src/models/GitObject.js#L15
      // or the length from pack file https://git-scm.com/docs/pack-format
      const { blob } = await git.readBlob({
        fs: nodeFs,
        dir: gitRoot,
        oid: fileOrFolder.oid,
      });

      return {
        mode: 0o644,
        size: blob.length,
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
        blocks: Math.ceil(blob.length / 4096),
        atimeMs: commitTimeMs,
        mtimeMs: commitTimeMs,
        ctimeMs: commitTimeMs,
        birthtimeMs: commitTimeMs,
        atime: new Date(commitTimeMs),
        mtime: new Date(commitTimeMs),
        ctime: new Date(commitTimeMs),
        birthtime: new Date(commitTimeMs),
      } as any;
    }
  },
  getFile: async ({ filePath, gitRoot, nodeFs, pathParams, userSpaceFs }) => {
    if (!pathParams.sha_1_1_2) {
      throw new Error('sha_1_1_2 should be in pathParams');
    }

    if (!pathParams.sha1_3__40) {
      throw new Error('sha1_3__40 should be in pathParams');
    }

    const commitSha = pathParams.sha_1_1_2 + pathParams.sha1_3__40;

    try {
      const fileOrFolder = await resolveGitObjAtPath({
        filePath,
        gitRoot,
        nodeFs,
        commitSha: commitSha,
        pathParams,
        gitCache: getGitCacheFromFs(userSpaceFs),
      });
      if (!fileOrFolder) {
        return undefined;
      }

      if (fileOrFolder.type === 'blob') {
        const { blob } = await git.readBlob({
          fs: nodeFs,
          dir: gitRoot,
          oid: fileOrFolder.oid,
          cache: getGitCacheFromFs(userSpaceFs),
        });

        return {
          type: 'file',
          content: Buffer.from(blob),
          mode: 0o644,
          size: blob.length,
          oid: fileOrFolder.oid,
        };
      } else {
        const allEntries = Array.from(
          new Set([...fileOrFolder.entries.filter(v => v.name !== '.keep')])
        );
        return {
          type: 'directory',
          content: allEntries.map(entry => ({
            ...entry,
            name: entry.name.toString(),
            path: `${filePath}`,
            parentPath: `${filePath}`,
          })),
          mode: 0o755,
        };
        // tree..
        // return {
        //   type: 'directory',
        //   content: fileOrFolder.entries.filter(v => v !== '.keep'),
        //   mode: 0o755,
        // };
      }
    } catch (error) {
      return undefined;
    }
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
