# Gitaway - Virtual Git Gateway via NFS

Gitaway is a virtual filesystem that provides a gateway to git repositories through an NFS mount on macOS. It presents a sophisticated folder structure that allows browsing, cloning, and bookmarking GitHub repositories through a native file interface.

## Architecture

Gitaway uses the `@legit-sdk/nfs-serve` package to create a virtual filesystem (VFS) that can be mounted on macOS. The VFS implements the Node.js fs promises API, allowing it to serve as a backing store for the NFS server.

## Folder Structure

When mounted, gitaway provides the following virtual folder structure:

```
/gitaway/
├── github.com/
│   ├── a/                          # First-level shard: a-z0-9 (36 folders)
│   │   ├── a/                      # Second-level shard: a-z0-9- (37 folders)
│   │   │   ├── a/                  # Third-level shard: a-z0-9- (37 folders)
│   │   │   │   ├── _repos/         # Short usernames (≤3 chars)
│   │   │   │   │   ├── aa/
│   │   │   │   │   │   └── repo1/.gateway-bookmarked/no
│   │   │   │   │   └── ab/
│   │   │   │   │       └── repo2/.gateway-bookmarked/no
│   │   │   │   └── tin-lysk/       # Long usernames (>3 chars): remainder after first 3 chars
│   │   │   │       └── my-repo/.gateway-bookmarked/no
│   │   │   └── _repos/             # Alternative: short usernames at level 2
│   │   │       └── aa/
│   │   │           └── repo3/.gateway-bookmarked/no
│   │   └── _repos/                 # Alternative: short usernames at level 1
│   │       └── a/
│   │           └── repo4/.gateway-bookmarked/no
│   ├── m/
│   │   ├── a/
│   │   │   ├── r/
│   │   │   │   └── tin-lysk/
│   │   │   │       ├── my-repo/.gateway-bookmarked/no
│   │   │   │       └── about-me/.gateway-bookmarked/no
│   │   │   └── _repos/
│   │   │       └── mar/
│   │   │           └── test-repo/.gateway-bookmarked/no
│   │   └── _repos/
│   │       └── ma/
│   │           └── another-repo/.gateway-bookmarked/no
│   └── z/
│       └── ...
└── bookmarked/
    └── github.com/
        └── martin-lysk/
            └── my-repo  (symlink → /gitaway/github.com/m/a/r/tin-lysk/my-repo)
```

### Key Design Elements

#### 1. Dynamic Sharded Path Structure
GitHub repositories are organized using a **3-level sharded path structure**:

**For usernames with 4+ characters:**
- `github.com/m/a/r/tin-lysk/my-repo`
- Breaks the first 3 characters into separate folders
- Remaining part of username becomes the 4th level
- Pattern: `{domain}/{user[0]}/{user[1]}/{user[2]}/{remainder}/{repo-name}`

**For usernames with 1-3 characters:**
- `github.com/_repos/ab/my-repo`
- Uses special `_repos` folder
- Pattern: `{domain}/_repos/{username}/{repo-name}`

The `_repos` folder appears at multiple levels for flexibility:
- Level 1: `github.com/_repos/` - for 1-char usernames
- Level 2: `github.com/a/_repos/` - for 2-char usernames starting with "a"
- Level 3: `github.com/a/b/_repos/` - for 3-char usernames starting with "ab"
- Level 4: `github.com/a/b/c/_repos/` - alternative location for 3-char usernames

