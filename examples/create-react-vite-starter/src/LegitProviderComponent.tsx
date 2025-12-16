import type { ReactNode } from 'react';
import type { LegitConfig } from '@legit-sdk/react';
import { LegitProvider } from '@legit-sdk/react';

const serverUrl = import.meta.env.VITE_LEGIT_SERVER_URL;
const publicKey = import.meta.env.VITE_LEGIT_PUBLIC_KEY;

if (!serverUrl || !publicKey) {
  console.error(
    'Missing Legit env vars. Set VITE_LEGIT_SERVER_URL and VITE_LEGIT_PUBLIC_KEY. Read more at https://www.legitcontrol.com/docs/sync.'
  );
}

const config: LegitConfig = {
  gitRoot: '/',
  serverUrl,
  publicKey,
  // Create a local `.env` file by copying `env.example` (do not commit secrets).
};

export default function LegitProviderComponent({
  children,
}: {
  children: ReactNode;
}) {
  return <LegitProvider config={config}>{children}</LegitProvider>;
}
