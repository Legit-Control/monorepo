import { describe, it, expect } from 'vitest';
import { HiddenFileSubFs } from './HiddenFileSubFs.js';
import CompositFsFileHandle from '../CompositeFsFileHandle.js';

import * as nodeFs from 'node:fs';

describe('createHiddenFileSubFs', () => {
  // .gitignore-style patterns
  const hiddenFiles = [
    'secret.txt', // exact file
    'hidden/**', // any file under hidden/
    '*.log', // any .log file
    '!not_hidden.txt', // negation: not_hidden.txt should NOT be hidden
    'foo/bar?.md', // single-char wildcard
    'baz/*/qux.js', // nested wildcard
  ];
  const fs = new HiddenFileSubFs({
    name: 'hidden-files-subfs',
    hiddenFiles,
  });

  it('should be responsible for hidden files and patterns', async () => {
    expect(await fs.responsible('secret.txt')).toBe(true);
    expect(await fs.responsible('hidden/secret2.txt')).toBe(true);
    expect(await fs.responsible('hidden/foo/bar.txt')).toBe(true);
    expect(await fs.responsible('foo.log')).toBe(true);
    expect(await fs.responsible('not_hidden.txt')).toBe(false); // negated pattern
    // .gitignore rules: 'secret.txt' matches in any subdirectory
    expect(await fs.responsible('folder/secret.txt')).toBe(true);
    expect(await fs.responsible('foo/bar1.md')).toBe(true); // matches bar?.md
    expect(await fs.responsible('foo/barA.md')).toBe(true); // matches bar?.md
    expect(await fs.responsible('foo/bar12.md')).toBe(false); // does not match bar?.md
    expect(await fs.responsible('baz/x/qux.js')).toBe(true); // matches baz/*/qux.js
    expect(await fs.responsible('baz/y/qux.js')).toBe(true); // matches baz/*/qux.js
    expect(await fs.responsible('baz/x/y/qux.js')).toBe(false); // too deep
  });

  it('should throw on open for hidden file', async () => {
    await expect(fs.open('secret.txt', 'r')).rejects.toThrow(
      /Access to hidden file/
    );
  });

  it('should throw on stat for hidden file', async () => {
    await expect(fs.stat('secret.txt')).rejects.toThrow(
      /Access to hidden file/
    );
  });

  it('should throw on unlink for hidden file', async () => {
    await expect(fs.unlink('secret.txt')).rejects.toThrow(
      /Access to hidden file/
    );
  });

  // it("should throw on appendFile for hidden file", async () => {
  //   await expect(fs.appendFile("secret.txt", "data")).rejects.toThrow(
  //     /Access to hidden file/,
  //   );
  // });

  it('should throw on close for file handle', async () => {
    const fakeHandle = { fd: 42 } as unknown as CompositFsFileHandle;

    await expect(() => fs.close(fakeHandle)).rejects.toThrow(
      /Access to hidden file/
    );
  });

  it('should throw on readFileHandle for file handle', async () => {
    const fakeHandle = { fd: 42 } as unknown as CompositFsFileHandle;
    await expect(fs.read(fakeHandle, Buffer.alloc(1), 0, 1, 0)).rejects.toThrow(
      /Access to hidden file/
    );
  });
});
