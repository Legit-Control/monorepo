import type { TestProject } from 'vitest/node';
import net from 'net';
import { promisify } from 'node:util';
import child_process, { spawn } from 'node:child_process';
import * as path from 'path';

import * as fs from 'fs';
import { createAsyncNfsHandler } from './createAsyncNfsHandler.js';
import { createNfs3Server } from './server.js';
import { createFileHandleManager } from './createFileHandleManager.js';

const execAsync = promisify(child_process.exec);

let NFS_PORT = 12345;

let nfsServer: ReturnType<typeof createNfs3Server> | null = null;
let runOnce = false;

declare module 'vitest' {
  export interface ProvidedContext {
    mountpoint: string;
    servepoint: string;
  }
}

export default async function (project: TestProject) {
  // console.log('Setting up NFS test environment...');
  // Probe for 2 seconds if port is in use

  const portFree = await isPortFree(NFS_PORT);
  let debugging = false;

  if (!portFree) {
    // vs code extension doesn't run the global setup/teardown properly
    // https://github.com/vitest-dev/vscode/issues/671
    // to be able to debug tests in the extension, we assume that if the port is
    // in use, it's because we're debugging and the NFS server is already running
    // we are in debugging mode
    debugging = true;
    NFS_PORT = 12346;
    // console.log('Assuming debugging mode - NFS server already running');
  }

  const PROJECT_ROOT = path.resolve(__dirname);
  const MOUNT_POINT = path.join(
    PROJECT_ROOT,
    'testdata',
    debugging ? 'testmount-dev' : 'testmount'
  );
  project.provide('mountpoint', MOUNT_POINT);

  const SERVE_POINT = path.join(
    PROJECT_ROOT,
    'testdata',
    debugging ? 'testserve-dev' : 'testserve'
  );
  project.provide('servepoint', SERVE_POINT);

  // Ensure directories exist
  if (!fs.existsSync(MOUNT_POINT)) {
    fs.mkdirSync(MOUNT_POINT, { recursive: true });
  }

  if (!fs.existsSync(SERVE_POINT)) {
    fs.mkdirSync(SERVE_POINT, { recursive: true });
  }

  // if the test was killed (happens during development), we want to make sure
  // we remove orphaned mounts
  try {
    const result = await execAsync(`umount ${MOUNT_POINT}`);
  } catch {}

  if (runOnce) {
    return;
  }

  // Start the NFS server
  try {
    await startNfsServer(SERVE_POINT);
  } catch (err) {
    console.error('Error during NFS test environment setup:', err);
    throw err;
  }

  // Mount the NFS share
  try {
    const MOUNT_COMMAND = `mount_nfs -o soft,timeo=5,retrans=2,nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=${NFS_PORT},mountport=${NFS_PORT} localhost:/ ${MOUNT_POINT}`;

    await execAsync(MOUNT_COMMAND, { maxBuffer: 1024 * 1024 });
  } catch (err) {
    console.error('Error during NFS test environment setup:', err);
    throw err;
  }

  // Assert that the mount was successful
  const { stdout: mountOutput } = await execAsync('mount');
  if (!mountOutput.includes(MOUNT_POINT)) {
    console.error('Mount failed');
    throw new Error('Mount failed');
  }

  // Assert we can read the mount point
  try {
    await execAsync('ls ' + MOUNT_POINT);
  } catch (err) {
    // If you get an error here -this might be due to missing permissions for
    // mounting NFS shares on your system. On macOS, you can grant the terminal
    // or IDE full disk access in System Preferences > Security & Privacy >
    // Privacy > Full Disk Access.
    throw err;
  }

  return async () => {
    // console.log('Cleaning up NFS test environment...');

    try {
      // Unmount if mounted
      await execAsync(`umount ${MOUNT_POINT}`);
    } catch (e) {
      const mountOutput = await execAsync('mount');

      nfsServer?.close();
      if (mountOutput.stdout.includes(MOUNT_POINT)) {
        throw new Error('Unmount failed');
      }

      // Ignore unmount errors
      // // console.log('Unmount error (expected if not mounted)');
    }

    // // console.log('NFS test environment cleanup complete');
  };
}

const startNfsServer = async (servePoint: string) => {
  const fhM = createFileHandleManager(
    servePoint,
    Math.floor(Date.now() / 1000 - 25 * 365.25 * 24 * 60 * 60) * 1000000
  );

  const asyncHandlers = createAsyncNfsHandler({
    fileHandleManager: fhM,
    asyncFs: fs.promises,
  });

  nfsServer = createNfs3Server(asyncHandlers);

  nfsServer.listen(NFS_PORT, () => {
    console.log(
      `NFS server listening on port ${NFS_PORT} for path ${servePoint}`
    );
  });
};

// Check if port is already in use
const isPortFree = async (port: number): Promise<boolean> => {
  return new Promise(resolve => {
    const socket = new net.Socket();

    socket.setTimeout(100);

    socket.once('connect', () => {
      socket.destroy();
      resolve(false); // port is in use
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(true); // assume free (no response)
    });

    socket.once('error', (err: any) => {
      // Connection refused = NOT LISTENING = free
      if (err.code === 'ECONNREFUSED') {
        resolve(true);
      } else {
        resolve(false); // weird errors → treat as used
      }
    });

    socket.connect(port, '127.0.0.1');
  });
};
