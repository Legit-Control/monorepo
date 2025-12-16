# @legit/nfs-serve

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
