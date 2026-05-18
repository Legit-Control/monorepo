# NFS-Serve Event Propagation Specification

## Overview

`createAsyncNfsHandler` implements event propagation by:
1. Tracking paths accessed by the NFS client
2. Starting watchers on observed paths
3. Detecting filesystem events from the serving fs
4. Triggering side-channel operations on the mounted folder to simulate native filesystem events

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ NFS Client (e.g., macOS NFS mount)                          │
│  - Only receives updates via polling                        │
│  - Expects FSEvents for applications like Emacs             │
└────────────────────────┬────────────────────────────────────┘
                         │ NFS protocol
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ createAsyncNfsHandler                                       │
│  - Tracks observed paths (client accessed files)            │
│  - Watches serving fs for changes                           │
│  - Detects events → triggers side-channel                   │
└────────────────────────┬────────────────────────────────────┘
                         │ Side-channel operations
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Mounted Folder (real filesystem)                            │
│  - Receives utimes/unlink/create operations                 │
│  - Triggers native FSEvents                                 │
│  - NFS client sees events and updates cache                 │
└─────────────────────────────────────────────────────────────┘
```

## Configuration

### Add mountedFolderPath to createAsyncNfsHandler

```typescript
// In createAsyncNfsHandler.ts
export const createAsyncNfsHandler = (args: {
  fileHandleManager: ReturnType<typeof createFileHandleManager>;
  asyncFs: (typeof fs)['promises'] & ExtendedFsPromises;  // Must have watch()
  mountedFolderPath?: string;  // NEW: Path to mounted folder for side-channel
}): { ... }
```

If `mountedFolderPath` is not provided, event propagation is disabled (only tracking occurs).

## State Management

### Tracking Structures

```typescript
// In createAsyncNfsHandler
const observedPaths = new Set<string>();  // Paths the client has accessed
const activeWatchers = new Map<string, AsyncIterator<any>>();  // Active watchers

// Pending side-channel operations (to detect in handlers)
const toPropagateChange = new Set<string>();   // Waiting for setattr with magic date
const toPropagateDeletion = new Set<string>(); // Waiting for unlink
const toPropagateCreation = new Set<string>(); // Waiting for create

// Magic date for signaling (epoch zero)
const MAGIC_DATE = new Date(0);
```

## Phase 1: Track Observed Paths

### Entry Points for Tracking

Track paths when NFS client accesses them:

```typescript
// In createAsyncNfsHandler - add tracking to handlers

lookup: async (dirHandle, name) => {
  const dirPath = fileHandleManager.getPathFromHandle(dirHandle);
  const filePath = path.join(dirPath, name);

  // TODO event simulation: track observed path
  markPathAsObserved(filePath);
  markPathAsObserved(dirPath);  // Also track parent

  // ... existing lookup logic
},

getAttributes: async (handle) => {
  const filePath = fileHandleManager.getPathFromHandle(handle);

  // TODO event simulation: track observed path
  markPathAsObserved(filePath);

  // ... existing getAttributes logic
},

readdirplus: async (handle) => {
  const dirPath = fileHandleManager.getPathFromHandle(handle);

  // TODO event simulation: track observed path
  markPathAsObserved(dirPath);

  // ... existing readdirplus logic
  // Also track all entries returned in the directory
  const entries = await asyncFs.readdir(dirPath);
  entries.forEach(entry => {
    markPathAsObserved(path.join(dirPath, entry));
  });
},

read: async (handle, offset = 0n, count) => {
  const filePath = fileHandleManager.getPathFromHandle(handle);

  // TODO event simulation: track observed path
  markPathAsObserved(filePath);

  // ... existing read logic
},
```

### markPathAsObserved Helper

```typescript
// In createAsyncNfsHandler
const markPathAsObserved = (targetPath: string) => {
  const normalizedPath = normalizePath(targetPath);

  if (!observedPaths.has(normalizedPath)) {
    observedPaths.add(normalizedPath);
    console.log(`[Event] Now observing: ${normalizedPath}`);

    // Start watching this path
    startWatcher(normalizedPath);
  }
};

