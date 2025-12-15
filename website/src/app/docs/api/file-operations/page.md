---
title: File Operations
description: Async file system operations API similar to Node.js fs.promises, with automatic Git commits for branch file operations.
---

# File Operations

The `legitFs.promises` object provides async file system operations similar to Node.js `fs.promises`, but with Git integration.

## Important Notes

1. **Automatic Commits**: All write operations on branch files (`.legit/branches/{branch}/...`) automatically create Git commits with default messages like:
   - `💾 Change '{filePath}'` for file writes
   - `Delete {filePath}` for file deletions
   - `🔀 Rename '{oldPath}' to '{newPath}'` for renames

2. **Empty Directories**: Git doesn't support empty directories. When creating directories, a `.keep` file is automatically added. When deleting files, `.keep` files are managed automatically.

3. **Cross-Branch Operations**: Renaming files across branches is not yet implemented.

## Methods

### `access(filePath: string, mode?: number): Promise<void>`

Tests a user's permissions for the file or directory specified by `filePath`.

**Parameters**:

- **filePath** (string): Path to the file or directory
- **mode** (optional, number): Optional accessibility check (default: `fs.constants.F_OK`)

**Throws**: `Error` if access is denied

### `opendir(dirPath: PathLike, options?: OpenDirOptions): Promise<CompositeFsDir>`

Opens a directory for reading.

**Parameters**:

- **dirPath** (PathLike): Path to the directory
- **options** (optional): Options object
  - `encoding`: Character encoding (default: `'utf8'`)
  - `bufferSize`: Number of directory entries buffered internally

**Returns**: `Promise<CompositeFsDir>` - A directory handle

**CompositeFsDir Methods**:

- `read(): Promise<Dirent | null>` - Read the next directory entry
- `close(): Promise<void>` - Close the directory handle
- `path: string` - The directory path
- `[Symbol.asyncIterator]()` - Async iterator for directory entries

**Example**:
```typescript
const dir = await legitFs.promises.opendir('.legit/branches');
for await (const entry of dir) {
  console.log(entry.name);
}
await dir.close();
```

### `mkdir(dirPath: string, options?: MakeDirectoryOptions | Mode): Promise<void>`

Creates a directory. If creating a directory in a branch path (`.legit/branches/{branch}/...`), it will create a commit.

**Parameters**:

- **dirPath** (string): Path to the directory to create
- **options** (optional): Options object or mode number
  - `recursive`: Create parent directories if needed (default: `false`)
  - `mode`: Directory permissions (default: `0o777`)

**Example**:
```typescript
// Create a directory in a branch (creates a commit)
await legitFs.promises.mkdir('.legit/branches/main/src/components', {
  recursive: true,
});
```

### `readdir(dirPath: PathLike, options?: any): Promise<string[]>`

Reads the contents of a directory.

**Parameters**:

- **dirPath** (PathLike): Path to the directory
- **options** (optional): Options object
  - `encoding`: Character encoding (default: `'utf8'`)
  - `withFileTypes`: Return `Dirent` objects instead of strings (default: `false`)
  - `recursive`: Recursively read subdirectories (default: `false`)

**Returns**: `Promise<string[]>` - Array of directory entry names

**Example**:
```typescript
const files = await legitFs.promises.readdir('.legit/branches/main/src');
console.log(files); // ['index.ts', 'utils.ts', 'components']
```

### `open(filePath: string, flags: string, mode?: number): Promise<CompositFsFileHandle>`

Opens a file and returns a file handle.

**Parameters**:

