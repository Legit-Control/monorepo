/**
 * Tests for path resolution
 */

import { describe, it, expect } from 'vitest';
import { parsePackageSpec, resolvePath, resolvePaths } from '../index.js';
import { Registry } from '../types.js';

describe('parsePackageSpec', () => {
  it('should parse simple npm package', () => {
    const result = parsePackageSpec('zod');
    expect(result).toEqual({
      registry: Registry.Npm,
      name: 'zod',
      version: undefined,
    });
  });

  it('should parse npm package with version', () => {
    const result = parsePackageSpec('zod@3.22.0');
    expect(result).toEqual({
      registry: Registry.Npm,
      name: 'zod',
      version: '3.22.0',
    });
  });

  it('should parse scoped npm package', () => {
    const result = parsePackageSpec('@babel/core');
    expect(result).toEqual({
      registry: Registry.Npm,
      name: '@babel/core',
      version: undefined,
    });
  });

  it('should parse scoped npm package with version', () => {
    const result = parsePackageSpec('@babel/core@7.0.0');
    expect(result).toEqual({
      registry: Registry.Npm,
      name: '@babel/core',
      version: '7.0.0',
    });
  });

  it('should parse pypi package with prefix', () => {
    const result = parsePackageSpec('pypi:requests');
    expect(result).toEqual({
      registry: Registry.PyPI,
      name: 'requests',
      version: undefined,
    });
  });

  it('should parse pypi package with version', () => {
    const result = parsePackageSpec('pypi:requests@2.31.0');
    expect(result).toEqual({
      registry: Registry.PyPI,
      name: 'requests',
      version: '2.31.0',
    });
  });

  it('should parse crates with prefix', () => {
    const result = parsePackageSpec('crates:serde');
    expect(result).toEqual({
      registry: Registry.Crates,
      name: 'serde',
      version: undefined,
    });
  });

  it('should parse crates with version', () => {
    const result = parsePackageSpec('crates:serde@1.0.0');
    expect(result).toEqual({
      registry: Registry.Crates,
      name: 'serde',
      version: '1.0.0',
    });
  });

  it('should parse repo spec', () => {
    const result = parsePackageSpec('owner/repo');
    expect(result.registry).toBe('repo');
    expect(result.name).toBe('owner/repo');
  });

  it('should parse repo spec with ref', () => {
    const result = parsePackageSpec('owner/repo@main');
    expect(result.registry).toBe('repo');
    expect(result.name).toBe('owner/repo@main');
  });

  it('should parse full GitHub URL as repo', () => {
    const result = parsePackageSpec('https://github.com/owner/repo');
    expect(result.registry).toBe('repo');
    expect(result.name).toBe('https://github.com/owner/repo');
  });

  it('should trim whitespace', () => {
    const result = parsePackageSpec('  zod  ');
    expect(result).toEqual({
      registry: Registry.Npm,
      name: 'zod',
      version: undefined,
    });
  });
});

