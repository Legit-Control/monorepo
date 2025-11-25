import { vi } from 'vitest';

export const mockedLegitFs = {
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
  defaultBranch: 'main',
};

export const mockInitLegitFs = vi.fn().mockResolvedValue(mockedLegitFs);
export const mockOpenLegitFs = vi.fn().mockResolvedValue(mockedLegitFs);
