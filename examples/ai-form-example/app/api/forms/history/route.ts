import { NextResponse } from 'next/server';

import { getLegitFsContext } from '@/lib/server/legitFsContext';

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

type AuditChange = {
  field: string;
  from: unknown;
  to: unknown;
};

type AuditEntry = {
  oid: string;
  message: string;
  committedAt: string | null;
  formChanges: AuditChange[];
  newMessages: SimplifiedMessage[];
};

type SimplifiedMessage = {
  id?: string;
  role?: string;
  text?: string | null;
  metadata?: unknown;
};

function buildCommitPath(oid: string, relativePath: string) {
  const dir = oid.slice(0, 2);
  const rest = oid.slice(2);
  return `/.legit/commits/${dir}/${rest}/${relativePath}`;
}

function computeChanges(
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

  const { id, role, metadata, parts, text, content } = message as {
    id?: string;
    role?: string;
    metadata?: unknown;
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
    metadata,
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

export async function GET() {
  try {
    const { legitFs } = await getLegitFsContext();

    const rawHistory = await legitFs.promises.readFile(
      '/.legit/branches/main/.legit/history',
      'utf8'
    );

    const commits = JSON.parse(rawHistory) as CommitHistoryEntry[];

    const auditTrail: AuditEntry[] = [];
    let previousForms: Record<string, unknown> | null = null;
    let previousMessageSummaries: SimplifiedMessage[] = [];

    // Process from oldest to newest so we can diff in order
    for (let i = commits.length - 1; i >= 0; i -= 1) {
      const entry = commits[i];
      let formsState: Record<string, unknown> | null = null;
      let messagesState: unknown = null;

      try {
        const rawForms = await legitFs.promises.readFile(
          buildCommitPath(entry.oid, 'forms.json'),
          'utf8'
        );
        formsState = JSON.parse(rawForms);
      } catch (error) {
        // forms.json might not exist for this commit; ignore
        if (
          !(
            error instanceof Error &&
            'code' in error &&
            error.code === 'ENOENT'
          )
        ) {
          console.warn(
            `Failed to load forms.json for commit ${entry.oid}`,
            error
          );
        }
      }

      try {
        const rawMessages = await legitFs.promises.readFile(
          buildCommitPath(entry.oid, 'messages.json'),
          'utf8'
        );
        messagesState = JSON.parse(rawMessages);
      } catch (error) {
        if (
          !(
            error instanceof Error &&
            'code' in error &&
            error.code === 'ENOENT'
          )
        ) {
          console.warn(
            `Failed to load messages.json for commit ${entry.oid}`,
            error
          );
        }
      }

      const changes = computeChanges(previousForms, formsState);

      const committedAt = entry.committer
        ? new Date(entry.committer.timestamp * 1000).toISOString()
        : null;

      const { summaries, newMessages } = extractNewMessages(
        previousMessageSummaries,
        messagesState
      );

      auditTrail.push({
        oid: entry.oid,
        message: entry.message,
        committedAt,
        formChanges: changes,
        newMessages,
      });

      previousForms = formsState;
      previousMessageSummaries = summaries;
    }

    // Return newest first for convenience
    auditTrail.reverse();

    return NextResponse.json({
      auditTrail,
    });
  } catch (error) {
    console.error('Failed to load form history', error);
    return NextResponse.json(
      { error: 'Failed to load form history' },
      { status: 500 }
    );
  }
}
