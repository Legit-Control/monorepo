import { Volume, createFsFromVolume } from 'memfs';

import { initLegitFs } from '@legit-sdk/core';

type LegitFsInstance = Awaited<ReturnType<typeof initLegitFs>>;

interface LegitFsContext {
  volume: Volume;
  storageFs: ReturnType<typeof createFsFromVolume>;
  legitFs: LegitFsInstance;
}

const globalLegit =
  (globalThis as typeof globalThis & {
    __legitFsContext?: Promise<LegitFsContext>;
  }) ?? globalThis;

async function createLegitFsContext(): Promise<LegitFsContext> {
  const volume = new Volume();
  const storageFs = createFsFromVolume(volume);

  const legitFs = await initLegitFs(
    storageFs as unknown as typeof import('node:fs'),
    '/'
  );

  return {
    volume,
    storageFs,
    legitFs,
  };
}

export async function getLegitFsContext(): Promise<LegitFsContext> {
  if (!globalLegit.__legitFsContext) {
    globalLegit.__legitFsContext = createLegitFsContext();
  }

  return globalLegit.__legitFsContext;
}

export function resetLegitFsContext() {
  delete globalLegit.__legitFsContext;
}
