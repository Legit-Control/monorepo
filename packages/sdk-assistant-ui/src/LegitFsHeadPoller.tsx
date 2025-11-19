import { useEffect } from 'react';
import { useAssistantApi } from '@assistant-ui/react';

import { syncThreadFromLegitFs } from './sync';
import { useLegitFs } from './LegitFsProvider';
import { readHead } from './storage';

const POLL_INTERVAL_MS = 100;

export function LegitFsHeadPoller() {
  const { legitFs, threadId } = useLegitFs();
  const api = useAssistantApi();
  const threadApi = api.thread();

  useEffect(() => {
    if (!legitFs || !threadId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastSyncedHead: string | null = null;

    const scheduleNext = () => {
      if (!cancelled) {
        timer = setTimeout(tick, POLL_INTERVAL_MS);
      }
    };

    const tick = async () => {
      try {
        const head = await readHead(threadId);
        if (cancelled) {
          return;
        }

        if (head === lastSyncedHead) {
          return;
        }

        const { isRunning, isLoading } = threadApi.getState();
        if (isRunning || isLoading) {
          // Wait until the thread is idle to avoid interrupting active runs.
          return;
        }

        setTimeout(async () => {
          await syncThreadFromLegitFs({
            threadId,
            threadApi,
          });
          lastSyncedHead = head;
        }, 100);
      } catch (error) {
        const code = (error as { code?: string }).code;
        if (code !== 'ENOENT') {
          console.error('Failed to poll Legit head', error);
        }
      } finally {
        scheduleNext();
      }
    };

    scheduleNext();

    return () => {
      cancelled = true;
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    };
  }, [legitFs, threadApi, threadId]);

  return null;
}
