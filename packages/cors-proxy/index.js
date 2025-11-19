import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Writable } from 'stream';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import forge from 'node-forge';

// Load environment variables
config();

const origin = process.env.ALLOW_ORIGIN || '*';
const insecure_origins = (process.env.INSECURE_HTTP_ORIGINS || '').split(',');

const allowHeaders = [
  'accept-encoding',
  'accept-language',
  'accept',
  'access-control-allow-origin',
  'authorization',
  'cache-control',
  'connection',
  'content-length',
  'content-type',
  'dnt',
  'git-protocol',
  'pragma',
  'range',
  'referer',
  'user-agent',
  'x-authorization',
  'x-http-method-override',
  'x-requested-with',
];

const exposeHeaders = [
  'accept-ranges',
  'age',
  'cache-control',
  'content-length',
  'content-language',
  'content-type',
  'date',
  'etag',
  'expires',
  'last-modified',
  'location',
  'pragma',
  'server',
  'transfer-encoding',
  'vary',
  'x-github-request-id',
  'x-redirected-url',
];
const allowMethods = ['POST', 'GET', 'OPTIONS'];

const createTokenPassword = process.env.CREATE_TOKEN_PASSWORD;

if (!createTokenPassword) {
  throw new Error('CREATE_TOKEN_PASSWORD environment variable is not set');
}

// Parse RSA keys from environment variables
const accessKeyPrivate = process.env.ACCESS_KEY_PRIVATE?.replace(/\\n/g, '\n');
const proxyKeyPublic = process.env.PROXY_KEY_PUBLIC?.replace(/\\n/g, '\n');

if (!accessKeyPrivate || !proxyKeyPublic) {
  throw new Error('ACCESS_KEY_PRIVATE and PROXY_KEY_PUBLIC environment variables must be set');
}

// Parse the private key for JWT signing
const privateKeyForSigning = forge.pki.privateKeyFromPem(accessKeyPrivate);
const publicKeyForEncryption = forge.pki.publicKeyFromPem(proxyKeyPublic);

const maxAge = 60 * 60 * 24; // 24 hours
const allowCredentials = false;

const landingPage = readFileSync(join(import.meta.dirname, 'index.html'), 'utf8').replaceAll(
  '%allowed_origins%',
  origin,
);

const createTokenFormPage = readFileSync(join(import.meta.dirname, 'create-token-form.html'), 'utf8');

/**
 *
 * @param {import('http').IncomingMessage} req
 * @param {URL} u
 */
function isAllowed(req, u) {
  const isInfoRefs =
    u.pathname.endsWith('/info/refs') &&
    (u.searchParams.get('service') === 'git-upload-pack' || u.searchParams.get('service') === 'git-receive-pack');

  switch (req.method) {
    case 'OPTIONS':
      if (isInfoRefs) return true;
      if (!req.headers['access-control-request-headers'].includes('content-type')) return false;
      return u.pathname.endsWith('git-upload-pack') || u.pathname.endsWith('git-receive-pack');
    case 'POST':
      return (
        // pull
        (req.headers['content-type'] === 'application/x-git-upload-pack-request' &&
          u.pathname.endsWith('git-upload-pack')) ||
        // push
        (req.headers['content-type'] === 'application/x-git-receive-pack-request' &&
          u.pathname.endsWith('git-receive-pack'))
      );
    case 'GET':
      return isInfoRefs;
    default:
      return false;
  }
}

/**
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {(() => any)?} next
 * @returns
 */
