---
asIndexPage: true
title: React Wrapper
description: React provider and hooks for building applications with automatic version control, commit history, and collaborative editing features using @legit-sdk/react.
---

# React Wrapper

React provider and hooks for [`@legit-sdk/core`](/docs/api)
([Github](https://github.com/Legit-Control/monorepo/tree/main/packages/sdk))

## Overview

The [`@legit-sdk/react`](https://github.com/Legit-Control/monorepo/tree/main/packages/sdk-react) package provides React-specific abstractions over the core LegitFS SDK, making it easy to build React applications with automatic version control, commit history, and collaborative editing features.

## Key Features

- **Legit Versioning Features**: Ootb history, rollback, branching
- **Auto initialization**: Wrapper initializes a `legitFs`
- **Auto reactivity**: Wrapper gives access to reactive props
- **Path abstractions**: Wrapps the nodeish FS API

## First steps with React wrapper

- **[API](/docs/react-wrapper/api)** - Complete API reference for provider and hooks
- **[Setup](/docs/quickstart)** - Get started using the React wrapper
- **[Working with One File](/docs/react-wrapper/working-with-files)** - Using `useLegitFile` hook and how the abstraction works
- **[Accessing Legit Context](/docs/react-wrapper/accessing-context)** - Using `useLegitContext` for advanced operations

## Architecture

The React wrapper follows a provider pattern:

```
LegitProvider (initializes SDK, polls for changes)
    ↓
useLegitFile (reads/writes files, manages history)
    ↓
Your Components (editor, history viewer, etc.)
```

The `LegitProvider` creates a single `legitFs` instance and shares it through React context. Hooks like `useLegitFile` consume this context to provide file operations with automatic commit tracking.

## Core Concepts

### Automatic Commits

Unlike traditional Git workflows, the React wrapper automatically creates commits when you save files. Each call to `setData()` writes the file and creates a commit with a descriptive message.

### Reactive Updates

The wrapper polls the repository HEAD to detect changes from other sources (like sync or other tabs). When the HEAD changes, all hooks automatically reload their data. 

This will later be replaced by a more sofisticated reactive system.

### File Initialization

You can provide `initialData` when using `useLegitFile`. If the file doesn't exist, it will be automatically created with that content on first mount.

## See Also

- [Core SDK Documentation](/docs) - Underlying filesystem API
- [Example Apps](/showcase) - Full working examples
- [Concept pages](/docs/concepts/problem) - Detailed design documentation
