#!/usr/bin/env node

import { spawn } from 'child_process';
import readline from 'readline';
import * as fsDisk from 'node:fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

import * as net from 'net';

import { exec } from 'child_process';
import { Command } from 'commander';
import { sessionDataPath } from './claudeVirtualSessionFileVirtualFile.js';

const legitBranchPrefix = 'legit-code.';

const settingsContent = JSON.stringify(
  {
    env: { CLAUDE_CONFIG_DIR: sessionDataPath },
  },
  null,
  2
);

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer();

    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });

    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to find an available port starting from the given port
async function findAvailablePort(startPort) {
  let port = startPort;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loop

  while (attempts < maxAttempts) {
    if (await isPortAvailable(port)) {
      return port;
    }
    // console.log(`Port ${port} is in use, trying next port...`);
    port++;
    attempts++;
  }

  throw new Error(
    `Could not find an available port after ${maxAttempts} attempts starting from ${startPort}`
  );
}

function promptForCommitMessage() {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Please enter a commit message: ', answer => {
      rl.close();
      resolve(answer);
    });
  });
}

function displayLegitCodeArt() {
  const orange = '\x1b[38;5;208m';
  const reset = '\x1b[0m';
  console.log(`${orange}
 ██╗     ███████╗ ██████╗ ██╗████████╗     ██████╗ ██████╗ ██████╗ ███████╗
 ██║     ██╔════╝██╔════╝ ██║╚══██╔══╝    ██╔════╝██╔═══██╗██╔══██╗██╔════╝
 ██║     █████╗  ██║  ███╗██║   ██║       ██║     ██║   ██║██║  ██║█████╗
 ██║     ██╔══╝  ██║   ██║██║   ██║       ██║     ██║   ██║██║  ██║██╔══╝
 ███████╗███████╗╚██████╔╝██║   ██║       ╚██████╗╚██████╔╝██████╔╝███████╗
 ╚══════╝╚══════╝ ╚═════╝ ╚═╝   ╚═╝        ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
${reset}`);
  console.log(`
Claude CLI wrapper that stores your AI coding sessions directly in your git repository's history.
Each session becomes a branch, allowing you to review, apply, or discard changes before merging them to your main branch.
`);
}

function spawnSubProcess(cwd, cmd, parameters = [], silent = false) {
  return new Promise((resolve, reject) => {
    // console.log(`\nSpawn process process... ` + cmd + ' in ' + cwd, `--settings="${settingsContent}"`);

    // Execute the command through shell (handles command parsing automatically)
    const child = spawn(cmd, parameters, {
      cwd: cwd,
      stdio: silent ? 'ignore' : 'inherit',
      shell: false,
    });

    child.on('close', code => {
      if (code === 0) {
        // console.log(
        //   `\nMount process completed successfully with exit code ${code}`
        // );
        resolve();
      } else {
        // console.error(`\nMount process failed with exit code ${code}`);
        reject(new Error(`Mount process failed with exit code ${code}`));
      }
    });

    child.on('error', error => {
      // console.error(`\nError spawning mount process: ${error.message}`);
      reject(error);
    });
  });
}

function startNfsServerWorker(servePoint, port, logFile, debugBrk = false) {
  // console.log(`\nStarting NFS server worker...`);
  // console.log(`Serve point: ${servePoint}`);
  // console.log(`Initial port: ${port}`);
  // console.log(`Log file: ${logFile}`);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Create log file stream
  const logStream = fsDisk.createWriteStream(logFile, { flags: 'a' });

  // Add timestamp function for log entries
  const logWithTimestamp = (data, isError = false) => {
    const timestamp = new Date().toISOString();
    const prefix = isError ? `ERROR: ` : ``;
    logStream.write(`[${timestamp}] ${prefix}${data}`);
  };

  const workerScript = path.join(__dirname, 'nfs-server-worker.js');

  let args = [workerScript, servePoint, port.toString()];
  if (debugBrk) {
    console.log(`Waiting for debugger`);
    args = ['--inspect-brk', workerScript, servePoint, port.toString()];
  }

  const child = spawn(process.execPath, args, {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'pipe'],
    detached: false,
  });

  let serverReadyResolver;
  let serverReadyRejecter;
  const serverReadyPromise = new Promise((resolve, reject) => {
    serverReadyResolver = resolve;
    serverReadyRejecter = reject;
  });

  // Capture stdout and forward to both console and log file
  child.stdout.on('data', data => {
    const output = data.toString();
    // console.log('data');
    // process.stdout.write(output);
    logWithTimestamp(output);

    // Check for NFS_SERVER_READY message
    if (output.includes('NFS_SERVER_READY')) {
      // console.log('NFS server is ready');
      serverReadyResolver();
    }
  });

  // Capture stderr and forward to both console and log file
  child.stderr.on('data', data => {
    const output = data.toString();
    // process.stderr.write(output);
    logWithTimestamp(output, true);
  });

  child.on('error', error => {
    console.error(`Error spawning NFS server worker: ${error.message}`);
    logWithTimestamp(
      `Error spawning NFS server worker: ${error.message}\n`,
      true
    );
    serverReadyRejecter(error);
  });

  child.on('close', code => {
    const message =
      code === 0
        ? `NFS server worker completed successfully with exit code ${code}\n`
        : `NFS server worker failed with exit code ${code}\n`;

    if (code === 0) {
      console.log(
        `NFS server worker completed successfully with exit code ${code}`
      );
    } else {
      console.error(`NFS server worker failed with exit code ${code}`);
      // Log the entire log file contents
      // try {
      //   const logContents = fsDisk.readFileSync(logFile, 'utf-8');
      //   console.error('\n--- NFS Server Log Contents ---');
      //   console.error(logContents);
      //   console.error('--- End of Log ---\n');
      // } catch (readErr) {
      //   console.error(`Failed to read log file: ${readErr.message}`);
      // }
    }

    logWithTimestamp(message);
    logStream.end();
  });

  // Return an object with both the child process and the ready promise
  return {
    process: child,
    ready: serverReadyPromise,
  };
}

