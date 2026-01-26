import { FsaNodeFs } from '@jsonjoy.com/fs-fsa-to-node';

/**
 * Opens the IndexedDB database for storing filesystem handles
 */
async function openHandleDatabase(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('legit-fs-handles', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('handles')) {
        db.createObjectStore('handles');
      }
    };
  });
}

/**
 * Retrieves a FileSystemDirectoryHandle from IndexedDB by ID
 */
async function getHandleFromIndexedDB(
  id: string
): Promise<FileSystemDirectoryHandle | null> {
  try {
    const db = await openHandleDatabase();
    const tx = db.transaction('handles', 'readonly');
    const store = tx.objectStore('handles');
    const request = store.get(`legit-handle_${id}`);

    const handle = await new Promise<FileSystemDirectoryHandle | null>(
      (resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }
    );

    db.close();
    return handle;
  } catch (error) {
    console.warn(`Failed to get handle from IndexedDB for id ${id}:`, error);
    return null;
  }
}

/**
 * Stores a FileSystemDirectoryHandle in IndexedDB
 */
async function storeHandleInIndexedDB(
  id: string,
  handle: FileSystemDirectoryHandle
): Promise<void> {
  const db = await openHandleDatabase();
  const tx = db.transaction('handles', 'readwrite');
  const store = tx.objectStore('handles');
  const request = store.put(handle, `legit-handle_${id}`);

  await new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  db.close();
}

/**
 * Creates a filesystem instance from a File System Access API directory handle.
 *
 * This function:
 * 1. Checks IndexedDB for a previously stored handle with the given ID
 * 2. If found, reuses that handle (no permission prompt needed)
 * 3. If not found, prompts the user to select a directory via showDirectoryPicker()
 * 4. Stores the new handle in IndexedDB for future use
 *
 * This enables the filesystem handle to persist across browser restarts,
 * avoiding repeated permission prompts.
 *
 * @param id - A unique identifier for this filesystem handle
 * @returns A Node.js-compatible filesystem instance backed by the FSA handle
 *
 * @example
 * ```typescript
 * // First call - prompts user to select directory
 * const fs1 = await createFsFromFsaFolder('my-project');
 *
 * // On subsequent calls or page reloads - reuses stored handle
 * const fs2 = await createFsFromFsaFolder('my-project');
 * ```
 */
export async function createFsFromFsaFolder(id: string): Promise<FsaNodeFs> {
  // Check if we're in a browser environment with File System Access API
  if (typeof window === 'undefined' || !('showDirectoryPicker' in window)) {
    throw new Error(
      'File System Access API is not available in this environment'
    );
  }

  // Try to get existing handle from IndexedDB
  let dirHandle = await getHandleFromIndexedDB(id);

  // If not found, prompt user to select directory
  // if (!dirHandle) {
  // Type assertion for File System Access API
  dirHandle = await (window as any).showDirectoryPicker();

  if (!dirHandle) {
    throw new Error('No directory selected');
  }

  // Store the handle for future use
  await storeHandleInIndexedDB(id, dirHandle);
  // }

  // Create and return FsaNodeFs instance
  // Non-null assertion since we either got it from IndexedDB or prompted user
  return new FsaNodeFs(dirHandle as any);
}
