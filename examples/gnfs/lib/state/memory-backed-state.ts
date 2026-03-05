import { GnfsInterface } from '../gnfs/gnfs-interface.js';
import { IndexBody } from './index-body.js';
import { BackingStateInterface } from './state-provider.js';

/**
 * Type definitions for the unified file system state where metadata lives directly in the state.
 * Both files and directories have a /meta/ property with their metadata.
 */

// Type alias for file/directory names (strings without '/')
// Note: TypeScript cannot enforce "no slash" constraint at compile time,
// but this documents the intent. Runtime validation should enforce this.
type NoSlash<S extends string> = S extends `${string}/${string}` ? never : S;

type FileName = NoSlash<string>;

interface BaseHeaders {
  ctime: Date;
  mtime: Date;
  atime: Date;
  fileId: number;
}

interface MetaData extends BaseHeaders {
  type: 'file' | 'index' | 'symlink';
  size: number;
}

interface FileNode {
  type: 'file';
  meta: BaseHeaders;
  content: string;
}

interface SymlinkNode {
  type: 'symlink';
  meta: BaseHeaders;
  content: string;
}

interface DirectoryNode {
  type: 'index';
  entries: { [key: FileName]: UnifiedFileSystemNode };
  meta: BaseHeaders;
}

type UnifiedFileSystemNode = FileNode | SymlinkNode | DirectoryNode;

/**
 * Creates a memory-backed state provider for a virtual file system.
 *
 * This function initializes a file system state that stores all metadata and content in memory.
 * It supports files, directories, and symlinks with full metadata tracking (creation time,
 * modification time, access time, and file IDs).
 *
 * @param initialState - The initial root directory state. Defaults to an empty root directory.
 * @returns A BackingStateInterface implementation that can be used with GNFS.
 *
 * @example
 * // Create a memory-backed state with initial content
 * const now = new Date();
 * const state = createMemoryBackedState({
 *   type: 'index',
 *   meta: {
 *     type: 'index',
 *     ctime: now,
 *     mtime: now,
 *     atime: now,
 *     fileId: 0,
 *   },
 *   entries: {
 *     'documents': {
 *       type: 'index',
 *       meta: {
 *         type: 'index',
 *         ctime: now,
 *         mtime: now,
 *         atime: now,
 *         fileId: 1,
 *       },
 *       entries: {
 *         'notes.txt': {
 *           type: 'file',
 *           meta: {
 *             type: 'file',
 *             ctime: now,
 *             mtime: now,
 *             atime: now,
 *             fileId: 2,
 *           },
 *           content: 'Hello, World!',
 *         },
 *       },
 *     },
 *   },
 * });
 */
