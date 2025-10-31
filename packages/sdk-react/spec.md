# React wrapper RFC

## Architecture

```bash
+------------------------+
| LegitProvider          |  // SDK init, polling, singleton FS
|------------------------|
| state: legitFs         |
| state: loading         |
| state: error           |
| poll: HEAD changes     |
+------------------------+
         |
         v
+------------------------+
| useLegitFile(path)     |  // Reads from provider context
|------------------------|
| state: content         |
| state: history         |
| actions: setContent    |
| actions: getPastState  |
+------------------------+
         |
         v
+------------------------+
| Components             |  // Editor, HistoryEntry, etc.
+------------------------+

```

## Provider API

```ts
interface LegitProviderProps {
  children: React.ReactNode;
}

interface LegitContextValue {
  legitFs: Awaited<ReturnType<typeof initLegitFs>> | null;
  loading: boolean;
  error?: Error;
}

function LegitProvider({ children }: LegitProviderProps): JSX.Element;
function useLegitContext(): LegitContextValue;
```

### Behavior

- Initializes `legitFs` exactly once.
- Polls repository HEAD on an interval.
- Provides the shared `legitFs` instance to hooks.
- Exposes global `loading` and `error` states.

## Hook: useLegitFile

```ts
interface UseLegitFileReturn {
  content: string; // current file content (reactive)
  setContent: (newText: string) => Promise<void>; // writes + commits
  history: HistoryItem[]; // from sdk
  getPastState: (commitHash: string) => Promise<string>; // read file content at commit
  loading: boolean; // true while FS or history is initializing / polling
  error?: Error; // set if any FS operation fails
}

function useLegitFile(path: string): UseLegitFileReturn;
```

## Lifecycle

1. Provider mounts
   - Initialize `legitFs`
   - Set `loading = true`
   - Start polling HEAD (default: 200ms)

2. Hook mounts
   - Use provider `legitFs`
   - Read file and seed local state
   - Fetch `history` and optionally resolve past content

3. Updates / commits
   - `setContent(text)` writes to FS and commits; provider polling picks up changes

## Example

```ts
<LegitProvider>
  <Page />  // components can call useLegitFile for any path
</LegitProvider>
```

```ts
const Page = () => {
  const { content, setContent, history, getPastState } = useLegitFile("/document.txt");
  const [text, setText] = useState(content);

  useEffect(() => { setText(content) }, [content]);

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setContent(text)}>Save</button>

      {history.map(h => (
        <HistoryEntry
          key={h.oid}
          oid={h.oid}
          parentId={h.parentId}
          getPastState={getPastState}
        />
      ))}
    </div>
  );
};
```

## Why this design

- **Single SDK instance**: avoids multiple `initLegitFs` calls.
- **Centralized polling**: hooks update without their own timers.
- **Thin hooks**: consume context; no lifecycle management.
- **Fewer reads**: avoids redundant HEAD checks.

## Notes

- Provider must clear the polling interval on unmount.
- Polling interval can be configurable via props.
- Provider may cache file contents for faster first reads.
- Hooks only consume context; all FS access goes through `legitFs`.
