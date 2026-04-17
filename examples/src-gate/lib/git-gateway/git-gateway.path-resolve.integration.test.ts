import { describe, it, expect, beforeAll } from 'vitest';
import { GitGateway } from './git-gateway.js';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

/**
 * Integration tests for resolvePath with branch handling
 *
 * These tests use the real src-gate-testrepo which includes a branch with slashes: "branch/with/slash"
 */

describe('GitGateway.resolvePath - Integration Tests with Branches', () => {
  let gitGateway: GitGateway;
  let tempDir: string;

  beforeAll(async () => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitaway-path-resolve-'));

    // Create GitGateway instance with real filesystem
    gitGateway = new GitGateway(fs, tempDir);

    console.log(`[Path Resolve Integration] Using temp directory: ${tempDir}`);
  });

  describe('Branch with slash detection', () => {
    it('should detect simple branch "main"', async () => {
      const result = await gitGateway.resolvePath(
        '/github.com/martin-lysk/src-gate-testrepo/main'
      );

      expect(result.pathType).toBe('branch');
      expect(result.branch).toBe('main');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('src-gate-testrepo');
    }, 30000);

    it('should detect branch with slashes "branch/with/slash"', async () => {
      const result = await gitGateway.resolvePath(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with/slash'
      );

      expect(result.pathType).toBe('branch');
      expect(result.branch).toBe('branch/with/slash');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('src-gate-testrepo');
    }, 30000);

    it('should distinguish between branch "branch/with/slash" and branch "branch" with path "with/slash"', async () => {
      // /github.com/martin-lysk/src-gate-testrepo/branch/with/slash
      // Should match branch "branch/with/slash" (root of repo)
      const result = await gitGateway.resolvePath(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with/slash'
      );

      expect(result.pathType).toBe('branch');
      expect(result.branch).toBe('branch/with/slash');
      expect(result.folderPath).toBeUndefined();
      expect(result.filePath).toBeUndefined();
    }, 30000);
  });

  describe('Files and folders in branches with slashes', () => {
    it('should resolve file in branch with slash', async () => {
      const result = await gitGateway.resolvePath(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with/slash/README.md'
      );

      expect(result.pathType).toBe('gitFile');
      expect(result.branch).toBe('branch/with/slash');
      expect(result.filePath).toBe('README.md');
    }, 30000);

    it('should resolve folder in branch with slash', async () => {
      const result = await gitGateway.resolvePath(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with/slash/path'
      );

      expect(result.pathType).toBe('gitFolder');
      expect(result.branch).toBe('branch/with/slash');
      expect(result.folderPath).toBe('path');
    }, 30000);

    it('should resolve deeply nested path in branch with slash', async () => {
      const result = await gitGateway.resolvePath(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with/slash/path/to/file.md'
      );

      expect(result.pathType).toBe('gitFile');
      expect(result.branch).toBe('branch/with/slash');
      expect(result.filePath).toBe('path/to/file.md');
    }, 30000);
  });

  describe('Greedy branch matching', () => {
    it('should prefer longer branch names over shorter ones', async () => {
      // If we have branches "feature" and "feature/api"
      // /github.com/martin-lysk/src-gate-testrepo/feature/api/users.ts
      // Should match branch "feature/api" with path "users.ts"
      // NOT branch "feature" with path "api/users.ts"

      // This test verifies the greedy matching algorithm
      const result = await gitGateway.resolvePath(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with/slash/README.md'
      );

      expect(result.pathType).toBe('gitFile');
      expect(result.branch).toBe('branch/with/slash'); // Full branch matched
      expect(result.filePath).toBe('README.md');
    }, 30000);
  });

  describe('OID detection with branches that have slashes', () => {
    it('should detect OID even when path could be mistaken for branch with slashes', async () => {
      const oid = 'd831b1194111ca430c4ba9560fb4975c99435f60';
      const result = await gitGateway.resolvePath(
        `/github.com/martin-lysk/src-gate-testrepo/${oid}`
      );

      expect(result.pathType).toBe('oid');
      expect(result.commitOid).toBe(oid);
    }, 30000);

    it('should resolve file path with OID', async () => {
      const oid = 'd831b1194111ca430c4ba9560fb4975c99435f60';
      const result = await gitGateway.resolvePath(
        `/github.com/martin-lysk/src-gate-testrepo/${oid}/README.md`
      );

      expect(result.pathType).toBe('gitFile');
      expect(result.commitOid).toBe(oid);
      expect(result.filePath).toBe('README.md');
    }, 30000);
  });

  describe('File vs folder detection', () => {
    it('should detect file based on extension in branch with slash', async () => {
      const result = await gitGateway.resolvePath(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with/slash/README.md'
      );

      expect(result.pathType).toBe('gitFile');
      expect(result.branch).toBe('branch/with/slash');
      expect(result.filePath).toBe('README.md');
    }, 30000);

    it('should detect folder when no extension in branch with slash', async () => {
      const result = await gitGateway.resolvePath(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with/slash/path'
      );

      expect(result.pathType).toBe('gitFolder');
      expect(result.branch).toBe('branch/with/slash');
      expect(result.folderPath).toBe('path');
    }, 30000);
  });

  describe('readdir for repos with slash branches', () => {
    it('should list all branches including branches with slashes when reading repo directory', async () => {
      // readdir on the repo path should list all branches
      const branchFolders = await gitGateway.readdir(
        '/github.com/martin-lysk/src-gate-testrepo'
      );

      expect(branchFolders).toContain('main');

      expect(branchFolders).toContain('branch');
      expect(branchFolders).toContain('copilot');

      const branchSubFolders = await gitGateway.readdir(
        '/github.com/martin-lysk/src-gate-testrepo/branch'
      );

      expect(branchSubFolders).toContain('with');

      const branchSubSubFolders = await gitGateway.readdir(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with'
      );

      expect(branchSubSubFolders).toContain('slash');
    }, 30000);
  });

  describe('reading files with branch namespace', () => {
    it('should read file from main branch using file handle', async () => {
      const fileHandle = await gitGateway.open(
        '/github.com/martin-lysk/src-gate-testrepo/main/path/to/file.md',
        'r'
      );

      const buffer = Buffer.alloc(1024);
      const { bytesRead } = await fileHandle.read(buffer, 0, 1024, 0);
      const content = buffer.slice(0, bytesRead).toString('utf8');

      expect(content.toLowerCase()).toContain('hello world');

      await fileHandle.close();
    }, 30000);

    it('should read file from branch with slashes using file handle', async () => {
      const fileHandle = await gitGateway.open(
        '/github.com/martin-lysk/src-gate-testrepo/branch/with/slash/path/to/file.md',
        'r'
      );

      const buffer = Buffer.alloc(1024);
      const { bytesRead } = await fileHandle.read(buffer, 0, 1024, 0);
      const content = buffer.slice(0, bytesRead).toString('utf8');

      expect(content.toLowerCase()).toContain('hello mars');

      await fileHandle.close();
    }, 30000);
  });
});
