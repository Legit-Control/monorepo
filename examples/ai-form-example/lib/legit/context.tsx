'use client';

import {
  createContext,
  useContext,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

import type { LegitRuntimeApi } from '../useLegitRuntime';

const LegitContext = createContext<LegitRuntimeApi | null>(null);

export function LegitProvider({
  value,
  children,
}: PropsWithChildren<{ value: LegitRuntimeApi | null }>) {
  return (
    <LegitContext.Provider value={value}>{children}</LegitContext.Provider>
  );
}

export function useLegitApi() {
  return useContext(LegitContext);
}
