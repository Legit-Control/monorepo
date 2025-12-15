---
title: Branches - Legit FS API Reference
description: Complete reference for branches in Legit FS—what branches are, how to create them, read them, switch between them, and work with branch metadata.
---

# Branches

Branches in Legit FS are isolated workspaces where you can develop features, run experiments, or track different versions of your files. Each branch maintains its own commit history and current state, allowing you to work on multiple changes simultaneously without conflicts.

## Overview

Branches in Legit FS (sometimes called Sandboxes) are completely isolated. Changes on one branch don't affect other branches. Each branch has its own directory structure, commit history, and current state.

## How Branches Are Stored

Branches are stored as a directory structure under `/.legit/branches/`. Each branch has its own `.legit` folder with metadata.

**Storage Structure:**

```bash
/.legit/branches/
  main/                    # branch name
    document.txt          
    .legit/                # branch metadata
      head                 # current HEAD commit OID
      history              # commit history JSON
  feature-xyz/             # another branch
    document.txt
    .legit/
      head
      history
```

## Create a Branch

Branches in Legit are created using the standard `mkdir` filesystem operation. There's no special branch creation command—just create a directory under `/.legit/branches/`.

### Basic Branch Creation

```typescript
// Creates new branch
await legitFs.promises.mkdir('/.legit/branches/feature-xyz')

// Now you can write files to this branch
await legitFs.promises.writeFile(
  '/.legit/branches/feature-xyz/document.txt',
  'Content',
  'utf8'
)
```

## Read a Branch

There are multiple ways to read branch information and access branch content.

### Read Directory in a Specific Branch

Read the **directory** at the current state in a specific branch:

```typescript
// Get all files in a branch (including .legit)
const files = await legitFs.promises.readdir('/.legit/branches/main')
// → ['.legit', 'document.txt', 'other-file.txt', ...]
```

> **Note:** The directory listing includes a `.legit` folder which contains branch metadata (head, history, etc.)

### Read File in a Branch

Read the **file** at the current version in a specific branch:

```typescript
const content = await legitFs.promises.readFile('/.legit/branches/main/document.txt', 'utf8')

// → Hello World
```

### List All Branches

Get a list of all branches in the repository:

```typescript
// List all branches
const branches = await legitFs.promises.readdir('/.legit/branches')
// → ['main', 'feature-xyz', 'experiment-abc']
```

### Get Current Branch HEAD

The HEAD is the most recent commit on a branch:

```typescript
const head = await legitFs.promises.readFile(
  '/.legit/branches/main/.legit/head',
  'utf8'
)
// → "e96d6f7709aabbc5504781ae26b0eed7b59bb416"
```

**Use cases:**
- Check if branch has new commits (compare with previous HEAD)
- Get the latest commit OID to read commit snapshots
- Monitor branch changes by polling the HEAD file

## Switch Between Branches


### Get Current Branch

Get the name of the currently active branch:

```typescript
const currentBranch = await legitFs.getCurrentBranch()
console.log('Current branch:', currentBranch)
// → "main"
```

### Set Current Branch

Switch to a different branch. If the branch doesn't exist locally, it will be loaded from the remote:

//TODO Wenn es die auch remote nicht gibt, kann ich damit neue Branches erstellen? 


```typescript
// Switch to a branch
await legitFs.setCurrentBranch('feature-xyz')

// Now operations will work on the feature-xyz branch
const currentBranch = await legitFs.getCurrentBranch()
console.log('Current branch:', currentBranch)
// → "feature-xyz"
```

## Working with Branches

### Check if Branch Exists

```typescript
// List all branches and check if specific branch exists
const branches = await legitFs.promises.readdir('/.legit/branches')
const branchExists = branches.includes('feature-xyz')
```

## Related Documentation

- [Commits](/docs/commits) - Learn how commits work with branches
- [History](/docs/history) - Understand branch commit history
- [Sync](/docs/sync) - Learn how to sync branches with remotes
