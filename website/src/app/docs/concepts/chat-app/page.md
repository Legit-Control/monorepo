---
title: Legit Chat App Example - Safe AI Collaboration with Branching & Intent
description: See how Legit enables safe, auditable AI in a chat app using filesystem branches for sandboxing and parallel intent tracking with operations.
---

# The Chat App

## Eating our own “dogfood"

To really understand how the Legit SDK should work in a real project, we build an example project. This helps us to shape the SDK by understanding developer needs and validates insights.

> “To arrive at abstraction, it is always necessary to begin with a concrete reality.”<br>
> — Pablo Picasso

<br>

![Picasso Abstraction](/docs/concepts/chat/picasso.jpg)
<br>

### Why a Chat App?

A chat app is familiar to many developers and users, making it a relatable way to explore AI co-creation. By giving it write abilities via the [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) (MCP), we enable end users to collaborate on local files alongside AI agents.

**The problem:** AI working on local files is messy — no versioning, no provenance, no rollback. Every “Edit with AI” button is effectively **Russian roulette**, which makes this the perfect playground for our SDK.

<br>

![AI meme](/docs/concepts/chat/ai-meme.jpg)
<br>

### The Solution

To let the AI go crazy without doing harm we want to give each message thread a sandbox, they should be able to read and write files as needed without destroying the work of the user or interfere with the context of other threads.

You may guessed it - **it should operate in a separate branch.**

#### Creating a Sandbox Branch

When you utilize Legit FS you can simply create a branch using `mkdir` in the `branches` folder. All that happens in the background not visible by the end user.

```typescript
// Create a branch as a Sandbox for the AI
await legitFs.mkDir(".legit/branches/my-new-thread");

// The MCP just writes to a file
startWordMcp(inFolder: ".legit/branches/my-new-thread")
```
The MCP’s used work on files anyway - we just need to point it to the corresponding folder.

All changes done by the MCP are automatically tracked in Legit. But commits alone aren’t enough — we also need **intent**.

#### Tracking Intent
Every message, user prompt, tool call, or AI reasoning is stored in a **parallel operations branch**:
```typescript
chat.onMessage = function(message) {
  // Store the intent in the operations branch
  await legitFs.writeFile(".legit/branches/my-new-thread/.legit/operation", message);
};
```

- **Changes branch** → what was changed
- **Operations branch** → why it was changed, including prompts, reasoning, and context

Branches remain connected but separate, keeping history clean and intent transparent.

![Operations Branch](/docs/concepts/idea/operations.svg)
<br/>

## Legit Chat in action

![cgat Abstraction](/docs/concepts/chat/legit-chat.png)

## Takeaway

Legit gives app builders real benefits:

- Give your end user control over AI writes
- Use a simple and maintainable FS API
- Have one generalized control system for any kind of app data
