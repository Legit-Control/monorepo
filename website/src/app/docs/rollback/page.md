---
title: Rollback - Legit FS API Reference
description: Complete reference for rollback in Legit FS—how to rollback to previous commits, restore file states, and manage version history.
---

# Rollback

Rollback in Legit FS allows you to restore your branch to a previous commit state. Since every commit is an immutable snapshot, you can safely rollback to any point in your history and restore files to their previous state.

## Overview

Rollback in Legit FS is achieved through filesystem operations. You can rollback a branch by writing the desired commit OID to the branch's HEAD file. This effectively moves the branch pointer back to a previous commit, restoring all files to their state at that commit.

## How Rollback Works

When you rollback, you're changing which commit the branch points to. The commit history remains intact—you're just moving the branch HEAD to point to a different commit. This means:

- All commits remain in history
- You can rollback to any commit
- You can rollback forward again if needed

## Rollback a Branch

### Basic Rollback

Rollback a branch to a specific commit by writing the commit OID to the branch's HEAD file:

```typescript
// Get the commit OID you want to rollback to
const targetCommitOID = 'e96d6f7709aabbc5504781ae26b0eed7b59bb416'

// Rollback by writing to the HEAD file
await legitFs.promises.writeFile(
  '/.legit/branches/main/.legit/head',
  targetCommitOID,
  'utf8'
)

// The branch is now rolled back to that commit
// All files are restored to their state at that commit
```

### Rollback Using History

Rollback to a commit from the history:

```typescript
// Get history
const historyJson = await legitFs.promises.readFile(
  '/.legit/branches/main/.legit/history',
  'utf8'
)
const history = JSON.parse(historyJson)

// Get commit at index (0 is most recent, 3 is 3 commits ago)
const targetCommit = history[3]

// Rollback to that commit
await legitFs.promises.writeFile(
  '/.legit/branches/main/.legit/head',
  targetCommit.oid,
  'utf8'
)
```

## Restore Specific Files

While you can't rollback individual files directly, you can restore a file from a previous commit:

### Restore File from Commit

```typescript
// Read file from the target commit
const commitOID = 'e96d6f7709aabbc5504781ae26b0eed7b59bb416'
const commitDir = `/.legit/commits/${commitOID.slice(0, 2)}/${commitOID.slice(2)}`
const fileContent = await legitFs.promises.readFile(
  `${commitDir}/document.txt`,
  'utf8'
)

// Write it to the current branch (creates a new commit)
await legitFs.promises.writeFile(
  '/.legit/branches/main/document.txt',
  fileContent,
  'utf8'
)
```

## Related Documentation

- [Commits](/docs/commits) - Understand commit structure
- [History](/docs/history) - Learn how to find commits to rollback to
- [Branches](/docs/branching) - Understand how branches work with rollback
