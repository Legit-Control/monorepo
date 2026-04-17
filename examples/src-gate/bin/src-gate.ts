#!/usr/bin/env node

/**
 * src-gate - Virtual Git Gateway via NFS
 *
 * A CLI tool that provides access to git repositories through a virtual filesystem mount.
 * Similar interface to opensrc, but uses NFS mounting instead of cloning.
 *
 * Usage:
 *   src-gate path <package>          # Get mounted path for a package/repo
 *   src-gate list [--json]           # List all mounted/cached sources
 *   src-gate remove <package>        # Remove a mounted source
 *   src-gate clean [options]         # Clean cache
 *   src-gate start [options]         # Start the NFS server
 *   src-gate stop                    # Stop the NFS server
 */

import { Command } from 'commander';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { resolvePath, resolvePaths, resolvePackageWithVersion } from '../lib/resolve-path/index.js';

const program = new Command();

// Configuration
const DEFAULT_BASE_PATH = process.env.SRC_GATE_HOME || path.join(process.env.HOME || '', 'src-gate');
const REPOS_MOUNT_PATH = (basePath: string) => path.join(basePath, 'repos');
const STORAGE_PATH = (basePath: string) => basePath;

// ============================================================================
// Helper functions using the resolve-path module
// ============================================================================

/**
 * Check if the NFS server is running
 *
 * TODO: Implement proper server status check
 * Could check for PID file, mount status, or process existence
 */
function isServerRunning(basePath: string): boolean {
  const mountPath = REPOS_MOUNT_PATH(basePath);
  // TODO: Check if mount point is actually mounted
  // TODO: Check if server process is running
  try {
    return fs.existsSync(mountPath);
  } catch {
    return false;
  }
}

/**
 * Get metadata about all cached sources
 *
 * TODO: Scan storage directory for cached sources
 * TODO: Read metadata from storage/bookmarks
 * TODO: Return structured data about what's available
 */
function getCachedSources(basePath: string): Array<{ spec: string; path: string; registry: string }> {
  // TODO: Implement scanning of storage directory
  // TODO: Read bookmark state
  // TODO: Return actual cached sources
  return [];
}

/**
 * Remove a cached source
 *
 * TODO: Remove bookmark
 * TODO: Clean up cloned repository
 * TODO: Update metadata
 */
async function removeCachedSource(spec: string, basePath: string): Promise<void> {
  // TODO: Implement removal logic
  // TODO: Remove from bookmarks
  // TODO: Clean up cloned data
  console.log(`TODO: Remove ${spec}`);
}

/**
 * Clean cached sources
 *
 * TODO: Implement selective cleaning by registry
 * TODO: Clean packages vs repos
 * TODO: Handle different cleanup strategies
 */
async function cleanCache(options: {
  packages?: boolean;
  repos?: boolean;
  npm?: boolean;
  pypi?: boolean;
  crates?: boolean;
  basePath: string;
}): Promise<void> {
  // TODO: Implement cleaning logic
  // TODO: Filter by registry if specified
  // TODO: Filter by packages vs repos if specified
  console.log('TODO: Clean cache with options:', options);
}

// ============================================================================
// Commands
// ============================================================================

program
  .name('src-gate')
  .description('Virtual git gateway via NFS - Access git repositories through a virtual filesystem')
  .version('0.0.1');

/**
 * path command - Get mounted path for packages/repos
 *
 * Similar to: opensrc path <package>
 * Prints absolute path to mounted source (mounts on demand if not available)
 * Progress goes to stderr, path to stdout for subshell compatibility
 */
