import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './packages/fs/vitest.config.ts',
  './packages/sdk-react/vitest.config.ts',
  './packages/nfs-serve/vitest.config.ts',
  // add all package test configs here
]);
