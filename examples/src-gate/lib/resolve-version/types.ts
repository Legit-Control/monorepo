/**
 * Version detection from lockfiles and node_modules
 */

/**
 * Options for version detection
 */
export interface DetectVersionOptions {
  /**
   * Current working directory to search for lockfiles
   * Defaults to process.cwd()
   */
  cwd?: string;
}

/**
 * Result from version detection
 */
export interface VersionDetectionResult {
  /**
   * The detected version
   */
  version: string;

  /**
   * Source where the version was found
   */
  source: 'node_modules' | 'package-lock' | 'pnpm-lock' | 'yarn-lock' | 'package-json';
}

/**
 * Lockfile type
 */
export enum LockfileType {
  PackageLock = 'package-lock',
  PnpmLock = 'pnpm-lock',
  YarnLock = 'yarn-lock',
}
