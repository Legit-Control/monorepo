import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { mockedInitLegitFs } from '../__mocks__/mockLegitFs';

// mock the sdk
vi.mock('@legit-sdk/core', () => ({
  initLegitFs: mockedInitLegitFs,
}));

import { LegitProvider, useLegitContext } from '../LegitProvider';
import { initLegitFs } from '@legit-sdk/core';

describe('LegitProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes legitFs and sets loading state', async () => {
    const Consumer = () => {
      const { legitFs, loading } = useLegitContext();
      return <div>{loading ? 'loading' : legitFs ? 'ready' : 'error'}</div>;
    };

    render(
      <LegitProvider>
        <Consumer />
      </LegitProvider>
    );

    // Initially loading
    expect(screen.getByText('loading')).toBeDefined();

    // Wait for legitFs to initialize
    await waitFor(() => expect(screen.getByText('ready')).toBeDefined());
    expect(initLegitFs).toHaveBeenCalled();
  });

  it('handles init error', async () => {
    (initLegitFs as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Init failed')
    );

    const Consumer = () => {
      const { loading, error } = useLegitContext();
      return <div>{loading ? 'loading' : error ? 'error' : 'ready'}</div>;
    };

    render(
      <LegitProvider>
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(screen.getByText('error')).toBeDefined());
  });

  it('starts a polling interval that reads HEAD and updates context.head', async () => {
    // Prepare a mock FS with head read
    const readFile = vi.fn().mockImplementation((p: string) => {
      if (p.endsWith('/.legit/branches/main/.legit/head'))
        return Promise.resolve('h1');
      return Promise.resolve('');
    });
    mockedInitLegitFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof initLegitFs>);

    // Spy on setInterval to capture the callback
    const originalSetInterval = global.setInterval;
    let captured: (() => void) | null = null;
    const setIntervalSpy = vi
      .spyOn(global, 'setInterval')
      .mockImplementation((cb: any, _ms?: number): any => {
        captured = cb;
        // return a dummy id
        return 1 as any;
      });

    const Consumer = () => {
      const { head } = useLegitContext();
      return <div data-testid="head">{head ?? 'none'}</div>;
    };

    render(
      <LegitProvider>
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(initLegitFs).toHaveBeenCalled());
    expect(captured).toBeTruthy();
    expect(screen.getByTestId('head').textContent).toBe('none');

    // Manually run the interval callback once
    await act(async () => {
      await (captured as () => void)();
    });
    await waitFor(() =>
      expect(screen.getByTestId('head').textContent).toBe('h1')
    );

    setIntervalSpy.mockRestore();
    global.setInterval = originalSetInterval;
  });
});
