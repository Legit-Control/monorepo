import git, {
  FsClient,
  TreeEntry,
  TreeObject,
} from '@legit-sdk/isomorphic-git';
import { VirtualFileArgs } from './gitVirtualFiles.js';

import { IFs } from 'memfs';

import { decodeBranchNameFromVfs } from './operations/nameEncoding.js';
import { IDirent } from '@jsonjoy.com/fs-node-utils';
import { toDirEntry } from '../../../utils/toDirEntry.js';

function getGitCacheFromArgs(args: VirtualFileArgs): any {
  // Access gitCache through the userSpaceFs hierarchy
  // if (args.userSpaceFs && args.userSpaceFs.gitCache !== undefined) {
  //   return args.userSpaceFs.gitCache;
  // }
  // // If it has a parent, traverse up to find the gitCache
  // if (args.userSpaceFs && args.userSpaceFs.parentFs) {
  //   return getGitCacheFromFs(args.userSpaceFs.parentFs);
  // }
  // Default to empty object if no cache found
  return {};
}

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

export async function tryResolveRef(
  fs: FsClient,
  gitRoot: string,
  refName: string
) {
  try {
    const branchCommit = await git.resolveRef({
      fs: fs,
      dir: gitRoot,
      ref: `refs/heads/${decodeBranchNameFromVfs(refName)}`,
    });
    return branchCommit;
  } catch (e) {
    return undefined;
  }
}

export async function tryResolveRefFromArgs(
  fs: FsClient,
  gitRoot: string,
  refName: string,
  args: VirtualFileArgs
) {
  try {
    const branchCommit = await git.resolveRef({
      fs: fs,
      dir: gitRoot,
      ref: `refs/heads/${decodeBranchNameFromVfs(refName)}`,
    });
    return branchCommit;
  } catch (e) {
    return undefined;
  }
}

// async function buildTreesForMove({
//   dir,
//   fs,
//   oldTreeId,
//   oldPath,
//   newPath,
// }: {
//   dir: string;
//   fs: IFs;
//   oldTreeId: string;
//   /**
//    * the relative path within the branch
//    */
//   oldPath: string;
//   /**
//    * if new Path is undefined - the operation is a deletion
//    */
//   newPath: string | undefined;
// }): Promise<{
//   treeOid: string;
// }> {
//   // // read tree also accepts a git commit - it will resolve the tree within the commit
//   // const currentTree = await git.readTree({
//   //   fs: fs,
//   //   dir: dir,
//   //   oid: oldBranchCommit,
//   // });

//   // First, find the blob OID from the old path by traversing the tree
//   const blobOid = await resolveGitObjAtPath({
//     gitRoot: dir,
//     nodeFs: fs,
//     branchCommit: oldBranchCommit,
//     filePath: oldPath,
//   });

//   if (!blobOid) {
//     throw new Error(`File not found at path: ${oldPath}`);
//   }

//   // Check if the new path already exists (should throw if it does)
//   const existingAtNewPath = await resolveGitObjAtPath({
//     gitRoot: dir,
//     nodeFs: fs,
//     branchCommit: newBranchCommit,
//     filePath: newPath,
//   });

//   if (existingAtNewPath) {
//     throw new Error(`Target path already exists: ${newPath}`);
//   }

//   // Check if this is a same-branch move
//   if (oldBranchCommit === newBranchCommit) {
//     // Same branch move - create a single tree with the file moved
//     // First, remove the file from old location
//     const treeWithMovedEntry = await moveInTree({
//       dir,
//       fs,
//       treeOid: oldBranchCommit,
//       oldPath: oldPath,
//       newPath: newPath,
//     });

//     return {
//       sourceBranchTreeOid: treeWithMovedEntry,
//       targetBranchTreeOid: treeWithMovedEntry,
//     };
//   } else {
//     // Cross-branch move - create two separate trees
//     // Remove from source branch
//     const sourceBranchTreeOid = await removeFromTree({
//       dir,
//       fs,
//       currentOid: currentRootTreeOid,
//       parts: oldParts,
//     });

