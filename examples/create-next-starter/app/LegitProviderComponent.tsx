'use client';

import { ReactNode } from 'react';
import { LegitConfig, LegitProvider } from '@legit-sdk/react';

const config: LegitConfig = {
  gitRoot: '/',
  // serverUrl: 'https://hub.legitcontrol.com',
  // publicKey: process.env.NEXT_PUBLIC_LEGIT_PUBLIC_KEY,
};

export default function LegitProviderComponent(props: {
  children: ReactNode;
}): ReactNode {
  return <LegitProvider config={config}>{props.children}</LegitProvider>;
}
