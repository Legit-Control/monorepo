/**
 * Spawn src-gate server as a background daemon
 */

import { spawn } from 'child_process';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { getSocketPath } from './health-check.js';
import { waitForSocket } from './health-check.js';

const SERVER_PORT = 13618;

/**
 * Spawn the server as a daemon process
 */
export async function spawnServerDaemon(
  basePath: string,
  options: {
    verbose?: boolean;
    timeout?: number;
    inspect?: boolean;
    debug?: boolean;
  } = {}
): Promise<number> {
  const logFile = path.join(basePath, 'server.log');

  // Ensure base path exists
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  // Open log file for appending
  const logFd = fs.openSync(logFile, 'a');

  // Get path to the start-server script
  // Try multiple possible paths since we don't know exactly where vite will put the chunks
  const possiblePaths = [
    path.join(process.cwd(), 'dist', 'start-server.js'),
    // For ESM, use import.meta.url
    path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'dist', 'start-server.js'),
    path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'dist', 'start-server.js'),
  ];

  let startServerPath: string | null = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      startServerPath = testPath;
      break;
    }
  }

  if (!startServerPath) {
    throw new Error(
      `Server script not found. Tried:\n${possiblePaths.map(p => '  - ' + p).join('\n')}\n\nRun 'pnpm build' first.`
    );
  }

  const args = [
    startServerPath,
    '--daemon',
    '--path', basePath,
    '--port', SERVER_PORT.toString(),
  ];

  if (options.verbose) {
    args.push('--verbose');
  }

  // Build Node.js execution arguments
  const nodeArgs: string[] = [];

  if (options.inspect) {
    nodeArgs.push(`--inspect=0.0.0.0:0`); // Use 0 to get dynamic port
  }

  if (options.debug) {
    nodeArgs.push(`--inspect-brk=0.0.0.0:0`); // Use 0 to get dynamic port
  }

  console.error(`Spawning daemon: ${process.execPath} ${nodeArgs.join(' ')} ${args.join(' ')}`);

  // Spawn the daemon with inspect flags
  const child = spawn(process.execPath, [...nodeArgs, ...args], {
    detached: true,
    stdio: ['ignore', logFd, logFd],
    cwd: basePath,
  });

  // Listen for spawn errors
  child.on('error', (err) => {
    console.error(`Failed to spawn daemon: ${err.message}`);
    throw new Error(`Failed to spawn daemon: ${err.message}`);
  });

  // Detach child process so it runs independently
  child.unref();

  const pid = child.pid;
  if (!pid) {
    throw new Error('Failed to spawn daemon: no PID returned');
  }

  console.error(`Daemon spawned with PID ${pid}`);

  // Wait for socket to be ready
  const socketPath = getSocketPath(basePath);
  const timeout = options.timeout || 5000;

  try {
    console.error(`Waiting for socket at ${socketPath}...`);
    await waitForSocket(socketPath, timeout);
    console.error(`Socket is ready!`);
  } catch (error) {
    throw new Error(
      `Server spawned (PID ${pid}) but socket not ready after ${timeout}ms`
    );
  }

  return pid;
}

/**
 * Kill a running server by PID
 */
export async function killServer(pid: number): Promise<void> {
  try {
    process.kill(pid, 'SIGTERM');

    // Wait for process to terminate
    const timeout = 5000;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        process.kill(pid, 0); // Check if still alive
      } catch {
        // Process is dead
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Force kill if SIGTERM didn't work
    process.kill(pid, 'SIGKILL');
  } catch (error) {
    throw new Error(`Failed to kill server process ${pid}: ${(error as Error).message}`);
  }
}
