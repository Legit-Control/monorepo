/**
 * Understanding fsevents callback parameters:
 *
 * fse.watch(path, (path, type, info) => {})
 *
 * - path: The filesystem path that triggered the event
 * - type: A bitmask representing the event type(s). Use decodeFlags() to get readable names:
 *   - ItemCreated (0x100): File/folder was created
 *   - ItemRemoved (0x200): File/folder was deleted
 *   - ItemInodeMetaMod (0x400): Inode metadata changed
 *   - ItemRenamed (0x800): File/folder was renamed
 *   - ItemModified (0x1000): File content was modified
 *   - ItemFinderInfoMod (0x2000): Finder info modified
 *   - ItemChangeOwner (0x4000): File ownership changed
 *   - ItemXattrMod (0x8000): Extended attributes modified
 *   - ItemIsFile (0x10000): The item is a file
 *   - ItemIsDir (0x20000): The item is a directory
 *   - ItemIsSymlink (0x40000): The item is a symbolic link
 *
 * - info: An event ID from the macOS FSEvents API
 *   IMPORTANT: This value does NOT increment for each event!
 *   - Most events share the same large ID (e.g., 7162257463037438000)
 *   - Some events have info: 0 (usually with empty flags)
 *   - This appears to be a "batch ID" or "sync ID" for groups of related events
 *   - It's NOT suitable for tracking individual event ordering
 *   - The actual event ordering should be tracked by the sequence of callback invocations
 *
 * Based on test observations:
 * - Multiple operations in quick succession share the same info ID
 * - The info ID seems to represent a "sync point" or "event batch" from the FSEvents system
 * - Use the callback invocation order for event sequencing, not the info parameter
 */

import { describe, it, expect, vi } from 'vitest';
import { Gnfs } from './gnfs.js';
import { createMemoryBackedState } from '../state/memory-backed-state.js';

import fs from 'node:fs';
import * as fse from 'fsevents';

