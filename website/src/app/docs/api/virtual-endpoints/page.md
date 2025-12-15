---
title: Virtual Endpoints
description: Access Git operations through virtual file system paths under .legit directory, including branches, commits, and repository status.
---

# Virtual Endpoints

LegitFS provides a virtual file system under the `.legit` directory that exposes Git operations as file system paths. These paths are handled by the `GitSubFs` subsystem.

## Path Structure

All virtual paths start with `.legit/`. The `.legit` directory can appear at any depth in the path structure to distinguish Git-related files from regular files.

## Available Endpoints

### `.legit/status`

**Type**: File (read-only)

**Content**: JSON object containing Git repository status.

**Structure**:

```json
{
  "branch": "branch-name",
  "commit": "commit-sha",
  "clean": boolean,
  "files": [
    {
      "path": "file-path",
      "status": "untracked" | "deleted" | "modified" | "added" | "unknown"
    }
  ]
}
```

**Example**:

```typescript
const statusContent = await legitFs.promises.readFile('.legit/status', 'utf8');
const status = JSON.parse(statusContent);
console.log(status.branch); // Current branch name
console.log(status.files); // Array of modified files
```

### `.legit/branches/`

**Type**: Directory (read-only)

**Content**: List of branch names (as directory entries).

**Example**:

```typescript
const branches = await legitFs.promises.readdir('.legit/branches');
// Returns: ['main', 'feature-branch', 'another-branch']
```

### `.legit/branches/{branchName}/`

**Type**: Directory (read/write)

**Content**: The file tree of the specified branch. You can read and write files as if they were in a regular directory.

**Example**:

```typescript
// Read a file from a branch
const content = await legitFs.promises.readFile(
  '.legit/branches/main/src/index.ts',
  'utf8'
);

// Write a file to a branch (creates a commit)
await legitFs.promises.writeFile(
  '.legit/branches/main/src/index.ts',
  'new content'
);

// List files in a branch directory
const files = await legitFs.promises.readdir('.legit/branches/main/src');
```

**Operations**:

- **Read**: Read files and directories from the branch
- **Write**: Write files (creates a commit automatically)
- **Delete**: Delete files (creates a commit automatically)
- **Rename**: Rename/move files (creates a commit automatically)
- **Mkdir**: Create directories (creates a commit automatically)

**Note**: All write operations on branch files automatically create Git commits.

### `.legit/branches/{branchName}/.legit/head`

**Type**: File (read/write)

**Content**: The commit SHA of the branch head (40-character hex string, followed by newline).

**Read Example**:

```typescript
const headSha = (
  await legitFs.promises.readFile('.legit/branches/main/.legit/head', 'utf8')
).trim();
console.log(headSha); // e.g., "a1b2c3d4e5f6..."
```

**Write Example**:

```typescript
// Set branch head to a specific commit
await legitFs.promises.writeFile(
  '.legit/branches/main/.legit/head',
  'a1b2c3d4e5f6...\n'
);
```

**Note**: The commit must exist in the repository. Writing to this file updates the branch reference.

### `.legit/branches/{branchName}/.legit/tip`

**Type**: File (read/write)

**Content**: The commit SHA of the branch tip (for undo/redo operations).

**Usage**: Similar to `head`, but used for tracking the tip of the branch for undo/redo functionality.

### `.legit/branches/{branchName}/.legit/operation`

**Type**: File (read/write)

**Content**: Branch operation information.

### `.legit/branches/{branchName}/.legit/operationHead`

**Type**: File (read/write)

**Content**: Operation head information.

### `.legit/branches/{branchName}/.legit/operationHistory`

**Type**: File (read-only)

**Content**: History of operations on the branch.

### `.legit/branches/{branchName}/.legit/history`

**Type**: File/Directory (read-only)

**Content**: Branch history information.

### `.legit/branches/{branchName}/.legit/threadName`

**Type**: File (read/write)

**Content**: Thread name associated with the branch.

### `.legit/commits/`

**Type**: Directory (read-only)

**Content**: Directory containing commit SHAs organized by first two characters.

### `.legit/commits/{sha[0:2]}/`

**Type**: Directory (read-only)

**Content**: Directory containing commits starting with the specified two-character prefix.

### `.legit/commits/{sha[0:2]}/{sha[2:40]}/`

**Type**: Directory (read-only)

**Content**: The file tree of the specified commit. You can read files as they existed at that commit.

**Example**:

```typescript
// Read a file from a specific commit
const content = await legitFs.promises.readFile(
  '.legit/commits/a1/b2c3d4e5f6.../src/index.ts',
  'utf8'
);

// List files in a commit directory
const files = await legitFs.promises.readdir(
  '.legit/commits/a1/b2c3d4e5f6.../src'
);
```

**Note**: Commit paths are read-only. You cannot write to historical commits.

## Path Patterns

- **Branch files**: `.legit/branches/{branchName}/[[...filePath]]`
  - Supports nested paths
  - Read/write operations create commits
- **Commit files**: `.legit/commits/{sha[0:2]}/{sha[2:40]}/[[...filePath]]`
  - Supports nested paths
  - Read-only (historical data)

- **Branch metadata**: `.legit/branches/{branchName}/.legit/{metadataFile}`
  - Various metadata files for branch operations

## Important Notes

1. **Automatic Commits**: All write operations on branch files (`.legit/branches/{branch}/...`) automatically create Git commits with default messages like:
   - `💾 Change '{filePath}'` for file writes
   - `Delete {filePath}` for file deletions
   - `🔀 Rename '{oldPath}' to '{newPath}'` for renames

2. **Empty Directories**: Git doesn't support empty directories. When creating directories, a `.keep` file is automatically added. When deleting files, `.keep` files are managed automatically.

3. **File Handles**: When opening branch files for writing, changes are buffered and committed when the file handle is closed or flushed.

4. **Cross-Branch Operations**: Renaming files across branches is not yet implemented.

## Complete Example

```typescript
// Read Git status
const statusJson = await legitFs.promises.readFile('.legit/status', 'utf8');
const status = JSON.parse(statusJson);
console.log('Current branch:', status.branch);
console.log('Modified files:', status.files);

// List all branches
const branches = await legitFs.promises.readdir('.legit/branches');
console.log('Available branches:', branches);

// Read a file from a branch
const content = await legitFs.promises.readFile(
  '.legit/branches/main/src/index.ts',
  'utf8'
);

// Write to a branch (creates a commit)
await legitFs.promises.writeFile(
  '.legit/branches/main/src/index.ts',
  content + '\n// Modified'
);

// Read branch head
const headSha = (
  await legitFs.promises.readFile('.legit/branches/main/.legit/head', 'utf8')
).trim();
console.log('Branch head:', headSha);

// Read a file from a historical commit
const historicalContent = await legitFs.promises.readFile(
  `.legit/commits/${headSha.slice(0, 2)}/${headSha.slice(2)}/src/index.ts`,
  'utf8'
);
```

## See Also

- [File Operations](/docs/api/file-operations) - File system operations API
- [LegitFs Instance](/docs/api/legitFs-instance) - Instance properties and methods

