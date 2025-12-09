// Server-specific entry point - imports from @legit-sdk/core/server
// This ensures the server bundle and types reference the server version
// Note: Source files still import from @legit-sdk/core, but the alias plugin
// will resolve it to @legit-sdk/core/server during build, and the declaration
// file will be post-processed to fix the imports.

export { LegitProvider, useLegitContext } from './LegitProvider';
export type {
  LegitContextValue,
  LegitProviderProps,
  LegitConfig,
} from './LegitProvider';
export { useLegitFile } from './useLegitFile';
export type { UseLegitFileReturn, UseLegitFileOptions } from './useLegitFile';
