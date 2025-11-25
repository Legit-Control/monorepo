import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { mockedLegitFs } from '../__mocks__/mockLegitFs';
import { mockCreateLegitSyncService } from '../__mocks__/mockCreateLegitSyncService';
import { mockConfig, mockGetSyncToken } from '../__mocks__/mockConfig';

vi.mock('@legit-sdk/core', () => ({
  initLegitFs: vi.fn().mockResolvedValue(mockedLegitFs),
  openLegitFs: vi.fn().mockResolvedValue(mockedLegitFs),
  createLegitSyncService: mockCreateLegitSyncService,
}));

import { LegitProvider, useLegitContext } from '../LegitProvider';
import { initLegitFs } from '@legit-sdk/core';

describe('useLegitContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LegitProvider config={mockConfig} getSyncToken={mockGetSyncToken}>
      {children}
    </LegitProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockedLegitFs.promises.readFile.mockImplementation((p: string) => {
      if (p.endsWith('/.legit/history')) {
        return Promise.resolve(JSON.stringify([]));
      }
      if (p.endsWith('.legit/head')) {
        return Promise.resolve('commit-hash');
      }
      return Promise.resolve('text');
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('returns legitFs, loading, head, and error', async () => {
    const { result } = renderHook(() => useLegitContext(), { wrapper });
    await waitFor(() => {
      expect(result.current.legitFs).toBeDefined();
      expect(result.current.loading).toBe(false);
      expect(result.current.syncing).toBe(true);
      expect(result.current.head).toBeDefined();
      expect(result.current.branch).toBeDefined();
      expect(result.current.error).toBeUndefined();
    });
  });

  // TODO: make better tests for setBranch
  it('sets branch automatically and can be set manually', async () => {
    const { result } = renderHook(() => useLegitContext(), { wrapper });
    await waitFor(async () => {
      expect(result.current.branch).toBeDefined();
      await result.current.setBranch('test');
      expect(result.current.branch).toBe('test');
    });
  });

  // TODO: make better tests for rollback
  it('rolls back to a specific commit', async () => {
    const { result } = renderHook(() => useLegitContext(), { wrapper });
    await waitFor(async () => {
      expect(result.current.rollback).toBeDefined();
      await result.current.rollback('commit-hash');
      expect(result.current.head).toBe('commit-hash');
    });
  });
});
