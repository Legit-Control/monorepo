import * as path from 'path';
import { Buffer } from 'buffer';
import { FileHandle } from 'fs/promises';

type FsHandleEntry = {
  pathSegment: string;
  fh: FileHandle | undefined;
  unstable: boolean;
  parentNfsHandle: string | null;
};

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

  const isRootHandle = (handle: Buffer): boolean => {
    const handleHex = handle.toString('hex');
    if (handleHex === rootNfsHandle) {
      return true;
    }
    return false;
  };

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
