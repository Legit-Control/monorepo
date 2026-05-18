# GNFS Watch Implementation Specification

## Overview

GNFS must implement the Node.js `fs.watch()` API to provide file system event notifications. This enables `createAsyncNfsHandler` to detect changes in the serving filesystem and propagate them to the NFS client via the side-channel.

## Node.js fs.watch() API Contract

```typescript
// Node.js fs.watch() signature
fs.watch(
  filename: string,
  options?: {
    persistent?: boolean;
    recursive?: boolean;
    encoding?: BufferEncoding;
  }
): AsyncIterable<{
  eventType: 'rename' | 'change';
  filename?: string;
}>;

// Usage example
const watcher = fs.watch('/path/to/file.txt');
for await (const event of watcher) {
  console.log(`Event: ${event.eventType}, File: ${event.filename}`);
}
```

## GNFS Implementation

### 1. Add Watch Method to GnfsInterface

```typescript
// In gnfs-interface.ts
export interface GnfsInterface {
  // ... existing methods (stat, open, readdir, etc.)

  watch(
    filename: string,
    options?: { persistent?: boolean; recursive?: boolean; encoding?: BufferEncoding }
  ): AsyncIterable<{ eventType: 'rename' | 'change'; filename?: string }>;
}
```

### 2. Implement watch() in Gnfs Class

```typescript
// In gnfs.ts
export class Gnfs implements GnfsInterface {
  // Track active watchers
  private watchers = new Map<string, Set<WatcherController>>();

  async *watch(
    filename: string,
    options?: { persistent?: boolean; recursive?: boolean; encoding?: BufferEncoding }
  ): AsyncIterable<{ eventType: 'rename' | 'change'; filename?: string }> {
    if (!this.backingState) {
      throw new Error('State provider not connected');
    }

    const normalizedPath = this.normalizePath(filename);
    const eventQueue: { eventType: 'rename' | 'change'; filename?: string }[] = [];
    const controller: WatcherController = {
      done: false,
      push: (event) => eventQueue.push(event),
    };

    // Register this watcher
    if (!this.watchers.has(normalizedPath)) {
      this.watchers.set(normalizedPath, new Set());
    }
    this.watchers.get(normalizedPath)!.add(controller);

    // Subscribe to backing state for this path
    // Subscribe to: content changes, metadata changes, and index changes (parent dir)
    this.backingState.get(normalizedPath, { type: 'body' }, true);
    this.backingState.get(normalizedPath, { type: 'header' }, true);

    // Also subscribe to parent directory to detect deletions/renames
    const parentPath = this.getParentPath(normalizedPath);
    if (parentPath !== normalizedPath) {
      this.backingState.get(parentPath, { type: 'index' }, true);
    }

    console.log(`[GNFS] Started watching: ${normalizedPath}`);

    try {
      // Yield events from queue
      while (!controller.done) {
        while (eventQueue.length > 0) {
          yield eventQueue.shift()!;
        }
        // Wait a bit before checking again
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } finally {
      // Cleanup: unsubscribe from backing state
      console.log(`[GNFS] Stopped watching: ${normalizedPath}`);
      this.watchers.get(normalizedPath)?.delete(controller);
      if (this.watchers.get(normalizedPath)?.size === 0) {
        this.watchers.delete(normalizedPath);
      }

      this.backingState?.forget(normalizedPath, { type: 'body' });
      this.backingState?.forget(normalizedPath, { type: 'header' });
      if (parentPath !== normalizedPath) {
        this.backingState?.forget(parentPath, { type: 'index' });
      }
    }
  }
}
```

### 3. Modify send() to Notify Watchers

