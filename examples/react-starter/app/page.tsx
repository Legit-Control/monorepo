'use client';

import { LegitProvider, useLegitFile, useLegitContext } from '@legit-sdk/react';
import { HistoryItem } from '@legit-sdk/core';
import { DiffMatchPatch } from 'diff-match-patch-ts';
import { format } from 'timeago.js';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const FILE_PATH = '/document.txt';
const INITIAL_TEXT = 'This is a document that you can edit! 🖋️';

function Editor() {
  // ✅ The hook handles reading, writing, and history tracking
  const { content, setContent, history, getPastState, loading, error } =
    useLegitFile(FILE_PATH, { initialContent: INITIAL_TEXT });
  const { head } = useLegitContext();
  const [text, setText] = useState('');
  const [checkedOutCommit, setCheckedOutCommit] = useState<string | null>(null);

  useEffect(() => {
    if (content !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(content);
    }
  }, [content]);

  // Checkout a commit by loading its content from history
  const handleCheckout = async (oid: string) => {
    const past = await getPastState(oid);
    setText(past);
    setCheckedOutCommit(oid);
  };

  // Save changes → triggers legit commit under the hood
  const handleSave = async () => {
    await setContent(text);
    setCheckedOutCommit(null); // Clear checkout after save
  };

  // Disable save if:
  // 1. Text hasn't changed from content (no changes to save)
  // 2. A commit is checked out that's not the current HEAD
  const isSaveDisabled =
    text === content ||
    (checkedOutCommit !== null && checkedOutCommit !== head);

  if (loading)
    return <div className="p-8 text-gray-500">Loading repository…</div>;
  if (error)
    return <div className="p-8 text-red-500">Error {error.message}</div>;

  return (
    <div className="flex min-h-screen max-w-xl mx-auto flex-col p-8 gap-4">
      <Link href="https://legitcontrol.com">
        <Image alt="Legit Logo" src="/logo.svg" width={70} height={40} />
      </Link>

      <h1 className="text-2xl font-semibold mt-8">Legit SDK Starter</h1>
      <p className="max-w-lg mb-8">
        This demo shows how to use the <code>@legit-sdk/react</code> package for
        local-first document editing and version control.
      </p>

      {/* Editor */}
      <div className="flex flex-col w-full border border-zinc-300 rounded-lg overflow-hidden">
        <div className="flex justify-between bg-zinc-100 px-3 py-2 border-b border-zinc-300">
          <div className="flex gap-2 items-center">
            <Image alt="File" src="/file.svg" width={20} height={20} />
            {FILE_PATH.replace('/', '')}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="bg-[#FF611A] text-white px-3 py-1 rounded-lg font-semibold hover:opacity-80 cursor-pointer disabled:opacity-50"
          >
            Save
          </button>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          className="p-3 w-full bg-white"
          disabled={false}
        />
      </div>

      {/* History */}
      <h2 className="mt-2 text-md font-semibold">History</h2>
      <div className="flex flex-col gap-2 max-w-lg w-full">
        {history.map(h => (
          <HistoryListItem
            key={h.oid}
            item={h}
            isActive={h.oid === checkedOutCommit}
            onCheckout={handleCheckout}
            getPastState={getPastState}
          />
        ))}
      </div>
    </div>
  );
}

type HistoryItemProps = {
  item: HistoryItem;
  isActive: boolean;
  onCheckout: (oid: string) => void;
  getPastState: (commitHash: string) => Promise<string>;
};

function HistoryListItem({
  item,
  isActive,
  onCheckout,
  getPastState,
}: HistoryItemProps) {
  const [oldContent, setOldContent] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const dmp = new DiffMatchPatch();

  useEffect(() => {
    let mounted = true;

    const loadContents = async () => {
      setLoading(true);
      try {
        // parent may be undefined or empty
        const parentOid = item.parent?.[0] ?? null;

        // fetch parent and this commit content in parallel (if parent exists)
        const [oldRes, newRes] = await Promise.all([
          parentOid ? getPastState(parentOid) : Promise.resolve(''),
          getPastState(item.oid),
        ]);

        if (!mounted) return;

        setOldContent(oldRes ?? '');
        setNewContent(newRes ?? '');
      } catch {
        // swallow fetch errors for UI resilience — keep empty strings
        if (!mounted) return;
        setOldContent('');
        setNewContent('');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadContents();

    return () => {
      mounted = false;
    };
  }, [item.oid, item.parent, getPastState]);

  const renderDiff = (oldStr: string, newStr: string) => {
    const diff = dmp.diff_main(oldStr, newStr);
    dmp.diff_cleanupSemantic(diff);
    return (
      <div
        className="prose text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: dmp.diff_prettyHtml(diff) }}
      />
    );
  };

  return (
    <div
      className={`hover:bg-zinc-50 rounded-lg p-4 cursor-pointer transition-colors ${
        isActive ? 'bg-zinc-100 hover:bg-zinc-100' : ''
      }`}
      onClick={() => onCheckout(item.oid)}
    >
      <div className="flex gap-3 items-center">
        <Image alt="Avatar" src="/avatar.svg" width={32} height={32} />
        <p className="text-md font-semibold flex-1">{item.message}</p>
        <p className="text-sm">{format(item.author.timestamp * 1000)}</p>
      </div>

      <div className="mt-2">
        {loading ? (
          <div className="text-sm text-gray-500">Loading diff…</div>
        ) : (
          renderDiff(oldContent ?? '', newContent ?? '')
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <LegitProvider>
      <Editor />
    </LegitProvider>
  );
}
