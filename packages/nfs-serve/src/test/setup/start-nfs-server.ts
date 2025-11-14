// start-nfs-server.js
import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startNfsServer(port: number, nfsPath: string) {
  return new Promise((resolve, reject) => {
    // Check if we're in a development/test environment by looking for .ts files
    const isDev = __filename.endsWith('.ts') || __filename.includes('node_modules/vite-node');

    let worker;
    if (isDev) {
      // In development, use ts-node to run the TypeScript worker
      worker = new Worker(path.resolve(__dirname, 'nfs-server-worker.ts'), {
        execArgv: ['--loader', 'ts-node/esm'],
        workerData: { port, nfsPath }
      });
    } else {
      // In production, use the compiled JavaScript worker
      worker = new Worker(path.resolve(__dirname, 'nfs-server-worker.js'), {
        workerData: { port, nfsPath }
      });
    }

    worker.once('message', msg => {
      if (msg.type === 'ready') {
        resolve({ port: msg.port, worker });
      } else {
        reject(new Error('Unexpected message from worker'));
      }
    });

    worker.once('error', reject);
    worker.once('exit', code => {
      if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
    });
  });
}
