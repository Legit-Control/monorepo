'use client';

import {
  LegitLocal,
  useLegitFs,
  LegitFsHeadPoller,
} from '@legit-sdk/assistant-ui';
import {
  AssistantProvider,
  AssistantRuntimeProvider,
} from '@assistant-ui/react';
import { useDataStreamRuntime } from '@assistant-ui/react-data-stream';
import { useEffect, useMemo, type ReactNode } from 'react';

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { legitFs } = useLegitFs();
  const legitCloud = useMemo(
    () =>
      new LegitLocal({
        baseUrl: '/api/chat',
        authToken: async () => 'test',
        legitFs,
      }),
    []
  );

  const runtime = useDataStreamRuntime({
    api: '/api/chat',
    cloud: legitCloud,

    headers: async () => {
      await new Promise(resolve => setTimeout(resolve, 1));
      return (window as any).threadContext;
    },
  });

  useEffect(() => {
    legitCloud.runtime = runtime;
  }, [legitCloud, runtime]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <LegitFsHeadPoller />
      {children}
    </AssistantRuntimeProvider>
  );
}
