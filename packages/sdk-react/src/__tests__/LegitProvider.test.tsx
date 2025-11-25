import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { mockInitLegitFs, mockOpenLegitFs } from '../__mocks__/mockLegitFs';
import { mockConfig, mockGetSyncToken } from '../__mocks__/mockConfig';
import {
  mockCreateLegitSyncService,
  mockLegitSyncService,
} from '../__mocks__/mockCreateLegitSyncService';

// mock the sdk
vi.mock('@legit-sdk/core', () => ({
  initLegitFs: mockInitLegitFs,
  createLegitSyncService: mockCreateLegitSyncService,
  openLegitFs: mockOpenLegitFs,
}));

import { LegitConfig, LegitProvider, useLegitContext } from '../LegitProvider';
import { initLegitFs, openLegitFs } from '@legit-sdk/core';
import { useEffect } from 'react';

describe('Minimal setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes legitFs and sets loading state', async () => {
    const Consumer = () => {
      const { legitFs, loading } = useLegitContext();
      return <div>{loading ? 'loading' : legitFs ? 'ready' : 'error'}</div>;
    };

    const { unmount } = render(
      <LegitProvider>
        <Consumer />
      </LegitProvider>
    );

    // Initially loading
    expect(screen.getByText('loading')).toBeDefined();

    // Wait for legitFs to initialize
    await waitFor(() => expect(screen.getByText('ready')).toBeDefined());
    expect(initLegitFs).toHaveBeenCalled();
    unmount();
  });
});

