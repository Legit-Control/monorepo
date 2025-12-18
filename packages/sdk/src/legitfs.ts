import * as nodeFs from 'node:fs';
import { createLegitSyncService } from './sync/createLegitSyncService.js';
import git from 'isomorphic-git';

import { CompositeFs } from './compositeFs/CompositeFs.js';
import { EphemeralSubFs } from './compositeFs/subsystems/EphemeralFileSubFs.js';
import { GitSubFs } from './compositeFs/subsystems/git/GitSubFs.js';
import { HiddenFileSubFs } from './compositeFs/subsystems/HiddenFileSubFs.js';
import { createFsFromVolume, Volume } from 'memfs';
import { createSessionManager, LegitUser } from './sync/sessionManager.js';
import { createGitConfigTokenStore } from './sync/createGitConfigTokenStore.js';
import { gitBranchFileVirtualFile } from './compositeFs/subsystems/git/virtualFiles/gitBranchFileVirtualFile.js';
import { gitBranchesListVirtualFile } from './compositeFs/subsystems/git/virtualFiles/gitBranchesListVirtualFile.js';
import { gitBranchHeadVirtualFile } from './compositeFs/subsystems/git/virtualFiles/gitBranchHeadVirtualFile.js';
import { legitVirtualFile } from './compositeFs/subsystems/git/virtualFiles/legitVirtualFile.js';
import { gitCommitFileVirtualFile } from './compositeFs/subsystems/git/virtualFiles/gitCommitFileVirtualFile.js';
import { gitCommitVirtualFolder } from './compositeFs/subsystems/git/virtualFiles/gitCommitVirtualFolder.js';
import { gitBranchOperationVirtualFile } from './compositeFs/subsystems/git/virtualFiles/operations/gitBranchOperationVirtualFile.js';

