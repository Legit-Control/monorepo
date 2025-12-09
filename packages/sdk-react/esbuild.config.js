import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple alias plugin for esbuild
function aliasPlugin(aliases) {
  return {
    name: 'alias',
    setup(build) {
      // Resolve alias for imports
      build.onResolve({ filter: /.*/ }, async args => {
        // Only apply alias for exact matches (not subpaths)
        if (aliases[args.path]) {
          const aliasedPath = aliases[args.path];
          // Resolve the aliased path using esbuild's resolver
          const result = await build.resolve(aliasedPath, {
            resolveDir: args.resolveDir,
            kind: args.kind,
            importer: args.importer,
          });
          if (result.errors.length > 0) {
            return { errors: result.errors };
          }
          // Return the resolved path
          return { path: result.path };
        }
        // Let esbuild handle non-aliased imports normally
        return undefined;
      });
    },
  };
}

// Browser build config - bundles everything with polyfills
const browserBuildConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  format: 'esm',
  outfile: 'dist/index.js',
  sourcemap: false,
  minify: true,
  keepNames: true,
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': '"production"',
  },
  external: ['react', 'react-dom'],
  // ✔ Node core modules replaced with browser shims
  plugins: [nodeModulesPolyfillPlugin()],
  banner: {
    js: `// legit-sdk browser bundle\n`,
  },
};

// Server build config - bundled for Node.js, excludes browser code
const serverBuildConfig = {
  entryPoints: ['src/index-server.ts'],
  bundle: true,
  platform: 'node',
  target: 'es2020',
  format: 'esm',
  outfile: 'dist/server.js',
  sourcemap: false,
  minify: true,
  keepNames: true,
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': '"production"',
  },
  plugins: [
    // Alias @legit-sdk/core to @legit-sdk/core/server for server builds
    aliasPlugin({
      '@legit-sdk/core': '@legit-sdk/core/server',
    }),
  ],
  // Exclude Node.js built-ins, browser-specific packages, and dependencies
  // that don't work well when bundled (memfs, isomorphic-git, etc.)
  external: [
    // Node.js built-ins
    'fs',
    'path',
    'buffer',
    'stream',
    'events',
    'util',
    'url',
    'http',
    'https',
    'querystring',
    'crypto',
    'os',
    'process',
    // Browser-specific
    'browser-fs-access',
    // Dependencies that shouldn't be bundled for Node.js
    'memfs',
    'isomorphic-git',
    'ignore',
    'react',
    'react-dom',
  ],
  banner: {
    js: `// legit-sdk server bundle (Node.js)\n`,
  },
};
async function build() {
  console.log('Building legit-sdk...');

  // Build browser bundle
  console.log('  → Building browser bundle...');
  await esbuild.build(browserBuildConfig);
  console.log('    ✔ Browser bundle complete');

  // Build server bundle
  console.log('  → Building server bundle...');
  await esbuild.build(serverBuildConfig);
  console.log('    ✔ Server bundle complete');

  // Copy and fix server declaration file from TypeScript output
  // TypeScript outputs index-server.d.ts, we need to copy it to server.d.ts
  // and create server-specific versions of component declaration files with corrected imports
  const serverDeclPath = path.join(__dirname, 'dist', 'index-server.d.ts');
  const serverDeclDest = path.join(__dirname, 'dist', 'server.d.ts');

  if (existsSync(serverDeclPath)) {
    let declContent = readFileSync(serverDeclPath, 'utf-8');

    // Create server-specific versions of component declaration files
    // These will be used by server.d.ts instead of the browser versions
    const componentDeclFiles = [
      { src: 'LegitProvider.d.ts', dest: 'LegitProvider-server.d.ts' },
      { src: 'useLegitFile.d.ts', dest: 'useLegitFile-server.d.ts' },
    ];

    for (const { src, dest } of componentDeclFiles) {
      const srcPath = path.join(__dirname, 'dist', src);
      const destPath = path.join(__dirname, 'dist', dest);
      if (existsSync(srcPath)) {
        let content = readFileSync(srcPath, 'utf-8');
        // Replace @legit-sdk/core imports with @legit-sdk/core/server
        content = content.replace(
          /from ['"]@legit-sdk\/core['"]/g,
          "from '@legit-sdk/core/server'"
        );
        writeFileSync(destPath, content, 'utf-8');

        // Update the server.d.ts to reference the server-specific files
        declContent = declContent.replace(
          new RegExp(`from ['"]./${src.replace('.d.ts', '')}['"]`, 'g'),
          `from './${dest.replace('.d.ts', '')}'`
        );
      }
    }

    writeFileSync(serverDeclDest, declContent, 'utf-8');
    console.log('    ✔ Server declaration file copied and fixed');
  } else {
    console.warn(
      `    ⚠ Server declaration file not found at ${serverDeclPath}`
    );
  }
  console.log('✔ All builds complete');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  build();
}

export { build, browserBuildConfig, serverBuildConfig };
