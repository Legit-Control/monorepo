import { defineConfig } from 'vite';
import fs from 'node:fs';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'start-server': './bin/start-server.ts',
        'src-gate': './bin/src-gate.ts'
      },
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        preserveModules: false,
      },
      external: [
        '@legit-sdk/nfs-serve',
        '@legit-sdk/isomorphic-git',
        'commander',
        'node:*',
        'fs',
        'net',
        'path',
        'child_process',
        'memfs',
        'p-limit'
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
        // Make all output files executable
        const files = ['start-server.js', 'src-gate.js'];
        for (const file of files) {
          const outputPath = `dist/${file}`;
          if (fs.existsSync(outputPath)) {
            fs.chmodSync(outputPath, 0o755);
          }
        }
      }
    }
  ]
});
