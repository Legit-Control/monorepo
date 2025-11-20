import { vi } from 'vitest';

export const mockCreateLegitSyncService = {
  start: vi.fn(),
};

export const mockedCreateLegitSyncService = vi
  .fn()
  .mockReturnValue(mockCreateLegitSyncService);
