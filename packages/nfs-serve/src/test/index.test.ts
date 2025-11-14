import { expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const MOUNT_POINT = path.join(PROJECT_ROOT, 'testdata', 'testmount');

it('should successfully mount NFS share', async () => {
  try {
    await new Promise(resolve => process.nextTick(resolve));

    const dir = fs.opendirSync(MOUNT_POINT);
    dir.closeSync(); // close old handle
    const newDir = fs.opendirSync(MOUNT_POINT); // reopen after mount
    fs.readdirSync(MOUNT_POINT);

    // Attempt the mount

    // Check if mount was successful

    // Create a test file to verify write access
    const testFile = path.join(MOUNT_POINT, 'test-file.txt');
    const testContent = 'Test content ' + Date.now();
    const stat = await fs.promises.stat(MOUNT_POINT);
    const rootDirContent = await fs.promises.readdir(
      '/Users/martinlysk/legit/monorepo-private/packages/nfs-serve',
      {
        withFileTypes: true,
      }
    );
    console.log('Root directory content:', rootDirContent);
    await fs.promises.writeFile(testFile, testContent);

    expect(await fs.promises.readFile(testFile, 'utf8')).toBe(testContent);

    // Clean up test file
    await fs.promises.unlink(testFile);
  } catch (err) {
    console.error('Mount test failed:', err);
    throw err;
  }
}, 90000); // Timeout after 90 seconds
