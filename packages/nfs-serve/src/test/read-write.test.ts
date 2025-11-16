import { expect, it, inject } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

it('should work with two parallel mounts', async () => {
  const MOUNT_POINT = inject('mountpoint');
  const SERVE_POINT = inject('servepoint');
  console.error('Mount point:', MOUNT_POINT);
  fs.readdirSync(MOUNT_POINT);
  const testFileMounted = path.join(MOUNT_POINT, 'test-file.txt');
  const testFileServer = path.join(MOUNT_POINT, 'test-file.txt');

  const testContent = 'Test content ' + Date.now();
  await fs.promises.writeFile(testFileMounted, testContent);
  const mountedFileContent = await fs.promises.readFile(
    testFileMounted,
    'utf8'
  );
  const serverFileContent = await fs.promises.readFile(testFileServer, 'utf8');

  expect(mountedFileContent).toBe(testContent);
  expect(serverFileContent).toBe(testContent);
}, 90000); // Timeout after 90 seconds
