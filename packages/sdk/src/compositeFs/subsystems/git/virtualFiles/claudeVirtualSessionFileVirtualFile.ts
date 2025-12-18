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

const SESSION_DATA_PATH = 'session_data';

const settingsContent = JSON.stringify(
  {
    env: { CLAUDE_CONFIG_DIR: `.claude/${SESSION_DATA_PATH}` },
  },
  null,
  2
);

/**
 * Virtual file for claud session
 *
 * this serves everything under the .claude folder
 *
 * .claude
 *  ├── settings.json -> containing the config path to tell claude to store its session under .claude/session_ata
 *  └── session_data
 *       ├── debug -> appendonly files
 *       |    └──  [sesion_id].txt -> append debug logs (dont persist only in chache fs) - example: d01fb69a-a987-4b53-9caf-3c49ce3a3504.txt
 *       ├── projects
 *       |    ├── [working-path] -> The current path where / is replaced with -
 *       |    |    └──  [sesion_id].jsonl -> append debug logs (dont persist only in chache fs)
 *       ├── todos -> not sure what this is for yet
 *
 *
 * # Claude legit flow:
 *  - start legit box
 *  - open the legit version of the repo folder
 *  - create a feature branch (to work on a feature / or main if you have the nuts)
 *  - set the feature branch as the reference branch by writing to .legit/reference-branch
 *     -> TODO implement "reference-branch"
 *  - set current branch to "claude.[reference-branch]" by writing to .legit/current-branch
 *     -> this will take the reference branch tip to start the branch
 *        -> TODO implement the logic to branch of from reference branch
 *     -> this will give the agent the place to write
 *  - NOTE: for now you can have only one session per reference-branch
 *  - write hash from head to .legit/apply-changes - this should update the tree in reference branch with the changes from head
 *    -> and will create a new commit on the current-branch pointing to head and to the reference branch commit
 */