function mountNfsShare(mountPoint, port) {
  return new Promise((resolve, reject) => {
    // console.log(`Mounting NFS share at ${mountPoint} on port ${port}...`);

    // Ensure mount point directory exists
    if (!fsDisk.existsSync(mountPoint)) {
      // console.log(`Creating mount point directory: ${mountPoint}`);
      fsDisk.mkdirSync(mountPoint, { recursive: true });
    }

    // Try to unmount first in case something is already mounted
    exec(`umount -f ${mountPoint}`, unmountErr => {
      if (unmountErr) {
        // console.log(`No existing mount to unmount at ${mountPoint}`);
      } else {
        // console.log(`Unmounted existing mount at ${mountPoint}`);
      }

      // Mount the NFS share
      const mountCommand = `mount_nfs -o nolocks,soft,retrans=2,timeo=10,vers=3,tcp,rsize=131072,actimeo=120,port=${port},mountport=${port} localhost:/ ${mountPoint}`;

      exec(mountCommand, mountErr => {
        if (mountErr) {
          console.error(`Failed to mount ${mountPoint}:`, mountErr.message);
          reject(mountErr);
          return;
        }

        // console.log(`${mountPoint} mounted successfully`);

        // Verify the mount worked by checking if mount output contains our mount point
        exec('mount', (checkErr, stdout) => {
          if (checkErr) {
            console.error('Failed to verify mount:', checkErr.message);
            reject(checkErr);
            return;
          }

          if (stdout.includes(mountPoint)) {
            // console.log('Mount verification successful');
            resolve();
          } else {
            console.error(
              'Mount verification failed - mount point not found in mount output'
            );
            reject(new Error('Mount verification failed'));
          }
        });
      });
    });
  });
}

function killProcess(process) {
  return new Promise((resolve, reject) => {
    let timeout;
    let killed = false;

    const cleanup = () => {
      clearTimeout(timeout);
    };

    const on_close = code => {
      cleanup();
      if (!killed) {
        killed = true;
        console.log('Process stopped successfully');
      }
      resolve();
    };

    const on_error = err => {
      cleanup();
      if (!killed) {
        killed = true;
        console.error('Error stopping process:', err.message);
      }
      reject(err);
    };

    // Set a timeout to forcefully kill if SIGTERM doesn't work
    timeout = setTimeout(() => {
      if (!killed) {
        console.log('Process did not stop gracefully, using force...');
        process.kill('SIGKILL');
      }
    }, 5000);

    process.once('close', on_close);
    process.once('error', on_error);

    // Try graceful shutdown first
    process.kill('SIGTERM');
  });
}

function unmountNfsShare(mountPoint) {
  return new Promise((resolve, reject) => {
    console.log(`Unmounting NFS share at ${mountPoint}...`);

    exec(`umount ${mountPoint}`, (err, stdout, stderr) => {
      if (err) {
        // Check if it's just because the mount point doesn't exist
        if (
          err.message.includes('not currently mounted') ||
          err.message.includes('No such file or directory')
        ) {
          console.log(
            `Mount point ${mountPoint} was not mounted or doesn't exist`
          );
          resolve();
          return;
        }
        console.error(`Failed to unmount ${mountPoint}:`, err.message);
        reject(err);
        return;
      }

      // console.log(`${mountPoint} unmounted successfully`);
      resolve();
    });
  });
}

