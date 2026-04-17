/**
 * Tests for registry detection and parsing
 */

import { describe, it, expect } from 'vitest';
import {
  detectRegistry,
  isGitRepoUrl,
  normalizeRepoUrl,
} from '../registries/mod.js';
import { parseNpmSpec } from '../registries/npm.js';
import { parsePypiSpec } from '../registries/pypi.js';
import { parseCratesSpec } from '../registries/crates.js';
import { parseRepoSpec, isRepoSpec } from '../registries/repo.js';
import { Registry } from '../types.js';

describe('detectRegistry', () => {
  it('should detect npm by default', () => {
    const result = detectRegistry('zod');
    expect(result.registry).toBe(Registry.Npm);
    expect(result.cleanSpec).toBe('zod');
  });

  it('should detect npm with explicit prefix', () => {
    const result = detectRegistry('npm:zod');
    expect(result.registry).toBe(Registry.Npm);
    expect(result.cleanSpec).toBe('zod');
  });

  it('should detect pypi with prefix', () => {
    const result = detectRegistry('pypi:requests');
    expect(result.registry).toBe(Registry.PyPI);
    expect(result.cleanSpec).toBe('requests');
  });

  it('should detect pip prefix', () => {
    const result = detectRegistry('pip:requests');
    expect(result.registry).toBe(Registry.PyPI);
    expect(result.cleanSpec).toBe('requests');
  });

  it('should detect python prefix', () => {
    const result = detectRegistry('python:requests');
    expect(result.registry).toBe(Registry.PyPI);
    expect(result.cleanSpec).toBe('requests');
  });

  it('should detect crates with prefix', () => {
    const result = detectRegistry('crates:serde');
    expect(result.registry).toBe(Registry.Crates);
    expect(result.cleanSpec).toBe('serde');
  });

  it('should detect cargo prefix', () => {
    const result = detectRegistry('cargo:serde');
    expect(result.registry).toBe(Registry.Crates);
    expect(result.cleanSpec).toBe('serde');
  });

  it('should detect rust prefix', () => {
    const result = detectRegistry('rust:serde');
    expect(result.registry).toBe(Registry.Crates);
    expect(result.cleanSpec).toBe('serde');
  });

  it('should trim whitespace', () => {
    const result = detectRegistry('  zod  ');
    expect(result.registry).toBe(Registry.Npm);
    expect(result.cleanSpec).toBe('zod');
  });

  it('should handle case-insensitive prefixes', () => {
    const result = detectRegistry('PYPI:requests');
    expect(result.registry).toBe(Registry.PyPI);
    expect(result.cleanSpec).toBe('requests');
  });
});

describe('parseNpmSpec', () => {
  it('should parse simple package name', () => {
    const result = parseNpmSpec('zod');
    expect(result.name).toBe('zod');
    expect(result.version).toBeUndefined();
  });

  it('should parse package with version', () => {
    const result = parseNpmSpec('zod@3.22.0');
    expect(result.name).toBe('zod');
    expect(result.version).toBe('3.22.0');
  });

  it('should parse scoped package without version', () => {
    const result = parseNpmSpec('@babel/core');
    expect(result.name).toBe('@babel/core');
    expect(result.version).toBeUndefined();
  });

  it('should parse scoped package with version', () => {
    const result = parseNpmSpec('@babel/core@7.0.0');
    expect(result.name).toBe('@babel/core');
    expect(result.version).toBe('7.0.0');
  });

  it('should handle scoped package with @ in version', () => {
    const result = parseNpmSpec('@babel/core@7.0.0-beta.1');
    expect(result.name).toBe('@babel/core');
    expect(result.version).toBe('7.0.0-beta.1');
  });
});

describe('parsePypiSpec', () => {
  it('should parse simple package name', () => {
    const result = parsePypiSpec('requests');
    expect(result.name).toBe('requests');
    expect(result.version).toBeUndefined();
  });

  it('should parse package with version', () => {
    const result = parsePypiSpec('requests@2.31.0');
    expect(result.name).toBe('requests');
    expect(result.version).toBe('2.31.0');
  });
});

describe('parseCratesSpec', () => {
  it('should parse simple crate name', () => {
    const result = parseCratesSpec('serde');
    expect(result.name).toBe('serde');
    expect(result.version).toBeUndefined();
  });

  it('should parse crate with version', () => {
    const result = parseCratesSpec('serde@1.0.0');
    expect(result.name).toBe('serde');
    expect(result.version).toBe('1.0.0');
  });
});

describe('isGitRepoUrl', () => {
  it('should detect github URLs', () => {
    expect(isGitRepoUrl('https://github.com/owner/repo')).toBe(true);
  });

  it('should detect gitlab URLs', () => {
    expect(isGitRepoUrl('https://gitlab.com/owner/repo')).toBe(true);
  });

  it('should detect bitbucket URLs', () => {
    expect(isGitRepoUrl('https://bitbucket.org/owner/repo')).toBe(true);
  });

  it('should reject other URLs', () => {
    expect(isGitRepoUrl('https://example.com/owner/repo')).toBe(false);
  });
});

