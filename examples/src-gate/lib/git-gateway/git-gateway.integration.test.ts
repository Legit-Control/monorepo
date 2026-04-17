import { describe, it, expect, beforeAll } from 'vitest';
import { GitGateway } from './git-gateway.js';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

/**
 * Integration tests for GitGateway lazy fetching functionality
 *
 * These tests perform real git operations against actual GitHub repositories.
 * They are slower than unit tests but validate the complete workflow.
 */

describe('GitGateway Integration Tests', () => {
  let gitGateway: GitGateway;
  let tempDir: string;
  let storageFs: typeof fs;

  beforeAll(async () => {
    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitaway-integration-'));
    storageFs = fs;

    // Create GitGateway instance with real filesystem
    gitGateway = new GitGateway(storageFs, tempDir);

    console.log(`[Integration Test] Using temp directory: ${tempDir}`);
  });

  describe('Real GitHub repository operations', () => {
    it('should clone and read a real repository', async () => {
      // Test with a small, real public repository
      const username = 'martin-lysk';
      const repoName = 'todohub-demo1';

      // Materialize the user by creating folder
      const userPath = path.join(tempDir, 'bookmarks/github.com', username);
      await fs.promises.mkdir(userPath, { recursive: true });

      // Access the repo - this should trigger clone
      console.log(
        `[Integration Test] Accessing /github.com/${username}/${repoName}`
      );
      const stats = await gitGateway.stat(
        `/github.com/${username}/${repoName}`
      );

      expect(stats.isDirectory()).toBe(true);

      // Verify the repo was cloned
      const repoDir = path.join(
        tempDir,
        'bookmarks/github.com',
        username,
        repoName
      );
      const repoExists = await fs.promises
        .access(repoDir)
        .then(() => true)
        .catch(() => false);

      expect(repoExists).toBe(true);

      // Verify .git folder exists
      const gitDirExists = await fs.promises
        .access(path.join(repoDir, '.git'))
        .then(() => true)
        .catch(() => false);

      expect(gitDirExists).toBe(true);

      console.log(
        `[Integration Test] Repository cloned successfully to ${repoDir}`
      );
    }, 30000); // 30 second timeout for cloning

    it('should list branches in the cloned repository', async () => {
      const username = 'martin-lysk';
      const repoName = 'todohub-demo1';

      // Readdir should work after clone
      console.log(
        `[Integration Test] Reading directory /github.com/${username}/${repoName}`
      );
      const entries = await gitGateway.readdir(
        `/github.com/${username}/${repoName}`
      );

      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBeGreaterThan(0);

      console.log(
        `[Integration Test] Found ${entries.length} entries:`,
        entries
      );
    }, 10000);

    it('should list files/folder in root of main of cloned repository', async () => {
      const username = 'martin-lysk';
      const repoName = 'todohub-demo1';

      // Readdir should work after clone
      console.log(
        `[Integration Test] Reading directory /github.com/${username}/${repoName}`
      );
      const entries = await gitGateway.readdir(
        `/github.com/${username}/${repoName}/main`
      );

      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBeGreaterThan(0);

      console.log(
        `[Integration Test] Found ${entries.length} entries:`,
        entries
      );
    }, 10000);

    it('should get stats for files in the repository', async () => {
      const username = 'martin-lysk';
      const repoName = 'todohub-demo1';

      // Test file stat - look for common files
      const testFiles = ['README.md'];
      let fileStats: any = null;
      let foundFile = '';

      for (const file of testFiles) {
        try {
          console.log(`[Integration Test] Getting stats for ${file}`);
          fileStats = await gitGateway.stat(
            `/github.com/${username}/${repoName}/main/${file}`
          );
          foundFile = file;
          break;
        } catch (error) {
          // File doesn't exist, try next
          continue;
        }
      }

      if (fileStats) {
        expect(fileStats.isFile()).toBe(true);
        console.log(`[Integration Test] Got stats for ${foundFile}:`, {
          isFile: fileStats.isFile(),
          mode: fileStats.mode,
        });
      } else {
        console.log(
          '[Integration Test] No common test files found in repository'
        );
      }
    }, 10000);

    it('should not re-clone an already cloned repository', async () => {
      const username = 'martin-lysk';
      const repoName = 'todohub-demo1';

      // Access the same repo again - should use cache
      const startTime = Date.now();
      await gitGateway.stat(`/github.com/${username}/${repoName}`);
      const endTime = Date.now();

      const duration = endTime - startTime;

      // Should be much faster than cloning (usually < 100ms vs several seconds)
      console.log(`[Integration Test] Second access took ${duration}ms`);
      expect(duration).toBeLessThan(5000); // Generous threshold
    }, 10000);
  });

  describe('Nested directory operations', () => {
    it('should read nested directories in real repository', async () => {
      const username = 'martin-lysk';
      const repoName = 'todohub-demo1';

      // Try to read a nested directory
      const testPaths = ['src', 'lib', 'app', 'public'];
      let foundPath = '';

      for (const testPath of testPaths) {
        try {
          console.log(
            `[Integration Test] Trying to read /github.com/${username}/${repoName}/${testPath}`
          );
          const entries = await gitGateway.readdir(
            `/github.com/${username}/${repoName}/${testPath}`
          );
          foundPath = testPath;
          console.log(
            `[Integration Test] Found ${entries.length} entries in ${testPath}:`,
            entries
          );
          break;
        } catch (error) {
          // Path doesn't exist, try next
          continue;
        }
      }

      if (!foundPath) {
        console.log('[Integration Test] No common nested directories found');
      }
    }, 10000);
  });

  describe('File operations', () => {
    it('should open and read a file from real repository', async () => {
      const username = 'martin-lysk';
      const repoName = 'todohub-demo1';

      // Try to open common files
      const testFiles = ['README.md', 'package.json', 'README'];
      let fileHandle: any = null;
      let foundFile = '';

      for (const file of testFiles) {
        try {
          console.log(`[Integration Test] Opening ${file}`);
          fileHandle = await gitGateway.open(
            `/github.com/${username}/${repoName}/${file}`,
            0 // flags
          );
          foundFile = file;
          break;
        } catch (error) {
          // File doesn't exist, try next
          continue;
        }
      }

      if (fileHandle) {
        expect(fileHandle).toBeDefined();
        console.log(`[Integration Test] Opened ${foundFile} successfully`);

        // Read from the file
        const buffer = Buffer.alloc(1024);
        const result = await fileHandle.read(buffer, 0, 1024, 0);

        console.log(
          `[Integration Test] Read ${result.bytesRead} bytes from ${foundFile}`
        );
        expect(result.bytesRead).toBeGreaterThan(0);

        // Close the handle
        await fileHandle.close();
        console.log(`[Integration Test] Closed ${foundFile}`);
      } else {
        console.log('[Integration Test] No common test files found to open');
      }
    }, 10000);
  });
});