export const claudeVirtualSessionFileVirtualFile: VirtualFileDefinition = {
  type: 'claudeVirtualSessionFileVirtualFile',
  rootType: 'folder',

  getStats: async ({ gitRoot, nodeFs, filePath, cacheFs, pathParams }) => {
    // Return folder stats for specific .claude paths regardless of cache
    const normalizedPath = filePath.replace(/\\/g, '/');
    if (
      normalizedPath.endsWith('.claude') ||
      normalizedPath.endsWith(`.claude/${SESSION_DATA_PATH}`) ||
      normalizedPath.endsWith(`.claude/${SESSION_DATA_PATH}/debug`) ||
      normalizedPath.endsWith(`.claude/${SESSION_DATA_PATH}/projects`) ||
      new RegExp(`\\.claude\\/${SESSION_DATA_PATH}\\/projects\\/[^/]+$`).test(
        normalizedPath
      )
    ) {
      const epoch = new Date(0);
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
        atimeMs: 0,
        mtimeMs: 0,
        ctimeMs: 0,
        birthtimeMs: 0,
        atime: epoch,
        mtime: epoch,
        ctime: epoch,
        birthtime: epoch,
      } as any;
    }

    const epoch = new Date(0);
    if (normalizedPath.endsWith('.claude/settings.json')) {
      // settings.json virtual file

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
        atimeMs: epoch,
        mtimeMs: epoch,
        ctimeMs: epoch,
        birthtimeMs: epoch,
        atime: epoch,
        mtime: epoch,
        ctime: epoch,
        birthtime: epoch,
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
      normalizedPath.endsWith('.claude/session_data/projects') ||
      normalizedPath.endsWith('.claude/session_data/debug') ||
      /\.claude\/session_data\/projects\/[^/]+$/.test(normalizedPath)
    ) {
      await cacheFs.promises.mkdir(filePath, { recursive: true });
    }

    if (normalizedPath.endsWith('.claude/settings.json')) {
      return {
        type: 'file',
        content: settingsContent,
        mode: 0o644,
        size: settingsContent.length,
        oid: 'unknown',
      } as any;
    }

    try {
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

          const hasSessionData = allEntries.find(
            entry => entry.name.toString() === SESSION_DATA_PATH
          );
          if (!hasSettings) {
            allEntries.push(
              toDirEntry({
                name: SESSION_DATA_PATH,
                parent: filePath,
                isDir: true,
              })
            );
          }
        }

        if (normalizedPath.endsWith('.claude' + `/${SESSION_DATA_PATH}`)) {
          const hasSettings = allEntries.find(
            entry => entry.name.toString() === 'projects'
          );
          if (!hasSettings) {
            allEntries.push(
              toDirEntry({
                name: 'projects',
                parent: filePath,
                isDir: true,
              })
            );
          }
        }

        if (
          normalizedPath.endsWith('.claude' + `/${SESSION_DATA_PATH}/projects`)
        ) {
          const hasSettings = allEntries.find(
            entry => entry.name.toString() === 'projects'
          );
          if (!hasSettings) {
            const projectPath = normalizedPath.replace(
              `.claude/${SESSION_DATA_PATH}/projects`,
              ''
            );
            allEntries.push(
              toDirEntry({
                name: projectPath.replaceAll('/', '-'),
                parent: filePath,
                isDir: true,
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
    } catch (err) {
      return;
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
  }) => {
    await cacheFs.promises.unlink(filePath);
  },

  writeFile: async ({
    filePath,
    gitRoot,
    nodeFs,
    content,
    cacheFs,
    userSpaceFs,
    pathParams,
    author,
  }) => {
    // if (filePath.endsWith('.claude/settings.json')) {
    const normalizedPath = filePath.replace(/\\/g, '/');

    const sesssionFileRegex = /\/projects\/([^/]+)\/([^/]+\.jsonl)$/;

    const match = normalizedPath.match(sesssionFileRegex);

    if (match) {
      const folder = match[1];
      const file = match[2];

      console.log({ folder, file });

      const cached = await cacheFs.promises
        .stat(filePath)
        .then(() => true)
        .catch(() => false);

      if (!cached) {
        // check if the branch for the file exists
        // load session file content from commit history
        await cacheFs.promises.writeFile(filePath, '');
      }

      // substract existing content from new content and write new content to branch, update file content
      const currentContent = (await cacheFs.promises.readFile(
        filePath,
        'utf-8'
      )) as string;

      const lines = currentContent.split('\n');
      if (lines.length > 1) {
        const lastLine = lines[lines.length - 2] || '';

        // await cacheFs.promises.appendFile(filePath, appendedContent);

        const parsed = JSON.parse(lastLine);

        let textualDesscription = '';

        if (parsed.type === 'user') {
          // Check if this is a tool result (AI action result) or actual user input
          const content = parsed.message?.content;
          const isToolResult =
            Array.isArray(content) && content[0]?.type === 'tool_result';

          if (isToolResult) {
            // This is a tool result from an AI action
            const toolResult = content[0];
            const resultContent =
              typeof toolResult.content === 'string'
                ? toolResult.content
                : JSON.stringify(toolResult.content);
            textualDesscription = `👾 Tool Result (${parsed.toolUseResult?.type || 'unknown'}): ${resultContent}\n\n---\n\n`;
          } else {
            // This is actual user input
            const userMessage =
              typeof content === 'string'
                ? content
                : content?.[0]?.content || 'User action';
            textualDesscription = `👤 ${userMessage}\n\n---\n\n`;
          }
        } else if (parsed.type === 'assistant') {
          // Extract assistant message content
          const assistantContent = parsed.message?.content?.[0];
          let description = '';

          if (assistantContent?.type === 'text') {
            description = assistantContent.text;
          } else if (assistantContent?.type === 'tool_use') {
            description = `Used tool: ${assistantContent.name} with input: ${JSON.stringify(assistantContent.input)}`;
          } else {
            description = 'Assistant response';
          }

          textualDesscription = `👾 ${description}\n\n---\n\n`;
        } else if (parsed.type === 'file-history-snapshot') {
          textualDesscription = `System: File history snapshot for message ${parsed.messageId}\n\n---\n\n`;
        } else {
          textualDesscription = `System: ${parsed.type || 'unknown action'}\n\n---\n\n`;
        }

        await userSpaceFs.promises.writeFile(
          gitRoot + '/.legit/operation',
          textualDesscription + lastLine
        );
      }
    } else {
      console.log('No match');
      await cacheFs.promises.writeFile(filePath, content);
    }
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
    // done by outer system await cacheFs.promises.rmdir(filePath);
  },
};
