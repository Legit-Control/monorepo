import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.integration.test.ts'],
    testTimeout: 30000, // 30 second timeout for integration tests
    hookTimeout: 30000,
    teardownTimeout: 30000,
    isolate: false, // Share context between tests
    reporters: ['verbose'],
  },
});