const normalizePath = (p: string): string => {
  return p.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
};
```

## Phase 2: Watch Serving Filesystem

### Start Watcher on Observed Paths

```typescript
// In createAsyncNfsHandler
const startWatcher = async (watchPath: string) => {
  if (!mountedFolderPath) {
    console.log(`[Event] No mount path, skipping watcher for: ${watchPath}`);
    return;
  }

  if (activeWatchers.has(watchPath)) {
    console.log(`[Event] Already watching: ${watchPath}`);
    return;  // Already watching
  }

  console.log(`[Event] Starting watcher for: ${watchPath}`);

  try {
    const watcher = asyncFs.watch(watchPath, { recursive: false });
    activeWatchers.set(watchPath, watcher);

    // Process events from watcher
    for await (const event of watcher) {
      console.log(`[Event] Detected ${event.eventType} on ${event.filename || watchPath}`);

      if (event.eventType === 'change') {
        await handleChangeEvent(watchPath);
      } else if (event.eventType === 'rename') {
        await handleRenameEvent(watchPath);
      }
    }
  } catch (err) {
    console.error(`[Event] Watcher error for ${watchPath}:`, err);
    activeWatchers.delete(watchPath);
  }
};
```

## Phase 3: Handle Events

### Change Event Handler

```typescript
// In createAsyncNfsHandler
const handleChangeEvent = async (filePath: string) => {
  // Only propagate if we're observing this path
  if (!observedPaths.has(filePath)) {
    console.log(`[Event] Ignoring change to unobserved: ${filePath}`);
    return;
  }

  if (!mountedFolderPath) {
    return;
  }

  console.log(`[Event] Propagating change for: ${filePath}`);

  // Add to pending set
  toPropagateChange.add(filePath);

  // Trigger side-channel: utimes with magic date on mounted folder
  const mountedPath = path.join(mountedFolderPath, filePath);

  try {
    await fs.promises.utimes(mountedPath, MAGIC_DATE, MAGIC_DATE);
    console.log(`[Event] Triggered magic utimes on: ${mountedPath}`);
  } catch (err) {
    console.error(`[Event] Failed to trigger utimes on ${mountedPath}:`, err);
    toPropagateChange.delete(filePath);
  }
};
```

### Rename Event Handler

```typescript
// In createAsyncNfsHandler
const handleRenameEvent = async (filePath: string) => {
  if (!mountedFolderPath) {
    return;
  }

  const mountedPath = path.join(mountedFolderPath, filePath);

  // Determine if this is a deletion or creation
  try {
    // Check if file exists on serving fs
    await asyncFs.stat(filePath);

    // File exists → this is a creation
    // Only propagate if parent directory is observed
    const parentPath = getParentPath(filePath);
    if (!observedPaths.has(parentPath)) {
      console.log(`[Event] Parent not observed, ignoring creation: ${filePath}`);
      return;
    }

    console.log(`[Event] Propagating creation for: ${filePath}`);
    toPropagateCreation.add(filePath);

    // Trigger side-channel: create the file (empty open)
    await fs.promises.open(mountedPath, 'r').then(fh => fh.close());
    console.log(`[Event] Triggered creation on: ${mountedPath}`);

  } catch (err) {
    // File doesn't exist → this is a deletion
    // Only propagate if the file itself was observed
    if (!observedPaths.has(filePath)) {
      console.log(`[Event] File not observed, ignoring deletion: ${filePath}`);
      return;
    }

    console.log(`[Event] Propagating deletion for: ${filePath}`);
    toPropagateDeletion.add(filePath);

    // Trigger side-channel: unlink the file
    await fs.promises.unlink(mountedPath);
    console.log(`[Event] Triggered deletion on: ${mountedPath}`);
  }
};

