import * as net from 'net';
import { createRpcReply } from '../createRpcReply.js';
import { sendRpcError } from '../sendRpcError.js';

import { sendRpcSuccess } from '../sendRpcSuccess.js';
import { nfsstat3 } from '../nfs/procedures/errors.js';

export type MountHandlerResult =
  | { status: number; fileHandle?: never }
  | { status: nfsstat3.OK; fileHandle: Buffer };

export type MountHandler = (dirPath: string) => Promise<MountHandlerResult>;

async function mount(
  xid: number,
  socket: net.Socket,
  data: Buffer,
  mountHandler: MountHandler
): Promise<void> {
  // Extract dirpath - first 4 bytes are length, then string data
  const dirPathLength = data.readUInt32BE(0);
  const dirPath = data.slice(4, 4 + dirPathLength).toString('utf8');

  const mountResult = await mountHandler(dirPath);

  if (mountResult.status !== 0) {
    sendRpcError(socket, xid, 0, 1);
    return;
  }

  const authFlavorsBuffer = Buffer.alloc(4);
  authFlavorsBuffer.writeUInt32BE(0, 0); // Example auth flavor

  const filehandleLength = mountResult.fileHandle!.length;

  const fhandleLengthBuffer = Buffer.alloc(4);
  fhandleLengthBuffer.writeUInt32BE(filehandleLength, 0);

  const authFlavorsCountBuffer = Buffer.alloc(4);
  authFlavorsCountBuffer.writeUInt32BE(1, 0);

  sendRpcSuccess(
    socket,
    xid,
    Buffer.concat([
      Buffer.alloc(4).fill(0), // Status (0 = MNT3_OK)
      fhandleLengthBuffer,
      mountResult.fileHandle!,
      authFlavorsCountBuffer,
      authFlavorsBuffer,
    ])
  );
}

// Handle MOUNT program requests
export async function handleMountRequest(
  socket: net.Socket,
  xid: number,
  procedure: number,
  data: Buffer,
  handlers: {
    mount: MountHandler;
  }
): Promise<void> {
  switch (procedure) {
    case 0: // NULL
      // console.log(`Procedure: NULL (${procedure})`);
      // Create proper NULL reply with accepted status and empty verifier
      const nullReplyBuf = Buffer.alloc(8).fill(0);
      sendRpcSuccess(socket, xid, nullReplyBuf);
      break;

    case 1: // MNT
      // console.log(`Procedure: MNT (${procedure})`);
      try {
        await mount(xid, socket, data, handlers.mount);
        break;
      } catch (err) {
        console.error('Error handling MOUNT MNT request:', err);
      }
      break;

    case 5: // EXPORT
      // console.log(`Procedure: EXPORT (${procedure})`);
      try {
        // Create export reply - just a null export list for now
        const replyBuf = Buffer.alloc(4);

        // No exports (0 = null list)
        replyBuf.writeUInt32BE(0, 0);

        // Create the full RPC reply
        const reply = createRpcReply(xid, replyBuf);

        // Send the reply
        socket.write(reply);
      } catch (err) {
        sendRpcError(socket, xid, 0, 1);
      }
      break;

    default:
      // console.log(`Unsupported MOUNT procedure: ${procedure}`);
      sendRpcError(socket, xid, 0, 2); // Proc unavailable
  }
}
