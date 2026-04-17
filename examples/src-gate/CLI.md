# src-gate CLI

A CLI tool that provides access to git repositories through a virtual NFS mount. Similar interface to [opensrc](https://github.com/vercel-labs/opensrc), but uses virtual filesystem mounting instead of cloning.

## Installation

```bash
npm install -g src-gate
```

## Quick Start

```bash
# Start the NFS server
src-gate start

# Get the mounted path for a repository
src-gate path vercel/next.js

# Use with any tool
rg "parse" $(src-gate path vercel/next.js)
cat $(src-gate path zod)/src/types.ts
find $(src-gate path pypi:requests) -name "*.py"
```

## Commands

### `src-gate path [packages...]`

Print the absolute path to mounted source (mounts on demand if needed). This is the primary command and follows the same interface as opensrc.

```bash
# Single package
src-gate path zod

# Multiple packages
src-gate path zod react next

# GitHub repo
src-gate path vercel/next.js

# PyPI package
src-gate path pypi:requests

# crates.io package
src-gate path crates:serde

# With version specification
src-gate path zod@3.22.0
src-gate path owner/repo@v1.0.0
src-gate path owner/repo#main
```

**Options:**
- `--cwd <path>` - Working directory for lockfile version resolution (npm only)
- `--verbose` - Show progress during mount/fetch
- `--path <path>` - Base path for src-gate data (default: `~/src-gate`)

**Output:**
- Prints path to stdout (for subshell capture)
- Progress/errors go to stderr

### `src-gate list`

List all globally cached sources.

```bash
# Human-readable output
src-gate list

# JSON output
src-gate list --json
```

**Options:**
- `--json` - Output as JSON
- `--path <path>` - Base path for src-gate data

### `src-gate remove [packages...]`

Remove cached source code for packages or repos.

```bash
src-gate remove zod
src-gate remove vercel/next.js
src-gate rm pypi:requests
```

**Options:**
- `--path <path>` - Base path for src-gate data

### `src-gate clean`

Remove all cached packages and/or repos.

```bash
# Remove everything
src-gate clean

# Only remove packages (all registries)
src-gate clean --packages

# Only remove repos
src-gate clean --repos

# Only remove npm packages
src-gate clean --npm

# Only remove PyPI packages
src-gate clean --pypi

# Only remove crates.io packages
src-gate clean --crates
```

**Options:**
- `--packages` - Only remove packages (all registries)
- `--repos` - Only remove repos
- `--npm` - Only remove npm packages
- `--pypi` - Only remove PyPI packages
- `--crates` - Only remove crates.io packages
- `--path <path>` - Base path for src-gate data

### `src-gate start`

Start the src-gate NFS server (unique to src-gate).

```bash
# Start with default settings
src-gate start

# Start with custom base path
src-gate start --path ~/my-src-gate

# Start with specific port
src-gate start --port 14200
```

**Options:**
- `--path <path>` - Base path for src-gate data (default: `~/src-gate`)
- `--port <number>` - Port for NFS server (default: first free port from 13618)
- `--verbose` - Show detailed server logs

### `src-gate stop`

Stop the src-gate NFS server (unique to src-gate).

```bash
src-gate stop
```

**Options:**
- `--path <path>` - Base path for src-gate data

### `src-gate status`

Check the status of the src-gate server (unique to src-gate).

```bash
src-gate status
```

**Options:**
- `--path <path>` - Base path for src-gate data

## Supported Registries

| Registry | Prefix | Example |
|----------|--------|---------|
| npm | _(default)_ or `npm:` | `src-gate path zod` |
| PyPI | `pypi:`, `pip:`, `python:` | `src-gate path pypi:requests` |
| crates.io | `crates:`, `cargo:`, `rust:` | `src-gate path crates:serde` |
| GitHub | `owner/repo` or URL | `src-gate path vercel/next.js` |
| GitLab | `gitlab:` or URL | `src-gate path gitlab:owner/repo` |
| Bitbucket | `bitbucket:` or URL | `src-gate path bitbucket:owner/repo` |

## How It Works

1. **Server Start**: `src-gate start` launches an NFS server with a virtual filesystem
2. **Mounting**: The virtual filesystem is mounted at `~/src-gate/repos/`
3. **Path Resolution**: `src-gate path <pkg>` returns the mounted path for a package
4. **On-Demand Access**: When you access a path, the system fetches content via git smart protocol
5. **Caching**: Repositories are cached in `~/src-gate/storage/bookmarks/`

## Directory Structure

```
~/src-gate/                    # Base directory
├── storage/                   # Real folder for cached data
│   └── bookmarks/             # Bookmarked (checked out) repositories
│       └── github.com/
│           └── username/
│               └── reponame/  # Cloned repository
└── repos/                     # NFS mount point (virtual filesystem)
    └── github.com/
        └── username/
            └── reponame/      # Virtual folder served via git protocol
                └── path/      # Files served from git tree
```

## Environment Variables

- `SRC_GATE_HOME` - Override default base path (default: `~/src-gate`)

## Comparison with opensrc

| Feature | opensrc | src-gate |
|---------|---------|----------|
| **Access Method** | Clones repositories | Virtual filesystem via NFS |
| **Storage** | `~/.opensrc/` | `~/src-gate/` |
| **Server** | No server required | Requires NFS server (`start`/`stop`) |
| **Commands** | `path`, `list`, `remove`, `clean` | Same + `start`, `stop`, `status` |
| **Package Resolution** | Registry APIs + cloning | Virtual filesystem + git protocol |
| **Use Case** | One-time source access | Persistent virtual filesystem |

## Implementation Status

**TODO:** The following features need to be implemented:

- [ ] Package spec parsing (npm:, pypi:, crates:, owner/repo, URLs)
- [ ] Version resolution from lockfiles (package-lock.json, pnpm-lock.yaml, yarn.lock)
- [ ] Path resolution for different registry types
- [ ] Server status checking (PID file, mount status)
- [ ] Cache scanning and metadata reading
- [ ] Remove/clean operations
- [ ] NFS server start/stop integration
- [ ] On-demand mounting/fetching
- [ ] Progress reporting for --verbose flag

## Development

```bash
# Build the CLI
pnpm run build

# Run in development mode
tsx bin/src-gate.ts --help

# Test the CLI
node dist/src-gate.js path --help
```

## License

ISC
