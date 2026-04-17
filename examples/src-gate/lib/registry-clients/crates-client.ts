/**
 * crates.io (Rust) registry client
 *
 * Fetches package metadata from crates.io and extracts repository URL
 */

import type { CratesPackageMetadata, RepositoryInfo } from './types.js';
import { normalizeRepoUrl } from './normalize-url.js';

const CRATES_REGISTRY = 'https://crates.io/api/v1/crates';

/**
 * Fetch package metadata from crates.io
 */
async function fetchCratesPackage(packageName: string): Promise<CratesPackageMetadata> {
  const url = `${CRATES_REGISTRY}/${packageName}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'src-gate (https://github.com/example/src-gate)',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Package "${packageName}" not found on crates.io`);
    }
    throw new Error(`Failed to fetch package "${packageName}": ${response.statusText}`);
  }

  return response.json();
}

/**
 * Extract repository URL from crates.io package metadata
 */
function extractRepoUrl(packageName: string, metadata: CratesPackageMetadata): string {
  const crate = metadata.crate;

  // Priority: repository > homepage > documentation
  const repoUrl = crate.repository || crate.homepage || crate.documentation;

  if (!repoUrl) {
    throw new Error(`No repository URL found for crate "${packageName}"`);
  }

  return repoUrl;
}

/**
 * Resolve crates.io package to repository URL and git ref
 *
 * @param packageName - Crate name (e.g., "serde", "tokio")
 * @param version - Crate version (e.g., "1.0.0")
 * @returns Repository info with URL and git ref
 */
export async function resolveCratesPackage(
  packageName: string,
  version: string
): Promise<RepositoryInfo> {
  const metadata = await fetchCratesPackage(packageName);

  const repoUrl = extractRepoUrl(packageName, metadata);
  const normalized = normalizeRepoUrl(repoUrl);

  // Rust crates typically use git tags in format: v{version}
  const gitRef = version.startsWith('v') ? version : `v${version}`;

  return {
    repoUrl: normalized,
    gitRef,
  };
}

/**
 * Get latest version of a crate
 */
export async function getLatestCratesVersion(packageName: string): Promise<string> {
  const metadata = await fetchCratesPackage(packageName);

  if (!metadata.versions || metadata.versions.length === 0) {
    throw new Error(`No versions found for crate "${packageName}"`);
  }

  // crates.io returns versions sorted, first one is latest
  return metadata.versions[0].num;
}