async function checkPreconditions(repoPath) {
  const platform = process.platform;

  // Check 1: Operating system
  if (platform !== 'darwin') {
    const osName =
      platform === 'linux'
        ? 'Linux'
        : platform === 'win32'
          ? 'Windows'
          : platform;
    if (platform === 'linux') {
      console.error(`\n❌ Error: legit-code currently only supports macOS.`);
      console.error(`\nWe detected you are running on ${osName}.`);
      console.error(`\n📋 We plan to support other operating systems!`);
      console.error(`   Please upvote or track our progress here:`);
      console.error(`   https://github.com/Legit-Control/monorepo/issues/61\n`);
      process.exit(1);
    } else if (platform === 'win32') {
      console.error(`\n❌ Error: legit-code currently only supports macOS.`);
      console.error(`\nWe detected you are running on ${osName}.`);
      console.error(`\n📋 We plan to support other operating systems!`);
      console.error(`   Please upvote or track our progress here:`);
      console.error(`   https://github.com/Legit-Control/monorepo/issues/62\n`);
      process.exit(1);
    } else {
      console.error(`\n❌ Error: legit-code currently only supports macOS.`);
      console.error(`\nWe detected you are running on ${osName}.`);
      console.error(`\n📋 We would love to support other operating systems!`);
      console.error(`   Please file an issue here:`);
      console.error(`   https://github.com/Legit-Control/monorepo/issues\n`);
      process.exit(1);
    }
  }

  // Check 2: Claude CLI installed
  try {
    await spawnSubProcess(process.cwd(), 'claude', ['--version'], true);
  } catch (error) {
    console.error(`\n❌ Error: Claude CLI not found.`);
    console.error(
      `\nlegit-code currently requires the Claude CLI to be installed.`
    );
    console.error(`\nPlease install Claude first:`);
    console.error(`   https://claude.ai/download \n`);
    console.error(`   Please discuss here:  \n`);
    console.error(`   https://github.com/Legit-Control/monorepo/issues/63 \n`);
    process.exit(1);
  }

  // Check 3: Git repository
  const gitPath = path.join(repoPath, '.git');
  if (!fsDisk.existsSync(gitPath)) {
    console.error(`\n❌ Error: Not a git repository.`);
    console.error(`\nlegit-code can only run in the root of a git repository.`);
    console.error(`\n📝 To initialize a new repository, run:`);
    console.error(`\n   git init --initial-branch=main`);
    console.error(`   echo "# My project" > README.md`);
    console.error(`   git add README.md`);
    console.error(`   git commit -m "Initial commit"\n`);
    process.exit(1);
  }
}

