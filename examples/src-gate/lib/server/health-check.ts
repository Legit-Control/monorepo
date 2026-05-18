/**
 * Server health check using Unix socket
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as net from 'node:net';

const SOCKET_FILE_NAME = 'server.sock';

/**
 * Get the path to the Unix socket file
 */
export function getSocketPath(basePath: string): string {
  return path.join(basePath, SOCKET_FILE_NAME);
}

/**
 * Check if Unix socket exists and is connectable
 */
export async function isSocketReady(socketPath: string): Promise<boolean> {
  try {
    // Check if socket file exists
    if (!fs.existsSync(socketPath)) {
      return false;
    }

    // Try to connect to the socket
    return new Promise<boolean>((resolve) => {
      const socket = new net.Socket();

      socket
        .on('connect', () => {
          socket.destroy();
          resolve(true);
        })
        .on('error', () => {
          socket.destroy();
          resolve(false);
        });

      socket.connect({ path: socketPath });
    });
  } catch {
    return false;
  }
}

/**
 * Wait for socket to be ready with timeout
 */
export async function waitForSocket(
  socketPath: string,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await isSocketReady(socketPath)) {
      return;
    }

    // Wait 100ms before next check
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(
    `Timeout waiting for server socket at ${socketPath} (${timeout}ms)`
  );
}

/**
 * Remove stale socket file
 */
export function removeSocket(socketPath: string): void {
  try {
    fs.unlinkSync(socketPath);
  } catch {
    // Ignore if file doesn't exist
  }
}