export default function handleRequest(req, res, next) {
  const u = new URL(req.url, `https://0.0.0.0:${req.socket.localPort}/`);
  const isMiddleware = typeof next === 'function';

  // CORS

  res.setHeader('Access-Control-Allow-Origin', origin);
  if (allowCredentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (exposeHeaders.length) {
    res.setHeader('Access-Control-Expose-Headers', exposeHeaders.join(','));
  }

  const preFlight = req.method === 'OPTIONS';
  if (preFlight) {
    res.setHeader('Access-Control-Allow-Methods', allowMethods.join(','));
    res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(','));
    res.setHeader('Access-Control-Max-Age', String(maxAge));
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Default landing page
  if (u.pathname === '/') {
    if (isMiddleware) return next();
    res.setHeader('content-type', 'text/html');
    res.statusCode = 400;
    res.end(landingPage);
    return;
  }

  // Create token form page
  if (u.pathname === '/create-token-form') {
    if (isMiddleware) return next();
    res.setHeader('content-type', 'text/html');
    res.statusCode = 200;
    res.end(createTokenFormPage);
    return;
  }

  // Create token endpoint
  if (u.pathname === '/create-token' && req.method === 'POST') {
    if (isMiddleware) return next();

    // Check password
    const providedPassword = req.headers.authorization;

    if (providedPassword !== createTokenPassword) {
      res.statusCode = 401;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid password' }));
      return;
    }

    // Collect request body
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        const { githubToken, repoUrl, branchWildcards } = requestData;

        // Validate required fields
        if (!githubToken || !repoUrl || !branchWildcards) {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          res.end(
            JSON.stringify({
              error: 'Missing required fields: githubToken, repoUrl, branchWildcards',
            }),
          );
          return;
        }

        // Encrypt the GitHub token using RSA public key
        const encryptedToken = forge.util.encode64(publicKeyForEncryption.encrypt(githubToken, 'RSA-OAEP'));

        // Process branch wildcards into array
        const branchArray = Array.isArray(branchWildcards)
          ? branchWildcards
          : branchWildcards.split('\n').filter((branch) => branch.trim() !== '');

        // Create JWT payload
        const payload = {
          encryptedToken,
          repoUrl,
          branchWildcards: branchArray,
          // iat: Math.floor(Date.now() / 1000), // Issued at
          // exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expires in 24 hours
        };

        // Sign JWT with RSA private key
        const token = jwt.sign(payload, accessKeyPrivate, {
          algorithm: 'RS256',
          // expiresIn: '24h',
        });

        // Return the JWT
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.end(
          JSON.stringify({
            success: true,
            token,
            // expiresAt: new Date(payload.exp * 1000).toISOString(),
          }),
        );
      } catch (error) {
        console.error('Error creating token:', error);
        res.statusCode = 500;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ error: 'Failed to create token: ' + error.message }));
      }
    });

    return;
  }

  if (!isAllowed(req, u)) {
    if (isMiddleware) return next();
    res.statusCode = 403;
    res.end();
    return;
  }

  if (process.env.DEBUG) console.log(req.method, req.url);

  const headers = {};
  for (let h of allowHeaders) {
    if (req.headers[h]) {
      headers[h] = req.headers[h];
    }
  }

  // GitHub uses user-agent sniffing for git/* and changes its behavior which is frustrating
  if (!headers['user-agent']?.startsWith('git/')) {
    headers['user-agent'] = 'git/@isomorphic-git/cors-proxy';
  }

  let [, pathdomain, remainingpath] = u.pathname.match(/\/([^\/]*)\/(.*)/);
  const protocol = insecure_origins.includes(pathdomain) ? 'http' : 'https';

  fetch(`${protocol}://${pathdomain}/${remainingpath}${u.search}`, {
    method: req.method,
    redirect: 'manual',
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    duplex: 'half',
  })
    .then((f) => {
      if (f.headers.has('location')) {
        // Modify the location so the client continues to use the proxy
        let newUrl = f.headers.get('location').replace(/^https?:\//, '');
        f.headers.set('location', newUrl);
      }
      res.statusCode = f.status;
      for (let h of exposeHeaders) {
        if (h === 'content-length') continue;
        if (f.headers.has(h)) {
          res.setHeader(h, f.headers.get(h));
        }
      }
      if (f.redirected) {
        res.setHeader('x-redirected-url', f.url);
      }
      return f.body.pipeTo(Writable.toWeb(res));
    })
    .catch((e) => {
      console.error(e);
      if (isMiddleware) return next();
      res.statusCode = 502;
      res.end();
    });
}