//     // Add to target branch
//     const targetBranchTreeOid = await buildUpdatedTree({
//       dir,
//       fs,
//       treeOid: newRootTreeOid,
//       addPathParts: newParts,
//       oid: blobOid,
//     });

//     return {
//       sourceBranchTreeOid,
//       targetBranchTreeOid,
//     };
//   }
// }

/**
 *
 * takes a tree object (oid) to update
 *
 * Finds the common parts of the passed deletePathParts and add pathParts.
 *
 * deletePathParts: /path/to/removed-file/with/sub-folder/name.txt
 * addPathParts:    /path/to/add-file/with/sub-folder/name2.txt
 *
 * -> commonParts: /path/to
 *
 * than recursivly build both new subtrees (trees for /path/to/removed-file, /path/to/removed-file/with, /path/to/removed-file/with/sub-folder and /path/to/add-file, /path/to/add-file/with ...)
 * to get the oid's of those two subtrees (undefined in case the folder was empty)
 *
 * Than the oid's representing the new subtrees are used to create the new common tree.
 *
 * Than we go up to the root and return the new oid of the tree
 *
 * IF
 *
 * @returns
 */
export async function buildUpdatedTree({
  dir,
  fs,
  treeOid: currentOid,
  deletePathParts,
  addPathParts,
  addObj,
  addKeepIfEmpty,
  deleteKeepIfNotEmpty,
  keepFilename = '.keep',
  gitCache,
}: {
  dir: string;
  fs: IFs;
  /**
   * the oid of the tree - to use as bases - if undefined we create one from scratch
   */
  treeOid: string | undefined;

  /**
   * if passed we this operation tries to drop the oid at the path parts - throws if path doesnt exist
   * if undefined -> this is a copy operation, no change on the source tree
   */
  deletePathParts: string[] | undefined;
  gitCache?: any;

  /**
   * path split by separator
   *
   * if passed, the oid will get add at the path specified
   * if not passed this operation can be used to delete
   */
  addPathParts: string[] | undefined;
  /**
   * the object to add
   */
  addObj:
    | {
        type: 'tree';
        oid: string;
        entries: string[];
      }
    | {
        type: 'blob';
        oid: string;
      }
    | undefined;

  addKeepIfEmpty: boolean;
  deleteKeepIfNotEmpty: boolean;
  keepFilename?: string;
}): Promise<string | undefined> {
  const [currentPathPartAdded, ...restPathPartsAdded] = addPathParts ?? [];
  const [currentPathPartDeleted, ...restPathPartsDeleted] =
    deletePathParts ?? [];

  // read current tree entries
  let newEntries: TreeObject = [];
  if (currentOid) {
    const { tree } = await git.readTree({
      fs,
      dir: dir,
      oid: currentOid,
      cache: gitCache || {},
    });
    newEntries = [...tree];
  }

  if (currentPathPartAdded === currentPathPartDeleted) {
    // same tree -> continue together

    const currentPart = currentPathPartAdded;
    if (currentPart === undefined) {
      throw new Error('illegal arguement - called with out a path part');
    }

    if (restPathPartsAdded.length === 0) {
      throw new Error('can not move into it self');
    }

    if (restPathPartsDeleted.length === 0) {
      throw new Error('can not move from it self');
    }

    const idx = newEntries.findIndex(e => e.path === currentPart);
    const entry = idx !== -1 ? newEntries[idx] : undefined;

    // We're at a tree — recurse
    let subtreeOid = entry?.oid;

    // subtreeOid, restParts
    const newSubtreeOid = await buildUpdatedTree({
      dir,
      fs,
      treeOid: subtreeOid,
      addPathParts: restPathPartsAdded,
      deletePathParts: restPathPartsDeleted,
      addObj,
      addKeepIfEmpty,
      deleteKeepIfNotEmpty,
    });

    if (newSubtreeOid === undefined) {
      throw new Error(
        'on the same path we expect an update - respectivly a newly created subTreeOid'
      );
    }

    let updated = false;

    if (newSubtreeOid !== subtreeOid) {
      updated = true;
      const treeEntry = {
        mode: '040000',
        path: currentPart,
        oid: newSubtreeOid,
        type: 'tree' as const,
      };
      if (idx !== -1) {
        newEntries[idx] = treeEntry;
      } else {
        newEntries.push(treeEntry);
      }
    }

    if (currentOid == undefined && !updated) {
      throw new Error(
        'Illegal state - if the currentOid is undefined - a new tree should have been created (an update should have happened)'
      );
    }

    if (updated) {
      // the new entries get sorted from isomorphics GitTree constructor
      const newOid = await git.writeTree({ fs, dir, tree: newEntries });
      return newOid;
    } else {
      if (currentOid === undefined) {
        throw new Error(
          "currentOid should be set - since the sub tree didn't exist and "
        );
      }
      return currentOid;
    }
  } else {
    // we need to follow two paths separatly now (deletion and add)!
    let updated = false;

    let entryToMove: TreeEntry | undefined;

    // move /path/to/removed-file/with/sub-folder/name.txt
    //.              ^^^ should still exist ^^^^^
    // to.  /path/to/new/with/sub-folder/name.txt

    if (currentPathPartDeleted) {
      const idx = newEntries.findIndex(e => e.path === currentPathPartDeleted);
      const entry = idx !== -1 ? newEntries[idx] : undefined;

      if (entry === undefined) {
        throw new Error('Element doesnt exist in tree');
      }

      if (restPathPartsDeleted.length > 0) {
        if (entry && entry.type !== 'tree') {
          throw new Error(
            'SubPart of the path for the obj to delete is not a tree'
          );
        }

        // lets start with leaf first deletion
        const newSubtreeOid = await buildUpdatedTree({
          dir,
          fs,
          treeOid: entry.oid,
          addPathParts: undefined, // passing undefined to delete in this folderbranch only
          deletePathParts: restPathPartsDeleted,
          addObj,
          addKeepIfEmpty,
          deleteKeepIfNotEmpty,
        });

        if (newSubtreeOid === entry.oid) {
          throw new Error(
            'in case of a delete we expect a different subtree oid'
          );
        }
        updated = true;

        if (newSubtreeOid === undefined) {
          // remove entry from the list
          newEntries.splice(idx, 1);
        } else {
          newEntries[idx] = {
            mode: '040000',
            path: currentPathPartDeleted,
            oid: newSubtreeOid,
            type: 'tree' as const,
          };
        }
      } else {
        updated = true;
        // we are at the end of the recrusion for deletion
        // delete the entry at index
        newEntries.splice(idx, 1);

        if (newEntries.length === 0 && addKeepIfEmpty) {
          const emptyBlob = new Uint8Array(0);
          const keepOid = await git.writeBlob({ fs, dir, blob: emptyBlob });
          newEntries.push({
            mode: '100644',
            oid: keepOid,
            path: keepFilename,
            type: 'blob',
          });
          // return undefined;
        }
      }
      entryToMove = entry;
    }

    if (currentPathPartAdded) {
      const idx = newEntries.findIndex(e => e.path === currentPathPartAdded);
      const entry = idx !== -1 ? newEntries[idx] : undefined;

      if (restPathPartsAdded.length > 0) {
        if (entry && entry.type !== 'tree') {
          throw new Error(
            'SubPart of the path for the obj to add is not a tree'
          );
        }

        // lets start with leaf first addition
        const newSubtreeOid = await buildUpdatedTree({
          dir,
          fs,
          treeOid: entry?.oid, // might be undefined - to signal creation,
          addPathParts: restPathPartsAdded, // passing undefined to delete in this folderbranch only
          deletePathParts: undefined,
          addObj,
          addKeepIfEmpty,
          deleteKeepIfNotEmpty,
        });

        if (newSubtreeOid === undefined) {
          throw new Error(
            'in case we add, we expect an update - respectivly a newly created subTreeOid'
          );
        }

        if (newSubtreeOid !== entry?.oid) {
          updated = true;
          const treeEntry = {
            mode: '040000',
            path: currentPathPartAdded,
            oid: newSubtreeOid,
            type: 'tree' as const,
          };
          if (idx !== -1) {
            newEntries[idx] = treeEntry;
          } else {
            newEntries.push(treeEntry);
            if (deleteKeepIfNotEmpty && newEntries.length > 1) {
              const keepIdx = newEntries.findIndex(
                e => e.path === keepFilename
              );
              if (keepIdx !== -1) {
                newEntries.splice(keepIdx, 1);
              }
            }
          }
        }
      } else {
        updated = true;
        if (addObj) {
          const treeEntry = {
            mode: addObj!.type === 'tree' ? '040000' : '100644', // mode for file
            path: currentPathPartAdded,
            oid: addObj!.oid,
            type: addObj!.type,
          };
          if (idx !== -1) {
            newEntries[idx] = treeEntry;
          } else {
            if (deleteKeepIfNotEmpty && newEntries.length > 0) {
              const keepIdx = newEntries.findIndex(
                e => e.path === keepFilename
              );

              if (keepIdx !== -1) {
                newEntries.splice(keepIdx, 1);
              }
            }
            newEntries.push(treeEntry);
          }
        }

        if (addKeepIfEmpty && newEntries.length === 0) {
          const emptyBlob = new Uint8Array(0);
          const keepOid = await git.writeBlob({ fs, dir, blob: emptyBlob });
          newEntries.push({
            mode: '100644',
            oid: keepOid,
            path: keepFilename,
            type: 'blob',
          });
        }
      }
    }
    if (newEntries.length === 0) {
      return undefined;
    }

    if (updated) {
      // the new entries get sorted from isomorphics GitTree constructor
      const newOid = await git.writeTree({ fs, dir, tree: newEntries });
      return newOid;
    } else {
      if (currentOid === undefined) {
        throw new Error(
          "currentOid should be set - since the sub tree didn't exist and "
        );
      }
      return currentOid;
    }
  }
}

