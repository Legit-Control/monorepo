import git from '@legit-sdk/isomorphic-git';
import {
  tryResolveRef,
  resolveGitObjAtPath,
  buildUpdatedTree,
  buildUpdatedTreeFromArgs,
} from './utils.js';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import { ENOENTError } from '../../../errors/ENOENTError.js';
import * as nodeFs from 'node:fs';
import { CompositeFs } from '../../../CompositeFs.js';
import { getCurrentBranch } from './getCurrentBranch.js';
import Dirent from  '@jsonjoy.com/fs-node-utils/lib/types/options.js';
import { IDirent } from '@jsonjoy.com/fs-node-utils';
import { decodeBranchNameFromVfs } from './operations/nameEncoding.js';
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
 * # How to present an empyt folder in git
 *
 * Git doesnt allow empty folders - so we need to create a placeholder file to keep the folder alive.
 *
 * ## Make dir
 *
 * folderA/
 * └── myfile.txt
 *
 * mkdir('folderA/folderB')
 *
 * folderA/
 * └── myfile.txt
 * └── folderB/ <- empty folder, would be deleted by git
 *
 * We use a `.keep` file for that - when creating a folder we create a `.keep` file inside it.
 *
 * When deleting a folder we delete the `.keep` file inside it.
 *
 * Some problematic cases with that:
 *
 * ## Deletion of folder
 *
 * folderA/
 * └── folderB/
 *     └── .keep
 *
 * delete('rfolderA/folderB')
 *
 * folderA/ <- empty folder, leadd to deletion of folderA as well
 *
 * ## Removal of last file in folder
 *
 *
 * folderA/
 * └── folderB/
 *     └── myfile.txt
 *
 * Two szenarios exists: deletion and move
 *
 * delete('folderA/folderB/myfile.txt')
 *
 * folderA/ <- empty folder, leadd to deletion of folderA as well
 * └── folderB/  <- empty folder, leadd to deletion of folderB as well
 *
 * move('folderA/folderB/myfile.txt', 'folderA/myfile.txt')
 *
 * folderA/ <- empty folder, leadd to deletion of folderA as well
 * └── folderB/  <- empty folder, leadd to deletion of folderB as well
 * └── myfile.txt
 *
 * The simplest solution for this would be to create .keep file in every folder and deletion of a folder would mean empty the directory.
 *
 * folderA/
 * └── .keep
 * └── folderB/
 *     └── .keep
 *
 * This would solve the deletion issue - but this won't work with existing repos not fulfilling this precondition.
 *
 *
 *
 *
 *
 * Another szenario is a file that gets moved from one folder to another
 *
 * Lets say we have the following folder structucture:
 *
 * folderA/
 * └── folderB/
 *     └── myfile.txt
 *
 * if we do mv('folderA/folderB/myfile.txt', 'folderA/myfile.txt') - the folderB would be deleted as well as the .keep file inside it.
 *
 *
 *
 *  -
 * Creates a CompositeSubFsAdapter for branch file operations
 *
 * This adapter handles the .legit/branches/[branch-name]/[[...filepath]] routes,
 * which represent files or folders at paths in a git branch.
 *
 * @example
 * ```ts
 * const adapter = createBranchFileAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 *
 * // Use in CompositeFs routes
 * const compositeFs = new CompositeFs({
 *   routes: {
 *     '.legit': {
 *       branches: adapter,
 *     },
 *   },
 * });
 * ```
 */
