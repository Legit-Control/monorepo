/**
 * Path resolution for src-gate
 *
 * This module provides utilities to parse package specifications
 * and resolve them to filesystem paths in the src-gate virtual filesystem.
 */

export * from './types.js';
export * from './registries/mod.js';
export * from './registries/npm.js';
export * from './registries/pypi.js';
export * from './registries/crates.js';
export * from './registries/repo.js';

import { detectRegistry as detectRegistryUtil } from './registries/mod.js';
import { parseNpmSpec } from './registries/npm.js';
import { parsePypiSpec } from './registries/pypi.js';
import { parseCratesSpec } from './registries/crates.js';
import { parseRepoSpec, isRepoSpec } from './registries/repo.js';
import { Registry, PackageSpec, PathResolution } from './types.js';
import { detectInstalledVersion } from '../resolve-version/index.js';
import { resolvePackageToRepo, buildSrcGatePath } from '../registry-clients/index.js';
import * as path from 'node:path';

/**
 * Parse a package specification into a PackageSpec
 *
 * @param spec - Package specification string
 * @returns Parsed package specification
 *
 * @example
 * ```ts
 * parsePackageSpec('zod') // { registry: Registry.Npm, name: 'zod' }
 * parsePackageSpec('pypi:requests') // { registry: Registry.PyPI, name: 'requests' }
 * parsePackageSpec('crates:serde@1.0.0') // { registry: Registry.Crates, name: 'serde', version: '1.0.0' }
 * parsePackageSpec('owner/repo') // { registry: 'repo', name: 'owner/repo' }
 * ```
 */
export function parsePackageSpec(spec: string): PackageSpec | { registry: 'repo'; name: string } {
  const trimmed = spec.trim();

  // First check if it's a repo spec
  if (isRepoSpec(trimmed)) {
    return {
      registry: 'repo' as any,
      name: trimmed,
    };
  }

  // Detect registry and parse
  const detected = detectRegistryUtil(trimmed);

  let parsed;
  switch (detected.registry) {
    case Registry.Npm:
      parsed = parseNpmSpec(detected.cleanSpec);
      break;
    case Registry.PyPI:
      parsed = parsePypiSpec(detected.cleanSpec);
      break;
    case Registry.Crates:
      parsed = parseCratesSpec(detected.cleanSpec);
      break;
    default:
      // Default to npm
      parsed = parseNpmSpec(detected.cleanSpec);
      break;
  }

  return {
    registry: detected.registry,
    name: parsed.name,
    version: parsed.version,
  };
}

/**
 * Resolve a package spec to a filesystem path
 *
 * @param spec - Package specification string
 * @param basePath - Base path for src-gate data
 * @returns Path resolution result
 *
 * @example
 * ```ts
 * resolvePath('zod', '/Users/user/src-gate')
 * // { spec: 'zod', path: '/Users/user/src-gate/repos/npm-registry/zod', registry: Registry.Npm }
 *
 * resolvePath('owner/repo', '/Users/user/src-gate')
 * // { spec: 'owner/repo', path: '/Users/user/src-gate/repos/github.com/owner/repo', registry: 'repo' }
 * ```
 */
