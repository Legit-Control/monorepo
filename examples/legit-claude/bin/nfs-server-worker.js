#!/usr/bin/env node

import {
  createAsyncNfsHandler,
  createNfs3Server,
  createFileHandleManager,
} from '@legit-sdk/nfs-serve';

import { openLegitFs } from '@legit-sdk/core';
import * as fs from 'fs';

// Get configuration from command line arguments or environment variables
const SERVE_POINT = process.argv[2];
const PORT = parseInt(process.argv[3]);

// Start the NFS server
let nfsServer;

console.log(`Starting NFS server worker...`);
console.log(`Serve point: ${SERVE_POINT}`);
console.log(`Port: ${PORT}`);

// Ensure the serve point directory exists
if (!fs.existsSync(SERVE_POINT)) {
  fs.mkdirSync(SERVE_POINT, { recursive: true });
}

try {
  const legitFs = await openLegitFs({
    storageFs: fs,
    gitRoot: SERVE_POINT,
    anonymousBranch: 'anonymous',
    publicKey: undefined,
    claudeHandler: true,
    ephemaralGitConfig: true,
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
    // Output the actual port to stdout so the parent process can capture it
    console.log(`NFS_SERVER_READY`);
  });

  // Handle graceful shutdown
  const cleanup = () => {
    console.log('Shutting down NFS server...');
    if (nfsServer) {
      nfsServer.close(() => {
        console.log('NFS server closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
} catch (error) {
  console.error('Error starting NFS server:', error);
  process.exit(1);
}
