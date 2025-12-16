'use client';

import {
  BoldIcon,
  StrikethroughIcon,
  ItalicIcon,
  UnderlineIcon,
} from '@heroicons/react/16/solid';
import { LegitProvider, useLegitContext, useLegitFile } from '@legit-sdk/react';
import { ReactNode, useEffect, useState } from 'react';
import AsciiHistoryGraph, { HistoryItem } from './AsciiHistoryGraph';
import { DiffMatchPatch } from 'diff-match-patch-ts';
import { format } from 'timeago.js';
import DemoChat from './DemoChat';

const INITIAL_TEXT = `# Blog post (notes)

software = deterministic  
same input → same output  
dev writes rules / logic

AI models ≠ deterministic  
probabilistic  
don’t program every step

ML = learn patterns from data  
not rules  
same input ≠ same output

examples:
- GPT (OpenAI)
- Claude (Anthropic)
- Gemini (Google)

trained on lots of internet text  
learn structure + relationships`;

const branches = [
  {
    name: 'main',
    internal: 'anonymous',
  },
  {
    name: 'agent-draft',
    internal: 'agent-branch',
  },
];

const DemoComponent = () => {
  const { data, setData, loading, history, getPastState, legitFs } =
    useLegitFile('/blogpost.md', {
      initialData: INITIAL_TEXT,
    });
  const { rollback, head } = useLegitContext();
  const [content, setContent] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadedCommit, setLoadedCommit] = useState<ReactNode | null>(null);
  const [mainHistory, setMainHistory] = useState<HistoryItem[]>([]);
  const [agentHistory, setAgentHistory] = useState<HistoryItem[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string>('anonymous');

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const pollCurrentBranch = async () => {
      if (!legitFs || typeof legitFs.getCurrentBranch !== 'function') return;
      try {
        const branch = await legitFs.getCurrentBranch();
        console.log('branch', branch);
        if (isMounted && branch && branch !== currentBranch) {
          console.log('setting current branch', branch);
          setCurrentBranch(branch);
        }
      } catch {
        // optional: setCurrentBranch('anonymous');
      }
    };

    if (legitFs && typeof legitFs.getCurrentBranch === 'function') {
      pollCurrentBranch(); // Initial call
      intervalId = setInterval(pollCurrentBranch, 100); // Poll every 100 ms
    }

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
    // Depend on legitFs only, not currentBranch (or else poll will run only once if that changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legitFs, currentBranch]);

  useEffect(() => {
    const loadMainHistory = async () => {
      if (!legitFs || loading) return;
      try {
        const mainHistory = await legitFs.promises.readFile(
          '/.legit/branches/anonymous/.legit/history',
          'utf8'
        );
        setMainHistory(JSON.parse(mainHistory));
      } catch {
        setMainHistory([]);
      }
    };
    void loadMainHistory();

    const loadAgentHistory = async () => {
      if (!legitFs || loading) return;
      try {
        const agentHistory = await legitFs.promises.readFile(
          '/.legit/branches/agent-branch/.legit/history',
          'utf8'
        );
        setAgentHistory(JSON.parse(agentHistory));
      } catch {
        setAgentHistory([]);
      }
    };
    void loadAgentHistory();
  }, [loading, legitFs]);

  const dmp = new DiffMatchPatch();

  useEffect(() => {
    if (!isInitialized && loading && data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent(INITIAL_TEXT);
    }
  }, [loading, isInitialized, data]);

  useEffect(() => {
    const save = async () => {
      await setData(content);
      setIsInitialized(true);
    };
    if (history.length === 0) {
      save();
    }
  }, [content, history, setData]);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent(data ?? '');
    }
  }, [data]);

  const handleSave = async () => {
    await setData(content);
  };

  const getDiff = async (commit: HistoryItem) => {
    const commitId = commit.oid;
    const pastCommitId = commit.parent[0];

    const commitState = await getPastState(commitId);
    const pastCommitState = await getPastState(pastCommitId);

    const diff = dmp.diff_main(pastCommitState, commitState);
    dmp.diff_cleanupSemantic(diff);

    setLoadedCommit(
      <div className="flex flex-col gap-3 border border-zinc-200 p-2 w-full overflow-x-auto max-h-[200px] overflow-y-scroll">
        <div className="flex items-center justify-between">
          <div className="text-xs">
            {format(commit.author.timestamp * 1000)}
          </div>
          {head !== commitId && (
            <button
              onClick={() => rollback(commitId)}
              className="text-xs text-white bg-primary px-2 py-1 cursor-pointer hover:bg-black transition-all duration-100"
            >
              Restore
            </button>
          )}
        </div>
        <div
          className="text-xs text-zinc-500"
          dangerouslySetInnerHTML={{ __html: dmp.diff_prettyHtml(diff) }}
        />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-20">
      <div className="group col-span-13 border border-zinc-400 focus-within:border-black shadow-[8px_8px_0_0_rgba(135,135,135,0.5)]">
        <div className="h-[34px] flex items-center px-4 bg-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-primary" />
            <div className="w-2.5 h-2.5 bg-zinc-200" />
            <div className="w-2.5 h-2.5 bg-zinc-200" />
          </div>
          <div className="flex items-center gap-2 flex-1 px-4 font-mono text-zinc-500 text-sm ml-1">
            Text Editor
          </div>
        </div>
        <div className="w-full h-[56px] flex items-center justify-between px-2 gap-2">
          <div className="flex items-center gap-2">
            {agentHistory.length > 2 && (
              <div className="flex items-center bg-zinc-100 p-1 rounded-full">
                {branches.map(branch => {
                  return (
                    <button
                      key={branch.internal}
                      className={`rounded-full px-4 py-1 cursor-pointer hover:bg-white/50 transition-all duration-100 
                    ${currentBranch === branch.internal && 'bg-black! text-white'}
                  `}
                      onClick={() => {
                        legitFs?.setCurrentBranch(branch.internal);
                      }}
                    >
                      {branch.name}
                    </button>
                  );
                })}
              </div>
            )}
            <button
              className="flex items-center gap-2 bg-white px-2 py-1 cursor-pointer hover:bg-zinc-100 transition-all duration-100"
              onClick={handleSave}
            >
              Save
            </button>

            <div className="w-px h-6 bg-zinc-200" />
            <div className="flex items-center gap-4 text-zinc-400">
              <BoldIcon className="w-4 h-4" />
              <ItalicIcon className="w-4 h-4" />
              <UnderlineIcon className="w-4 h-4" />
              <StrikethroughIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="flex h-[360px]">
          <div className="-mb-1 flex-1 h-full">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full h-full pl-8 pr-4 py-6 text-zinc-800 text-[16px] resize-none outline-none"
            />
          </div>
          <div className="w-[300px] h-full p-4 pt-0">
            <DemoChat />
          </div>
        </div>
      </div>
      <div className="col-span-7 border border-zinc-400 border-l-0 my-auto h-[400px] overflow-y-scroll">
        <div className="h-[34px] flex items-center px-4 font-mono text-zinc-600 text-sm">
          Legit state
        </div>
        <div className="px-4 py-2">
          <AsciiHistoryGraph
            branches={[
              {
                entries: mainHistory,
                className: 'text-zinc-500 border-zinc-500',
              },
              {
                entries:
                  agentHistory && agentHistory.length > 2
                    ? agentHistory.slice(0, -2)
                    : [],
                className: 'text-primary border-primary',
              },
            ]}
            onCommitClick={getDiff}
            collapsibleContent={loadedCommit}
          />
        </div>
      </div>
    </div>
  );
};

const Demo = () => {
  return (
    <LegitProvider>
      <DemoComponent />
    </LegitProvider>
  );
};

export default Demo;
