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
import Font from './Font';

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
  const [outstandingChanges, setOutstandingChanges] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const pollCurrentBranch = async () => {
      if (!legitFs || typeof legitFs.getCurrentBranch !== 'function') return;
      try {
        const branch = await legitFs.getCurrentBranch();
        if (isMounted && branch && branch !== currentBranch) {
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
    if (
      content !== data &&
      !loading &&
      content.length > 0 &&
      data &&
      data.length > 0
    ) {
      setOutstandingChanges(true);
    } else {
      setOutstandingChanges(false);
    }
  }, [content, data, loading, content.length, data?.length]);

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

  const getmappedHistoryMessages = (
    history: HistoryItem[],
    mapping: { position: number; message: string }[]
  ) => {
    return history.map((commit, index) => {
      const reversedIndex = history.length - 1 - index;
      const mappingItem: { position: number; message: string } | undefined =
        mapping.find(m => m.position === reversedIndex);
      return {
        ...commit,
        message: mappingItem?.message || commit.message,
      };
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-20">
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
          <div className="w-full h-[56px] flex items-center justify-between px-2 gap-2 overflow-x-scroll">
            <div className="flex items-center gap-2">
              {agentHistory.length > 2 && (
                <div className="flex items-center bg-zinc-100 p-1 rounded-full">
                  {branches.map(branch => {
                    return (
                      <button
                        key={branch.internal}
                        className={`rounded-full px-4 py-1 cursor-pointer hover:bg-white/50 transition-all duration-100 w-max
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
                className={`flex items-center gap-2 bg-white px-2 py-1 transition-all duration-100 ${outstandingChanges ? 'bg-primary! hover:bg-primary/80! text-white! cursor-pointer' : ''}`}
                onClick={handleSave}
                disabled={!outstandingChanges}
              >
                {outstandingChanges ? 'Save' : 'Saved'}
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
          <div className="flex flex-col lg:flex-row h-[500px] lg:h-[360px] pl-0 lg:pl-4">
            <div className="-mb-1 flex-1 h-full hover:bg-zinc-50 transition-all duration-100">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full h-full pl-4 lg:pl-8 pr-4 py-6 text-zinc-800 text-[16px] resize-none outline-none"
              />
            </div>
            <div className="w-full lg:w-[300px] flex-1 max-h-[250px] lg:max-h-none lg:h-full px-4 pb-4 pt-4 lg:pt-0">
              <DemoChat />
            </div>
          </div>
        </div>
        <div className="col-span-7 border border-zinc-400 lg:border-l-0 my-auto lg:h-[400px] lg:overflow-y-scroll pt-4 lg:pt-0 mx-4 lg:mx-0">
          <div className="h-[34px] flex items-center px-4 font-mono text-zinc-600 text-sm">
            Legit state
          </div>
          <div className="px-4 py-2">
            <AsciiHistoryGraph
              branches={[
                {
                  entries: getmappedHistoryMessages(mainHistory, [
                    { position: 1, message: 'Notes Machine Learning' },
                  ]),
                  className: 'text-zinc-500 border-zinc-500',
                },
                {
                  entries: getmappedHistoryMessages(
                    agentHistory && agentHistory.length > 2
                      ? agentHistory.slice(0, -2)
                      : [],
                    [
                      { position: 0, message: '🤖 Add paragraphs' },
                      { position: 1, message: '🤖 Improve voice' },
                      { position: 2, message: '🤖 Add summary' },
                    ]
                  ),
                  className: 'text-primary border-primary',
                },
              ]}
              onCommitClick={getDiff}
              collapsibleContent={loadedCommit}
            />
          </div>
        </div>
      </div>
      <Font
        type="p"
        className="text-center text-zinc-500 w-full col-span-20 pt-6"
      >
        This is an AI-powered editor. Legit runs underneath.
      </Font>
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
