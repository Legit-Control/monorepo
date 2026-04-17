/**
 * Crates.io registry package resolution
 */

import { PackageSpec } from '../types.js';

/**
 * Parse a crates.io package spec
 *
 * @param spec - Package specification (without crates: prefix)
 * @returns Package spec with name and optional version
 *
 * @example
 * ```ts
 * parseCratesSpec('serde') // { name: 'serde', version: undefined }
 * parseCratesSpec('serde@1.0.0') // { name: 'serde', version: '1.0.0' }
 * ```
 */
export function parseCratesSpec(spec: string): Omit<PackageSpec, 'registry'> {
  // Crates packages are simple: name@version
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
 * Get the crates.io API URL for a crate
 *
 * @param name - Crate name
 * @returns Crates.io API URL
 *
 * @example
 * ```ts
 * cratesApiUrl('serde') // 'https://crates.io/api/v1/crates/serde'
 * ```
 */
export function cratesApiUrl(name: string): string {
  const lowercaseName = name.toLowerCase().replace(/_/g, '-');
  return `https://crates.io/api/v1/crates/${lowercaseName}`;
}
