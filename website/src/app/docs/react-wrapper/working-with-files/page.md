---
title: Working with One File
description: Guide to using the useLegitFile hook for file operations with automatic version control, commit history, and reactive updates in React applications.
---

# Working with One File

Guide to using `useLegitFile` hook for file operations with automatic version control.

## Overview

The `useLegitFile` hook is the primary abstraction for working with files in the React wrapper. It handles reading, writing, commit history, and automatic synchronization - all through a simple React hook interface.

## What It Does

The `useLegitFile` hook provides:

1. **File Reading**: Automatically loads file content from the current branch
2. **File Writing**: Saves changes and creates Git commits automatically
3. **Commit History**: Tracks and provides access to commit history
4. **Past Versions**: Read file content at any previous commit
5. **Auto-initialization**: Optionally creates files with initial content
6. **Reactive Updates**: Automatically reloads when the branch HEAD changes

## How the Abstraction Works

### Basic Usage

```tsx
import { useLegitFile } from '@legit-sdk/react';

function Editor() {
  const { data, setData, history, loading } = useLegitFile('/document.txt');
  
  // data: current file content (string | null)
  // setData: save and commit function
  // history: array of commits
  // loading: loading state
}
```

### The Abstraction Layer

Under the hood, `useLegitFile`:

1. **Reads from branch path**: Files are stored at `/.legit/branches/{currentBranch}{path}`
2. **Automatic commits**: Each `setData()` call writes to the branch path, which automatically creates a Git commit
3. **History tracking**: Reads commit history from `/.legit/branches/{currentBranch}/.legit/history`
4. **HEAD polling**: The provider polls HEAD every 100ms, and when it changes, the hook automatically reloads

### File Path Resolution

The hook automatically resolves paths relative to the current branch:

```tsx
// If current branch is 'main', this reads from:
// /.legit/branches/main/document.txt
const { data } = useLegitFile('/document.txt');
```

### Automatic Commits

Every save operation creates a commit automatically:

```tsx
const { setData } = useLegitFile('/document.txt');

// This single call:
await setData('New content');

// Does the following:
// 1. Writes to /.legit/branches/{branch}/document.txt
// 2. Creates a Git commit with message "💾 Change 'document.txt'"
// 3. Updates the branch HEAD
// 4. Triggers provider polling to detect the change
// 5. All hooks reload with the new content
```

## Complete Example

Here's a complete editor component:

```tsx
import { useLegitFile } from '@legit-sdk/react';
import { useState, useEffect } from 'react';

function Editor() {
  const { data, setData, history, getPastState, loading, error } = useLegitFile(
    '/document.txt',
    { initialData: 'Hello, World!' } // Auto-create if missing
  );
  
  const [text, setText] = useState('');

  // Sync local state with file data
  useEffect(() => {
    if (data !== null) {
      setText(data);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await setData(text); // Creates commit automatically
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={10}
      />
      <button onClick={handleSave}>Save</button>
      
      <div>
        <h3>History ({history.length} commits)</h3>
        {history.map(commit => (
          <div key={commit.oid}>
            <p>{commit.message}</p>
            <p>By {commit.author.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Auto-initialization

If a file doesn't exist, you can provide `initialData` to auto-create it:

```tsx
// File will be created with "Default content" if it doesn't exist
const { data, setData } = useLegitFile('/new-file.txt', {
  initialData: 'Default content',
});
```

**Important**: Auto-initialization happens once per mount, after the initial file load completes.

## Reading Past Versions

Use `getPastState()` to read file content at a specific commit:

```tsx
function HistoryViewer() {
  const { history, getPastState } = useLegitFile('/document.txt');
  const [pastContent, setPastContent] = useState<string>('');

  const viewCommit = async (commitOid: string) => {
    const content = await getPastState(commitOid);
    setPastContent(content);
  };

  return (
    <div>
      {history.map(commit => (
        <button key={commit.oid} onClick={() => viewCommit(commit.oid)}>
          View {commit.message}
        </button>
      ))}
      {pastContent && <pre>{pastContent}</pre>}
    </div>
  );
}
```

## Reactive Updates

The hook automatically reloads when the branch HEAD changes:

```tsx
function Editor() {
  const { data } = useLegitFile('/document.txt');
  
  // If another tab or user changes the file:
  // 1. Provider detects HEAD change (via polling)
  // 2. Hook automatically reloads file content
  // 3. Component re-renders with new data
  
  return <div>{data}</div>;
}
```

## Error Handling

The hook handles errors gracefully:

```tsx
const { data, error, loading } = useLegitFile('/document.txt');

// Missing files return null (not an error)
if (data === null && !loading && !error) {
  return <div>File doesn't exist yet</div>;
}

// Actual errors are exposed
if (error) {
  return <div>Error: {error.message}</div>;
}
```

## Loading States

The `loading` state indicates when the file is being read:

```tsx
const { data, loading } = useLegitFile('/document.txt');

if (loading) {
  return <div>Loading file...</div>;
}

return <div>{data}</div>;
```

## Multiple Files

You can use the hook multiple times for different files:

```tsx
function MultiFileEditor() {
  const doc1 = useLegitFile('/doc1.txt');
  const doc2 = useLegitFile('/doc2.txt');
  const doc3 = useLegitFile('/doc3.txt');

  return (
    <div>
      <Editor file={doc1} />
      <Editor file={doc2} />
      <Editor file={doc3} />
    </div>
  );
}
```

## Best Practices

1. **Sync local state**: Use `useEffect` to sync local form state with file data
2. **Handle loading**: Always check `loading` before rendering content
3. **Error handling**: Check for `error` and handle gracefully

## How It Maps to Core SDK

The hook abstracts over the core SDK operations:

```tsx
// What useLegitFile does internally:
const currentBranch = await legitFs.getCurrentBranch();
const filePath = `/.legit/branches/${currentBranch}${path}`;
const content = await legitFs.promises.readFile(filePath, 'utf8');
const history = await legitFs.promises.readFile(
  `/.legit/branches/${currentBranch}/.legit/history`,
  'utf8'
);

// When saving:
await legitFs.promises.writeFile(filePath, newContent, 'utf8');
// This automatically creates a commit via GitSubFs
```

## See Also

- [Accessing Legit Context](/docs/react-wrapper/accessing-context) - Using `useLegitContext` for advanced operations
- [API Reference](/docs/api) - Complete API documentation

