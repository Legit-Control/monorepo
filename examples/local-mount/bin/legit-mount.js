#!/usr/bin/env node

import { spawn } from 'child_process';
import readline from 'readline';
import * as fsDisk from 'node:fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

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
    console.log(`Port ${port} is in use, trying next port...`);
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
    console.log(`\nSpawn process process... ` + cmd + ' in ' + cwd);

    // Execute the command through shell (handles command parsing automatically)
    const child = spawn(cmd, [], {
      cwd: cwd,
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', code => {
      if (code === 0) {
        console.log(
          `\nMount process completed successfully with exit code ${code}`
        );
        resolve();
      } else {
        console.error(`\nMount process failed with exit code ${code}`);
        reject(new Error(`Mount process failed with exit code ${code}`));
      }
    });

    child.on('error', error => {
      console.error(`\nError spawning mount process: ${error.message}`);
      reject(error);
    });
  });
}

function startNfsServerWorker(servePoint, port, logFile = 'nfs-server.log') {
  console.log(`\nStarting NFS server worker...`);
  console.log(`Serve point: ${servePoint}`);
  console.log(`Initial port: ${port}`);
  console.log(`Log file: ${logFile}`);

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

  // Capture stdout and forward to both console and log file
  child.stdout.on('data', data => {
    const output = data.toString();
    // console.log('data');
    // process.stdout.write(output);
    logWithTimestamp(output);
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
    }

    logWithTimestamp(message);
    logStream.end();
  });

  // Return the child process so it can be managed
  return child;
}

function mountNfsShare(mountPoint, port) {
  return new Promise((resolve, reject) => {
    console.log(`Mounting NFS share at ${mountPoint} on port ${port}...`);

    // Ensure mount point directory exists
    if (!fsDisk.existsSync(mountPoint)) {
      console.log(`Creating mount point directory: ${mountPoint}`);
      fsDisk.mkdirSync(mountPoint, { recursive: true });
    }

    // Try to unmount first in case something is already mounted
    exec(`umount -f ${mountPoint}`, unmountErr => {
      if (unmountErr) {
        console.log(`No existing mount to unmount at ${mountPoint}`);
      } else {
        console.log(`Unmounted existing mount at ${mountPoint}`);
      }

      // Mount the NFS share
      const mountCommand = `mount_nfs -o noappledouble,noapplexattr,nolocks,soft,retrans=2,timeo=10,vers=3,tcp,rsize=131072,actimeo=120,port=${port},mountport=${port} localhost:/ ${mountPoint}`;

      exec(mountCommand, mountErr => {
        if (mountErr) {
          console.error(`Failed to mount ${mountPoint}:`, mountErr.message);
          reject(mountErr);
          return;
        }

        console.log(`${mountPoint} mounted successfully`);

        // Verify the mount worked by checking if mount output contains our mount point
        exec('mount', (checkErr, stdout) => {
          if (checkErr) {
            console.error('Failed to verify mount:', checkErr.message);
            reject(checkErr);
            return;
          }

          if (stdout.includes(mountPoint)) {
            console.log('Mount verification successful');
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
      'Path to NFS server log file (default: nfs-server.log)'
    );

  const options = program.parse().opts();
  if (options.mountPath === undefined) {
    options.mountPath = `${options.repoPath}-nfs`;
  }

  if (options.port === undefined) {
    options.port = await findAvailablePort(13617);
  }

  console.log('Repository path:', options.repoPath);
  console.log('Mount path:', options.mountPath);
  console.log('Port:', options.port);
  console.log('Should spawn:', options.spawn);

  if (options.spawn) {
    let nfsServerProcess;

    try {
      console.log('Starting NFS server as worker process...');
      nfsServerProcess = startNfsServerWorker(
        options.repoPath,
        parseInt(options.port),
        options.logFile
      );
      console.log(
        `NFS server worker started. Logs will be written to ${options.logFile}`
      );

      // Give the NFS server a moment to start up
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mount the NFS share
      await mountNfsShare(options.mountPath, parseInt(options.port));

      // Run the command in the mounted directory
      console.log('spawn subprocess ...');
      await spawnSubProcess(options.mountPath, options.spawn);

      // After successful completion, prompt for commit message
      console.log('\nMount process completed. Ready to commit changes.');

      // Unmount the NFS share
      await unmountNfsShare(options.mountPath);

      // Clean up NFS server worker
      console.log('Stopping NFS server worker...');
      nfsServerProcess.kill();
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
        nfsServerProcess.kill();
      }

      process.exit(1);
    }
  } else {
    console.log('\nRunning in normal mode (not spawning)');
    console.log('TODO: Implement actual mounting logic');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { promptForCommitMessage, spawnSubProcess as runMountProcess };
