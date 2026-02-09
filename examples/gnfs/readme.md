# @legit-sdk/gnfs

A CLI tool to serve any filesystem via NFS on macOS. This tool allows you to mount a local directory as an NFS share, making it accessible through the NFS protocol.

## Features

- Serve any local directory via NFS protocol
- Automatic port detection (starts from port 13617)
- Graceful shutdown with proper unmounting
- Built-in mount/unmount functionality
- Configurable mount points and serve paths

## Prerequisites

- macOS (this tool uses macOS-specific NFS mounting commands)
- Node.js 18 or higher

## Installation

```bash
npm install -g @legit-sdk/gnfs
```

## Usage

### Basic Usage

Serve a directory via NFS:

```bash
gnfs --serve-path /path/to/directory
```

This will:
1. Start an NFS server on an available port (starting from 13617)
2. Mount the NFS share to `./virtual-nfs-mount` (default)
3. Keep the server running until you press Ctrl+C

### Advanced Options

```bash
gnfs --serve-path /path/to/directory \
     --mount-path /path/to/mount-point \
     --port 13617 \
     --log-file nfs-server.log
```

#### Options

- `--serve-path <path>` (required): Folder to serve via NFS
- `--mount-path <path>`: Where to mount the filesystem (default: `./virtual-nfs-mount`)
- `--port <number>`: Port for NFS server (default: first free port starting from 13617)
- `--log-file <path>`: Path to NFS server log file (default: `nfs-server.log`)

### Unmounting

To stop the server and unmount the filesystem, press `Ctrl+C`. The tool will:
1. Unmount the NFS share
2. Stop the NFS server
3. Clean up resources

### Debugging

To run the CLI with Node.js debugging enabled:

```bash
NODE_OPTIONS='--inspect-brk' gnfs --serve-path /path/to/directory
```

This will start the debugger and break on the first line. You can then connect to it using:
- Chrome DevTools (navigate to `chrome://inspect`)
- VS Code's debugger
- Any other Node.js debugging client

## Example

```bash
# Serve the current directory
gnfs --serve-path .

# Serve a specific directory with custom mount point
gnfs --serve-path ~/Documents/project \
     --mount-path ~/mnt/nfs-project

# Use a specific port
gnfs --serve-path /tmp/test-folder --port 20000
```

## How It Works

1. The tool starts an NFSv3 server using `@legit-sdk/nfs-serve`
2. It serves the specified directory using the native Node.js filesystem API
3. It mounts the NFS share using macOS's `mount_nfs` command
4. The mounted filesystem appears as a normal directory at the mount point
5. When you stop the tool, it properly unmounts and cleans up

## Limitations

- macOS only (uses macOS-specific `mount_nfs` and `umount` commands)
- The filesystem is served with basic NFSv3 protocol
- No authentication or encryption (use in trusted networks only)

## License

ISC
