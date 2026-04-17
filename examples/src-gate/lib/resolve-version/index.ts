/**
 * Version detection from lockfiles
 *
 * Detects installed package versions from:
 * 1. node_modules/package/package.json
 * 2. package-lock.json (v6 and v7+ formats)
 * 3. pnpm-lock.yaml (v5-v9 formats)
 * 4. yarn.lock (v1 and Berry formats)
 * 5. package.json (fallback, strips ^~>=< prefixes)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { DetectVersionOptions } from './types.js';

// Import parsers
import { versionFromNodeModules } from './parsers/node-modules.js';
import { versionFromPackageLock } from './parsers/package-lock.js';
import { versionFromPnpmLock } from './parsers/pnpm-lock.js';
import { versionFromYarnLock } from './parsers/yarn-lock.js';
import { versionFromPackageJson } from './parsers/package-json-fallback.js';

/**
 * Detect the installed version of a package from lockfiles and node_modules
 *
 * Priority order:
 * 1. node_modules/package/package.json
 * 2. package-lock.json (npm v7+ or v6 format)
 * 3. pnpm-lock.yaml
 * 4. yarn.lock
 * 5. package.json (fallback, strips version prefixes)
 *
 * @param packageName - Name of the package to detect (e.g., "react", "@types/react")
 * @param options - Options for version detection
 * @returns Detected version string, or null if not found
 *
 * @example
 * ```typescript
 * // Detect version in current directory
 * const version = await detectInstalledVersion('react');
 * // → "18.2.0"
 *
 * // Detect version in specific directory
 * const version = await detectInstalledVersion('react', { cwd: '/path/to/project' });
 * // → "18.2.0"
 *
 * // Handle scoped packages
 * const version = await detectInstalledVersion('@types/react');
 * // → "18.2.45"
 * ```
 */
export async function detectInstalledVersion(
  packageName: string,
  options: DetectVersionOptions = {}
): Promise<string | null> {
  const cwd = options.cwd ?? process.cwd();

  // Priority 1: Check node_modules
  const nodeModulesVersion = await versionFromNodeModules(packageName, cwd);
  if (nodeModulesVersion) {
    return nodeModulesVersion;
  }

  // Priority 2: Check package-lock.json
  const packageLockVersion = await versionFromPackageLock(packageName, cwd);
  if (packageLockVersion) {
    return packageLockVersion;
  }

  // Priority 3: Check pnpm-lock.yaml
  const pnpmLockVersion = await versionFromPnpmLock(packageName, cwd);
  if (pnpmLockVersion) {
    return pnpmLockVersion;
  }

  // Priority 4: Check yarn.lock
  const yarnLockVersion = await versionFromYarnLock(packageName, cwd);
  if (yarnLockVersion) {
    return yarnLockVersion;
  }

  // Priority 5: Fallback to package.json
  const packageJsonVersion = await versionFromPackageJson(packageName, cwd);
  if (packageJsonVersion) {
    return packageJsonVersion;
  }

  // Package not found
  return null;
}

/**
 * Detect multiple package versions at once
 *
 * @param packageNames - Array of package names to detect
 * @param options - Options for version detection
 * @returns Map of package name to version (null if not found)
 *
 * @example
 * ```typescript
 * const versions = await detectInstalledVersions(['react', 'react-dom', 'zod']);
 * // → Map { "react" => "18.2.0", "react-dom" => "18.2.0", "zod" => "3.22.0" }
 * ```
 */
export async function detectInstalledVersions(
  packageNames: string[],
  options: DetectVersionOptions = {}
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();

  await Promise.all(
    packageNames.map(async (name) => {
      const version = await detectInstalledVersion(name, options);
      results.set(name, version);
    })
  );

  return results;
}

// Re-export types
export * from './types.js';
