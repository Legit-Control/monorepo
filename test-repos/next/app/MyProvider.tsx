'use client';

import { ReactNode } from 'react';
import { LegitProvider } from '@legit-sdk/react';

export default function ProviderComponent(props: {
  children: ReactNode;
}): ReactNode {
  return <LegitProvider>{props.children}</LegitProvider>;
}
