// LegitProvider.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import { initLegitFs } from '@legit-sdk/core'; // your SDK import
import fs from 'memfs'; // in-memory FS for demo

export interface LegitContextValue {
  legitFs: Awaited<ReturnType<typeof initLegitFs>> | null;
  loading: boolean;
  head: string | null;
  error?: Error;
}

const LegitContext = createContext<LegitContextValue>({
  legitFs: null,
  loading: true,
  head: null,
});

export const useLegitContext = () => useContext(LegitContext);

export interface LegitProviderProps {
  children: ReactNode;
}

export const LegitProvider = ({ children }: LegitProviderProps) => {
  const [legitFs, setLegitFs] = useState<Awaited<
    ReturnType<typeof initLegitFs>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [head, setHead] = useState<string | null>(null);
  const headRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let pollHead: NodeJS.Timeout | undefined;

    const initFs = async () => {
      try {
        const _legitFs = await initLegitFs(
          fs as unknown as typeof import('node:fs'),
          '/'
        );

        if (!isMounted) return;

        setLegitFs(_legitFs);
        setLoading(false);

        // Optional: setup HEAD polling
        pollHead = setInterval(async () => {
          if (!_legitFs) return;
          try {
            const newHead = await _legitFs.promises.readFile(
              '/.legit/branches/main/.legit/head',
              'utf8'
            );
            if (newHead !== headRef.current) {
              headRef.current = newHead;
              setHead(newHead);
            }
          } catch (e) {
            console.error('Polling head failed:', e);
          }
        }, 200);

        return () => clearInterval(pollHead);
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    initFs();

    return () => {
      isMounted = false;
      if (pollHead) clearInterval(pollHead);
    };
  }, []);

  return (
    <LegitContext.Provider value={{ legitFs, loading, head, error }}>
      {children}
    </LegitContext.Provider>
  );
};
