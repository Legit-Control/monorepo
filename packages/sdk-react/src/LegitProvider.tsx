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
import { initLegitFs, openLegitFs } from '@legit-sdk/core'; // your SDK import
import fs from 'memfs'; // in-memory FS for demo

import { createLegitSyncService } from '@legit-sdk/core';

export interface LegitContextValue {
  legitFs: Awaited<ReturnType<typeof initLegitFs>> | null;
  loading: boolean;
  syncing: boolean;
  head: string | null;
  branch: string | null;
  setBranch: (branch: string) => Promise<void>;
  startSync: () => Promise<void>;
  stopSync: () => Promise<void>;
  error?: Error;
}

const LegitContext = createContext<LegitContextValue>({
  legitFs: null,
  loading: true,
  syncing: false,
  head: null,
  branch: null,
  setBranch: async () => {},
  startSync: async () => {},
  stopSync: async () => {},
});

export const useLegitContext = () => useContext(LegitContext);

export interface LegitProviderProps {
  children: ReactNode;
  config: LegitConfig;
  getSyncToken: GetSyncToken;
}

export type LegitConfig = {
  initialBranch?: string;
  sync?: {
    serverUrl: string; // hub.legitcontrol.com
    gitRepoPath: string;
  };
};

export type GetSyncToken = {
  (legitFs?: Awaited<ReturnType<typeof initLegitFs>>): Promise<string>;
};

const DEFAULT_POLL_INTERVAL = 100; // Increased from 200ms to reduce polling frequency

export const LegitProvider = ({
  children,
  config,
  getSyncToken,
}: LegitProviderProps) => {
  const [legitFs, setLegitFs] = useState<Awaited<
    ReturnType<typeof initLegitFs>
  > | null>(null);
  const legitFsRef = useRef<Awaited<ReturnType<typeof initLegitFs>> | null>(
    null
  );
  const headRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [head, setHead] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(
    config.initialBranch || null
  );

  const handleSetBranch = async (newBranch: string) => {
    if (!legitFsRef.current) {
      console.error('No legitFs instance available');
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement setBranch method on legitFs instance
      // await legitFsRef.current.setBranch(newBranch);
      console.log('Setting branch to:', newBranch);
      setBranch(newBranch);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let pollHead: NodeJS.Timeout | undefined;
    let lastSeenHead = '';

    const initFs = async (branchName?: string) => {
      const token = await getSyncToken(); // 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJncyI6ImJOVC96NG1sWWZKR1BMTm5iZ0RmQ0huZmRiVWE2cWt5OHFGZFl2TCsvRTlydmh0ajRpWDhJWUlDMzBYZnpybFNuQTZuT1N6WDVqaWN1eW8wbCtaeEJpUDJpS1o3N0MrMVgyY0tXcjcwYVovam5pRFZMSHYvTTRtK0VmQS92MEpac09FbHVNQ0dsdVZ5OXZIZk11bHBXbFNFVGxia1ZiL0R5SnlEaWRQU1Rhb0dUeFhrek4yZHlLcW16MWJ1MmkxU2IyZUlxb3RaTk1OL2NiRnpTWi9IbURURDZDTXNVZkp0UnplNk0xRWM5S1VRQzZZUGNiYWJrTnkrU01weW9mZTVpb2IxMGdqNkpQK2pncXJYU1N3eWZSTzdtcU0wL0dRbjdRUktqdXhnTEtTWk51YlVnVDc3VGRYMkRBNUZkN1hHUUo0M1BrVWxuUFUvaEQ3K2szM0Vydz09IiwicnAiOiJMZWdpdC1Db250cm9sL3N0YXJ0ZXItc3luYyIsImJ3IjpbIm1haW4iXSwiaWF0IjoxNzYzNTg2ODYyfQ.dOOpCxzQlXyzpuKgcaLSRrqC1PJ9tySbkhe1pVD6dcGIdEN-iX5ZDPiO3p5xf9XHe5SXRdk5rVqJFXVfzf4sC3xy4e85tMFkPtFHjeKGGhZFtzyzGX0dniHuBxIPHy-hlxjsOgiFU-Jzpoa77Grn-1WMpl_GQCBwL_MNrUI2ZiuI6ruozHCfe_kzpLFzbqA5EqJkGJGnyPYty1CjAcqoZnK7aJ8VgRVzpqsmiwPkTklqluodYIY5xSxpYNzZkPwH1Zf3yFysigU3Ir0q-WiHu01g21UCW54YJRPB6LFkvf8a3nYOAk1_axSWqewyjy-8vqMRWJrDH-ttH_USnc2utg';

      const syncService = config.sync
        ? createLegitSyncService({
            fs: fs as any,
            gitRepoPath: config.sync.gitRepoPath, // '/',
            serverUrl: config.sync.serverUrl, // 'http://localhost:9992',
            // repoUrl: 'https://monorepo-o36x.onrender.com/Legit-Control/starter-sync.git',
            token,
          })
        : undefined;

      if (branchName) {
        try {
          if (syncService) {
            await syncService.clone(token, branchName);
          }
          const _legitFs = await openLegitFs(
            fs as unknown as typeof import('node:fs'),
            '/',
            branchName
          );

          legitFsRef.current = _legitFs;
          setLegitFs(_legitFs);
          setBranch(branchName);
          setLoading(false);
        } catch (err) {
          if (isMounted) {
            setError(err as Error);
            setLoading(false);
          }
        }
      } else {
        // generating BranchID
        const randomId = Math.floor(Math.random() * 1000000) + 1;
        let mainBranch = randomId.toString();
        console.log('Initializing with branch:', mainBranch);

        try {
          const _legitFs = await initLegitFs(
            fs as unknown as typeof import('node:fs'),
            '/',
            mainBranch
          );

          if (!isMounted) return;

          legitFsRef.current = _legitFs;
          setLegitFs(_legitFs);
          setBranch(mainBranch);
          setLoading(false);
        } catch (err) {
          if (isMounted) {
            setError(err as Error);
            setLoading(false);
          }
        }
      }

      // @ts-ignore
      if (typeof window !== 'undefined') {
        (window as any).legitFs = legitFsRef.current;
      }
      if (syncService) {
        syncService.start();
        setSyncing(true);
      } else {
        setSyncing(false);
      }

      const _legitFs = legitFsRef.current;
      let isRunning = false;
      if (_legitFs) {
        pollHead = setInterval(async () => {
          if (isRunning) {
            console.log('Skipping poll - previous still running');
            return;
          }
          isRunning = true;
          try {
            const newHead = await _legitFs.promises.readFile(
              `/.legit/branches/${branch}/.legit/head`,
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
          } finally {
            isRunning = false;
          }
        }, DEFAULT_POLL_INTERVAL);
      }
    };

    initFs(config.initialBranch);

    return () => {
      isMounted = false;
      if (pollHead) clearInterval(pollHead);
    };
  }, [config.initialBranch]);

  return (
    <LegitContext.Provider
      value={{
        legitFs,
        loading,
        syncing,
        head,
        branch,
        setBranch: handleSetBranch,
        error,
        startSync: async () => {},
        stopSync: async () => {},
      }}
    >
      {children}
    </LegitContext.Provider>
  );
};