**Character Sets:**
- **First level**: `a-z0-9` (36 folders, no dash since it can't start a username)
- **Second & Third levels**: `a-z0-9-` (37 folders, dash allowed in middle of username)

#### 2. Dynamic User Discovery
The filesystem dynamically discovers users through the `getUsers(prefix)` function:
- Given a prefix (e.g., "mar"), returns matching usernames (e.g., ["martin-lysk", "mario", "mark", ...])
- This will be replaced with actual GitHub API calls in production
- Currently uses dummy data for testing

#### 3. Repository State
Each repository contains a `.gateway-bookmarked` folder with a single symlink:
- The symlink is named `no` when the repo is NOT bookmarked
- When deleted, it becomes `yes` (indicating the repo is bookmarked)
- This allows bookmarking state to be tracked through standard file operations

#### 4. Bookmarked Section
The `/bookmarked/` section provides quick access to bookmarked repositories:
- Contains symlinks to bookmarked repositories
- Uses the full username (not sharded) for easier navigation
- Symlinks point back to the sharded path structure

## How It Works

### Exploring the Structure
1. Navigate to `/gitaway/github.com/` - see `a-z0-9` (first character options)
2. Navigate to `/gitaway/github.com/m/` - see `a-z0-9-` and `_repos` (second character options)
3. Navigate to `/gitaway/github.com/m/a/` - see `a-z0-9-` and `_repos` (third character options)
4. Navigate to `/gitaway/github.com/m/a/r/` - see matching usernames (e.g., "tin-lysk") and `_repos`
5. Navigate to `/gitaway/github.com/m/a/r/tin-lysk/` - see repositories for that user

### Accessing Short Usernames
1. Navigate to `/gitaway/github.com/_repos/` - see all 1-3 character usernames
2. Navigate to `/gitaway/github.com/a/_repos/` - see 2-3 character usernames starting with "a"
3. Navigate to `/gitaway/github.com/a/b/_repos/` - see 3 character usernames starting with "ab"

### Reading a Repository
1. Navigate to `/gitaway/github.com/m/a/r/tin-lysk/my-repo/`
2. The filesystem transparently clones the repository if not already cached
3. Files are served from the local cache

### Bookmarking a Repository
1. Navigate to `/gitaway/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked/`
2. Delete the `no` symlink
3. The filesystem automatically:
   - Creates a `yes` file
   - Adds a symlink in `/bookmarked/github.com/martin-lysk/my-repo`

### Unbookmarking a Repository
1. Navigate to `/gitaway/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked/`
2. Delete the `yes` file
3. The filesystem automatically:
   - Creates a `no` symlink
   - Removes the symlink from `/bookmarked/github.com/martin-lysk/my-repo`

## Implementation Details

### Virtual Filesystem Class
The `GitGateway` class implements the Node.js fs promises API:
- `stat()` - Returns file/directory metadata
- `readdir()` - Lists directory contents (dynamically based on prefix)
- `read()` - Reads file contents from cloned repos
- `unlink()` - Handles bookmark state changes
- `symlink()` - Creates symlinks in bookmarked section

### Dynamic User Discovery
- `getUsers(prefix: string)` - Async function returning usernames with given prefix
- Uses dummy data in current implementation
- Will be replaced with GitHub API calls in production

### State Management
- Repository metadata and bookmark state stored in memory
- Repository clones cached in local filesystem
- Lazy loading: repos only cloned when accessed

### NFS Integration
Uses `@legit-sdk/nfs-serve` to:
- Create NFS handlers from the virtual filesystem
- Serve the filesystem via NFS protocol
- Mount on macOS using standard `mount_nfs` command

## Usage

```bash
# Start the gitaway NFS server
pnpm start --cache-path ./gitaway-cache --mount-path ~/gitaway

# The filesystem is now mounted at ~/gitaway
# Navigate and interact with it like a normal filesystem
cd ~/gitaway/github.com/m/a/r/tin-lysk/my-repo
ls -la

# Explore the sharded structure
cd ~/gitaway/github.com
ls  # Shows: a b c ... z 0 1 ... 9
cd m
ls  # Shows: a b c ... z - 0 1 ... 9 _repos

# Bookmark a repo
cd ~/gitaway/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked
rm no

# Access bookmarked repos
cd ~/gitaway/bookmarked/github.com/martin-lysk/my-repo
```

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
