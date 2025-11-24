import git from 'isomorphic-git';
import {
  tryResolveRef,
  resolveGitObjAtPath,
  buildUpdatedTree,
} from './utils.js';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import { ENOENTError } from '../../../errors/ENOENTError.js';
import * as nodeFs from 'node:fs';
import { CompositeFs } from '../../../CompositeFs.js';

// .legit/branches/[branch-name]/[[...filepath]] -> file or folder at path in branch

async function buildTreeWithoutFile(
  compositFs: CompositeFs,
  gitRoot: string,
  treeOid: string,
  pathParts: string[]
): Promise<string> {
  const [currentPart, ...restParts] = pathParts;

  if (!currentPart) {
    return treeOid;
  }

  const { tree } = await git.readTree({
    fs: compositFs,
    dir: gitRoot,
    oid: treeOid,
  });

  let newEntries = [...tree];
  const entryIndex = newEntries.findIndex(e => e.path === currentPart);

  if (entryIndex === -1) {
    // File doesn't exist, return unchanged tree
    return treeOid;
  }

  if (restParts.length === 0) {
    // Remove the file entry
    newEntries.splice(entryIndex, 1);
  } else {
    // Recurse into subdirectory
    const entry = newEntries[entryIndex];
    if (entry && entry.type === 'tree') {
      const newSubtreeOid = await buildTreeWithoutFile(
        compositFs,
        gitRoot,
        entry.oid,
        restParts
      );
      if (newSubtreeOid !== entry.oid) {
        newEntries[entryIndex] = {
          mode: entry.mode,
          path: entry.path,
          type: entry.type,
          oid: newSubtreeOid,
        };
      } else {
        return treeOid; // No changes
      }
    } else {
      return treeOid; // Can't traverse into a blob
    }
  }

  // Write new tree
  return await git.writeTree({
    fs: compositFs,
    dir: gitRoot,
    tree: newEntries,
  });
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
 */
export const gitBranchFileVirtualFile: VirtualFileDefinition = {
  type: 'gitBranchFileVirtualFile',

  getStats: async ({ gitRoot, nodeFs, filePath, cacheFs, pathParams }) => {
    if (pathParams.branchName === undefined) {
      throw new Error('branchName should be in pathParams');
    }

    // if (pathParams.filePath !== undefined) {
    //   // check if the file was not yet written to a commit
    //   try {
    //     const currentStat = await cacheFs.promises.stat(filePath);
    //     return currentStat;
    //   } catch (e) {
    //     // no op
    //   }
    // }

    // read the stats from the current file
    let branchCommit = await tryResolveRef(
      nodeFs,
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
      nodeFs,
      commitSha: branchCommit,
      pathParams,
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
      oid: branchCommit,
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
  getFile: async ({ filePath, gitRoot, nodeFs, cacheFs, pathParams }) => {
    if (pathParams.branchName === undefined) {
      throw new Error('branchName should be in pathParams');
    }

    let memoryDirEntries: string[] = [];

    // try {
    //   const stat = await cacheFs.promises.stat(filePath);
    //   if (stat && stat.isFile()) {
    //     const content = await cacheFs.promises.readFile(filePath, {
    //       encoding: 'buffer',
    //     });
    //     return {
    //       type: 'file',
    //       content: content,
    //       mode: stat.mode as number,
    //       size: stat.size as number,
    //       oid: undefined,
    //     };
    //   }
    // } catch (e) {
    //   // ignore cache errors
    // }

    try {
      let branchCommit = await tryResolveRef(
        nodeFs,
        gitRoot,
        pathParams.branchName
      );

      if (!branchCommit) {
        // Get the current branch/HEAD to use as base for new branch
        const currentHead = await git.resolveRef({
          fs: nodeFs,
          dir: gitRoot,
          ref: 'HEAD',
        });

        await git.branch({
          fs: nodeFs,
          dir: gitRoot,
          ref: pathParams.branchName,
          object: currentHead,
        });

        branchCommit = await git.resolveRef({
          fs: nodeFs,
          ref: `refs/heads/${pathParams.branchName}`,
          dir: gitRoot,
        });
      }
      const fileOrFolder = await resolveGitObjAtPath({
        filePath,
        gitRoot,
        nodeFs,
        commitSha: branchCommit,
        pathParams,
      });

      if (!fileOrFolder) {
        return undefined;
      }

      if (fileOrFolder.type === 'blob') {
        const { blob } = await git.readBlob({
          fs: nodeFs,
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
        const cacheEntries: string[] = [];
        try {
          const stat = await cacheFs.promises.stat(filePath);
          if (stat && stat.isDirectory()) {
            const cached = await cacheFs.promises.readdir(filePath, {
              withFileTypes: false,
              encoding: 'utf-8',
            });
            cacheEntries.push(...(cached as string[]));
          }
        } catch (e) {
          // ignore cache errors
        }
        const allEntries = Array.from(
          new Set([...cacheEntries, ...fileOrFolder.entries])
        );
        return {
          type: 'directory',
          content: allEntries,
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
  unlink: async ({ filePath, gitRoot, nodeFs, cacheFs, pathParams }) => {
    if (!pathParams.branchName) {
      throw new Error('branchName should be in pathParams');
    }

    if (!pathParams.filePath) {
      throw new Error('filePath should be in pathParams');
    }
    // Get current branch commit
    const branchCommit = await git.resolveRef({
      fs: nodeFs,
      dir: gitRoot,
      ref: pathParams.branchName,
    });

    // Read current tree
    const currentTree = await git.readTree({
      fs: nodeFs,
      dir: gitRoot,
      oid: branchCommit,
    });

    // Build new tree without the file
    const newTreeOid = await buildUpdatedTree({
      dir: gitRoot,
      fs: nodeFs,
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
        fs: nodeFs,
        dir: gitRoot,
        message: `Delete ${pathParams.filePath}`,
        tree: newTreeOid,
        noUpdateBranch: true,
        parent: [branchCommit],
        author: {
          name: 'GitLegitFs',
          email: 'gitlegit@example.com',
          timestamp: Math.floor(Date.now() / 1000),
          timezoneOffset: 0,
        },
      });

      // Update branch reference
      await git.writeRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: `refs/heads/${pathParams.branchName}`,
        value: newCommitOid,
        force: true,
      });
    }
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
      // Get the current branch/HEAD to use as base for new branch
      const currentHead = await git.resolveRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: 'HEAD',
      });

      // Create branch if it doesn't exist
      await git.branch({
        fs: nodeFs,
        dir: gitRoot,
        ref: pathParams.branchName,
        object: currentHead,
      });
      branchCommit = await git.resolveRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: `refs/heads/${pathParams.branchName}`,
      });
    }

    // read tree also accepts a git commit - it will resolve the tree within the commit
    const currentTree = await git.readTree({
      fs: nodeFs,
      dir: gitRoot,
      oid: branchCommit,
    });

    const filepathParts = pathParams.filePath.split('/');

    const newTreeOid = await buildUpdatedTree({
      dir: gitRoot,
      fs: nodeFs,
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
        fs: nodeFs,
        dir: gitRoot,
        message: `💾 Change '${pathParams.filePath}'`,
        tree: newTreeOid,
        noUpdateBranch: true,
        parent: [branchCommit],
        author: {
          name: 'GitLegitFs',
          email: 'gitlegit@example.com',
          timestamp: Math.floor(Date.now() / 1000),
          timezoneOffset: 0,
        },
      });

      // Update the branch reference
      await git.writeRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: `refs/heads/${pathParams.branchName}`,
        value: newCommitOid,
        force: true,
      });
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
    // Parse the path to get branch name and file path

    if (pathParams.branchName === undefined) {
      throw new Error('branchName should be in pathParams');
    }

    if (pathParams.filePath === undefined) {
      throw new Error('filePath should be in pathParams');
    }

    if (newPathParams.branchName === undefined) {
      throw new Error('branchName should be in newPathParams');
    }

    if (newPathParams.filePath === undefined) {
      throw new Error('filePath should be in newPathParams');
    }

    // Step 2: Get the current branch commit
    const oldBranchCommit = await tryResolveRef(
      nodeFs,
      gitRoot,
      pathParams.branchName
    );

    if (!oldBranchCommit) {
      throw new Error('Invalid branch file path - source branch must exist');
    }

    let currentBranchCommit = await tryResolveRef(
      nodeFs,
      gitRoot,
      newPathParams.branchName
    );

    if (!currentBranchCommit) {
      // Get the current branch/HEAD to use as base for new branch
      const currentHead = await git.resolveRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: 'HEAD',
      });

      // Create branch if it doesn't exist
      await git.branch({
        fs: nodeFs,
        dir: gitRoot,
        ref: newPathParams.branchName,
        object: currentHead,
      });
      currentBranchCommit = await git.resolveRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: `refs/heads/${newPathParams.branchName}`,
      });
    }

    if (newPathParams.branchName !== pathParams.branchName) {
      throw new Error('cross branch move not implemented yet');
    }

    const existingAtOldPath = await resolveGitObjAtPath({
      gitRoot: gitRoot,
      nodeFs: nodeFs,
      commitSha: oldBranchCommit,
      filePath: filePath,
      pathParams: pathParams,
    });

    if (existingAtOldPath === undefined) {
      throw new Error('no obj at path exists');
    }

    const newTreeOid = await buildUpdatedTree({
      dir: gitRoot,
      fs: nodeFs,
      deletePathParts: pathParams.filePath.split('/'),
      addPathParts: newPathParams.filePath.split('/'),
      addObj: existingAtOldPath,
      treeOid: currentBranchCommit,
      addKeepIfEmpty: true,
      deleteKeepIfNotEmpty: true,
    });

    const currentTree = await git.readTree({
      fs: nodeFs,
      dir: gitRoot,
      oid: oldBranchCommit,
    });

    if (newTreeOid !== currentTree.oid) {
      // Step 5: Create a new commit
      const newCommitOid = await git.commit({
        fs: nodeFs,
        dir: gitRoot,
        message: `🔀 Rename '${pathParams.filePath}' to '${newPathParams.filePath}'`,
        tree: newTreeOid,
        noUpdateBranch: true,
        parent: [currentBranchCommit],
        author: {
          name: 'GitLegitFs',
          email: 'gitlegit@example.com',
          timestamp: Math.floor(Date.now() / 1000),
          timezoneOffset: 0,
        },
      });

      // Update the branch reference
      await git.writeRef({
        fs: nodeFs,
        dir: gitRoot,
        ref: `refs/heads/${newPathParams.branchName}`,
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
    try {
      await gitBranchFileVirtualFile.getStats(args);
      throw new Error('Folder exists');
    } catch (err) {
      // no-op
    }

    // Normalize filePath by removing trailing slash
    if (args.filePath.endsWith('/')) {
      args.filePath = args.filePath.replace(/\/+$/, '');
    }
    if (args.pathParams && typeof args.pathParams.filePath === 'string') {
      args.pathParams.filePath = args.pathParams.filePath.replace(/\/+$/, '');
    }

    // TODO replace with build updated tree function

    const createFileArgs = {
      ...args,
      filePath: (args.filePath += '.keep'),
      content: '',
    };

    createFileArgs.pathParams.filePath += '/.keep';

    await gitBranchFileVirtualFile.writeFile!(createFileArgs);
  },

  // rmdir: async (path: PathLike, ...args: any[]): Promise<void> => {
  //   throw new Error(`rmdir not implemented for: ${this.toStr(path)}`);
  // }
};