program
  .command('path')
  .description('Print the absolute path to mounted source (mounts on demand if needed)')
  .argument('[packages...]', 'Packages or repo specs (e.g., zod, pypi:requests, owner/repo)')
  .option('-p, --path <path>', 'Base path for src-gate data', DEFAULT_BASE_PATH)
  .option('--cwd <path>', 'Working directory for lockfile version resolution')
  .option('--verbose', 'Show progress during mount/fetch')
  .action(async (packages: string[], options) => {
    const basePath = path.resolve(options.path);
    const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();

    // If no packages specified, show help
    if (packages.length === 0) {
      console.error('Error: At least one package spec is required');
      process.exit(1);
    }

    // Ensure server is running
    if (!isServerRunning(basePath)) {
      console.error('Error: src-gate server is not running');
      console.error(`Run "src-gate start" to start the server`);
      process.exit(1);
    }

    // Resolve paths for all packages using the new integrated function
    for (const pkg of packages) {
      try {
        if (options.verbose) {
          console.error(`Resolving ${pkg}...`);
        }

        // Use the new resolvePackageWithVersion function
        const resolution = await resolvePackageWithVersion(pkg, {
          cwd,
          basePath,
        });

        if (options.verbose) {
          console.error(`  → ${resolution.registry} ${resolution.spec}@${resolution.version}`);
          console.error(`  → Git ref: ${resolution.gitRef}`);
        }

        // TODO: Trigger mount/fetch if not available
        // TODO: Show progress if --verbose flag is set

        // Print path to stdout (for subshell capture)
        console.log(resolution.path);
      } catch (error) {
        const err = error as Error;
        console.error(`Error resolving ${pkg}: ${err.message}`);
        process.exit(1);
      }
    }
  });

/**
 * list command - List all cached sources
 *
 * Similar to: opensrc list [--json]
 * Shows all globally cached/mounted sources
 */
program
  .command('list')
  .description('List all globally cached sources')
  .option('-p, --path <path>', 'Base path for src-gate data', DEFAULT_BASE_PATH)
  .option('--json', 'Output as JSON')
  .action((options) => {
    const basePath = path.resolve(options.path);
    const sources = getCachedSources(basePath);

    if (options.json) {
      // Output as JSON
      console.log(JSON.stringify(sources, null, 2));
    } else {
      // Human-readable output
      if (sources.length === 0) {
        console.log('No cached sources found');
        return;
      }

      console.log('Cached sources:');
      for (const source of sources) {
        console.log(`  ${source.spec} (${source.registry})`);
        console.log(`    → ${source.path}`);
      }
    }
  });

/**
 * remove command - Remove cached source
 *
 * Similar to: opensrc remove <package>
 * Removes bookmark and cleans up cloned data
 */
program
  .command('remove')
  .alias('rm')
  .description('Remove cached source code for packages or repos')
  .argument('[packages...]', 'Packages or repos to remove')
  .option('-p, --path <path>', 'Base path for src-gate data', DEFAULT_BASE_PATH)
  .action(async (packages: string[], options) => {
    const basePath = path.resolve(options.path);

    if (packages.length === 0) {
      console.error('Error: At least one package spec is required');
      process.exit(1);
    }

    for (const pkg of packages) {
      try {
        await removeCachedSource(pkg, basePath);
        console.log(`✓ Removed ${pkg}`);
      } catch (error) {
        const err = error as Error;
        console.error(`✗ Failed to remove ${pkg}: ${err.message}`);
        process.exit(1);
      }
    }
  });

/**
 * clean command - Clean cache
 *
 * Similar to: opensrc clean [options]
 * Removes all cached packages and/or repos
 */
program
  .command('clean')
  .description('Remove all cached packages and/or repos')
  .option('-p, --path <path>', 'Base path for src-gate data', DEFAULT_BASE_PATH)
  .option('--packages', 'Only remove packages (all registries)')
  .option('--repos', 'Only remove repos')
  .option('--npm', 'Only remove npm packages')
  .option('--pypi', 'Only remove PyPI packages')
  .option('--crates', 'Only remove crates.io packages')
  .action(async (options) => {
    const basePath = path.resolve(options.path);

    try {
      await cleanCache({
        packages: options.packages,
        repos: options.repos,
        npm: options.npm,
        pypi: options.pypi,
        crates: options.crates,
        basePath,
      });
      console.log('✓ Cache cleaned successfully');
    } catch (error) {
      const err = error as Error;
      console.error(`✗ Failed to clean cache: ${err.message}`);
      process.exit(1);
    }
  });

