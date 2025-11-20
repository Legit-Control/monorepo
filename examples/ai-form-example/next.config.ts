import type { NextConfig } from 'next';
import path from 'path';

const useSourceFiles = process.env.USE_SOURCE_FILES === 'true';
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  transpilePackages: ['@legit-sdk/core', '@legit-sdk/assistant-ui'],
  turbopack: {
    resolveAlias: {
      '@legit-sdk/core':
        useSourceFiles || isDev
          ? '../../packages/sdk/src'
          : '../../packages/sdk/dist',
      '@legit-sdk/assistant-ui':
        useSourceFiles || isDev
          ? '../../packages/sdk-assistant-ui/src'
          : '../../packages/sdk-assistant-ui/dist',
    },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  webpack: (config, { isServer, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@legit-sdk/core': path.resolve(__dirname, '../../packages/sdk/src'),
      '@legit-sdk/assistant-ui': path.resolve(
        __dirname,
        '../../packages/sdk-assistant-ui/src'
      ),
    };

    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };

    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'];

    config.plugins = config.plugins || [];
    config.plugins.unshift(
      new webpack.NormalModuleReplacementPlugin(
        /^node:/,
        (resource: { request: string }) => {
          resource.request = resource.request.replace(/^node:/, '');
        }
      )
    );

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: false,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
        util: false,
        events: false,
        http: false,
        https: false,
        url: false,
        querystring: false,
      };
    }

    return config;
  },
};

export default nextConfig;
