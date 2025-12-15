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

const DemoComponent = () => {
  const { data, setData, loading, history, getPastState } = useLegitFile(
    '/blogpost.md',
    {
      initialData: INITIAL_TEXT,
    }
  );
  const { rollback, head } = useLegitContext();
  const [content, setContent] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadedCommit, setLoadedCommit] = useState<ReactNode | null>(null);

  const dmp = new DiffMatchPatch();

  useEffect(() => {
    if (!isInitialized && loading && data) {
      setContent(INITIAL_TEXT);
    }
  }, [setData, loading, isInitialized, data, content]);

  useEffect(() => {
    const save = async () => {
      await setData(content);
      setIsInitialized(true);
    };
    if (history.length === 0) {
      save();
    }
  }, [content, history]);

  useEffect(() => {
    if (data) {
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
      <div className="flex flex-col gap-3 border border-zinc-200 p-2">
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
        <div className="w-full h-[40px] flex items-center px-2 gap-2">
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
        <div className="flex h-[360px]">
          <div className="-mb-1 flex-1 h-full">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full h-full pl-12 pr-4 py-10 text-zinc-800 text-[16px] resize-none outline-none"
            />
          </div>
          <div className="w-[300px] h-full p-4 pt-0">
            <DemoChat />
          </div>
        </div>
      </div>
      <div className="col-span-7 border border-zinc-400 border-l-0 my-4">
        <div className="h-[34px] flex items-center px-4 font-mono text-zinc-600 text-sm">
          Legit state
        </div>
        <div className="px-4 py-2">
          <AsciiHistoryGraph
            branches={[
              {
                entries: history,
                className: 'text-primary',
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