async function main() {
  const program = new Command();

  program
    .name('legit-mount')
    .description('CLI tool to mount legit repositories')
    .version('1.0.0')
    .option(
      '-n --new-session <name>',
      'Create a new Sesssion with the passed name - generated if empty',
      false
    )
    .option(
      '--repo-path <path>',
      'Path to the repository to mount',
      process.cwd()
    )
    .option(
      '--mount-path <path>',
      'Folder where to mount the repository ([repo path]-nfs by default) '
    )
    .option('--spawn <cmd>', 'Command to execute after mounting', 'claude')
    .option(
      '--port <number>',
      'Port for NFS server - first free port starting from Legit Port (13617)'
    )
    .option(
      '--log-file <path>',
      'Path to NFS server log file (default: .git/nfs-server.log)',
      '.git/nfs-server.log'
    )
    .option(
      '--debugger <boolean>',
      'Enable debugger on NFS server worker',
      false
    );

  const options = program.parse().opts();
  if (options.mountPath === undefined) {
    options.mountPath = `${options.repoPath}-nfs`;
  }

  if (options.port === undefined) {
    options.port = await findAvailablePort(13617);
  }

  // Check all preconditions before proceeding
  await checkPreconditions(options.repoPath);

  displayLegitCodeArt();

  let nfsServerProcess;

  try {
    // console.log('Starting NFS server as worker process...');
    nfsServerProcess = startNfsServerWorker(
      options.repoPath,
      parseInt(options.port),
      options.logFile,
      options.debugger
    );
    // console.log(
    //   `NFS server worker started. Logs will be written to ${options.logFile}`
    // );

    // Wait for NFS server to be ready
    // console.log('Waiting for NFS server to be ready...');
    await nfsServerProcess.ready;

    // Mount the NFS share
    await mountNfsShare(options.mountPath, parseInt(options.port));

    const legitPath = path.join(options.mountPath, '.legit');

    // Read current branch from mount path at /.legit/currentBranch
    const currentBranchPath = path.join(legitPath, 'currentBranch');
    let currentBranch = fsDisk.readFileSync(currentBranchPath, 'utf-8').trim();

    let sessionName = options.newSession;

    let createSession = false;
    // Handle new session creation
    if (options.newSession) {
      // Generate session name if not provided or if it's the default (process.cwd())
      if (!sessionName) {
        sessionName = `session-${Date.now()}`;
      }

      createSession = true;
    } else {
      // Read available claude sessions from branches
      const branchesPath = path.join(options.mountPath, '.legit', 'branches');
      let claudeBranches = [];

      const branches = fsDisk.readdirSync(branchesPath);
      claudeBranches = branches
        .filter(
          branch =>
            branch.startsWith(legitBranchPrefix) &&
            !branch.endsWith('-operation')
        )
        .map(branch => branch.replace(legitBranchPrefix, ''));
      // console.log(`Found ${claudeBranches.length} existing Claude sessions`);

      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'sessionChoice',
          message: 'Select an existing Sesssion or create a new one:\n',
          choices: ['* New Session *', ...claudeBranches],
        },
      ]);

      if (answer.sessionChoice === '* New Session *') {
        // Create new session branch
        sessionName = `session-${Date.now()}`;
        createSession = true;
      } else {
        sessionName = answer.sessionChoice;
      }
    }

    // Create the base branch for the session by setting currentBranch to sessionName
    if (createSession) {
      fsDisk.writeFileSync(currentBranchPath, sessionName, 'utf-8');
      console.log(
        `Created new session branch: ${sessionName} by ${currentBranchPath}`
      );
      currentBranch = sessionName;
    }

    // set the legit reference branch to the base branch
    const targetBranchPath = path.join(
      options.mountPath,
      '.legit',
      'reference-branch'
    );
    fsDisk.writeFileSync(targetBranchPath, sessionName, 'utf-8');

    // use legit currentBranch to change the branch to the the claudesession branch
    const claudeBranch = `${legitBranchPrefix}${sessionName}`;
    fsDisk.writeFileSync(currentBranchPath, claudeBranch, 'utf-8');

    const cb = fsDisk.readFileSync(currentBranchPath, 'utf-8');
    console.log(`Switched to Claude session branch: ${cb.trim()}`);

    const args = ['--settings', settingsContent];
    if (!createSession) {
      args.push('--resume', '00000000-0000-0000-0000-000000000000');
    }
    // Run the command in the mounted directory
    // console.log('spawn subprocess ...', args);
    await spawnSubProcess(options.mountPath, options.spawn, args);

    // After successful completion, prompt for commit message
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'sessionChoice',
        message: 'What do you want to do with the session?',
        choices: [
          'Continue later', // nothing to do
          'Apply changes to [' + sessionName + ']', // set target branch tree to currentbranch tree
          'Discard changes', // find the last merged commit and set the head pointer to it
        ],
      },
    ]);

    if (answer.sessionChoice == 'Discard changes') {
      // Delete the session branch and its operation branch
      const branchesPath = path.join(options.mountPath, '.legit', 'branches');
      const legitSessionBranchPath = `${legitBranchPrefix}${sessionName}`;

      const legitOperationBranchPath = `${legitBranchPrefix}${sessionName}-operation`;

      console.error(`\n❌ Error: Discarding not implemented yet\n\n`);
      console.error(` We would love to support discarding sessions soon!`);
      console.error(` Please upvote or track our progress here:`);
      console.error(`   https://github.com/Legit-Control/monorepo/issues/64\n`);

      console.error(
        `\n To cleanup in the meatime - just drop the session branches:`
      );
      console.error(
        `  git branch -d ${sessionName} ${legitSessionBranchPath} ${legitOperationBranchPath}\n\n`
      );
    } else if (answer.sessionChoice.startsWith('Apply changes to')) {
      // for now just apply the tree of the current branch to the target branch
      const commitMessagePrompt = await inquirer.prompt([
        {
          type: 'input',
          name: 'commitMessage',
          message: 'Enter a commit message to describe the changes',
        },
      ]);

      fsDisk.writeFileSync(
        legitPath + '/apply-changes',
        commitMessagePrompt.commitMessage,
        'utf-8'
      );
    } else {
      // no op
      // TODO to continue a session we also need to provide the sessions via legit file again
    }

    // Unmount the NFS share
    await unmountNfsShare(options.mountPath);

    // Clean up NFS server worker
    await killProcess(nfsServerProcess.process);
  } catch (error) {
    console.error('\nMount process failed:', error.message);

    // Try to unmount on error
    try {
      await unmountNfsShare(options.mountPath);
    } catch (unmountErr) {
      console.error('Error during cleanup unmount:', unmountErr.message);
    }

    // Clean up NFS server worker on error
    if (nfsServerProcess) {
      console.log('Stopping NFS server worker due to error...');
      await killProcess(nfsServerProcess.process);
    }

    process.exit(1);
  }
}

// Always run main for CLI tool
main();

export { promptForCommitMessage, spawnSubProcess as runMountProcess };
