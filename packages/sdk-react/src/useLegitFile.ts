import { useEffect, useState } from 'react';
import { useLegitContext } from './LegitProvider';
import { HistoryItem } from '@legit-sdk/core';

export type UseLegitFileReturn = {
  content: string;
  setContent: (newText: string) => Promise<void>;
  history: HistoryItem[];
  getPastState: (commitHash: string) => Promise<string>;
  loading: boolean;
  error?: Error;
};

export function useLegitFile(path: string): UseLegitFileReturn {
  const { legitFs, error: fsError, head } = useLegitContext();
  const [content, setContent] = useState('');
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

        const text =
          textResult.status === 'fulfilled'
            ? (textResult.value as unknown as string)
            : '';

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

        setContent(text);
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
