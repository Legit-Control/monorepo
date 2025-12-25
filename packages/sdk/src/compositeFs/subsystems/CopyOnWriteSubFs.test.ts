import { describe, it, expect, beforeEach } from 'vitest';
import { CopyOnWriteSubFs } from './CopyOnWriteSubFs.js';
import CompositFsFileHandle from '../CompositeFsFileHandle.js';
import { CompositeFs } from '../CompositeFs.js';
import { createFsFromVolume, Volume } from 'memfs';
import * as nodeFs from 'node:fs';

describe('CopyOnWriteSubFs', () => {
  let copyOnWriteFs: CopyOnWriteSubFs;
  let parentFs: CompositeFs;
  let sourceFs: ReturnType<typeof createFsFromVolume>;
  let copyToFs: ReturnType<typeof createFsFromVolume>;

  beforeEach(() => {
    // Create source filesystem with some initial data
    sourceFs = createFsFromVolume(new Volume());
    sourceFs.writeFileSync('/original.txt', 'original content', 'utf8');
    sourceFs.writeFileSync('/data.json', '{"key": "value"}', 'utf8');
    sourceFs.mkdirSync('/source-dir', { recursive: true });
    sourceFs.writeFileSync('/source-dir/file.txt', 'source file', 'utf8');

    // Create empty copy filesystem
    copyToFs = createFsFromVolume(new Volume());

    // Create a mock parent fs
    parentFs = {
      parentFs: {} as any,
    } as CompositeFs;

    copyOnWriteFs = new CopyOnWriteSubFs({
      name: 'copy-on-write-subfs',
      parentFs,
      sourceFs,
      copyToFs,
      copyPath: '/copies',
      patterns: ['*.txt', 'data/**', 'specific-file.md'],
    });
  });

  describe('responsible()', () => {
    it('should be responsible for files matching patterns', async () => {
      expect(await copyOnWriteFs.responsible('test.txt')).toBe(true);
      expect(await copyOnWriteFs.responsible('data/file.json')).toBe(true);
      expect(await copyOnWriteFs.responsible('data/nested/file.txt')).toBe(
        true
      );
      expect(await copyOnWriteFs.responsible('specific-file.md')).toBe(true);
    });

    it('should not be responsible for files not matching patterns', async () => {
      expect(await copyOnWriteFs.responsible('image.png')).toBe(false);
      expect(await copyOnWriteFs.responsible('src/code.js')).toBe(false);
      expect(await copyOnWriteFs.responsible('other.md')).toBe(false);
    });

    it('should handle negation patterns', async () => {
      const cowWithNegation = new CopyOnWriteSubFs({
        name: 'cow-with-negation',
        parentFs,
        sourceFs,
        copyToFs,
        copyPath: '/copies',
        patterns: ['*.txt', '!important.txt'],
      });

      expect(await cowWithNegation.responsible('test.txt')).toBe(true);
      expect(await cowWithNegation.responsible('important.txt')).toBe(false);
    });

    it('should handle edge cases', async () => {
      expect(await copyOnWriteFs.responsible('')).toBe(false);
      expect(await copyOnWriteFs.responsible('.')).toBe(false);
    });
  });

  describe('fileType()', () => {
    it('should return a unique file type', () => {
      expect(copyOnWriteFs.fileType()).toBe(6); // Different from other SubFs types
    });
  });

  describe('read operations', () => {
    describe('readFile()', () => {
      it('should read from sourceFs when file not copied yet', async () => {
        const content = await copyOnWriteFs.readFile('/original.txt', 'utf8');
        expect(content).toBe('original content');
      });

      it('should read from copyToFs when file has been copied', async () => {
        // First write to create copy
        await copyOnWriteFs.writeFile('/original.txt', 'modified', 'utf8');

        // Should read the modified version from copy
        const content = await copyOnWriteFs.readFile('/original.txt', 'utf8');
        expect(content).toBe('modified');
      });

      it('should read from sourceFs for files not in patterns', async () => {
        // This file exists in source but doesn't match patterns
        sourceFs.writeFileSync('/other.log', 'log data', 'utf8');

        // Should still be readable since it falls through
        const content = await copyOnWriteFs.readFile('/other.log', 'utf8');
        expect(content).toBe('log data');
      });
    });

    describe('stat()', () => {
      it('should return stats from sourceFs for uncopied files', async () => {
        const stats = await copyOnWriteFs.stat('/original.txt');
        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBe(16); // "original content" length
      });

      it('should return stats from copyToFs for copied files', async () => {
        await copyOnWriteFs.writeFile('/original.txt', 'short', 'utf8');

        const stats = await copyOnWriteFs.stat('/original.txt');
        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBe(5); // "short" length
      });
    });

    describe('access()', () => {
      it('should check access in sourceFs for uncopied files', async () => {
        await expect(
          copyOnWriteFs.access('/original.txt')
        ).resolves.not.toThrow();
      });

      it('should check access in copyToFs for copied files', async () => {
        await copyOnWriteFs.writeFile('/original.txt', 'modified', 'utf8');
        await expect(
          copyOnWriteFs.access('/original.txt')
        ).resolves.not.toThrow();
      });

      it('should throw for non-existent files', async () => {
        await expect(
          copyOnWriteFs.access('/nonexistent.txt')
        ).rejects.toThrow();
      });
    });
  });

  describe('write operations', () => {
    describe('writeFile()', () => {
      it('should copy file from source on first write', async () => {
        // File exists in source
        expect(sourceFs.existsSync('/original.txt')).toBe(true);
        expect(copyToFs.existsSync('/copies/original.txt')).toBe(false);

        // Write should create copy
        await copyOnWriteFs.writeFile('/original.txt', 'new content', 'utf8');

        // Copy should exist in copyToFs
        expect(copyToFs.existsSync('/copies/original.txt')).toBe(true);
        expect(copyToFs.readFileSync('/copies/original.txt', 'utf8')).toBe(
          'new content'
        );

        // Source should remain unchanged
        expect(sourceFs.readFileSync('/original.txt', 'utf8')).toBe(
          'original content'
        );
      });

      it('should create new file if it does not exist in source', async () => {
        await copyOnWriteFs.writeFile('/newfile.txt', 'new file', 'utf8');

        expect(copyToFs.existsSync('/copies/newfile.txt')).toBe(true);
        expect(copyToFs.readFileSync('/copies/newfile.txt', 'utf8')).toBe(
          'new file'
        );
      });

      it('should overwrite existing copy on subsequent writes', async () => {
        await copyOnWriteFs.writeFile('/original.txt', 'first', 'utf8');
        await copyOnWriteFs.writeFile('/original.txt', 'second', 'utf8');

        expect(copyToFs.readFileSync('/copies/original.txt', 'utf8')).toBe(
          'second'
        );
      });
    });

    describe('write() via file handle', () => {
      it('should copy file on first write', async () => {
        const fh = await copyOnWriteFs.open('/original.txt', 'w');
        await copyOnWriteFs.write(fh, Buffer.from('written'), 0, 7, 0);
        await copyOnWriteFs.close(fh);

        expect(copyToFs.existsSync('/copies/original.txt')).toBe(true);
        expect(copyToFs.readFileSync('/copies/original.txt', 'utf8')).toBe(
          'written'
        );
      });
    });

    describe('unlink()', () => {
      it('should delete copied file', async () => {
        await copyOnWriteFs.writeFile('/original.txt', 'modified', 'utf8');
        await copyOnWriteFs.unlink('/original.txt');

        expect(copyToFs.existsSync('/copies/original.txt')).toBe(false);
        // Source should still exist
        expect(sourceFs.existsSync('/original.txt')).toBe(true);
      });
    });

    describe('rename()', () => {
      it('should rename copied file', async () => {
        await copyOnWriteFs.writeFile('/original.txt', 'modified', 'utf8');
        await copyOnWriteFs.rename('/original.txt', '/renamed.txt');

        expect(copyToFs.existsSync('/copies/original.txt')).toBe(false);
        expect(copyToFs.existsSync('/copies/renamed.txt')).toBe(true);
      });
    });

    describe('ftruncate()', () => {
      it('should truncate copied file', async () => {
        await copyOnWriteFs.writeFile('/original.txt', 'long content', 'utf8');
        const fh = await copyOnWriteFs.open('/original.txt', 'r+');

        await copyOnWriteFs.ftruncate(fh, 4);
        await copyOnWriteFs.close(fh);

        const content = await copyOnWriteFs.readFile('/original.txt', 'utf8');
        expect(content).toBe('long');
      });
    });
  });

  describe('directory operations', () => {
    describe('readdir()', () => {
      beforeEach(() => {
        sourceFs.mkdirSync('/test-dir', { recursive: true });
        sourceFs.writeFileSync('/test-dir/file1.txt', 'content1', 'utf8');
        sourceFs.writeFileSync('/test-dir/file2.txt', 'content2', 'utf8');
      });

      it('should list directory from source when not copied', async () => {
        // We need to add directory to patterns or use pattern that matches files inside
        const cowWithDirPattern = new CopyOnWriteSubFs({
          name: 'cow-dir-pattern',
          parentFs,
          sourceFs,
          copyToFs,
          copyPath: '/copies',
          patterns: ['test-dir/**'],
        });

        const entries = await cowWithDirPattern.readdir('/test-dir');
        expect(entries).toContain('file1.txt');
        expect(entries).toContain('file2.txt');
      });

      it('should merge entries from source and copy', async () => {
        const cowWithDirPattern = new CopyOnWriteSubFs({
          name: 'cow-dir-pattern',
          parentFs,
          sourceFs,
          copyToFs,
          copyPath: '/copies',
          patterns: ['test-dir/**'],
        });

        // Write one file (creates copy)
        await cowWithDirPattern.writeFile(
          '/test-dir/file1.txt',
          'modified',
          'utf8'
        );

        const entries = await cowWithDirPattern.readdir('/test-dir');
        expect(entries).toContain('file1.txt');
        expect(entries).toContain('file2.txt');
      });
    });

    describe('mkdir()', () => {
      it('should create directory in copy filesystem', async () => {
        await copyOnWriteFs.mkdir('/newdir');

        expect(copyToFs.existsSync('/copies/newdir')).toBe(true);
      });

      it('should create directories recursively', async () => {
        await copyOnWriteFs.mkdir('/a/b/c', { recursive: true });

        expect(copyToFs.existsSync('/copies/a/b/c')).toBe(true);
      });
    });

    describe('rmdir()', () => {
      it('should remove directory from copy filesystem', async () => {
        await copyOnWriteFs.mkdir('/emptydir');
        await copyOnWriteFs.rmdir('/emptydir');

        expect(copyToFs.existsSync('/copies/emptydir')).toBe(false);
      });
    });
  });

  describe('file handle operations', () => {
    describe('open()', () => {
      it('should open file for reading from source', async () => {
        const fh = await copyOnWriteFs.open('/original.txt', 'r');
        expect(fh).toBeInstanceOf(CompositFsFileHandle);
        await copyOnWriteFs.close(fh);
      });

      it('should open file for writing (creates copy)', async () => {
        const fh = await copyOnWriteFs.open('/original.txt', 'w');
        expect(fh).toBeInstanceOf(CompositFsFileHandle);
        await copyOnWriteFs.close(fh);

        expect(copyToFs.existsSync('/copies/original.txt')).toBe(true);
      });

      it("should create parent directories if they don't exist", async () => {
        const fh = await copyOnWriteFs.open('/new/nested/file.txt', 'w');
        await copyOnWriteFs.close(fh);

        expect(copyToFs.existsSync('/copies/new/nested/file.txt')).toBe(true);
      });
    });

    describe('read() and write()', () => {
      it('should read from source and write to copy', async () => {
        // Read original
        const readFh = await copyOnWriteFs.open('/original.txt', 'r');
        const buffer = Buffer.alloc(16);
        const result = await copyOnWriteFs.read(readFh, buffer, 0, 16, 0);
        expect(result.bytesRead).toBe(16);
        expect(buffer.toString('utf8')).toBe('original content');
        await copyOnWriteFs.close(readFh);

        // Write new content (creates copy)
        const writeFh = await copyOnWriteFs.open('/original.txt', 'w');
        await copyOnWriteFs.write(writeFh, Buffer.from('new data'), 0, 8, 0);
        await copyOnWriteFs.close(writeFh);

        // Read from copy
        const newContent = await copyOnWriteFs.readFile(
          '/original.txt',
          'utf8'
        );
        expect(newContent).toBe('new data');
      });
    });

    describe('fstat()', () => {
      it('should return stats for copied file', async () => {
        await copyOnWriteFs.writeFile('/original.txt', 'modified', 'utf8');
        const fh = await copyOnWriteFs.open('/original.txt', 'r');

        const stats = await copyOnWriteFs.fstat(fh);
        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBe(8);

        await copyOnWriteFs.close(fh);
      });
    });
  });

  describe('copy-on-write behavior', () => {
    it('should preserve original file in sourceFs', async () => {
      await copyOnWriteFs.writeFile('/original.txt', 'modified', 'utf8');

      expect(sourceFs.readFileSync('/original.txt', 'utf8')).toBe(
        'original content'
      );
      expect(copyToFs.readFileSync('/copies/original.txt', 'utf8')).toBe(
        'modified'
      );
    });

    it('should handle multiple independent copies', async () => {
      await copyOnWriteFs.writeFile('/original.txt', 'mod1', 'utf8');
      await copyOnWriteFs.writeFile('/data.json', '{"new": "data"}', 'utf8');

      expect(copyToFs.existsSync('/copies/original.txt')).toBe(true);
      expect(copyToFs.existsSync('/copies/data.json')).toBe(true);

      expect(copyToFs.readFileSync('/copies/original.txt', 'utf8')).toBe(
        'mod1'
      );
      expect(copyToFs.readFileSync('/copies/data.json', 'utf8')).toBe(
        '{"new": "data"}'
      );
    });
  });

  describe('path handling', () => {
    it('should handle nested paths correctly', async () => {
      sourceFs.mkdirSync('/data/subdir', { recursive: true });
      sourceFs.writeFileSync('/data/subdir/file.txt', 'nested', 'utf8');

      const content = await copyOnWriteFs.readFile(
        '/data/subdir/file.txt',
        'utf8'
      );
      expect(content).toBe('nested');

      await copyOnWriteFs.writeFile(
        '/data/subdir/file.txt',
        'modified',
        'utf8'
      );
      expect(copyToFs.existsSync('/copies/data/subdir/file.txt')).toBe(true);
    });

    it('should normalize paths correctly', async () => {
      await copyOnWriteFs.writeFile('original.txt', 'relative path', 'utf8');
      expect(copyToFs.existsSync('/copies/original.txt')).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should throw when trying to read non-existent file', async () => {
      await expect(
        copyOnWriteFs.readFile('/nonexistent.txt', 'utf8')
      ).rejects.toThrow();
    });

    it('should throw when file handle not found', async () => {
      const fakeFh = { subFsFileDescriptor: 99999 } as CompositFsFileHandle;

      await expect(
        copyOnWriteFs.read(fakeFh, Buffer.alloc(1), 0, 1, 0)
      ).rejects.toThrow(/File handle not found/);
    });

    it('should throw on unsupported operations', async () => {
      await expect(copyOnWriteFs.lookup('/file.txt')).rejects.toThrow(
        /not implemented/
      );
      expect(() => copyOnWriteFs.resolvePath(123)).toThrow(/not implemented/);
    });
  });
});
