---
asIndexPage: true
title: API Reference
description: Complete API reference for LegitFS - a composite filesystem with Git integration, providing unified file operations, authentication, synchronization, and branch management.
---

# LegitFS API Reference

## Overview

The [`@legit-sdk/core`](https://github.com/Legit-Control/monorepo/tree/main/packages/sdk) package provides a SDK to build applications with automatic version control, commit history, and collaborative editing features.

LegitFS is a composite filesystem that provides a unified interface for file operations with Git integration. The main entry point is `openLegitFs()`, which returns a `legitFs` instance that extends `CompositeFs` with additional Git-related functionality.

## Documentation Structure

This API reference is organized into the following sections:

- **[openLegitFs](/docs/api/openLegitFs)** - Entry point function to create and configure a LegitFs instance
- **[LegitFs Instance](/docs/api/legitFs-instance)** - Properties and methods available on the legitFs instance
- **[File Operations](/docs/api/file-operations)** - File system operations (promises API)
- **[Virtual Endpoints](/docs/api/virtual-endpoints)** - Virtual file system endpoints (`.legit` paths)
- **[Authentication](/docs/api/auth)** - Authentication and user management API
- **[Sync](/docs/api/sync)** - Synchronization with remote repositories

## Key Concepts

1. **File System Abstraction**: LegitFS uses a composite filesystem architecture where different subsystems handle different types of files (Git files, hidden files, ephemeral files, etc.).

2. **Automatic Commits**: Writing to branch files automatically creates Git commits. This is different from traditional Git workflows where you explicitly stage and commit.

3. **Virtual Files**: The `.legit` directory provides a virtual file system that exposes Git operations as file paths, making it easy to work with Git from any file system interface.

4. **Synchronization**: The sync service handles pulling and pushing changes automatically, with automatic merge resolution.

5. **Branch Isolation**: Each branch appears as a separate directory tree under `.legit/branches/{branchName}/`, allowing you to work with multiple branches simultaneously.

## Type Definitions

### LegitUser

```typescript
type LegitUser = {
  type: string;
  id: string;
  name: string;
  email: string;
};
```

### LegitAuth

```typescript
type LegitAuth = {
  getUser: () => Promise<LegitUser>;
  signInAnonymously: () => Promise<void>;
  getMaxAccessTokenForBranch: (branchId: string) => Promise<string | undefined>;
  addAccessToken: (token: string) => Promise<void>;
};
```

### LegitFs

```typescript
type LegitFs = CompositeFs & {
  auth: LegitAuth;
  sync: {
    start: () => void;
    stop: () => void;
    isRunning: () => boolean;
    loadBranch: (branch: string) => Promise<void>;
    sequentialPush: (branchesToPush: string[]) => Promise<void>;
  };
  push: (branches: string[]) => Promise<void>;
  shareCurrentBranch: () => Promise<string>;
  setCurrentBranch: (branch: string) => Promise<void>;
  getCurrentBranch: () => Promise<string>;
};
```

## Error Handling

Most operations throw standard Node.js filesystem errors:

- **ENOENT**: File or directory does not exist
- **EACCES**: Permission denied
- **EEXIST**: File or directory already exists
- **EISDIR**: Expected a file but got a directory
- **ENOTDIR**: Expected a directory but got a file

For Git-specific operations, additional errors may be thrown:

- **Branch does not exist**: When trying to access a non-existent branch
- **Commit does not exist**: When trying to set a branch head to a non-existent commit
- **No access token**: When trying to sync without authentication