import { promisify } from 'node:util';
import child_process, { spawn } from 'node:child_process';
import * as path from 'path';
// import { startNfsServer } from './start-nfs-server.js';
import * as fs from 'fs';
import { createAsyncNfsHandler } from '../../createAsyncNfsHandler.js';
import { createNfs3Server } from '../../server.js';
import { createFileHandleManager } from '../../createFileHandleManager.js';

const execAsync = promisify(child_process.exec);

const NFS_PORT = 12345;
const PROJECT_ROOT = path.resolve(__dirname);
const MOUNT_POINT = path.join(PROJECT_ROOT, 'testdata', 'testmount');

const SERVE_POINT = path.join(PROJECT_ROOT, 'testdata', 'testserve');
const MOUNT_COMMAND = `mount_nfs -o soft,timeo=5,retrans=2,nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=${NFS_PORT},mountport=${NFS_PORT} localhost:/ ${MOUNT_POINT}`;

let nfsServer: ReturnType<typeof createNfs3Server> | null = null;

const startNfsServer = async () => {
  const fhM = createFileHandleManager(
    SERVE_POINT,
    Math.floor(Date.now() / 1000 - 25 * 365.25 * 24 * 60 * 60) * 1000000
  );

  const asyncHandlers = createAsyncNfsHandler({
    fileHandleManager: fhM,
    asyncFs: fs.promises,
  });

  nfsServer = createNfs3Server(asyncHandlers);

  nfsServer.listen(NFS_PORT, () => {
    console.log(
      `NFS server listening on port ${NFS_PORT} for path ${SERVE_POINT}`
    );
  });
};

export default async function () {
  console.log('Setting up NFS test environment...');
  try {
    await startNfsServer();
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

      nfsServer?.close();

      // Ignore unmount errors
      console.log('Unmount error (expected if not mounted)');
    }

    console.log('NFS test environment cleanup complete');
  };
}
