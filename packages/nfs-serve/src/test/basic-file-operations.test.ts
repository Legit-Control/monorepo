import { expect, it, inject, describe, beforeAll, test } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Basic File Operations', () => {
  const MOUNT_POINT = inject('mountpoint');

  beforeAll(() => {
    console.error('Mount point:', MOUNT_POINT);
    fs.readdirSync(MOUNT_POINT);
  });

  describe('File Creation & Deletion (CREATE Procedure)', () => {
    it('should create empty file', async () => {
      const filePath = path.join(MOUNT_POINT, 'empty-file.txt');
      await fs.promises.writeFile(filePath, '');

      const stats = await fs.promises.stat(filePath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBe(0);

      await fs.promises.unlink(filePath);
    });

    it('should create file with initial data', async () => {
      const filePath = path.join(MOUNT_POINT, 'data-file.txt');
      const content = 'Hello, NFS World!';

      await fs.promises.writeFile(filePath, content);
      const readContent = await fs.promises.readFile(filePath, 'utf8');

      expect(readContent).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('file size should be refelected after writeFile', async () => {
      const filePath = path.join(MOUNT_POINT, 'data-file.txt');
      const content = 'Hello';

      await fs.promises.writeFile(filePath, content);
      const readContent = await fs.promises.readFile(filePath, 'utf8');

      expect(readContent).toBe(content);

      const stats = await fs.promises.stat(filePath);
      expect(stats.size).toBe(content.length);

      const shorterContent = 'Hi';

      await fs.promises.writeFile(filePath, shorterContent);
      const shorterStats = await fs.promises.stat(filePath);
      expect(shorterStats.size).toBe(shorterContent.length);

      await fs.promises.unlink(filePath);
    });

    it('should create file in subdirectory', async () => {
      const subDir = path.join(MOUNT_POINT, 'subdir');
      const filePath = path.join(subDir, 'nested-file.txt');
      const content = 'Nested file content';

      await fs.promises.mkdir(subDir, { recursive: true });
      await fs.promises.writeFile(filePath, content);
      const readContent = await fs.promises.readFile(filePath, 'utf8');

      expect(readContent).toBe(content);

      await fs.promises.unlink(filePath);
      await fs.promises.rmdir(subDir);
    });

    it('should create file with long names (>255 chars)', async () => {
      const longName = 'a'.repeat(250) + '.txt';
      const filePath = path.join(MOUNT_POINT, longName);
      const content = 'Long filename test';

      await fs.promises.writeFile(filePath, content);
      const readContent = await fs.promises.readFile(filePath, 'utf8');

      expect(readContent).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('should create file with special characters', async () => {
      const specialName = 'file-with_special.chars@123.txt';
      const filePath = path.join(MOUNT_POINT, specialName);
      const content = 'Special characters test';

      await fs.promises.writeFile(filePath, content);
      const readContent = await fs.promises.readFile(filePath, 'utf8');

      expect(readContent).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('should create file with Unicode characters', async () => {
      const unicodeName = 'unicode-🚀-файл.txt';
      const filePath = path.join(MOUNT_POINT, unicodeName);
      const content = 'Unicode test: 你好 world 🌍';

      await fs.promises.writeFile(filePath, content, 'utf8');
      const readContent = await fs.promises.readFile(filePath, 'utf8');

      expect(readContent).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('should handle duplicate file creation', async () => {
      const filePath = path.join(MOUNT_POINT, 'duplicate-test.txt');
      const content = 'Original content';

      await fs.promises.writeFile(filePath, content);
      await fs.promises.writeFile(filePath, 'New content');

      const readContent = await fs.promises.readFile(filePath, 'utf8');
      expect(readContent).toBe('New content');

      await fs.promises.unlink(filePath);
    });
  });

  describe('File Reading & Writing (READ/WRITE Procedures)', () => {
    it('should read entire file', async () => {
      const filePath = path.join(MOUNT_POINT, 'read-entire.txt');
      const content =
        'This is the full content of the file that should be read entirely.';

      await fs.promises.writeFile(filePath, content);
      const readContent = await fs.promises.readFile(filePath, 'utf8');

      expect(readContent).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('should read file with offset', async () => {
      const filePath = path.join(MOUNT_POINT, 'read-offset.txt');
      const content = '0123456789ABCDEFGHIJ';

      await fs.promises.writeFile(filePath, content);

      const fd = await fs.promises.open(filePath, 'r');
      const buffer = Buffer.alloc(5);
      const { bytesRead } = await fd.read(buffer, 0, 5, 10);
      await fd.close();

      expect(bytesRead).toBe(5);
      expect(buffer.toString('utf8')).toBe('ABCDE');

      await fs.promises.unlink(filePath);
    });

    it('should read partial file (specific byte count)', async () => {
      const filePath = path.join(MOUNT_POINT, 'read-partial.txt');
      const content = '0123456789';

      await fs.promises.writeFile(filePath, content);

      const fd = await fs.promises.open(filePath, 'r');
      const buffer = Buffer.alloc(3);
      const { bytesRead } = await fd.read(buffer, 0, 3, 0);
      await fd.close();

      expect(bytesRead).toBe(3);
      expect(buffer.toString('utf8')).toBe('012');

      await fs.promises.unlink(filePath);
    });

    it('should read beyond file EOF', async () => {
      const filePath = path.join(MOUNT_POINT, 'read-beyond.txt');
      const content = 'Short';

      await fs.promises.writeFile(filePath, content);

      const fd = await fs.promises.open(filePath, 'r');
      const buffer = Buffer.alloc(10);
      const { bytesRead } = await fd.read(buffer, 0, 10, 10);
      await fd.close();

      expect(bytesRead).toBe(0);

      await fs.promises.unlink(filePath);
    });

    it('should write entire file', async () => {
      const filePath = path.join(MOUNT_POINT, 'write-entire.txt');

      const contentLonger = 'Complete file write test content - longer';

      await fs.promises.writeFile(filePath, contentLonger);

      const content = 'Complete file write test content';

      await fs.promises.writeFile(filePath, content);
      const readContent = await fs.promises.readFile(filePath, 'utf8');

      expect(readContent).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('should write with offset', async () => {
      const filePath = path.join(MOUNT_POINT, 'write-offset.txt');
      const initialContent = '0000000000';
      const replacementContentArr = Buffer.from('HELLO');

      await fs.promises.writeFile(filePath, initialContent);

      const fd = await fs.promises.open(filePath, 'r+');
      await fd.write(replacementContentArr, 0, replacementContentArr.length, 2);
      await fd.close();

      const readContent = await fs.promises.readFile(filePath, 'utf8');
      expect(readContent).toBe('00HELLO000');

      await fs.promises.unlink(filePath);
    });

    it('should append to file', async () => {
      const filePath = path.join(MOUNT_POINT, 'append.txt');
      const initialContent = 'Initial content. ';
      const appendContent = 'Appended content.';

      await fs.promises.writeFile(filePath, initialContent);
      await fs.promises.appendFile(filePath, appendContent);

      const readContent = await fs.promises.readFile(filePath, 'utf8');
      expect(readContent).toBe(initialContent + appendContent);

      await fs.promises.unlink(filePath);
    });

    it('should write beyond EOF (should extend file)', async () => {
      const filePath = path.join(MOUNT_POINT, 'write-beyond.txt');
      const initialContent = 'Short';

      await fs.promises.writeFile(filePath, initialContent);

      const fd = await fs.promises.open(filePath, 'r+');
      await fd.write(Buffer.from('EXTENDED'), 0, 8, 20);
      await fd.close();

      const stats = await fs.promises.stat(filePath);
      expect(stats.size).toBeGreaterThan(20);

      await fs.promises.unlink(filePath);
    });

    it('should handle zero-byte write', async () => {
      const filePath = path.join(MOUNT_POINT, 'zero-write.txt');
      const content = 'Original content';

      await fs.promises.writeFile(filePath, content);

      const fd = await fs.promises.open(filePath, 'r+');
      await fd.write(Buffer.from(''), 0, 0, 0);
      await fd.close();

      const readContent = await fs.promises.readFile(filePath, 'utf8');
      expect(readContent).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('should handle large file writes (>1MB)', async () => {
      const filePath = path.join(MOUNT_POINT, 'large-file.txt');
      const content = 'A'.repeat(1024 * 1024 + 1); // 1MB + 1 byte

      await fs.promises.writeFile(filePath, content);

      const stats = await fs.promises.stat(filePath);
      expect(stats.size).toBe(content.length);

      const readContent = await fs.promises.readFile(filePath, 'utf8');
      expect(readContent.length).toBe(content.length);
      expect(readContent.slice(0, 10)).toBe('AAAAAAAAAA');

      await fs.promises.unlink(filePath);
    });

    it('should handle binary data writes', async () => {
      const filePath = path.join(MOUNT_POINT, 'binary-file.bin');
      const binaryData = Buffer.from([
        0x00, 0x01, 0x02, 0x03, 0xff, 0xfe, 0xfd,
      ]);

      await fs.promises.writeFile(filePath, binaryData);
      const readData = await fs.promises.readFile(filePath);

      expect(Buffer.compare(readData, binaryData)).toBe(0);

      await fs.promises.unlink(filePath);
    });
  });

  describe('File Copy Operations', () => {
    it('should copy within same directory', async () => {
      const srcPath = path.join(MOUNT_POINT, 'copy-src.txt');
      const destPath = path.join(MOUNT_POINT, 'copy-dest.txt');
      const content = 'File to copy within directory';

      await fs.promises.writeFile(srcPath, content);
      await fs.promises.copyFile(srcPath, destPath);

      const destContent = await fs.promises.readFile(destPath, 'utf8');
      expect(destContent).toBe(content);

      const srcContent = await fs.promises.readFile(srcPath, 'utf8');
      expect(srcContent).toBe(content);

      await fs.promises.unlink(srcPath);
      await fs.promises.unlink(destPath);
    });

    it('should copy between directories', async () => {
      const srcDir = path.join(MOUNT_POINT, 'src-dir');
      const destDir = path.join(MOUNT_POINT, 'dest-dir');
      const srcPath = path.join(srcDir, 'source.txt');
      const destPath = path.join(destDir, 'copied.txt');
      const content = 'File to copy between directories';

      await fs.promises.mkdir(srcDir, { recursive: true });
      await fs.promises.mkdir(destDir, { recursive: true });
      await fs.promises.writeFile(srcPath, content);
      await fs.promises.copyFile(srcPath, destPath);

      const destContent = await fs.promises.readFile(destPath, 'utf8');
      expect(destContent).toBe(content);

      await fs.promises.unlink(srcPath);
      await fs.promises.unlink(destPath);
      await fs.promises.rmdir(srcDir);
      await fs.promises.rmdir(destDir);
    });

    it('should copy over existing file (overwrite)', async () => {
      const srcPath = path.join(MOUNT_POINT, 'copy-src2.txt');
      const destPath = path.join(MOUNT_POINT, 'copy-dest2.txt');
      const srcContent = 'New source content';
      const destContent = 'Original dest content';

      await fs.promises.writeFile(srcPath, srcContent);
      await fs.promises.writeFile(destPath, destContent);
      await fs.promises.copyFile(srcPath, destPath);

      const finalContent = await fs.promises.readFile(destPath, 'utf8');
      expect(finalContent).toBe(srcContent);

      await fs.promises.unlink(srcPath);
      await fs.promises.unlink(destPath);
    });

    it('should copy file with preserve attributes', async () => {
      const srcPath = path.join(MOUNT_POINT, 'copy-src3.txt');
      const destPath = path.join(MOUNT_POINT, 'copy-dest3.txt');
      const content = 'File with attributes to preserve';

      await fs.promises.writeFile(srcPath, content, { mode: 0o644 });
      await fs.promises.copyFile(srcPath, destPath);

      const srcStats = await fs.promises.stat(srcPath);
      const destStats = await fs.promises.stat(destPath);

      expect(destStats.size).toBe(srcStats.size);
      expect(destStats.isFile()).toBe(true);

      await fs.promises.unlink(srcPath);
      await fs.promises.unlink(destPath);
    });

    it('should copy file to different name in same directory', async () => {
      const srcPath = path.join(MOUNT_POINT, 'original.txt');
      const destPath = path.join(MOUNT_POINT, 'renamed-copy.txt');
      const content = 'File with new name';

      await fs.promises.writeFile(srcPath, content);
      await fs.promises.copyFile(srcPath, destPath);

      const copiedContent = await fs.promises.readFile(destPath, 'utf8');
      expect(copiedContent).toBe(content);

      const originalContent = await fs.promises.readFile(srcPath, 'utf8');
      expect(originalContent).toBe(content);

      await fs.promises.unlink(srcPath);
      await fs.promises.unlink(destPath);
    });

    test.todo('should copy large files (>10MB)', async () => {
      const srcPath = path.join(MOUNT_POINT, 'large-src.txt');
      const destPath = path.join(MOUNT_POINT, 'large-dest.txt');
      const content = 'L'.repeat(10 * 1024 * 1024 + 1024); // 10MB + 1KB

      await fs.promises.writeFile(srcPath, content);
      await fs.promises.copyFile(srcPath, destPath);

      const srcStats = await fs.promises.stat(srcPath);
      const destStats = await fs.promises.stat(destPath);

      expect(srcStats.size).toBe(content.length);
      expect(destStats.size).toBe(content.length);
      expect(srcStats.size).toBe(destStats.size);

      await fs.promises.unlink(srcPath);
      await fs.promises.unlink(destPath);
    });

    test.todo('should copy many small files (performance test)', async () => {
      const testDir = path.join(MOUNT_POINT, 'perf-copy-test');
      const destDir = path.join(MOUNT_POINT, 'perf-copy-dest');

      await fs.promises.mkdir(testDir, { recursive: true });
      await fs.promises.mkdir(destDir, { recursive: true });

      const fileCount = 100;
      const promises = [];

      for (let i = 0; i < fileCount; i++) {
        const srcPath = path.join(testDir, `file${i}.txt`);
        const destPath = path.join(destDir, `file${i}.txt`);
        const content = `Content of file ${i}`;

        promises.push(
          fs.promises
            .writeFile(srcPath, content)
            .then(() => fs.promises.copyFile(srcPath, destPath))
        );
      }

      await Promise.all(promises);

      const srcFiles = await fs.promises.readdir(testDir);
      const destFiles = await fs.promises.readdir(destDir);

      expect(srcFiles).toHaveLength(fileCount);
      expect(destFiles).toHaveLength(fileCount);

      // Cleanup
      for (let i = 0; i < fileCount; i++) {
        await fs.promises.unlink(path.join(testDir, `file${i}.txt`));
        await fs.promises.unlink(path.join(destDir, `file${i}.txt`));
      }
      await fs.promises.rmdir(testDir);
      await fs.promises.rmdir(destDir);
    });
  });
});
