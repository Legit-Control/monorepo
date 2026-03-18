import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMemoryBackedState } from './memory-backed-state.js';

describe('createMemoryBackedState', () => {
  let provider: ReturnType<typeof createMemoryBackedState>;
  let mockBus: any;

  beforeEach(() => {
    provider = createMemoryBackedState();
    mockBus = {
      peerId: 'test-peer',
      send: vi.fn(),
      connect: vi.fn(),
      get: vi.fn(),
      forget: vi.fn(),
    };

    provider.connectReceiver(mockBus);
  });

  describe('put', () => {
    it('should create a file at root level', () => {
      provider.put(
        '/test.txt',
        { type: 'file', body: 'Hello World' },
        'test-peer'
      );

      // Request the file to verify it was created
      provider.get('/test.txt', { type: 'body' }, false, 'test-peer');

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/test.txt',
          body: 'Hello World',
          headers: { type: 'body' },
        },
      });
    });

    it('should create nested files with parent directories', () => {
      provider.put(
        '/foo/bar/baz.txt',
        { type: 'file', body: 'Nested Content' },
        'test-peer'
      );

      // Request the file to verify it was created
      provider.get('/foo/bar/baz.txt', { type: 'body' }, false, 'test-peer');

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/foo/bar/baz.txt',
          body: 'Nested Content',
          headers: { type: 'body' },
        },
      });
    });

    it('should create a directory when type is index', () => {
      provider.put('/mydir', { type: 'index' }, 'test-peer');

      // Request index to verify it's a directory
      provider.get('/mydir', { type: 'index' }, false, 'test-peer');

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/mydir',
          body: [],
          headers: { type: 'index' },
        },
      });
    });

    it('should update metadata when creating a file', () => {
      provider.put('/test.txt', { type: 'file', body: 'Content' }, 'test-peer');

      provider.get('/test.txt', { type: 'header' }, false, 'test-peer');

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
      provider.get('/test.txt', { type: 'body' }, true, 'test-peer');

      mockBus.send.mockClear();

      provider.put(
        '/test.txt',
        { type: 'file', body: 'New Content' },
        'another-peer'
      );

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/test.txt',
          body: 'New Content',
          headers: { type: 'body' },
        },
      });
    });

    it('should update existing file metadata', () => {
      provider.put(
        '/test.txt',
        { type: 'file', body: 'Original' },
        'test-peer'
      );

      const originalMeta = (() => {
        provider.get('/test.txt', { type: 'header' }, false, 'test-peer');
        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'header'
        );
        return call[0].update.body;
      })();

      // Wait a bit to ensure time difference
      const startTime = originalMeta.mtime;

      provider.put('/test.txt', { type: 'file', body: 'Updated' }, 'test-peer');

      const updatedMeta = (() => {
        provider.get('/test.txt', { type: 'header' }, false, 'test-peer');
        const call = mockBus.send.mock.calls.find(
          (c: any, i: number) =>
            c[0]?.update?.headers?.type === 'header' && i > 0
        );
        return call[0].update.body;
      })();

      expect(updatedMeta.mtime).not.toBe(startTime);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      provider.put(
        '/file.txt',
        { type: 'file', body: 'File Content' },
        'test-peer'
      );
      provider.put('/dir', { type: 'index' }, 'test-peer');
      provider.put(
        '/dir/nested.txt',
        { type: 'file', body: 'Nested' },
        'test-peer'
      );
    });

    describe('body requests', () => {
      it('should return file content for existing file', () => {
        provider.get('/file.txt', { type: 'body' }, false, 'test-peer');

        expect(mockBus.send).toHaveBeenCalledWith({
          update: {
            path: '/file.txt',
            body: 'File Content',
            headers: { type: 'body' },
          },
        });
      });

      it('should return null for non-existent resource', () => {
        provider.get('/nonexistent.txt', { type: 'body' }, false, 'test-peer');

        expect(mockBus.send).toHaveBeenCalledWith({
          update: {
            path: '/nonexistent.txt',
            body: null,
            headers: { type: 'body' },
          },
        });
      });

      it('should return undefined for directory', () => {
        provider.get('/dir', { type: 'body' }, false, 'test-peer');

        expect(mockBus.send).toHaveBeenCalledWith({
          update: {
            path: '/dir',
            body: undefined,
            headers: { type: 'body' },
          },
        });
      });
    });

    describe('header requests', () => {
      it('should return metadata for existing file', () => {
        provider.get('/file.txt', { type: 'header' }, false, 'test-peer');

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
        provider.get(
          '/nonexistent.txt',
          { type: 'header' },
          false,
          'test-peer'
        );

        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'header'
        );
        expect(call[0].update.body).toBeNull();
      });
    });

    describe('index requests', () => {
      it('should return index for directory', () => {
        provider.get('/dir', { type: 'index' }, false, 'test-peer');

        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'index'
        );
        expect(call).toBeDefined();

        const index = call[0].update.body;
        expect(index).toEqual([{ link: 'nested.txt' }]);
      });

      it('should return empty index for empty directory', () => {
        provider.get('/file.txt', { type: 'index' }, false, 'test-peer');

        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'index'
        );
        expect(call[0].update.body).toBeUndefined();
      });

      it('should return null for non-existent directory', () => {
        provider.get('/nonexistent', { type: 'index' }, false, 'test-peer');

        const call = mockBus.send.mock.calls.find(
          (c: any) => c[0]?.update?.headers?.type === 'index'
        );
        expect(call[0].update.body).toBeNull();
      });
    });

    describe('subscriptions', () => {
      it('should add subscription when subscribe is true', () => {
        provider.get('/file.txt', { type: 'body' }, true, 'test-peer');

        // Trigger an update
        mockBus.send.mockClear();
        provider.put(
          '/file.txt',
          { type: 'file', body: 'Updated Content' },
          'another-peer'
        );

        expect(mockBus.send).toHaveBeenCalledWith({
          update: {
            path: '/file.txt',
            body: 'Updated Content',
            headers: { type: 'body' },
          },
        });

        mockBus.send.mockClear();

        provider.put(
          '/file.txt',
          { type: 'file', body: 'Updated Content' },
          'test-peer-2'
        );

        expect(mockBus.send).toHaveBeenCalledWith({
          update: {
            path: '/file.txt',
            body: 'Updated Content',
            headers: { type: 'body' },
          },
        });
      });

      it('should not send updates when not subscribed', () => {
        provider.get('/file.txt', { type: 'body' }, false, 'test-peer');

        // Trigger an update
        mockBus.send.mockClear();
        provider.put(
          '/file.txt',
          { type: 'file', body: 'Updated Content' },
          'test-peer'
        );

        expect(mockBus.send).not.toHaveBeenCalled();
      });
    });
  });

  describe('forget', () => {
    it('should remove subscription', () => {
      // Subscribe first
      provider.get('/file.txt', { type: 'body' }, true, 'test-peer');

      // Unsubscribe
      provider.forget('/file.txt', { type: 'body' }, 'test-peer');

      // Trigger an update
      mockBus.send.mockClear();
      provider.put(
        '/file.txt',
        { type: 'file', body: 'Updated Content' },
        'test-peer'
      );

      expect(mockBus.send).not.toHaveBeenCalled();
    });

    it('should handle independent subscriptions by type', () => {
      // initially create the file
      provider.put('/test.txt', { type: 'file', body: 'Content' }, 'another-peer');

      // Subscribe to body
      provider.get('/test.txt', { type: 'body' }, true, 'test-peer');

      // Subscribe to header
      provider.get('/test.txt', { type: 'header' }, true, 'test-peer');

      // Unsubscribe from body only
      provider.forget('/test.txt', { type: 'body' }, 'test-peer');

      mockBus.send.mockClear();

      // Trigger update
      provider.put('/test.txt', { type: 'file', body: 'Updated' }, 'another-peer');

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

  describe('del', () => {
    beforeEach(() => {
      provider.put('/file.txt', { type: 'file', body: 'Content' }, 'test-peer');
      provider.put('/dir', { type: 'index' }, 'test-peer');
      provider.put(
        '/dir/nested1.txt',
        { type: 'file', body: 'Nested 1' },
        'test-peer'
      );
      provider.put(
        '/dir/nested2.txt',
        { type: 'file', body: 'Nested 2' },
        'test-peer'
      );
      provider.put('/dir/subdir', { type: 'index' }, 'test-peer');
      provider.put(
        '/dir/subdir/deep.txt',
        { type: 'file', body: 'Deep' },
        'test-peer'
      );
    });

    it('should delete a file', () => {
      provider.del('/file.txt', 'test-peer');

      // Verify it's gone
      provider.get('/file.txt', { type: 'body' }, false, 'test-peer');

      
      // And get should return null
      const getCalls = mockBus.send.mock.calls.filter(
        (c: any) =>
          c[0]?.update?.path === '/file.txt' && c[0]?.update?.body === null
      );
      expect(getCalls.length).toBeGreaterThan(0);
    });

    it('should remove a directory recursively', () => {
      provider.del('/dir', 'test-peer');

      // Verify all nested files are gone
      provider.get('/dir/nested1.txt', { type: 'body' }, false, 'test-peer');
      provider.get('/dir/nested2.txt', { type: 'body' }, false, 'test-peer');
      provider.get(
        '/dir/subdir/deep.txt',
        { type: 'body' },
        false,
        'test-peer'
      );

      const calls = mockBus.send.mock.calls.filter(
        (c: any) => c[0]?.update?.headers?.type === 'body'
      );

      // All should return null (not found)
      calls.forEach((call: any) => {
        expect(call[0].update.body).toBeNull();
      });
    });

    it('should notify subscribers on deletion', () => {
      provider.connectReceiver(mockBus);
      provider.get('/file.txt', { type: 'body' }, true, 'test-peer');

      mockBus.send.mockClear();

      provider.del('/file.txt', 'another-peer');

      expect(mockBus.send).toHaveBeenCalledWith({
        "update": {
          "body": null,
          "headers": {
            "type": "body",
          },
          "path": "/file.txt",
        },
      });
    });

    it('should handle non-existent path gracefully', () => {
      expect(() => {
        provider.del('/nonexistent', 'test-peer');
      }).not.toThrow();

      expect(
        mockBus.send.mock.calls.length,
        'a del call on a non-existent path should not trigger a send'
      ).toBe(0);
    });

    it('should remove metadata', () => {
      provider.put('/test.txt', { type: 'file', body: 'Test' }, 'test-peer');
      provider.del('/test.txt', 'test-peer');

      provider.get('/test.txt', { type: 'header' }, false, 'test-peer');

      const call = mockBus.send.mock.calls.find(
        (c: any) => c[0]?.update?.headers?.type === 'header'
      );
      expect(call[0].update.body).toBeNull();
    });
  });

  describe('nested paths', () => {
    it('should handle deeply nested paths', () => {
      provider.put(
        '/a/b/c/d/e/file.txt',
        { type: 'file', body: 'Deep' },
        'test-peer'
      );

      provider.get('/a/b/c/d/e/file.txt', { type: 'body' }, false, 'test-peer');

      expect(mockBus.send).toHaveBeenCalledWith({
        update: {
          path: '/a/b/c/d/e/file.txt',
          body: 'Deep',
          headers: { type: 'body' },
        },
      });
    });

    it('should create intermediate directories', () => {
      provider.put(
        '/parent/child/file.txt',
        { type: 'file', body: 'Content' },
        'test-peer'
      );

      // Verify intermediate directories were created
      provider.get('/parent', { type: 'index' }, false, 'test-peer');
      provider.get('/parent/child', { type: 'index' }, false, 'test-peer');

      const calls = mockBus.send.mock.calls.filter(
        (c: any) => c[0]?.update?.headers?.type === 'index'
      );

      expect(calls.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle deletion of intermediate directories', () => {
      provider.put(
        '/parent/child/file.txt',
        { type: 'file', body: 'Content' },
        'test-peer'
      );
      provider.del('/parent/child', 'test-peer');

      provider.get('/parent/child', { type: 'body' }, false, 'test-peer');

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
      const providerWithState = createMemoryBackedState({
        type: 'index',
        meta: {
          ctime: new Date(),
          mtime: new Date(),
          atime: new Date(),
          fileId: 0,
        },
        entries: {
          'initial.txt': {
            type: 'file',
            meta: {
              ctime: new Date(),
              mtime: new Date(),
              atime: new Date(),
              fileId: 1,
            },
            content: 'Initial Content',
          },
        },
      });

      providerWithState.connectReceiver(mockBus);

      providerWithState.get(
        '/initial.txt',
        { type: 'body' },
        false,
        'test-peer'
      );
      providerWithState.get(
        '/dir/nested.txt',
        { type: 'body' },
        false,
        'test-peer'
      );

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
          body: null,
          headers: { type: 'body' },
        },
      });
    });
  });
});
