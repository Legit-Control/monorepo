# @legit-sdk/core

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
