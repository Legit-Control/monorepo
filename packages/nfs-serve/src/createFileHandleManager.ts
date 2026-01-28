import * as path from 'path';
import { Buffer } from 'buffer';
import { FileHandle } from 'fs/promises';

/**
 * Internal file handle entry structure
 *
 * Maps an NFS handle to filesystem metadata and state.
 *
 * @property pathSegment - The filename or directory name (not full path)
 * @property fh - Node.js FileHandle object (undefined if file not open)
 * @property unstable - True if file has unstable (uncommitted) data from WRITE operation
 * @property parentNfsHandle - Hex string of parent directory's handle (null for root)
 */
type FsHandleEntry = {
  pathSegment: string;
  fh: FileHandle | undefined;
  unstable: boolean;
  parentNfsHandle: string | null;
};

/**
 * Creates a file handle manager for NFSv3 server
 *
 * The file handle manager maintains the mapping between NFS file handles
 * (opaque identifiers sent to clients) and filesystem paths. It implements
 * a tree structure where each handle has a parent reference, allowing
 * reconstruction of full paths from handles.
 *
 * **Handle Format**: 128-character hexadecimal strings representing
 * monotonically increasing integers (padded with zeros).
 *
 * **Example**: "0000...001", "0000...002", etc.
 *
 *
 * @param rootPath - The root directory path that this manager serves
 *                   (all handles are relative to this path)
 * @param startingHandle - The starting integer for handle generation
 *                        (useful for persistence across restarts)
 *
 * @returns A file handle manager object with methods for handle operations
 *
 * @example
 * ```typescript
 * const manager = createFileHandleManager('/srv/nfs', 1);
 *
 * // Get handle for a file
 * const { nfsHandle, fsHandle } = manager.getFileHandle(
 *   parentBuffer,
 *   '/srv/nfs/file.txt',
 *   true  // create if not exists
 * );
 *
 * // Convert handle to path
 * const path = manager.getPathFromHandle(nfsHandle);
 * // Returns: '/srv/nfs/file.txt'
 * ```
 */
