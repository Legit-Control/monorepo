---
title: openLegitFs
description: Main entry point function to create and configure a LegitFs instance with storage, Git root, authentication, and sync options.
---

# `openLegitFs`

The main function to create and configure a LegitFs instance.

## Signature

```typescript
function openLegitFs({
  storageFs,
  gitRoot,
  anonymousBranch,
  showKeepFiles,
  initialAuthor,
  serverUrl,
  publicKey,
}: {
  storageFs: typeof nodeFs;
  gitRoot: string;
  anonymousBranch?: string;
  showKeepFiles?: boolean;
  initialAuthor?: LegitUser;
  serverUrl?: string;
  publicKey?: string;
}): Promise<LegitFs>;
```

## Parameters

- **storageFs** (required): The underlying filesystem (`typeof nodeFs`) to use for storage
- **gitRoot** (required): The root path of the Git repository
- **anonymousBranch** (optional, default: `'anonymous'`): The name of the anonymous branch to use
- **showKeepFiles** (optional, default: `false`): Whether to show `.keep` files in the filesystem
- **initialAuthor** (optional): Initial author information for Git commits
  ```typescript
  {
    type: string;
    id: string;
    name: string;
    email: string;
  }
  ```
- **serverUrl** (optional, default: `'https://hub.legitcontrol.com'`): URL of the sync server
- **publicKey** (optional): Public key for authentication

## Returns

A `Promise<LegitFs>` that resolves to a LegitFs instance. The instance is a `CompositeFs` extended with:

- `auth`: Authentication API
- `sync`: Synchronization service
- `push`: Push branches to remote
- `shareCurrentBranch`: Share the current branch
- `setCurrentBranch`: Set the current branch
- `getCurrentBranch`: Get the current branch
- `promises`: File system operations API

## Example

```typescript
import * as nodeFs from 'node:fs';
import { openLegitFs } from '@legit-sdk/core';

const legitFs = await openLegitFs({
  storageFs: nodeFs,
  gitRoot: '/path/to/repo',
  anonymousBranch: 'main',
  showKeepFiles: false,
  initialAuthor: {
    type: 'local',
    id: 'local',
    name: 'Local User',
    email: 'local@legitcontrol.com',
  },
  serverUrl: 'https://hub.legitcontrol.com',
});
```