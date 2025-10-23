// src/types/memfs-augmentation.d.ts
import "memfs/lib/node/types/misc";

declare module "memfs/lib/node/types/misc" {
  interface IFileHandle {
    fd: number;
  }
}
