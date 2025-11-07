import jwt, { Algorithm } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { RSAKeyManager } from '../crypto/rsaKeyManager';
import { TokenDecryptor } from '../crypto/tokenDecryptor';
import { JWTPayload, AuthenticatedRequest, ProxyError } from '../types';

export interface AuthMiddlewareOptions {
  rsaKeyManager: RSAKeyManager;
  jwtAlgorithm?: Algorithm;
  tokenHeader?: string;
  skipPaths?: string[];
}

export function createAuthMiddleware(options: AuthMiddlewareOptions) {
  const {
    rsaKeyManager,
    jwtAlgorithm = 'RS256',
    tokenHeader = 'authorization',
    skipPaths = [],
  } = options;

  const tokenDecryptor = new TokenDecryptor(rsaKeyManager);
  const accessServicePublicKey = rsaKeyManager.getAccessServicePublicKey();

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip authentication for specified paths
    if (skipPaths.some(path => req.path.startsWith(path))) {
      console.log('auth-middleware Skipping authentication for path', {
        path: req.path,
      });
      return next();
    }

    try {
      // Extract token from header
      const token = extractTokenFromRequest(req, tokenHeader);
      if (!token) {
        return sendAuthError(res, 'Missing authentication token', 401);
      }

      // Verify JWT signature and decode payload
      const decoded = verifyJWT(token, accessServicePublicKey, jwtAlgorithm);
      if (!decoded) {
        return sendAuthError(res, 'Invalid or expired token', 401);
      }

      // Decrypt the encrypted token payload
      const decryptedToken = tokenDecryptor.decryptToken(
        decoded.encryptedToken
      );

      // Validate token format (expiration handled by JWT)
      if (!tokenDecryptor.validateTokenFormat(decryptedToken)) {
        return sendAuthError(res, 'Invalid token format', 401);
      }

      // Attach authenticated user info to request
      const authenticatedReq = req as unknown as AuthenticatedRequest;
      authenticatedReq.user = {
        id: decoded.sub,
        githubToken: decryptedToken.token,
        permissions: decoded.permissions,
      };

      console.log('auth-middleware Authentication successful', {
        userId: decoded.sub,
        hasToken: !!decryptedToken.token,
        path: req.path,
      });

      next();
    } catch (error) {
      console.error('auth-middleware Authentication failed', error as Error, {
        path: req.path,
        method: req.method,
      });

      const proxyError = error as ProxyError;
      return sendAuthError(
        res,
        proxyError.message || 'Authentication failed',
        proxyError.statusCode || 401
      );
    }
  };
}

/**
 * Extract JWT token from request headers
 */
function extractTokenFromRequest(
  req: Request,
  headerName: string
): string | null {
  // Try lowercase first (Express standard)
  let authHeader = req.headers[headerName.toLowerCase()];

  // If not found, try the header name as-is (for test environments)
  if (!authHeader) {
    authHeader = req.headers[headerName];
  }

  // If still not found, try capitalized version (common HTTP header format)
  if (!authHeader) {
    const capitalizedHeader =
      headerName.charAt(0).toUpperCase() + headerName.slice(1);
    authHeader = req.headers[capitalizedHeader];
  }

  if (!authHeader) {
    return null;
  }

  const authValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

  // Support both "Bearer <token>" and raw token formats
  if (authValue.startsWith('Bearer ')) {
    return authValue.substring(7);
  }

  return authValue;
}

/**
 * Verify JWT token signature and decode payload
 */
function verifyJWT(
  token: string,
  publicKey: string,
  algorithm: Algorithm
): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: [algorithm],
    }) as unknown as JWTPayload;

    // Validate required payload fields
    if (
      !decoded.sub ||
      !decoded.iat ||
      !decoded.exp ||
      !decoded.encryptedToken
    ) {
      throw new Error('Invalid JWT payload structure');
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      throw new Error('JWT token has expired');
    }

    // Check if token was issued in the future (clock skew protection)
    if (decoded.iat > now + 300) {
      // 5 minute tolerance
      throw new Error('JWT token issued in the future');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('JWT token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid JWT signature');
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new Error('JWT token not active');
    }
    throw error;
  }
}

/**
 * Send standardized authentication error response
 */
function sendAuthError(
  res: Response,
  message: string,
  statusCode: number
): void {
  res.status(statusCode).json({
    error: 'Authentication failed',
    message,
    code: 'AUTH_ERROR',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Create a test JWT for development/testing
 */
export function createTestJWT(
  userId: string,
  encryptedToken: string,
  rsaKeyManager: RSAKeyManager,
  expiresIn: string = '1h'
): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    sub: userId,
    encryptedToken,
    permissions: {
      repositories: ['test-owner/test-repo'],
      branches: {
        'test-owner/test-repo': ['main', 'develop', 'feature/*'],
      },
    },
  };

  const proxyServicePrivateKey = rsaKeyManager.getProxyServicePrivateKey();
  return jwt.sign(payload, proxyServicePrivateKey, {
    algorithm: 'RS256',
    expiresIn: expiresIn as any, // TODO how to ensure string value
  });
}

/**
 * Middleware to add CORS headers for authenticated requests
 */
export function addAuthCORS(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.headers.origin;

  // Set CORS headers
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}