- **filePath** (string): Path to the file
- **flags** (string): File system flags:
  - `'r'`: Open for reading (file must exist)
  - `'w'`: Open for writing (creates file if it doesn't exist, truncates if it does)
  - `'a'`: Open for appending (creates file if it doesn't exist)
  - `'x'`: Exclusive creation (fails if file exists)
  - Combinations: `'r+'`, `'w+'`, `'a+'`, `'wx'`, `'ax'`
- **mode** (optional, number): File permissions (default: `0o666`)

**Returns**: `Promise<CompositFsFileHandle>` - A file handle

**Example**:
```typescript
const handle = await legitFs.promises.open('.legit/branches/main/src/index.ts', 'r');
// Use handle for reading/writing
await handle.close();
```

### `stat(path: PathLike, opts?: { bigint?: boolean }): Promise<Stats | BigIntStats>`

Gets file or directory statistics.

**Parameters**:

- **path** (PathLike): Path to the file or directory
- **opts** (optional): Options object
  - `bigint`: Return `BigIntStats` instead of `Stats` (default: `false`)

**Returns**: `Promise<Stats | BigIntStats>` - File statistics

**Example**:
```typescript
const stats = await legitFs.promises.stat('.legit/branches/main/src/index.ts');
console.log(stats.size); // File size in bytes
console.log(stats.isFile()); // true
```

### `lstat(path: PathLike, opts?: { bigint?: boolean }): Promise<Stats | BigIntStats>`

Gets file or directory statistics (does not follow symbolic links).

**Parameters**: Same as `stat()`

**Returns**: `Promise<Stats | BigIntStats>` - File statistics

### `link(existingPath: PathLike, newPath: PathLike): Promise<void>`

Creates a hard link. **Note**: Currently throws "not implemented" error.

### `readlink(path: PathLike, options?: ObjectEncodingOptions | BufferEncoding | null): Promise<any>`

Reads the value of a symbolic link. **Note**: Currently throws "not implemented" error.

### `unlink(filePath: PathLike): Promise<void>`

Deletes a file. If deleting from a branch path, it will create a commit.

**Parameters**:

- **filePath** (PathLike): Path to the file to delete

**Example**:
```typescript
// Delete a file from a branch (creates a commit)
await legitFs.promises.unlink('.legit/branches/main/src/old-file.ts');
```

### `rename(oldPath: PathLike, newPath: PathLike): Promise<void>`

Renames or moves a file or directory. Supports cross-filesystem moves.

**Parameters**:

- **oldPath** (PathLike): Current path
- **newPath** (PathLike): New path

**Example**:
```typescript
// Rename a file in a branch (creates a commit)
await legitFs.promises.rename(
  '.legit/branches/main/src/old-name.ts',
  '.legit/branches/main/src/new-name.ts'
);
```

### `rmdir(dirPath: PathLike, options?: RmDirOptions): Promise<void>`

Removes a directory.

**Parameters**:

- **dirPath** (PathLike): Path to the directory
- **options** (optional): Options object
  - `recursive`: Remove directory recursively (default: `false`)
  - `maxRetries`: Maximum retry attempts (default: `0`)
  - `retryDelay`: Delay between retries in milliseconds (default: `100`)

**Example**:
```typescript
// Remove a directory
await legitFs.promises.rmdir('.legit/branches/main/src/old-dir', {
  recursive: true,
});
```

### `symlink(target: PathLike, path: PathLike, type?: string | null): Promise<void>`

Creates a symbolic link. **Note**: Currently throws "not implemented" error.

### `readFile(path: PathOrFileDescriptor, options?: ReadFileOptions | BufferEncoding): Promise<Buffer | string>`

Reads the entire contents of a file.

**Parameters**:

- **path** (PathOrFileDescriptor): Path to the file or file descriptor
- **options** (optional): Options object or encoding string
  - `encoding`: Character encoding (e.g., `'utf8'`, `'utf-8'`)
  - `flag`: File system flags (default: `'r'`)

**Returns**:

- `Promise<Buffer>` if no encoding is specified
- `Promise<string>` if encoding is specified

**Example**:
```typescript
// Read as string
const content = await legitFs.promises.readFile(
  '.legit/branches/main/src/index.ts',
  'utf8'
);

// Read as buffer
const buffer = await legitFs.promises.readFile(
  '.legit/branches/main/src/index.ts'
);
```

### `writeFile(file: PathOrFileDescriptor, data: string | Buffer | Uint8Array, options?: WriteFileOptions | BufferEncoding): Promise<void>`

Writes data to a file. If writing to a branch path, it will create a commit.

**Parameters**:

- **file** (PathOrFileDescriptor): Path to the file or file descriptor
- **data** (string | Buffer | Uint8Array): Data to write
- **options** (optional): Options object or encoding string
  - `encoding`: Character encoding (default: `'utf8'`)
  - `mode`: File permissions (default: `0o666`)
  - `flag`: File system flags (default: `'w'`)

**Example**:
```typescript
// Write to a branch file (creates a commit automatically)
await legitFs.promises.writeFile(
  '.legit/branches/main/src/index.ts',
  'export const hello = "world";'
);
```

### `getFilehandle(fd: number): CompositFsFileHandle | undefined`

Gets a file handle by file descriptor.

**Parameters**:

- **fd** (number): File descriptor

**Returns**: `CompositFsFileHandle | undefined` - The file handle, or `undefined` if not found

## See Also

- [Virtual Endpoints](/docs/api/virtual-endpoints) - Working with `.legit` paths
- [LegitFs Instance](/docs/api/legitFs-instance) - Instance properties and methods

