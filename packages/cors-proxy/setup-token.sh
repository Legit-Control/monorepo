#!/bin/bash

# setup-token.sh - Creates RSA key pairs and environment file
# Usage: ./setup-token.sh [env-file-path]
# Default env file path: .env

set -e  # Exit on any error

# Default env file path if not provided
ENV_FILE_PATH="${1:-.env}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Token Setup Script ===${NC}"
echo -e "${YELLOW}Creating RSA key pairs and environment file...${NC}"

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo -e "${RED}Error: openssl is not installed or not in PATH${NC}"
    echo "Please install openssl to run this script"
    exit 1
fi

# Create directories for keys if they don't exist
mkdir -p proxy_keys access_keys

# Generate proxy key pair
echo -e "${BLUE}Generating proxy key pair...${NC}"
openssl genrsa -out proxy_keys/private.pem 2048
openssl rsa -in proxy_keys/private.pem -pubout -out proxy_keys/public.pem

# Generate access key pair
echo -e "${BLUE}Generating access key pair...${NC}"
openssl genrsa -out access_keys/private.pem 2048
openssl rsa -in access_keys/private.pem -pubout -out access_keys/public.pem

# Read keys and format for environment variables
echo -e "${BLUE}Formatting keys for environment variables...${NC}"

# Read and escape private keys (remove newlines and escape for shell)
PROXY_KEY_PRIVATE=$(awk '{printf "%s\\n", $0}' proxy_keys/private.pem | tr -d '\n')
ACCESS_KEY_PRIVATE=$(awk '{printf "%s\\n", $0}' access_keys/private.pem | tr -d '\n')

# Read and escape public keys (remove newlines and escape for shell)
PROXY_KEY_PUBLIC=$(awk '{printf "%s\\n", $0}' proxy_keys/public.pem | tr -d '\n')
ACCESS_KEY_PUB=$(awk '{printf "%s\\n", $0}' access_keys/public.pem | tr -d '\n')

# Create environment file
echo -e "${BLUE}Creating environment file at: ${ENV_FILE_PATH}${NC}"
cat > "$ENV_FILE_PATH" << EOF
# RSA Keys for Token System
# Generated on: $(date)

# Access Keys
ACCESS_KEY_PUB=${ACCESS_KEY_PUB}
ACCESS_KEY_PRIVATE=${ACCESS_KEY_PRIVATE}

# Proxy Keys
PROXY_KEY_PUBLIC=${PROXY_KEY_PUBLIC}
PROXY_KEY_PRIVATE=${PROXY_KEY_PRIVATE}

# Token System Password
CREATE_TOKEN_PASSWORD=password

# CORS configuration (optional)
# ALLOW_ORIGIN=*
# INSECURE_HTTP_ORIGINS=
EOF

# Set appropriate permissions for the environment file
chmod 600 "$ENV_FILE_PATH"
chmod 600 proxy_keys/private.pem access_keys/private.pem
chmod 644 proxy_keys/public.pem access_keys/public.pem

echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo
echo -e "${BLUE}Files created:${NC}"
echo -e "  📁 Environment file: ${GREEN}$ENV_FILE_PATH${NC}"
echo -e "  🔐 Private keys: ${YELLOW}proxy_keys/private.pem, access_keys/private.pem${NC}"
echo -e "  🌐 Public keys: ${GREEN}proxy_keys/public.pem, access_keys/public.pem${NC}"
echo
echo -e "${BLUE}Environment variables created:${NC}"
echo -e "  • ${GREEN}ACCESS_KEY_PUB${NC}"
echo -e "  • ${GREEN}ACCESS_KEY_PRIVATE${NC}"
echo -e "  • ${GREEN}PROXY_KEY_PUBLIC${NC}"
echo -e "  • ${GREEN}PROXY_KEY_PRIVATE${NC}"
echo -e "  • ${GREEN}CREATE_TOKEN_PASSWORD${NC}"
echo
echo -e "${YELLOW}⚠️  Important security notes:${NC}"
echo -e "  • The environment file is set to ${RED}read-only for owner${NC} (chmod 600)"
echo -e "  • Private keys are also ${RED}read-only for owner${NC} (chmod 600)"
echo -e "  • ${RED}Never commit${NC} .env files or private keys to version control"
echo -e "  • Consider using a password manager for the CREATE_TOKEN_PASSWORD"
echo
echo -e "${GREEN}🎉 Ready to use! Run 'npm run dev' to start the development server.${NC}"