export async function buildUpdatedTreeFromArgs({
  dir,
  fs,
  treeOid: currentOid,
  deletePathParts,
  addPathParts,
  addObj,
  addKeepIfEmpty,
  deleteKeepIfNotEmpty,
  keepFilename = '.keep',
  args,
}: {
  dir: string;
  fs: IFs;
  treeOid: string | undefined;
  deletePathParts: string[] | undefined;
  addPathParts: string[] | undefined;
  addObj:
    | {
        type: 'tree';
        oid: string;
        entries: string[];
      }
    | {
        type: 'blob';
        oid: string;
      }
    | undefined;
  addKeepIfEmpty: boolean;
  deleteKeepIfNotEmpty: boolean;
  keepFilename?: string;
  args: VirtualFileArgs;
}): Promise<string | undefined> {
  return await buildUpdatedTree({
    dir,
    fs,
    treeOid: currentOid,
    deletePathParts,
    addPathParts,
    addObj,
    addKeepIfEmpty,
    deleteKeepIfNotEmpty,
    keepFilename,
    gitCache: getGitCacheFromArgs(args),
  });
}

// Recursive function to find a git object at a specific path
async function findGitObjectAtPath(
  nodeFs: any,
  gitRoot: string,
  treeOid: string,
  pathParts: string[],
  partIndex: number = 0,
  cache: any = {}
): Promise<
  | { type: 'tree'; oid: string; entries: IDirent[] }
  | { type: 'blob'; oid: string }
  | undefined
