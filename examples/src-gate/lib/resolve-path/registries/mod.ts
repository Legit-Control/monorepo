/**
 * Registry detection and package spec parsing
 */

import { DetectedRegistry, PackageSpec, Registry } from '../types.js';

/**
 * Registry prefixes with their associated registry type
 */
const REGISTRY_PREFIXES: Array<{ prefix: string; registry: Registry }> = [
  { prefix: 'npm:', registry: Registry.Npm },
  { prefix: 'pypi:', registry: Registry.PyPI },
  { prefix: 'pip:', registry: Registry.PyPI },
  { prefix: 'python:', registry: Registry.PyPI },
  { prefix: 'crates:', registry: Registry.Crates },
  { prefix: 'cargo:', registry: Registry.Crates },
  { prefix: 'rust:', registry: Registry.Crates },
];

/**
 * Detect the registry from a package spec
 *
 * @param spec - Package specification string
 * @returns Detected registry information
 *
 * @example
 * ```ts
 * detectRegistry('zod') // { registry: Registry.Npm, cleanSpec: 'zod' }
 * detectRegistry('pypi:requests') // { registry: Registry.PyPI, cleanSpec: 'requests' }
 * detectRegistry('crates:serde') // { registry: Registry.Crates, cleanSpec: 'serde' }
 * ```
 */
export function detectRegistry(spec: string): DetectedRegistry {
  const trimmed = spec.trim();
  const lower = trimmed.toLowerCase();

  for (const { prefix, registry } of REGISTRY_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return {
        registry,
        cleanSpec: trimmed.slice(prefix.length),
      };
    }
  }

  // Default to npm if no prefix detected
  return {
    registry: Registry.Npm,
    cleanSpec: trimmed,
  };
}

/**
 * Parse a package spec into name and version
 *
 * @param spec - Package specification string (without registry prefix)
 * @returns Tuple of [name, version]
 *
 * @example
 * ```ts
 * parsePackageSpec('zod') // ['zod', undefined]
 * parsePackageSpec('zod@3.22.0') // ['zod', '3.22.0']
 * parsePackageSpec('@babel/core@7.0.0') // ['@babel/core', '7.0.0']
 * ```
 */
export function parsePackageSpec(spec: string): [string, string | undefined] {
  // Handle scoped packages: @babel/core@7.0.0
  const scopedRegex = /^(@[^/]+\/[^@]+)(?:@(.+))?$/;
  const scopedMatch = spec.match(scopedRegex);

  if (scopedMatch) {
    const name = scopedMatch[1];
    const version = scopedMatch[2];
    return [name, version];
  }

  // Regular packages: zod@3.22.0
  // Find the last @ that's not at position 0
  const atIndex = spec.lastIndexOf('@');
  if (atIndex > 0) {
    const name = spec.slice(0, atIndex);
    const version = spec.slice(atIndex + 1);
    return [name, version];
  }

  return [spec, undefined];
}

/**
 * Detect if a string is a git repository URL
 *
 * @param url - URL to check
 * @returns True if the URL is a git repository
 *
 * @example
 * ```ts
 * isGitRepoUrl('https://github.com/owner/repo') // true
 * isGitRepoUrl('https://gitlab.com/owner/repo') // true
 * isGitRepoUrl('https://example.com/owner/repo') // false
 * ```
 */
export function isGitRepoUrl(url: string): boolean {
  return (
    url.includes('github.com') ||
    url.includes('gitlab.com') ||
    url.includes('bitbucket.org')
  );
}

/**
 * Normalize a repository URL by removing common suffixes and paths
 *
 * @param url - URL to normalize
 * @returns Normalized URL
 *
 * @example
 * ```ts
 * normalizeRepoUrl('https://github.com/owner/repo/') // 'https://github.com/owner/repo'
 * normalizeRepoUrl('https://github.com/owner/repo.git') // 'https://github.com/owner/repo'
 * normalizeRepoUrl('https://github.com/owner/repo/tree/main/src') // 'https://github.com/owner/repo'
 * ```
 */
export function normalizeRepoUrl(url: string): string {
  return url
    .trimEnd()
    .replace(/\/$/, '') // Remove trailing slash
    .replace(/\.git$/, '') // Remove .git
    .split('/tree/')[0] // Remove /tree/ ref
    .split('/blob/')[0]; // Remove /blob/ ref
}
