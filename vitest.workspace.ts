import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './packages/sdk/vitest.config.ts',
  './packages/sdk-react/vitest.config.ts',
  './packages/nfs-serve/vitest.config.ts',
  './examples/legit-code/vitest.config.js',
  './examples/gnfs/vitest.config.js',
  // add all package test configs here
]);
