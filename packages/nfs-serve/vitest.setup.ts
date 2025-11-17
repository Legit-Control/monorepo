import { beforeAll, inject } from 'vitest';
const fs = require('fs');
const path = require('path');

declare global {
  var defined: boolean | undefined;
}

if (!globalThis.defined) {
  globalThis.defined = true;
}

// hooks are reset before each suite
beforeAll(() => {
  const SERVE_POINT = inject('servepoint');

  const files = fs.readdirSync(SERVE_POINT);
  for (const file of files) {
    const filePath = path.join(SERVE_POINT, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
});
