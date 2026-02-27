#!/usr/bin/env node

import * as fsDisk from 'node:fs';
import * as net from 'net';
import * as path from 'node:path';
import { exec } from 'child_process';
import { Command } from 'commander';
import {
  createAsyncNfsHandler,
  createNfs3Server,
  createFileHandleManager,
} from '@legit-sdk/nfs-serve';
import { createMemoryStateProvider } from '../lib/gnfs/memory-state-provider';
import { AsyncGnfs } from '../lib/gnfs/async-gnfs';

// Function to check if a port is available
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();

    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });

    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to find an available port starting from the given port
async function findAvailablePort(startPort: number): Promise<number> {
  let port = startPort;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loop

  while (attempts < maxAttempts) {
    if (await isPortAvailable(port)) {
      return port;
    }
    // console.log(`Port ${port} is in use, trying next port...`);
    port++;
    attempts++;
  }

  throw new Error(
    `Could not find an available port after ${maxAttempts} attempts starting from ${startPort}`
  );
}

interface NfsServerResult {
  server: any;
  ready: Promise<void>;
  stop: () => Promise<void>;
}

function startNfsServer(
  serverFolder: string,
  mountFolder: string,
  port: number
): NfsServerResult {
  console.log(`Starting NFS server...`);
  console.log(`Server folder: ${serverFolder}`);
  console.log(`Mount folder: ${mountFolder}`);
  console.log(`Port: ${port}`);

  let nfsServer: any;

  let serverReadyResolver: () => void;
  let serverReadyRejecter: (error: Error) => void;
  const serverReadyPromise = new Promise<void>((resolve, reject) => {
    serverReadyResolver = resolve;
    serverReadyRejecter = reject;
  });

  // if (!fsDisk.existsSync(serverFolder)) {
  //   throw new Error(`Server folder does not exist: ${serverFolder}`);
  // }

  // // Ensure the folder to mount the nfs to exists
  // if (!fsDisk.existsSync(mountFolder)) {
  //   fsDisk.mkdirSync(mountFolder, { recursive: true });
  //   console.log(`Created mount folder directory: ${mountFolder}`);
  // }

  // Start the NFS server
  (async () => {
    try {
      const asyncGnfs = new AsyncGnfs();
      const memoryStateProvider = createMemoryStateProvider();

      asyncGnfs.connect(memoryStateProvider);

      // NOTE: create a filder to serve
      await memoryStateProvider.upsert('/my_serve_folder/file.txt', {
        body: 'Hello, world!',
      });

      console.log('Creating file handle manager...');
      const fileHandleManager = createFileHandleManager(
        serverFolder,
        Math.floor(Date.now() / 1000 - 25 * 365.25 * 24 * 60 * 60) * 1000000
      );

      console.log('Creating async NFS handlers...');
      const asyncHandlers = createAsyncNfsHandler({
        fileHandleManager: fileHandleManager,
        asyncFs: asyncGnfs as any,
      });

      console.log('Creating NFS3 server...');
      nfsServer = createNfs3Server(asyncHandlers);

      console.log(`Starting NFS server on port ${port}...`);
      nfsServer.listen(port, () => {
        console.log(`NFS server is listening on port ${port}`);
        serverReadyResolver();
      });

      // Handle errors
      nfsServer.on('error', (error: Error) => {
        console.log(`NFS server error: ${error.message}`, true);
        serverReadyRejecter(error);
      });
    } catch (error) {
      const err = error as Error;
      const errorMsg = `Error starting NFS server: ${err.message}`;
      console.log(errorMsg, true);
      console.error(errorMsg);
      serverReadyRejecter(err);
    }
  })();

  // Return an object with server control methods and the ready promise
  return {
    server: nfsServer,
    ready: serverReadyPromise,
    stop: async () => {
      console.log('Stopping NFS server...');
      await nfsServer.closeAllConnections();
      if (nfsServer) {
        return new Promise<void>(resolve => {
          nfsServer.close(() => {
            console.log('NFS server closed');
            resolve();
          });
        });
      } else {
        return Promise.resolve();
      }
    },
  };
}

