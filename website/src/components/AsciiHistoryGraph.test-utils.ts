import { HistoryItem, Branch } from './AsciiHistoryGraph';

/**
 * Creates a simple test case with a main branch and a feature branch
 * that forks from a specific commit on main
 */
export function createForkTestCase(
  mainCommits: number,
  featureCommits: number,
  forkFromCommitIndex: number = 1
): Branch[] {
  const baseTime = Date.now();
  const commits: HistoryItem[] = [];

  // Create main branch commits
  for (let i = 0; i < mainCommits; i++) {
    commits.push({
      oid: `main-${i}`,
      message: `Main commit ${i}`,
      parent: i === 0 ? [] : [`main-${i - 1}`],
      author: {
        name: 'Test',
        email: 'test@example.com',
        timestamp: baseTime + i * 1000,
      },
    });
  }

  // Create feature branch commits
  const forkCommitOid = `main-${forkFromCommitIndex}`;
  const featureCommitsList: HistoryItem[] = [];

  for (let i = 0; i < featureCommits; i++) {
    featureCommitsList.push({
      oid: `feature-${i}`,
      message: `Feature commit ${i}`,
      parent: i === 0 ? [forkCommitOid] : [`feature-${i - 1}`],
      author: {
        name: 'Test',
        email: 'test@example.com',
        timestamp: baseTime + mainCommits * 1000 + i * 1000,
      },
    });
  }

  return [
    {
      className: 'text-primary',
      entries: commits,
    },
    {
      className: 'text-gray-700',
      entries: featureCommitsList,
    },
  ];
}

/**
 * Creates the exact test case from the user's issue
 */
export function createUserTestCase(): Branch[] {
  return [
    {
      className: 'text-primary',
      entries: [
        {
          oid: '09179449d99a582ca84e3b9e3f905b35e64529f0',
          message: "💾 Change 'blogpost.md'\n",
          parent: ['042822522b7a7bc6887a4b63538491b01e8a4173'],
          author: {
            name: 'Local User',
            email: 'local@legitcontrol.com',
            timestamp: 1765882872,
          },
        },
        {
          oid: '042822522b7a7bc6887a4b63538491b01e8a4173',
          message: 'Initial commit\n',
          parent: [],
          author: {
            name: 'Test',
            email: 'test@example.com',
            timestamp: 1765882872,
          },
        },
      ],
    },
    {
      className: 'text-gray-700',
      entries: [
        {
          oid: '79924b1a89249e9535ec3de360e41a27bfe25827',
          message: "💾 Change 'blogpost.md'\n",
          parent: ['c4575090b8810fdffb2541c6d08ef7d3cd4a2468'],
          author: {
            name: 'Local User',
            email: 'local@legitcontrol.com',
            timestamp: 1765882882,
          },
        },
        {
          oid: 'c4575090b8810fdffb2541c6d08ef7d3cd4a2468',
          message: "💾 Change 'blogpost.md'\n",
          parent: ['e42c2892e61a6879b8116ec107c92bc98137bd63'],
          author: {
            name: 'Local User',
            email: 'local@legitcontrol.com',
            timestamp: 1765882880,
          },
        },
        {
          oid: 'e42c2892e61a6879b8116ec107c92bc98137bd63',
          message: "💾 Change 'blogpost.md'\n",
          parent: ['09179449d99a582ca84e3b9e3f905b35e64529f0'],
          author: {
            name: 'Local User',
            email: 'local@legitcontrol.com',
            timestamp: 1765882878,
          },
        },
      ],
    },
  ];
}

/**
 * Validates that a fork symbol exists at the expected location
 * This is a helper for debugging - it checks the expected fork location
 */
export function getExpectedForkLocation(
  branches: Branch[]
): { row: number; col: number } | null {
  if (branches.length < 2) return null;

  const mainBranch = branches[0];
  const featureBranch = branches[1];

  if (featureBranch.entries.length === 0) return null;

  const firstFeatureCommit = featureBranch.entries[0];
  const parentOid = firstFeatureCommit.parent[0];

  if (!parentOid) return null;

  // Find the parent commit in main branch
  const parentIndex = mainBranch.entries.findIndex(c => c.oid === parentOid);
  if (parentIndex === -1) return null;

  // The fork symbol should be at (parentRow, featureBranchCol)
  // Since rows are assigned chronologically, we need to count commits
  // For simplicity, assume parent is at index in main branch
  return {
    row: mainBranch.entries.length - 1 - parentIndex, // Reverse order
    col: 1, // Feature branch is column 1
  };
}
