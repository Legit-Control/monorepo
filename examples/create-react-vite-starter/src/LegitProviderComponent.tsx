import type { ReactNode } from 'react';
import type { LegitConfig } from '@legit-sdk/react';
import { LegitProvider } from '@legit-sdk/react';

const config: LegitConfig = {
  gitRoot: '/',
  serverUrl: import.meta.env.LEGIT_SERVER_URL,
  publicKey: import.meta.env.LEGIT_PUBLIC_KEY,
  // Create a local `.env` file by copying `env.example` (do not commit secrets).

};

export default function LegitProviderComponent({
  children,
}: {
  children: ReactNode;
}) {
  return <LegitProvider config={config}>{children}</LegitProvider>;
}
