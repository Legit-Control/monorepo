import type { ReactNode } from 'react';
import type { LegitConfig } from '@legit-sdk/react';
import { LegitProvider } from '@legit-sdk/react';

const config: LegitConfig = {
  gitRoot: '/',
  // Vite only exposes env vars prefixed with VITE_.
  // Create a local `.env` file by copying `env.example` (do not commit secrets).
  serverUrl: import.meta.env.LEGIT_SERVER_URL,
  publicKey: import.meta.env.LEGIT_PUBLIC_KEY,
};

export default function LegitProviderComponent({
  children,
}: {
  children: ReactNode;
}) {
  return <LegitProvider config={config}>{children}</LegitProvider>;
}
