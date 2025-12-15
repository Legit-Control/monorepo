'use client';

import {
  AssistantRuntimeProvider,
  useAssistantApi,
  useAssistantState,
} from '@assistant-ui/react';
import { useDataStreamRuntime } from '@assistant-ui/react-data-stream';
import { Thread } from '@/components/assistant-ui/thread';
import { Button } from '@/components/ui/button';
import type { FC } from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { useLegitContext } from '@legit-sdk/react';

const DemoChat = () => {
  const runtime = useDataStreamRuntime({
    api: '/api/chat',
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="w-full h-full border border-zinc-300 flex flex-col">
        <div className="flex-1 min-h-0">
          <Thread />
        </div>
        <BlogControls />
      </div>
    </AssistantRuntimeProvider>
  );
};

export default DemoChat;

const BlogControls: FC = () => {
  const { legitFs } = useLegitContext();
  const api = useAssistantApi();
  const isRunning = useAssistantState(({ thread }) => thread.isRunning);
  const isEmpty = useAssistantState(({ thread }) => thread.isEmpty);

  const createAgentBranch = async () => {
    if (!legitFs) return;
    try {
      const agentBranchName = `agent-branch`;
      await legitFs.promises.writeFile(
        `/.legit/branches/${agentBranchName}`,
        'utf-8'
      );
    } catch (error) {
      console.error('Error creating agent branch', error);
      throw error;
    }
  };

  const sendUserMessage = async (text: string) => {
    //await createAgentBranch();

    api.thread().append({
      role: 'user',
      content: [{ type: 'text', text }],
      startRun: true,
    });
  };

  // Hide controls while a response is streaming
  if (isRunning) return null;

  return (
    <div className="px-3 py-3 flex justify-end gap-2">
      {isEmpty ? (
        <Button
          className="w-full rounded-none cursor-pointer"
          size="default"
          onClick={() => sendUserMessage('Finish my blog post')}
        >
          Finish my blog post
          <ArrowUpIcon className="w-4 h-4" />
        </Button>
      ) : (
        <div className="flex gap-2 w-full">
          <Button
            className="flex-1 rounded-none cursor-pointer"
            size="default"
            variant="secondary"
            disabled={true}
          >
            Continue
          </Button>
          <Button
            className="flex-1 rounded-none cursor-pointer"
            size="default"
            onClick={() => console.log('apply')}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};
