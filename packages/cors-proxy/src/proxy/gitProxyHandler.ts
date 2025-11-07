import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request, Response } from 'express';
import { AuthenticatedRequest, ProxyError } from '../types';
import { BranchAccessControl } from './branchAccessControl';

export interface GitProxyOptions {
  githubApiUrl: string;
  gitlabApiUrl: string;
  branchAccessControl: BranchAccessControl;
  timeout?: number;
}

export class GitProxyHandler {
  private githubApiUrl: string;
  private gitlabApiUrl: string;
  private branchAccessControl: BranchAccessControl;
  private timeout: number;

  constructor(options: GitProxyOptions) {
    this.githubApiUrl = options.githubApiUrl;
    this.gitlabApiUrl = options.gitlabApiUrl;
    this.branchAccessControl = options.branchAccessControl;
    this.timeout = options.timeout || 30000; // 30 seconds default
  }

  /**
   * Create Express middleware for handling Git HTTP protocol requests
   */
  public createProxyMiddleware() {
    return (req: AuthenticatedRequest, res: Response, next: Function) => {
      try {
        // Parse the git request
        const gitRequest = this.parseGitRequest(req);

        if (!gitRequest) {
          console.warn('git-proxy Invalid git request', { url: req.url, method: req.method });
          return res.status(400).json({
            error: 'Invalid git request',
            message: 'Unable to parse git protocol request'
          });
        }

        // Attach parsed request info for access control
        req.service = gitRequest.service;
        req.repository = gitRequest.repository;
        req.ref = gitRequest.ref;

        // Determine operation type (read/write)
        const operation = gitRequest.service === 'git-receive-pack' ? 'write' : 'read';

        // Check branch access permissions
        const accessResult = this.branchAccessControl.checkAccess(req, operation);
        if (!accessResult.allowed) {
          console.warn('git-proxy Access denied by branch control', {
            userId: req.user?.id,
            repository: gitRequest.repository,
            service: gitRequest.service,
            reason: accessResult.reason
          });

          return res.status(403).json({
            error: 'Access denied',
            message: accessResult.reason,
            code: 'BRANCH_ACCESS_DENIED'
          });
        }

        // Create and configure proxy middleware
        const proxyMiddleware = this.createProxyForRequest(gitRequest, req);
        proxyMiddleware(req, res, next);
      } catch (error) {
        console.error('git-proxy Git proxy error', error as Error);
        res.status(500).json({
          error: 'Internal proxy error',
          message: 'Failed to process git request'
        });
      }
    };
  }

  /**
   * Parse Git HTTP protocol request
   */
  private parseGitRequest(req: Request): { service?: string; repository?: string; ref?: string } | null {
    const url = req.url;
    const method = req.method;

    // Parse info/refs request
    const infoRefsMatch = url.match(/\/(.+?)\/git\/info\/refs\?(.*)$/);
    if (infoRefsMatch && method === 'GET') {
      const repository = infoRefsMatch[1];
      const queryParams = new URLSearchParams(infoRefsMatch[2]);
      const service = queryParams.get('service');

      if (service && (service === 'git-upload-pack' || service === 'git-receive-pack')) {
        return { service, repository };
      }
    }

    // Parse git-upload-pack request (fetch)
    const uploadPackMatch = url.match(/\/(.+?)\/git-upload-pack$/);
    if (uploadPackMatch && method === 'POST') {
      const repository = uploadPackMatch[1];
      const ref = this.extractRefFromRequestBody(req.body);
      return { service: 'git-upload-pack', repository, ref };
    }

    // Parse git-receive-pack request (push)
    const receivePackMatch = url.match(/\/(.+?)\/git-receive-pack$/);
    if (receivePackMatch && method === 'POST') {
      const repository = receivePackMatch[1];
      const ref = this.extractRefFromRequestBody(req.body);
      return { service: 'git-receive-pack', repository, ref };
    }

    return null;
  }

  /**
   * Extract ref from git request body
   */
  private extractRefFromRequestBody(body: Buffer | undefined): string | undefined {
    if (!body) return undefined;

    try {
      const bodyStr = body.toString('utf8');

      // Extract ref from packfile protocol
      const refMatch = bodyStr.match(/refs\/(heads|tags)\/([^\x00\n]+)/);
      if (refMatch) {
        return `refs/${refMatch[1]}/${refMatch[2].trim()}`;
      }

      // Extract from other git protocol commands
      const commandMatch = bodyStr.match(/([a-f0-9]+) ([a-f0-9]+) refs\/(heads|tags)\/([^\x00\n]+)/);
      if (commandMatch) {
        return `refs/${commandMatch[3]}/${commandMatch[4].trim()}`;
      }
    } catch (error) {
      console.log('git-proxy Failed to extract ref from request body', { error: error.message });
    }

    return undefined;
  }

