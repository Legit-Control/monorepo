import type { ReactNode } from 'react';
import type { LegitConfig } from '@legit-sdk/react';
import { LegitProvider } from '@legit-sdk/react';

const config: LegitConfig = {
  gitRoot: '/',
};

export default function LegitProviderComponent({
  children,
}: {
  children: ReactNode;
}) {
  return <LegitProvider config={config}>{children}</LegitProvider>;
}
