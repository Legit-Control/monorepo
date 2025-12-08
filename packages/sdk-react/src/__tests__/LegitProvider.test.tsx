import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockOpenLegitFsWithMemoryFs } from '../__mocks__/mockLegitFs';
import { mockConfig } from '../__mocks__/mockConfig';
import { mockCreateLegitSyncService } from '../__mocks__/mockCreateLegitSyncService';

// mock the sdk
vi.mock('@legit-sdk/core', () => ({
  createLegitSyncService: mockCreateLegitSyncService,
  openLegitFsWithMemoryFs: mockOpenLegitFsWithMemoryFs,
}));

import { LegitProvider, useLegitContext } from '../LegitProvider';
import { openLegitFsWithMemoryFs } from '@legit-sdk/core';
import { useEffect, useState } from 'react';

describe('Initializes legitFs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('minimal initialization and sets loading state', async () => {
    const Consumer = () => {
      const { legitFs, loading } = useLegitContext();
      return <div>{loading ? 'loading' : legitFs ? 'ready' : 'error'}</div>;
    };

    // track setInterval calls in Provider
    const setIntervalSpy = vi.spyOn(global, 'setInterval');

    const { unmount } = render(
      <LegitProvider>
        <Consumer />
      </LegitProvider>
    );

    // Initially loading
    expect(screen.getByText('loading')).toBeDefined();

    // Wait for legitFs to initialize
    await waitFor(() => expect(screen.getByText('ready')).toBeDefined());
    expect(openLegitFsWithMemoryFs).toHaveBeenCalled();
    expect(setIntervalSpy).toHaveBeenCalled();
    unmount();
  });

  it('returns error if openLegitFs fails', async () => {
    (
      openLegitFsWithMemoryFs as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error('Init failed'));

    const Consumer = () => {
      const { error } = useLegitContext();
      return <div>{error ? 'error' : 'ready'}</div>;
    };

    const { unmount } = render(
      <LegitProvider config={mockConfig}>
        <Consumer />
      </LegitProvider>
    );

    await waitFor(() => expect(screen.getByText('error')).toBeDefined());
    unmount();
  });
});

describe('polls HEAD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates HEAD only when it changes', async () => {
    const Consumer = () => {
      const { loading, head } = useLegitContext();
      const [headChangesCount, setHeadChangesCount] = useState(0);

      useEffect(() => {
        if (head !== null) {
          setHeadChangesCount(headChangesCount + 1);
        }
      }, [head]);

      return (
        <div>
          {loading ? 'loading' : <div data-testid="head-id">{head}</div>}
          <div data-testid="head-changes-count">{headChangesCount}</div>
        </div>
      );
    };

    // mock the readFile method with a counter,
    // when it has been called for the 4th time change the returned string
    // then for the 10th time change it again.
    // after the 10th time, the returned string should be 'head3'.

    let counter = 0;
    const readFile = vi.fn().mockImplementation((p: string) => {
      counter++;
      if (p.endsWith('/.legit/head')) {
        if (counter < 4) {
          return Promise.resolve('head1');
        } else if (counter < 10) {
          return Promise.resolve('head2');
        } else {
          return Promise.resolve('head3');
        }
      }
      return Promise.resolve('');
    });

    // mock the getCurrentBranch method
    const getCurrentBranch = vi.fn().mockResolvedValue('anonymous');
    mockOpenLegitFsWithMemoryFs.mockResolvedValueOnce({
      promises: { readFile, writeFile: vi.fn() },
      getCurrentBranch,
    } as unknown as ReturnType<typeof openLegitFsWithMemoryFs>);

    const { unmount } = render(
      <LegitProvider config={mockConfig}>
        <Consumer />
      </LegitProvider>
    );

    // The head from the useLegitContext should be 'head1' after initial render
    await waitFor(() =>
      expect(screen.getByTestId('head-id').textContent).toBe('head1')
    );
    // then it should be 'head2' after the 4th call
    await waitFor(() =>
      expect(screen.getByTestId('head-id').textContent).toBe('head2')
    );
    // then it should be 'head3' after the 10th call
    await waitFor(() =>
      expect(screen.getByTestId('head-id').textContent).toBe('head3')
    );

    // expect the head changes count to be 3
    await waitFor(() =>
      expect(screen.getByTestId('head-changes-count').textContent).toBe('3')
    );

    unmount();
  });
});

describe.todo('rollback to commit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
});
