import { defineConfig } from 'vite';
import fs from 'node:fs';

export default defineConfig({
  build: {
    lib: {
      entry: './bin/start-server.ts',
      name: 'gnfs',
      fileName: 'start-server',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'start-server.js',
        preserveModules: false,
      },
      external: [
        '@legit-sdk/nfs-serve',
        'commander',
        'node:*',
        'fs',
        'net',
        'path',
        'child_process',
      ]
    },
    minify: false,
    target: 'node18',
    ssr: true,
  },
  plugins: [
    {
      name: 'chmod-executable',
      writeBundle() {
        // Make the output file executable
        const outputPath = 'dist/start-server.js';
        if (fs.existsSync(outputPath)) {
          fs.chmodSync(outputPath, 0o755);
        }
      }
    }
  ]
});
