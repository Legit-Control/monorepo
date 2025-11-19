import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

import { type LegitFsInstance } from './types';
import { getLegitFs, readOperationHistory, readPastState } from './storage';

export const DEFAULT_THREAD_ID = 'main';
export const BRANCH_ROOT = '/.legit/branches';
export const COMMIT_ROOT = '/.legit/commits';

const resolveThreadPath = (path: string): string => {
  if (path.startsWith('/')) {
    path = path.slice(1);
  }
  return `${BRANCH_ROOT}/${DEFAULT_THREAD_ID}/${path}`;
};

type SaveDataFn = (
  path: string,
  data: Parameters<LegitFsInstance['promises']['writeFile']>[1]
) => Promise<void>;

type GetMessageDiffFn = (messageId: string) => Promise<
  | {
      newOid: string;
      oldOid: string;
    }
  | undefined
>;

type GetPastStateFn = (
  oid: string,
  pathToFile: string
) => Promise<string | undefined>;

type LegitFsContextValue = {
  legitFs: LegitFsInstance | null;
  loading: boolean;
  error: Error | null;
  saveData: SaveDataFn;
  getMessageDiff: GetMessageDiffFn;
  getPastState: GetPastStateFn;
  threadId: string;
  resolvePath: (path: string) => string;
};

const normalizeError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error ?? 'Unknown error'));

const LegitFsContext = createContext<LegitFsContextValue | undefined>(
  undefined
);

export function LegitFsProvider({ children }: { children: ReactNode }) {
  const [legitFs, setLegitFs] = useState<LegitFsInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const legitFs = await getLegitFs();
        if (!cancelled) {
          setLegitFs(legitFs);
          setError(null);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          const err = normalizeError(error);
          setLegitFs(null);
          setError(err);
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setError(null);
    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const saveData = useCallback<SaveDataFn>(
    async (path, data) => {
      if (legitFs) {
        const targetPath = resolveThreadPath(path);
        await legitFs.promises.writeFile(targetPath, data);
      }
    },
    [legitFs]
  );

  const getMessageDiff = useCallback<GetMessageDiffFn>(
    async messageId => {
      if (legitFs) {
        // get the operation history
        const operationHistory = await readOperationHistory(DEFAULT_THREAD_ID);
        if (!operationHistory) return;

        // get the operation item and the last operation item
        const operationItem = operationHistory.find(
          item => item.oid === messageId
        );
        const lastOperationItem = operationHistory.find(
          item => item.oid === operationItem?.parentOids[0]
        );
        if (!operationItem || !lastOperationItem) return;

        // get the operation branch parent oid and the last operation branch parent oid
        const operationBranchParentOid = operationItem?.parentOids[1];
        const lastOperationBranchParentOid = lastOperationItem?.originBranchOid;
        if (!operationBranchParentOid || !lastOperationBranchParentOid) return;

        return {
          newOid: operationBranchParentOid,
          oldOid: lastOperationBranchParentOid,
        };
      }
    },
    [legitFs]
  );

  const getPastState = useCallback<GetPastStateFn>(
    async (oid, pathToFile) => {
      if (legitFs) {
        return await readPastState(oid, pathToFile);
      }
    },
    [legitFs]
  );

  const value = useMemo<LegitFsContextValue>(
    () => ({
      legitFs,
      loading,
      error,
      saveData,
      getMessageDiff,
      getPastState,
      threadId: DEFAULT_THREAD_ID,
      resolvePath: resolveThreadPath,
    }),
    [legitFs, loading, error, saveData]
  );

  return (
    <LegitFsContext.Provider value={value}>{children}</LegitFsContext.Provider>
  );
}

export function useLegitFs(): LegitFsContextValue {
  const context = useContext(LegitFsContext);

  if (context === undefined) {
    throw new Error('useLegitFs must be used within a LegitFsProvider');
  }

  return context;
}
