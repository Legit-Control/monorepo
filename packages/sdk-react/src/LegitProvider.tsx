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

import { createLegitSyncService } from '@legit-sdk/core';

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
      const randomId = Math.floor(Math.random() * 1000000) + 1;
      let mainBranch = randomId.toString();
      console.log('Initializing with random ID:', randomId);
      try {
        const _legitFs = await initLegitFs(
          fs as unknown as typeof import('node:fs'),
          '/',
          mainBranch
        );

        const syncService = createLegitSyncService({
          fs: fs as any,
          gitRepoPath: '/',
          serverUrl: 'http://localhost:9992',
          // repoUrl: 'https://monorepo-o36x.onrender.com/Legit-Control/starter-sync.git',
          token:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJncyI6ImJOVC96NG1sWWZKR1BMTm5iZ0RmQ0huZmRiVWE2cWt5OHFGZFl2TCsvRTlydmh0ajRpWDhJWUlDMzBYZnpybFNuQTZuT1N6WDVqaWN1eW8wbCtaeEJpUDJpS1o3N0MrMVgyY0tXcjcwYVovam5pRFZMSHYvTTRtK0VmQS92MEpac09FbHVNQ0dsdVZ5OXZIZk11bHBXbFNFVGxia1ZiL0R5SnlEaWRQU1Rhb0dUeFhrek4yZHlLcW16MWJ1MmkxU2IyZUlxb3RaTk1OL2NiRnpTWi9IbURURDZDTXNVZkp0UnplNk0xRWM5S1VRQzZZUGNiYWJrTnkrU01weW9mZTVpb2IxMGdqNkpQK2pncXJYU1N3eWZSTzdtcU0wL0dRbjdRUktqdXhnTEtTWk51YlVnVDc3VGRYMkRBNUZkN1hHUUo0M1BrVWxuUFUvaEQ3K2szM0Vydz09IiwicnAiOiJMZWdpdC1Db250cm9sL3N0YXJ0ZXItc3luYyIsImJ3IjpbIm1haW4iXSwiaWF0IjoxNzYzNTg2ODYyfQ.dOOpCxzQlXyzpuKgcaLSRrqC1PJ9tySbkhe1pVD6dcGIdEN-iX5ZDPiO3p5xf9XHe5SXRdk5rVqJFXVfzf4sC3xy4e85tMFkPtFHjeKGGhZFtzyzGX0dniHuBxIPHy-hlxjsOgiFU-Jzpoa77Grn-1WMpl_GQCBwL_MNrUI2ZiuI6ruozHCfe_kzpLFzbqA5EqJkGJGnyPYty1CjAcqoZnK7aJ8VgRVzpqsmiwPkTklqluodYIY5xSxpYNzZkPwH1Zf3yFysigU3Ir0q-WiHu01g21UCW54YJRPB6LFkvf8a3nYOAk1_axSWqewyjy-8vqMRWJrDH-ttH_USnc2utg',
        });

        syncService.start();

        if (!isMounted) return;

        setLegitFs(_legitFs);
        setLoading(false);

        // Setup HEAD polling - simple and straightforward
        pollHead = setInterval(async () => {
          if (!isMounted || !_legitFs) return;
          try {
            const newHead = await _legitFs.promises.readFile(
              `/.legit/branches/${mainBranch}/.legit/head`,
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