  /**
   * Create proxy middleware for specific git request
   */
  private createProxyForRequest(gitRequest: any, req: AuthenticatedRequest) {
    // Determine target URL based on request
    const targetUrl = this.buildTargetUrl(gitRequest, req);

    const proxyOptions: Options = {
      target: targetUrl,
      changeOrigin: true,
      timeout: this.timeout,
      headers: {
        // Forward user agent for git protocol compatibility
        'User-Agent': req.headers['user-agent'] || 'git/1.0',

        // Add authorization header with decrypted token
        'Authorization': `Bearer ${this.getAuthTokenForTarget(req, targetUrl)}`,

        // Forward relevant headers
        'Content-Type': req.headers['content-type'],
        'Accept': req.headers.accept,
        'Git-Protocol': req.headers['git-protocol']
      },

      // Handle errors
      onError: (err, req, res) => {
        console.error('git-proxy Proxy error', err, {
          target: targetUrl,
          url: req.url,
          method: req.method
        });

        if (res.writeHead && !res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Proxy error',
            message: 'Failed to proxy request to git server'
          }));
        }
      },

      // Log proxy requests
      onProxyReq: (proxyReq, req) => {
        console.log('git-proxy Proxying request', {
          method: req.method,
          url: req.url,
          target: targetUrl,
          service: gitRequest.service,
          repository: gitRequest.repository
        });
      },

      // Log proxy responses
      onProxyRes: (proxyRes, req, res) => {
        console.log('git-proxy Proxy response received', {
          statusCode: proxyRes.statusCode,
          url: req.url,
          target: targetUrl
        });
      }
    };

    return createProxyMiddleware(proxyOptions);
  }

  /**
   * Build target URL for proxying
   */
  private buildTargetUrl(gitRequest: any, req: AuthenticatedRequest): string {
    const { repository } = gitRequest;

    // Determine if this is a GitHub or GitLab request based on host or patterns
    const isGitHub = this.isGitHubRequest(repository, req.headers.host);
    const baseUrl = isGitHub ? this.githubApiUrl : this.gitlabApiUrl;

    // Handle different API formats
    if (isGitHub) {
      // GitHub API format: https://api.github.com/repos/owner/repo/git/...
      return `${baseUrl}/repos/${repository}/git`;
    } else {
      // GitLab API format or custom format
      return `${baseUrl}/${repository}`;
    }
  }

  /**
   * Determine if request is for GitHub
   */
  private isGitHubRequest(repository: string, host?: string): boolean {
    // Check repository pattern
    if (repository.includes('github.com') || repository.match(/^[^\/]+\/[^\/]+$/)) {
      return true;
    }

    // Check host header
    if (host && host.includes('github.com')) {
      return true;
    }

    // Default to GitHub for ambiguous cases
    return true;
  }

  /**
   * Get auth token for any git host (simplified - one token per JWT)
   */
  private getAuthTokenForTarget(req: AuthenticatedRequest, targetUrl: string): string {
    return req.user.githubToken;
  }

  /**
   * Validate git protocol request
   */
  private validateGitRequest(req: Request): boolean {
    const url = req.url;
    const method = req.method;
    const userAgent = req.headers['user-agent'];

    // Basic validation
    if (!url || !method) {
      return false;
    }

    // Check for git-related user agent
    if (userAgent && !userAgent.includes('git')) {
      console.warn('git-proxy Non-git user agent detected', { userAgent });
      // Allow but log for monitoring
    }

    // Validate method for git operations
    const validMethods = ['GET', 'POST', 'OPTIONS'];
    if (!validMethods.includes(method)) {
      return false;
    }

    // Validate URL format for git operations
    const gitPatterns = [
      /\/.+\/git\/info\/refs/,
      /\/.+\/git-upload-pack$/,
      /\/.+\/git-receive-pack$/
    ];

    return gitPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Handle preflight OPTIONS requests
   */
  public createOptionsHandler() {
    return (req: Request, res: Response) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, User-Agent, Git-Protocol');
      res.header('Access-Control-Max-Age', '86400');
      res.status(200).end();
    };
  }
}