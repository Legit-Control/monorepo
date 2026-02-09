import * as path from 'path';
import * as fsDisk from 'node:fs';

// NFS procedure handlers and types (barrel import)
import type {
  AccessHandler,
  CommitHandler,
  CreateHandler,
  FSInfoHandler,
  FSStatHandler,
  GetAttributesHandler,
  LinkHandler,
  LookupHandler,
  MkdirHandler,
  MknodHandler,
  PathconfHandler,
  ReadHandler,
  ReaddirHandler,
  ReaddirplusHandler,
  ReadlinkHandler,
  RemoveHandler,
  RenameHandler,
  RmdirHandler,
  SetAttrHandler,
  SymlinkHandler,
  WriteHandler,
} from './rpc/nfs/procedures/index.js';

import {
  nfsstat3,
  LinkResultErr,
  type SetAttrParams,
  type DirEntryPlus,
} from './rpc/nfs/procedures/index.js';

// Mount protocol
import { MountHandler } from './rpc/mount/handleMountRequest.js';

// File handle management
import { createFileHandleManager } from './createFileHandleManager.js';

// Node.js types
import { Buffer } from 'node:buffer';
import { FileHandle } from 'node:fs/promises';

/**
 * Takes an promise based fs and provides the handers neded by the NFS server
 */
