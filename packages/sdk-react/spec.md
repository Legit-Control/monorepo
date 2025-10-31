# React Wrapper RFC

## 1️⃣ Architecture Overview

```bash
+------------------------+
| LegitProvider          |  <-- Manages SDK init, polling, and singleton FS instance
|------------------------|
| state: legitFs         |
| state: loading         |
| state: error           |
| poll: HEAD changes     |
+------------------------+
         |
         v
+------------------------+
| useLegitFile(path)     |  <-- Consumes Provider context
|------------------------|
| state: content         |
| state: history         |
| actions: setContent    |
| actions: getPastState  |
+------------------------+
         |
         v
+------------------------+
| Components             |  <-- Editor, HistoryEntry
+------------------------+

```

## 2️⃣ Provider API

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

### Behavior:

- Initializes `legitFs` once.
- Polls the `.legit/branches/main/.legit/head`.
- Provides `legitFs` instance to all `useLegitFile` hooks.
- Exposes global `loading` and `error` states.

## 3️⃣ Hook: useLegitFile

```ts
function useLegitFile(path: string): UseLegitFileReturn;
```

## 4️⃣ Lifecycle Flow

1. Provider mounts

- Initializes `legitFs`
- Sets `loading = true`
- Polls HEAD every 200ms

2. Hook mounts

- Subscribes to Provider’s `legitFs`
- Reads file content, initializes local state
- Fetches `history` and enriches with past commit content

3. Updates / Commits
   - `setContent(text)` → writes to FS → triggers SDK commit → Provider polling updates hooks

## 5️⃣ Example Usage

```ts
<LegitProvider>
  <Page />  // can use useLegitFile for any path
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

## Pros

- **Singleton SDK** — no multiple initializations of legitFs.
- **Centralized polling** — all hooks see updates without extra intervals.
- **Lightweight hooks** — just consume context, don’t manage polling or FS lifecycle.
- **Improved performance** — avoids repeated HEAD reads and redundant initLegitFs calls.

## Notes

- Provider should handle cleanup of polling interval on unmount.
- Optionally expose configurable polling interval via props.
- Provider could also manage global cache of file content for faster hook access.
- Hooks remain pure consumers of the context: all FS access goes through legitFs.
