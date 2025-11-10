'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useChatRuntime } from '@assistant-ui/react-ai-sdk';

import { getClientLegitFs } from './legit/fs';
import {
  loadAuditTrail,
  loadCommitSnapshot,
  type AuditEntry,
} from './legit/history';

export type LegitRuntimeApi = {
  saveMessages: (messages?: readonly unknown[]) => Promise<void>;
  saveForm: (formState: Record<string, unknown>) => Promise<void>;
  getHistory: () => Promise<AuditEntry[]>;
  rollback: (oid: string) => Promise<{
    messages: unknown[] | null;
    forms: Record<string, unknown> | null;
  }>;
};

type RuntimeWithLegit = ReturnType<typeof useChatRuntime> & {
  __legit?: LegitRuntimeApi;
};

function stableStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return undefined;
  }
}

export function useLegitRuntime() {
  const runtime = useChatRuntime() as RuntimeWithLegit;
  const legitApiRef = useRef<LegitRuntimeApi | null>(null);
  const lastMessagesHashRef = useRef<string | undefined>(undefined);
  const lastFormHashRef = useRef<string | undefined>(undefined);

  const ensureLegitApi = useCallback((): LegitRuntimeApi => {
    if (legitApiRef.current) {
      return legitApiRef.current;
    }

    const saveMessages = async (messages?: readonly unknown[]) => {
      const { legitFs } = await getClientLegitFs();
      const payload =
        messages ?? runtime.thread.getState().messages ?? ([] as unknown[]);
      const hash = stableStringify(payload);
      if (hash && hash === lastMessagesHashRef.current) {
        return;
      }

      await legitFs.promises.writeFile(
        '/.legit/branches/main/messages.json',
        JSON.stringify(payload, null, 2),
        'utf8'
      );

      lastMessagesHashRef.current = hash;
    };

    const saveForm = async (formState: Record<string, unknown>) => {
      const { legitFs } = await getClientLegitFs();
      const hash = stableStringify(formState);
      if (hash && hash === lastFormHashRef.current) {
        return;
      }

      await legitFs.promises.writeFile(
        '/.legit/branches/main/forms.json',
        JSON.stringify(formState, null, 2),
        'utf8'
      );

      lastFormHashRef.current = hash;
    };

    const getHistory = async () => {
      const context = await getClientLegitFs();
      return loadAuditTrail(context);
    };

    const rollback = async (oid: string) => {
      const context = await getClientLegitFs();
      const snapshot = await loadCommitSnapshot(context, oid);

      if (Array.isArray(snapshot.messages)) {
        runtime.thread.reset(snapshot.messages as any);
        lastMessagesHashRef.current = stableStringify(snapshot.messages);
      }

      if (snapshot.forms) {
        lastFormHashRef.current = stableStringify(snapshot.forms);
      }

      return snapshot;
    };

    legitApiRef.current = {
      saveMessages,
      saveForm,
      getHistory,
      rollback,
    };

    return legitApiRef.current;
  }, [runtime]);

  const legitApi = ensureLegitApi();

  useEffect(() => {
    runtime.__legit = legitApi;
  }, [runtime, legitApi]);

  useEffect(() => {
    let unsubscribed = false;
    let prevIsRunning = runtime.thread.getState().isRunning;

    const handleUpdate = () => {
      if (unsubscribed) return;
      const state = runtime.thread.getState();
      const messages = state.messages;
      const messagesHash = stableStringify(messages);

      if (
        (!state.isRunning && messagesHash !== lastMessagesHashRef.current) ||
        (prevIsRunning && !state.isRunning)
      ) {
        void legitApi.saveMessages(messages);
      }

      prevIsRunning = state.isRunning;
    };

    const unsubscribe = runtime.thread.subscribe(handleUpdate);

    handleUpdate();

    return () => {
      unsubscribed = true;
      unsubscribe();
    };
  }, [runtime, legitApi]);

  return useMemo(() => runtime, [runtime]);
}
