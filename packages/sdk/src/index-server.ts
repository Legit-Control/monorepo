// Server-specific exports (Node.js, no browser APIs)
// No polyfills needed - Node.js has Buffer and other modules natively

export * from './compositeFs/CompositeFs.js';
export * from './compositeFs/subsystems/HiddenFileSubFs.js';
export * from './compositeFs/subsystems/EphemeralFileSubFs.js';
export * from './compositeFs/subsystems/CopyOnWriteSubFs.js';
export * from './compositeFs/subsystems/PassThroughSubFs.js';

export * from './compositeFs/subsystems/git/virtualFiles/operations/gitBranchOperationsVirtualFile.js';
export * from './legitfs.js';
export * from './sync/createLegitSyncService.js';
// NOTE: browser-fs-access is NOT exported from /server - it's browser-only
export * from './compositeFs/subsystems/git/virtualFiles/types/HistoryItom.js';
export * from './compositeFs/subsystems/git/virtualFiles/types/User.js';
export * from './compositeFs/utils/fs-operation-logger.js';
