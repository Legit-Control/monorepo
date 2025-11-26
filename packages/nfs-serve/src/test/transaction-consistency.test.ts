import { expect, it, inject, describe, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Transaction & Consistency Tests', () => {
  const MOUNT_POINT = inject('mountpoint');

  beforeAll(() => {
    console.error('Mount point:', MOUNT_POINT);
    fs.readdirSync(MOUNT_POINT);
  });

  describe('Partial Writes & Commits (WRITE + COMMIT Procedures)', () => {
    it('should handle partial write (write 1000 bytes at offset 500)', async () => {
      const filePath = path.join(MOUNT_POINT, 'partial-write.txt');
      const initialContent = '0'.repeat(2000); // 2000 zeros

      await fs.promises.writeFile(filePath, initialContent);

      const writeData = 'X'.repeat(1000); // 1000 X's

      const writeDataArr = Buffer.from(writeData, 'utf8');

      const fd = await fs.promises.open(filePath, 'r+');
      await fd.write(writeDataArr, 0, writeData.length, 500);
      await fd.close();

      const finalContent = await fs.promises.readFile(filePath, 'utf8');
      expect(finalContent.slice(0, 500)).toBe('0'.repeat(500));
      expect(finalContent.slice(500, 1500)).toBe(writeData);
      expect(finalContent.slice(1500)).toBe('0'.repeat(500));

      await fs.promises.unlink(filePath);
    });

    it('should handle multiple partial writes to same file', async () => {
      const filePath = path.join(MOUNT_POINT, 'multi-partial.txt');
      const initialContent = '-'.repeat(1000);

      await fs.promises.writeFile(filePath, initialContent);

      const fd = await fs.promises.open(filePath, 'r+');

      // First write at offset 100
      const bufferA = Buffer.from('A'.repeat(100), 'utf8');
      await fd.write(bufferA, 0, 100, 100);

      // Second write at offset 300
      const bufferB = Buffer.from('B'.repeat(100), 'utf8');
      await fd.write(bufferB, 0, 100, 300);

      // Third write at offset 500
      const bufferC = Buffer.from('C'.repeat(100), 'utf8');
      await fd.write(bufferC, 0, 100, 500);

      await fd.close();

      const finalContent = await fs.promises.readFile(filePath, 'utf8');
      expect(finalContent.slice(0, 100)).toBe('-'.repeat(100));
      expect(finalContent.slice(100, 200)).toBe('A'.repeat(100));
      expect(finalContent.slice(200, 300)).toBe('-'.repeat(100));
      expect(finalContent.slice(300, 400)).toBe('B'.repeat(100));
      expect(finalContent.slice(400, 500)).toBe('-'.repeat(100));
      expect(finalContent.slice(500, 600)).toBe('C'.repeat(100));
      expect(finalContent.slice(600)).toBe('-'.repeat(400));

      await fs.promises.unlink(filePath);
    });

    it('should handle write without commit verification', async () => {
      const filePath = path.join(MOUNT_POINT, 'unstable-write.txt');
      const content = 'This should be written';

      await fs.promises.writeFile(filePath, content);

      // In real NFS, writes might be unstable until committed
      // We simulate this by ensuring the write is immediately readable
      const readContent = await fs.promises.readFile(filePath, 'utf8');
      expect(readContent).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('should handle commit after multiple writes', async () => {
      const filePath = path.join(MOUNT_POINT, 'multi-write-commit.txt');

      await fs.promises.writeFile(filePath, 'Initial content\n');

      const fd = await fs.promises.open(filePath, 'a');

      await fd.write('First addition\n');
      await fd.write('Second addition\n');
      await fd.write('Third addition\n');

      // Ensure all writes are flushed (simulating commit)
      await fd.sync();
      await fd.close();

      const finalContent = await fs.promises.readFile(filePath, 'utf8');
      expect(finalContent).toBe(
        'Initial content\nFirst addition\nSecond addition\nThird addition\n'
      );

      await fs.promises.unlink(filePath);
    });

    it('should handle unstable write verification', async () => {
      const filePath = path.join(MOUNT_POINT, 'unstable-verify.txt');
      const content = 'Unstable write content';

      await fs.promises.writeFile(filePath, content);

      // Simulate checking write stability
      const firstRead = await fs.promises.readFile(filePath, 'utf8');
      expect(firstRead).toBe(content);

      // Force sync to ensure stability
      const fd = await fs.promises.open(filePath, 'r');
      await fd.sync();
      await fd.close();

      const secondRead = await fs.promises.readFile(filePath, 'utf8');
      expect(secondRead).toBe(content);

      await fs.promises.unlink(filePath);
    });
  });

  describe('Uncommitted File Reads', () => {
    it('should handle read uncommitted changes from another client', async () => {
      const filePath = path.join(MOUNT_POINT, 'multi-client-write.txt');
      const content1 = 'Client 1 content\n';
      const content2 = 'Client 2 content\n';

      await fs.promises.writeFile(filePath, content1);

      // Simulate another client writing
      const writePromise = fs.promises.appendFile(filePath, content2);

      // Read while other client is writing
      const readContent = await fs.promises.readFile(filePath, 'utf8');

      await writePromise;

      // Read should get at least the initial content
      expect(readContent).toContain(content1);

      await fs.promises.unlink(filePath);
    });

    it('should verify dirty cache behavior', async () => {
      const filePath = path.join(MOUNT_POINT, 'dirty-cache.txt');
      const content = 'Dirty cache test content';

      await fs.promises.writeFile(filePath, content);

      // Read multiple times to potentially hit cache
      const read1 = await fs.promises.readFile(filePath, 'utf8');
      const read2 = await fs.promises.readFile(filePath, 'utf8');
      const read3 = await fs.promises.readFile(filePath, 'utf8');

      // All reads should be consistent
      expect(read1).toBe(content);
      expect(read2).toBe(content);
      expect(read3).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('should handle multiple clients writing same file', async () => {
      const filePath = path.join(MOUNT_POINT, 'multi-writer.txt');

      await fs.promises.writeFile(filePath, 'Start\n');

      // Simulate multiple writers
      const writer1 = fs.promises.appendFile(filePath, 'Writer 1\n');
      const writer2 = fs.promises.appendFile(filePath, 'Writer 2\n');
      const writer3 = fs.promises.appendFile(filePath, 'Writer 3\n');

      await Promise.all([writer1, writer2, writer3]);

      const finalContent = await fs.promises.readFile(filePath, 'utf8');

      expect(finalContent).toContain('Start\n');
      expect(finalContent).toContain('Writer 1\n');
      expect(finalContent).toContain('Writer 2\n');
      expect(finalContent).toContain('Writer 3\n');

      await fs.promises.unlink(filePath);
    });

    it('should handle read verification after commit', async () => {
      const filePath = path.join(MOUNT_POINT, 'read-after-commit.txt');
      const content = 'Content to be committed';

      await fs.promises.writeFile(filePath, content);

      // Force a commit/sync
      const fd = await fs.promises.open(filePath, 'r');
      await fd.sync();
      await fd.close();

      // Read after commit
      const committedContent = await fs.promises.readFile(filePath, 'utf8');
      expect(committedContent).toBe(content);

      await fs.promises.unlink(filePath);
    });

    it('should detect stale read scenarios', async () => {
      const filePath = path.join(MOUNT_POINT, 'stale-read.txt');
      const initialContent = 'Initial stale content';
      const updatedContent = 'Updated fresh content';

      await fs.promises.writeFile(filePath, initialContent);

      // Read initial content
      const firstRead = await fs.promises.readFile(filePath, 'utf8');
      expect(firstRead).toBe(initialContent);

      // Update file
      await fs.promises.writeFile(filePath, updatedContent);

      // Read updated content
      const secondRead = await fs.promises.readFile(filePath, 'utf8');
      expect(secondRead).toBe(updatedContent);
      expect(secondRead).not.toBe(firstRead);

      await fs.promises.unlink(filePath);
    });

    it('should handle write consistency across file descriptors', async () => {
      const filePath = path.join(MOUNT_POINT, 'fd-consistency.txt');
      const content = 'Consistency test content';

      await fs.promises.writeFile(filePath, content);

      // Open multiple file descriptors
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

    it('should handle concurrent read/write operations', async () => {
      const filePath = path.join(MOUNT_POINT, 'concurrent-rw.txt');
      const initialContent = '0'.repeat(1000);

      await fs.promises.writeFile(filePath, initialContent);

      // Start multiple concurrent operations
      const operations = [];

      // Concurrent reads
      for (let i = 0; i < 5; i++) {
        operations.push(fs.promises.readFile(filePath, 'utf8'));
      }

      // Concurrent writes at different offsets
      const fd = await fs.promises.open(filePath, 'r+');
      for (let i = 0; i < 5; i++) {
        const offset = i * 100;
        const data = String.fromCharCode(65 + i).repeat(50); // A, B, C, D, E
        operations.push(fd.write(Buffer.from(data), 0, data.length, offset));
      }
      operations.push(fd.close());

      await Promise.all(operations);

      // Verify final state
      const finalContent = await fs.promises.readFile(filePath, 'utf8');
      expect(finalContent.length).toBe(1000);

      await fs.promises.unlink(filePath);
    });
  });

  describe('Atomic Operations', () => {
    it('should handle atomic rename operations', async () => {
      const tempPath = path.join(MOUNT_POINT, 'temp-file.txt');
      const finalPath = path.join(MOUNT_POINT, 'final-file.txt');
      const content = 'Atomic rename test content';

      await fs.promises.writeFile(tempPath, content);
      await fs.promises.rename(tempPath, finalPath);

      const finalContent = await fs.promises.readFile(finalPath, 'utf8');
      expect(finalContent).toBe(content);

      await expect(fs.promises.access(tempPath)).rejects.toThrow();

      await fs.promises.unlink(finalPath);
    });

    it('should handle write atomicity verification', async () => {
      const filePath = path.join(MOUNT_POINT, 'atomic-write.txt');
      const content = 'Atomic write content that should be complete';

      await fs.promises.writeFile(filePath, content);

      // Read multiple times to verify atomicity
      const reads = await Promise.all(
        Array(10)
          .fill(null)
          .map(() => fs.promises.readFile(filePath, 'utf8'))
      );

      reads.forEach(read => {
        expect(read).toBe(content);
      });

      await fs.promises.unlink(filePath);
    });
  });
});
