import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { RSAKeyManager } from '../crypto/rsaKeyManager';
import { BranchAccessControl } from './branchAccessControl';
import { GitProxyHandler } from './gitProxyHandler';
import { createAuthMiddleware } from './authMiddleware';
import { ConfigManager } from './config';
import { ProxyConfig } from '../types';

export interface CorsProxyOptions {
  config?: Partial<ProxyConfig>;
  rsaKeyManager?: RSAKeyManager;
}

export function createCorsProxy(options: CorsProxyOptions = {}): Application {
  // Load configuration
  const configManager = ConfigManager.getInstance();
  const config = { ...configManager.getConfig(), ...options.config };

  // Logger is already imported globally

  // Validate configuration
  const validation = configManager.validate();
  if (!validation.valid) {
    console.error('cors-proxy Configuration validation failed', {
      errors: validation.errors,
    });
    throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
  }

  // Initialize RSA key manager
  const rsaKeyManager =
    options.rsaKeyManager ||
    new RSAKeyManager({
      publicKey: config.accessServicePubKey || undefined,
      privateKey: config.proxyServicePrivateKey || undefined,
    });

  // Create Express app
  const app = express();

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for git operations
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS middleware
  const corsOptions: cors.CorsOptions = {
    origin: config.corsOrigin === '*' ? true : (config.corsOrigin as string[]),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'User-Agent',
      'Git-Protocol',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  };
  app.use(cors(corsOptions));

  // Body parsing middleware for git operations
  app.use(express.raw({ type: '*/*', limit: '100mb' }));

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('cors-proxy Incoming request', {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
    next();
  });

  // Health check endpoint (no auth required)
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      nodeEnv: config.nodeEnv,
    });
  });

  // Info endpoint (no auth required)
  app.get('/info', (req: Request, res: Response) => {
    res.json({
      name: '@legit/cors-proxy',
      version: '1.0.0',
      description: 'JWT-authenticated CORS proxy for Git HTTP protocol',
      capabilities: [
        'Git HTTP smart protocol',
        'JWT authentication with RSA encryption',
        'Branch-level access control',
        'GitHub and GitLab support',
      ],
    });
  });

  // Initialize components
  const branchAccessControl = new BranchAccessControl();
  const gitProxyHandler = new GitProxyHandler({
    githubApiUrl: config.githubApiUrl,
    gitlabApiUrl: config.gitlabApiUrl,
    branchAccessControl,
    timeout: 30000,
  });

  // Authentication middleware (skip for health/info endpoints)
  const authMiddleware = createAuthMiddleware({
    rsaKeyManager,
    jwtAlgorithm: config.jwtAlgorithm,
    tokenHeader: 'authorization',
    skipPaths: ['/health', '/info'],
  });

  // Apply authentication middleware
  app.use(authMiddleware);

  // Git proxy middleware
  const gitProxyMiddleware = gitProxyHandler.createProxyMiddleware();
  app.use(gitProxyMiddleware);

  // OPTIONS handler for preflight requests
  app.options('*', gitProxyHandler.createOptionsHandler());

  // 404 handler
  app.use((req: Request, res: Response) => {
    console.warn('cors-proxy Route not found', {
      method: req.method,
      url: req.url,
    });

    res.status(404).json({
      error: 'Not Found',
      message: 'The requested endpoint was not found',
      code: 'NOT_FOUND',
    });
  });

  // Global error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('cors-proxy Unhandled error', err, {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
    });

    res.status(500).json({
      error: 'Internal Server Error',
      message:
        config.nodeEnv === 'development' ? err.message : 'Something went wrong',
      code: 'INTERNAL_ERROR',
    });
  });

  return app;
}

/**
 * Start the CORS proxy server
 */
export async function startCorsProxy(
  options: CorsProxyOptions = {}
): Promise<void> {
  const app = createCorsProxy(options);
  const configManager = ConfigManager.getInstance();
  const config = configManager.getConfig();

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(config.port, () => {
        console.log('cors-proxy CORS proxy server started', {
          port: config.port,
          nodeEnv: config.nodeEnv,
          githubApiUrl: config.githubApiUrl,
          gitlabApiUrl: config.gitlabApiUrl,
        });
        resolve();
      });

      // Handle graceful shutdown
      process.on('SIGTERM', () => {
        console.log('cors-proxy Received SIGTERM, shutting down gracefully');
        server.close(() => {
          console.log('cors-proxy Server closed');
          process.exit(0);
        });
      });

      process.on('SIGINT', () => {
        console.log('cors-proxy Received SIGINT, shutting down gracefully');
        server.close(() => {
          console.log('cors-proxy Server closed');
          process.exit(0);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}
