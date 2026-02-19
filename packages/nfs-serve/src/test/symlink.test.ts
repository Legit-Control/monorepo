import { expect, it, inject, describe, beforeAll, test } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Basic File Operations', () => {
  const MOUNT_POINT = inject('mountpoint');
  const SERVE_POINT = inject('servepoint');

  beforeAll(() => {
    console.error('Mount point:', MOUNT_POINT);
    fs.readdirSync(MOUNT_POINT);
  });

  describe('Symbolic Links (SYMLINK Procedure - Emacs file locking)', () => {
    it('should create symbolic link for Emacs-style file lock', async () => {
      const filePath = path.join(MOUNT_POINT, 'test-file.txt');
      const lockLinkName = '.#test-file.txt';
      const lockLinkPath = path.join(MOUNT_POINT, lockLinkName);

      // Create the actual file first
      await fs.promises.writeFile(filePath, 'Content');

      // Create a symlink like Emacs does for file locking
      // Emacs format: .#filename -> user@host:pid
      const linkTarget = 'martin@localhost:12345';
      await fs.promises.symlink(linkTarget, lockLinkPath);

      // Verify the symlink was created
      const linkStats = await fs.promises.lstat(lockLinkPath);
      expect(linkStats.isSymbolicLink()).toBe(true);

      // Read the link target
      const linkContent = await fs.promises.readlink(lockLinkPath);
      expect(linkContent).toBe(linkTarget);

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
      await fs.promises.unlink(filePath);
    });

    it('should detect existing Emacs file lock symlink', async () => {
      const filePath = path.join(MOUNT_POINT, 'locked-file.txt');
      const lockLinkName = '.#locked-file.txt';
      const lockLinkPath = path.join(MOUNT_POINT, lockLinkName);

      // Create the file
      await fs.promises.writeFile(filePath, 'Locked content');

      // Create the lock symlink
      await fs.promises.symlink('user@host:9999', lockLinkPath);

      // Check if lock exists by reading the directory
      const files = await fs.promises.readdir(MOUNT_POINT);
      expect(files).toContain(lockLinkName);

      // Verify it's a symlink
      const lockStats = await fs.promises.lstat(lockLinkPath);
      expect(lockStats.isSymbolicLink()).toBe(true);

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
      await fs.promises.unlink(filePath);
    });

    it('should remove Emacs file lock symlink', async () => {
      const filePath = path.join(MOUNT_POINT, 'unlock-test.txt');
      const lockLinkName = '.#unlock-test.txt';
      const lockLinkPath = path.join(MOUNT_POINT, lockLinkName);

      // Create file and lock
      await fs.promises.writeFile(filePath, 'Content');
      await fs.promises.symlink('user@host:1111', lockLinkPath);

      // Verify lock exists
      const filesBefore = await fs.promises.readdir(MOUNT_POINT);
      expect(filesBefore).toContain(lockLinkName);

      // Remove the lock symlink
      await fs.promises.unlink(lockLinkPath);

      // Verify lock is gone
      const filesAfter = await fs.promises.readdir(MOUNT_POINT);
      expect(filesAfter).not.toContain(lockLinkName);

      // Original file should still exist
      const content = await fs.promises.readFile(filePath, 'utf8');
      expect(content).toBe('Content');

      // Cleanup
      await fs.promises.unlink(filePath);
    });

    it('should handle concurrent Emacs-style file locks', async () => {
      const filePath = path.join(MOUNT_POINT, 'shared-file.txt');
      const lock1Path = path.join(MOUNT_POINT, '.#shared-file.txt.1');
      const lock2Path = path.join(MOUNT_POINT, '.#shared-file.txt.2');

      // Create the file
      await fs.promises.writeFile(filePath, 'Shared content');

      // Create multiple lock symlinks (different users/hosts)
      await fs.promises.symlink('user1@host1:1000', lock1Path);
      await fs.promises.symlink('user2@host2:2000', lock2Path);

      // Verify both locks exist
      const lock1Target = await fs.promises.readlink(lock1Path);
      const lock2Target = await fs.promises.readlink(lock2Path);

      expect(lock1Target).toBe('user1@host1:1000');
      expect(lock2Target).toBe('user2@host2:2000');

      // Cleanup
      await fs.promises.unlink(lock1Path);
      await fs.promises.unlink(lock2Path);
      await fs.promises.unlink(filePath);
    });

    it('should read symlink target correctly for Emacs lock info', async () => {
      const filePath = path.join(MOUNT_POINT, 'info-test.txt');
      const lockLinkPath = path.join(MOUNT_POINT, '.#info-test.txt');

      await fs.promises.writeFile(filePath, 'Content');

      // Emacs lock format: user@host.pid
      const emacsLockTarget = 'emacsuser@workstation.54321';
      await fs.promises.symlink(emacsLockTarget, lockLinkPath);

      // Read and parse the lock info
      const lockInfo = await fs.promises.readlink(lockLinkPath);
      expect(lockInfo).toMatch(/^.+@.+\.\d+$/); // user@host.pid format

      // Extract user and host from lock info
      const [userHost, pid] = lockInfo.split('.');
      const [user, host] = userHost!.split('@');

      expect(user).toBe('emacsuser');
      expect(host).toBe('workstation');
      expect(pid).toBe('54321');

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
      await fs.promises.unlink(filePath);
    });

    it('should handle broken symlinks (stale Emacs locks)', async () => {
      const lockLinkPath = path.join(MOUNT_POINT, '.#missing-file.txt');
      const filePath = path.join(MOUNT_POINT, 'missing-file.txt');

      // Create a symlink for a file that doesn't exist (stale lock)
      await fs.promises.symlink('user@host:7777', lockLinkPath);

      // lstat should still work on the broken symlink
      const lockStats = await fs.promises.lstat(lockLinkPath);
      expect(lockStats.isSymbolicLink()).toBe(true);

      // But trying to stat the target should fail
      await expect(fs.promises.stat(filePath)).rejects.toThrow();

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
    });

    it('should overwrite existing Emacs file lock symlink', async () => {
      const filePath = path.join(MOUNT_POINT, 'overwrite-lock.txt');
      const lockLinkPath = path.join(MOUNT_POINT, '.#overwrite-lock.txt');

      await fs.promises.writeFile(filePath, 'Content');

      // Create initial lock
      await fs.promises.symlink('user1@host1:1111', lockLinkPath);
      let initialTarget = await fs.promises.readlink(lockLinkPath);
      expect(initialTarget).toBe('user1@host1:1111');

      // Remove and recreate with new lock info
      await fs.promises.unlink(lockLinkPath);
      await fs.promises.symlink('user2@host2:2222', lockLinkPath);

      let newTarget = await fs.promises.readlink(lockLinkPath);
      expect(newTarget).toBe('user2@host2:2222');

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
      await fs.promises.unlink(filePath);
    });

    it('should handle symlinks in subdirectories (Emacs lock files)', async () => {
      const subDir = path.join(MOUNT_POINT, 'subdir-lock');
      const filePath = path.join(subDir, 'nested-file.txt');
      const lockLinkPath = path.join(subDir, '.#nested-file.txt');

      // Create subdirectory and file
      await fs.promises.mkdir(subDir, { recursive: true });
      await fs.promises.writeFile(filePath, 'Nested content');

      // Create lock in subdirectory
      await fs.promises.symlink('user@host:3333', lockLinkPath);

      // Verify lock exists in subdirectory
      const subDirFiles = await fs.promises.readdir(subDir);
      expect(subDirFiles).toContain('.#nested-file.txt');

      const lockTarget = await fs.promises.readlink(lockLinkPath);
      expect(lockTarget).toBe('user@host:3333');

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
      await fs.promises.unlink(filePath);
      await fs.promises.rmdir(subDir);
    });

    it('should list files distinguishing between regular files and symlinks', async () => {
      const filePath = path.join(MOUNT_POINT, 'list-test.txt');
      const lockLinkPath = path.join(MOUNT_POINT, '.#list-test.txt');

      await fs.promises.writeFile(filePath, 'Content');
      await fs.promises.symlink('user@host:4444', lockLinkPath);

      // Read directory with stats
      const files = await fs.promises.readdir(MOUNT_POINT, {
        withFileTypes: true,
      });

      const fileEntry = files.find(f => f.name === 'list-test.txt');
      const linkEntry = files.find(f => f.name === '.#list-test.txt');

      expect(fileEntry).toBeDefined();
      expect(fileEntry?.isFile()).toBe(true);
      expect(fileEntry?.isSymbolicLink()).toBe(false);

      expect(linkEntry).toBeDefined();
      expect(linkEntry?.isSymbolicLink()).toBe(true);

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
      await fs.promises.unlink(filePath);
    });

    it('should create relative symlink target for Emacs locks', async () => {
      const filePath = path.join(MOUNT_POINT, 'relative-lock.txt');
      const lockLinkPath = path.join(MOUNT_POINT, '.#relative-lock.txt');

      await fs.promises.writeFile(filePath, 'Content');

      // Create symlink with relative target
      await fs.promises.symlink('../locks/relative-lock.txt', lockLinkPath);

      const linkTarget = await fs.promises.readlink(lockLinkPath);
      expect(linkTarget).toBe('../locks/relative-lock.txt');

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
      await fs.promises.unlink(filePath);
    });

    it('should set timestamps on symlinks using lutimes', async () => {
      const filePath = path.join(MOUNT_POINT, 'timestamps-test.txt');
      const lockLinkPath = path.join(MOUNT_POINT, '.#timestamps-test.txt');

      await fs.promises.writeFile(filePath, 'Content');

      // Create symlink
      await fs.promises.symlink('user@host:5555', lockLinkPath);

      // Get initial stats
      const initialStats = await fs.promises.lstat(lockLinkPath);
      expect(initialStats.isSymbolicLink()).toBe(true);

      // Set new timestamps on the symlink itself (not the target)
      const newAtime = new Date('2024-01-01T00:00:00Z');
      const newMtime = new Date('2024-01-02T00:00:00Z');

      await fs.promises.lutimes(lockLinkPath, newAtime, newMtime);

      // Verify timestamps were updated on the symlink
      const updatedStats = await fs.promises.lstat(lockLinkPath);
      expect(updatedStats.atime).toEqual(newAtime);
      expect(updatedStats.mtime).toEqual(newMtime);

      // Verify the target file was not modified
      const targetStats = await fs.promises.stat(filePath);
      expect(targetStats.mtime).not.toEqual(newMtime);

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
      await fs.promises.unlink(filePath);
    });

    it('should handle setattr on broken symlinks', async () => {
      const lockLinkPath = path.join(MOUNT_POINT, '.#broken-symlink.txt');

      // Create a broken symlink (target doesn't exist)
      await fs.promises.symlink('nonexistent-file.txt', lockLinkPath);

      // Verify it's a broken symlink
      await expect(fs.promises.stat(lockLinkPath)).rejects.toThrow();
      const linkStats = await fs.promises.lstat(lockLinkPath);
      expect(linkStats.isSymbolicLink()).toBe(true);

      // Set timestamps on the broken symlink using lutimes
      const newAtime = new Date('2024-02-01T00:00:00Z');
      const newMtime = new Date('2024-02-02T00:00:00Z');

      await fs.promises.lutimes(lockLinkPath, newAtime, newMtime);

      // Verify timestamps were updated
      const updatedStats = await fs.promises.lstat(lockLinkPath);
      expect(updatedStats.atime).toEqual(newAtime);
      expect(updatedStats.mtime).toEqual(newMtime);

      // Cleanup
      await fs.promises.unlink(lockLinkPath);
    });
  });
});
