---
title: Accessing Legit Context
description: Guide to using useLegitContext hook for accessing the shared LegitFS instance, branch management, authentication, sync service, and advanced operations.
---

# Accessing Legit-wide Context

Guide to using `useLegitContext` for accessing the shared LegitFS instance and global state.

## Overview

The `useLegitContext` hook provides direct access to the `legitFs` instance and global state managed by the `LegitProvider`. Use it when you need to:

- Access branch management functions
- Use authentication API
- Control sync service
- Access current HEAD commit
- Perform rollback operations
- Access the raw `legitFs` instance for advanced operations

## What's Available

The context provides:

```typescript
interface LegitContextValue {
  legitFs: LegitFs | null;              // Direct access to LegitFS instance
  loading: boolean;                      // Global loading state
  head: string | null;                  // Current HEAD commit SHA
  rollback: (commitHash: string) => Promise<void>; // Rollback function
  error?: Error;                        // Global error state
}
```

## Basic Usage

```tsx
import { useLegitContext } from '@legit-sdk/react';

function StatusBar() {
  const { legitFs, head, loading } = useLegitContext();

  if (loading) return <div>Initializing...</div>;

  return (
    <div>
      <p>HEAD: {head?.slice(0, 8)}</p>
      <p>Ready: {legitFs ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

## Accessing the LegitFS Instance

The `legitFs` instance gives you direct access to all core SDK functionality:

### Branch Management

```tsx
function BranchSwitcher() {
  const { legitFs } = useLegitContext();
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);

  useEffect(() => {
    if (legitFs) {
      legitFs.getCurrentBranch().then(setCurrentBranch);
    }
  }, [legitFs]);

  const switchBranch = async (branch: string) => {
    if (!legitFs) return;
    await legitFs.setCurrentBranch(branch);
    setCurrentBranch(branch);
    // All useLegitFile hooks will automatically reload
  };

  return (
    <div>
      <p>Current: {currentBranch}</p>
      <button onClick={() => switchBranch('main')}>Switch to main</button>
      <button onClick={() => switchBranch('feature')}>Switch to feature</button>
    </div>
  );
}
```

### Authentication

```tsx
function AuthStatus() {
  const { legitFs } = useLegitContext();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (legitFs) {
      legitFs.auth.getUser().then(setUser);
    }
  }, [legitFs]);

  const signIn = async () => {
    if (!legitFs) return;
    await legitFs.auth.signInAnonymously();
    const newUser = await legitFs.auth.getUser();
    setUser(newUser);
  };

  return (
    <div>
      <p>User: {user?.name} ({user?.type})</p>
      {user?.type === 'local' && (
        <button onClick={signIn}>Sign In Anonymously</button>
      )}
    </div>
  );
}
```

### Sync Service

How you should use sync is described in detail [here](/docs/sync).

```tsx
function SyncControl() {
  const { legitFs } = useLegitContext();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (legitFs) {
      setIsRunning(legitFs.sync.isRunning());
    }
  }, [legitFs]);

  const toggleSync = () => {
    if (!legitFs) return;
    
    if (isRunning) {
      legitFs.sync.stop();
    } else {
      legitFs.sync.start();
    }
    setIsRunning(!isRunning);
  };

  return (
    <div>
      <p>Sync: {isRunning ? 'Running' : 'Stopped'}</p>
      <button onClick={toggleSync}>
        {isRunning ? 'Stop' : 'Start'} Sync
      </button>
    </div>
  );
}
```

## Rollback Function

The context provides a convenient `rollback` function:

```tsx
function RollbackButton({ commitOid }: { commitOid: string }) {
  const { rollback } = useLegitContext();

  const handleRollback = async () => {
    if (confirm('Rollback to this commit?')) {
      await rollback(commitOid);
      // All useLegitFile hooks will automatically reload
    }
  };

  return <button onClick={handleRollback}>Rollback</button>;
}
```

## Monitoring HEAD Changes

The `head` value updates automatically when the branch HEAD changes:

```tsx
function HeadMonitor() {
  const { head } = useLegitContext();
  const [headHistory, setHeadHistory] = useState<string[]>([]);

  useEffect(() => {
    if (head) {
      setHeadHistory(prev => [head, ...prev.slice(0, 9)]);
    }
  }, [head]);

  return (
    <div>
      <p>Current HEAD: {head?.slice(0, 8)}</p>
      <p>Recent HEADs:</p>
      <ul>
        {headHistory.map((h, i) => (
          <li key={i}>{h.slice(0, 8)}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Advanced File Operations

Access the filesystem directly for operations not covered by `useLegitFile`:

```tsx
function FileManager() {
  const { legitFs } = useLegitContext();
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!legitFs) return;

    const loadFiles = async () => {
      const branch = await legitFs.getCurrentBranch();
      const fileList = await legitFs.promises.readdir(
        `/.legit/branches/${branch}`
      );
      setFiles(fileList as string[]);
    };

    loadFiles();
  }, [legitFs]);

  return (
    <div>
      <h3>Files in branch</h3>
      <ul>
        {files.map(file => (
          <li key={file}>{file}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Reading Multiple Files

Read multiple files without using multiple hooks:

```tsx
function MultiFileReader() {
  const { legitFs } = useLegitContext();
  const [contents, setContents] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!legitFs) return;

    const loadFiles = async () => {
      const branch = await legitFs.getCurrentBranch();
      const files = ['/doc1.txt', '/doc2.txt', '/doc3.txt'];

      const results = await Promise.all(
        files.map(async (file) => {
          try {
            const content = await legitFs.promises.readFile(
              `/.legit/branches/${branch}${file}`,
              'utf8'
            );
            return [file, content as string] as const;
          } catch {
            return [file, ''] as const;
          }
        })
      );

      setContents(Object.fromEntries(results));
    };

    loadFiles();
  }, [legitFs]);

  return (
    <div>
      {Object.entries(contents).map(([file, content]) => (
        <div key={file}>
          <h4>{file}</h4>
          <pre>{content}</pre>
        </div>
      ))}
    </div>
  );
}
```

## Complete Example

Here's a complete example using context for advanced operations:

```tsx
import { useLegitContext, useLegitFile } from '@legit-sdk/react';

function AdvancedEditor() {
  const { legitFs, head, rollback } = useLegitContext();
  const { data, setData, history } = useLegitFile('/document.txt');
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);

  useEffect(() => {
    if (legitFs) {
      legitFs.getCurrentBranch().then(setCurrentBranch);
    }
  }, [legitFs]);

  const handleRollback = async (commitOid: string) => {
    if (confirm('Rollback to this commit?')) {
      await rollback(commitOid);
    }
  };

  const handleShare = async () => {
    if (!legitFs) return;
    await legitFs.auth.signInAnonymously();
    const branch = await legitFs.shareCurrentBranch();
    const link = `${window.location.origin}?branch=${branch}`;
    navigator.clipboard.writeText(link);
    alert('Share link copied!');
  };

  return (
    <div>
      <div>
        <p>Branch: {currentBranch}</p>
        <p>HEAD: {head?.slice(0, 8)}</p>
        <button onClick={handleShare}>Share</button>
      </div>

      <textarea
        value={data || ''}
        onChange={e => setData(e.target.value)}
      />

      <div>
        <h3>History</h3>
        {history.map(commit => (
          <div key={commit.oid}>
            <p>{commit.message}</p>
            <button onClick={() => handleRollback(commit.oid)}>
              Rollback
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## When to Use Context vs useLegitFile

**Use `useLegitFile` when:**
- Working with a single file
- Need automatic commit history
- Want reactive updates
- Simple read/write operations

**Use `useLegitContext` when:**
- Need branch management
- Working with authentication
- Controlling sync service
- Accessing multiple files
- Advanced filesystem operations
- Need rollback functionality
- Monitoring global state (HEAD, loading, errors)

## Best Practices

1. **Check for null**: Always check if `legitFs` is null before using it
2. **Handle loading**: Use the `loading` state to show initialization status
3. **Error handling**: Check the `error` property for global errors
4. **Combine hooks**: Use both `useLegitFile` and `useLegitContext` together when needed
5. **Memoize operations**: Use `useCallback` for functions that depend on `legitFs`

## See Also

- [Example Apps](/showcase) - Browse through examples
- [API Reference](/docs/api) - Complete API documentation of `@legit-sdk/core`

