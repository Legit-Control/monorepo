import { GnfsInterface } from '../gnfs/gnfs-interface';

export type BackingStateInterface = {
  connectReceiver(stateReceiver: GnfsInterface): void;

  /**
   * Requests the resource at the given path from the connected state bus.
   * This askes the statebus to call this states bus send with the requeted resource.
   * If the subscribe flag is true, the state bus should also send updates for the resource whenever it changes, until the unsubscribe function is called.
   * @param path
   * @param options
   * @param subscribe
   */
  get(
    path: string,
    options: { type: 'body' | 'header' | 'index'; range?: string },
    subscribe: boolean,
    peerId: string
  ): void;

  /**
   * Unsubscribes from updates for the given resource. After this is called, the state bus should no longer send updates for the resource to this state bus.
   * @param path
   */
  forget(
    path: string,
    options: { type: 'body' | 'header' | 'index'; range?: string },
    peerId: string
  ): void;

  /**
   * Updates / inserts a resource at the given path with the given body.
   * If a resource already exists at the path, it should be updated with the new body. If no resource exists at the path, a new resource should be created with the given body.
   * @param path the path of the resource to update/insert
   * @param payload the new state of the resource
   * @param peerId the id of the peer that caused the update, used for avoiding echoing updates back to the originator
   * @returns
   */
  put: (
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
        },
    peerId: string
  ) => void;

  /**
   * Deletes a resource at the given path.
   * If no resource exists at the path, this operation should have no effect.
   * @param args.path the path of the resource to delete
   * @param args.peerId the id of the peer that caused the deletion, used for avoiding echoing deletions back to the originator
   * @returns
   */
  del: (path: string, peerId: string) => void;
};
