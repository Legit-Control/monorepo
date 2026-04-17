/**
 * npm registry client
 *
 * Fetches package metadata from npm registry and extracts repository URL
 */

import type { NpmPackageMetadata, RepositoryInfo } from './types.js';
import { normalizeRepoUrl } from './normalize-url.js';

const NPM_REGISTRY = 'https://registry.npmjs.org';

/**
 * Fetch package metadata from npm registry
 */
async function fetchNpmPackage(packageName: string): Promise<NpmPackageMetadata> {
  // Encode scoped packages: @babel/core -> @babel%2Fcore
  const encodedName = packageName.replace('/', '%2F');
  const url = `${NPM_REGISTRY}/${encodedName}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Package "${packageName}" not found on npm registry`);
    }
    throw new Error(`Failed to fetch package "${packageName}": ${response.statusText}`);
  }

  return response.json();
}

/**
 * Extract repository URL from npm package metadata
 */
function extractRepoUrl(metadata: NpmPackageMetadata): string {
  // Try repository.url first
  if (metadata.repository?.url) {
    return metadata.repository.url;
  }

  // Try repository object (some packages use just repository: { url: ... })
  if (metadata.repository && typeof metadata.repository === 'object') {
    if ('url' in metadata.repository) {
      return (metadata.repository as any).url;
    }
    // Some packages have repository as just a string
    if (typeof metadata.repository === 'string') {
      return metadata.repository;
    }
  }

  throw new Error(`No repository URL found for package "${metadata.name}"`);
}

/**
 * Resolve npm package to repository URL and git ref
 *
 * @param packageName - npm package name (e.g., "react", "@babel/core")
 * @param version - Package version (e.g., "18.2.0")
 * @returns Repository info with URL and git ref
 */
export async function resolveNpmPackage(
  packageName: string,
  version: string
): Promise<RepositoryInfo> {
  const metadata = await fetchNpmPackage(packageName);

  const repoUrl = extractRepoUrl(metadata);
  const normalized = normalizeRepoUrl(repoUrl);

  // npm packages use git tags in format: v{version}
  const gitRef = `v${version}`;

  return {
    repoUrl: normalized,
    gitRef,
  };
}

/**
 * Get latest version of an npm package
 */
export async function getLatestNpmVersion(packageName: string): Promise<string> {
  const metadata = await fetchNpmPackage(packageName);

  if (!metadata['dist-tags']?.latest) {
    throw new Error(`No latest version found for package "${packageName}"`);
  }

  return metadata['dist-tags'].latest;
}
