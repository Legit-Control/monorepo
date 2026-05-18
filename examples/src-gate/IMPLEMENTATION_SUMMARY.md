# src-gate CLI Implementation Summary

## What Was Created

A new CLI tool `src-gate` that mimics the interface of [opensrc](https://github.com/vercel-labs/opensrc) but uses a virtual NFS filesystem approach instead of cloning repositories.

## Files Created

### 1. `/Users/martinlysk/legit/monorepo/examples/src-gate/bin/src-gate.ts`
The main CLI entry point with the following commands:

**opensrc-compatible commands:**
- `path [packages...]` - Print absolute path to mounted source (mounts on demand)
- `list [--json]` - List all cached sources
- `remove [packages...]` - Remove cached sources
- `clean [options]` - Clean cache by type

**src-gate specific commands:**
- `start` - Start the NFS server
- `stop` - Stop the NFS server
- `status` - Check server status

### 2. `/Users/martinlysk/legit/monorepo/examples/src-gate/CLI.md`
Complete documentation of the CLI interface including:
- Installation instructions
- Command reference
- Usage examples
- Comparison with opensrc
- Implementation TODOs

### 3. Updated `/Users/martinlysk/legit/monorepo/examples/src-gate/package.json`
- Added `src-gate` to bin entries pointing to `dist/src-gate.js`

### 4. Updated `/Users/martinlysk/legit/monorepo/examples/src-gate/vite.config.ts`
- Modified to build both `start-server.js` and `src-gate.js`
- Added proper external dependencies for src-gate
- chmod plugin handles both executables

## Key Features

### Interface Compatibility with opensrc

The CLI follows the exact same interface as opensrc:

```bash
# Get path (works in subshells)
src-gate path zod
src-gate path vercel/next.js
src-gate path pypi:requests

# Use with other tools
rg "parse" $(src-gate path zod)
cat $(src-gate path zod)/src/types.ts

# List sources
src-gate list
src-gate list --json

# Remove sources
src-gate remove zod
src-gate clean --npm
```

### src-gate Extensions

Additional commands for managing the NFS server:

```bash
# Start/stop the virtual filesystem
src-gate start
src-gate stop
src-gate status
```

## Implementation Structure

### TODO Markers

The code includes detailed TODO comments for all functionality that needs implementation:

1. **Package Parsing** (`parsePackageSpec`)
   - Parse registry prefixes (npm:, pypi:, crates:)
   - Parse owner/repo format
   - Parse GitHub/GitLab/Bitbucket URLs
   - Parse version specifications (@version, #branch)

2. **Path Resolution** (`getMountedPath`)
   - Handle different registry types
   - Support version-specific paths
   - Map package specs to filesystem paths

3. **Server Management** (`isServerRunning`)
   - Check PID file
   - Verify mount status
   - Check process existence

4. **Cache Management** (`getCachedSources`, `removeCachedSource`, `cleanCache`)
   - Scan storage directory
   - Read bookmark metadata
   - Remove bookmarks and cached data
   - Filter by registry type

5. **Command Implementation**
   - Implement actual mounting/fetching logic
   - Version resolution from lockfiles
   - Progress reporting with --verbose flag
   - NFS server start/stop integration

## Testing

The CLI builds successfully and all commands are properly registered:

```bash
# Build
pnpm run build

# Test help
node dist/src-gate.js --help
node dist/src-gate.js path --help
node dist/src-gate.js start --help

# Both executables are built with proper permissions
ls -la dist/
# -rwxr-xr-x  src-gate.js
# -rwxr-xr-x  start-server.js
```

## Next Steps

To complete the implementation, you need to:

1. **Implement helper functions** (marked with TODO in src-gate.ts:62-177)
   - Package spec parsing
   - Path resolution logic
   - Server status checking
   - Cache scanning

2. **Integrate with existing NFS server**
   - Import start-server.ts functions in start/stop commands
   - Handle server lifecycle management
   - Manage graceful shutdown

3. **Implement mounting logic**
   - Connect path command to virtual filesystem
   - Handle on-demand mounting/fetching
   - Support version resolution from lockfiles

4. **Test with real packages**
   - Test with npm packages
   - Test with GitHub repos
   - Test with other registries (pypi, crates)

## Architecture Benefits

The clear separation between interface and implementation allows you to:

1. **Develop incrementally** - The CLI structure is complete, implement functions one by one
2. **Test independently** - Each helper function can be tested separately
3. **Maintain compatibility** - Interface matches opensrc exactly for easy migration
4. **Extend functionality** - Easy to add new registries or features
