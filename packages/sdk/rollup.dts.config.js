import dts from 'rollup-plugin-dts';

export default {
  input: './dist/index.d.ts', // where tsc outputs your declaration files
  output: [{ file: 'dist/index.d.ts', format: 'es' }],
  plugins: [dts()],
  external: [
    // Mark Node.js built-ins as external to suppress warnings
    /^node:/,
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
  ],
};
