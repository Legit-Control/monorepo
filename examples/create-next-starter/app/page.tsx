'use client';

import { useLegitFile, useLegitContext } from '@legit-sdk/react';
import { DiffMatchPatch } from 'diff-match-patch-ts';
import { format } from 'timeago.js';
import Image from 'next/image';
import { useEffect, useState, useCallback, memo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { LegitFooter, LegitHeader } from './LegitBrand';

const INITIAL_TEXT = 'This is a document that you can edit! 🖋️';

/** =========================
 * Core Editor Component
 * ========================= */
function Editor() {
  const legitFile = useLegitFile('/document.txt', {
    initialData: INITIAL_TEXT,
  });
  const { legitFs, head } = useLegitContext();
  const searchParams = useSearchParams();

  const [text, setText] = useState('');
  const [checkedOutCommit, setCheckedOutCommit] = useState<string | null>(null);

  /** Initialize branch if ?branch= is present */
  useEffect(() => {
    if (legitFs && searchParams.get('branch')) {
      legitFs.auth.signInAnonymously();
      legitFs.setCurrentBranch(searchParams.get('branch')!);
    }
  }, [legitFs, searchParams]);

  /** Sync editor text with legit file data */
  useEffect(() => {
    if (legitFile.data !== null) setText(legitFile.data);
  }, [legitFile.data]);

  /** Save current text → triggers legit commit */
  const handleSave = async () => {
    await legitFile.setData(text);
    setCheckedOutCommit(null);
  };

  /** Checkout a past commit */
  const handleCheckout = useCallback(
    async (oid: string) => {
      const past = await legitFile.getPastState(oid);
      setText(past);
      setCheckedOutCommit(oid);
    },
    [legitFile]
  );

  /** Share current branch */
  const handleShare = async () => {
    if (!legitFs) return;
    await legitFs.auth.signInAnonymously();
    const branch = await legitFs.shareCurrentBranch();
    const shareLink = `${window.location.origin}?branch=${branch}`;
    navigator.clipboard.writeText(shareLink);
    toast('Copied invite link', {
      description: 'The link to join the document has been copied!',
    });
  };

  const isSaveDisabled =
    text === legitFile.data ||
    (checkedOutCommit !== null && checkedOutCommit !== head);

  if (legitFile.loading)
    return <div className="p-8 text-gray-500">Loading repository…</div>;
  if (legitFile.error) console.error(legitFile.error);

  /** =========================
   * Render UI
   * ========================= */
  return (
    <div className="flex flex-col h-screen">
      <Toaster />

      {/* Header */}
      <LegitHeader handleShare={handleShare} />

      <div className="h-[calc(100vh-112px)] flex max-w-xl mx-auto flex-col gap-4 px-4">
        <h1 className="text-2xl font-semibold mt-8">Legit SDK Starter</h1>
        <p className="max-w-lg text-sm mb-8 mr-24">
          A demo showing how <code>@legit-sdk/react</code> enables local-first
          document editing and version control.
        </p>

        {/* Editor */}
        <div className="flex min-h-48 flex-col w-full border border-zinc-300 rounded-lg overflow-hidden">
          <div className="flex justify-between bg-zinc-100 px-3 py-2 border-b border-zinc-300">
            <div className="flex gap-2 items-center">
              <Image alt="File" src="/file.svg" width={20} height={20} />
              document.txt
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
          />
        </div>

        {/* History */}
        <h2 className="mt-2 text-md font-semibold">History</h2>
        <div className="flex flex-col gap-2 max-w-lg w-full overflow-y-scroll">
          {legitFile.history.map(h => (
            <HistoryListItem
              key={h.oid}
              item={h}
              isActive={h.oid === checkedOutCommit}
              onCheckout={handleCheckout}
              getPastState={legitFile.getPastState}
            />
          ))}
        </div>
      </div>

      <LegitFooter />
    </div>
  );
}

/** =========================
 * History Item Component
 * ========================= */
type HistoryItemProps = {
  item: {
    oid: string;
    message: string;
    parent: string[];
    author: { timestamp: number };
  };
  isActive: boolean;
  onCheckout: (oid: string) => void;
  getPastState: (commitHash: string) => Promise<string>;
};

const HistoryListItem = memo(function HistoryListItem({
  item,
  isActive,
  onCheckout,
  getPastState,
}: HistoryItemProps) {
  const [oldContent, setOldContent] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);
  const dmp = new DiffMatchPatch();

  /** Load content and parent content for diff */
  useEffect(() => {
    let mounted = true;

    const loadContents = async () => {
      setLoading(true);
      try {
        const parentOid = item.parent?.[0] ?? null;
        const [oldRes, newRes] = await Promise.all([
          parentOid ? getPastState(parentOid) : Promise.resolve(''),
          getPastState(item.oid),
        ]);
        if (!mounted) return;
        setOldContent(oldRes ?? '');
        setNewContent(newRes ?? '');
      } catch {
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
          renderDiff(oldContent, newContent)
        )}
      </div>
    </div>
  );
});

export default Editor;
