'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useMediaQuery } from '@react-hook/media-query';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Thread } from '@/components/assistant-ui/thread';

export const AssistantSidebar: FC<PropsWithChildren> = ({ children }) => {
  const isSmall = useMediaQuery('(max-width: 768px)');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const desktopLayout = (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-h-[calc(100vh-100px)]"
    >
      {/* @ts-ignore */}
      <ResizablePanel>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Thread />
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  const mobileLayout = (
    <Tabs
      defaultValue="app"
      className="mx-auto flex h-full max-w-[480px] flex-col px-4 pt-4"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="app">Form</TabsTrigger>
        <TabsTrigger value="thread">Chat</TabsTrigger>
      </TabsList>
      <TabsContent value="app">{children}</TabsContent>
      <TabsContent value="thread">
        <Thread />
      </TabsContent>
    </Tabs>
  );

  if (!hydrated) {
    return desktopLayout;
  }

  return isSmall ? mobileLayout : desktopLayout;
};
