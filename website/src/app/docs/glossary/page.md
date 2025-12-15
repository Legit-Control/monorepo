---
title: Glossary - Key Terms and Concepts
description: A comprehensive glossary of terms related to Legit.
---

# Glossary

This glossary provides definitions for key terms and concepts used throughout the Legit Infrastracture.

It is mainly written for developers who want to understand the key concepts and terminology used across Legit's documentation and API. 

## Legit FS

Legit FS is a virtual filesystem layer built on top of Git.
It exposes every branch as a live, writable directory where apps and AI agents can read and write files just like a normal file system.
Every change automatically becomes a structured Git commit — giving full history, diff, and rollback without the app needing to know Git.
It hides internal files, enforces safety rules, and guarantees auditability and traceability for every operation.

## Legit SDK

Legit SDK is the developer toolkit that provides programmatic access to Legit FS.
It lets developers mount a branch view, read or write data, and track all edits made by users or agents.
The SDK handles commit creation, operation history, branching, concurrency, and metadata automatically — making it simple to build reliable, collaborative, AI-native applications.

TODO: API backlink

## Legit Hub

Legit Hub is the hosted coordination and collaboration layer built on top of Legit FS.
It provides shared infrastructure for projects, branches, and operation histories so teams can work together without running their own servers.
Over time, Legit Hub becomes the place where humans review and approve agent work, orchestrate multi-agent workflows, and connect third-party integrations — effectively a "GitHub for human-AI collaboration."



## Operations Branch

An Operations Branch (e.g. ```legit____main-operation```) is a special Git branch used to record every agent action as a separate commit.
Each operation becomes a linked commit with a clear message and parent references to both the previous operation and the main branch.
This creates a verifiable timeline of agent behavior, enabling provenance, rollback, replay, and auditability of all automated steps.

See it in Action [Tracking Intent](/docs/concepts/chat-app#tracking-intent).

## Sandbox

The Sandbox is an isolated branch view of data where agents or users can stage and test changes safely before they reach production.
All actions inside the sandbox are versioned and reviewable.
It allows experimentation, generation, or automation without risk — you can merge, revert, or approve results just like Git branches, ensuring stability even when AI agents make mistakes.

See it in Action [Creating a Sandbox Branch](/docs/concepts/chat-app#creating-a-sandbox-branch).

<!--
## Legit Box

A secure container or environment where AI agents can safely execute operations without direct access to the production file system. All changes within a Legit Box are versioned and can be reviewed before promotion.
-->