# @legit/nfs-serve

## 0.3.1

### Patch Changes

- a3c356e: - Enhanced the create handler in createAsyncNfsHandler.ts to properly apply file attributes (mode, size, atime, mtime) during file creation, improving compatibility with NFS clients and file system semantics.
  - reduces log noise
  - Improved error reporting in directory reading operations to include the error object for better diagnostics.

## 0.3.0

### Minor Changes

- Major Changes
  - Routing Architecture Refactor
    - Moved PathRouter and related types to compositeFs/router/ subdirectory
    - Removed deprecated LegitPathRouter implementation
    - Added mergeLegitRouteFolders() utility for merging route configurations
  - Virtual File System Restructuring
    - Moved CompositeSubFsAdapter to subsystems/git/virtualFiles/
    - Removed deprecated virtual files: gitStatusVirtualFile, gitCompareVirtualFile
    - Disabled gitBranchTipVirtualFile (marked as TODO)
    - Removed getThreadName utility operation
  - New SimpleMemorySubFs Implementation
    - Added base-simple-sub-fs.ts - new abstract base class for simple in-memory filesystem adapters
    - Added SimpleMemorySubFs.ts - concrete implementation with full test coverage
    - Added toDirEntry.ts utility for directory entry conversion
  - Enhanced Route Configuration
    - openLegitFs() now accepts routeOverrides parameter for customizing virtual file routes
    - Git storage moved from function parameter to adapter properties
    - Simplified route configuration structure in legitfs.ts
  - Exports Cleanup
    - Removed exports for PassThroughSubFs (deprecated)
    - Updated exports to reflect new file structure
    - Added exports for new simple subsystem implementations
  - Bug Fixes
    - Fixed stale file handler bug in NFS layer
    - Improved error messages with path context

  Bug Fixes
  - NFS Connection Management
    - Fixed NFS shutdown to ensure no outstanding connections remain
    - Added proper file handle cleanup with close() calls after write operations
    - Improved error messages with path information for commit failures
  - Write Operation Improvements
    - File handles now properly closed after stable writes (stableHow !== 0)
    - Better resource cleanup to prevent connection leaks

## 0.2.2

### Patch Changes

- Update license

## 0.2.1

### Patch Changes

- 23fc937: Update license

## 0.2.0

### Minor Changes

- 88159bc: SDK Improvements
  - Added withFileTypes option to readdir operations
  - Enhanced virtual file system handling
  - Improved debugging and logging capabilities
  - Route configuration moved to legitfs core
  - Branch namespacing: Complex branch names (branch/name.with.dot) are URL-encoded
  - Current branch file system support via .legit/currentBranch
  - Improved branch folder listing and navigation
  - Enhanced compare and branch operations

  NFS Server Enhancements
  - Improved logging and main process integration
  - Better server lifecycle management
  - Enhanced stability for mount/unmount operations

## 0.1.0

### Minor Changes

- c63f02e: NFS server implementation
  - NFS v3 protocol server with RPC support
  - Full implementation of all NFS procedures (READ, WRITE, CREATE, REMOVE,
    etc.)
  - Mount protocol handling
  - Comprehensive test suite with 8 test files covering:
    - Basic file operations
    - Directory operations
    - Advanced file operations
    - Concurrency and performance
    - Error handling edge cases
    - Transaction consistency
    - State persistence
