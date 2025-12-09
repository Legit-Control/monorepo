---
'@legit-sdk/core': patch
---

- Adds withFileTypes option to readdir
- root folder in legitfs reflects the current user branch (controllable via .legit/currentBranch)
- branch namespacing git branch names like "branch/name.with.dot" is represented in legit as branch.name%E2with%E2dot
