/**
 * Parse package.json as fallback
 *
 * Strips version range prefixes (^, ~, >=, <) from dependency specs
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Strip version range prefix from a version string
 * Examples: "^1.0.0" → "1.0.0", "~2.0.0" → "2.0.0", ">=3.0.0" → "3.0.0"
 */
function stripVersionPrefix(version: string): string {
  return version.replace(/^[~^<>=]+/, '');
}

/**
 * Check if version looks like a registry version (not workspace:, file:, etc.)
 */
function isRegistryVersion(v: string): boolean {
  return v.length > 0 && v !== '0.0.0-use.local' && !v.includes(':');
}

/**
 * Extract package version from package.json dependency fields
 *
 * Searches in: dependencies, devDependencies, peerDependencies
 *
 * @param content - package.json content
 * @param packageName - Name of the package
 * @returns Version string or null
 */
function parsePackageJsonVersion(content: string, packageName: string): string | null {
  try {
    const parsed = JSON.parse(content);

    const fields = ['dependencies', 'devDependencies', 'peerDependencies'];

    for (const field of fields) {
      if (parsed[field] && parsed[field][packageName]) {
        const version = parsed[field][packageName];
        if (typeof version === 'string') {
          const stripped = stripVersionPrefix(version);
          if (isRegistryVersion(stripped)) {
            return stripped;
          }
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Read version from package.json as fallback
 *
 * This is a last-resort fallback that reads package.json and
 * strips version range prefixes from dependency specs.
 *
 * @param packageName - Name of the package
 * @param cwd - Current working directory
 * @returns Version string or null
 */
export async function versionFromPackageJson(
  packageName: string,
  cwd: string
): Promise<string | null> {
  try {
    const packageJsonPath = path.join(cwd, 'package.json');
    const content = await fs.promises.readFile(packageJsonPath, 'utf-8');

    return parsePackageJsonVersion(content, packageName);
  } catch {
    // File doesn't exist or can't be read
    return null;
  }
}
