# Legit SDK React Starter

A starter template demonstrating how to use `@legit-sdk/react` for local-first document editing and version control in a Next.js application.

## Features

- ✅ **Auto-initialization**: Files are automatically created with initial content if they don't exist
- ✅ **Version history**: View commit history with visual diffs
- ✅ **Commit checkout**: Browse historical commits and view their content
- ✅ **Safe editing**: Save button is disabled when viewing non-HEAD commits
- ✅ **Real-time sync**: Changes are automatically synced via HEAD polling

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## How It Works

This starter demonstrates a simple document editor with version control:

1. **LegitProvider**: Initializes the Legit FS instance and polls for HEAD changes
2. **useLegitFile**: Hook that manages file content, history, and save operations
3. **Editor Component**: Simple textarea with save button and history list

### Key Implementation

```tsx
import { LegitProvider, useLegitFile } from '@legit-sdk/react';

function Editor() {
  // Auto-create file with initial content if it doesn't exist
  const { content, setContent, history, getPastState } = useLegitFile(
    '/document.txt',
    { initialContent: 'This is a document that you can edit! 🖋️' }
  );

  // ... rest of component
}
```

## Customization

### Change the File Path

Edit `FILE_PATH` in `app/page.tsx`:

```tsx
const FILE_PATH = '/your-file.txt';
```

### Change Initial Content

Edit `INITIAL_TEXT` in `app/page.tsx`:

```tsx
const INITIAL_TEXT = 'Your initial content here';
```

### Manual File Creation

Remove `initialContent` option to handle file creation manually:

```tsx
const { content, setContent } = useLegitFile('/document.txt');
```

## Features Explained

### Auto-initialization

When `initialContent` is provided, the hook automatically creates the file if it doesn't exist:

```tsx
useLegitFile('/document.txt', { initialContent: 'Hello World' });
```

### History & Checkout

- Click any history item to view that commit's content
- Active commit is highlighted
- Save button is disabled when viewing non-HEAD commits

### Sync Behavior

- Content syncs automatically when HEAD changes
- User edits are preserved (won't be overwritten by sync)
- Save clears checkout state and returns to HEAD

## Project Structure

```
app/
  page.tsx          # Main editor component
  layout.tsx        # Next.js layout
  globals.css       # Global styles
public/
  logo.svg          # Legit logo
  avatar.svg        # Avatar icon
  file.svg          # File icon
```

## Learn More

- [Legit SDK Documentation](../../packages/sdk-react/spec.md)
- [Next.js Documentation](https://nextjs.org/docs)

## Building Your Own Starter

1. Copy this starter to your project
2. Customize `FILE_PATH` and `INITIAL_TEXT`
3. Modify the UI to match your needs
4. Add more files with multiple `useLegitFile` hooks
