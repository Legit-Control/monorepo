import { describe, it, expect } from 'vitest';
import { Gnfs } from './gnfs';
import { createMemoryBackedState } from '../state/memory-backed-state.js';

describe('GNFS', () => {
  it('should read the root folder', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    const files = await asyncGnfs.readdir('/');

    expect(files).toEqual([]);

    memoryStateProvider.put('/file.txt', { body: 'Hello, world!' });

    const filesAfter = await asyncGnfs.readdir('/');
    expect(filesAfter).toEqual(['file.txt']);

    const handle = await asyncGnfs.open('/file.txt', 'r+');
    const readContentBuffer = Buffer.alloc(13);
    const { bytesRead, buffer } = await handle.read(
      readContentBuffer,
      0,
      13,
      0
    );

    const bufferContent = buffer.toString('utf8', 0, bytesRead);
    expect(bufferContent).toEqual('Hello, world!');

    await handle.write(Buffer.from('Hello, mars!'), 0, 13, 0);

    const { bytesRead: bytesReadAfter, buffer: bufferAfter } =
      await handle.read(Buffer.alloc(13), 0, 13, 0);
    expect(bufferAfter.toString('utf8', 0, bytesReadAfter)).toEqual(
      'Hello, mars!!'
    );
  });

  it('truncate should workd', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/file.txt', { body: 'Hello, world!' });

    const handle = await asyncGnfs.open('/file.txt', 'r+');
    const readContentBuffer = Buffer.alloc(13);
    const { bytesRead, buffer } = await handle.read(
      readContentBuffer,
      0,
      13,
      0
    );

    const bufferContent = buffer.toString('utf8', 0, bytesRead);
    expect(bufferContent).toEqual('Hello, world!');

    await handle.truncate(3);

    const { bytesRead: bytesRead2, buffer: buffer2 } =
      await handle.read(readContentBuffer);

    expect(buffer2.toString('utf8', 0, bytesRead2)).toEqual('Hel');

    await handle.truncate(0);

    const { bytesRead: bytesRead3, buffer: buffer3 } =
      await handle.read(readContentBuffer);

    expect(buffer3.toString('utf8', 0, bytesRead3)).toEqual('');

    await handle.write(Buffer.from('Hello, mars!'));

    const { bytesRead: bytesReadAfter, buffer: bufferAfter } =
      await handle.read(Buffer.alloc(13), 0, 13, 0);
    expect(bufferAfter.toString('utf8', 0, bytesReadAfter)).toEqual(
      'Hello, mars!'
    );

    memoryStateProvider.put('/my_serve_folder/file.txt', {
      body: 'Hello, world!',
    });

    const fh = await asyncGnfs.open('/my_serve_folder/file.txt', 'r+');
    await fh.truncate(0);

    const stats = await fh.stat();
    expect(stats.size).toEqual(0);
  });

  it('should fail when stat an non existing file', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/path/to/file.txt', {
      body: 'Hello, world!',
    });

    const nonExisitingFileStats = await asyncGnfs
      .stat('/does_not_exist')
      .catch(e => false);
    expect(nonExisitingFileStats).toBe(false);
  });

  it('should read the root folder', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/path/to/file.txt', {
      body: 'Hello, world!',
    });

    const filesAfter = await asyncGnfs.readdir('/');
    expect(filesAfter).toEqual(['path']);

    const statsRoot = await asyncGnfs.stat('/');
    const isFolder = statsRoot.isDirectory()
    expect(isFolder).toBe(true);

    const filesAfterPath = await asyncGnfs.readdir('/path');
    expect(filesAfterPath).toEqual(['to']);

    const statsPath = await asyncGnfs.stat('/path');
    expect(statsPath.isDirectory()).toBe(true);

    const filesAfterPathTo = await asyncGnfs.readdir('/path/to');
    expect(filesAfterPathTo).toEqual(['file.txt']);
  });

  it('should allow to create a folder', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/path/to/file.txt', {
      body: 'Hello, world!',
    });

    const filesBefore = await asyncGnfs.readdir('/');
    expect(filesBefore).toEqual(['path']);

    await asyncGnfs.mkdir('/test');

    const filesAfter = await asyncGnfs.readdir('/');
    expect(filesAfter).toEqual(['path', 'test']);
  });

  it('should remove a directory with rmdir', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    await asyncGnfs.mkdir('/test');

    const filesBefore = await asyncGnfs.readdir('/');
    expect(filesBefore).toEqual(['test']);

    await asyncGnfs.rmdir('/test');

    const filesAfter = await asyncGnfs.readdir('/');
    expect(filesAfter).toEqual([]);
  });

  it('should remove a file with unlink', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/file.txt', {
      body: 'Hello, world!',
    });

    const filesBefore = await asyncGnfs.readdir('/');
    expect(filesBefore).toEqual(['file.txt']);

    await asyncGnfs.unlink('/file.txt');

    const filesAfter = await asyncGnfs.readdir('/');
    expect(filesAfter).toEqual([]);

    await expect(asyncGnfs.stat('/file.txt')).rejects.toThrow();
  });

  it('should rename/move a file', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/oldname.txt', {
      body: 'Hello, world!',
    });

    const filesBefore = await asyncGnfs.readdir('/');
    expect(filesBefore).toEqual(['oldname.txt']);

    await asyncGnfs.rename('/oldname.txt', '/newname.txt');

    const filesAfter = await asyncGnfs.readdir('/');
    expect(filesAfter).toEqual(['newname.txt']);

    const handle = await asyncGnfs.open('/newname.txt', 'r+');
    const { bytesRead, buffer } = await handle.read(Buffer.alloc(13), 0, 13, 0);
    expect(buffer.toString('utf8', 0, bytesRead)).toEqual('Hello, world!');
  });

  it('should rename/move a directory', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    await asyncGnfs.mkdir('/olddir');

    const filesBefore = await asyncGnfs.readdir('/');
    expect(filesBefore).toEqual(['olddir']);

    await asyncGnfs.rename('/olddir', '/newdir');

    const filesAfter = await asyncGnfs.readdir('/');
    expect(filesAfter).toEqual(['newdir']);
  });

  it.todo('should create a hard link with link', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/original.txt', {
      body: 'Hello, world!',
    });

    await asyncGnfs.link('/original.txt', '/link.txt');

    const files = await asyncGnfs.readdir('/');
    expect(files).toContain('link.txt');

    const handle = await asyncGnfs.open('/link.txt', 'r+');
    const { bytesRead, buffer } = await handle.read(Buffer.alloc(13), 0, 13, 0);
    expect(buffer.toString('utf8', 0, bytesRead)).toEqual('Hello, world!');
  });

  it.todo('should create a symbolic link with symlink', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/original.txt', {
      body: 'Hello, world!',
    });

    await asyncGnfs.symlink('/original.txt', '/symlink.txt');

    const files = await asyncGnfs.readdir('/');
    expect(files).toContain('symlink.txt');

    const linkTarget = await asyncGnfs.readlink('/symlink.txt');
    expect(linkTarget).toEqual('/original.txt');
  });

  it.todo('should read a symbolic link with readlink', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/original.txt', {
      body: 'Hello, world!',
    });

    await asyncGnfs.symlink('/original.txt', '/symlink.txt');

    const linkTarget = await asyncGnfs.readlink('/symlink.txt');
    expect(linkTarget).toEqual('/original.txt');
  });

  it.todo('should change file permissions with chmod', async () => {
    const asyncGnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    asyncGnfs.connect(memoryStateProvider);

    memoryStateProvider.put('/file.txt', {
      body: 'Hello, world!',
    });

    const statsBefore = await asyncGnfs.stat('/file.txt');
    expect(statsBefore.mode).toBeDefined();

    await asyncGnfs.chmod('/file.txt', 0o755);

    const statsAfter = await asyncGnfs.stat('/file.txt');
    expect(statsAfter.mode).toEqual(0o755);
  });
});
