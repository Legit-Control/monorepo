# @legit-sdk/core

## 0.6.1

### Patch Changes

- a3c356e: - Enhanced the create handler in createAsyncNfsHandler.ts to properly apply file attributes (mode, size, atime, mtime) during file creation, improving compatibility with NFS clients and file system semantics.
  - reduces log noise
  - Improved error reporting in directory reading operations to include the error object for better diagnostics.

## 0.6.0

### Minor Changes

- 8280e67: **Archive loading enhancements:**
  - Added a `clearExisting` option to the `loadArchive` method in `openLegitFs`, allowing the entire `.git` folder to be cleared before loading an archive. This ensures that loading an archive can fully replace the repository state if desired.
  - Updated the archive loading logic to accept a parameter object instead of a bare archive, and modified all relevant tests to use the new API.
  - Added a comprehensive test verifying that `loadArchive` with `clearExisting: true` fully replaces the repository, removing all prior refs and content.

  **Git branch and ref resolution improvements:**
  - Refactored branch and ref resolution in Git virtual file adapters to use a new `tryResolveRef` utility, reducing duplicated error handling and improving robustness when resolving refs
  - Improved error messages and logic when operation branches or base branches do not exist, making failures clearer and easier to debug.

  **Code quality and bug fixes:**
  - Fixed a bug in `PathRouter` where route parameters were incorrectly decoded, which could cause issues with certain URL patterns.
  - Added a guard in `CompositeSubFsAdapter` to handle cases where `storageFs` is not defined, preventing runtime errors for non-Git adapters.
  - Simplified the branches list adapter to avoid unnecessary async calls when listing branch directories.
  - Minor code cleanups and whitespace fixes in Git virtual file adapters.

  These changes collectively improve reliability, test coverage, and maintainability of the composite filesystem's Git integration.

## 0.5.0

### Minor Changes

- 4b1be8e: New Features
  - Archive & Restore Functionality
    - Added saveArchive() method - Creates a compressed portable archive of the entire Legit repository (.git folder)
      - Recursively captures all Git objects, refs, and configuration
      - Encodes binary content as base64 in a JSON manifest
      - Compresses output using pako.deflate() for efficient storage and transfer
      - Returns Uint8Array suitable for file storage or network transmission
    - Added loadArchive() method - Restores a Legit repository from a previously created archive
      - Decompresses and parses the archive manifest
      - Intelligently handles Git references to prevent data loss: - New refs → Added directly to repository
        - Fast-forwardable refs → Updated to new commit
        - Conflicting refs → Created as {branch}-conflict-{uuid} to preserve both versions
      - Skips config files to avoid overriding user-specific settings
      - Safely merges archive data with existing repository state
  - Use Cases
    - Backup & Restore: Complete repository snapshots for disaster recovery
    - Repository Sharing: Transfer repositories between systems without network sync
    - Offline Distribution: Bundle repositories with applications or documentation
    - State Preservation: Save and restore repository state at specific points in time

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

## 0.4.5

### Patch Changes

- This pull request introduces several enhancements and refactorings to the composite filesystem (CompositeFs) architecture, focusing on improving modularity, context-awareness, and extensibility for sub-filesystems (SubFS). The most significant changes include the introduction of operation context propagation, new interfaces for filtering directory entries, and a major refactor of SubFS base classes and adapters. Additionally, it adds configuration and setup for a new CLI tool example and makes some minor cleanup changes.

## 0.4.4

### Patch Changes

- Update esbuild to use forked package name of isomorphic git

## 0.4.3

### Patch Changes

- Redo publishing because of missing build

## 0.4.2

### Patch Changes

- 1bce00e: adds git .ignore on legit initialization

## 0.4.1

### Patch Changes

- Update license
- Updated dependencies
  - @legit-sdk/isomorphic-git@1.34.2

## 0.4.0

### Minor Changes

- changes dependency from iso-git to forked version

### Patch Changes

- 23fc937: Update license
- a22b787: fix wrong serverURl Path
- Updated dependencies
  - @legit-sdk/isomorphic-git@1.34.1

## 0.3.0

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

## 0.2.4

### Patch Changes

- 7e9e64f: - Adds withFileTypes option to readdir
  - root folder in legitfs reflects the current user branch (controllable via .legit/currentBranch)
  - branch namespacing git branch names like "branch/name.with.dot" is represented in legit as branch.name%E2with%E2dot

## 0.2.3

### Patch Changes

- Update server build configuration for ssr use case

## 0.2.2

### Patch Changes

- Add server build without polyfills, root build is for browser use

## 0.2.1

### Patch Changes

- Create user id with UUID

## 0.2.0

### Minor Changes

- c63f02e: Major filesystem and sync architecture improvements
  - Core filesystem changes: Major refactoring of legitfs.ts - renamed
    initLegitFs to openLegitFs with enhanced configuration options
  - New sync infrastructure: Added comprehensive sync service with:
    - createLegitSyncService.ts - renamed/updated from previous version
    - sessionManager.ts - new session management
    - createGitConfigTokenStore.ts - token storage implementation
  - Git subsystem improvements: Enhanced GitSubFs.ts with better virtual
    file handling
  - Composite filesystem updates: Improvements to CompositeFs.ts and file
    handle management

## 0.1.11

### Patch Changes

- chore: small fix of branch path that caused failure in operationsBranch workflow

## 0.1.10

### Patch Changes

- Enable rollback
  - new end points in per branch `.legit` folder
    - operationHead -> read + write (rollback)
    - head -> write (rollback)
  - Operation type (return from operationHistory)
    - added originBranchOid (always points to last change on working branch)

## 0.1.9

### Patch Changes

- Fix readme

## 0.1.8

### Patch Changes

- Add require export path

## 0.1.7

### Patch Changes

- remove readme

## 0.1.6

### Patch Changes

- Update Readme

## 0.1.5

### Patch Changes

- Update license in package.json

## 0.1.4

### Patch Changes

- Improve bundling with rollup for types

## 0.1.3

### Patch Changes

- Update build dist/

## 0.1.2

### Patch Changes

- improve esbuild config and package.json

## 0.1.1

### Patch Changes

- Add files property in package.json, add readme
