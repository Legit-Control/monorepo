declare module 'pako' {
  /**
   * Compress data using deflate
   */
  export function deflate(data: Uint8Array | Array<number>): Uint8Array;

  /**
   * Decompress data that was compressed with deflate
   */
  export function inflate(data: Uint8Array | Array<number>): Uint8Array;

  /**
   * Compress data using gzip
   */
  export function gzip(data: Uint8Array | Array<number>): Uint8Array;

  /**
   * Decompress data that was compressed with gzip
   */
  export function gunzip(data: Uint8Array | Array<number>): Uint8Array;
}