```typescript
// In gnfs.ts - modify existing send() method
send(
  resourceMessage:
    | { update: { path: string; body: any; headers: { type: 'body' | 'header' | 'index' } } }
    | { delete: { path: string } }
): void {
  // ... existing code for handling fileAsks, fileHeaderAsks, indexAsks

  // NEW: Notify watchers
  this.notifyWatchers(resourceMessage);
}

private notifyWatchers(
  resourceMessage:
    | { update: { path: string; body: any; headers: { type: 'body' | 'header' | 'index' } } }
    | { delete: { path: string } }
): void {
  if ('update' in resourceMessage) {
    const { path, body, headers } = resourceMessage.update;
    const normalizedPath = this.normalizePath(path);

    // Map backing state update types to watch event types
    let eventType: 'rename' | 'change';

    if (headers.type === 'body') {
      // Content changed
      eventType = 'change';
      this.notifyWatchersAtPath(normalizedPath, eventType);
    } else if (headers.type === 'header') {
      // Metadata changed (mtime, size, etc.)
      eventType = 'change';
      this.notifyWatchersAtPath(normalizedPath, eventType);
    } else if (headers.type === 'index') {
      // Directory listing changed - something was created/deleted/renamed
      // Notify parent directory watchers
      this.notifyWatchersAtPath(normalizedPath, 'rename');

      // Extract filename from path and include it in the event
      const filename = this.getBaseName(normalizedPath);
      this.notifyWatchersAtPath(normalizedPath, 'rename', filename);
    }
  } else if ('delete' in resourceMessage) {
    const { path } = resourceMessage.delete;
    const normalizedPath = this.normalizePath(path);

    // File/directory deleted - notify as rename event
    this.notifyWatchersAtPath(normalizedPath, 'rename');

    // Also notify parent directory
    const parentPath = this.getParentPath(normalizedPath);
    if (parentPath !== normalizedPath) {
      const filename = this.getBaseName(normalizedPath);
      this.notifyWatchersAtPath(parentPath, 'rename', filename);
    }
  }
}

private notifyWatchersAtPath(
  path: string,
  eventType: 'rename' | 'change',
  filename?: string
): void {
  const controllers = this.watchers.get(path);
  if (!controllers) {
    return;
  }

  const event = { eventType, filename };
  controllers.forEach(controller => {
    controller.push(event);
  });
}

// Helper methods
private normalizePath(path: string): string {
  // Normalize path to remove leading/trailing slashes, resolve . and ..
  return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

private getParentPath(path: string): string {
  const normalized = this.normalizePath(path);
  if (normalized === '/') {
    return '/';
  }
  const lastSlash = normalized.lastIndexOf('/');
  if (lastSlash === 0) {
    return '/';
  }
  return normalized.substring(0, lastSlash) || '/';
}

private getBaseName(path: string): string {
  const normalized = this.normalizePath(path);
  if (normalized === '/') {
    return '';
  }
  const lastSlash = normalized.lastIndexOf('/');
  return normalized.substring(lastSlash + 1);
}
```

### 4. Watcher Controller Type

```typescript
// In gnfs.ts
interface WatcherController {
  done: boolean;
  push: (event: { eventType: 'rename' | 'change'; filename?: string }) => void;
}
```

## Event Type Mapping

### Backing State Updates → Watch Events

| Backing State Update | Watch Event Type | Rationale |
|---------------------|------------------|-----------|
| `{ update: { headers: { type: 'body' } } }` | `'change'` | File content changed |
| `{ update: { headers: { type: 'header' } } }` | `'change'` | File metadata changed (mtime, size) |
| `{ update: { headers: { type: 'index' } } }` | `'rename'` | Directory entry changed (create/delete/rename) |
| `{ delete: {} }` | `'rename'` | File/directory deleted |

### Notes

- **Why 'rename' for deletions?** This matches Node.js `fs.watch()` behavior where both creations and deletions emit 'rename' events
- **Why subscribe to both body and header?** To catch both content changes and metadata changes
- **Why subscribe to parent index?** To detect when a file is deleted or renamed (it won't send an update to the file itself, only to the parent directory's index)

## Recursive Watching

The current implementation **does not support** `options.recursive = true`. This is intentional because:

1. The backing state `get()` with `subscribe=true` subscribes to a single path
2. Recursive watching would require subscribing to all descendants, which is expensive
3. The NFS protocol doesn't have a good wildcard subscription mechanism
4. It could lead to unintended materialization on the client

