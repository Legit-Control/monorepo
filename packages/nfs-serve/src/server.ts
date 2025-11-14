import * as net from "net";
import * as path from "path";

import { createRpcReply } from "./rpc/createRpcReply.js";
import { sendRpcError } from "./rpc/sendRpcError.js";
import { handleNfsRequest } from "./rpc/nfs/handleNfsRequest.js";
import {
  handleMountRequest,
  MountHandler,
} from "./rpc/mount/handleMountRequest.js";
import { CommitHandler } from "./rpc/nfs/procedures/commit.js";
import { GetAttributesHandler } from "./rpc/nfs/procedures/getAttributes.js";
import { LookupHandler } from "./rpc/nfs/procedures/lookup.js";
import { ReadHandler } from "./rpc/nfs/procedures/read.js";
import { SetAttrHandler } from "./rpc/nfs/procedures/setattr.js";
import { WriteHandler } from "./rpc/nfs/procedures/write.js";
import { AccessHandler } from "./rpc/nfs/procedures/access.js";
import { CreateHandler } from "./rpc/nfs/procedures/create.js";
import { FSInfoHandler } from "./rpc/nfs/procedures/fsinfo.js";
import { FSStatHandler } from "./rpc/nfs/procedures/fsstat.js";
import { LinkHandler } from "./rpc/nfs/procedures/link.js";
import { MkdirHandler } from "./rpc/nfs/procedures/mkdir.js";
import { MknodHandler } from "./rpc/nfs/procedures/mknod.js";
import { PathconfHandler } from "./rpc/nfs/procedures/pathconf.js";
import { ReaddirHandler } from "./rpc/nfs/procedures/readdir.js";
import { ReaddirplusHandler } from "./rpc/nfs/procedures/readdirplus.js";
import { ReadlinkHandler } from "./rpc/nfs/procedures/readlink.js";
import { RemoveHandler } from "./rpc/nfs/procedures/remove.js";
import { RenameHandler } from "./rpc/nfs/procedures/rename.js";
import { RmdirHandler } from "./rpc/nfs/procedures/rmdir.js";
import { SymlinkHandler } from "./rpc/nfs/procedures/symlink.js";

// Base directory for our NFS server
export const BASE_DIR = path.resolve(process.cwd(), "testmount");

async function handleRecord(
  socket: net.Socket,
  data: Buffer,

  handler: {
    mount: MountHandler;
    access: AccessHandler;
    commit: CommitHandler;
    create: CreateHandler;
    fsinfo: FSInfoHandler;
    fsstat: FSStatHandler;
    getAttributes: GetAttributesHandler;
    link: LinkHandler;
    lookup: LookupHandler;
    mkdir: MkdirHandler;
    mknod: MknodHandler;
    pathconf: PathconfHandler;
    read: ReadHandler;
    readdir: ReaddirHandler;
    readdirplus: ReaddirplusHandler;
    readlink: ReadlinkHandler;
    remove: RemoveHandler;
    rename: RenameHandler;
    rmdir: RmdirHandler;
    setattr: SetAttrHandler;
    symlink: SymlinkHandler;
    write: WriteHandler;
  },
): Promise<void> {
  let processedPosition = 0;
  // Here we would handle the complete record
  // For now, just log the data
  // Get the XID from the first 4 bytes
  const requestXid = data.readUInt32BE(processedPosition);
  processedPosition += 4;

  // Get the message type (CALL=0)
  const msgType = data.readUInt32BE(processedPosition);
  processedPosition += 4;

  // For NFSv3, sometimes the initial packets might be different
  // Normally the message type should be 0 for CALL
  if (msgType !== 0) {
    // Try to handle portmapper request (program 100000)
    if (data.length >= 24) {
      const possibleProgram = data.readUInt32BE(12);
      if (possibleProgram === 100000) {
        // PMAP_PROG
        console.log("Detected possible portmapper request");
        handlePortmapRequest(socket, requestXid, data);
        return;
      }
    }

    console.error("Could not parse as RPC call");
    // Dump the entire buffer for debugging
    console.error(`Full buffer contents: ${data.toString("hex")}`);
    return;
  }

  // Parse RPC version, program, version, procedure
  // const rpcVersion = data.readUInt32BE(processedPosition);
  processedPosition += 4;
  const program = data.readUInt32BE(processedPosition);
  processedPosition += 4;
  const version = data.readUInt32BE(processedPosition);
  processedPosition += 4;
  const procedure = data.readUInt32BE(processedPosition);
  processedPosition += 4;

  // console.log(
  //   `RPC Call: Version=${rpcVersion}, Program=${program}, Version=${version}, Procedure=${procedure}`,
  // );

  // Move past credential and verifier
  // let offset = 24 + 4;
  // const credFlavor = data.readUInt32BE(processedPosition);
  processedPosition += 4;
  const credLength = data.readUInt32BE(processedPosition);
  processedPosition += 4 + credLength;
  // const verfFlavor = data.readUInt32BE(processedPosition);
  processedPosition += 4;
  const verfLength = data.readUInt32BE(processedPosition);
  processedPosition += 4 + verfLength;

  // Extract the procedure-specific data
  const procData = data.slice(processedPosition);
  processedPosition += procData.length;

  // console.log(
  //   `Procedure-specific data length: ${procData.length} bytes ` +
  //     offset,
  // );

  // console.log("\n\nHandling NFS request:");

  // Handle MOUNT program
  if (program === 100005 && version === 3) {
    await handleMountRequest(socket, requestXid, procedure, procData, handler);
  }
  // Handle NFS program
  else if (program === 100003 && version === 3) {
    await handleNfsRequest(socket, requestXid, procedure, procData, handler);
  }
  // Unsupported program
  else {
    console.log(`Unsupported program/version: ${program}/${version}`);
    // Send a program unavailable error
    sendRpcError(socket, requestXid, 1, 3);
  }
}

