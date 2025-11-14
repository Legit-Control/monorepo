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

const DEFAULT_POLL_INTERVAL = 100; // Increased from 200ms to reduce polling frequency

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
    let lastSeenHead = '';

    const initFs = async () => {
      try {
        const _legitFs = await initLegitFs(
          fs as unknown as typeof import('node:fs'),
          '/'
        );

        if (!isMounted) return;

        setLegitFs(_legitFs);
        setLoading(false);

        // Setup HEAD polling - simple and straightforward
        pollHead = setInterval(async () => {
          if (!isMounted || !_legitFs) return;
          try {
            const newHead = await _legitFs.promises.readFile(
              '/.legit/branches/main/.legit/head',
              'utf8'
            );
            // Only update if HEAD actually changed
            if (newHead !== lastSeenHead && newHead !== headRef.current) {
              lastSeenHead = newHead;
              headRef.current = newHead;
              setHead(newHead);
            }
          } catch (e) {
            // Silently ignore polling errors - HEAD might not exist yet
            if (isMounted && (e as any)?.code !== 'ENOENT') {
              console.error('Polling head failed:', e);
            }
          }
        }, DEFAULT_POLL_INTERVAL);
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