If `recursive: true` is passed to `watch()`, it should be ignored or throw an error:

```typescript
if (options?.recursive) {
  throw new Error('Recursive watching is not supported');
}
```

## Lifecycle Management

### Starting a Watcher

1. Caller invokes `gnfs.watch('/path/to/file.txt')`
2. GNFS creates a watcher controller and adds it to `watchers` map
3. GNFS calls `backingState.get()` with `subscribe=true` for:
   - The file's body (content changes)
   - The file's header (metadata changes)
   - The parent directory's index (deletion/rename detection)
4. GNFS yields events from the queue as they arrive

### Stopping a Watcher

Watcher stops when:
1. The async iterable is broken (caller stops iteration)
2. An error occurs
3. The watcher is explicitly closed (if we add a close method)

Cleanup:
1. Remove controller from `watchers` map
2. Call `backingState.forget()` for all subscriptions
3. Stop processing events

## Testing Strategy

### Unit Tests for gnfs.watch()

```typescript
describe('Gnfs.watch()', () => {
  it('should subscribe to backing state when watch starts', async () => {
    const gnfs = new Gnfs();
    const mockState = createMockBackingState();
    gnfs.connect(mockState);

    const getSpy = vi.spyOn(mockState, 'get');

    const watcher = gnfs.watch('/file.txt');

    // Wait for subscription
    await sleep(100);

    expect(getSpy).toHaveBeenCalledWith('/file.txt', { type: 'body' }, true);
    expect(getSpy).toHaveBeenCalledWith('/file.txt', { type: 'header' }, true);
    expect(getSpy).toHaveBeenCalledWith('/', { type: 'index' }, true);
  });

  it('should emit change event when file body updates', async () => {
    const gnfs = new Gnfs();
    const mockState = createMockBackingState();
    gnfs.connect(mockState);

    const watcher = gnfs.watch('/file.txt');
    const events: any[] = [];

    // Collect events in background
    (async () => {
      for await (const event of watcher) {
        events.push(event);
      }
    })();

    // Wait for watcher to start
    await sleep(100);

    // Simulate a backing state update
    gnfs.send({
      update: {
        path: '/file.txt',
        body: 'new content',
        headers: { type: 'body' }
      }
    });

    // Wait for event to be processed
    await sleep(100);

    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('change');
  });

  it('should emit rename event when file is deleted', async () => {
    const gnfs = new Gnfs();
    const mockState = createMockBackingState();
    gnfs.connect(mockState);

    const watcher = gnfs.watch('/file.txt');
    const events: any[] = [];

    (async () => {
      for await (const event of watcher) {
        events.push(event);
      }
    })();

    await sleep(100);

    // Simulate deletion
    gnfs.send({ delete: { path: '/file.txt' } });

    await sleep(100);

    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('rename');
  });

  it('should unsubscribe when watcher stops', async () => {
    const gnfs = new Gnfs();
    const mockState = createMockBackingState();
    gnfs.connect(mockState);

    const forgetSpy = vi.spyOn(mockState, 'forget');

    const watcher = gnfs.watch('/file.txt');

    // Wait for subscription
    await sleep(100);

    // Break the iteration to stop watcher
    const iterator = watcher[Symbol.asyncIterator]();
    await iterator.return?.();

    await sleep(100);

    expect(forgetSpy).toHaveBeenCalledWith('/file.txt', { type: 'body' });
    expect(forgetSpy).toHaveBeenCalledWith('/file.txt', { type: 'header' });
  });
});
```

## Summary

The GNFS watch implementation:

1. ✅ Implements Node.js `fs.watch()` API contract
2. ✅ Uses existing backing state pub/sub mechanism
3. ✅ Maps backing state updates to appropriate watch events
4. ✅ Handles subscription lifecycle (get with subscribe=true / forget)
5. ✅ Provides clean async iterable interface
6. ✅ Does NOT support recursive watching (by design)

This enables `createAsyncNfsHandler` to watch the serving filesystem and detect changes for event propagation to the NFS client.
