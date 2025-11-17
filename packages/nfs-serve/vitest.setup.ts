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
  const MOUNT_POINT = inject('mountpoint');

  const files = fs.readdirSync(MOUNT_POINT);
  for (const file of files) {
    const filePath = path.join(MOUNT_POINT, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
});
