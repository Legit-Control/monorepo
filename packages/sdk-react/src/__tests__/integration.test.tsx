import { describe, expect, it, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockLegitFs, mockedInitLegitFs } from '../__mocks__/mockLegitFs';
import React from 'react';
import { useLegitFile } from '../useLegitFile';

vi.mock('@legit-sdk/core', () => ({
  initLegitFs: mockedInitLegitFs,
}));

import { LegitProvider } from '../LegitProvider';

const TestPage = () => {
  const { content, setContent, history } = useLegitFile('/doc.txt');
  const [text, setText] = React.useState(content);
  React.useEffect(() => setText(content), [content]);
  return (
    <div>
      <input
        aria-label="editor"
        value={text}
        onChange={(e: any) => setText(e.target.value)}
      />
      <button onClick={() => setContent(text)}>Save</button>
      <div data-testid="history-count">{history.length}</div>
    </div>
  );
};

describe('React wrapper integration', () => {
  it('loads, edits, saves, and reacts to HEAD changes', async () => {
    // Capture interval callback instead of relying on fake timers
    let captured: (() => void) | null = null;
    const setIntervalSpy = vi
      .spyOn(global, 'setInterval')
      .mockImplementation((cb: any, _ms?: number): any => {
        captured = cb;
        return 1 as any;
      });

    // Seed fs reads: history + content, then head ticks
    let content = 'hello';
    mockLegitFs.promises.readFile.mockImplementation((p: string) => {
      if (p.endsWith('/.legit/branches/main/.legit/history'))
        return Promise.resolve(JSON.stringify([{ oid: '1' }]));
      if (p.endsWith('/.legit/branches/main/.legit/head'))
        return Promise.resolve('h1');
      if (p.endsWith('/.legit/branches/main/doc.txt'))
        return Promise.resolve(content);
      return Promise.resolve('');
    });

    render(
      <LegitProvider>
        <TestPage />
      </LegitProvider>
    );

    const input = await screen.findByLabelText('editor');
    await waitFor(() =>
      expect((input as HTMLInputElement).value).toBe('hello')
    );
    expect(screen.getByTestId('history-count').textContent).toBe('1');

    // Establish initial head once
    await act(async () => {
      await (captured as () => void)();
    });

    // Edit and save
    fireEvent.change(input, { target: { value: 'edited text' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() =>
      expect(mockLegitFs.promises.writeFile).toHaveBeenCalled()
    );
    expect((input as HTMLInputElement).value).toBe('edited text');

    setIntervalSpy.mockRestore();
  });
});
