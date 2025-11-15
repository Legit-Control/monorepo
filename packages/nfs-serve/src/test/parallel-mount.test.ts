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
    await new Promise(resolve => process.nextTick(resolve));

    // const MOUNT_COMMAND = `mount_nfs -o soft,timeo=5,retrans=2,nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=${NFS_PORT},mountport=${NFS_PORT} localhost:/ ${MOUNT_POINT}`;
    // await execAsync(MOUNT_COMMAND);

    const sstats = fs.statSync(MOUNT_POINT);

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
