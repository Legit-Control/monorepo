import { initLegitFs, Operation } from '@legit-sdk/core';
import memfs from 'memfs';
import { LegitFsInstance } from './types';
import { BRANCH_ROOT, COMMIT_ROOT } from './LegitFsProvider';

let legitFsPromise: Promise<LegitFsInstance> | null = null;

export async function getLegitFs(): Promise<LegitFsInstance> {
  if (!legitFsPromise) {
    legitFsPromise = initLegitFs(
      memfs as unknown as ReturnType<typeof initLegitFs>,
      '/'
    );
    if (window) {
      (window as any).legitFs = await legitFsPromise;
    }
  }
  return legitFsPromise;
}

export async function listBranches(): Promise<string[]> {
  const fs = await getLegitFs();
  try {
    const branches = await fs.promises.readdir(BRANCH_ROOT);
    return branches.filter(name => !name.startsWith('.'));
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') {
      await fs.promises.mkdir(BRANCH_ROOT, { recursive: true });
      return [];
    }
    throw error;
  }
}

export async function readJson<T>(path: string, defaultValue: T): Promise<T> {
  const fs = await getLegitFs();
  try {
    const content = await fs.promises.readFile(path, 'utf8');
    return JSON.parse(content) as T;
  } catch (error) {
    // TODO: improve this error, it has no code
    if ((error as { message?: string }).message?.includes('ENOENT')) {
      await writeJson(path, defaultValue);
      return defaultValue;
    }
    throw error;
  }
}

export async function writeJson(path: string, data: unknown): Promise<void> {
  try {
    const fs = await getLegitFs();
    await fs.promises.writeFile(path, JSON.stringify(data), 'utf8');
  } catch (error) {
    console.error('Error writing JSON to path:', path, error);
    throw error;
  }
}

export async function readHead(threadId: string): Promise<string> {
  try {
    const fs = await getLegitFs();
    const head = await fs.promises.readFile(
      `${BRANCH_ROOT}/${threadId}/.legit/head`,
      'utf8'
    );
    return head;
  } catch (error) {
    console.error('Error reading head from path:', threadId, error);
    throw error;
  }
}

export async function writeOperation(
  threadId: string,
  content: string
): Promise<void> {
  try {
    const fs = await getLegitFs();
    await fs.promises.writeFile(
      `${BRANCH_ROOT}/${threadId}/.legit/operation`,
      content,
      'utf8'
    );
  } catch (error) {
    console.error('Error writing operation to path:', threadId, error);
    throw error;
  }
}

export async function readOperationHistory(
  threadId: string
): Promise<Operation[]> {
  try {
    const fs = await getLegitFs();
    const operationHistory = await fs.promises.readFile(
      `${BRANCH_ROOT}/${threadId}/.legit/operationHistory`,
      'utf8'
    );
    return operationHistory.length > 0
      ? JSON.parse(operationHistory)
      : JSON.parse('[]');
  } catch (error) {
    console.error(
      'Error reading operation history from path:',
      threadId,
      error
    );
    throw error;
  }
}

export async function readPastState(
  oid: string,
  pathToFile: string
): Promise<string> {
  try {
    if (pathToFile.startsWith('/')) pathToFile = pathToFile.slice(1);

    const fs = await getLegitFs();
    const path = `${COMMIT_ROOT}/${oid.slice(0, 2)}/${oid.slice(2)}/${pathToFile}`;
    return await fs.promises.readFile(path, 'utf8');
  } catch (error) {
    console.error('Error reading past state from path:', oid, error);
    throw error;
  }
}
