import git from '@legit-sdk/isomorphic-git';
import * as nodeFs from 'node:fs';
import {
  decodeBranchNameFromVfs,
  encodeBranchNameForVfs,
} from './nameEncoding.js';

// .legit/branches/[branch-name]/[[...filepath]] -> file or folder at path in branch

export const operationBranchNamePostfix = '-operation';

export async function resolveOperationBranchName(
  fs: typeof nodeFs,
  repoPath: string,
  branchName: string
) {
  const branches = await git.listBranches({ fs, dir: repoPath });

  const opBranchOriginal = branches.filter(b =>
    b.endsWith(
       decodeBranchNameFromVfs(branchName) + operationBranchNamePostfix
    )
  )[0];

  return opBranchOriginal
    ? encodeBranchNameForVfs(opBranchOriginal)
    : undefined;
}
