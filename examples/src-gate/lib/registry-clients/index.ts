/**
 * Registry clients index
 *
 * Exports all registry clients and utilities
 */

export * from './types.js';
export * from './normalize-url.js';
export * from './npm-client.js';
export * from './pypi-client.js';
export * from './crates-client.js';

import { Registry, type RepositoryInfo } from './types.js';
import { resolveNpmPackage } from './npm-client.js';
import { resolvePyPIPackage } from './pypi-client.js';
import { resolveCratesPackage } from './crates-client.js';

/**
 * Resolve package to repository URL based on registry type
 *
 * @param packageName - Package name
 * @param version - Package version
 * @param registry - Registry type (npm, pypi, crates)
 * @returns Repository info with URL and git ref
 */
export async function resolvePackageToRepo(
  packageName: string,
  version: string,
  registry: Registry
): Promise<RepositoryInfo> {
  switch (registry) {
    case Registry.Npm:
      return resolveNpmPackage(packageName, version);
    case Registry.PyPI:
      return resolvePyPIPackage(packageName, version);
    case Registry.Crates:
      return resolveCratesPackage(packageName, version);
    default:
      throw new Error(`Unsupported registry: ${registry}`);
  }
}
