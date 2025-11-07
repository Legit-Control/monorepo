import { RSAKeyManager } from '../../src/crypto/rsaKeyManager';
import { createTestJWT } from '../../src/proxy/authMiddleware';
import { TokenDecryptor } from '../../src/crypto/tokenDecryptor';

// Test RSA key pair for testing
export const testRSAKeyPair = RSAKeyManager.generateTestKeyPair();

// Sample encrypted tokens for testing
export function createTestTokens() {
  const rsaKeyManager = new RSAKeyManager(testRSAKeyPair);
  const tokenDecryptor = new TokenDecryptor(rsaKeyManager);

  // Valid GitHub token
  const validGithubToken = 'ghp_1234567890abcdef1234567890abcdef12345678';
  const encryptedGithubToken = tokenDecryptor.createTestToken(validGithubToken);
  const validGithubJWT = createTestJWT('test-user-123', encryptedGithubToken, rsaKeyManager);

  // Valid GitLab token (treated as generic token now)
  const validGitlabToken = 'glpat-1234567890abcdef1234567890';
  const encryptedGitlabToken = tokenDecryptor.createTestToken(validGitlabToken);
  const validGitlabJWT = createTestJWT('test-user-456', encryptedGitlabToken, rsaKeyManager);

  // Both tokens example (now just one token)
  const encryptedBothToken = tokenDecryptor.createTestToken(validGithubToken);
  const validBothJWT = createTestJWT('test-user-789', encryptedBothToken, rsaKeyManager);

  // Expired token (create with past expiration)
  const expiredToken = tokenDecryptor.createTestToken(validGithubToken);
  const expiredJWT = createTestJWT('test-user-expired', expiredToken, rsaKeyManager, '0s');

  return {
    validGithubToken,
    validGitlabToken,
    validGithubJWT,
    validGitlabJWT,
    validBothJWT,
    expiredJWT,
    encryptedGithubToken,
    encryptedGitlabToken,
    encryptedBothToken,
    rsaKeyManager,
    tokenDecryptor
  };
}

// Sample user permissions for testing
export const samplePermissions = {
  repositories: ['test-owner/test-repo', 'org/*'],
  branches: {
    'test-owner/test-repo': ['main', 'develop', 'feature/*', 'read:protected-branch'],
    'org/*': ['main', 'release/*']
  }
};

// Sample git requests for testing
export const sampleGitRequests = {
  infoRefs: {
    method: 'GET',
    url: '/test-owner/test-repo/git/info/refs?service=git-upload-pack',
    headers: {
      'user-agent': 'git/2.39.0',
      'accept': 'application/x-git-upload-pack-advertisement'
    }
  },
  uploadPack: {
    method: 'POST',
    url: '/test-owner/test-repo/git-upload-pack',
    headers: {
      'user-agent': 'git/2.39.0',
      'content-type': 'application/x-git-upload-pack-request'
    },
    body: Buffer.from('0032want 9594f89d094c5f7c0e42a6ad8377144ec2c8c4d9\n0000')
  },
  receivePack: {
    method: 'POST',
    url: '/test-owner/test-repo/git-receive-pack',
    headers: {
      'user-agent': 'git/2.39.0',
      'content-type': 'application/x-git-receive-pack-request'
    },
    body: Buffer.from('9594f89d094c5f7c0e42a6ad8377144ec2c8c4d9 refs/heads/main\x00report-status\n0000')
  }
};

// Mock GitHub API responses
export const mockGitHubResponses = {
  infoRefsUpload: Buffer.from('001e# service=git-upload-pack\n0000009594f89d094c5f7c0e42a6ad8377144ec2c8c4d9 refs/heads/main\n001a1a2b3c4d5e6f7890abcdef1234567890abcdef12 refs/heads/develop\n0000'),
  infoRefsReceive: Buffer.from('001f# service=git-receive-pack\n0000009594f89d094c5f7c0e42a6ad8377144ec2c8c4d9 refs/heads/main\n001a1a2b3c4d5e6f7890abcdef1234567890abcdef12 refs/heads/develop\n0000'),
  packfile: (() => {
    const packHeader = Buffer.from([0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03]);
    return Buffer.from(`0008NAK\nPACK${packHeader.toString('binary')}`);
  })(),
  packResponse: Buffer.from('000aunpack ok\n')
};

// Invalid tokens for error testing
export const invalidTokens = {
  noHeader: '',
  malformed: 'invalid.jwt.token',
  wrongSignature: createTestJWT('test-user', createTestTokens().encryptedGithubToken, new RSAKeyManager(testRSAKeyPair), '1h').replace(/.$/, 'X'), // Change last char
  missingPayload: createTestJWT('test-user', '', new RSAKeyManager(testRSAKeyPair), '1h'),
  invalidEncrypted: createTestJWT('test-user', 'invalid-encrypted-data', new RSAKeyManager(testRSAKeyPair), '1h')
};