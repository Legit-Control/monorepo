import type { NextConfig } from 'next';
import path from 'path';

// Use source files for debugging (set USE_SOURCE_FILES=true to use source files in builds)
// Default: use dist files for builds (Turbopack can't handle TypeScript source files)
const useSourceFiles = process.env.USE_SOURCE_FILES === 'true';
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Transpile the local packages so Next.js can handle TypeScript source files
  transpilePackages: ['@legit-sdk/core', '@legit-sdk/react'],

  // Turbopack configuration (Next.js 16 uses Turbopack for builds by default)
  // For dev: use source files for debugging
  // For build: use dist files since Turbopack doesn't handle TypeScript source files well
  // Set USE_SOURCE_FILES=true to force source files even in builds (requires webpack)
  turbopack: {
    resolveAlias: {
      // Use source files if explicitly requested or in dev mode
      // Otherwise use dist files (Turbopack can't handle TypeScript source files)
      '@legit-sdk/core':
        useSourceFiles || isDev
          ? '../../packages/sdk/src'
          : '../../packages/sdk/dist',
      '@legit-sdk/react':
        useSourceFiles || isDev
          ? '../../packages/sdk-react/src'
          : '../../packages/sdk-react/dist',
    },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },

  // Webpack configuration (for dev with --webpack flag)
  // Use source files for debugging in dev mode
  webpack: (config, { isServer, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@legit-sdk/core': path.resolve(__dirname, '../../packages/sdk/src'),
      '@legit-sdk/react': path.resolve(
        __dirname,
        '../../packages/sdk-react/src'
      ),
    };

    // Handle TypeScript files with .js extensions in imports
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };

    // Ensure TypeScript files are handled correctly
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'];

    // Handle node: protocol imports - must be done before other plugins
    config.plugins = config.plugins || [];

    // Replace node: protocol imports with regular imports
    // This needs to happen early in the resolution process
    config.plugins.unshift(
      new webpack.NormalModuleReplacementPlugin(
        /^node:/,
        (resource: { request: string }) => {
          resource.request = resource.request.replace(/^node:/, '');
        }
      )
    );

    // Handle Node.js built-in modules (for client-side code)
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
