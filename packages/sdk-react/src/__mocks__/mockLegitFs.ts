import { vi } from 'vitest';

export const mockLegitFs = {
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
};

export const mockedInitLegitFs = vi.fn().mockResolvedValue(mockLegitFs);