function mountNfsShare(mountPoint: string, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // console.log(`Mounting NFS share at ${mountPoint} on port ${port}...`);

    // // Ensure mount point directory exists
    // if (!fsDisk.existsSync(mountPoint)) {
    //   // console.log(`Creating mount point directory: ${mountPoint}`);
    //   fsDisk.mkdirSync(mountPoint, { recursive: true });
    // }

    // Try to unmount first in case something is already mounted
    exec(`umount -f ${mountPoint}`, unmountErr => {
      if (unmountErr) {
        // console.log(`No existing mount to unmount at ${mountPoint}`);
      } else {
        // console.log(`Unmounted existing mount at ${mountPoint}`);
      }

      // Mount the NFS share
      const mountCommand = `mount_nfs -o nolocks,soft,retrans=2,timeo=10,vers=3,tcp,rsize=131072,actimeo=0,port=${port},mountport=${port} localhost:/ ${mountPoint}`;

      exec(mountCommand, mountErr => {
        if (mountErr) {
          console.error(`Failed to mount ${mountPoint}:`, mountErr.message);
          reject(mountErr);
          return;
        }

        // console.log(`${mountPoint} mounted successfully`);

        // Verify the mount worked by checking if mount output contains our mount point
        exec('mount', (checkErr, stdout) => {
          if (checkErr) {
            console.error('Failed to verify mount:', checkErr.message);
            reject(checkErr);
            return;
          }

          if (stdout.includes(mountPoint)) {
            // console.log('Mount verification successful');
            resolve();
          } else {
            console.error(
              'Mount verification failed - mount point not found in mount output'
            );
            reject(new Error('Mount verification failed'));
          }
        });
      });
    });
  });
}

function unmountNfsShare(mountFolderPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Unmounting NFS share at ${mountFolderPath}...`);

    exec(`umount ${mountFolderPath}`, (err, stdout, stderr) => {
      if (err) {
        // Check if it's just because the mount point doesn't exist
        if (
          err.message.includes('not currently mounted') ||
          err.message.includes('No such file or directory')
        ) {
          console.log(`Nothing mounted on ${mountFolderPath}`);
          resolve();
          return;
        }
        console.error(`Failed to unmount ${mountFolderPath}:`, err.message);
        reject(err);
        return;
      }

      console.log(`${mountFolderPath} unmounted successfully`);
      resolve();
    });
  });
}

interface ProgramOptions {
  servePath: string;
  mountPath: string;
  spawn?: string;
  port?: number;
  logFile?: string;
}

async function main() {
  const program = new Command();

  program
    .name('virtual-nfs')
    .description('CLI tool to serve virtual filesystem via NFS')
    .version('1.0.0')
    .option(
      '--serve-path <servePath>',
      'Folder where to serve the virtual filesystem from'
    )
    .option(
      '--mount-path <mountPath>',
      'Folder where to mount the virtual filesystem',
      './virtual-nfs-mount'
    )
    .option('--spawn <cmd>', 'Command to execute after mounting (omit to skip)')
    .option(
      '--port <number>',
      'Port for NFS server (default: first free port starting from 13617)'
    );

  const options = program.parse().opts() as ProgramOptions;
  console.log('Starting virtual NFS server with options:', options);

  if (options.port === undefined) {
    options.port = await findAvailablePort(13617);
  }

  if (!options.servePath) {
    console.error('Error: --serve-path option is required');
    process.exit(1);
  }

  // Convert serve path to absolute path relative to current working directory
  if (!path.isAbsolute(options.servePath)) {
    options.servePath = path.resolve(process.cwd(), options.servePath);
  }

  // Convert mount path to absolute path relative to current working directory
  if (!path.isAbsolute(options.mountPath)) {
    options.mountPath = path.resolve(process.cwd(), options.mountPath);
  }

  console.log('Mount path:', options.mountPath);
  console.log('Port:', options.port);

  let nfsServer: NfsServerResult | undefined;

  // Handle graceful shutdown on SIGINT/SIGTERM
  const handleShutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);

    try {
      // Try to unmount
      await unmountNfsShare(options.mountPath);
    } catch (err) {
      // Ignore unmount errors during shutdown
    }

    // Stop NFS server
    if (nfsServer) {
      console.log('Stopping NFS server...');
      await nfsServer.stop();
    }

    console.log('Shutdown complete.');
    process.exit(0);
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  try {
    // Start NFS server directly in main thread
    nfsServer = startNfsServer(
      // fsDisk,
      options.servePath,
      options.mountPath,
      parseInt(options.port as unknown as string)
    );

    // Wait for NFS server to be ready
    await nfsServer.ready;

    // Mount the NFS share
    await mountNfsShare(
      options.mountPath,
      parseInt(options.port as unknown as string)
    );

    console.log('\n✅ NFS filesystem mounted successfully!');
    console.log(`📁 Mount point: ${options.mountPath}`);
    console.log(
      `\nYou can now explore the virtual filesystem at: ${options.mountPath}`
    );
    console.log('\nPress Ctrl+C to stop the server and unmount.\n');
  } catch (error) {
    const err = error as Error;
    console.error('\nFailed to start NFS server:', err.message);
    console.error(err.stack);

    // Try to unmount on error
    try {
      await unmountNfsShare(options.mountPath);
    } catch (unmountErr) {
      // Ignore unmount errors during cleanup
    }

    // Stop NFS server on error
    if (nfsServer) {
      await nfsServer.stop();
    }

    process.exit(1);
  }
}

main();
