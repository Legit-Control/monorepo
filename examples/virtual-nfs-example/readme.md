# Virtual NFS Example

A simplified example that serves an in-memory filesystem via NFS, demonstrating the use of `CompositeFs`.

## Overview

This project demonstrates how to:

1. Create an in-memory filesystem using `SimpleMemorySubFs`
2. Serve it via NFS using `CompositeFs` and the NFS server
3. Mount and explore the virtual filesystem

**Key difference from the full Legit system**: This is a simplified version without Git, branches, or session management - perfect for learning and experimentation.

## Architecture

### Components

1. **`bin/createFs.js`** - Filesystem creation
   - `createSimpleFs()` - Creates a CompositeFs with in-memory storage
   - `createDemoFs()` - Creates a demo filesystem with sample project structure

2. **`bin/start-server.js`** - Main entry point
   - Creates the in-memory filesystem
   - Starts the NFS server in the main thread (not a worker)
   - Mounts the filesystem
   - Keeps the server running for interactive exploration

### Filesystem Structure

The demo filesystem includes:

```
/
├── README.md
├── package.json
├── src/
│   ├── index.ts
│   ├── greeting.ts
│   └── utils/
│       └── helpers.ts
├── tests/
│   └── greeting.test.ts
└── .git/
    ├── config
    └── HEAD
```

## Usage

### Start the server (interactive mode)

The server will start and keep running until you press Ctrl+C:

```bash
node bin/start-server.js
```

This will:

1. Create an in-memory filesystem with demo data
2. Start the NFS server on an available port (starting from 13617)
3. Mount the filesystem at `./virtual-nfs-mount`
4. Keep the server running for you to explore

### Custom mount point

```bash
node bin/start-server.js --mount-path ~/my-mount
```

### Custom port

```bash
node bin/start-server.js --port 20000
```

### Custom log file

```bash
node bin/start-server.js --log-file my-nfs.log
```

### Debugging

To debug the NFS server, use Node.js's built-in inspector flags:

```bash
# Start inspector (server starts immediately)
node --inspect=9229 bin/start-server.js

# Start inspector and break at startup (waits for debugger to attach)
node --inspect-brk=9229 bin/start-server.js
```

Then attach your debugger (Chrome DevTools, VS Code, etc.) to `ws://127.0.0.1:9229`.

### View logs

The server logs all operations to a file (default: `nfs-server.log`):

```bash
tail -f nfs-server.log
```

## How It Works

### 1. Filesystem Creation (`createFs.js`)

```javascript
// Create SimpleMemorySubFs with optional initial data
const memorySubFs = new SimpleMemorySubFs({
  name: 'memory-storage',
  rootPath: '/',
  initialData: {
    'file.txt': 'content',
    folder: {
      'nested.txt': 'nested content',
    },
  },
});

// Wrap in CompositeFs
const compositeFs = new CompositeFs({
  name: 'simple-fs',
  rootPath: '/',
  routes: {
    '[[...relativePath]]': memorySubFs, // All paths go to memory
  },
});
```

### 2. NFS Server Setup

```javascript
// Create file handle manager
const fhM = createFileHandleManager(servePoint, fileHandleId);

// Create NFS handlers
const asyncHandlers = createAsyncNfsHandler({
  fileHandleManager: fhM,
  asyncFs: compositeFs, // Our in-memory filesystem
});

// Create and start NFS server
const nfsServer = createNfs3Server(asyncHandlers);
nfsServer.listen(port, () => {
  console.log('NFS server ready');
});
```

### 3. Main Thread Execution

The NFS server runs directly in the main thread (not a worker process):

- ✅ Easier debugging with direct stack traces
- ✅ Simpler signal handling (SIGINT/SIGTERM)
- ✅ No inter-process communication overhead
- ✅ Direct control over server lifecycle

## Customization

### Modify the Demo Filesystem

Edit `createDemoFs()` in `bin/createFs.js`:

```javascript
export async function createCustomFs() {
  return createSimpleFs({
    initialData: {
      'my-file.txt': 'My content',
      'my-project': {
        src: {
          'main.ts': '// my code',
        },
      },
    },
  });
}
```

Then update `start-server.js` to use `createCustomFs()` instead of `createDemoFs()`.

### Use Your Own Data

```javascript
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json'));

export async function createFromRealFs() {
  return createSimpleFs({
    initialData: {
      'package.json': JSON.stringify(packageJson),
      // ... more files
    },
  });
}
```
qww
´
## Troubleshooting

### Port already in use

The server automatically finds the next available port starting from 13617.

### Mount point already mounted

The server tries to unmount before mounting. If it fails:

```bash
umount -f ~/virtual-nfs-mount  # Force unmount
```

### Server doesn't start

Check the log file:

```bash
cat nfs-server.log
```

### Can't see files in mount

1. Check if the mount succeeded: `mount | grep virtual-nfs-mount`
2. Check server logs: `tail -f nfs-server.log`
3. Try listing files: `ls -la ~/virtual-nfs-mount`

## Development

### Project Structure

```
virtual-nfs-example/
├── bin/
│   ├── start-server.js      # Main entry point
│   ├── createFs.js           # Filesystem creation
│   └── nfs-server-worker.js  # (Unused - was for worker process)
└── README.md                 # This file
```

### Adding Features

1. **Add new routes** in `createFs.js`:

   ```javascript
   routes: {
     '[[...relativePath]]': memorySubFs,
     'special': specialHandler,  // Custom handler
   }
   ```

2. **Add custom SubFS**:

   ```javascript
   import { MyCustomSubFs } from './my-custom-subfs.js';

   routes: {
     'custom': new MyCustomSubFs({ ... }),
   }
   ```
