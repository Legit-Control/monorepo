"use client";

import { useState, useMemo } from "react";
import AsciiHistoryGraph, { HistoryItem, Branch } from "@/components/AsciiHistoryGraph";
import Font from "@/components/Font";
import PageGrid from "@/components/Grid";
import SmallGrid from "@/components/SmallGrid";

// Generate demo data with a realistic Git history scenario
function generateDemoData() {
  const baseTime = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
  const dayInMs = 24 * 60 * 60 * 1000;

  // Main branch commits
  const commitA: HistoryItem = {
    oid: "a1b2c3d4e5f6",
    message: "Initial commit",
    parent: [],
    author: {
      name: "Alice Developer",
      email: "alice@example.com",
      timestamp: baseTime,
    },
  };

  const commitB: HistoryItem = {
    oid: "b2c3d4e5f6a1",
    message: "Add user authentication",
    parent: [commitA.oid],
    author: {
      name: "Alice Developer",
      email: "alice@example.com",
      timestamp: baseTime + dayInMs,
    },
  };

  const commitC: HistoryItem = {
    oid: "c3d4e5f6a1b2",
    message: "Implement file upload feature",
    parent: [commitB.oid],
    author: {
      name: "Bob Engineer",
      email: "bob@example.com",
      timestamp: baseTime + 2 * dayInMs,
    },
  };

  // Branch 1: Feature branch that forks from B
  const commitE: HistoryItem = {
    oid: "e5f6a1b2c3d4",
    message: "Start working on new dashboard",
    parent: [commitB.oid],
    author: {
      name: "Charlie Designer",
      email: "charlie@example.com",
      timestamp: baseTime + 2 * dayInMs + 3600000, // 1 hour after commitC
    },
  };

  const commitF: HistoryItem = {
    oid: "f6a1b2c3d4e5",
    message: "Complete dashboard UI",
    parent: [commitE.oid],
    author: {
      name: "Charlie Designer",
      email: "charlie@example.com",
      timestamp: baseTime + 3 * dayInMs,
    },
  };

  const commitD: HistoryItem = {
    oid: "d4e5f6a1b2c3",
    message: "Merge feature branch and fix conflicts",
    parent: [commitC.oid, commitF.oid], // Merge commit
    author: {
      name: "Alice Developer",
      email: "alice@example.com",
      timestamp: baseTime + 5 * dayInMs,
    },
  };

  // Branch 2: Hotfix branch that forks from A
  const commitG: HistoryItem = {
    oid: "g7h8i9j0k1l2",
    message: "Fix critical security bug",
    parent: [commitA.oid],
    author: {
      name: "David Security",
      email: "david@example.com",
      timestamp: baseTime + 1 * dayInMs + 7200000, // 2 hours after commitB
    },
  };

  const commitH: HistoryItem = {
    oid: "h8i9j0k1l2m3",
    message: "Add security patch tests",
    parent: [commitG.oid],
    author: {
      name: "David Security",
      email: "david@example.com",
      timestamp: baseTime + 1 * dayInMs + 10800000, // 3 hours after commitB
    },
  };

  const commitI: HistoryItem = {
    oid: "h8i9j0k1sdf3",
    message: "Merge hotfix branch and fix conflicts",
    parent: [commitD.oid, commitH.oid],
    author: {
      name: "Alice Developer",
      email: "alice@example.com",
      timestamp: baseTime + 1 * dayInMs + 11000000, // 3 hours after commitB
    },
  };

  // Note: commitD references commitF before it's defined, so we need to fix this
  // Let's reorder to fix the reference
  const mainHistory: HistoryItem[] = [commitA, commitB, commitC, commitD, commitI];
  const branch1: HistoryItem[] = [commitE, commitF];
  const branch2: HistoryItem[] = [commitG, commitH];

  // Convert to new Branch structure
  const branches: Branch[] = [
    {
      className: "text-primary", // Main branch styling
      entries: mainHistory,
    },
    {
      className: "text-gray-700", // Feature branch styling
      entries: branch1,
    },
    {
      className: "text-gray-400", // Hotfix branch styling
      entries: branch2,
    },
  ];

  return {
    branches,
  };
}