// ============================================================================
// src-gate specific commands (not in opensrc)
// ============================================================================

/**
 * start command - Start the NFS server
 *
 * Unique to src-gate: Starts the virtual filesystem server
 */
program
  .command('start')
  .description('Start the src-gate NFS server if not running')
  .option('-p, --path <path>', 'Base path for src-gate data', DEFAULT_BASE_PATH)
  .option('-P, --port <number>', 'Port for NFS server')
  .option('--verbose', 'Show detailed server logs')
  .action(async (options) => {
    const basePath = path.resolve(options.path);
    const mountPath = REPOS_MOUNT_PATH(basePath);

    if (isServerRunning(basePath)) {
      console.log('✅ src-gate server is already running');
      console.log(`📁 Mount point: ${mountPath}`);
      return;
    }

    console.log('🚀 Starting src-gate server...');
    console.log(`📁 Base path: ${basePath}`);
    console.log(`📁 Mount point: ${mountPath}`);

    try {
      // TODO: Import and start the actual NFS server
      // TODO: Dynamic import start-server module to avoid loading unless needed
      // const { startNfsServer, mountNfsShare, findAvailablePort } = await import('./start-server.js');
      // const port = options.port ? parseInt(options.port) : await findAvailablePort(13618);
      // const nfsServer = startNfsServer(basePath, mountPath, port);
      // await nfsServer.ready;
      // await mountNfsShare(mountPath, port);

      console.log('\n✅ src-gate filesystem mounted successfully!');
      console.log(`📁 Mount point: ${mountPath}`);
      console.log('\nPress Ctrl+C to stop the server.\n');

      // TODO: Implement graceful shutdown handling
      // TODO: Keep process alive and manage server lifecycle

      // Mock: Keep process alive
      await new Promise(() => {});
    } catch (error) {
      const err = error as Error;
      console.error('❌ Failed to start src-gate:', err.message);
      process.exit(1);
    }
  });

/**
 * stop command - Stop the NFS server
 *
 * Unique to src-gate: Stops the virtual filesystem server
 */
program
  .command('stop')
  .description('Stop the src-gate NFS server')
  .option('-p, --path <path>', 'Base path for src-gate data', DEFAULT_BASE_PATH)
  .action(async (options) => {
    const basePath = path.resolve(options.path);
    const mountPath = REPOS_MOUNT_PATH(basePath);

    if (!isServerRunning(basePath)) {
      console.log('ℹ️  src-gate server is not running');
      return;
    }

    console.log('🛑 Stopping src-gate server...');

    try {
      // TODO: Implement server stop logic
      // TODO: Unmount NFS share
      // TODO: Stop server process
      // const { unmountNfsShare } = await import('./start-server.js');
      // await unmountNfsShare(mountPath);

      console.log('✅ src-gate server stopped successfully');
    } catch (error) {
      const err = error as Error;
      console.error('❌ Failed to stop src-gate:', err.message);
      process.exit(1);
    }
  });

/**
 * status command - Check server status
 *
 * Unique to src-gate: Check if the NFS server is running
 */
program
  .command('status')
  .description('Check the status of the src-gate server')
  .option('-p, --path <path>', 'Base path for src-gate data', DEFAULT_BASE_PATH)
  .action((options) => {
    const basePath = path.resolve(options.path);
    const mountPath = REPOS_MOUNT_PATH(basePath);

    if (isServerRunning(basePath)) {
      console.log('✅ src-gate server is running');
      console.log(`📁 Mount point: ${mountPath}`);
    } else {
      console.log('❌ src-gate server is not running');
      console.log(`💡 Run "src-gate start" to start the server`);
    }
  });

// ============================================================================
// Main entry point
// ============================================================================

program.parse();
