import { promisify } from 'node:util';
import child_process, { spawn } from 'node:child_process';
import * as path from 'path';
import { startNfsServer } from './start-nfs-server.js';
import * as fs from 'fs';

const execAsync = promisify(child_process.exec);

const NFS_PORT = 12345;
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const MOUNT_POINT = '/Users/martinlysk/testmount-folder'; // path.join(PROJECT_ROOT, 'testdata', 'testmount');
const SERVE_POINT = path.join(PROJECT_ROOT, 'testdata', 'testserve');
const MOUNT_COMMAND = `mount_nfs -o soft,timeo=5,retrans=2,nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=${NFS_PORT},mountport=${NFS_PORT} localhost:/ ${MOUNT_POINT}`;

export default async function () {
  console.log('Setting up NFS test environment...');

  try {
    await startNfsServer(NFS_PORT, SERVE_POINT);
  } catch (err) {
    console.error('Error during NFS test environment setup:', err);
    throw err;
  }
  // Start the NFS server

  const dirStatsBefore = fs.statSync(MOUNT_POINT, { throwIfNoEntry: false });
  try {
    const dir = fs.opendirSync(MOUNT_POINT);
    dir.closeSync(); // close old handle
  } catch (err) {
    console.error('Error verifying mount point:', err);
    throw err; //#endregion
  }

  // Mount the NFS share
  await Promise.race([
    execAsync(MOUNT_COMMAND),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Mount timeout after 10 seconds')),
        10000
      )
    ),
  ]);

  const dirStatsAfter = fs.statSync(MOUNT_POINT, { throwIfNoEntry: false });

  // Add after line 35:
  const { stdout: mountOutput } = await execAsync('mount');
  if (!mountOutput.includes(MOUNT_POINT)) {
    throw new Error('Mount failed or not visible');
  }

  try {
    const spwanedResult = spawn('ls', [MOUNT_POINT]);
    const { stdout: lsResult2 } = await execAsync('ls ' + MOUNT_POINT);
    console.log('Mount point directory listing:', lsResult2);
  } catch (err) {
    console.error('Error verifying mount point:', err);
    throw err; //#endregion
  }

  try {
    const dir = fs.opendirSync(MOUNT_POINT);
    dir.closeSync(); // close old handle
  } catch (err) {
    console.error('Error verifying mount point:', err);
    throw err; //#endregion
  }

  console.log('NFS test environment setup complete');

  // Return test configuration - this will be passed to test files
  // return {
  //   NFS_PORT,
  //   MOUNT_POINT,
  //   SERVE_POINT,
  // };
}

export async function teardown() {
  console.log('Cleaning up NFS test environment...');

  try {
    // Unmount if mounted
    await execAsync(`umount ${MOUNT_POINT}`);
  } catch (e) {
    const mountOutput = await execAsync('mount');

    if (mountOutput.stdout.includes(MOUNT_POINT)) {
      throw new Error('Unmount failed');
    }

    // Ignore unmount errors
    console.log('Unmount error (expected if not mounted)');
  }

  console.log('NFS test environment cleanup complete');
}
