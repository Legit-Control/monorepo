import { afterAll, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'node:util';
import child_process, { spawn } from 'node:child_process';

const execAsync = promisify(child_process.exec);

const PROJECT_ROOT = path.resolve(__dirname, 'setup');
const MOUNT_POINT = path.join(PROJECT_ROOT, 'testdata', 'testmount');

const NFS_PORT = 12345;

afterAll(async () => {
  try {
    // Unmount if mounted
    await execAsync(`umount ${MOUNT_POINT}`);
  } catch (e) {
    const mountOutput = await execAsync('mount');
    if (mountOutput.stdout.includes(MOUNT_POINT)) {
      console.error('Error during cleanup: ', e);
    }
  }
});

it('should work with two parallel mounts', async () => {
  try {
    fs.readdirSync(MOUNT_POINT);
    const testFile = path.join(MOUNT_POINT, 'test-file.txt');

    const testContent = 'Test content ' + Date.now();
    await fs.promises.writeFile(testFile, testContent);
    expect(await fs.promises.readFile(testFile, 'utf8')).toBe(testContent);
  } catch (err) {
    // If you get an error here -this might be due to missing permissions for
    // mounting NFS shares on your system. On macOS, you can grant the terminal
    // or IDE full disk access in System Preferences > Security & Privacy >
    // Privacy > Full Disk Access.
    console.error('Mount test failed:', err);
    throw err;
  }
}, 90000); // Timeout after 90 seconds
