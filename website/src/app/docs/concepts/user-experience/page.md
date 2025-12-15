---
title: Flipping the Model - Local-First UX with Git Remotes & Legit Sync
description: How Legit brings SaaS-like UX to local-first apps. Learn remotes, offline-first sync, and patterns for secure, auditable AI collaboration in the browser.
---

# Flipping the model

After building a chat desktop app, one question kept coming up:
**How can these same principles (versioned, explainable AI collaboration) extend beyond desktop apps into the browser?**

The browser is where teams collaborate, but it was never built for history, intent, or rollback.

What if we brought Git’s local-first foundation to the browser? Web apps could be blazing fast, work offline, and stay fully auditable — every action safely synchronized. Most importantly, it would unlock new workflows where unreliable AI actually works.

Build on web technology from day one - Legit does just that.

## Modern UX

People love modern web apps because they feel effortless. Changes sync instantly, sessions persist, and everything “just works.” But under the hood, those systems rely on central servers, opaque databases, and **vendor lock-in**.

Legit flips that model. It feels like SaaS — instant saves, seamless sync, multiple devices — but everything begins as local. You own your data and its history. You decide when to sync and with whom you would like to share your work.

> “When you make a new Git repository, it’s not a big deal. It’s like you do `git init` and you’re done. And you don’t need to set up any infrastructure[...]. And [..] if that project ever grows to be something where you decide, “Oh, maybe I want other people to work with it,” that works too. And again, you don’t have to do anything about it. You just push it [..] again, you’re done.”<br><br>
— Linus Torvalds, Creator of Git

## Git Remotes

Under the hood, everything syncs through [Git remotes](https://git-scm.com/book/ms/v2/Git-Basics-Working-with-Remotes) — the same concept developers have used for decades, to collaborate on code.

### What is a Git remote?

A remote is simply another copy of the repository on another device, server, or service that you can push to or pull from. It’s how developers collaborate without relying on a single database or server.


### What can a remote be?

With Legit, a remote can be:

- **LegitHub** - our infrastructure optimized for your application
- **GitHub, GitLab, Bitbucket** - for dev tools where a repo on those remotes already exist
- **Any self-hosted Git server** - for professional environments
- **Another Legit node** - your local folder, another user’s machine, or even a browser session

No lock-in just a standard.

## Enables UX Patterns

Once sync is handled by Legit, the application layer becomes radically simpler — and safer for AI-driven workflows:

- **Synced data.** Every device (can) have the full data and history — no need for APIs to fetch deltas or resolve conflicts manually.
- **Offline-first.** Users can generate, edit, or review AI outputs offline and sync later.
- **Asynchronous collaboration.** Human-AI teams can work on separate branches of the same document or dataset, merging when ready.
- **Regulated environments.** Because everything runs locally, Legit fits industries like legal, research, or defense, where AI tools must be auditable.

## Takeaway

Modern AI apps deserve the UX of SaaS and the control of local-first software. Legit gives developers both: Seamless sync and trustworthy AI collaboration built on history itself.




