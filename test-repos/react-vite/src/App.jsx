import { LegitProvider, useLegitFile } from '@legit-sdk/react';
import { useEffect, useState } from 'react';

const FILE_PATH = '/notes.txt';
const INITIAL_TEXT = 'Hello from Legit 👋';

function Editor() {
  const { data, setData, history, loading } = useLegitFile(FILE_PATH, {
    initialData: INITIAL_TEXT,
  });
  const [text, setText] = useState('');

  // Initialize with text from LegitFs
  useEffect(() => {
    if (!text) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(data || '');
    }
  }, [loading, data, text, loading]);

  if (loading) return <div>Loading Legit...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📝 Legit Editor</h2>
      <p>{loading ? 'Loading...' : 'Loaded'}</p>
      <input
        className="border border-gray-300 rounded-md p-2"
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={() => text && setData(text)}
      />
      <pre>{JSON.stringify(history, null, 2)}</pre>
    </div>
  );
}

function App() {
  return (
    <LegitProvider>
      <Editor />
    </LegitProvider>
  );
}

export default App;
