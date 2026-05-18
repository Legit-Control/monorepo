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
import { isServerRunning, getServerPid, spawnServerDaemon, killServer } from '../lib/server/index.js';

const program = new Command();

// Configuration
const DEFAULT_BASE_PATH = process.env.SRC_GATE_HOME || path.join(process.env.HOME || '', 'src-gate');
const REPOS_MOUNT_PATH = (basePath: string) => path.join(basePath, 'repos');
const STORAGE_PATH = (basePath: string) => basePath;

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Ensure server is running, auto-start if needed
 */
async function ensureServerRunning(basePath: string, verbose: boolean = false): Promise<void> {
  if (isServerRunning(basePath)) {
    if (verbose) {
      console.error(`✅ Server is already running (PID ${getServerPid(basePath)})`);
    }
    return;
  }

  if (verbose) {
    console.error('Starting src-gate server in background...');
  }

  try {
    const pid = await spawnServerDaemon(basePath, {
      verbose,
      timeout: 10000, // Wait up to 10 seconds for server to be ready
    });

    if (verbose) {
      console.error(`✅ Server started (PID ${pid})`);
    }
  } catch (error) {
    throw new Error(`Failed to start server: ${(error as Error).message}`);
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

    // Auto-start server if not running
    await ensureServerRunning(basePath, options.verbose);

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
  .option('--inspect', 'Enable debugger (inspect mode)')
  .option('--debug', 'Enable debugger (break on start)')
  .action(async (options) => {
    const basePath = path.resolve(options.path);
    const mountPath = REPOS_MOUNT_PATH(basePath);

    if (isServerRunning(basePath)) {
      const pid = getServerPid(basePath);
      console.log('✅ src-gate server is already running');
      console.log(`📄 PID: ${pid}`);
      console.log(`📁 Mount point: ${mountPath}`);
      return;
    }

    console.log('🚀 Starting src-gate server...');
    console.log(`📁 Base path: ${basePath}`);
    console.log(`📁 Mount point: ${mountPath}`);

    try {
      const pid = await spawnServerDaemon(basePath, {
        verbose: options.verbose,
        inspect: options.inspect,
        debug: options.debug,
        timeout: 10000,
      });

      console.log('\n✅ src-gate server started successfully!');
      console.log(`📄 PID: ${pid}`);
      console.log(`📁 Mount point: ${mountPath}`);
      console.log(`📄 Logs: ${path.join(basePath, 'server.log')}`);

      if (options.inspect || options.debug) {
        console.log(`\n🐛 Debugger enabled!`);
        console.log(`   To find the actual debugger port, run:`);
        console.log(`   lsof -nP -iTCP -sTCP:LISTEN | grep ${pid}`);
        console.log(`\n   Or check the logs for "Debugger listening on..."`);
        console.log(`   tail -f ${path.join(basePath, 'server.log')}`);
        console.log(`\n   Then connect in Chrome at chrome://inspect`);
        console.log(`   Add the target as: localhost:<port>`);
      }

      console.log('\n💡 Use "src-gate stop" to stop the server');
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

    const pid = getServerPid(basePath);
    if (!pid) {
      console.log('ℹ️  src-gate server is not running');
      return;
    }

    console.log(`🛑 Stopping src-gate server (PID ${pid})...`);

    try {
      await killServer(pid);
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
      const pid = getServerPid(basePath);
      console.log('✅ src-gate server is running');
      console.log(`📄 PID: ${pid}`);
      console.log(`📁 Mount point: ${mountPath}`);
      console.log(`📄 Logs: ${path.join(basePath, 'server.log')}`);
    } else {
      console.log('❌ src-gate server is not running');
      console.log(`💡 Run "src-gate start" to start the server`);
    }
  });

// ============================================================================
// Main entry point
// ============================================================================

program.parse();
