// Disallowed single characters in Git branch names
const INVALID_CHARS = new Set([' ', '~', '^', ':', '?', '*', '[', '\\']);

// Regex for disallowed sequences
const INVALID_SEQ = [
  /^\/|\/$/, // leading or trailing slash
  /\/\//, // double slash
  /\.$/, // trailing dot
  /\.lock$/, // trailing .lock
  /^@$/, // single @
  /@\{/, // @{ sequence
];

const EN_SPACE = '\u2002'; // U+2002 EN SPACE

function isValidChar(ch: string): boolean {
  const code = ch.codePointAt(0)!;
  // Control characters and DEL
  if ((code >= 0 && code <= 31) || code === 127) return false;
  if (INVALID_CHARS.has(ch)) return false;
  return true;
}

export function encodeName(text: string): string {
  let encoded = '';

  for (const ch of text) {
    if (ch === ' ') {
      encoded += EN_SPACE; // replace space with U+2002
    } else if (!isValidChar(ch)) {
      encoded += '%' + ch.codePointAt(0); // encode invalid char
    } else {
      encoded += ch;
    }
  }

  // If the whole string still matches an invalid *sequence*,
  // encode offending chars as %<code>
  for (const seq of INVALID_SEQ) {
    if (seq.test(encoded)) {
      return Array.from(encoded)
        .map(c => (isValidChar(c) ? c : '%' + c.codePointAt(0)))
        .join('');
    }
  }

  return encoded;
}

export function decodeName(branch: string): string {
  return (
    branch
      // decode %NNN sequences back to characters
      .replace(/%(\d+)/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
      // turn U+2002 back into a normal space
      .replace(new RegExp(EN_SPACE, 'g'), ' ')
  );
}

// VFS branch name encoding: slash → dot, existing dot → %2E
export function encodeBranchNameForVfs(branchName: string): string {
  return branchName
    .replace(/\./g, '%2E')  // encode existing dots first
    .replace(/\//g, '.');    // then replace slashes with dots
}

export function decodeBranchNameFromVfs(encodedName: string): string {
  return encodedName
    .replace(/\./g, '/')     // replace dots back to slashes
    .replace(/%2E/g, '.');   // decode %2E back to dots
}