export const createMemoryBackedState = (
  initialState: DirectoryNode = {
    type: 'index',
    meta: {
      ctime: new Date(),
      mtime: new Date(),
      atime: new Date(),
      fileId: 0,
    },
    entries: {},
  }
): BackingStateInterface => {
  let state: DirectoryNode = initialState;
  let currentFileId = 1;

  function getMeta(path: string): MetaData | null {
    // Navigate to the path
    const segments = path.replace(/^\//, '').split('/');

    let current: UnifiedFileSystemNode | null = state;

    for (const segment of segments) {
      if (segment === '') {
        continue;
      }

      // Check if current is an index
      if (current.type !== 'index') {
        return null;
      }

      if (current.entries[segment] === undefined) {
        return null;
      }

      current = current.entries[segment];
    }

    // Now current is the node at the path
    const meta = current.meta;

    // Add size based on node type
    if (current.type === 'file' || current.type === 'symlink') {
      const node = current as FileNode | SymlinkNode;
      return { ...meta, type: current.type, size: node.content.length };
    }
    // NOTE for now we return size 0 for directories
    return { ...meta, type: 'index', size: 0 };
  }

  let connectedReceiver: GnfsInterface | null = null;
  // Track subscriptions by path and serialized options
  const subscriptions: Record<string, Record<string, boolean>> = {};

  /**
   * Generates a unique key for a subscription based on the path and options. This is used to track subscriptions in a Set.
   *
   * @param path the path of the subscription
   * @param options the options of the subscription
   * @returns
   */
  function getSubscriptionOptionKey(options: {
    type: 'body' | 'header' | 'index';
    range?: string;
  }): string {
    return `${JSON.stringify(options)}`;
  }

  function putHeader(
    path: string,
    now: Date,
    headers: Partial<{
      mtime: Date;
      ctime: Date;
      atime: Date;
      size: number;
    }>
  ): void {
    // Navigate to the node
    const segments = path.replace(/^\//, '').split('/');
    let current: UnifiedFileSystemNode = state;

    for (const segment of segments) {
      if (segment === '') {
        continue;
      }
      if (current.type !== 'index') {
        throw new Error(`Cannot update headers for non-existing path ${path}`);
      }
      if (current.entries[segment] === undefined) {
        throw new Error(`Cannot update headers for non-existing path ${path}`);
      }
      current = current.entries[segment];
    }

    // Update the metadata
    current.meta = { ...current.meta, ...headers };
  }

  function putFolder(
    segment: string,
    parentFolder: DirectoryNode,
    now: Date
  ): void {
    // Create or update the index
    if (!parentFolder.entries[segment]) {
      // Create new index
      parentFolder.entries[segment] = {
        type: 'index',
        meta: {
          ctime: now,
          mtime: now,
          atime: now,
          fileId: currentFileId++,
        },
        entries: {},
      };
    } else {
      // Update existing index's mtime
      const existingDir = parentFolder.entries[segment] as DirectoryNode;
      existingDir.meta.mtime = now;
    }
  }

  function putFile(
    filename: string,
    parentFolder: DirectoryNode,
    body: string,
    now: Date
  ): void {
    // Create or update the file
    if (!parentFolder.entries[filename]) {
      // Create new file
      parentFolder.entries[filename] = {
        type: 'file',
        meta: {
          ctime: now,
          mtime: now,
          atime: now,
          fileId: currentFileId++,
        },
        content: body,
      };
    } else {
      // Update existing file
      const existingFile = parentFolder.entries[filename] as FileNode;
      existingFile.meta.mtime = now;
      existingFile.content = body;
    }
  }

  function putSymlink(
    segment: string,
    parentFolder: DirectoryNode,
    target: string,
    now: Date
  ): void {
    // Create or update the symlink
    if (!parentFolder.entries[segment]) {
      // Create new symlink
      parentFolder.entries[segment] = {
        type: 'symlink',
        meta: {
          ctime: now,
          mtime: now,
          atime: now,
          fileId: currentFileId++,
        },
        content: target, // Store symlink target path
      };
    } else {
      // Update existing symlink
      const existingLink = parentFolder.entries[segment] as SymlinkNode;
      existingLink.meta.mtime = now;
      existingLink.content = target;
    }
  }

  function notifySubscribers(
    path: string,
    payload:
      | { type: 'index' }
      | { body: string; type: 'file' }
      | { body: string; type: 'symlink' }
      | {
          type: 'headers';
          headers: Partial<{
            mtime: Date;
            ctime: Date;
            atime: Date;
            size: number;
          }>;
        }
  ): void {
    if (!subscriptions[path]) {
      return;
    }

    for (const subOptionsRaw of Object.keys(subscriptions[path])) {
      const subOptions = JSON.parse(subOptionsRaw) as {
        type: 'body' | 'header' | 'index';
        range?: string;
      };

      if (subOptions.type === 'header') {
        const meta = getMeta(path);
        if (meta) {
          connectedReceiver?.send({
            update: {
              path,
              body: meta,
              headers: { type: 'header' },
            },
          });
        }
      }
      if (payload.type === 'index') {
        // folder
        if (subOptions.type === 'index') {
          const index: IndexBody = [];
          connectedReceiver?.send({
            update: { path, body: index, headers: { type: 'index' } },
          });
        }
      } else if (payload.type === 'file' || payload.type === 'symlink') {
        // file
        if (subOptions.type === 'body') {
          connectedReceiver?.send({
            update: { path, body: payload.body, headers: { type: 'body' } },
          });
        }
      }
    }
  }

  const memoryStateProvider: BackingStateInterface & {
    connectReceiver: (stateReceiver: GnfsInterface) => void;
  } = {
    // StateBus methods
    connectReceiver(stateReceiver: GnfsInterface): void {
      connectedReceiver = stateReceiver;
    },

    get(
      path: string,
      options: { type: 'body' | 'header' | 'index'; range?: string },
      subscribe: boolean
    ): void {
      // Navigate to the path
      const segments = path.replace(/^\//, '').split('/');

      let current: UnifiedFileSystemNode | null = state;

      for (const segment of segments) {
        if (segment === '') {
          continue;
        }

        if (current === null || current.type !== 'index') {
          // Trying to navigate into a file or through null
          current = null;
          break;
        }

        if (current.entries[segment] === undefined) {
          current = null;
          break;
        }

        current = current.entries[segment];
      }

      if (options.type === 'body') {
        if (current === null) {
          // Resource doesn't exist
          connectedReceiver?.send({
            update: { path, body: null, headers: { type: 'body' } },
          });
        } else if (current.type === 'file' || current.type === 'symlink') {
          // It's a file or symlink
          const fileNode = current;
          connectedReceiver?.send({
            update: { path, body: fileNode.content, headers: { type: 'body' } },
          });
        } else {
          // It's a directory, can't provide body
          connectedReceiver?.send({
            update: { path, body: undefined, headers: { type: 'body' } },
          });
        }
      } else if (options.type === 'header') {
        const meta = getMeta(path);
        if (meta) {
          connectedReceiver?.send({
            update: { path, body: meta, headers: { type: 'header' } },
          });
        } else {
          connectedReceiver?.send({
            update: { path, body: null, headers: { type: 'header' } },
          });
        }
      } else if (options.type === 'index') {
        if (current === null) {
          // Resource doesn't exist
          connectedReceiver?.send({
            update: { path, body: null, headers: { type: 'index' } },
          });
        } else if (current.type !== 'index') {
          // It's a file or symlink, can't provide index
          connectedReceiver?.send({
            update: { path, body: undefined, headers: { type: 'index' } },
          });
        } else {
          // It's a directory, build index
          const index: IndexBody = [];
          for (const [key] of Object.entries(current.entries)) {
            index.push({ link: `${key}` });
          }
          connectedReceiver?.send({
            update: { path, body: index, headers: { type: 'index' } },
          });
        }
      }

      if (subscribe) {
        subscriptions[path] ||= {};
        subscriptions[path][getSubscriptionOptionKey(options)] = true;
      }
    },

    forget(
      path: string,
      options: { type: 'body' | 'header' | 'index'; range?: string }
    ): void {
      delete subscriptions[path]?.[getSubscriptionOptionKey(options)];
    },

    put(
      path: string,
      payload: // NOTE on index we only allow empty index - entries got to be created by putting files/folders
        | { type: 'index' }
        | { body: string; type: 'file' }
        | { body: string; type: 'symlink' }
        | {
            type: 'headers';
            headers: Partial<{
              mtime: Date;
              ctime: Date;
              atime: Date;
              size: number;
            }>;
          }
    ): void {
      const body = 'body' in payload ? payload.body : undefined;
      const headers = 'headers' in payload ? payload.headers : undefined;

      const now = new Date();

      // Remove leading slash and split by /
      const segments = path.replace(/^\//, '').split('/');

      let parentFolder: DirectoryNode = state;
      let currentPath = '';

      for (const [index, segment] of segments.entries()) {
        currentPath += `/${segment}`;

        // add all parent folders missing in the path
        if (index < segments.length - 1) {
          if (!parentFolder.entries[segment]) {
            if (headers) {
              throw new Error(
                `Cannot update headers for non-existing path ${currentPath}`
              );
            }

            // before the last segment - use the upsert function to create the folder
            memoryStateProvider.put(currentPath, { type: 'index' });
          }

          // NOTE: upsert is not pure for now, it adds the segment the state lets assert the change
          const nextNode = parentFolder.entries[segment];
          if (nextNode && nextNode.type !== 'index') {
            throw new Error(
              currentPath +
                ' is expected to be a directory but is a file when upserting into path ' +
                path
            );
          }
          // the sub node should exist now!
          parentFolder = parentFolder.entries[segment] as DirectoryNode;
        } else {
          const currentNode = parentFolder.entries[segment];

          // assert required folder/file structure
          if (
            payload.type === 'index' &&
            currentNode &&
            currentNode.type === 'file'
          ) {
            throw new Error(
              currentPath +
                ' is a file but expected to be a directory when upserting into path ' +
                path
            );
          }

          if (
            payload.type !== 'index' &&
            currentNode &&
            currentNode.type === 'index'
          ) {
            throw new Error(
              currentPath +
                ' is a directory but expected to be a file when upserting into path ' +
                path
            );
          }

          if (payload.type === 'index' && currentNode !== undefined) {
            // parent folder exists already - nothing to do
            return;
          }

          // Branch to appropriate handler based on payload type
          if (payload.type === 'headers') {
            putHeader(path, now, payload.headers);
          } else if (payload.type === 'index') {
            putFolder(segment, parentFolder, now);
          } else if (payload.type === 'file') {
            putFile(segment, parentFolder, payload.body, now);
          } else if (payload.type === 'symlink') {
            putSymlink(segment, parentFolder, payload.body, now);
          } else {
            const exhaustiveCheck: never = payload;
            throw new Error('Unsupported payload type');
          }

          notifySubscribers(path, payload);
        }
      }
    },

    del(path: string): void {
      // Navigate to the parent directory
      const segments = path.replace(/^\//, '').split('/');
      const finalSegment = segments[segments.length - 1];
      const dirSegments = segments.slice(0, -1);

      let current: DirectoryNode = state;

      // Navigate to parent
      for (const segment of dirSegments) {
        if (current.type !== 'index') {
          // Trying to navigate into a file, path doesn't exist
          return;
        }

        if (!current.entries[segment]) {
          // Path doesn't exist
          return;
        }

        const nextNode = current.entries[segment];
        if (nextNode.type !== 'index') {
          // Not a directory, can't navigate further
          return;
        }
        current = nextNode;
      }

      // Check if the final segment exists
      if (!current.entries[finalSegment]) {
        // Path doesn't exist
        return;
      }

      const target = current.entries[finalSegment];

      // If target is a directory, recursively remove all children first
      if (target.type === 'index') {
        const childDir = target;

        for (const [key] of Object.entries(childDir.entries)) {
          const childPath = path === '/' ? `/${key}` : `${path}/${key}`;
          // Recursively remove each child
          memoryStateProvider.del(childPath);
        }
      }

      // Delete the entry from the state
      delete current.entries[finalSegment];

      // Notify subscribers
      connectedReceiver?.send({ delete: { path } });
    },
  };

  return memoryStateProvider;
};