export const createAsyncNfsHandler = (args: {
  fileHandleManager: ReturnType<typeof createFileHandleManager>;
  /**
   * A node fs promises API compatible fs with an additional getFilehandle method
   */
  asyncFs: (typeof fsDisk)['promises'];
}): {
  mount: MountHandler;
  access: AccessHandler;
  commit: CommitHandler;
  create: CreateHandler;
  fsinfo: FSInfoHandler;
  fsstat: FSStatHandler;
  getAttributes: GetAttributesHandler;
  link: LinkHandler;
  lookup: LookupHandler;
  mkdir: MkdirHandler;
  mknod: MknodHandler;
  pathconf: PathconfHandler;
  read: ReadHandler;
  readdir: ReaddirHandler;
  readdirplus: ReaddirplusHandler;
  readlink: ReadlinkHandler;
  remove: RemoveHandler;
  rename: RenameHandler;
  rmdir: RmdirHandler;
  setattr: SetAttrHandler;
  symlink: SymlinkHandler;
  write: WriteHandler;
} => {
  const { asyncFs, fileHandleManager } = args;
  /**
   * helper to check if a file exists
   * @param filePath the file path to probe for existance
   * @returns true if the file exists, false otherwise
   */
  async function fileExists(filePath: string): Promise<boolean> {
    try {
      await asyncFs.access(filePath);
      return true;
    } catch (error) {
      // @ts-expect-error
      if (error.code === 'ERR_INVALID_ARG_TYPE') {
        throw 'async fs seem to be synchronouse - make sure to pass the promises API of fs';
      }
      return false;
    }
  }

  return {
    mount: async _dirPath => {
      // NOTE _dirPath is the path used for mounting - for now only / later we can use this to specify the path to serve

      // console.log('Mount handler called');

      // Check if the directory exists
      if (!(await fileExists(fileHandleManager.rootPath))) {
        console.error(`Directory not found: ${fileHandleManager.rootPath}`);
        return {
          status: nfsstat3.ERR_NOENT,
        };
      }

      // add the root folder handle
      const rootFolderHandle = fileHandleManager.getHandleByPath(
        fileHandleManager.rootPath
      )!;
      return {
        status: nfsstat3.OK,
        fileHandle: rootFolderHandle.nfsHandle,
      };
    },

    lookup: async (dirHandle, name) => {
      // Get the directory path from the handle
      const dirPath = fileHandleManager.getPathFromHandle(dirHandle);
      if (!dirPath) {
        console.error(`Invalid directory handle: ${dirHandle.toString('hex')}`);
        return {
          status: 70, // NFS3ERR_STALE
        };
      }
      // console.log(`Directory path: ${dirPath}`);

      // Construct the full path
      const filePath = path.join(dirPath, name);
      // console.log(`Full path: ${filePath}`);

      try {
        // console.log(`stats path: ${dirPath}`);
        // Get the directory's attributes
        const dirStats = await asyncFs.stat(dirPath);

        // console.log(`stats path: ${filePath}`);
        // Get the file's attributes
        const fileStats = await asyncFs.stat(filePath);

        const fileHandle = fileHandleManager.getFileHandle(
          dirHandle,
          name,
          true
        );
        return {
          status: nfsstat3.OK,
          fileHandle: fileHandle.nfsHandle,
          fileStats: toStatWithFileId(fileStats, fileHandle.nfsHandle),
          dirStats: toStatWithFileId(dirStats, dirHandle),
        };
      } catch (err) {
        // console.error(`Error looking up file ${filePath}:`, err);

        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
          return {
            status: 2, // NFS3ERR_NOENT
            parentDirHandle: dirHandle,
          };
        }

        return {
          status: 10006, // NFS3ERR_SERVERFAULT
        };
      }
    },

    create: async (parentHandle, name, mode, attributesOrVerifier) => {
      // console.log('Create handler called');
      // Get the directory path from the handle
      const dirPath = fileHandleManager.getPathFromHandle(parentHandle);
      if (!dirPath) {
        console.error('Invalid directory handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Construct the full file path
      const filePath = path.join(dirPath, name);

      // Check if the file already exists
      if (await fileExists(filePath)) {
        if (mode > 0) {
          // TODO also take mode 3 into account! and check the file against the verifier if it exists
          console.error(`File already exists: ${filePath}`);
          return {
            status: nfsstat3.ERR_EXIST,
          };
        }
      }

      const attributes = attributesOrVerifier as SetAttrParams;

      try {
        const fsHandle = await asyncFs.open(filePath, 'wx');
        const fileStatsBefore = await fsHandle.stat();
        // Create an empty file with specified mode
        // await asyncFs.writeFile(filePath, "");
        // await asyncFs.chmod(filePath, mode);

        // add a new nfsFilehandle
        const fileHandle = fileHandleManager.addFileHandle(parentHandle, name);

        // Apply attribute changes as needed
        if (attributes.mode !== undefined) {
          // console.log(`Changing mode to ${attributes.mode}`);
          await fsHandle.chmod(attributes.mode);
        }

        // if (attributes.uid !== undefined || attributes.gid !== undefined) {
        //   // console.log(
        //     `Changing owner to uid=${attributes.uid}, gid=${attributes.gid}`,
        //   );
        //   await unionFs.chown(
        //     filePath,
        //     attributes.uid !== undefined ? attributes.uid : -1,
        //     attributes.gid !== undefined ? attributes.gid : -1,
        //   );
        // }

        if (attributes.size !== undefined) {
          // console.log(`Truncating file to size ${attributes.size}`);
          // Get stats before truncating

          // Perform the truncation
          await fsHandle.truncate(Number(attributes.size));
        }

        if (attributes.atime !== undefined || attributes.mtime !== undefined) {
          // console.log(
          //   `Setting times: atime=${attributes.atime}, mtime=${attributes.mtime}`
          // );

          // Use current time for any unspecified time
          const atime = attributes.atime || fileStatsBefore.atime;
          const mtime = attributes.mtime || fileStatsBefore.mtime;

          await fsHandle.utimes(atime, mtime);
        }

        // Get file stats
        const fileStats = await fsHandle.stat();
        const dirStats = await asyncFs.stat(dirPath);

        await fsHandle.close();

        // get rid of the fh reference
        fileHandle.fsHandle.fh = undefined;

        return {
          status: nfsstat3.OK,
          handle: fileHandle.nfsHandle,
          stats: toStatWithFileId(fileStats as any, fileHandle.nfsHandle), // TODO fix type
          dirStats: toStatWithFileId(dirStats, parentHandle),
        };
      } catch (err) {
        console.error(`Error creating file: ${err}`);
        return {
          status: nfsstat3.ERR_IO,
        };
      }
    },

    access: async (handle, check) => {
      // console.log('Access handler called');
      // Get the path from the handle
      const filePath = fileHandleManager.getPathFromHandle(handle);
      if (!filePath) {
        console.error('Invalid file handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if the file exists
      if (!(await fileExists(filePath))) {
        console.error(`File not found: ${filePath}`);
        return {
          status: nfsstat3.ERR_BADHANDLE,
        };
      }

      const stats = await asyncFs.stat(filePath);

      // For now, just grant all requested access
      return {
        status: nfsstat3.OK,
        access: check, // Grant everything requested
        statsAfter: toStatWithFileId(stats, handle),
      };
    },

    fsinfo: async handle => {
      // console.log('FSInfo handler called');
      // Get the path from the handle
      const filePath = fileHandleManager.getPathFromHandle(handle);
      if (!filePath) {
        console.error('Invalid file handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if the filesystem exists (the path is valid)
      if (!(await fileExists(filePath))) {
        console.error(`Path not found: ${filePath}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      const stats = await asyncFs.stat(filePath);

      // Return filesystem info with reasonable defaults
      return {
        status: nfsstat3.OK,
        stats: toStatWithFileId(stats, handle),
        rtmax: 1048576, // Maximum read transfer size
        rtpref: 65536, // Preferred read transfer size
        rtmult: 4096, // Suggested multiple for read transfer size
        wtmax: 1048576, // Maximum write transfer size
        wtpref: 65536, // Preferred write transfer size
        wtmult: 4096, // Suggested multiple for write transfer size
        dtpref: 8192, // Preferred transfer size for READDIR
        maxfilesize: BigInt('9223372036854775807'), // Maximum file size
        timeDelta: { seconds: 1, nseconds: 0 }, // Time precision
        properties: 0x0000001f, // File system properties flags
      };
    },

    fsstat: async handle => {
      // console.log('FSStat handler called');
      // Get the path from the handle
      const filePath = fileHandleManager.getPathFromHandle(handle);
      if (!filePath) {
        console.error('Invalid file handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if the filesystem exists (the path is valid)
      if (!(await fileExists(filePath))) {
        console.error(`Path not found: ${filePath}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Get stats to determine if it's a directory
      const stats = await asyncFs.stat(filePath);

      // In a real implementation, we would get actual filesystem statistics
      // For now, we'll return placeholder values
      return {
        status: nfsstat3.OK,
        stats: toStatWithFileId(stats, handle),
        tbytes: BigInt(1099511627776), // Total bytes (1TB)
        fbytes: BigInt(549755813888), // Free bytes (512GB)
        abytes: BigInt(549755813888), // Available bytes (512GB)
        tfiles: BigInt(1000000), // Total file slots
        ffiles: BigInt(999000), // Free file slots
        afiles: BigInt(999000), // Available file slots
        invarsec: 0, // Unchanging for given filesystem instance
      };
    },

    link: async (handle, dirHandle, name) => {
      // console.log('Link handler called');
      // Get source file path
      const filePath = fileHandleManager.getPathFromHandle(handle);
      if (!filePath) {
        console.error('Invalid file handle');
        return {
          status: LinkResultErr.ERR_STALE,
        };
      }

      // Get target dir path
      const dirPath = fileHandleManager.getPathFromHandle(dirHandle);
      if (!dirPath) {
        console.error('Invalid directory handle');
        return {
          status: LinkResultErr.ERR_STALE,
        };
      }

      // Check if the source file exists
      if (!(await fileExists(filePath))) {
        console.error(`Source file not found: ${filePath}`);
        return {
          status: LinkResultErr.ERR_STALE,
        };
      }

      // Check if the target directory exists
      if (!(await fileExists(dirPath))) {
        console.error(`Target directory not found: ${dirPath}`);
        return {
          status: LinkResultErr.ERR_STALE,
        };
      }

      // Check if the target directory is a directory
      const dirStats = await asyncFs.stat(dirPath);
      if (!dirStats.isDirectory()) {
        console.error(`Not a directory: ${dirPath}`);
        return {
          status: LinkResultErr.ERR_NOTDIR,
        };
      }

      // Construct target path
      const targetPath = path.join(dirPath, name);

      // Check if target exists
      if (await fileExists(targetPath)) {
        console.error(`Target already exists: ${targetPath}`);
        return {
          status: LinkResultErr.ERR_EXIST,
        };
      }

      try {
        // Create the hard link
        await asyncFs.link(filePath, targetPath);

        // Get file stats
        const fileStats = await asyncFs.stat(targetPath);

        return {
          status: nfsstat3.OK,
          fileStats: toStatWithFileId(fileStats, handle),
          dirStats: toStatWithFileId(dirStats, dirHandle),
        };
      } catch (err) {
        console.error(`Error creating link: ${err}`);
        return {
          status: LinkResultErr.ERR_IO,
        };
      }
    },

    mkdir: async (dirHandle, name, mode) => {
      // console.log('Mkdir handler called');
      // Get the directory path from the handle
      const parentPath = fileHandleManager.getPathFromHandle(dirHandle);
      if (!parentPath) {
        console.error('Invalid directory handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Construct the full directory path
      const dirPath = path.join(parentPath, name);

      // Check if the directory already exists
      if (await fileExists(dirPath)) {
        console.error(`Directory already exists: ${dirPath}`);
        return {
          status: nfsstat3.ERR_EXIST,
        };
      }

      // try {
      // Create the directory with the specified mode
      await asyncFs.mkdir(dirPath, { mode });

      // Generate a file handle for the new directory
      const handle = fileHandleManager.getFileHandle(dirHandle, dirPath, true);

      // Get directory stats
      const dirStats = await asyncFs.stat(dirPath);
      const parentStats = await asyncFs.stat(parentPath);

      return {
        stats: toStatWithFileId(dirStats, handle!.nfsHandle),
        status: nfsstat3.OK,
        handle: handle!.nfsHandle,
        parentStats: toStatWithFileId(parentStats, dirHandle),
      };
      // } catch (err) {
      //   console.error(`Error creating directory: ${err}`);
      //   return {
      //     status: nfsstat3.ERR_IO,
      //   };
      // }
    },

    mknod: async (_dirHandle, _name, _type, _mode, _rdev) => {
      // knod should ony be used for special device files like NF3CHR, NF3BLK, NF3FIFO, NF3SOCK
      return {
        status: nfsstat3.ERR_NOTSUPP,
      };

      // NOTE We leave this in for future reference when we want to support special files
      // // console.log("Mknod handler called");
      // // Currently, only regular files are supported
      // if (type !== 1) {
      //   console.error(`Unsupported node type: ${type}`);
      //   return {
      //     status: nfsstat3.ERR_NOTSUPP,
      //   };
      // }

      // // Get the directory path from the handle
      // const dirPath = fileHandleManager.getPathFromHandle(dirHandle);
      // if (!dirPath) {
      //   console.error("Invalid directory handle");
      //   return {
      //     status: nfsstat3.ERR_STALE,
      //   };
      // }

      // if (dirPath.startsWith(".git")) {
      //   console.error("Invalid directory handle");
      //   return {
      //     status: nfsstat3.ERR_ACCES,
      //   };
      // }

      // // Construct the full file path
      // const filePath = path.join(dirPath, name);

      // // Check if the file already exists
      // if (await fileExists(filePath)) {
      //   console.error(`File already exists: ${filePath}`);
      //   return {
      //     status: nfsstat3.ERR_EXIST,
      //   };
      // }

      // try {
      //   // Create an empty file with specified mode
      //   await asyncFs.writeFile(filePath, "");
      //   await asyncFs.chmod(filePath, mode);

      //   // TODO this is not working because getFileHandle expects a handle to exist while write doesnt add one
      //   // Generate a file handle for the new file
      //   const fileHandle = fileHandleManager.getFileHandle(dirHandle, filePath);

      //   // Get file stats
      //   const fileStats = await asyncFs.stat(filePath);
      //   const dirStats = await asyncFs.stat(dirPath);

      //   return {
      //     status: nfsstat3.OK,
      //     handle: fileHandle!.nfsFd,
      //     stats: fileStats,
      //     dirStats,
      //   };
      // } catch (err) {
      //   console.error(`Error creating file: ${err}`);
      //   return {
      //     status: nfsstat3.ERR_IO,
      //   };
      // }
    },

    pathconf: async handle => {
      // console.log('Pathconf handler called');
      // Get the path from the handle
      const filePath = fileHandleManager.getPathFromHandle(handle);
      if (!filePath) {
        console.error('Invalid file handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if the file exists
      if (!(await fileExists(filePath))) {
        console.error(`File not found: ${filePath}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Get file stats
      const stats = await asyncFs.stat(filePath);

      // Return pathconf info with reasonable defaults
      return {
        status: nfsstat3.OK,
        stats: toStatWithFileId(stats, handle),
        linkMax: 32767, // Maximum link count
        nameMax: 255, // Maximum filename length
        noTrunc: true, // No truncation occurs
        chownRestricted: true, // chown is restricted
        caseInsensitive: false, // Case is significant
        casePreserving: true, // Case is preserved
      };
    },

    readdir: async (handle, cookie, _cookieVerf) => {
      // TODO readdir plus seems sufficient for macos clients?
      throw new Error('not implemented');

      // NOTE We leave this in for future reference when we want to support readdir

      // // console.log("Readdir handler called");
      // // Get the directory path from the handle
      // const dirPath = fileHandleManager.getPathFromHandle(handle);
      // if (!dirPath) {
      //   console.error("Invalid directory handle");
      //   return {
      //     status: nfsstat3.ERR_STALE,
      //   };
      // }

      // // Check if the directory exists
      // if (!(await fileExists(dirPath))) {
      //   console.error(`Directory not found: ${dirPath}`);
      //   return {
      //     status: nfsstat3.ERR_STALE,
      //   };
      // }

      // // Check if it's a directory
      // const stats = await asyncFs.stat(dirPath);
      // if (!stats.isDirectory()) {
      //   console.error(`Not a directory: ${dirPath}`);
      //   return {
      //     status: nfsstat3.ERR_NOTDIR,
      //   };
      // }

      // try {
      //   // Read directory entries
      //   const entries = await asyncFs.readdir(dirPath);

      //   // Skip entries before the cookie
      //   const startIndex = Number(cookie);
      //   const remainingEntries = entries.slice(startIndex);

      //   // Convert to DirEntry format
      //   const dirEntries: DirEntry[] = remainingEntries.map((name, index) => ({
      //     fileId: BigInt(startIndex + index + 1), // Simple file ID
      //     name,
      //     cookie: BigInt(startIndex + index + 1), // Cookie for continuation
      //   }));

      //   // Add . and .. if this is the first request
      //   if (startIndex === 0) {
      //     dirEntries.unshift(
      //       {
      //         fileId: BigInt(0),
      //         name: ".",
      //       },
      //       {
      //         fileId: BigInt(1),
      //         name: "..",
      //       },
      //     );
      //   }

      //   // Generate a new cookie verifier
      //   const newCookieVerf = Buffer.alloc(8);
      //   newCookieVerf.writeUInt32BE(0xdeadbeef, 0);
      //   newCookieVerf.writeUInt32BE(0xfeedface, 4);

      //   return {
      //     status: nfsstat3.OK,
      //     dirStats: stats,
      //     cookieVerifier: newCookieVerf,
      //     entries: dirEntries,
      //     eof: true, // Indicates we've sent all entries
      //   };
      // } catch (err) {
      //   console.error(`Error reading directory: ${err}`);
      //   return {
      //     status: nfsstat3.ERR_IO,
      //   };
      // }
    },

    readdirplus: async (
      handle /*, cookie, cookieVerf, dirCount, maxCount*/
    ) => {
      // console.log('Readdirplus handler called');
      // Get the directory path from the handle
      const dirPath = fileHandleManager.getPathFromHandle(handle);
      if (!dirPath) {
        console.error('Invalid directory handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if the directory exists
      if (!(await fileExists(dirPath))) {
        console.error(`Directory not found: ${dirPath}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if it's a directory
      const stats = await asyncFs.stat(dirPath);
      if (!stats.isDirectory()) {
        console.error(`Not a directory: ${dirPath}`);
        return {
          status: nfsstat3.ERR_NOTDIR,
        };
      }

      // Convert to DirEntryPlus format
      const dirEntries: DirEntryPlus[] = [];

      try {
        // Read directory entries
        const entries = await asyncFs.readdir(dirPath);
        // Add . and .. if this is the first request

        let parentHandle;
        if (!fileHandleManager.isRootHandle(handle)) {
          const parentPath = path.dirname(dirPath);
          parentHandle = fileHandleManager.getHandleByPath(parentPath)!;
          const dotdotStats = await asyncFs.stat(parentPath);
          // Add fileId property to dotdotStats

          dirEntries.unshift({
            name: '..',
            // cookie: BigInt(1),
            handle: parentHandle!.nfsHandle,
            stats: toStatWithFileId(dotdotStats, parentHandle!.nfsHandle),
          });
        }

        const dotHandle = fileHandleManager.getFileHandle(
          parentHandle?.nfsHandle,
          dirPath,
          true
        );
        const dotStats = await asyncFs.stat(dirPath);

        // console.log('building dir Entries.........');
        dirEntries.unshift({
          name: '.',
          // cookie: BigInt(0),
          handle: dotHandle!.nfsHandle,
          stats: toStatWithFileId(dotStats, dotHandle!.nfsHandle),
        });

        // // console.log("building dir Entries.........", dirEntries);

        for (const name of entries) {
          const entryPath = path.join(dirPath, name);
          try {
            const entryStats = await asyncFs.stat(entryPath);

            const entryHandle = fileHandleManager.getFileHandle(
              handle,
              entryPath,
              true
            );

            dirEntries.push({
              name,
              // cookie: fileId, // Optionally use fileId as cookie
              handle: entryHandle!.nfsHandle,

              stats: toStatWithFileId(entryStats, entryHandle!.nfsHandle),
            });
          } catch (err) {
            console.error(
              `Error getting stats for ${entryPath}: ${err}`,
              (err as any).stack
            );
            // Skip this entry
          }
        }

        // TODO take current index into account

        // Generate a new cookie verifier
        const newCookieVerf = Buffer.alloc(8);
        newCookieVerf.writeUInt32BE(0xdeadbeef, 0);
        newCookieVerf.writeUInt32BE(0xfeedface, 4);

        return {
          status: nfsstat3.OK,
          dirStats: toStatWithFileId(stats, handle),
          entries: dirEntries,
          cookieVerifier: newCookieVerf,
          eof: true, // Indicates if we've sent all entries
        };
      } catch (err) {
        console.error(`Error reading directory:`, err);
        return {
          status: nfsstat3.ERR_IO,
        };
      }
    },

    readlink: async handle => {
      // console.log('Readlink handler called');
      // Get the path from the handle
      const filePath = fileHandleManager.getPathFromHandle(handle);
      if (!filePath) {
        console.error('Invalid file handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if the file exists
      if (!(await fileExists(filePath))) {
        console.error(`File not found: ${filePath}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if it's a symbolic link
      const stats = await asyncFs.lstat(filePath);
      if (!stats.isSymbolicLink()) {
        console.error(`Not a symbolic link: ${filePath}`);
        return {
          status: nfsstat3.ERR_INVAL,
        };
      }

      try {
        // Read the symbolic link
        const linkPath = await asyncFs.readlink(filePath);

        return {
          status: nfsstat3.OK,
          path: linkPath,
          stats: toStatWithFileId(stats, handle),
        };
      } catch (err) {
        console.error(`Error reading symbolic link: ${err}`);
        return {
          status: nfsstat3.ERR_IO,
        };
      }
    },

    remove: async (dirHandle, name) => {
      // console.log('Remove handler called');
      // Get the directory path from the handle
      const dirPath = fileHandleManager.getPathFromHandle(dirHandle);
      if (!dirPath) {
        console.error('Invalid directory handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if the directory exists
      if (!(await fileExists(dirPath))) {
        console.error(`Directory not found: ${dirPath}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if it's a directory
      const dirStats = await asyncFs.stat(dirPath);
      if (!dirStats.isDirectory()) {
        console.error(`Not a Directory: ${dirPath}`);
        return {
          status: nfsstat3.ERR_NOTDIR,
        };
      }

      // Construct the full file path
      const filePath = path.join(dirPath, name);

      // Check if the file exists
      if (!(await fileExists(filePath))) {
        console.error(`File not found: ${filePath}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Check if it's a regular file
      const stats = await asyncFs.stat(filePath);
      if (!stats.isFile()) {
        console.error(`Not a regular file: ${filePath}`);
        // throw access error if trying to delete a folder
        return {
          status: nfsstat3.ERR_ACCES,
        };
      }

      try {
        // Remove the file
        await asyncFs.unlink(filePath);

        const handleToDelete = fileHandleManager.getHandleByPath(filePath);
        fileHandleManager.removeFileHandle(handleToDelete!.nfsHandle);

        // Get directory stats after removal
        const dirStatsAfter = await asyncFs.stat(dirPath);

        return {
          status: nfsstat3.OK,
          dirStatsBeforeChange: toStatWithFileId(dirStats, dirHandle),
          dirStatsAfterChange: toStatWithFileId(dirStatsAfter, dirHandle),
        };
      } catch (err) {
        console.error(`Error removing file: ${err}`);
        return {
          status: nfsstat3.ERR_IO,
        };
      }
    },

    rename: async (fromDirHandle, fromName, toDirHandle, toName) => {
      // console.log('Rename handler called');
      // Get the source directory path
      const fromDirPath = fileHandleManager.getPathFromHandle(fromDirHandle);
      if (!fromDirPath) {
        console.error('Invalid source directory handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Get the target directory path
      const toDirPath = fileHandleManager.getPathFromHandle(toDirHandle);
      if (!toDirPath) {
        console.error('Invalid target directory handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Construct the full source and target paths
      const fromPath = path.join(fromDirPath, fromName);
      const toPath = path.join(toDirPath, toName);

      // Check if the source exists
      if (!(await fileExists(fromPath))) {
        console.error(`Source not found: ${fromPath}`);
        return {
          status: nfsstat3.ERR_NOENT,
        };
      }

      // Get directory stats before rename
      const fromDirStats = await asyncFs.stat(fromDirPath);
      const toDirStats = await asyncFs.stat(toDirPath);

      try {
        // Rename the file/directory
        await asyncFs.rename(fromPath, toPath);
        fileHandleManager.rename(fromDirHandle, fromName, toDirHandle, toName);

        // Get directory stats after rename
        const fromDirStatsAfter = await asyncFs.stat(fromDirPath);
        const toDirStatsAfter = await asyncFs.stat(toDirPath);

        return {
          status: nfsstat3.OK,
          fromDirStatsBeforeChange: toStatWithFileId(
            fromDirStats,
            fromDirHandle
          ),
          fromDirStatsAfterChange: toStatWithFileId(
            fromDirStatsAfter,
            fromDirHandle
          ),
          toDirStatsBeforeChange: toStatWithFileId(toDirStats, toDirHandle),
          toDirStatsAfterChange: toStatWithFileId(toDirStatsAfter, toDirHandle),
        };
      } catch (err) {
        console.error(`Error renaming: ${err}`);
        return {
          status: nfsstat3.ERR_IO,
        };
      }
    },

    rmdir: async (dirHandle, name) => {
      // console.log('Rmdir handler called');
      // Get the directory path from the handle
      const parentPath = fileHandleManager.getPathFromHandle(dirHandle);
      if (!parentPath) {
        console.error('Invalid directory handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Construct the full directory path
      const dirPath = path.join(parentPath, name);

      // Check if the directory exists
      if (!(await fileExists(dirPath))) {
        console.error(`Directory not found: ${dirPath}`);
        return {
          status: nfsstat3.ERR_NOENT,
        };
      }

      // Check if it's a directory
      const stats = await asyncFs.stat(dirPath);
      if (!stats.isDirectory()) {
        console.error(`Not a directory: ${dirPath}`);
        return {
          status: nfsstat3.ERR_NOTDIR,
        };
      }

      // Get parent directory stats before removal
      const parentStats = await asyncFs.stat(parentPath);

      try {
        // Remove the directory
        await asyncFs.rmdir(dirPath);

        // Get parent directory stats after removal
        const parentStatsAfter = await asyncFs.stat(parentPath);

        return {
          status: nfsstat3.OK,
          dirStatsBeforeChange: toStatWithFileId(parentStats, dirHandle),
          dirStatsAfterChange: toStatWithFileId(parentStatsAfter, dirHandle),
        };
      } catch (err) {
        console.error(`Error removing directory: ${err}`);

        // Check if directory is not empty
        // @ts-expect-error -- error type
        if (err.code === 'ENOTEMPTY') {
          return {
            status: nfsstat3.ERR_NOTEMPTY,
          };
        }

        return {
          status: nfsstat3.ERR_IO,
        };
      }
    },

    symlink: async (dirHandle, name, symlink, _mode) => {
      // console.log('Symlink handler called');
      // Get the directory path from the handle
      const dirPath = fileHandleManager.getPathFromHandle(dirHandle);
      if (!dirPath) {
        console.error('Invalid directory handle');
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // Construct the full symlink path
      const symlinkPath = path.join(dirPath, name);

      // Check if the symlink already exists
      if (await fileExists(symlinkPath)) {
        console.error(`File already exists: ${symlinkPath}`);
        return {
          status: nfsstat3.ERR_EXIST,
        };
      }

      try {
        // Create the symbolic link
        await asyncFs.symlink(symlink, symlinkPath);

        // Generate a file handle for the new symlink
        const symHandle = fileHandleManager.getFileHandle(
          dirHandle,
          symlinkPath
        );

        // Get file stats
        const symStats = await asyncFs.lstat(symlinkPath);
        const dirStats = await asyncFs.stat(dirPath);

        return {
          status: nfsstat3.OK,
          handle: symHandle!.nfsHandle,
          stats: toStatWithFileId(symStats, symHandle!.nfsHandle),
          dirStats: toStatWithFileId(dirStats, dirHandle),
        };
      } catch (err) {
        console.error(`Error creating symbolic link: ${err}`);
        return {
          status: nfsstat3.ERR_IO,
        };
      }
    },

    commit: async ({ handle }) => {
      // console.log('Commit handler called');
      const fileHandle = fileHandleManager.getHandle(handle);
      if (fileHandle === undefined) {
        throw new Error('??');
      }

      const filePath = fileHandleManager.getPathFromHandle(handle);
      if (fileHandle.fsHandle.fh === undefined) {
        throw new Error(
          'a commit expects a write which should have realized the file ? ' +
            path
        );
      }

      const fsHandle = fileHandle.fsHandle.fh;

      await fsHandle.sync();
      await fsHandle.close();

      // get rid of the fh reference
      fileHandle.fsHandle.fh = undefined;

      const stats = await asyncFs.stat(filePath!);

      return {
        status: nfsstat3.OK,
        statsAfter: stats as any, // TODO check type!
      };
    },

    getAttributes: async handle => {
      const nfsHandle = fileHandleManager.getHandle(handle);

      if (!nfsHandle) {
        console.error(`Invalid file handle: ${handle.toString('hex')}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      let fsHandle = nfsHandle.fsHandle.fh;
      const filePath = fileHandleManager.getPathFromHandle(handle)!;
      // if (fsHandle === undefined) {
      //   const path = fileHandleManager.getPathFromHandle(handle)!;
      //   fsHandle = await asyncFs.open(path, 'r');
      // }

      // if (!fsHandle) {
      //   console.error(`Invalid file handle: ${handle.toString('hex')}`);
      //   return {
      //     status: nfsstat3.ERR_STALE,
      //   };
      // }

      // Check if the file exists
      try {
        const stats = await asyncFs.stat(filePath);

        return {
          status: nfsstat3.OK,
          stats: toStatWithFileId(stats, handle),
        };
      } catch (err) {
        console.error(`Error getting file stats: ${err}`);
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
          return {
            status: nfsstat3.ERR_STALE,
          };
        }
        return {
          status: nfsstat3.ERR_SERVERFAULT,
        };
      }
    },

    read: async (handle, offset = 0n, count) => {
      const nfsHandle = fileHandleManager.getHandle(handle);

      if (!nfsHandle) {
        console.error(`Invalid file handle: ${handle.toString('hex')}`);
        return {
          status: nfsstat3.ERR_STALE,
          error: new Error(`Invalid file handle: ${handle.toString('hex')}`),
        };
      }

      let fsHandle = nfsHandle.fsHandle.fh;

      let closeAfterRead = false;

      if (fsHandle === undefined) {
        closeAfterRead = true;
        const path = fileHandleManager.getPathFromHandle(handle)!;
        fsHandle = await asyncFs.open(path, 'r+');
      }

      try {
        const stats = await fsHandle.stat();

        // Create buffer to hold data
        const buffer = Buffer.alloc(count);

        // Read data from file
        const { bytesRead } = await fsHandle.read(
          buffer,
          0,
          count,
          Number(offset)
        );

        // Truncate buffer if we read less than requested
        const dataBuf = buffer.slice(0, bytesRead);

        // Check if we reached EOF
        const eof =
          bytesRead < count || Number(offset) + bytesRead >= stats.size;

        return {
          status: nfsstat3.OK,
          data: dataBuf,
          stats,
          eof,
        } as any;
      } catch (err) {
        // console.error(`Error reading file ${filePath}:`, err);
        // @ts-expect-error -- error type
        if (err.code === 'ENOENT') {
          return {
            status: nfsstat3.ERR_STALE,
            error: err,
          };
        }

        return {
          status: nfsstat3.ERR_SERVERFAULT,
          error: err,
        };
      } finally {
        if (closeAfterRead) {
          await fsHandle.close();
        }
      }
    },

    setattr: async (handle, attributes, guardCtime) => {
      const nfsHandle = fileHandleManager.getHandle(handle);

      if (!nfsHandle) {
        console.error(`Invalid file handle: ${handle.toString('hex')}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      let fsHandle = nfsHandle.fsHandle.fh;

      if (fsHandle === undefined) {
        const path = fileHandleManager.getPathFromHandle(handle)!;

        const pathStats = await asyncFs.stat(path);
        if (pathStats.isDirectory()) {
          // Throw if all attribute properties are undefined
          if (
            attributes.mode !== undefined &&
            attributes.uid !== undefined &&
            attributes.gid !== undefined &&
            attributes.size !== undefined &&
            attributes.atime !== undefined &&
            attributes.mtime !== undefined
          ) {
            throw new Error('At least one attribute property must be defined');
          }

          return {
            status: nfsstat3.OK,
            stats: pathStats as any,
          };
        }
        nfsHandle.fsHandle.fh = await asyncFs.open(path, 'a+');
        fsHandle = nfsHandle.fsHandle.fh;
      }

      if (!fsHandle) {
        console.error(`Invalid file handle: ${handle.toString('hex')}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      try {
        const statsBefore = await fsHandle.stat();
        // Check if guardCtime is specified
        if (guardCtime) {
          // guardtime allows to do optimitic locking based on ctime
          // it is currently not used by the mac client.
          throw new Error('guardCTime not yet supported');
        }

        // Apply attribute changes as needed
        if (attributes.mode !== undefined) {
          // console.log(`Changing mode to ${attributes.mode}`);
          await fsHandle.chmod(attributes.mode);
        }

        // if (attributes.uid !== undefined || attributes.gid !== undefined) {
        //   // console.log(
        //     `Changing owner to uid=${attributes.uid}, gid=${attributes.gid}`,
        //   );
        //   await unionFs.chown(
        //     filePath,
        //     attributes.uid !== undefined ? attributes.uid : -1,
        //     attributes.gid !== undefined ? attributes.gid : -1,
        //   );
        // }

        if (attributes.size !== undefined) {
          // console.log(`Truncating file to size ${attributes.size}`);
          // Get stats before truncating

          // Perform the truncation
          await fsHandle.truncate(Number(attributes.size));
        }

        if (attributes.atime !== undefined || attributes.mtime !== undefined) {
          if (
            attributes.atime?.getTime() === 0 &&
            attributes.mtime?.getTime() === 0
          ) {
            // magic set attribute to trigger sync on the client
            // console.log('skipp');
          } else {
            // Use current time for any unspecified time
            const atime = attributes.atime || statsBefore.atime;
            const mtime = attributes.mtime || statsBefore.mtime;

            await fsHandle.utimes(atime, mtime);
          }
        }

        // await fsHandle.datasync();
        // Get current file stats after changes
        const statsAfter = await fsHandle.stat();

        await fsHandle.close();

        // get rid of the fh reference
        nfsHandle.fsHandle.fh = undefined;

        return {
          status: nfsstat3.OK,
          stats: statsAfter as any,
        };
      } catch (err) {
        // Map Node.js file system errors to appropriate NFS errors
        // @ts-expect-error -- error type
        if (err.code === 'ENOENT') {
          return {
            status: nfsstat3.ERR_STALE,
          };
          // @ts-expect-error -- error type
        } else if (err.code === 'EACCES' || err.code === 'EPERM') {
          return {
            status: nfsstat3.ERR_ACCES,
          };
        } else {
          return {
            status: nfsstat3.ERR_SERVERFAULT,
          };
        }
      }
    },

    write: async (handle, offset, data, count, stableHow) => {
      const nfsHandle = fileHandleManager.getHandle(handle);

      if (!nfsHandle) {
        console.error(`Invalid file handle: ${handle.toString('hex')}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      let fsHandle = nfsHandle.fsHandle.fh;

      if (fsHandle === undefined) {
        const path = fileHandleManager.getPathFromHandle(handle)!;
        fsHandle = await asyncFs.open(path, 'r+');
        nfsHandle.fsHandle.fh = fsHandle;
      }

      if (!fsHandle) {
        console.error(`Invalid file handle: ${handle.toString('hex')}`);
        return {
          status: nfsstat3.ERR_STALE,
        };
      }

      // TODO proper dir check
      if (fsHandle.read === undefined) {
        return {
          status: 21, // NFS3ERR_ISDIR
        };
      }

      try {
        // const stats = await fileHandle.stat();

        // Write the data
        const { bytesWritten } = await fsHandle.write(
          data,
          0, // we always write from start of buffer
          data.length, // we always write the full buffer
          Number(offset) // offset is the offset in the file (NFS level)
        );

        if (stableHow !== 0) {
          // 0 = undestable, 1 = data sync, 2 = file sync
          await fsHandle.sync();
        }

        // Get updated file stats after write
        const newStats = await fsHandle.stat();

        return {
          status: nfsstat3.OK,
          bytesWritten,
          stats: newStats,
        } as any;
      } catch (err) {
        console.error(`Error writing to file ${fsHandle}:`, err);

        // Map Node.js file system errors to appropriate NFS errors
        // @ts-expect-error -- error type
        if (err.code === 'ENOSPC') {
          return {
            status: 28, // NFS3ERR_NOSPC
          }; // @ts-expect-error -- error type
        } else if (err.code === 'EROFS') {
          return {
            status: 30, // NFS3ERR_ROFS (read-only file system)
          }; // @ts-expect-error -- error type
        } else if (err.code === 'EACCES' || err.code === 'EPERM') {
          return {
            status: 13, // NFS3ERR_ACCES
          };
        } else {
          return {
            status: 10006, // NFS3ERR_SERVERFAULT
          };
        }
      }
    },
  };
};

function toStatWithFileId(
  stat: fsDisk.Stats,
  nfsHandle: Buffer<ArrayBufferLike>
) {
  const nfsHandleHex = nfsHandle.toString('hex').replace(/^0+/, '');
  const fileId = nfsHandleHex.length > 0 ? BigInt('0x' + nfsHandleHex) : 0n;

  let statWithFid = stat as fsDisk.Stats & { fileId: bigint };
  statWithFid.fileId = fileId;
  return statWithFid;
}
