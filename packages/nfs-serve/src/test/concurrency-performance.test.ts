import { expect, it, inject, describe, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Concurrency & Performance Tests', () => {
  const MOUNT_POINT = inject('mountpoint');

  beforeAll(() => {
    console.error('Mount point:', MOUNT_POINT);
    fs.readdirSync(MOUNT_POINT);
  });

  describe('Multi-Client Scenarios', () => {
    it('should handle multiple clients reading same file', async () => {
      const filePath = path.join(MOUNT_POINT, 'multi-read.txt');
      const content = 'Shared content for multiple readers';

      await fs.promises.writeFile(filePath, content);

      // Simulate multiple clients reading simultaneously
      const readerCount = 20;
      const readPromises = Array(readerCount).fill(null).map(() =>
        fs.promises.readFile(filePath, 'utf8')
      );

      const startTime = Date.now();
      const results = await Promise.all(readPromises);
      const endTime = Date.now();

      // All reads should return the same content
      results.forEach(result => {
        expect(result).toBe(content);
      });

      // Performance should be reasonable (less than 5 seconds for 20 concurrent reads)
      expect(endTime - startTime).toBeLessThan(5000);

      await fs.promises.unlink(filePath);
    });

    it('should handle multiple clients writing different files', async () => {
      const testDir = path.join(MOUNT_POINT, 'multi-write-different');
      await fs.promises.mkdir(testDir);

      const writerCount = 10;
      const writePromises = Array(writerCount).fill(null).map((_, i) => {
        const filePath = path.join(testDir, `writer-${i}.txt`);
        const content = `Content from writer ${i}`;
        return fs.promises.writeFile(filePath, content);
      });

      const startTime = Date.now();
      await Promise.all(writePromises);
      const endTime = Date.now();

      // Verify all files were created with correct content
      for (let i = 0; i < writerCount; i++) {
        const filePath = path.join(testDir, `writer-${i}.txt`);
        const content = await fs.promises.readFile(filePath, 'utf8');
        expect(content).toBe(`Content from writer ${i}`);
        await fs.promises.unlink(filePath);
      }

      expect(endTime - startTime).toBeLessThan(10000);
      await fs.promises.rmdir(testDir);
    });

    it('should handle multiple clients writing same file', async () => {
      const filePath = path.join(MOUNT_POINT, 'multi-write-same.txt');
      await fs.promises.writeFile(filePath, 'Initial content\n');

      // Multiple clients appending to same file
      const writerCount = 5;
      const writePromises = Array(writerCount).fill(null).map((_, i) => {
        const content = `Writer ${i} content\n`;
        return fs.promises.appendFile(filePath, content);
      });

      await Promise.all(writePromises);

      const finalContent = await fs.promises.readFile(filePath, 'utf8');
      expect(finalContent).toContain('Initial content\n');

      // Each writer should have contributed
      for (let i = 0; i < writerCount; i++) {
        expect(finalContent).toContain(`Writer ${i} content\n`);
      }

      await fs.promises.unlink(filePath);
    });

    it('should handle concurrent directory operations', async () => {
      const baseDir = path.join(MOUNT_POINT, 'concurrent-dirs');
      await fs.promises.mkdir(baseDir);

      const dirCount = 10;
      const dirPromises = Array(dirCount).fill(null).map((_, i) => {
        const dirPath = path.join(baseDir, `dir${i}`);
        return fs.promises.mkdir(dirPath);
      });

      await Promise.all(dirPromises);

      // Create files in all directories concurrently
      const filePromises = Array(dirCount).fill(null).map((_, i) => {
        const dirPath = path.join(baseDir, `dir${i}`);
        const filePath = path.join(dirPath, `file.txt`);
        const content = `File in dir ${i}`;
        return fs.promises.writeFile(filePath, content);
      });

      await Promise.all(filePromises);

      // Verify all directories and files exist
      for (let i = 0; i < dirCount; i++) {
        const dirPath = path.join(baseDir, `dir${i}`);
        const filePath = path.join(dirPath, `file.txt`);
        const content = await fs.promises.readFile(filePath, 'utf8');
        expect(content).toBe(`File in dir ${i}`);
        await fs.promises.unlink(filePath);
        await fs.promises.rmdir(dirPath);
      }

      await fs.promises.rmdir(baseDir);
    });

    it('should handle race condition testing', async () => {
      const filePath = path.join(MOUNT_POINT, 'race-condition.txt');
      const initialContent = 'Initial';

      await fs.promises.writeFile(filePath, initialContent);

      // Multiple operations racing
      const operations = [
        fs.promises.appendFile(filePath, 'Op1'),
        fs.promises.appendFile(filePath, 'Op2'),
        fs.promises.appendFile(filePath, 'Op3'),
        fs.promises.readFile(filePath, 'utf8'),
        fs.promises.stat(filePath)
      ];

      await Promise.all(operations);

      const finalContent = await fs.promises.readFile(filePath, 'utf8');
      expect(finalContent).toContain('Initial');

      await fs.promises.unlink(filePath);
    });

    it('should verify lock behavior', async () => {
      const filePath = path.join(MOUNT_POINT, 'lock-behavior.txt');
      const content = 'Lock behavior test';

      await fs.promises.writeFile(filePath, content);

      // Open multiple file descriptors
      const fd1 = await fs.promises.open(filePath, 'r+');
      const fd2 = await fs.promises.open(filePath, 'r+');

      // Both should be able to read
      const buffer1 = Buffer.alloc(content.length);
      const buffer2 = Buffer.alloc(content.length);

      const [result1, result2] = await Promise.all([
        fd1.read(buffer1, 0, content.length, 0),
        fd2.read(buffer2, 0, content.length, 0)
      ]);

      expect(result1.bytesRead).toBe(content.length);
      expect(result2.bytesRead).toBe(content.length);
      expect(buffer1.toString('utf8')).toBe(content);
      expect(buffer2.toString('utf8')).toBe(content);

      await fd1.close();
      await fd2.close();
      await fs.promises.unlink(filePath);
    });
  });

  describe('Performance Benchmarks', () => {
    it('should handle large file sequential read/write', async () => {
      const filePath = path.join(MOUNT_POINT, 'large-seq.txt');
      const largeContent = 'A'.repeat(5 * 1024 * 1024); // 5MB

      const writeStartTime = Date.now();
      await fs.promises.writeFile(filePath, largeContent);
      const writeEndTime = Date.now();

      const readStartTime = Date.now();
      const readContent = await fs.promises.readFile(filePath);
      const readEndTime = Date.now();

      expect(Buffer.compare(readContent, Buffer.from(largeContent))).toBe(0);

      // Performance expectations (these may need adjustment based on system)
      expect(writeEndTime - writeStartTime).toBeLessThan(30000); // 30 seconds for 5MB write
      expect(readEndTime - readStartTime).toBeLessThan(30000); // 30 seconds for 5MB read

      await fs.promises.unlink(filePath);
    });

    it('should handle random access patterns', async () => {
      const filePath = path.join(MOUNT_POINT, 'random-access.txt');
      const content = '0123456789'.repeat(100000); // 1MB of repeating pattern

      await fs.promises.writeFile(filePath, content);

      const fd = await fs.promises.open(filePath, 'r');

      // Random reads at different offsets
      const randomOffsets = [0, 1000, 50000, 100000, 500000, 900000];
      const readPromises = randomOffsets.map(async offset => {
        const buffer = Buffer.alloc(10);
        const result = await fd.read(buffer, 0, 10, offset);
        return { offset, bytesRead: result.bytesRead, data: buffer.toString('utf8') };
      });

      const startTime = Date.now();
      const results = await Promise.all(readPromises);
      const endTime = Date.now();

      results.forEach(result => {
        expect(result.bytesRead).toBe(10);
        expect(result.data).toBe('0123456789');
      });

      expect(endTime - startTime).toBeLessThan(10000); // 10 seconds for random reads

      await fd.close();
      await fs.promises.unlink(filePath);
    });

    it('should handle small file creation/deletion', async () => {
      const testDir = path.join(MOUNT_POINT, 'small-files');
      await fs.promises.mkdir(testDir);

      const fileCount = 1000;
      const startTime = Date.now();

      // Create many small files
      const createPromises = Array(fileCount).fill(null).map((_, i) => {
        const filePath = path.join(testDir, `file${i}.txt`);
        return fs.promises.writeFile(filePath, `content ${i}`);
      });

      await Promise.all(createPromises);

      const createEndTime = Date.now();

      // Delete all files
      const deletePromises = Array(fileCount).fill(null).map((_, i) => {
        const filePath = path.join(testDir, `file${i}.txt`);
        return fs.promises.unlink(filePath);
      });

      await Promise.all(deletePromises);

      const deleteEndTime = Date.now();

      expect(createEndTime - startTime).toBeLessThan(30000); // 30 seconds for 1000 file creation
      expect(deleteEndTime - createEndTime).toBeLessThan(30000); // 30 seconds for 1000 file deletion

      await fs.promises.rmdir(testDir);
    });

    it('should handle directory listing performance', async () => {
      const testDir = path.join(MOUNT_POINT, 'list-perf');
      await fs.promises.mkdir(testDir);

      const fileCount = 5000;
      const createPromises = Array(fileCount).fill(null).map((_, i) => {
        const filePath = path.join(testDir, `perf-file${i}.txt`);
        return fs.promises.writeFile(filePath, `content ${i}`);
      });

      await Promise.all(createPromises);

      const startTime = Date.now();
      const files = await fs.promises.readdir(testDir);
      const endTime = Date.now();

      expect(files).toHaveLength(fileCount);
      expect(endTime - startTime).toBeLessThan(15000); // 15 seconds for 5000 file listing

      // Cleanup
      const deletePromises = files.map(file =>
        fs.promises.unlink(path.join(testDir, file))
      );
      await Promise.all(deletePromises);
      await fs.promises.rmdir(testDir);
    });

    it('should measure throughput', async () => {
      const filePath = path.join(MOUNT_POINT, 'throughput.txt');
      const content = 'X'.repeat(1024 * 1024); // 1MB
      const iterations = 10;

      const writeTimes = [];
      const readTimes = [];

      for (let i = 0; i < iterations; i++) {
        const writeStart = Date.now();
        await fs.promises.writeFile(filePath, content);
        const writeEnd = Date.now();
        writeTimes.push(writeEnd - writeStart);

        const readStart = Date.now();
        await fs.promises.readFile(filePath);
        const readEnd = Date.now();
        readTimes.push(readEnd - readStart);

        await fs.promises.unlink(filePath);
      }

      const avgWriteTime = writeTimes.reduce((a, b) => a + b) / iterations;
      const avgReadTime = readTimes.reduce((a, b) => a + b) / iterations;

      // Calculate throughput in MB/s
      const writeThroughput = (1 / (avgWriteTime / 1000)); // MB/s
      const readThroughput = (1 / (avgReadTime / 1000)); // MB/s

      console.log(`Average write throughput: ${writeThroughput.toFixed(2)} MB/s`);
      console.log(`Average read throughput: ${readThroughput.toFixed(2)} MB/s`);

      // Basic performance expectations (very conservative)
      expect(writeThroughput).toBeGreaterThan(0.1); // At least 0.1 MB/s
      expect(readThroughput).toBeGreaterThan(0.1); // At least 0.1 MB/s
    });

    it('should handle network latency simulation', async () => {
      const filePath = path.join(MOUNT_POINT, 'latency-test.txt');
      const content = 'Network latency simulation test';

      await fs.promises.writeFile(filePath, content);

      // Simulate multiple small operations that might be affected by latency
      const operations = Array(100).fill(null).map(() =>
        fs.promises.readFile(filePath, 'utf8')
      );

      const startTime = Date.now();
      await Promise.all(operations);
      const endTime = Date.now();

      // Should complete within reasonable time even with many small operations
      expect(endTime - startTime).toBeLessThan(20000); // 20 seconds for 100 reads

      await fs.promises.unlink(filePath);
    });
  });

  describe('Stress Tests', () => {
    it('should handle high-frequency operations', async () => {
      const filePath = path.join(MOUNT_POINT, 'high-freq.txt');
      await fs.promises.writeFile(filePath, 'base content');

      // Perform many operations rapidly
      const operationCount = 1000;
      const operations = Array(operationCount).fill(null).map((_, i) => {
        return fs.promises.appendFile(filePath, `${i}`);
      });

      const startTime = Date.now();
      await Promise.all(operations);
      const endTime = Date.now();

      const finalContent = await fs.promises.readFile(filePath, 'utf8');
      expect(finalContent).toContain('base content');

      expect(endTime - startTime).toBeLessThan(60000); // 60 seconds for 1000 operations

      await fs.promises.unlink(filePath);
    });

    it('should handle memory usage with large operations', async () => {
      const filePath = path.join(MOUNT_POINT, 'memory-test.txt');
      const largeContent = 'M'.repeat(10 * 1024 * 1024); // 10MB

      // Create multiple large files
      const fileCount = 5;
      const createPromises = Array(fileCount).fill(null).map((_, i) => {
        const currentFilePath = path.join(MOUNT_POINT, `memory-test-${i}.txt`);
        return fs.promises.writeFile(currentFilePath, largeContent);
      });

      await Promise.all(createPromises);

      // Read them all back
      const readPromises = Array(fileCount).fill(null).map((_, i) => {
        const currentFilePath = path.join(MOUNT_POINT, `memory-test-${i}.txt`);
        return fs.promises.readFile(currentFilePath);
      });

      const results = await Promise.all(readPromises);

      results.forEach(content => {
        expect(content.length).toBe(largeContent.length);
        expect(content.toString('utf8')[0]).toBe('M');
      });

      // Cleanup
      for (let i = 0; i < fileCount; i++) {
        const currentFilePath = path.join(MOUNT_POINT, `memory-test-${i}.txt`);
        await fs.promises.unlink(currentFilePath);
      }
    });

    it('should handle concurrent mixed operations', async () => {
      const baseDir = path.join(MOUNT_POINT, 'mixed-ops');
      await fs.promises.mkdir(baseDir);

      const operations = [];

      // File creation
      operations.push(Array(10).fill(null).map((_, i) => {
        const filePath = path.join(baseDir, `mixed-file-${i}.txt`);
        return fs.promises.writeFile(filePath, `content ${i}`);
      }));

      // Directory creation
      operations.push(Array(5).fill(null).map((_, i) => {
        const dirPath = path.join(baseDir, `mixed-dir-${i}`);
        return fs.promises.mkdir(dirPath);
      }));

      // File reads (after creation)
      const readPromises = Array(10).fill(null).map((_, i) => {
        const filePath = path.join(baseDir, `mixed-file-${i}.txt`);
        return fs.promises.readFile(filePath, 'utf8');
      });

      // Wait for creations, then read
      await Promise.all(operations.flat());
      const readResults = await Promise.all(readPromises);

      readResults.forEach((content, i) => {
        expect(content).toBe(`content ${i}`);
      });

      // Cleanup
      for (let i = 0; i < 10; i++) {
        await fs.promises.unlink(path.join(baseDir, `mixed-file-${i}.txt`));
      }
      for (let i = 0; i < 5; i++) {
        await fs.promises.rmdir(path.join(baseDir, `mixed-dir-${i}`));
      }
      await fs.promises.rmdir(baseDir);
    });
  });

  describe('Performance Regression Tests', () => {
    it('should maintain consistent performance for basic operations', async () => {
      const filePath = path.join(MOUNT_POINT, 'regression-test.txt');
      const content = 'Performance regression test content';

      const iterations = 50;
      const times = [];

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await fs.promises.writeFile(filePath, content);
        await fs.promises.readFile(filePath, 'utf8');
        await fs.promises.unlink(filePath);
        const end = Date.now();
        times.push(end - start);
      }

      const avgTime = times.reduce((a, b) => a + b) / iterations;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);

      console.log(`Performance regression test - Avg: ${avgTime}ms, Min: ${minTime}ms, Max: ${maxTime}ms`);

      // Performance should be reasonably consistent
      expect(maxTime / minTime).toBeLessThan(10); // Max should not be more than 10x min
      expect(avgTime).toBeLessThan(1000); // Average should be under 1 second for basic ops
    });
  });
});