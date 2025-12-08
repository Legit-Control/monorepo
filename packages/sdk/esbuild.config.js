import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

  // Copy server declaration file from TypeScript output to root
  // TypeScript outputs index-server.d.ts, we need to copy it to server.d.ts
  const serverDeclPath = path.join(__dirname, 'dist', 'index-server.d.ts');
  const serverDeclDest = path.join(__dirname, 'dist', 'server.d.ts');
  if (existsSync(serverDeclPath)) {
    const declContent = readFileSync(serverDeclPath, 'utf-8');
    writeFileSync(serverDeclDest, declContent, 'utf-8');
    console.log('    ✔ Server declaration file copied');
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
