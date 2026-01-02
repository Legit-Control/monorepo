import git from '@legit-sdk/isomorphic-git';
import {
  decodeBranchNameFromVfs,
  encodeBranchNameForVfs,
} from './operations/nameEncoding.js';
export async function getCurrentBranch(
  gitRoot: string,
  nodeFs: any // The actual node fs for git operations
): Promise<string> {
  try {
    const currentBranch = await git.getConfig({
      fs: nodeFs,
      dir: gitRoot,
      path: 'user.legit-current-branch',
    });

    if (currentBranch) {
      return encodeBranchNameForVfs(currentBranch);
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
export async function setCurrentBranch(
  gitRoot: string,
  nodeFs: any,
  branchName: string
): Promise<void> {
  await git.setConfig({
    fs: nodeFs,
    dir: gitRoot,
    path: 'user.legit-current-branch',
    value: decodeBranchNameFromVfs(branchName),
  });
}
