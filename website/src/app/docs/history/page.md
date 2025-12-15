---
title: History - Legit FS API Reference
description: Complete reference for history in LegitFS—how to read commit history, work with history arrays, and find commits in branch history.
---

# History

History in Legit FS is a JSON array of commits stored in `/.legit/branches/<branch>/.legit/history`. Each branch maintains its own history containing commit metadata (OID, message, author, parent, etc.). History is ordered chronologically with the most recent commit first (index 0) and is read-only—commits are automatically added when you write files to branches.

**OPEN QUESTION**: Was passiert eigentlich wenn ich files schreibe, wo ich keiene Schreiben darf? Error Message? 

## Read History

### Get History of a Branch

Read the commit history for a specific branch:

```typescript
// Read branch history
const historyJson = await legitFs.promises.readFile(
  '/.legit/branches/main/.legit/history',
  'utf8'
)

// Parse JSON array
const history = JSON.parse(historyJson)
// → Array of commits, most recent first
```


### History Per File


Currently,it is not possible to get the history of a specific file via the API .

> **Track progress:** See [GitHub Issue #22](https://github.com/Legit-Control/monorepo/issues/22) to upvote this feature or follow development progress.



## Working with History


### Get Most Recent Commit

The first item in the history array is always the most recent commit:


```typescript
const history = JSON.parse(
  await legitFs.promises.readFile('/.legit/branches/main/.legit/history', 'utf8')
)

// Most recent commit
const latestCommit = history[0]
console.log('Latest commit OID:', latestCommit.oid)
console.log('Latest commit message:', latestCommit.message)
```


### Find Commit by OID

Search for a specific commit by its OID:

```typescript
const history = JSON.parse(
  await legitFs.promises.readFile('/.legit/branches/main/.legit/history', 'utf8')
)

const commitOID = 'e96d6f7709aabbc5504781ae26b0eed7b59bb416'
const commit = history.find(c => c.oid === commitOID)

if (commit) {
  console.log('Found commit:', commit.message)
}
```

### Find Commits by Metadata

Search for all commits by a specific Metadata e.i. Author name :

```typescript
const history = JSON.parse(
  await legitFs.promises.readFile('/.legit/branches/main/.legit/history', 'utf8')
)

// Find commits by author name
const authorName = 'Legit'
const commitsByAuthor = history.filter(c => c.author.name === authorName)

console.log(`Found ${commitsByAuthor.length} commits by ${authorName}`)
commitsByAuthor.forEach(commit => {
  console.log(`${commit.oid.substring(0, 8)} - ${commit.message.trim()}`)
})
```


### Get Parent Commit

Access the parent commit of a specific commit:

```typescript
const history = JSON.parse(
  await legitFs.promises.readFile('/.legit/branches/main/.legit/history', 'utf8')
)

const commit = history[0] // Most recent commit
console.log('Current commit:', commit.oid)
console.log('Parent commits:', commit.parent)

// Get parent commit details
commit.parent.forEach(parentOID => {
  const parentCommit = history.find(c => c.oid === parentOID)
  if (parentCommit) {
    console.log('Parent:', parentCommit.message)
  }
})
```

**Note:** Most commits have one parent. Merge commits can have multiple parents.



## History Structure

The history file contains a JSON array of commit objects. Each commit object has the following structure:

```typescript
interface Commit {
  oid: string;              // Commit OID (SHA-1 hash)
  message: string;          // Commit message
  parent: string[];         // Array of parent commit OIDs
  tree: string;            // Tree object OID
  author: {
    name: string;
    email: string;
    timestamp: number;      // Unix timestamp in seconds
    timezoneOffset: number; // Timezone offset in minutes
  };
  committer: {
    name: string;
    email: string;
    timestamp: number;
    timezoneOffset: number;
  };
}
```

**Example history:**

```typescript
/* -> [
    {
        "oid": "e96d6f7709aabbc5504781ae26b0eed7b59bb416",
        "message": "💾 Change 'document.txt'\n",
        "parent": [
            "e9e9656a54238e339d4e550f9ddbed2ee8be70d0"
        ],
        "tree": "c9991edf45847ff7eb51abff35169a6b6228c5cc",
        "author": {
            "name": "Legit",
            "email": "hello@legitcontrol.com",
            "timestamp": 1761664398,
            "timezoneOffset": 0
        },
        "committer": {
            "name": "Legit",
            "email": "hello@legitcontrol.com",
            "timestamp": 1761664398,
            "timezoneOffset": 0
        }
    },
    ...
   ]
*/
```

For complete details on commit object structure, see the [Commit API documentation](/docs/commits).

