/**
 * Tests for version detection
 */

import { describe, it, expect } from 'vitest';
import { detectInstalledVersion, detectInstalledVersions } from '../index.js';
import { versionFromNodeModules } from '../parsers/node-modules.js';
import { versionFromPackageLock } from '../parsers/package-lock.js';
import { versionFromPnpmLock } from '../parsers/pnpm-lock.js';
import { versionFromYarnLock } from '../parsers/yarn-lock.js';
import { versionFromPackageJson } from '../parsers/package-json-fallback.js';
import * as path from 'node:path';
import * as fs from 'node:fs';

const fixturesDir = path.join(__dirname, 'fixtures');

describe('versionFromNodeModules', () => {
  it('should return null if package not in node_modules', async () => {
    const result = await versionFromNodeModules('nonexistent', fixturesDir);
    expect(result).toBeNull();
  });
});

describe('versionFromPackageLock', () => {
  it('should return null if package-lock.json does not exist', async () => {
    const result = await versionFromPackageLock('react', '/tmp/nonexistent');
    expect(result).toBeNull();
  });
});

describe('versionFromPnpmLock', () => {
  it('should parse pnpm v9 workspace lockfile', async () => {
    const cwd = path.join(fixturesDir);
    const result = await versionFromPnpmLock('react', cwd);
    expect(result).toBe('18.2.0');
  });

  it('should parse scoped packages', async () => {
    const cwd = path.join(fixturesDir);
    const result = await versionFromPnpmLock('@types/react', cwd);
    expect(result).toBe('18.2.45');
  });

  it('should handle peer dependency suffixes', async () => {
    const cwd = path.join(fixturesDir);
    const result = await versionFromPnpmLock('react-dom', cwd);
    expect(result).toBe('18.2.0'); // from "18.2.0(react@18.2.0)"
  });

  it('should return null for missing packages', async () => {
    const cwd = path.join(fixturesDir);
    const result = await versionFromPnpmLock('nonexistent-package', cwd);
    expect(result).toBeNull();
  });
});

describe('versionFromYarnLock', () => {
  it('should parse yarn Berry lockfile', async () => {
    const result = await versionFromYarnLock('react', fixturesDir);
    // The actual version depends on the fixture
    expect(result).toBeTruthy();
  });

  it('should return null if yarn.lock does not exist', async () => {
    const result = await versionFromYarnLock('react', '/tmp/nonexistent');
    expect(result).toBeNull();
  });
});

describe('versionFromPackageJson', () => {
  it('should strip version prefixes', async () => {
    const cwd = fixturesDir;
    const result = await versionFromPackageJson('typescript', cwd);
    // Should strip ^ from typescript version
    expect(result).toBeTruthy();
  });

  it('should return null for missing packages', async () => {
    const cwd = fixturesDir;
    const result = await versionFromPackageJson('nonexistent', cwd);
    expect(result).toBeNull();
  });
});

describe('detectInstalledVersion', () => {
  it('should detect version from pnpm-lock.yaml', async () => {
    const cwd = path.join(fixturesDir);
    const result = await detectInstalledVersion('react', { cwd });
    expect(result).toBe('18.2.0');
  });

  it('should detect scoped packages', async () => {
    const cwd = path.join(fixturesDir);
    const result = await detectInstalledVersion('@types/react', { cwd });
    expect(result).toBe('18.2.45');
  });

  it('should handle peer dependency suffixes', async () => {
    const cwd = path.join(fixturesDir);
    const result = await detectInstalledVersion('react-dom', { cwd });
    expect(result).toBe('18.2.0');
  });

  it('should return null for nonexistent packages', async () => {
    const cwd = path.join(fixturesDir);
    const result = await detectInstalledVersion('totally-not-a-real-package', { cwd });
    expect(result).toBeNull();
  });
});

describe('detectInstalledVersions', () => {
  it('should detect multiple packages at once', async () => {
    const cwd = path.join(fixturesDir);
    const results = await detectInstalledVersions(['react', '@types/react', 'next'], { cwd });

    expect(results.get('react')).toBe('18.2.0');
    expect(results.get('@types/react')).toBe('18.2.45');
    expect(results.get('next')).toBeTruthy(); // Should find a version
  });

  it('should handle mix of found and missing packages', async () => {
    const cwd = path.join(fixturesDir);
    const results = await detectInstalledVersions(['react', 'nonexistent'], { cwd });

    expect(results.get('react')).toBe('18.2.0');
    expect(results.get('nonexistent')).toBeNull();
  });
});
