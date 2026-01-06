import { ChevronDownIcon } from '@heroicons/react/16/solid';
import React, { ReactNode, useState } from 'react';

export type HistoryItem = {
  oid: string;
  message: string;
  parent: string[];
  author: { name: string; email: string; timestamp: number };
};

export type Branch = {
  className?: string;
  entries: HistoryItem[];
};

type Props = {
  branches: Branch[];
  collapsibleContent?: ReactNode;
  onCommitClick?: (commit: HistoryItem) => void;
};

interface Coordinate {
  row: number;
  col: number;
  isMerge?: boolean;
}

type BranchPath = Coordinate[];

/**
 * AsciiHistoryGraph - A React component that displays Git-style history graphs using ASCII characters.
 *
 * Based on GitGraph.js path-based rendering approach:
 * 1. Build branch paths (commits per branch in order)
 * 2. Calculate rows for all commits
 * 3. Smooth paths (add intermediate points where branches are active)
 * 4. Render based on smoothed paths
 */
export default function AsciiHistoryGraph({
  branches,
  collapsibleContent,
  onCommitClick,
}: Props) {
  const [openCommitOid, setOpenCommitOid] = useState<string | null>(null);
  const columns = branches.length;

  // Extract all commit arrays for processing
  const allCommitArrays = branches.map(branch => branch.entries);

  // Build a map of commits by oid for quick lookup
  const commitMap = new Map<string, HistoryItem>();
  allCommitArrays.flat().forEach(commit => {
    commitMap.set(commit.oid, commit);
  });

  // Determine which branch a commit setData to
  const branchOf = (oid: string): number => {
    for (let i = 0; i < allCommitArrays.length; i++) {
      if (allCommitArrays[i].some(c => c.oid === oid)) return i;
    }
    return 0;
  };

  // Step 1: Calculate rows for all commits (ensuring parents before children)
  const commitRows = new Map<string, number>();
  const allCommits = [...allCommitArrays.flat()];

  // Sort commits by timestamp first
  const sortedCommits = [...allCommits].sort(
    (a, b) => a.author.timestamp - b.author.timestamp
  );

  const processed = new Set<string>();
  const chronologicalRows: HistoryItem[] = [];

  const processCommit = (commit: HistoryItem) => {
    if (processed.has(commit.oid)) return;

    // Process all parents first
    commit.parent.forEach(parentOid => {
      const parentCommit = commitMap.get(parentOid);
      if (parentCommit && !processed.has(parentOid)) {
        processCommit(parentCommit);
      }
    });

    if (!processed.has(commit.oid)) {
      chronologicalRows.push(commit);
      processed.add(commit.oid);
    }
  };

  sortedCommits.forEach(commit => {
    if (!processed.has(commit.oid)) {
      processCommit(commit);
    }
  });

  // Assign row numbers
  chronologicalRows.forEach((commit, row) => {
    commitRows.set(commit.oid, row);
  });

  // Step 2: Build branch paths (similar to GitGraph's fromCommits)
  // Key: Connect first commit of branch to parent, and last commit to merge point
  const branchPaths = new Map<number, BranchPath>();

  chronologicalRows.forEach(commit => {
    const branchIdx = branchOf(commit.oid);
    const row = commitRows.get(commit.oid) ?? 0;
    const col = branchIdx;

    let existingPath = branchPaths.get(branchIdx);

    // If no existing path, this is the first commit in the branch
    // Start the path from the parent commit (connects fork point)
    if (!existingPath) {
      existingPath = [];
      const firstParent = commit.parent[0];
      if (firstParent) {
        const parentRow = commitRows.get(firstParent);
        const parentCol = branchOf(firstParent);
        if (parentRow !== undefined) {
          // Connect to parent commit - this creates the fork connection
          existingPath.push({ row: parentRow, col: parentCol });
        }
      }
    }

    // Add this commit to the path
    existingPath.push({ row, col });
    branchPaths.set(branchIdx, existingPath);
  });

  // Step 3: Add merge commit points and track merge connections
  // Map: mergedBranchIdx -> { mergeRow, mergeCol, lastCommitOid }
  const mergeInfo = new Map<
    number,
    { mergeRow: number; mergeCol: number; lastCommitOid: string }
  >();

  chronologicalRows.forEach(commit => {
    if (commit.parent.length > 1) {
      // This is a merge commit
      const mergeRow = commitRows.get(commit.oid) ?? 0;
      const mergeCol = branchOf(commit.oid); // The branch being merged INTO

      // Find the parent that's on a different branch (the branch being merged FROM)
      // This is parents[1] in GitGraph (second parent is the merged branch)
      const mergedParent = commit.parent.find(p => branchOf(p) !== mergeCol);
      if (mergedParent) {
        const mergedBranchIdx = branchOf(mergedParent);
        const existingPath = branchPaths.get(mergedBranchIdx);

        if (existingPath) {
          // Add merge commit point to the merged branch's path
          // This connects the last commit of the merged branch to the merge commit
          // The point is at the merge commit's position (row, col of merge commit)
          existingPath.push({ row: mergeRow, col: mergeCol, isMerge: true });
          branchPaths.set(mergedBranchIdx, existingPath);

          // Track merge info: key by branch index, store the last commit oid
          mergeInfo.set(mergedBranchIdx, {
            mergeRow,
            mergeCol,
            lastCommitOid: mergedParent,
          });
        }
      }
    }
  });

  // Step 4: Smooth branch paths (add intermediate points where branches are active)
  const smoothedPaths = new Map<number, BranchPath[]>();

  branchPaths.forEach((path, branchIdx) => {
    if (path.length <= 1) {
      smoothedPaths.set(branchIdx, [path]);
      return;
    }

    // Sort path by row (oldest first)
    const sortedPath = [...path].sort((a, b) => a.row - b.row);

    // Split path at merge points
    const subPaths: BranchPath[] = [];
    let currentSubPath: BranchPath = [];

    sortedPath.forEach((point, i) => {
      currentSubPath.push(point);

      if (point.isMerge || i === sortedPath.length - 1) {
        if (currentSubPath.length > 0) {
          subPaths.push(currentSubPath);
        }

        if (point.isMerge && i < sortedPath.length - 1) {
          // Start new subpath from the point before merge
          const prevPoint = sortedPath[i - 1];
          if (prevPoint && !prevPoint.isMerge) {
            currentSubPath = [{ ...prevPoint }];
          } else {
            currentSubPath = [];
          }
        } else {
          currentSubPath = [];
        }
      }
    });

    // Add intermediate points for each subpath
    const smoothed: BranchPath[] = [];
    subPaths.forEach(subPath => {
      if (subPath.length <= 1) {
        smoothed.push(subPath);
        return;
      }

      const firstPoint = subPath[0];
      const lastPoint = subPath[subPath.length - 1];
      const col =
        firstPoint.col === lastPoint.col ? firstPoint.col : lastPoint.col;

      // Add intermediate points for rows between first and last
      const intermediatePoints: Coordinate[] = [];
      const startRow = Math.min(firstPoint.row, lastPoint.row);
      const endRow = Math.max(firstPoint.row, lastPoint.row);

      for (let row = startRow + 1; row < endRow; row++) {
        // Check if there's already a commit at this row/col
        const hasCommit = chronologicalRows.some(c => {
          const cRow = commitRows.get(c.oid);
          const cCol = branchOf(c.oid);
          return cRow === row && cCol === col;
        });

        if (!hasCommit) {
          intermediatePoints.push({ row, col });
        }
      }

      smoothed.push([firstPoint, ...intermediatePoints, lastPoint]);
    });

    smoothedPaths.set(branchIdx, smoothed);
  });

  // Step 5: Build a map of what to render at each row/column
  const renderMap = new Map<string, string>(); // key: "row,col" -> symbol
  const mergeConnections = new Map<
    string,
    { mergedBranch: number; mergeCol: number }
  >(); // Track merge connections

  // Mark all commits
  chronologicalRows.forEach(commit => {
    const row = commitRows.get(commit.oid) ?? 0;
    const col = branchOf(commit.oid);
    const isMerge = commit.parent.length > 1;
    renderMap.set(`${row},${col}`, '●');

    // Track merge connections
    if (isMerge) {
      const mergedParent = commit.parent.find(p => branchOf(p) !== col);
      if (mergedParent) {
        const mergedBranchIdx = branchOf(mergedParent);
        mergeConnections.set(`${row},${mergedBranchIdx}`, {
          mergedBranch: mergedBranchIdx,
          mergeCol: col,
        });
      }
    }
  });

  // Store fork information to set after path processing (so it can't be overwritten)
  const forkInfo: Array<{ row: number; col: number; symbol: string }> = [];

  // Mark fork points directly from commits (before processing paths)
  // For each branch, find the chronologically first commit (oldest timestamp)
  // and check if it has a parent on a different branch
  allCommitArrays.forEach((branchCommits: HistoryItem[], branchIdx: number) => {
    if (branchCommits.length > 0) {
      // Find the chronologically first commit (oldest timestamp)
      // Commits in the array might not be in chronological order
      const firstCommit = branchCommits.reduce((oldest, commit) => {
        return commit.author.timestamp < oldest.author.timestamp
          ? commit
          : oldest;
      }, branchCommits[0]);

      const firstParent = firstCommit.parent[0];

      if (firstParent) {
        const parentBranchIdx = branchOf(firstParent);
        if (parentBranchIdx !== branchIdx) {
          // This branch forks from a different branch
          const parentRow = commitRows.get(firstParent);
          if (parentRow !== undefined) {
            // Store fork info to set after path processing
            const forkKey = `${parentRow},${branchIdx}`;
            if (!renderMap.has(forkKey) || renderMap.get(forkKey) !== '●') {
              if (branchIdx > parentBranchIdx) {
                // Branch forks to the right - draw curve going down: ─┘
                forkInfo.push({
                  row: parentRow,
                  col: branchIdx,
                  symbol: '─┘  ',
                });
              } else {
                // Branch forks to the left - draw curve going down: ─┐
                forkInfo.push({
                  row: parentRow,
                  col: branchIdx,
                  symbol: '─┐ ',
                });
              }
            }
          }
        }
      }
    }
  });

  // Add vertical lines for merged branches (after fork points, before path processing)
  // This ensures branches continue with vertical lines after their last commit until merge
  mergeInfo.forEach((info, mergedBranchIdx) => {
    const lastCommitOid = info.lastCommitOid;
    const lastCommitRow = commitRows.get(lastCommitOid);
    const mergeRow = info.mergeRow;

    if (lastCommitRow !== undefined) {
      // Add vertical lines from last commit up to merge (exclusive of merge row)
      // This shows the branch continuing even when there are commits on other branches
      if (lastCommitRow < mergeRow) {
        for (let row = lastCommitRow + 1; row < mergeRow; row++) {
          const verticalKey = `${row},${mergedBranchIdx}`;
          // Force set vertical line (only skip if it's a commit or fork symbol)
          const existing = renderMap.get(verticalKey);
          if (
            !existing ||
            (existing !== '●' &&
              !existing.includes('─') &&
              !existing.includes('┘') &&
              !existing.includes('┐'))
          ) {
            renderMap.set(verticalKey, '│');
          }
        }
      }
    }
  });

  // Mark branch paths (vertical lines, forks, and merges)
  smoothedPaths.forEach((subPaths, branchIdx) => {
    subPaths.forEach(subPath => {
      subPath.forEach((point, i) => {
        const key = `${point.row},${point.col}`;

        // Don't overwrite commits
        if (renderMap.has(key) && renderMap.get(key) === '●') {
          return;
        }

        // Don't overwrite fork symbols (check both renderMap and forkInfo)
        const existing = renderMap.get(key);
        if (
          existing &&
          (existing.includes('─') ||
            existing.includes('┘') ||
            existing.includes('┐'))
        ) {
          return;
        }

        // Also check if this location is a fork point (from forkInfo)
        const isForkPoint = forkInfo.some(
          f => f.row === point.row && f.col === point.col
        );
        if (isForkPoint) {
          return;
        }

        const prevPoint = i > 0 ? subPath[i - 1] : null;

        if (point.isMerge) {
          // Merge point - this is at the merge commit's row and column (point.row, point.col)
          // branchIdx is the merged branch (the branch being merged FROM)
          // point.col is the merge commit's column (the branch being merged INTO)

          // Draw the horizontal connection line at the merged branch's column
          // This shows the connection from the merged branch to the merge commit
          const mergedBranchKey = `${point.row},${branchIdx}`;
          // Force set the merge connection symbol (overwrite anything except commits and fork symbols)
          const existingMerge = renderMap.get(mergedBranchKey);
          if (
            !renderMap.has(mergedBranchKey) ||
            (renderMap.get(mergedBranchKey) !== '●' &&
              !(
                existingMerge &&
                (existingMerge.includes('─') ||
                  existingMerge.includes('┘') ||
                  existingMerge.includes('┐'))
              ))
          ) {
            // Always use ─┐ for merge connections (curves to the left)
            renderMap.set(mergedBranchKey, '─┐ ');
          }
        } else if (
          prevPoint &&
          prevPoint.col !== point.col &&
          point.col === branchIdx
        ) {
          // Branch continues after fork - point is on the new branch column
          // Draw vertical line
          renderMap.set(key, '│');
        } else if (point.col === branchIdx) {
          // Point is on this branch - draw vertical line
          renderMap.set(key, '│');
        }
      });
    });
  });

  // Add vertical lines for merged branches (AFTER path processing to ensure they're not overwritten)
  // This ensures branches continue with vertical lines after their last commit until merge
  // Also ensure merge connection symbols are set correctly
  mergeInfo.forEach((info, mergedBranchIdx) => {
    const lastCommitOid = info.lastCommitOid;
    const lastCommitRow = commitRows.get(lastCommitOid);
    const mergeRow = info.mergeRow;
    const mergeCol = info.mergeCol;

    if (lastCommitRow !== undefined) {
      // Add vertical lines from last commit up to merge (exclusive of merge row)
      // This shows the branch continuing even when there are commits on other branches
      if (lastCommitRow < mergeRow) {
        for (let row = lastCommitRow + 1; row < mergeRow; row++) {
          const verticalKey = `${row},${mergedBranchIdx}`;
          // Force set vertical line (only skip if it's a commit or fork symbol)
          const existing = renderMap.get(verticalKey);
          if (
            !existing ||
            (existing !== '●' &&
              !existing.includes('─') &&
              !existing.includes('┘') &&
              !existing.includes('┐'))
          ) {
            renderMap.set(verticalKey, '│');
          }
        }
      }

      // Ensure merge connection symbol is set at merge row
      const mergeConnectionKey = `${mergeRow},${mergedBranchIdx}`;
      const existing = renderMap.get(mergeConnectionKey);
      if (
        !existing ||
        (existing !== '●' &&
          !existing.includes('─') &&
          !existing.includes('┘') &&
          !existing.includes('┐'))
      ) {
        // Set the merge connection symbol based on branch positions
        if (mergedBranchIdx < mergeCol) {
          // Merged branch is to the left - draw horizontal line going right then down: ─┐
          renderMap.set(mergeConnectionKey, '─┐ ');
        } else {
          // Merged branch is to the right - draw horizontal line going left then down: ─┐
          // (The curve goes left from the merged branch to connect to merge commit)
          renderMap.set(mergeConnectionKey, '─┐ ');
        }
      }
    }
  });

  // Set fork symbols AFTER all path processing (so they can't be overwritten)
  // Always set fork symbols, even if there's already a vertical line or other symbol
  forkInfo.forEach(({ row, col, symbol }) => {
    const forkKey = `${row},${col}`;
    // Only skip if it's already a commit (fork symbol should never overwrite a commit)
    if (!renderMap.has(forkKey) || renderMap.get(forkKey) !== '●') {
      // Always set the fork symbol, overwriting any vertical lines or other symbols
      renderMap.set(forkKey, symbol);
    }
  });

  // Step 6: Render rows with slot-based layout
  const reversedRows = [...chronologicalRows].reverse();
  const slotWidth = 4; // Width of each column slot in characters

  // Helper to center a symbol in a slot
  const centerInSlot = (symbol: string, width: number = slotWidth): string => {
    const symbolWidth = symbol.length;
    const padding = Math.max(0, width - symbolWidth);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return ' '.repeat(leftPad) + symbol + ' '.repeat(rightPad);
  };

  return (
    <pre
      style={{
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.6',
        whiteSpace: 'pre',
      }}
    >
      {reversedRows.map(commit => {
        const originalRow = commitRows.get(commit.oid) ?? 0;
        const slots: string[] = [];

        for (let col = 0; col < columns; col++) {
          const key = `${originalRow},${col}`;

          // Check if this is a fork point first - if so, always render the fork symbol
          const isForkPoint = forkInfo.some(
            f => f.row === originalRow && f.col === col
          );
          if (isForkPoint) {
            const fork = forkInfo.find(
              f => f.row === originalRow && f.col === col
            );
            if (fork) {
              slots.push(centerInSlot(fork.symbol));
              continue;
            }
          }

          const symbol = renderMap.get(key);

          if (symbol) {
            slots.push(centerInSlot(symbol));
          } else {
            // Check if this branch is active at this row (has commits before and after)
            // A branch is active if it has path points before and after this row
            let isActive = false;

            smoothedPaths.forEach((subPaths, branchIdx) => {
              if (branchIdx === col) {
                // Check if this branch has points before and after this row
                const hasBefore = subPaths.some(subPath =>
                  subPath.some(p => p.row < originalRow)
                );
                const hasAfter = subPaths.some(subPath =>
                  subPath.some(p => p.row > originalRow)
                );
                if (hasBefore && hasAfter) {
                  isActive = true;
                }

                // Also check if this branch has a merge and we're between last commit and merge
                const mergeInfoForBranch = mergeInfo.get(branchIdx);
                if (mergeInfoForBranch) {
                  // Use the lastCommitOid from mergeInfo (the commit that gets merged)
                  const lastCommitRow = commitRows.get(
                    mergeInfoForBranch.lastCommitOid
                  );
                  if (lastCommitRow !== undefined) {
                    // If we're between the last commit and the merge, show vertical line
                    if (
                      originalRow > lastCommitRow &&
                      originalRow < mergeInfoForBranch.mergeRow
                    ) {
                      isActive = true;
                    }
                    // At the merge row, we should have a merge connection symbol, not a vertical line
                    // So don't set isActive here - the merge connection should already be in renderMap
                  }
                }
              } else {
                // Check if other branches connect through this column at this row
                // (for fork/merge connections)
                // BUT: Don't set isActive if there's already a fork symbol here
                const connectsHere = subPaths.some(subPath =>
                  subPath.some(p => p.row === originalRow && p.col === col)
                );
                if (connectsHere) {
                  // Double-check that we're not overwriting a fork symbol
                  const checkSymbol = renderMap.get(key);
                  const isForkPoint = forkInfo.some(
                    f => f.row === originalRow && f.col === col
                  );
                  if (
                    !checkSymbol ||
                    (!checkSymbol.includes('─') &&
                      !checkSymbol.includes('┘') &&
                      !checkSymbol.includes('┐') &&
                      !isForkPoint)
                  ) {
                    isActive = true;
                  }
                }
              }
            });

            if (isActive) {
              slots.push(centerInSlot('│'));
            } else {
              slots.push(centerInSlot(' '));
            }
          }
        }

        return (
          <div className="flex flex-col" key={commit.oid}>
            <div
              className="group flex gap-4 hover:bg-zinc-50 transition-all duration-100 cursor-pointer"
              onClick={() => {
                if (openCommitOid === commit.oid) {
                  setOpenCommitOid(null);
                  return;
                } else {
                  setOpenCommitOid(commit.oid);
                  onCommitClick?.(commit);
                }
              }}
            >
              <div className="flex gap-1 items-center">
                {slots.map((slot, colIdx) => {
                  const branch = branches[colIdx];
                  const branchClassName = branch?.className || '';
                  return (
                    <div
                      className={`w-4 text-center ${branchClassName}`}
                      key={colIdx}
                    >
                      {slot.includes('●') ? (
                        <div
                          className={`translate-x-[6px] w-3 h-3 border-2 rounded-full ${branchClassName}`}
                        />
                      ) : (
                        slot
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-[13px] w-full">
                <span className="text-gray-300">{'//- '}</span>{' '}
                {commit.message.length > 30
                  ? commit.message.slice(0, 30) + '…'
                  : commit.message}
              </div>
              <div className="flex items-center justify-center w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-all duration-100">
                <ChevronDownIcon
                  className={`w-4 h-4 ${openCommitOid === commit.oid && 'rotate-180'}`}
                />
              </div>
            </div>
            {collapsibleContent && openCommitOid === commit.oid && (
              <div className="w-full py-3 pl-2">{collapsibleContent}</div>
            )}
          </div>
        );
      })}
    </pre>
  );
}
