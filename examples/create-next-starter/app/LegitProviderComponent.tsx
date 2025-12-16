'use client';

import { ReactNode } from 'react';
import { LegitConfig, LegitProvider } from '@legit-sdk/react';

const serverUrl = process.env.NEXT_PUBLIC_LEGIT_SERVER_URL;
const publicKey = process.env.NEXT_PUBLIC_LEGIT_PUBLIC_KEY;

if (!serverUrl || !publicKey) {
  console.error(
    'Missing Legit env vars. Set NEXT_PUBLIC_LEGIT_SERVER_URL and NEXT_PUBLIC_LEGIT_PUBLIC_KEY. Read more at https://www.legitcontrol.com/docs/sync.'
  );
}

const config: LegitConfig = {
  gitRoot: '/',
  serverUrl,
  publicKey,
  // serverUrl: 'https://hub.legitcontrol.com',
};

export default function LegitProviderComponent(props: {
  children: ReactNode;
}): ReactNode {
  return <LegitProvider config={config}>{props.children}</LegitProvider>;
}
