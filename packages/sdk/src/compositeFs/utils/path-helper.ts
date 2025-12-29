export function pathToString(p: string | Buffer | URL | Uint8Array): string {
  if (typeof p === 'string') return p;
  if (Buffer.isBuffer(p)) return p.toString();

  return String(p);
}
