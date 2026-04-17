/**
 * Parse package-lock.json (npm v6 and v7+ formats)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Read version from package-lock.json
 *
 * Handles both npm v6 and v7+ formats:
 * - v7+: packages["node_modules/packageName"].version
 * - v6: dependencies.packageName.version
 *
 * @param packageName - Name of the package
 * @param cwd - Current working directory
 * @returns Version string or null
 */
export async function versionFromPackageLock(
  packageName: string,
  cwd: string
): Promise<string | null> {
  try {
    const packageLockPath = path.join(cwd, 'package-lock.json');
    const content = await fs.promises.readFile(packageLockPath, 'utf-8');
    const parsed = JSON.parse(content);

    // Try npm v7+ format first
    if (parsed.packages) {
      const key = `node_modules/${packageName}`;
      if (parsed.packages[key]?.version) {
        return parsed.packages[key].version;
      }
    }

    // Try npm v6 format
    if (parsed.dependencies) {
      if (parsed.dependencies[packageName]?.version) {
        return parsed.dependencies[packageName].version;
      }
    }

    return null;
  } catch {
    // File doesn't exist or can't be read
    return null;
  }
}
