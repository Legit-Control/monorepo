'use client';

import type { ClientLegitFsContext } from './fs';

type CommitHistoryEntry = {
  oid: string;
  message: string;
  committer?: {
    timestamp: number;
    timezoneOffset?: number;
    name?: string;
    email?: string;
  };
  author?: {
    name?: string;
    email?: string;
  };
  parent?: string[];
};

export type AuditChange = {
  field: string;
  from: unknown;
  to: unknown;
};

export type SimplifiedMessage = {
  id?: string;
  role?: string;
  text?: string | null;
};

export type AuditEntry = {
  oid: string;
  message: string;
  committedAt: string | null;
  formChanges: AuditChange[];
  newMessages: SimplifiedMessage[];
};

function buildCommitPath(oid: string, relativePath: string) {
  const dir = oid.slice(0, 2);
  const rest = oid.slice(2);
  return `/.legit/commits/${dir}/${rest}/${relativePath}`;
}

export function computeChanges(
  previous: Record<string, unknown> | null,
  current: Record<string, unknown> | null
): AuditChange[] {
  if (!current && !previous) {
    return [];
  }

  const changeList: AuditChange[] = [];
  const keys = new Set<string>([
    ...(previous ? Object.keys(previous) : []),
    ...(current ? Object.keys(current) : []),
  ]);

  for (const key of keys) {
    const prevValue = previous ? previous[key] : undefined;
    const currValue = current ? current[key] : undefined;

    const areEqual =
      prevValue === currValue ||
      JSON.stringify(prevValue) === JSON.stringify(currValue);

    if (!areEqual) {
      changeList.push({
        field: key,
        from: prevValue ?? null,
        to: currValue ?? null,
      });
    }
  }

  return changeList;
}

function summarizeMessage(message: unknown): SimplifiedMessage {
  if (!message || typeof message !== 'object') {
    return {};
  }

  const {
    id,
    role,
    parts,
    text,
    content,
  } = message as {
    id?: string;
    role?: string;
    parts?: Array<{ type: string; text?: string }>;
    text?: string;
    content?: string | Array<{ type: string; text?: string }>;
  };

  let textValue: string | null = null;

  if (typeof text === 'string' && text.length > 0) {
    textValue = text;
  } else if (typeof content === 'string' && content.length > 0) {
    textValue = content;
  } else if (
    Array.isArray(content) &&
    content.every(item => item && typeof item === 'object')
  ) {
    const contentParts = content
      .filter(item => item.type === 'text' && typeof item.text === 'string')
      .map(item => item.text as string);
    if (contentParts.length > 0) {
      textValue = contentParts.join('\n');
    }
  } else if (Array.isArray(parts)) {
    const textParts = parts
      .filter(part => part && typeof part === 'object' && part.type === 'text')
      .map(part => part.text ?? '')
      .filter(Boolean);

    if (textParts.length > 0) {
      textValue = textParts.join('\n');
    }
  }

  return {
    id,
    role,
    text: textValue,
  };
}

function messagesEqual(
  previous: SimplifiedMessage | undefined,
  current: SimplifiedMessage | undefined
) {
  if (!previous && !current) {
    return true;
  }

  if (!previous || !current) {
    return false;
  }

  const previousText = (previous.text ?? '').trim();
  const currentText = (current.text ?? '').trim();
  const previousRole = previous.role ?? '';
  const currentRole = current.role ?? '';

  if (previousText === currentText && previousRole === currentRole) {
    return true;
  }

  if (
    previous.id &&
    current.id &&
    previous.id === current.id &&
    previousRole === currentRole &&
    previousText === currentText
  ) {
    return true;
  }

  return false;
}

function extractNewMessages(
  previousSummaries: SimplifiedMessage[],
  current: unknown
): { summaries: SimplifiedMessage[]; newMessages: SimplifiedMessage[] } {
  if (!Array.isArray(current)) {
    return { summaries: [], newMessages: [] };
  }

  const currentSummaries = current.map(item => summarizeMessage(item));
  const maxSharedLength = Math.min(
    previousSummaries.length,
    currentSummaries.length
  );

  let firstDifferenceIndex = currentSummaries.length;

  for (let index = 0; index < maxSharedLength; index += 1) {
    if (!messagesEqual(previousSummaries[index], currentSummaries[index])) {
      firstDifferenceIndex = index;
      break;
    }
  }

  if (
    firstDifferenceIndex === currentSummaries.length &&
    currentSummaries.length === previousSummaries.length
  ) {
    return { summaries: currentSummaries, newMessages: [] };
  }

  if (firstDifferenceIndex === currentSummaries.length) {
    firstDifferenceIndex = previousSummaries.length;
  }

  const newMessages = currentSummaries
    .slice(firstDifferenceIndex)
    .filter(message => {
      const text = (message.text ?? '').trim();
      return text.length > 0;
    });

  return {
    summaries: currentSummaries,
    newMessages,
  };
}

async function readJsonFile<T>(
  legitFsContext: ClientLegitFsContext,
  path: string
): Promise<T | null> {
  const { legitFs } = legitFsContext;

  try {
    const raw = await legitFs.promises.readFile(path, 'utf8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to read ${path}`, error);
    return null;
  }
}

export async function loadAuditTrail(
  context: ClientLegitFsContext
): Promise<AuditEntry[]> {
  const { legitFs } = context;

  let rawHistory: string;

  try {
    rawHistory = await legitFs.promises.readFile(
      '/.legit/branches/main/.legit/history',
      'utf8'
    );
  } catch {
    return [];
  }

  const commits = JSON.parse(rawHistory) as CommitHistoryEntry[];

  const auditTrail: AuditEntry[] = [];
  let previousForms: Record<string, unknown> | null = null;
  let previousMessageSummaries: SimplifiedMessage[] = [];

  for (let i = commits.length - 1; i >= 0; i -= 1) {
    const entry = commits[i];

    const formsState = await readJsonFile<Record<string, unknown>>(
      context,
      buildCommitPath(entry.oid, 'forms.json')
    );

    const messagesState = await readJsonFile<unknown[]>(
      context,
      buildCommitPath(entry.oid, 'messages.json')
    );

    const formChanges = computeChanges(previousForms, formsState);

    const { summaries, newMessages } = extractNewMessages(
      previousMessageSummaries,
      messagesState
    );

    const committedAt = entry.committer
      ? new Date(entry.committer.timestamp * 1000).toISOString()
      : null;

    auditTrail.push({
      oid: entry.oid,
      message: entry.message,
      committedAt,
      formChanges,
      newMessages,
    });

    previousForms = formsState;
    previousMessageSummaries = summaries;
  }

  auditTrail.reverse();

  return auditTrail;
}

export async function loadCommitSnapshot(
  context: ClientLegitFsContext,
  oid: string
) {
  const forms = await readJsonFile<Record<string, unknown>>(
    context,
    buildCommitPath(oid, 'forms.json')
  );
  const messages = await readJsonFile<unknown[]>(
    context,
    buildCommitPath(oid, 'messages.json')
  );

  return {
    forms,
    messages,
  };
}

