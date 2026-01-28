/**
 * Barrel file for NFS RPC layer
 *
 * Exports the request handler and all procedures.
 * This allows for simplified imports like:
 *
 * ```typescript
 * import { handleNfsRequest } from './rpc/nfs';
 * import * as procedures from './rpc/nfs/procedures';
 * ```
 */

// Main request handler
export { handleNfsRequest, extractNfsDebugInfo } from './handleNfsRequest.js';

// All procedures (re-export from procedures barrel)
export * from './procedures/index.js';

// Utility functions
export { sendNfsError } from './sendNfsError.js';
export { sendRpcSuccess } from '../sendRpcSuccess.js';
