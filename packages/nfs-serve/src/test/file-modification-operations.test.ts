import { expect, it, inject, describe, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('File Modification Operations', () => {
  const MOUNT_POINT = inject('mountpoint');

  beforeAll(() => {
    console.error('Mount point:', MOUNT_POINT);
    fs.readdirSync(MOUNT_POINT);
  });

  describe('File Renaming (RENAME Procedure)', () => {
    it('should perform simple rename (same directory)', async () => {
      const oldPath = path.join(MOUNT_POINT, 'rename-old.txt');
      const newPath = path.join(MOUNT_POINT, 'rename-new.txt');
      const content = 'File to rename';

      await fs.promises.writeFile(oldPath, content);
      await fs.promises.rename(oldPath, newPath);

      await expect(fs.promises.access(oldPath)).rejects.toThrow();

      const newContent = await fs.promises.readFile(newPath, 'utf8');
      expect(newContent).toBe(content);

      await fs.promises.unlink(newPath);
    });

    it('should move between directories', async () => {
      const srcDir = path.join(MOUNT_POINT, 'move-src');
      const destDir = path.join(MOUNT_POINT, 'move-dest');
      const oldPath = path.join(srcDir, 'move-me.txt');
      const newPath = path.join(destDir, 'moved.txt');
      const content = 'File to move between directories';

      await fs.promises.mkdir(srcDir, { recursive: true });
      await fs.promises.mkdir(destDir, { recursive: true });
      await fs.promises.writeFile(oldPath, content);
      await fs.promises.rename(oldPath, newPath);

      await expect(fs.promises.access(oldPath)).rejects.toThrow();

      const newContent = await fs.promises.readFile(newPath, 'utf8');
      expect(newContent).toBe(content);

      await fs.promises.unlink(newPath);
      await fs.promises.rmdir(srcDir);
      await fs.promises.rmdir(destDir);
    });

    it('should rename to existing name (overwrite)', async () => {
      const srcPath = path.join(MOUNT_POINT, 'rename-src.txt');
      const destPath = path.join(MOUNT_POINT, 'rename-dest.txt');
      const srcContent = 'Source file content';
      const destContent = 'Destination file content';

      await fs.promises.writeFile(srcPath, srcContent);
      await fs.promises.writeFile(destPath, destContent);
      await fs.promises.rename(srcPath, destPath);

      const finalContent = await fs.promises.readFile(destPath, 'utf8');
      expect(finalContent).toBe(srcContent);

      await expect(fs.promises.access(srcPath)).rejects.toThrow();

      await fs.promises.unlink(destPath);
    });

    it('should fail to rename non-existent file', async () => {
      const nonExistentPath = path.join(MOUNT_POINT, 'does-not-exist.txt');
      const newPath = path.join(MOUNT_POINT, 'new-name.txt');

      await expect(fs.promises.rename(nonExistentPath, newPath)).rejects.toThrow();
    });

    it('should rename open file handles', async () => {
      const oldPath = path.join(MOUNT_POINT, 'open-file.txt');
      const newPath = path.join(MOUNT_POINT, 'renamed-file.txt');
      const content = 'File that was open during rename';

      await fs.promises.writeFile(oldPath, content);

      const fd = await fs.promises.open(oldPath, 'r+');
      await fs.promises.rename(oldPath, newPath);
      await fd.close();

      const newContent = await fs.promises.readFile(newPath, 'utf8');
      expect(newContent).toBe(content);

      await fs.promises.unlink(newPath);
    });

    it('should rename with special characters', async () => {
      const oldPath = path.join(MOUNT_POINT, 'old_file-name@123.txt');
      const newPath = path.join(MOUNT_POINT, 'new_file-name@456.txt');
      const content = 'Special chars rename test';

      await fs.promises.writeFile(oldPath, content);
      await fs.promises.rename(oldPath, newPath);

      const newContent = await fs.promises.readFile(newPath, 'utf8');
      expect(newContent).toBe(content);

      await fs.promises.unlink(newPath);
    });

    it('should rename directory with files', async () => {
      const oldDirPath = path.join(MOUNT_POINT, 'old-dir');
      const newDirPath = path.join(MOUNT_POINT, 'new-dir');
      const filePath = path.join(oldDirPath, 'file-in-dir.txt');
      const content = 'File in renamed directory';

      await fs.promises.mkdir(oldDirPath);
      await fs.promises.writeFile(filePath, content);
      await fs.promises.rename(oldDirPath, newDirPath);

      await expect(fs.promises.access(oldDirPath)).rejects.toThrow();

      const dirStats = await fs.promises.stat(newDirPath);
      expect(dirStats.isDirectory()).toBe(true);

      const newFilePath = path.join(newDirPath, 'file-in-dir.txt');
      const fileContent = await fs.promises.readFile(newFilePath, 'utf8');
      expect(fileContent).toBe(content);

      await fs.promises.unlink(newFilePath);
      await fs.promises.rmdir(newDirPath);
    });

    it('should handle batch rename operations', async () => {
      const files = Array(10).fill(null).map((_, i) => ({
        old: path.join(MOUNT_POINT, `batch-old-${i}.txt`),
        new: path.join(MOUNT_POINT, `batch-new-${i}.txt`),
        content: `Batch file ${i} content`
      }));

      // Create all files
      await Promise.all(
        files.map(file => fs.promises.writeFile(file.old, file.content))
      );

      // Rename all files
      await Promise.all(
        files.map(file => fs.promises.rename(file.old, file.new))
      );

      // Verify all renames
      await Promise.all(
        files.map(async file => {
          await expect(fs.promises.access(file.old)).rejects.toThrow();
          const content = await fs.promises.readFile(file.new, 'utf8');
          expect(content).toBe(file.content);
        })
      );

      // Cleanup
      await Promise.all(
        files.map(file => fs.promises.unlink(file.new))
      );
    });
  });

  describe('File Attributes (SETATTR/GETATTR Procedures)', () => {
    it('should change file permissions', async () => {
      const filePath = path.join(MOUNT_POINT, 'perm-test.txt');
      const content = 'Permission test file';

      await fs.promises.writeFile(filePath, content, { mode: 0o644 });

      let stats = await fs.promises.stat(filePath);
      expect(stats.mode & 0o777).toBe(0o644);

      await fs.promises.chmod(filePath, 0o755);

      stats = await fs.promises.stat(filePath);
      expect(stats.mode & 0o777).toBe(0o755);

      await fs.promises.unlink(filePath);
    });

    it('should change file timestamps (mtime, atime)', async () => {
      const filePath = path.join(MOUNT_POINT, 'time-test.txt');
      const content = 'Timestamp test file';

      await fs.promises.writeFile(filePath, content);

      const originalStats = await fs.promises.stat(filePath);
      const originalMtime = originalStats.mtime;
      const originalAtime = originalStats.atime;

      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newMtime = new Date('2023-01-01T12:00:00Z');
      const newAtime = new Date('2023-01-01T12:30:00Z');

      await fs.promises.utimes(filePath, newAtime, newMtime);

      const updatedStats = await fs.promises.stat(filePath);
      expect(updatedStats.mtime.getTime()).toBe(newMtime.getTime());
      expect(updatedStats.atime.getTime()).toBe(newAtime.getTime());

      await fs.promises.unlink(filePath);
    });

    it('should set file size (truncate)', async () => {
      const filePath = path.join(MOUNT_POINT, 'truncate-test.txt');
      const content = 'This content should be truncated';

      await fs.promises.writeFile(filePath, content);

      const originalStats = await fs.promises.stat(filePath);
      expect(originalStats.size).toBe(content.length);

      const fd = await fs.promises.open(filePath, 'r+');
      await fd.truncate(10);
      await fd.close();

      const truncatedStats = await fs.promises.stat(filePath);
      expect(truncatedStats.size).toBe(10);

      const truncatedContent = await fs.promises.readFile(filePath, 'utf8');
      expect(truncatedContent).toBe(content.slice(0, 10));

      await fs.promises.unlink(filePath);
    });

    it('should change file mode bits', async () => {
      const filePath = path.join(MOUNT_POINT, 'mode-test.txt');
      const content = 'Mode bits test file';

      await fs.promises.writeFile(filePath, content, { mode: 0o644 });

      let stats = await fs.promises.stat(filePath);
      expect(stats.mode & 0o777).toBe(0o644);

      // Change to execute for owner, read for group and others
      await fs.promises.chmod(filePath, 0o744);

      stats = await fs.promises.stat(filePath);
      expect(stats.mode & 0o777).toBe(0o744);

      await fs.promises.unlink(filePath);
    });

    it('should get file attributes (size, permissions, timestamps)', async () => {
      const filePath = path.join(MOUNT_POINT, 'attrs-test.txt');
      const content = 'Attributes test file';

      await fs.promises.writeFile(filePath, content, { mode: 0o644 });

      const stats = await fs.promises.stat(filePath);

      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBe(content.length);
      expect(stats.mode & 0o777).toBe(0o644);
      expect(stats.mtime).toBeInstanceOf(Date);
      expect(stats.atime).toBeInstanceOf(Date);
      expect(stats.ctime).toBeInstanceOf(Date);
      expect(stats.birthtime).toBeInstanceOf(Date);

      await fs.promises.unlink(filePath);
    });

    it('should verify attributes persist after file modifications', async () => {
      const filePath = path.join(MOUNT_POINT, 'persist-attrs.txt');
      const originalContent = 'Original content';
      const newContent = 'Modified content with different length';

      await fs.promises.writeFile(filePath, originalContent, { mode: 0o644 });

      const originalStats = await fs.promises.stat(filePath);
      const originalMode = originalStats.mode & 0o777;

      await fs.promises.writeFile(filePath, newContent);

      const newStats = await fs.promises.stat(filePath);
      expect(newStats.size).toBe(newContent.length);
      expect(newStats.mode & 0o777).toBe(originalMode);
      expect(newStats.mtime.getTime()).toBeGreaterThan(originalStats.mtime.getTime());

      await fs.promises.unlink(filePath);
    });

    it('should handle large timestamp changes', async () => {
      const filePath = path.join(MOUNT_POINT, 'large-time-change.txt');
      const content = 'Large time change test';

      await fs.promises.writeFile(filePath, content);

      const veryOldTime = new Date('1970-01-01T00:00:01Z');
      const veryNewTime = new Date('2038-01-19T03:14:07Z');

      await fs.promises.utimes(filePath, veryOldTime, veryNewTime);

      const stats = await fs.promises.stat(filePath);
      expect(stats.mtime.getTime()).toBe(veryNewTime.getTime());
      expect(stats.atime.getTime()).toBe(veryOldTime.getTime());

      await fs.promises.unlink(filePath);
    });

    it('should handle truncation to larger size (extend file)', async () => {
      const filePath = path.join(MOUNT_POINT, 'extend-truncate.txt');
      const content = 'Short';

      await fs.promises.writeFile(filePath, content);

      const fd = await fs.promises.open(filePath, 'r+');
      await fd.truncate(100);
      await fd.close();

      const stats = await fs.promises.stat(filePath);
      expect(stats.size).toBe(100);

      const extendedContent = await fs.promises.readFile(filePath, 'utf8');
      expect(extendedContent.startsWith(content)).toBe(true);
      expect(extendedContent.length).toBe(100);

      await fs.promises.unlink(filePath);
    });

    it('should handle truncation to zero (empty file)', async () => {
      const filePath = path.join(MOUNT_POINT, 'zero-truncate.txt');
      const content = 'This content will be completely removed';

      await fs.promises.writeFile(filePath, content);

      const fd = await fs.promises.open(filePath, 'r+');
      await fd.truncate(0);
      await fd.close();

      const stats = await fs.promises.stat(filePath);
      expect(stats.size).toBe(0);

      const emptyContent = await fs.promises.readFile(filePath, 'utf8');
      expect(emptyContent).toBe('');

      await fs.promises.unlink(filePath);
    });
  });
});