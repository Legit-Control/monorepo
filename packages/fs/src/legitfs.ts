import * as nodeFs from 'node:fs';

import { CompositeFs } from './compositeFs/CompositeFs.js';
import { EphemeralSubFs } from './compositeFs/subsystems/EphemeralFileSubFs.js';
import { GitSubFs } from './compositeFs/subsystems/git/GitSubFs.js';
import { HiddenFileSubFs } from './compositeFs/subsystems/HiddenFileSubFs.js';

/**
 * Creates and configures a LegitFs instance with CompositeFs, GitSubFs, HiddenFileSubFs, and EphemeralSubFs.
 */
export function createLegitFs(storageFs: typeof nodeFs, gitRoot: string) {
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
    parentFs: rootFs,
    gitRoot,
    ephemeralPatterns: [],
  });

  const rootHiddenFs = new HiddenFileSubFs({
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
  });

  const gitSubFs = new GitSubFs({
    // while the git subfs is a subFs of the userSpaceFs - it operates on the rootFs to be able to read and write the .git folder
    parentFs: rootFs,
    gitRoot: gitRoot,
  });

  const gitFsHiddenFs = new HiddenFileSubFs({
    parentFs: userSpaceFs,
    gitRoot,
    hiddenFiles: ['.git'],
  });

  const gitFsEphemeralFs = new EphemeralSubFs({
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
    ],
  });

  // Add legitFs to compositFs
  userSpaceFs.addSubFs(gitSubFs);
  userSpaceFs.setHiddenFilesSubFs(gitFsHiddenFs);
  userSpaceFs.setEphemeralFilesSubFs(gitFsEphemeralFs);

  return userSpaceFs;
}
