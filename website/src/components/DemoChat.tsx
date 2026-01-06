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
      const newBranchPath = `/.legit/branches/agent-branch`;
      await legitFs.promises.mkdir(newBranchPath);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Folder exists')) {
        await legitFs.setCurrentBranch('agent-branch');
      } else {
        console.error('Error creating agent branch', error);
        throw error;
      }
    }
  };

  const sendUserMessage = async (text: string) => {
    await createAgentBranch();

    api.thread().append({
      role: 'user',
      content: [{ type: 'text', text }],
      startRun: true,
    });
  };

  const reset = async () => {
    if (!legitFs) return;
    try {
      const mainHistory = JSON.parse(
        await legitFs.promises.readFile(
          `/.legit/branches/anonymous/.legit/history`,
          'utf8'
        )
      );
      const agentHistory = JSON.parse(
        await legitFs.promises.readFile(
          `/.legit/branches/agent-branch/.legit/history`,
          'utf8'
        )
      );
      await legitFs.promises.writeFile(
        `/.legit/branches/anonymous/.legit/head`,
        mainHistory[mainHistory.length - 2].oid,
        'utf8'
      );
      await legitFs.promises.writeFile(
        `/.legit/branches/agent-branch/.legit/head`,
        agentHistory[agentHistory.length - 1].oid,
        'utf8'
      );
      await legitFs.setCurrentBranch('anonymous');
      api.thread().reset();
    } catch (error) {
      console.error('Error resetting agent branch', error);
      throw error;
    }
  };

  // Hide controls while a response is streaming
  if (isRunning) return null;

  return (
    <div className="px-3 py-3 flex justify-end gap-2">
      {isEmpty ? (
        <Button
          className="w-full rounded-none cursor-pointer text-md"
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
            onClick={() => reset()}
          >
            Reset
          </Button>
          {/* <Button
            className="flex-1 rounded-none cursor-pointer"
            size="default"
            onClick={() => console.log('apply')}
          >
            Apply
          </Button> */}
        </div>
      )}
    </div>
  );
};
