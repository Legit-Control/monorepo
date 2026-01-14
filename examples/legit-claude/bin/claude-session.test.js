import { describe, it, expect, beforeEach } from 'vitest';

import { Volume, createFsFromVolume } from 'memfs';
import * as isogit from '@legit-sdk/isomorphic-git';
import { openLegitFs, openLegitFsWithMemoryFs } from '@legit-sdk/core';
import { createClaudeVirtualSessionFileAdapter } from './claudeVirtualSessionFileVirtualFile.js';

const repoPath = '/repo';
const files = {
  '/a.txt': 'A file',
  '/f/b.txt': 'B file',
  '/f/c.txt': 'C file',
};

// .legit/branches/main/.legit/operation <- new commit may also creates the operation branch if not exists
// creates the branch legit____main-operation -> commits with operation in commit message
// mv('legit____main-operation', 'legit__my_awesem_branch_name__main-operation)
// writeFile('.legit/branches/main/.legit/metaname', 'my awesome path name')

let memfs;
let legitfs;
let secondLegitfs;

async function setupRepo() {
  memfs = createFsFromVolume(
    Volume.fromNestedJSON({
      [repoPath]: {
        'a.txt': files['/a.txt'],
        f: {
          'b.txt': files['/f/b.txt'],
          'c.txt': files['/f/c.txt'],
        },
        '.git': {},
      },
    })
  );

  await isogit.init({ fs: memfs, dir: repoPath, defaultBranch: 'main' });
  await isogit.add({ fs: memfs, dir: repoPath, filepath: 'a.txt' });
  await isogit.add({ fs: memfs, dir: repoPath, filepath: 'f/b.txt' });
  await isogit.add({ fs: memfs, dir: repoPath, filepath: 'f/c.txt' });
  await isogit.commit({
    fs: memfs,
    dir: repoPath,
    message: 'Initial commit',
    author: { name: 'Test', email: 'test@example.com', timestamp: 0 },
  });
}

