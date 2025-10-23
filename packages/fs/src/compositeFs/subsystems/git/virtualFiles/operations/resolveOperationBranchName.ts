import git from 'isomorphic-git';
import * as nodeFs from 'node:fs';

// .legit/branches/[branch-name]/[[...filepath]] -> file or folder at path in branch

export const operationBranchNamePostfix = '-operation';

export async function resolveOperationBranchName(
  fs: typeof nodeFs,
  repoPath: string,
  branchName: string
) {
  const branches = await git.listBranches({ fs, dir: repoPath });

  return branches.filter(b =>
    b.endsWith('__' + branchName + operationBranchNamePostfix)
  )[0];
}
