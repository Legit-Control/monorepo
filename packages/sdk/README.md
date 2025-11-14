# Legit SDK (Alpha) - Feedback-only version

**This software is being shared publicly to gather early feedback on its API and underlying concepts.**
It represents the first small component of our upcoming SDK. At this stage, it’s intended for evaluation and personal use only.

## The easiest way to build fail-safe applications.

Legit SDK is built around two core ideas: **fail-safe** by design, and **effortlessly simple** to use.

**Fail-safe** means giving your users the same superpowers you know from Git:

- Roll back to any previous state
- Branch off to run experiments safely
- Merge changes back when you’re happy with the result

And it's **easy** because you interact through the simplest interface imaginable: **the file system API**.
Yep, the same one you learned in your first semesters of computer science.

**Runs everywhere.** Use Legit SDK as an API in the browser, or mount it as a folder on your machine. That means instant compatibility with the stack of your choice — Python, Java, Node.js… you name it — from day one.

## Environment Compatibility

Legit SDK works in many environments:

- **Operating Systems**: macOS, Linux, Windows
- **Languages: Node.js**, Python, Java (more coming)
- **Containers / Sandboxed Environments**: Docker, serverless, cloud VMs

It works everywhere because it operates on a **filesystem abstraction**. Any environment that supports standard filesystem operations can run it.

For this guide, we focus on **Node.js**. Later guides will cover Python, Java, and containerized usage.

## First Steps

### 1. Install the SDK

```bash
npm install @legit-sdk/core
```

> This package provides everything you need: creating a LegitFS instance, reading/writing files, and accessing version history.

### 2. Minimal Example

```typescript
import { fs } from 'memfs';
import { initLegitFs } from '@legit-sdk/core';

async function main() {
  // create a LegitFS instance backed by memfs
  const legitFs = await initLegitFs(fs, '/');

  // write a versioned file
  await legitFs.promises.writeFile('/hello.txt', 'Hello world');

  // read the current file state
  const content = await legitFs.promises.readFile('/hello.txt', 'utf8');
  console.log(content); // → "Hello world"

  // inspect commit history (stored in .legit)
  const history = await legitFs.promises.readFile(
    '/.legit/branches/main/.legit/history',
    'utf8'
  );
  console.log(history);
}

main();
```

**Notes:**

- `legitFs` behaves like `fs`, but all writes are **versioned automatically**.
- You can read any previous state from the `.legit` folder.
- Swapping `fs` in `legitFs` requires no other code changes.

### 3. How LegitFS Stores Data

LegitFS keeps track of all writes in a .legit folder:

```bash
/
├─ document.txt                   # checked-out file (working copy)
└─ .legit/
   ├─ branches/                   # available branches
   │  └─ main/
   │     ├─ document.txt
   │     └─ .legit/
   │        ├─ head               # current HEAD content
   │        ├─ history            # branch history
   │        ├─ operation
   │        └─ operationHistory
   └─ commits/
      └─ ab/                      # first 2 chars of SHA
         └─ cdef1234567890.../    # remaining 38 chars of SHA
            └─ document.txt       # snapshot of the file in that commit
```

Because it follows the **same interface as Node’s** `fs`:

- You can run it **in-memory**, on **disk**, or with any other **storage adapter**.
- You can access version history and snapshots without extra setup.