describe('normalizeRepoUrl', () => {
  it('should remove trailing slash', () => {
    const result = normalizeRepoUrl('https://github.com/owner/repo/');
    expect(result).toBe('https://github.com/owner/repo');
  });

  it('should remove .git suffix', () => {
    const result = normalizeRepoUrl('https://github.com/owner/repo.git');
    expect(result).toBe('https://github.com/owner/repo');
  });

  it('should remove /tree/ ref', () => {
    const result = normalizeRepoUrl('https://github.com/owner/repo/tree/main/src');
    expect(result).toBe('https://github.com/owner/repo');
  });

  it('should remove /blob/ ref', () => {
    const result = normalizeRepoUrl('https://github.com/owner/repo/blob/main/file.rs');
    expect(result).toBe('https://github.com/owner/repo');
  });

  it('should leave clean URL unchanged', () => {
    const result = normalizeRepoUrl('https://github.com/owner/repo');
    expect(result).toBe('https://github.com/owner/repo');
  });

  it('should handle both trailing slash and .git', () => {
    const result = normalizeRepoUrl('https://github.com/owner/repo.git/');
    expect(result).toBe('https://github.com/owner/repo');
  });
});

describe('parseRepoSpec', () => {
  it('should parse simple owner/repo', () => {
    const result = parseRepoSpec('owner/repo');
    expect(result).toEqual({
      host: 'github.com',
      owner: 'owner',
      repo: 'repo',
      gitRef: undefined,
    });
  });

  it('should parse owner/repo@ref', () => {
    const result = parseRepoSpec('owner/repo@main');
    expect(result).toEqual({
      host: 'github.com',
      owner: 'owner',
      repo: 'repo',
      gitRef: 'main',
    });
  });

  it('should parse owner/repo#ref', () => {
    const result = parseRepoSpec('owner/repo#main');
    expect(result).toEqual({
      host: 'github.com',
      owner: 'owner',
      repo: 'repo',
      gitRef: 'main',
    });
  });

  it('should parse github: prefix', () => {
    const result = parseRepoSpec('github:owner/repo');
    expect(result).toEqual({
      host: 'github.com',
      owner: 'owner',
      repo: 'repo',
      gitRef: undefined,
    });
  });

  it('should parse gitlab: prefix', () => {
    const result = parseRepoSpec('gitlab:owner/repo');
    expect(result).toEqual({
      host: 'gitlab.com',
      owner: 'owner',
      repo: 'repo',
      gitRef: undefined,
    });
  });

  it('should parse bitbucket: prefix', () => {
    const result = parseRepoSpec('bitbucket:owner/repo');
    expect(result).toEqual({
      host: 'bitbucket.org',
      owner: 'owner',
      repo: 'repo',
      gitRef: undefined,
    });
  });

  it('should parse full HTTPS URL', () => {
    const result = parseRepoSpec('https://github.com/owner/repo');
    expect(result).toEqual({
      host: 'github.com',
      owner: 'owner',
      repo: 'repo',
      gitRef: undefined,
    });
  });

  it('should parse HTTPS URL with .git', () => {
    const result = parseRepoSpec('https://github.com/owner/repo.git');
    expect(result).toEqual({
      host: 'github.com',
      owner: 'owner',
      repo: 'repo',
      gitRef: undefined,
    });
  });

  it('should parse HTTPS URL with tree ref', () => {
    const result = parseRepoSpec('https://github.com/owner/repo/tree/main/src');
    expect(result).toEqual({
      host: 'github.com',
      owner: 'owner',
      repo: 'repo',
      gitRef: 'main',
    });
  });

  it('should parse host/owner/repo format', () => {
    const result = parseRepoSpec('gitlab.com/owner/repo');
    expect(result).toEqual({
      host: 'gitlab.com',
      owner: 'owner',
      repo: 'repo',
      gitRef: undefined,
    });
  });

  it('should return undefined for invalid specs', () => {
    expect(parseRepoSpec('not-a-repo')).toBeUndefined();
    expect(parseRepoSpec('@invalid')).toBeUndefined();
    expect(parseRepoSpec('owner')).toBeUndefined();
  });
});

describe('isRepoSpec', () => {
  it('should return true for valid repo specs', () => {
    expect(isRepoSpec('owner/repo')).toBe(true);
    expect(isRepoSpec('owner/repo@main')).toBe(true);
    expect(isRepoSpec('https://github.com/owner/repo')).toBe(true);
    expect(isRepoSpec('github:owner/repo')).toBe(true);
  });

  it('should return false for invalid repo specs', () => {
    expect(isRepoSpec('not-a-repo')).toBe(false);
    expect(isRepoSpec('zod')).toBe(false); // npm package
    expect(isRepoSpec('@invalid')).toBe(false);
  });
});
