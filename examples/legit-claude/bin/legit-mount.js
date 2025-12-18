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

function spawnSubProcess(cwd, cmd) {
  return new Promise((resolve, reject) => {
    // console.log(`\nSpawn process process... ` + cmd + ' in ' + cwd);

    // Execute the command through shell (handles command parsing automatically)
    const child = spawn(cmd, [], {
      cwd: cwd,
      stdio: 'inherit',
      shell: true,
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

function startNfsServerWorker(servePoint, port, logFile) {
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
  const child = spawn(
    process.execPath,
    ['--inspect', workerScript, servePoint, port.toString()],
    {
      cwd: process.cwd(),
      stdio: ['inherit', 'pipe', 'pipe'],
      detached: false,
    }
  );

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
      try {
        const logContents = fsDisk.readFileSync(logFile, 'utf-8');
        console.error('\n--- NFS Server Log Contents ---');
        console.error(logContents);
        console.error('--- End of Log ---\n');
      } catch (readErr) {
        console.error(`Failed to read log file: ${readErr.message}`);
      }
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
      const mountCommand = `mount_nfs -o noappledouble,noapplexattr,nolocks,soft,retrans=2,timeo=10,vers=3,tcp,rsize=131072,actimeo=120,port=${port},mountport=${port} localhost:/ ${mountPoint}`;

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

      console.log(`${mountPoint} unmounted successfully`);
      resolve();
    });
  });
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
    );

  const options = program.parse().opts();
  if (options.mountPath === undefined) {
    options.mountPath = `${options.repoPath}-nfs`;
  }

  if (options.port === undefined) {
    options.port = await findAvailablePort(13617);
  }

  // console.log('Repository path:', options.repoPath);
  // console.log('Mount path:', options.mountPath);
  // console.log('Port:', options.port);
  // console.log('Should spawn:', options.spawn);

  let nfsServerProcess;

  try {
    // console.log('Starting NFS server as worker process...');
    nfsServerProcess = startNfsServerWorker(
      options.repoPath,
      parseInt(options.port),
      options.logFile
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
            branch.startsWith('claude.') && !branch.endsWith('-operation')
        )
        .map(branch => branch.replace('claude.', ''));
      console.log(`Found ${claudeBranches.length} existing Claude sessions`);

      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'sessionChoice',
          message: 'Select session option:',
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

    // Create the base branch for the session set the target branch to the new branch
    if (createSession) {
      fsDisk.writeFileSync(currentBranchPath, sessionName, 'utf-8');
      console.log(
        `Created new session branch: ${sessionName} by ${currentBranchPath}`
      );
      currentBranch = sessionName;
    }

    // set the target branch to the basse branch
    const targetBranchPath = path.join(
      options.mountPath,
      '.legit',
      'reference-branch'
    );
    fsDisk.writeFileSync(targetBranchPath, currentBranch, 'utf-8');

    // now change brach to the the claude branch:
    const claudeBranch = `claude.${currentBranch}`;
    fsDisk.writeFileSync(currentBranchPath, claudeBranch, 'utf-8');

    // Run the command in the mounted directory
    console.log('spawn subprocess ...');
    await spawnSubProcess(options.mountPath, options.spawn);

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
      // TODO implment discard changes
      // find the commit in the change branch that was is a merge reference commit (two parents)
      // discard all commits till than by setting the head to it
      // if the commit is part of the target branch - discard the whole branch.
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
    console.log('Stopping NFS server worker...');
    nfsServerProcess.process.kill();
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
      nfsServerProcess.process.kill();
    }

    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { promptForCommitMessage, spawnSubProcess as runMountProcess };
