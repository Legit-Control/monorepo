# Node.js Server Example

This is a minimal Node.js example demonstrating the use of `@legit-sdk/core/server`.

## Usage

```bash
# Install dependencies
pnpm install

# Run the example
pnpm start

# Run with auto-reload on file changes
pnpm dev
```

## What it does

- Initializes LegitFS with an in-memory filesystem using `memfs`
- Creates and writes a test file
- Reads the file back
- Lists directory contents
- Gets the current git branch

This demonstrates server-side usage of the Legit SDK without any browser dependencies.

