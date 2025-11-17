/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    setupFiles: './src/vitest.setup.ts',
    globalSetup: ['./src/vitest.global-setup.ts'],
    logHeapUsage: true, // optional for seeing memory logs
    reporters: 'verbose',
    pool: 'forks',

    onConsoleLog(log) {
      // print immediately instead of buffering
      process.stdout.write(log + '\n');
      return false; // prevents Vitest from buffering it
    },
  },
});
