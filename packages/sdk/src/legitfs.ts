import * as nodeFs from 'node:fs';
import { createLegitSyncService } from './sync/createLegitSyncService.js';
import git from '@legit-sdk/isomorphic-git';
import * as pako from 'pako';

interface ArchiveManifest {
  version: number;
  files: Record<string, string>; // base64 encoded binary data
}

import { CompositeFs } from './compositeFs/CompositeFs.js';
import { CopyOnWriteSubFs } from './compositeFs/subsystems/CopyOnWriteSubFs.js';
import { HiddenFileSubFs } from './compositeFs/subsystems/HiddenFileSubFs.js';
import { createFsFromVolume, Volume } from 'memfs';
import { createSessionManager, LegitUser } from './sync/sessionManager.js';
import { createGitConfigTokenStore } from './sync/createGitConfigTokenStore.js';
import { createBranchFileAdapter } from './compositeFs/subsystems/git/virtualFiles/gitBranchFileVirtualFile.js';
import { createBranchesListAdapter } from './compositeFs/subsystems/git/virtualFiles/gitBranchesListVirtualFile.js';
import { createBranchHeadAdapter } from './compositeFs/subsystems/git/virtualFiles/gitBranchHeadVirtualFile.js';
import { createLegitVirtualFileAdapter } from './compositeFs/subsystems/git/virtualFiles/legitVirtualFile.js';
import { createCommitFileAdapter } from './compositeFs/subsystems/git/virtualFiles/gitCommitFileVirtualFile.js';
import { createCommitFolderAdapter } from './compositeFs/subsystems/git/virtualFiles/gitCommitVirtualFolder.js';
import { createBranchOperationAdapter } from './compositeFs/subsystems/git/virtualFiles/operations/gitBranchOperationVirtualFile.js';

import { createBranchOperationsAdapter } from './compositeFs/subsystems/git/virtualFiles/operations/gitBranchOperationsVirtualFile.js';

import { createBranchHistoryAdapter } from './compositeFs/subsystems/git/virtualFiles/gitBranchHistory.js';
import { createBranchOperationHeadAdapter } from './compositeFs/subsystems/git/virtualFiles/operations/gitBranchOperationHeadVirtualFile.js';
import { createCurrentBranchAdapter } from './compositeFs/subsystems/git/virtualFiles/gitCurrentBranchVirtualFile.js';

import { FsOperationLogger } from './compositeFs/utils/fs-operation-logger.js';
import { createApplyChangesAdapter } from './compositeFs/subsystems/git/virtualFiles/gitApplyCurrentChangesToVirtualFile.js';
import { createReferenceBranchAdapter } from './compositeFs/subsystems/git/virtualFiles/gitReferenceBranchVirtualFile.js';
import { PassThroughToAsyncFsSubFs } from './compositeFs/subsystems/PassThroughToAsyncFsSubFs.js';
import { CompositeSubFs } from './compositeFs/CompositeSubFs.js';
import {
  LegitRouteFolder,
  PathRouteDescription,
} from './compositeFs/router/PathRouter.js';

function isLegitRouteFolder(
  value: PathRouteDescription | undefined
): value is LegitRouteFolder {
  return (
    typeof value === 'object' &&
    value !== null &&
    value !== undefined &&
    !Array.isArray(value)
  );
}

export function mergeLegitRouteFolders(
  a: LegitRouteFolder,
  b: LegitRouteFolder
): LegitRouteFolder {
  const result: LegitRouteFolder = { ...a };

  for (const key of Object.keys(b)) {
    const aVal = a[key];
    const bVal = b[key];

    if (
      aVal !== undefined &&
      isLegitRouteFolder(aVal) &&
      isLegitRouteFolder(bVal)
    ) {
      result[key] = mergeLegitRouteFolders(aVal, bVal);
    } else {
      // leaf conflict OR new key → b wins
      result[key] = bVal!;
    }
  }

  return result;
}

function getGitCache(fs: any): any {
  // If it's a CompositeFs with gitCache, use it
  if (fs && fs.gitCache !== undefined) {
    return fs.gitCache;
  }
  // If it has a parent, traverse up to find the gitCache
  if (fs && fs.parentFs) {
    return getGitCache(fs.parentFs);
  }
  // Default to empty object if no cache found
  return {};
}

// same props as openLegitFs
export async function openLegitFsWithMemoryFs(
  props?: Parameters<typeof openLegitFs>[0]
) {
  const memfsVolume = new Volume();
  const memfs = createFsFromVolume(memfsVolume);

  return openLegitFs({
    ...props,
    storageFs: props?.storageFs ? props.storageFs : (memfs as any),
    gitRoot: props?.gitRoot || '/',
  });
}

