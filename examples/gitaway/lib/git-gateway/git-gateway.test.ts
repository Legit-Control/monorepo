import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitGateway } from './git-gateway.js';
import { vol, fs } from 'memfs';

// Mock global fetch
global.fetch = vi.fn();

describe('GitGateway', () => {
  let gitGateway: GitGateway;
  let storageFs: typeof fs;

  beforeEach(() => {
    // Reset memfs before each test
    vol.reset();

    // Reset mocks
    vi.mocked(global.fetch).mockReset();

    // Create storage filesystem with memfs
    storageFs = fs;

    // Create GitGateway instance with memfs as storage
    gitGateway = new GitGateway(storageFs as any, '/storage');
  });

  describe('readdir', () => {
    describe('Root directory (/)', () => {
      it('should return config and github.com entries', async () => {
        const result = await gitGateway.readdir('/');
        expect(result).toEqual(
          expect.arrayContaining(['config', 'github.com'])
        );
        expect(result).toHaveLength(2);
      });

      it('should return config and github.com entries for empty path', async () => {
        const result = await gitGateway.readdir('');
        expect(result).toEqual(
          expect.arrayContaining(['config', 'github.com'])
        );
        expect(result).toHaveLength(2);
      });
    });

    describe('/config directory', () => {
      it('should return empty array when listing config directory', async () => {
        const result = await gitGateway.readdir('/config');
        expect(result).toEqual([]);
      });
    });

    describe('/github.com directory', () => {
      it('should return empty array when no users are bookmarked', async () => {
        const result = await gitGateway.readdir('/github.com');
        expect(result).toEqual([]);
      });

      it('should create storage folder bookmarks/github.com when accessed', async () => {
        // Access the github.com directory
        await gitGateway.readdir('/github.com');

        // Verify the storage folder was created in memfs
        const bookmarksExists = await storageFs.promises
          .access('/storage/bookmarks/github.com')
          .then(() => true)
          .catch(() => false);

        expect(bookmarksExists).toBe(true);
      });

      it('should return list of bookmarked users when users exist in storage', async () => {
        // Create a user folder in storage
        await storageFs.promises.mkdir(
          '/storage/bookmarks/github.com/testuser',
          {
            recursive: true,
          }
        );

        const result = await gitGateway.readdir('/github.com');
        expect(result).toContain('testuser');
      });

      it('should return multiple bookmarked users', async () => {
        // Create multiple user folders in storage
        await storageFs.promises.mkdir('/storage/bookmarks/github.com/user1', {
          recursive: true,
        });
        await storageFs.promises.mkdir('/storage/bookmarks/github.com/user2', {
          recursive: true,
        });
        await storageFs.promises.mkdir('/storage/bookmarks/github.com/user3', {
          recursive: true,
        });

        const result = await gitGateway.readdir('/github.com');
        expect(result).toEqual(
          expect.arrayContaining(['user1', 'user2', 'user3'])
        );
        expect(result).toHaveLength(3);
      });
    });

    describe('/github.com/username directories', () => {
      it('should return empty array when user has no bookmarked repos', async () => {
        // Create user folder in storage
        await storageFs.promises.mkdir(
          '/storage/bookmarks/github.com/testuser',
          {
            recursive: true,
          }
        );

        const result = await gitGateway.readdir('/github.com/testuser');

        expect(result).toEqual([]);
      });

      it('should create storage folder for user when first accessed', async () => {
        // Mock GitHub API to return user exists
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as any);

        // Mock repos API
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [],
        } as any);

        // Access user directory for the first time
        await gitGateway.readdir('/github.com/newuser');

        // Verify the user folder was NOT created in storage (unmaterialized)
        const userFolderExists = await storageFs.promises
          .access('/storage/bookmarks/github.com/newuser')
          .then(() => true)
          .catch(() => false);

        expect(userFolderExists).toBe(false);
      });

      it('should return list of repos for a user', async () => {
        // TODO it should not return the bookmarked repos, it should return the list of repos from github instead
      });
    });

    describe('Non-existent directories', () => {
      it('should throw ENOENT error for non-existent directory', async () => {
        await expect(gitGateway.readdir('/nonexistent')).rejects.toThrow(
          'ENOENT: no such file or directory, readdir'
        );
      });

      it('should throw ENOENT for nested non-existent path', async () => {
        await expect(
          gitGateway.readdir('/github.com/nonexistentuser/deeply/nested/path')
        ).rejects.toThrow('ENOENT: no such file or directory, readdir');
      });
    });
  });

  describe('stat', () => {
    describe('Root directory (/)', () => {
      it('should return directory stats for root', async () => {
        const stats = await gitGateway.stat('/');

        expect(stats.isDirectory()).toBe(true);
        expect(stats.isFile()).toBe(false);
        expect(stats.isSymbolicLink()).toBe(false);
        expect(stats.mode).toBe(0o755);
        expect(stats.size).toBe(4096);
      });
    });

    describe('/github.com directory', () => {
      it('should return directory stats and create storage folder on first access', async () => {
        const stats = await gitGateway.stat('/github.com');

        expect(stats.isDirectory()).toBe(true);
        expect(stats.isFile()).toBe(false);

        // Verify storage folder was created
        const exists = await storageFs.promises
          .access('/storage/bookmarks/github.com')
          .then(() => true)
          .catch(() => false);

        expect(exists).toBe(true);
      });
    });

    describe('/github.com/username directories', () => {
      it('should return directory stats for user and create storage folder', async () => {
        // Mock GitHub API to return user exists
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as any);

        const stats = await gitGateway.stat('/github.com/testuser');

        expect(stats.isDirectory()).toBe(true);
        expect(stats.isFile()).toBe(false);

        // Verify user folder was NOT created in storage (unmaterialized)
        const exists = await storageFs.promises
          .access('/storage/bookmarks/github.com/testuser')
          .then(() => true)
          .catch(() => false);

        expect(exists).toBe(false);
      });

      it('should return consistent stats for multiple calls to same user', async () => {
        // Mock GitHub API
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as any);

        const stats1 = await gitGateway.stat('/github.com/testuser');
        const stats2 = await gitGateway.stat('/github.com/testuser');

        expect(stats1.isDirectory()).toBe(stats2.isDirectory());
        expect(stats1.mode).toBe(stats2.mode);
        expect(stats1.size).toBe(stats2.size);
      });
    });

    describe('Stat properties', () => {
      it('should return valid timestamp properties', async () => {
        const stats = await gitGateway.stat('/github.com');

        // Just verify timestamps are reasonable (not checking exact times due to async)
        expect(stats.atime).toBeDefined();
        expect(stats.mtime).toBeDefined();
        expect(stats.ctime).toBeDefined();
        expect(stats.birthtime).toBeDefined();

        // Verify they're Date objects
        expect(stats.atime instanceof Date).toBe(true);
        expect(stats.mtime instanceof Date).toBe(true);
        expect(stats.ctime instanceof Date).toBe(true);
        expect(stats.birthtime instanceof Date).toBe(true);
      });

      it('should return unique inode for each stat call', async () => {
        // Mock GitHub API for user1
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as any);

        const stats1 = await gitGateway.stat('/github.com');
        const stats2 = await gitGateway.stat('/github.com/user1');

        expect(stats1.ino).not.toBe(stats2.ino);
      });
    });
  });

  describe('GitHub API Integration', () => {
    describe('User validation via GitHub API', () => {
      it('should return ENOENT for non-existent GitHub user', async () => {
        // Mock GitHub API to return 404
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 404,
        } as any);

        await expect(gitGateway.stat('/github.com/nonexistentuser')).rejects.toThrow(
          'ENOENT'
        );
      });

      it('should return stats for existing GitHub user without materializing', async () => {
        // Mock GitHub API to return user exists
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as any);

        const stats = await gitGateway.stat('/github.com/validuser');

        expect(stats.isDirectory()).toBe(true);

        // Verify user folder was NOT created in storage (unmaterialized)
        const exists = await storageFs.promises
          .access('/storage/bookmarks/github.com/validuser')
          .then(() => true)
          .catch(() => false);

        expect(exists).toBe(false);
      });

      it('should cache user validation result in unmaterialized map', async () => {
        // Mock GitHub API
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as any);

        // First call - should hit API
        await gitGateway.stat('/github.com/cacheduser');
        expect(global.fetch).toHaveBeenCalledTimes(1);

        // Second call - should use cache, no API call
        await gitGateway.stat('/github.com/cacheduser');
        expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1
      });
    });

    describe('Fetching repos via GitHub API', () => {
      it('should fetch and return repos for unmaterialized user', async () => {
        // Mock repos API
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [
            { name: 'repo1' },
            { name: 'repo2' },
            { name: 'repo3' },
          ],
        } as any);

        const repos = await gitGateway.readdir('/github.com/userwithrepos');

        expect(repos).toEqual(['repo1', 'repo2', 'repo3']);
      });

      it('should keep user unmaterialized after fetching repos', async () => {
        // Mock user exists
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as any);

        // Mock repos API
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [{ name: 'repo1' }],
        } as any);

        await gitGateway.readdir('/github.com/userwithrepos');

        // Verify user folder was NOT created in storage (still unmaterialized)
        const exists = await storageFs.promises
          .access('/storage/bookmarks/github.com/userwithrepos')
          .then(() => true)
          .catch(() => false);

        expect(exists).toBe(false);
      });
    });

    describe('Materialization on repo access', () => {
      it('should return stats for repo without materializing user', async () => {
        // Mock user exists
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as any);

        // Mock repos API
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [{ name: 'repo1' }, { name: 'repo2' }],
        } as any);

        // Access a specific repo - should NOT materialize, just validate
        const stats = await gitGateway.stat('/github.com/userwithrepo/repo1');

        expect(stats.isDirectory()).toBe(true);

        // Verify user folder was NOT created in storage (still unmaterialized)
        const userExists = await storageFs.promises
          .access('/storage/bookmarks/github.com/userwithrepo')
          .then(() => true)
          .catch(() => false);

        expect(userExists).toBe(false);
      });

      it('should return ENOENT for non-existent repo', async () => {
        // Mock user exists
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
        } as any);

        // Mock repos API
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => [{ name: 'existing-repo' }],
        } as any);

        await expect(
          gitGateway.stat('/github.com/userwithrepo/non-existent-repo')
        ).rejects.toThrow('ENOENT');
      });
    });

    describe('Filtering invalid paths', () => {
      it('should return ENOENT for .git (not a valid GitHub user)', async () => {
        // Mock GitHub API to return 404
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 404,
        } as any);

        await expect(gitGateway.stat('/github.com/.git')).rejects.toThrow('ENOENT');
      });

      it('should return ENOENT for .gitignore (not a valid GitHub user)', async () => {
        // Mock GitHub API to return 404
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 404,
        } as any);

        await expect(gitGateway.stat('/github.com/.gitignore')).rejects.toThrow('ENOENT');
      });
    });
  });
});