describe('resolvePath', () => {
  const basePath = '/Users/test/src-gate';

  it('should resolve simple npm package', () => {
    const result = resolvePath('zod', basePath);
    expect(result.spec).toBe('zod');
    expect(result.path).toBe('/Users/test/src-gate/repos/npm-registry/zod');
    expect(result.registry).toBe(Registry.Npm);
    expect(result.version).toBeUndefined();
  });

  it('should resolve npm package with version', () => {
    const result = resolvePath('zod@3.22.0', basePath);
    expect(result.spec).toBe('zod@3.22.0');
    expect(result.path).toBe('/Users/test/src-gate/repos/npm-registry/zod');
    expect(result.registry).toBe(Registry.Npm);
    expect(result.version).toBe('3.22.0');
  });

  it('should resolve scoped npm package', () => {
    const result = resolvePath('@babel/core', basePath);
    expect(result.spec).toBe('@babel/core');
    expect(result.path).toBe('/Users/test/src-gate/repos/npm-registry/@babel/core');
    expect(result.registry).toBe(Registry.Npm);
  });

  it('should resolve pypi package', () => {
    const result = resolvePath('pypi:requests', basePath);
    expect(result.spec).toBe('pypi:requests');
    expect(result.path).toBe('/Users/test/src-gate/repos/pypi-org/requests');
    expect(result.registry).toBe(Registry.PyPI);
  });

  it('should resolve crates', () => {
    const result = resolvePath('crates:serde', basePath);
    expect(result.spec).toBe('crates:serde');
    expect(result.path).toBe('/Users/test/src-gate/repos/crates-io/serde');
    expect(result.registry).toBe(Registry.Crates);
  });

  it('should resolve repo spec to github.com path', () => {
    const result = resolvePath('owner/repo', basePath);
    expect(result.spec).toBe('owner/repo');
    expect(result.path).toBe('/Users/test/src-gate/repos/github.com/owner/repo');
    expect(result.registry).toBe('repo');
  });

  it('should resolve repo spec with ref', () => {
    const result = resolvePath('owner/repo@main', basePath);
    expect(result.spec).toBe('owner/repo@main');
    expect(result.path).toBe('/Users/test/src-gate/repos/github.com/owner/repo');
    expect(result.registry).toBe('repo');
    expect(result.version).toBe('main');
  });

  it('should resolve full GitHub URL', () => {
    const result = resolvePath('https://github.com/owner/repo', basePath);
    expect(result.spec).toBe('https://github.com/owner/repo');
    expect(result.path).toBe('/Users/test/src-gate/repos/github.com/owner/repo');
    expect(result.registry).toBe('repo');
  });

  it('should resolve gitlab URL', () => {
    const result = resolvePath('https://gitlab.com/owner/repo', basePath);
    expect(result.spec).toBe('https://gitlab.com/owner/repo');
    expect(result.path).toBe('/Users/test/src-gate/repos/gitlab.com/owner/repo');
    expect(result.registry).toBe('repo');
  });

  it('should resolve bitbucket URL', () => {
    const result = resolvePath('https://bitbucket.org/owner/repo', basePath);
    expect(result.spec).toBe('https://bitbucket.org/owner/repo');
    expect(result.path).toBe('/Users/test/src-gate/repos/bitbucket.org/owner/repo');
    expect(result.registry).toBe('repo');
  });

  it('should handle github: prefix', () => {
    const result = resolvePath('github:owner/repo', basePath);
    expect(result.spec).toBe('github:owner/repo');
    expect(result.path).toBe('/Users/test/src-gate/repos/github.com/owner/repo');
    expect(result.registry).toBe('repo');
  });

  it('should handle gitlab: prefix', () => {
    const result = resolvePath('gitlab:owner/repo', basePath);
    expect(result.spec).toBe('gitlab:owner/repo');
    expect(result.path).toBe('/Users/test/src-gate/repos/gitlab.com/owner/repo');
    expect(result.registry).toBe('repo');
  });

  it('should handle invalid spec as npm package', () => {
    const result = resolvePath('invalid-spec', basePath);
    expect(result.registry).toBe(Registry.Npm);
    expect(result.path).toBe('/Users/test/src-gate/repos/npm-registry/invalid-spec');
  });
});

describe('resolvePaths', () => {
  const basePath = '/Users/test/src-gate';

  it('should resolve multiple packages', () => {
    const results = resolvePaths(['zod', 'react', 'next'], basePath);
    expect(results).toHaveLength(3);
    expect(results[0].spec).toBe('zod');
    expect(results[1].spec).toBe('react');
    expect(results[2].spec).toBe('next');
  });

  it('should resolve mixed package types', () => {
    const results = resolvePaths(
      ['zod', 'pypi:requests', 'owner/repo', 'crates:serde'],
      basePath
    );
    expect(results).toHaveLength(4);
    expect(results[0].registry).toBe(Registry.Npm);
    expect(results[1].registry).toBe(Registry.PyPI);
    expect(results[2].registry).toBe('repo');
    expect(results[3].registry).toBe(Registry.Crates);
  });

  it('should preserve order of input specs', () => {
    const results = resolvePaths(['zod', 'react', 'next'], basePath);
    expect(results[0].spec).toBe('zod');
    expect(results[1].spec).toBe('react');
    expect(results[2].spec).toBe('next');
  });
});
