import { RSAKeyManager } from './rsaKeyManager';

export interface DecryptedToken {
  token: string;
}

export class TokenDecryptor {
  private rsaKeyManager: RSAKeyManager;

  constructor(rsaKeyManager: RSAKeyManager) {
    this.rsaKeyManager = rsaKeyManager;
  }

  /**
   * Decrypt the encrypted token from JWT payload
   */
  public decryptToken(encryptedToken: string): DecryptedToken {
    try {
      const decrypted = this.rsaKeyManager.decrypt(encryptedToken);

      // Support both old format (JSON object) and new format (raw token)
      let token: string;
      try {
        const tokenData = JSON.parse(decrypted);
        // Backward compatibility: handle old format
        token = tokenData.token || tokenData.githubToken || '';
      } catch {
        // New format: encrypted payload is just the raw token
        token = decrypted;
      }

      if (!token) {
        throw new Error('No valid token found in decrypted payload');
      }

      console.log('token-decryptor Token decrypted successfully');

      return { token };
    } catch (error) {
      console.error('token-decryptor Token decryption failed', error);
      throw new Error('Failed to decrypt token payload');
    }
  }

  // Expiration is handled by JWT exp claim - no need for separate check

  /**
   * Get the token for any git host (simplified - one token per JWT)
   */
  public getTokenForHost(token: DecryptedToken, host: string): string {
    return token.token;
  }

  /**
   * Validate token format and basic structure
   */
  public validateTokenFormat(token: DecryptedToken): boolean {
    if (!token.token) {
      console.warn('token-decryptor Token validation failed: No valid token found');
      return false;
    }

    // Basic token format validation (supports multiple providers)
    const tokenValid =
      token.token.startsWith('ghp_') || // GitHub Personal Access Token
      token.token.startsWith('gho_') || // GitHub OAuth Token
      token.token.startsWith('ghu_') || // GitHub User Token
      token.token.startsWith('ghs_') || // GitHub Server Token
      token.token.startsWith('ghr_') || // GitHub Refresh Token
      token.token.startsWith('glpat-') || // GitLab Personal Access Token
      token.token.startsWith('glsoat-') || // GitLab System OAuth Token
      /^[a-f0-9]{40}$/i.test(token.token) || // GitHub legacy token
      /^[a-f0-9]{20}$/i.test(token.token); // GitLab legacy token

    if (!tokenValid) {
      console.warn('token-decryptor Token format validation failed');
      return false;
    }

    console.log('token-decryptor Token format validation passed');
    return true;
  }

  /**
   * Create test encrypted token for development/testing
   */
  public createTestToken(token: string): string {
    const encrypted = this.rsaKeyManager.encrypt(token);
    console.log('token-decryptor Created test encrypted token');
    return encrypted;
  }
}