export const createNfs3Server = (handler: {
  mount: MountHandler;
  access: AccessHandler;
  commit: CommitHandler;
  create: CreateHandler;
  fsinfo: FSInfoHandler;
  fsstat: FSStatHandler;
  getAttributes: GetAttributesHandler;
  link: LinkHandler;
  lookup: LookupHandler;
  mkdir: MkdirHandler;
  mknod: MknodHandler;
  pathconf: PathconfHandler;
  read: ReadHandler;
  readdir: ReaddirHandler;
  readdirplus: ReaddirplusHandler;
  readlink: ReadlinkHandler;
  remove: RemoveHandler;
  rename: RenameHandler;
  rmdir: RmdirHandler;
  setattr: SetAttrHandler;
  symlink: SymlinkHandler;
  write: WriteHandler;
}) => {
  return net.createServer(
    {
      allowHalfOpen: true, // Ensure sockets are fully closed
    },
    (socket) => {
      let buffer = Buffer.alloc(0);
      let fragmentAccumulator: Buffer[] = [];

      console.log("Client connected");

      // Handle data from the client
      const taskQueue: (() => Promise<void>)[] = [];
      let isProcessingQueue = false;

      const processQueue = async () => {
        if (isProcessingQueue) {
          console.log("----------------------------------------");
          console.log("Already processing queue");
          console.log("----------------------------------------");
          return;
        }
        isProcessingQueue = true;

        while (taskQueue.length > 0) {
          const task = taskQueue.shift();
          if (task) {
            await task();
          }
        }

        isProcessingQueue = false;
      };

      socket.on("data", (data) => {
        buffer = Buffer.concat([buffer, data]);

        let i = 0;
        while (buffer.length >= 4) {
          i++;

          const header = buffer.readUInt32BE(0);
          const isLastFragment = (header & 0x80000000) !== 0;
          const fragmentLength = header & 0x7fffffff;

          if (buffer.length < 4 + fragmentLength) {
            break; // Wait for more data
          }

          const fragmentData = buffer.slice(4, 4 + fragmentLength);
          buffer = buffer.slice(4 + fragmentLength); // Move buffer forward

          fragmentAccumulator.push(fragmentData);

          if (isLastFragment) {
            const fullRecord = Buffer.concat(fragmentAccumulator);
            fragmentAccumulator = [];
            taskQueue.push(async () => {
              await handleRecord(socket, fullRecord, handler);
            });
            processQueue();
          }
        }
      });

      // Handle client disconnect
      socket.on("end", () => {
        console.log("Client disconnected");
      });

      // Handle error events
      socket.on("error", (err) => {
        console.error("Socket error:", err);
      });

      // Handle timeout events
      socket.on("timeout", () => {
        console.log("Socket timeout - closing connection");
        socket.end();
      });

      // Handle close events
      socket.on("close", (hadError) => {
        console.log(`Socket closed ${hadError ? "with" : "without"} error`);
      });
    },
  );
};

