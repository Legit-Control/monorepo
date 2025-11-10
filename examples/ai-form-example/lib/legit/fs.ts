'use client';

import { Volume, createFsFromVolume } from 'memfs';

import { initLegitFs } from '@legit-sdk/core';

type LegitFsInstance = Awaited<ReturnType<typeof initLegitFs>>;

export interface ClientLegitFsContext {
  volume: Volume;
  storageFs: ReturnType<typeof createFsFromVolume>;
  legitFs: LegitFsInstance;
}

type GlobalWithLegit = typeof globalThis & {
  __legitClientFs?: Promise<ClientLegitFsContext>;
};

const globalLegit = globalThis as GlobalWithLegit;

async function createLegitFsContext(): Promise<ClientLegitFsContext> {
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

export function resetClientLegitFs() {
  delete globalLegit.__legitClientFs;
}

export function getClientLegitFs(): Promise<ClientLegitFsContext> {
  if (!globalLegit.__legitClientFs) {
    globalLegit.__legitClientFs = createLegitFsContext();
  }

  return globalLegit.__legitClientFs;
}
