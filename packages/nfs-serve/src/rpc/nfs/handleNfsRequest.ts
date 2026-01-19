import * as net from 'net';
import { sendNfsError } from './sendNfsError.js';

import {
  getAttributes,
  GetAttributesHandler,
} from './procedures/getAttributes.js';
import { setattr, SetAttrHandler } from './procedures/setattr.js';
import { lookup, LookupHandler } from './procedures/lookup.js';
import { access, AccessHandler } from './procedures/access.js';
import { readlink, ReadlinkHandler } from './procedures/readlink.js';
import { read, ReadHandler } from './procedures/read.js';
import { write, WriteHandler } from './procedures/write.js';
import { create, CreateHandler } from './procedures/create.js';
import { mkdir, MkdirHandler } from './procedures/mkdir.js';
import { symlink, SymlinkHandler } from './procedures/symlink.js';
import { mknod, MknodHandler } from './procedures/mknod.js';
import { remove, RemoveHandler } from './procedures/remove.js';
import { rmdir, RmdirHandler } from './procedures/rmdir.js';
import { rename, RenameHandler } from './procedures/rename.js';
import { link, LinkHandler } from './procedures/link.js';
import { readdir, ReaddirHandler } from './procedures/readdir.js';
import { readdirplus, ReaddirplusHandler } from './procedures/readdirplus.js';
import { fsstat, FSStatHandler } from './procedures/fsstat.js';
import { fsinfo, FSInfoHandler } from './procedures/fsinfo.js';
import { pathconf, PathconfHandler } from './procedures/pathconf.js';
import { commit, CommitHandler } from './procedures/commit.js';
import { sendRpcSuccess } from '../sendRpcSuccess.js';

// Handle NFS program requests
export async function handleNfsRequest(
  socket: net.Socket,
  xid: number,
  procedure: number,
  data: Buffer,
  handlers: {
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
  }
): Promise<void> {
  // Get procedure name for better logging
  const procedureName = getProcedureName(procedure);
  // console.log(`Procedure: ${procedureName} (${procedure})`);

  switch (procedure) {
    case 0: // NULL
      const returnBuffer = Buffer.alloc(8).fill(0);
      // // console.log(
      //   "returnBuffer: ",
      //   returnBuffer,
      //   "length: ",
      //   returnBuffer.length,
      // );
      await sendRpcSuccess(socket, xid, returnBuffer);
      break;

    case 1: // GETATTR
      await getAttributes(xid, socket, data, handlers.getAttributes);
      break;

    case 2: // SETATTR
      await setattr(xid, socket, data, handlers.setattr);
      break;

    case 3: // LOOKUP
      await lookup(xid, socket, data, handlers.lookup);
      break;

    case 4: // ACCESS
      await access(xid, socket, data, handlers.access);
      break;

    case 5: // READLINK
      await readlink(xid, socket, data, handlers.readlink);
      break;

    case 6: // READ
      await read(xid, socket, data, handlers.read);
      break;

    case 7: // WRITE
      await write(xid, socket, data, handlers.write);
      break;

    case 8: // CREATE
      await create(xid, socket, data, handlers.create);
      break;

    case 9: // MKDIR
      await mkdir(xid, socket, data, handlers.mkdir);
      break;

    case 10: // SYMLINK
      await symlink(xid, socket, data, handlers.symlink);
      break;

    case 11: // MKNOD
      await mknod(xid, socket, data, handlers.mknod);
      break;

    case 12: // REMOVE
      await remove(xid, socket, data, handlers.remove);
      break;

    case 13: // RMDIR
      await rmdir(xid, socket, data, handlers.rmdir);
      break;

    case 14: // RENAME
      await rename(xid, socket, data, handlers.rename);
      break;

    case 15: // LINK
      await link(xid, socket, data, handlers.link);
      break;

    case 16: // READDIR
      await readdir(xid, socket, data, handlers.readdir);
      break;

    case 17: // READDIRPLUS
      await readdirplus(xid, socket, data, handlers.readdirplus);
      break;

    case 18: // FSSTAT
      await fsstat(xid, socket, data, handlers.fsstat);
      break;

    case 19: // FSINFO
      await fsinfo(xid, socket, data, handlers.fsinfo);
      break;

    case 20: // PATHCONF
      await pathconf(xid, socket, data, handlers.pathconf);
      break;

    case 21: // COMMIT
      await commit(xid, socket, data, handlers.commit);
      break;

    default:
      // console.log(`Unsupported NFS procedure: ${procedure}`);
      sendNfsError(socket, xid, 10004); // NFS3ERR_NOTSUPP
  }

  // console.log(`Procedure: ${procedureName} (${procedure}) - finished`);
}

// Helper function to get readable procedure names
function getProcedureName(procedure: number): string {
  const procedureNames = [
    'NULL',
    'GETATTR',
    'SETATTR',
    'LOOKUP',
    'ACCESS',
    'READLINK',
    'READ',
    'WRITE',
    'CREATE',
    'MKDIR',
    'SYMLINK',
    'MKNOD',
    'REMOVE',
    'RMDIR',
    'RENAME',
    'LINK',
    'READDIR',
    'READDIRPLUS',
    'FSSTAT',
    'FSINFO',
    'PATHCONF',
    'COMMIT',
  ];

  return procedure < procedureNames.length
    ? procedureNames[procedure] || 'UNKNOWN'
    : 'UNKNOWN';
}

// Helper function to extract extra info from NFS data buffers for detailed logging
// This is useful for debugging specific procedures
export function extractNfsDebugInfo(procedure: number, data: Buffer): string {
  try {
    // Default behavior - just return procedure name
    if (!data || data.length < 4) {
      return '';
    }

    // Extract handle length and handle itself
    const handleLength = data.readUInt32BE(0);
    if (handleLength > 64 || data.length < 4 + handleLength) {
      return `Handle length: ${handleLength}`;
    }

    // Get handle as hex
    const handle = data.slice(4, 4 + handleLength);
    const handleHex = handle.toString('hex');

    // Special handling for common procedures
    switch (procedure) {
      case 3: // LOOKUP
        if (data.length >= 4 + handleLength + 4) {
          const nameLength = data.readUInt32BE(4 + handleLength);
          if (data.length >= 4 + handleLength + 4 + nameLength) {
            const name = data.toString(
              'utf8',
              4 + handleLength + 4,
              4 + handleLength + 4 + nameLength
            );
            return `Looking up: ${name}`;
          }
        }
        break;

      case 16: // READDIR
      case 17: // READDIRPLUS
        if (data.length >= 4 + handleLength + 8) {
          const cookie = data.readBigUInt64BE(4 + handleLength);
          return `Handle: ${handleHex.substring(0, 16)}..., Cookie: ${cookie}`;
        }
        break;

      case 6: // READ
        if (data.length >= 4 + handleLength + 16) {
          const offset = data.readBigUInt64BE(4 + handleLength);
          const count = data.readUInt32BE(4 + handleLength + 8);
          return `Offset: ${offset}, Count: ${count}`;
        }
        break;

      case 7: // WRITE
        if (data.length >= 4 + handleLength + 16) {
          const offset = data.readBigUInt64BE(4 + handleLength);
          const count = data.readUInt32BE(4 + handleLength + 8);
          return `Offset: ${offset}, Count: ${count}`;
        }
        break;
    }

    // Default - just return handle info
    return `Handle: ${handleHex.substring(0, 16)}...`;
  } catch (err) {
    return `Error extracting debug info: ${err}`;
  }
}
