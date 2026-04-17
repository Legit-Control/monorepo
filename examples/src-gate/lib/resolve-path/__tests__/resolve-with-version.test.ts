/**
 * Integration tests for resolvePackageWithVersion
 */

import { describe, it, expect } from 'vitest';
import { resolvePackageWithVersion } from '../index.js';
import * as path from 'node:path';

const runIntegration = process.env.INTEGRATION_TESTS === 'true';

describe.runIf(runIntegration)('resolvePackageWithVersion (integration)', () => {
  const fixturesDir = path.join(__dirname, '..', '..', 'resolve-version', '__tests__', 'fixtures');
  const basePath = '/tmp/test-src-gate';

  it('should resolve react with version detection from lockfile', async () => {
    const result = await resolvePackageWithVersion('react', {
      cwd: fixturesDir,
      basePath,
    });

    expect(result.spec).toBe('react');
    expect(result.version).toBe('18.2.0');
    expect(result.gitRef).toBe('v18.2.0');
    expect(result.registry).toBe('npm');
    expect(result.path).toBe('/tmp/test-src-gate/repos/github.com/facebook/react/v18.2.0/');
  });

  it('should resolve scoped packages', async () => {
    const result = await resolvePackageWithVersion('@types/react', {
      cwd: fixturesDir,
      basePath,
    });

    expect(result.spec).toBe('@types/react');
    expect(result.version).toBe('18.2.45');
    expect(result.gitRef).toBe('v18.2.45');
    expect(result.path).toContain('DefinitelyTyped');
  });

  it('should handle explicit version specification', async () => {
    const result = await resolvePackageWithVersion('react@18.2.0', {
      cwd: fixturesDir,
      basePath,
    });

    expect(result.spec).toBe('react@18.2.0');
    expect(result.version).toBe('18.2.0');
    expect(result.gitRef).toBe('v18.2.0');
    expect(result.path).toBe('/tmp/test-src-gate/repos/github.com/facebook/react/v18.2.0/');
  });

  it('should resolve repo specs directly', async () => {
    const result = await resolvePackageWithVersion('facebook/react', {
      basePath,
    });

    expect(result.spec).toBe('facebook/react');
    expect(result.registry).toBe('repo');
    expect(result.version).toBe('main');
    expect(result.gitRef).toBe('main');
    expect(result.path).toBe('/tmp/test-src-gate/repos/github.com/facebook/react/main/');
  });

  it('should resolve repo specs with git ref', async () => {
    const result = await resolvePackageWithVersion('facebook/react@v18.2.0', {
      basePath,
    });

    expect(result.spec).toBe('facebook/react@v18.2.0');
    expect(result.registry).toBe('repo');
    expect(result.version).toBe('v18.2.0');
    expect(result.gitRef).toBe('v18.2.0');
    expect(result.path).toBe('/tmp/test-src-gate/repos/github.com/facebook/react/v18.2.0/');
  });

  it('should throw error for nonexistent packages', async () => {
    await expect(
      resolvePackageWithVersion('this-package-does-not-exist-12345', {
        cwd: fixturesDir,
        basePath,
      })
    ).rejects.toThrow();
  });
});
