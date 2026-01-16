import { describe, it, expect, beforeEach } from 'vitest';
import { Volume, createFsFromVolume } from 'memfs';
import * as isogit from '@legit-sdk/isomorphic-git';
import { openLegitFs, openLegitFsWithMemoryFs } from './legitfs.js';

const repoPath = '/repo';
const files = {
  '/a.txt': 'A file',
  '/f/b.txt': 'B file',
  '/f/c.txt': 'C file',
};

let memfs: any;
let legitfs: Awaited<ReturnType<typeof openLegitFs>>;
let secondLegitfs: Awaited<ReturnType<typeof openLegitFs>>;

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

describe('saveArchive and loadArchive', () => {
  beforeEach(async () => {
    await setupRepo();
    legitfs = await openLegitFs({
      storageFs: memfs,
      gitRoot: repoPath,
      anonymousBranch: 'main',
      showKeepFiles: false,
    });

    secondLegitfs = await openLegitFs({
      storageFs: memfs,
      gitRoot: repoPath,
      anonymousBranch: 'main',
      showKeepFiles: true,
      ephemaralGitConfig: true,
    });
  });

  describe('saveArchive', () => {
    it('should return a Uint8Array', async () => {
      const archive = await legitfs.saveArchive();
      expect(archive).toBeInstanceOf(Uint8Array);
    });

    it('should return a non-empty archive', async () => {
      const archive = await legitfs.saveArchive();
      expect(archive.length).toBeGreaterThan(0);
    });

    it('should produce deterministic output for same repo state', async () => {
      const archive1 = await legitfs.saveArchive();
      const archive2 = await legitfs.saveArchive();
      expect(archive1).toEqual(archive2);
    });

    it('should produce different archives for different repo states', async () => {
      const archive1 = await legitfs.saveArchive();

      // Modify the repo by adding a file
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/main/newfile.txt`,
        'New content'
      );

      const archive2 = await legitfs.saveArchive();
      expect(archive1).not.toEqual(archive2);
    });
  });

  describe('loadArchive', () => {
    it('should restore repo state from archive', async () => {
      // Get initial state
      const initialBranches = await isogit.listBranches({
        fs: legitfs._storageFs,
        dir: repoPath,
      });
      const initialCommit = await isogit.resolveRef({
        fs: legitfs._storageFs,
        dir: repoPath,
        ref: 'main',
      });

      // Save archive
      const archive = await legitfs.saveArchive();

      // Create new empty repo in a new memfs
      const newMemfs = createFsFromVolume(new Volume());
      await isogit.init({
        fs: newMemfs,
        dir: repoPath,
        defaultBranch: 'anonymous',
      });

      const newLegitfs = await openLegitFs({
        // @ts-ignore -- fix type
        storageFs: newMemfs,
        gitRoot: repoPath,
        anonymousBranch: 'anonymous',
      });

      // Load archive into new repo
      await newLegitfs.loadArchive({
        legitArchive: archive,
      });

      // Verify branches were restored
      const restoredBranches = await isogit.listBranches({
        fs: newLegitfs._storageFs,
        dir: repoPath,
      });
      expect(restoredBranches).toContain('main');

      // Verify main branch points to same commit
      const restoredCommit = await isogit.resolveRef({
        fs: newLegitfs._storageFs,
        dir: repoPath,
        ref: 'main',
      });
      expect(restoredCommit).toBe(initialCommit);

      // Verify file content is accessible
      const content = await newLegitfs.promises.readFile(
        `${repoPath}/.legit/branches/main/a.txt`,
        'utf-8'
      );
      expect(content).toBe('A file');
    });

    it('should handle loading archive with multiple branches', async () => {
      // Create a second branch
      await legitfs.promises.mkdir(`${repoPath}/.legit/branches/feature`);
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/feature/feature.txt`,
        'Feature content'
      );

      const archive = await legitfs.saveArchive();

      // Create new repo and load archive
      const newMemfs = createFsFromVolume(new Volume());
      await isogit.init({
        fs: newMemfs,
        dir: repoPath,
        defaultBranch: 'anonymous',
      });

      const newLegitfs = await openLegitFs({
        // @ts-ignore -- fix type
        storageFs: newMemfs,
        gitRoot: repoPath,
        anonymousBranch: 'anonymous',
      });

      await newLegitfs.loadArchive({ legitArchive: archive });

      // Verify both branches exist
      const branches = await isogit.listBranches({
        fs: newLegitfs._storageFs,
        dir: repoPath,
      });
      expect(branches).toContain('main');
      expect(branches).toContain('feature');
    });

    it('should merge new refs when loading archive', async () => {
      // Create initial repo with one branch
      const archive1 = await legitfs.saveArchive();

      // Modify repo - add a new branch
      await legitfs.promises.mkdir(`${repoPath}/.legit/branches/new-branch`);
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/new-branch/file.txt`,
        'New branch content'
      );

      const archive2 = await legitfs.saveArchive();

      // Create new repo, load first archive
      const newMemfs = createFsFromVolume(new Volume());
      await isogit.init({
        fs: newMemfs,
        dir: repoPath,
        defaultBranch: 'anonymous',
      });

      const newLegitfs = await openLegitFs({
        // @ts-ignore -- fix type
        storageFs: newMemfs,
        gitRoot: repoPath,
        anonymousBranch: 'anonymous',
      });

      await newLegitfs.loadArchive({ legitArchive: archive1 });

      const branchesAfterFirstLoad = await isogit.listBranches({
        fs: newLegitfs._storageFs,
        dir: repoPath,
      });

      // Load second archive - should add new refs
      await newLegitfs.loadArchive({ legitArchive: archive2 });

      const branchesAfterSecondLoad = await isogit.listBranches({
        fs: newLegitfs._storageFs,
        dir: repoPath,
      });

      // Should have more branches after loading second archive
      expect(branchesAfterSecondLoad.length).toBeGreaterThan(
        branchesAfterFirstLoad.length
      );
      expect(branchesAfterSecondLoad).toContain('new-branch');
    });

    it('should create conflict branch for non-fast-forwardable refs', async () => {
      // Create initial repo and save archive
      const archive1 = await legitfs.saveArchive();
      const mainCommit1 = await isogit.resolveRef({
        fs: legitfs._storageFs,
        dir: repoPath,
        ref: 'main',
      });

      // Modify main branch
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/main/modified.txt`,
        'Modified content'
      );

      const archive2 = await legitfs.saveArchive();
      const mainCommit2 = await isogit.resolveRef({
        fs: legitfs._storageFs,
        dir: repoPath,
        ref: 'main',
      });

      expect(mainCommit2).not.toBe(mainCommit1);

      // Create new repo, load first archive
      const newMemfs = createFsFromVolume(new Volume());
      await isogit.init({
        fs: newMemfs,
        dir: repoPath,
        defaultBranch: 'anonymous',
      });

      const newLegitfs = await openLegitFs({
        // @ts-ignore -- fix type
        storageFs: newMemfs,
        gitRoot: repoPath,
        anonymousBranch: 'anonymous',
      });

      await newLegitfs.loadArchive({ legitArchive: archive1 });

      // Diverge the main branch in new repo
      await newLegitfs.promises.writeFile(
        `${repoPath}/.legit/branches/main/diverged.txt`,
        'Diverged content'
      );

      const divergedCommit = await isogit.resolveRef({
        fs: newLegitfs._storageFs,
        dir: repoPath,
        ref: 'main',
      });

      // Load second archive - main cannot be fast-forwarded
      await newLegitfs.loadArchive({ legitArchive: archive2 });

      // Verify that main was NOT updated (stays at diverged commit)
      const currentMainCommit = await isogit.resolveRef({
        fs: newLegitfs._storageFs,
        dir: repoPath,
        ref: 'main',
      });
      expect(currentMainCommit).toBe(divergedCommit);

      // Verify that a conflict branch was created
      const allBranches = await isogit.listBranches({
        fs: newLegitfs._storageFs,
        dir: repoPath,
      });

      const conflictBranch = allBranches.find(b => b.includes('conflict'));
      expect(conflictBranch).toBeDefined();

      // The conflict branch should point to the incoming commit
      if (conflictBranch) {
        const conflictCommit = await isogit.resolveRef({
          fs: newLegitfs._storageFs,
          dir: repoPath,
          ref: conflictBranch,
        });
        expect(conflictCommit).toBe(mainCommit2);
      }
    });

    it('should update refs that can be fast-forwarded', async () => {
      // Create initial repo with branch
      await legitfs.promises.mkdir(`${repoPath}/.legit/branches/feature`);
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/feature/file.txt`,
        'Initial feature'
      );

      const archive1 = await legitfs.saveArchive();
      const featureCommit1 = await isogit.resolveRef({
        fs: legitfs._storageFs,
        dir: repoPath,
        ref: 'feature',
      });

      // Advance the feature branch
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/feature/file2.txt`,
        'More feature content'
      );

      const archive2 = await legitfs.saveArchive();
      const featureCommit2 = await isogit.resolveRef({
        fs: legitfs._storageFs,
        dir: repoPath,
        ref: 'feature',
      });

      expect(featureCommit2).not.toBe(featureCommit1);

      // Create new repo and load first archive
      const newMemfs = createFsFromVolume(new Volume());
      await isogit.init({
        fs: newMemfs,
        dir: repoPath,
        defaultBranch: 'anonymous',
      });

      const newLegitfs = await openLegitFs({
        // @ts-ignore -- fix type
        storageFs: newMemfs,
        gitRoot: repoPath,
        anonymousBranch: 'anonymous',
      });

      await newLegitfs.loadArchive({ legitArchive: archive1 });

      const featureAfterFirstLoad = await isogit.resolveRef({
        fs: newLegitfs._storageFs,
        dir: repoPath,
        ref: 'feature',
      });
      expect(featureAfterFirstLoad).toBe(featureCommit1);

      // Load second archive - feature should be fast-forwarded
      await newLegitfs.loadArchive({ legitArchive: archive2 });

      const featureAfterSecondLoad = await isogit.resolveRef({
        fs: newLegitfs._storageFs,
        dir: repoPath,
        ref: 'feature',
      });
      expect(featureAfterSecondLoad).toBe(featureCommit2);
    });

    it('should clear existing .git folder when clearExisting is true', async () => {
      // Create initial repo with some content and save archive
      await legitfs.promises.writeFile(
        `${repoPath}/.legit/branches/main/original.txt`,
        'Original content'
      );

      const archive1 = await legitfs.saveArchive();
      const originalCommit = await isogit.resolveRef({
        fs: legitfs._storageFs,
        dir: repoPath,
        ref: 'main',
      });

      // Create a second repo with different content
      const memfs2 = createFsFromVolume(
        Volume.fromNestedJSON({
          '/repo': {
            'different.txt': 'Different content',
            '.git': {},
          },
        })
      );

      await isogit.init({
        fs: memfs2,
        dir: '/repo',
        defaultBranch: 'main',
      });
      await isogit.add({ fs: memfs2, dir: '/repo', filepath: 'different.txt' });
      await isogit.commit({
        fs: memfs2,
        dir: '/repo',
        message: 'Different initial commit',
        author: { name: 'Test', email: 'test@example.com' },
      });

      const legitfs2 = await openLegitFs({
        // @ts-ignore -- fix type
        storageFs: memfs2,
        gitRoot: '/repo',
        anonymousBranch: 'main',
      });

      // Verify the second repo has its own content
      const beforeLoadContent = await legitfs2.promises.readFile(
        '/repo/.legit/branches/main/different.txt',
        'utf-8'
      );
      expect(beforeLoadContent).toBe('Different content');

      const beforeLoadBranches = await isogit.listBranches({
        fs: legitfs2._storageFs,
        dir: '/repo',
      });
      expect(beforeLoadBranches).toContain('main');

      // Load archive with clearExisting=true
      // This should replace the entire .git folder, removing existing refs
      await legitfs2.loadArchive({
        legitArchive: archive1,
        clearExisting: true,
      });

      // After loading with clearExisting=true:
      // 1. The original "different.txt" should NOT be accessible (it was in the replaced repo)
      // 2. The archived content should be accessible
      // 3. Only the archived refs should exist (no refs from the repo before loading)

      const afterLoadContent = await legitfs2.promises.readFile(
        '/repo/.legit/branches/main/original.txt',
        'utf-8'
      );
      expect(afterLoadContent).toBe('Original content');

      // The commit should match the archived commit
      const afterLoadCommit = await isogit.resolveRef({
        fs: legitfs2._storageFs,
        dir: '/repo',
        ref: 'main',
      });
      expect(afterLoadCommit).toBe(originalCommit);

      const branchesAfterLoad = await isogit.listBranches({
        fs: legitfs2._storageFs,
        dir: '/repo',
      });
      expect(branchesAfterLoad).toContain('main');
      expect(branchesAfterLoad.length).toBe(1); // Only main branch from archive

      // The different.txt file from the original repo should not exist
      await expect(
        legitfs2.promises.readFile(
          '/repo/.legit/branches/main/different.txt',
          'utf-8'
        )
      ).rejects.toThrow();
    });
  });

  describe('round-trip tests', () => {
    it('should preserve file contents through save/load cycle', async () => {
      const originalContent = await legitfs.promises.readFile(
        `${repoPath}/.legit/branches/main/a.txt`,
        'utf-8'
      );

      const archive = await legitfs.saveArchive();

      // Create new repo and load archive
      const newMemfs = createFsFromVolume(new Volume());
      await isogit.init({
        fs: newMemfs,
        dir: repoPath,
        defaultBranch: 'anonymous',
      });

      const newLegitfs = await openLegitFs({
        // @ts-ignore -- fix type
        storageFs: newMemfs,
        gitRoot: repoPath,
        anonymousBranch: 'anonymous',
      });

      await newLegitfs.loadArchive({ legitArchive: archive });

      const restoredContent = await newLegitfs.promises.readFile(
        `${repoPath}/.legit/branches/main/a.txt`,
        'utf-8'
      );

      expect(restoredContent).toBe(originalContent);
    });

    it('should preserve folder structure through save/load cycle', async () => {
      // Verify folder structure exists in original
      const originalEntries = await legitfs.promises.readdir(
        `${repoPath}/.legit/branches/main/f`
      );
      expect(originalEntries).toContain('b.txt');
      expect(originalEntries).toContain('c.txt');

      const archive = await legitfs.saveArchive();

      // Create new repo and load archive
      const newMemfs = createFsFromVolume(new Volume());
      await isogit.init({
        fs: newMemfs,
        dir: repoPath,
        defaultBranch: 'anonymous',
      });

      const newLegitfs = await openLegitFs({
        // @ts-ignore -- fix type
        storageFs: newMemfs,
        gitRoot: repoPath,
        anonymousBranch: 'anonymous',
      });

      await newLegitfs.loadArchive({ legitArchive: archive });

      // Verify folder structure is preserved
      const restoredEntries = await newLegitfs.promises.readdir(
        `${repoPath}/.legit/branches/main/f`
      );
      expect(restoredEntries).toContain('b.txt');
      expect(restoredEntries).toContain('c.txt');
    });

    it('should preserve commit history through save/load cycle', async () => {
      const originalLog = await isogit.log({
        fs: legitfs._storageFs,
        dir: repoPath,
        depth: 10,
      });

      const archive = await legitfs.saveArchive();

      // Create new repo and load archive
      const newMemfs = createFsFromVolume(new Volume());
      await isogit.init({
        fs: newMemfs,
        dir: repoPath,
        defaultBranch: 'anonymous',
      });

      const newLegitfs = await openLegitFs({
        // @ts-ignore -- fix type
        storageFs: newMemfs,
        gitRoot: repoPath,
        anonymousBranch: 'anonymous',
      });

      await newLegitfs.loadArchive({ legitArchive: archive });

      const restoredLog = await isogit.log({
        fs: newLegitfs._storageFs,
        dir: repoPath,
        ref: 'main',
        depth: 10,
      });

      expect(restoredLog.length).toBe(originalLog.length);
      expect(restoredLog[0]!.commit.message).toBe(
        originalLog[0]!.commit.message
      );
    });
  });
});
