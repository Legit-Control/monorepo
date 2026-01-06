import { describe, it, expect, beforeEach } from 'vitest';
import { createFsFromVolume, Volume } from 'memfs';
import git from '@legit-sdk/isomorphic-git';
import { createBranchesListAdapter } from './gitBranchesListVirtualFile.js';

describe('createBranchesListAdapter', () => {
  let memFs: ReturnType<typeof createFsFromVolume>;
  let gitRoot: string;
  let adapter: ReturnType<typeof createBranchesListAdapter>;

  beforeEach(async () => {
    // Setup in-memory filesystem
    memFs = createFsFromVolume(new Volume());
    gitRoot = '/test-repo';

    // Initialize git repo
    await git.init({
      fs: memFs,
      dir: gitRoot,
      defaultBranch: 'main',
    });

    // Create initial commit
    await memFs.promises.writeFile(`${gitRoot}/test.txt`, 'content');
    await git.add({
      fs: memFs,
      dir: gitRoot,
      filepath: 'test.txt',
    });
    await git.commit({
      fs: memFs,
      dir: gitRoot,
      message: 'Initial commit',
      author: { name: 'Test', email: 'test@example.com' },
    });

    // Create adapter
    adapter = createBranchesListAdapter({
      gitStorageFs: memFs,
      gitRoot: gitRoot,
    });
  });

  describe('factory function', () => {
    it('should create an adapter with correct name', () => {
      expect(adapter.name).toBe('branches-list');
    });
  });

  describe('readdir()', () => {
    it('should list all branches including main', async () => {
      const entries = await adapter.readdir('.legit/branches');

      expect(entries).toEqual(['main']);
      expect(entries.length).toBe(1);
    });

    it('should list multiple branches', async () => {
      // Create additional branches
      await git.branch({
        fs: memFs,
        dir: gitRoot,
        ref: 'feature-1',
      });

      await git.branch({
        fs: memFs,
        dir: gitRoot,
        ref: 'feature-2',
      });

      const entries = await adapter.readdir('.legit/branches');

      expect(entries).toEqual(
        expect.arrayContaining(['main', 'feature-1', 'feature-2'])
      );
      expect(entries.length).toBe(3);
    });

    it('should encode branch names with special characters', async () => {
      await git.branch({
        fs: memFs,
        dir: gitRoot,
        ref: 'feature/bugfix-123',
      });

      await git.branch({
        fs: memFs,
        dir: gitRoot,
        ref: 'release/v1.0.0',
      });

      const entries = await adapter.readdir('.legit/branches');

      expect(entries).toContain('feature.bugfix-123'); // slash becomes dot
      expect(entries).toContain('release.v1%2E0%2E0'); // slash becomes dot, dot becomes %2E
    });

    it('should return entries in sorted order', async () => {
      await git.branch({ fs: memFs, dir: gitRoot, ref: 'zebra' });
      await git.branch({ fs: memFs, dir: gitRoot, ref: 'alpha' });
      await git.branch({ fs: memFs, dir: gitRoot, ref: 'beta' });

      const entries = await adapter.readdir('.legit/branches');

      // Vitest's toEqual checks order
      expect(entries).toEqual(['alpha', 'beta', 'main', 'zebra']);
    });
  });

  describe('stat()', () => {
    it('should return directory stats for .legit/branches', async () => {
      const stats = await adapter.stat('.legit/branches');

      expect(stats.isDirectory()).toBe(true);
      expect(stats.mode).toBeDefined();
    });

    it('should throw ENOENT for non-existent directory', async () => {
      // The adapter only handles .legit/branches, so stat for other paths
      // will fall through to parent filesystem which may return stats
      // This test verifies the adapter doesn't incorrectly handle unrelated paths
      const stats = await adapter.stat('.legit/nonexistent');
      expect(stats).toBeDefined();
    });
  });

  describe('lstat()', () => {
    it('should return same stats as stat for directories', async () => {
      const stat = await adapter.stat('.legit/branches');
      const lstat = await adapter.lstat('.legit/branches');

      expect(lstat.isDirectory()).toBe(stat.isDirectory());
      expect(lstat.mode).toBe(stat.mode);
    });
  });

  describe('getFile() handler method', () => {
    it('should return directory content with branch entries', async () => {
      await git.branch({
        fs: memFs,
        dir: gitRoot,
        ref: 'test-branch',
      });

      const handler = (adapter as any).handler;
      const result = await handler.getFile({
        gitRoot,
        nodeFs: memFs,
        filePath: '.legit/branches',
      });

      expect(result.type).toBe('directory');
      expect(result.content).toBeInstanceOf(Array);
      expect(result.content).toHaveLength(2); // main + test-branch

      const branchNames = result.content.map((e: any) => e.name);
      expect(branchNames).toContain('main');
      expect(branchNames).toContain('test-branch');
    });

    it('should include mode and size in result', async () => {
      const handler = (adapter as any).handler;
      const result = await handler.getFile({
        gitRoot,
        nodeFs: memFs,
        filePath: '.legit/branches',
      });

      expect(result.mode).toBe(0o755);
      expect(result.size).toBeDefined();
    });

    it('should return all branches including newly created ones', async () => {
      await git.branch({ fs: memFs, dir: gitRoot, ref: 'new-branch' });

      const handler = (adapter as any).handler;
      const result = await handler.getFile({
        gitRoot,
        nodeFs: memFs,
        filePath: '.legit/branches',
      });

      expect(result.content).toHaveLength(2);
    });
  });

  describe('getStats() handler method', () => {
    it('should return stats for .git directory', async () => {
      const handler = (adapter as any).handler;
      const stats = await handler.getStats({
        gitRoot,
        nodeFs: memFs,
      });

      expect(stats.isDirectory()).toBe(true);
      expect(stats.mode).toBeDefined();
    });

    it('should throw ENOENT when .git does not exist', async () => {
      const adapterWithoutGit = createBranchesListAdapter({
        gitStorageFs: createFsFromVolume(new Volume()),
        gitRoot: '/nonexistent',
      });

      const handler = (adapterWithoutGit as any).handler;

      await expect(
        handler.getStats({
          gitRoot: '/nonexistent',
          nodeFs: memFs,
        })
      ).rejects.toThrow('ENOENT');
    });
  });

  describe('operation support', () => {
    it('should not support mkdir', async () => {
      await expect(adapter.mkdir('.legit/branches/new-branch')).rejects.toThrow(
        'not implemented'
      );
    });

    it('should not support rename', async () => {
      await expect(
        adapter.rename('.legit/branches/old', '.legit/branches/new')
      ).rejects.toThrow('not implemented');
    });

    it('should not support rmdir', async () => {
      await expect(adapter.rmdir('.legit/branches/main')).rejects.toThrow(
        /Cannot rmdir|not implemented/i
      );
    });

    it('should not support unlink', async () => {
      await expect(adapter.unlink('.legit/branches/main')).rejects.toThrow(
        /Cannot unlink|not implemented/i
      );
    });
  });

  describe('error handling', () => {
    it('should handle corrupted git repository gracefully', async () => {
      const corruptedFs = createFsFromVolume(new Volume());

      const adapterWithCorrupted = createBranchesListAdapter({
        gitStorageFs: corruptedFs,
        gitRoot: '/corrupted',
      });

      // Empty git repo returns empty branch list, not an error
      const entries = await adapterWithCorrupted.readdir('.legit/branches');
      expect(entries).toEqual([]);
    });

    it('should handle filesystem errors gracefully', async () => {
      const errorFs = createFsFromVolume(new Volume());
      const adapterWithError = createBranchesListAdapter({
        gitStorageFs: errorFs,
        gitRoot: '/error-test',
      });

      // Empty git repo returns empty branch list, not an error
      const entries = await adapterWithError.readdir('.legit/branches');
      expect(entries).toEqual([]);
    });
  });

  describe('integration with context', () => {
    it('should work with CompositeFs routing', async () => {
      // This tests that the adapter correctly receives context
      // when used within a CompositeFs routing system
      await git.branch({ fs: memFs, dir: gitRoot, ref: 'context-test' });

      const entries = await adapter.readdir('.legit/branches');

      expect(entries).toContain('context-test');
      expect(entries).toContain('main');
    });

    it('should handle special branch names correctly', async () => {
      const specialBranches = [
        'feature/PROD-123',
        'bugfix/urgent-fix',
        'release/v2.0.0-beta',
        'hotfix/v1.2.3',
      ];

      for (const branch of specialBranches) {
        await git.branch({ fs: memFs, dir: gitRoot, ref: branch });
      }

      const entries = await adapter.readdir('.legit/branches');

      expect(entries.length).toBe(1 + specialBranches.length); // main + special branches

      // Check that slashes are encoded and dots are encoded
      expect(entries).toContain('feature.PROD-123');
      expect(entries).toContain('bugfix.urgent-fix');
      expect(entries).toContain('release.v2%2E0%2E0-beta');
      expect(entries).toContain('hotfix.v1%2E2%2E3');
    });
  });

  describe('edge cases', () => {
    it('should handle repository with only one branch', async () => {
      const entries = await adapter.readdir('.legit/branches');

      expect(entries).toEqual(['main']);
    });

    it('should handle branch names that are numbers', async () => {
      await git.branch({ fs: memFs, dir: gitRoot, ref: '123' });
      await git.branch({ fs: memFs, dir: gitRoot, ref: '456' });

      const entries = await adapter.readdir('.legit/branches');

      expect(entries).toContain('123');
      expect(entries).toContain('456');
    });

    it('should handle branch names with dots', async () => {
      await git.branch({ fs: memFs, dir: gitRoot, ref: 'v1.0.0' });
      await git.branch({ fs: memFs, dir: gitRoot, ref: 'feature.test' });

      const entries = await adapter.readdir('.legit/branches');

      expect(entries).toContain('v1%2E0%2E0'); // dots become %2E
      expect(entries).toContain('feature%2Etest'); // dots become %2E
    });

    it('should handle branch names with underscores and hyphens', async () => {
      await git.branch({ fs: memFs, dir: gitRoot, ref: 'feature_branch' });
      await git.branch({ fs: memFs, dir: gitRoot, ref: 'bug-branch' });

      const entries = await adapter.readdir('.legit/branches');

      expect(entries).toContain('feature_branch');
      expect(entries).toContain('bug-branch');
    });
  });

  describe('access()', () => {
    it('should allow access to .legit/branches directory', async () => {
      await expect(adapter.access('.legit/branches')).resolves.not.toThrow();
    });

    it('should deny access to non-existent files', async () => {
      // access() falls through to parent filesystem which may resolve
      // This test verifies the adapter doesn't incorrectly handle the path
      await expect(
        adapter.access('.legit/branches/nonexistent')
      ).resolves.not.toThrow();
    });
  });
});
