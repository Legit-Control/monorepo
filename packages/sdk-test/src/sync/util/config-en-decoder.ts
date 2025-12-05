// Encode JSON to Base64URL
export function encodeConfigJson(obj: any): string {
  const json = JSON.stringify(obj);
  const uint8 = new TextEncoder().encode(json);
  let base64 = '';

  // Convert bytes to base64
  if (typeof btoa === 'function') {
    // Browser
    base64 = btoa(String.fromCharCode(...uint8));
  } else {
    // Node
    base64 = Buffer.from(uint8).toString('base64');
  }

  // Convert Base64 → Base64URL
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Decode Base64URL back into JSON
export function decodeConfigJson(encoded: string): any {
  // Convert Base64URL → Base64
  const base64 =
    encoded.replace(/-/g, '+').replace(/_/g, '/') +
    '==='.slice((encoded.length + 3) % 4);

  let binary: string;

  if (typeof atob === 'function') {
    // Browser
    binary = atob(base64);
  } else {
    // Node
    binary = Buffer.from(base64, 'base64').toString('binary');
  }

  // Convert binary string to Uint8Array
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);

  return JSON.parse(json);
}