// Handle portmap program requests
function handlePortmapRequest(
  socket: net.Socket,
  xid: number,
  data: Buffer,
): void {
  console.log("Handling portmap request");

  try {
    // Try to extract procedure
    let procedure = -1;
    if (data.length >= 24) {
      procedure = data.readUInt32BE(20);
    }

    console.log(`Portmap procedure: ${procedure}`);

    // Create RPC accepted reply header
    const replyHeader = Buffer.alloc(24);

    // Reply status (0 = accepted)
    replyHeader.writeUInt32BE(0, 0);

    // Verifier (AUTH_NONE)
    replyHeader.writeUInt32BE(0, 4);
    replyHeader.writeUInt32BE(0, 8);

    // Accept status (0 = success)
    replyHeader.writeUInt32BE(0, 12);

    switch (procedure) {
      case 3: // GETPORT
        // Extract program, version, protocol
        if (data.length < 40) {
          console.error("Incomplete GETPORT request");
          // Send error
          replyHeader.writeUInt32BE(1, 12); // Accept status (1 = prog unavail)
          socket.write(createRpcReply(xid, replyHeader));
          return;
        }

        let offset = 24;
        // Get past auth info
        // const _authFlavor = data.readUInt32BE(offset);
        offset += 4;
        const authLen = data.readUInt32BE(offset);
        offset += 4 + authLen;
        // Skip verifier
        // const verfFlavor = data.readUInt32BE(offset);
        offset += 4;
        const verfLen = data.readUInt32BE(offset);
        offset += 4 + verfLen;

        // Read program, version, protocol
        const program = data.readUInt32BE(offset);
        const version = data.readUInt32BE(offset + 4);
        const protocol = data.readUInt32BE(offset + 8);

        console.log(
          `GETPORT request for program ${program}, version ${version}, protocol ${protocol}`,
        );

        let port = 0;

        // Handle only NFS and MOUNT programs
        if (program === 100003 && version === 3) {
          // NFS
          port = 2049;
        } else if (program === 100005 && version === 3) {
          // MOUNT
          port = 2049;
        }

        console.log(`Returning port ${port} for program ${program}`);

        // Create GETPORT reply
        const portBuf = Buffer.alloc(4);
        portBuf.writeUInt32BE(port, 0);

        // Combine header and port
        const reply = Buffer.concat([replyHeader, portBuf]);

        // Send reply
        socket.write(createRpcReply(xid, reply));
        break;

      case 4: // DUMP
        // Return empty list (no services)
        const emptyList = Buffer.alloc(4);
        emptyList.writeUInt32BE(0, 0); // Empty mapping list

        // Combine header and empty list
        const dumpReply = Buffer.concat([replyHeader, emptyList]);

        // Send reply
        socket.write(createRpcReply(xid, dumpReply));
        break;

      default:
        console.log(`Unsupported portmap procedure: ${procedure}`);
        // Send error
        replyHeader.writeUInt32BE(1, 12); // Accept status (1 = prog unavail)
        socket.write(createRpcReply(xid, replyHeader));
    }
  } catch (err) {
    console.error("Error handling portmap request:", err);
    // Send generic error
    const errorReply = Buffer.alloc(24);
    errorReply.writeUInt32BE(0, 0); // Accepted
    errorReply.writeUInt32BE(0, 4); // AUTH_NONE
    errorReply.writeUInt32BE(0, 8); // No cred data
    errorReply.writeUInt32BE(1, 12); // PROG_UNAVAIL
    socket.write(createRpcReply(xid, errorReply));
  }
}