describe('readdir .claude', () => {
  beforeEach(async () => {
    await setupRepo();

    const adapterConfig = {
      gitStorageFs: null, // NOTE the File adapter usually gives access to the underlying storage fs - not needed here
      gitRoot: '/',
      rootPath: '/',
    };

    // Claude session files
    const claudeSessionAdapter =
      createClaudeVirtualSessionFileAdapter(adapterConfig);

    legitfs = await openLegitFsWithMemoryFs({
      additionalFilterLayers: [claudeSessionAdapter],
    });
  });

  it('should read folder with fileTypes', async () => {
    const claudeFolder = await legitfs.promises.readdir(`/.claude`, {
      withFileTypes: true,
    });
    expect(claudeFolder.map(b => b.name)).toContain('settings.json');

    // Create a folder
    await legitfs.promises.mkdir(`/.claude/test-folder`);
    const folderAfterCreate = await legitfs.promises.readdir(`/.claude`, {
      withFileTypes: true,
    });
    expect(folderAfterCreate.map(b => b.name)).toContain('test-folder');

    // Remove the folder
    await legitfs.promises.rmdir(`/.claude/test-folder`);
    const folderAfterRemove = await legitfs.promises.readdir(`/.claude`, {
      withFileTypes: true,
    });
    expect(folderAfterRemove.map(b => b.name)).not.toContain('test-folder');

    // Create a file
    await legitfs.promises.writeFile(`/.claude/test-file.txt`, 'test content');
    const folderAfterFileCreate = await legitfs.promises.readdir(`/.claude`, {
      withFileTypes: true,
    });
    expect(folderAfterFileCreate.map(b => b.name)).toContain('test-file.txt');

    // Remove the file
    await legitfs.promises.unlink(`/.claude/test-file.txt`);
    const folderAfterFileRemove = await legitfs.promises.readdir(`/.claude`, {
      withFileTypes: true,
    });
    expect(folderAfterFileRemove.map(b => b.name)).not.toContain(
      'test-file.txt'
    );
  });

  it('should handle readdir of gitignored folder that exists in working copy', async () => {
    // Create a .gitignore file that ignores a folder
    const gitignoreContent =
      '# Ignore node_modules\nnode_modules/\n# Ignore build folder\nbuild/\n';
    await memfs.promises.writeFile(`${repoPath}/.gitignore`, gitignoreContent);

    // Commit the .gitignore file
    await isogit.add({
      fs: memfs,
      dir: repoPath,
      filepath: '.gitignore',
    });
    await isogit.commit({
      fs: memfs,
      dir: repoPath,
      message: 'Add .gitignore',
      author: { name: 'Test', email: 'test@example.com', timestamp: 1 },
    });

    // Create a new legitfs instance to pick up the new .gitignore patterns
    const newLegitfs = await openLegitFs({
      storageFs: memfs,
      gitRoot: repoPath,
      anonymousBranch: 'main',
      showKeepFiles: false,
    });

    // Create a gitignored folder in the working copy (not in git)
    const nodeModulesPath = `${repoPath}/node_modules`;
    await memfs.promises.mkdir(nodeModulesPath, { recursive: true });
    await memfs.promises.writeFile(
      `${nodeModulesPath}/package.json`,
      '{"name": "test"}'
    );

    // The folder should be readable via legitfs readdir
    const entries = await newLegitfs.promises.readdir(repoPath);
    expect(entries).toContain('node_modules');

    // We should be able to read the contents of the gitignored folder
    const nodeModulesEntries =
      await newLegitfs.promises.readdir(nodeModulesPath);
    expect(nodeModulesEntries).toContain('package.json');

    // We should be able to read files inside the gitignored folder
    const packageJsonContent = await newLegitfs.promises.readFile(
      `${nodeModulesPath}/package.json`,
      'utf-8'
    );
    expect(packageJsonContent).toBe('{"name": "test"}');

    // Files written to gitignored folders should be copy-on-write
    // (written to copy filesystem, not source filesystem)
    await newLegitfs.promises.writeFile(
      `${nodeModulesPath}/test.txt`,
      'test content'
    );

    // The file should NOT exist in the underlying storageFs
    // because gitignored files are copy-on-write
    const existsInStorage = await memfs.promises
      .access(`${nodeModulesPath}/test.txt`)
      .then(() => true)
      .catch(() => false);
    expect(existsInStorage).toBe(false);

    // But should be readable through legitfs (from copy filesystem)
    const testContent = await newLegitfs.promises.readFile(
      `${nodeModulesPath}/test.txt`,
      'utf-8'
    );
    expect(testContent).toBe('test content');

    // Modifying the file should also use copy-on-write
    await newLegitfs.promises.writeFile(
      `${nodeModulesPath}/test.txt`,
      'modified content'
    );
    const modifiedContent = await newLegitfs.promises.readFile(
      `${nodeModulesPath}/test.txt`,
      'utf-8'
    );
    expect(modifiedContent).toBe('modified content');

    // Original file in storageFs should remain unchanged
    const originalFileExists = await memfs.promises
      .access(`${nodeModulesPath}/package.json`)
      .then(() => true)
      .catch(() => false);
    expect(originalFileExists).toBe(true);

    // And the original content should still be readable through legitfs
    const originalContent = await newLegitfs.promises.readFile(
      `${nodeModulesPath}/package.json`,
      'utf-8'
    );
    expect(originalContent).toBe('{"name": "test"}');
  });

  it('should materialize claude sesion in operation branch', async () => {
    // Write a claude session file
    const sessionContent = {
      type: 'user',
      message: {
        content: 'test',
      },
    };
    await legitfs.promises.writeFile(
      `/.claude/projects/test/session-test.jsonl`,
      JSON.stringify(sessionContent) + '\n'
    );

    const legitFolder = await legitfs.promises.readdir(`/.legit`);

    const history = await legitfs.promises.readFile(
      `/.legit/operationHistory`,
      'utf-8'
    );

    // // Verify the file exists in the working copy
    // const readContent = await legitfs.promises.readFile(
    //   `/.legit/`,
    //   'utf-8'
    // );
    // expect(JSON.parse(readContent)).toEqual(sessionContent);

    // Now check that the file is stored in the operation branch
    const operationBranchName = 'legit____main-operation';
    const operationBranchRef = `refs/heads/${operationBranchName}`;

    // Check that the operation branch exists
    const refs = await isogit.listBranches({
      fs: memfs,
      dir: repoPath,
    });
    expect(refs).toContain(operationBranchName);

    // Read the file from the operation branch
    const { blob } = await isogit.readBlob({
      fs: memfs,
      dir: repoPath,
      oid: await isogit.resolveRef({
        fs: memfs,
        dir: repoPath,
        ref: operationBranchRef,
      }),
      filepath: `.claude/session-test.json`,
    });

    const operationBranchFileContent = new TextDecoder().decode(blob);
    expect(JSON.parse(operationBranchFileContent)).toEqual(sessionContent);
  });
});