/**
 * Creates and configures a LegitFs instance with CompositeFs, GitSubFs, HiddenFileSubFs, and EphemeralSubFs.
 */
export async function openLegitFs({
  storageFs,
  gitRoot,
  anonymousBranch = 'anonymous',
  showKeepFiles = false,
  initialAuthor = {
    type: 'local',
    id: 'local',
    name: 'Local User',
    email: 'local@legitcontrol.com',
  },
  serverUrl = 'https://hub.legitcontrol.com',
  publicKey,
  ephemaralGitConfig = false,
  additionalFilterLayers,
  routeOverrides,
}: {
  storageFs: typeof nodeFs;
  gitRoot: string;
  anonymousBranch?: string;
  showKeepFiles?: boolean;
  initialAuthor?: LegitUser;
  serverUrl?: string;
  publicKey?: string;
  ephemaralGitConfig?: boolean;
  additionalFilterLayers?: CompositeSubFs[];
  routeOverrides?: LegitRouteFolder;
}) {
  let repoExists = await storageFs.promises
    .readdir(gitRoot + '/.git')
    .then(() => true)
    .catch(() => false);

  if (!repoExists) {
    // initiliaze git repo with anonyomous branch
    await git.init({
      fs: storageFs,
      dir: '/',
      defaultBranch: anonymousBranch,
    });
    await storageFs.promises.writeFile(gitRoot + '/.gitignore', '');
    await storageFs.promises.writeFile(gitRoot + '/.keep', '');
    await git.add({
      fs: storageFs,
      dir: '/',
      filepath: '.keep',
      cache: getGitCache(storageFs),
    });
    await git.commit({
      fs: storageFs,
      dir: '/',
      message: 'Initial commit',
      author: { name: 'Test', email: 'test@example.com' },
      cache: getGitCache(storageFs),
    });

    await git.setConfig({
      fs: storageFs,
      dir: gitRoot,
      path: 'init.defaultBranch',
      value: anonymousBranch,
    });
  }

  // Check if git config has author information, if not set it from initialAuthor
  let legitUserId = await git.getConfig({
    fs: storageFs,
    dir: gitRoot,
    path: 'user.legit_user_id',
  });
  if (!legitUserId) {
    await git.setConfig({
      fs: storageFs,
      dir: gitRoot,
      path: 'user.legit_user_id',
      value: initialAuthor.name,
    });
  }

  // Check if git config has author information, if not set it from initialAuthor
  let userName = await git.getConfig({
    fs: storageFs,
    dir: gitRoot,
    path: 'user.name',
  });
  if (!userName) {
    await git.setConfig({
      fs: storageFs,
      dir: gitRoot,
      path: 'user.name',
      value: initialAuthor.name,
    });
  }

  let userEmail = await git.getConfig({
    fs: storageFs,
    dir: gitRoot,
    path: 'user.email',
  });
  if (!userEmail) {
    await git.setConfig({
      fs: storageFs,
      dir: gitRoot,
      path: 'user.email',
      value: initialAuthor.email,
    });
  }

  // rootFs is the top-level CompositeFs
  // it propagates operations to the real filesystem (storageFs)
  // it allows the child copmositeFs to define file behavior while tunneling through to the real fs
  // this is used to be able to read and write within the .git folder while hiding it from the user

  // Create an in-memory filesystem for copy-on-write storage
  const copyFs = createFsFromVolume(new Volume());

  const rootCopyOnWriteFs = new CopyOnWriteSubFs({
    name: 'root-copy-on-write',

    sourceFs: storageFs,
    copyToFs: copyFs,
    copyToRootPath: '/copies',
    rootPath: gitRoot,
    patterns: ephemaralGitConfig ? ['**/.git/config'] : [],
  });

  const rootPassThroughFileSystem = new PassThroughToAsyncFsSubFs({
    name: 'root-passthrough',
    passThroughFs: storageFs,
    rootPath: gitRoot,
  });

  const gitStorageFs = new CompositeFs({
    name: 'root',
    filterLayers: [rootCopyOnWriteFs],
    rootPath: gitRoot,
    routes: {
      '[[...relativePath]]': rootPassThroughFileSystem,
    },
  });

  /**
   * Create adapters for each virtual file type
   * Each adapter wraps a single handler and receives route context from CompositeFs
   */

  const adapterConfig = {
    gitStorageFs: gitStorageFs,
    gitRoot: gitRoot,
    rootPath: gitRoot,
  };

  // .legit root folder files
  const legitVirtualFileAdapter = createLegitVirtualFileAdapter(adapterConfig);

  const operationAdapter = createBranchOperationAdapter(adapterConfig);

  const headAdapter = createBranchHeadAdapter(adapterConfig);

  const operationHeadAdapter = createBranchOperationHeadAdapter(adapterConfig);

  const operationHistoryAdapter = createBranchOperationsAdapter(adapterConfig);

  const historyAdapter = createBranchHistoryAdapter(adapterConfig);

  const currentBranchAdapter = createCurrentBranchAdapter(adapterConfig);
  const referenceBranchAdapter = createReferenceBranchAdapter(adapterConfig);

  const applyChangesAdapter = createApplyChangesAdapter(adapterConfig);

  // Branch files and folders
  const branchesListAdapter = createBranchesListAdapter(adapterConfig);

  const branchFileAdapter = createBranchFileAdapter(adapterConfig);

  // Commit files and folders
  const commitFolderAdapter = createCommitFolderAdapter(adapterConfig);

  const commitFileAdapter = createCommitFileAdapter(adapterConfig);

  const hiddenFiles = showKeepFiles ? ['.git'] : ['.git', '.keep'];
  const gitFsHiddenFs = new HiddenFileSubFs({
    name: 'git-hidden-subfs',
    hiddenFiles,
    rootPath: gitRoot,
  });

  // Read .gitignore file to add patterns to copy-on-write
  let gitignorePatterns: string[] = [];
  try {
    const gitignorePath = gitRoot + '/.gitignore';
    const gitignoreContent = await gitStorageFs.readFile(gitignorePath, 'utf8');
    gitignorePatterns = gitignoreContent
      .split('\n')
      .filter(line => line.trim() !== '' && !line.trim().startsWith('#'))
      .map(line => line.trim());
  } catch (error) {
    // .gitignore doesn't exist or can't be read, that's okay
  }

  const copyOnWritePatterns: string[] = [
    '**/._*',
    '**/.DS_Store',
    '**/.AppleDouble/',
    '**/.AppleDB',
    '**/.AppleDesktop',
    '**/.Spotlight-V100',
    '**/.TemporaryItems',
    '**/.Trashes',
    '**/.fseventsd',
    '**/.VolumeIcon.icns',
    '**/.ql_disablethumbnails',
    // libre office creates a lock file
    '**/.~lock.*',
    // libre office creates a temp file
    '**/lu[0-9a-zA-Z]*.tmp',
    // legit uses a tmp file as well
    '**/.metaentries.json.tmp',
    '**/**.tmp.**',
    '**/**.sb-**',
    ...gitignorePatterns, // Add patterns from .gitignore
  ];

  // Create an in-memory filesystem for copy-on-write storage
  const userCopyFs = createFsFromVolume(new Volume());

  const gitFsCopyOnWriteFs = new CopyOnWriteSubFs({
    name: 'git-copy-on-write-subfs',

    sourceFs: gitStorageFs,
    copyToFs: userCopyFs,
    copyToRootPath: '/user-copies',
    rootPath: gitRoot,
    patterns: copyOnWritePatterns,
  });

  const routeConfig = {
    '.legit': {
      '.': legitVirtualFileAdapter,
      operation: operationAdapter,
      head: headAdapter,
      operationHead: operationHeadAdapter,
      operationHistory: operationHistoryAdapter,
      history: historyAdapter,
      currentBranch: currentBranchAdapter,
      'reference-branch': referenceBranchAdapter,
      'apply-changes': applyChangesAdapter,
      branches: {
        '.': branchesListAdapter,
        '[branchName]': {
          // branch names could include / so this is not a good delimiter here
          '.legit': {
            '.': legitVirtualFileAdapter,
            operation: operationAdapter,
            head: headAdapter,
            operationHead: operationHeadAdapter,
            operationHistory: operationHistoryAdapter,
            history: historyAdapter,
          },
          '[[...filePath]]': branchFileAdapter,
        },
      },
      commits: {
        '.': commitFolderAdapter,
        '[sha_1_1_2]': {
          '.': commitFolderAdapter,
          '[sha1_3__40]': {
            '[[...filePath]]': commitFileAdapter,
          },
        },
      },
    },
    '[[...filePath]]': {
      '.': branchFileAdapter,
    },
  };

  const routes = routeOverrides
    ? mergeLegitRouteFolders(routeConfig, routeOverrides)
    : routeConfig;

  const userSpaceFs = new CompositeFs({
    name: 'git',
    rootPath: gitRoot,
    filterLayers: [
      gitFsHiddenFs,
      gitFsCopyOnWriteFs,
      ...(additionalFilterLayers || []),
    ],
    routes: routes,
  });

  const tokenStore = createGitConfigTokenStore({
    storageFs: gitStorageFs as any,
    gitRoot,
  });
  const sessionManager = createSessionManager(tokenStore, publicKey);

  let syncService = createLegitSyncService({
    fs: storageFs as any,
    gitRepoPath: gitRoot,
    serverUrl: serverUrl,
    auth: sessionManager,
    anonymousBranch,
  });

  if (publicKey) {
    // syncService.start();
  }

  const legitfs = Object.assign(userSpaceFs, {
    auth: sessionManager,
    sync: syncService,
    _storageFs: gitStorageFs,

    setLogger(logger: FsOperationLogger | undefined) {
      userSpaceFs.setLoggger(logger);
    },

    push: async (branches: string[]): Promise<void> => {
      //
    },
    shareCurrentBranch: async (): Promise<string> => {
      if ((await sessionManager.getUser()).type === 'local') {
        throw new Error(
          'login first - for example anonymously using legitfs.auth.signInAnonymously()'
        );
      }
      let branchToShare = await legitfs.getCurrentBranch();
      if (branchToShare === anonymousBranch) {
        branchToShare = (await sessionManager.getUser()).id;
        // create uuid (later call to server to get a session id)
        // rename current branch to uuid
        await git.renameBranch({
          fs: storageFs,
          dir: gitRoot,
          oldref: anonymousBranch,
          ref: branchToShare,
        });
      }

      await syncService.sequentialPush([branchToShare]);

      legitfs.setCurrentBranch(branchToShare);

      // push current branch to remote (no longer anonymous)
      return branchToShare;
    },
    setCurrentBranch: async (branch: string): Promise<void> => {
      // check if branch exists
      const branches = await git.listBranches({
        fs: storageFs,
        dir: gitRoot,
      });
      const branchExists = branches.includes(branch);
      if (!branchExists) {
        await syncService?.loadBranch(branch);
      }

      const branchesAfterLoad = await git.listBranches({
        fs: storageFs,
        dir: gitRoot,
      });
      const branchExistsAfter = branchesAfterLoad.includes(branch);
      console.log('branchExistsAfter', branchExistsAfter);
      if (!branchExistsAfter) {
        throw new Error(`Branch ${branch} does not exist`);
      }

      // if successfull - set branch
      await git.setConfig({
        fs: storageFs,
        dir: gitRoot,
        path: 'init.defaultBranch',
        value: branch,
      });
    },
    getCurrentBranch: async (): Promise<string> => {
      // returns the current user branch
      const branch = await git.getConfig({
        fs: storageFs,
        dir: gitRoot,
        path: 'init.defaultBranch',
      });
      if (!branch) {
        throw new Error('No current branch set');
      }
      return branch!;
    },

    /**
     *
     * This function takes a legit archive - earlier compressed with saveArchive and writes it to storage fs.
     *
     * Refs that can be fast forwarded should get updeted - referecences that cannot be fast forwarded create a ref named branchname-conflict-uuid.
     * New Refs should be added. (TODO how do we handle deleted refs to prevent them from coming back?)
     *
     * The git config should get ignored for now
     *
     * @param legitArchieve a zlib compressed legit repo
     */
    loadArchive: async ({
      legitArchive: legitArchive,
      clearExisting = false,
    }: {
      legitArchive: Uint8Array;
      clearExisting?: boolean;
    }): Promise<void> => {
      // Decompress the archive
      const decompressed = pako.inflate(legitArchive);
      const text = new TextDecoder().decode(decompressed);
      const manifest = JSON.parse(text) as ArchiveManifest;

      // Get existing refs before we start modifying
      const existingRefsMap = new Map<string, string>();
      if (!clearExisting) {
        try {
          const existingBranches = await git.listBranches({
            fs: storageFs,
            dir: gitRoot,
          });
          for (const branch of existingBranches) {
            const oid = await git.resolveRef({
              fs: storageFs,
              dir: gitRoot,
              ref: branch,
            });
            existingRefsMap.set(branch, oid);
          }
        } catch (e) {
          // Ignore if no branches exist yet
        }
      } else {
        // clear existing .git folder
        const gitFolderPath = `${gitRoot}/.git`;
        const entries = await storageFs.promises.readdir(gitFolderPath, {
          withFileTypes: true,
        });

        for (const entry of entries) {
          const fullPath = `${gitFolderPath}/${entry.name}`;

          if (entry.isDirectory()) {
            await storageFs.promises.rm(fullPath, {
              recursive: true,
              force: true,
            });
          } else if (entry.isFile()) {
            await storageFs.promises.unlink(fullPath);
          }
        }
      }

      // Process each file in the archive
      for (const [relativePath, base64Content] of Object.entries(
        manifest.files
      )) {
        const fullPath = `${gitRoot}/.git/${relativePath}`;

        // Skip config files as per spec
        if (relativePath === 'config') {
          continue;
        }

        // Decode base64 content to binary
        const content = Buffer.from(base64Content, 'base64');

        // Special handling for refs/heads/
        if (
          relativePath.startsWith('refs/heads/') ||
          relativePath.startsWith('refs/tags/')
        ) {
          const refName = relativePath.replace(/^refs\/(heads|tags)\//, '');

          // Check if this is a new ref or an existing one
          if (!existingRefsMap.has(refName)) {
            // New ref - just write it
            await storageFs.promises.mkdir(
              fullPath.split('/').slice(0, -1).join('/'),
              { recursive: true }
            );
            await storageFs.promises.writeFile(fullPath, content);
          } else {
            // Existing ref - check if we can fast-forward
            const existingOid = existingRefsMap.get(refName)!;
            const newOid = content.toString('utf-8').trim();

            try {
              // Check if newOid is a descendant of existingOid (fast-forward check)
              // If newOid is a descendant of existingOid, we can fast-forward
              const isDescendant = await git.isDescendent({
                fs: storageFs,
                dir: gitRoot,
                oid: newOid,
                ancestor: existingOid,
              });

              if (isDescendant || existingOid === newOid) {
                // Can fast-forward or already up to date
                await storageFs.promises.writeFile(fullPath, content);
              } else {
                // Cannot fast-forward - create conflict branch
                const conflictBranchName = `${refName}-conflict-${crypto.randomUUID()}`;
                const conflictRefPath = `${gitRoot}/.git/refs/heads/${conflictBranchName}`;
                await storageFs.promises.mkdir(
                  conflictRefPath.split('/').slice(0, -1).join('/'),
                  { recursive: true }
                );
                await storageFs.promises.writeFile(conflictRefPath, content);
              }
            } catch (e) {
              // If we can't verify, assume it's not fast-forwardable and create conflict
              const conflictBranchName = `${refName}-conflict-${crypto.randomUUID()}`;
              const conflictRefPath = `${gitRoot}/.git/refs/heads/${conflictBranchName}`;
              await storageFs.promises.mkdir(
                conflictRefPath.split('/').slice(0, -1).join('/'),
                { recursive: true }
              );
              await storageFs.promises.writeFile(conflictRefPath, content);
            }
          }
        } else {
          // For non-ref files, just write them directly
          await storageFs.promises.mkdir(
            fullPath.split('/').slice(0, -1).join('/'),
            { recursive: true }
          );
          await storageFs.promises.writeFile(fullPath, content);
        }
      }
    },

    /**
     * creates a legit archieve - a compressed representation of the legit repo (the .git folder in the storage fs)
     *
     * @returns
     */
    saveArchive: async (): Promise<Uint8Array> => {
      const manifest: ArchiveManifest = {
        version: 1,
        files: {},
      };

      // Recursively read all files in .git folder
      async function readDirectoryRecursive(
        dirPath: string,
        relativePath: string = ''
      ) {
        const entries = await storageFs.promises.readdir(dirPath, {
          withFileTypes: true,
        });

        for (const entry of entries) {
          const fullPath = `${dirPath}/${entry.name}`;
          const entryRelativePath = relativePath
            ? `${relativePath}/${entry.name}`
            : entry.name;

          if (entry.isDirectory()) {
            await readDirectoryRecursive(fullPath, entryRelativePath);
          } else if (entry.isFile()) {
            // Read as binary (Buffer/Uint8Array) and encode as base64
            const content = await storageFs.promises.readFile(fullPath);
            manifest.files[entryRelativePath] =
              Buffer.from(content).toString('base64');
          }
        }
      }

      const gitFolderPath = `${gitRoot}/.git`;
      try {
        await readDirectoryRecursive(gitFolderPath);
      } catch (e) {
        // If .git doesn't exist or can't be read, return empty archive
        console.warn('Failed to read .git folder:', e);
      }

      // Serialize and compress
      const jsonString = JSON.stringify(manifest);
      const encoder = new TextEncoder();
      const data = encoder.encode(jsonString);
      const compressed = pako.deflate(data);

      return compressed;
    },
  });

  return legitfs;
}
