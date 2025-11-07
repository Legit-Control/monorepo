import NodeRSA from 'node-rsa';

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export class RSAKeyManager {
  private publicKey: NodeRSA;
  private privateKey: NodeRSA;
  constructor(
    config: { publicKey?: string; privateKey?: string }
  ) {

    if (config.publicKey && config.privateKey) {
      // Load existing keys
      try {
        this.publicKey = new NodeRSA(config.publicKey);
        this.privateKey = new NodeRSA(config.privateKey);
        console.log('rsa-manager RSA keys loaded from configuration');
      } catch (error) {
        console.error('rsa-manager Failed to load RSA keys from configuration', error);
        throw new Error('Invalid RSA keys provided in configuration');
      }
    } else {
      // Generate new key pair
      try {
        const key = new NodeRSA({ b: 2048 });
        this.privateKey = key;
        this.publicKey = key;

        console.log('rsa-manager Generated new RSA-2048 key pair');
      } catch (error) {
        console.error('rsa-manager Failed to generate RSA key pair', error);
        throw new Error('RSA key generation failed');
      }
    }

    // Validate key pair
    this.validateKeyPair();
  }

  /**
   * Validate that the public and private keys are a matching pair
   */
  private validateKeyPair(): void {
    try {
      const testMessage = 'validation-test';
      const encrypted = this.publicKey.encrypt(testMessage, 'base64');
      const decrypted = this.privateKey.decrypt(encrypted, 'utf8');

      if (decrypted !== testMessage) {
        throw new Error(
          'Key pair validation failed: decrypted message does not match original'
        );
      }

      console.log('rsa-manager RSA key pair validation successful');
    } catch (error) {
      console.error('rsa-manager RSA key pair validation failed', error);
      throw new Error('Invalid RSA key pair');
    }
  }

  /**
   * Encrypt data using the public key
   */
  public encrypt(data: string): string {
    try {
      const encrypted = this.publicKey.encrypt(data, 'base64');
      console.log('rsa-manager Data encrypted successfully');
      return encrypted;
    } catch (error) {
      console.error('rsa-manager RSA encryption failed', error);
      throw new Error('Failed to encrypt data with RSA public key');
    }
  }

  /**
   * Decrypt data using the private key
   */
  public decrypt(encryptedData: string): string {
    try {
      const decrypted = this.privateKey.decrypt(encryptedData, 'utf8');
      console.log('rsa-manager Data decrypted successfully');
      return decrypted;
    } catch (error) {
      console.error('rsa-manager RSA decryption failed', error);
      throw new Error('Failed to decrypt data with RSA private key');
    }
  }

  /**
   * Get the public key as a PEM string
   */
  public getPublicKey(): string {
    return this.publicKey.exportKey('public');
  }

  /**
   * Get the private key as a PEM string
   */
  public getProxyServicePrivateKey(): string {
    return this.privateKey.exportKey('private');
  }

  /**
   * Get the public key as a string suitable for JWT verification
   */
  public getAccessServicePublicKey(): string {
    return this.getPublicKey();
  }

  /**
   * Create a key pair export for persistence
   */
  public exportKeyPair(): RSAKeyPair {
    return {
      publicKey: this.getPublicKey(),
      privateKey: this.getPrivateKey(),
    };
  }

  /**
   * Create a new RSAKeyManager instance from environment variables
   */
  public static fromEnvironment(): RSAKeyManager {
    const publicKey = process.env.ACCESS_SERVICE_PUB_KEY || process.env.RSA_PUBLIC_KEY;
    const privateKey = process.env.PROXY_SERVICE_PRIVATE_KEY || process.env.RSA_PRIVATE_KEY;

    return new RSAKeyManager({
      publicKey: publicKey?.trim() || undefined,
      privateKey: privateKey?.trim() || undefined,
    });
  }

  /**
   * Generate a test key pair for development/testing
   */
  public static generateTestKeyPair(): RSAKeyPair {
    const key = new NodeRSA({ b: 2048 });
    return {
      publicKey: key.exportKey('public'),
      privateKey: key.exportKey('private'),
    };
  }

  /**
   * Validate key format before loading
   */
  public static validateKeyFormat(
    key: string,
    type: 'public' | 'private'
  ): boolean {
    try {
      const rsaKey = new NodeRSA(key);
      const exported =
        type === 'public'
          ? rsaKey.exportKey('public')
          : rsaKey.exportKey('private');
      return exported.includes('-----BEGIN') && exported.includes('-----END');
    } catch {
      return false;
    }
  }
}