> {
  // Read the current tree
  const { tree } = await git.readTree({
    fs: nodeFs,
    dir: gitRoot,
    oid: treeOid,
    cache: cache,
  });

  // If we're at the target path and this is a tree
  if (pathParts.length === partIndex) {
    return {
      type: 'tree',
      entries: tree.map(entry =>
        toDirEntry({
          parent: pathParts.join('/'),
          name: entry.path,
          isDir: entry.type === 'tree',
        })
      ),
      oid: treeOid,
    };
  }

  const nextPart = pathParts[partIndex];

  // Find the entry in the current tree that matches the next path part
  const entry = tree.find(treeEntry => treeEntry.path === nextPart);

  if (!entry) {
    return undefined;
  }

  // If we're at the final path part
  if (pathParts.length === partIndex + 1) {
    if (entry.type === 'blob') {
      return {
        type: 'blob',
        oid: entry.oid,
      };
    } else if (entry.type === 'tree') {
      // For tree entries at the final path, read the tree to get entries
      const subTree = await git.readTree({
        fs: nodeFs,
        dir: gitRoot,
        oid: entry.oid,
        cache: cache,
      });
      return {
        type: 'tree',
        entries: subTree.tree.map(subEntry =>
          toDirEntry({
            parent: pathParts.join('/'),
            name: subEntry.path,
            isDir: subEntry.type === 'tree',
          })
        ),
        oid: subTree.oid,
      };
    }
  } else if (entry.type === 'tree') {
    // Continue recursing into subdirectories
    return await findGitObjectAtPath(
      nodeFs,
      gitRoot,
      entry.oid,
      pathParts,
      partIndex + 1,
      cache
    );
  }

  return undefined;
}

