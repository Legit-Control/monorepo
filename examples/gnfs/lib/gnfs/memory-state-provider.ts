export type IndexBody = {
  link: string;
  type?: 'index' | undefined;
  body?: IndexBody;
}[];

export type StateProvider = {
  connectReceiver(stateReceiver: StateReceiver): void;

  /**
   * Requests the resource at the given path from the connected state bus.
   * This askes the statebus to call this states bus send with the requeted resource.
   * If the subscribe flag is true, the state bus should also send updates for the resource whenever it changes, until the unsubscribe function is called.
   * @param path
   * @param options
   * @param subscribe
   */
  request(
    path: string,
    options: { type: 'body' | 'header' | 'index'; range?: string },
    subscribe: boolean
  ): void;

  /**
   * Unsubscribes from updates for the given resource. After this is called, the state bus should no longer send updates for the resource to this state bus.
   * @param path
   */
  unsubscribe(
    path: string,
    options: { type: 'body' | 'header' | 'index'; range?: string }
  ): void;

  /**
   * Updates / inserts a resource at the given path with the given body.
   * If a resource already exists at the path, it should be updated with the new body. If no resource exists at the path, a new resource should be created with the given body.
   * @param path the path of the resource to update/insert
   * @param payload the new body of the resource
   * @returns
   */
  upsert: (
    path: string,
    payload:
      | { body: string | undefined } // TODO add the index as a type to check for folder
      | {
          headers: Partial<{
            mtime: Date;
            ctime: Date;
            atime: Date;
            size: number;
          }>;
        }
  ) => void;

  /**
   * Deletes a resource at the given path.
   * If no resource exists at the path, this operation should have no effect.
   * @param args.path the path of the resource to delete
   * @returns
   */
  remove: (path: string) => void;
};

/**
 * allows to connect a state provider to this
 */
export type StateReceiver = {
  /**
   * Sends a resource message to the connected state bus.
   *
   * for type body and index thre types in the body property are possible:
   * - string | IndexBody: if the resource is of the requested type (body or index)
   * - null: if the resource does not exist
   * - undefined: if the resource exists but can't be represented by the requested type (e.g. requesting body for a directory)
   *
   * @param resourceMessage
   * The resource message can either be an update message, which contains the new value of a resource, or a delete message, which indicates that a resource has been deleted.
   */
  send(
    resourceMessage:
      | {
          update:
            | {
                path: string;
                body: string | null | undefined;
                headers: { type: 'body' };
              }
            | {
                path: string;
                body: {
                  ctime: Date;
                  mtime: Date;
                  atime: Date;
                  fileId: number;
                  size: number;
                } | null;
                headers: { type: 'header' };
              }
            | {
                path: string;
                body: IndexBody | null | undefined;
                headers: { type: 'index' };
              };
        }
      | {
          delete: { path: string };
        }
  ): void;
};

/**
 * Type definition for a tree structure that can contain data (string) or nested records of the same type.
 * This is used to represent the state of the file system in memory, where each path can either be a file (with string content) or a directory (with nested paths).
 */
interface RecursiveRecord {
  [key: string]: string | RecursiveRecord;
}