import { gitBranchOperationsVirtualFile } from './compositeFs/subsystems/git/virtualFiles/operations/gitBranchOperationsVirtualFile.js';
import { getThreadName } from './compositeFs/subsystems/git/virtualFiles/operations/getThreadName.js';
import { gitBranchHistory } from './compositeFs/subsystems/git/virtualFiles/gitBranchHistory.js';
import { gitBranchOperationHeadVirtualFile } from './compositeFs/subsystems/git/virtualFiles/operations/gitBranchOperationHeadVirtualFile.js';
import { gitCurrentBranchVirtualFile } from './compositeFs/subsystems/git/virtualFiles/gitCurrentBranchVirtualFile.js';
import { claudeVirtualSessionFileVirtualFile } from './compositeFs/subsystems/git/virtualFiles/claudeVirtualSessionFileVirtualFile.js';
import {
  createFsOperationFileLogger,
  FsOperationLogger,
} from './compositeFs/utils/fs-operation-logger.js';
import { gitApplyCurrentChangesToVirtualFile } from './compositeFs/subsystems/git/virtualFiles/gitApplyCurrentChangesToVirtualFile.js';
import { gitReferenceBranchVirtualFile } from './compositeFs/subsystems/git/virtualFiles/gitReferenceBranchVirtualFile.js';

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
  serverUrl = 'https://sync.legitcontrol.com',
  publicKey,
  claudeHandler,
  ephemaralGitConfig = false,
}: {
  storageFs: typeof nodeFs;
  gitRoot: string;
  anonymousBranch?: string;
  showKeepFiles?: boolean;
  initialAuthor?: LegitUser;
  serverUrl?: string;
  publicKey?: string;
  claudeHandler?: boolean;
  ephemaralGitConfig?: boolean;
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
  const gitStorageFs = new CompositeFs({
    name: 'root',
    // the root CompositeFs has no parent - it doesn't propagate up

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storageFs,
    gitRoot,
  });

  // Initialize gitCache
  gitStorageFs.gitCache = {};

  const rootEphemeralFs = new EphemeralSubFs({
    name: 'root-ephemeral',
    parentFs: gitStorageFs,
    gitRoot,
    ephemeralPatterns: ephemaralGitConfig ? ['**/.git/config'] : [],
  });

  const rootHiddenFs = new HiddenFileSubFs({
    name: 'root-hidden',
    parentFs: gitStorageFs,
    gitRoot,
    hiddenFiles: [],
  });

  gitStorageFs.setHiddenFilesSubFs(rootHiddenFs);
  gitStorageFs.setEphemeralFilesSubFs(rootEphemeralFs);

  if (ephemaralGitConfig) {
    const config = await storageFs.promises.readFile(gitRoot + '/.git/config', {
      encoding: 'utf-8',
    });
    await gitStorageFs.writeFile(gitRoot + '/.git/config', config, 'utf-8');
  }

  const userSpaceFs = new CompositeFs({
    name: 'git',
    storageFs: gitStorageFs as any,
    gitRoot: gitRoot,
    defaultBranch: anonymousBranch,
  });
  userSpaceFs.gitCache = {};

  const routerConfig = {
    '.legit': {
      '.': legitVirtualFile,
      operation: gitBranchOperationVirtualFile,
      head: gitBranchHeadVirtualFile,
      operationHead: gitBranchOperationHeadVirtualFile,
      operationHistory: gitBranchOperationsVirtualFile,
      history: gitBranchHistory,
      currentBranch: gitCurrentBranchVirtualFile,
      'reference-branch': gitReferenceBranchVirtualFile,
      'apply-changes': gitApplyCurrentChangesToVirtualFile,tar
      branches: {
        '.': gitBranchesListVirtualFile,
        '[branchName]': {
          // branch names could include / so this is not a good delimiter here
          '.legit': {
            '.': legitVirtualFile,
            operation: gitBranchOperationVirtualFile,
            head: gitBranchHeadVirtualFile,
            operationHead: gitBranchOperationHeadVirtualFile,
            operationHistory: gitBranchOperationsVirtualFile,
            history: gitBranchHistory,
            threadName: getThreadName,
          },
          '[[...filePath]]': gitBranchFileVirtualFile,
        },
      },
      commits: {
        '.': gitCommitVirtualFolder,
        '[sha_1_1_2]': {
          '.': gitCommitVirtualFolder,
          '[sha1_3__40]': {
            '[[...filePath]]': gitCommitFileVirtualFile,
          },
        },
      },
      // TODO add a compare setup
      // compare: {
      //   '[[aWithB]]': {
      //     '.legit': {
      //       'changelist': getChangeList,
      //     }, // gitCompareVirtualFile,
      //     '[...filePath]': gitCompareVirtualFile,
      //   }
      // }
    },
    '.claude': {
      '[[...filePath]]': claudeVirtualSessionFileVirtualFile,
    },
    '[[...filePath]]': gitBranchFileVirtualFile,
  };

  if (!claudeHandler && routerConfig['.claude']) {
    // @ts-ignore
    // NOTE the order of the config currently matters :-/
    delete routerConfig['.claude'];
  }

  const gitSubFs = new GitSubFs({
    name: 'git-subfs',
    parentFs: userSpaceFs,
    gitRoot: gitRoot,
    gitStorageFs: gitStorageFs,
    routerConfig,
  });

  const hiddenFiles = showKeepFiles ? ['.git'] : ['.git', '.keep'];
  const gitFsHiddenFs = new HiddenFileSubFs({
    name: 'git-hidden-subfs',
    parentFs: userSpaceFs,
    gitRoot,
    hiddenFiles,
  });

  const ephemeralPatterns: string[] = [
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
  ];

  const gitFsEphemeralFs = new EphemeralSubFs({
    name: 'git-ephemeral-subfs',
    parentFs: userSpaceFs,
    gitRoot,
    ephemeralPatterns,
  });

  // Add legitFs to compositFs
  userSpaceFs.addSubFs(gitSubFs);
  userSpaceFs.setHiddenFilesSubFs(gitFsHiddenFs);
  userSpaceFs.setEphemeralFilesSubFs(gitFsEphemeralFs);

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
  });

  return legitfs;
}
