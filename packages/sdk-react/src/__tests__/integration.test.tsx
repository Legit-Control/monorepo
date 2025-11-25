import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  mockedLegitFs,
  mockInitLegitFs,
  mockOpenLegitFs,
} from '../__mocks__/mockLegitFs';
import React from 'react';
import { mockConfig, mockGetSyncToken } from '../__mocks__/mockConfig';
import { mockCreateLegitSyncService } from '../__mocks__/mockCreateLegitSyncService';

vi.mock('@legit-sdk/core', () => ({
  initLegitFs: mockInitLegitFs,
  openLegitFs: mockOpenLegitFs,
  createLegitSyncService: mockCreateLegitSyncService,
}));

afterEach(() => {
  vi.clearAllMocks();
  cleanup(); // ✅ remove all rendered components
});

import { LegitProvider } from '../LegitProvider';
import { useLegitFile } from '../useLegitFile';

const TestPage = () => {
  const { data, setData, history, loading } = useLegitFile('/doc.txt');
  const [text, setText] = React.useState(data ?? '');
  React.useEffect(() => {
    setText(data ?? '');
  }, [data]);
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <input
        aria-label="editor"
        value={text}
        onChange={(e: any) => setText(e.target.value)}
      />
      <button onClick={() => setData(text)}>Save</button>
      <div data-testid="history-count">{history.length}</div>
      <pre data-testid="content">{data === null ? 'is_null' : 'not_null'}</pre>
    </div>
  );
};

describe('React wrapper integration', () => {
  it('loads, edits, saves, and reacts to HEAD changes', async () => {
    let captured: (() => void) | null = null;
    const setIntervalSpy = vi
      .spyOn(global, 'setInterval')
      .mockImplementation((cb: any, _ms?: number): any => {
        captured = cb;
        return 1 as any;
      });

    let content = 'hello';
    mockedLegitFs.promises.readFile.mockImplementation((p: string) => {
      if (p.endsWith('/.legit/branches/main/.legit/history'))
        return Promise.resolve(JSON.stringify([{ oid: '1' }]));
      if (p.endsWith('/.legit/branches/main/.legit/head'))
        return Promise.resolve('h1');
      if (p.endsWith('/.legit/branches/main/doc.txt'))
        return Promise.resolve(content);
      return Promise.resolve('');
    });

    render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <TestPage />
      </LegitProvider>
    );

    const input = await screen.findByLabelText('editor');
    await waitFor(() =>
      expect((input as HTMLInputElement).value).toBe('hello')
    );
    expect(screen.getByTestId('history-count').textContent).toBe('1');

    await act(async () => {
      await (captured as () => void)();
    });

    fireEvent.change(input, { target: { value: 'edited text' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() =>
      expect(mockedLegitFs.promises.writeFile).toHaveBeenCalled()
    );
    expect((input as HTMLInputElement).value).toBe('edited text');

    setIntervalSpy.mockRestore();
  });

  it('handles ENOENT on initialization and creates file on save', async () => {
    // Simulate missing file -> ENOENT
    mockedLegitFs.promises.readFile.mockImplementation((p: string) => {
      if (p.endsWith('/.legit/branches/main/.legit/history'))
        return Promise.reject(
          Object.assign(new Error('ENOENT: no such file or directory'), {
            code: 'ENOENT',
          })
        );
      if (p.endsWith('/.legit/branches/main/.legit/head'))
        return Promise.resolve('h1');
      if (p.endsWith('/.legit/branches/main/doc.txt'))
        return Promise.reject(
          Object.assign(new Error('ENOENT: no such file or directory'), {
            code: 'ENOENT',
          })
        );
      return Promise.resolve('');
    });

    render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <TestPage />
      </LegitProvider>
    );

    // Wait for hook to initialize
    await waitFor(() =>
      expect(screen.getByTestId('content').textContent).toBe('is_null')
    );

    // Saving should create file
    const input = await screen.findByLabelText('editor');
    fireEvent.change(input, { target: { value: 'created file' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() =>
      expect(mockedLegitFs.promises.writeFile).toHaveBeenCalledWith(
        '/.legit/branches/main/doc.txt',
        'created file',
        'utf8'
      )
    );

    // Verify content updated in hook
    await waitFor(() =>
      expect(screen.getByTestId('content').textContent).toBe('not_null')
    );
  });
});
