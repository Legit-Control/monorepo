/**
 * Parse pnpm-lock.yaml (v5-v9 formats)
 *
 * This is a complex parser due to pnpm's YAML structure with:
 * - importers blocks (workspaces)
 * - packages or snapshots sections
 * - Peer dependency suffixes: 18.2.0(react@18.2.0)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Strip peer dependency suffix from version
 * Example: "18.2.0(react@18.2.0)" → "18.2.0"
 */
function stripPeerSuffix(version: string): string {
  const parenIndex = version.indexOf('(');
  if (parenIndex > 0) {
    return version.slice(0, parenIndex).trimEnd();
  }
  return version.trimEnd();
}

/**
 * Strip YAML inline comment
 * Preserves URL fragments like github:foo/bar#branch
 */
function stripInlineComment(s: string): string {
  const match = s.match(/ #/);
  if (match) {
    return s.slice(0, match.index).trimEnd();
  }
  return s;
}

/**
 * Trim surrounding quotes
 */
function trimQuotes(s: string): string {
  return s.trim().match(/^["'](.*)["']$/)?.[1] ?? s.trim();
}

/**
 * Clean a YAML value: trim, strip comment, strip quotes
 */
function cleanValue(s: string): string {
  return trimQuotes(stripInlineComment(s.trim()));
}

/**
 * Parse pnpm-lock.yaml and extract package version
 *
 * Search priority:
 * 1. importers.{any}.{dependencies,devDependencies,optionalDependencies}
 * 2. Top-level dependencies/devDependencies/optionalDependencies (v5/v6)
 * 3. First matching packages: or snapshots: key
 *
 * @param packageName - Name of the package
 * @param cwd - Current working directory
 * @returns Version string or null
 */
export async function versionFromPnpmLock(
  packageName: string,
  cwd: string
): Promise<string | null> {
  try {
    const pnpmLockPath = path.join(cwd, 'pnpm-lock.yaml');
    const content = await fs.promises.readFile(pnpmLockPath, 'utf-8');

    const lines = content.split('\n');

    // Track potential matches
    let importerMatch: string | null = null;
    let topMatch: string | null = null;
    let packagesFallback: string | null = null;

    let inImporters = false;
    let inDepGroup = false;
    let currentPackage: string | null = null;
    let currentPackageIndent = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trimEnd();

      // Skip empty lines and comments
      if (trimmed === '' || trimmed.startsWith('#')) {
        continue;
      }

      const indent = line.length - line.trimStart().length;
      const trimmedStart = trimmed.trim(); // Trim both leading and trailing for checks

      // Reset current package if we dedent past it (strictly less than, not equal)
      if (currentPackage && indent < currentPackageIndent) {
        currentPackage = null;
      }

      // Check for section headers (at any indent level)
      const isSectionHeader = (trimmed.endsWith(':') && !trimmedStart.startsWith('version:') && !trimmedStart.startsWith('specifier:'));

      if (isSectionHeader) {
        const key = trimmed.slice(0, -1).trim();

        // Check if it's a known section header
        const knownSections = ['importers', 'dependencies', 'devDependencies', 'optionalDependencies', 'packages', 'snapshots', 'settings'];
        const isKnownSection = knownSections.includes(key);

        if (isKnownSection) {
          // Set section flags
          if (key === 'importers') {
            inImporters = true;
            inDepGroup = false;
          } else if (key === 'dependencies' || key === 'devDependencies' || key === 'optionalDependencies') {
            inDepGroup = true;
          } else if (key === 'packages' || key === 'snapshots') {
            inImporters = false;
            inDepGroup = false;
          }

          // Continue to next iteration (don't treat section headers as package names)
          continue;
        }
      }

      // Check for package name entry (ends with :)
      if (trimmed.endsWith(':') && !trimmedStart.startsWith('version:') && !trimmedStart.startsWith('specifier:')) {
        let pkgName = trimmed.slice(0, -1).trim();

        // Strip quotes if present (for scoped packages like '@types/react':)
        pkgName = trimQuotes(pkgName);

        // Track this as the current package we're looking at
        if (pkgName === packageName || pkgName.startsWith(`${packageName}@`)) {
          currentPackage = pkgName;
          currentPackageIndent = indent;
        }
      }

      // Check for version field for the current package
      if (currentPackage && trimmedStart.startsWith('version:')) {
        const version = cleanValue(trimmedStart.slice(8).trim());

        if (isRegistryVersion(version)) {
          const cleanVersion = stripPeerSuffix(version);

          // Determine priority based on context
          if (inImporters || inDepGroup) {
            if (!importerMatch) {
              importerMatch = cleanVersion;
            }
          } else {
            if (!packagesFallback) {
              packagesFallback = cleanVersion;
            }
          }

          // Clear current package since we found its version
          currentPackage = null;
        }
      }
    }

    // Return in priority order
    return importerMatch || topMatch || packagesFallback;
  } catch (e) {
    // File doesn't exist or can't be read
    console.error('Error in versionFromPnpmLock:', e);
    return null;
  }
}

/**
 * Check if a version string looks like a registry version
 * (not a workspace:, file:, git:, etc.)
 */
function isRegistryVersion(v: string): boolean {
  return v.length > 0 && v !== '0.0.0-use.local' && !v.includes(':');
}
