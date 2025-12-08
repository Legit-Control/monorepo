// Minimal shim for tests so Vite can resolve '@legit-sdk/core'.
// All usages are mocked in tests via vi.mock.

export const openLegitFsWithMemoryFs = () => {
  throw new Error('openLegitFsWithMemoryFs should be mocked in tests');
};

export type HistoryItem = any;
