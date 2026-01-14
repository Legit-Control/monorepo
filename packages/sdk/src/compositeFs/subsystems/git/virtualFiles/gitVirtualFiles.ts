import * as nodeFs from 'node:fs';
import { IFs } from 'memfs';
import { CompositeFs } from '../../../CompositeFs.js';

export type VirtualFile =
  | {
      type: 'file';
      content?: string | Buffer;
      oid?: string | undefined;
      mode?: number;
      size?: number;
    }
  | {
      type: 'directory';
      content: nodeFs.Dirent[];
      oid?: string | undefined;
      mode?: number;
    };

export interface VirtualFileArgs {
  cacheFs: IFs;
  filePath: string;
  // fs: CompositeFs;
  userSpaceFs: CompositeFs;
  pathParams: any; // Parameters extracted from the router
  author: { name: string; email: string; date: number; timezoneOffset: number }; // The author info for commits
}

/**
 * Definition of a virtual file in the Git subsystem
 *
 *  ->
 *
 * writeFile -> writes the whole file
 * readFile -> writes the whole file
 */

export type VirtualFileDefinition = {
  type: string;
  rootType: 'folder' | 'file';
  getFile: (args: VirtualFileArgs) => Promise<VirtualFile | undefined>;
  getStats: (args: VirtualFileArgs) => Promise<nodeFs.Stats>;
  onFileChanged?: (args: VirtualFileArgs) => Promise<void>;
  writeFile?: (
    args: VirtualFileArgs & { content: Buffer | string }
  ) => Promise<void>;

  unlink?: (args: VirtualFileArgs) => Promise<void>;
  rename: (
    args: VirtualFileArgs & { newPath: string; newPathParams: any }
  ) => Promise<void>;
  mkdir: (
    args: VirtualFileArgs & {
      options?: nodeFs.MakeDirectoryOptions | nodeFs.Mode | null;
    }
  ) => Promise<void>;
  rmdir?: (args: VirtualFileArgs) => Promise<void>;
};

// export const allGitVirtualFiles: VirtualFileDefinition[] = [
//   legitVirtualFile, // legit must have the highest prio because it should also match in sub paths for example in /.legit/branches/main/.legit

//   gitStatusVirtualFile,
//   gitCommitFileVirtualFile,
//   gitBranchesListVirtualFile,
//   gitBranchFileVirtualFile,
//   gitBranchHeadVirtualFile,
//   gitBranchTipVirtualFile,
// ];
