'use client';

import { AssistantRuntimeProvider } from '@assistant-ui/react';

import { useLegitRuntime } from '@/lib/useLegitRuntime';
import { LegitProvider } from '@/lib/legit/context';

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const runtime = useLegitRuntime();
  const legitApi = runtime.__legit ?? null;

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <LegitProvider value={legitApi}>{children}</LegitProvider>
    </AssistantRuntimeProvider>
  );
}
