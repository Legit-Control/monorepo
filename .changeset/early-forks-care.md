---
'@legit/nfs-serve': minor
---

NFS server implementation

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