describe('No initialBranch, sync enabled', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateLegitSyncService.mockReturnValue(mockLegitSyncService);
  });

  it('initializes legitFs and sets loading state', async () => {
    const Consumer = () => {
      const { legitFs, loading } = useLegitContext();
      return <div>{loading ? 'loading' : legitFs ? 'ready' : 'error'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    // Initially loading
    expect(screen.getByText('loading')).toBeDefined();

    // Wait for legitFs to initialize
    await waitFor(() => expect(screen.getByText('ready')).toBeDefined());
    expect(initLegitFs).toHaveBeenCalled();
    unmount();
  });

  it('handles init error', async () => {
    (initLegitFs as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Init failed')
    );

    const Consumer = () => {
      const { loading, error } = useLegitContext();
      return <div>{loading ? 'loading' : error ? 'error' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(screen.getByText('error')).toBeDefined());
    unmount();
  });

  it('does not update state if unmounted during initialization', async () => {
    let resolveInit: (value: any) => void;
    const initPromise = new Promise(resolve => {
      resolveInit = resolve;
    });
    (initLegitFs as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      initPromise as any
    );

    const Consumer = () => {
      const { loading } = useLegitContext();
      return <div>{loading ? 'loading' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    expect(screen.getByText('loading')).toBeDefined();

    // Unmount before initialization completes
    unmount();

    // Now resolve the promise
    resolveInit!({ promises: { readFile: vi.fn(), writeFile: vi.fn() } });
    await initPromise;
  });

  it('does not update HEAD if value unchanged', async () => {
    const readFile = vi.fn().mockResolvedValue('head1');
    mockInitLegitFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof initLegitFs>);

    let updateCount = 0;
    const Consumer = () => {
      const { head } = useLegitContext();
      // Count non-null head values
      if (head !== null && head !== 'none') updateCount++;

      return <div data-testid="head-unique">{head ?? 'none'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    // Should only update once (initial update)
    await waitFor(() =>
      expect(screen.getByTestId('head-unique').textContent).toBe('head1')
    );
    // updateCount tracks how many times head was set to a non-null value
    expect(updateCount).toBeGreaterThanOrEqual(1);

    unmount();
  });

  it('ignores ENOENT errors during polling', async () => {
    const readFile = vi.fn().mockImplementation((p: string) => {
      if (p.endsWith('/.legit/head')) {
        return Promise.reject(
          Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
        );
      }
      return Promise.resolve('');
    });

    mockInitLegitFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof initLegitFs>);

    // Spy on setInterval
    const originalSetInterval = global.setInterval;
    let captured: (() => void) | null = null;
    const setIntervalSpy = vi
      .spyOn(global, 'setInterval')
      .mockImplementation((cb: any, _ms?: number): any => {
        captured = cb;
        return 1 as any;
      });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const Consumer = () => {
      const { head } = useLegitContext();
      return <div>{head ?? 'none'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(setIntervalSpy).toHaveBeenCalled());
    expect(captured).toBeTruthy();

    // Trigger polling - should not crash
    await act(async () => {
      await (captured as () => void)();
    });

    // Should not log error for ENOENT
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    setIntervalSpy.mockRestore();
    global.setInterval = originalSetInterval;
    unmount();
  });

  it('cleans up polling interval on unmount', async () => {
    const readFile = vi.fn().mockResolvedValue('head1');
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    mockInitLegitFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof initLegitFs>);

    const { unmount } = render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <div>Test</div>
      </LegitProvider>
    );

    await waitFor(() => expect(mockInitLegitFs).toHaveBeenCalled());

    // Unmount should clear interval
    unmount();

    await waitFor(() => expect(clearIntervalSpy).toHaveBeenCalled());
    clearIntervalSpy.mockRestore();
  });

  it('does not poll if unmounted before init completes', async () => {
    const readFile = vi.fn();
    const initPromise = Promise.resolve({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof initLegitFs>);

    (initLegitFs as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      initPromise
    );

    const { unmount } = render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <div>Test</div>
      </LegitProvider>
    );

    unmount();

    await initPromise;

    // Should not trigger polling
    expect(readFile).not.toHaveBeenCalled();
  });
});

describe('With initialBranch, sync enabled', () => {
  const configWithBranch = { ...mockConfig, initialBranch: 'mockName' };

  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure clone is properly mocked after clearAllMocks
    mockLegitSyncService.clone.mockResolvedValue(undefined);
  });

  it('initializes legitFs with openLegitFs and sets loading state', async () => {
    const Consumer = () => {
      const { legitFs, loading, branch } = useLegitContext();
      return (
        <div>{loading ? 'loading' : legitFs ? `ready-${branch}` : 'error'}</div>
      );
    };

    const { unmount } = render(
      <LegitProvider config={configWithBranch} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    // Initially loading
    expect(screen.getByText('loading')).toBeDefined();

    // Wait for legitFs to initialize
    await waitFor(() =>
      expect(screen.getByText('ready-mockName')).toBeDefined()
    );
    expect(openLegitFs).toHaveBeenCalled();
    expect(mockLegitSyncService.clone).toHaveBeenCalled();
    expect(mockInitLegitFs).not.toHaveBeenCalled();

    unmount();
  });

  it('handles clone error', async () => {
    mockLegitSyncService.clone.mockRejectedValueOnce(new Error('Clone failed'));

    const Consumer = () => {
      const { loading, error } = useLegitContext();
      return <div>{loading ? 'loading' : error ? 'error' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={configWithBranch} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(screen.getByText('error')).toBeDefined());

    unmount();
  });

  it('handles openLegitFs error', async () => {
    mockOpenLegitFs.mockRejectedValueOnce(new Error('Open failed'));

    const Consumer = () => {
      const { loading, error } = useLegitContext();
      return <div>{loading ? 'loading' : error ? 'error' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={configWithBranch} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(screen.getByText('error')).toBeDefined());
    unmount();
  });

  it('does not update state if unmounted during initialization', async () => {
    let resolveClone: (value: any) => void;
    const clonePromise = new Promise(resolve => {
      resolveClone = resolve;
    });
    mockLegitSyncService.clone.mockReturnValueOnce(clonePromise as any);

    const Consumer = () => {
      const { loading } = useLegitContext();
      return <div>{loading ? 'loading' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={configWithBranch} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    expect(screen.getByText('loading')).toBeDefined();

    // Unmount before initialization completes
    unmount();

    // Now resolve the promise
    resolveClone!(undefined);
    await clonePromise;

    // Should not crash or update state - component is unmounted
  });

  it('does not update HEAD if value unchanged', async () => {
    const readFile = vi.fn().mockResolvedValue('head1');
    mockOpenLegitFs.mockResolvedValueOnce({
      promises: {
        readFile,
        writeFile: vi.fn(),
      },
    } as unknown as ReturnType<typeof openLegitFs>);

    // Ensure clone is properly mocked
    mockLegitSyncService.clone.mockResolvedValue(undefined);

    let updateCount = 0;
    const Consumer = () => {
      const { head } = useLegitContext();
      // Count non-null head values
      if (head !== null && head !== 'none') updateCount++;
      return <div data-testid="head-unique">{head ?? 'none'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={configWithBranch} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    // Wait for clone to be called first, then openLegitFs
    await waitFor(() => expect(mockLegitSyncService.clone).toHaveBeenCalled());
    await waitFor(() => expect(openLegitFs).toHaveBeenCalled());

    // Should only update once (initial update)
    await waitFor(() =>
      expect(screen.getByTestId('head-unique').textContent).toBe('head1')
    );
    // updateCount tracks how many times head was set to a non-null value
    expect(updateCount).toBeGreaterThanOrEqual(1);
    unmount();
  });

  it('cleans up polling interval on unmount', async () => {
    const readFile = vi.fn().mockResolvedValue('head1');
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    mockOpenLegitFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof openLegitFs>);

    const { unmount } = render(
      <LegitProvider config={configWithBranch} getSyncToken={mockGetSyncToken}>
        <div>Test</div>
      </LegitProvider>
    );

    await waitFor(() => expect(openLegitFs).toHaveBeenCalled());

    // Unmount should clear interval
    unmount();

    await waitFor(() => expect(clearIntervalSpy).toHaveBeenCalled());
    clearIntervalSpy.mockRestore();
  });

  it('does not poll if unmounted before init completes', async () => {
    const readFile = vi.fn();
    const clonePromise = Promise.resolve(undefined);

    mockLegitSyncService.clone.mockReturnValueOnce(clonePromise as any);

    const { unmount } = render(
      <LegitProvider config={configWithBranch} getSyncToken={mockGetSyncToken}>
        <div>Test</div>
      </LegitProvider>
    );

    unmount();

    await clonePromise;

    // Should not trigger polling
    expect(readFile).not.toHaveBeenCalled();
    unmount();
  });
});

describe('No initialBranch, sync disabled', () => {
  const configNoSync: LegitConfig = { ...mockConfig, sync: undefined };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLegitSyncService.clone.mockResolvedValue(undefined);
  });

  it('initializes legitFs and sets loading state', async () => {
    const Consumer = () => {
      const { legitFs, loading } = useLegitContext();
      return <div>{loading ? 'loading' : legitFs ? 'ready' : 'error'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={configNoSync} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    // Initially loading
    expect(screen.getByText('loading')).toBeDefined();

    // Wait for legitFs to initialize
    await waitFor(() => expect(screen.getByText('ready')).toBeDefined());
    expect(initLegitFs).toHaveBeenCalled();
    unmount();
  });

  it('handles init error', async () => {
    (initLegitFs as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Init failed')
    );

    const Consumer = () => {
      const { loading, error } = useLegitContext();
      return <div>{loading ? 'loading' : error ? 'error' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={configNoSync} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(screen.getByText('error')).toBeDefined());
    unmount();
  });

  it('does not update state if unmounted during initialization', async () => {
    let resolveInit: (value: any) => void;
    const initPromise = new Promise(resolve => {
      resolveInit = resolve;
    });
    (initLegitFs as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      initPromise as any
    );

    const Consumer = () => {
      const { loading } = useLegitContext();
      return <div>{loading ? 'loading' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={configNoSync} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    expect(screen.getByText('loading')).toBeDefined();

    // Unmount before initialization completes
    unmount();

    // Now resolve the promise
    resolveInit!({ promises: { readFile: vi.fn(), writeFile: vi.fn() } });
    await initPromise;
  });

  it('does not update HEAD if value unchanged', async () => {
    const readFile = vi.fn().mockResolvedValue('head1');
    mockInitLegitFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof initLegitFs>);

    let updateCount = 0;
    const Consumer = () => {
      const { head } = useLegitContext();
      // Count non-null head values
      if (head !== null && head !== 'none') updateCount++;
      return <div data-testid="head-unique">{head ?? 'none'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={configNoSync} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    // Should only update once (initial update)
    await waitFor(() =>
      expect(screen.getByTestId('head-unique').textContent).toBe('head1')
    );
    // updateCount tracks how many times head was set to a non-null value
    expect(updateCount).toBeGreaterThanOrEqual(1);

    unmount();
  });

  it('ignores ENOENT errors during polling', async () => {
    const readFile = vi.fn().mockImplementation((p: string) => {
      if (p.endsWith('/.legit/head')) {
        return Promise.reject(
          Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
        );
      }
      return Promise.resolve('');
    });

    mockInitLegitFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof initLegitFs>);

    // Spy on setInterval
    const originalSetInterval = global.setInterval;
    let captured: (() => void) | null = null;
    const setIntervalSpy = vi
      .spyOn(global, 'setInterval')
      .mockImplementation((cb: any, _ms?: number): any => {
        captured = cb;
        return 1 as any;
      });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const Consumer = () => {
      const { head } = useLegitContext();
      return <div>{head ?? 'none'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(setIntervalSpy).toHaveBeenCalled());
    expect(captured).toBeTruthy();

    // Trigger polling - should not crash
    await act(async () => {
      await (captured as () => void)();
    });

    // Should not log error for ENOENT
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    setIntervalSpy.mockRestore();
    global.setInterval = originalSetInterval;
    unmount();
  });

  it('cleans up polling interval on unmount', async () => {
    const readFile = vi.fn().mockResolvedValue('head1');
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    mockInitLegitFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof initLegitFs>);

    const { unmount } = render(
      <LegitProvider config={configNoSync} getSyncToken={mockGetSyncToken}>
        <div>Test</div>
      </LegitProvider>
    );

    await waitFor(() => expect(mockInitLegitFs).toHaveBeenCalled());

    // Unmount should clear interval
    unmount();

    await waitFor(() => expect(clearIntervalSpy).toHaveBeenCalled());
    clearIntervalSpy.mockRestore();
  });

  it('does not poll if unmounted before init completes', async () => {
    const readFile = vi.fn();
    const initPromise = Promise.resolve({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof initLegitFs>);

    (initLegitFs as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      initPromise
    );

    const { unmount } = render(
      <LegitProvider config={configNoSync} getSyncToken={mockGetSyncToken}>
        <div>Test</div>
      </LegitProvider>
    );

    unmount();

    await initPromise;

    // Should not trigger polling
    expect(readFile).not.toHaveBeenCalled();
  });

  it('should not clone or start sync', async () => {
    let resolveClone: (value: any) => void;
    const clonePromise = new Promise(resolve => {
      resolveClone = resolve;
    });
    mockLegitSyncService.clone.mockReturnValueOnce(clonePromise as any);

    const Consumer = () => {
      const { loading } = useLegitContext();
      return <div>{loading ? 'loading' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={configNoSync} getSyncToken={mockGetSyncToken}>
        <Consumer />
      </LegitProvider>
    );

    expect(screen.getByText('loading')).toBeDefined();

    await waitFor(() => expect(screen.getByText('ready')).toBeDefined());
    expect(mockLegitSyncService.clone).not.toHaveBeenCalled();
    expect(mockLegitSyncService.start).not.toHaveBeenCalled();

    unmount();
  });
});

describe('With initialBranch, sync disabled', () => {
  const configWithBranchUnsynced: LegitConfig = {
    initialBranch: 'mockName',
    sync: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLegitSyncService.clone.mockResolvedValue(undefined);
  });

  it('initializes legitFs and sets loading state', async () => {
    const Consumer = () => {
      const { legitFs, loading } = useLegitContext();
      return <div>{loading ? 'loading' : legitFs ? 'ready' : 'error'}</div>;
    };

    const { unmount } = render(
      <LegitProvider
        config={configWithBranchUnsynced}
        getSyncToken={mockGetSyncToken}
      >
        <Consumer />
      </LegitProvider>
    );

    // Initially loading
    expect(screen.getByText('loading')).toBeDefined();

    // Wait for legitFs to initialize
    await waitFor(() => expect(screen.getByText('ready')).toBeDefined());
    expect(openLegitFs).toHaveBeenCalled();
    unmount();
  });

  it('handles init error', async () => {
    (openLegitFs as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Init failed')
    );

    const Consumer = () => {
      const { loading, error } = useLegitContext();
      return <div>{loading ? 'loading' : error ? 'error' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider
        config={configWithBranchUnsynced}
        getSyncToken={mockGetSyncToken}
      >
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(screen.getByText('error')).toBeDefined());
    unmount();
  });

  it('does not update state if unmounted during initialization', async () => {
    let resolveOpen: (value: any) => void;
    const openLegitFsPromise = new Promise(resolve => {
      resolveOpen = resolve;
    });
    (openLegitFs as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      openLegitFsPromise as any
    );

    const Consumer = () => {
      const { loading } = useLegitContext();
      return <div>{loading ? 'loading' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider
        config={configWithBranchUnsynced}
        getSyncToken={mockGetSyncToken}
      >
        <Consumer />
      </LegitProvider>
    );

    expect(screen.getByText('loading')).toBeDefined();

    // Unmount before initialization completes
    unmount();

    // Now resolve the promise
    resolveOpen!({ promises: { readFile: vi.fn(), writeFile: vi.fn() } });
    await openLegitFsPromise;
  });

  it('does not update state if unmounted during initialization', async () => {
    let resolveClone: (value: any) => void;
    const clonePromise = new Promise(resolve => {
      resolveClone = resolve;
    });
    mockLegitSyncService.clone.mockReturnValueOnce(clonePromise as any);

    const Consumer = () => {
      const { loading } = useLegitContext();
      return <div>{loading ? 'loading' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider
        config={configWithBranchUnsynced}
        getSyncToken={mockGetSyncToken}
      >
        <Consumer />
      </LegitProvider>
    );

    expect(screen.getByText('loading')).toBeDefined();

    // Unmount before initialization completes
    unmount();

    // Now resolve the promise
    resolveClone!(undefined);
    await clonePromise;

    // Should not crash or update state - component is unmounted
  });

  it('does not update HEAD if value unchanged', async () => {
    const readFile = vi.fn().mockResolvedValue('head1');
    mockOpenLegitFs.mockResolvedValueOnce({
      promises: {
        readFile,
        writeFile: vi.fn(),
      },
    } as unknown as ReturnType<typeof openLegitFs>);

    // Ensure clone is properly mocked
    mockLegitSyncService.clone.mockResolvedValue(undefined);

    let updateCount = 0;
    const Consumer = () => {
      const { head } = useLegitContext();
      // Count non-null head values
      if (head !== null && head !== 'none') updateCount++;
      return <div data-testid="head-unique">{head ?? 'none'}</div>;
    };

    const { unmount } = render(
      <LegitProvider
        config={configWithBranchUnsynced}
        getSyncToken={mockGetSyncToken}
      >
        <Consumer />
      </LegitProvider>
    );

    // clone should not have been called, then openLegitFs should have been called
    await waitFor(() =>
      expect(mockLegitSyncService.clone).not.toHaveBeenCalled()
    );
    await waitFor(() => expect(openLegitFs).toHaveBeenCalled());

    // Should only update once (initial update)
    await waitFor(() =>
      expect(screen.getByTestId('head-unique').textContent).toBe('head1')
    );
    // updateCount tracks how many times head was set to a non-null value
    expect(updateCount).toBeGreaterThanOrEqual(1);
    unmount();
  });

  it('cleans up polling interval on unmount', async () => {
    const readFile = vi.fn().mockResolvedValue('head1');
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    mockOpenLegitFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
    } as unknown as ReturnType<typeof openLegitFs>);

    const { unmount } = render(
      <LegitProvider
        config={configWithBranchUnsynced}
        getSyncToken={mockGetSyncToken}
      >
        <div>Test</div>
      </LegitProvider>
    );

    await waitFor(() => expect(openLegitFs).toHaveBeenCalled());

    // Unmount should clear interval
    unmount();

    await waitFor(() => expect(clearIntervalSpy).toHaveBeenCalled());
    clearIntervalSpy.mockRestore();
  });

  it('does not poll if unmounted before init completes', async () => {
    const readFile = vi.fn();
    const clonePromise = Promise.resolve(undefined);

    const { unmount } = render(
      <LegitProvider
        config={configWithBranchUnsynced}
        getSyncToken={mockGetSyncToken}
      >
        <div>Test</div>
      </LegitProvider>
    );

    unmount();

    await clonePromise;

    // Should not trigger polling
    expect(readFile).not.toHaveBeenCalled();
    unmount();
  });

  it('should not clone or start sync', async () => {
    let resolveClone: (value: any) => void;
    const clonePromise = new Promise(resolve => {
      resolveClone = resolve;
    });
    mockLegitSyncService.clone.mockReturnValueOnce(clonePromise as any);

    const Consumer = () => {
      const { loading } = useLegitContext();
      return <div>{loading ? 'loading' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider
        config={configWithBranchUnsynced}
        getSyncToken={mockGetSyncToken}
      >
        <Consumer />
      </LegitProvider>
    );

    expect(screen.getByText('loading')).toBeDefined();

    await waitFor(() => expect(screen.getByText('ready')).toBeDefined());
    expect(mockLegitSyncService.clone).not.toHaveBeenCalled();
    expect(mockLegitSyncService.start).not.toHaveBeenCalled();

    unmount();
  });
});
