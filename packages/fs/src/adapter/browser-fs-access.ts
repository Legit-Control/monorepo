import type {
  fileSave as fileSaveType,
  FileWithHandle,
} from 'browser-fs-access';
import { openLegitFs } from '../legitfs.js';
import CompositFsFileHandle from '../compositeFs/CompositeFsFileHandle.js';
import { Buffer } from 'buffer';

type FileAccess = {
  fileSave: typeof fileSaveType;
};

function fileHandleToFileSystemFileHandle(
  handle: CompositFsFileHandle
): FileSystemFileHandle {
  const name = (handle as any).name || 'untitled';
  // Minimal wrapper to mimic FileSystemFileHandle interface
  return {
    kind: 'file',
    name,
    async getFile() {
      const dataStats = await handle.stat();

      const size = dataStats.size as number;
      console.log('reading data into buffer of size' + size);
      const nodeBuffer = Buffer.alloc(size);
      await handle.read(nodeBuffer, 0, size, 0);
      const buffer = new Uint8Array(
        nodeBuffer.buffer,
        nodeBuffer.byteOffset,
        nodeBuffer.byteLength
      );

      console.log('buffer read', buffer);
      const data = buffer;

      return new File([data], name || 'untitled');
    },
    async createWritable() {
      return {
        async write(data: BlobPart) {
          console.log('writing data to handle', handle);
          let buffer: Buffer | Uint8Array;
          if (typeof data === 'string') {
            buffer = Buffer.from(data, 'utf-8');
          } else if (data instanceof Blob) {
            const arrayBuffer = await data.arrayBuffer();
            buffer = new Uint8Array(arrayBuffer);
          } else if (ArrayBuffer.isView(data)) {
            buffer = new Uint8Array(
              data.buffer,
              data.byteOffset,
              data.byteLength
            );
          } else {
            console.log('data', data);
            throw new Error('Unsupported data type for write');
          }
          await handle.write(buffer);
          await handle.sync();

          console.log('write completed');
        },
        async close() {
          await handle.close();
        },
      };
    },
    // Add other methods as needed
  } as unknown as FileSystemFileHandle;
}

async function fileSystemFileHandleToFileWithHandle(
  handle: FileSystemFileHandle
): Promise<FileWithHandle> {
  // FileWithHandle is a File with an added .handle property
  // We also want to copy over methods like .text(), .arrayBuffer(), etc.
  // So we need to await handle.getFile() and then attach the handle

  // This function returns a Promise<FileWithHandle>
  const file = await handle.getFile();

  // Attach the handle property to the file to conform to FileWithHandle
  (file as FileWithHandle).handle = handle;
  return file as FileWithHandle;

  //   return {
  //     handle: fileHandle,
  //     name,
  //     lastModified: Date.now(),
  //     webkitRelativePath: name,
  //     size: file.size,
  //     type: file.type,
  //     arrayBuffer: () => file.arrayBuffer(),
  //   };
}

export async function getLegitFsAccess(
  legitFs: ReturnType<typeof openLegitFs>
): Promise<
  FileAccess & { openFile: (filePath: string) => Promise<FileWithHandle> }
> {
  //   if (!info.handle) {
  //     const fileName = window.prompt('Save as', info.fileName) || info.fileName;
  //     info.fileName = fileName;
  //   }

  return {
    openFile: async (filePath: string): Promise<FileWithHandle> => {
      const handle = await legitFs.promises.open(filePath, 'w');
      (handle as any).name = filePath;
      return await fileSystemFileHandleToFileWithHandle(
        fileHandleToFileSystemFileHandle(handle)
      );
    },

    fileSave: async (
      /** To-be-saved `Blob` or `Response` */
      blobOrPromiseBlobOrResponse: Blob | Promise<Blob> | Response,
      options?: any,
      /**
       * A potentially existing file handle for a file to save to. Defaults to
       * `null`.
       */
      existingHandle?: FileSystemFileHandle | null,
      /**
       * Determines whether to throw (rather than open a new file save dialog)
       * when `existingHandle` is no longer good. Defaults to `false`.
       */
      throwIfExistingHandleNotGood?: boolean | false,
      /**
       * A callback to be called when the file picker was shown (which only happens
       * when no `existingHandle` is provided). Defaults to `null`.
       */
      filePickerShown?: (handle: FileSystemFileHandle | null) => void | null
    ) => {
      if (!existingHandle) {
        // Show the file picker dialog
        const fileName = window.prompt(
          'Save as',
          options?.fileName ?? 'untitled'
        );

        console.log('result of prompt', fileName);
        if (!fileName) {
          // no file choosen
          throw new Error('no file choosen');
        }

        try {
          const legitFileHandle = await legitFs.promises.open(
            `${fileName}`,
            'w'
          );

          existingHandle = fileHandleToFileSystemFileHandle(legitFileHandle);
        } catch (err) {
          console.error('Failed to open file in legitFs', err);
          throw new Error('Failed to open file in legitFs');
        }
      } else {
        console.log('using existing handle', existingHandle);
      }

      // TODO use legit fs to open the file on the folders

      const blob =
        blobOrPromiseBlobOrResponse instanceof Blob
          ? blobOrPromiseBlobOrResponse
          : ((await blobOrPromiseBlobOrResponse) as Blob);

      const writable = await existingHandle.createWritable();
      await writable.write(blob);

      return existingHandle;
    },
  };
}
