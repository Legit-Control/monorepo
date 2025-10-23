import { describe, it, expect, beforeEach } from 'vitest';
import { Volume, createFsFromVolume } from 'memfs';
import { CompositeFs } from './CompositeFs.js';
import { HiddenFileSubFs } from './subsystems/HiddenFileSubFs.js';

import { PassThroughSubFs } from './subsystems/PassThroughSubFs.js';
import { GitSubFs } from './subsystems/git/GitSubFs.js';
import { EphemeralSubFs } from './subsystems/EphemeralFileSubFs.js';

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

  beforeEach(() => {
    memfs = createFsFromVolume(
      Volume.fromNestedJSON({
        '/path/outside': {
          [TEST_FILE]: 'hello world',
        },
        [repoPath]: {
          '.git': {
            HEAD: 'ref: refs/heads/main',
            refs: {
              heads: {
                main: '0123456789012345678901234567890123456789',
              },
            },
          },
          [TEST_FILE]: 'hello world',
        },
      })
    );

    const gitBoxFolder = repoPath;

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
      parentFs: rootFs,
      gitRoot: repoPath,
      hiddenFiles: [],
    });

    const gitFsEphemeralFs = new EphemeralSubFs({
      parentFs: rootFs,
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

  it('should read a normal file using passthroughFs', async () => {
    const content = await memfs.promises.readdir('/');

    const handle = await compositeFs.promises.open(
      repoPath + '/' + TEST_FILE,
      'r'
    );

    const bytes = await memfs.promises.readFile(repoPath + '/' + TEST_FILE);
    expect(bytes.length).toBe(11);
    const text = new TextDecoder('utf-8').decode(bytes);
    expect(text).toBe('hello world');
  });

  it('should write a normal file using passthroughFs', async () => {
    const handle = await compositeFs.promises.open(
      repoPath + '/' + TEST_FILE,
      'w'
    );
    const data = Buffer.from('new content');
    await handle.write(data, 0, data.length, 0);
    await handle.close();
    // Reopen and check content
    const handle2 = await compositeFs.promises.open(
      repoPath + '/' + TEST_FILE,
      'r'
    );
    const buffer = Buffer.alloc(data.length);
    await handle2.read(buffer, 0, data.length, 0);

    const memfsBuffer = await memfs.promises.readFile(
      repoPath + '/' + TEST_FILE
    );
    expect(buffer).toEqual(memfsBuffer);
    expect(buffer.toString()).toBe('new content');
    await handle2.close();
  });

  it('should not allow writing to a hidden file', async () => {
    await expect(
      compositeFs.promises.open(repoPath + '/' + HIDDEN_FILE, 'w')
    ).rejects.toThrow(/Access to hidden file/);
  });

  it('should not allow reading a hidden file', async () => {
    await expect(
      compositeFs.promises.open(repoPath + '/' + HIDDEN_FILE, 'r')
    ).rejects.toThrow(/Access to hidden file/);
  });

  it.todo('should respond to .branch.gitbox using virtualFs', async () => {
    // The virtual file should exist and be readable
    const handle = await compositeFs.promises.open(
      repoPath + '/' + BRANCH_FILE,
      'r'
    );
    expect(handle).toBeDefined();
    // The content should be the current branch name (empty string if not set)
    const buffer = Buffer.alloc(100);
    const { bytesRead } = await handle.read(buffer, 0, 100, 0);
    // Should not throw, and should be a string (possibly empty)
    expect(bytesRead, 'contianing main').toBe(4);
    expect(typeof buffer.toString('utf-8', 0, bytesRead)).toBe('string');
    // await memfs.promises.close(handle.subFsFileDescriptor);
  });

  it.todo('should test lookup functionality', async () => {
    await expect(
      compositeFs.lookup(repoPath + '/' + TEST_FILE)
    ).rejects.toThrow(/lookup is not implemented/);
  });

  it.todo('should test resolvePath functionality', async () => {
    // const handle = await compositeFs.promises.open(
    //   repoPath + "/" + TEST_FILE,
    //   "r",
    // );
    // const fd = handle.compositFsFileDescriptor;
    // const resolvedPath = await compositeFs.resolvePath(fd);
    // expect(resolvedPath).toContain(TEST_FILE); // Just check it contains the file name
    // await handle.close();
  });

  it('should test access functionality', async () => {
    await expect(
      compositeFs.promises.access(repoPath + '/' + TEST_FILE)
    ).resolves.not.toThrow();

    await expect(
      compositeFs.promises.access(repoPath + '/nonexistent.txt')
    ).rejects.toThrow();
  });

  it('should test stat functionality', async () => {
    const stats = await compositeFs.promises.stat(repoPath + '/' + TEST_FILE);
    expect(stats).toBeDefined();
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBe(11);
  });

  it('should test lstat functionality', async () => {
    const stats = await compositeFs.promises.lstat(repoPath + '/' + TEST_FILE);
    expect(stats).toBeDefined();
    expect(stats.isFile()).toBe(true);
  });

  it.todo('should test opendir functionality', async () => {
    const dir = await compositeFs.promises.opendir(repoPath);
    expect(dir).toBeDefined();
    // Test reading entries
    let hasNormalFile = false;
    let hasBranchFile = false;
    for await (const dirent of dir) {
      if (dirent.name === TEST_FILE) hasNormalFile = true;
      if (dirent.name === BRANCH_FILE) hasBranchFile = true;
    }
    expect(hasNormalFile).toBe(true);
    expect(hasBranchFile).toBe(true);
    await dir.close();
  });

  it('should test readdir functionality', async () => {
    const entries = await compositeFs.promises.readdir(repoPath);
    expect(entries).toContain(TEST_FILE);
    expect(entries).toContain('.legit');
    expect(entries).not.toContain(HIDDEN_FILE); // Hidden files should be filtered out
  });

  it('should test mkdir functionality', async () => {
    const newDir = repoPath + '/testdir';
    await compositeFs.promises.mkdir(newDir);
    const stats = await compositeFs.promises.stat(newDir);
    expect(stats.isDirectory()).toBe(true);
  });

  it('should test mkdir functionality', async () => {
    const newDir = repoPath + '/testdir';
    await compositeFs.promises.mkdir(newDir);
    const stats = await compositeFs.promises.stat(newDir);
    expect(stats.isDirectory()).toBe(true);
  });

  it('should test rmdir functionality', async () => {
    const newDir = repoPath + '/testdir2';
    await compositeFs.promises.mkdir(newDir);
    await compositeFs.promises.rmdir(newDir);
    await expect(compositeFs.promises.stat(newDir)).rejects.toThrow();
  });

  it('should test unlink functionality', async () => {
    const testFile = repoPath + '/test-unlink.txt';
    memfs.writeFileSync(testFile, 'test content');

    await compositeFs.promises.unlink(testFile);
    await expect(compositeFs.promises.stat(testFile)).rejects.toThrow();
  });

  it('should throw error for not implemented methods', async () => {
    await expect(
      compositeFs.promises.link(
        repoPath + '/' + TEST_FILE,
        repoPath + '/linked.txt'
      )
    ).rejects.toThrow(/not implemented/);

    await expect(
      compositeFs.promises.readlink(repoPath + '/' + TEST_FILE)
    ).rejects.toThrow(/not implemented/);

    await expect(
      compositeFs.promises.symlink(
        repoPath + '/' + TEST_FILE,
        repoPath + '/symlinked.txt'
      )
    ).rejects.toThrow(/not implemented/);
  });

  it('should prevent renaming hidden files', async () => {
    // Test renaming FROM a hidden file
    await expect(
      compositeFs.promises.rename(
        repoPath + '/' + HIDDEN_FILE,
        repoPath + '/normal.txt'
      )
    ).rejects.toThrow(/^Renaming of hidden Files is not allowed/);

    // Test renaming TO a hidden file
    await expect(
      compositeFs.promises.rename(
        repoPath + '/' + TEST_FILE,
        repoPath + '/' + HIDDEN_FILE
      )
    ).rejects.toThrow(/Renaming to hidden Files is not allowed/);
  });

  describe('GitSubFs rename operations', () => {
    beforeEach(async () => {
      // Initialize git repo with some test data
      const git = await import('isomorphic-git');
      await git.init({ fs: memfs, dir: repoPath });

      // Create and commit a test file
      await memfs.promises.writeFile(
        repoPath + '/test-git.txt',
        'Hello from git'
      );
      await git.add({ fs: memfs, dir: repoPath, filepath: 'test-git.txt' });
      await git.commit({
        fs: memfs,
        dir: repoPath,
        message: 'Initial commit',
        author: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      // Get current branch name
      const currentBranch = await git.currentBranch({
        fs: memfs,
        dir: repoPath,
      });
      console.log('Current branch:', currentBranch);
    });

    it('should rename a file within the same git branch', async () => {
      const git = await import('isomorphic-git');
      const currentBranch = await git.currentBranch({
        fs: memfs,
        dir: repoPath,
      });

      const sourcePath = `${repoPath}/.legit/branches/${currentBranch}/test-git.txt`;
      const destPath = `${repoPath}/.legit/branches/${currentBranch}/renamed-git.txt`;

      // Rename the file
      await compositeFs.promises.rename(sourcePath, destPath);

      // Verify the file was renamed by trying to read the new path
      const handle = await compositeFs.promises.open(destPath, 'r');
      const buffer = Buffer.alloc(14);
      const { bytesRead } = await handle.read(buffer, 0, 14, 0);
      expect(buffer.toString('utf-8', 0, bytesRead)).toBe('Hello from git');
      await handle.close();

      // Verify the old file no longer exists
      await expect(compositeFs.promises.open(sourcePath, 'r')).rejects.toThrow(
        /ENOENT/
      );
    });

    it.skip('should copy a file between different git branches', async () => {
      const git = await import('isomorphic-git');
      const currentBranch = await git.currentBranch({
        fs: memfs,
        dir: repoPath,
      });

      const sourcePath = `${repoPath}/.legit/branches/${currentBranch}/test-git.txt`;
      const destPath = `${repoPath}/.legit/branches/feature/test-git.txt`;

      // Copy file to a new branch
      await compositeFs.promises.rename(sourcePath, destPath);

      // Verify the file exists in the new branch
      const handle = await compositeFs.promises.open(destPath, 'r');
      const buffer = Buffer.alloc(14);
      const { bytesRead } = await handle.read(buffer, 0, 14, 0);
      expect(buffer.toString('utf-8', 0, bytesRead)).toBe('Hello from git');
      await handle.close();

      // Verify the original file still exists (cross-branch rename is a copy)
      const originalHandle = await compositeFs.promises.open(sourcePath, 'r');
      await originalHandle.close();

      // Verify new branch was created
      const branches = await git.listBranches({ fs: memfs, dir: repoPath });
      expect(branches).toContain('feature');
    });

    it('should extract a file from git branch to regular filesystem', async () => {
      const git = await import('isomorphic-git');
      const currentBranch = await git.currentBranch({
        fs: memfs,
        dir: repoPath,
      });

      const sourcePath = `${repoPath}/.legit/branches/${currentBranch}/test-git.txt`;
      const destPath = `${repoPath}/extracted-from-git.txt`;

      // Extract file from git to regular filesystem
      await compositeFs.promises.rename(sourcePath, destPath);

      // Verify the file exists in regular filesystem
      const content = await memfs.promises.readFile(destPath, 'utf-8');
      expect(content).toBe('Hello from git');

      // Verify the file was removed from git branch
      await expect(compositeFs.promises.open(sourcePath, 'r')).rejects.toThrow(
        /ENOENT/
      );
    });

    it.skip('should add a regular file to a git branch', async () => {
      const git = await import('isomorphic-git');
      const currentBranch = await git.currentBranch({
        fs: memfs,
        dir: repoPath,
      });

      // Create a regular file
      const regularPath = `${repoPath}/regular-file.txt`;
      await memfs.promises.writeFile(regularPath, 'Regular file content');

      const destPath = `${repoPath}/.legit/branches/${currentBranch}/added-to-git.txt`;

      // Add regular file to git branch
      await compositeFs.promises.rename(regularPath, destPath);

      // Verify the file exists in git branch
      const handle = await compositeFs.promises.open(destPath, 'r');
      const buffer = Buffer.alloc(20);
      const { bytesRead } = await handle.read(buffer, 0, 20, 0);
      expect(buffer.toString('utf-8', 0, bytesRead)).toBe(
        'Regular file content'
      );
      await handle.close();

      // Verify the regular file was deleted
      await expect(memfs.promises.access(regularPath)).rejects.toThrow();
    });

    it.skip('should handle rename errors gracefully', async () => {
      const git = await import('isomorphic-git');
      const currentBranch = await git.currentBranch({
        fs: memfs,
        dir: repoPath,
      });

      // Try to rename a non-existent file
      const sourcePath = `${repoPath}/.legit/branches/${currentBranch}/non-existent.txt`;
      const destPath = `${repoPath}/.legit/branches/${currentBranch}/destination.txt`;

      await expect(
        compositeFs.promises.rename(sourcePath, destPath)
      ).rejects.toThrow(/Source file not found/);
    });

    it('should handle rename of directories in git branches', async () => {
      const git = await import('isomorphic-git');
      const currentBranch = await git.currentBranch({
        fs: memfs,
        dir: repoPath,
      });

      // Create a directory with files
      await memfs.promises.mkdir(`${repoPath}/testdir`, { recursive: true });
      await memfs.promises.writeFile(`${repoPath}/testdir/file1.txt`, 'File 1');
      await memfs.promises.writeFile(`${repoPath}/testdir/file2.txt`, 'File 2');

      // Add to git
      await git.add({
        fs: memfs,
        dir: repoPath,
        filepath: 'testdir/file1.txt',
      });
      await git.add({
        fs: memfs,
        dir: repoPath,
        filepath: 'testdir/file2.txt',
      });
      await git.commit({
        fs: memfs,
        dir: repoPath,
        message: 'Add test directory',
        author: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      const sourcePath = `${repoPath}/.legit/branches/${currentBranch}/testdir/file1.txt`;
      const destPath = `${repoPath}/.legit/branches/${currentBranch}/testdir/renamed-file1.txt`;

      // Rename file within directory
      await compositeFs.promises.rename(sourcePath, destPath);

      // Verify the rename
      const handle = await compositeFs.promises.open(destPath, 'r');
      const buffer = Buffer.alloc(6);
      const { bytesRead } = await handle.read(buffer, 0, 6, 0);
      expect(buffer.toString('utf-8', 0, bytesRead)).toBe('File 1');
      await handle.close();
    });
  });

  it.todo(
    'should handle getResponsibleFs error when no responsible filesystem found',
    async () => {
      // Create a composite FS without passthrough FS
      // const limitedCompositeFs = new CompositFs({
      //   repoFs: memfs,
      //   gitRoot: repoPath,
      // });
      // const virtualFs = createVirtualFileSubFs({
      //   fs: memfs,
      //   gitRoot: repoPath,
      //   fileHandleManager: limitedCompositeFs.fileHandleManager,
      //   virtualFiles: [gitBranchVirtualFile],
      // });
      // limitedCompositeFs.addSubFs(virtualFs);
      // const hiddenFs = createHiddenFileSubFs(["hidden.txt"]);
      // limitedCompositeFs.setHiddenFilesSubFs(hiddenFs);
      // await expect(
      //   limitedCompositeFs.promises.open(repoPath + "/unknown.txt", "r"),
      // ).rejects.toThrow(
      //   /no responsible fs for.*found - missing a pass through fs?/,
      // );
    }
  );

  it('should handle parent directory resolution for nested files', async () => {
    // Create nested directory structure
    const nestedDir = repoPath + '/nested/deep';
    const nestedFile = nestedDir + '/file.txt';

    await memfs.promises.mkdir(repoPath + '/nested', { recursive: true });
    await memfs.promises.mkdir(nestedDir, { recursive: true });
    memfs.writeFileSync(nestedFile, 'nested content');

    const handle = await compositeFs.promises.open(nestedFile, 'r');
    expect(handle).toBeDefined();

    const buffer = Buffer.alloc(14);
    const { bytesRead } = await handle.read(buffer, 0, 14, 0);
    expect(buffer.toString('utf-8', 0, bytesRead)).toBe('nested content');
    await handle.close();
  });

  it('should handle files outside gitRoot', async () => {
    const outsideFile = '/path/outside/' + TEST_FILE;

    await expect(compositeFs.promises.open(outsideFile, 'r')).rejects.toThrow(
      'tried to access a file (/path/outside/normal.txt) outside of the legit folder: /my/repo/path'
    );
  });
});
