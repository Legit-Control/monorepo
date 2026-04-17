# src-gate - Virtual Git Gateway via NFS

`src-gate` is a virtual filesystem that provides a gateway to git repositories through an NFS mount on macOS.

## Architecture

Gitaway uses the `@legit-sdk/nfs-serve` package to create a virtual filesystem (VFS) that can be mounted on macOS. The VFS implements the Node.js fs promises API, allowing it to serve as a backing store for the NFS server.

## Folder Structure

When mounted, gitaway provides the following virtual folder structure:

```
/gitaway/                             # entry point for the application
├── storage/                          # real folder (created when not exisitng)
|  ├── bookmarks/                     # real folder ontains the "checked out repositories"
|  │   └── github.com/                # real folder - empty at the beginnning
|  │        └─── username/            # real folder - created when opened the first time in the virtual folder /gitaway/repos/github.com/username or subfolder
|               └── reponame/         # real folder - created when opened the first time in the virtual folder /gitaway/repos/github.com/username/reponame or subfolder
|                  └── repo           # symlink to /gitaway/repos/github.com/username/reponame/repo - created like ^^
|
|
├── repos/                            # a real folder befor shadowed by nfs mount. created at application start if not exisitng
   ├── github.com/                    # virtual folder serves the list of folder within /gitaway/storage/bookmarks/github.com
   │   └─── username/                 # virtual folder serves the repository list backed by github api
   │      ├── reponame/               # virtual folder serves the repository content via git smart protocol (later utilizing git storage cache)
   │          ├── path/                      # (folder) served from the .git folder using the tree at the current commit or fetches the tree if not cached yet
   │              └─── to/                   # (folder) served from the .git folder using the tree at the current commit or fetches the tree if not cached yet
   │                   └─── file1.md         # (file) served from the .git folder using the blob at the current commit or fetches the blob if not cached yet
   └── config/
      └── github_token                      # file containing a access token
```

### Key Design Elements

## Implementation Details

### Virtual Filesystem Class

The `GitGateway` class implements the Node.js fs promises API:

- `stat()` - Returns file/directory metadata
- `readdir()` - Lists directory contents
- `read()` - Reads file contents from cloned repos
- `unlink()` - Handles bookmark state changes
- `symlink()` - Creates symlinks in bookmarked section
- etc

### State Management

- Repository metadata and bookmark state stored in memory
- Repository clones cached in storage filesystem
- Lazy loading: repos only cloned when accessed and with only=tree filter

### NFS Integration

Uses `@legit-sdk/nfs-serve` to:

- Create NFS handlers from the virtual filesystem
- Serve the filesystem via NFS protocol
- Mount on macOS using standard `mount_nfs` command
- configures the mount to not use direplus to allow `ls folder` in terminal to explore the files without materialization

## Benefits

1. **Native Integration**: Works with any tool that understands filesystems (editors, CLI tools, etc.)
2. **Transparent Git Operations**: No need to manually clone/pull - handled automatically
3. **Efficient Organization**: 3-level sharding prevents directory bloat
4. **Intuitive Bookmarking**: Uses familiar file operations
5. **Quick Access**: Bookmarked section provides shortcuts to favorite repos
6. **Dynamic Discovery**: Users discovered on-demand through API calls
7. **Flexible Short Names**: Multiple `_repos` locations for short usernames

## Future Enhancements

- **GitHub API Integration**: Replace dummy `getUsers()` with actual GitHub API
- **Support for Other Hosts**: GitLab, Bitbucket, etc.
- **Configuration Options**: Cache location, size limits, etc.
- **Automatic Cache Cleanup**: Expire old repository clones
- **Branch Browsing**: View branches and commits as virtual folders
- **Read/Write Support**: Push changes back to git
- **Real-time Updates**: Watch for changes in remote repositories

## Technical Notes

- Built on macOS specifically (uses `mount_nfs`)
- Requires Node.js 18+
- Uses isomorphic-git for git operations
- Virtual filesystem is fully async and promise-based
- Sharding strategy reduces directory entries from millions to ~37 per folder