const getParentPath = (p: string): string => {
  const normalized = normalizePath(p);
  if (normalized === '/') {
    return '/';
  }
  const lastSlash = normalized.lastIndexOf('/');
  if (lastSlash === 0) {
    return '/';
  }
  return normalized.substring(0, lastSlash) || '/';
};
```

## Phase 4: Detect Magic Signals in NFS Handlers

### Modify setattr Handler

```typescript
// In createAsyncNfsHandler - setattr handler
setattr: async (handle, attributes, guardCtime) => {
  const nfsHandle = fileHandleManager.getHandle(handle);
  const filePath = fileHandleManager.getPathFromHandle(handle)!;

  // TODO event simulation: check for magic date (side-channel signal)
  if (
    attributes.atime?.getTime() === MAGIC_DATE.getTime() &&
    attributes.mtime?.getTime() === MAGIC_DATE.getTime()
  ) {
    // This is a side-channel signal, not a real setattr request
    if (toPropagateChange.has(filePath)) {
      console.log(`[Event] Detected magic date for change: ${filePath}`);

      toPropagateChange.delete(filePath);

      // Get current stats from serving fs
      const stats = await asyncFs.stat(filePath);

      // Return success without setting magic date
      return {
        status: nfsstat3.OK,
        stats: toStatWithFileId(stats, handle),
      };
    }

    // Not tracking this change, ignore magic date
    console.log(`[Event] Unexpected magic date, ignoring: ${filePath}`);
    const stats = await asyncFs.stat(filePath);
    return {
      status: nfsstat3.OK,
      stats: toStatWithFileId(stats, handle),
    };
  }

  // ... rest of existing setattr logic
},
```

### Modify create Handler

```typescript
// In createAsyncNfsHandler - create handler
create: async (parentHandle, name, mode, attributesOrVerifier) => {
  const dirPath = fileHandleManager.getPathFromHandle(parentHandle);
  const filePath = path.join(dirPath, name);

  // TODO event simulation: check for simulated creation
  if (toPropagateCreation.has(filePath)) {
    console.log(`[Event] Detected simulated creation: ${filePath}`);

    toPropagateCreation.delete(filePath);

    // Check if file exists on serving fs
    const exists = await fileExists(filePath);

    if (!exists) {
      // File doesn't exist on serving fs - this shouldn't happen
      console.error(`[Event] Simulated creation but file doesn't exist: ${filePath}`);
      return {
        status: nfsstat3.ERR_NOENT,
      };
    }

    // Get file stats from serving fs
    const fileStats = await asyncFs.stat(filePath);
    const dirStats = await asyncFs.stat(dirPath);
    const fileHandle = fileHandleManager.getFileHandle(parentHandle, name, true);

    // Return success without actually creating
    return {
      status: nfsstat3.OK,
      handle: fileHandle.nfsHandle,
      stats: toStatWithFileId(fileStats as any, fileHandle.nfsHandle),
      dirStats: toStatWithFileId(dirStats, parentHandle),
    };
  }

  // ... rest of existing create logic
},
```

### Modify remove Handler

```typescript
// In createAsyncNfsHandler - remove handler
remove: async (dirHandle, name) => {
  const dirPath = fileHandleManager.getPathFromHandle(dirHandle);
  const filePath = path.join(dirPath, name);

  // TODO event simulation: check for simulated deletion
  if (toPropagateDeletion.has(filePath)) {
    console.log(`[Event] Detected simulated deletion: ${filePath}`);

    toPropagateDeletion.delete(filePath);

    // Get directory stats
    const dirStatsAfter = await asyncFs.stat(dirPath);

    // Return success without actually deleting
    return {
      status: nfsstat3.OK,
      dirStatsBeforeChange: toStatWithFileId(dirStats, dirHandle),
      dirStatsAfterChange: toStatWithFileId(dirStatsAfter, dirHandle),
    };
  }

  // ... rest of existing remove logic
},
```

## Complete Data Flow Example

### Scenario: Server modifies a file that client has open

```
1. Client opens /my_serve_folder/file.txt
   → NFS calls lookup() on file.txt
   → markPathAsObserved('/my_serve_folder/file.txt')
   → startWatcher('/my_serve_folder/file.txt')

2. Server modifies file.txt (via memory-backed-state.put())
   → gnfs receives update via send()
   → Watcher for file.txt emits { eventType: 'change' }
   → handleChangeEvent() called

3. handleChangeEvent()
   → toPropagateChange.add('/my_serve_folder/file.txt')
   → fs.utimes('/mounted/path/my_serve_folder/file.txt', MAGIC_DATE, MAGIC_DATE)

