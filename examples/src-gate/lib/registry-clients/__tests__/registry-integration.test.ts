/**
 * Integration tests for registry clients
 *
 * These tests make REAL API calls to npm, PyPI, and crates.io
 * Set INTEGRATION_TESTS=true to run them
 */

import { describe, it, expect } from 'vitest';
import {
  resolveNpmPackage,
  getLatestNpmVersion,
} from '../npm-client.js';
import {
  resolvePyPIPackage,
  getLatestPyPIVersion,
} from '../pypi-client.js';
import {
  resolveCratesPackage,
  getLatestCratesVersion,
} from '../crates-client.js';
import {
  normalizeRepoUrl,
  parseGitHubUrl,
  buildSrcGatePath,
} from '../normalize-url.js';

const runIntegration = process.env.INTEGRATION_TESTS === 'true';

describe('normalizeRepoUrl', () => {
  it('should normalize git:// URLs', () => {
    const result = normalizeRepoUrl('git://github.com/facebook/react.git');
    expect(result).toBe('https://github.com/facebook/react');
  });

  it('should normalize https:// URLs with .git', () => {
    const result = normalizeRepoUrl('https://github.com/facebook/react.git');
    expect(result).toBe('https://github.com/facebook/react');
  });

  it('should normalize git+https:// URLs', () => {
    const result = normalizeRepoUrl('git+https://github.com/facebook/react.git');
    expect(result).toBe('https://github.com/facebook/react');
  });

  it('should normalize SSH URLs', () => {
    const result = normalizeRepoUrl('git@github.com:facebook/react.git');
    expect(result).toBe('https://github.com/facebook/react');
  });

  it('should handle URLs without protocol', () => {
    const result = normalizeRepoUrl('github.com/facebook/react');
    expect(result).toBe('https://github.com/facebook/react');
  });

  it('should remove trailing slashes', () => {
    const result = normalizeRepoUrl('https://github.com/facebook/react/');
    expect(result).toBe('https://github.com/facebook/react');
  });
});

describe('parseGitHubUrl', () => {
  it('should parse GitHub URL', () => {
    const result = parseGitHubUrl('https://github.com/facebook/react');
    expect(result).toEqual({
      owner: 'facebook',
      repo: 'react',
      host: 'github.com',
    });
  });

  it('should parse GitHub URL with .git', () => {
    const result = parseGitHubUrl('git://github.com/facebook/react.git');
    expect(result).toEqual({
      owner: 'facebook',
      repo: 'react',
      host: 'github.com',
    });
  });

  it('should return null for invalid URLs', () => {
    const result = parseGitHubUrl('not-a-url');
    expect(result).toBeNull();
  });
});

describe('buildSrcGatePath', () => {
  it('should build src-gate path from repo URL and git ref', () => {
    const result = buildSrcGatePath(
      'https://github.com/facebook/react',
      'v18.2.0',
      '/Users/test/.opensrc'
    );
    expect(result).toBe('/Users/test/.opensrc/repos/github.com/facebook/react/v18.2.0/');
  });
});

describe.runIf(runIntegration)('NpmClient (integration)', () => {
  it('should resolve react to facebook/react', async () => {
    const result = await resolveNpmPackage('react', '18.2.0');
    expect(result.repoUrl).toBe('https://github.com/facebook/react');
    expect(result.gitRef).toBe('v18.2.0');
  });

  it('should resolve zod to colinhacks/zod', async () => {
    const result = await resolveNpmPackage('zod', '3.22.0');
    expect(result.repoUrl).toBe('https://github.com/colinhacks/zod');
    expect(result.gitRef).toBe('v3.22.0');
  });

  it('should handle scoped packages', async () => {
    const result = await resolveNpmPackage('@babel/core', '7.23.0');
    expect(result.repoUrl).toContain('babel');
    expect(result.gitRef).toBe('v7.23.0');
  });

  it('should handle typescript packages', async () => {
    const result = await resolveNpmPackage('typescript', '5.3.0');
    expect(result.repoUrl).toBe('https://github.com/microsoft/TypeScript');
    expect(result.gitRef).toBe('v5.3.0');
  });

  it('should get latest version', async () => {
    const latest = await getLatestNpmVersion('react');
    expect(latest).toBeTruthy();
    expect(typeof latest).toBe('string');
  });

  it('should throw on nonexistent package', async () => {
    await expect(
      resolveNpmPackage('this-package-definitely-does-not-exist-12345', '1.0.0')
    ).rejects.toThrow();
  });
});

describe.runIf(runIntegration)('PyPIClient (integration)', () => {
  it('should resolve requests to kennethreitz/requests', async () => {
    const result = await resolvePyPIPackage('requests', '2.28.0');
    expect(result.repoUrl).toContain('github.com');
    expect(result.repoUrl).toContain('requests');
    expect(result.gitRef).toBe('v2.28.0');
  });

  it('should resolve django to django/django', async () => {
    const result = await resolvePyPIPackage('django', '4.2.0');
    expect(result.repoUrl).toContain('github.com');
    expect(result.repoUrl).toContain('django');
    expect(result.gitRef).toBe('v4.2.0');
  });

  it('should get latest version', async () => {
    const latest = await getLatestPyPIVersion('requests');
    expect(latest).toBeTruthy();
    expect(typeof latest).toBe('string');
  });

  it('should throw on nonexistent package', async () => {
    await expect(
      resolvePyPIPackage('this-package-definitely-does-not-exist-12345', '1.0.0')
    ).rejects.toThrow();
  });
});

describe.runIf(runIntegration)('CratesClient (integration)', () => {
  it('should resolve serde to serde-rs/serde', async () => {
    const result = await resolveCratesPackage('serde', '1.0.0');
    expect(result.repoUrl).toContain('github.com');
    expect(result.gitRef).toBe('v1.0.0');
  });

  it('should resolve tokio to tokio-rs/tokio', async () => {
    const result = await resolveCratesPackage('tokio', '1.0.0');
    expect(result.repoUrl).toContain('github.com');
    expect(result.repoUrl).toContain('tokio');
    expect(result.gitRef).toBe('v1.0.0');
  });

  it('should get latest version', async () => {
    const latest = await getLatestCratesVersion('serde');
    expect(latest).toBeTruthy();
    expect(typeof latest).toBe('string');
  });

  it('should throw on nonexistent package', async () => {
    await expect(
      resolveCratesPackage('this-package-definitely-does-not-exist-12345', '1.0.0')
    ).rejects.toThrow();
  });
});
