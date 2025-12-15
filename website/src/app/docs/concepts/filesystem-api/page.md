---
title: Legit Filesystem API - Git-Backed SDK for Versioning, Branching, Sync
description: Learn how Legit FS turns read/write into versioned commits with history, branches, and remotes—bringing Git’s power to AI-driven apps and workflows.
---

# Legit SDK

## Files as an universal Interface

There are many ways to build a control layer for AI, but the most universal interface on Earth is the filesystem.

- Every programming language understands it.
- Every environment can mount it.
- You don’t need to learn a new protocol, schema, or database.

The Legit FS provides just a normal FS interface - in short: If you can `readFile` and `writeFile`, you can version, diff, rollback, and sync.

<br/>

![Filesystem use cases](/docs/concepts/filesystem-api/filesystem-questions.svg)
<br/>

### How It Works

When you create a folder with Legit FS, it looks and behaves like a normal directory. Create a file -> Modify a file -> Delete a file. Everything works as you expect.

But under the hood, every filesystem operation is tracked and stored in Git. For example every write to a file becomes a commit representing the new state of the file. The metadata stored within every commit like the author, the timestamp, and the reference to the previous state of the filesystem makes legit a fully traceable FS.

```typescript
await legitFs.writeFile("hello.txt", "Hello world!");

// Behind the scenes:
// Commit 1 -> "Added hello.txt"

await legitFs.writeFile("hello.txt", "Hello Legit World!");

// Behind the scenes:
// Commit 2 -> "Updated hello.txt"
```

Writes are traceable history. Branches isolate experiments. Remotes sync changes across devices and users.

### History made explorable

Everything Legit does is transparent and accessible (again) via the filesystem; The root of the filesystem contains a Folder named `.legit` which contains special files and folders to navigate and operate on the history.

The folder `.legit/branches/` for example gives you access to all branches reading the state of a file in a branch becomes:

```typescript
await legitFs.readFile(".legit/branches/my-branch/hello.txt");

// Returns:
// Hello Legit!
```

Does your app need access to the history? There is a file for that.

```typescript
await legitFs.readFile(".legit/branches/my-branch/.legit/history/hello.txt");

// Returns:
// [
//     {
//         "commit": "ade72dcedae403d3663dfa25c0b642a501481add",
//         "author": "Toni the Dev",
//         "message": "Added hello.txt"
//     },
//     {
//         "commit": "4b1e261e7bcc55cd040a3d28e725383184e89c2a",
//         "author": "Toni the Dev",
//         "message": "Updated hello.txt"
//     }
// ]
```

You want to show a file in a specific state?

```typescript
await legitFs.readFile(".legit/commits/ad/e72e72dce/hello.txt");

// Returns:
// Hello Legit World!
```

You get the idea...

## The best of both worlds

Since Legit FS can be mounted into a local folder you can explore it with your finder/explorer or with your preferred terminal.

But to navigate history better tools exist. Since Legit is fully git compatible, Git’s ecosystem becomes Legit’s Ecosystem from day one. Use [Sourcetree](https://www.sourcetreeapp.com/), [CLI](https://git-scm.com/book/en/v2/Getting-Started-The-Command-Line), or any other Git tool to work with the infra.

**This union of those worlds enable whole new dev experience.**

### Why this is powerful

- **Universal & Portable**: One SDK that runs everywhere: desktop, server, or browser.
- **Transparent**: Open the .legit folder and inspect every commit yourself.
- **Tooling**: Make use of Git’s ecosystem

![AI edit meme](/docs/concepts/filesystem-api/universal.svg)

## Story Beat

> At a [meetup](https://braid.org/meeting-118), Martin was demoing the Filesystem to a group of engineers. After watching a sync between a Node app, a browser client, and a local folder, one developer — a distributed systems expert — just shook his head.<br><br>
> “This is crazy. You did so much elegant cross-platform synchronization here. It’s just blowing me away.”<br><br>
> It hit us that this wasn’t just a file system. It was a universal API for versioned, reactive, and collaborative data that just worked everywhere — from desktop apps to the browser, all powered by Legit.

## Takeaway

The filesystem itself is the API. Reading and writing files isn’t just a basic operation, it is **a first-class control layer** for AI. It enables developers to provide end user features like provenance, history, and safe experimentation while remaining fully interoperable with existing tools and environments.
