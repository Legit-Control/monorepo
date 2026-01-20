---
'@legit-sdk/nfs-serve': patch
'@legit-sdk/core': patch
---

- Enhanced the create handler in createAsyncNfsHandler.ts to properly apply file attributes (mode, size, atime, mtime) during file creation, improving compatibility with NFS clients and file system semantics.

- reduces log noise
- Improved error reporting in directory reading operations to include the error object for better diagnostics.
