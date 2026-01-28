/**
 * Barrel file for NFS procedure implementations
 *
 * Exports all procedure functions and their associated types.
 * This allows for simplified imports like:
 *
 * ```typescript
 * import * as procedures from './rpc/nfs/procedures';
 * // or
 * import { access, read, write, AccessHandler, ReadHandler } from './rpc/nfs/procedures';
 * ```
 */

// Procedure 0: NULL (handled directly in router)

// Procedure 1: GETATTR
export { getAttributes } from './getAttributes.js';
export type { GetAttributesHandler } from './getAttributes.js';

// Procedure 2: SETATTR
export { setattr } from './setattr.js';
export type { SetAttrHandler } from './setattr.js';

// Procedure 3: LOOKUP
export { lookup } from './lookup.js';
export type { LookupHandler } from './lookup.js';

// Procedure 4: ACCESS
export { access } from './access.js';
export type { AccessHandler, AccessResult, AccessMode } from './access.js';

// Procedure 5: READLINK
export { readlink } from './readlink.js';
export type { ReadlinkHandler } from './readlink.js';

// Procedure 6: READ
export { read } from './read.js';
export type { ReadHandler } from './read.js';

// Procedure 7: WRITE
export { write } from './write.js';
export type { WriteHandler } from './write.js';

// Procedure 8: CREATE
export { create } from './create.js';
export type { CreateHandler } from './create.js';

// Procedure 9: MKDIR
export { mkdir } from './mkdir.js';
export type { MkdirHandler } from './mkdir.js';

// Procedure 10: SYMLINK
export { symlink } from './symlink.js';
export type { SymlinkHandler } from './symlink.js';

// Procedure 11: MKNOD
export { mknod } from './mknod.js';
export type { MknodHandler } from './mknod.js';

// Procedure 12: REMOVE
export { remove } from './remove.js';
export type { RemoveHandler } from './remove.js';

// Procedure 13: RMDIR
export { rmdir } from './rmdir.js';
export type { RmdirHandler } from './rmdir.js';

// Procedure 14: RENAME
export { rename } from './rename.js';
export type { RenameHandler } from './rename.js';

// Procedure 15: LINK
export { link, LinkResultErr } from './link.js';
export type { LinkHandler } from './link.js';

// Procedure 16: READDIR
export { readdir } from './readdir.js';
export type { ReaddirHandler, DirEntry } from './readdir.js';

// Procedure 17: READDIRPLUS
export { readdirplus } from './readdirplus.js';
export type { ReaddirplusHandler, DirEntryPlus } from './readdirplus.js';

// Procedure 18: FSSTAT
export { fsstat } from './fsstat.js';
export type { FSStatHandler } from './fsstat.js';

// Procedure 19: FSINFO
export { fsinfo } from './fsinfo.js';
export type { FSInfoHandler } from './fsinfo.js';

// Procedure 20: PATHCONF
export { pathconf } from './pathconf.js';
export type { PathconfHandler } from './pathconf.js';

// Procedure 21: COMMIT
export { commit } from './commit.js';
export type { CommitHandler } from './commit.js';

// Error codes and types
export { nfsstat3 } from './errors.js';

// Utility types
export type { SetAttrParams } from './util/readAttributes.js';
