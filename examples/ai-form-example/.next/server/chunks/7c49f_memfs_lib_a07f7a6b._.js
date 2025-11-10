module.exports = [
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.constants = exports.SEP = void 0;
exports.SEP = '/';
exports.constants = {
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
    S_IFMT: 61440,
    S_IFREG: 32768,
    S_IFDIR: 16384,
    S_IFCHR: 8192,
    S_IFBLK: 24576,
    S_IFIFO: 4096,
    S_IFLNK: 40960,
    S_IFSOCK: 49152,
    O_CREAT: 64,
    O_EXCL: 128,
    O_NOCTTY: 256,
    O_TRUNC: 512,
    O_APPEND: 1024,
    O_DIRECTORY: 65536,
    O_NOATIME: 262144,
    O_NOFOLLOW: 131072,
    O_SYNC: 1052672,
    O_SYMLINK: 2097152,
    O_DIRECT: 16384,
    O_NONBLOCK: 2048,
    S_IRWXU: 448,
    S_IRUSR: 256,
    S_IWUSR: 128,
    S_IXUSR: 64,
    S_IRWXG: 56,
    S_IRGRP: 32,
    S_IWGRP: 16,
    S_IXGRP: 8,
    S_IRWXO: 7,
    S_IROTH: 4,
    S_IWOTH: 2,
    S_IXOTH: 1,
    F_OK: 0,
    R_OK: 4,
    W_OK: 2,
    X_OK: 1,
    UV_FS_SYMLINK_DIR: 1,
    UV_FS_SYMLINK_JUNCTION: 2,
    UV_FS_COPYFILE_EXCL: 1,
    UV_FS_COPYFILE_FICLONE: 2,
    UV_FS_COPYFILE_FICLONE_FORCE: 4,
    COPYFILE_EXCL: 1,
    COPYFILE_FICLONE: 2,
    COPYFILE_FICLONE_FORCE: 4
}; //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/Stats.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Stats = void 0;
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
const { S_IFMT, S_IFDIR, S_IFREG, S_IFBLK, S_IFCHR, S_IFLNK, S_IFIFO, S_IFSOCK } = constants_1.constants;
/**
 * Statistics about a file/directory, like `fs.Stats`.
 */ class Stats {
    static build(node, bigint = false) {
        const stats = new Stats();
        const { uid, gid, atime, mtime, ctime } = node;
        const getStatNumber = !bigint ? (number)=>number : (number)=>BigInt(number);
        // Copy all values on Stats from Node, so that if Node values
        // change, values on Stats would still be the old ones,
        // just like in Node fs.
        stats.uid = getStatNumber(uid);
        stats.gid = getStatNumber(gid);
        stats.rdev = getStatNumber(node.rdev);
        stats.blksize = getStatNumber(4096);
        stats.ino = getStatNumber(node.ino);
        stats.size = getStatNumber(node.getSize());
        stats.blocks = getStatNumber(1);
        stats.atime = atime;
        stats.mtime = mtime;
        stats.ctime = ctime;
        stats.birthtime = ctime;
        stats.atimeMs = getStatNumber(atime.getTime());
        stats.mtimeMs = getStatNumber(mtime.getTime());
        const ctimeMs = getStatNumber(ctime.getTime());
        stats.ctimeMs = ctimeMs;
        stats.birthtimeMs = ctimeMs;
        if (bigint) {
            stats.atimeNs = BigInt(atime.getTime()) * BigInt(1000000);
            stats.mtimeNs = BigInt(mtime.getTime()) * BigInt(1000000);
            const ctimeNs = BigInt(ctime.getTime()) * BigInt(1000000);
            stats.ctimeNs = ctimeNs;
            stats.birthtimeNs = ctimeNs;
        }
        stats.dev = getStatNumber(0);
        stats.mode = getStatNumber(node.mode);
        stats.nlink = getStatNumber(node.nlink);
        return stats;
    }
    _checkModeProperty(property) {
        return (Number(this.mode) & S_IFMT) === property;
    }
    isDirectory() {
        return this._checkModeProperty(S_IFDIR);
    }
    isFile() {
        return this._checkModeProperty(S_IFREG);
    }
    isBlockDevice() {
        return this._checkModeProperty(S_IFBLK);
    }
    isCharacterDevice() {
        return this._checkModeProperty(S_IFCHR);
    }
    isSymbolicLink() {
        return this._checkModeProperty(S_IFLNK);
    }
    isFIFO() {
        return this._checkModeProperty(S_IFIFO);
    }
    isSocket() {
        return this._checkModeProperty(S_IFSOCK);
    }
}
exports.Stats = Stats;
exports.default = Stats; //# sourceMappingURL=Stats.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/buffer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Buffer = void 0;
var node_buffer_1 = __turbopack_context__.r("[externals]/node:buffer [external] (node:buffer, cjs)");
Object.defineProperty(exports, "Buffer", {
    enumerable: true,
    get: function() {
        return node_buffer_1.Buffer;
    }
}); //# sourceMappingURL=buffer.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/buffer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bufferFrom = exports.bufferAllocUnsafe = exports.Buffer = void 0;
const buffer_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/buffer.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Buffer", {
    enumerable: true,
    get: function() {
        return buffer_1.Buffer;
    }
});
function bufferV0P12Ponyfill(arg0, ...args) {
    return new buffer_1.Buffer(arg0, ...args);
}
const bufferAllocUnsafe = buffer_1.Buffer.allocUnsafe || bufferV0P12Ponyfill;
exports.bufferAllocUnsafe = bufferAllocUnsafe;
const bufferFrom = buffer_1.Buffer.from || bufferV0P12Ponyfill;
exports.bufferFrom = bufferFrom; //# sourceMappingURL=buffer.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inherits = inherits;
exports.promisify = promisify;
exports.inspect = inspect;
exports.format = format;
/**
 * Minimal implementation of Node.js util.inherits function.
 * Sets up prototype inheritance between constructor functions.
 */ function inherits(ctor, superCtor) {
    if (ctor === undefined || ctor === null) {
        throw new TypeError('The constructor to inherit from is not defined');
    }
    if (superCtor === undefined || superCtor === null) {
        throw new TypeError('The super constructor to inherit from is not defined');
    }
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}
/**
 * Minimal implementation of Node.js util.promisify function.
 * Converts callback-based functions to Promise-based functions.
 */ function promisify(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('The "original" argument must be of type function');
    }
    return function(...args) {
        return new Promise((resolve, reject)=>{
            fn.call(this, ...args, (err, result)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };
}
/**
 * Minimal implementation of Node.js util.inspect function.
 * Converts a value to a string representation for debugging.
 */ function inspect(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `'${value}'`;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) {
        const items = value.map((item)=>inspect(item)).join(', ');
        return `[ ${items} ]`;
    }
    if (typeof value === 'object') {
        const entries = Object.entries(value).map(([key, val])=>`${key}: ${inspect(val)}`).join(', ');
        return `{ ${entries} }`;
    }
    return String(value);
}
/**
 * Minimal implementation of Node.js util.format function.
 * Provides printf-style string formatting with basic placeholder support.
 */ function format(template, ...args) {
    if (args.length === 0) return template;
    let result = template;
    let argIndex = 0;
    // Replace %s (string), %d (number), %j (JSON) placeholders
    result = result.replace(/%[sdj%]/g, (match)=>{
        if (argIndex >= args.length) return match;
        const arg = args[argIndex++];
        switch(match){
            case '%s':
                return String(arg);
            case '%d':
                return Number(arg).toString();
            case '%j':
                try {
                    return JSON.stringify(arg);
                } catch  {
                    return '[Circular]';
                }
            case '%%':
                return '%';
            default:
                return match;
        }
    });
    // Append remaining arguments
    while(argIndex < args.length){
        result += ' ' + String(args[argIndex++]);
    }
    return result;
} //# sourceMappingURL=util.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/errors.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Adapted from Node.js ../internal/errors.js, used for throwing similar errors to Node.js.
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AssertionError = exports.RangeError = exports.TypeError = exports.Error = void 0;
exports.message = message;
exports.E = E;
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/util.js [app-route] (ecmascript)");
const kCode = typeof Symbol === 'undefined' ? '_kCode' : Symbol('code');
const messages = {};
function makeNodeError(Base) {
    return class NodeError extends Base {
        constructor(key, ...args){
            super(message(key, args));
            this.code = key;
            this[kCode] = key;
            this.name = `${super.name} [${this[kCode]}]`;
        }
    };
}
const g = typeof globalThis !== 'undefined' ? globalThis : /*TURBOPACK member replacement*/ __turbopack_context__.g;
class AssertionError extends g.Error {
    constructor(options){
        if (typeof options !== 'object' || options === null) {
            throw new exports.TypeError('ERR_INVALID_ARG_TYPE', 'options', 'object');
        }
        if (options.message) {
            super(options.message);
        } else {
            super(`${(0, util_1.inspect)(options.actual).slice(0, 128)} ` + `${options.operator} ${(0, util_1.inspect)(options.expected).slice(0, 128)}`);
        }
        this.generatedMessage = !options.message;
        this.name = 'AssertionError [ERR_ASSERTION]';
        this.code = 'ERR_ASSERTION';
        this.actual = options.actual;
        this.expected = options.expected;
        this.operator = options.operator;
        exports.Error.captureStackTrace(this, options.stackStartFunction);
    }
}
exports.AssertionError = AssertionError;
function message(key, args) {
    if (typeof key !== 'string') throw new exports.Error('Error message key must be a string');
    const msg = messages[key];
    if (!msg) throw new exports.Error(`An invalid error message key was used: ${key}.`);
    let fmt;
    if (typeof msg === 'function') {
        fmt = msg;
    } else {
        fmt = util_1.format;
        if (args === undefined || args.length === 0) return msg;
        args.unshift(msg);
    }
    return String(fmt.apply(null, args));
}
// Utility function for registering the error codes. Only used here. Exported
// *only* to allow for testing.
function E(sym, val) {
    messages[sym] = typeof val === 'function' ? val : String(val);
}
exports.Error = makeNodeError(g.Error);
exports.TypeError = makeNodeError(g.TypeError);
exports.RangeError = makeNodeError(g.RangeError);
E('ERR_DIR_CLOSED', 'Directory handle was closed');
E('ERR_DIR_CONCURRENT_OPERATION', 'Cannot do synchronous work on directory handle with concurrent asynchronous operations');
E('ERR_INVALID_FILE_URL_HOST', 'File URL host must be "localhost" or empty on %s');
E('ERR_INVALID_FILE_URL_PATH', 'File URL path %s');
E('ERR_INVALID_OPT_VALUE', (name, value)=>{
    return `The value "${String(value)}" is invalid for option "${name}"`;
});
E('ERR_INVALID_OPT_VALUE_ENCODING', (value)=>`The value "${String(value)}" is invalid for option "encoding"`);
E('ERR_INVALID_ARG_VALUE', 'Unable to open file as blob'); //# sourceMappingURL=errors.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/encoding.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ENCODING_UTF8 = void 0;
exports.assertEncoding = assertEncoding;
exports.strToEncoding = strToEncoding;
const buffer_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/buffer.js [app-route] (ecmascript)");
const errors = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/errors.js [app-route] (ecmascript)");
exports.ENCODING_UTF8 = 'utf8';
function assertEncoding(encoding) {
    if (encoding && !buffer_1.Buffer.isEncoding(encoding)) throw new errors.TypeError('ERR_INVALID_OPT_VALUE_ENCODING', encoding);
}
function strToEncoding(str, encoding) {
    if (!encoding || encoding === exports.ENCODING_UTF8) return str; // UTF-8
    if (encoding === 'buffer') return new buffer_1.Buffer(str); // `buffer` encoding
    return new buffer_1.Buffer(str).toString(encoding); // Custom encoding
} //# sourceMappingURL=encoding.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/Dirent.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dirent = void 0;
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
const encoding_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/encoding.js [app-route] (ecmascript)");
const { S_IFMT, S_IFDIR, S_IFREG, S_IFBLK, S_IFCHR, S_IFLNK, S_IFIFO, S_IFSOCK } = constants_1.constants;
/**
 * A directory entry, like `fs.Dirent`.
 */ class Dirent {
    constructor(){
        this.name = '';
        this.path = '';
        this.parentPath = '';
        this.mode = 0;
    }
    static build(link, encoding) {
        const dirent = new Dirent();
        const { mode } = link.getNode();
        dirent.name = (0, encoding_1.strToEncoding)(link.getName(), encoding);
        dirent.mode = mode;
        dirent.path = link.getParentPath();
        dirent.parentPath = dirent.path;
        return dirent;
    }
    _checkModeProperty(property) {
        return (this.mode & S_IFMT) === property;
    }
    isDirectory() {
        return this._checkModeProperty(S_IFDIR);
    }
    isFile() {
        return this._checkModeProperty(S_IFREG);
    }
    isBlockDevice() {
        return this._checkModeProperty(S_IFBLK);
    }
    isCharacterDevice() {
        return this._checkModeProperty(S_IFCHR);
    }
    isSymbolicLink() {
        return this._checkModeProperty(S_IFLNK);
    }
    isFIFO() {
        return this._checkModeProperty(S_IFIFO);
    }
    isSocket() {
        return this._checkModeProperty(S_IFSOCK);
    }
}
exports.Dirent = Dirent;
exports.default = Dirent; //# sourceMappingURL=Dirent.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/path.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.basename = exports.isAbsolute = exports.normalize = exports.dirname = exports.relative = exports.join = exports.posix = exports.sep = exports.resolve = void 0;
var node_path_1 = __turbopack_context__.r("[externals]/node:path [external] (node:path, cjs)");
Object.defineProperty(exports, "resolve", {
    enumerable: true,
    get: function() {
        return node_path_1.resolve;
    }
});
Object.defineProperty(exports, "sep", {
    enumerable: true,
    get: function() {
        return node_path_1.sep;
    }
});
Object.defineProperty(exports, "posix", {
    enumerable: true,
    get: function() {
        return node_path_1.posix;
    }
});
Object.defineProperty(exports, "join", {
    enumerable: true,
    get: function() {
        return node_path_1.join;
    }
});
Object.defineProperty(exports, "relative", {
    enumerable: true,
    get: function() {
        return node_path_1.relative;
    }
});
Object.defineProperty(exports, "dirname", {
    enumerable: true,
    get: function() {
        return node_path_1.dirname;
    }
});
Object.defineProperty(exports, "normalize", {
    enumerable: true,
    get: function() {
        return node_path_1.normalize;
    }
});
Object.defineProperty(exports, "isAbsolute", {
    enumerable: true,
    get: function() {
        return node_path_1.isAbsolute;
    }
});
Object.defineProperty(exports, "basename", {
    enumerable: true,
    get: function() {
        return node_path_1.basename;
    }
}); //# sourceMappingURL=path.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/types.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
}); //# sourceMappingURL=types.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/json.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.flattenJSON = void 0;
const buffer_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/buffer.js [app-route] (ecmascript)");
const path_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/path.js [app-route] (ecmascript)");
const pathJoin = path_1.posix ? path_1.posix.join : path_1.join;
const flattenJSON = (nestedJSON)=>{
    const flatJSON = {};
    function flatten(pathPrefix, node) {
        for(const path in node){
            const contentOrNode = node[path];
            // TODO: Can we avoid using `join` here? Just concatenate?
            const joinedPath = pathJoin(pathPrefix, path);
            if (typeof contentOrNode === 'string' || contentOrNode instanceof buffer_1.Buffer) {
                flatJSON[joinedPath] = contentOrNode;
            } else if (typeof contentOrNode === 'object' && contentOrNode !== null && !(contentOrNode instanceof buffer_1.Buffer) && Object.keys(contentOrNode).length > 0) {
                // empty directories need an explicit entry and therefore get handled in `else`, non-empty ones are implicitly considered
                flatten(joinedPath, contentOrNode);
            } else {
                // without this branch null, empty-object or non-object entries would not be handled in the same way
                // by both fromJSON() and fromNestedJSON()
                flatJSON[joinedPath] = null;
            }
        }
    }
    flatten('', nestedJSON);
    return flatJSON;
};
exports.flattenJSON = flattenJSON; //# sourceMappingURL=json.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/process.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Here we mock the global `process` variable in case we are not in Node's environment.
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createProcess = createProcess;
/**
 * Looks to return a `process` object, if one is available.
 *
 * The global `process` is returned if defined;
 * otherwise `require('process')` is attempted.
 *
 * If that fails, `undefined` is returned.
 *
 * @return {IProcess | undefined}
 */ const maybeReturnProcess = ()=>{
    if (typeof process !== 'undefined') {
        return process;
    }
    try {
        return __turbopack_context__.r("[externals]/process [external] (process, cjs)");
    } catch  {
        return undefined;
    }
};
function createProcess() {
    const p = maybeReturnProcess() || {};
    if (!p.cwd) p.cwd = ()=>'/';
    if (!p.emitWarning) p.emitWarning = (message, type)=>{
        // tslint:disable-next-line:no-console
        console.warn(`${type}${type ? ': ' : ''}${message}`);
    };
    if (!p.env) p.env = {};
    return p;
}
exports.default = createProcess(); //# sourceMappingURL=process.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/Node.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Node = void 0;
const fanout_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/thingies@2.5.0_tslib@2.8.1/node_modules/thingies/lib/fanout.js [app-route] (ecmascript)");
const process_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/process.js [app-route] (ecmascript)");
const buffer_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/buffer.js [app-route] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
const { S_IFMT, S_IFDIR, S_IFREG, S_IFLNK, S_IFCHR } = constants_1.constants;
const getuid = ()=>process_1.default.getuid?.() ?? 0;
const getgid = ()=>process_1.default.getgid?.() ?? 0;
/**
 * Node in a file system (like i-node, v-node).
 */ class Node {
    constructor(ino, mode = 0o666){
        this.changes = new fanout_1.FanOut();
        // User ID and group ID.
        this._uid = getuid();
        this._gid = getgid();
        this._atime = new Date();
        this._mtime = new Date();
        this._ctime = new Date();
        this.rdev = 0;
        // Number of hard links pointing at this Node.
        this._nlink = 1;
        this.mode = mode;
        this.ino = ino;
    }
    set ctime(ctime) {
        this._ctime = ctime;
    }
    get ctime() {
        return this._ctime;
    }
    set uid(uid) {
        this._uid = uid;
        this.ctime = new Date();
    }
    get uid() {
        return this._uid;
    }
    set gid(gid) {
        this._gid = gid;
        this.ctime = new Date();
    }
    get gid() {
        return this._gid;
    }
    set atime(atime) {
        this._atime = atime;
    }
    get atime() {
        return this._atime;
    }
    set mtime(mtime) {
        this._mtime = mtime;
        this.ctime = new Date();
    }
    get mtime() {
        return this._mtime;
    }
    get perm() {
        return this.mode & ~S_IFMT;
    }
    set perm(perm) {
        this.mode = this.mode & S_IFMT | perm & ~S_IFMT;
        this.ctime = new Date();
    }
    set nlink(nlink) {
        this._nlink = nlink;
        this.ctime = new Date();
    }
    get nlink() {
        return this._nlink;
    }
    getString(encoding = 'utf8') {
        this.atime = new Date();
        return this.getBuffer().toString(encoding);
    }
    setString(str) {
        // this.setBuffer(bufferFrom(str, 'utf8'));
        this.buf = (0, buffer_1.bufferFrom)(str, 'utf8');
        this.touch();
    }
    getBuffer() {
        this.atime = new Date();
        if (!this.buf) this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
        return (0, buffer_1.bufferFrom)(this.buf); // Return a copy.
    }
    setBuffer(buf) {
        this.buf = (0, buffer_1.bufferFrom)(buf); // Creates a copy of data.
        this.touch();
    }
    getSize() {
        return this.buf ? this.buf.length : 0;
    }
    setModeProperty(property) {
        this.mode = property;
    }
    isFile() {
        return (this.mode & S_IFMT) === S_IFREG;
    }
    isDirectory() {
        return (this.mode & S_IFMT) === S_IFDIR;
    }
    isSymlink() {
        // return !!this.symlink;
        return (this.mode & S_IFMT) === S_IFLNK;
    }
    isCharacterDevice() {
        return (this.mode & S_IFMT) === S_IFCHR;
    }
    makeSymlink(symlink) {
        this.mode = S_IFLNK | 0o666;
        this.symlink = symlink;
    }
    write(buf, off = 0, len = buf.length, pos = 0) {
        if (!this.buf) this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
        if (pos + len > this.buf.length) {
            const newBuf = (0, buffer_1.bufferAllocUnsafe)(pos + len);
            this.buf.copy(newBuf, 0, 0, this.buf.length);
            this.buf = newBuf;
        }
        buf.copy(this.buf, pos, off, off + len);
        this.touch();
        return len;
    }
    // Returns the number of bytes read.
    read(buf, off = 0, len = buf.byteLength, pos = 0) {
        this.atime = new Date();
        if (!this.buf) this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
        if (pos >= this.buf.length) return 0;
        let actualLen = len;
        if (actualLen > buf.byteLength) {
            actualLen = buf.byteLength;
        }
        if (actualLen + pos > this.buf.length) {
            actualLen = this.buf.length - pos;
        }
        const buf2 = buf instanceof buffer_1.Buffer ? buf : buffer_1.Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
        this.buf.copy(buf2, off, pos, pos + actualLen);
        return actualLen;
    }
    truncate(len = 0) {
        if (!len) this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
        else {
            if (!this.buf) this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
            if (len <= this.buf.length) {
                this.buf = this.buf.slice(0, len);
            } else {
                const buf = (0, buffer_1.bufferAllocUnsafe)(len);
                this.buf.copy(buf);
                buf.fill(0, this.buf.length);
                this.buf = buf;
            }
        }
        this.touch();
    }
    chmod(perm) {
        this.mode = this.mode & S_IFMT | perm & ~S_IFMT;
        this.touch();
    }
    chown(uid, gid) {
        this.uid = uid;
        this.gid = gid;
        this.touch();
    }
    touch() {
        this.mtime = new Date();
        this.changes.emit([
            'modify'
        ]);
    }
    canRead(uid = getuid(), gid = getgid()) {
        if (this.perm & 4 /* S.IROTH */ ) {
            return true;
        }
        if (gid === this.gid) {
            if (this.perm & 32 /* S.IRGRP */ ) {
                return true;
            }
        }
        if (uid === this.uid) {
            if (this.perm & 256 /* S.IRUSR */ ) {
                return true;
            }
        }
        return false;
    }
    canWrite(uid = getuid(), gid = getgid()) {
        if (this.perm & 2 /* S.IWOTH */ ) {
            return true;
        }
        if (gid === this.gid) {
            if (this.perm & 16 /* S.IWGRP */ ) {
                return true;
            }
        }
        if (uid === this.uid) {
            if (this.perm & 128 /* S.IWUSR */ ) {
                return true;
            }
        }
        return false;
    }
    canExecute(uid = getuid(), gid = getgid()) {
        if (this.perm & 1 /* S.IXOTH */ ) {
            return true;
        }
        if (gid === this.gid) {
            if (this.perm & 8 /* S.IXGRP */ ) {
                return true;
            }
        }
        if (uid === this.uid) {
            if (this.perm & 64 /* S.IXUSR */ ) {
                return true;
            }
        }
        return false;
    }
    del() {
        this.changes.emit([
            'delete'
        ]);
    }
    toJSON() {
        return {
            ino: this.ino,
            uid: this.uid,
            gid: this.gid,
            atime: this.atime.getTime(),
            mtime: this.mtime.getTime(),
            ctime: this.ctime.getTime(),
            perm: this.perm,
            mode: this.mode,
            nlink: this.nlink,
            symlink: this.symlink,
            data: this.getString()
        };
    }
}
exports.Node = Node; //# sourceMappingURL=Node.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/Link.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Link = void 0;
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
const fanout_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/thingies@2.5.0_tslib@2.8.1/node_modules/thingies/lib/fanout.js [app-route] (ecmascript)");
const { S_IFREG } = constants_1.constants;
/**
 * Represents a hard link that points to an i-node `node`.
 */ class Link {
    get steps() {
        return this._steps;
    }
    // Recursively sync children steps, e.g. in case of dir rename
    set steps(val) {
        this._steps = val;
        for (const [child, link] of this.children.entries()){
            if (child === '.' || child === '..') {
                continue;
            }
            link?.syncSteps();
        }
    }
    constructor(vol, parent, name){
        this.changes = new fanout_1.FanOut();
        this.children = new Map();
        // Path to this node as Array: ['usr', 'bin', 'node'].
        this._steps = [];
        // "i-node" number of the node.
        this.ino = 0;
        // Number of children.
        this.length = 0;
        this.vol = vol;
        this.parent = parent;
        this.name = name;
        this.syncSteps();
    }
    setNode(node) {
        this.node = node;
        this.ino = node.ino;
    }
    getNode() {
        return this.node;
    }
    createChild(name, node = this.vol.createNode(S_IFREG | 0o666)) {
        const link = new Link(this.vol, this, name);
        link.setNode(node);
        if (node.isDirectory()) {
            link.children.set('.', link);
            link.getNode().nlink++;
        }
        this.setChild(name, link);
        return link;
    }
    setChild(name, link = new Link(this.vol, this, name)) {
        this.children.set(name, link);
        link.parent = this;
        this.length++;
        const node = link.getNode();
        if (node.isDirectory()) {
            link.children.set('..', this);
            this.getNode().nlink++;
        }
        this.getNode().mtime = new Date();
        this.changes.emit([
            'child:add',
            link,
            this
        ]);
        return link;
    }
    deleteChild(link) {
        const node = link.getNode();
        if (node.isDirectory()) {
            link.children.delete('..');
            this.getNode().nlink--;
        }
        this.children.delete(link.getName());
        this.length--;
        this.getNode().mtime = new Date();
        this.changes.emit([
            'child:del',
            link,
            this
        ]);
    }
    getChild(name) {
        this.getNode().atime = new Date();
        return this.children.get(name);
    }
    getPath() {
        return this.steps.join("/" /* PATH.SEP */ );
    }
    getParentPath() {
        return this.steps.slice(0, -1).join("/" /* PATH.SEP */ );
    }
    getName() {
        return this.steps[this.steps.length - 1];
    }
    toJSON() {
        return {
            steps: this.steps,
            ino: this.ino,
            children: Array.from(this.children.keys())
        };
    }
    syncSteps() {
        this.steps = this.parent ? this.parent.steps.concat([
            this.name
        ]) : [
            this.name
        ];
    }
}
exports.Link = Link; //# sourceMappingURL=Link.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/File.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.File = void 0;
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
const { O_APPEND } = constants_1.constants;
/**
 * Represents an open file (file descriptor) that points to a `Link` (Hard-link) and a `Node`.
 *
 * @todo Rename to `OpenFile`.
 */ class File {
    /**
     * Open a Link-Node pair. `node` is provided separately as that might be a different node
     * rather the one `link` points to, because it might be a symlink.
     * @param link
     * @param node
     * @param flags
     * @param fd
     */ constructor(link, node, flags, fd){
        this.link = link;
        this.node = node;
        this.flags = flags;
        this.fd = fd;
        this.position = 0;
        if (this.flags & O_APPEND) this.position = this.getSize();
    }
    getString(encoding = 'utf8') {
        return this.node.getString();
    }
    setString(str) {
        this.node.setString(str);
    }
    getBuffer() {
        return this.node.getBuffer();
    }
    setBuffer(buf) {
        this.node.setBuffer(buf);
    }
    getSize() {
        return this.node.getSize();
    }
    truncate(len) {
        this.node.truncate(len);
    }
    seekTo(position) {
        this.position = position;
    }
    write(buf, offset = 0, length = buf.length, position) {
        if (typeof position !== 'number') position = this.position;
        const bytes = this.node.write(buf, offset, length, position);
        this.position = position + bytes;
        return bytes;
    }
    read(buf, offset = 0, length = buf.byteLength, position) {
        if (typeof position !== 'number') position = this.position;
        const bytes = this.node.read(buf, offset, length, position);
        this.position = position + bytes;
        return bytes;
    }
    chmod(perm) {
        this.node.chmod(perm);
    }
    chown(uid, gid) {
        this.node.chown(uid, gid);
    }
}
exports.File = File; //# sourceMappingURL=File.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FLAGS = exports.ERRSTR = void 0;
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
exports.ERRSTR = {
    PATH_STR: 'path must be a string, Buffer, or Uint8Array',
    // FD:             'file descriptor must be a unsigned 32-bit integer',
    FD: 'fd must be a file descriptor',
    MODE_INT: 'mode must be an int',
    CB: 'callback must be a function',
    UID: 'uid must be an unsigned int',
    GID: 'gid must be an unsigned int',
    LEN: 'len must be an integer',
    ATIME: 'atime must be an integer',
    MTIME: 'mtime must be an integer',
    PREFIX: 'filename prefix is required',
    BUFFER: 'buffer must be an instance of Buffer or StaticBuffer',
    OFFSET: 'offset must be an integer',
    LENGTH: 'length must be an integer',
    POSITION: 'position must be an integer'
};
const { O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_EXCL, O_TRUNC, O_APPEND, O_SYNC } = constants_1.constants;
// List of file `flags` as defined by Node.
var FLAGS;
(function(FLAGS) {
    // Open file for reading. An exception occurs if the file does not exist.
    FLAGS[FLAGS["r"] = O_RDONLY] = "r";
    // Open file for reading and writing. An exception occurs if the file does not exist.
    FLAGS[FLAGS["r+"] = O_RDWR] = "r+";
    // Open file for reading in synchronous mode. Instructs the operating system to bypass the local file system cache.
    FLAGS[FLAGS["rs"] = O_RDONLY | O_SYNC] = "rs";
    FLAGS[FLAGS["sr"] = FLAGS.rs] = "sr";
    // Open file for reading and writing, telling the OS to open it synchronously. See notes for 'rs' about using this with caution.
    FLAGS[FLAGS["rs+"] = O_RDWR | O_SYNC] = "rs+";
    FLAGS[FLAGS["sr+"] = FLAGS['rs+']] = "sr+";
    // Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
    FLAGS[FLAGS["w"] = O_WRONLY | O_CREAT | O_TRUNC] = "w";
    // Like 'w' but fails if path exists.
    FLAGS[FLAGS["wx"] = O_WRONLY | O_CREAT | O_TRUNC | O_EXCL] = "wx";
    FLAGS[FLAGS["xw"] = FLAGS.wx] = "xw";
    // Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
    FLAGS[FLAGS["w+"] = O_RDWR | O_CREAT | O_TRUNC] = "w+";
    // Like 'w+' but fails if path exists.
    FLAGS[FLAGS["wx+"] = O_RDWR | O_CREAT | O_TRUNC | O_EXCL] = "wx+";
    FLAGS[FLAGS["xw+"] = FLAGS['wx+']] = "xw+";
    // Open file for appending. The file is created if it does not exist.
    FLAGS[FLAGS["a"] = O_WRONLY | O_APPEND | O_CREAT] = "a";
    // Like 'a' but fails if path exists.
    FLAGS[FLAGS["ax"] = O_WRONLY | O_APPEND | O_CREAT | O_EXCL] = "ax";
    FLAGS[FLAGS["xa"] = FLAGS.ax] = "xa";
    // Open file for reading and appending. The file is created if it does not exist.
    FLAGS[FLAGS["a+"] = O_RDWR | O_APPEND | O_CREAT] = "a+";
    // Like 'a+' but fails if path exists.
    FLAGS[FLAGS["ax+"] = O_RDWR | O_APPEND | O_CREAT | O_EXCL] = "ax+";
    FLAGS[FLAGS["xa+"] = FLAGS['ax+']] = "xa+";
})(FLAGS || (exports.FLAGS = FLAGS = {})); //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/queueMicrotask.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = typeof queueMicrotask === 'function' ? queueMicrotask : (cb)=>Promise.resolve().then(()=>cb()).catch(()=>{}); //# sourceMappingURL=queueMicrotask.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filenameToSteps = exports.resolve = exports.unixify = exports.isWin = void 0;
exports.isFd = isFd;
exports.validateFd = validateFd;
exports.dataToBuffer = dataToBuffer;
const path_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/path.js [app-route] (ecmascript)");
const buffer_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/buffer.js [app-route] (ecmascript)");
const process_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/process.js [app-route] (ecmascript)");
const encoding_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/encoding.js [app-route] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/constants.js [app-route] (ecmascript)");
exports.isWin = process_1.default.platform === 'win32';
const resolveCrossPlatform = path_1.resolve;
const pathSep = path_1.posix ? path_1.posix.sep : path_1.sep;
const isSeparator = (str, i)=>{
    let char = str[i];
    return i > 0 && (char === '/' || exports.isWin && char === '\\');
};
const removeTrailingSeparator = (str)=>{
    let i = str.length - 1;
    if (i < 2) return str;
    while(isSeparator(str, i))i--;
    return str.substr(0, i + 1);
};
const normalizePath = (str, stripTrailing)=>{
    if (typeof str !== 'string') throw new TypeError('expected a string');
    str = str.replace(/[\\\/]+/g, '/');
    if (stripTrailing !== false) str = removeTrailingSeparator(str);
    return str;
};
const unixify = (filepath, stripTrailing = true)=>{
    if (exports.isWin) {
        filepath = normalizePath(filepath, stripTrailing);
        return filepath.replace(/^([a-zA-Z]+:|\.\/)/, '');
    }
    return filepath;
};
exports.unixify = unixify;
let resolve = (filename, base = process_1.default.cwd())=>resolveCrossPlatform(base, filename);
exports.resolve = resolve;
if (exports.isWin) {
    const _resolve = resolve;
    exports.resolve = resolve = (filename, base)=>(0, exports.unixify)(_resolve(filename, base));
}
const filenameToSteps = (filename, base)=>{
    const fullPath = resolve(filename, base);
    const fullPathSansSlash = fullPath.substring(1);
    if (!fullPathSansSlash) return [];
    return fullPathSansSlash.split(pathSep);
};
exports.filenameToSteps = filenameToSteps;
function isFd(path) {
    return path >>> 0 === path;
}
function validateFd(fd) {
    if (!isFd(fd)) throw TypeError(constants_1.ERRSTR.FD);
}
function dataToBuffer(data, encoding = encoding_1.ENCODING_UTF8) {
    if (buffer_1.Buffer.isBuffer(data)) return data;
    else if (data instanceof Uint8Array) return (0, buffer_1.bufferFrom)(data);
    else if (encoding === 'buffer') return (0, buffer_1.bufferFrom)(String(data), 'utf8');
    else return (0, buffer_1.bufferFrom)(String(data), encoding);
} //# sourceMappingURL=util.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getWriteSyncArgs = exports.getWriteArgs = exports.bufToUint8 = void 0;
exports.promisify = promisify;
exports.validateCallback = validateCallback;
exports.modeToNumber = modeToNumber;
exports.nullCheck = nullCheck;
exports.pathToFilename = pathToFilename;
exports.createError = createError;
exports.genRndStr6 = genRndStr6;
exports.flagsToNumber = flagsToNumber;
exports.streamToBuffer = streamToBuffer;
exports.bufferToEncoding = bufferToEncoding;
exports.isReadableStream = isReadableStream;
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/constants.js [app-route] (ecmascript)");
const errors = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/errors.js [app-route] (ecmascript)");
const buffer_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/buffer.js [app-route] (ecmascript)");
const queueMicrotask_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/queueMicrotask.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/util.js [app-route] (ecmascript)");
function promisify(fs, fn, getResult = (input)=>input) {
    return (...args)=>new Promise((resolve, reject)=>{
            fs[fn].bind(fs)(...args, (error, result)=>{
                if (error) return reject(error);
                return resolve(getResult(result));
            });
        });
}
function validateCallback(callback) {
    if (typeof callback !== 'function') throw TypeError(constants_1.ERRSTR.CB);
    return callback;
}
function _modeToNumber(mode, def) {
    if (typeof mode === 'number') return mode;
    if (typeof mode === 'string') return parseInt(mode, 8);
    if (def) return modeToNumber(def);
    return undefined;
}
function modeToNumber(mode, def) {
    const result = _modeToNumber(mode, def);
    if (typeof result !== 'number' || isNaN(result)) throw new TypeError(constants_1.ERRSTR.MODE_INT);
    return result;
}
function nullCheck(path, callback) {
    if (('' + path).indexOf('\u0000') !== -1) {
        const er = new Error('Path must be a string without null bytes');
        er.code = 'ENOENT';
        if (typeof callback !== 'function') throw er;
        (0, queueMicrotask_1.default)(()=>{
            callback(er);
        });
        return false;
    }
    return true;
}
function getPathFromURLPosix(url) {
    if (url.hostname !== '') {
        throw new errors.TypeError('ERR_INVALID_FILE_URL_HOST', process.platform);
    }
    const pathname = url.pathname;
    for(let n = 0; n < pathname.length; n++){
        if (pathname[n] === '%') {
            const third = pathname.codePointAt(n + 2) | 0x20;
            if (pathname[n + 1] === '2' && third === 102) {
                throw new errors.TypeError('ERR_INVALID_FILE_URL_PATH', 'must not include encoded / characters');
            }
        }
    }
    return decodeURIComponent(pathname);
}
function pathToFilename(path) {
    if (path instanceof Uint8Array) {
        path = (0, buffer_1.bufferFrom)(path);
    }
    if (typeof path !== 'string' && !buffer_1.Buffer.isBuffer(path)) {
        try {
            if (!(path instanceof __turbopack_context__.r("[externals]/url [external] (url, cjs)").URL)) throw new TypeError(constants_1.ERRSTR.PATH_STR);
        } catch (err) {
            throw new TypeError(constants_1.ERRSTR.PATH_STR);
        }
        path = getPathFromURLPosix(path);
    }
    const pathString = String(path);
    nullCheck(pathString);
    // return slash(pathString);
    return pathString;
}
const ENOENT = 'ENOENT';
const EBADF = 'EBADF';
const EINVAL = 'EINVAL';
const EPERM = 'EPERM';
const EPROTO = 'EPROTO';
const EEXIST = 'EEXIST';
const ENOTDIR = 'ENOTDIR';
const EMFILE = 'EMFILE';
const EACCES = 'EACCES';
const EISDIR = 'EISDIR';
const ENOTEMPTY = 'ENOTEMPTY';
const ENOSYS = 'ENOSYS';
const ERR_FS_EISDIR = 'ERR_FS_EISDIR';
const ERR_OUT_OF_RANGE = 'ERR_OUT_OF_RANGE';
function formatError(errorCode, func = '', path = '', path2 = '') {
    let pathFormatted = '';
    if (path) pathFormatted = ` '${path}'`;
    if (path2) pathFormatted += ` -> '${path2}'`;
    switch(errorCode){
        case ENOENT:
            return `ENOENT: no such file or directory, ${func}${pathFormatted}`;
        case EBADF:
            return `EBADF: bad file descriptor, ${func}${pathFormatted}`;
        case EINVAL:
            return `EINVAL: invalid argument, ${func}${pathFormatted}`;
        case EPERM:
            return `EPERM: operation not permitted, ${func}${pathFormatted}`;
        case EPROTO:
            return `EPROTO: protocol error, ${func}${pathFormatted}`;
        case EEXIST:
            return `EEXIST: file already exists, ${func}${pathFormatted}`;
        case ENOTDIR:
            return `ENOTDIR: not a directory, ${func}${pathFormatted}`;
        case EISDIR:
            return `EISDIR: illegal operation on a directory, ${func}${pathFormatted}`;
        case EACCES:
            return `EACCES: permission denied, ${func}${pathFormatted}`;
        case ENOTEMPTY:
            return `ENOTEMPTY: directory not empty, ${func}${pathFormatted}`;
        case EMFILE:
            return `EMFILE: too many open files, ${func}${pathFormatted}`;
        case ENOSYS:
            return `ENOSYS: function not implemented, ${func}${pathFormatted}`;
        case ERR_FS_EISDIR:
            return `[ERR_FS_EISDIR]: Path is a directory: ${func} returned EISDIR (is a directory) ${path}`;
        case ERR_OUT_OF_RANGE:
            return `[ERR_OUT_OF_RANGE]: value out of range, ${func}${pathFormatted}`;
        default:
            return `${errorCode}: error occurred, ${func}${pathFormatted}`;
    }
}
function createError(errorCode, func = '', path = '', path2 = '', Constructor = Error) {
    const error = new Constructor(formatError(errorCode, func, path, path2));
    error.code = errorCode;
    if (path) {
        error.path = path;
    }
    return error;
}
function genRndStr6() {
    return Math.random().toString(36).slice(2, 8).padEnd(6, '0');
}
function flagsToNumber(flags) {
    if (typeof flags === 'number') return flags;
    if (typeof flags === 'string') {
        const flagsNum = constants_1.FLAGS[flags];
        if (typeof flagsNum !== 'undefined') return flagsNum;
    }
    // throw new TypeError(formatError(ERRSTR_FLAG(flags)));
    throw new errors.TypeError('ERR_INVALID_OPT_VALUE', 'flags', flags);
}
function streamToBuffer(stream) {
    const chunks = [];
    return new Promise((resolve, reject)=>{
        stream.on('data', (chunk)=>chunks.push(chunk));
        stream.on('end', ()=>resolve(buffer_1.Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}
const bufToUint8 = (buf)=>new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
exports.bufToUint8 = bufToUint8;
const getWriteArgs = (fd, a, b, c, d, e)=>{
    (0, util_1.validateFd)(fd);
    let offset = 0;
    let length;
    let position = null;
    let encoding;
    let callback;
    const tipa = typeof a;
    const tipb = typeof b;
    const tipc = typeof c;
    const tipd = typeof d;
    if (tipa !== 'string') {
        if (tipb === 'function') {
            callback = b;
        } else if (tipc === 'function') {
            offset = b | 0;
            callback = c;
        } else if (tipd === 'function') {
            offset = b | 0;
            length = c;
            callback = d;
        } else {
            offset = b | 0;
            length = c;
            position = d;
            callback = e;
        }
    } else {
        if (tipb === 'function') {
            callback = b;
        } else if (tipc === 'function') {
            position = b;
            callback = c;
        } else if (tipd === 'function') {
            position = b;
            encoding = c;
            callback = d;
        }
    }
    const buf = (0, util_1.dataToBuffer)(a, encoding);
    if (tipa !== 'string') {
        if (typeof length === 'undefined') length = buf.length;
    } else {
        offset = 0;
        length = buf.length;
    }
    const cb = validateCallback(callback);
    return [
        fd,
        tipa === 'string',
        buf,
        offset,
        length,
        position,
        cb
    ];
};
exports.getWriteArgs = getWriteArgs;
const getWriteSyncArgs = (fd, a, b, c, d)=>{
    (0, util_1.validateFd)(fd);
    let encoding;
    let offset;
    let length;
    let position;
    const isBuffer = typeof a !== 'string';
    if (isBuffer) {
        offset = (b || 0) | 0;
        length = c;
        position = d;
    } else {
        position = b;
        encoding = c;
    }
    const buf = (0, util_1.dataToBuffer)(a, encoding);
    if (isBuffer) {
        if (typeof length === 'undefined') {
            length = buf.length;
        }
    } else {
        offset = 0;
        length = buf.length;
    }
    return [
        fd,
        buf,
        offset || 0,
        length,
        position
    ];
};
exports.getWriteSyncArgs = getWriteSyncArgs;
function bufferToEncoding(buffer, encoding) {
    if (!encoding || encoding === 'buffer') return buffer;
    else return buffer.toString(encoding);
}
function isReadableStream(stream) {
    return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function' && typeof stream.on === 'function' && stream.readable === true;
} //# sourceMappingURL=util.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/Superblock.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Superblock = void 0;
const path_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/path.js [app-route] (ecmascript)");
const Node_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/Node.js [app-route] (ecmascript)");
const Link_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/Link.js [app-route] (ecmascript)");
const File_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/File.js [app-route] (ecmascript)");
const buffer_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/buffer.js [app-route] (ecmascript)");
const process_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/process.js [app-route] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
const constants_2 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/constants.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/util.js [app-route] (ecmascript)");
const util_2 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/util.js [app-route] (ecmascript)");
const json_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/json.js [app-route] (ecmascript)");
const pathSep = path_1.posix ? path_1.posix.sep : path_1.sep;
const pathRelative = path_1.posix ? path_1.posix.relative : path_1.relative;
const pathJoin = path_1.posix ? path_1.posix.join : path_1.join;
const { O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_EXCL, O_TRUNC, O_APPEND, O_DIRECTORY } = constants_1.constants;
/**
 * Represents a filesystem superblock, which is the root of a virtual
 * filesystem in Linux.
 * @see https://lxr.linux.no/linux+v3.11.2/include/linux/fs.h#L1242
 */ class Superblock {
    static fromJSON(json, cwd) {
        const vol = new Superblock();
        vol.fromJSON(json, cwd);
        return vol;
    }
    static fromNestedJSON(json, cwd) {
        const vol = new Superblock();
        vol.fromNestedJSON(json, cwd);
        return vol;
    }
    constructor(props = {}){
        // I-node number counter.
        this.ino = 0;
        // A mapping for i-node numbers to i-nodes (`Node`);
        this.inodes = {};
        // List of released i-node numbers, for reuse.
        this.releasedInos = [];
        // A mapping for file descriptors to `File`s.
        this.fds = {};
        // A list of reusable (opened and closed) file descriptors, that should be
        // used first before creating a new file descriptor.
        this.releasedFds = [];
        // Max number of open files.
        this.maxFiles = 10000;
        // Current number of open files.
        this.openFiles = 0;
        this.open = (filename, flagsNum, modeNum, resolveSymlinks = true)=>{
            const file = this.openFile(filename, flagsNum, modeNum, resolveSymlinks);
            if (!file) throw (0, util_1.createError)("ENOENT" /* ERROR_CODE.ENOENT */ , 'open', filename);
            return file.fd;
        };
        this.writeFile = (id, buf, flagsNum, modeNum)=>{
            const isUserFd = typeof id === 'number';
            let fd;
            if (isUserFd) fd = id;
            else fd = this.open((0, util_1.pathToFilename)(id), flagsNum, modeNum);
            let offset = 0;
            let length = buf.length;
            let position = flagsNum & O_APPEND ? undefined : 0;
            try {
                while(length > 0){
                    const written = this.write(fd, buf, offset, length, position);
                    offset += written;
                    length -= written;
                    if (position !== undefined) position += written;
                }
            } finally{
                if (!isUserFd) this.close(fd);
            }
        };
        this.read = (fd, buffer, offset, length, position)=>{
            if (buffer.byteLength < length) {
                throw (0, util_1.createError)("ERR_OUT_OF_RANGE" /* ERROR_CODE.ERR_OUT_OF_RANGE */ , 'read', undefined, undefined, RangeError);
            }
            const file = this.getFileByFdOrThrow(fd);
            if (file.node.isSymlink()) {
                throw (0, util_1.createError)("EPERM" /* ERROR_CODE.EPERM */ , 'read', file.link.getPath());
            }
            return file.read(buffer, Number(offset), Number(length), position === -1 || typeof position !== 'number' ? undefined : position);
        };
        this.readv = (fd, buffers, position)=>{
            const file = this.getFileByFdOrThrow(fd);
            let p = position ?? undefined;
            if (p === -1) p = undefined;
            let bytesRead = 0;
            for (const buffer of buffers){
                const bytes = file.read(buffer, 0, buffer.byteLength, p);
                p = undefined;
                bytesRead += bytes;
                if (bytes < buffer.byteLength) break;
            }
            return bytesRead;
        };
        this.link = (filename1, filename2)=>{
            let link1;
            try {
                link1 = this.getLinkOrThrow(filename1, 'link');
            } catch (err) {
                if (err.code) err = (0, util_1.createError)(err.code, 'link', filename1, filename2);
                throw err;
            }
            const dirname2 = (0, path_1.dirname)(filename2);
            let dir2;
            try {
                dir2 = this.getLinkOrThrow(dirname2, 'link');
            } catch (err) {
                // Augment error with filename1
                if (err.code) err = (0, util_1.createError)(err.code, 'link', filename1, filename2);
                throw err;
            }
            const name = (0, path_1.basename)(filename2);
            if (dir2.getChild(name)) throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */ , 'link', filename1, filename2);
            const node = link1.getNode();
            node.nlink++;
            dir2.createChild(name, node);
        };
        this.unlink = (filename)=>{
            const link = this.getLinkOrThrow(filename, 'unlink');
            // TODO: Check if it is file, dir, other...
            if (link.length) throw Error('Dir not empty...');
            this.deleteLink(link);
            const node = link.getNode();
            node.nlink--;
            // When all hard links to i-node are deleted, remove the i-node, too.
            if (node.nlink <= 0) {
                this.deleteNode(node);
            }
        };
        this.symlink = (targetFilename, pathFilename)=>{
            const pathSteps = (0, util_2.filenameToSteps)(pathFilename);
            // Check if directory exists, where we about to create a symlink.
            let dirLink;
            try {
                dirLink = this.getLinkParentAsDirOrThrow(pathSteps);
            } catch (err) {
                // Catch error to populate with the correct fields - getLinkParentAsDirOrThrow won't be aware of the second path
                if (err.code) err = (0, util_1.createError)(err.code, 'symlink', targetFilename, pathFilename);
                throw err;
            }
            const name = pathSteps[pathSteps.length - 1];
            // Check if new file already exists.
            if (dirLink.getChild(name)) throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */ , 'symlink', targetFilename, pathFilename);
            // Check permissions on the path where we are creating the symlink.
            // Note we're not checking permissions on the target path: It is not an error to create a symlink to a
            // non-existent or inaccessible target
            const node = dirLink.getNode();
            if (!node.canExecute() || !node.canWrite()) throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'symlink', targetFilename, pathFilename);
            // Create symlink.
            const symlink = dirLink.createChild(name);
            symlink.getNode().makeSymlink(targetFilename);
            return symlink;
        };
        this.rename = (oldPathFilename, newPathFilename)=>{
            let link;
            try {
                link = this.getResolvedLinkOrThrow(oldPathFilename);
            } catch (err) {
                // Augment err with newPathFilename
                if (err.code) err = (0, util_1.createError)(err.code, 'rename', oldPathFilename, newPathFilename);
                throw err;
            }
            // TODO: Check if it is directory, if non-empty, we cannot move it, right?
            // Check directory exists for the new location.
            let newPathDirLink;
            try {
                newPathDirLink = this.getLinkParentAsDirOrThrow(newPathFilename);
            } catch (err) {
                // Augment error with oldPathFilename
                if (err.code) err = (0, util_1.createError)(err.code, 'rename', oldPathFilename, newPathFilename);
                throw err;
            }
            // TODO: Also treat cases with directories and symbolic links.
            // TODO: See: http://man7.org/linux/man-pages/man2/rename.2.html
            // Remove hard link from old folder.
            const oldLinkParent = link.parent;
            if (!oldLinkParent) throw (0, util_1.createError)("EINVAL" /* ERROR_CODE.EINVAL */ , 'rename', oldPathFilename, newPathFilename);
            // Check we have access and write permissions in both places
            const oldParentNode = oldLinkParent.getNode();
            const newPathDirNode = newPathDirLink.getNode();
            if (!oldParentNode.canExecute() || !oldParentNode.canWrite() || !newPathDirNode.canExecute() || !newPathDirNode.canWrite()) {
                throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'rename', oldPathFilename, newPathFilename);
            }
            oldLinkParent.deleteChild(link);
            // Rename should overwrite the new path, if that exists.
            const name = (0, path_1.basename)(newPathFilename);
            link.name = name;
            link.steps = [
                ...newPathDirLink.steps,
                name
            ];
            newPathDirLink.setChild(link.getName(), link);
        };
        this.mkdir = (filename, modeNum)=>{
            const steps = (0, util_2.filenameToSteps)(filename);
            // This will throw if user tries to create root dir `fs.mkdirSync('/')`.
            if (!steps.length) throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */ , 'mkdir', filename);
            const dir = this.getLinkParentAsDirOrThrow(filename, 'mkdir');
            // Check path already exists.
            const name = steps[steps.length - 1];
            if (dir.getChild(name)) throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */ , 'mkdir', filename);
            const node = dir.getNode();
            if (!node.canWrite() || !node.canExecute()) throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'mkdir', filename);
            dir.createChild(name, this.createNode(constants_1.constants.S_IFDIR | modeNum));
        };
        /**
         * Creates directory tree recursively.
         */ this.mkdirp = (filename, modeNum)=>{
            let created = false;
            const steps = (0, util_2.filenameToSteps)(filename);
            let curr = null;
            let i = steps.length;
            // Find the longest subpath of filename that still exists:
            for(i = steps.length; i >= 0; i--){
                curr = this.getResolvedLink(steps.slice(0, i));
                if (curr) break;
            }
            if (!curr) {
                curr = this.root;
                i = 0;
            }
            // curr is now the last directory that still exists.
            // (If none of them existed, curr is the root.)
            // Check access the lazy way:
            curr = this.getResolvedLinkOrThrow(path_1.sep + steps.slice(0, i).join(path_1.sep), 'mkdir');
            // Start creating directories:
            for(i; i < steps.length; i++){
                const node = curr.getNode();
                if (node.isDirectory()) {
                    // Check we have permissions
                    if (!node.canExecute() || !node.canWrite()) throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'mkdir', filename);
                } else {
                    throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , 'mkdir', filename);
                }
                created = true;
                curr = curr.createChild(steps[i], this.createNode(constants_1.constants.S_IFDIR | modeNum));
            }
            return created ? filename : undefined;
        };
        this.rmdir = (filename, recursive = false)=>{
            const link = this.getLinkAsDirOrThrow(filename, 'rmdir');
            if (link.length && !recursive) throw (0, util_1.createError)("ENOTEMPTY" /* ERROR_CODE.ENOTEMPTY */ , 'rmdir', filename);
            this.deleteLink(link);
        };
        this.rm = (filename, force = false, recursive = false)=>{
            // "stat" is used to match Node's native error message.
            let link;
            try {
                link = this.getResolvedLinkOrThrow(filename, 'stat');
            } catch (err) {
                // Silently ignore missing paths if force option is true
                if (err.code === "ENOENT" /* ERROR_CODE.ENOENT */  && force) return;
                else throw err;
            }
            if (link.getNode().isDirectory() && !recursive) throw (0, util_1.createError)("ERR_FS_EISDIR" /* ERROR_CODE.ERR_FS_EISDIR */ , 'rm', filename);
            if (!link.parent?.getNode().canWrite()) throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'rm', filename);
            this.deleteLink(link);
        };
        this.close = (fd)=>{
            (0, util_2.validateFd)(fd);
            const file = this.getFileByFdOrThrow(fd, 'close');
            this.closeFile(file);
        };
        const root = this.createLink();
        root.setNode(this.createNode(constants_1.constants.S_IFDIR | 0o777));
        root.setChild('.', root);
        root.getNode().nlink++;
        root.setChild('..', root);
        root.getNode().nlink++;
        this.root = root;
    }
    createLink(parent, name, isDirectory = false, mode) {
        if (!parent) {
            return new Link_1.Link(this, void 0, '');
        }
        if (!name) {
            throw new Error('createLink: name cannot be empty');
        }
        // If no explicit permission is provided, use defaults based on type
        const finalPerm = mode ?? (isDirectory ? 0o777 : 0o666);
        // To prevent making a breaking change, `mode` can also just be a permission number
        // and the file type is set based on `isDirectory`
        const hasFileType = mode && mode & constants_1.constants.S_IFMT;
        const modeType = hasFileType ? mode & constants_1.constants.S_IFMT : isDirectory ? constants_1.constants.S_IFDIR : constants_1.constants.S_IFREG;
        const finalMode = finalPerm & ~constants_1.constants.S_IFMT | modeType;
        return parent.createChild(name, this.createNode(finalMode));
    }
    deleteLink(link) {
        const parent = link.parent;
        if (parent) {
            parent.deleteChild(link);
            return true;
        }
        return false;
    }
    newInoNumber() {
        const releasedFd = this.releasedInos.pop();
        if (releasedFd) return releasedFd;
        else {
            this.ino = (this.ino + 1) % 0xffffffff;
            return this.ino;
        }
    }
    newFdNumber() {
        const releasedFd = this.releasedFds.pop();
        return typeof releasedFd === 'number' ? releasedFd : Superblock.fd--;
    }
    createNode(mode) {
        const node = new Node_1.Node(this.newInoNumber(), mode);
        this.inodes[node.ino] = node;
        return node;
    }
    deleteNode(node) {
        node.del();
        delete this.inodes[node.ino];
        this.releasedInos.push(node.ino);
    }
    walk(stepsOrFilenameOrLink, resolveSymlinks = false, checkExistence = false, checkAccess = false, funcName) {
        let steps;
        let filename;
        if (stepsOrFilenameOrLink instanceof Link_1.Link) {
            steps = stepsOrFilenameOrLink.steps;
            filename = pathSep + steps.join(pathSep);
        } else if (typeof stepsOrFilenameOrLink === 'string') {
            steps = (0, util_2.filenameToSteps)(stepsOrFilenameOrLink);
            filename = stepsOrFilenameOrLink;
        } else {
            steps = stepsOrFilenameOrLink;
            filename = pathSep + steps.join(pathSep);
        }
        let curr = this.root;
        let i = 0;
        while(i < steps.length){
            let node = curr.getNode();
            // Check access permissions if current link is a directory
            if (node.isDirectory()) {
                if (checkAccess && !node.canExecute()) {
                    throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */ , funcName, filename);
                }
            } else {
                if (i < steps.length - 1) throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , funcName, filename);
            }
            curr = curr.getChild(steps[i]) ?? null;
            // Check existence of current link
            if (!curr) if (checkExistence) throw (0, util_1.createError)("ENOENT" /* ERROR_CODE.ENOENT */ , funcName, filename);
            else return null;
            node = curr?.getNode();
            // Resolve symlink if we're resolving all symlinks OR if this is an intermediate path component
            // This allows lstat to traverse through symlinks in intermediate directories while not resolving the final component
            if (node.isSymlink() && (resolveSymlinks || i < steps.length - 1)) {
                const resolvedPath = (0, path_1.isAbsolute)(node.symlink) ? node.symlink : pathJoin((0, path_1.dirname)(curr.getPath()), node.symlink); // Relative to symlink's parent
                steps = (0, util_2.filenameToSteps)(resolvedPath).concat(steps.slice(i + 1));
                curr = this.root;
                i = 0;
                continue;
            }
            // After resolving symlinks, check if it's not a directory and we still have more steps
            // This handles the case where we try to traverse through a file
            // Only do this check when we're doing filesystem operations (checkExistence = true)
            if (checkExistence && !node.isDirectory() && i < steps.length - 1) {
                // On Windows, use ENOENT for consistency with Node.js behavior
                // On other platforms, use ENOTDIR which is more semantically correct
                const errorCode = process_1.default.platform === 'win32' ? "ENOENT" /* ERROR_CODE.ENOENT */  : "ENOTDIR" /* ERROR_CODE.ENOTDIR */ ;
                throw (0, util_1.createError)(errorCode, funcName, filename);
            }
            i++;
        }
        return curr;
    }
    // Returns a `Link` (hard link) referenced by path "split" into steps.
    getLink(steps) {
        return this.walk(steps, false, false, false);
    }
    // Just link `getLink`, but throws a correct user error, if link to found.
    getLinkOrThrow(filename, funcName) {
        return this.walk(filename, false, true, true, funcName);
    }
    // Just like `getLink`, but also dereference/resolves symbolic links.
    getResolvedLink(filenameOrSteps) {
        return this.walk(filenameOrSteps, true, false, false);
    }
    /**
     * Just like `getLinkOrThrow`, but also dereference/resolves symbolic links.
     */ getResolvedLinkOrThrow(filename, funcName) {
        return this.walk(filename, true, true, true, funcName);
    }
    resolveSymlinks(link) {
        return this.getResolvedLink(link.steps.slice(1));
    }
    /**
     * Just like `getLinkOrThrow`, but also verifies that the link is a directory.
     */ getLinkAsDirOrThrow(filename, funcName) {
        const link = this.getLinkOrThrow(filename, funcName);
        if (!link.getNode().isDirectory()) throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , funcName, filename);
        return link;
    }
    // Get the immediate parent directory of the link.
    getLinkParent(steps) {
        return this.getLink(steps.slice(0, -1));
    }
    getLinkParentAsDirOrThrow(filenameOrSteps, funcName) {
        const steps = (filenameOrSteps instanceof Array ? filenameOrSteps : (0, util_2.filenameToSteps)(filenameOrSteps)).slice(0, -1);
        const filename = pathSep + steps.join(pathSep);
        const link = this.getLinkOrThrow(filename, funcName);
        if (!link.getNode().isDirectory()) throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , funcName, filename);
        return link;
    }
    getFileByFd(fd) {
        return this.fds[String(fd)];
    }
    getFileByFdOrThrow(fd, funcName) {
        if (!(0, util_2.isFd)(fd)) throw TypeError(constants_2.ERRSTR.FD);
        const file = this.getFileByFd(fd);
        if (!file) throw (0, util_1.createError)("EBADF" /* ERROR_CODE.EBADF */ , funcName);
        return file;
    }
    _toJSON(link = this.root, json = {}, path, asBuffer) {
        let isEmpty = true;
        let children = link.children;
        if (link.getNode().isFile()) {
            children = new Map([
                [
                    link.getName(),
                    link.parent.getChild(link.getName())
                ]
            ]);
            link = link.parent;
        }
        for (const name of children.keys()){
            if (name === '.' || name === '..') {
                continue;
            }
            isEmpty = false;
            const child = link.getChild(name);
            if (!child) {
                throw new Error('_toJSON: unexpected undefined');
            }
            const node = child.getNode();
            if (node.isFile()) {
                let filename = child.getPath();
                if (path) filename = pathRelative(path, filename);
                json[filename] = asBuffer ? node.getBuffer() : node.getString();
            } else if (node.isDirectory()) {
                this._toJSON(child, json, path, asBuffer);
            }
        }
        let dirPath = link.getPath();
        if (path) dirPath = pathRelative(path, dirPath);
        if (dirPath && isEmpty) {
            json[dirPath] = null;
        }
        return json;
    }
    toJSON(paths, json = {}, isRelative = false, asBuffer = false) {
        const links = [];
        if (paths) {
            if (!Array.isArray(paths)) paths = [
                paths
            ];
            for (const path of paths){
                const filename = (0, util_1.pathToFilename)(path);
                const link = this.getResolvedLink(filename);
                if (!link) continue;
                links.push(link);
            }
        } else {
            links.push(this.root);
        }
        if (!links.length) return json;
        for (const link of links)this._toJSON(link, json, isRelative ? link.getPath() : '', asBuffer);
        return json;
    }
    // TODO: `cwd` should probably not invoke `process.cwd()`.
    fromJSON(json, cwd = process_1.default.cwd()) {
        for(let filename in json){
            const data = json[filename];
            filename = (0, util_2.resolve)(filename, cwd);
            if (typeof data === 'string' || data instanceof buffer_1.Buffer) {
                const dir = (0, path_1.dirname)(filename);
                this.mkdirp(dir, 511 /* MODE.DIR */ );
                const buffer = (0, util_2.dataToBuffer)(data);
                this.writeFile(filename, buffer, constants_2.FLAGS.w, 438 /* MODE.DEFAULT */ );
            } else {
                this.mkdirp(filename, 511 /* MODE.DIR */ );
            }
        }
    }
    fromNestedJSON(json, cwd) {
        this.fromJSON((0, json_1.flattenJSON)(json), cwd);
    }
    reset() {
        this.ino = 0;
        this.inodes = {};
        this.releasedInos = [];
        this.fds = {};
        this.releasedFds = [];
        this.openFiles = 0;
        this.root = this.createLink();
        this.root.setNode(this.createNode(constants_1.constants.S_IFDIR | 0o777));
    }
    // Legacy interface
    mountSync(mountpoint, json) {
        this.fromJSON(json, mountpoint);
    }
    openLink(link, flagsNum, resolveSymlinks = true) {
        if (this.openFiles >= this.maxFiles) {
            // Too many open files.
            throw (0, util_1.createError)("EMFILE" /* ERROR_CODE.EMFILE */ , 'open', link.getPath());
        }
        // Resolve symlinks.
        //
        // @TODO: This should be superfluous. This method is only ever called by openFile(), which does its own symlink resolution
        // prior to calling.
        let realLink = link;
        if (resolveSymlinks) realLink = this.getResolvedLinkOrThrow(link.getPath(), 'open');
        const node = realLink.getNode();
        // Check whether node is a directory
        if (node.isDirectory()) {
            if ((flagsNum & (O_RDONLY | O_RDWR | O_WRONLY)) !== O_RDONLY) throw (0, util_1.createError)("EISDIR" /* ERROR_CODE.EISDIR */ , 'open', link.getPath());
        } else {
            if (flagsNum & O_DIRECTORY) throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , 'open', link.getPath());
        }
        // Check node permissions
        // For read access: check if flags are O_RDONLY or O_RDWR (i.e., not only O_WRONLY)
        if ((flagsNum & (O_RDONLY | O_RDWR | O_WRONLY)) !== O_WRONLY) {
            if (!node.canRead()) {
                throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'open', link.getPath());
            }
        }
        // For write access: check if flags are O_WRONLY or O_RDWR
        if (flagsNum & (O_WRONLY | O_RDWR)) {
            if (!node.canWrite()) {
                throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'open', link.getPath());
            }
        }
        const file = new File_1.File(link, node, flagsNum, this.newFdNumber());
        this.fds[file.fd] = file;
        this.openFiles++;
        if (flagsNum & O_TRUNC) file.truncate();
        return file;
    }
    openFile(filename, flagsNum, modeNum, resolveSymlinks = true) {
        const steps = (0, util_2.filenameToSteps)(filename);
        let link;
        try {
            link = resolveSymlinks ? this.getResolvedLinkOrThrow(filename, 'open') : this.getLinkOrThrow(filename, 'open');
            // Check if file already existed when trying to create it exclusively (O_CREAT and O_EXCL flags are set).
            // This is an error, see https://pubs.opengroup.org/onlinepubs/009695399/functions/open.html:
            // "If O_CREAT and O_EXCL are set, open() shall fail if the file exists."
            if (link && flagsNum & O_CREAT && flagsNum & O_EXCL) throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */ , 'open', filename);
        } catch (err) {
            // Try creating a new file, if it does not exist and O_CREAT flag is set.
            // Note that this will still throw if the ENOENT came from one of the
            // intermediate directories instead of the file itself.
            if (err.code === "ENOENT" /* ERROR_CODE.ENOENT */  && flagsNum & O_CREAT) {
                const dirName = (0, path_1.dirname)(filename);
                const dirLink = this.getResolvedLinkOrThrow(dirName);
                const dirNode = dirLink.getNode();
                // Check that the place we create the new file is actually a directory and that we are allowed to do so:
                if (!dirNode.isDirectory()) throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , 'open', filename);
                if (!dirNode.canExecute() || !dirNode.canWrite()) throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'open', filename);
                // This is a difference to the original implementation, which would simply not create a file unless modeNum was specified.
                // However, current Node versions will default to 0o666.
                modeNum ?? (modeNum = 0o666);
                link = this.createLink(dirLink, steps[steps.length - 1], false, modeNum);
            } else throw err;
        }
        if (link) return this.openLink(link, flagsNum, resolveSymlinks);
        throw (0, util_1.createError)("ENOENT" /* ERROR_CODE.ENOENT */ , 'open', filename);
    }
    closeFile(file) {
        if (!this.fds[file.fd]) return;
        this.openFiles--;
        delete this.fds[file.fd];
        this.releasedFds.push(file.fd);
    }
    write(fd, buf, offset, length, position) {
        const file = this.getFileByFdOrThrow(fd, 'write');
        if (file.node.isSymlink()) {
            throw (0, util_1.createError)("EBADF" /* ERROR_CODE.EBADF */ , 'write', file.link.getPath());
        }
        return file.write(buf, offset, length, position === -1 || typeof position !== 'number' ? undefined : position);
    }
}
exports.Superblock = Superblock;
/**
 * Global file descriptor counter. UNIX file descriptors start from 0 and go sequentially
 * up, so here, in order not to conflict with them, we choose some big number and descrease
 * the file descriptor of every new opened file.
 * @type {number}
 * @todo This should not be static, right?
 */ Superblock.fd = 0x7fffffff; //# sourceMappingURL=Superblock.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Superblock = exports.File = exports.Link = exports.Node = void 0;
