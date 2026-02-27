/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['lib/**/*.test.ts', '**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
});
