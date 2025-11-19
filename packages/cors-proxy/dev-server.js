#!/usr/bin/env node

import { createServer } from 'node:http';
import handleRequest from './index.js';

const port = process.env.PORT || 9999;

const server = createServer(handleRequest);
server.listen(port, () => {
  console.log(`🚀 CORS Proxy server running in development mode on port ${port}`);
  console.log(`📝 Create Token Form: http://localhost:${port}/create-token-form`);
  console.log(`🏠 Landing Page: http://localhost:${port}/`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  server.close(() => {
    console.log('✅ Server stopped gracefully');
    process.exit(0);
  });
});

process.on('beforeExit', () => {
  server.close();
});