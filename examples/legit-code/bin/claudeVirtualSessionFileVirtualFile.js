import { CompositeSubFsAdapter } from '@legit-sdk/core';
import { currentBranch } from '@legit-sdk/isomorphic-git';
import { createFsFromVolume, Volume } from 'memfs';

export const sessionDataPath = '.claude-session';

/**
 * @param {{ name: any; parent: any; isDir: any; }} args
 */
export function toDirEntry(args) {
  return {
    name: args.name,
    isFile: () => !args.isDir,
    isDirectory: () => args.isDir,
    isBlockDevice: () => true,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
    parentPath: args.parent,
    path: args.parent,
  };
}

/**
 * Creates a CompositeSubFsAdapter for Claude virtual session file operations
 *
 * This adapter handles the .claude folder for Claude AI session management,
 * including settings, debug logs, and project-specific session data.
 *
 * .claude
 *  ├── settings.json -> containing the config path to tell claude to store its session under .claude/session_ata
 *  └── session_data
 *       ├── debug -> appendonly files
 *       |    └──  [sesion_id].txt -> append debug logs (dont persist only in chache fs) - example: d01fb69a-a987-4b53-9caf-3c49ce3a3504.txt
 *       ├── projects
 *       |    └── [working-path] -> The current path where / is replaced with -
 *       |         └──  [sesion_id].jsonl -> append debug logs (dont persist only in chache fs)
 *       └──  todos -> not sure what this is for yet
 *
 *
 * # Claude legit flow:
 *  - start legit box
 *  - open the legit version of the repo folder
 *  - create a feature branch (to work on a feature / or main if you are nuts)
 *  - set the feature branch as the reference branch by writing to .legit/reference-branch
 *  - set current branch to "claude.[reference-branch]" by writing to .legit/current-branch
 *     -> this will take the reference branch tip to start the branch
 *     -> this will give the agent the place to write
 *  - NOTE: for now you can have only one session per reference-branch
 *  - write hash from head to .legit/apply-changes - this should update the tree in reference branch with the changes from head
 *    -> and will create a new commit on the current-branch pointing to head and to the reference branch commit
 * @example
 * ```ts
 * const adapter = createClaudeVirtualSessionFileAdapter({
 *   gitStorageFs: memFs,
 *   gitRoot: '/my-repo',
 * });
 * ```
 */
