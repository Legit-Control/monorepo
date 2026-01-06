'use client';

import type { ToolCallMessagePartComponent } from '@assistant-ui/react';
import { CheckIcon } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { useLegitContext } from '@legit-sdk/react';
import { useEffect, useState } from 'react';

export const ToolFallback: ToolCallMessagePartComponent = ({
  toolName,
  status,
  args,
}) => {
  const { legitFs } = useLegitContext();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const updateDocument = async () => {
      if (!legitFs || !args?.body?.content || status?.type !== 'complete')
        return;
      try {
        await legitFs.setCurrentBranch('agent-branch');
        const currentBranch = await legitFs.getCurrentBranch();
        await legitFs.promises.writeFile(
          `/.legit/branches/${currentBranch}/blogpost.md`,
          args.body.content
        );
        setIsUpdated(true);
      } catch (error) {
        console.error('Error updating document', error);
      }
    };

    if (status?.type === 'complete' && !isUpdated) {
      void updateDocument();
    }
  }, [args?.body?.content, legitFs, status?.type, isUpdated]);

  if (toolName === 'update-document') {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-500 py-0.5">
        {status?.type === 'complete' ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <Spinner className="w-4 h-4" />
        )}
        {status?.type === 'complete'
          ? 'Document updated'
          : 'Updating document...'}
      </div>
    );
  }
};