export function createBranchFileAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}: {
  gitStorageFs: any;
  gitRoot: string;
  rootPath?: string;
}): CompositeSubFsAdapter {
  const adapter = new CompositeSubFsAdapter({
    name: 'branch-file',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'gitBranchFileVirtualFile',
      rootType: 'folder',

      getStats: async args => {
        const { filePath, pathParams, userSpaceFs } = args;
        if (pathParams.branchName === undefined) {
          pathParams.branchName = await getCurrentBranch(gitRoot, gitStorageFs);
        }

        // read the stats from the current file
        let branchCommit = await tryResolveRef(
          gitStorageFs,
          gitRoot,
          pathParams.branchName
        );

        if (!branchCommit) {
          // Custom error class for ENOENT

          throw new ENOENTError(
            `ENOENT: no such file or directory, stat '${filePath}'`,
            filePath
          );
        }

        const fileOrFolder = await resolveGitObjAtPath({
          filePath,
          gitRoot,

          nodeFs: gitStorageFs,
          commitSha: branchCommit,
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
          fs: gitStorageFs,
          dir: gitRoot,
          oid: branchCommit,
        });
        const { commit: commitObj } = commit;

        const lastCommitForPath = await git.log({
          fs: gitStorageFs,
          dir: gitRoot,
          ref: branchCommit,
          filepath: pathParams.filePath,
          depth: 1,
        });

        const commitTimeMs = commitObj.committer.timestamp * 1000;

        const pathCommitTimeMs =
          lastCommitForPath.length > 0
            ? lastCommitForPath[0]!.commit.committer.timestamp * 1000
            : commitTimeMs;

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
            atimeMs: pathCommitTimeMs,
            mtimeMs: pathCommitTimeMs,
            ctimeMs: pathCommitTimeMs,
            birthtimeMs: commitTimeMs,
            atime: new Date(pathCommitTimeMs),
            mtime: new Date(pathCommitTimeMs),
            ctime: new Date(pathCommitTimeMs),
            birthtime: new Date(pathCommitTimeMs),
          } as any;
        } else {
          // NOTE we could extract the size by only reading the header from loose object https://github.com/isomorphic-git/isomorphic-git/blob/main/src/models/GitObject.js#L15
          // or the length from pack file https://git-scm.com/docs/pack-format
          const { blob } = await git.readBlob({
            fs: gitStorageFs,
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
            atimeMs: pathCommitTimeMs,
            mtimeMs: pathCommitTimeMs,
            ctimeMs: pathCommitTimeMs,
            birthtimeMs: pathCommitTimeMs,
            atime: new Date(pathCommitTimeMs),
            mtime: new Date(pathCommitTimeMs),
            ctime: new Date(pathCommitTimeMs),
            birthtime: new Date(pathCommitTimeMs),
          } as any;
        }
      },
      getFile: async args => {
        const { filePath, cacheFs, pathParams, userSpaceFs } = args;
        if (pathParams.branchName === undefined) {
          pathParams.branchName = await getCurrentBranch(gitRoot, gitStorageFs);
        }

        try {
          let branchCommit = await tryResolveRef(
            gitStorageFs,
            gitRoot,
            pathParams.branchName
          );

          if (!branchCommit) {
            // Get the current branch/HEAD to use as base for new branch
            const currentHead = await git.resolveRef({
              fs: gitStorageFs,
              dir: gitRoot,
              ref: 'HEAD',
            });

            await git.branch({
              fs: gitStorageFs,
              dir: gitRoot,
              ref: pathParams.branchName,
              object: currentHead,
            });

            branchCommit = await tryResolveRef(
              gitStorageFs,
              gitRoot,
              pathParams.branchName
            );

            if (!branchCommit) {
              throw new Error('Could not create branch for getFile');
            }
          }
          const fileOrFolder = await resolveGitObjAtPath({
            filePath,
            gitRoot,

            nodeFs: gitStorageFs,
            commitSha: branchCommit,
            pathParams,
            gitCache: getGitCacheFromFs(userSpaceFs),
          });

          if (!fileOrFolder) {
            return undefined;
          }

          if (fileOrFolder.type === 'blob') {
            const { blob } = await git.readBlob({
              fs: gitStorageFs,
              dir: gitRoot,
              oid: fileOrFolder.oid,
            });

            return {
              type: 'file',
              content: Buffer.from(blob),
              mode: 0o644,
              size: blob.length,
              oid: fileOrFolder.oid,
            };
          } else {
            const cacheEntries: IDirent[] = [];
            try {
              const stat = await cacheFs.promises.stat(filePath);
              if (stat && stat.isDirectory()) {
                const cached = (await cacheFs.promises.readdir(filePath, {
                  withFileTypes: true,
                })) as IDirent[];
                cacheEntries.push(...(cached as IDirent[]));
              }
            } catch (e) {
              // ignore cache errors
            }
            const allEntries = Array.from(
              new Set([...cacheEntries, ...fileOrFolder.entries])
            ) as (IDirent & { parent: string; path: string })[];
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

      // TODO move to vfile
      unlink: async args => {
        const { pathParams, author } = args;
        if (pathParams.branchName === undefined) {
          pathParams.branchName = await getCurrentBranch(gitRoot, gitStorageFs);
        }

        if (!pathParams.filePath) {
          throw new Error('filePath should be in pathParams');
        }
        // Get current branch commit
        const branchCommit = await tryResolveRef(
          gitStorageFs,
          gitRoot,
          pathParams.branchName
        );
        if (!branchCommit) {
          throw new Error('Invalid branch file path - branch must exist');
        }
        // Read current tree
        const currentTree = await git.readTree({
          fs: gitStorageFs,
          dir: gitRoot,
          oid: branchCommit,
        });

        // Build new tree without the file
        const newTreeOid = await buildUpdatedTree({
          dir: gitRoot,
          fs: gitStorageFs,
          treeOid: currentTree.oid,
          deletePathParts: pathParams.filePath.split('/'),
          addPathParts: undefined,
          addObj: undefined,
          deleteKeepIfNotEmpty: false,
          addKeepIfEmpty: true,
          keepFilename: '.keep',
        });

        // Create commit if tree changed
        if (newTreeOid !== currentTree.oid) {
          const newCommitOid = await git.commit({
            fs: gitStorageFs,
            dir: gitRoot,
            message: `Delete ${pathParams.filePath}`,
            tree: newTreeOid,
            noUpdateBranch: true,
            parent: [branchCommit],
            author,
          });

          // Update branch reference
          await git.writeRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: `refs/heads/${decodeBranchNameFromVfs(pathParams.branchName)}`,
            value: newCommitOid,
            force: true,
          });
        }
      },

      writeFile: async args => {
        const { filePath, content, cacheFs, pathParams, author } = args;
        // Parse the path to get branch name and file path
        if (pathParams.branchName === undefined) {
          pathParams.branchName = await getCurrentBranch(gitRoot, gitStorageFs);
        }

        if (pathParams.filePath === undefined) {
          throw new Error('filePath should be in pathParams');
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
          fs: gitStorageFs,
          dir: gitRoot,
          blob: blob,
        });

        // Step 2: Get the current branch commit
        let branchCommit = await tryResolveRef(
          gitStorageFs,
          gitRoot,
          pathParams.branchName
        );

        if (!branchCommit) {
          // Get the current branch/HEAD to use as base for new branch
          const currentHead = await git.resolveRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: 'HEAD',
          });

          // Create branch if it doesn't exist
          await git.branch({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: decodeBranchNameFromVfs(pathParams.branchName),
            object: currentHead,
          });
          branchCommit = await tryResolveRef(
            gitStorageFs,
            gitRoot,
            pathParams.branchName
          );
          if (!branchCommit) {
            throw new Error('Could not create branch for writeFile');
          }
        }

        // read tree also accepts a git commit - it will resolve the tree within the commit
        const currentTree = await git.readTree({
          fs: gitStorageFs,
          dir: gitRoot,
          oid: branchCommit,
        });

        const newTreeOid = await buildUpdatedTree({
          dir: gitRoot,
          fs: gitStorageFs,
          treeOid: currentTree.oid,
          deletePathParts: undefined,
          addPathParts: pathParams.filePath.split('/'),
          addObj: { type: 'blob', oid: newOid },
          deleteKeepIfNotEmpty: true,
          addKeepIfEmpty: false,
          keepFilename: '.keep',
        });

        if (newTreeOid !== currentTree.oid) {
          // Step 5: Create a new commit
          const newCommitOid = await git.commit({
            fs: gitStorageFs,
            dir: gitRoot,
            message: `💾 Change '${pathParams.filePath}'`,
            tree: newTreeOid,
            noUpdateBranch: true,
            parent: [branchCommit],
            author,
          });

          // Update the branch reference
          await git.writeRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: `refs/heads/${decodeBranchNameFromVfs(pathParams.branchName)}`,
            value: newCommitOid,
            force: true,
          });

          const newBranchCommit = await tryResolveRef(
            gitStorageFs,
            gitRoot,
            pathParams.branchName
          );

          if (newCommitOid !== newBranchCommit) {
            throw new Error('Failed to update branch after file deletion');
          }
        }

        // try {
        //   await cacheFs.promises.unlink(filePath);
        // } catch (e) {
        //   // ignore cache errors
        // }
      },

      rename: async function (args): Promise<void> {
        const {
          filePath,
          newPath,
          pathParams,
          newPathParams,
          author,
          userSpaceFs,
        } = args;
        // Parse the path to get branch name and file path

        if (pathParams.branchName === undefined) {
          pathParams.branchName = await getCurrentBranch(gitRoot, gitStorageFs);
        }
        if (pathParams.filePath === undefined) {
          throw new Error('filePath should be in pathParams');
        }

        if (newPathParams.branchName === undefined) {
          newPathParams.branchName = await getCurrentBranch(
            gitRoot,
            gitStorageFs
          );
        }

        if (newPathParams.filePath === undefined) {
          throw new Error('filePath should be in newPathParams');
        }

        // Step 2: Get the current branch commit
        const oldBranchCommit = await tryResolveRef(
          gitStorageFs,
          gitRoot,
          pathParams.branchName
        );

        if (!oldBranchCommit) {
          throw new Error(
            'Invalid branch file path - source branch must exist'
          );
        }

        let currentBranchCommit = await tryResolveRef(
          gitStorageFs,
          gitRoot,
          newPathParams.branchName
        );

        if (!currentBranchCommit) {
          // Get the current branch/HEAD to use as base for new branch
          const currentHead = await git.resolveRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: 'HEAD',
          });

          // Create branch if it doesn't exist
          await git.branch({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: decodeBranchNameFromVfs(newPathParams.branchName),
            object: currentHead,
          });
          currentBranchCommit = await tryResolveRef(
            gitStorageFs,
            gitRoot,
            newPathParams.branchName
          );

          if (currentBranchCommit === undefined) {
            throw new Error('Could not create branch for rename operation');
          }
        }

        if (newPathParams.branchName !== pathParams.branchName) {
          throw new Error('cross branch move not implemented yet');
        }

        const existingAtOldPath = await resolveGitObjAtPath({
          gitRoot: gitRoot,

          nodeFs: gitStorageFs,
          commitSha: oldBranchCommit,
          filePath: filePath,
          pathParams: pathParams,
          gitCache: getGitCacheFromFs(userSpaceFs),
        });

        if (existingAtOldPath === undefined) {
          throw new Error('no obj at path exists');
        }

        const newTreeOid = await buildUpdatedTree({
          dir: gitRoot,
          fs: gitStorageFs,
          deletePathParts: pathParams.filePath.split('/'),
          addPathParts: newPathParams.filePath.split('/'),
          addObj:
            existingAtOldPath.type === 'blob'
              ? { type: 'blob', oid: existingAtOldPath.oid }
              : {
                  type: 'tree',
                  oid: existingAtOldPath.oid,
                  entries: existingAtOldPath.entries.map(e =>
                    e.name.toString()
                  ),
                },
          treeOid: currentBranchCommit,
          addKeepIfEmpty: true,
          deleteKeepIfNotEmpty: true,
        });

        const currentTree = await git.readTree({
          fs: gitStorageFs,
          dir: gitRoot,
          oid: oldBranchCommit,
        });

        if (newTreeOid !== currentTree.oid) {
          // Step 5: Create a new commit
          const newCommitOid = await git.commit({
            fs: gitStorageFs,
            dir: gitRoot,
            message: `🔀 Rename '${pathParams.filePath}' to '${newPathParams.filePath}'`,
            tree: newTreeOid,
            noUpdateBranch: true,
            parent: [currentBranchCommit],
            author,
          });

          // Update the branch reference
          await git.writeRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: `refs/heads/${decodeBranchNameFromVfs(newPathParams.branchName)}`,
            value: newCommitOid,
            force: true,
          });
        }
      },

      mkdir: async function (
        args: VirtualFileArgs & {
          options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null;
        }
      ): Promise<void> {
        // Parse the path to get branch name and file path
        if (args.pathParams.branchName === undefined) {
          args.pathParams.branchName = await getCurrentBranch(
            gitRoot,
            gitStorageFs
          );
          // throw new Error('branchName should be in pathParams');
        }

        let branchCommit = await tryResolveRef(
          gitStorageFs,
          gitRoot,
          args.pathParams.branchName
        );

        if (args.pathParams.filePath === '') {
          args.pathParams.filePath = '/';
          if (branchCommit !== undefined) {
            throw new Error('Folder exists');
          }
        }

        try {
          await (this as any).getStats(args);
          throw new Error('Folder exists');
        } catch (err) {
          // no-op
        }

        // Normalize filePath by removing trailing slash
        if (args.filePath.endsWith('/')) {
          args.filePath = args.filePath.replace(/\/+$/, '');
        }
        if (args.pathParams && typeof args.pathParams.filePath === 'string') {
          args.pathParams.filePath = args.pathParams.filePath.replace(
            /\/+$/,
            ''
          );
        }

        if (!branchCommit) {
          // Get the current branch/HEAD to use as base for new branch
          const currentHead = await git.resolveRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: 'HEAD',
          });

          // Create branch if it doesn't exist
          await git.branch({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: decodeBranchNameFromVfs(args.pathParams.branchName),
            object: currentHead,
          });
          branchCommit = await tryResolveRef(
            gitStorageFs,
            gitRoot,
            args.pathParams.branchName
          );

          if (branchCommit === undefined) {
            throw new Error('Could not create branch for mkdir operation');
          }
        }

        // read tree also accepts a git commit - it will resolve the tree within the commit
        const currentTree = await git.readTree({
          fs: gitStorageFs,
          dir: gitRoot,
          oid: branchCommit,
        });

        const emptyBlob = new Uint8Array(0);
        const keepOid = await git.writeBlob({
          fs: gitStorageFs,
          dir: gitRoot,
          blob: emptyBlob,
        });

        const newTreeOid = await buildUpdatedTree({
          dir: gitRoot,
          fs: gitStorageFs,
          treeOid: currentTree.oid,
          deletePathParts: undefined,
          addPathParts: [...args.pathParams.filePath.split('/'), '.keep'],
          addObj: {
            type: 'blob',
            oid: keepOid,
          },
          deleteKeepIfNotEmpty: true,
          addKeepIfEmpty: true,
          keepFilename: '.keep',
        });

        if (newTreeOid !== currentTree.oid) {
          // Step 5: Create a new commit
          const newCommitOid = await git.commit({
            fs: gitStorageFs,
            dir: gitRoot,
            message: `💾 Change '${args.pathParams.filePath}'`,
            tree: newTreeOid,
            noUpdateBranch: true,
            parent: [branchCommit],
            author: args.author,
          });

          // Update the branch reference
          await git.writeRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: `refs/heads/${decodeBranchNameFromVfs(args.pathParams.branchName)}`,
            value: newCommitOid,
            force: true,
          });
        }
      },

      rmdir: async args => {
        const { pathParams, author } = args;
        if (pathParams.branchName === undefined) {
          pathParams.branchName = await getCurrentBranch(gitRoot, gitStorageFs);
          // throw new Error('branchName should be in pathParams');
        }

        if (!pathParams.filePath) {
          throw new Error('filePath should be in pathParams');
        }
        // Get current branch commit
        const branchCommit = await tryResolveRef(
          gitStorageFs,
          gitRoot,
          pathParams.branchName
        );

        if (!branchCommit) {
          throw new Error('Invalid branch file path - branch must exist');
        }

        // Read current tree
        const currentTree = await git.readTree({
          fs: gitStorageFs,
          dir: gitRoot,
          oid: branchCommit,
        });

        // Build new tree without the file
        const newTreeOid = await buildUpdatedTree({
          dir: gitRoot,
          fs: gitStorageFs,
          treeOid: currentTree.oid,
          deletePathParts: pathParams.filePath.split('/'),
          addPathParts: undefined,
          addObj: undefined,
          deleteKeepIfNotEmpty: false,
          addKeepIfEmpty: true,
          keepFilename: '.keep',
        });

        // Create commit if tree changed
        if (newTreeOid !== currentTree.oid) {
          const newCommitOid = await git.commit({
            fs: gitStorageFs,
            dir: gitRoot,
            message: `Delete ${pathParams.filePath}`,
            tree: newTreeOid,
            noUpdateBranch: true,
            parent: [branchCommit],
            author: author,
          });

          // Update branch reference
          await git.writeRef({
            fs: gitStorageFs,
            dir: gitRoot,
            ref: `refs/heads/${decodeBranchNameFromVfs(pathParams.branchName)}`,
            value: newCommitOid,
            force: true,
          });
        }
      },
    },
  });

  return adapter;
}
