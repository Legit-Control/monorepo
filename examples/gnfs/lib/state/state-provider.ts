import { StateReceiver } from './state-receiver';

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
  get(
    path: string,
    options: { type: 'body' | 'header' | 'index'; range?: string },
    subscribe: boolean
  ): void;

  /**
   * Unsubscribes from updates for the given resource. After this is called, the state bus should no longer send updates for the resource to this state bus.
   * @param path
   */
  forget(
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
  put: (
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
  del: (path: string) => void;
};
