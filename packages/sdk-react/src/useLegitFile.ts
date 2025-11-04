import { useEffect, useState } from 'react';
import { useLegitContext } from './LegitProvider';
import { HistoryItem } from '@legit-sdk/core';

export type UseLegitFileReturn = {
  content: string | null;
  setContent: (newText: string) => Promise<void>;
  history: HistoryItem[];
  getPastState: (commitHash: string) => Promise<string>;
  loading: boolean;
  error?: Error;
};

export function useLegitFile(path: string): UseLegitFileReturn {
  const { legitFs, error: fsError, head } = useLegitContext();
  const [content, setContent] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  // Load file + history on mount or when HEAD changes
  useEffect(() => {
    if (!legitFs) return;

    const load = async () => {
      setLoading(true);
      try {
        const [textResult, historyResult] = await Promise.allSettled([
          legitFs.promises.readFile(`/.legit/branches/main${path}`, 'utf8'),
          legitFs.promises.readFile(
            `/.legit/branches/main/.legit/history`,
            'utf8'
          ),
        ]);

        let text: string | null = null;
        if (textResult.status === 'fulfilled') {
          text = textResult.value as string;
        } else if (
          (textResult.reason as any)?.code &&
          (textResult.reason as any).code === 'ENOENT'
        ) {
          text = null;
        } else {
          throw textResult.reason;
        }

        let parsedHistory: HistoryItem[] = [];
        if (historyResult.status === 'fulfilled') {
          try {
            parsedHistory = JSON.parse(
              historyResult.value as unknown as string
            );
          } catch {
            parsedHistory = [];
          }
        }

        setContent(text ?? null);
        setHistory(parsedHistory);
        setError(undefined);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [legitFs, path, head]);

  const save = async (newText: string) => {
    if (!legitFs) return;
    await legitFs.promises.writeFile(
      `/.legit/branches/main${path}`,
      newText,
      'utf8'
    );
    setContent(newText);
  };

  const getPastState = async (oid: string) => {
    if (!legitFs) return '';
    try {
      const past = await legitFs.promises.readFile(
        `/.legit/commits/${oid}${path}`,
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
  };
}
