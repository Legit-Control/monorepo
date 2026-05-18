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
import { GitGateway } from '../lib/git-gateway/index.js';
import { writePid, removePid, getSocketPath } from '../lib/server/index.js';

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
  storageBasePath: string,
  mountFolder: string,
  port: number
): NfsServerResult {
  console.log(`Starting Gitaway NFS server...`);
  console.log(`Storage base path: ${storageBasePath}`);
  console.log(`Mount folder: ${mountFolder}`);
  console.log(`Port: ${port}`);

  let nfsServer: any;

  let serverReadyResolver: () => void;
  let serverReadyRejecter: (error: Error) => void;
  const serverReadyPromise = new Promise<void>((resolve, reject) => {
    serverReadyResolver = resolve;
    serverReadyRejecter = reject;
  });

  // Start the NFS server
  (async () => {
    try {
      // Read GitHub token from config if available
      const configPath = path.join(storageBasePath, 'config/github_token');
      let githubToken: string | undefined;

      try {
        if (fsDisk.existsSync(configPath)) {
          githubToken = fsDisk.readFileSync(configPath, 'utf-8').trim();
          console.log('GitHub token loaded from config');
        }
      } catch (error) {
        // Ignore error if config doesn't exist
        console.log('No GitHub token found, using unauthenticated API (rate limited)');
      }

      // Create the GitGateway virtual filesystem
      console.log('Creating GitGateway virtual filesystem...');
      const gitGateway = new GitGateway(fsDisk, storageBasePath, githubToken);

      console.log('Creating file handle manager...');
      const fileHandleManager = createFileHandleManager(
        '/',
        Math.floor(Date.now() / 1000 - 25 * 365.25 * 24 * 60 * 60) * 1000000
      );

      console.log('Creating async NFS handlers...');
      const asyncHandlers = createAsyncNfsHandler({
        fileHandleManager: fileHandleManager,
        asyncFs: gitGateway as any,
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
    // Try to unmount first in case something is already mounted
    exec(`umount -f ${mountPoint}`, unmountErr => {
      if (unmountErr) {
        // No existing mount to unmount
      } else {
        console.log(`Unmounted existing mount at ${mountPoint}`);
      }

      // Mount the NFS share
      const mountCommand = `mount_nfs -o nolocks,soft,retrans=2,timeo=10,vers=3,tcp,rsize=131072,actimeo=0,noreaddirplus,port=${port},mountport=${port} localhost:/ ${mountPoint}`;

      exec(mountCommand, mountErr => {
        if (mountErr) {
          console.error(`Failed to mount ${mountPoint}:`, mountErr.message);
          reject(mountErr);
          return;
        }

        // Verify the mount worked by checking if mount output contains our mount point
        exec('mount', (checkErr, stdout) => {
          if (checkErr) {
            console.error('Failed to verify mount:', checkErr.message);
            reject(checkErr);
            return;
          }

          if (stdout.includes(mountPoint)) {
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
  path: string;
  port?: number;
  daemon?: boolean;
  verbose?: boolean;
  debug?: boolean;
  inspect?: boolean;
}

/**
 * Create Unix socket to signal server readiness
 */
function createReadySocket(socketPath: string): net.Server {
  // Remove socket file if it exists
  try {
    fsDisk.unlinkSync(socketPath);
  } catch {
    // Ignore if file doesn't exist
  }

  // Create Unix socket server
  const socketServer = net.createServer((connection) => {
    // Accept connection and immediately close
    connection.on('data', () => {
      connection.write('OK\n');
      connection.end();
    });
  });

  // Listen on the socket file
  socketServer.listen(socketPath, () => {
    console.log(`Ready socket created at: ${socketPath}`);
  });

  return socketServer;
}

async function main() {
  const program = new Command();

  program
    .name('gitaway')
    .description('Virtual git gateway via NFS on macOS')
    .version('0.0.1')
    .option(
      '--path <path>',
      'Base path for gitaway data (repos and storage folders)',
      './gitaway'
    )
    .option(
      '--port <number>',
      'Port for NFS server (default: first free port starting from 13618)'
    )
    .option(
      '--daemon',
      'Run as a background daemon'
    )
    .option(
      '--verbose',
      'Enable verbose logging'
    )
    .option(
      '--debug',
      'Enable debug mode (break on start)'
    )
    .option(
      '--inspect',
      'Enable inspect mode (debugger on dynamic port)'
    );

  const options = program.parse().opts() as ProgramOptions;

  if (options.daemon) {
    // Daemon mode: redirect console to log file
    const logFile = path.join(options.path, 'server.log');
    const logStream = fsDisk.createWriteStream(logFile, { flags: 'a' });

    console.log = function(...args: any[]) {
      logStream.write(args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ') + '\n');
    };

    console.error = function(...args: any[]) {
      const timestamp = new Date().toISOString();
      logStream.write(`[${timestamp}] ERROR: ` + args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ') + '\n');
    };

    // Write PID file
    writePid(options.path, process.pid);

    console.log(`Gitaway daemon started with PID ${process.pid}`);
  }

  if (options.verbose || !options.daemon) {
    console.log('Starting Gitaway with options:', options);
  }

  // Find available NFS port if not specified (dynamic allocation)
  if (options.port === undefined) {
    options.port = await findAvailablePort(13618);
    console.log(`Using NFS port: ${options.port}`);
  }

  // Store NFS port information for clients
  const portInfoPath = path.join(options.path, 'server.port');
  fsDisk.writeFileSync(portInfoPath, options.port.toString(), 'utf-8');

  // Enable debugger if requested (with dynamic port)
  let debuggerPort: number | undefined;
  if (options.inspect || options.debug) {
    // Node.js inspector automatically allocates a port when using --inspect=0
    // We need to extract the actual allocated port
    // process.debugPort gives the default (9229), not the actual allocated port
    // So we use 9229 as fallback, but the actual port is printed to stderr on startup

    // Try to get actual port from inspect URL if available
    debuggerPort = (process as any).inspectPort || process.debugPort;

    console.log(`Debugger enabled on port: ${debuggerPort}`);
    console.log(`Attach Chrome debugger to: chrome://inspect`);
    console.log(`Or add target: localhost:${debuggerPort}`);
    console.log(`Debugger URL: devtools://devtools/bundled/inspector.html?ws=localhost:${debuggerPort}/node`);

    // Store debugger port
    if (debuggerPort) {
      const debuggerPortPath = path.join(options.path, 'debugger.port');
      fsDisk.writeFileSync(debuggerPortPath, debuggerPort.toString(), 'utf-8');
    }
  }

  // Convert path to absolute path relative to current working directory
  if (!path.isAbsolute(options.path)) {
    options.path = path.resolve(process.cwd(), options.path);
  }

  // Define repos and storage paths
  const reposPath = path.join(options.path, 'repos');
  const storagePath = options.path; // storageBasePath is the base path itself

  // Ensure base directory exists
  if (!fsDisk.existsSync(options.path)) {
    fsDisk.mkdirSync(options.path, { recursive: true });
    console.log(`Created base directory: ${options.path}`);
  }

  // Ensure repos directory exists
  if (!fsDisk.existsSync(reposPath)) {
    fsDisk.mkdirSync(reposPath, { recursive: true });
    console.log(`Created repos directory: ${reposPath}`);
  }

  console.log('Base path:', options.path);
  console.log('Repos path (mount point):', reposPath);
  console.log('Storage base path:', storagePath);
  console.log('Port:', options.port);

  let nfsServer: NfsServerResult | undefined;
  let readySocket: net.Server | undefined;

  // Handle graceful shutdown on SIGINT/SIGTERM
  const handleShutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);

    // Remove PID file
    if (options.daemon) {
      removePid(options.path);
    }

    // Close ready socket
    if (readySocket) {
      try {
        readySocket.close();
      } catch {
        // Ignore
      }
    }

    try {
      // Try to unmount
      await unmountNfsShare(reposPath);
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
      storagePath,
      reposPath,
      parseInt(options.port as unknown as string)
    );

    // Wait for NFS server to be ready
    await nfsServer.ready;

    // Create ready socket to signal that server is ready
    const socketPath = getSocketPath(options.path);
    readySocket = createReadySocket(socketPath);

    // Mount the NFS share
    await mountNfsShare(
      reposPath,
      parseInt(options.port as unknown as string)
    );

    console.log('\n✅ Gitaway filesystem mounted successfully!');
    console.log(`📁 Base path: ${options.path}`);
    console.log(`📁 Mount point: ${reposPath}`);
    console.log('\n📖 Quick start:');
    console.log(`   cd ${reposPath}/github.com/username`);
    console.log(`   ls -la`);

    if (!options.daemon) {
      console.log('\nPress Ctrl+C to stop the server and unmount.\n');
    } else {
      console.log(`\n✅ Daemon is running in background.`);
      console.log(`📄 Logs: ${path.join(options.path, 'server.log')}`);
      console.log(`\nUse "gitaway stop" to stop the daemon.\n`);
    }
  } catch (error) {
    const err = error as Error;
    console.error('\nFailed to start Gitaway:', err.message);
    console.error(err.stack);

    // Clean up PID file on error
    if (options.daemon) {
      removePid(options.path);
    }

    // Try to unmount on error
    try {
      await unmountNfsShare(reposPath);
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