export const createFileHandleManager = (
  // we use the root path to identify the root handle
  rootPath: string,
  startingHandle: number
) => {
  let currentFileHandle = startingHandle;
  const nfsHandleToFsHandle = new Map<string, FsHandleEntry>();

  const rootFsHandle: FsHandleEntry = {
    pathSegment: '',
    fh: undefined,
    unstable: false,
    parentNfsHandle: null,
  };

  const rootHandle = currentFileHandle.toString(16).padStart(128, '0');
  currentFileHandle++;
  nfsHandleToFsHandle.set(rootHandle, rootFsHandle);
  const rootNfsHandle = rootHandle;

  /**
   * Checks if a given handle is the root handle
   *
   * @param handle - The NFS handle buffer to check
   * @returns true if the handle is the root handle, false otherwise
   */
  const isRootHandle = (handle: Buffer): boolean => {
    const handleHex = handle.toString('hex');
    if (handleHex === rootNfsHandle) {
      return true;
    }
    return false;
  };

  /**
   * Converts an NFS file handle to a filesystem path
   *
   * Walks up the parent chain from the given handle, collecting path segments,
   * and joins them with the root path to construct the full filesystem path.
   *
   ** Algorithm:
   * 1. If handle is root, return rootPath
   * 2. Look up handle entry in map
   * 3. Walk parent chain backwards, collecting pathSegment values
   * 4. Join segments with rootPath
   *
   * **Performance**: O(d) where d is the directory depth
   *
   * @param handle - The NFS handle buffer to convert
   * @returns The full filesystem path, or null if handle not found
   *
   * @example
   * ```typescript
   * const handle = Buffer.from('0000...005', 'hex');
   * const path = getPathFromHandle(handle);
   * // Returns: '/srv/nfs/home/user/file.txt'
   * ```
   */
  const getPathFromHandle = (handle: Buffer): string | null => {
    if (isRootHandle(handle)) {
      return rootPath;
    }

    const handleHex = handle.toString('hex');
    const handleEntry = nfsHandleToFsHandle.get(handleHex);
    if (!handleEntry) {
      console.error(`Handle ${handleHex.substring(0, 16)}... not found in map`);
      return null;
    }

    const segments: string[] = [];
    let currentHandleHex = handleHex;

    while (currentHandleHex) {
      const entry = nfsHandleToFsHandle.get(currentHandleHex);
      if (!entry) throw new Error('invalid parent');

      if (entry.pathSegment) {
        segments.unshift(entry.pathSegment);
      }

      if (!entry.parentNfsHandle) break;
      currentHandleHex = entry.parentNfsHandle;
    }

    return path.join(rootPath, ...segments);
  };

  const fileHandleManager = {
    rootPath,
    getPathFromHandle,

    /**
     * Retrieves the handle entry for a given NFS handle
     *
     * Looks up the handle in the internal map and returns both the
     * NFS handle (as Buffer) and the associated entry.
     *
     * @param parentHandle - The NFS handle buffer to look up
     * @returns An object containing the NFS handle and its entry,
     *          or undefined if the handle is not found
     */
    getHandle(parentHandle: Buffer) {
      const handle = parentHandle.toString('hex');
      const fsHandle = nfsHandleToFsHandle.get(handle || '');
      return fsHandle
        ? {
            nfsHandle: Buffer.from(handle, 'hex'),
            fsHandle,
          }
        : undefined;
    },

    /**
     * Finds the NFS handle for a given filesystem path
     *
     * Converts a filesystem path to an NFS handle by:
     * 1. Making path relative to rootPath
     * 2. Splitting into segments
     * 3. Traversing from root, finding handle for each segment
     *
     * **Performance**: O(n × m) where n = total handles, m = path depth
     * - Linear search through ALL handles for EACH path segment
     * - Very inefficient for large filesystems
     *
     * @param filePath - The absolute filesystem path to look up
     * @returns An object with nfsHandle and fsHandle, or undefined if not found
     *
     * @example
     * ```typescript
     * const result = getHandleByPath('/srv/nfs/home/user/file.txt');
     * // Returns: { nfsHandle: Buffer, fsHandle: FsHandleEntry }
     * ```
     */
    getHandleByPath: (filePath: string) => {
      const relativePath = path.relative(rootPath, filePath);
      const segments = relativePath.split(path.sep);
      let currentHandle = rootNfsHandle;

      if (segments.length === 1 && segments[0] === '') {
        return {
          nfsHandle: Buffer.from(currentHandle, 'hex'),
          fsHandle: nfsHandleToFsHandle.get(currentHandle || ''),
        };
      }

      for (const segment of segments) {
        let found = false;
        for (const [handleHex, handle] of nfsHandleToFsHandle.entries()) {
          if (
            handle.pathSegment === segment &&
            handle.parentNfsHandle === currentHandle
          ) {
            currentHandle = handleHex;
            found = true;
            break;
          }
        }

        if (!found) {
          return undefined;
        }
      }

      return {
        nfsHandle: Buffer.from(currentHandle, 'hex'),
        fsHandle: nfsHandleToFsHandle.get(currentHandle || ''),
      };
    },

    /**
     * Updates handle metadata when a file/directory is renamed or moved
     *
     * Modifies the handle entry to reflect the new parent and name.
     * Clears any open FileHandle to force reopening on next access.
     *
     * @param fromHandle - The parent directory handle of the source
     * @param fromName - The current name of the file/directory
     * @param toHandle - The parent directory handle of the destination
     * @param toName - The new name for the file/directory
     *
     * @example
     * ```typescript
     * // Rename /home/user/old.txt → /home/user/new.txt
     * rename(parentHandle, "old.txt", parentHandle, "new.txt");
     * ```
     */
    rename(
      fromHandle: Buffer,
      fromName: string,
      toHandle: Buffer,
      toName: string
    ) {
      const targetParentFsHandle = fileHandleManager.getHandle(toHandle)!;
      const oldHandleEntry = fileHandleManager.getFileHandle(
        fromHandle,
        fromName
      )!;

      oldHandleEntry.fsHandle!.parentNfsHandle =
        targetParentFsHandle.nfsHandle.toString('hex');
      oldHandleEntry.fsHandle!.pathSegment = toName;

      oldHandleEntry.fsHandle!.fh = undefined;
    },

    /**
     * Gets or creates a handle for a file within a parent directory
     *
     * Searches for an existing handle with the given parent and filename.
     * If not found and create=true, creates a new handle. If not found and
     * create=false, throws an error.
     *
     * **Performance**: O(n) linear search through all handles
     *
     * @param parentHandle - The parent directory's NFS handle (undefined for root)
     * @param filePath - Full path to file (only the basename is used)
     * @param create - If true, create handle when it doesn't exist
     * @returns An object with nfsHandle and fsHandle
     * @throws Error if handle not found and create=false
     *
     * @example
     * ```typescript
     * // Get existing handle
     * const handle = getFileHandle(parentBuffer, '/srv/nfs/file.txt', false);
     *
     * // Create new handle if needed
     * const handle = getFileHandle(parentBuffer, '/srv/nfs/new.txt', true);
     * ```
     */
    getFileHandle: (
      parentHandle: Buffer | undefined,
      filePath: string,
      create: boolean = false
    ) => {
      const fileName = path.basename(filePath);
      const parentHex = parentHandle?.toString('hex');

      for (const [handleHex, handle] of nfsHandleToFsHandle.entries()) {
        if (
          handle.pathSegment === fileName &&
          (handle.parentNfsHandle === parentHex ||
            (handle.parentNfsHandle === rootNfsHandle &&
              parentHex === undefined))
        ) {
          return {
            nfsHandle: Buffer.from(handleHex, 'hex'),
            fsHandle: nfsHandleToFsHandle.get(handleHex || ''),
          };
        }
      }

      if (create) {
        const createdHandle = fileHandleManager.addFileHandle(
          parentHandle ? parentHandle : Buffer.from(rootNfsHandle, 'hex'),
          fileName
        );

        return createdHandle;
      }

      throw new Error('handle not found');
    },

    isRootHandle,

    /**
     * Removes a file handle and all its descendants from the manager
     *
     * Recursively deletes the handle and all handles whose parentNfsHandle
     * points to it. This is used when deleting directories.
     *
     * **Validation**:
     * - Checks handle exists before removal
     * - Prevents removing root handle
     *
     * @param handle - The NFS handle buffer to remove
     * @throws Error if handle doesn't exist or is root handle
     *
     * @example
     * ```typescript
     * // Remove directory and all children
     * removeFileHandle(dirHandle);
     * ```
     */
    removeFileHandle(handle: Buffer) {
      const handleHex = handle.toString('hex');

      if (!nfsHandleToFsHandle.has(handleHex)) {
        throw new Error('File handle does not exist');
      }

      // Prevent removing root handle
      if (handleHex === rootNfsHandle) {
        throw new Error('Cannot remove root file handle');
      }

      // Remove all child handles recursively
      for (const [childHex, entry] of Array.from(
        nfsHandleToFsHandle.entries()
      )) {
        if (entry.parentNfsHandle === handleHex) {
          this.removeFileHandle(Buffer.from(childHex, 'hex'));
        }
      }

      nfsHandleToFsHandle.delete(handleHex);
    },

    /**
     * Adds a new file handle to the manager
     *
     * Creates a new handle with an auto-incrementing integer and adds it
     * to the handle map. The handle is associated with a parent directory.
     *
     * **Validation**:
     * - Checks parent exists
     * - Prevents duplicate handles (same parent + segment)
     *
     * **Handle Generation**:
     * - Increments counter
     * - Converts to hex string
     * - Pads to 128 characters with leading zeros
     *
     * @param parentHandle - The parent directory's NFS handle
     * @param pathSegment - The filename or directory name (not full path)
     * @returns An object with the new nfsHandle and its entry
     * @throws Error if parent doesn't exist or handle already exists
     *
     * @example
     * ```typescript
     * // Create handle for "file.txt" in directory
     * const { nfsHandle, fsHandle } = addFileHandle(parentBuffer, "file.txt");
     * // nfsHandle: Buffer('0000...005')
     * ```
     */
    addFileHandle(parentHandle: Buffer, pathSegment: string) {
      const parentHandleHex = parentHandle.toString('hex');

      if (!nfsHandleToFsHandle.has(parentHandleHex)) {
        throw new Error('Parent file handle does not exist');
      }

      for (const handle of nfsHandleToFsHandle.values()) {
        if (
          handle.parentNfsHandle === parentHandleHex &&
          handle.pathSegment === pathSegment
        ) {
          throw new Error('Handle for the segment existed');
        }
      }

      currentFileHandle++;
      const handleHex = currentFileHandle.toString(16).padStart(128, '0');

      const entry: FsHandleEntry = {
        pathSegment,
        fh: undefined,
        unstable: false,
        parentNfsHandle: parentHandleHex,
      };

      nfsHandleToFsHandle.set(handleHex, entry);

      return {
        nfsHandle: Buffer.from(handleHex, 'hex'),
        fsHandle: entry,
      };
    },
  };

  return fileHandleManager;
};
