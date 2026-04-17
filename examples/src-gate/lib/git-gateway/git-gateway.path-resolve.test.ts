import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitGateway } from './git-gateway.js';
import { vol, fs } from 'memfs';

// Mock global fetch for GitHub API
global.fetch = vi.fn();

/**
 * TDD Tests for resolvePath helper function
 *
 * These tests follow the TDD approach:
 * 1. Write failing tests first
 * 2. Implement the function to make tests pass
 * 3. Refactor
 *
 * Note: Tests that require repo cloning are in git-gateway.path-resolve.integration.test.ts
 * Unit tests here only test path parsing without cloning
 */

describe('GitGateway.resolvePath - Unit Tests', () => {
  let gitGateway: GitGateway;
  let storageFs: typeof fs;

  beforeEach(() => {
    // Reset memfs before each test
    vol.reset();
    vi.mocked(global.fetch).mockReset();

    // Create storage filesystem with memfs
    storageFs = fs;

    // Create GitGateway instance with memfs as storage
    gitGateway = new GitGateway(storageFs as any, '/storage');
  });

  describe('Path type detection', () => {
    it('should resolve root path "/"', async () => {
      const result = await gitGateway.resolvePath('/');
      expect(result.pathType).toBe('root');
    });

    it('should resolve config directory "/config"', async () => {
      const result = await gitGateway.resolvePath('/config');
      expect(result.pathType).toBe('configFile');
    });

    it('should resolve host "/github.com"', async () => {
      const result = await gitGateway.resolvePath('/github.com');
      expect(result.pathType).toBe('host');
      expect(result.host).toBe('github.com');
    });

    it('should resolve user path "/github.com/username"', async () => {
      const result = await gitGateway.resolvePath('/github.com/martin-lysk');
      expect(result.pathType).toBe('user');
      expect(result.host).toBe('github.com');
      expect(result.username).toBe('martin-lysk');
    });

    it('should resolve repo path "/github.com/username/repo"', async () => {
      const result = await gitGateway.resolvePath('/github.com/martin-lysk/src-gate-testrepo');
      expect(result.pathType).toBe('repo');
      expect(result.host).toBe('github.com');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('src-gate-testrepo');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string as root', async () => {
      const result = await gitGateway.resolvePath('');
      expect(result.pathType).toBe('root');
    });

    it('should handle trailing slashes', async () => {
      const result1 = await gitGateway.resolvePath('/github.com/');
      expect(result1.pathType).toBe('host');

      const result2 = await gitGateway.resolvePath('/github.com/martin-lysk/');
      expect(result2.pathType).toBe('user');
    });

    it('should reject paths outside supported structure', async () => {
      await expect(gitGateway.resolvePath('/invalid/path')).rejects.toThrow();
    });

    it('should reject non-github hosts', async () => {
      await expect(gitGateway.resolvePath('/gitlab.com')).rejects.toThrow();
    });

    it('should reject deeper config paths', async () => {
      await expect(gitGateway.resolvePath('/config/github_token')).rejects.toThrow();
    });
  });

  describe('Return type structure', () => {
    it('should include all relevant properties for host type', async () => {
      const result = await gitGateway.resolvePath('/github.com');
      expect(result).toHaveProperty('pathType', 'host');
      expect(result).toHaveProperty('host', 'github.com');
    });

    it('should include all relevant properties for user type', async () => {
      const result = await gitGateway.resolvePath('/github.com/martin-lysk');
      expect(result).toHaveProperty('pathType', 'user');
      expect(result).toHaveProperty('host', 'github.com');
      expect(result).toHaveProperty('username', 'martin-lysk');
    });

    it('should include all relevant properties for repo type', async () => {
      const result = await gitGateway.resolvePath('/github.com/martin-lysk/src-gate-testrepo');
      expect(result).toHaveProperty('pathType', 'repo');
      expect(result).toHaveProperty('host', 'github.com');
      expect(result).toHaveProperty('username', 'martin-lysk');
      expect(result).toHaveProperty('repoName', 'src-gate-testrepo');
    });
  });
});
