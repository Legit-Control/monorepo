import { expect, it, inject, describe, beforeAll, test } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Directory Operations', () => {
  const MOUNT_POINT = inject('mountpoint');

  beforeAll(() => {
    console.error('Mount point:', MOUNT_POINT);
    fs.readdirSync(MOUNT_POINT);
  });

  describe('Directory Management (MKDIR/RMDIR Procedures)', () => {
    it('should create empty directory', async () => {
      const dirPath = path.join(MOUNT_POINT, 'empty-dir');

      await fs.promises.mkdir(dirPath);

      const stats = await fs.promises.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);

      const contents = await fs.promises.readdir(dirPath);
      expect(contents).toEqual([]);

      await fs.promises.rmdir(dirPath);
    });

    it('should create nested directories', async () => {
      const dirPath = path.join(MOUNT_POINT, 'nested', 'deeply', 'created');

      await fs.promises.mkdir(dirPath, { recursive: true });

      const stats = await fs.promises.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);

      // Verify all parent directories exist
      const parentStats1 = await fs.promises.stat(
        path.join(MOUNT_POINT, 'nested')
      );
      const parentStats2 = await fs.promises.stat(
        path.join(MOUNT_POINT, 'nested', 'deeply')
      );
      expect(parentStats1.isDirectory()).toBe(true);
      expect(parentStats2.isDirectory()).toBe(true);

      // Cleanup in reverse order
      await fs.promises.rmdir(dirPath);
      await fs.promises.rmdir(path.join(MOUNT_POINT, 'nested', 'deeply'));
      await fs.promises.rmdir(path.join(MOUNT_POINT, 'nested'));
    });

    it('should remove empty directory', async () => {
      const dirPath = path.join(MOUNT_POINT, 'remove-me');

      await fs.promises.mkdir(dirPath);
      await fs.promises.rmdir(dirPath);

      await expect(fs.promises.access(dirPath)).rejects.toThrow();
    });

    it('should fail to remove directory with files', async () => {
      const dirPath = path.join(MOUNT_POINT, 'dir-with-files');
      const filePath = path.join(dirPath, 'file.txt');

      await fs.promises.mkdir(dirPath);
      await fs.promises.writeFile(filePath, 'content');

      await expect(fs.promises.rmdir(dirPath)).rejects.toThrow();

      await fs.promises.unlink(filePath);
      await fs.promises.rmdir(dirPath);
    });

    it('should create directory with long names', async () => {
      const longName = 'a'.repeat(200);
      const dirPath = path.join(MOUNT_POINT, longName);

      await fs.promises.mkdir(dirPath);

      const stats = await fs.promises.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);

      await fs.promises.rmdir(dirPath);
    });

    it('should create directory with special characters', async () => {
      const specialName = 'dir-with_special.chars@123';
      const dirPath = path.join(MOUNT_POINT, specialName);

      await fs.promises.mkdir(dirPath);

      const stats = await fs.promises.stat(dirPath);
      expect(stats.isDirectory()).toBe(true);

      await fs.promises.rmdir(dirPath);
    });

    it('should remove directory with subdirectories', async () => {
      const baseDir = path.join(MOUNT_POINT, 'base-dir');
      const subDir1 = path.join(baseDir, 'subdir1');
      const subDir2 = path.join(baseDir, 'subdir2');

      await fs.promises.mkdir(subDir1, { recursive: true });
      await fs.promises.mkdir(subDir2, { recursive: true });

      // This should fail because directories are not empty
      await expect(fs.promises.rmdir(baseDir)).rejects.toThrow();

      // Remove subdirectories first
      await fs.promises.rmdir(subDir1);
      await fs.promises.rmdir(subDir2);
      await fs.promises.rmdir(baseDir);
    });

    test.todo('should handle directory permission changes', async () => {
      const dirPath = path.join(MOUNT_POINT, 'perm-dir');

      await fs.promises.mkdir(dirPath, { mode: 0o755 });

      let stats = await fs.promises.stat(dirPath);
      expect(stats.mode & 0o777).toBe(0o755);

      await fs.promises.chmod(dirPath, 0o700);

      stats = await fs.promises.stat(dirPath);
      expect(stats.mode & 0o777).toBe(0o700);

      await fs.promises.rmdir(dirPath);
    });

    it('should handle concurrent directory creation', async () => {
      const baseDir = path.join(MOUNT_POINT, 'concurrent-base');
      await fs.promises.mkdir(baseDir);

      const promises = Array(10)
        .fill(null)
        .map((_, i) => {
          const dirPath = path.join(baseDir, `dir${i}`);
          return fs.promises.mkdir(dirPath);
        });

      await Promise.all(promises);

      const contents = await fs.promises.readdir(baseDir);
      expect(contents).toHaveLength(10);

      // Cleanup
      for (let i = 0; i < 10; i++) {
        await fs.promises.rmdir(path.join(baseDir, `dir${i}`));
      }
      await fs.promises.rmdir(baseDir);
    });
  });

  describe('Directory Listing (READDIR/READDIRPLUS Procedures)', () => {
    it('should list empty directory', async () => {
      const dirPath = path.join(MOUNT_POINT, 'list-empty');

      await fs.promises.mkdir(dirPath);

      const contents = await fs.promises.readdir(dirPath);
      expect(contents).toEqual([]);

      await fs.promises.rmdir(dirPath);
    });

    it('should list directory with files', async () => {
      const dirPath = path.join(MOUNT_POINT, 'list-with-files');
      const file1 = path.join(dirPath, 'file1.txt');
      const file2 = path.join(dirPath, 'file2.txt');
      const file3 = path.join(dirPath, 'file3.txt');

      await fs.promises.mkdir(dirPath);
      await fs.promises.writeFile(file1, 'content1');
      await fs.promises.writeFile(file2, 'content2');
      await fs.promises.writeFile(file3, 'content3');

      const contents = await fs.promises.readdir(dirPath);
      expect(contents).toContain('file1.txt');
      expect(contents).toContain('file2.txt');
      expect(contents).toContain('file3.txt');
      expect(contents).toHaveLength(3);

      await fs.promises.unlink(file1);
      await fs.promises.unlink(file2);
      await fs.promises.unlink(file3);
      await fs.promises.rmdir(dirPath);
    });

    it('should list directory with subdirectories', async () => {
      const dirPath = path.join(MOUNT_POINT, 'list-with-dirs');
      const subDir1 = path.join(dirPath, 'subdir1');
      const subDir2 = path.join(dirPath, 'subdir2');
      const subDir3 = path.join(dirPath, 'subdir3');

      await fs.promises.mkdir(dirPath);
      await fs.promises.mkdir(subDir1);
      await fs.promises.mkdir(subDir2);
      await fs.promises.mkdir(subDir3);

      const contents = await fs.promises.readdir(dirPath);
      expect(contents).toContain('subdir1');
      expect(contents).toContain('subdir2');
      expect(contents).toContain('subdir3');
      expect(contents).toHaveLength(3);

      await fs.promises.rmdir(subDir1);
      await fs.promises.rmdir(subDir2);
      await fs.promises.rmdir(subDir3);
      await fs.promises.rmdir(dirPath);
    });

    it('should list directory with mixed content', async () => {
      const dirPath = path.join(MOUNT_POINT, 'list-mixed');
      const file1 = path.join(dirPath, 'file.txt');
      const subDir1 = path.join(dirPath, 'subdir');
      const file2 = path.join(dirPath, 'another.md');

      await fs.promises.mkdir(dirPath);
      await fs.promises.mkdir(subDir1);
      await fs.promises.writeFile(file1, 'file content');
      await fs.promises.writeFile(file2, 'markdown content');

      const contents = await fs.promises.readdir(dirPath);
      expect(contents).toContain('file.txt');
      expect(contents).toContain('subdir');
      expect(contents).toContain('another.md');
      expect(contents).toHaveLength(3);

      await fs.promises.unlink(file1);
      await fs.promises.unlink(file2);
      await fs.promises.rmdir(subDir1);
      await fs.promises.rmdir(dirPath);
    });

    it('should handle directory listing with attributes', async () => {
      const dirPath = path.join(MOUNT_POINT, 'list-with-attrs');
      const filePath = path.join(dirPath, 'attr-file.txt');

      await fs.promises.mkdir(dirPath);
      await fs.promises.writeFile(filePath, 'content with attributes');

      const contents = await fs.promises.readdir(dirPath, {
        withFileTypes: true,
      });
      expect(contents).toHaveLength(1);
      expect(contents[0].name).toBe('attr-file.txt');
      expect(contents[0].isFile()).toBe(true);

      await fs.promises.unlink(filePath);
      await fs.promises.rmdir(dirPath);
    });

    it('should handle large directory listing (1000+ files)', async () => {
      const dirPath = path.join(MOUNT_POINT, 'large-dir');
      await fs.promises.mkdir(dirPath);

      const fileCount = 1000;
      const createPromises = Array(fileCount)
        .fill(null)
        .map((_, i) => {
          const filePath = path.join(dirPath, `file${i}.txt`);
          return fs.promises.writeFile(filePath, `content ${i}`);
        });

      await Promise.all(createPromises);

      const contents = await fs.promises.readdir(dirPath);
      expect(contents).toHaveLength(fileCount);

      // Verify some specific files exist
      expect(contents).toContain('file0.txt');
      expect(contents).toContain('file500.txt');
      expect(contents).toContain('file999.txt');

      // Cleanup
      const deletePromises = Array(fileCount)
        .fill(null)
        .map((_, i) => {
          const filePath = path.join(dirPath, `file${i}.txt`);
          return fs.promises.unlink(filePath);
        });
      await Promise.all(deletePromises);
      await fs.promises.rmdir(dirPath);
    }, 60000); // Increased timeout for large directory test

    it('should handle directory listing during file operations', async () => {
      const dirPath = path.join(MOUNT_POINT, 'list-during-ops');
      await fs.promises.mkdir(dirPath);

      // Create some initial files
      const file1 = path.join(dirPath, 'initial1.txt');
      const file2 = path.join(dirPath, 'initial2.txt');
      await fs.promises.writeFile(file1, 'initial1');
      await fs.promises.writeFile(file2, 'initial2');

      // Start directory listing
      const listPromise = fs.promises.readdir(dirPath);

      // Add more files during listing
      const file3 = path.join(dirPath, 'added3.txt');
      await fs.promises.writeFile(file3, 'added3');

      const contents = await listPromise;

      // Should contain at least the initial files
      expect(contents).toContain('initial1.txt');
      expect(contents).toContain('initial2.txt');

      await fs.promises.unlink(file1);
      await fs.promises.unlink(file2);
      await fs.promises.unlink(file3);
      await fs.promises.rmdir(dirPath);
    });

    it('should handle nested directory listing', async () => {
      const baseDir = path.join(MOUNT_POINT, 'nested-list');
      const level1 = path.join(baseDir, 'level1');
      const level2 = path.join(level1, 'level2');
      const file1 = path.join(baseDir, 'base-file.txt');
      const file2 = path.join(level1, 'level1-file.txt');
      const file3 = path.join(level2, 'level2-file.txt');

      await fs.promises.mkdir(level2, { recursive: true });
      await fs.promises.writeFile(file1, 'base content');
      await fs.promises.writeFile(file2, 'level1 content');
      await fs.promises.writeFile(file3, 'level2 content');

      const baseContents = await fs.promises.readdir(baseDir);
      expect(baseContents).toContain('level1');
      expect(baseContents).toContain('base-file.txt');

      const level1Contents = await fs.promises.readdir(level1);
      expect(level1Contents).toContain('level2');
      expect(level1Contents).toContain('level1-file.txt');

      const level2Contents = await fs.promises.readdir(level2);
      expect(level2Contents).toContain('level2-file.txt');

      await fs.promises.unlink(file1);
      await fs.promises.unlink(file2);
      await fs.promises.unlink(file3);
      await fs.promises.rmdir(level2);
      await fs.promises.rmdir(level1);
      await fs.promises.rmdir(baseDir);
    });

    it('should handle directory listing with special characters', async () => {
      const dirPath = path.join(MOUNT_POINT, 'special-chars-dir');
      await fs.promises.mkdir(dirPath);

      const files = [
        'file-with_spaces.txt',
        'file-with.dots.txt',
        'file-with@special.chars',
        'unicode-file-🚀.txt',
        'файл-на-русском.txt',
      ];

      const createPromises = files.map(file => {
        const filePath = path.join(dirPath, file);
        return fs.promises.writeFile(filePath, `content for ${file}`);
      });

      await Promise.all(createPromises);

      const contents = await fs.promises.readdir(dirPath);
      expect(contents).toHaveLength(files.length);

      files.forEach(file => {
        expect(contents).toContain(file);
      });

      // Cleanup
      const deletePromises = files.map(file => {
        const filePath = path.join(dirPath, file);
        return fs.promises.unlink(filePath);
      });
      await Promise.all(deletePromises);
      await fs.promises.rmdir(dirPath);
    });
  });

  describe('Directory Edge Cases', () => {
    it('should handle listing non-existent directory', async () => {
      const nonExistentDir = path.join(MOUNT_POINT, 'does-not-exist');

      await expect(fs.promises.readdir(nonExistentDir)).rejects.toThrow();
    });

    it('should handle creating directory that already exists', async () => {
      const dirPath = path.join(MOUNT_POINT, 'existing-dir');

      await fs.promises.mkdir(dirPath);

      // Should fail without recursive flag
      await expect(fs.promises.mkdir(dirPath)).rejects.toThrow();

      // Should succeed with recursive flag
      await fs.promises.mkdir(dirPath, { recursive: true });

      await fs.promises.rmdir(dirPath);
    });

    it('should handle deeply nested directory creation', async () => {
      const deepPath = path.join(
        MOUNT_POINT,
        'level1',
        'level2',
        'level3',
        'level4',
        'level5',
        'deepest'
      );

      await fs.promises.mkdir(deepPath, { recursive: true });

      const stats = await fs.promises.stat(deepPath);
      expect(stats.isDirectory()).toBe(true);

      // Cleanup in reverse order
      await fs.promises.rmdir(deepPath);
      await fs.promises.rmdir(
        path.join(MOUNT_POINT, 'level1/level2/level3/level4/level5')
      );
      await fs.promises.rmdir(
        path.join(MOUNT_POINT, 'level1/level2/level3/level4')
      );
      await fs.promises.rmdir(path.join(MOUNT_POINT, 'level1/level2/level3'));
      await fs.promises.rmdir(path.join(MOUNT_POINT, 'level1/level2'));
      await fs.promises.rmdir(path.join(MOUNT_POINT, 'level1'));
    });

    it('should handle directory rename operations', async () => {
      const oldDirPath = path.join(MOUNT_POINT, 'old-dir-name');
      const newDirPath = path.join(MOUNT_POINT, 'new-dir-name');
      const filePath = path.join(oldDirPath, 'file-in-dir.txt');

      await fs.promises.mkdir(oldDirPath);
      await fs.promises.writeFile(filePath, 'content');

      await fs.promises.rename(oldDirPath, newDirPath);

      await expect(fs.promises.access(oldDirPath)).rejects.toThrow();

      const dirStats = await fs.promises.stat(newDirPath);
      expect(dirStats.isDirectory()).toBe(true);

      const newFilePath = path.join(newDirPath, 'file-in-dir.txt');
      const fileContent = await fs.promises.readFile(newFilePath, 'utf8');
      expect(fileContent).toBe('content');

      await fs.promises.unlink(newFilePath);
      await fs.promises.rmdir(newDirPath);
    });
  });
});
