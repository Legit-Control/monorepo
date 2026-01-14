---
'@legit-sdk/nfs-serve': minor
'@legit-sdk/core': minor
---

Major Changes

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
