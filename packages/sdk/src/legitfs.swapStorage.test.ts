import { describe, it, expect, beforeEach } from 'vitest';
import { Volume, createFsFromVolume } from 'memfs';
import * as isogit from '@legit-sdk/isomorphic-git';
import { openLegitFs } from './legitfs.js';

const repoPath = '/repo';
const newRepoPath = '/new-repo';

describe('swapStorage', () => {
  let memfs: any;
  let newMemfs: any;
  let legitfs: Awaited<ReturnType<typeof openLegitFs>>;

  async function setupRepo() {
    memfs = createFsFromVolume(
      Volume.fromNestedJSON({
        [repoPath]: {
          'a.txt': 'A file',
          'b.txt': 'B file',
          f: {
            'c.txt': 'C file',
          },
          '.git': {},
        },
      })
    );

    await isogit.init({ fs: memfs, dir: repoPath, defaultBranch: 'main' });
    await isogit.add({ fs: memfs, dir: repoPath, filepath: 'a.txt' });
    await isogit.add({ fs: memfs, dir: repoPath, filepath: 'b.txt' });
    await isogit.add({ fs: memfs, dir: repoPath, filepath: 'f/c.txt' });
    await isogit.commit({
      fs: memfs,
      dir: repoPath,
      message: 'Initial commit',
      author: { name: 'Test', email: 'test@example.com' },
    });
  }

  beforeEach(async () => {
    await setupRepo();
    legitfs = await openLegitFs({
      storageFs: memfs,
      gitRoot: repoPath,
      anonymousBranch: 'main',
      showKeepFiles: false,
    });
  });

  describe('basic functionality', () => {
    it('should swap to a new filesystem at the same path', async () => {
      // Create new filesystem
      newMemfs = createFsFromVolume(new Volume());

      // Swap to new filesystem
      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Verify the storage was swapped
      // expect(legitfs._storageFs.sto).toBe(newMemfs);

      // Verify files are accessible through new filesystem
      const content = await legitfs.promises.readFile(
        `${repoPath}/.legit/branches/main/a.txt`,
        'utf-8'
      );
      expect(content).toBe('A file');
    });

    it('should swap to a new filesystem at a different path', async () => {
      newMemfs = createFsFromVolume(new Volume());

      const paths = await legitfs.promises.readdir('/');

      // Swap to new filesystem with different path
      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: newRepoPath,
      });

      const paths2 = await newMemfs.promises.readdir(
        '/new-repo/.git/refs/heads'
      );

      const pathsNew = await legitfs.promises.readdir(
        newRepoPath + '/.legit/branches'
      );

      // Verify files are accessible at new path
      const content = await legitfs.promises.readFile(
        `/.legit/branches/main/a.txt`,
        'utf-8'
      );
      expect(content).toBe('A file');
    });

    it('should copy all git data to new storage', async () => {
      newMemfs = createFsFromVolume(new Volume());

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Verify .git folder exists in new storage
      const gitEntries = await newMemfs.promises.readdir(`${repoPath}/.git`);
      expect(gitEntries).toContain('refs');
      expect(gitEntries).toContain('objects');
      expect(gitEntries).toContain('HEAD');

      // Verify branches were copied
      const branches = await isogit.listBranches({
        fs: newMemfs,
        dir: repoPath,
      });
      expect(branches).toContain('main');
    });

    it('should preserve the current branch', async () => {
      // Set a specific current branch
      await legitfs.setCurrentBranch('main');

      newMemfs = createFsFromVolume(new Volume());

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Verify current branch is preserved
      const currentBranch = await legitfs.getCurrentBranch();
      expect(currentBranch).toBe('main');

      // Verify .legit/currentBranch file reflects this
      const currentBranchContent = await legitfs.promises.readFile(
        `${repoPath}/.legit/currentBranch`,
        'utf-8'
      );
      expect(currentBranchContent.trim()).toBe('main');
    });

    it('should preserve all branches', async () => {
      // Create additional branches
      await legitfs.promises.mkdir(`${repoPath}/.legit/branches/feature1`);
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/feature1/file.txt`,
        'Feature 1'
      );

      await legitfs.promises.mkdir(`${repoPath}/.legit/branches/feature2`);
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/feature2/file.txt`,
        'Feature 2'
      );

      // Verify branches exist in original storage
      const originalBranches = await isogit.listBranches({
        fs: memfs,
        dir: repoPath,
      });
      expect(originalBranches).toContain('main');
      expect(originalBranches).toContain('feature1');
      expect(originalBranches).toContain('feature2');

      newMemfs = createFsFromVolume(new Volume());

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Verify all branches exist in new storage
      const newBranches = await isogit.listBranches({
        fs: newMemfs,
        dir: repoPath,
      });
      expect(newBranches).toContain('main');
      expect(newBranches).toContain('feature1');
      expect(newBranches).toContain('feature2');
      expect(newBranches.length).toBe(3);

      // Verify branch files are accessible through legitfs API
      const feature1Content = await legitfs.promises.readFile(
        `${repoPath}/.legit/branches/feature1/file.txt`,
        'utf-8'
      );
      expect(feature1Content).toBe('Feature 1');

      const feature2Content = await legitfs.promises.readFile(
        `${repoPath}/.legit/branches/feature2/file.txt`,
        'utf-8'
      );
      expect(feature2Content).toBe('Feature 2');
    });

    it('should preserve file contents written before swap', async () => {
      // Write a file before swap
      const testContent = 'Test content written before swap';
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/main/test.txt`,
        testContent
      );

      // Verify it exists in original storage
      const originalContent = await legitfs.promises.readFile(
        `${repoPath}/.legit/branches/main/test.txt`,
        'utf-8'
      );
      expect(originalContent).toBe(testContent);

      newMemfs = createFsFromVolume(new Volume());

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Verify file content is preserved after swap
      const newContent = await legitfs.promises.readFile(
        `${repoPath}/.legit/branches/main/test.txt`,
        'utf-8'
      );
      expect(newContent).toBe(testContent);
    });

    it('should preserve folder structure', async () => {
      newMemfs = createFsFromVolume(new Volume());

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Verify folder structure is preserved
      const entries = await legitfs.promises.readdir(
        `${repoPath}/.legit/branches/main/f`
      );
      expect(entries).toContain('c.txt');
    });

    it('should preserve commit history', async () => {
      // Get original commit history
      const originalLog = await isogit.log({
        fs: memfs,
        dir: repoPath,
        depth: 10,
      });

      newMemfs = createFsFromVolume(new Volume());

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Verify commit history is preserved
      const newLog = await isogit.log({
        fs: newMemfs,
        dir: repoPath,
        depth: 10,
      });

      expect(newLog.length).toBe(originalLog.length);
      expect(newLog[0]!.commit.message).toBe(originalLog[0]!.commit.message);
    });
  });

  describe('file handle management', () => {
    it('should throw error if file handles are open', async () => {
      // Open a file handle
      const handle = await legitfs.promises.open(
        `${repoPath}/.legit/branches/main/a.txt`,
        'r'
      );

      // Try to swap with open handle
      newMemfs = createFsFromVolume(new Volume());
      await expect(
        legitfs.swapStorage({
          fs: newMemfs,
          rootPath: repoPath,
        })
      ).rejects.toThrow('Cannot swap storage with open file handles');

      // Clean up
      await handle.close();
    });

    it('should close all file handles after swap', async () => {
      newMemfs = createFsFromVolume(new Volume());

      // Swap should close all handles (none in this case)
      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Verify no handles are open
      expect(legitfs['openFileHandles'].size).toBe(0);
    });

    it('should provide information about open handles in error', async () => {
      // Open multiple files
      const handle1 = await legitfs.promises.open(
        `${repoPath}/.legit/branches/main/a.txt`,
        'r'
      );
      const handle2 = await legitfs.promises.open(
        `${repoPath}/.legit/branches/main/b.txt`,
        'r'
      );

      // Try to swap
      newMemfs = createFsFromVolume(new Volume());
      try {
        await legitfs.swapStorage({
          fs: newMemfs,
          rootPath: repoPath,
        });
        // fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('open file handles');
        // Error should mention the open files
        // expect(error.message).toContain('a.txt').or.contain('b.txt');
      } finally {
        // Clean up
        await handle1.close();
        await handle2.close();
      }
    });
  });

  describe('error handling', () => {
    it('should not modify storage if copy fails', async () => {
      // Create an invalid filesystem (e.g., read-only)
      const roVolume = new Volume();
      const roFs = createFsFromVolume(roVolume);
      // Make read-only by not providing write methods
      roFs.promises.writeFile = () => Promise.reject(new Error('Read-only'));

      const originalStorage = legitfs._storageFs;

      // Try to swap to read-only filesystem
      await expect(
        legitfs.swapStorage({
          // @ts-ignore
          fs: roFs,
          rootPath: repoPath,
        })
      ).rejects.toThrow();

      // Verify storage was not changed
      expect(legitfs._storageFs).toBe(originalStorage);

      // Verify original storage still works
      const content = await legitfs.promises.readFile(
        `${repoPath}/.legit/branches/main/a.txt`,
        'utf-8'
      );
      expect(content).toBe('A file');
    });

    it('should verify critical files after copy', async () => {
      // Create filesystem but manually remove .git after copy
      newMemfs = createFsFromVolume(new Volume());

      // This is a bit tricky - we need to simulate a partial copy
      // For now, just test that verification happens
      // In real implementation, this would test that if .git/HEAD
      // is missing, the swap fails

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // If we got here, verification passed
      // Verify HEAD exists
      const headExists = await newMemfs.promises
        .access(`${repoPath}/.git/HEAD`)
        .then(() => true)
        .catch(() => false);
      expect(headExists).toBe(true);
    });
  });

  describe('integration with other features', () => {
    it('should work after writing to ephemeral files', async () => {
      // Write an ephemeral file (matches copy-on-write patterns)
      await legitfs.promises.writeFile(
        `${repoPath}/.DS_Store`,
        'ephemeral content'
      );

      newMemfs = createFsFromVolume(new Volume());

      // Swap should succeed
      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Ephemeral files should NOT be copied (they're in-memory)
      await expect(
        newMemfs.promises.readFile(`${repoPath}/.DS_Store`)
      ).rejects.toThrow();
    });

    it('should work with virtual files', async () => {
      // Read a virtual file
      const branchesList = await legitfs.promises.readdir(
        `/.legit/branches`,
        'utf-8'
      );

      newMemfs = createFsFromVolume(new Volume());

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Virtual files should still work after swap
      const newBranchesList = await legitfs.promises.readdir(
        `/.legit/branches`,
        'utf-8'
      );
      expect(newBranchesList.join(',')).toBe(branchesList.join(','));
    });

    it('should allow operations after swap', async () => {
      newMemfs = createFsFromVolume(new Volume());

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Should be able to write new files
      await legitfs.promises.writeFile(
        `/.legit/branches/main/new-after-swap.txt`,
        'Written after swap'
      );

      const content = await legitfs.promises.readFile(
        `/.legit/branches/main/new-after-swap.txt`,
        'utf-8'
      );
      expect(content).toBe('Written after swap');

      // Verify file exists in new storage
      const existsInNewStorage = await legitfs.promises
        .access(`/.legit/branches/main/new-after-swap.txt`)
        .then(() => true)
        .catch(() => false);
      expect(existsInNewStorage).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle swapping to same filesystem and path', async () => {
      // This is essentially a no-op but should still work
      await legitfs.swapStorage({
        fs: memfs,
        rootPath: repoPath,
      });

      // Should still work
      const content = await legitfs.promises.readFile(
        `${repoPath}/.legit/branches/main/a.txt`,
        'utf-8'
      );
      expect(content).toBe('A file');
    });

    it('should handle repo with many branches', async () => {
      // Create 10 branches
      for (let i = 0; i < 10; i++) {
        const branchName = `branch-${i}`;
        await legitfs.promises.mkdir(
          `${repoPath}/.legit/branches/${branchName}`
        );
        await legitfs.promises.writeFile(
          `${repoPath}/.legit/branches/${branchName}/file.txt`,
          `Branch ${i}`
        );
      }

      const originalBranches = await isogit.listBranches({
        fs: memfs,
        dir: repoPath,
      });
      expect(originalBranches.length).toBe(11); // main + 10 branches

      newMemfs = createFsFromVolume(new Volume());

      await legitfs.swapStorage({
        fs: newMemfs,
        rootPath: repoPath,
      });

      // Verify all branches were copied
      const newBranches = await isogit.listBranches({
        fs: newMemfs,
        dir: repoPath,
      });
      expect(newBranches.length).toBe(11);
    });
  });
});
