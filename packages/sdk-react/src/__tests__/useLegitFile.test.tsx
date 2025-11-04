import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockLegitFs } from '../__mocks__/mockLegitFs';

vi.mock('@legit-sdk/core', () => ({
  initLegitFs: vi.fn().mockResolvedValue(mockLegitFs),
}));

import { LegitProvider } from '../LegitProvider';
import { act, renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { useLegitFile } from '../useLegitFile';

describe('useLegitFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLegitFs.promises.readFile.mockImplementation((p: string) => {
      if (p.endsWith('/.legit/history')) {
        return Promise.resolve(JSON.stringify([{ oid: '1' }]));
      }
      return Promise.resolve('initial text');
    });
  });

  it('returns content and history', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LegitProvider>{children}</LegitProvider>
    );
    const hookReturn = renderHook(() => useLegitFile('/file.txt'), { wrapper });
    const { result, unmount } = hookReturn;
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.content).toBe('initial text');
    });

    expect(result.current.history).toEqual([{ oid: '1' }]);

    // setContent updates content
    await act(async () => result.current.setContent('new text'));
    expect(mockLegitFs.promises.writeFile).toHaveBeenCalled();
    expect(result.current.content).toBe('new text');

    // getPastState returns content and uses commit path
    mockLegitFs.promises.readFile.mockResolvedValueOnce('old commit');
    const past = await result.current.getPastState('oldHash');
    expect(past).toBe('old commit');

    // verify save writes correct path
    expect(mockLegitFs.promises.writeFile).toHaveBeenCalledWith(
      '/.legit/branches/main/file.txt',
      'new text',
      'utf8'
    );

    // unmount to stop polling
    unmount();
  });

  it('defaults to empty content/history when reads fail (ENOENT-safe)', async () => {
    // make both reads fail
    mockLegitFs.promises.readFile.mockRejectedValueOnce(
      new Error('missing content')
    );
    mockLegitFs.promises.readFile.mockRejectedValueOnce(
      new Error('missing history')
    );
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LegitProvider>{children}</LegitProvider>
    );
    const { result } = renderHook(() => useLegitFile('/file.txt'), { wrapper });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.content).toBe('');
      expect(result.current.history).toEqual([]);
      expect(result.current.error).toBeUndefined();
    });
  });
});
