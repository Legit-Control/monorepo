---
title: React Starter - Legit SDK React Hooks
description: Learn how to use @legit-sdk/react hooks for reactive file editing with built-in version control. Includes useLegitFile hook, LegitProvider, and automatic state management.
---

# React Starter

React hooks for file editing with built-in version control.

You can explore the live version here: 👉 [demo](https://legit-starter-react.vercel.app/)<br/>
And the repository here: 👉 [legit-starter-react](https://github.com/NilsJacobsen/legit-starter-react)

## Why @legit-sdk/react?

`@legit-sdk/core` provides a low-level file system API that works everywhere — Node.js, Python, Java, browsers. It follows the standard `fs` interface, so you can use it like any file system.

But React apps need more: **reactive state**, **automatic updates**, and **lifecycle management**. That's where `@legit-sdk/react` comes in.

### SDK Core vs React Wrapper

**With `@legit-sdk/core` directly:**

```ts
const legitFs = await initLegitFs(fs, '/');
const content = await legitFs.promises.readFile('/file.txt', 'utf8');
await legitFs.promises.writeFile('/file.txt', 'new content');
// Manual polling, state management, error handling...
```

**With `@legit-sdk/react`:**

```tsx
const { content, setContent } = useLegitFile('/file.txt');
// Reactive updates, automatic polling, built-in state management
```

The React wrapper handles:

- **State management** - File content and history as React state
- **Automatic polling** - Detects changes from other sources
- **Reactive updates** - UI updates when files change
- **Lifecycle** - Proper cleanup and initialization
- **Error handling** - Errors exposed through React state

You get all the power of `@legit-sdk/core` with React-native ergonomics.

## Quick Start

```tsx
import { LegitProvider, useLegitFile } from '@legit-sdk/react';

function App() {
  return (
    <LegitProvider>
      <Editor />
    </LegitProvider>
  );
}

function Editor() {
  const { content, setContent, history } = useLegitFile('/document.txt');
  return (
    <textarea
      value={content || ''}
      onChange={e => setContent(e.target.value)}
    />
  );
}
```

## API

### `LegitProvider`

Initializes the SDK and provides it to child components. Manages a single shared file system instance and polls for changes.

**Props:**

- `children: ReactNode` - Your app components

**What it does:**

- Initializes `legitFs` once on mount
- Polls repository HEAD every 100ms
- Provides `legitFs`, `loading`, `head`, and `error` via context

### `useLegitFile(path, options?)`

Hook for working with a single file. Handles reading, writing, history, and version lookup.

**Parameters:**

- `path: string` - File path (e.g., `/document.txt`)
- `options?: { initialContent?: string }` - Optional auto-create file with content

**Returns:**

- `content: string | null` - Current file content (updates reactively)
- `setContent(text: string): Promise<void>` - Write file and commit
- `history: HistoryItem[]` - Array of commit history entries
- `getPastState(oid: string): Promise<string>` - Read file content at specific commit
- `loading: boolean` - True while initializing or polling
- `error?: Error` - Error from any file operation
- `legitFs: LegitFs | null` - Direct access to SDK instance

**Auto-initialization:**
When `initialContent` is provided and the file doesn't exist, it's automatically created on first mount.

### `useLegitContext()`

Access provider context directly.

**Returns:**

- `legitFs: LegitFs | null` - SDK instance
- `loading: boolean` - Provider loading state
- `head: string | null` - Current HEAD commit hash
- `error?: Error` - Provider-level errors

## Versioning Made Simple

Version control is handled automatically:

1. **Save changes** → `setContent()` writes and commits automatically
2. **View history** → `history` array contains all commits
3. **Browse versions** → `getPastState(commitHash)` reads any past version

```tsx
const { history, getPastState } = useLegitFile('/file.txt');

// Display history
history.map(commit => (
  <div key={commit.oid}>
    {commit.message}
    <button onClick={() => getPastState(commit.oid).then(console.log)}>
      View
    </button>
  </div>
));
```

## Features

- **Single SDK instance** - Shared across all hooks via provider
- **Automatic polling** - Changes detected via HEAD polling (100ms interval)
- **Auto-initialization** - Files created automatically with `initialContent`
- **Reactive updates** - Content updates when HEAD changes
- **Full history access** - Read any past version via commit hash
- **Error handling** - Errors exposed via `error` property

## Architecture

```
LegitProvider (singleton FS + polling)
    ↓
useLegitFile (file operations + history)
    ↓
Components (use hooks)
```
