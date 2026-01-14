import { CompositeFs } from '@legit-sdk/core';
import { SimpleMemorySubFs } from './simple-subfs.js';

/**
 * Creates a simple filesystem with sample data for testing
 */
export async function createCompositeFs() {
  const rootPath = '/';

  // Create the memory-based SubFS with optional initial data
  const memorySubFs = new SimpleMemorySubFs({
    name: 'memory-storage',
    rootPath: rootPath,
    initialData: {
      'readme.md': '# Welcome to Virtual NFS\n\nThis is a demo filesystem.',
      'package.json': JSON.stringify({
        name: 'virtual-nfs-demo',
        version: '1.0.0',
        description: 'A demo project served via NFS',
      }),
      src: {
        'index.ts': `console.log('Hello from Virtual NFS!');`,
        'greeting.ts': `export function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}`,
        utils: {
          'helpers.ts': `export function add(a: number, b: number) {\n  return a + b;\n}`,
        },
      },
      tests: {
        'greeting.test.ts': `import { greet } from '../src/greeting';\n\ntest('greet', () => {\n  expect(greet('World')).toBe('Hello, World!');\n});`,
      },
    },
  });

  // Create the CompositeFs with the memory SubFS
  // All paths ('[[...relativePath]]') will be served from memory
  const compositeFs = new CompositeFs({
    name: 'simple-fs',
    rootPath: rootPath,
    filterLayers: [],
    routes: {
      '[[...relativePath]]': memorySubFs,
    },
  });

  return compositeFs;
}
