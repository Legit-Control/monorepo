import { describe, it, expect, beforeEach } from 'vitest';
import { SimpleMemorySubFs } from './SimpleMemorySubFs.js';
import type { FileSystemData } from './SimpleMemorySubFs.js';

import { CompositeFs } from '../../CompositeFs.js';
import { FsOperationContext } from '../../context.js';

describe('SimpleMemorySubFs', () => {
  let memorySubFs: SimpleMemorySubFs;
  let mockCompositeFs: CompositeFs;
  let mockContext: FsOperationContext;

  beforeEach(() => {
    // Create a mock CompositeFs
    mockCompositeFs = {
      // Add minimal mock methods needed
    } as any;

    // Create a mock context
    mockContext = {
      fullPath: '/',
      params: {},
      staticSiblings: [],
    };

    memorySubFs = new SimpleMemorySubFs({
      name: 'memory-subfs',
      rootPath: '/',
    });

    // Attach to composite fs
    memorySubFs.attach(mockCompositeFs);
    memorySubFs = memorySubFs.withContext(mockContext);
  });

  describe('constructor', () => {
    it('should create an instance with correct properties', () => {
      expect(memorySubFs.name).toBe('memory-subfs');
      expect(memorySubFs.rootPath).toBe('/');
      expect(memorySubFs.fileType()).toBeDefined();
    });

    it('should return a unique file type', () => {
      const fileType = memorySubFs.fileType();
      expect(typeof fileType).toBe('number');
    });
  });

  describe('responsible()', () => {
    it('should be responsible for all paths', async () => {
      expect(await memorySubFs.responsible('/any/path')).toBe(true);
      expect(await memorySubFs.responsible('/nested/deep/path')).toBe(true);
      expect(await memorySubFs.responsible('relative/path')).toBe(true);
      expect(await memorySubFs.responsible('')).toBe(true);
    });
  });

  describe('isWriteSupported()', () => {
    it('should return true indicating write operations are supported', () => {
      expect(memorySubFs.isWriteSupported()).toBe(true);
    });
  });

  describe('file operations - write and read', () => {
    it('should write and read file content correctly', async () => {
      const data = 'Hello, memory filesystem!';
      const buffer = Buffer.from(data);

      // Write file
      const writeFh = await memorySubFs.open('/test.txt', 'w');
      const writeResult = await memorySubFs.write(
        writeFh,
        buffer,
        0,
        buffer.length,
        0
      );
      expect(writeResult.bytesWritten).toBe(buffer.length);
      await memorySubFs.close(writeFh);

      // Read file back
      const readFh = await memorySubFs.open('/test.txt', 'r');
      const readBuffer = Buffer.alloc(data.length);
      const readResult = await memorySubFs.read(
        readFh,
        readBuffer,
        0,
        data.length,
        0
      );
      expect(readResult.bytesRead).toBe(data.length);
      expect(readBuffer.toString()).toBe(data);
      await memorySubFs.close(readFh);
    });

    it('should support writeFile and readFile convenience methods', async () => {
      const data = 'Content from writeFile';
      await memorySubFs.writeFile('/convenience.txt', data, 'utf8');

      const readContent = await memorySubFs.readFile(
        '/convenience.txt',
        'utf8'
      );
      expect(readContent).toBe(data);
    });

    it('should handle binary data correctly', async () => {
      const binaryData = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]);

      await memorySubFs.writeFile('/binary.bin', binaryData);

      const readData = await memorySubFs.readFile('/binary.bin');
      expect(Buffer.isBuffer(readData)).toBe(true);
      expect(readData).toEqual(binaryData);
    });

    it('should overwrite existing file when opening with "w" flag', async () => {
      await memorySubFs.writeFile('/overwrite.txt', 'original content', 'utf8');
      await memorySubFs.writeFile('/overwrite.txt', 'new content', 'utf8');

      const content = await memorySubFs.readFile('/overwrite.txt', 'utf8');
      expect(content).toBe('new content');
    });

    it('should append to file when opening with "a" flag', async () => {
      const fh = await memorySubFs.open('/append.txt', 'w');
      await memorySubFs.write(fh, Buffer.from('Hello '), 0, 6, 0);
      await memorySubFs.close(fh);

      // Verify initial content
      const initialContent = await memorySubFs.readFile('/append.txt', 'utf8');
      expect(initialContent).toBe('Hello ');

      // Open in append mode and write more content
      const appendFh = await memorySubFs.open('/append.txt', 'a');
      await memorySubFs.write(appendFh, Buffer.from('World!'), 0, 6, 6);
      await memorySubFs.close(appendFh);

      const finalContent = await memorySubFs.readFile('/append.txt', 'utf8');
      expect(finalContent).toBe('Hello World!');
    });

    it('should create new file with "x" flag if it does not exist', async () => {
      const fh = await memorySubFs.open('/exclusive.txt', 'wx'); // 'wx' = write + exclusive
      await memorySubFs.write(fh, Buffer.from('exclusive'), 0, 9, 0);
      await memorySubFs.close(fh);

      const content = await memorySubFs.readFile('/exclusive.txt', 'utf8');
      expect(content).toBe('exclusive');
    });

    it('should throw error when using "x" flag on existing file', async () => {
      await memorySubFs.writeFile('/exists.txt', 'content', 'utf8');

      await expect(memorySubFs.open('/exists.txt', 'x')).rejects.toThrow(
        'EEXIST'
      );
    });

    it('should throw error when opening non-existent file for reading', async () => {
      await expect(memorySubFs.open('/nonexistent.txt', 'r')).rejects.toThrow(
        'ENOENT'
      );
    });
  });

  describe('file operations - stat', () => {
    it('should return stats for an existing file', async () => {
      await memorySubFs.writeFile('/stats-test.txt', 'content', 'utf8');

      const stats = await memorySubFs.stat('/stats-test.txt');

      expect(stats).toBeDefined();
      expect(stats.isFile()).toBe(true);
      expect(stats.isDirectory()).toBe(false);
      expect(stats.size).toBe(7); // 'content' is 7 bytes
    });

    it('should return stats for an existing directory', async () => {
      await memorySubFs.mkdir('/stats-dir', { recursive: true });

      const stats = await memorySubFs.stat('/stats-dir');

      expect(stats).toBeDefined();
      expect(stats.isFile()).toBe(false);
      expect(stats.isDirectory()).toBe(true);
    });

    it('should throw error for non-existent path', async () => {
      await expect(memorySubFs.stat('/nonexistent')).rejects.toThrow();
    });

    it('should return fstat for open file handle', async () => {
      await memorySubFs.writeFile('/fstat-test.txt', 'content', 'utf8');
      const fh = await memorySubFs.open('/fstat-test.txt', 'r');

      const stats = await memorySubFs.fstat(fh);

      expect(stats).toBeDefined();
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBe(7);

      await memorySubFs.close(fh);
    });
  });

  describe('directory operations', () => {
    it('should create a directory', async () => {
      await memorySubFs.mkdir('/mydir', { recursive: true });

      const stats = await memorySubFs.stat('/mydir');
      expect(stats.isDirectory()).toBe(true);
    });

    it('should create nested directories with recursive flag', async () => {
      await memorySubFs.mkdir('/a/b/c/d', { recursive: true });

      const stats = await memorySubFs.stat('/a/b/c/d');
      expect(stats.isDirectory()).toBe(true);
    });

    it('should list directory contents', async () => {
      await memorySubFs.mkdir('/readdir-test', { recursive: true });
      await memorySubFs.writeFile(
        '/readdir-test/file1.txt',
        'content1',
        'utf8'
      );
      await memorySubFs.writeFile(
        '/readdir-test/file2.txt',
        'content2',
        'utf8'
      );
      await memorySubFs.mkdir('/readdir-test/subdir', { recursive: true });

      const entries = await memorySubFs.readdir('/readdir-test');

      expect(entries).toContain('file1.txt');
      expect(entries).toContain('file2.txt');
      expect(entries).toContain('subdir');
      expect(entries.length).toBe(3);
    });

    it('should list root directory contents', async () => {
      await memorySubFs.writeFile('/root-file1.txt', 'content1', 'utf8');
      await memorySubFs.writeFile('/root-file2.txt', 'content2', 'utf8');
      await memorySubFs.mkdir('/rootdir', { recursive: true });

      const entries = await memorySubFs.readdir('/');

      expect(entries).toContain('root-file1.txt');
      expect(entries).toContain('root-file2.txt');
      expect(entries).toContain('rootdir');
    });

    it('should return empty array for empty directory', async () => {
      await memorySubFs.mkdir('/empty', { recursive: true });

      const entries = await memorySubFs.readdir('/empty');

      expect(entries).toEqual([]);
    });

    it('should remove an empty directory', async () => {
      await memorySubFs.mkdir('/remove-me', { recursive: true });
      await memorySubFs.rmdir('/remove-me');

      await expect(memorySubFs.stat('/remove-me')).rejects.toThrow();
    });

    it('should remove a directory with contents', async () => {
      await memorySubFs.mkdir('/with-content', { recursive: true });
      await memorySubFs.writeFile('/with-content/file.txt', 'content', 'utf8');

      await memorySubFs.rmdir('/with-content');

      await expect(memorySubFs.stat('/with-content')).rejects.toThrow();
    });
  });

  describe('file operations - delete', () => {
    it('should delete a file', async () => {
      await memorySubFs.writeFile('/delete-me.txt', 'content', 'utf8');

      await memorySubFs.unlink('/delete-me.txt');

      await expect(memorySubFs.stat('/delete-me.txt')).rejects.toThrow();
    });

    it('should throw error when deleting non-existent file', async () => {
      await expect(memorySubFs.unlink('/nonexistent.txt')).rejects.toThrow();
    });
  });

  describe('file operations - rename', () => {
    it('should rename a file', async () => {
      await memorySubFs.writeFile('/old-name.txt', 'content', 'utf8');

      await memorySubFs.rename('/old-name.txt', '/new-name.txt');

      await expect(memorySubFs.stat('/old-name.txt')).rejects.toThrow();
      const content = await memorySubFs.readFile('/new-name.txt', 'utf8');
      expect(content).toBe('content');
    });

    it('should move a file to a different directory', async () => {
      await memorySubFs.mkdir('/dest', { recursive: true });
      await memorySubFs.writeFile('/source/file.txt', 'content', 'utf8');

      await memorySubFs.rename('/source/file.txt', '/dest/file.txt');

      await expect(memorySubFs.stat('/source/file.txt')).rejects.toThrow();
      const content = await memorySubFs.readFile('/dest/file.txt', 'utf8');
      expect(content).toBe('content');
    });

    it('should rename a directory', async () => {
      await memorySubFs.mkdir('/old-dir', { recursive: true });
      await memorySubFs.writeFile('/old-dir/file.txt', 'content', 'utf8');

      await memorySubFs.rename('/old-dir', '/new-dir');

      await expect(memorySubFs.stat('/old-dir')).rejects.toThrow();
      const content = await memorySubFs.readFile('/new-dir/file.txt', 'utf8');
      expect(content).toBe('content');
    });
  });

  describe('file handle operations', () => {
    it('should track open file handles', async () => {
      const fh1 = await memorySubFs.open('/handle1.txt', 'w');
      const fh2 = await memorySubFs.open('/handle2.txt', 'w');

      expect(fh1.subFsFileDescriptor).toBeGreaterThan(0);
      expect(fh2.subFsFileDescriptor).toBeGreaterThan(0);
      expect(fh1.subFsFileDescriptor).not.toBe(fh2.subFsFileDescriptor);

      await memorySubFs.close(fh1);
      await memorySubFs.close(fh2);
    });

    it('should flush data on close', async () => {
      const fh = await memorySubFs.open('/flush-test.txt', 'w');
      await memorySubFs.write(fh, Buffer.from('flushed'), 0, 7, 0);
      await memorySubFs.close(fh);

      const content = await memorySubFs.readFile('/flush-test.txt', 'utf8');
      expect(content).toBe('flushed');
    });

    it('should support multiple reads from same file handle', async () => {
      await memorySubFs.writeFile('/multi-read.txt', '0123456789', 'utf8');
      const fh = await memorySubFs.open('/multi-read.txt', 'r');

      const buf1 = Buffer.alloc(5);
      await memorySubFs.read(fh, buf1, 0, 5, 0);
      expect(buf1.toString()).toBe('01234');

      const buf2 = Buffer.alloc(5);
      await memorySubFs.read(fh, buf2, 0, 5, 5);
      expect(buf2.toString()).toBe('56789');

      await memorySubFs.close(fh);
    });
  });

  describe('edge cases', () => {
    it('should handle empty files', async () => {
      await memorySubFs.writeFile('/empty.txt', '', 'utf8');

      const stats = await memorySubFs.stat('/empty.txt');
      expect(stats.size).toBe(0);

      const content = await memorySubFs.readFile('/empty.txt', 'utf8');
      expect(content).toBe('');
    });

    it('should handle files with special characters in name', async () => {
      const specialName = '/file-with-special-chars-@#$%.txt';
      await memorySubFs.writeFile(specialName, 'content', 'utf8');

      const content = await memorySubFs.readFile(specialName, 'utf8');
      expect(content).toBe('content');
    });

    it('should handle very large files', async () => {
      const largeData = 'x'.repeat(1000000); // 1MB of 'x'
      await memorySubFs.writeFile('/large.txt', largeData, 'utf8');

      const stats = await memorySubFs.stat('/large.txt');
      expect(stats.size).toBe(1000000);
    });

    it('should handle reading with different buffer sizes', async () => {
      const data = '0123456789';
      await memorySubFs.writeFile('/buffer-test.txt', data, 'utf8');

      const fh = await memorySubFs.open('/buffer-test.txt', 'r');

      // Read in small chunks
      const buf1 = Buffer.alloc(3);
      await memorySubFs.read(fh, buf1, 0, 3, 0);
      expect(buf1.toString()).toBe('012');

      const buf2 = Buffer.alloc(3);
      await memorySubFs.read(fh, buf2, 0, 3, 3);
      expect(buf2.toString()).toBe('345');

      const buf3 = Buffer.alloc(4);
      await memorySubFs.read(fh, buf3, 0, 4, 6);
      expect(buf3.toString()).toBe('6789');

      await memorySubFs.close(fh);
    });
  });

  describe('error handling', () => {
    it('should throw error when writing to read-only handle', async () => {
      await memorySubFs.writeFile('/readonly.txt', 'existing content', 'utf8');
      const fh = await memorySubFs.open('/readonly.txt', 'r');

      await expect(
        memorySubFs.write(fh, Buffer.from('data'), 0, 4, 0)
      ).rejects.toThrow('EBADF');

      await memorySubFs.close(fh);
    });

    it('should handle concurrent file operations', async () => {
      // Open multiple files concurrently
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          memorySubFs.writeFile(`/concurrent-${i}.txt`, `content-${i}`, 'utf8')
        );
      }

      await Promise.all(promises);

      // Verify all files were written
      for (let i = 0; i < 10; i++) {
        const content = await memorySubFs.readFile(
          `/concurrent-${i}.txt`,
          'utf8'
        );
        expect(content).toBe(`content-${i}`);
      }
    });
  });

  describe('access()', () => {
    it('should return without error for existing file', async () => {
      await memorySubFs.writeFile('/access-test.txt', 'content', 'utf8');

      await expect(
        memorySubFs.access('/access-test.txt')
      ).resolves.not.toThrow();
    });

    it('should throw error for non-existing file', async () => {
      await expect(memorySubFs.access('/nonexistent')).rejects.toThrow();
    });
  });

  describe('context handling', () => {
    it('should work with context containing route parameters', async () => {
      const contextWithParams: FsOperationContext = {
        fullPath: '/branches/main/src/index.ts',
        params: { branchName: 'main', filePath: 'src/index.ts' },
        staticSiblings: [{ segment: 'head', type: 'file' }],
      };

      const subfsWithContext = memorySubFs.withContext(contextWithParams);

      await subfsWithContext.writeFile('/context-test.txt', 'content', 'utf8');

      const content = await subfsWithContext.readFile(
        '/context-test.txt',
        'utf8'
      );
      expect(content).toBe('content');
    });

    it('should work with context containing static siblings', async () => {
      const contextWithSiblings: FsOperationContext = {
        fullPath: '/branches/main/src/index.ts',
        params: {},
        staticSiblings: [
          { segment: 'file1.txt', type: 'file' },
          { segment: 'dir1', type: 'folder' },
        ],
      };

      await memorySubFs.mkdir('/siblings-test', { recursive: true });
      await memorySubFs.writeFile('/siblings-test/file.txt', 'content', 'utf8');

      const subfsWithContext = memorySubFs.withContext(contextWithSiblings);
      const entries = await subfsWithContext.readdir('/siblings-test');

      // Should include both actual file and static siblings
      expect(entries).toContain('file.txt');
      expect(entries).toContain('file1.txt');
      expect(entries).toContain('dir1');
    });
  });

  describe('initialData constructor parameter', () => {
    it('should initialize filesystem with simple file structure', async () => {
      const initialData: FileSystemData = {
        'file1.txt': 'content1',
        'file2.txt': 'content2',
      };

      const fs = new SimpleMemorySubFs({
        name: 'test-fs',
        rootPath: '/',
        initialData,
      });

      const content1 = await fs.readFile('/file1.txt', 'utf8');
      const content2 = await fs.readFile('/file2.txt', 'utf8');

      expect(content1).toBe('content1');
      expect(content2).toBe('content2');
    });

    it('should initialize filesystem with nested directory structure', async () => {
      const initialData: FileSystemData = {
        src: {
          'index.ts': 'console.log("hello");',
          components: {
            'Header.tsx': 'export default function Header() {}',
            'Footer.tsx': 'export default function Footer() {}',
          },
        },
      };

      const fs = new SimpleMemorySubFs({
        name: 'test-fs',
        rootPath: '/',
        initialData,
      });

      const indexContent = await fs.readFile('/src/index.ts', 'utf8');
      const headerContent = await fs.readFile(
        '/src/components/Header.tsx',
        'utf8'
      );
      const footerContent = await fs.readFile(
        '/src/components/Footer.tsx',
        'utf8'
      );

      expect(indexContent).toBe('console.log("hello");');
      expect(headerContent).toBe('export default function Header() {}');
      expect(footerContent).toBe('export default function Footer() {}');

      // Verify directory structure
      const srcEntries = await fs.readdir('/src');
      expect(srcEntries).toContain('index.ts');
      expect(srcEntries).toContain('components');

      const componentsEntries = await fs.readdir('/src/components');
      expect(componentsEntries).toContain('Header.tsx');
      expect(componentsEntries).toContain('Footer.tsx');
    });

    it('should mix files and directories at same level', async () => {
      const initialData: FileSystemData = {
        'root.txt': 'root content',
        src: {
          'file.ts': 'source code',
        },
        docs: {
          'readme.md': '# README',
        },
      };

      const fs = new SimpleMemorySubFs({
        name: 'test-fs',
        rootPath: '/',
        initialData,
      });

      const rootContent = await fs.readFile('/root.txt', 'utf8');
      expect(rootContent).toBe('root content');

      const srcContent = await fs.readFile('/src/file.ts', 'utf8');
      expect(srcContent).toBe('source code');

      const readmeContent = await fs.readFile('/docs/readme.md', 'utf8');
      expect(readmeContent).toBe('# README');

      // Verify root directory has both files and folders
      const rootEntries = await fs.readdir('/');
      expect(rootEntries).toContain('root.txt');
      expect(rootEntries).toContain('src');
      expect(rootEntries).toContain('docs');
    });

    it('should handle empty directories', async () => {
      const initialData: FileSystemData = {
        'empty-dir': {},
        'file.txt': 'content',
      };

      const fs = new SimpleMemorySubFs({
        name: 'test-fs',
        rootPath: '/',
        initialData,
      });

      const entries = await fs.readdir('/');
      expect(entries).toContain('empty-dir');
      expect(entries).toContain('file.txt');

      // Empty directory should be readable
      const emptyDirEntries = await fs.readdir('/empty-dir');
      expect(emptyDirEntries).toEqual([]);
    });

    it('should handle deeply nested structures', async () => {
      const initialData: FileSystemData = {
        a: {
          b: {
            c: {
              d: {
                e: {
                  'deep.txt': 'deep content',
                },
              },
            },
          },
        },
      };

      const fs = new SimpleMemorySubFs({
        name: 'test-fs',
        rootPath: '/',
        initialData,
      });

      const deepContent = await fs.readFile('/a/b/c/d/e/deep.txt', 'utf8');
      expect(deepContent).toBe('deep content');

      // Verify all intermediate directories exist
      const stats = await fs.stat('/a/b/c/d/e');
      expect(stats.isDirectory()).toBe(true);
    });

    it('should handle special characters in filenames from initial data', async () => {
      const initialData: FileSystemData = {
        'file with spaces.txt': 'spaces',
        'file-with-dashes.txt': 'dashes',
        'file_with_underscores.txt': 'underscores',
      };

      const fs = new SimpleMemorySubFs({
        name: 'test-fs',
        rootPath: '/',
        initialData,
      });

      expect(await fs.readFile('/file with spaces.txt', 'utf8')).toBe('spaces');
      expect(await fs.readFile('/file-with-dashes.txt', 'utf8')).toBe('dashes');
      expect(
        await fs.readFile('/file_with_underscores.txt', 'utf8')
      ).toBe('underscores');
    });

    it('should allow empty file contents', async () => {
      const initialData: FileSystemData = {
        'empty.txt': '',
        'non-empty.txt': 'content',
      };

      const fs = new SimpleMemorySubFs({
        name: 'test-fs',
        rootPath: '/',
        initialData,
      });

      const emptyContent = await fs.readFile('/empty.txt', 'utf8');
      expect(emptyContent).toBe('');

      const stats = await fs.stat('/empty.txt');
      expect(stats.size).toBe(0);
    });

    it('should work with initial data and then support modifications', async () => {
      const initialData: FileSystemData = {
        'original.txt': 'original content',
        'to-delete.txt': 'will be deleted',
      };

      const fs = new SimpleMemorySubFs({
        name: 'test-fs',
        rootPath: '/',
        initialData,
      });

      // Read initial content
      expect(await fs.readFile('/original.txt', 'utf8')).toBe(
        'original content'
      );

      // Modify existing file
      await fs.writeFile('/original.txt', 'modified content', 'utf8');
      expect(await fs.readFile('/original.txt', 'utf8')).toBe('modified content');

      // Delete file
      await fs.unlink('/to-delete.txt');
      await expect(fs.readFile('/to-delete.txt', 'utf8')).rejects.toThrow();

      // Create new file
      await fs.writeFile('/new-file.txt', 'new content', 'utf8');
      expect(await fs.readFile('/new-file.txt', 'utf8')).toBe('new content');
    });

    it('should handle complex real-world project structure', async () => {
      const initialData: FileSystemData = {
        'package.json': JSON.stringify({ name: 'test-project', version: '1.0.0' }),
        src: {
          'index.ts': 'import { App } from "./App";\nnew App();',
          'App.ts': 'export class App {\n  constructor() {}\n}',
          utils: {
            'helpers.ts': 'export function helper() {}',
            'constants.ts': 'export const PI = 3.14;',
          },
        },
        tests: {
          'App.test.ts': 'test("App", () => {});',
          'helpers.test.ts': 'test("helper", () => {});',
        },
        'README.md': '# Test Project\n\nThis is a test.',
        '.gitignore': 'node_modules/\ndist/',
      };

      const fs = new SimpleMemorySubFs({
        name: 'project-fs',
        rootPath: '/',
        initialData,
      });

      // Verify package.json
      const pkgContent = await fs.readFile('/package.json', 'utf8');
      const pkg = JSON.parse(pkgContent as string);
      expect(pkg.name).toBe('test-project');
      expect(pkg.version).toBe('1.0.0');

      // Verify source files
      expect(await fs.readFile('/src/index.ts', 'utf8')).toContain('App');
      expect(await fs.readFile('/src/App.ts', 'utf8')).toContain('class App');

      // Verify nested utils
      const utilsEntries = await fs.readdir('/src/utils');
      expect(utilsEntries).toContain('helpers.ts');
      expect(utilsEntries).toContain('constants.ts');

      // Verify test files exist
      const testEntries = await fs.readdir('/tests');
      expect(testEntries).toContain('App.test.ts');
      expect(testEntries).toContain('helpers.test.ts');

      // Verify root files
      const rootEntries = await fs.readdir('/');
      expect(rootEntries).toContain('package.json');
      expect(rootEntries).toContain('src');
      expect(rootEntries).toContain('tests');
      expect(rootEntries).toContain('README.md');
      expect(rootEntries).toContain('.gitignore');
    });
  });
});
