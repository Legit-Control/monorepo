import { describe, it, expect, beforeEach } from 'vitest';
import { Volume, createFsFromVolume } from 'memfs';
import { CompositeFs } from '../../CompositeFs.js';
import { HiddenFileSubFs } from '../HiddenFileSubFs.js';

import { PassThroughSubFs } from '../PassThroughSubFs.js';
import { GitSubFs } from './GitSubFs.js';
import { EphemeralSubFs } from '../EphemeralFileSubFs.js';
import { dirname } from 'path';

const repoPath = '/my/repo/path';
const TEST_FILE = 'normal.txt';
const HIDDEN_FILE = 'hidden.txt';
const BRANCH_FILE = '.branch.gitbox';

// Helper to create and clean up test files/dirs in memfs
const setupTestFile = (
  memfs: any,
  file = TEST_FILE,
  content = 'hello world'
) => {
  // Instead of writing the file directly, re-create the volume with the file
  const vol = new Volume();
  vol.fromJSON({ [file]: content });
  // Copy the contents of the new volume into the existing memfs
  Object.entries(vol.toJSON()).forEach(([path, value]) => {
    memfs.writeFileSync(path, value as string);
  });
};

const cleanupTestFile = (memfs: any, file = TEST_FILE) => {
  if (memfs.existsSync(file)) memfs.unlinkSync(file);
};