export const createMemoryStateProvider = (
  initialState: RecursiveRecord = {}
): StateProvider => {
  let state: RecursiveRecord = { ...initialState };
  let metaData: Record<
    string,
    {
      ctime: Date;
      mtime: Date;
      atime: Date;
      type: 'body' | 'index';
      fileId: number;
    }
  > = {};

  let currentFiledId = 1;

  function getMeta(path: string) {
    // Navigate to the path
    const segments = path.replace(/^\//, '').split('/');

    let current: string | RecursiveRecord = state;

    for (const segment of segments) {
      if (segment === '') {
        continue;
      }
      if (typeof current === 'string') {
        // Trying to navigate into a file
        return null;
      }

      if (!current[segment]) {
        return null;
      }

      current = current[segment];
    }

    if (!metaData[path]) {
      const now = new Date();
      metaData[path] = {
        type: typeof current === 'string' ? 'body' : 'index',
        ctime: now,
        mtime: now,
        atime: now,
        fileId: currentFiledId++,
      };
    }

    // Now current is the value at the path
    if (typeof current === 'string') {
      return { ...metaData[path], size: current.length };
    }
    // NOTE for now we return size 0 for directories
    return { ...metaData[path], size: 0 };
  }

  let connectedReceiver: StateReceiver | null = null;
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

  const memoryStateProvider: StateProvider & {
    connectReceiver: (stateReceiver: StateReceiver) => void;
  } = {
    // StateBus methods
    connectReceiver(stateReceiver: StateReceiver): void {
      connectedReceiver = stateReceiver;
    },

    request(
      path: string,
      options: { type: 'body' | 'header' | 'index'; range?: string },
      subscribe: boolean
    ): void {
      // Navigate to the path
      const segments = path.replace(/^\//, '').split('/');

      let current: string | RecursiveRecord | null = state;

      for (const segment of segments) {
        if (segment === '') {
          continue;
        }
        if (current === null || typeof current === 'string') {
          // Trying to navigate into a file or through null
          current = null;
          break;
        }

        if (current[segment] === undefined) {
          current = null;
          break;
        }

        current = current[segment];
      }

      if (options.type === 'body') {
        if (current === null) {
          // Resource doesn't exist
          connectedReceiver?.send({
            update: { path, body: null, headers: { type: 'body' } },
          });
        } else if (typeof current === 'string') {
          // It's a file
          connectedReceiver?.send({
            update: { path, body: current, headers: { type: 'body' } },
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
        } else if (typeof current === 'string') {
          // It's a file, can't provide index
          connectedReceiver?.send({
            update: { path, body: undefined, headers: { type: 'index' } },
          });
        } else {
          // It's a directory, build index
          const index: IndexBody = [];
          for (const [key] of Object.entries(current)) {
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

    unsubscribe(
      path: string,
      options: { type: 'body' | 'header' | 'index'; range?: string }
    ): void {
      delete subscriptions[path]?.[getSubscriptionOptionKey(options)];
    },

    // SumpleCUD methods
    upsert(
      path: string,
      payload:
        | { body: string | undefined }
        | {
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

      let parentFolder: RecursiveRecord = state;
      let currentPath = '';

      for (const [index, segment] of segments.entries()) {
        currentPath += `/${segment}`;
        if (index < segments.length - 1) {
          if (!parentFolder[segment]) {
            if (headers) {
              throw new Error(
                `Cannot update headers for non-existing path ${currentPath}`
              );
            }

            // before the last segment - use the upsert function to create the folder
            memoryStateProvider.upsert(currentPath, { body: undefined });
          }

          // NOTE: upsert is not pure for now, it adds the segment the state lets assert the change
          if (typeof parentFolder[segment] !== 'object') {
            throw new Error(
              currentPath +
                ' is expected to be a directory but is a file when upserting into path ' +
                path
            );
          }
          // the sub node should exist now!
          parentFolder = parentFolder[segment];
        } else {
          let currentNode = parentFolder[segment];

          // assert required folder/file structure
          if (
            headers === undefined &&
            body === undefined &&
            typeof currentNode === 'string'
          ) {
            throw new Error(
              currentPath +
                ' is a file but expected to be a directory when upserting into path ' +
                path
            );
          }

          if (
            headers === undefined &&
            typeof currentNode === 'object' &&
            typeof body === 'string'
          ) {
            throw new Error(
              currentPath +
                ' is a directory but expected to be a file when upserting into path ' +
                path
            );
          }
          if (
            headers === undefined &&
            body === undefined &&
            currentNode !== undefined
          ) {
            // parent folder exists already - nothing to do
            return;
          }

          if (!metaData[path]) {
            const defaultMeta = {
              type: body == undefined ? ('index' as const) : ('body' as const),
              ctime: now,
              mtime: now,
              atime: now,
              fileId: currentFiledId++,
            };
            metaData[path] = { ...defaultMeta, ...headers };
          } else if (headers) {
            metaData[path] = { ...metaData[path], ...headers };
          } else {
            metaData[path].mtime = now;
          }

          if (headers === undefined) {
            // propagate metadata change
            if (body === undefined) {
              // create folder
              parentFolder[segment] = {};
            } else {
              // create file
              parentFolder[segment] = body;
            }
          }

          if (subscriptions[path]) {
            for (const subOptionsRaw of Object.keys(subscriptions[path])) {
              const subOptions = JSON.parse(subOptionsRaw) as {
                type: 'body' | 'header' | 'index';
                range?: string;
              };

              if (!headers) {
                if (body === undefined) {
                  // folder
                  if (subOptions.type === 'index') {
                    const index: IndexBody = [];
                    connectedReceiver?.send({
                      update: { path, body: index, headers: { type: 'index' } },
                    });
                  }
                } else {
                  // file
                  if (subOptions.type === 'body') {
                    connectedReceiver?.send({
                      update: { path, body: body, headers: { type: 'body' } },
                    });
                  }
                }
              }

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
            }
          }
        }
      }
    },

    remove(path: string): void {
      // Navigate to the parent directory
      const segments = path.replace(/^\//, '').split('/');
      const finalSegment = segments[segments.length - 1];
      const dirSegments = segments.slice(0, -1);

      let current: string | RecursiveRecord = state;

      // Navigate to parent
      for (const segment of dirSegments) {
        if (typeof current === 'string') {
          // Trying to navigate into a file, path doesn't exist
          return;
        }

        if (!current[segment]) {
          // Path doesn't exist
          return;
        }

        current = current[segment] as RecursiveRecord;
      }

      // Check if the final segment exists
      if (typeof current === 'string' || !current[finalSegment]) {
        // Path doesn't exist
        return;
      }

      const target = current[finalSegment];

      // If target is a directory (object), recursively remove all children first
      if (typeof target !== 'string') {
        const childObj = target as RecursiveRecord;

        for (const [key] of Object.entries(childObj)) {
          const childPath = path === '/' ? `/${key}` : `${path}/${key}`;
          // Recursively remove each child
          memoryStateProvider.remove(childPath);
        }
      }

      // Delete metadata for this path
      delete metaData[path];

      // Delete the entry from the state
      delete current[finalSegment];

      // Notify subscribers
      connectedReceiver?.send({ delete: { path } });
    },
  };
  return memoryStateProvider;
};
