---
title: The Idea - Bringing Git’s Collaboration Model to AI Agents
description: Why AI collaboration needs Git principles—versioning, accountability, boundaries—and how Legit intercepts reads/writes to coordinate agents safely.
---

# The idea

### Git solved the problem in software
Developers solved collaboration two decades ago. Not with meetings, but with [Git](https://git-scm.com/). Every change is tracked, diffed, signed, reversible, and blameable.

> The way I work, I don’t trust everybody. In fact, I am a very cynical and untrusting person. The whole point of being distributed is I don’t have to trust you.
> <br><br> — Linus Torvalds, Creator of Git

### Outside software
Outside of software, it is a very different story. Versions are stored inside a single domain (SaaS) or per file document, spreadsheets and design files. This leads to an isolated history, no shared timeline, no unified view of how a project evolved.

Versioning isn’t the foundation of collaboration and workflows — it’s an afterthought. While developers work in branches, everyone else works in `final_v3_really_final.docx`.

Conflicts and interference are “solved” by communication: Endless meetings, human-to-human coordination within a shared layer of trust. Nobody likes the current environment with systems like SharePoint, but the setup is just **good enough** to resist real change.

### Agents make the problem big
Now enter **agents** — working in parallel, lightning-fast, but unreliable and fundamentally untrusted. The old human-centric setup can’t keep up. It’s already starting to crack.

Projects with thousands of untrusted collaborators already exist — and they run the backbone of modern software. Linux, Postgres, and countless others thrive under this exact model. They’re all managed with a system built for that kind of chaos — Git. 

## What is missing? - L’ingrédient manquant à git

Git nails **accountability** and **safety** but it can’t enforce **boundaries** nor can track all information needed for **coordination**. Git detects changes after the fact - and it’s completely blind to read.

To enforce boundaries, a system must **intercept actions**, not just watch them. For coordination, it must know **what was read**, in **which state**, and **what assumptions were used** to produce an output. This information is essential to detect conflicts before they happen.

## How Legit Fills the Gap?

**Legit** is designed to be the **infrastructure for AI collaboration**. It doesn’t watch — it **intercepts**. Reads and writes can be **tracked**, **intercepted**, **and even rejected** when they violate boundaries or assumptions.

All of this is anchored in a **solid**, **Git-backed data layer**, ensuring that every action — whether accepted or blocked — is **auditable**, **versioned**, and **reversible**. Legit brings control and coordination to AI agents while standing on the strong foundation that made Git the backbone of software collaboration.

## Story Beat

> “When I (Nils) worked at [Decipad](https://www.decipad.com/), we let users co-create financial reports with AI. At first, it was magical. AI could rewrite, analyze, and summarize on command.<br><br>
> But in high-stakes reports, the magic broke fast. A single AI edit could rewrite assumptions or distort results, with no way to trace or undo it.<br><br>
> That’s when it clicked:
> If AI can change the source of truth, it must also be version controlled by design.
> **Version control isn’t optional — it’s survival.**”

## Takeaway

**AI moves fast and brings new requirements to the table, where trust can’t be an afterthought. Legit brings Git’s discipline (versioning, traceability, and accountability) to the new world of AI-driven collaboration.**
