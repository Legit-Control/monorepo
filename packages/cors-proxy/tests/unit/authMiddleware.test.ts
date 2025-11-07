import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createAuthMiddleware,
  createTestJWT,
} from '../../src/proxy/authMiddleware';
import { RSAKeyManager } from '../../src/crypto/rsaKeyManager';
import { Request, Response } from 'express';
import { createTestTokens, testRSAKeyPair } from '../fixtures/testKeys';

describe('AuthMiddleware', () => {
  let rsaKeyManager: RSAKeyManager;
  let authMiddleware: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: ReturnType<typeof vi.fn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    const tokens = createTestTokens();
    rsaKeyManager = tokens.rsaKeyManager;

    // Mock console methods
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    authMiddleware = createAuthMiddleware({
      rsaKeyManager,
      skipPaths: ['/health', '/info'],
    });

    mockRequest = {
      path: '/test-owner/test-repo/git/info/refs',
      method: 'GET',
      headers: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      header: vi.fn().mockReturnThis(),
    };

    nextFunction = vi.fn();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('Valid authentication', () => {
    it('should allow requests with valid JWT Bearer token', async () => {
      const { validGithubJWT } = createTestTokens();
      mockRequest.headers = {
        authorization: `Bearer ${validGithubJWT}`,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect((mockRequest as any).user.id).toBe('test-user-123');
      expect((mockRequest as any).user.githubToken).toBeTruthy();
    });

    it('should allow requests with valid JWT token without Bearer prefix', async () => {
      const { validGithubJWT } = createTestTokens();
      mockRequest.headers = {
        authorization: validGithubJWT,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith();
      expect((mockRequest as any).user.id).toBe('test-user-123');
    });

    it('should skip authentication for health endpoint', async () => {
      mockRequest.path = '/health';

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'auth-middleware Skipping authentication for path',
        { path: '/health' }
      );
    });

    it('should skip authentication for info endpoint', async () => {
      mockRequest.path = '/info';

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith();
    });
  });

  describe('Invalid authentication', () => {
    it('should reject requests without authorization header', async () => {
      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication failed',
        message: 'Missing authentication token',
        code: 'AUTH_ERROR',
        timestamp: expect.any(String),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject requests with malformed JWT', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid.jwt.token',
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication failed',
        message: 'Invalid JWT signature',
        code: 'AUTH_ERROR',
        timestamp: expect.any(String),
      });
    });

    it('should reject requests with wrong JWT signature', async () => {
      // Create token with different key pair
      const differentKeyPair = RSAKeyManager.generateTestKeyPair();
      const differentRsaManager = new RSAKeyManager(differentKeyPair);
      const wrongToken = createTestJWT(
        'test-user',
        createTestTokens().encryptedGithubToken,
        differentRsaManager
      );

      mockRequest.headers = {
        authorization: `Bearer ${wrongToken}`,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject requests with expired JWT', async () => {
      const { expiredJWT } = createTestTokens();
      mockRequest.headers = {
        authorization: `Bearer ${expiredJWT}`,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject requests with invalid encrypted token', async () => {
      const invalidEncryptedToken = createTestJWT(
        'test-user',
        'invalid-encrypted-data',
        rsaKeyManager
      );
      mockRequest.headers = {
        authorization: `Bearer ${invalidEncryptedToken}`,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('JWT payload validation', () => {
    it('should validate required JWT fields', async () => {
      // Create JWT with missing encrypted token
      const incompleteJWT = createTestJWT('test-user', '', rsaKeyManager);
      mockRequest.headers = {
        authorization: `Bearer ${incompleteJWT}`,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should attach user permissions to request', async () => {
      const { validGithubJWT } = createTestTokens();
      mockRequest.headers = {
        authorization: `Bearer ${validGithubJWT}`,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect((mockRequest as any).user.permissions).toEqual({
        repositories: ['test-owner/test-repo'],
        branches: {
          'test-owner/test-repo': ['main', 'develop', 'feature/*'],
        },
      });
    });
  });

  describe('Token format validation', () => {
    it('should handle array authorization headers', async () => {
      const { validGithubJWT } = createTestTokens();
      mockRequest.headers = {
        authorization: [`Bearer ${validGithubJWT}`],
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should be case insensitive for header name', async () => {
      const { validGithubJWT } = createTestTokens();
      mockRequest.headers = {
        Authorization: `Bearer ${validGithubJWT}`,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith();
    });
  });

  describe('Error handling', () => {
    it('should handle RSA decryption errors gracefully', async () => {
      // Create valid JWT but with corrupted encrypted data
      const tokenWithCorruptedData = createTestJWT(
        'test-user',
        'corrupted-data',
        rsaKeyManager
      );
      mockRequest.headers = {
        authorization: `Bearer ${tokenWithCorruptedData}`,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'auth-middleware Authentication failed',
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('should log successful authentication', async () => {
      const { validGithubJWT } = createTestTokens();
      mockRequest.headers = {
        authorization: `Bearer ${validGithubJWT}`,
      };

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'auth-middleware Authentication successful',
        {
          userId: 'test-user-123',
          hasToken: true,
          path: '/test-owner/test-repo/git/info/refs',
        }
      );
    });
  });
});
