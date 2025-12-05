// Universal polyfills setup
// This file ensures Buffer is available globally for dependencies like isomorphic-git
// Works in both browser and Node.js environments

import { Buffer } from 'buffer';

// Make Buffer available globally for code that expects it
// Only set if not already available (Node.js has it natively)
if (typeof globalThis !== 'undefined' && !globalThis.Buffer) {
  (globalThis as any).Buffer = Buffer;
}
// In browser, also set on window
if (typeof window !== 'undefined' && !window.Buffer) {
  (window as any).Buffer = Buffer;
}

// Re-export Buffer for explicit imports
export { Buffer };
