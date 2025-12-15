// LegitProvider.tsx
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useRef } from 'react';

// Type-only import to avoid loading the module during SSR
type OpenLegitFsWithMemoryFs =
  (typeof import('@legit-sdk/core'))['openLegitFsWithMemoryFs'];

export interface LegitContextValue {
  legitFs: Awaited<ReturnType<OpenLegitFsWithMemoryFs>> | null;
  loading: boolean;
  head: string | null;
  rollback: (commitHash: string) => Promise<void>;
  error?: Error;
}

// Ensure React is available before creating context
// This prevents SSR issues where React might be null during module evaluation
const createLegitContext = () => {
  if (typeof createContext === 'undefined' || !createContext) {
    throw new Error(
      'React createContext is not available. Make sure React is properly installed.'
    );
  }
  return createContext<LegitContextValue>({
    legitFs: null,
    loading: true,
    head: null,
    rollback: async () => {},
  });
};

const LegitContext = createLegitContext();

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
    ReturnType<OpenLegitFsWithMemoryFs>
  > | null>(null);

  const headRef = useRef<string | null>(null);
  const [error, setError] = useState<Error | undefined>();
  const [head, setHead] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirstRender) return;

    // SSR safety: only initialize in browser
    if (typeof window === 'undefined') {
      setIsFirstRender(false);
      return;
    }

    const init = async () => {
      try {
        // Lazy-load the module only in browser to avoid SSR issues with browser-fs-access
        const { openLegitFsWithMemoryFs } = await import('@legit-sdk/core');
        const _legitFs = await openLegitFsWithMemoryFs({
          gitRoot: config.gitRoot,
          serverUrl: config.serverUrl,
          publicKey: config.publicKey,
        } as Parameters<typeof openLegitFsWithMemoryFs>[0]);

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

    // SSR safety: only run in browser
    if (typeof window === 'undefined') return;

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
    // SSR safety: no-op in SSR
    if (typeof window === 'undefined') return;

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
