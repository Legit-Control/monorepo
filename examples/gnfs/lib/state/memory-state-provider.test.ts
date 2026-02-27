import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMemoryStateProvider } from './memory-state-provider';

describe('createMemoryStateProvider', () => {
  let provider: ReturnType<typeof createMemoryStateProvider>;
  let mockBus: any;

  beforeEach(() => {
    provider = createMemoryStateProvider();
    mockBus = {
      send: vi.fn(),
      connect: vi.fn(),
      request: vi.fn(),
      unsubscribe: vi.fn(),
    };

    provider.connectReceiver(mockBus);
  });

  describe('upsert', () => {
    it('should create a file at root level', () => {
      provider.upsert('/test.txt', { body: 'Hello World' });

      // Request the file to verify it was created
      provider.request('/test.txt', { type: 'body' }, false);

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/test.txt',
          body: 'Hello World',
          headers: { type: 'body' },
        },
      });
    });

    it('should create nested files with parent directories', () => {
      provider.upsert('/foo/bar/baz.txt', { body: 'Nested Content' });

      // Request the file to verify it was created
      provider.request('/foo/bar/baz.txt', { type: 'body' }, false);

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/foo/bar/baz.txt',
          body: 'Nested Content',
          headers: { type: 'body' },
        },
      });
    });

    it('should create an empty directory when body is undefined', () => {
      provider.upsert('/mydir', { body: undefined });

      // Request index to verify it's a directory
      provider.request('/mydir', { type: 'index' }, false);

      expect(mockBus.send).toHaveBeenCalledWith({
        update: { path: '/mydir', body: [], headers: { type: 'index' } },
      });
    });

    it('should update metadata when creating a file', () => {
      provider.upsert('/test.txt', { body: 'Content' });

      provider.request('/test.txt', { type: 'header' }, false);

      const call = mockBus.send.mock.calls.find(
        (c: any) => c[0]?.update?.headers?.type === 'header'
      );
      expect(call).toBeDefined();

      const meta = call[0].update.body;
      expect(meta.ctime).toBeInstanceOf(Date);
      expect(meta.mtime).toBeInstanceOf(Date);
      expect(meta.atime).toBeInstanceOf(Date);
      expect(meta.size).toBe(7);
    });

    it('should notify subscribers when a file is created', () => {
      provider.connectReceiver(mockBus);
      provider.request('/test.txt', { type: 'body' }, true);

      mockBus.send.mockClear();

      provider.upsert('/test.txt', { body: 'New Content' });

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/test.txt',
          body: 'New Content',
          headers: { type: 'body' },
        },
      });
    });

    it('should update existing file metadata', () => {
      provider.upsert('/test.txt', { body: 'Original' });

      const originalMeta = (() => {
        provider.request('/test.txt', { type: 'header' }, false);
        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'header'
        );
        return call[0].update.body;
      })();

      // Wait a bit to ensure time difference
      const startTime = originalMeta.mtime;

      provider.upsert('/test.txt', { body: 'Updated' });

      const updatedMeta = (() => {
        provider.request('/test.txt', { type: 'header' }, false);
        const call = mockBus.send.mock.calls.find(
          (c: any, i: number) =>
            c[0]?.update?.headers?.type === 'header' && i > 0
        );
        return call[0].update.body;
      })();

      expect(updatedMeta.mtime).not.toBe(startTime);
    });
  });

  describe('request', () => {
    beforeEach(() => {
      provider.upsert('/file.txt', { body: 'File Content' });
      provider.upsert('/dir', { body: undefined });
      provider.upsert('/dir/nested.txt', { body: 'Nested' });
    });

    describe('body requests', () => {
      it('should return file content for existing file', () => {
        provider.request('/file.txt', { type: 'body' }, false);

        expect(mockBus.send).toHaveBeenCalledWith({
          update: {
            path: '/file.txt',
            body: 'File Content',
            headers: { type: 'body' },
          },
        });
      });

      it('should return null for non-existent resource', () => {
        provider.request('/nonexistent.txt', { type: 'body' }, false);

        expect(mockBus.send).toHaveBeenCalledWith({
          update: {
            path: '/nonexistent.txt',
            body: null,
            headers: { type: 'body' },
          },
        });
      });

      it('should return undefined for directory', () => {
        provider.request('/dir', { type: 'body' }, false);

        expect(mockBus.send).toHaveBeenCalledWith({
          update: { path: '/dir', body: undefined, headers: { type: 'body' } },
        });
      });
    });

    describe('header requests', () => {
      it('should return metadata for existing file', () => {
        provider.request('/file.txt', { type: 'header' }, false);

        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'header'
        );
        expect(call).toBeDefined();

        const meta = call[0].update.body;
        expect(meta).toHaveProperty('ctime');
        expect(meta).toHaveProperty('mtime');
        expect(meta).toHaveProperty('atime');
        expect(meta).toHaveProperty('size');
        expect(meta.size).toBe(12);
      });

      it('should return null for non-existent file', () => {
        provider.request('/nonexistent.txt', { type: 'header' }, false);

        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'header'
        );
        expect(call[0].update.body).toBeNull();
      });
    });

    describe('index requests', () => {
      it('should return index for directory', () => {
        provider.request('/dir', { type: 'index' }, false);

        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'index'
        );
        expect(call).toBeDefined();

        const index = call[0].update.body;
        expect(index).toEqual([{ link: '/nested.txt' }]);
      });

      it('should return empty index for empty directory', () => {
        provider.request('/file.txt', { type: 'index' }, false);

        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'index'
        );
        expect(call[0].update.body).toBeUndefined();
      });

      it('should return null for non-existent directory', () => {
        provider.request('/nonexistent', { type: 'index' }, false);

        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'index'
        );
        expect(call[0].update.body).toBeNull();
      });
    });

    describe('subscriptions', () => {
      it('should add subscription when subscribe is true', () => {
        provider.request('/file.txt', { type: 'body' }, true);

        // Trigger an update
        mockBus.send.mockClear();
        provider.upsert('/file.txt', { body: 'Updated Content' });

        expect(mockBus.send).toHaveBeenCalledWith({
          update: {
            path: '/file.txt',
            body: 'Updated Content',
            headers: { type: 'body' },
          },
        });
      });

      it('should not send updates when not subscribed', () => {
        provider.request('/file.txt', { type: 'body' }, false);

        // Trigger an update
        mockBus.send.mockClear();
        provider.upsert('/file.txt', { body: 'Updated Content' });

        expect(mockBus.send).not.toHaveBeenCalled();
      });
    });
  });

  describe('unsubscribe', () => {
    it('should remove subscription', () => {
      // Subscribe first
      provider.request('/file.txt', { type: 'body' }, true);

      // Unsubscribe
      provider.unsubscribe('/file.txt', { type: 'body' });

      // Trigger an update
      mockBus.send.mockClear();
      provider.upsert('/file.txt', { body: 'Updated Content' });

      expect(mockBus.send).not.toHaveBeenCalled();
    });

    it('should handle independent subscriptions by type', () => {
      provider.upsert('/test.txt', { body: 'Content' });

      // Subscribe to body
      provider.request('/test.txt', { type: 'body' }, true);

      // Subscribe to header
      provider.request('/test.txt', { type: 'header' }, true);

      // Unsubscribe from body only
      provider.unsubscribe('/test.txt', { type: 'body' });

      mockBus.send.mockClear();

      // Trigger update
      provider.upsert('/test.txt', { body: 'Updated' });

      // Should only receive header update, not body
      const calls = mockBus.send.mock.calls;
      const bodyCalls = calls.filter(
        (c: any) => c[0]?.update?.headers?.type === 'body'
      );
      const headerCalls = calls.filter(
        (c: any) => c[0]?.update?.headers?.type === 'header'
      );

      expect(bodyCalls).toHaveLength(0);
      expect(headerCalls.length).toBeGreaterThan(0);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      provider.upsert('/file.txt', { body: 'Content' });
      provider.upsert('/dir', { body: undefined });
      provider.upsert('/dir/nested1.txt', { body: 'Nested 1' });
      provider.upsert('/dir/nested2.txt', { body: 'Nested 2' });
      provider.upsert('/dir/subdir', { body: undefined });
      provider.upsert('/dir/subdir/deep.txt', { body: 'Deep' });
    });

    it('should remove a file', () => {
      provider.remove('/file.txt');

      // Verify it's gone
      provider.request('/file.txt', { type: 'body' }, false);

      expect(mockBus.send).toHaveBeenCalledWith({
        update: { path: '/file.txt', body: null, headers: { type: 'body' } },
      });
    });

    it('should remove a directory recursively', () => {
      provider.remove('/dir');

      // Verify all nested files are gone
      provider.request('/dir/nested1.txt', { type: 'body' }, false);
      provider.request('/dir/nested2.txt', { type: 'body' }, false);
      provider.request('/dir/subdir/deep.txt', { type: 'body' }, false);

      const calls = mockBus.send.mock.calls.filter(
        (c: any) => c[0]?.update?.headers?.type === 'body'
      );

      // All should return null (not found)
      calls.forEach((call: any) => {
        expect(call[0].update.body).toBeNull();
      });
    });

    it('should notify subscribers on removal', () => {
      provider.connectReceiver(mockBus);
      provider.request('/file.txt', { type: 'body' }, true);

      mockBus.send.mockClear();

      provider.remove('/file.txt');

      expect(mockBus.send).toHaveBeenCalledWith({
        delete: { path: '/file.txt' },
      });
    });

    it('should handle non-existent path gracefully', () => {
      expect(() => {
        provider.remove('/nonexistent');
      }).not.toThrow();
    });

    it('should remove metadata', () => {
      provider.upsert('/test.txt', { body: 'Test' });
      provider.remove('/test.txt');

      provider.request('/test.txt', { type: 'header' }, false);

      const call = mockBus.send.mock.calls.find(
        (c: any) => c[0]?.update?.headers?.type === 'header'
      );
      expect(call[0].update.body).toBeNull();
    });
  });

  describe('send', () => {
    it('should handle body updates from connected bus', () => {
      const connectedBus = {
        send: vi.fn(),
        connect: vi.fn(),
        request: vi.fn(),
        unsubscribe: vi.fn(),
      };

      provider.connectReceiver(connectedBus);

      // Simulate receiving an update from the connected bus
      provider.send({
        update: {
          path: '/remote.txt',
          body: 'Remote Content',
          headers: { type: 'body' },
        },
      });

      // Verify the file was created
      provider.request('/remote.txt', { type: 'body' }, false);

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/remote.txt',
          body: 'Remote Content',
          headers: { type: 'body' },
        },
      });
    });

    it('should handle delete messages from connected bus', () => {
      provider.upsert('/test.txt', { body: 'Test' });

      const connectedBus = {
        send: vi.fn(),
        connect: vi.fn(),
        request: vi.fn(),
        unsubscribe: vi.fn(),
      };

      provider.connectReceiver(connectedBus);

      // Simulate receiving a delete from the connected bus
      provider.send({ delete: { path: '/test.txt' } });

      // Verify the file was deleted
      provider.request('/test.txt', { type: 'body' }, false);

      expect(mockBus.send).toHaveBeenCalledWith({
        update: { path: '/test.txt', body: null, headers: { type: 'body' } },
      });
    });
  });

  describe('nested paths', () => {
    it('should handle deeply nested paths', () => {
      provider.upsert('/a/b/c/d/e/file.txt', { body: 'Deep' });

      provider.request('/a/b/c/d/e/file.txt', { type: 'body' }, false);

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/a/b/c/d/e/file.txt',
          body: 'Deep',
          headers: { type: 'body' },
        },
      });
    });

    it('should create intermediate directories', () => {
      provider.upsert('/parent/child/file.txt', { body: 'Content' });

      // Verify intermediate directories were created
      provider.request('/parent', { type: 'index' }, false);
      provider.request('/parent/child', { type: 'index' }, false);

      const calls = mockBus.send.mock.calls.filter(
        (c: any) => c[0]?.update?.headers?.type === 'index'
      );

      expect(calls.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle removal of intermediate directories', () => {
      provider.upsert('/parent/child/file.txt', { body: 'Content' });
      provider.remove('/parent/child');

      provider.request('/parent/child', { type: 'body' }, false);

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/parent/child',
          body: null,
          headers: { type: 'body' },
        },
      });
    });
  });

  describe('initial state', () => {
    it('should initialize with provided state', () => {
      const providerWithState = createMemoryStateProvider({
        'initial.txt': 'Initial Content',
        dir: {},
        'dir/nested.txt': 'Nested',
      });

      providerWithState.connectReceiver(mockBus);

      providerWithState.request('/initial.txt', { type: 'body' }, false);
      providerWithState.request('/dir/nested.txt', { type: 'body' }, false);

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/initial.txt',
          body: 'Initial Content',
          headers: { type: 'body' },
        },
      });

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/dir/nested.txt',
          body: 'Nested',
          headers: { type: 'body' },
        },
      });
    });
  });
});
