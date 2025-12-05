import { describe, it, expect, beforeEach } from 'vitest';
import { EphemeralSubFs } from './EphemeralFileSubFs.js';
import CompositFsFileHandle from '../CompositeFsFileHandle.js';
import { CompositeFs } from '../CompositeFs.js';
import * as nodeFs from 'node:fs';

describe('EphemeralFileSubFs', () => {
  let ephemeralSubFs: EphemeralSubFs;
  let parentFs: CompositeFs;

  beforeEach(() => {
    // Create a mock parent fs
    parentFs = {
      parentFs: {} as any, // Required to not throw error in constructor
    } as CompositeFs;

    ephemeralSubFs = new EphemeralSubFs({
      name: 'ephemeral-subfs',
      parentFs,
      gitRoot: '/test',
      ephemeralPatterns: [
        '**/ephemeral_everywhere',
        'temp/**', // any file under temp/
        '*.tmp', // any .tmp file
        'cache/*', // files directly under cache/
        'build/output.js', // specific file
        '!temp/keep.txt', // negation: temp/keep.txt should NOT be ephemeral
      ],
    });
  });

  describe('responsible()', () => {
    it('should be responsible for files matching ephemeral patterns', async () => {
      expect(
        await ephemeralSubFs.responsible('temp/ephemeral_everywhere')
      ).toBe(true);
      expect(await ephemeralSubFs.responsible('ephemeral_everywhere')).toBe(
        true
      );
      expect(
        await ephemeralSubFs.responsible('tem/temp/ephemeral_everywhere')
      ).toBe(true);
      expect(await ephemeralSubFs.responsible('temp/file.txt')).toBe(true);
      expect(await ephemeralSubFs.responsible('temp/nested/file.txt')).toBe(
        true
      );
      expect(await ephemeralSubFs.responsible('file.tmp')).toBe(true);
      expect(await ephemeralSubFs.responsible('cache/file.txt')).toBe(true);
      expect(await ephemeralSubFs.responsible('build/output.js')).toBe(true);
    });

    it('should not be responsible for files not matching patterns', async () => {
      expect(await ephemeralSubFs.responsible('regular.txt')).toBe(false);
      expect(await ephemeralSubFs.responsible('src/code.js')).toBe(false);
      expect(await ephemeralSubFs.responsible('cache/nested/file.txt')).toBe(
        true
      ); // cache/* matches all under cache
      expect(await ephemeralSubFs.responsible('temp/keep.txt')).toBe(false); // negated
    });

    it('should handle edge cases', async () => {
      expect(await ephemeralSubFs.responsible('')).toBe(false);
      expect(await ephemeralSubFs.responsible('.')).toBe(false);
      expect(await ephemeralSubFs.responsible('/')).toBe(false);
    });
  });

  describe('fileType()', () => {
    it('should return a unique file type', () => {
      expect(ephemeralSubFs.fileType()).toBe(5); // Should be different from PassThroughSubFs (4) and HiddenFileSubFs (0xff)
    });
  });

  describe('file operations', () => {
    describe('open()', () => {
      it('should open a file and return a file handle', async () => {
        const fh = await ephemeralSubFs.open('temp/test.txt', 'w');
        expect(fh).toBeInstanceOf(CompositFsFileHandle);
        expect(fh.subFsFileDescriptor).toBeGreaterThan(0);
        await ephemeralSubFs.close(fh);
      });

      it("should create parent directories if they don't exist", async () => {
        const fh = await ephemeralSubFs.open('temp/nested/deep/file.txt', 'w');
        expect(fh).toBeInstanceOf(CompositFsFileHandle);
        await ephemeralSubFs.close(fh);
      });
    });

    describe('write() and read()', () => {
      it('should write and read data from ephemeral storage', async () => {
        const data = 'Hello, ephemeral world!';
        const buffer = Buffer.from(data);

        // Open file for writing
        const writeFh = await ephemeralSubFs.open('temp/test.txt', 'w');
        const writeResult = await ephemeralSubFs.write(
          writeFh,
          buffer,
          0,
          buffer.length,
          0
        );
        expect(writeResult.bytesWritten).toBe(buffer.length);
        await ephemeralSubFs.close(writeFh);

        // Open file for reading
        const readFh = await ephemeralSubFs.open('temp/test.txt', 'r');
        const readBuffer = Buffer.alloc(buffer.length);
        const readResult = await ephemeralSubFs.read(
          readFh,
          readBuffer,
          0,
          buffer.length,
          0
        );
        expect(readResult.bytesRead).toBe(buffer.length);
        expect(readBuffer.toString()).toBe(data);
        await ephemeralSubFs.close(readFh);
      });
    });

    describe('writeFile() and readFile()', () => {
      it('should write and read files', async () => {
        const content = 'Test file content';
        await ephemeralSubFs.writeFile('temp/file.txt', content, 'utf8');

        const readContent = await ephemeralSubFs.readFile(
          'temp/file.txt',
          'utf8'
        );
        expect(readContent).toBe(content);
      });

      it('should handle binary data', async () => {
        const binaryData = Buffer.from([0x00, 0x01, 0x02, 0x03]);
        await ephemeralSubFs.writeFile('temp/binary.dat', binaryData, {});

        const readData = await ephemeralSubFs.readFile('temp/binary.dat');
        expect(Buffer.from(readData as any)).toEqual(binaryData);
      });
    });

    describe('stat() and fstat()', () => {
      it('should return file stats', async () => {
        await ephemeralSubFs.writeFile('temp/file.txt', 'content', 'utf8');

        const stats = await ephemeralSubFs.stat('temp/file.txt');
        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBe(7); // "content" is 7 bytes
      });

      it('should return file stats via file handle', async () => {
        await ephemeralSubFs.writeFile('temp/file.txt', 'content', 'utf8');
        const fh = await ephemeralSubFs.open('temp/file.txt', 'r');

        const stats = await ephemeralSubFs.fstat(fh);
        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBe(7);

        await ephemeralSubFs.close(fh);
      });
    });

    describe('unlink()', () => {
      it('should delete a file', async () => {
        await ephemeralSubFs.writeFile('temp/file.txt', 'content', 'utf8');
        await ephemeralSubFs.unlink('temp/file.txt');

        await expect(ephemeralSubFs.stat('temp/file.txt')).rejects.toThrow();
      });
    });

    describe('rename()', () => {
      it('should rename a file', async () => {
        await ephemeralSubFs.writeFile('temp/old.txt', 'content', 'utf8');
        await ephemeralSubFs.rename('temp/old.txt', 'temp/new.txt');

        await expect(ephemeralSubFs.stat('temp/old.txt')).rejects.toThrow();
        const content = await ephemeralSubFs.readFile('temp/new.txt', 'utf8');
        expect(content).toBe('content');
      });
    });

    describe('ftruncate()', () => {
      it('should truncate a file', async () => {
        await ephemeralSubFs.writeFile('temp/file.txt', 'long content', 'utf8');
        const fh = await ephemeralSubFs.open('temp/file.txt', 'r+');

        await ephemeralSubFs.ftruncate(fh, 4);
        await ephemeralSubFs.close(fh);

        const content = await ephemeralSubFs.readFile('temp/file.txt', 'utf8');
        expect(content).toBe('long');
      });
    });
  });

  describe('directory operations', () => {
    describe('mkdir()', () => {
      it('should create a directory', async () => {
        await ephemeralSubFs.mkdir('temp/newdir');
        const stats = await ephemeralSubFs.stat('temp/newdir');
        expect(stats.isDirectory()).toBe(true);
      });

      it('should create directories recursively with recursive option', async () => {
        await ephemeralSubFs.mkdir('temp/a/b/c', { recursive: true });
        const stats = await ephemeralSubFs.stat('temp/a/b/c');
        expect(stats.isDirectory()).toBe(true);
      });
    });

    describe('rmdir()', () => {
      it('should remove an empty directory', async () => {
        await ephemeralSubFs.mkdir('temp/emptydir');
        await ephemeralSubFs.rmdir('temp/emptydir');

        await expect(ephemeralSubFs.stat('temp/emptydir')).rejects.toThrow();
      });
    });

    describe('readdir()', () => {
      it('should list directory contents', async () => {
        await ephemeralSubFs.mkdir('temp/testdir');
        await ephemeralSubFs.writeFile(
          'temp/testdir/file1.txt',
          'content1',
          'utf8'
        );
        await ephemeralSubFs.writeFile(
          'temp/testdir/file2.txt',
          'content2',
          'utf8'
        );
        await ephemeralSubFs.mkdir('temp/testdir/subdir');

        const entries = await ephemeralSubFs.readdir('temp/testdir');
        expect(entries).toHaveLength(3);
        expect(entries).toContain('file1.txt');
        expect(entries).toContain('file2.txt');
        expect(entries).toContain('subdir');
      });

      it('should support withFileTypes option', async () => {
        await ephemeralSubFs.mkdir('temp/testdir');
        await ephemeralSubFs.writeFile(
          'temp/testdir/file.txt',
          'content',
          'utf8'
        );
        await ephemeralSubFs.mkdir('temp/testdir/subdir');

        const entries = await ephemeralSubFs.readdir('temp/testdir', {
          withFileTypes: true,
        });
        expect(entries).toHaveLength(2);

        const file = entries.find((e: any) => e.name === 'file.txt');
        const dir = entries.find((e: any) => e.name === 'subdir');

        expect(file.isFile()).toBe(true);
        expect(dir.isDirectory()).toBe(true);
      });
    });

    describe('opendir()', () => {
      it('should open a directory', async () => {
        await ephemeralSubFs.mkdir('temp/testdir');
        await ephemeralSubFs.writeFile(
          'temp/testdir/file1.txt',
          'content',
          'utf8'
        );
        await ephemeralSubFs.writeFile(
          'temp/testdir/file2.txt',
          'content',
          'utf8'
        );

        const dir = await ephemeralSubFs.opendir('temp/testdir');
        const entries = [];

        for await (const entry of dir) {
          entries.push(entry.name);
        }

        expect(entries).toHaveLength(2);
        expect(entries).toContain('file1.txt');
        expect(entries).toContain('file2.txt');
      });
    });
  });

  describe('link operations', () => {
    describe('link()', () => {
      it('should create a hard link', async () => {
        await ephemeralSubFs.writeFile('temp/original.txt', 'content', 'utf8');
        await ephemeralSubFs.link('temp/original.txt', 'temp/hardlink.txt');

        const content = await ephemeralSubFs.readFile(
          'temp/hardlink.txt',
          'utf8'
        );
        expect(content).toBe('content');

        // Modifying through one link should affect the other
        await ephemeralSubFs.writeFile(
          'temp/hardlink.txt',
          'new content',
          'utf8'
        );
        const originalContent = await ephemeralSubFs.readFile(
          'temp/original.txt',
          'utf8'
        );
        expect(originalContent).toBe('new content');
      });
    });

    describe('symlink()', () => {
      it('should create a symbolic link', async () => {
        await ephemeralSubFs.writeFile('temp/target.txt', 'content', 'utf8');
        await ephemeralSubFs.symlink('temp/target.txt', 'temp/symlink.txt');

        const stats = await ephemeralSubFs.lstat('temp/symlink.txt');
        expect(stats.isSymbolicLink()).toBe(true);
      });
    });
  });

  describe('file handle operations', () => {
    describe('dataSync()', () => {
      it('should sync file data', async () => {
        const fh = await ephemeralSubFs.open('temp/file.txt', 'w');
        await ephemeralSubFs.write(fh, Buffer.from('data'), 0, 4, 0);
        await expect(ephemeralSubFs.dataSync(fh)).resolves.not.toThrow();
        await ephemeralSubFs.close(fh);
      });
    });

    describe('fchmod()', () => {
      it('should change file mode', async () => {
        await ephemeralSubFs.writeFile('temp/file.txt', 'content', 'utf8');
        const fh = await ephemeralSubFs.open('temp/file.txt', 'r+');

        await expect(ephemeralSubFs.fchmod(fh, 0o644)).resolves.not.toThrow();
        await ephemeralSubFs.close(fh);
      });
    });

    describe('fchown()', () => {
      it('should change file ownership', async () => {
        await ephemeralSubFs.writeFile('temp/file.txt', 'content', 'utf8');
        const fh = await ephemeralSubFs.open('temp/file.txt', 'r+');

        await expect(
          ephemeralSubFs.fchown(fh, 1000, 1000)
        ).resolves.not.toThrow();
        await ephemeralSubFs.close(fh);
      });
    });

    describe('futimes()', () => {
      it('should update file timestamps', async () => {
        await ephemeralSubFs.writeFile('temp/file.txt', 'content', 'utf8');
        const fh = await ephemeralSubFs.open('temp/file.txt', 'r+');

        const now = new Date();
        await expect(
          ephemeralSubFs.futimes(fh, now, now)
        ).resolves.not.toThrow();
        await ephemeralSubFs.close(fh);
      });
    });

    describe('writev() and readv()', () => {
      it('should write and read multiple buffers', async () => {
        const buffers = [
          Buffer.from('Hello'),
          Buffer.from(' '),
          Buffer.from('World'),
        ];

        const fh = await ephemeralSubFs.open('temp/file.txt', 'w+');
        const writeResult = await ephemeralSubFs.writev(fh, buffers, 0);
        expect(writeResult.bytesWritten).toBe(11);

        const readBuffers = [Buffer.alloc(5), Buffer.alloc(1), Buffer.alloc(5)];
        const readResult = await ephemeralSubFs.readv(fh, readBuffers, 0);
        expect(readResult.bytesRead).toBe(11);
        expect(readBuffers[0]!.toString()).toBe('Hello');
        expect(readBuffers[1]!.toString()).toBe(' ');
        expect(readBuffers[2]!.toString()).toBe('World');

        await ephemeralSubFs.close(fh);
      });
    });
  });

  describe('access()', () => {
    it('should check file accessibility', async () => {
      await ephemeralSubFs.writeFile('temp/file.txt', 'content', 'utf8');
      await expect(
        ephemeralSubFs.access('temp/file.txt')
      ).resolves.not.toThrow();
      await expect(
        ephemeralSubFs.access('temp/nonexistent.txt')
      ).rejects.toThrow();
    });

    it('should check specific access modes', async () => {
      await ephemeralSubFs.writeFile('temp/file.txt', 'content', 'utf8');
      await expect(
        ephemeralSubFs.access('temp/file.txt', nodeFs.constants.R_OK)
      ).resolves.not.toThrow();
      await expect(
        ephemeralSubFs.access('temp/file.txt', nodeFs.constants.W_OK)
      ).resolves.not.toThrow();
    });
  });

  describe('ephemeral behavior', () => {
    it('should store data only in memory', async () => {
      // Write data
      await ephemeralSubFs.writeFile(
        'temp/ephemeral.txt',
        'ephemeral data',
        'utf8'
      );

      // Data should be accessible
      const content = await ephemeralSubFs.readFile(
        'temp/ephemeral.txt',
        'utf8'
      );
      expect(content).toBe('ephemeral data');

      // Create a new instance - data should be gone
      const newEphemeralSubFs = new EphemeralSubFs({
        name: 'new-ephemeral-subfs',
        parentFs,
        gitRoot: '/test',
        ephemeralPatterns: ['temp/**'],
      });

      await expect(
        newEphemeralSubFs.stat('temp/ephemeral.txt')
      ).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should throw on unsupported operations', async () => {
      await expect(ephemeralSubFs.lookup('temp/file.txt')).rejects.toThrow(
        /not implemented/
      );
      expect(() => ephemeralSubFs.resolvePath(123)).toThrow(/not implemented/);
      await expect(ephemeralSubFs.readlink('temp/link')).rejects.toThrow(
        /not implemented/
      );
    });

    it('should throw when file handle not found', async () => {
      const fakeFh = { subFsFileDescriptor: 99999 } as CompositFsFileHandle;

      await expect(
        ephemeralSubFs.read(fakeFh, Buffer.alloc(1), 0, 1, 0)
      ).rejects.toThrow(/File handle not found/);
      await expect(
        ephemeralSubFs.write(fakeFh, Buffer.from('data'), 0, 4, 0)
      ).rejects.toThrow(/File handle not found/);
    });
  });
});
