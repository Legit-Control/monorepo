import { vi } from 'vitest';

export const mockLegitSyncService = {
  clone: vi.fn().mockResolvedValue(undefined),
  start: vi.fn(),
  stop: vi.fn(),
};

export const mockCreateLegitSyncService = vi
  .fn()
  .mockReturnValue(mockLegitSyncService);
