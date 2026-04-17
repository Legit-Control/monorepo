/**
 * PyPI registry package resolution
 */

import { PackageSpec } from '../types.js';

/**
 * Parse a PyPI package spec
 *
 * @param spec - Package specification (without pypi: prefix)
 * @returns Package spec with name and optional version
 *
 * @example
 * ```ts
 * parsePypiSpec('requests') // { name: 'requests', version: undefined }
 * parsePypiSpec('requests@2.31.0') // { name: 'requests', version: '2.31.0' }
 * ```
 */
export function parsePypiSpec(spec: string): Omit<PackageSpec, 'registry'> {
  // PyPI packages are simple: name@version
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
 * Get the PyPI registry URL for a package
 *
 * @param name - Package name
 * @returns PyPI registry URL
 *
 * @example
 * ```ts
 * pypiRegistryUrl('requests') // 'https://pypi.org/pypi/requests/json'
 * ```
 */
export function pypiRegistryUrl(name: string): string {
  const lowercaseName = name.toLowerCase().replace(/_/g, '-');
  return `https://pypi.org/pypi/${lowercaseName}/json`;
}
