import { expect, it, inject, describe, beforeAll, test } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Basic File Operations', () => {
  const MOUNT_POINT = inject('mountpoint');
  const SERVE_POINT = inject('servepoint');

  beforeAll(() => {
    console.error('Mount point:', MOUNT_POINT);
    fs.readdirSync(MOUNT_POINT);
  });

  describe('Server <-> Client synchronization', () => {
    it('a written file on the client should be reflected on the server´', async () => {
      const clientFilePath = path.join(MOUNT_POINT, 'empty-file.txt');
      const serverFilePath = path.join(SERVE_POINT, 'empty-file.txt');

      await fs.promises.writeFile(clientFilePath, '');

      const statsClient = await fs.promises.stat(clientFilePath);
      expect(statsClient.isFile()).toBe(true);
      expect(statsClient.size).toBe(0);

      const statsServer = await fs.promises.stat(serverFilePath);
      expect(statsServer.isFile()).toBe(true);
      expect(statsServer.size).toBe(0);

      await fs.promises.unlink(clientFilePath);
    });

    it('a written file on the client should be reflected on the server´', async () => {
      const clientFilePath = path.join(MOUNT_POINT, 'empty-file2.txt');
      const serverFilePath = path.join(SERVE_POINT, 'empty-file2.txt');

      await fs.promises.writeFile(serverFilePath, '');

      const statsServer = await fs.promises.stat(serverFilePath);
      expect(statsServer.isFile()).toBe(true);
      expect(statsServer.size).toBe(0);

      const statsClient = await fs.promises.stat(clientFilePath);
      expect(statsClient.isFile()).toBe(true);
      expect(statsClient.size).toBe(0);

      await fs.promises.unlink(serverFilePath);
    });

    it('Changes on the server should not lead to Events on the client', async () => {
      const fileName = 'server_file.txt';

      const serverFilePath = path.join(SERVE_POINT, fileName);

      // cleanup if needed
      await fs.promises.unlink(serverFilePath).catch(() => {});
      // get the unlink on tick to materialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Set up watchers on both the folder serving and the folder served via nfs

      const serverEvents: any[] = [];
      const serverWatcher = fs.watch(SERVE_POINT, (eventType, filename) => {
        serverEvents.push(`${eventType}`);
      });

      const clientEvents: any[] = [];
      const clientWatcher = fs.watch(MOUNT_POINT, (eventType, filename) => {
        clientEvents.push(`${eventType}`);
      });
      // Wait a bit for watchers to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        expect(clientEvents.length).toBe(0);
        expect(serverEvents.length).toBe(0);

        // Write the file on the mounted folder (client side)
        await fs.promises.writeFile(serverFilePath, 'Initial content');
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(serverEvents.length).toBe(1);
        expect(clientEvents.length).toBe(0);

        // Modify the file
        await fs.promises.writeFile(serverFilePath, 'Modified content');
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(serverEvents.length).toBe(2);
        expect(clientEvents.length).toBe(0);

        // Remove the file
        await fs.promises.unlink(serverFilePath);
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(serverEvents.length).toBe(3);
        expect(clientEvents.length).toBe(0);

        expect(serverEvents.length).toBeGreaterThan(0);
      } finally {
        // ensure the file is droped
        await fs.promises.unlink(serverFilePath).catch(() => {});
        // Always close watchers
        serverWatcher.close();
        clientWatcher.close();
      }
    });

    it('Emulating events should work', async () => {
      const fileName = 'server_file-1.txt';
      const clientFilePath = path.join(MOUNT_POINT, fileName);
      const serverFilePath = path.join(SERVE_POINT, fileName);

      // cleanup if needed
      await fs.promises.unlink(serverFilePath).catch(() => {});
      // get the unlink on tick to materialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Set up watchers on both the folder serving and the folder served via nfs
      const serverEvents: any[] = [];
      const serverWatcher = fs.watch(SERVE_POINT, (eventType, filename) => {
        serverEvents.push(`${eventType}`);
      });

      const clientEvents: any[] = [];
      const clientWatcher = fs.watch(MOUNT_POINT, (eventType, filename) => {
        clientEvents.push(`${eventType}`);
      });
      // Wait a bit for watchers to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        expect(clientEvents.length).toBe(0);
        expect(serverEvents.length).toBe(0);

        // Write the file on the mounted folder (client side)
        await fs.promises.writeFile(serverFilePath, 'Initial content');
        await new Promise(resolve => setTimeout(resolve, 100));

        // expect(mountPointEvents.length).toBeGreaterThan(0);
        expect(serverEvents.length).toBe(1);
        expect(clientEvents.length).toBe(0);

        const stat = await fs.promises.stat(clientFilePath);

        // change file on the client (ignored by the server) to trigger event
        fs.utimesSync(clientFilePath, 0, 0);
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(serverEvents.length).toBe(1);
        expect(clientEvents.length).toBe(1);

        // Modify the file
        await fs.promises.writeFile(serverFilePath, 'Modified content');
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(serverEvents.length).toBe(2);
        expect(clientEvents.length).toBe(1);

        // change utimes on the client to 0 - 0 (ignored by the server) Wait for events to propagate
        fs.utimesSync(clientFilePath, 0, 0);
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(serverEvents.length).toBe(2);
        expect(clientEvents.length).toBe(2);

        // Clean up
        await fs.promises.unlink(serverFilePath);
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(serverEvents.length).toBe(3);
        expect(clientEvents.length).toBe(2);

        try {
          fs.utimesSync(clientFilePath, 0, 0);
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch {}

        expect(serverEvents.length).toBe(3);
        expect(clientEvents.length).toBe(2);
      } finally {
        await fs.promises.unlink(clientFilePath).catch(() => {});
        // Always close watchers
        serverWatcher.close();
        clientWatcher.close();
      }
    });
  });
});
