---
'@legit-sdk/core': minor
---

Major filesystem and sync architecture improvements

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
