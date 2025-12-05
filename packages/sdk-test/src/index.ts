// Import browser polyfills first to set up globals like Buffer
import './browser-polyfills.js';

// Browser-specific exports
export * from './adapter/browser-fs-access.js';

// Core exports
export * from './index-server.js';
