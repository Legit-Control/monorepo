import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './packages/sdk/vitest.config.ts',
  './packages/sdk-react/vitest.config.ts',
  // add all package test configs here
]);
