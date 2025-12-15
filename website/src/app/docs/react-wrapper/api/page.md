---
title: React Wrapper API Reference
description: Complete API reference for @legit-sdk/react including LegitProvider, useLegitFile hook, and useLegitContext hook with configuration options and return types.
---

# API Reference

Complete API reference for `@legit-sdk/react`.

## Provider

### `LegitProvider`

Wraps your application and initializes the LegitFS SDK instance. Provides the filesystem context to all child components.

#### Props

```typescript
interface LegitProviderProps {
  children: ReactNode;
  config?: LegitConfig;
}
```

#### Config Options

```typescript
type LegitConfig = {
  gitRoot: string;           // Root path of the Git repository
  initialBranch?: string;    // Initial branch name (default: 'anonymous')
  serverUrl?: string;        // Sync server URL
  publicKey?: string;        // Public key for authentication
};
```

#### Example

```tsx
<LegitProvider
  config={{
    gitRoot: '/',
    initialBranch: 'main',
    serverUrl: 'https://hub.legitcontrol.com',
    publicKey: process.env.NEXT_PUBLIC_LEGIT_PUBLIC_KEY,
  }}
>
  <YourApp />
</LegitProvider>
```

#### Behavior

- Initializes `legitFs` exactly once on mount
- Polls repository HEAD every 100ms to detect changes
- Provides shared `legitFs` instance through React context
- Exposes global `loading` and `error` states

## Hooks

### `useLegitFile(path, options?)`

Hook for file operations with automatic version control.

#### Parameters

- **path** (string): File path relative to the branch root (e.g., `'/document.txt'`)
- **options** (optional): Configuration options

```typescript
interface UseLegitFileOptions {
  initialData?: string; // Auto-create file with this content if missing
}
```

#### Returns

```typescript
type UseLegitFileReturn = {
  data: string | null;                    // Current file content
  setData: (newText: string) => Promise<void>; // Save and commit
  history: HistoryItem[];                  // Commit history
  getPastState: (commitHash: string) => Promise<string>; // Read file at commit
  loading: boolean;                        // Loading state
  error?: Error;                           // Error state
  legitFs: LegitFs | null;                 // Direct access to legitFs instance
};
```

#### Behavior

- **Auto-initialization**: If `initialData` is provided and the file doesn't exist, it will be created automatically on first mount
- **Reactive updates**: Automatically reloads when HEAD changes (detected by provider polling)
- **Automatic commits**: Each `setData()` call creates a Git commit with a descriptive message
- **History tracking**: Fetches commit history from `.legit/branches/{branch}/.legit/history`
- **Error handling**: Gracefully handles missing files (returns `null` for data, empty array for history)

### `useLegitContext()`

Access the provider context directly for advanced use cases.

#### Returns

```typescript
interface LegitContextValue {
  legitFs: Awaited<ReturnType<typeof openLegitFs>> | null;
  loading: boolean;
  head: string | null;              // Current HEAD commit SHA
  rollback: (commitHash: string) => Promise<void>;
  error?: Error;
}
```

#### Use Cases

- Access `legitFs` directly for advanced operations
- Monitor HEAD changes
- Implement custom rollback logic
- Access branch management functions
- Use authentication API (`legitFs.auth`)
- Use sync API (`legitFs.sync`)

## Sync with React wrapper

The sync api is currently in experimental mode. If you want to read more about it follow the instructions [here](/docs/sync).

## Types

### `HistoryItem`

```typescript
type HistoryItem = {
  oid: string;              // Commit SHA
  message: string;          // Commit message
  parent: string[];         // Parent commit SHAs
  author: {
    name: string;
    email: string;
    timestamp: number;
  };
};
```

### `LegitConfig`

```typescript
type LegitConfig = {
  gitRoot: string;
  initialBranch?: string;
  serverUrl?: string;
  publicKey?: string;
};
```

### `UseLegitFileOptions`

```typescript
interface UseLegitFileOptions {
  initialData?: string;
}
```

### `UseLegitFileReturn`

```typescript
type UseLegitFileReturn = {
  data: string | null;
  setData: (newText: string) => Promise<void>;
  history: HistoryItem[];
  getPastState: (commitHash: string) => Promise<string>;
  loading: boolean;
  error?: Error;
  legitFs: Awaited<ReturnType<typeof openLegitFs>> | null;
};
```

### `LegitContextValue`

```typescript
interface LegitContextValue {
  legitFs: Awaited<ReturnType<typeof openLegitFs>> | null;
  loading: boolean;
  head: string | null;
  rollback: (commitHash: string) => Promise<void>;
  error?: Error;
}
```

## Lifecycle

### Provider Lifecycle

1. **Mount**: Initializes `legitFs` instance
2. **Polling**: Starts polling HEAD every 100ms
3. **Updates**: When HEAD changes, triggers re-renders in consuming hooks
4. **Unmount**: Cleans up polling interval

### Hook Lifecycle

1. **Mount**: Reads file and history, initializes state
2. **Auto-init**: If file doesn't exist and `initialData` is provided, creates file
3. **Updates**: Reloads when HEAD changes (detected by provider)
4. **Save**: `setData()` writes file and creates commit, updates local state optimistically

## Error Handling

- Missing files return `null` for `data` (not an error)
- Network errors are caught and exposed via `error` property
- File system errors are propagated through the `error` property
- Auto-initialization failures are logged but don't crash the component

## Performance Considerations

- **Polling interval**: Default 100ms (configurable via provider)
- **Optimistic updates**: `setData()` updates local state immediately
- **Memoized history**: History array is memoized to prevent unnecessary re-renders
- **Cancellation**: File reads are cancelled on unmount to prevent race conditions

## See Also

- **[Working with One File](/docs/react-wrapper/working-with-files)** - Using `useLegitFile` hook and how the abstraction works
- **[Accessing Legit Context](/docs/react-wrapper/accessing-context)** - Using `useLegitContext` for advanced operations

