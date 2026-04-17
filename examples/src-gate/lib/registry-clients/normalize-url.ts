/**
 * Normalize repository URLs from various formats to standard GitHub URL
 *
 * Handles:
 * - git://github.com/owner/repo.git
 * - https://github.com/owner/repo.git
 * - git+https://github.com/owner/repo.git
 * - github.com/owner/repo
 * - git@github.com:owner/repo.git
 */

/**
 * Normalize a repository URL to standard HTTPS format
 */
export function normalizeRepoUrl(url: string): string {
  if (!url) {
    throw new Error('Repository URL is required');
  }

  let normalized = url.trim();

  // Remove git+ prefix
  if (normalized.startsWith('git+')) {
    normalized = normalized.slice(4);
  }

  // Convert git:// to https://
  if (normalized.startsWith('git://')) {
    normalized = normalized.replace('git://', 'https://');
  }

  // Convert SSH format: git@github.com:owner/repo.git
  if (normalized.startsWith('git@')) {
    // git@github.com:owner/repo.git -> https://github.com/owner/repo.git
    normalized = normalized.replace('git@', 'https://').replace(/:(?!\/)/, '/');
  }

  // Remove .git suffix
  if (normalized.endsWith('.git')) {
    normalized = normalized.slice(0, -4);
  }

  // Remove trailing slash
  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  // Ensure https:// prefix
  if (!normalized.startsWith('https://') && !normalized.startsWith('http://')) {
    normalized = 'https://' + normalized;
  }

  return normalized;
}

/**
 * Parse GitHub URL into components
 */
export function parseGitHubUrl(url: string): {
  owner: string;
  repo: string;
  host?: string;
} | null {
  try {
    const normalized = normalizeRepoUrl(url);
    const urlObj = new URL(normalized);

    // github.com/owner/repo or github.com/owner/repo/tree/branch/path
    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    if (pathParts.length < 2) {
      return null;
    }

    const owner = pathParts[0];
    const repo = pathParts[1];

    return {
      owner,
      repo,
      host: urlObj.hostname,
    };
  } catch {
    return null;
  }
}

/**
 * Build src-gate path from repository URL and git ref
 */
export function buildSrcGatePath(
  repoUrl: string,
  gitRef: string,
  basePath: string
): string {
  const parsed = parseGitHubUrl(repoUrl);

  if (!parsed) {
    throw new Error(`Invalid GitHub URL: ${repoUrl}`);
  }

  const { host, owner, repo } = parsed;

  // Format: {basePath}/repos/{host}/{owner}/{repo}/{gitRef}/
  return `${basePath}/repos/${host}/${owner}/${repo}/${gitRef}/`;
}
