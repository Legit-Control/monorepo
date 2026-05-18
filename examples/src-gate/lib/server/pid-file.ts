/**
 * PID file management for src-gate server daemon
 *
 * Handles reading, writing, and validating PID files
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const PID_FILE_NAME = 'server.pid';

/**
 * Get the path to the PID file
 */
export function getPidPath(basePath: string): string {
  return path.join(basePath, PID_FILE_NAME);
}

/**
 * Read PID from file
 */
export function readPid(basePath: string): number | null {
  try {
    const pidPath = getPidPath(basePath);
    const content = fs.readFileSync(pidPath, 'utf-8').trim();
    const pid = parseInt(content, 10);

    if (isNaN(pid)) {
      return null;
    }

    return pid;
  } catch {
    return null;
  }
}

/**
 * Write PID to file
 */
export function writePid(basePath: string, pid: number): void {
  const pidPath = getPidPath(basePath);
  fs.writeFileSync(pidPath, pid.toString(), 'utf-8');
}

/**
 * Remove PID file
 */
export function removePid(basePath: string): void {
  try {
    const pidPath = getPidPath(basePath);
    fs.unlinkSync(pidPath);
  } catch {
    // Ignore if file doesn't exist
  }
}

/**
 * Check if a process is alive by sending signal 0
 */
export function isProcessAlive(pid: number): boolean {
  try {
    // Send signal 0 to check if process exists
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if server is running (has valid PID file and process is alive)
 */
export function isServerRunning(basePath: string): boolean {
  const pid = readPid(basePath);

  if (!pid) {
    return false;
  }

  // Check if process is still alive
  if (!isProcessAlive(pid)) {
    // Process is dead, clean up stale PID file
    removePid(basePath);
    return false;
  }

  return true;
}

/**
 * Get server PID if running
 */
export function getServerPid(basePath: string): number | null {
  if (!isServerRunning(basePath)) {
    return null;
  }

  return readPid(basePath);
}
