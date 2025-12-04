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
import { openLegitFs } from '@legit-sdk/core'; // your SDK import
import fs from 'memfs'; // in-memory FS for demo

export interface LegitContextValue {
  legitFs: Awaited<ReturnType<typeof openLegitFs>> | null;
  loading: boolean;
  head: string | null;
  rollback: (commitHash: string) => Promise<void>;
  error?: Error;
}

const LegitContext = createContext<LegitContextValue>({
  legitFs: null,
  loading: true,
  head: null,
  rollback: async () => {},
});

export const useLegitContext = () => useContext(LegitContext);

export interface LegitProviderProps {
  children: ReactNode;
  config?: LegitConfig;
}

export type LegitConfig = {
  gitRoot: string;
  initialBranch?: string;
  serverUrl?: string;
  publicKey?: string;
};

const defaultConfig: LegitConfig = {
  gitRoot: '/',
};

const DEFAULT_POLL_INTERVAL = 100; // Increased from 200ms to reduce polling frequency

export const LegitProvider = ({
  children,
  config = defaultConfig,
}: LegitProviderProps) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [legitFs, setLegitFs] = useState<Awaited<
    ReturnType<typeof openLegitFs>
  > | null>(null);

  const headRef = useRef<string | null>(null);
  const [error, setError] = useState<Error | undefined>();
  const [head, setHead] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirstRender) return;

    const init = async () => {
      try {
        const _legitFs = await openLegitFs({
          storageFs: fs as unknown as typeof import('node:fs'),
          gitRoot: config.gitRoot,
          serverUrl: config.serverUrl,
          publicKey: config.publicKey,
        });

        if (config.publicKey) {
          // NOTE for now the public key functions as access token directly
          await _legitFs.auth.addAccessToken(config.publicKey);
          _legitFs.sync.start();
        }

        if (_legitFs) {
          setLegitFs(_legitFs);
        }
      } catch (err) {
        setError(err as Error);
      }
    };

    init();
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    if (!legitFs) return;

    (window as any).legitFs = legitFs;

    const pollHead = setInterval(async () => {
      const currentBranch = await legitFs.getCurrentBranch();
      try {
        const newHead = await legitFs.promises.readFile(
          `/.legit/branches/${currentBranch}/.legit/head`,
          'utf8'
        );
        if (newHead !== headRef.current) {
          headRef.current = newHead;
          setHead(newHead);
        }
      } catch (err) {
        // TODO: for now ignore error because of polling design
      }
    }, DEFAULT_POLL_INTERVAL);

    return () => {
      clearInterval(pollHead);
    };
  }, [legitFs]);

  // TODO: enable rollback for operations as well
  const rollback = async (commitHash: string) => {
    if (!legitFs) {
      console.error('No legitFs instance available');
      return;
    }
    try {
      const currentBranch = await legitFs.getCurrentBranch();
      await legitFs.promises.writeFile(
        `/.legit/branches/${currentBranch}/.legit/head`,
        commitHash,
        'utf8'
      );
    } catch (err) {
      setError(err as Error);
    }
  };

  return (
    <LegitContext.Provider
      value={{
        legitFs,
        loading: legitFs === null,
        head,
        rollback,
        error,
      }}
    >
      {children}
    </LegitContext.Provider>
  );
};
