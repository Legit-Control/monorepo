import type { TestProject } from 'vitest/node';
import { promisify } from 'node:util';
import child_process, { spawn } from 'node:child_process';
import * as path from 'path';

import * as fs from 'fs';
import { createAsyncNfsHandler } from '../../createAsyncNfsHandler.js';
import { createNfs3Server } from '../../server.js';
import { createFileHandleManager } from '../../createFileHandleManager.js';
const server = require('net').createServer();

const execAsync = promisify(child_process.exec);

const NFS_PORT = 12345;
const PROJECT_ROOT = path.resolve(__dirname);
const MOUNT_POINT = path.join(PROJECT_ROOT, 'testdata', 'testmount');

const SERVE_POINT = path.join(PROJECT_ROOT, 'testdata', 'testserve');
const MOUNT_COMMAND = `mount_nfs -o soft,timeo=5,retrans=2,nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=${NFS_PORT},mountport=${NFS_PORT} localhost:/ ${MOUNT_POINT}`;

let nfsServer: ReturnType<typeof createNfs3Server> | null = null;
let runOnce = false;

declare module 'vitest' {
  export interface ProvidedContext {
    mountpoint: string;
  }
}

export default async function (project: TestProject) {
  // Probe for 2 seconds if port is in use
  const startTime = Date.now();
  while (Date.now() - startTime < 2000) {
    if (await isPortInUse(NFS_PORT)) {
      await new Promise(resolve => setTimeout(resolve, 100));
    } else {
      break;
    }
  }

  if (await isPortInUse(NFS_PORT)) {
    throw new Error(`Port ${NFS_PORT} is still in use after 2 seconds`);
  }

  project.provide('mountpoint', MOUNT_POINT);
  // if the test was killed (happens during development), we want to make sure
  // we remove orphaned mounts
  try {
    const result = await execAsync(`umount ${MOUNT_POINT}`);
  } catch {}

  if (runOnce) {
    return;
  }
  // sstart the NFS server
  try {
    await startNfsServer();
  } catch (err) {
    console.error('Error during NFS test environment setup:', err);
    throw err;
  }

  // Mount the NFS share
  try {
    const result = await execAsync(MOUNT_COMMAND, { maxBuffer: 1024 * 1024 });
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

// Check if port is already in use
const isPortInUse = async (port: number): Promise<boolean> => {
  return new Promise(resolve => {
    server.listen(port, () => {
      server.close(() => resolve(false));
    });
    server.on('error', () => resolve(true));
  });
};
