import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Single bundle config - works in both browser and Next.js SSR
// Components check for window and stub in SSR
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
  external: ['react', 'react-dom', 'react/jsx-runtime', '@legit-sdk/core'],
  // ✔ Node core modules replaced with browser shims
  // ✔ @legit-sdk/core is external - loaded dynamically only in browser
  // ✔ React and jsx-runtime are external for Next.js compatibility
  plugins: [nodeModulesPolyfillPlugin()],
  banner: {
    js: `// @legit-sdk/react - works in browser and Next.js SSR\n`,
  },
};

async function build() {
  console.log('Building @legit-sdk/react...');

  // Build single bundle (works in both browser and Next.js SSR)
  // Components check for window and stub in SSR
  console.log('  → Building bundle...');
  await esbuild.build(browserBuildConfig);
  console.log('    ✔ Bundle complete');

  console.log('✔ Build complete');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  build();
}

export { build, browserBuildConfig };
