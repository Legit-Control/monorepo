# @legit-sdk/react

React hooks for `@legit-sdk/core` - local-first file editing with version control.

## Install

```bash
pnpm add @legit-sdk/core @legit-sdk/react
```

**Peer dependencies:** `react >=18`

## Usage

```tsx
import { LegitProvider, useLegitFile } from '@legit-sdk/react';

function Editor() {
  const { content, setContent, history, loading } = useLegitFile(
    '/document.txt',
    { initialContent: 'Hello World' } // auto-create if missing
  );
  const [text, setText] = useState(content || '');

  useEffect(() => setText(content || ''), [content]);

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setContent(text)}>Save</button>
      {history.map(h => (
        <div key={h.oid}>{h.message}</div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <LegitProvider>
      <Editor />
    </LegitProvider>
  );
}
```

## API

### `LegitProvider`

Wraps your app and initializes the SDK instance. Polls HEAD for changes.

```tsx
<LegitProvider>
  <YourApp />
</LegitProvider>
```

### `useLegitFile(path, options?)`

Hook for file operations.

**Options:**

- `initialContent?: string` - Auto-create file with this content if missing

**Returns:**

- `content: string | null` - Current file content
- `setContent(text: string): Promise<void>` - Save and commit
- `history: HistoryItem[]` - Commit history
- `getPastState(oid: string): Promise<string>` - Read file at commit
- `loading: boolean` - Loading state
- `error?: Error` - Error state

### `useLegitContext()`

Access provider context (legitFs, head, loading, error).

## Types

```ts
interface UseLegitFileOptions {
  initialContent?: string;
}

type UseLegitFileReturn = {
  content: string | null;
  setContent: (text: string) => Promise<void>;
  history: HistoryItem[];
  getPastState: (oid: string) => Promise<string>;
  loading: boolean;
  error?: Error;
  legitFs: LegitFs | null;
};
```

## See Also

- [Starter Example](../../examples/react-starter) - Full working example
- [Spec Documentation](./spec.md) - Detailed API documentation
