/**
 * Detect version from node_modules/package/package.json
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Read version from node_modules/packageName/package.json
 *
 * @param packageName - Name of the package
 * @param cwd - Current working directory
 * @returns Version string or null
 */
export async function versionFromNodeModules(
  packageName: string,
  cwd: string
): Promise<string | null> {
  try {
    const packageJsonPath = path.join(cwd, 'node_modules', packageName, 'package.json');

    const content = await fs.promises.readFile(packageJsonPath, 'utf-8');
    const parsed = JSON.parse(content);

    if (parsed.version && typeof parsed.version === 'string') {
      return parsed.version;
    }

    return null;
  } catch {
    // File doesn't exist or can't be read
    return null;
  }
}