export async function resolveGitObjAtPath({
  filePath,
  gitRoot,
  nodeFs,
  commitSha,
  pathParams,
  gitCache,
}: Pick<VirtualFileArgs, 'filePath' | 'pathParams'> & {
  commitSha: string;
  gitRoot: string;
  gitCache: any;
  nodeFs: any;
}): Promise<
  | { type: 'tree'; oid: string; entries: IDirent[] }
  | { type: 'blob'; oid: string }
  | undefined
> {
  const cache = gitCache || {};

  if (!pathParams.filePath) {
    const tree = await git.readTree({
      fs: nodeFs,
      dir: gitRoot,
      oid: commitSha,
      cache: cache,
    });
    const entries = tree.tree.map(entry =>
      toDirEntry({
        parent: filePath,
        name: entry.path,
        isDir: entry.type === 'tree',
      })
    );
    return {
      type: 'tree',
      entries: entries,
      oid: tree.oid,
    };
  }

  // // Walk the tree to find the file
  // const results = await git.walk({
  //   fs: nodeFs,
  //   dir: gitRoot,
  //   trees: [git.TREE({ ref: commitSha })],
  //   map: async (filepath, [entry]) => {
  //     if (filepath === pathParams.filePath && entry) {
  //       const type = await entry.type();
  //       if (type === 'blob') {
  //         return {
  //           type: 'blob',
  //           oid: await entry.oid(),
  //         };
  //       } else if (type == 'tree') {
  //         const tree = await git.readTree({
  //           fs: nodeFs,
  //           dir: gitRoot,
  //           oid: await entry.oid(),
  //         });
  //         const entries = tree.tree.map(entry =>
  //           toDirEntry({
  //             parent: filePath,
  //             name: entry.path,
  //             isDir: entry.type === 'tree',
  //           })
  //         );
  //         return {
  //           type: 'tree',
  //           entries: entries,
  //           oid: tree.oid,
  //         };
  //       }
  //     }
  //     return;
  //   },
  // });

  // const fileOrFolder = results.find(
  //   (
  //     r:
  //       | { type: 'tree'; entries: IDirent[] }
  //       | { type: 'blob'; oid: string }
  //       | undefined
  //   ) => r !== undefined
  const pathParts = pathParams.filePath ? pathParams.filePath.split('/') : [];

  // Use recursive function to find the file or folder at the specified path
  const fileOrFolder = await findGitObjectAtPath(
    nodeFs,
    gitRoot,
    commitSha,
    pathParts,
    0,
    cache
  );

  return fileOrFolder;
}

export async function resolveGitObjAtPathFromArgs({
  filePath,
  gitRoot,
  nodeFs,
  commitSha,
  pathParams,
  args,
}: Pick<VirtualFileArgs, 'filePath' | 'pathParams'> & {
  gitRoot: string;
  commitSha: string;
  args: VirtualFileArgs;
  nodeFs: any;
}): Promise<
  | { type: 'tree'; oid: string; entries: IDirent[] }
  | { type: 'blob'; oid: string }
  | undefined
> {
  return await resolveGitObjAtPath({
    filePath,
    gitRoot,
    nodeFs,
    commitSha,
    pathParams,
    gitCache: getGitCacheFromArgs(args),
  });
}