4. NFS client sees mtime change on mounted folder
   → NFS client calls setattr() to update attributes
   → setattr handler detects MAGIC_DATE
   → toPropagateChange.delete('/my_serve_folder/file.txt')
   → Returns current stats from serving fs
   → NFS client updates cache with new content

5. Application (e.g., Emacs) receives FSEvent
   → File reloads automatically ✨
```

## Extended FS Interface Type

```typescript
// In createAsyncNfsHandler.ts or shared types
interface ExtendedFsPromises extends fs.promises {
  watch(
    filename: string,
    options?: { persistent?: boolean; recursive?: boolean; encoding?: BufferEncoding }
  ): AsyncIterable<{
    eventType: 'rename' | 'change';
    filename?: string;
  }>;
}
```

## Error Handling

### Watcher Failures

```typescript
// If watcher fails, log and restart after delay
const startWatcherWithRetry = async (watchPath: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await startWatcher(watchPath);
      return;
    } catch (err) {
      console.error(`[Event] Watcher failed (attempt ${i + 1}):`, err);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  console.error(`[Event] Failed to start watcher after ${retries} attempts: ${watchPath}`);
};
```

### Side-Channel Failures

If side-channel operation fails (utimes/unlink/create):
1. Log the error
2. Remove from pending set
3. Don't retry (NFS client will poll eventually anyway)

## Testing Strategy

### Unit Tests

```typescript
describe('Event Propagation', () => {
  describe('Path Tracking', () => {
    it('should track path when client looks up file', async () => {
      const handler = createAsyncNfsHandler({
        fileHandleManager: createMockFileHandleManager(),
        asyncFs: createMockFs(),
        mountedFolderPath: '/tmp/mount',
      });

      await handler.lookup(rootHandle, 'test.txt');

      expect(handler.observedPaths.has('/test.txt')).toBe(true);
    });

    it('should start watcher when path is observed', async () => {
      let watchCalled = false;
      const mockFs = createMockFs({
        watch: async function*() {
          watchCalled = true;
          // Never yield
          await new Promise(() => {});
        }
      });

      const handler = createAsyncNfsHandler({
        fileHandleManager: createMockFileHandleManager(),
        asyncFs: mockFs,
        mountedFolderPath: '/tmp/mount',
      });

      await handler.lookup(rootHandle, 'test.txt');
      await sleep(100);

      expect(watchCalled).toBe(true);
    });
  });

  describe('Change Event', () => {
    it('should trigger utimes when watched file changes', async () => {
      const realFs = require('fs').promises;
      const utimesSpy = vi.spyOn(realFs, 'utimes');

      let triggerChange: (() => void) | null = null;
      const mockFs = createMockFs({
        watch: async function*() {
          yield { eventType: 'change' };
        },
        stat: vi.fn().mockResolvedValue({ mtime: new Date(), size: 100 }),
      });

      const handler = createAsyncNfsHandler({
        fileHandleManager: createMockFileHandleManager(),
        asyncFs: mockFs,
        mountedFolderPath: '/tmp/mount',
      });

      await handler.lookup(rootHandle, 'test.txt');
      await sleep(200);

      expect(utimesSpy).toHaveBeenCalledWith(
        '/tmp/mount/test.txt',
        new Date(0),
        new Date(0)
      );
    });

    it('should detect magic date in setattr and return real stats', async () => {
      const mockFs = createMockFs({
        stat: vi.fn().mockResolvedValue({
          mtime: new Date('2024-01-01'),
          size: 100,
        }),
      });

      const handler = createAsyncNfsHandler({
        fileHandleManager: createMockFileHandleManager(),
        asyncFs: mockFs,
        mountedFolderPath: '/tmp/mount',
      });

      // Add to propagate set
      handler.toPropagateChange.add('/test.txt');

      // Call setattr with magic date
      const result = await handler.setattr(
        testHandle,
        { atime: new Date(0), mtime: new Date(0) },
        null
      );

      expect(result.status).toBe(nfsstat3.OK);
      expect(result.stats.mtime).toEqual(new Date('2024-01-01'));
      expect(handler.toPropagateChange.has('/test.txt')).toBe(false);
    });
  });

  describe('Rename Event', () => {
    it('should trigger unlink for file deletion', async () => {
      const realFs = require('fs').promises;
      const unlinkSpy = vi.spyOn(realFs, 'unlink');

      const mockFs = createMockFs({
        watch: async function*() {
          yield { eventType: 'rename' };
        },
        stat: vi.fn().mockRejectedValue(new Error('ENOENT')),  // File doesn't exist
      });

      const handler = createAsyncNfsHandler({
        fileHandleManager: createMockFileHandleManager(),
        asyncFs: mockFs,
        mountedFolderPath: '/tmp/mount',
      });

      await handler.lookup(rootHandle, 'test.txt');  // Mark as observed
      await sleep(200);

      expect(unlinkSpy).toHaveBeenCalledWith('/tmp/mount/test.txt');
    });

    it('should trigger open for file creation', async () => {
      const realFs = require('fs').promises;
      const openSpy = vi.spyOn(realFs, 'open').mockImplementation(
        async () => ({ close: async () => {} } as any)
      );

      const mockFs = createMockFs({
        watch: async function*() {
          yield { eventType: 'rename' };
        },
        stat: vi.fn().mockResolvedValue({ mtime: new Date(), size: 0 }),  // File exists
      });

      const handler = createAsyncNfsHandler({
        fileHandleManager: createMockFileHandleManager(),
        asyncFs: mockFs,
        mountedFolderPath: '/tmp/mount',
      });

      await handler.lookup(rootHandle, '/');  // Mark parent as observed
      await sleep(200);

      expect(openSpy).toHaveBeenCalledWith('/tmp/mount/test.txt', 'r');
    });
  });
});
```

### Integration Tests

```typescript
describe('Event Propagation Integration', () => {
  it('should propagate changes from serving fs to mounted folder', async () => {
    // This requires a real mounted folder
    const mountPath = '/tmp/test-mount';

    const gnfs = new Gnfs();
    const state = createMemoryBackedState();
    gnfs.connect(state);

    const handler = createAsyncNfsHandler({
      fileHandleManager: createFileHandleManager('/serve', 0),
      asyncFs: gnfs as any,
      mountedFolderPath: mountPath,
    });

    // Client accesses file
    await handler.lookup(rootHandle, 'file.txt');

    // Server changes file
    state.put('/file.txt', { type: 'file', body: 'new content' });

    // Wait for propagation
    await sleep(500);

    // Check that utimes was called with magic date
    const stats = await fs.promises.stat(path.join(mountPath, 'file.txt'));
    expect(stats.mtime.getTime()).toBe(0);
  });
});
```

## Limitations and Future Work

### Known Limitations

1. **No watcher cleanup**: Once a path is observed, we watch it forever
   - **Solution**: Add ref counting and cleanup after idle timeout

2. **No recursive watching**: Each path must be watched individually
   - **Rationale**: Prevents unintended materialization and performance issues

3. **Side-channel requires mounted folder**: Events only work if mountedFolderPath is provided
   - **Alternative**: Could use direct FSEvents API in the future

4. **Race conditions**: If server changes file while side-channel is in flight
   - **Mitigation**: The pending sets (toPropagateChange, etc.) help serialize operations

### Future Enhancements

1. **Watcher lifecycle management**
   - Add ref counting for each path
   - Stop watcher after N seconds of no access
   - Expose `unwatch()` method

2. **Event batching**
   - Batch multiple changes to reduce side-channel calls
   - Coalesce rapid changes to same file

3. **Alternative to side-channel**
   - Use direct FSEvents API on macOS
   - Use inotify on Linux
   - Would eliminate need for mounted folder manipulation

## Summary

The NFS-serve event propagation implementation:

1. ✅ Tracks paths accessed by NFS client
2. ✅ Watches serving filesystem for changes
3. ✅ Detects change and rename events
4. ✅ Triggers side-channel operations (utimes/unlink/create)
5. ✅ Detects magic signals in NFS handlers
6. ✅ Returns real data without performing actual operations
7. ✅ Enables applications to receive FSEvents for NFS-mounted files

This completes the event simulation system described in nfs-fsevents.md.
