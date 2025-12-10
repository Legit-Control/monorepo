import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { useLegitContext, useLegitFile } from '@legit-sdk/react';
import { DiffMatchPatch } from 'diff-match-patch-ts';
import { format } from 'timeago.js';
import { Toaster, toast } from 'sonner';
import { LegitFooter, LegitHeader } from './LegitBrand';
import './App.css';

type HistoryItem = {
  oid: string;
  message: string;
  parent: string[];
  author: { timestamp: number };
};

const INITIAL_TEXT = 'This is a document that you can edit! 🖋️';

const HistoryListItem = memo(function HistoryListItem({
  item,
  isActive,
  onCheckout,
  getPastState,
}: {
  item: HistoryItem;
  isActive: boolean;
  onCheckout: (oid: string) => void;
  getPastState: (commitHash: string) => Promise<string>;
}) {
  const [oldContent, setOldContent] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);
  const dmp = useMemo(() => new DiffMatchPatch(), []);

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
        className="diff-content"
        dangerouslySetInnerHTML={{ __html: dmp.diff_prettyHtml(diff) }}
      />
    );
  };

  return (
    <div
      className={`history-item ${isActive ? 'history-item--active' : ''}`}
      onClick={() => onCheckout(item.oid)}
    >
      <div className="history-item__top">
        <img alt="Avatar" src="/avatar.svg" width={32} height={32} />
        <p className="history-item__message">{item.message}</p>
        <p className="history-item__time">
          {format(item.author.timestamp * 1000)}
        </p>
      </div>

      <div className="history-item__diff">
        {loading ? (
          <div className="muted-text">Loading diff…</div>
        ) : (
          renderDiff(oldContent, newContent)
        )}
      </div>
    </div>
  );
});

function App() {
  const legitFile = useLegitFile('/document.txt', {
    initialData: INITIAL_TEXT,
  });
  const { legitFs, head } = useLegitContext();

  const [text, setText] = useState('');
  const [checkedOutCommit, setCheckedOutCommit] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const branch = params.get('branch');
    if (legitFs && branch) {
      legitFs.auth.signInAnonymously();
      legitFs.setCurrentBranch(branch);
    }
  }, [legitFs]);

  useEffect(() => {
    if (legitFile.data !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(legitFile.data);
      legitFile.setData(legitFile.data);
    }
  }, [legitFile.data]);

  const handleSave = async () => {
    await legitFile.setData(text);
    setCheckedOutCommit(null);
  };

  const handleCheckout = useCallback(
    async (oid: string) => {
      const past = await legitFile.getPastState(oid);
      setText(past);
      setCheckedOutCommit(oid);
    },
    [legitFile]
  );

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
    return <div className="loading">Loading repository…</div>;
  if (legitFile.error) console.error(legitFile.error);

  return (
    <div className="app-shell">
      <Toaster />

      <LegitHeader handleShare={handleShare} />

      <div className="page">
        <h1 className="page-title">Legit SDK Starter</h1>
        <p className="page-subtitle">
          A demo showing how <code>@legit-sdk/react</code> enables local-first
          document editing and version control.
        </p>

        <div className="editor-card">
          <div className="editor-card__header">
            <div className="file-label">
              <img alt="File" src="/file.svg" width={20} height={20} />
              document.txt
            </div>
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className="primary-button"
            >
              Save
            </button>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            className="editor-textarea"
          />
        </div>

        <h2 className="section-title">History</h2>
        <div className="history-list">
          {legitFile.history.map(h => (
            <HistoryListItem
              key={h.oid}
              item={h as HistoryItem}
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

export default App;
