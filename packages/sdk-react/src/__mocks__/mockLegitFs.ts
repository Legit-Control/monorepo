import { vi } from 'vitest';

export const mockedLegitFsWithMemoryFs = {
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
  getCurrentBranch: vi.fn().mockResolvedValue('anonymous'),
};

export const mockOpenLegitFsWithMemoryFs = vi
  .fn()
  .mockResolvedValue(mockedLegitFsWithMemoryFs);
