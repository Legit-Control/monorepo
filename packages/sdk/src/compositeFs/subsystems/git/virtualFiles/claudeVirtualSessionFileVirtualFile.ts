import git from 'isomorphic-git';
import {
  tryResolveRef,
  resolveGitObjAtPath,
  buildUpdatedTree,
  toDirEntry,
} from './utils.js';
import { VirtualFileArgs, VirtualFileDefinition } from './gitVirtualFiles.js';

import { ENOENTError } from '../../../errors/ENOENTError.js';
import * as nodeFs from 'node:fs';
import { CompositeFs } from '../../../CompositeFs.js';
import { getCurrentBranch } from './getCurrentBranch.js';
import Dirent from 'memfs/lib/node/Dirent.js';
import { IDirent } from 'memfs/lib/node/types/misc.js';
import { decodeBranchNameFromVfs } from './operations/nameEncoding.js';
import { memfs } from 'memfs';

/**
 * Virtual file for claud session
 *
 * this serves everything under the .claude folder
 *
 * .claude
 *  ├── settings.json -> containing the config path to tell claude to store its session under .claude/session_ata
 *  └── session_data
 *       ├── debug -> appendonly files
 *       |    └──  [sesion_id].txt -> append debug logs (dont persist only in chache fs)
 *       ├── [user]
 *       |    └──  [sesion_id].jsonl -> append debug logs (dont persist only in chache fs)
 *
 */
export const claudeVirtualSessionFileVirtualFile: VirtualFileDefinition = {
  type: 'claudeVirtualSessionFileVirtualFile',
  rootType: 'folder',

  getStats: async ({ gitRoot, nodeFs, filePath, cacheFs, pathParams }) => {
    // Return folder stats for specific .claude paths regardless of cache
    const normalizedPath = filePath.replace(/\\/g, '/');
    if (
      normalizedPath.endsWith('.claude') ||
      normalizedPath.endsWith('.claude/session_data') ||
      normalizedPath.endsWith('.claude/session_data/debug') ||
      /\.claude\/session_data\/projects\/[^/]+$/.test(normalizedPath)
    ) {
      return {
        mode: 0o755 | 0o040000, // directory mode
        size: 0,
        isFile: () => false,
        isDirectory: () => true,
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSocket: () => false,
        isFIFO: () => false,
        dev: 0,
        ino: 0,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        blocks: 0,
        atimeMs: Date.now(),
        mtimeMs: Date.now(),
        ctimeMs: Date.now(),
        birthtimeMs: Date.now(),
        atime: new Date(),
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date(),
      } as any;
    }

    if (normalizedPath.endsWith('.claude/settings.json')) {
      // settings.json virtual file
      const settingsContent = JSON.stringify(
        {
          session_data_path: '.claude/session_data',
        },
        null,
        2
      );

      return {
        mode: 0o644,
        size: settingsContent.length,
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
        blocks: Math.ceil(settingsContent.length / 4096),
        atimeMs: Date.now(),
        mtimeMs: Date.now(),
        ctimeMs: Date.now(),
        birthtimeMs: Date.now(),
        atime: new Date(),
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date(),
      } as any;
    }

    const stat = await cacheFs.promises.stat(filePath);
    return stat as any;
    //   return {
    //     mode: stat.mode,
    //     size: stat.size,
    //     isFile: () => true,
    //     isDirectory: () => false,
    //     isSymbolicLink: () => false,
    //     isBlockDevice: () => false,
    //     isCharacterDevice: () => false,
    //     isSocket: () => false,
    //     isFIFO: () => false,
    //     isFileSync: () => true,
    //     isDirectorySync: () => false,
    //     dev: 0,
    //     ino: 0,
    //     nlink: 1,
    //     uid: 0,
    //     gid: 0,
    //     rdev: 0,
    //     blksize: 4096,
    //     blocks: Math.ceil(blob.length / 4096),
    //     atimeMs: pathCommitTimeMs,
    //     mtimeMs: pathCommitTimeMs,
    //     ctimeMs: pathCommitTimeMs,
    //     birthtimeMs: pathCommitTimeMs,
    //     atime: new Date(pathCommitTimeMs),
    //     mtime: new Date(pathCommitTimeMs),
    //     ctime: new Date(pathCommitTimeMs),
    //     birthtime: new Date(pathCommitTimeMs),
    //   } as any;
    // }
  },
  getFile: async ({ filePath, gitRoot, nodeFs, cacheFs, pathParams }) => {
    const normalizedPath = filePath.replace(/\\/g, '/');
    if (
      normalizedPath.endsWith('.claude') ||
      normalizedPath.endsWith('.claude/session_data') ||
      normalizedPath.endsWith('.claude/session_data/debug') ||
      /\.claude\/session_data\/projects\/[^/]+$/.test(normalizedPath)
    ) {
      await cacheFs.promises.mkdir(filePath, { recursive: true });
    }

    if (normalizedPath.endsWith('.claude/settings.json')) {
      // settings.json virtual file
      const settingsContent = JSON.stringify(
        {
          session_data_path: '.claude/session_data',
        },
        null,
        2
      );

      return {
        type: 'file',
        content: settingsContent,
        mode: 0o644,
        size: settingsContent.length,
        oid: 'unknown',
      } as any;
    }

    const stat = await cacheFs.promises.stat(filePath);
    if (stat.isFile()) {
      const content = await cacheFs.promises.readFile(filePath);
      const blob = content;

      return {
        type: 'file',
        content: content,
        mode: 0o644,
        size: blob.length,
        oid: 'unknown',
      };
    } else {
      const allEntries = (await cacheFs.promises.readdir(filePath, {
        withFileTypes: true,
      })) as IDirent[];

      if (normalizedPath.endsWith('.claude')) {
        // add settings.json virtual file if not exists
        const hasSettings = allEntries.find(
          entry => entry.name.toString() === 'settings.json'
        );
        if (!hasSettings) {
          allEntries.push(
            toDirEntry({
              name: 'settings.json',
              parent: filePath,
              isDir: false,
            })
          );
        }
      }
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
  },

  // TODO move to vfile
  unlink: async ({
    filePath,
    gitRoot,
    nodeFs,
    cacheFs,
    pathParams,
    author,
  }) => {},

  writeFile: async ({
    filePath,
    gitRoot,
    nodeFs,
    content,
    cacheFs,
    pathParams,
    author,
  }) => {
    await cacheFs.promises.writeFile(filePath, content);
  },

  rename: async function ({
    filePath,
    newPath,
    gitRoot,
    nodeFs,
    pathParams,
    newPathParams,
    author,
    cacheFs,
  }): Promise<void> {
    // Parse the path to get branch name and file path
    await cacheFs.promises.rename(filePath, newPath);
  },

  mkdir: async function (
    args: VirtualFileArgs & {
      options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null;
    }
  ): Promise<void> {
    await args.cacheFs.promises.mkdir(args.filePath, { recursive: true });
  },

  rmdir: async ({ filePath, gitRoot, nodeFs, cacheFs, pathParams, author }) => {
    await cacheFs.promises.rmdir(filePath);
  },
};
