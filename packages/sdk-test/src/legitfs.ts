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
import {
  createFsOperationFileLogger,
  FsOperationLogger,
} from './compositeFs/utils/fs-operation-logger.js';

export async function initMemFSLegitFs() {
  const memfsVolume = new Volume();
  const memfs = createFsFromVolume(memfsVolume);

  return await openLegitFs({
    storageFs: memfs as unknown as typeof nodeFs,
    gitRoot: '/',
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
}: {
  storageFs: typeof nodeFs;
  gitRoot: string;
  anonymousBranch?: string;
  showKeepFiles?: boolean;
  initialAuthor?: LegitUser;
  serverUrl?: string;
  publicKey?: string;
}) {
  let repoExists = await storageFs.promises
    .readdir(gitRoot + '/.git')
    .then(() => true)
    .catch(() => false);

  if (!repoExists) {
    // initiliaze git repo with anonyomous branch
    await git.init({ fs: storageFs, dir: '/', defaultBranch: anonymousBranch });
    await storageFs.promises.writeFile(gitRoot + '/.keep', '');
    await git.add({ fs: storageFs, dir: '/', filepath: '.keep' });
    await git.commit({
      fs: storageFs,
      dir: '/',
      message: 'Initial commit',
      author: { name: 'Test', email: 'test@example.com' },
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
  const rootFs = new CompositeFs({
    name: 'root',
    // the root CompositeFs has no parent - it doesn't propagate up
    parentFs: undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storageFs,
    gitRoot,
  });

  const rootEphemeralFs = new EphemeralSubFs({
    name: 'root-ephemeral',
    parentFs: rootFs,
    gitRoot,
    ephemeralPatterns: [],
  });

  const rootHiddenFs = new HiddenFileSubFs({
    name: 'root-hidden',
    parentFs: rootFs,
    gitRoot,
    hiddenFiles: [],
  });

  rootFs.setHiddenFilesSubFs(rootHiddenFs);
  rootFs.setEphemeralFilesSubFs(rootEphemeralFs);

  const userSpaceFs = new CompositeFs({
    name: 'git',
    parentFs: rootFs,
    storageFs: undefined,
    gitRoot: gitRoot,
    defaultBranch: anonymousBranch,
  });

  const gitSubFs = new GitSubFs({
    name: 'git-subfs',
    parentFs: userSpaceFs,
    gitRoot: gitRoot,
    gitStorageFs: rootFs,
  });

  const hiddenFiles = showKeepFiles ? ['.git'] : ['.git', '.keep'];
  const gitFsHiddenFs = new HiddenFileSubFs({
    name: 'git-hidden-subfs',
    parentFs: userSpaceFs,
    gitRoot,
    hiddenFiles,
  });

  const gitFsEphemeralFs = new EphemeralSubFs({
    name: 'git-ephemeral-subfs',
    parentFs: userSpaceFs,
    gitRoot,
    ephemeralPatterns: [
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
      '**/**.sb-**',
    ],
  });

  // Add legitFs to compositFs
  userSpaceFs.addSubFs(gitSubFs);
  userSpaceFs.setHiddenFilesSubFs(gitFsHiddenFs);
  userSpaceFs.setEphemeralFilesSubFs(gitFsEphemeralFs);

  const tokenStore = createGitConfigTokenStore({ storageFs, gitRoot });
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

    setLogger(logger: FsOperationLogger | undefined) {
      rootFs.setLoggger(logger);
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
      const branches = await git.listBranches({ fs: storageFs, dir: gitRoot });
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
