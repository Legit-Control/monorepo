import * as nodeFs from 'node:fs';

export function toDirEntry(args: {
  parent: string;
  name: string;
  isDir: boolean;
}): nodeFs.Dirent {
  return {
    name: args.name,
    isFile: () => !args.isDir,
    isDirectory: () => args.isDir,
    isBlockDevice: () => true,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
    parentPath: args.parent,
    path: args.parent,
  };
}
