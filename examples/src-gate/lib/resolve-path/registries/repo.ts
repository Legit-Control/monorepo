/**
 * Git repository specification parsing
 */

import { RepoSpec, ResolvedRepo } from '../types.js';

const SUPPORTED_HOSTS = ['github.com', 'gitlab.com', 'bitbucket.org'];
const DEFAULT_HOST = 'github.com';

/**
 * Parse a repository specification
 *
 * @param spec - Repository specification (owner/repo, URL, etc.)
 * @returns Parsed repository spec or undefined if invalid
 *
 * @example
 * ```ts
 * parseRepoSpec('owner/repo') // { host: 'github.com', owner: 'owner', repo: 'repo' }
 * parseRepoSpec('owner/repo@main') // { host: 'github.com', owner: 'owner', repo: 'repo', gitRef: 'main' }
 * parseRepoSpec('https://github.com/owner/repo') // { host: 'github.com', owner: 'owner', repo: 'repo' }
 * parseRepoSpec('gitlab:owner/repo') // { host: 'gitlab.com', owner: 'owner', repo: 'repo' }
 * ```
 */
export function parseRepoSpec(spec: string): RepoSpec | undefined {
  const input = spec.trim();
  let remaining = input;
  let gitRef: string | undefined;
  let host = DEFAULT_HOST;

  // Handle shorthand prefixes
  if (remaining.startsWith('github:')) {
    host = 'github.com';
    remaining = remaining.slice(7);
  } else if (remaining.startsWith('gitlab:')) {
    host = 'gitlab.com';
    remaining = remaining.slice(7);
  } else if (remaining.startsWith('bitbucket:')) {
    host = 'bitbucket.org';
    remaining = remaining.slice(10);
  } else if (remaining.startsWith('http://') || remaining.startsWith('https://')) {
    // Full URL
    try {
      const url = new URL(remaining);
      host = url.hostname;
      const pathParts = url.pathname
        .split('/')
        .filter((p) => p.length > 0);

      if (pathParts.length < 2) {
        return undefined;
      }

      const owner = pathParts[0];
      let repo = pathParts[1];

      // Remove .git suffix
      if (repo.endsWith('.git')) {
        repo = repo.slice(0, -4);
      }

      // Extract ref from /tree/ or /blob/ paths
      if (pathParts.length >= 4 && (pathParts[2] === 'tree' || pathParts[2] === 'blob')) {
        gitRef = pathParts[3];
      }

      return {
        host,
        owner,
        repo,
        gitRef,
      };
    } catch {
      return undefined;
    }
  } else if (SUPPORTED_HOSTS.some((h) => remaining.startsWith(`${h}/`))) {
    // host/owner/repo format
    const slashIdx = remaining.indexOf('/');
    if (slashIdx > 0) {
      host = remaining.slice(0, slashIdx);
      remaining = remaining.slice(slashIdx + 1);
    }
  } else if (remaining.startsWith('@') || remaining.split('/').length !== 2) {
    // Invalid format
    return undefined;
  }

  // Extract ref from @ or #
  const atIndex = remaining.indexOf('@');
  if (atIndex > 0) {
    gitRef = remaining.slice(atIndex + 1);
    remaining = remaining.slice(0, atIndex);
  } else {
    const hashIdx = remaining.indexOf('#');
    if (hashIdx > 0) {
      gitRef = remaining.slice(hashIdx + 1);
      remaining = remaining.slice(0, hashIdx);
    }
  }

  // Split owner/repo
  const parts = remaining.split('/');
  if (parts.length !== 2) {
    return undefined;
  }

  const [owner, repo] = parts;

  return {
    host,
    owner,
    repo,
    gitRef,
  };
}

/**
 * Check if a spec is a repository specification
 *
 * @param spec - Specification string to check
 * @returns True if the spec appears to be a repo spec
 */
export function isRepoSpec(spec: string): boolean {
  return parseRepoSpec(spec) !== undefined;
}

/**
 * Resolve a repository specification to a URL
 *
 * @param spec - Repository specification
 * @returns Resolved repository information
 */
export function resolveRepo(spec: RepoSpec): ResolvedRepo {
  const repoUrl = `https://${spec.host}/${spec.owner}/${spec.repo}`;
  const displayName = `${spec.owner}/${spec.repo}`;
  const gitRef = spec.gitRef || 'main';

  return {
    gitRef,
    repoUrl,
    displayName,
  };
}
