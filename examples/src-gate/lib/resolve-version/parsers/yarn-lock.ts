/**
 * Parse yarn.lock (v1 and Berry formats)
 *
 * Yarn lockfiles have a specific format with:
 * - Package name at indentation level 0
 * - Version nested under "version:"
 * - Berry format uses YAML, v1 uses custom format
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Parse yarn.lock and extract package version
 *
 * Handles both Yarn v1 and Berry formats
 *
 * @param packageName - Name of the package
 * @param cwd - Current working directory
 * @returns Version string or null
 */
export async function versionFromYarnLock(
  packageName: string,
  cwd: string
): Promise<string | null> {
  try {
    const yarnLockPath = path.join(cwd, 'yarn.lock');
    const content = await fs.promises.readFile(yarnLockPath, 'utf-8');

    const lines = content.split('\n');

    let currentPackage = '';
    let inRightBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (trimmed === '' || trimmed.startsWith('#')) {
        continue;
      }

      // Check for package name at indentation 0 (Yarn v1)
      // Or __metadata (Berry)
      if (line.trimStart() === line) {
        if (trimmed === '__metadata:') {
          continue; // Skip Berry metadata
        }

        // Yarn v1 format: "packageName@npm:version", or "packageName, version:"
        if (trimmed.includes('@npm:') || trimmed.includes(', ')) {
          // Extract package name (strip quotes and colon first)
          const cleanLine = trimmed.replace(/^["']|["']:$/g, '');
          const match = cleanLine.match(/^([^@:]+@[^@,\s]+|@[^@,\s]+\/[^@,\s]+)/);
          if (match) {
            currentPackage = match[1];
            inRightBlock = false;
          }
        }
        // Berry format: plain package name as key
        else if (trimmed.endsWith(':')) {
          const pkgName = trimmed.slice(0, -1);
          currentPackage = pkgName;
          inRightBlock = false;
        }
      }
      // Check for version field
      else if (trimmed.startsWith('version:')) {
        if (currentPackage === packageName || currentPackage.startsWith(`${packageName}@`)) {
          const version = trimmed.slice(8).trim().replace(/^["']|["']$/g, '');
          return version;
        }
      }
      // Yarn v1 format: check for version in right-hand side
      else if (trimmed.startsWith('version ')) {
        if (currentPackage === packageName || currentPackage.startsWith(`${packageName}@`)) {
          const version = trimmed.slice(8).trim().replace(/^["']|["']$/g, '');
          return version;
        }
      }
    }

    return null;
  } catch {
    // File doesn't exist or can't be read
    return null;
  }
}
