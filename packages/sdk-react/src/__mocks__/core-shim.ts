// Minimal shim for tests so Vite can resolve '@legit-sdk/core'.
// All usages are mocked in tests via vi.mock.

export const initLegitFs = () => {
  throw new Error('initLegitFs should be mocked in tests');
};

export type HistoryItem = any;
