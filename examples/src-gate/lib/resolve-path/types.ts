/**
 * Type definitions for package resolution
 */

/**
 * Supported package registries
 */
export enum Registry {
  Npm = 'npm',
  PyPI = 'pypi',
  Crates = 'crates',
}

/**
 * A parsed package specification
 */
export interface PackageSpec {
  registry: Registry;
  name: string;
  version?: string;
}

/**
 * A resolved package with repository information
 */
export interface ResolvedPackage {
  registry: Registry;
  name: string;
  version: string;
  repoUrl: string;
  repoDirectory?: string;
  gitRef: string;
}

/**
 * Detected registry information
 */
export interface DetectedRegistry {
  registry: Registry;
  cleanSpec: string;
}

/**
 * Git repository specification
 */
export interface RepoSpec {
  host: string;
  owner: string;
  repo: string;
  gitRef?: string;
}

/**
 * Resolved git repository
 */
export interface ResolvedRepo {
  gitRef: string;
  repoUrl: string;
  displayName: string;
}

/**
 * Result from path resolution
 */
export interface PathResolution {
  spec: string;
  path: string;
  registry: Registry;
  version?: string;
}
