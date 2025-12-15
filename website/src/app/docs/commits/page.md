---
title: Commits - Legit FS API Reference
description: Complete reference for commits in Legit FS—what commits are, how to create them, read them, and work with commit messages and authors.
---

# Commits

Commits in Legit FS are immutable snapshots of your filesystem at a specific point in time. Every commit contains a complete snapshot of all files, along with metadata about who made the change, when, and why.


## Write a Commit

Commits in Legit FS are created **automatically** when you write files to a branch path. There's no separate "commit" command needed.

###  legitFs.promises.writeFile

To create a commit, simply write a file to a branch:


**Example :**

```typescript
// Creates new commit

await legitFs.promises.writeFile(
  '/.legit/branches/main/document.txt',   // path
  'Updated content',                      // content
  'utf8'                                  // endocing
)

// Now you have new commit in history
```

## How Commits Are Stored

When you write a file, Legit FS creates a SHA-1 hash, called OID, for that commit. For example: `e96d6f7709aabbc5504781ae26b0eed7b59bb416`. 

By writing a new commit, it is stored with an SHA prefix for efficient organization:


### Storage Structure


```bash
/.legit/commits/
  e9/                    # first 2 chars of OID
    6d6f7709aabbc5504781ae26b0eed7b59bb416/   # remaining 38 chars of OID
      document.txt       # snapshot of the file in that commit
```

## Read a Commit

Commits in Legit FS are just as easy to read as they are to create. Each commit represents a complete snapshot of your branch at a specific point in time.

###  legitFs.promises.readFile

Access any commit by its OID using the storage structure:

```typescript
// Get commmit content

let commitOID = e96d6f7709aabbc5504781ae26b0eed7b59bb416 

const commitPath = `/.legit/commits/${commitOID.slice(0, 2)}/${commitOID.slice(2)}/document.txt`

const content = await legitFs.promises.readFile(commitPath, 'utf8')

// Structure: /.legit/commits/<first2chars>/<remaining38chars>/<filename>
```



## Commit Message

Commit messages describe what changed in a commit. In Legit FS, commit messages are automatically generated when you write files, but you can also read them from the commit history to understand what changed and when.


Commit messages in Legit FS are **auto-generated** so far based on the file changes. The default format is:

```
💾 Change '<filename>'
```
Commit messages are stored in the `message` field of each commit object in the [history](/docs/history):


### Set Commit Message 

Currently, commits use default message information. Means custom messages are not supported at the moment.

> **Track progress:** See [GitHub Issue #20](https://github.com/Legit-Control/monorepo/issues/20) to upvote this feature or follow development progress.


### Get Commit Message


```typescript
const history = JSON.parse(
  await legitFs.promises.readFile('/.legit/branches/main/.legit/history', 'utf8')
)

const commit = history[0]
console.log(commit.message) // → "💾 Change 'document.txt'\n"
```

To get the commit message from a specific commit:

```typescript
// Get commit from history
const history = JSON.parse(
  await legitFs.promises.readFile('/.legit/branches/main/.legit/history', 'utf8')
)

// Get message from specific commit by SHA
const commitOID = 'e96d6f7709aabbc5504781ae26b0eed7b59bb416'
const commit = history.find(c => c.oid === commitOID)
if (commit) {
  console.log('Message:', commit.message)
}
```



## Commit Author

Each commit contains author and committer information, including name, email, timestamp, and timezone offset.


```typescript
{
  "author": {
    "name": "Legit",
    "email": "hello@legitcontrol.com",
    "timestamp": 1761664398,      // Unix timestamp in seconds
    "timezoneOffset": 0            // Timezone offset in minutes
  },
  "committer": {
    "name": "Legit",
    "email": "hello@legitcontrol.com",
    "timestamp": 1761664398,
    "timezoneOffset": 0
  }
}
```


**Note:** In most cases, `author` and `committer` are the same. The distinction exists for cases where someone else applies a commit (e.g., in merge scenarios).


### Set Commit Author

Currently, commits use default author information. Means custom Authors are not supported at the moment.

> **Track progress:** See [GitHub Issue #19](https://github.com/Legit-Control/monorepo/issues/19) to upvote this feature or follow development progress.


### Get Commit Author


**Example: Get author from specific commit by SHA:**

```typescript
const history = JSON.parse(
  await legitFs.promises.readFile('/.legit/branches/main/.legit/history', 'utf8')
)

const commitOID = 'e96d6f7709aabbc5504781ae26b0eed7b59bb416'
const commit = history.find(c => c.oid === commitOID)

if (commit) {
  console.log('Author:', commit.author)
}
```


## Working with Commits


### Monitoring new Commits

You can monitor for new commits by polling the branch HEAD file:

```typescript
let previousHead = ''

async function checkForChanges() {
  const currentHead = await legitFs.promises.readFile(
    '/.legit/branches/main/.legit/head',
    'utf8'
  )
  
  if (currentHead !== previousHead) {
    console.log('New commit detected:', currentHead)
    previousHead = currentHead
    // Refresh your UI or trigger updates
  }
}

// Poll every 100ms (very cheap operation)
setInterval(checkForChanges, 100)
```

This pattern is used in the [legit-starter example](https://github.com/NilsJacobsen/legit-starter) to keep the UI in sync with commit changes.

## Commit Object Structure



```typescript
interface Commit {
  oid: string;              // Commit SHA-40 hash -> "e96d6f7709aabbc5504781ae26b0eed7b59bb416"
  message: string;          // Commit message -> "💾 Change 'document.txt'"
  parent: string[];         // Array of parent commit OID's -> ["e9e9656a54238e339d4e550f9ddbed2ee8be70d0"]
  tree: string;            // Tree object SHA (filesystem structure) -> "c9991edf45847ff7eb51abff35169a6b6228c5cc",
  author: {
    name: string;       // "Legit",
    email: string;      //  "hello@legitcontrol.com",
    timestamp: number;      // Unix timestamp in seconds -> 1761664398
    timezoneOffset: number; // Timezone offset in minutes -> 0
  };
  committer: {
    name: string;         // "Legit"
    email: string;        // "hello@legitcontrol.com"
    timestamp: number;    // Unix timestamp in seconds -> 1761664398
    timezoneOffset: number; // Timezone offset in minutes -> 0
  };
}
```

