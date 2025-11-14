/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    isolate: false, // important to share state between tests
    globalSetup: ['./src/test-setup.ts'],
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