export function createClaudeVirtualSessionFileAdapter({
  gitStorageFs,
  gitRoot,
  rootPath,
}) {
  // Create isolated in-memory filesystem for Claude session files
  // This prevents session data from polluting the shared cacheFs
  const claudeVolume = Volume.fromJSON({});
  const claudeMemFs = createFsFromVolume(claudeVolume);

  const adapter = new CompositeSubFsAdapter({
    name: 'claude-virtual-session-file',
    gitStorageFs,
    gitRoot,
    rootPath: rootPath || gitRoot,
    handler: {
      type: 'claudeVirtualSessionFileVirtualFile',
      rootType: 'folder',

      getStats: async ({ filePath, cacheFs, pathParams, userSpaceFs }) => {
        console.log('getStats called for path:', filePath);
        // Return folder stats for specific .claude paths regardless of cache
        const normalizedPath = filePath.replace(/\\/g, '/');
        if (
          normalizedPath.endsWith(`${sessionDataPath}`) ||
          normalizedPath.endsWith(`${sessionDataPath}/projects`) ||
          normalizedPath.endsWith(`${sessionDataPath}/debug`) ||
          new RegExp(`${sessionDataPath}\\/projects\\/[^/]+$`).test(
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
          };
        }

        if (
          new RegExp(
            `${sessionDataPath}\\/projects\\/[^/]+\\/[0-9a-fA-F-]{36}\\.jsonl$`
          ).test(normalizedPath)
        ) {
          console.log('getStats for session project file:', filePath);

          // Check if this is the special UUID file
          const filename = normalizedPath.split('/').pop();
          if (filename === '00000000-0000-0000-0000-000000000000.jsonl') {
            // Check if file exists in claudeMemFs
            const fileExists = await claudeMemFs.promises
              .stat(filePath)
              .then(() => true)
              .catch(() => false);

            if (!fileExists) {
              console.log(
                'Creating initial session file with UUID 00000000-0000-0000-0000-000000000000.jsonl'
              );
              // Create parent directory if it doesn't exist
              await claudeMemFs.promises.mkdir(
                filePath.substring(0, filePath.lastIndexOf('/')),
                { recursive: true }
              );

              const historyPath =
                userSpaceFs.rootPath + '/.legit/operationHistory';
              const historyContentRaw = await userSpaceFs.readFile(
                historyPath,
                'utf-8'
              );
              const history = JSON.parse(historyContentRaw || '[]');

              const entries = history.map(entry => {
                return entry.message.split('\n\n---\n\n \n\n ')[1];
              });

              const entriesReversed = entries.reverse();

              const initialContent = entriesReversed.join('');

              // // Write initial content - split into multiple JSON lines
              // const line1 =
              //   '{"type":"summary","summary":"Codebase Exploration and Familiarization","leafUuid":"fc1640cd-a759-4ed0-bf17-bc4a0cd1b7bb"}';
              // const line2 =
              //   '{"parentUuid":null,"isSidechain":false,"userType":"external","cwd":"/Users/martinlysk/legit/sample-repos/new-jan-nfs","sessionId":"ee8fddb4-df24-43f6-87d3-939457a6942c","version":"2.0.27","gitBranch":"","type":"user","message":{"role":"user","content":"tesst"},"uuid":"cc60f59a-7933-4bf3-92c7-8b6bbd751d41","timestamp":"2026-01-17T08:18:44.851Z","thinkingMetadata":{"level":"high","disabled":false,"triggers":[]}}';
              // const line3 =
              //   '{"parentUuid":"cb3ed72f-0edb-4e5a-8d4c-3204694c1cfd","isSidechain":true,"userType":"external","cwd":"/Users/martinlysk/legit/sample-repos/new-jan-nfs","sessionId":"ee8fddb4-df24-43f6-87d3-939457a6942c","version":"2.0.27","gitBranch":"","message":{"id":"msg_20260117161844427171c0d74848cc","type":"message","role":"assistant","model":"glm-4.5-air","content":[{"type":"text","text":"I\'ll help you explore this codebase. Let me start by getting an overview of the directory structure and then we can search for specific files or content based on your needs.\\n\\n```bash\\nBash\\ncommand: find /Users/martinlysk/legit/sample-repos/new-jan-nfs -type f -name \\"*.py\\" -o -name \\"*.js\\" -o -name \\"*.ts\\" -o -name \\"*.json\\" -o -name \\"*.md\\" -o -name \\"*.txt\\" -o -name \\"*.yml\\" -o -name \\"*.yaml\\" | head -20\\ndescription: List first 20 common code files in the repository\\n```\\n\\n```bash\\nBash\\ncommand: ls -la /Users/martinlysk/legit/sample-repos/new-jan-nfs\\ndescription: List directory contents\\n```\\n\\n```bash\\nBash\\ncommand: find /Users/martinlysk/legit/sample-repos/new-jan-nfs -type f | wc -l\\ndescription: Count total number of files in the repository\\n```\\n\\n```bash\\nBash\\ncommand: find /Users/martinlysk/legit/sample-repos/new-jan-nfs -type d | head -10\\ndescription: List first 10 directories in the repository\\n```\\n\\nBased on the initial exploration, this repository appears to be a new project structure. I can see we have:\\n\\n- **Total files**: The repo\\n... (truncated)\\n\\nJust let me know what you\'re looking for and I\'ll use the appropriate search methods to find it.\\"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":150,"output_tokens":660,"cache_read_input_tokens":452,"server_tool_use":{"web_search_requests":0}}},"type":"assistant","uuid":"2f8ebfd3-3776-4ed4-b994-4865d17d7163","timestamp":"2026-01-17T08:19:04.183Z"}';

              // const initialContent = line1 + '\n' + line2 + '\n' + line3 + '\n';

              console.log('writing content to session file:', initialContent);

              await claudeMemFs.promises.writeFile(filePath, initialContent);
            }
          }
        }

        const epoch = new Date(0);

        const stat = await claudeMemFs.promises.stat(filePath);
        return stat;
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
        //   };
        // }
      },
      getFile: async ({ filePath, gitRoot, nodeFs, cacheFs, pathParams }) => {
        console.log('getFile called for path:', filePath);
        const normalizedPath = filePath.replace(/\\/g, '/');
        // if (normalizedPath.endsWith('.claude/settings.json')) {
        //   return {
        //     type: 'file',
        //     content: settingsContent,
        //     mode: 0o644,
        //     size: settingsContent.length,
        //     oid: 'unknown',
        //   };
        // }

        if (
          normalizedPath.endsWith(`${sessionDataPath}`) ||
          normalizedPath.endsWith(`${sessionDataPath}/projects`) ||
          normalizedPath.endsWith(`${sessionDataPath}/debug`) ||
          new RegExp(`${sessionDataPath}\\/projects\\/[^/]+$`).test(
            normalizedPath
          )
        ) {
          await claudeMemFs.promises.mkdir(filePath, { recursive: true });
        }
        try {
          const stat = await claudeMemFs.promises.stat(filePath);
          if (stat.isFile()) {
            const content = await claudeMemFs.promises.readFile(filePath);
            const blob = content;

            return {
              type: 'file',
              content: content,
              mode: 0o644,
              size: blob.length,
              oid: 'unknown',
            };
          } else {
            const allEntries = await claudeMemFs.promises.readdir(filePath, {
              withFileTypes: true,
            });

            if (normalizedPath.endsWith('.claude')) {
              // add settings.json virtual file if not exists
              const hasSettings = allEntries.find(
                entry => entry.name.toString() === 'settings.json'
              );
              if (!hasSettings) {
                allEntries.push(
                  // @ts-ignore
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
                  // @ts-ignore
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
              normalizedPath.endsWith(
                '.claude' + `/${SESSION_DATA_PATH}/projects`
              )
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
        console.log('unlink called for path:', filePath);
        await claudeMemFs.promises.unlink(filePath);
      },

      writeFile: async ({
        filePath,
        gitRoot,

        content,
        cacheFs,
        userSpaceFs,
        pathParams,
        author,
      }) => {
        console.log('writeFile called for path:', filePath);
        // if (filePath.ends
        // With('.claude/settings.json')) {
        const normalizedPath = filePath.replace(/\\/g, '/');

        const sesssionFileRegex = /\/projects\/([^/]+)\/([^/]+\.jsonl)$/;

        const match = normalizedPath.match(sesssionFileRegex);

        if (match) {
          const folder = match[1];
          const file = match[2];

          console.log({ folder, file });

          // check if a 0000 file exists - and our current file name branches away - we resume an existing session and claude seem to
          // fork a new session from the current one?

          const cached = await claudeMemFs.promises
            .stat(filePath)
            .then(() => true)
            .catch(() => false);

          if (!cached) {
            // check if the branch for the file exists
            // load session file content from commit history
            await claudeMemFs.promises.mkdir(
              filePath.substring(0, filePath.lastIndexOf('/')),
              { recursive: true }
            );
            await claudeMemFs.promises.writeFile(filePath, '');
          }

          const isResumedSession = await claudeMemFs.promises
            .stat(
              filePath.split('/').slice(0, -1).join('/') +
                '/00000000-0000-0000-0000-000000000000.jsonl'
            )
            .then(() => true)
            .catch(() => false);

          if (
            (isResumedSession &&
              file === '00000000-0000-0000-0000-000000000000.jsonl') ||
            !isResumedSession
          ) {
            await claudeMemFs.promises.writeFile(filePath, content);

            const lines = content.toString().split('\n');
            if (lines.length > 1) {
              const lastLine = lines[lines.length - 2] || '';

              // await cacheFs.promises.appendFile(filePath, appendedContent);

              let parsed;
              try {
                parsed = JSON.parse(lastLine);
              } catch (error) {
                console.error('Error parsing JSON line:', error);
                return;
              }

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

              console.log('operation wrtingin test to file with desscription:');
              await userSpaceFs.promises.writeFile(
                gitRoot + '/.legit/operation',

                textualDesscription + ' \n\n ' + lastLine
              );
            }
          } else {
            await claudeMemFs.promises.writeFile(filePath, content);
          }
        } else {
          console.log('No match');
          await claudeMemFs.promises.mkdir(
            filePath.substring(0, filePath.lastIndexOf('/')),
            { recursive: true }
          );
          await claudeMemFs.promises.writeFile(filePath, content);
        }
      },

      rename: async function ({
        filePath,
        newPath,
        gitRoot,

        pathParams,
        newPathParams,
        author,
        cacheFs,
      }) {
        console.log('rename called for path:', filePath);
        // Parse the path to get branch name and file path
        await claudeMemFs.promises.rename(filePath, newPath);
      },

      mkdir: async function (args) {
        console.log('unlink called for path:', args.filePath);
        // Use isolated memfs instance for .claude directory operations
        await claudeMemFs.promises.mkdir(args.filePath, { recursive: true });
      },

      rmdir: async ({ filePath, gitRoot, cacheFs, pathParams, author }) => {
        await claudeMemFs.promises.rmdir(filePath);

        // done by outer system await cacheFs.promises.rmdir(filePath);
      },
    },
  });

  adapter.responsible = async filePath => {
    let normalizedPath = filePath
      .replace(/\\/g, '/')
      .replace(new RegExp(`^${gitRoot.replace(/\\/g, '/')}`), '');

    if (gitRoot === '/') {
      normalizedPath = '/' + normalizedPath;
    }
    return normalizedPath.startsWith('/.claude');
  };

  return adapter;
}
