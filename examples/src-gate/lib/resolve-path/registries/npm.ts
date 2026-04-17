/**
 * NPM registry package resolution
 */

import { PackageSpec } from '../types.js';

/**
 * Parse an npm package spec
 *
 * @param spec - Package specification (without npm: prefix)
 * @returns Package spec with name and optional version
 *
 * @example
 * ```ts
 * parseNpmSpec('zod') // { name: 'zod', version: undefined }
 * parseNpmSpec('zod@3.22.0') // { name: 'zod', version: '3.22.0' }
 * parseNpmSpec('@babel/core@7.0.0') // { name: '@babel/core', version: '7.0.0' }
 * parseNpmSpec('@babel/core') // { name: '@babel/core', version: undefined }
 * ```
 */
export function parseNpmSpec(spec: string): Omit<PackageSpec, 'registry'> {
  // Handle scoped packages: @babel/core@7.0.0
  const scopedRegex = /^(@[^/]+\/[^@]+)(?:@(.+))?$/;
  const scopedMatch = spec.match(scopedRegex);

  if (scopedMatch) {
    return {
      name: scopedMatch[1],
      version: scopedMatch[2],
    };
  }

  // Regular packages: zod@3.22.0
  // Find the last @ that's not at position 0
  const atIndex = spec.lastIndexOf('@');
  if (atIndex > 0) {
    return {
      name: spec.slice(0, atIndex),
      version: spec.slice(atIndex + 1),
    };
  }

  return {
    name: spec,
    version: undefined,
  };
}

/**
 * Get the npm registry URL for a package
 *
 * @param name - Package name
 * @returns NPM registry URL
 *
 * @example
 * ```ts
 * npmRegistryUrl('zod') // 'https://registry.npmjs.org/zod'
 * npmRegistryUrl('@babel/core') // 'https://registry.npmjs.org/%40babel%2Fcore'
 * ```
 */
export function npmRegistryUrl(name: string): string {
  const encoded = encodeURIComponent(name);
  return `https://registry.npmjs.org/${encoded}`;
}

/**
 * Extract repository URL from npm package metadata
 *
 * @param repo - Repository object from npm metadata
 * @returns Tuple of [repoUrl, directory] or undefined
 */
export function extractRepoUrl(
  repo?: { url?: string; directory?: string }
): [string, string | undefined] | undefined {
  if (!repo?.url) {
    return undefined;
  }

  let url = repo.url
    .replace(/^git\+/, '')
    .replace(/git:\/\//, 'https://')
    .replace(/git\+ssh:\/\/git@/, 'https://')
    .replace(/ssh:\/\/git@/, 'https://')
    .replace(/\.git$/, '');

  // Handle github:owner/repo format
  if (url.startsWith('github:')) {
    url = `https://github.com/${url.slice(7)}`;
  }

  return [url, repo.directory];
}
