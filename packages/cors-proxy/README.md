# @legit/cors-proxy

A JWT-authenticated CORS proxy for Git HTTP protocol with branch-level access control. This proxy enables browser-based Git operations by providing a secure intermediary that handles authentication and authorization.

## Features

- **Git HTTP Smart Protocol Support** - Full support for Git fetch and push operations
- **JWT Authentication** - RSA-based JWT validation with encrypted token payloads
- **Branch-Level Access Control** - Fine-grained permissions for specific branches and repositories
- **GitHub & GitLab Support** - Works with both GitHub and GitLab APIs
- **CORS Enabled** - Cross-origin requests for browser applications
- **Production Ready** - Docker support, health checks, and monitoring
- **Comprehensive Testing** - Full test suite with unit and integration tests

## Architecture

```
Client Application → JWT Token → CORS Proxy → GitHub/GitLab
                           ↓
                    RSA Decryption
                           ↓
                Branch Permission Check
                           ↓
                Forward to Git Service
```

## Quick Start

### Installation

```bash
pnpm add @legit/cors-proxy
```

### Basic Usage

```typescript
import { createCorsProxy } from '@legit/cors-proxy';

// Create the proxy server
const app = createCorsProxy({
  config: {
    port: 9999,
    accessServicePubKey: '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----',
    proxyServicePrivateKey: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----'
  }
});

// Start the server
app.listen(9999, () => {
  console.log('CORS proxy listening on port 9999');
});
```

### Docker Deployment

```bash
# Build the image
docker build -t legit-cors-proxy .

# Run with environment variables (new naming recommended)
docker run -p 9999:9999 \
  -e ACCESS_SERVICE_PUB_KEY="$(cat public.pem)" \
  -e PROXY_SERVICE_PRIVATE_KEY="$(cat private.pem)" \
  legit-cors-proxy

# Legacy naming still supported:
# docker run -p 9999:9999 \
#   -e RSA_PUBLIC_KEY="$(cat public.pem)" \
#   -e RSA_PRIVATE_KEY="$(cat private.pem)" \
#   legit-cors-proxy
```

### Docker Compose

```bash
# Production
docker-compose up cors-proxy

# Development
docker-compose --profile dev up cors-proxy-dev
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/production) | `development` | No |
| `PORT` | Server port | `9999` | No |
| `LOG_LEVEL` | Logging level (debug/info/warn/error) | `info` | No |
| `CORS_ORIGIN` | CORS origin(s) | `*` | No |
| `ACCESS_SERVICE_PUB_KEY` | Access service public key for JWT validation | - | Yes (production) |
| `PROXY_SERVICE_PRIVATE_KEY` | Proxy service private key for token decryption | - | Yes (production) |
| `RSA_PUBLIC_KEY` | Legacy: RSA public key (backward compatibility) | - | No |
| `RSA_PRIVATE_KEY` | Legacy: RSA private key (backward compatibility) | - | No |
| `JWT_ALGORITHM` | JWT signature algorithm | `RS256` | No |
| `GITHUB_API_URL` | GitHub API base URL | `https://api.github.com` | No |
| `GITLAB_API_URL` | GitLab API base URL | `https://gitlab.com` | No |

### Generating RSA Keys

```bash
# Generate private key
openssl genrsa -out private.pem 2048

# Extract public key
openssl rsa -in private.pem -pubout -out public.pem
```

## JWT Authentication

The proxy expects JWTs with the following structure:

```json
{
  "sub": "user-id",
  "iat": 1234567890,
  "exp": 1234567890,
  "encryptedToken": "RSA-encrypted-github-token",
  "permissions": {
    "repositories": ["owner/repo", "org/*"],
    "branches": {
      "owner/repo": ["main", "develop", "feature/*", "read:protected-branch"],
      "org/*": ["main", "release/*"]
    }
  }
}
```

### Token Flow

1. **Client**: Request JWT from auth server with GitHub/GitLab token
2. **Auth Server**: Encrypt Git token with RSA private key, create JWT
3. **Client**: Send JWT to CORS proxy in `Authorization: Bearer <jwt>` header
4. **Proxy**: Validate JWT signature, decrypt Git token, check permissions
5. **Proxy**: Forward request to GitHub/GitLab with decrypted token

## Branch Permissions

Branch patterns support:

- **Exact matches**: `main`, `develop`
- **Wildcards**: `feature/*`, `hotfix/*`
- **Read-only**: `read:protected-branch`
- **Write-only**: `write:deploy-branch`
- **Tags**: `v1.0.0`, `release/*`

## API Endpoints

### Health Check

```http
GET /health
```

Returns server status and configuration.

### Git Protocol

```http
GET /owner/repo/git/info/refs?service=git-upload-pack
POST /owner/repo/git-upload-pack
POST /owner/repo/git-receive-pack
```

Standard Git HTTP smart protocol endpoints.

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Start development server
pnpm dev
```

### Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test --watch
```

### Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### AWS Lambda

```bash
# Install Serverless Framework
npm i -g serverless

# Deploy
serverless deploy
```

### Docker

```bash
# Build and run
docker-compose up -d cors-proxy
```

## Security Considerations

- **RSA Keys**: Keep private keys secure and never commit to version control
- **JWT Expiration**: Set appropriate expiration times for JWTs
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Token Validation**: Always validate Git tokens before use
- **HTTPS**: Use HTTPS in production environments

## Monitoring

The proxy provides comprehensive logging and health checks:

- Health endpoint at `/health`
- Structured JSON logging
- Request/response logging
- Error tracking and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test examples