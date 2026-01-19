import { expect, it, inject, describe, beforeAll, test } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Advanced File Operations', () => {
  const MOUNT_POINT = inject('mountpoint');

  beforeAll(() => {
    console.error('Mount point:', MOUNT_POINT);
    fs.readdirSync(MOUNT_POINT);
  });


  describe('Advanced File Handle Operations', () => {
    it('should handle independent file descriptors for the same file', async () => {
      const filePath = path.join(MOUNT_POINT, 'fd-inherit.txt');
      const content = 'File descriptor inheritance test';

      await fs.promises.writeFile(filePath, content);

      const fd1 = await fs.promises.open(filePath, 'r');
      const fd2 = await fs.promises.open(filePath, 'r');

      const buffer1 = Buffer.alloc(content.length);
      const buffer2 = Buffer.alloc(content.length);

      const [result1, result2] = await Promise.all([
        fd1.read(buffer1, 0, content.length, 0),
        fd2.read(buffer2, 0, content.length, 0),
      ]);

      expect(result1.bytesRead).toBe(content.length);
      expect(result2.bytesRead).toBe(content.length);
      expect(buffer1.toString('utf8')).toBe(content);
      expect(buffer2.toString('utf8')).toBe(content);

      await fd1.close();
      await fd2.close();
      await fs.promises.unlink(filePath);
    });

    it('should handle file descriptor after file operations', async () => {
      const filePath = path.join(MOUNT_POINT, 'fd-after-ops.txt');
      const originalContent = 'Original content';
      const newContent = 'New content that replaces original';

      await fs.promises.writeFile(filePath, originalContent);

      const fd = await fs.promises.open(filePath, 'r');
      const buffer = Buffer.alloc(originalContent.length);
      await fd.read(buffer, 0, originalContent.length, 0);

      expect(buffer.toString('utf8')).toBe(originalContent);

      await fd.close();

      // Replace file content
      const fdNew = await fs.promises.open(filePath, 'r+');
      await fdNew.writeFile(newContent);

      // Old file descriptor should be invalid now
      await expect(
        fd.read(buffer, 0, buffer.length, 0),
        'a new filedecriptor on the same file should not reincarnate the old one'
      ).rejects.toThrow();

      await fdNew.close();

      await fs.promises.unlink(filePath);
    });

    it('should handle file descriptor offset independence', async () => {
      const filePath = path.join(MOUNT_POINT, 'offset-independence.txt');
      const content = '0123456789ABCDEFGHIJ';

      await fs.promises.writeFile(filePath, content);

      const fd1 = await fs.promises.open(filePath, 'r');
      const fd2 = await fs.promises.open(filePath, 'r');

      const buffer1 = Buffer.alloc(5);
      const buffer2 = Buffer.alloc(5);

      // Read from different offsets
      const [result1, result2] = await Promise.all([
        fd1.read(buffer1, 0, 5, 0),
        fd2.read(buffer2, 0, 5, 10),
      ]);

      expect(result1.bytesRead).toBe(5);
      expect(result2.bytesRead).toBe(5);
      expect(buffer1.toString('utf8')).toBe('01234');
      expect(buffer2.toString('utf8')).toBe('ABCDE');

      await fd1.close();
      await fd2.close();
      await fs.promises.unlink(filePath);
    });
  });


    it('should handle sparse file behavior', async () => {
      const filePath = path.join(MOUNT_POINT, 'sparse-test.txt');

      const fd = await fs.promises.open(filePath, 'w');

      const startString = 'Start';
      const startArr = Buffer.from(startString, 'utf8');
      const endString = 'End';
      const endArr = Buffer.from(endString, 'utf8');

      // Write at beginning and end, leaving a hole
      await fd.write(startArr, 0, startArr.length, 0);
      await fd.write(endArr, 0, endArr.length, 1000);
      await fd.close();

      const stats = await fs.promises.stat(filePath);
      expect(stats.size).toBeGreaterThan(1000);

      const content = await fs.promises.readFile(filePath, 'utf8');
      expect(content.startsWith('Start')).toBe(true);
      expect(content.endsWith('End')).toBe(true);

      await fs.promises.unlink(filePath);
    });


  test.todo('Symbolic Links (SYMLINK/READLINK Procedures)', () => {
    it('should create symbolic link to file', async () => {
      const targetFile = path.join(MOUNT_POINT, 'target-file.txt');
      const linkFile = path.join(MOUNT_POINT, 'symlink-to-file.txt');
      const content = 'Target file content';

      await fs.promises.writeFile(targetFile, content);
      await fs.promises.symlink(targetFile, linkFile);

      const linkStats = await fs.promises.lstat(linkFile);
      expect(linkStats.isSymbolicLink()).toBe(true);

      const linkedContent = await fs.promises.readFile(linkFile, 'utf8');
      expect(linkedContent).toBe(content);

      await fs.promises.unlink(linkFile);
      await fs.promises.unlink(targetFile);
    });

    it('should create symbolic link to directory', async () => {
      const targetDir = path.join(MOUNT_POINT, 'target-dir');
      const linkDir = path.join(MOUNT_POINT, 'symlink-to-dir');

      await fs.promises.mkdir(targetDir);
      await fs.promises.symlink(targetDir, linkDir);

      const linkStats = await fs.promises.lstat(linkDir);
      expect(linkStats.isSymbolicLink()).toBe(true);

      const dirStats = await fs.promises.stat(linkDir);
      expect(dirStats.isDirectory()).toBe(true);

      await fs.promises.unlink(linkDir);
      await fs.promises.rmdir(targetDir);
    });

    it('should create absolute symbolic link', async () => {
      const targetFile = path.join(MOUNT_POINT, 'abs-target.txt');
      const linkFile = path.join(MOUNT_POINT, 'abs-symlink.txt');
      const content = 'Absolute symlink target';

      await fs.promises.writeFile(targetFile, content);
      await fs.promises.symlink(targetFile, linkFile);

      const linkContent = await fs.promises.readFile(linkFile, 'utf8');
      expect(linkContent).toBe(content);

      await fs.promises.unlink(linkFile);
      await fs.promises.unlink(targetFile);
    });

    it('should create relative symbolic link', async () => {
      const targetFile = path.join(MOUNT_POINT, 'rel-target.txt');
      const linkFile = path.join(MOUNT_POINT, 'rel-symlink.txt');
      const content = 'Relative symlink target';

      await fs.promises.writeFile(targetFile, content);
      await fs.promises.symlink('rel-target.txt', linkFile);

      const linkContent = await fs.promises.readFile(linkFile, 'utf8');
      expect(linkContent).toBe(content);

      await fs.promises.unlink(linkFile);
      await fs.promises.unlink(targetFile);
    });

    it('should read symbolic link target', async () => {
      const targetFile = path.join(MOUNT_POINT, 'readlink-target.txt');
      const linkFile = path.join(MOUNT_POINT, 'readlink-symlink.txt');
      const content = 'Readlink test target';

      await fs.promises.writeFile(targetFile, content);
      await fs.promises.symlink(targetFile, linkFile);

      const linkTarget = await fs.promises.readlink(linkFile);
      expect(linkTarget).toBe(targetFile);

      await fs.promises.unlink(linkFile);
      await fs.promises.unlink(targetFile);
    });

    it('should follow symbolic link in operations', async () => {
      const targetFile = path.join(MOUNT_POINT, 'follow-target.txt');
      const linkFile = path.join(MOUNT_POINT, 'follow-symlink.txt');
      const originalContent = 'Original content';
      const newContent = 'Modified content via symlink';

      await fs.promises.writeFile(targetFile, originalContent);
      await fs.promises.symlink(targetFile, linkFile);

      // Modify file through symlink
      await fs.promises.writeFile(linkFile, newContent);

      const directContent = await fs.promises.readFile(targetFile, 'utf8');
      const linkContent = await fs.promises.readFile(linkFile, 'utf8');

      expect(directContent).toBe(newContent);
      expect(linkContent).toBe(newContent);

      await fs.promises.unlink(linkFile);
      await fs.promises.unlink(targetFile);
    });

    it('should handle broken symbolic link', async () => {
      const targetFile = path.join(MOUNT_POINT, 'broken-target.txt');
      const linkFile = path.join(MOUNT_POINT, 'broken-symlink.txt');

      // Create symlink to non-existent file
      await fs.promises.symlink(targetFile, linkFile);

      const linkStats = await fs.promises.lstat(linkFile);
      expect(linkStats.isSymbolicLink()).toBe(true);

      // Reading through broken symlink should fail
      await expect(fs.promises.readFile(linkFile, 'utf8')).rejects.toThrow();

      await fs.promises.unlink(linkFile);
    });

    it('should detect circular symbolic link', async () => {
      const link1 = path.join(MOUNT_POINT, 'circular-link1');
      const link2 = path.join(MOUNT_POINT, 'circular-link2');

      await fs.promises.symlink('circular-link2', link1);
      await fs.promises.symlink('circular-link1', link2);

      // Reading through circular symlink should fail
      await expect(fs.promises.readFile(link1, 'utf8')).rejects.toThrow();

      await fs.promises.unlink(link1);
      await fs.promises.unlink(link2);
    });

    it('should handle symlink to symlink', async () => {
      const targetFile = path.join(MOUNT_POINT, 'symlink-target.txt');
      const link1 = path.join(MOUNT_POINT, 'symlink1');
      const link2 = path.join(MOUNT_POINT, 'symlink2');
      const content = 'Chain symlink target';

      await fs.promises.writeFile(targetFile, content);
      await fs.promises.symlink(targetFile, link1);
      await fs.promises.symlink(link1, link2);

      const chainContent = await fs.promises.readFile(link2, 'utf8');
      expect(chainContent).toBe(content);

      await fs.promises.unlink(link2);
      await fs.promises.unlink(link1);
      await fs.promises.unlink(targetFile);
    });
  });

  test.todo('Hard Links (LINK Procedure)', () => {
    it('should create hard link to file', async () => {
      const originalFile = path.join(MOUNT_POINT, 'hardlink-original.txt');
      const linkFile = path.join(MOUNT_POINT, 'hardlink-link.txt');
      const content = 'Hard link test content';

      await fs.promises.writeFile(originalFile, content);
      await fs.promises.link(originalFile, linkFile);

      const originalStats = await fs.promises.stat(originalFile);
      const linkStats = await fs.promises.stat(linkFile);

      expect(originalStats.nlink).toBe(2);
      expect(linkStats.nlink).toBe(2);
      expect(originalStats.ino).toBe(linkStats.ino);
      expect(originalStats.size).toBe(linkStats.size);

      const originalContent = await fs.promises.readFile(originalFile, 'utf8');
      const linkContent = await fs.promises.readFile(linkFile, 'utf8');

      expect(originalContent).toBe(content);
      expect(linkContent).toBe(content);

      await fs.promises.unlink(linkFile);
      await fs.promises.unlink(originalFile);
    });

    it('should create multiple hard links', async () => {
      const originalFile = path.join(MOUNT_POINT, 'multi-original.txt');
      const link1 = path.join(MOUNT_POINT, 'multi-link1.txt');
      const link2 = path.join(MOUNT_POINT, 'multi-link2.txt');
      const link3 = path.join(MOUNT_POINT, 'multi-link3.txt');
      const content = 'Multiple hard links test';

      await fs.promises.writeFile(originalFile, content);
      await fs.promises.link(originalFile, link1);
      await fs.promises.link(originalFile, link2);
      await fs.promises.link(originalFile, link3);

      const originalStats = await fs.promises.stat(originalFile);
      expect(originalStats.nlink).toBe(4);

      const contents = await Promise.all([
        fs.promises.readFile(originalFile, 'utf8'),
        fs.promises.readFile(link1, 'utf8'),
        fs.promises.readFile(link2, 'utf8'),
        fs.promises.readFile(link3, 'utf8'),
      ]);

      contents.forEach(fileContent => {
        expect(fileContent).toBe(content);
      });

      await fs.promises.unlink(link1);
      await fs.promises.unlink(link2);
      await fs.promises.unlink(link3);
      await fs.promises.unlink(originalFile);
    });

    it('should delete original file (link should remain)', async () => {
      const originalFile = path.join(MOUNT_POINT, 'delete-original.txt');
      const linkFile = path.join(MOUNT_POINT, 'delete-link.txt');
      const content = 'Delete original test';

      await fs.promises.writeFile(originalFile, content);
      await fs.promises.link(originalFile, linkFile);

      // Delete original file
      await fs.promises.unlink(originalFile);

      // Link should still exist and be accessible
      const linkContent = await fs.promises.readFile(linkFile, 'utf8');
      expect(linkContent).toBe(content);

      const linkStats = await fs.promises.stat(linkFile);
      expect(linkStats.nlink).toBe(1);

      await fs.promises.unlink(linkFile);
    });

    it('should modify content through any hard link', async () => {
      const originalFile = path.join(MOUNT_POINT, 'modify-original.txt');
      const linkFile = path.join(MOUNT_POINT, 'modify-link.txt');
      const originalContent = 'Original content';
      const modifiedContent = 'Modified content';

      await fs.promises.writeFile(originalFile, originalContent);
      await fs.promises.link(originalFile, linkFile);

      // Modify through link
      await fs.promises.writeFile(linkFile, modifiedContent);

      const originalRead = await fs.promises.readFile(originalFile, 'utf8');
      const linkRead = await fs.promises.readFile(linkFile, 'utf8');

      expect(originalRead).toBe(modifiedContent);
      expect(linkRead).toBe(modifiedContent);

      await fs.promises.unlink(linkFile);
      await fs.promises.unlink(originalFile);
    });

    it('should fail to create hard link to directory', async () => {
      const targetDir = path.join(MOUNT_POINT, 'hardlink-target-dir');
      const linkDir = path.join(MOUNT_POINT, 'hardlink-link-dir');

      await fs.promises.mkdir(targetDir);

      await expect(fs.promises.link(targetDir, linkDir)).rejects.toThrow();

      await fs.promises.rmdir(targetDir);
    });

    it('should handle hard link with different owners', async () => {
      const originalFile = path.join(MOUNT_POINT, 'owner-original.txt');
      const linkFile = path.join(MOUNT_POINT, 'owner-link.txt');
      const content = 'Owner test content';

      await fs.promises.writeFile(originalFile, content);
      await fs.promises.link(originalFile, linkFile);

      const originalStats = await fs.promises.stat(originalFile);
      const linkStats = await fs.promises.stat(linkFile);

      expect(originalStats.uid).toBe(linkStats.uid);
      expect(originalStats.gid).toBe(linkStats.gid);
      expect(originalStats.ino).toBe(linkStats.ino);

      await fs.promises.unlink(linkFile);
      await fs.promises.unlink(originalFile);
    });

    it('should handle cross-device hard link (should fail)', async () => {
      const originalFile = path.join(MOUNT_POINT, 'cross-device-original.txt');
      const linkFile = path.join(MOUNT_POINT, 'cross-device-link.txt');
      const content = 'Cross-device test';

      await fs.promises.writeFile(originalFile, content);

      // This test might pass or fail depending on the filesystem setup
      // We'll just verify the behavior
      try {
        await fs.promises.link(originalFile, linkFile);
        // If it succeeds, verify the link works
        const linkContent = await fs.promises.readFile(linkFile, 'utf8');
        expect(linkContent).toBe(content);
        await fs.promises.unlink(linkFile);
      } catch (error) {
        // If it fails, that's expected for cross-device links
        // @ts-ignore
        expect(error.message).toContain('cross-device');
      }

      await fs.promises.unlink(originalFile);
    });

    test.todo('should handle file locking behavior', async () => {});

    test.todo('should handle file system quota behavior', async () => {
      const filePath = path.join(MOUNT_POINT, 'quota-test.txt');
      const largeContent = 'Q'.repeat(1024 * 1024); // 1MB

      await fs.promises.writeFile(filePath, largeContent);

      const stats = await fs.promises.stat(filePath);
      expect(stats.size).toBe(largeContent.length);

      // This test just ensures large files work
      // Actual quota testing would require specific filesystem configuration
      await fs.promises.unlink(filePath);
    });
  });
  
});
