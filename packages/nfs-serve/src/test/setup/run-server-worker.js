import { Worker } from 'worker_threads';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.argv[2] || 12345;
const nfsPath =
  process.argv[3] || path.join(process.cwd(), 'testdata', 'testserve');

const worker = new Worker(
  '/Users/martinlysk/legit/monorepo/packages/nfs-serve/dist/test/setup/nfs-server-worker.js',
  {
    workerData: { port: parseInt(port), nfsPath },
  }
);

worker.on('message', msg => {
  console.log('Worker message:', msg);
});

worker.on('error', err => {
  console.error('Worker error:', err);
});

worker.on('exit', code => {
  console.log('Worker exited with code', code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  worker.postMessage('close');
  setTimeout(() => process.exit(0), 2000);
});