describe('createCompositFs', () => {
  let memfs: any;
  let rootFs: CompositeFs;
  let compositeFs: CompositeFs;
  let passthroughFs: any;
  let virtualFs: any;
  let hiddenFs: any;
  let fileHandleManager: any;

  beforeEach(async () => {
    memfs = createFsFromVolume(
      Volume.fromNestedJSON({
        '/path/outside': {
          [TEST_FILE]: 'hello world',
        },
        [repoPath]: {
          [TEST_FILE]: 'hello world',
        },
      })
    );

    const git = await import('isomorphic-git');
    await git.init({ fs: memfs, dir: repoPath });

    await git.add({ fs: memfs, dir: repoPath, filepath: TEST_FILE });
    await git.commit({
      fs: memfs,
      dir: repoPath,
      ref: 'refs/heads/main',
      message: 'Initial commit',
      author: {
        name: 'Test User',
        email: 'test@example.com',
      },
    });

    const gitBoxFolder = repoPath;

    // The root CompositeFS
    rootFs = new CompositeFs({
      name: 'root',
      parentFs: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storageFs: memfs as any,
      gitRoot: gitBoxFolder,
    });

    const rootEphemeralFs = new EphemeralSubFs({
      parentFs: rootFs,
      gitRoot: gitBoxFolder,
      ephemeralPatterns: [],
    });

    const rootHiddenFs = new HiddenFileSubFs({
      parentFs: rootFs,
      gitRoot: repoPath,
      hiddenFiles: [HIDDEN_FILE],
    });

    rootFs.setHiddenFilesSubFs(rootHiddenFs);
    rootFs.setEphemeralFilesSubFs(rootEphemeralFs);

    compositeFs = new CompositeFs({
      name: 'git',
      parentFs: rootFs,
      storageFs: undefined,
      gitRoot: repoPath,
    });

    const gitSubFs = new GitSubFs({
      parentFs: compositeFs,
      gitRoot: repoPath,
    });

    const gitFsHiddenFs = new HiddenFileSubFs({
      parentFs: compositeFs,
      gitRoot: repoPath,
      hiddenFiles: [],
    });

    const gitFsEphemeralFs = new EphemeralSubFs({
      parentFs: compositeFs,
      gitRoot: gitBoxFolder,
      ephemeralPatterns: [],
    });

    // Add legitFs to compositFs
    compositeFs.addSubFs(gitSubFs);
    compositeFs.setHiddenFilesSubFs(gitFsHiddenFs);
    compositeFs.setEphemeralFilesSubFs(gitFsEphemeralFs);

    // Setup a normal file
    // setupTestFile(memfs);
  });

  it('should read a branch file', async () => {
    const branchFilePath = repoPath + '/.legit/branches/main/' + TEST_FILE;
    const handle = await compositeFs.promises.open(branchFilePath, 'r');

    const bytes = await compositeFs.promises.readFile(branchFilePath);
    expect(bytes.length).toBe(11);
    const text = new TextDecoder('utf-8').decode(bytes);
    expect(text).toBe('hello world');
  });

  it('should provide a history file', async () => {
    const historyPath = repoPath + '/.legit/branches/main/.legit/history';

    const branchFilePath =
      repoPath + '/.legit/branches/main/path/to/file/' + 'new_file.md';

    await compositeFs.promises.writeFile(branchFilePath, 'new File');

    const handle = await compositeFs.promises.open(historyPath, 'r');

    const content = await compositeFs.promises.readFile(historyPath, 'utf-8');

    const parsed = JSON.parse(content);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(2);
    
  });

  it('it should write a branch file', async () => {
    const branchFilePath = repoPath + '/.legit/branches/main/' + 'new_file.md';

    await compositeFs.promises.writeFile(branchFilePath, 'new File');

    const bytes = await compositeFs.promises.readFile(branchFilePath);
    expect(bytes.length).toBe(8);
    const text = new TextDecoder('utf-8').decode(bytes);
    expect(text).toBe('new File');
  });

  it('it should write a branch file within a subfolder', async () => {
    const branchFilePath =
      repoPath + '/.legit/branches/main/path/to/file/' + 'new_file.md';

    await compositeFs.promises.writeFile(branchFilePath, 'new File');

    const bytes = await compositeFs.promises.readFile(branchFilePath);
    expect(bytes.length).toBe(8);
    const text = new TextDecoder('utf-8').decode(bytes);
    expect(text).toBe('new File');
  });

  it('it should allow to move a file within a branch (to an existing folder)', async () => {
    const branchFilePath =
      repoPath + '/.legit/branches/main/path/to/file/' + 'new_file.md';

    const newBranchFilePath =
      repoPath +
      '/.legit/branches/main/path/to_new_folder/file/' +
      'new_file.md';

    await compositeFs.promises.mkdir(dirname(branchFilePath), {
      recursive: true,
    });

    await compositeFs.promises.writeFile(branchFilePath, 'new File');

    let errorCaught = false;
    try {
      await compositeFs.promises.rename(branchFilePath, newBranchFilePath);
    } catch (err) {
      errorCaught = true;
      expect(err).toBeDefined();
    }
    // NOTE: we allow to move to a non existing folder... expect(errorCaught).toBe(true);

    // await compositeFs.promises.mkdir(dirname(newBranchFilePath), {
    //   recursive: true,
    // });

    // await compositeFs.promises.rename(branchFilePath, newBranchFilePath);

    // Optionally, check that the original file still exists
    const bytes = await compositeFs.promises.readFile(newBranchFilePath);
    expect(bytes.length).toBe(8);
    const text = new TextDecoder('utf-8').decode(bytes);
    expect(text).toBe('new File');
  });

  it('it should allow to move (rename) a folder within a branch', async () => {
    const folderPath = repoPath + '/.legit/branches/main/path/to/file/';
    const branchFilePath = folderPath + 'new_file.md';

    await compositeFs.promises.mkdir(dirname(folderPath), {
      recursive: true,
    });

    // Check if the underlying repo now has two commits via isomorphic-git
    const git = await import('isomorphic-git');
    let commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(2);

    await compositeFs.promises.writeFile(branchFilePath, 'new File');
    commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(3);

    const newFolderPath =
      repoPath + '/.legit/branches/main/path/to_new_folder/';
    const newBranchFilePath = newFolderPath + 'new_file.md';

    await compositeFs.promises.rename(folderPath, newFolderPath);

    commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(4);

    const folderContent = await compositeFs.promises.readdir(newFolderPath);

    // Optionally, check that the original file still exists
    const bytes = await compositeFs.promises.readFile(newBranchFilePath);
    expect(bytes.length).toBe(8);
    const text = new TextDecoder('utf-8').decode(bytes);
    expect(text).toBe('new File');
  });

  it('it should allow to move (rename) a file within a branch', async () => {
    const folderPath = repoPath + '/.legit/branches/main/path/to/file/';
    const branchFilePath = folderPath + 'new_file.md';
    const renamedBranchFilePath = folderPath + 'new_file_renamed.md';

    await compositeFs.promises.mkdir(dirname(folderPath), {
      recursive: true,
    });

    // Check if the underlying repo now has two commits via isomorphic-git
    const git = await import('isomorphic-git');
    let commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(2);

    await compositeFs.promises.writeFile(branchFilePath, 'new File');
    commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(3);

    await compositeFs.promises.rename(branchFilePath, renamedBranchFilePath);

    commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(4);

    // Optionally, check that the original file still exists
    const bytes = await compositeFs.promises.readFile(renamedBranchFilePath);
    expect(bytes.length).toBe(8);
    const text = new TextDecoder('utf-8').decode(bytes);
    expect(text).toBe('new File');
  });

  it('it should allow to move (rename) a file within a branch from a sub dir to a parent dir', async () => {
    const folderPath = repoPath + '/.legit/branches/main/path_to_file/';
    const branchFilePath = folderPath + 'a_file.md';
    const newfolderPath = repoPath + '/.legit/branches/main/';
    const renamedBranchFilePath = newfolderPath + 'a_file.md';

    await compositeFs.promises.mkdir(dirname(folderPath), {
      recursive: true,
    });

    // Check if the underlying repo now has two commits via isomorphic-git
    const git = await import('isomorphic-git');
    let commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(2);

    await compositeFs.promises.writeFile(branchFilePath, 'new File');
    commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(3);

    await compositeFs.promises.rename(branchFilePath, renamedBranchFilePath);

    commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(4);

    // Optionally, check that the original file still exists
    const bytes = await compositeFs.promises.readFile(renamedBranchFilePath);
    expect(bytes.length).toBe(8);
    const text = new TextDecoder('utf-8').decode(bytes);
    expect(text).toBe('new File');
  });

  it('it should allow to create an "empty" dir', async () => {
    const folderPath = repoPath + '/.legit/branches/main/path/to/file/';

    await compositeFs.promises.mkdir(folderPath, {
      recursive: true,
    });

    // Check if the underlying repo now has two commits via isomorphic-git
    const git = await import('isomorphic-git');
    let commits = await git.log({ fs: memfs, dir: repoPath, ref: 'main' });
    expect(commits.length).toBe(2);

    const stat = await compositeFs.promises.stat(folderPath);
    // const lastCommit = (await git.log({ fs: memfs, dir: repoPath, ref: "main" }))[commits.length - 1];
    // expect(new Date(stat.ctimeMs).getTime()).toBeCloseTo(new Date(lastCommit.commit.committer.timestamp * 1000).getTime(), -2);

    const dirContent = await compositeFs.promises.readdir(folderPath);
    expect(
      dirContent.length,
      'the created folder should contain no files (.keep file should be invisible)'
    ).toBe(0);
  });

  it('it should list both the pre-existing test file and a newly created file in a branch folder', async () => {
    const folderPath = repoPath + '/.legit/branches/main/';
    const branchFilePath = folderPath + 'a_file.md';
    const preExistingFilePath = repoPath + '/.legit/branches/main/' + TEST_FILE;

    // Write a new file
    const fd = await compositeFs.promises.open(branchFilePath, 'w');
    const filesBeforeSync = await compositeFs.promises.readdir(
      repoPath + '/.legit/branches/main/'
    );
    expect(filesBeforeSync).toContain('a_file.md');
    await fd.write(Buffer.from('new File'));
    await fd.sync();

    // List files in the branch folder
    const files = await compositeFs.promises.readdir(
      repoPath + '/.legit/branches/main/'
    );
    expect(files).toContain('a_file.md');
    expect(files).toContain(TEST_FILE);
  });

  it('it should read the pre-existing test file from the branch folder', async () => {
    const branchFilePath = repoPath + '/.legit/branches/main/' + TEST_FILE;

    const bytes = await compositeFs.promises.readFile(branchFilePath);
    expect(bytes.length).toBe(11);
    const text = new TextDecoder('utf-8').decode(bytes);
    expect(text).toBe('hello world');
  });

  it('it should fail to read a non-existent file in the branch folder', async () => {
    const nonExistentFilePath =
      repoPath + '/.legit/branches/main/non_existent.txt';

    let errorCaught = false;
    try {
      await compositeFs.promises.readFile(nonExistentFilePath);
    } catch (err) {
      errorCaught = true;
      expect(err).toBeDefined();
    }
    expect(errorCaught).toBe(true);
  });

  it('it should allow to delete a file from the branch folder', async () => {
    const branchFilePath =
      repoPath + '/.legit/branches/main/' + 'delete_me.txt';

    await compositeFs.promises.writeFile(branchFilePath, 'to be deleted');
    await compositeFs.promises.unlink(branchFilePath);

    let errorCaught = false;
    try {
      const content = await compositeFs.promises.readFile(branchFilePath);
      console.log('Content:', content);
    } catch (err) {
      errorCaught = true;
      expect(err).toBeDefined();
    }
    expect(errorCaught).toBe(true);
  });

  it('it should allow to create nested folders and files in a branch', async () => {
    const nestedFolderPath = repoPath + '/.legit/branches/main/nested/dir/';
    const nestedFilePath = nestedFolderPath + 'deep_file.txt';

    await compositeFs.promises.mkdir(nestedFolderPath, { recursive: true });
    await compositeFs.promises.writeFile(nestedFilePath, 'deep content');

    const files = await compositeFs.promises.readdir(nestedFolderPath);
    expect(files).toContain('deep_file.txt');

    const bytes = await compositeFs.promises.readFile(nestedFilePath);
    expect(new TextDecoder('utf-8').decode(bytes)).toBe('deep content');
  });
});
