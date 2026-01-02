import git from '@legit-sdk/isomorphic-git';
import {
  decodeBranchNameFromVfs,
  encodeBranchNameForVfs,
} from './operations/nameEncoding.js';
export async function getTargetBranch(
  gitRoot: string,
  nodeFs: any // The actual node fs for git operations
): Promise<string> {
  try {
    const targetBranch = await git.getConfig({
      fs: nodeFs,
      dir: gitRoot,
      path: 'user.legit-target-branch',
    });

    if (targetBranch) {
      return encodeBranchNameForVfs(targetBranch);
    }
  } catch (error) {
    // Config not set, fall through to default
  }

  // Fall back to default branch
  try {
    const defaultBranch = await git.getConfig({
      fs: nodeFs,
      dir: gitRoot,
      path: 'init.defaultBranch',
    });
    return encodeBranchNameForVfs(defaultBranch) || 'main';
  } catch (error) {
    return 'main';
  }
}
export async function setTargetBranch(
  gitRoot: string,
  nodeFs: any,
  branchName: string
): Promise<void> {
  await git.setConfig({
    fs: nodeFs,
    dir: gitRoot,
    path: 'user.legit-target-branch',
    value: decodeBranchNameFromVfs(branchName),
  });
}
