#!/usr/bin/env node

import * as fsDisk from 'node:fs';

import * as net from 'net';

import { exec } from 'child_process';
import { Command } from 'commander';

import {
  createAsyncNfsHandler,
  createNfs3Server,
  createFileHandleManager,
} from '@legit-sdk/nfs-serve';
import { createCompositeFs } from './create-fs.js';

// Function to check if a port is available
function isPortAvailable(port) {
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
async function findAvailablePort(startPort) {
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

function startNfsServer(servePoint, port, logFile) {
  console.log(`Starting NFS server...`);
  console.log(`Serve point: ${servePoint}`);
  console.log(`Port: ${port}`);
  console.log(`Log file: ${logFile}`);

  // Create log file stream
  const logStream = fsDisk.createWriteStream(logFile, { flags: 'a' });

  // Add timestamp function for log entries
  const logWithTimestamp = (message, isError = false) => {
    const timestamp = new Date().toISOString();
    const prefix = isError ? `ERROR: ` : ``;
    const logMessage = `[${timestamp}] ${prefix}${message}\n`;
    logStream.write(logMessage);
  };

  let nfsServer;
  let compositeFs;

  let serverReadyResolver;
  let serverReadyRejecter;
  const serverReadyPromise = new Promise((resolve, reject) => {
    serverReadyResolver = resolve;
    serverReadyRejecter = reject;
  });

  // Ensure the serve point directory exists
  if (!fsDisk.existsSync(servePoint)) {
    fsfsDisk.mkdirSync(servePoint, { recursive: true });
    logWithTimestamp(`Created serve point directory: ${servePoint}`);
  }

  // Start the NFS server
  (async () => {
    try {
      logWithTimestamp('Creating simple in-memory filesystem...');
      compositeFs = await createCompositeFs();

      logWithTimestamp('Creating file handle manager...');
      const fhM = createFileHandleManager(
        '/',
        Math.floor(Date.now() / 1000 - 25 * 365.25 * 24 * 60 * 60) * 1000000
      );

      logWithTimestamp('Creating async NFS handlers...');
      const asyncHandlers = createAsyncNfsHandler({
        fileHandleManager: fhM,
        asyncFs: compositeFs,
      });

      logWithTimestamp('Creating NFS3 server...');
      nfsServer = createNfs3Server(asyncHandlers);

      logWithTimestamp(`Starting NFS server on port ${port}...`);
      nfsServer.listen(port, () => {
        logWithTimestamp(`NFS server is listening on port ${port}`);
        serverReadyResolver();
      });

      // Handle errors
      nfsServer.on('error', error => {
        logWithTimestamp(`NFS server error: ${error.message}`, true);
        serverReadyRejecter(error);
      });
    } catch (error) {
      const errorMsg = `Error starting NFS server: ${error.message}`;
      logWithTimestamp(errorMsg, true);
      console.error(errorMsg);
      serverReadyRejecter(error);
    }
  })();

  // Return an object with server control methods and the ready promise
  return {
    server: nfsServer,
    ready: serverReadyPromise,
    stop: async () => {
      logWithTimestamp('Stopping NFS server...');
      if (nfsServer) {
        return new Promise(resolve => {
          nfsServer.close(() => {
            logWithTimestamp('NFS server closed');
            logStream.end();
            resolve();
          });
        });
      } else {
        logStream.end();
        return Promise.resolve();
      }
    },
  };
}

function mountNfsShare(mountPoint, port) {
  return new Promise((resolve, reject) => {
    // console.log(`Mounting NFS share at ${mountPoint} on port ${port}...`);

    // Ensure mount point directory exists
    if (!fsDisk.existsSync(mountPoint)) {
      // console.log(`Creating mount point directory: ${mountPoint}`);
      fsDisk.mkdirSync(mountPoint, { recursive: true });
    }

    // Try to unmount first in case something is already mounted
    exec(`umount -f ${mountPoint}`, unmountErr => {
      if (unmountErr) {
        // console.log(`No existing mount to unmount at ${mountPoint}`);
      } else {
        // console.log(`Unmounted existing mount at ${mountPoint}`);
      }

      // Mount the NFS share
      const mountCommand = `mount_nfs -o nolocks,soft,retrans=2,timeo=10,vers=3,tcp,rsize=131072,actimeo=120,port=${port},mountport=${port} localhost:/ ${mountPoint}`;

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

function unmountNfsShare(mountPoint) {
  return new Promise((resolve, reject) => {
    console.log(`Unmounting NFS share at ${mountPoint}...`);

    exec(`umount ${mountPoint}`, (err, stdout, stderr) => {
      if (err) {
        // Check if it's just because the mount point doesn't exist
        if (
          err.message.includes('not currently mounted') ||
          err.message.includes('No such file or directory')
        ) {
          console.log(
            `Mount point ${mountPoint} was not mounted or doesn't exist`
          );
          resolve();
          return;
        }
        console.error(`Failed to unmount ${mountPoint}:`, err.message);
        reject(err);
        return;
      }

      console.log(`${mountPoint} unmounted successfully`);
      resolve();
    });
  });
}

async function main() {
  const program = new Command();

  program
    .name('virtual-nfs')
    .description('CLI tool to serve virtual filesystem via NFS')
    .version('1.0.0')
    .option(
      '--mount-path <path>',
      'Folder where to mount the virtual filesystem',
      './virtual-nfs-mount'
    )
    .option('--spawn <cmd>', 'Command to execute after mounting (omit to skip)')
    .option(
      '--port <number>',
      'Port for NFS server (default: first free port starting from 13617)'
    )
    .option(
      '--log-file <path>',
      'Path to NFS server log file',
      'nfs-server.log'
    );

  const options = program.parse().opts();

  if (options.port === undefined) {
    options.port = await findAvailablePort(13617);
  }

  // Convert mount path to absolute path
  if (!options.mountPath.startsWith('/')) {
    options.mountPath = new URL(options.mountPath, import.meta.url).pathname;
  }

  console.log('Mount path:', options.mountPath);
  console.log('Port:', options.port);
  console.log(
    'Spawn command:',
    options.spawn || '(none - will keep server running)'
  );
  console.log('Log file:', options.logFile);

  let nfsServer;

  // Handle graceful shutdown on SIGINT/SIGTERM
  const handleShutdown = async signal => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);

    try {
      // Try to unmount
      await unmountNfsShare(options.mountPath);
    } catch (err) {
      // Ignore unmount errors during shutdown
    }

    // Stop NFS server
    if (nfsServer) {
      await nfsServer.stop();
    }

    process.exit(0);
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  try {
    // Start NFS server directly in main thread
    nfsServer = startNfsServer(
      options.mountPath,
      parseInt(options.port),
      options.logFile
    );

    // Wait for NFS server to be ready
    await nfsServer.ready;

    // Mount the NFS share
    await mountNfsShare(options.mountPath, parseInt(options.port));

    console.log('\n✅ NFS filesystem mounted successfully!');
    console.log(`📁 Mount point: ${options.mountPath}`);
    console.log(
      `\nYou can now explore the virtual filesystem at: ${options.mountPath}`
    );
    console.log('\nPress Ctrl+C to stop the server and unmount.\n');
  } catch (error) {
    console.error('\nFailed to start NFS server:', error.message);
    console.error(error.stack);

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

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
