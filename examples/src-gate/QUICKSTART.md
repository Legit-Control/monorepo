# Gitaway Quick Start Guide

## Installation & Build

```bash
cd /Users/martinlysk/legit/monorepo/examples/gitaway
pnpm install
pnpm build
```

## Running Gitaway

### Development Mode (with TypeScript)
```bash
pnpm dev -- --cache-path ./gitaway-cache --mount-path ~/gitaway
```

### Production Mode (using built JavaScript)
```bash
node dist/start-server.js --cache-path ./gitaway-cache --mount-path ~/gitaway
```

## What You'll See

When you start gitaway, you'll see output like:

```
Starting Gitaway with options: { cachePath: './gitaway-cache', mountPath: '/Users/yourname/gitaway' }
Creating GitGateway virtual filesystem...
Creating file handle manager...
Creating async NFS handlers...
Creating NFS3 server...
Starting NFS server on port 13618...
NFS server is listening on port 13618
✅ Gitaway filesystem mounted successfully!
📁 Mount point: /Users/yourname/gitaway

📖 Quick start:
   cd /Users/yourname/gitaway/github.com/m/a/r/tin-lysk/my-repo
   ls -la

🔖 Bookmark a repo:
   cd /Users/yourname/gitaway/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked
   rm no  # This will bookmark the repo

📂 Access bookmarked repos:
   cd /Users/yourname/gitaway/bookmarked/github.com/martin-lysk/my-repo

Press Ctrl+C to stop the server and unmount.
```

## Exploring the Filesystem

Once mounted, you can explore the virtual filesystem:

```bash
# List the root directory
ls ~/gitaway
# Output: github.com  bookmarked

# Explore the sharded structure
ls ~/gitaway/github.com
# Output: m  p

ls ~/gitaway/github.com/m
# Output: a

ls ~/gitaway/github.com/m/a
# Output: r

ls ~/gitaway/github.com/m/a/r
# Output: tin-lysk

ls ~/gitaway/github.com/m/a/r/tin-lysk
# Output: my-repo  about-me

# Check bookmark state
ls ~/gitaway/github.com/m/a/r/tin-lysk/my-repo
# Output: .gateway-bookmarked

ls ~/gitaway/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked
# Output: no  (a symlink with no target)
```

## Bookmarking a Repository

```bash
# Navigate to the bookmark state directory
cd ~/gitaway/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked

# Delete the 'no' symlink to bookmark the repo
rm no

# The directory now contains 'yes' instead
ls
# Output: yes

# The repo now appears in the bookmarked section
ls ~/gitaway/bookmarked/github.com/martin-lysk
# Output: my-repo

# The bookmarked entry is a symlink pointing to the sharded path
ls -la ~/gitaway/bookmarked/github.com/martin-lysk/my-repo
# Output: ... my-repo -> /gitaway/github.com/m/a/r/tin-lysk/my-repo
```

## Unbookmarking a Repository

```bash
# Navigate to the bookmark state directory
cd ~/gitaway/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked

# Delete the 'yes' file to unbookmark the repo
rm yes

# The directory now contains 'no' again
ls
# Output: no

# The repo is removed from the bookmarked section
ls ~/gitaway/bookmarked/github.com/martin-lysk
# (empty or error)
```

## Stopping the Server

Press `Ctrl+C` in the terminal where gitaway is running. The server will:
1. Unmount the filesystem
2. Close all NFS connections
3. Shut down cleanly

## Project Structure

```
examples/gitaway/
├── bin/
│   └── start-server.ts       # CLI entry point
├── lib/
│   └── git-gateway/
│       ├── git-gateway.ts           # Main filesystem implementation
│       ├── git-gateway-interface.ts # TypeScript interface
│       ├── git-gateway-filehandle.ts # File handle implementation
│       └── index.ts                 # Exports
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.js
└── readme.md

dist/                            # Built JavaScript (created after running pnpm build)
└── start-server.js
```

## How It Works

1. **Virtual Filesystem**: The `GitGateway` class implements the Node.js fs promises API
2. **NFS Server**: The `@legit-sdk/nfs-serve` package creates an NFS server from the virtual filesystem
3. **macOS Mount**: The `mount_nfs` command mounts the NFS share as a local filesystem
4. **File Operations**: When you interact with files/directories, they're handled by the `GitGateway` class

## Current Limitations

- **Read-only**: You can browse and bookmark, but cannot read/write file contents yet
- **Sample Data**: Includes pre-configured sample repos (my-repo, about-me, plate-sdk)
- **No Git Integration**: Git operations (clone/pull/push) not yet implemented
- **macOS Only**: Uses macOS-specific `mount_nfs` command

## Future Enhancements

See readme.md for planned features including:
- Real git repository cloning and file reading
- Write support with automatic commits
- Support for other git hosts (GitLab, Bitbucket)
- Configurable cache management
- Branch and commit browsing

## Troubleshooting

### Port already in use
The server automatically finds an available port starting from 13618. If you need a specific port, use:
```bash
pnpm dev -- --port 12345
```

### Mount point busy
If the mount point already has something mounted, the server will try to unmount it first. If that fails:
```bash
umount -f ~/gitaway
```

### Server doesn't stop
If Ctrl+C doesn't work, you can force unmount:
```bash
umount -f ~/gitaway
```