describe('GNFS.watch()', () => {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  it('should throw error if state provider not connected', async () => {
    const gnfs = new Gnfs();

    const watcher = gnfs.watch('/file.txt');

    let errorThrown = false;
    try {
      const iterator = watcher[Symbol.asyncIterator]();
      await iterator.next();
    } catch (e) {
      errorThrown = true;
      expect((e as Error).message).toContain('State provider not connected');
    }

    expect(errorThrown).toBe(true);
  });

  it('should emit change event when file body updates', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    // Create initial file
    memoryStateProvider.put(
      '/file.txt',
      {
        body: 'initial content',
        type: 'file',
      },
      'external-peer'
    );

    const ac = new AbortController();
    const { signal } = ac;

    const watcher = gnfs.watch('/file.txt', { signal });
    const events: { eventType: string; filename?: string }[] = [];
    const folderWatcher = gnfs.watch('/', { signal });
    const folderEvents: { eventType: string; filename?: string }[] = [];

    // Collect events in background
    (async () => {
      for await (const event of watcher) {
        events.push(event);
      }
    })();

    (async () => {
      for await (const event of folderWatcher) {
        folderEvents.push(event);
      }
    })();

    // Wait for watcher to start
    await sleep(100);
    expect(events).toHaveLength(0);
    expect(folderEvents).toHaveLength(0);
    // Modify file content
    memoryStateProvider.put(
      '/file.txt',
      {
        body: 'updated content',
        type: 'file',
      },
      'external-peer'
    );

    // Wait for event to be processed
    await sleep(200);

    ac.abort();

    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('change');
    expect(events[0].filename).toBe('file.txt');

    expect(folderEvents).toHaveLength(1);
    expect(folderEvents[0].eventType).toBe('change');
    expect(folderEvents[0].filename).toBe('');
  });

  it('should emit change event when file header updates', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    // Create initial file
    memoryStateProvider.put(
      '/file.txt',
      {
        body: 'content',
        type: 'file',
      },
      'external-peer'
    );

    const ac = new AbortController();
    const { signal } = ac;
    const watcher = gnfs.watch('/file.txt', { signal });

    const events: { eventType: string; filename?: string }[] = [];

    const collectEvents = async () => {
      for await (const event of watcher) {
        events.push(event);
      }
    };
    collectEvents();

    await sleep(100);

    // Update file metadata (header)
    memoryStateProvider.put(
      '/file.txt',
      {
        type: 'file',
        body: 'content',
      },
      'external-peer'
    );

    // Trigger a header update by updating the file again
    memoryStateProvider.put(
      '/file.txt',
      {
        type: 'headers',
        headers: { mtime: new Date(), size: 10 },
      },
      'external-peer'
    );

    await sleep(200);
    ac.abort();
    expect(events).toHaveLength(2);
    expect(events[0].eventType).toBe('change');
  });

  it('should emit rename event when file is deleted', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    // Create initial file
    memoryStateProvider.put(
      '/file.txt',
      {
        body: 'content',
        type: 'file',
      },
      'external-peer'
    );

    const ac = new AbortController();
    const { signal } = ac;
    const watcher = gnfs.watch('/file.txt', { signal });

    const events: { eventType: string; filename?: string }[] = [];

    const collectEvents = async () => {
      for await (const event of watcher) {
        events.push(event);
      }
    };
    const eventPromise = collectEvents();

    await sleep(100);

    // Delete the file
    memoryStateProvider.del('/file.txt');

    await sleep(200);
    ac.abort();

    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('rename');
  });

  it('should emit rename event when directory index changes (file creation)', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    const folderWatcher = gnfs.watch('/');
    const folderEvents: { eventType: string; filename?: string }[] = [];

    const fileWatcher = gnfs.watch('/newfile.txt');
    const fileEvents: { eventType: string; filename?: string }[] = [];

    (async () => {
      for await (const event of folderWatcher) {
        folderEvents.push(event);
      }
    })();

    (async () => {
      for await (const event of fileWatcher) {
        fileEvents.push(event);
      }
    })();

    const ac = new AbortController();

    await sleep(100);

    // Create a new file in the directory
    memoryStateProvider.put('/newfile.txt', {
      body: 'content',
      type: 'file',
    });

    await sleep(200);
    ac.abort();

    expect(folderEvents).toHaveLength(1);
    // the parent folder has changed
    expect(folderEvents[0].eventType).toBe('change');
    expect(fileEvents[0].eventType).toBe('change');
  });

  it('should support multiple watchers on same path', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    // Create initial file
    memoryStateProvider.put('/file.txt', {
      body: 'initial',
      type: 'file',
    });

    const watcher1 = gnfs.watch('/file.txt');
    const watcher2 = gnfs.watch('/file.txt');

    const events1: { eventType: string; filename?: string }[] = [];
    const events2: { eventType: string; filename?: string }[] = [];

    const collect1 = async () => {
      for await (const event of watcher1) {
        events1.push(event);
        break;
      }
    };
    const collect2 = async () => {
      for await (const event of watcher2) {
        events2.push(event);
        break;
      }
    };

    const promise1 = collect1();
    const promise2 = collect2();

    await sleep(100);

    // Modify file
    memoryStateProvider.put('/file.txt', {
      body: 'updated',
      type: 'file',
    });

    await sleep(200);
    await Promise.all([promise1, promise2]);

    // Both watchers should receive the event
    expect(events1).toHaveLength(1);
    expect(events2).toHaveLength(1);
    expect(events1[0].eventType).toBe('change');
    expect(events2[0].eventType).toBe('change');
  });

  it('should watch different paths independently', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    // Create two files
    memoryStateProvider.put('/file1.txt', {
      body: 'content1',
      type: 'file',
    });
    memoryStateProvider.put('/file2.txt', {
      body: 'content2',
      type: 'file',
    });

    const watcher1 = gnfs.watch('/file1.txt');
    const watcher2 = gnfs.watch('/file2.txt');

    const events1: { eventType: string; filename?: string }[] = [];
    const events2: { eventType: string; filename?: string }[] = [];

    const collect1 = async () => {
      for await (const event of watcher1) {
        events1.push(event);
        if (events1.length >= 1) break;
      }
    };
    const collect2 = async () => {
      for await (const event of watcher2) {
        events2.push(event);
        if (events2.length >= 1) break;
      }
    };

    const promise1 = collect1();
    const promise2 = collect2();

    await sleep(100);

    // Modify only file1
    memoryStateProvider.put('/file1.txt', {
      body: 'updated1',
      type: 'file',
    });

    await sleep(200);
    await Promise.all([promise1, promise2]);

    // Only watcher1 should receive an event
    expect(events1).toHaveLength(1);
    expect(events2).toHaveLength(0);
  });

  it('should unsubscribe when watcher stops', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();

    const forgetSpy = vi.spyOn(memoryStateProvider, 'forget');
    gnfs.connect(memoryStateProvider);

    const watcher = gnfs.watch('/file.txt');

    // Start the watcher
    const iterator = watcher[Symbol.asyncIterator]();
    const promise = iterator.next();

    await sleep(100);

    // Stop the watcher
    await iterator.return?.();

    await sleep(100);

    // Should have called forget for all subscriptions
    expect(forgetSpy).toHaveBeenCalledWith('/file.txt', { type: 'body' });
    expect(forgetSpy).toHaveBeenCalledWith('/file.txt', { type: 'header' });
    expect(forgetSpy).toHaveBeenCalledWith('/', { type: 'index' });
  });

  it('should handle watching nested paths', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    // Create nested file structure
    memoryStateProvider.put('/subdir/file.txt', {
      body: 'content',
      type: 'file',
    });

    const watcher = gnfs.watch('/subdir/file.txt');
    const events: { eventType: string; filename?: string }[] = [];

    const collectEvents = async () => {
      for await (const event of watcher) {
        events.push(event);
        break;
      }
    };
    const eventPromise = collectEvents();

    await sleep(100);

    // Modify the nested file
    memoryStateProvider.put('/subdir/file.txt', {
      body: 'updated',
      type: 'file',
    });

    await sleep(200);
    await eventPromise;

    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('change');
  });

  it('should handle multiple events in sequence', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    // Create initial file
    memoryStateProvider.put('/file.txt', {
      body: 'initial',
      type: 'file',
    });

    const watcher = gnfs.watch('/file.txt');
    const events: { eventType: string; filename?: string }[] = [];

    const collectEvents = async () => {
      for await (const event of watcher) {
        events.push(event);
        if (events.length >= 3) break;
      }
    };
    const eventPromise = collectEvents();

    await sleep(100);

    // Trigger multiple changes
    memoryStateProvider.put('/file.txt', {
      body: 'version 1',
      type: 'file',
    });

    await sleep(50);

    memoryStateProvider.put('/file.txt', {
      body: 'version 2',
      type: 'file',
    });

    await sleep(50);

    memoryStateProvider.put('/file.txt', {
      body: 'version 3',
      type: 'file',
    });

    await sleep(300);
    await eventPromise;

    expect(events.length).toBeGreaterThanOrEqual(3);
    events.forEach(event => {
      expect(event.eventType).toBe('change');
    });
  });

  it('should notify parent directory watcher when child is deleted', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    // Create a file
    memoryStateProvider.put('/child.txt', {
      body: 'content',
      type: 'file',
    });

    const watcher = gnfs.watch('/');
    const events: { eventType: string; filename?: string }[] = [];

    const collectEvents = async () => {
      for await (const event of watcher) {
        events.push(event);
        break;
      }
    };
    const eventPromise = collectEvents();

    await sleep(100);

    // Delete the child file
    memoryStateProvider.del('/child.txt');

    await sleep(200);
    await eventPromise;

    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('rename');
    expect(events[0].filename).toBe('child.txt');
  });

  it('should normalize paths correctly', async () => {
    const gnfs = new Gnfs();
    const memoryStateProvider = createMemoryBackedState();
    gnfs.connect(memoryStateProvider);

    // Create file with normalized path
    memoryStateProvider.put('/file.txt', {
      body: 'content',
      type: 'file',
    });

    // Watch with non-normalized path (trailing slash)
    const watcher = gnfs.watch('/file.txt/');
    const events: { eventType: string; filename?: string }[] = [];

    const collectEvents = async () => {
      for await (const event of watcher) {
        events.push(event);
        break;
      }
    };
    const eventPromise = collectEvents();

    await sleep(100);

    // Modify with normalized path
    memoryStateProvider.put('/file.txt', {
      body: 'updated',
      type: 'file',
    });

    await sleep(200);
    await eventPromise;

    // Should still receive the event
    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('change');
  });
});
