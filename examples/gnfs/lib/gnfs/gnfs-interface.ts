import { IndexBody } from '../state/index-body.js';

/**
 * allows to connect a state provider to this
 */

export type GnfsInterface = {
  peerId: string;
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

  /**
   * Watch a file or directory for changes.
   *
   * @param filename - Path to the file or directory to watch
   * @param options - Watch options (signal - to stop watching)
   * @returns Async iterable of file system events
   */
  watch(
    filename: string,
    options?: {
      signal?: AbortSignal;
    }
  ): AsyncIterable<{
    eventType: 'update' | 'headerUpdate' | 'delete';
    filename?: string;
  }>;
};