const TestGraphPage = () => {
  const { branches } = generateDemoData();
  
  // Get all commits in chronological order
  const allCommits = useMemo(() => {
    const commits: HistoryItem[] = branches.flatMap((branch) => branch.entries);
    return commits.sort((a, b) => a.author.timestamp - b.author.timestamp);
  }, [branches]);

  // Build a map of all commits for quick lookup
  const allCommitsMap = useMemo(() => {
    const map = new Map<string, HistoryItem>();
    allCommits.forEach((commit) => {
      map.set(commit.oid, commit);
    });
    return map;
  }, [allCommits]);
  
  // Track which commits have been revealed
  const [revealedCommitOids, setRevealedCommitOids] = useState<Set<string>>(new Set());
  
  // Function to recursively reveal a commit and all its ancestors
  const revealCommitAndAncestors = (commitOid: string, revealed: Set<string>) => {
    if (revealed.has(commitOid)) return;
    
    const commit = allCommitsMap.get(commitOid);
    if (!commit) return;
    
    // First reveal all parents
    commit.parent.forEach((parentOid) => {
      revealCommitAndAncestors(parentOid, revealed);
    });
    
    // Then reveal this commit
    revealed.add(commitOid);
  };
  
  // Filter commits to only show revealed ones, maintaining branch structure with styling
  const filteredBranches = useMemo(() => {
    // Always maintain the same number of branches, even if empty, preserving className
    return branches.map((branch) => ({
      className: branch.className,
      entries: branch.entries.filter((commit) => revealedCommitOids.has(commit.oid)),
    }));
  }, [branches, revealedCommitOids]);
  
  // Find the next commit to reveal (chronologically, but ensure parents are revealed)
  const nextCommitToReveal = useMemo(() => {
    for (const commit of allCommits) {
      if (!revealedCommitOids.has(commit.oid)) {
        // Check if all parents are revealed (or commit has no parents)
        const allParentsRevealed = commit.parent.every((parentOid) => 
          revealedCommitOids.has(parentOid) || !allCommitsMap.has(parentOid)
        );
        if (allParentsRevealed) {
          return commit;
        }
      }
    }
    return null;
  }, [allCommits, revealedCommitOids, allCommitsMap]);
  
  // Check if we can reveal more commits
  const canRevealMore = nextCommitToReveal !== null;
  
  // Function to reveal the next commit
  const revealNextCommit = () => {
    if (nextCommitToReveal) {
      setRevealedCommitOids((prev) => {
        const next = new Set(prev);
        // Reveal this commit and all its ancestors (though ancestors should already be revealed)
        revealCommitAndAncestors(nextCommitToReveal.oid, next);
        return next;
      });
    }
  };
  
  // Function to reset (hide all commits)
  const reset = () => {
    setRevealedCommitOids(new Set());
  };

  return (
    <PageGrid>
      <SmallGrid className="pt-16">
        <Font type="h1" className="col-span-12 lg:col-span-10 lg:col-start-2 mb-4">
          History Graph Test
        </Font>
        
        <Font type="p" className="text-zinc-500 col-span-12 lg:col-span-10 lg:col-start-2 mb-8">
          This page demonstrates the AsciiHistoryGraph component with demo data.
          The graph shows a main branch with two feature branches that fork and merge.
          Click the button below to reveal commits one at a time chronologically.
        </Font>

        <div className="col-span-12 lg:col-span-10 lg:col-start-2 mb-8">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 overflow-x-auto">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Font type="h3" className="mb-2">Commit History Graph</Font>
                <Font type="p" className="text-sm text-zinc-500">
                  Main branch (left) • Feature branch (middle) • Hotfix branch (right)
                </Font>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={revealNextCommit}
                  disabled={!canRevealMore}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
                >
                  {canRevealMore ? `Reveal Next Commit (${revealedCommitOids.size + 1}/${allCommits.length})` : "All Commits Revealed"}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
            {nextCommitToReveal && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Font type="p" className="text-sm">
                  <span className="font-semibold">Next commit:</span> {nextCommitToReveal.message} 
                  <span className="text-zinc-500 ml-2">({new Date(nextCommitToReveal.author.timestamp).toLocaleString()})</span>
                </Font>
              </div>
            )}
            {revealedCommitOids.size > 0 ? (
              <AsciiHistoryGraph branches={filteredBranches} />
            ) : (
              <div className="text-center py-12 text-zinc-400">
                Click &quot;Reveal Next Commit&quot; to start building the graph
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-10 lg:col-start-2 font-mono">
          <Font type="h3" className="mb-4">Demo Data Structure</Font>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <Font type="p" className="font-semibold mb-2">Main Branch:</Font>
                <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
                  {branches[0].entries.map((commit) => (
                    <li key={commit.oid}>
                      <code className="text-xs bg-white px-1 py-0.5 rounded">{commit.oid.slice(0, 7)}</code> - {commit.message}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Font type="p" className="font-semibold mb-2">Feature Branch (forks from commit B):</Font>
                <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
                  {branches[1].entries.map((commit) => (
                    <li key={commit.oid}>
                      <code className="text-xs bg-white px-1 py-0.5 rounded">{commit.oid.slice(0, 7)}</code> - {commit.message}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Font type="p" className="font-semibold mb-2">Hotfix Branch (forks from commit A):</Font>
                <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1">
                  {branches[2].entries.map((commit) => (
                    <li key={commit.oid}>
                      <code className="text-xs bg-white px-1 py-0.5 rounded">{commit.oid.slice(0, 7)}</code> - {commit.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SmallGrid>
    </PageGrid>
  );
};

export default TestGraphPage;

