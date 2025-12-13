#!/usr/bin/env node

import {
  createAsyncNfsHandler,
  createNfs3Server,
  createFileHandleManager,
} from '@legit-sdk/nfs-serve';

import { openLegitFs } from '@legit-sdk/core';
import * as fs from 'fs';

// Get configuration from command line arguments or environment variables
const SERVE_POINT = process.argv[2] || process.env.SERVE_POINT || process.cwd();
const PORT = parseInt(process.argv[3]);
const LOG_FILE =
  process.argv[4] || process.env.NFS_LOG_FILE || 'nfs-server.log';

// Start the NFS server
let nfsServer;

console.log(`Starting NFS server worker...`);
console.log(`Serve point: ${SERVE_POINT}`);
console.log(`Port: ${PORT}`);
console.log(`Log file: ${LOG_FILE}`);

// Ensure the serve point directory exists
if (!fs.existsSync(SERVE_POINT)) {
  fs.mkdirSync(SERVE_POINT, { recursive: true });
}

// Create write stream for logging
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

// Override console.log and console.error to write to both console and log file
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = (...args) => {
  const timestamp = new Date().toISOString();
  const message = args.join(' ');
  // originalConsoleLog(`[${timestamp}]`, ...args);
  logStream.write(`[${timestamp}] ${message}\n`);
};

console.error = (...args) => {
  const timestamp = new Date().toISOString();
  const message = args.join(' ');
  // originalConsoleError(`[${timestamp}]`, ...args);
  logStream.write(`[${timestamp}] ERROR: ${message}\n`);
};

try {
  // Find an available port starting from the configured port
  console.log(`Checking if port ${PORT} is available...`);

  const legitFs = await openLegitFs({
    storageFs: fs,
    gitRoot: SERVE_POINT,
    anonymousBranch: 'anonymous',
    publicKey: undefined,
    claudeHandler: true,
  });

  const fhM = createFileHandleManager(
    SERVE_POINT,
    Math.floor(Date.now() / 1000 - 25 * 365.25 * 24 * 60 * 60) * 1000000
  );

  const asyncHandlers = createAsyncNfsHandler({
    fileHandleManager: fhM,
    asyncFs: legitFs,
  });

  nfsServer = createNfs3Server(asyncHandlers);

  nfsServer.listen(PORT, () => {
    console.log(`NFS server listening on port ${PORT} for path ${SERVE_POINT}`);
    console.log('NFS server ready to accept connections');

    // Output the actual port to stdout so the parent process can capture it
    console.log(`ACTUAL_PORT:${PORT}`);
  });

  // Handle graceful shutdown
  const cleanup = () => {
    console.log('Shutting down NFS server...');
    if (nfsServer) {
      nfsServer.close(() => {
        console.log('NFS server closed');
        logStream.end();
        process.exit(0);
      });
    } else {
      logStream.end();
      process.exit(0);
    }
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
} catch (error) {
  console.error('Error starting NFS server:', error);
  logStream.end();
  process.exit(1);
}
