---
title: LegitFs Instance
description: Properties and methods available on the LegitFs instance, including branch management, authentication, and synchronization APIs.
---

# LegitFs Instance

The `legitFs` instance returned by `openLegitFs()` provides access to file operations, authentication, synchronization, and branch management.

## Type Definition

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

The `LegitFs` type extends `CompositeFs` with additional Git-related functionality. See the [Type Definitions](/docs/api#type-definitions) section for related types like `LegitAuth` and `LegitUser`.

## Methods

### `getCurrentBranch(): Promise<string>`

Returns the current branch name.

**Returns**: `Promise<string>` - The current branch name

**Throws**: `Error` if no current branch is set

**Example**:
```typescript
const branch = await legitFs.getCurrentBranch();
console.log(branch); // e.g., 'main'
```

### `setCurrentBranch(branch: string): Promise<void>`

Sets the current branch. If the branch doesn't exist locally, it will attempt to load it from the remote.

**Parameters**:

- **branch** (string): The branch name to set as current

**Throws**: `Error` if the branch doesn't exist after attempting to load it

**Example**:
```typescript
await legitFs.setCurrentBranch('feature-branch');
// If the branch doesn't exist locally, it will attempt to load it from remote
```

### `shareCurrentBranch(): Promise<string>`

Shares the current branch by pushing it to the remote and returning the branch name. If the current branch is the anonymous branch, it will be renamed to the user's ID.

**Returns**: `Promise<string>` - The branch name that was shared

**Throws**: `Error` if the user is not logged in (type is 'local')

**Example**:
```typescript
// Share the current branch (pushes to remote and returns branch name)
const branchName = await legitFs.shareCurrentBranch();
console.log(branchName); // The branch name that was shared
```

**Note**: This requires the user to be logged in (not type 'local'). If the current branch is the anonymous branch, it will be renamed to the user's ID.

### `push(branches: string[]): Promise<void>`

Pushes the specified branches to the remote repository.

**Parameters**:

- **branches** (string[]): Array of branch names to push

**Example**:
```typescript
// Push specific branches to remote
await legitFs.push(['main', 'feature-branch']);
```

## Additional APIs

The `legitFs` instance also provides:

- **`promises`**: File system operations (see [File Operations](./file-operations.md))
- **`auth`**: Authentication API (see [Authentication](./auth.md))
- **`sync`**: Synchronization service (see [Sync](./sync.md))


## Branch Management Examples

### Getting the Current Branch

```typescript
const currentBranch = await legitFs.getCurrentBranch();
console.log(currentBranch); // e.g., 'main'
```

### Setting the Current Branch

```typescript
await legitFs.setCurrentBranch('feature-branch');
// If the branch doesn't exist locally, it will attempt to load it from remote
```

### Sharing a Branch

```typescript
// Share the current branch (pushes to remote and returns branch name)
const branchName = await legitFs.shareCurrentBranch();
console.log(branchName); // The branch name that was shared
```

### Pushing Branches

```typescript
// Push specific branches to remote
await legitFs.push(['main', 'feature-branch']);
```

### Working with Branch Files

```typescript
// Read from a branch
const content = await legitFs.promises.readFile(
  '.legit/branches/main/src/file.ts',
  'utf8'
);

// Write to a branch (automatically creates a commit)
await legitFs.promises.writeFile(
  '.legit/branches/main/src/file.ts',
  'new content'
);

// List branch files
const files = await legitFs.promises.readdir('.legit/branches/main/src');
```

## See Also

- [openLegitFs](/docs/api/openLegitFs) - How to create a LegitFs instance
- [File Operations](/docs/api/file-operations) - File system operations API
- [Virtual Endpoints](/docs/api/virtual-endpoints) - Working with `.legit` paths
- [Authentication](/docs/api/auth) - User authentication
- [Sync](/docs/api/sync) - Synchronization with remote repositories

