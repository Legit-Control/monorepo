/**
 * PyPI (Python Package Index) client
 *
 * Fetches package metadata from PyPI and extracts repository URL
 */

import type { PyPIPackageMetadata, RepositoryInfo } from './types.js';
import { normalizeRepoUrl } from './normalize-url.js';

const PYPI_REGISTRY = 'https://pypi.org/pypi';

/**
 * Fetch package metadata from PyPI
 */
async function fetchPyPIPackage(packageName: string): Promise<PyPIPackageMetadata> {
  const url = `${PYPI_REGISTRY}/${packageName}/json`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Package "${packageName}" not found on PyPI`);
    }
    throw new Error(`Failed to fetch package "${packageName}": ${response.statusText}`);
  }

  return response.json();
}

/**
 * Extract repository URL from PyPI package metadata
 */
function extractRepoUrl(packageName: string, metadata: PyPIPackageMetadata): string {
  const urls = metadata.info.project_urls;

  if (!urls) {
    throw new Error(`No repository URLs found for package "${packageName}"`);
  }

  // Priority order: Repository/Source (case-insensitive) > Homepage/Home
  // Try different casings that PyPI packages use
  const repoUrl =
    urls.Repository ||
    urls.repository ||
    urls.Source ||
    urls.source ||
    urls.Homepage ||
    urls.homepage ||
    urls.Home ||
    urls.home;

  if (!repoUrl) {
    throw new Error(`No repository URL found for package "${packageName}"`);
  }

  return repoUrl;
}

/**
 * Resolve PyPI package to repository URL and git ref
 *
 * @param packageName - PyPI package name (e.g., "requests", "django")
 * @param version - Package version (e.g., "2.28.0")
 * @returns Repository info with URL and git ref
 */
export async function resolvePyPIPackage(
  packageName: string,
  version: string
): Promise<RepositoryInfo> {
  const metadata = await fetchPyPIPackage(packageName);

  const repoUrl = extractRepoUrl(packageName, metadata);
  const normalized = normalizeRepoUrl(repoUrl);

  // Python packages typically use git tags in format: v{version}
  const gitRef = version.startsWith('v') ? version : `v${version}`;

  return {
    repoUrl: normalized,
    gitRef,
  };
}

/**
 * Get latest version of a PyPI package
 */
export async function getLatestPyPIVersion(packageName: string): Promise<string> {
  const metadata = await fetchPyPIPackage(packageName);

  if (!metadata.info.version) {
    throw new Error(`No version info found for package "${packageName}"`);
  }

  return metadata.info.version;
}
