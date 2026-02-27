import { describe, it, expect } from 'vitest';
import { AsyncGnfs } from './async-gnfs';
import { createMemoryStateProvider } from '../state/memory-state-provider';

describe('Async GNFS', () => {
  it('should read the root folder', async () => {
    const asyncGnfs = new AsyncGnfs();
    const memoryStateProvider = createMemoryStateProvider();

    asyncGnfs.connect(memoryStateProvider);

    const files = await asyncGnfs.readdir('/');

    expect(files).toEqual([]);

    await memoryStateProvider.put('/file.txt', { body: 'Hello, world!' });

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
    const asyncGnfs = new AsyncGnfs();
    const memoryStateProvider = createMemoryStateProvider();

    asyncGnfs.connect(memoryStateProvider);

    await memoryStateProvider.put('/file.txt', { body: 'Hello, world!' });

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
  });

  it('should fail when stat an non existing file', async () => {
    const asyncGnfs = new AsyncGnfs();
    const memoryStateProvider = createMemoryStateProvider();

    asyncGnfs.connect(memoryStateProvider);

    await memoryStateProvider.put('/path/to/file.txt', {
      body: 'Hello, world!',
    });

    const nonExisitingFileStats = await asyncGnfs
      .stat('/does_not_exist')
      .catch(e => false);
    expect(nonExisitingFileStats).toBe(false);
  });

  it('should read the root folder', async () => {
    const asyncGnfs = new AsyncGnfs();
    const memoryStateProvider = createMemoryStateProvider();

    asyncGnfs.connect(memoryStateProvider);

    await memoryStateProvider.put('/path/to/file.txt', {
      body: 'Hello, world!',
    });

    const filesAfter = await asyncGnfs.readdir('/');
    expect(filesAfter).toEqual(['path']);

    const statsRoot = await asyncGnfs.stat('/');
    expect(statsRoot.isDirectory()).toBe(true);

    const filesAfterPath = await asyncGnfs.readdir('/path');
    expect(filesAfterPath).toEqual(['to']);

    const statsPath = await asyncGnfs.stat('/path');
    expect(statsPath.isDirectory()).toBe(true);

    const filesAfterPathTo = await asyncGnfs.readdir('/path/to');
    expect(filesAfterPathTo).toEqual(['file.txt']);
  });
});
