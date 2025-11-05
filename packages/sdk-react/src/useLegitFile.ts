import { useEffect, useState, useRef, useCallback } from 'react';
import { useLegitContext } from './LegitProvider';
import { HistoryItem, initLegitFs } from '@legit-sdk/core';

export interface UseLegitFileOptions {
  initialContent?: string;
}

export type UseLegitFileReturn = {
  content: string | null;
  setContent: (newText: string) => Promise<void>;
  history: HistoryItem[];
  getPastState: (commitHash: string) => Promise<string>;
  loading: boolean;
  error?: Error;
  legitFs: Awaited<ReturnType<typeof initLegitFs>> | null;
};

export function useLegitFile(
  path: string,
  options?: UseLegitFileOptions
): UseLegitFileReturn {
  const { legitFs, error: fsError, head } = useLegitContext();
  const [content, setContent] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const pendingSaveRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);
  const isInitializingRef = useRef(false);

  // Load file + history when legitFs is ready or HEAD changes
  useEffect(() => {
    if (!legitFs) return;

    let isCancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const filePath = `/.legit/branches/main${path}`;
        const historyPath = `/.legit/branches/main/.legit/history`;

        // Simple read with graceful error handling
        const [textResult, historyResult] = await Promise.allSettled([
          legitFs.promises.readFile(filePath, 'utf8'),
          legitFs.promises.readFile(historyPath, 'utf8').catch(() => ''),
        ]);

        if (isCancelled) return;

        // Handle file content
        const text =
          textResult.status === 'fulfilled'
            ? (textResult.value as string)
            : null;

        // Handle history
        let parsedHistory: HistoryItem[] = [];
        if (historyResult.status === 'fulfilled') {
          try {
            const historyContent = historyResult.value as string;
            if (historyContent) {
              parsedHistory = JSON.parse(historyContent);
            }
          } catch {
            // Invalid JSON, keep empty array
          }
        }

        // Don't update if we have a pending save with the same content
        if (pendingSaveRef.current === text) {
          pendingSaveRef.current = null;
        }

        setContent(text);
        setHistory(parsedHistory);
        setError(undefined);
      } catch (err: any) {
        // Only set error if it's not a simple "file not found"
        if (err?.code !== 'ENOENT') {
          setError(err as Error);
        } else {
          // File doesn't exist yet - that's ok
          setContent(null);
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
      if (!legitFs) return;

      try {
        // Store pending save to prevent unnecessary reloads
        pendingSaveRef.current = newText;

        // Write file - this triggers commit synchronously
        await legitFs.promises.writeFile(
          `/.legit/branches/main${path}`,
          newText,
          'utf8'
        );

        // Optimistically update - HEAD polling will confirm
        setContent(newText);
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
    if (!loading && content === null && legitFs && options?.initialContent) {
      isInitializingRef.current = true;
      hasInitializedRef.current = true;

      const initialize = async () => {
        try {
          await save(options.initialContent!);
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
  }, [loading, content, legitFs, options?.initialContent, save]);

  const getPastState = async (oid: string) => {
    if (!legitFs) return '';
    try {
      const past = await legitFs.promises.readFile(
        `/.legit/commits/${oid.slice(0, 2)}/${oid.slice(2)}${path}`,
        'utf8'
      );
      return past as unknown as string;
    } catch {
      return '';
    }
  };

  return {
    content,
    setContent: save,
    history,
    getPastState,
    loading,
    error: error ?? fsError,
    legitFs,
  };
}
