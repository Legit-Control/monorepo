# Vanilla JS + @legit-sdk/core

A simple HTML/JS/CSS example demonstrating the use of `@legit-sdk/core` in a vanilla JavaScript application.

## Features

- Pure HTML, CSS, and JavaScript (no frameworks)
- Uses Vite for development and bundling
- Interactive UI for testing LegitFS operations
- Demonstrates browser-based file operations with in-memory filesystem

## Usage

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## What it does

- **Initialize LegitFS**: Sets up an in-memory filesystem using `memfs`
- **Write File**: Saves content from the textarea to a file
- **Read File**: Reads the file and displays its content
- **List Directory**: Shows all files and directories in the root

This demonstrates browser-only usage of the Legit SDK without any React or framework dependencies.

