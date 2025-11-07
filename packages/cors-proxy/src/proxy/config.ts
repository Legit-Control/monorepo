import dotenv from 'dotenv';
import { ProxyConfig } from '../types';

// Load environment variables
dotenv.config();

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ProxyConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): ProxyConfig {
    return {
      port: parseInt(process.env.PORT || '9999', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
      logLevel: process.env.LOG_LEVEL || 'info',
      corsOrigin: process.env.CORS_ORIGIN || '*',
      accessServicePubKey: process.env.ACCESS_SERVICE_PUB_KEY || process.env.RSA_PUBLIC_KEY || '',
      proxyServicePrivateKey: process.env.PROXY_SERVICE_PRIVATE_KEY || process.env.RSA_PRIVATE_KEY || '',
      jwtAlgorithm: process.env.JWT_ALGORITHM || 'RS256',
      githubApiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
      gitlabApiUrl: process.env.GITLAB_API_URL || 'https://gitlab.com',
    };
  }

  public getConfig(): ProxyConfig {
    return this.config;
  }

  public isDevelopment(): boolean {
    return this.config.nodeEnv === 'development';
  }

  public isProduction(): boolean {
    return this.config.nodeEnv === 'production';
  }

  public isTest(): boolean {
    return this.config.nodeEnv === 'test';
  }

  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = this.config;

    // Validate port
    if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
      errors.push('Invalid PORT value');
    }

    // Validate RSA keys (unless in test mode with auto-generated keys)
    if (!this.isTest()) {
      if (!config.accessServicePubKey) {
        errors.push('ACCESS_SERVICE_PUB_KEY or RSA_PUBLIC_KEY is required');
      }
      if (!config.proxyServicePrivateKey) {
        errors.push('PROXY_SERVICE_PRIVATE_KEY or RSA_PRIVATE_KEY is required');
      }
    }

    // Validate URLs
    try {
      new URL(config.githubApiUrl);
    } catch {
      errors.push('Invalid GITHUB_API_URL');
    }

    try {
      new URL(config.gitlabApiUrl);
    } catch {
      errors.push('Invalid GITLAB_API_URL');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
