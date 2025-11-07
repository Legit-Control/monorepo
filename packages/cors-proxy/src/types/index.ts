export interface JWTPayload {
  sub: string; // User ID
  iat: number; // Issued at
  exp: number; // Expiration time
  encryptedToken: string; // RSA-encrypted GitHub token
  permissions: {
    repositories: string[]; // Allowed repositories
    branches: {
      [repo: string]: string[]; // Branch patterns per repository
    };
  };
}

export interface BranchPermissions {
  read: string[]; // Readable branch patterns
  write: string[]; // Writable branch patterns
}

export interface ProxyConfig {
  port: number;
  nodeEnv: string;
  logLevel: string;
  corsOrigin: string | string[];
  accessServicePubKey: string;
  proxyServicePrivateKey: string;
  jwtAlgorithm: string;
  githubApiUrl: string;
  gitlabApiUrl: string;
}

export interface GitRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: Buffer;
  service?: 'git-upload-pack' | 'git-receive-pack';
  repository?: string;
  ref?: string;
}

export interface AuthenticatedRequest extends GitRequest {
  user: {
    id: string;
    githubToken: string;
    permissions: JWTPayload['permissions'];
  };
}

export interface ProxyError extends Error {
  statusCode?: number;
  code?: string;
}
