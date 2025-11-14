// nfs-server-worker.js
import { parentPort, workerData } from 'worker_threads';
import { createNfs3Server } from './server.js';
import * as fs from 'fs';
import * as path from 'path';
import { createAsyncNfsHandler } from './createAsyncNfsHandler.js';
import { createFileHandleManager } from './createFileHandleManager.js';

// Extract configuration from workerData
const { port, nfsPath } = workerData as { port: number; nfsPath: string };

// if (!fs.existsSync(nfsPath)) {
//   fs.mkdirSync(nfsPath, { recursive: true });
// }

const fhM = createFileHandleManager(
  nfsPath,
  Math.floor(Date.now() / 1000 - 25 * 365.25 * 24 * 60 * 60) * 1000000
);

const asyncHandlers = createAsyncNfsHandler({
  fileHandleManager: fhM,
  asyncFs: fs.promises,
});

const nfsServer = createNfs3Server(asyncHandlers);

nfsServer.listen(port, () => {
  parentPort?.postMessage({ type: 'ready', port });
  console.log(`NFS server listening on port ${port} for path ${nfsPath}`);
});

parentPort?.on('message', msg => {
  if (msg === 'close') {
    console.log('Closing NFS server...');
    nfsServer.close(() => {
      parentPort?.postMessage({ type: 'closed' });
    });
  }
});

// Handle cleanup on worker exit
process.on('SIGINT', () => nfsServer.close());
process.on('exit', () => nfsServer.close());
