import git, { FsClient } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { LegitAuth } from './sessionManager.js';

const remote = 'legit';

// const createHttpHandler = {
//   async request(url: any, options: any ) {
//     const auth = Buffer
//       .from(`${username}:${password}`)
//       .toString('base64')

//     const headers = {
//       ...(options.headers || {}),
//       Authorization: `Basic ${auth}`,
//     };

//     // Call the underlying http client
//     return http.request(url, { ...options, headers });
//   }
// };

export const createLegitSyncService = ({
  fs,
  gitRepoPath,
  serverUrl = 'https://hub.legitcontrol.com',
  auth,
  anonymousBranch,
}: {
  fs: FsClient;
  gitRepoPath: string;
  serverUrl?: string;
  auth: LegitAuth;
  anonymousBranch: string;
}) => {
  let running = false;

  async function loadBranch(branch: string) {
    const token = await auth.getMaxAccessTokenForBranch(branch);
    // later check if the token kan do enough here
    if (!token) {
      throw new Error(`No access token for branch ${branch}`);
    }
    await git.fetch({
      fs,
      http,
      dir: gitRepoPath,
      singleBranch: true,
      ref: `${branch}`,
      remote,
      url: serverUrl!,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const remoteCommit = await git.resolveRef({
      fs,
      dir: gitRepoPath,
      ref: `${remote}/${branch}`,
    });

    await git.writeRef({
      fs,
      dir: gitRepoPath,
      ref: `refs/heads/${branch}`,
      value: remoteCommit,
    });
  }

  let unpushedRefs: string[] = [];

  async function pull() {
    // NOTE for now we take any token - later we should check what we are allowed to fetch
    const token = await auth.getMaxAccessTokenForBranch('todo');

    await git.fetch({
      fs,
      http,
      dir: gitRepoPath,
      remote,
      url: serverUrl!,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const localRefs = await git.listBranches({ fs, dir: gitRepoPath });

    for (const localRef of localRefs) {
      if (localRef === anonymousBranch) {
        continue;
      }

      // find branches that don't exist remote (should be added - not implicit for now!)
      // find branches that exist remote but there head differs

      const remoteRef = `${remote}/${localRef}`;
      let localCommit: string | undefined;
      let remoteCommit: string | undefined;

      try {
        localCommit = await git.resolveRef({
          fs,
          dir: gitRepoPath,
          ref: localRef,
        });
      } catch (e) {
        console.log(`Could not resolve local ref ${localRef}:`, e);
      }

      try {
        remoteCommit = await git.resolveRef({
          fs,
          dir: gitRepoPath,
          ref: remoteRef,
        });
      } catch (e) {
        // Remote branch may not exist
        remoteCommit = undefined;
      }

      if (localCommit && remoteCommit) {
        // Four cases exist:
        if (localCommit === remoteCommit) {
          // 1. Both are identical -> no-op
          // console.log(`branch ${localRef} in sync`);
        } else {
          const mergeBase = await git.findMergeBase({
            fs,
            dir: gitRepoPath,
            oids: [localCommit, remoteCommit],
          });

          if (mergeBase[0] !== localCommit && mergeBase[0] !== remoteCommit) {
            // both changed -> merge
            const mergeResult = await git.merge({
              fs,
              dir: gitRepoPath,
              ours: localCommit,
              theirs: remoteCommit,
              fastForwardOnly: false,
              abortOnConflict: false,
              author: {
                name: 'Your Name',
                email: 'your.email@example.com',
              },
              mergeDriver: async ({ branches, contents, path }) => {
                const [_base, mine, theirs] = contents;

                console.log(`Merging ${branches[0]} with ${branches[1]}...`);
                console.log(`merged:`);
                console.log(contents);
                // resolvedConflicts.push(path);
                return {
                  cleanMerge: true,
                  mergedText: theirs === undefined ? mine! : theirs,
                };
              },
            });

            await git.writeRef({
              fs,
              dir: gitRepoPath,
              ref: `refs/heads/${localRef}`,
              value: mergeResult.oid!,
              force: true,
            });
          }

          if (mergeBase[0] === localCommit) {
            // 2. The remote has changed and local has not -> fast-forward
            console.log(
              `branch ${localRef} differs - remote ahaed, not behind`
            );

            await git.writeRef({
              fs,
              dir: gitRepoPath,
              ref: `refs/heads/${localRef}`,
              value: remoteCommit!,
              force: true,
            });
          } else if (mergeBase[0] === remoteCommit) {
            // 3. The local has changed and remote has not -> push
            console.log(`branch ${localRef} differs - local ahead, not behind`);
            unpushedRefs.push(localRef);
          } else {
            // 4. Both have changed -> merge required
            console.log(`branch ${localRef} differs - both changed`);
            unpushedRefs.push(localRef);
          }
        }
      } else if (localCommit && !remoteCommit) {
        unpushedRefs.push(localRef);
      }
    }

    // const resolvedConflicts: string[] = [];

    // // Merge with "use mine" behavior

    // // for (const file of filesToCheckout) {
    // console.log(`Checking out ${resolvedConflicts}...`);
    // await git.checkout({
    //   fs,
    //   dir: gitRepoPath,
    //   force: true,
    //   // filepaths: filesToCheckout,
    //   ref: ref,
    // });

    // if (resolvedConflicts.length > 0) {
    //   await git.add({
    //     fs,
    //     dir: gitRepoPath,
    //     filepath: resolvedConflicts,
    //   });
    //   // Commit the changes
    //   await git.commit({
    //     fs,
    //     dir: gitRepoPath,
    //     message:
    //       'Committed  merge resolution for [' +
    //       resolvedConflicts.join(', ') +
    //       ']',
    //     author: {
    //       name: 'NFS User',
    //       email: 'nfs-user@example.com',
    //     },
    //   });
    // }
  }

  async function push(branchesToPush: string[]) {
    if ((await auth.getUser()).type === 'local') {
      // local users cant push
      return;
    }

    // console.log('monitor push - pushing...');
    for (const branch of branchesToPush) {
      const token = await auth.getMaxAccessTokenForBranch(branch);
      await git.push({
        fs: fs,
        http,
        dir: gitRepoPath,
        remote,
        url: serverUrl!,
        ref: branch,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  let lastPushPromise: Promise<void> = Promise.resolve();

  async function sequentialPush(branchesToPush: string[]) {
    lastPushPromise = lastPushPromise.then(() => push(branchesToPush));
    await lastPushPromise;
  }

  async function pullPushTick() {
    const existing = await git.getConfig({
      fs,
      dir: gitRepoPath,
      path: `remote.${remote}.fetch`,
    });

    if (!existing) {
      await git.setConfig({
        fs,
        dir: gitRepoPath,
        path: `remote.${remote}.fetch`,
        value: `+refs/heads/*:refs/remotes/${remote}/*`,
      });
    }

    try {
      await pull();
      // TODO this filters any brounc with anonymous - need a better way to handle this
      let branchesToPush = unpushedRefs.filter(
        v => v.indexOf(anonymousBranch) === -1
      );

      await sequentialPush(branchesToPush);
      // Get the current commit SHA
      // const currentCommitSha = await git.resolveRef({
      //   fs: fs,
      //   dir: gitRepoPath,
      //   ref: 'HEAD',
      // });
      // // Check if the commit SHA has changed since the last push
      // if (!lastPushedCommit || currentCommitSha !== lastPushedCommit) {
      //   console.log(
      //     'Detected changes, pushing to remote...',
      //     currentCommitSha,
      //     lastPushedCommit
      //   );
      //   await push();
      //   await pull();
      // } else {
      //   console.log('monitor push - skipped...');
      // }
      // // Update the last known commit SHA
      // lastPushedCommit = currentCommitSha;
    } catch (err) {
      console.error('Error monitoring changes:', err);
    } finally {
      // Schedule the next execution after 1 second
      if (running) {
        setTimeout(pullPushTick, 1000);
      }
    }
  }

  function startSync() {
    running = true;
    pullPushTick();
  }

  function stopSync() {
    running = false;
  }

  return {
    start: () => {
      if (!running) {
        startSync();
        running = true;
      }
    },
    stop: () => {
      stopSync();
    },
    isRunning: () => running,
    loadBranch,
    sequentialPush,
  };
};