export function resolvePath(spec: string, basePath: string): PathResolution {
  const parsed = parsePackageSpec(spec);

  if (parsed.registry === 'repo') {
    // It's a repo spec like owner/repo or https://github.com/owner/repo
    const repoSpec = parseRepoSpec(parsed.name);
    if (!repoSpec) {
      throw new Error(`Invalid repository specification: ${spec}`);
    }

    const resolvedPath = path.join(
      basePath,
      'repos',
      repoSpec.host,
      repoSpec.owner,
      repoSpec.repo
    );

    return {
      spec,
      path: resolvedPath,
      registry: 'repo',
      version: repoSpec.gitRef,
    };
  }

  // It's a package spec from a registry
  const reposPath = path.join(basePath, 'repos');
  let packagePath: string;

  switch (parsed.registry) {
    case Registry.Npm:
      // For npm, we'll store under repos/npm-registry/package-name
      packagePath = path.join(reposPath, 'npm-registry', parsed.name);
      break;
    case Registry.PyPI:
      // For PyPI, we'll store under repos/pypi-org/package-name
      packagePath = path.join(reposPath, 'pypi-org', parsed.name);
      break;
    case Registry.Crates:
      // For crates.io, we'll store under repos/crates-io/crate-name
      packagePath = path.join(reposPath, 'crates-io', parsed.name);
      break;
    default:
      throw new Error(`Unsupported registry: ${parsed.registry}`);
  }

  return {
    spec,
    path: packagePath,
    registry: parsed.registry,
    version: parsed.version,
  };
}

/**
 * Resolve multiple package specs to filesystem paths
 *
 * @param specs - Array of package specifications
 * @param basePath - Base path for src-gate data
 * @returns Array of path resolution results
 */
export function resolvePaths(specs: string[], basePath: string): PathResolution[] {
  return specs.map((spec) => resolvePath(spec, basePath));
}

/**
 * Resolve a package spec to filesystem path with version detection and registry resolution
 *
 * This is the main function that integrates:
 * 1. Package spec parsing
 * 2. Version detection from lockfiles (if no version specified)
 * 3. Registry API resolution to get repository URL and git ref
 * 4. Path construction in src-gate format
 *
 * @param spec - Package specification string
 * @param options - Resolution options
 * @returns Complete path resolution with version and git ref
 *
 * @example
 * ```ts
 * // Detect version from lockfile, resolve to repo
 * const result = await resolvePackageWithVersion('react', {
 *   cwd: process.cwd(),
 *   basePath: '/Users/user/.src-gate'
 * });
 * // Returns:
 * // {
 * //   spec: 'react',
 * //   path: '/Users/user/.src-gate/repos/github.com/facebook/react/v18.2.0/',
 * //   registry: Registry.Npm,
 * //   version: '18.2.0',
 * //   gitRef: 'v18.2.0'
 * // }
 * ```
 */
export async function resolvePackageWithVersion(
  spec: string,
  options: {
    cwd?: string;
    basePath: string;
  }
): Promise<{
  spec: string;
  path: string;
  registry: Registry | 'repo';
  version: string;
  gitRef: string;
}> {
  const parsed = parsePackageSpec(spec);

  // If it's already a repo spec, return it directly
  if (parsed.registry === 'repo') {
    const repoSpec = parseRepoSpec(parsed.name);
    if (!repoSpec) {
      throw new Error(`Invalid repository specification: ${spec}`);
    }

    return {
      spec,
      path: buildSrcGatePath(
        `https://${repoSpec.host}/${repoSpec.owner}/${repoSpec.repo}`,
        repoSpec.gitRef || 'main',
        options.basePath
      ),
      registry: 'repo',
      version: repoSpec.gitRef || 'main',
      gitRef: repoSpec.gitRef || 'main',
    };
  }

  // It's a registry package
  const registry = parsed.registry as Registry;

  // Detect version if not specified
  let version = parsed.version;
  if (!version) {
    const detectedVersion = await detectInstalledVersion(parsed.name, { cwd: options.cwd });
    if (!detectedVersion) {
      throw new Error(
        `Could not detect version for package "${parsed.name}". Please specify a version explicitly: ${spec}@version`
      );
    }
    version = detectedVersion;
  }

  // Resolve package to repository URL and git ref
  const repoInfo = await resolvePackageToRepo(parsed.name, version, registry);

  // Build src-gate path
  const srcGatePath = buildSrcGatePath(repoInfo.repoUrl, repoInfo.gitRef, options.basePath);

  return {
    spec,
    path: srcGatePath,
    registry,
    version,
    gitRef: repoInfo.gitRef,
  };
}
