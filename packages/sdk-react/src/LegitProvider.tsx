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

import { createLegitSyncService } from '@legit-sdk/core';

export interface LegitContextValue {
  legitFs: Awaited<ReturnType<typeof openLegitFs>> | null;
  loading: boolean;
  syncing: boolean;
  head: string | null;
  branch: string | null;
  setBranch: (branch: string) => Promise<void>;
  startSync: () => Promise<void>;
  stopSync: () => Promise<void>;
  rollback: (commitHash: string) => Promise<void>;
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
  rollback: async () => {},
});

export const useLegitContext = () => useContext(LegitContext);

export interface LegitProviderProps {
  children: ReactNode;
  config?: LegitConfig;
  getSyncToken?: GetSyncToken;
}

type User = {
  id: string;
  type: 'anonymous' | 'user';
  // Used for commits
  name: string; // can be changed (we could even change it in unpushed commits)
  email: string; // anonymous@legitcontrol.com for anonymous users, on of the users emails for logged in users
};

// in the current setup an anonymous session is established by the branch shared with a user
//
type Session = {
  type: 'local' | 'anonymous' | 'user';
};

export type LegitConfig = {
  initialBranch?: string;
  sync?: {
    serverUrl: string; // hub.legitcontrol.com
    gitRepoPath: string; // unique repo path
  };
};

const defaultConfig: LegitConfig = {};

export type GetSyncToken = {
  (legitFs?: Awaited<ReturnType<typeof openLegitFs>>): Promise<string>;
};

const DEFAULT_POLL_INTERVAL = 100; // Increased from 200ms to reduce polling frequency

export const LegitProvider = ({
  children,
  config = defaultConfig,
  getSyncToken,
}: LegitProviderProps) => {
  const [legitFs, setLegitFs] = useState<Awaited<
    ReturnType<typeof openLegitFs>
  > | null>(null);

  const headRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [head, setHead] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(
    config.initialBranch || null
  );

  const handleSetBranch = async (newBranch: string) => {
    if (!legitFs) {
      console.error('No legitFs instance available');
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement setBranch method on legitFs instance
      console.log('Setting branch to:', newBranch);
      setBranch(newBranch);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  // TODO: enable rollback for operations as well
  const handleRollback = async (commitHash: string) => {
    if (!legitFs) {
      console.error('No legitFs instance available');
      return;
    }
    try {
      await legitFs.promises.writeFile(
        `/.legit/branches/${branch}/.legit/head`,
        commitHash,
        'utf8'
      );
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let pollHead: NodeJS.Timeout | undefined;
    let lastSeenHead = '';

    const initFs = async (branchName?: string) => {
      const token = getSyncToken ? await getSyncToken() : undefined;

      if (config.sync && !token)
        throw new Error('getSyncToken is required when sync is enabled');
      debugger;
      const syncService =
        config.sync && token
          ? createLegitSyncService({
              fs: fs as any,
              gitRepoPath: config.sync!.gitRepoPath, // will not run if not sync ready
              serverUrl: config.sync!.serverUrl, // will not run if not sync ready
              token: token!, // will throw if token is undefined
            })
          : undefined;

      try {
        const _legitFs = await openLegitFs({
          storageFs: fs as unknown as typeof import('node:fs'),
          gitRoot: '/',
          defaultBranch: branchName,
        });

        if (branchName) {
          await _legitFs.setCurrentBranch(branchName);
          setBranch(branchName);
        }
        setLegitFs(_legitFs);
        setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }

      // start syncing
      if (syncService) {
        // syncService.start();
        setSyncing(true);
      } else {
        setSyncing(false);
      }

      let isRunning = false;
      if (legitFs && branch) {
        pollHead = setInterval(async () => {
          const _legitFs = legitFs;
          if (!_legitFs) return;
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

    if (!legitFs) {
      initFs(branch ?? config.initialBranch);
    }

    return () => {
      isMounted = false;
      if (pollHead) clearInterval(pollHead);
    };
  }, [config.initialBranch, branch]);

  return (
    <LegitContext.Provider
      value={{
        legitFs,
        loading,
        syncing,
        head,
        branch,
        setBranch: handleSetBranch,
        rollback: handleRollback,
        error,
        startSync: async () => {},
        stopSync: async () => {},
      }}
    >
      {children}
    </LegitContext.Provider>
  );
};
