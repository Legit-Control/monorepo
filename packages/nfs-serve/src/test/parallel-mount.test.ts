import { expect, it, inject } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

it('should work with two parallel mounts', async () => {
  const MOUNT_POINT = inject('mountpoint');
  fs.readdirSync(MOUNT_POINT);
  const testFile = path.join(MOUNT_POINT, 'test-file.txt');

  const testContent = 'Test content ' + Date.now();
  await fs.promises.writeFile(testFile, testContent);
  expect(await fs.promises.readFile(testFile, 'utf8')).toBe(testContent);
}, 90000); // Timeout after 90 seconds