const tslib_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-route] (ecmascript)");
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/types.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/json.js [app-route] (ecmascript)"), exports);
var Node_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/Node.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Node", {
    enumerable: true,
    get: function() {
        return Node_1.Node;
    }
});
var Link_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/Link.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Link", {
    enumerable: true,
    get: function() {
        return Link_1.Link;
    }
});
var File_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/File.js [app-route] (ecmascript)");
Object.defineProperty(exports, "File", {
    enumerable: true,
    get: function() {
        return File_1.File;
    }
});
var Superblock_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/Superblock.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Superblock", {
    enumerable: true,
    get: function() {
        return Superblock_1.Superblock;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/StatFs.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StatFs = void 0;
/**
 * Statistics about a file system, like `fs.StatFs`.
 */ class StatFs {
    static build(superblock, bigint = false) {
        const statfs = new StatFs();
        const getStatNumber = !bigint ? (number)=>number : (number)=>BigInt(number);
        // For in-memory filesystem, provide mock but reasonable values
        // Magic number for in-memory filesystem type (similar to ramfs)
        statfs.type = getStatNumber(0x858458f6);
        // Optimal transfer block size - commonly 4096 bytes
        statfs.bsize = getStatNumber(4096);
        // Calculate filesystem stats based on current state
        const totalInodes = Object.keys(superblock.inodes).length;
        // Mock large filesystem capacity (appears as a large filesystem to applications)
        const totalBlocks = 1000000;
        const usedBlocks = Math.min(totalInodes * 2, totalBlocks); // Rough estimation
        const freeBlocks = totalBlocks - usedBlocks;
        statfs.blocks = getStatNumber(totalBlocks); // Total data blocks
        statfs.bfree = getStatNumber(freeBlocks); // Free blocks in file system
        statfs.bavail = getStatNumber(freeBlocks); // Free blocks available to unprivileged users
        // File node statistics
        const maxFiles = 1000000; // Mock large number of available inodes
        statfs.files = getStatNumber(maxFiles); // Total file nodes in file system
        statfs.ffree = getStatNumber(maxFiles - totalInodes); // Free file nodes
        return statfs;
    }
}
exports.StatFs = StatFs;
exports.default = StatFs; //# sourceMappingURL=StatFs.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/setTimeoutUnref.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * `setTimeoutUnref` is just like `setTimeout`,
 * only in Node's environment it will "unref" its macro task.
 */ function setTimeoutUnref(callback, time, args) {
    const ref = setTimeout.apply(typeof globalThis !== 'undefined' ? globalThis : /*TURBOPACK member replacement*/ __turbopack_context__.g, arguments);
    if (ref && typeof ref === 'object' && typeof ref.unref === 'function') ref.unref();
    return ref;
}
exports.default = setTimeoutUnref; //# sourceMappingURL=setTimeoutUnref.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Writable = exports.Readable = void 0;
var node_stream_1 = __turbopack_context__.r("[externals]/node:stream [external] (node:stream, cjs)");
Object.defineProperty(exports, "Readable", {
    enumerable: true,
    get: function() {
        return node_stream_1.Readable;
    }
});
Object.defineProperty(exports, "Writable", {
    enumerable: true,
    get: function() {
        return node_stream_1.Writable;
    }
}); //# sourceMappingURL=stream.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/events.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventEmitter = void 0;
var node_events_1 = __turbopack_context__.r("[externals]/node:events [external] (node:events, cjs)");
Object.defineProperty(exports, "EventEmitter", {
    enumerable: true,
    get: function() {
        return node_events_1.EventEmitter;
    }
}); //# sourceMappingURL=events.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/FileHandle.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FileHandle = void 0;
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/util.js [app-route] (ecmascript)");
const events_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/events.js [app-route] (ecmascript)");
class FileHandle extends events_1.EventEmitter {
    constructor(fs, fd){
        super();
        this.refs = 1;
        this.closePromise = null;
        this.position = 0;
        this.readableWebStreamLocked = false;
        this.fs = fs;
        this.fd = fd;
    }
    getAsyncId() {
        // Return a unique async ID for this file handle
        // In a real implementation, this would be provided by the underlying system
        return this.fd;
    }
    appendFile(data, options) {
        return (0, util_1.promisify)(this.fs, 'appendFile')(this.fd, data, options);
    }
    chmod(mode) {
        return (0, util_1.promisify)(this.fs, 'fchmod')(this.fd, mode);
    }
    chown(uid, gid) {
        return (0, util_1.promisify)(this.fs, 'fchown')(this.fd, uid, gid);
    }
    close() {
        if (this.fd === -1) {
            return Promise.resolve();
        }
        if (this.closePromise) {
            return this.closePromise;
        }
        this.refs--;
        if (this.refs === 0) {
            const currentFd = this.fd;
            this.fd = -1;
            this.closePromise = (0, util_1.promisify)(this.fs, 'close')(currentFd).finally(()=>{
                this.closePromise = null;
            });
        } else {
            this.closePromise = new Promise((resolve, reject)=>{
                this.closeResolve = resolve;
                this.closeReject = reject;
            }).finally(()=>{
                this.closePromise = null;
                this.closeReject = undefined;
                this.closeResolve = undefined;
            });
        }
        this.emit('close');
        return this.closePromise;
    }
    datasync() {
        return (0, util_1.promisify)(this.fs, 'fdatasync')(this.fd);
    }
    createReadStream(options) {
        return this.fs.createReadStream('', {
            ...options,
            fd: this
        });
    }
    createWriteStream(options) {
        return this.fs.createWriteStream('', {
            ...options,
            fd: this
        });
    }
    readableWebStream(options = {}) {
        const { type = 'bytes', autoClose = false } = options;
        let position = 0;
        if (this.fd === -1) {
            throw new Error('The FileHandle is closed');
        }
        if (this.closePromise) {
            throw new Error('The FileHandle is closing');
        }
        if (this.readableWebStreamLocked) {
            throw new Error('An error will be thrown if this method is called more than once or is called after the FileHandle is closed or closing.');
        }
        this.readableWebStreamLocked = true;
        this.ref();
        const unlockAndCleanup = ()=>{
            this.readableWebStreamLocked = false;
            this.unref();
            if (autoClose) {
                this.close().catch(()=>{
                // Ignore close errors in cleanup
                });
            }
        };
        return new ReadableStream({
            type: type === 'bytes' ? 'bytes' : undefined,
            autoAllocateChunkSize: 16384,
            pull: async (controller)=>{
                try {
                    const view = controller.byobRequest?.view;
                    if (!view) {
                        // Fallback for when BYOB is not available
                        const buffer = new Uint8Array(16384);
                        const result = await this.read(buffer, 0, buffer.length, position);
                        if (result.bytesRead === 0) {
                            controller.close();
                            unlockAndCleanup();
                            return;
                        }
                        position += result.bytesRead;
                        controller.enqueue(buffer.slice(0, result.bytesRead));
                        return;
                    }
                    const result = await this.read(view, view.byteOffset, view.byteLength, position);
                    if (result.bytesRead === 0) {
                        controller.close();
                        unlockAndCleanup();
                        return;
                    }
                    position += result.bytesRead;
                    controller.byobRequest.respond(result.bytesRead);
                } catch (error) {
                    controller.error(error);
                    unlockAndCleanup();
                }
            },
            cancel: async ()=>{
                unlockAndCleanup();
            }
        });
    }
    async read(buffer, offset, length, position) {
        const readPosition = position !== null && position !== undefined ? position : this.position;
        const result = await (0, util_1.promisify)(this.fs, 'read', (bytesRead)=>({
                bytesRead,
                buffer
            }))(this.fd, buffer, offset, length, readPosition);
        // Update internal position only if position was null/undefined
        if (position === null || position === undefined) {
            this.position += result.bytesRead;
        }
        return result;
    }
    readv(buffers, position) {
        return (0, util_1.promisify)(this.fs, 'readv', (bytesRead)=>({
                bytesRead,
                buffers
            }))(this.fd, buffers, position);
    }
    readFile(options) {
        return (0, util_1.promisify)(this.fs, 'readFile')(this.fd, options);
    }
    stat(options) {
        return (0, util_1.promisify)(this.fs, 'fstat')(this.fd, options);
    }
    sync() {
        return (0, util_1.promisify)(this.fs, 'fsync')(this.fd);
    }
    truncate(len) {
        return (0, util_1.promisify)(this.fs, 'ftruncate')(this.fd, len);
    }
    utimes(atime, mtime) {
        return (0, util_1.promisify)(this.fs, 'futimes')(this.fd, atime, mtime);
    }
    async write(buffer, offset, length, position) {
        const useInternalPosition = typeof position !== 'number';
        const writePosition = useInternalPosition ? this.position : position;
        const result = await (0, util_1.promisify)(this.fs, 'write', (bytesWritten)=>({
                bytesWritten,
                buffer
            }))(this.fd, buffer, offset, length, writePosition);
        // Update internal position only if position was null/undefined
        if (useInternalPosition) {
            this.position += result.bytesWritten;
        }
        return result;
    }
    writev(buffers, position) {
        return (0, util_1.promisify)(this.fs, 'writev', (bytesWritten)=>({
                bytesWritten,
                buffers
            }))(this.fd, buffers, position);
    }
    writeFile(data, options) {
        return (0, util_1.promisify)(this.fs, 'writeFile')(this.fd, data, options);
    }
    // Implement Symbol.asyncDispose if available (ES2023+)
    async [Symbol.asyncDispose]() {
        await this.close();
    }
    ref() {
        this.refs++;
    }
    unref() {
        this.refs--;
        if (this.refs === 0) {
            this.fd = -1;
            if (this.closeResolve) {
                (0, util_1.promisify)(this.fs, 'close')(this.fd).then(this.closeResolve, this.closeReject);
            }
        }
    }
}
exports.FileHandle = FileHandle; //# sourceMappingURL=FileHandle.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/FsPromises.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FsPromises = void 0;
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/util.js [app-route] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
// AsyncIterator implementation for promises.watch
class FSWatchAsyncIterator {
    constructor(fs, path, options = {}){
        this.fs = fs;
        this.path = path;
        this.options = options;
        this.eventQueue = [];
        this.resolveQueue = [];
        this.finished = false;
        this.maxQueue = options.maxQueue || 2048;
        this.overflow = options.overflow || 'ignore';
        this.startWatching();
        // Handle AbortSignal
        if (options.signal) {
            if (options.signal.aborted) {
                this.finish();
                return;
            }
            options.signal.addEventListener('abort', ()=>{
                this.finish();
            });
        }
    }
    startWatching() {
        try {
            this.watcher = this.fs.watch(this.path, this.options, (eventType, filename)=>{
                this.enqueueEvent({
                    eventType,
                    filename
                });
            });
        } catch (error) {
            // If we can't start watching, finish immediately
            this.finish();
            throw error;
        }
    }
    enqueueEvent(event) {
        if (this.finished) return;
        // Handle queue overflow
        if (this.eventQueue.length >= this.maxQueue) {
            if (this.overflow === 'throw') {
                const error = new Error(`Watch queue overflow: more than ${this.maxQueue} events queued`);
                this.finish(error);
                return;
            } else {
                // 'ignore' - drop the oldest event
                this.eventQueue.shift();
                console.warn(`Watch queue overflow: dropping event due to exceeding maxQueue of ${this.maxQueue}`);
            }
        }
        this.eventQueue.push(event);
        // If there's a waiting promise, resolve it
        if (this.resolveQueue.length > 0) {
            const { resolve } = this.resolveQueue.shift();
            const nextEvent = this.eventQueue.shift();
            resolve({
                value: nextEvent,
                done: false
            });
        }
    }
    finish(error) {
        if (this.finished) return;
        this.finished = true;
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
        // Resolve or reject all pending promises
        while(this.resolveQueue.length > 0){
            const { resolve, reject } = this.resolveQueue.shift();
            if (error) {
                reject(error);
            } else {
                resolve({
                    value: undefined,
                    done: true
                });
            }
        }
    }
    async next() {
        if (this.finished) {
            return {
                value: undefined,
                done: true
            };
        }
        // If we have queued events, return one
        if (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            return {
                value: event,
                done: false
            };
        }
        // Otherwise, wait for the next event
        return new Promise((resolve, reject)=>{
            this.resolveQueue.push({
                resolve,
                reject
            });
        });
    }
    async return() {
        this.finish();
        return {
            value: undefined,
            done: true
        };
    }
    async throw(error) {
        this.finish(error);
        throw error;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
}
class FsPromises {
    constructor(fs, FileHandle){
        this.fs = fs;
        this.FileHandle = FileHandle;
        this.constants = constants_1.constants;
        this.cp = (0, util_1.promisify)(this.fs, 'cp');
        this.opendir = (0, util_1.promisify)(this.fs, 'opendir');
        this.statfs = (0, util_1.promisify)(this.fs, 'statfs');
        this.lutimes = (0, util_1.promisify)(this.fs, 'lutimes');
        this.glob = (0, util_1.promisify)(this.fs, 'glob');
        this.access = (0, util_1.promisify)(this.fs, 'access');
        this.chmod = (0, util_1.promisify)(this.fs, 'chmod');
        this.chown = (0, util_1.promisify)(this.fs, 'chown');
        this.copyFile = (0, util_1.promisify)(this.fs, 'copyFile');
        this.lchmod = (0, util_1.promisify)(this.fs, 'lchmod');
        this.lchown = (0, util_1.promisify)(this.fs, 'lchown');
        this.link = (0, util_1.promisify)(this.fs, 'link');
        this.lstat = (0, util_1.promisify)(this.fs, 'lstat');
        this.mkdir = (0, util_1.promisify)(this.fs, 'mkdir');
        this.mkdtemp = (0, util_1.promisify)(this.fs, 'mkdtemp');
        this.readdir = (0, util_1.promisify)(this.fs, 'readdir');
        this.readlink = (0, util_1.promisify)(this.fs, 'readlink');
        this.realpath = (0, util_1.promisify)(this.fs, 'realpath');
        this.rename = (0, util_1.promisify)(this.fs, 'rename');
        this.rmdir = (0, util_1.promisify)(this.fs, 'rmdir');
        this.rm = (0, util_1.promisify)(this.fs, 'rm');
        this.stat = (0, util_1.promisify)(this.fs, 'stat');
        this.symlink = (0, util_1.promisify)(this.fs, 'symlink');
        this.truncate = (0, util_1.promisify)(this.fs, 'truncate');
        this.unlink = (0, util_1.promisify)(this.fs, 'unlink');
        this.utimes = (0, util_1.promisify)(this.fs, 'utimes');
        this.readFile = (id, options)=>{
            return (0, util_1.promisify)(this.fs, 'readFile')(id instanceof this.FileHandle ? id.fd : id, options);
        };
        this.appendFile = (path, data, options)=>{
            return (0, util_1.promisify)(this.fs, 'appendFile')(path instanceof this.FileHandle ? path.fd : path, data, options);
        };
        this.open = (path, flags = 'r', mode)=>{
            return (0, util_1.promisify)(this.fs, 'open', (fd)=>new this.FileHandle(this.fs, fd))(path, flags, mode);
        };
        this.writeFile = (id, data, options)=>{
            const dataPromise = (0, util_1.isReadableStream)(data) ? (0, util_1.streamToBuffer)(data) : Promise.resolve(data);
            return dataPromise.then((data)=>(0, util_1.promisify)(this.fs, 'writeFile')(id instanceof this.FileHandle ? id.fd : id, data, options));
        };
        this.watch = (filename, options)=>{
            const watchOptions = typeof options === 'string' ? {
                encoding: options
            } : options || {};
            return new FSWatchAsyncIterator(this.fs, filename, watchOptions);
        };
    }
}
exports.FsPromises = FsPromises; //# sourceMappingURL=FsPromises.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node-to-fsa/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.newNotAllowedError = exports.newTypeMismatchError = exports.newNotFoundError = exports.assertCanWrite = exports.assertName = exports.basename = exports.ctx = void 0;
/**
 * Creates a new {@link NodeFsaContext}.
 */ const ctx = (partial = {})=>{
    return {
        separator: '/',
        syncHandleAllowed: false,
        mode: 'read',
        ...partial
    };
};
exports.ctx = ctx;
const basename = (path, separator)=>{
    if (path[path.length - 1] === separator) path = path.slice(0, -1);
    const lastSlashIndex = path.lastIndexOf(separator);
    return lastSlashIndex === -1 ? path : path.slice(lastSlashIndex + 1);
};
exports.basename = basename;
const nameRegex = /^(\.{1,2})$|^(.*([\/\\]).*)$/;
const assertName = (name, method, klass)=>{
    const isInvalid = !name || nameRegex.test(name);
    if (isInvalid) throw new TypeError(`Failed to execute '${method}' on '${klass}': Name is not allowed.`);
};
exports.assertName = assertName;
const assertCanWrite = (mode)=>{
    if (mode !== 'readwrite') throw new DOMException('The request is not allowed by the user agent or the platform in the current context.', 'NotAllowedError');
};
exports.assertCanWrite = assertCanWrite;
const newNotFoundError = ()=>new DOMException('A requested file or directory could not be found at the time an operation was processed.', 'NotFoundError');
exports.newNotFoundError = newNotFoundError;
const newTypeMismatchError = ()=>new DOMException('The path supplied exists, but was not an entry of requested type.', 'TypeMismatchError');
exports.newTypeMismatchError = newTypeMismatchError;
const newNotAllowedError = ()=>new DOMException('Permission not granted.', 'NotAllowedError');
exports.newNotAllowedError = newNotAllowedError; //# sourceMappingURL=util.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/print/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toTreeSync = void 0;
const tree_dump_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/tree-dump@1.1.0_tslib@2.8.1/node_modules/tree-dump/lib/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node-to-fsa/util.js [app-route] (ecmascript)");
const toTreeSync = (fs, opts = {})=>{
    const separator = opts.separator || '/';
    let dir = opts.dir || separator;
    if (dir[dir.length - 1] !== separator) dir += separator;
    const tab = opts.tab || '';
    const depth = opts.depth ?? 10;
    let subtree = ' (...)';
    if (depth > 0) {
        const list = fs.readdirSync(dir, {
            withFileTypes: true
        });
        subtree = (0, tree_dump_1.printTree)(tab, list.map((entry)=>(tab)=>{
                if (entry.isDirectory()) {
                    return (0, exports.toTreeSync)(fs, {
                        dir: dir + entry.name,
                        depth: depth - 1,
                        tab
                    });
                } else if (entry.isSymbolicLink()) {
                    return '' + entry.name + ' → ' + fs.readlinkSync(dir + entry.name);
                } else {
                    return '' + entry.name;
                }
            }));
    }
    const base = (0, util_1.basename)(dir, separator) + separator;
    return base + subtree;
};
exports.toTreeSync = toTreeSync; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/options.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getWriteFileOptions = exports.writeFileDefaults = exports.getRealpathOptsAndCb = exports.getRealpathOptions = exports.getStatfsOptsAndCb = exports.getStatfsOptions = exports.getStatOptsAndCb = exports.getStatOptions = exports.getAppendFileOptsAndCb = exports.getAppendFileOpts = exports.getOpendirOptsAndCb = exports.getOpendirOptions = exports.getReaddirOptsAndCb = exports.getReaddirOptions = exports.getReadFileOptions = exports.getRmOptsAndCb = exports.getRmdirOptions = exports.getDefaultOptsAndCb = exports.getDefaultOpts = exports.optsDefaults = exports.getMkdirOptions = void 0;
exports.getOptions = getOptions;
exports.optsGenerator = optsGenerator;
exports.optsAndCbGenerator = optsAndCbGenerator;
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/constants.js [app-route] (ecmascript)");
const encoding_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/encoding.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/util.js [app-route] (ecmascript)");
const mkdirDefaults = {
    mode: 511 /* MODE.DIR */ ,
    recursive: false
};
const getMkdirOptions = (options)=>{
    if (typeof options === 'number') return Object.assign({}, mkdirDefaults, {
        mode: options
    });
    return Object.assign({}, mkdirDefaults, options);
};
exports.getMkdirOptions = getMkdirOptions;
const ERRSTR_OPTS = (tipeof)=>`Expected options to be either an object or a string, but got ${tipeof} instead`;
function getOptions(defaults, options) {
    let opts;
    if (!options) return defaults;
    else {
        const tipeof = typeof options;
        switch(tipeof){
            case 'string':
                opts = Object.assign({}, defaults, {
                    encoding: options
                });
                break;
            case 'object':
                opts = Object.assign({}, defaults, options);
                break;
            default:
                throw TypeError(ERRSTR_OPTS(tipeof));
        }
    }
    if (opts.encoding !== 'buffer') (0, encoding_1.assertEncoding)(opts.encoding);
    return opts;
}
function optsGenerator(defaults) {
    return (options)=>getOptions(defaults, options);
}
function optsAndCbGenerator(getOpts) {
    return (options, callback)=>typeof options === 'function' ? [
            getOpts(),
            options
        ] : [
            getOpts(options),
            (0, util_1.validateCallback)(callback)
        ];
}
exports.optsDefaults = {
    encoding: 'utf8'
};
exports.getDefaultOpts = optsGenerator(exports.optsDefaults);
exports.getDefaultOptsAndCb = optsAndCbGenerator(exports.getDefaultOpts);
const rmdirDefaults = {
    recursive: false
};
const getRmdirOptions = (options)=>{
    return Object.assign({}, rmdirDefaults, options);
};
exports.getRmdirOptions = getRmdirOptions;
const getRmOpts = optsGenerator(exports.optsDefaults);
exports.getRmOptsAndCb = optsAndCbGenerator(getRmOpts);
const readFileOptsDefaults = {
    flag: 'r'
};
exports.getReadFileOptions = optsGenerator(readFileOptsDefaults);
const readdirDefaults = {
    encoding: 'utf8',
    recursive: false,
    withFileTypes: false
};
exports.getReaddirOptions = optsGenerator(readdirDefaults);
exports.getReaddirOptsAndCb = optsAndCbGenerator(exports.getReaddirOptions);
const opendirDefaults = {
    encoding: 'utf8',
    bufferSize: 32,
    recursive: false
};
exports.getOpendirOptions = optsGenerator(opendirDefaults);
exports.getOpendirOptsAndCb = optsAndCbGenerator(exports.getOpendirOptions);
const appendFileDefaults = {
    encoding: 'utf8',
    mode: 438 /* MODE.DEFAULT */ ,
    flag: constants_1.FLAGS[constants_1.FLAGS.a]
};
exports.getAppendFileOpts = optsGenerator(appendFileDefaults);
exports.getAppendFileOptsAndCb = optsAndCbGenerator(exports.getAppendFileOpts);
const statDefaults = {
    bigint: false
};
const getStatOptions = (options = {})=>Object.assign({}, statDefaults, options);
exports.getStatOptions = getStatOptions;
const getStatOptsAndCb = (options, callback)=>typeof options === 'function' ? [
        (0, exports.getStatOptions)(),
        options
    ] : [
        (0, exports.getStatOptions)(options),
        (0, util_1.validateCallback)(callback)
    ];
exports.getStatOptsAndCb = getStatOptsAndCb;
const statfsDefaults = {
    bigint: false
};
const getStatfsOptions = (options = {})=>Object.assign({}, statfsDefaults, options);
exports.getStatfsOptions = getStatfsOptions;
const getStatfsOptsAndCb = (options, callback)=>typeof options === 'function' ? [
        (0, exports.getStatfsOptions)(),
        options
    ] : [
        (0, exports.getStatfsOptions)(options),
        (0, util_1.validateCallback)(callback)
    ];
exports.getStatfsOptsAndCb = getStatfsOptsAndCb;
const realpathDefaults = exports.optsDefaults;
exports.getRealpathOptions = optsGenerator(realpathDefaults);
exports.getRealpathOptsAndCb = optsAndCbGenerator(exports.getRealpathOptions);
exports.writeFileDefaults = {
    encoding: 'utf8',
    mode: 438 /* MODE.DEFAULT */ ,
    flag: constants_1.FLAGS[constants_1.FLAGS.w]
};
exports.getWriteFileOptions = optsGenerator(exports.writeFileDefaults); //# sourceMappingURL=options.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/Dir.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dir = void 0;
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/util.js [app-route] (ecmascript)");
const Dirent_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/Dirent.js [app-route] (ecmascript)");
const errors = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/errors.js [app-route] (ecmascript)");
/**
 * A directory stream, like `fs.Dir`.
 */ class Dir {
    constructor(link, options){
        this.link = link;
        this.options = options;
        this.iteratorInfo = [];
        this.closed = false;
        this.operationQueue = null;
        this.path = link.getPath();
        this.iteratorInfo.push(link.children[Symbol.iterator]());
    }
    closeBase() {
    // In a real filesystem implementation, this would close file descriptors
    // For memfs, we just need to mark as closed
    }
    readBase(iteratorInfo) {
        let done;
        let value;
        let name;
        let link;
        do {
            do {
                ({ done, value } = iteratorInfo[iteratorInfo.length - 1].next());
                if (!done) {
                    [name, link] = value;
                } else {
                    break;
                }
            }while (name === '.' || name === '..')
            if (done) {
                iteratorInfo.pop();
                if (iteratorInfo.length === 0) {
                    break;
                } else {
                    done = false;
                }
            } else {
                if (this.options.recursive && link.children.size) {
                    iteratorInfo.push(link.children[Symbol.iterator]());
                }
                return Dirent_1.default.build(link, this.options.encoding);
            }
        }while (!done)
        return null;
    }
    close(callback) {
        // Promise-based close
        if (callback === undefined) {
            if (this.closed) {
                return Promise.reject(new errors.Error('ERR_DIR_CLOSED'));
            }
            return new Promise((resolve, reject)=>{
                this.close((err)=>{
                    if (err) reject(err);
                    else resolve();
                });
            });
        }
        // Callback-based close
        (0, util_1.validateCallback)(callback);
        if (this.closed) {
            process.nextTick(callback, new errors.Error('ERR_DIR_CLOSED'));
            return;
        }
        if (this.operationQueue !== null) {
            this.operationQueue.push(()=>{
                this.close(callback);
            });
            return;
        }
        this.closed = true;
        try {
            this.closeBase();
            process.nextTick(callback);
        } catch (err) {
            process.nextTick(callback, err);
        }
    }
    closeSync() {
        if (this.closed) {
            throw new errors.Error('ERR_DIR_CLOSED');
        }
        if (this.operationQueue !== null) {
            throw new errors.Error('ERR_DIR_CONCURRENT_OPERATION');
        }
        this.closed = true;
        this.closeBase();
    }
    read(callback) {
        // Promise-based read
        if (callback === undefined) {
            return new Promise((resolve, reject)=>{
                this.read((err, result)=>{
                    if (err) reject(err);
                    else resolve(result ?? null);
                });
            });
        }
        // Callback-based read
        (0, util_1.validateCallback)(callback);
        if (this.closed) {
            process.nextTick(callback, new errors.Error('ERR_DIR_CLOSED'));
            return;
        }
        if (this.operationQueue !== null) {
            this.operationQueue.push(()=>{
                this.read(callback);
            });
            return;
        }
        this.operationQueue = [];
        try {
            const result = this.readBase(this.iteratorInfo);
            process.nextTick(()=>{
                const queue = this.operationQueue;
                this.operationQueue = null;
                for (const op of queue)op();
                callback(null, result);
            });
        } catch (err) {
            process.nextTick(()=>{
                const queue = this.operationQueue;
                this.operationQueue = null;
                for (const op of queue)op();
                callback(err);
            });
        }
    }
    readSync() {
        if (this.closed) {
            throw new errors.Error('ERR_DIR_CLOSED');
        }
        if (this.operationQueue !== null) {
            throw new errors.Error('ERR_DIR_CONCURRENT_OPERATION');
        }
        return this.readBase(this.iteratorInfo);
    }
    [Symbol.asyncIterator]() {
        return {
            next: async ()=>{
                try {
                    const dirEnt = await this.read();
                    if (dirEnt !== null) {
                        return {
                            done: false,
                            value: dirEnt
                        };
                    } else {
                        return {
                            done: true,
                            value: undefined
                        };
                    }
                } catch (err) {
                    throw err;
                }
            },
            [Symbol.asyncIterator] () {
                return this;
            }
        };
    }
}
exports.Dir = Dir; //# sourceMappingURL=Dir.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/glob.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.globSync = globSync;
const path_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/path.js [app-route] (ecmascript)");
const glob_to_regex_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/glob-to-regex.js@1.2.0_tslib@2.8.1/node_modules/glob-to-regex.js/lib/index.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/util.js [app-route] (ecmascript)");
const pathJoin = path_1.posix.join;
const pathRelative = path_1.posix.relative;
const pathResolve = path_1.posix.resolve;
/**
 * Check if a path matches a glob pattern
 */ function matchesPattern(path, pattern) {
    const regex = (0, glob_to_regex_js_1.toRegex)(pattern);
    return regex.test(path);
}
/**
 * Check if a path should be excluded based on exclude patterns
 */ function isExcluded(path, exclude) {
    if (!exclude) return false;
    if (typeof exclude === 'function') {
        return exclude(path);
    }
    const patterns = Array.isArray(exclude) ? exclude : [
        exclude
    ];
    return patterns.some((pattern)=>matchesPattern(path, pattern));
}
/**
 * Walk directory tree and collect matching paths
 */ function walkDirectory(fs, dir, patterns, options, currentDepth = 0) {
    const results = [];
    const maxDepth = options.maxdepth ?? Infinity;
    const baseCwd = options.cwd ? (0, util_1.pathToFilename)(options.cwd) : process.cwd();
    if (currentDepth > maxDepth) {
        return results;
    }
    try {
        const entries = fs.readdirSync(dir, {
            withFileTypes: true
        });
        for (const entry of entries){
            const fullPath = pathJoin(dir, entry.name.toString());
            const relativePath = pathRelative(baseCwd, fullPath);
            // Skip if excluded
            if (isExcluded(relativePath, options.exclude)) {
                continue;
            }
            // Check if this path matches any pattern
            const matches = patterns.some((pattern)=>matchesPattern(relativePath, pattern));
            if (matches) {
                results.push(relativePath);
            }
            // Recurse into directories
            if (entry.isDirectory() && currentDepth < maxDepth) {
                const subResults = walkDirectory(fs, fullPath, patterns, options, currentDepth + 1);
                results.push(...subResults);
            }
        }
    } catch (err) {
    // Skip directories we can't read
    }
    return results;
}
/**
 * Main glob implementation
 */ function globSync(fs, pattern, options = {}) {
    const cwd = options.cwd ? (0, util_1.pathToFilename)(options.cwd) : process.cwd();
    const resolvedCwd = pathResolve(cwd);
    const globOptions = {
        cwd: resolvedCwd,
        exclude: options.exclude,
        maxdepth: options.maxdepth,
        withFileTypes: options.withFileTypes || false
    };
    let results = [];
    // Handle absolute patterns
    if (path_1.posix.isAbsolute(pattern)) {
        const dir = path_1.posix.dirname(pattern);
        const patternBasename = path_1.posix.basename(pattern);
        const dirResults = walkDirectory(fs, dir, [
            patternBasename
        ], {
            ...globOptions,
            cwd: dir
        });
        results.push(...dirResults.map((r)=>path_1.posix.resolve(dir, r)));
    } else {
        // Handle relative patterns
        const dirResults = walkDirectory(fs, resolvedCwd, [
            pattern
        ], globOptions);
        results.push(...dirResults);
    }
    // Remove duplicates and sort
    results = [
        ...new Set(results)
    ].sort();
    return results;
} //# sourceMappingURL=glob.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/volume.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FSWatcher = exports.StatWatcher = exports.Volume = void 0;
exports.pathToSteps = pathToSteps;
exports.dataToStr = dataToStr;
exports.toUnixTimestamp = toUnixTimestamp;
const path_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/path.js [app-route] (ecmascript)");
const core_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/index.js [app-route] (ecmascript)");
const Stats_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/Stats.js [app-route] (ecmascript)");
const Dirent_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/Dirent.js [app-route] (ecmascript)");
const StatFs_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/StatFs.js [app-route] (ecmascript)");
const buffer_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/buffer.js [app-route] (ecmascript)");
const queueMicrotask_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/queueMicrotask.js [app-route] (ecmascript)");
const setTimeoutUnref_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/setTimeoutUnref.js [app-route] (ecmascript)");
const stream_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/stream.js [app-route] (ecmascript)");
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
const events_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/events.js [app-route] (ecmascript)");
const encoding_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/encoding.js [app-route] (ecmascript)");
const FileHandle_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/FileHandle.js [app-route] (ecmascript)");
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/util.js [app-route] (ecmascript)");
const FsPromises_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/FsPromises.js [app-route] (ecmascript)");
const print_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/print/index.js [app-route] (ecmascript)");
const constants_2 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/constants.js [app-route] (ecmascript)");
const errors = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/vendor/node/internal/errors.js [app-route] (ecmascript)");
const options_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/options.js [app-route] (ecmascript)");
const util_2 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/util.js [app-route] (ecmascript)");
const Dir_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/Dir.js [app-route] (ecmascript)");
const util_3 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/core/util.js [app-route] (ecmascript)");
const resolveCrossPlatform = path_1.resolve;
const { O_SYMLINK, F_OK, R_OK, W_OK, X_OK, COPYFILE_EXCL, COPYFILE_FICLONE_FORCE } = constants_1.constants;
const pathSep = path_1.posix ? path_1.posix.sep : path_1.sep;
const pathRelative = path_1.posix ? path_1.posix.relative : path_1.relative;
const pathJoin = path_1.posix ? path_1.posix.join : path_1.join;
const pathDirname = path_1.posix ? path_1.posix.dirname : path_1.dirname;
const pathNormalize = path_1.posix ? path_1.posix.normalize : path_1.normalize;
// ---------------------------------------- Constants
const kMinPoolSpace = 128;
// ---------------------------------------- Utility functions
function pathToSteps(path) {
    return (0, util_3.filenameToSteps)((0, util_2.pathToFilename)(path));
}
function dataToStr(data, encoding = encoding_1.ENCODING_UTF8) {
    if (buffer_1.Buffer.isBuffer(data)) return data.toString(encoding);
    else if (data instanceof Uint8Array) return (0, buffer_1.bufferFrom)(data).toString(encoding);
    else return String(data);
}
// converts Date or number to a fractional UNIX timestamp
function toUnixTimestamp(time) {
    // tslint:disable-next-line triple-equals
    if (typeof time === 'string' && +time == time) {
        return +time;
    }
    if (time instanceof Date) {
        return time.getTime() / 1000;
    }
    if (isFinite(time)) {
        if (time < 0) {
            return Date.now() / 1000;
        }
        return time;
    }
    throw new Error('Cannot parse time: ' + time);
}
function validateUid(uid) {
    if (typeof uid !== 'number') throw TypeError(constants_2.ERRSTR.UID);
}
function validateGid(gid) {
    if (typeof gid !== 'number') throw TypeError(constants_2.ERRSTR.GID);
}
/**
 * `Volume` represents a file system.
 */ class Volume {
    get promises() {
        if (this.promisesApi === null) throw new Error('Promise is not supported in this environment.');
        return this.promisesApi;
    }
    constructor(_core = new core_1.Superblock()){
        this._core = _core;
        this.promisesApi = new FsPromises_1.FsPromises(this, FileHandle_1.FileHandle);
        this.openSync = (path, flags, mode = 438 /* MODE.DEFAULT */ )=>{
            // Validate (1) mode; (2) path; (3) flags - in that order.
            const modeNum = (0, util_2.modeToNumber)(mode);
            const fileName = (0, util_2.pathToFilename)(path);
            const flagsNum = (0, util_2.flagsToNumber)(flags);
            return this._core.open(fileName, flagsNum, modeNum, !(flagsNum & O_SYMLINK));
        };
        this.open = (path, flags, a, b)=>{
            let mode = a;
            let callback = b;
            if (typeof a === 'function') {
                mode = 438 /* MODE.DEFAULT */ ;
                callback = a;
            }
            mode = mode || 438 /* MODE.DEFAULT */ ;
            const modeNum = (0, util_2.modeToNumber)(mode);
            const fileName = (0, util_2.pathToFilename)(path);
            const flagsNum = (0, util_2.flagsToNumber)(flags);
            this.wrapAsync(this._core.open, [
                fileName,
                flagsNum,
                modeNum,
                !(flagsNum & O_SYMLINK)
            ], callback);
        };
        this.closeSync = (fd)=>{
            this._core.close(fd);
        };
        this.close = (fd, callback)=>{
            (0, util_3.validateFd)(fd);
            const file = this._core.getFileByFdOrThrow(fd, 'close');
            this.wrapAsync(this._core.close, [
                file.fd
            ], callback);
        };
        this.readSync = (fd, buffer, offset, length, position)=>{
            (0, util_3.validateFd)(fd);
            return this._core.read(fd, buffer, offset, length, position);
        };
        this.read = (fd, buffer, offset, length, position, callback)=>{
            (0, util_2.validateCallback)(callback);
            if (length === 0) {
                // This `if` branch is from Node.js
                return (0, queueMicrotask_1.default)(()=>{
                    if (callback) callback(null, 0, buffer);
                });
            }
            Promise.resolve().then(()=>{
                try {
                    const bytes = this._core.read(fd, buffer, offset, length, position);
                    callback(null, bytes, buffer);
                } catch (err) {
                    callback(err);
                }
            });
        };
        this.readv = (fd, buffers, a, b)=>{
            let position = a;
            let callback = b;
            if (typeof a === 'function') [position, callback] = [
                null,
                a
            ];
            (0, util_2.validateCallback)(callback);
            Promise.resolve().then(()=>{
                try {
                    const bytes = this._core.readv(fd, buffers, position);
                    callback(null, bytes, buffers);
                } catch (err) {
                    callback(err);
                }
            });
        };
        this.readvSync = (fd, buffers, position)=>{
            (0, util_3.validateFd)(fd);
            return this._core.readv(fd, buffers, position ?? null);
        };
        this._readfile = (id, flagsNum, encoding)=>{
            let result;
            const isUserFd = typeof id === 'number';
            const userOwnsFd = isUserFd && (0, util_3.isFd)(id);
            let fd;
            if (userOwnsFd) fd = id;
            else {
                const filename = (0, util_2.pathToFilename)(id);
                // Check if original path had trailing slash (indicates directory intent)
                const originalPath = String(id);
                const hasTrailingSlash = originalPath.length > 1 && originalPath.endsWith('/');
                const link = this._core.getResolvedLinkOrThrow(filename, 'open');
                const node = link.getNode();
                if (node.isDirectory()) throw (0, util_2.createError)("EISDIR" /* ERROR_CODE.EISDIR */ , 'open', link.getPath());
                // If path had trailing slash but resolved to a file, throw ENOTDIR
                if (hasTrailingSlash && node.isFile()) {
                    throw (0, util_2.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , 'open', originalPath);
                }
                fd = this.openSync(id, flagsNum);
            }
            try {
                result = (0, util_2.bufferToEncoding)(this._core.getFileByFdOrThrow(fd).getBuffer(), encoding);
            } finally{
                if (!userOwnsFd) {
                    this.closeSync(fd);
                }
            }
            return result;
        };
        this.readFileSync = (file, options)=>{
            const opts = (0, options_1.getReadFileOptions)(options);
            const flagsNum = (0, util_2.flagsToNumber)(opts.flag);
            return this._readfile(file, flagsNum, opts.encoding);
        };
        this.readFile = (id, a, b)=>{
            const [opts, callback] = (0, options_1.optsAndCbGenerator)(options_1.getReadFileOptions)(a, b);
            const flagsNum = (0, util_2.flagsToNumber)(opts.flag);
            this.wrapAsync(this._readfile, [
                id,
                flagsNum,
                opts.encoding
            ], callback);
        };
        this.writeSync = (fd, a, b, c, d)=>{
            const [, buf, offset, length, position] = (0, util_2.getWriteSyncArgs)(fd, a, b, c, d);
            return this._write(fd, buf, offset, length, position);
        };
        this.write = (fd, a, b, c, d, e)=>{
            const [, asStr, buf, offset, length, position, cb] = (0, util_2.getWriteArgs)(fd, a, b, c, d, e);
            Promise.resolve().then(()=>{
                try {
                    const bytes = this._write(fd, buf, offset, length, position);
                    if (!asStr) {
                        cb(null, bytes, buf);
                    } else {
                        cb(null, bytes, a);
                    }
                } catch (err) {
                    cb(err);
                }
            });
        };
        this.writev = (fd, buffers, a, b)=>{
            let position = a;
            let callback = b;
            if (typeof a === 'function') [position, callback] = [
                null,
                a
            ];
            (0, util_2.validateCallback)(callback);
            Promise.resolve().then(()=>{
                try {
                    const bytes = this.writevBase(fd, buffers, position);
                    callback(null, bytes, buffers);
                } catch (err) {
                    callback(err);
                }
            });
        };
        this.writevSync = (fd, buffers, position)=>{
            (0, util_3.validateFd)(fd);
            return this.writevBase(fd, buffers, position ?? null);
        };
        this.writeFileSync = (id, data, options)=>{
            const opts = (0, options_1.getWriteFileOptions)(options);
            const flagsNum = (0, util_2.flagsToNumber)(opts.flag);
            const modeNum = (0, util_2.modeToNumber)(opts.mode);
            const buf = (0, util_3.dataToBuffer)(data, opts.encoding);
            this._core.writeFile(id, buf, flagsNum, modeNum);
        };
        this.writeFile = (id, data, a, b)=>{
            let options = a;
            let callback = b;
            if (typeof a === 'function') [options, callback] = [
                options_1.writeFileDefaults,
                a
            ];
            const cb = (0, util_2.validateCallback)(callback);
            const opts = (0, options_1.getWriteFileOptions)(options);
            const flagsNum = (0, util_2.flagsToNumber)(opts.flag);
            const modeNum = (0, util_2.modeToNumber)(opts.mode);
            const buf = (0, util_3.dataToBuffer)(data, opts.encoding);
            this.wrapAsync(this._core.writeFile, [
                id,
                buf,
                flagsNum,
                modeNum
            ], cb);
        };
        this.copyFileSync = (src, dest, flags)=>{
            const srcFilename = (0, util_2.pathToFilename)(src);
            const destFilename = (0, util_2.pathToFilename)(dest);
            return this._copyFile(srcFilename, destFilename, (flags || 0) | 0);
        };
        this.copyFile = (src, dest, a, b)=>{
            const srcFilename = (0, util_2.pathToFilename)(src);
            const destFilename = (0, util_2.pathToFilename)(dest);
            let flags;
            let callback;
            if (typeof a === 'function') [flags, callback] = [
                0,
                a
            ];
            else [flags, callback] = [
                a,
                b
            ];
            (0, util_2.validateCallback)(callback);
            this.wrapAsync(this._copyFile, [
                srcFilename,
                destFilename,
                flags
            ], callback);
        };
        this._cp = (src, dest, options)=>{
            if (options.filter && !options.filter(src, dest)) return;
            const srcStat = options.dereference ? this.statSync(src) : this.lstatSync(src);
            let destStat = null;
            try {
                destStat = this.lstatSync(dest);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
            // Check if src and dest are the same (both exist and have same inode)
            if (destStat && srcStat.ino === destStat.ino && srcStat.dev === destStat.dev) throw (0, util_2.createError)("EINVAL" /* ERROR_CODE.EINVAL */ , 'cp', src, dest);
            // Check type compatibility
            if (destStat) {
                if (srcStat.isDirectory() && !destStat.isDirectory()) throw (0, util_2.createError)("EISDIR" /* ERROR_CODE.EISDIR */ , 'cp', src, dest);
                if (!srcStat.isDirectory() && destStat.isDirectory()) throw (0, util_2.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , 'cp', src, dest);
            }
            // Check if trying to copy directory to subdirectory of itself
            if (srcStat.isDirectory() && this.isSrcSubdir(src, dest)) throw (0, util_2.createError)("EINVAL" /* ERROR_CODE.EINVAL */ , 'cp', src, dest);
            ENDURE_PARENT_DIR_EXISTS: {
                const parent = pathDirname(dest);
                if (!this.existsSync(parent)) this.mkdirSync(parent, {
                    recursive: true
                });
            }
            // Handle different file types
            if (srcStat.isDirectory()) {
                if (!options.recursive) throw (0, util_2.createError)("EISDIR" /* ERROR_CODE.EISDIR */ , 'cp', src);
                this.cpDirSync(srcStat, destStat, src, dest, options);
            } else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) {
                this.cpFileSync(srcStat, destStat, src, dest, options);
            } else if (srcStat.isSymbolicLink() && !options.dereference) {
                // Only handle as symlink if not dereferencing
                this.cpSymlinkSync(destStat, src, dest, options);
            } else {
                throw (0, util_2.createError)("EINVAL" /* ERROR_CODE.EINVAL */ , 'cp', src);
            }
        };
        this.linkSync = (existingPath, newPath)=>{
            const existingPathFilename = (0, util_2.pathToFilename)(existingPath);
            const newPathFilename = (0, util_2.pathToFilename)(newPath);
            this._core.link(existingPathFilename, newPathFilename);
        };
        this.link = (existingPath, newPath, callback)=>{
            const existingPathFilename = (0, util_2.pathToFilename)(existingPath);
            const newPathFilename = (0, util_2.pathToFilename)(newPath);
            this.wrapAsync(this._core.link, [
                existingPathFilename,
                newPathFilename
            ], callback);
        };
        this.unlinkSync = (path)=>{
            const filename = (0, util_2.pathToFilename)(path);
            this._core.unlink(filename);
        };
        this.unlink = (path, callback)=>{
            const filename = (0, util_2.pathToFilename)(path);
            this.wrapAsync(this._core.unlink, [
                filename
            ], callback);
        };
        /**
         * `type` argument works only on Windows.
         * @param target
         * @param path
         * @param type
         */ this.symlinkSync = (target, path, type)=>{
            const targetFilename = (0, util_2.pathToFilename)(target);
            const pathFilename = (0, util_2.pathToFilename)(path);
            this._core.symlink(targetFilename, pathFilename);
        };
        this.symlink = (target, path, a, b)=>{
            const callback = (0, util_2.validateCallback)(typeof a === 'function' ? a : b);
            const targetFilename = (0, util_2.pathToFilename)(target);
            const pathFilename = (0, util_2.pathToFilename)(path);
            this.wrapAsync(this._core.symlink, [
                targetFilename,
                pathFilename
            ], callback);
        };
        this._lstat = (filename, bigint = false, throwIfNoEntry = false)=>{
            let link;
            try {
                link = this._core.getLinkOrThrow(filename, 'lstat');
            } catch (err) {
                if (err.code === "ENOENT" /* ERROR_CODE.ENOENT */  && !throwIfNoEntry) return undefined;
                else throw err;
            }
            return Stats_1.default.build(link.getNode(), bigint);
        };
        this.lstatSync = (path, options)=>{
            const { throwIfNoEntry = true, bigint = false } = (0, options_1.getStatOptions)(options);
            return this._lstat((0, util_2.pathToFilename)(path), bigint, throwIfNoEntry);
        };
        this.renameSync = (oldPath, newPath)=>{
            const oldPathFilename = (0, util_2.pathToFilename)(oldPath);
            const newPathFilename = (0, util_2.pathToFilename)(newPath);
            this._core.rename(oldPathFilename, newPathFilename);
        };
        this.rename = (oldPath, newPath, callback)=>{
            const oldPathFilename = (0, util_2.pathToFilename)(oldPath);
            const newPathFilename = (0, util_2.pathToFilename)(newPath);
            this.wrapAsync(this._core.rename, [
                oldPathFilename,
                newPathFilename
            ], callback);
        };
        this.existsSync = (path)=>{
            try {
                return this._exists((0, util_2.pathToFilename)(path));
            } catch (err) {
                return false;
            }
        };
        this.exists = (path, callback)=>{
            const filename = (0, util_2.pathToFilename)(path);
            if (typeof callback !== 'function') throw Error(constants_2.ERRSTR.CB);
            Promise.resolve().then(()=>{
                try {
                    callback(this._exists(filename));
                } catch (err) {
                    callback(false);
                }
            });
        };
        this.accessSync = (path, mode = F_OK)=>{
            const filename = (0, util_2.pathToFilename)(path);
            mode = mode | 0;
            this._access(filename, mode);
        };
        this.access = (path, a, b)=>{
            let mode = F_OK;
            let callback;
            if (typeof a !== 'function') [mode, callback] = [
                a | 0,
                (0, util_2.validateCallback)(b)
            ];
            else callback = a;
            const filename = (0, util_2.pathToFilename)(path);
            this.wrapAsync(this._access, [
                filename,
                mode
            ], callback);
        };
        this.appendFileSync = (id, data, options)=>{
            const opts = (0, options_1.getAppendFileOpts)(options);
            // Force append behavior when using a supplied file descriptor.
            if (!opts.flag || (0, util_3.isFd)(id)) opts.flag = 'a';
            this.writeFileSync(id, data, opts);
        };
        this.appendFile = (id, data, a, b)=>{
            const [opts, callback] = (0, options_1.getAppendFileOptsAndCb)(a, b);
            // Force append behavior when using a supplied file descriptor.
            if (!opts.flag || (0, util_3.isFd)(id)) opts.flag = 'a';
            this.writeFile(id, data, opts, callback);
        };
        this._readdir = (filename, options)=>{
            const steps = (0, util_3.filenameToSteps)(filename);
            const link = this._core.getResolvedLinkOrThrow(filename, 'scandir');
            const node = link.getNode();
            if (!node.isDirectory()) throw (0, util_2.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , 'scandir', filename);
            // Check we have permissions
            if (!node.canRead()) throw (0, util_2.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'scandir', filename);
            const list = []; // output list
            for (const name of link.children.keys()){
                const child = link.getChild(name);
                if (!child || name === '.' || name === '..') continue;
                list.push(Dirent_1.default.build(child, options.encoding));
                // recursion
                if (options.recursive && child.children.size) {
                    const recurseOptions = {
                        ...options,
                        recursive: true,
                        withFileTypes: true
                    };
                    const childList = this._readdir(child.getPath(), recurseOptions);
                    list.push(...childList);
                }
            }
            if (!util_3.isWin && options.encoding !== 'buffer') list.sort((a, b)=>{
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            if (options.withFileTypes) return list;
            let filename2 = filename;
            if (util_3.isWin) filename2 = filename2.replace(/\\/g, '/');
            return list.map((dirent)=>{
                if (options.recursive) {
                    let fullPath = pathJoin(dirent.parentPath, dirent.name.toString());
                    if (util_3.isWin) {
                        fullPath = fullPath.replace(/\\/g, '/');
                    }
                    return fullPath.replace(filename2 + path_1.posix.sep, '');
                }
                return dirent.name;
            });
        };
        this.readdirSync = (path, options)=>{
            const opts = (0, options_1.getReaddirOptions)(options);
            const filename = (0, util_2.pathToFilename)(path);
            return this._readdir(filename, opts);
        };
        this.readdir = (path, a, b)=>{
            const [options, callback] = (0, options_1.getReaddirOptsAndCb)(a, b);
            const filename = (0, util_2.pathToFilename)(path);
            this.wrapAsync(this._readdir, [
                filename,
                options
            ], callback);
        };
        this._readlink = (filename, encoding)=>{
            const link = this._core.getLinkOrThrow(filename, 'readlink');
            const node = link.getNode();
            if (!node.isSymlink()) throw (0, util_2.createError)("EINVAL" /* ERROR_CODE.EINVAL */ , 'readlink', filename);
            return (0, encoding_1.strToEncoding)(node.symlink, encoding);
        };
        this.readlinkSync = (path, options)=>{
            const opts = (0, options_1.getDefaultOpts)(options);
            const filename = (0, util_2.pathToFilename)(path);
            return this._readlink(filename, opts.encoding);
        };
        this.readlink = (path, a, b)=>{
            const [opts, callback] = (0, options_1.getDefaultOptsAndCb)(a, b);
            const filename = (0, util_2.pathToFilename)(path);
            this.wrapAsync(this._readlink, [
                filename,
                opts.encoding
            ], callback);
        };
        this._fsync = (fd)=>{
            this._core.getFileByFdOrThrow(fd, 'fsync');
        };
        this.fsyncSync = (fd)=>{
            this._fsync(fd);
        };
        this.fsync = (fd, callback)=>{
            this.wrapAsync(this._fsync, [
                fd
            ], callback);
        };
        this._fdatasync = (fd)=>{
            this._core.getFileByFdOrThrow(fd, 'fdatasync');
        };
        this.fdatasyncSync = (fd)=>{
            this._fdatasync(fd);
        };
        this.fdatasync = (fd, callback)=>{
            this.wrapAsync(this._fdatasync, [
                fd
            ], callback);
        };
        this._ftruncate = (fd, len)=>{
            const file = this._core.getFileByFdOrThrow(fd, 'ftruncate');
            file.truncate(len);
        };
        this.ftruncateSync = (fd, len)=>{
            this._ftruncate(fd, len);
        };
        this.ftruncate = (fd, a, b)=>{
            const len = typeof a === 'number' ? a : 0;
            const callback = (0, util_2.validateCallback)(typeof a === 'number' ? b : a);
            this.wrapAsync(this._ftruncate, [
                fd,
                len
            ], callback);
        };
        this._truncate = (path, len)=>{
            const fd = this.openSync(path, 'r+');
            try {
                this.ftruncateSync(fd, len);
            } finally{
                this.closeSync(fd);
            }
        };
        /**
         * `id` should be a file descriptor or a path. `id` as file descriptor will
         * not be supported soon.
         */ this.truncateSync = (id, len)=>{
            if ((0, util_3.isFd)(id)) return this.ftruncateSync(id, len);
            this._truncate(id, len);
        };
        this.truncate = (id, a, b)=>{
            const len = typeof a === 'number' ? a : 0;
            const callback = (0, util_2.validateCallback)(typeof a === 'number' ? b : a);
            if ((0, util_3.isFd)(id)) return this.ftruncate(id, len, callback);
            this.wrapAsync(this._truncate, [
                id,
                len
            ], callback);
        };
        this._futimes = (fd, atime, mtime)=>{
            const file = this._core.getFileByFdOrThrow(fd, 'futimes');
            const node = file.node;
            node.atime = new Date(atime * 1000);
            node.mtime = new Date(mtime * 1000);
        };
        this.futimesSync = (fd, atime, mtime)=>{
            this._futimes(fd, toUnixTimestamp(atime), toUnixTimestamp(mtime));
        };
        this.futimes = (fd, atime, mtime, callback)=>{
            this.wrapAsync(this._futimes, [
                fd,
                toUnixTimestamp(atime),
                toUnixTimestamp(mtime)
            ], callback);
        };
        this._utimes = (filename, atime, mtime, followSymlinks = true)=>{
            const core = this._core;
            const link = followSymlinks ? core.getResolvedLinkOrThrow(filename, 'utimes') : core.getLinkOrThrow(filename, 'lutimes');
            const node = link.getNode();
            node.atime = new Date(atime * 1000);
            node.mtime = new Date(mtime * 1000);
        };
        this.utimesSync = (path, atime, mtime)=>{
            this._utimes((0, util_2.pathToFilename)(path), toUnixTimestamp(atime), toUnixTimestamp(mtime), true);
        };
        this.utimes = (path, atime, mtime, callback)=>{
            this.wrapAsync(this._utimes, [
                (0, util_2.pathToFilename)(path),
                toUnixTimestamp(atime),
                toUnixTimestamp(mtime),
                true
            ], callback);
        };
        this.lutimesSync = (path, atime, mtime)=>{
            this._utimes((0, util_2.pathToFilename)(path), toUnixTimestamp(atime), toUnixTimestamp(mtime), false);
        };
        this.lutimes = (path, atime, mtime, callback)=>{
            this.wrapAsync(this._utimes, [
                (0, util_2.pathToFilename)(path),
                toUnixTimestamp(atime),
                toUnixTimestamp(mtime),
                false
            ], callback);
        };
        this.mkdirSync = (path, options)=>{
            const opts = (0, options_1.getMkdirOptions)(options);
            const modeNum = (0, util_2.modeToNumber)(opts.mode, 0o777);
            const filename = (0, util_2.pathToFilename)(path);
            if (opts.recursive) return this._core.mkdirp(filename, modeNum);
            this._core.mkdir(filename, modeNum);
        };
        this.mkdir = (path, a, b)=>{
            const opts = (0, options_1.getMkdirOptions)(a);
            const callback = (0, util_2.validateCallback)(typeof a === 'function' ? a : b);
            const modeNum = (0, util_2.modeToNumber)(opts.mode, 0o777);
            const filename = (0, util_2.pathToFilename)(path);
            if (opts.recursive) this.wrapAsync(this._core.mkdirp, [
                filename,
                modeNum
            ], callback);
            else this.wrapAsync(this._core.mkdir, [
                filename,
                modeNum
            ], callback);
        };
        this._mkdtemp = (prefix, encoding, retry = 5)=>{
            const filename = prefix + (0, util_2.genRndStr6)();
            try {
                this._core.mkdir(filename, 511 /* MODE.DIR */ );
                return (0, encoding_1.strToEncoding)(filename, encoding);
            } catch (err) {
                if (err.code === "EEXIST" /* ERROR_CODE.EEXIST */ ) {
                    if (retry > 1) return this._mkdtemp(prefix, encoding, retry - 1);
                    else throw Error('Could not create temp dir.');
                } else throw err;
            }
        };
        this.mkdtempSync = (prefix, options)=>{
            const { encoding } = (0, options_1.getDefaultOpts)(options);
            if (!prefix || typeof prefix !== 'string') throw new TypeError('filename prefix is required');
            (0, util_2.nullCheck)(prefix);
            return this._mkdtemp(prefix, encoding);
        };
        this.mkdtemp = (prefix, a, b)=>{
            const [{ encoding }, callback] = (0, options_1.getDefaultOptsAndCb)(a, b);
            if (!prefix || typeof prefix !== 'string') throw new TypeError('filename prefix is required');
            if (!(0, util_2.nullCheck)(prefix)) return;
            this.wrapAsync(this._mkdtemp, [
                prefix,
                encoding
            ], callback);
        };
        this.rmdirSync = (path, options)=>{
            const opts = (0, options_1.getRmdirOptions)(options);
            this._core.rmdir((0, util_2.pathToFilename)(path), opts.recursive);
        };
        this.rmdir = (path, a, b)=>{
            const opts = (0, options_1.getRmdirOptions)(a);
            const callback = (0, util_2.validateCallback)(typeof a === 'function' ? a : b);
            this.wrapAsync(this._core.rmdir, [
                (0, util_2.pathToFilename)(path),
                opts.recursive
            ], callback);
        };
        this.rmSync = (path, options)=>{
            this._core.rm((0, util_2.pathToFilename)(path), options?.force, options?.recursive);
        };
        this.rm = (path, a, b)=>{
            const [opts, callback] = (0, options_1.getRmOptsAndCb)(a, b);
            this.wrapAsync(this._core.rm, [
                (0, util_2.pathToFilename)(path),
                opts?.force,
                opts?.recursive
            ], callback);
        };
        this._fchmod = (fd, modeNum)=>{
            const file = this._core.getFileByFdOrThrow(fd, 'fchmod');
            file.chmod(modeNum);
        };
        this.fchmodSync = (fd, mode)=>{
            this._fchmod(fd, (0, util_2.modeToNumber)(mode));
        };
        this.fchmod = (fd, mode, callback)=>{
            this.wrapAsync(this._fchmod, [
                fd,
                (0, util_2.modeToNumber)(mode)
            ], callback);
        };
        this._chmod = (filename, modeNum, followSymlinks = true)=>{
            const link = followSymlinks ? this._core.getResolvedLinkOrThrow(filename, 'chmod') : this._core.getLinkOrThrow(filename, 'chmod');
            const node = link.getNode();
            node.chmod(modeNum);
        };
        this.chmodSync = (path, mode)=>{
            const modeNum = (0, util_2.modeToNumber)(mode);
            const filename = (0, util_2.pathToFilename)(path);
            this._chmod(filename, modeNum, true);
        };
        this.chmod = (path, mode, callback)=>{
            const modeNum = (0, util_2.modeToNumber)(mode);
            const filename = (0, util_2.pathToFilename)(path);
            this.wrapAsync(this._chmod, [
                filename,
                modeNum
            ], callback);
        };
        this._lchmod = (filename, modeNum)=>{
            this._chmod(filename, modeNum, false);
        };
        this.lchmodSync = (path, mode)=>{
            const modeNum = (0, util_2.modeToNumber)(mode);
            const filename = (0, util_2.pathToFilename)(path);
            this._lchmod(filename, modeNum);
        };
        this.lchmod = (path, mode, callback)=>{
            const modeNum = (0, util_2.modeToNumber)(mode);
            const filename = (0, util_2.pathToFilename)(path);
            this.wrapAsync(this._lchmod, [
                filename,
                modeNum
            ], callback);
        };
        this._fchown = (fd, uid, gid)=>{
            this._core.getFileByFdOrThrow(fd, 'fchown').chown(uid, gid);
        };
        this.fchownSync = (fd, uid, gid)=>{
            validateUid(uid);
            validateGid(gid);
            this._fchown(fd, uid, gid);
        };
        this.fchown = (fd, uid, gid, callback)=>{
            validateUid(uid);
            validateGid(gid);
            this.wrapAsync(this._fchown, [
                fd,
                uid,
                gid
            ], callback);
        };
        this._chown = (filename, uid, gid)=>{
            const link = this._core.getResolvedLinkOrThrow(filename, 'chown');
            const node = link.getNode();
            node.chown(uid, gid);
        };
        this.chownSync = (path, uid, gid)=>{
            validateUid(uid);
            validateGid(gid);
            this._chown((0, util_2.pathToFilename)(path), uid, gid);
        };
        this.chown = (path, uid, gid, callback)=>{
            validateUid(uid);
            validateGid(gid);
            this.wrapAsync(this._chown, [
                (0, util_2.pathToFilename)(path),
                uid,
                gid
            ], callback);
        };
        this._lchown = (filename, uid, gid)=>{
            this._core.getLinkOrThrow(filename, 'lchown').getNode().chown(uid, gid);
        };
        this.lchownSync = (path, uid, gid)=>{
            validateUid(uid);
            validateGid(gid);
            this._lchown((0, util_2.pathToFilename)(path), uid, gid);
        };
        this.lchown = (path, uid, gid, callback)=>{
            validateUid(uid);
            validateGid(gid);
            this.wrapAsync(this._lchown, [
                (0, util_2.pathToFilename)(path),
                uid,
                gid
            ], callback);
        };
        this.statWatchers = {};
        this.cpSync = (src, dest, options)=>{
            const srcFilename = (0, util_2.pathToFilename)(src);
            const destFilename = (0, util_2.pathToFilename)(dest);
            const opts_ = {
                dereference: options?.dereference ?? false,
                errorOnExist: options?.errorOnExist ?? false,
                filter: options?.filter,
                force: options?.force ?? true,
                mode: options?.mode ?? 0,
                preserveTimestamps: options?.preserveTimestamps ?? false,
                recursive: options?.recursive ?? false,
                verbatimSymlinks: options?.verbatimSymlinks ?? false
            };
            return this._cp(srcFilename, destFilename, opts_);
        };
        this.cp = (src, dest, a, b)=>{
            const srcFilename = (0, util_2.pathToFilename)(src);
            const destFilename = (0, util_2.pathToFilename)(dest);
            let options;
            let callback;
            if (typeof a === 'function') [options, callback] = [
                {},
                a
            ];
            else [options, callback] = [
                a || {},
                b
            ];
            (0, util_2.validateCallback)(callback);
            const opts_ = {
                dereference: options?.dereference ?? false,
                errorOnExist: options?.errorOnExist ?? false,
                filter: options?.filter,
                force: options?.force ?? true,
                mode: options?.mode ?? 0,
                preserveTimestamps: options?.preserveTimestamps ?? false,
                recursive: options?.recursive ?? false,
                verbatimSymlinks: options?.verbatimSymlinks ?? false
            };
            this.wrapAsync(this._cp, [
                srcFilename,
                destFilename,
                opts_
            ], callback);
        };
        this.openAsBlob = async (path, options)=>{
            const filename = (0, util_2.pathToFilename)(path);
            let link;
            try {
                link = this._core.getResolvedLinkOrThrow(filename, 'open');
            } catch (error) {
                // Convert ENOENT to Node.js-compatible error for openAsBlob
                if (error && typeof error === 'object' && error.code === 'ENOENT') {
                    const nodeError = new errors.TypeError('ERR_INVALID_ARG_VALUE');
                    throw nodeError;
                }
                throw error;
            }
            const node = link.getNode();
            // Note: Node.js allows opening directories as blobs, so we don't throw EISDIR
            const buffer = node.getBuffer();
            const type = options?.type || '';
            return new Blob([
                buffer
            ], {
                type
            });
        };
        this.glob = (pattern, ...args)=>{
            const [options, callback] = args.length === 1 ? [
                {},
                args[0]
            ] : [
                args[0],
                args[1]
            ];
            this.wrapAsync(this._globSync, [
                pattern,
                options || {}
            ], callback);
        };
        this.globSync = (pattern, options = {})=>{
            return this._globSync(pattern, options);
        };
        this._globSync = (pattern, options = {})=>{
            const { globSync } = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/glob.js [app-route] (ecmascript)");
            return globSync(this, pattern, options);
        };
        this._opendir = (filename, options)=>{
            const link = this._core.getResolvedLinkOrThrow(filename, 'scandir');
            const node = link.getNode();
            if (!node.isDirectory()) throw (0, util_2.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */ , 'scandir', filename);
            return new Dir_1.Dir(link, options);
        };
        this.opendirSync = (path, options)=>{
            const opts = (0, options_1.getOpendirOptions)(options);
            const filename = (0, util_2.pathToFilename)(path);
            return this._opendir(filename, opts);
        };
        this.opendir = (path, a, b)=>{
            const [options, callback] = (0, options_1.getOpendirOptsAndCb)(a, b);
            const filename = (0, util_2.pathToFilename)(path);
            this.wrapAsync(this._opendir, [
                filename,
                options
            ], callback);
        };
        const self = this; // tslint:disable-line no-this-assignment
        this.StatWatcher = class extends StatWatcher {
            constructor(){
                super(self);
            }
        };
        const _ReadStream = FsReadStream;
        this.ReadStream = class extends _ReadStream {
            constructor(...args){
                super(self, ...args);
            }
        };
        const _WriteStream = FsWriteStream;
        this.WriteStream = class extends _WriteStream {
            constructor(...args){
                super(self, ...args);
            }
        };
        this.FSWatcher = class extends FSWatcher {
            constructor(){
                super(self);
            }
        };
        const _realpath = (filename, encoding)=>{
            const realLink = this._core.getResolvedLinkOrThrow(filename, 'realpath');
            return (0, encoding_1.strToEncoding)(realLink.getPath() || '/', encoding);
        };
        const realpathImpl = (path, a, b)=>{
            const [opts, callback] = (0, options_1.getRealpathOptsAndCb)(a, b);
            const pathFilename = (0, util_2.pathToFilename)(path);
            self.wrapAsync(_realpath, [
                pathFilename,
                opts.encoding
            ], callback);
        };
        const realpathSyncImpl = (path, options)=>_realpath((0, util_2.pathToFilename)(path), (0, options_1.getRealpathOptions)(options).encoding);
        this.realpath = realpathImpl;
        this.realpath.native = realpathImpl;
        this.realpathSync = realpathSyncImpl;
        this.realpathSync.native = realpathSyncImpl;
    }
    wrapAsync(method, args, callback) {
        (0, util_2.validateCallback)(callback);
        Promise.resolve().then(()=>{
            let result;
            try {
                result = method.apply(this, args);
            } catch (err) {
                callback(err);
                return;
            }
            callback(null, result);
        });
    }
    toTree(opts = {
        separator: path_1.sep
    }) {
        return (0, print_1.toTreeSync)(this, opts);
    }
    reset() {
        this._core.reset();
    }
    toJSON(paths, json = {}, isRelative = false, asBuffer = false) {
        return this._core.toJSON(paths, json, isRelative, asBuffer);
    }
    fromJSON(json, cwd) {
        return this._core.fromJSON(json, cwd);
    }
    fromNestedJSON(json, cwd) {
        return this._core.fromNestedJSON(json, cwd);
    }
    // Legacy interface
    mountSync(mountpoint, json) {
        this._core.fromJSON(json, mountpoint);
    }
    _write(fd, buf, offset, length, position) {
        const file = this._core.getFileByFdOrThrow(fd, 'write');
        if (file.node.isSymlink()) {
            throw (0, util_2.createError)("EBADF" /* ERROR_CODE.EBADF */ , 'write', file.link.getPath());
        }
        return file.write(buf, offset, length, position === -1 || typeof position !== 'number' ? undefined : position);
    }
    writevBase(fd, buffers, position) {
        const file = this._core.getFileByFdOrThrow(fd);
        let p = position ?? undefined;
        if (p === -1) {
            p = undefined;
        }
        let bytesWritten = 0;
        for (const buffer of buffers){
            const nodeBuf = buffer_1.Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
            const bytes = file.write(nodeBuf, 0, nodeBuf.byteLength, p);
            p = undefined;
            bytesWritten += bytes;
            if (bytes < nodeBuf.byteLength) break;
        }
        return bytesWritten;
    }
    _copyFile(src, dest, flags) {
        const buf = this.readFileSync(src);
        if (flags & COPYFILE_EXCL && this.existsSync(dest)) throw (0, util_2.createError)("EEXIST" /* ERROR_CODE.EEXIST */ , 'copyFile', src, dest);
        if (flags & COPYFILE_FICLONE_FORCE) throw (0, util_2.createError)("ENOSYS" /* ERROR_CODE.ENOSYS */ , 'copyFile', src, dest);
        this._core.writeFile(dest, buf, constants_2.FLAGS.w, 438 /* MODE.DEFAULT */ );
    }
    isSrcSubdir(src, dest) {
        try {
            const normalizedSrc = pathNormalize(src.startsWith('/') ? src : '/' + src);
            const normalizedDest = pathNormalize(dest.startsWith('/') ? dest : '/' + dest);
            if (normalizedSrc === normalizedDest) return true;
            // Check if dest is under src by using relative path
            // If dest is under src, the relative path from src to dest won't start with '..'
            const relativePath = pathRelative(normalizedSrc, normalizedDest);
            // If relative path is empty or doesn't start with '..', dest is under src
            return relativePath === '' || !relativePath.startsWith('..') && !(0, path_1.isAbsolute)(relativePath);
        } catch (error) {
            // If path operations fail, assume it's safe (don't block the copy)
            return false;
        }
    }
    cpFileSync(srcStat, destStat, src, dest, options) {
        if (destStat) {
            if (options.errorOnExist) throw (0, util_2.createError)("EEXIST" /* ERROR_CODE.EEXIST */ , 'cp', dest);
            if (!options.force) return;
            this.unlinkSync(dest);
        }
        // Copy the file
        this.copyFileSync(src, dest, options.mode);
        // Preserve timestamps if requested
        if (options.preserveTimestamps) this.utimesSync(dest, srcStat.atime, srcStat.mtime);
        // Set file mode
        this.chmodSync(dest, Number(srcStat.mode));
    }
    cpDirSync(srcStat, destStat, src, dest, options) {
        if (!destStat) {
            this.mkdirSync(dest);
        }
        // Read directory contents
        const entries = this.readdirSync(src);
        for (const entry of entries){
            const srcItem = pathJoin(src, String(entry));
            const destItem = pathJoin(dest, String(entry));
            // Apply filter to each item
            if (options.filter && !options.filter(srcItem, destItem)) {
                continue;
            }
            this._cp(srcItem, destItem, options);
        }
        // Set directory mode
        this.chmodSync(dest, Number(srcStat.mode));
    }
    cpSymlinkSync(destStat, src, dest, options) {
        let linkTarget = String(this.readlinkSync(src));
        if (!options.verbatimSymlinks && !(0, path_1.isAbsolute)(linkTarget)) linkTarget = resolveCrossPlatform(pathDirname(src), linkTarget);
        if (destStat) this.unlinkSync(dest);
        this.symlinkSync(linkTarget, dest);
    }
    lstat(path, a, b) {
        const [{ throwIfNoEntry = true, bigint = false }, callback] = (0, options_1.getStatOptsAndCb)(a, b);
        this.wrapAsync(this._lstat, [
            (0, util_2.pathToFilename)(path),
            bigint,
            throwIfNoEntry
        ], callback);
    }
    _stat(filename, bigint = false, throwIfNoEntry = true) {
        let link;
        try {
            link = this._core.getResolvedLinkOrThrow(filename, 'stat');
        } catch (err) {
            if (err.code === "ENOENT" /* ERROR_CODE.ENOENT */  && !throwIfNoEntry) return undefined;
            else throw err;
        }
        return Stats_1.default.build(link.getNode(), bigint);
    }
    statSync(path, options) {
        const { bigint = true, throwIfNoEntry = true } = (0, options_1.getStatOptions)(options);
        return this._stat((0, util_2.pathToFilename)(path), bigint, throwIfNoEntry);
    }
    stat(path, a, b) {
        const [{ bigint = false, throwIfNoEntry = true }, callback] = (0, options_1.getStatOptsAndCb)(a, b);
        this.wrapAsync(this._stat, [
            (0, util_2.pathToFilename)(path),
            bigint,
            throwIfNoEntry
        ], callback);
    }
    fstatBase(fd, bigint = false) {
        const file = this._core.getFileByFd(fd);
        if (!file) throw (0, util_2.createError)("EBADF" /* ERROR_CODE.EBADF */ , 'fstat');
        return Stats_1.default.build(file.node, bigint);
    }
    fstatSync(fd, options) {
        return this.fstatBase(fd, (0, options_1.getStatOptions)(options).bigint);
    }
    fstat(fd, a, b) {
        const [opts, callback] = (0, options_1.getStatOptsAndCb)(a, b);
        this.wrapAsync(this.fstatBase, [
            fd,
            opts.bigint
        ], callback);
    }
    _exists(filename) {
        return !!this._stat(filename);
    }
    _access(filename, mode) {
        const link = this._core.getLinkOrThrow(filename, 'access');
        const node = link.getNode();
        // F_OK (0) just checks for existence, which we already confirmed above
        if (mode === F_OK) {
            return;
        }
        // Check read permission
        if (mode & R_OK && !node.canRead()) {
            throw (0, util_2.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'access', filename);
        }
        // Check write permission
        if (mode & W_OK && !node.canWrite()) {
            throw (0, util_2.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'access', filename);
        }
        // Check execute permission
        if (mode & X_OK && !node.canExecute()) {
            throw (0, util_2.createError)("EACCES" /* ERROR_CODE.EACCES */ , 'access', filename);
        }
    }
    watchFile(path, a, b) {
        const filename = (0, util_2.pathToFilename)(path);
        let options = a;
        let listener = b;
        if (typeof options === 'function') {
            listener = a;
            options = null;
        }
        if (typeof listener !== 'function') {
            throw Error('"watchFile()" requires a listener function');
        }
        let interval = 5007;
        let persistent = true;
        if (options && typeof options === 'object') {
            if (typeof options.interval === 'number') interval = options.interval;
            if (typeof options.persistent === 'boolean') persistent = options.persistent;
        }
        let watcher = this.statWatchers[filename];
        if (!watcher) {
            watcher = new this.StatWatcher();
            watcher.start(filename, persistent, interval);
            this.statWatchers[filename] = watcher;
        }
        watcher.addListener('change', listener);
        return watcher;
    }
    unwatchFile(path, listener) {
        const filename = (0, util_2.pathToFilename)(path);
        const watcher = this.statWatchers[filename];
        if (!watcher) return;
        if (typeof listener === 'function') {
            watcher.removeListener('change', listener);
        } else {
            watcher.removeAllListeners('change');
        }
        if (watcher.listenerCount('change') === 0) {
            watcher.stop();
            delete this.statWatchers[filename];
        }
    }
    createReadStream(path, options) {
        return new this.ReadStream(path, options);
    }
    createWriteStream(path, options) {
        return new this.WriteStream(path, options);
    }
    // watch(path: PathLike): FSWatcher;
    // watch(path: PathLike, options?: IWatchOptions | string): FSWatcher;
    watch(path, options, listener) {
        const filename = (0, util_2.pathToFilename)(path);
        let givenOptions = options;
        if (typeof options === 'function') {
            listener = options;
            givenOptions = null;
        }
        // tslint:disable-next-line prefer-const
        let { persistent, recursive, encoding } = (0, options_1.getDefaultOpts)(givenOptions);
        if (persistent === undefined) persistent = true;
        if (recursive === undefined) recursive = false;
        const watcher = new this.FSWatcher();
        watcher.start(filename, persistent, recursive, encoding);
        if (listener) {
            watcher.addListener('change', listener);
        }
        return watcher;
    }
    _statfs(filename, bigint = false) {
        // Verify the path exists to match Node.js behavior
        this._core.getResolvedLinkOrThrow(filename, 'statfs');
        return StatFs_1.default.build(this._core, bigint);
    }
    statfsSync(path, options) {
        const { bigint = false } = (0, options_1.getStatfsOptions)(options);
        return this._statfs((0, util_2.pathToFilename)(path), bigint);
    }
    statfs(path, a, b) {
        const [{ bigint = false }, callback] = (0, options_1.getStatfsOptsAndCb)(a, b);
        this.wrapAsync(this._statfs, [
            (0, util_2.pathToFilename)(path),
            bigint
        ], callback);
    }
}
exports.Volume = Volume;
Volume.fromJSON = (json, cwd)=>new Volume(core_1.Superblock.fromJSON(json, cwd));
Volume.fromNestedJSON = (json, cwd)=>new Volume(core_1.Superblock.fromNestedJSON(json, cwd));
function emitStop(self) {
    self.emit('stop');
}
class StatWatcher extends events_1.EventEmitter {
    constructor(vol){
        super();
        this.onInterval = ()=>{
            try {
                const stats = this.vol.statSync(this.filename);
                if (this.hasChanged(stats)) {
                    this.emit('change', stats, this.prev);
                    this.prev = stats;
                }
            } finally{
                this.loop();
            }
        };
        this.vol = vol;
    }
    loop() {
        this.timeoutRef = this.setTimeout(this.onInterval, this.interval);
    }
    hasChanged(stats) {
        // if(!this.prev) return false;
        if (stats.mtimeMs > this.prev.mtimeMs) return true;
        if (stats.nlink !== this.prev.nlink) return true;
        return false;
    }
    start(path, persistent = true, interval = 5007) {
        this.filename = (0, util_2.pathToFilename)(path);
        this.setTimeout = persistent ? setTimeout.bind(typeof globalThis !== 'undefined' ? globalThis : /*TURBOPACK member replacement*/ __turbopack_context__.g) : setTimeoutUnref_1.default;
        this.interval = interval;
        this.prev = this.vol.statSync(this.filename);
        this.loop();
    }
    stop() {
        clearTimeout(this.timeoutRef);
        (0, queueMicrotask_1.default)(()=>{
            emitStop.call(this, this);
        });
    }
}
exports.StatWatcher = StatWatcher;
/* tslint:disable no-var-keyword prefer-const */ // ---------------------------------------- ReadStream
var pool;
function allocNewPool(poolSize) {
    pool = (0, buffer_1.bufferAllocUnsafe)(poolSize);
    pool.used = 0;
}
(0, util_1.inherits)(FsReadStream, stream_1.Readable);
exports.ReadStream = FsReadStream;
function FsReadStream(vol, path, options) {
    if (!(this instanceof FsReadStream)) return new FsReadStream(vol, path, options);
    this._vol = vol;
    // a little bit bigger buffer and water marks by default
    options = Object.assign({}, (0, options_1.getOptions)(options, {}));
    if (options.highWaterMark === undefined) options.highWaterMark = 64 * 1024;
    stream_1.Readable.call(this, options);
    this.path = (0, util_2.pathToFilename)(path);
    this.fd = options.fd === undefined ? null : typeof options.fd !== 'number' ? options.fd.fd : options.fd;
    this.flags = options.flags === undefined ? 'r' : options.flags;
    this.mode = options.mode === undefined ? 0o666 : options.mode;
    this.start = options.start;
    this.end = options.end;
    this.autoClose = options.autoClose === undefined ? true : options.autoClose;
    this.pos = undefined;
    this.bytesRead = 0;
    if (this.start !== undefined) {
        if (typeof this.start !== 'number') {
            throw new TypeError('"start" option must be a Number');
        }
        if (this.end === undefined) {
            this.end = Infinity;
        } else if (typeof this.end !== 'number') {
            throw new TypeError('"end" option must be a Number');
        }
        if (this.start > this.end) {
            throw new Error('"start" option must be <= "end" option');
        }
        this.pos = this.start;
    }
    if (typeof this.fd !== 'number') this.open();
    this.on('end', function() {
        if (this.autoClose) {
            if (this.destroy) this.destroy();
        }
    });
}
FsReadStream.prototype.open = function() {
    var self = this; // tslint:disable-line no-this-assignment
    this._vol.open(this.path, this.flags, this.mode, (er, fd)=>{
        if (er) {
            if (self.autoClose) {
                if (self.destroy) self.destroy();
            }
            self.emit('error', er);
            return;
        }
        self.fd = fd;
        self.emit('open', fd);
        // start the flow of data.
        self.read();
    });
};
FsReadStream.prototype._read = function(n) {
    if (typeof this.fd !== 'number') {
        return this.once('open', function() {
            this._read(n);
        });
    }
    if (this.destroyed) return;
    if (!pool || pool.length - pool.used < kMinPoolSpace) {
        // discard the old pool.
        allocNewPool(this._readableState.highWaterMark);
    }
    // Grab another reference to the pool in the case that while we're
    // in the thread pool another read() finishes up the pool, and
    // allocates a new one.
    var thisPool = pool;
    var toRead = Math.min(pool.length - pool.used, n);
    var start = pool.used;
    if (this.pos !== undefined) toRead = Math.min(this.end - this.pos + 1, toRead);
    // already read everything we were supposed to read!
    // treat as EOF.
    if (toRead <= 0) return this.push(null);
    // the actual read.
    var self = this; // tslint:disable-line no-this-assignment
    this._vol.read(this.fd, pool, pool.used, toRead, this.pos, onread);
    // move the pool positions, and internal position for reading.
    if (this.pos !== undefined) this.pos += toRead;
    pool.used += toRead;
    function onread(er, bytesRead) {
        if (er) {
            if (self.autoClose && self.destroy) {
                self.destroy();
            }
            self.emit('error', er);
        } else {
            var b = null;
            if (bytesRead > 0) {
                self.bytesRead += bytesRead;
                b = thisPool.slice(start, start + bytesRead);
            }
            self.push(b);
        }
    }
};
FsReadStream.prototype._destroy = function(err, cb) {
    this.close((err2)=>{
        cb(err || err2);
    });
};
FsReadStream.prototype.close = function(cb) {
    if (cb) this.once('close', cb);
    if (this.closed || typeof this.fd !== 'number') {
        if (typeof this.fd !== 'number') {
            this.once('open', closeOnOpen);
            return;
        }
        return (0, queueMicrotask_1.default)(()=>this.emit('close'));
    }
    // Since Node 18, there is only a getter for '.closed'.
    // The first branch mimics other setters from Readable.
    // See https://github.com/nodejs/node/blob/v18.0.0/lib/internal/streams/readable.js#L1243
    if (typeof this._readableState?.closed === 'boolean') {
        this._readableState.closed = true;
    } else {
        this.closed = true;
    }
    this._vol.close(this.fd, (er)=>{
        if (er) this.emit('error', er);
        else this.emit('close');
    });
    this.fd = null;
};
// needed because as it will be called with arguments
// that does not match this.close() signature
function closeOnOpen(fd) {
    this.close();
}
(0, util_1.inherits)(FsWriteStream, stream_1.Writable);
exports.WriteStream = FsWriteStream;
function FsWriteStream(vol, path, options) {
    if (!(this instanceof FsWriteStream)) return new FsWriteStream(vol, path, options);
    this._vol = vol;
    options = Object.assign({}, (0, options_1.getOptions)(options, {}));
    stream_1.Writable.call(this, options);
    this.path = (0, util_2.pathToFilename)(path);
    this.fd = options.fd === undefined ? null : typeof options.fd !== 'number' ? options.fd.fd : options.fd;
    this.flags = options.flags === undefined ? 'w' : options.flags;
    this.mode = options.mode === undefined ? 0o666 : options.mode;
    this.start = options.start;
    this.autoClose = options.autoClose === undefined ? true : !!options.autoClose;
    this.pos = undefined;
    this.bytesWritten = 0;
    this.pending = true;
    if (this.start !== undefined) {
        if (typeof this.start !== 'number') {
            throw new TypeError('"start" option must be a Number');
        }
        if (this.start < 0) {
            throw new Error('"start" must be >= zero');
        }
        this.pos = this.start;
    }
    if (options.encoding) this.setDefaultEncoding(options.encoding);
    if (typeof this.fd !== 'number') this.open();
    // dispose on finish.
    this.once('finish', function() {
        if (this.autoClose) {
            this.close();
        }
    });
}
FsWriteStream.prototype.open = function() {
    this._vol.open(this.path, this.flags, this.mode, (function(er, fd) {
        if (er) {
            if (this.autoClose && this.destroy) {
                this.destroy();
            }
            this.emit('error', er);
            return;
        }
        this.fd = fd;
        this.pending = false;
        this.emit('open', fd);
    }).bind(this));
};
FsWriteStream.prototype._write = function(data, encoding, cb) {
    if (!(data instanceof buffer_1.Buffer || data instanceof Uint8Array)) return this.emit('error', new Error('Invalid data'));
    if (typeof this.fd !== 'number') {
        return this.once('open', function() {
            this._write(data, encoding, cb);
        });
    }
    var self = this; // tslint:disable-line no-this-assignment
    this._vol.write(this.fd, data, 0, data.length, this.pos, (er, bytes)=>{
        if (er) {
            if (self.autoClose && self.destroy) {
                self.destroy();
            }
            return cb(er);
        }
        self.bytesWritten += bytes;
        cb();
    });
    if (this.pos !== undefined) this.pos += data.length;
};
FsWriteStream.prototype._writev = function(data, cb) {
    if (typeof this.fd !== 'number') {
        return this.once('open', function() {
            this._writev(data, cb);
        });
    }
    const self = this; // tslint:disable-line no-this-assignment
    const len = data.length;
    const chunks = new Array(len);
    var size = 0;
    for(var i = 0; i < len; i++){
        var chunk = data[i].chunk;
        chunks[i] = chunk;
        size += chunk.length;
    }
    const buf = buffer_1.Buffer.concat(chunks);
    this._vol.write(this.fd, buf, 0, buf.length, this.pos, (er, bytes)=>{
        if (er) {
            if (self.destroy) self.destroy();
            return cb(er);
        }
        self.bytesWritten += bytes;
        cb();
    });
    if (this.pos !== undefined) this.pos += size;
};
FsWriteStream.prototype.close = function(cb) {
    if (cb) this.once('close', cb);
    if (this.closed || typeof this.fd !== 'number') {
        if (typeof this.fd !== 'number') {
            this.once('open', closeOnOpen);
            return;
        }
        return (0, queueMicrotask_1.default)(()=>this.emit('close'));
    }
    // Since Node 18, there is only a getter for '.closed'.
    // The first branch mimics other setters from Writable.
    // See https://github.com/nodejs/node/blob/v18.0.0/lib/internal/streams/writable.js#L766
    if (typeof this._writableState?.closed === 'boolean') {
        this._writableState.closed = true;
    } else {
        this.closed = true;
    }
    this._vol.close(this.fd, (er)=>{
        if (er) this.emit('error', er);
        else this.emit('close');
    });
    this.fd = null;
};
FsWriteStream.prototype._destroy = FsReadStream.prototype._destroy;
// There is no shutdown() for files.
FsWriteStream.prototype.destroySoon = FsWriteStream.prototype.end;
// ---------------------------------------- FSWatcher
class FSWatcher extends events_1.EventEmitter {
    constructor(vol){
        super();
        this._filename = '';
        this._filenameEncoded = '';
        // _persistent: boolean = true;
        this._recursive = false;
        this._encoding = encoding_1.ENCODING_UTF8;
        // inode -> removers
        this._listenerRemovers = new Map();
        this._onParentChild = (link)=>{
            if (link.getName() === this._getName()) {
                this._emit('rename');
            }
        };
        this._emit = (type)=>{
            this.emit('change', type, this._filenameEncoded);
        };
        this._persist = ()=>{
            this._timer = setTimeout(this._persist, 1e6);
        };
        this._vol = vol;
    // TODO: Emit "error" messages when watching.
    // this._handle.onchange = function(status, eventType, filename) {
    //     if (status < 0) {
    //         self._handle.close();
    //         const error = !filename ?
    //             errnoException(status, 'Error watching file for changes:') :
    //             errnoException(status, `Error watching file ${filename} for changes:`);
    //         error.filename = filename;
    //         self.emit('error', error);
    //     } else {
    //         self.emit('change', eventType, filename);
    //     }
    // };
    }
    _getName() {
        return this._steps[this._steps.length - 1];
    }
    start(path, persistent = true, recursive = false, encoding = encoding_1.ENCODING_UTF8) {
        this._filename = (0, util_2.pathToFilename)(path);
        this._steps = (0, util_3.filenameToSteps)(this._filename);
        this._filenameEncoded = (0, encoding_1.strToEncoding)(this._filename);
        // this._persistent = persistent;
        this._recursive = recursive;
        this._encoding = encoding;
        try {
            this._link = this._vol._core.getLinkOrThrow(this._filename, 'FSWatcher');
        } catch (err) {
            const error = new Error(`watch ${this._filename} ${err.code}`);
            error.code = err.code;
            error.errno = err.code;
            throw error;
        }
        const watchLinkNodeChanged = (link)=>{
            const filepath = link.getPath();
            const node = link.getNode();
            const onNodeChange = ()=>{
                let filename = pathRelative(this._filename, filepath);
                if (!filename) filename = this._getName();
                return this.emit('change', 'change', filename);
            };
            const unsub = node.changes.listen(([type])=>{
                if (type === 'modify') onNodeChange();
            });
            const removers = this._listenerRemovers.get(node.ino) ?? [];
            removers.push(()=>unsub());
            this._listenerRemovers.set(node.ino, removers);
        };
        const watchLinkChildrenChanged = (link)=>{
            const node = link.getNode();
            // when a new link added
            const onLinkChildAdd = (l)=>{
                this.emit('change', 'rename', pathRelative(this._filename, l.getPath()));
                // 1. watch changes of the new link-node
                watchLinkNodeChanged(l);
                // 2. watch changes of the new link-node's children
                watchLinkChildrenChanged(l);
            };
            // when a new link deleted
            const onLinkChildDelete = (l)=>{
                // remove the listeners of the children nodes
                const removeLinkNodeListeners = (curLink)=>{
                    const ino = curLink.getNode().ino;
                    const removers = this._listenerRemovers.get(ino);
                    if (removers) {
                        removers.forEach((r)=>r());
                        this._listenerRemovers.delete(ino);
                    }
                    for (const [name, childLink] of curLink.children.entries()){
                        if (childLink && name !== '.' && name !== '..') {
                            removeLinkNodeListeners(childLink);
                        }
                    }
                };
                removeLinkNodeListeners(l);
                this.emit('change', 'rename', pathRelative(this._filename, l.getPath()));
            };
            // children nodes changed
            for (const [name, childLink] of link.children.entries()){
                if (childLink && name !== '.' && name !== '..') {
                    watchLinkNodeChanged(childLink);
                }
            }
            // link children add/remove
            const unsubscribeLinkChanges = link.changes.listen(([type, link])=>{
                if (type === 'child:add') onLinkChildAdd(link);
                else if (type === 'child:del') onLinkChildDelete(link);
            });
            const removers = this._listenerRemovers.get(node.ino) ?? [];
            removers.push(()=>{
                unsubscribeLinkChanges();
            });
            if (recursive) {
                for (const [name, childLink] of link.children.entries()){
                    if (childLink && name !== '.' && name !== '..') {
                        watchLinkChildrenChanged(childLink);
                    }
                }
            }
        };
        watchLinkNodeChanged(this._link);
        watchLinkChildrenChanged(this._link);
        const parent = this._link.parent;
        if (parent) {
            // parent.on('child:delete', this._onParentChild);
            parent.changes.listen(([type, link])=>{
                if (type === 'child:del') this._onParentChild(link);
            });
        }
        if (persistent) this._persist();
    }
    close() {
        clearTimeout(this._timer);
        this._listenerRemovers.forEach((removers)=>{
            removers.forEach((r)=>r());
        });
        this._listenerRemovers.clear();
        this._parentChangesUnsub?.();
    }
}
exports.FSWatcher = FSWatcher; //# sourceMappingURL=volume.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/lists/fsSynchronousApiList.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fsSynchronousApiList = void 0;
exports.fsSynchronousApiList = [
    'accessSync',
    'appendFileSync',
    'chmodSync',
    'chownSync',
    'closeSync',
    'copyFileSync',
    'existsSync',
    'fchmodSync',
    'fchownSync',
    'fdatasyncSync',
    'fstatSync',
    'fsyncSync',
    'ftruncateSync',
    'futimesSync',
    'lchmodSync',
    'lchownSync',
    'linkSync',
    'lstatSync',
    'mkdirSync',
    'mkdtempSync',
    'openSync',
    'opendirSync',
    'readdirSync',
    'readFileSync',
    'readlinkSync',
    'readSync',
    'readvSync',
    'realpathSync',
    'renameSync',
    'rmdirSync',
    'rmSync',
    'statSync',
    'symlinkSync',
    'truncateSync',
    'unlinkSync',
    'utimesSync',
    'lutimesSync',
    'writeFileSync',
    'writeSync',
    'writevSync'
]; //# sourceMappingURL=fsSynchronousApiList.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/lists/fsCallbackApiList.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fsCallbackApiList = void 0;
exports.fsCallbackApiList = [
    'access',
    'appendFile',
    'chmod',
    'chown',
    'close',
    'copyFile',
    'cp',
    'createReadStream',
    'createWriteStream',
    'exists',
    'fchmod',
    'fchown',
    'fdatasync',
    'fstat',
    'fsync',
    'ftruncate',
    'futimes',
    'lchmod',
    'lchown',
    'link',
    'lstat',
    'mkdir',
    'mkdtemp',
    'open',
    'openAsBlob',
    'opendir',
    'read',
    'readv',
    'readdir',
    'readFile',
    'readlink',
    'realpath',
    'rename',
    'rm',
    'rmdir',
    'stat',
    'statfs',
    'symlink',
    'truncate',
    'unlink',
    'unwatchFile',
    'utimes',
    'lutimes',
    'watch',
    'watchFile',
    'write',
    'writev',
    'writeFile'
]; //# sourceMappingURL=fsCallbackApiList.js.map
}),
"[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.memfs = exports.fs = exports.vol = exports.Volume = void 0;
exports.createFsFromVolume = createFsFromVolume;
const Stats_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/Stats.js [app-route] (ecmascript)");
const Dirent_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/Dirent.js [app-route] (ecmascript)");
const volume_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/volume.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Volume", {
    enumerable: true,
    get: function() {
        return volume_1.Volume;
    }
});
const constants_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/constants.js [app-route] (ecmascript)");
const fsSynchronousApiList_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/lists/fsSynchronousApiList.js [app-route] (ecmascript)");
const fsCallbackApiList_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/memfs@4.49.0/node_modules/memfs/lib/node/lists/fsCallbackApiList.js [app-route] (ecmascript)");
const { F_OK, R_OK, W_OK, X_OK } = constants_1.constants;
// Default volume.
exports.vol = new volume_1.Volume();
function createFsFromVolume(vol) {
    const fs = {
        F_OK,
        R_OK,
        W_OK,
        X_OK,
        constants: constants_1.constants,
        Stats: Stats_1.default,
        Dirent: Dirent_1.default
    };
    // Bind FS methods.
    for (const method of fsSynchronousApiList_1.fsSynchronousApiList)if (typeof vol[method] === 'function') fs[method] = vol[method].bind(vol);
    for (const method of fsCallbackApiList_1.fsCallbackApiList)if (typeof vol[method] === 'function') fs[method] = vol[method].bind(vol);
    fs.StatWatcher = vol.StatWatcher;
    fs.FSWatcher = vol.FSWatcher;
    fs.WriteStream = vol.WriteStream;
    fs.ReadStream = vol.ReadStream;
    fs.promises = vol.promises;
    // Handle realpath and realpathSync with their .native properties
    if (typeof vol.realpath === 'function') {
        fs.realpath = vol.realpath.bind(vol);
        if (typeof vol.realpath.native === 'function') {
            fs.realpath.native = vol.realpath.native.bind(vol);
        }
    }
    if (typeof vol.realpathSync === 'function') {
        fs.realpathSync = vol.realpathSync.bind(vol);
        if (typeof vol.realpathSync.native === 'function') {
            fs.realpathSync.native = vol.realpathSync.native.bind(vol);
        }
    }
    fs._toUnixTimestamp = volume_1.toUnixTimestamp;
    fs.__vol = vol;
    return fs;
}
exports.fs = createFsFromVolume(exports.vol);
/**
 * Creates a new file system instance.
 *
 * @param json File system structure expressed as a JSON object.
 *        Use `null` for empty directories and empty string for empty files.
 * @param cwd Current working directory. The JSON structure will be created
 *        relative to this path.
 * @returns A `memfs` file system instance, which is a drop-in replacement for
 *          the `fs` module.
 */ const memfs = (json = {}, cwd = '/')=>{
    const vol = volume_1.Volume.fromNestedJSON(json, cwd);
    const fs = createFsFromVolume(vol);
    return {
        fs,
        vol
    };
};
exports.memfs = memfs;
module.exports = {
    ...module.exports,
    ...exports.fs
};
module.exports.semantic = true; //# sourceMappingURL=index.js.map
}),
];

//# sourceMappingURL=7c49f_memfs_lib_a07f7a6b._.js.map