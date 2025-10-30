import dts from 'rollup-plugin-dts';

export default {
  input: './dist/index.d.ts', // where tsc outputs your declaration files
  output: [{ file: 'dist/index.d.ts', format: 'es' }],
  plugins: [dts()],
};
