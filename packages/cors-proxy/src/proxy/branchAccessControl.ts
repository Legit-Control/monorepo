import { AuthenticatedRequest } from '../types';

export interface AccessControlResult {
  allowed: boolean;
  reason?: string;
  repository?: string;
  ref?: string;
  operation?: string;
}

export interface BranchPattern {
  pattern: string;
  type: 'exact' | 'wildcard' | 'regex';
  isRead: boolean;
  isWrite: boolean;
}

export class BranchAccessControl {
  constructor() {}

  /**
   * Check if a request is allowed based on branch permissions
   */
  public checkAccess(req: AuthenticatedRequest, operation: 'read' | 'write'): AccessControlResult {
    try {
      const repository = this.extractRepositoryFromRequest(req);
      const ref = this.extractRefFromRequest(req);

      if (!repository) {
        return {
          allowed: false,
          reason: 'Unable to determine repository from request',
          operation
        };
      }

      // Check if user has access to the repository
      if (!this.hasRepositoryAccess(req.user.permissions, repository)) {
        return {
          allowed: false,
          reason: `Access denied to repository: ${repository}`,
          repository,
          operation
        };
      }

      // If no specific ref is required (e.g., general repo access), allow
      if (!ref) {
        return {
          allowed: true,
          repository,
          operation
        };
      }

      // Check branch access
      const branchAccess = this.checkBranchAccess(req.user.permissions, repository, ref, operation);
      return {
        ...branchAccess,
        repository,
        ref,
        operation
      };
    } catch (error) {
      console.error('branch-access-control Access control check failed', error);
      return {
        allowed: false,
        reason: 'Access control validation failed',
        operation
      };
    }
  }

  /**
   * Check if user has access to a specific repository
   */
  private hasRepositoryAccess(permissions: AuthenticatedRequest['user']['permissions'], repository: string): boolean {
    // Direct repository match
    if (permissions.repositories.includes(repository)) {
      return true;
    }

    // Wildcard repository patterns
    return permissions.repositories.some(pattern => this.matchesPattern(repository, pattern));
  }

  /**
   * Check if user has access to a specific branch/ref
   */
  private checkBranchAccess(
    permissions: AuthenticatedRequest['user']['permissions'],
    repository: string,
    ref: string,
    operation: 'read' | 'write'
  ): AccessControlResult {
    const branchPatterns = permissions.branches[repository];
    if (!branchPatterns || branchPatterns.length === 0) {
      return {
        allowed: false,
        reason: `No branch permissions configured for repository: ${repository}`
      };
    }

    // Find matching patterns
    const matchingPatterns = branchPatterns.filter(pattern => this.matchesRef(ref, pattern));

    if (matchingPatterns.length === 0) {
      return {
        allowed: false,
        reason: `Access denied to ref: ${ref}`
      };
    }

    // Determine if operation is allowed based on matching patterns
    const isReadOperation = operation === 'read';
    const isWriteOperation = operation === 'write';

    // Check if any pattern allows the requested operation
    const allowsOperation = matchingPatterns.some(pattern => {
      // Default is read+write access unless specified otherwise
      const isReadOnly = pattern.startsWith('read:');
      const isWriteOnly = pattern.startsWith('write:');

      if (isReadOperation) return !isWriteOnly;
      if (isWriteOperation) return !isReadOnly;
      return true;
    });

    if (!allowsOperation) {
      return {
        allowed: false,
        reason: `Operation '${operation}' not allowed for ref: ${ref}`
      };
    }

    return {
      allowed: true
    };
  }

  /**
   * Extract repository name from git request
   */
  private extractRepositoryFromRequest(req: AuthenticatedRequest): string | null {
    const url = req.url;

    // GitHub API format: /repos/owner/repo/git/...
    const githubMatch = url.match(/\/repos\/([^\/]+)\/([^\/]+)\/git/);
    if (githubMatch) {
      return `${githubMatch[1]}/${githubMatch[2]}`;
    }

    // Direct git HTTP format: /owner/repo/git/...
    const directMatch = url.match(/\/([^\/]+)\/([^\/]+)\/git/);
    if (directMatch) {
      return `${directMatch[1]}/${directMatch[2]}`;
    }

    console.warn('branch-access-control Unable to extract repository from request URL', { url });
    return null;
  }

  /**
   * Extract ref/branch name from git request
   */
  private extractRefFromRequest(req: AuthenticatedRequest): string | null {
    const url = req.url;
    const service = req.service;

    // For info/refs requests, we don't need a specific ref yet
    if (url.includes('/info/refs')) {
      return null;
    }

    // For git-upload-pack and git-receive-pack, extract ref from request body or headers
    if (service === 'git-upload-pack' || service === 'git-receive-pack') {
      // Try to extract from request body if available
      if (req.body) {
        const bodyStr = req.body.toString('utf8');
        const refMatch = bodyStr.match(/refs\/(heads|tags)\/([^\x00]+)/);
        if (refMatch) {
          return `refs/${refMatch[1]}/${refMatch[2].trim()}`;
        }
      }

      // For upload-pack (fetch), we can allow access to check refs first
      return null;
    }

    // Extract ref from URL query parameters or path
    const refMatch = url.match(/refs\/(heads|tags)\/([^\/]+)/);
    if (refMatch) {
      return `refs/${refMatch[1]}/${refMatch[2]}`;
    }

    return null;
  }

  /**
   * Check if a string matches a pattern (supports wildcards)
   */
  private matchesPattern(str: string, pattern: string): boolean {
    if (pattern === '*') return true;

    // Convert wildcard pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(str);
  }

  /**
   * Check if a ref matches a branch pattern
   */
  private matchesRef(ref: string, pattern: string): boolean {
    // Normalize both ref and pattern
    const normalizedRef = ref.startsWith('refs/') ? ref : `refs/heads/${ref}`;
    const normalizedPattern = pattern.startsWith('refs/') ? pattern : `refs/heads/${pattern}`;

    // Handle operation prefixes
    let cleanPattern = normalizedPattern;
    let isReadOnly = false;
    let isWriteOnly = false;

    if (cleanPattern.startsWith('read:')) {
      isReadOnly = true;
      cleanPattern = cleanPattern.substring(5);
    } else if (cleanPattern.startsWith('write:')) {
      isWriteOnly = true;
      cleanPattern = cleanPattern.substring(6);
    }

    // Pattern matching
    if (cleanPattern.includes('*')) {
      const regexPattern = cleanPattern
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(normalizedRef);
    }

    // Exact match
    return normalizedRef === cleanPattern;
  }

  /**
   * Create access control middleware
   */
  public createAccessMiddleware(operation: 'read' | 'write') {
    return (req: AuthenticatedRequest, res: any, next: any) => {
      const result = this.checkAccess(req, operation);

      if (!result.allowed) {
        console.warn('branch-access-control Access denied', {
          userId: req.user.id,
          repository: result.repository,
          ref: result.ref,
          operation: result.operation,
          reason: result.reason
        });

        return res.status(403).json({
          error: 'Access denied',
          message: result.reason,
          code: 'ACCESS_DENIED',
          details: {
            repository: result.repository,
            ref: result.ref,
            operation: result.operation
          }
        });
      }

      console.log('branch-access-control Access granted', {
        userId: req.user.id,
        repository: result.repository,
        ref: result.ref,
        operation: result.operation
      });

      next();
    };
  }
}