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

function decodeFlags(flags: number) {
  const map: Record<number, string> = {
    0x100: 'ItemCreated',
    0x200: 'ItemRemoved',
    0x400: 'ItemInodeMetaMod',
    0x800: 'ItemRenamed',
    0x1000: 'ItemModified',
    0x2000: 'ItemFinderInfoMod',
    0x4000: 'ItemChangeOwner',
    0x8000: 'ItemXattrMod',
    0x10000: 'ItemIsFile',
    0x20000: 'ItemIsDir',
    0x40000: 'ItemIsSymlink',
  };

  return Object.entries(map)
    .filter(([bit]) => flags & Number(bit))
    .map(([, name]) => name);
}

describe('GNFS.watch()', () => {
  it('test delete events fsevents - without waiting', async () => {
    const tempDir = fs.mkdtempSync('gnfs-watch-test-');
    const filePath = `${tempDir}/file.txt`;

    const fseventsEventsFolder: fse.FSEvent[] = [];
    // Create fsevents watcher for the directory
    const stopper = fse.watch(tempDir, (path, type, info) => {
      console.log('fsevents event:', { path, type, info });
      fseventsEventsFolder.push({
        path,
        type,
        info: info + 'E',
        flags: decodeFlags(type).join(','),
      });
    });

    // creating the file
    fs.writeFileSync(filePath, 'initial content');

    const fseventsEventsFile: fse.FSEvent[] = [];
    // Create fsevents watcher for the directory
    const stopper2 = fse.watch(filePath, (path, type, info) => {
      console.log('fsevents event:', { path, type, info });
      fseventsEventsFile.push({
        path,
        type,
        info: info + 'E',
        flags: decodeFlags(type).join(','),
      });
    });

    fs.unlinkSync(filePath);

    console.log('  fsevents events:', fseventsEventsFolder);

    // creating the file
    fs.writeFileSync(filePath, 'initial content');

    fs.unlinkSync(filePath);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('  fsevents events:', fseventsEventsFolder);
  });

  it('test delete events in fsevents with timed breaks between fs operaitons', async () => {
    const tempDir = fs.mkdtempSync('gnfs-watch-test-');
    const filePath = `${tempDir}/file.txt`;

    // Let the fs event queue settle - it might take a second to deliver the event from mkdtempSync
    await new Promise(resolve => setTimeout(resolve, 5000));

    const fseventsEventsFolder: Array<{
      path: string;
      type: number;
      info: any;
      flags: string[];
    }> = [];
    // Create fsevents watcher for the directory
    const stopper = fse.watch(tempDir, (path, type, info) => {
      console.log('fsevents folder event:', {
        path,
        type,
        info,
        flags: decodeFlags(type),
      });
      fseventsEventsFolder.push({
        path,
        type,
        info,
        flags: decodeFlags(type),
      });
    });

    // creating the file
    fs.writeFileSync(filePath, 'initial content');

    const fseventsEventsFile: Array<{
      path: string;
      type: number;
      info: any;
      flags: string[];
    }> = [];
    // Create fsevents watcher for the file
    const stopper2 = fse.watch(filePath, (path, type, info) => {
      console.log('fsevents file event:', {
        path,
        type,
        info,
        flags: decodeFlags(type),
      });
      fseventsEventsFile.push({
        path,
        type,
        info,
        flags: decodeFlags(type),
      });
    });

    // Wait for the fsevent queue to have fired the event for writeFileSync
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n=== UNLINKING FILE (first time) ===');
    fs.unlinkSync(filePath);
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\nResults after first unlink:');
    console.log('  Folder fsevents:', fseventsEventsFolder.length, 'events');
    fseventsEventsFolder.forEach((e, i) => {
      console.log(
        `    ${i}: path="${e.path}", flags=${e.flags.join('+')}, info=${e.info}`
      );
    });
    console.log('  File fsevents:', fseventsEventsFile.length, 'events');
    fseventsEventsFile.forEach((e, i) => {
      console.log(
        `    ${i}: path="${e.path}", flags=${e.flags.join('+')}, info=${e.info}`
      );
    });

    console.log('\n=== CREATING FILE (second time) ===');
    // creating the file
    fs.writeFileSync(filePath, 'initial content');

    // Wait for the fsevent queue to have fired the event for writeFileSync
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n=== UNLINKING FILE (second time) ===');
    fs.unlinkSync(filePath);
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\nResults after second unlink:');
    console.log('  Folder fsevents:', fseventsEventsFolder.length, 'events');
    fseventsEventsFolder.forEach((e, i) => {
      console.log(
        `    ${i}: path="${e.path}", flags=${e.flags.join('+')}, info=${e.info}`
      );
    });
    console.log('  File fsevents:', fseventsEventsFile.length, 'events');
    fseventsEventsFile.forEach((e, i) => {
      console.log(
        `    ${i}: path="${e.path}", flags=${e.flags.join('+')}, info=${e.info}`
      );
    });

    // Analyze the info parameter
    console.log('\n=== ANALYSIS ===');
    console.log(
      'The "info" parameter is NOT a monotonically increasing counter!'
    );
    console.log('Observations:');
    console.log(
      '1. Most events share the same info ID (e.g., 7162257463037438000)'
    );
    console.log('2. Some events have info: 0 (with empty flags)');
    console.log(
      '3. The same info ID is reused across multiple different events'
    );
    console.log(
      '\nThe info parameter appears to be a "batch ID" or "sync ID":'
    );
    console.log('- Groups of related filesystem events share the same ID');
    console.log('- It represents a sync point from the FSEvents system');
    console.log('- NOT suitable for tracking individual event ordering');
    console.log('- Use callback invocation order for sequencing instead');
    console.log('\nThis is a macOS FSEvents API implementation detail,');
    console.log('likely related to how FSEvents batches filesystem changes.');

    stopper();
    stopper2();
  });

  it('test delete events in node fs and fsevents', async () => {
    const tempDir = fs.mkdtempSync('gnfs-watch-test-');
    const filePath = `${tempDir}/file.txt`;

    // Let the fs event queue settle - it might take a second to deliver the event from mkdtempSync
    await new Promise(resolve => setTimeout(resolve, 5000));

    const events: any[] = [];
    const folderEvents: any[] = [];
    const fseventsEvents: fse.FSEvent[] = [];

    const ac = new AbortController();
    const { signal } = ac;
    const folderWatcher = fs.promises.watch(tempDir, { signal });

    // using a promise to collect events from the fs folder watcher
    (async () => {
      try {
        for await (const event of folderWatcher) {
          folderEvents.push(event);

          // Stop after receiving one event
        }
      } catch (err) {
        // AbortError is expected when we abort
        if ((err as Error).name !== 'AbortError') {
          throw err;
        }
      }
    })();

    // Create fsevents watcher for the directory
    const stopper = fse.watch(tempDir, (path, type, info) => {
      console.log('fsevents event:', { path, type, info });
      fseventsEvents.push({ path, type, info, flags: decodeFlags(type) });
    });

    // creating the file
    fs.writeFileSync(filePath, 'initial content');

    // Wait for the fsevent queue to have fired the event for writeFileSync
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Use AbortController for cleanup
    const fileWatcher = fs.promises.watch(filePath, { signal });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Properly await the event collection
    (async () => {
      try {
        for await (const event of fileWatcher) {
          events.push(event);

          // Stop after receiving one event
        }
      } catch (err) {
        // AbortError is expected when we abort
        if ((err as Error).name !== 'AbortError') {
          throw err;
        }
      }
    })();

    console.log('Before modification:');
    console.log('  fs.promises.watch file events:', events.length);
    console.log('  fs.promises.watch folder events:', folderEvents.length);
    console.log('  fsevents events:', fseventsEvents.length);
    console.log('  fsevents details:', fseventsEvents);

    expect(events.length).toBeGreaterThanOrEqual(0);
    expect(folderEvents.length).toBeGreaterThanOrEqual(0);
    expect(fseventsEvents.length).toBeGreaterThanOrEqual(0);

    fs.unlinkSync(filePath);
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Before modification:');
    console.log('  fs.promises.watch file events:', events.length);
    console.log('  fs.promises.watch folder events:', folderEvents.length);
    console.log('  fsevents events:', fseventsEvents.length);
    console.log('  fsevents details:', fseventsEvents);

    expect(events.length).toBeGreaterThanOrEqual(0);
    expect(folderEvents.length).toBeGreaterThanOrEqual(0);
    expect(fseventsEvents.length).toBeGreaterThanOrEqual(0);
  });

  it('test normal fs behavior', async () => {
    const tempDir = fs.mkdtempSync('gnfs-watch-test-');
    const filePath = `${tempDir}/file.txt`;

    // Wait for the fsevent queue to have fired the event for mkdtempSync
    await new Promise(resolve => setTimeout(resolve, 1000));

    const events: any[] = [];
    const folderEvents: any[] = [];
    const fseventsEvents: fse.FSEvent[] = [];

    const ac = new AbortController();
    const { signal } = ac;
    const folderWatcher = fs.promises.watch(tempDir, { signal });

    // Create fsevents watcher for the directory
    const stopper = fse.watch(tempDir, (path, type, info) => {
      console.log('fsevents event:', { path, type, info });
      fseventsEvents.push({ path, type, info, flags: decodeFlags(type) });
    });

    // creating the file
    fs.writeFileSync(filePath, 'initial content');

    // Wait for the fsevent queue to have fired the event for writeFileSync
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Use AbortController for cleanup
    const fileWatcher = fs.promises.watch(filePath, { signal });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Properly await the event collection
    (async () => {
      try {
        for await (const event of fileWatcher) {
          events.push(event);

          // Stop after receiving one event
        }
      } catch (err) {
        // AbortError is expected when we abort
        if ((err as Error).name !== 'AbortError') {
          throw err;
        }
      }
    })();

    // Properly await the event collection
    (async () => {
      try {
        for await (const event of folderWatcher) {
          folderEvents.push(event);

          // Stop after receiving one event
        }
      } catch (err) {
        // AbortError is expected when we abort
        if ((err as Error).name !== 'AbortError') {
          throw err;
        }
      }
    })();

    // Modify the file
    fs.writeFileSync(filePath, 'updated content');

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('After first modification:');
    console.log('  fs.promises.watch file events:', events.length);
    console.log('  fs.promises.watch folder events:', folderEvents.length);
    console.log('  fsevents events:', fseventsEvents.length);
    console.log('  fsevents details:', fseventsEvents);

    expect(events.length).toBeGreaterThanOrEqual(1);
    expect(events[0].eventType).toBe('change');

    // remove the file a second time
    fs.unlinkSync(filePath);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('After unlink:');
    console.log('  fs.promises.watch file events:', events.length);
    console.log('  fsevents events:', fseventsEvents.length);

    // Modify the file a second time
    fs.writeFileSync(filePath, 'updated content2');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('After second modification:');
    console.log('  fs.promises.watch file events:', events.length);
    console.log('  fsevents events:', fseventsEvents.length);

    // ac.abort();

    // Wait for the event to be processed
    // await eventPromise;

    expect(events.length).toBeGreaterThanOrEqual(1);
    expect(events[0].eventType).toBe('change');
    // Note: filename might not be present on all platforms
    if (events[0].filename) {
      expect(events[0].filename).toBe('file.txt');
    }
    ac.abort();
    stopper(); // Stop fsevents watcher

    fs.rmSync(tempDir, { recursive: true });
  });
});
