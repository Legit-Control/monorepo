import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@legit-sdk/core': new URL(
        './src/__mocks__/core-shim.ts',
        import.meta.url
      ).pathname,
    },
  },
});
