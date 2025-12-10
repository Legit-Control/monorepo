'use client';

import {
  LegitProvider,
  useLegitFile,
  useLegitContext,
  LegitConfig,
} from '@legit-sdk/react';

import { HistoryItem } from '@legit-sdk/core';
import { DiffMatchPatch } from 'diff-match-patch-ts';
import { format } from 'timeago.js';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback, memo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'sonner';

const serverUrl = 'http://localhost:9999';
const INITIAL_TEXT = 'This is a document that you can edit! 🖋️';

function Editor() {
  // ✅ The hook handles reading, writing, and history tracking
  const legitFile = useLegitFile('/document.txt', {
    initialData: INITIAL_TEXT,
  });
  const searchParams = useSearchParams();
  const { legitFs } = useLegitContext();
  const getPastState = legitFile.getPastState;
  const { head } = useLegitContext();
  const [text, setText] = useState('');
  const [checkedOutCommit, setCheckedOutCommit] = useState<string | null>(null);
  const [isLoggedIn, setLoggedin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (legitFs && searchParams.get('branch')) {
      // sign in anonymously
      legitFs.auth.signInAnonymously();

      // set current branch
      legitFs.setCurrentBranch(searchParams.get('branch')!);
    }
  }, [legitFs, searchParams]);

  useEffect(() => {
    if (legitFile.data !== null) {
      setText(legitFile.data);
    }
  }, [legitFile.data]);

  const handleShare = async () => {
    if (legitFs) {
      await legitFs.auth.signInAnonymously();
      const branch = await legitFs.shareCurrentBranch();
      console.log('shared branch', branch);

      const shareLink = `${window.location.origin}?branch=${branch}`;
      console.log('share link', shareLink);

      // copy to clipboard
      navigator.clipboard.writeText(shareLink);
      toast('Copied invite link', {
        description:
          'The link to join the document has been copied to your clipboard',
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${serverUrl}/subsurface-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: email,
          password: password,
        }),
      });

      if (response.status === 200) {
        const rawResponse = await response.text();
        const responseBody = JSON.parse(rawResponse).token;
        console.log('Login successful, received token:', responseBody);
        if (legitFs) {
          legitFs.auth.addAccessToken(responseBody);
          legitFs.sync.start();
          setLoggedin(true);
        }
        setLoggedin(true);
        toast('Login successful');
      } else {
        toast('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Checkout a commit by loading its content from history
  const handleCheckout = useCallback(
    async (oid: string) => {
      const past = await getPastState(oid);
      setText(past);
      setCheckedOutCommit(oid);
    },
    [getPastState]
  );

  // Save changes → triggers legit commit under the hood
  const handleSave = async () => {
    await legitFile.setData(text);
    setCheckedOutCommit(null); // Clear checkout after save
  };

  // Disable save if:
  // 1. Text hasn't changed from content (no changes to save)
  // 2. A commit is checked out that's not the current HEAD
  const isSaveDisabled =
    text === legitFile.data ||
    (checkedOutCommit !== null && checkedOutCommit !== head);

  if (legitFile.loading)
    return <div className="p-8 text-gray-500">Loading repository…</div>;
  if (legitFile.error) console.log(legitFile.error);

  return (
    <div className="flex min-h-screen max-w-xl mx-auto flex-col p-8 gap-4">
      {isLoggedIn && (
        <>
          <Toaster />
          <div className="flex justify-between items-center">
            <Link href="https://legitcontrol.com">
              <Image alt="Legit Logo" src="/logo.svg" width={70} height={40} />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="bg-black text-white px-3 py-1 rounded-lg font-semibold hover:opacity-80 cursor-pointer disabled:opacity-50"
              >
                Share
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-semibold mt-8">Legit SDK Starter</h1>
          <p className="max-w-lg mb-8">
            This demo shows how to use the <code>@legit-sdk/react</code> package
            for local-first document editing and version control.
          </p>

          {/* Editor */}
          <div className="flex flex-col w-full border border-zinc-300 rounded-lg overflow-hidden">
            <div className="flex justify-between bg-zinc-100 px-3 py-2 border-b border-zinc-300">
              <div className="flex gap-2 items-center">
                <Image alt="File" src="/file.svg" width={20} height={20} />
                {'document.txt'}
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
        </>
      )}
      {!isLoggedIn && (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h1 className="text-2xl font-semibold">Welcome to Subsurface Web</h1>
          <p className="max-w-md text-center">
            Please log in to access the document editor and version history.
          </p>
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 w-full max-w-sm"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:opacity-80 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

type HistoryItemProps = {
  item: HistoryItem;
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
});

export default function Home() {
  const config: LegitConfig = {
    // initialBranch: '255827',
    serverUrl,
    gitRoot: '/',
    // publicKey: process.env.NEXT_PUBLIC_LEGIT_PUBLIC_KEY,
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LegitProvider config={config}>
        <Editor />
      </LegitProvider>
    </Suspense>
  );
}
