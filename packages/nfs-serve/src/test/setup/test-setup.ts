import { promisify } from 'node:util';
import child_process, { spawn } from 'node:child_process';
import * as path from 'path';
import { startNfsServer } from './start-nfs-server.js';
import * as fs from 'fs';

const execAsync = promisify(child_process.exec);

const NFS_PORT = 12345;
const PROJECT_ROOT = path.resolve(__dirname);
const MOUNT_POINT = path.join(PROJECT_ROOT, 'testdata', 'testmount');

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

  // Mount the NFS share
  try {
    await execAsync(MOUNT_COMMAND);
  } catch (err) {
    console.error('Error during NFS test environment setup:', err);
    throw err;
  }

  // Add after line 35:
  const { stdout: mountOutput } = await execAsync('mount');
  if (!mountOutput.includes(MOUNT_POINT)) {
    throw new Error('Mount failed or not visible');
  }

  return async () => {
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
  };
}
