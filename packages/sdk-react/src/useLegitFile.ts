import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useLegitContext } from './LegitProvider';

// Type-only import to avoid loading the module during SSR
type HistoryItem = import('@legit-sdk/core').HistoryItem;
type OpenLegitFs = (typeof import('@legit-sdk/core'))['openLegitFs'];

export interface UseLegitFileOptions {
  initialData?: string;
}

export type UseLegitFileReturn = {
  data: string | null;
  setData: (newText: string) => Promise<void>;
  history: HistoryItem[];
  getPastState: (commitHash: string) => Promise<string>;
  loading: boolean;
  error?: Error;
  legitFs: Awaited<ReturnType<OpenLegitFs>> | null;
};

export function useLegitFile(
  path: string,
  options?: UseLegitFileOptions
): UseLegitFileReturn {
  const { legitFs, error: fsError, head } = useLegitContext();

  const [data, setData] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const pendingSaveRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);
  const isInitializingRef = useRef(false);

  // Load file + history when legitFs is ready or HEAD changes
  useEffect(() => {
    // SSR safety: no-op in SSR
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    if (!legitFs) return;

    let isCancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const currentBranch = await legitFs.getCurrentBranch();

        const filePath = `/.legit/branches/${currentBranch}${path}`;
        const historyPath = `/.legit/branches/${currentBranch}/.legit/history`;

        // Simple read with graceful error handling
        // const [textResult, historyResult] = await Promise.allSettled([
        const text = await legitFs.promises.readFile(filePath, 'utf8');
        const historyResult = await legitFs.promises
          .readFile(historyPath, 'utf8')
          .catch(() => '');
        // ]);

        if (isCancelled) return;

        // Handle history
        let parsedHistory: HistoryItem[] = [];

        const historyContent = historyResult as string;
        if (historyContent) {
          parsedHistory = JSON.parse(historyContent);
        }

        // Don't update if we have a pending save with the same content
        if (pendingSaveRef.current === text) {
          pendingSaveRef.current = null;
        }

        setData(text);
        setHistory(parsedHistory);
        setError(undefined);
      } catch (err: any) {
        // Only set error if it's not a simple "file not found"
        if (err?.code !== 'ENOENT') {
          setError(err as Error);
        } else {
          // File doesn't exist yet - that's ok
          setData(null);
          setHistory([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isCancelled = true;
    };
  }, [legitFs, path, head]);

  // Save function
  const save = useCallback(
    async (newText: string) => {
      // SSR safety: no-op in SSR
      if (typeof window === 'undefined') return;

      if (!legitFs) return;

      try {
        // Store pending save to prevent unnecessary reloads
        pendingSaveRef.current = newText;

        const currentBranch = await legitFs.getCurrentBranch();

        // Write file - this triggers commit synchronously
        await legitFs.promises.writeFile(
          `/.legit/branches/${currentBranch}${path}`,
          newText,
          'utf8'
        );

        // Optimistically update - HEAD polling will confirm
        setData(newText);
      } catch (err) {
        pendingSaveRef.current = null;
        setError(err as Error);
        throw err;
      }
    },
    [legitFs, path]
  );

  // Auto-initialize file if it doesn't exist and initialContent is provided
  useEffect(() => {
    // Only initialize once per mount
    if (hasInitializedRef.current || isInitializingRef.current) return;

    // Conditions for initialization:
    // 1. File loading is complete
    // 2. Content is null (file doesn't exist)
    // 3. legitFs is ready
    // 4. initialContent option is provided
    if (!loading && data === null && legitFs && options?.initialData) {
      isInitializingRef.current = true;
      hasInitializedRef.current = true;

      const initialize = async () => {
        try {
          await save(options.initialData!);
        } catch (err) {
          // If initialization fails, reset flag so it can be retried
          // (but only if component is still mounted)
          console.error('Failed to initialize file:', err);
          hasInitializedRef.current = false;
        } finally {
          isInitializingRef.current = false;
        }
      };

      initialize();
    }
  }, [loading, data, legitFs, options?.initialData, save]);

  const getPastState = useCallback(
    async (oid: string) => {
      // SSR safety: return empty string in SSR
      if (typeof window === 'undefined') return '';

      if (!legitFs) return '';
      try {
        // Remove leading slash from path for git commit file access
        const gitPath = path.startsWith('/') ? path.slice(1) : path;
        const past = await legitFs.promises.readFile(
          `/.legit/commits/${oid.slice(0, 2)}/${oid.slice(2)}/${gitPath}`,
          'utf8'
        );
        return past as unknown as string;
      } catch {
        return '';
      }
    },
    [legitFs, path]
  );

  return {
    data,
    setData: save,
    history: useMemo(() => history, [history]),
    getPastState,
    loading,
    error: error ?? fsError,
    legitFs,
  };
}
