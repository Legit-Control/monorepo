---
title: Raw Starter - Minimal Legit SDK Example Without Abstraction
description: A minimal Legit SDK starter example demonstrating core filesystem operations, commit history, and versioning. Learn how Legit FS works under the hood with zero abstraction.
---

# Raw Legit SDK Core Starter
## What this example shows

This is the **first minimal starter** for the Legit SDK, built with **zero abstraction** to show how `Legit FS` really works under the hood. It just shows a small sample of what the Legit SDK can do. The goal is to make some features tangible. More functionality and examples will follow soon.

It’s designed to be your hands-on introduction to the SDK’s core principle:

> “Every write is versioned, every state is recoverable.”

You can explore the live version here: 👉 [starter.legitcontrol.com](https://starter.legitcontrol.com/)<br/>
And the repository here: 👉 [legit-starter](https://github.com/NilsJacobsen/legit-starter)

It runs in the browser, backed by an **in-memory filesystem** (memfs) and the **Legit SDK**, showing how you can:

- Initialize a Legit FS instance
- Write versioned files
- Read commit history
- Explore diffs between versions
- Roll back or inspect previous states

This is a **minimal proof of concept**. More examples — including collaborative, persistent, and AI-integrated scenarios — will follow soon.

## What’s happening under the hood

Let’s walk through what the starter does, step by step.

### 1. Initialization

When the app loads, it creates a `Legit FS` instance using `memfs` as the storage layer:

```ts
const legitFs = await initLegitFs(fs, "/");
```

Then it writes a simple file (`document.txt`) into the main branch:

```ts
await legitFs.promises.writeFile(
  "/.legit/branches/main/document.txt",
  "This is a document that you can edit! 🖋️"
);
```

From here on, every write to this file becomes part of a versioned history (no manual commits needed).

### 2. File editing and saving

The editor in the UI simply modifies the working copy of the file.
When you hit **Save**, Legit automatically commits a new version.

You can see this in the code:

```ts
await legitFs.promises.writeFile(`/.legit/branches/main/${FILE_NAME}`, text);
```

This triggers Legit’s internal logic to:
- Detect changes
- Create a new commit
- Update the branch `HEAD`
- Write history to `.legit/branches/main/.legit/history`

### 3. Reading commit history

The example periodically reads the branch’s history file:

```ts
const raw = await legitFs.promises.readFile(
  "/.legit/branches/main/.legit/history",
  "utf8"
);
const parsed: HistoryItem[] = JSON.parse(raw);
```

Each `HistoryItem` includes:
- `oid`: the commit hash
- `parent`: previous commit(s)
- `author`, `message`, and `timestamp`

That data drives the “History” list in the UI.

### 4. Inspecting and comparing commits

Each commit stores its own snapshot under `.legit/commits`.
You can read any past version directly:

```ts
await legitFs.promises.readFile(
  `/.legit/commits/${oid.slice(0, 2)}/${oid.slice(2)}/document.txt`,
  "utf8"
);
```

The demo uses this to render a semantic diff between commits with [diff-match-patch-ts](https://github.com/rars/diff-match-patch-ts).

### 5. Polling for changes

The app polls the `.legit/branches/main/.legit/head` file every few milliseconds to detect when new commits appear — keeping the editor and history list synced automatically.

This works because reading `.legit/head` is very cheap, even in fast intervals.

## What to take away

The goal of this starter is not to show a UI pattern — it’s to demonstrate Legit FS as a concept:

- It behaves like a regular `fs` API
- It version-controls all writes automatically
- It keeps state in a `.legit` structure that’s easy to inspect
- It works fully in-memory (no backend required)

This “zero-abstraction” design lets you understand exactly what happens behind each operation. Ideal for learning, debugging, and early prototyping.

## Related Reading

If you haven’t yet, check out these sections for deeper context:

- [Getting Started with Legit SDK](/docs/quickstart) — how to install and initialize Legit FS
- [Overview](/docs/api)— all about initLegitFs, .promises, and how history is stored
- [The Filesystem Concept](/docs/concepts/filesystem-api) — why Legit uses the filesystem as the universal interface
- [The Idea](/docs/concepts/idea) — why Git’s core principles matter for AI and collaboration

## Feedback

We’re sharing this early because **we want your feedback**.
If you tried the starter or built on top of it, tell us:

- Was the setup and mental model clear?
- What felt confusing or fragile?
- What other examples would you like to see?

Join the discussion in **#feedback** on [Discord](https://discord.gg/34K4t5K9Ra).