# NFS Server Implementation

An implementation of an NFS (Network File System) version 3 server according to [RFC 1813](https://datatracker.ietf.org/doc/html/rfc1813).

## Features

- Full implementation of all 22 NFS v3 procedures
- Mount protocol support
- Exposes local directory as a network-accessible file system
- Compatible with standard NFS clients

## Mounting the NFS Share

### macOS

```bash
mount_nfs -o nolocks,vers=3,tcp,rsize=131072,actimeo=1,port=2049,mountport=2049 localhost:/ /path/to/mount/point
```

Example:
```bash
mount_nfs -o nolocks,vers=3,tcp,rsize=131072,actimeo=3,port=2049,mountport=2049 localhost:/ /Users/martinlysk/nfs-mount
```

### Linux

```bash
mount -t nfs -o vers=3,tcp,nolock localhost:/ /path/to/mount/point
```

## Development

### Prerequisites

- Node.js 16+
- npm or pnpm

### Setup

Install dependencies:

```bash
pnpm install
```

### Running the Server

Start the NFS server:

```bash
pnpm start
```

By default, the server exposes the `testmount` directory at the project root.

### Testing

Run tests:

```bash
pnpm test
```

## Technical Details

### Implemented NFS v3 Procedures

- **NULL (0)**: No-op procedure for verifying connectivity
- **GETATTR (1)**: Retrieves file attributes
- **SETATTR (2)**: Sets file attributes
- **LOOKUP (3)**: Looks up a filename
- **ACCESS (4)**: Checks access permissions
- **READLINK (5)**: Reads from a symbolic link
- **READ (6)**: Reads data from a file
- **WRITE (7)**: Writes data to a file
- **CREATE (8)**: Creates a new file
- **MKDIR (9)**: Creates a new directory
- **SYMLINK (10)**: Creates a symbolic link
- **MKNOD (11)**: Creates a special device
- **REMOVE (12)**: Removes a file
- **RMDIR (13)**: Removes a directory
- **RENAME (14)**: Renames a file or directory
- **LINK (15)**: Creates a hard link
- **READDIR (16)**: Lists directory contents
- **READDIRPLUS (17)**: Lists directory contents with file attributes
- **FSSTAT (18)**: Retrieves file system statistics
- **FSINFO (19)**: Retrieves file system information
- **PATHCONF (20)**: Retrieves POSIX pathconf information
- **COMMIT (21)**: Commits cached data to stable storage

### Architecture

Each NFS procedure is implemented in its own file in the `src/rpc/nfs/procedures` directory. The main entry point is `handleNfsRequest.ts`, which dispatches incoming requests to the appropriate procedure handler.

The server uses a TCP socket to receive NFS requests and send responses. The protocol is implemented according to the ONC RPC (Remote Procedure Call) specification described in RFC 1831.

### Debugging

The server includes extensive logging for debugging purposes. Each NFS procedure logs detailed information about the request and response, including timestamps and client information.

## NFS Client Caching

NFS clients typically implement caching to improve performance. This means that not every client operation will result in a request to the server. For example, after a directory listing is retrieved, subsequent `ls` commands may not generate new NFS requests if the client still has the information cached.

To force a client to refresh its cache, you can:

1. Use mount options like `actimeo=n` to set cache timeout in seconds
2. Use `noac` mount option to disable attribute caching entirely
3. Use commands like `touch` to modify files and directories

## Known Limitations

- The implementation focuses on compatibility rather than performance
- File locking is not fully implemented
- Security features like Kerberos authentication are not implemented
- Some clients may have specific requirements or expectations not fully addressed

## License

MIT





