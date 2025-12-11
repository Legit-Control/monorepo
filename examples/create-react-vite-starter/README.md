# Legit SDK React + Vite Starter

A starter template demonstrating how to use `@legit-sdk/react` for local-first document editing and version control in a React + Vite application.

## Features

- ✅ **Auto-initialization**: Files are automatically created with initial content if they don't exist
- ✅ **Version history**: View commit history with visual diffs
- ✅ **Commit checkout**: Browse historical commits and view their content
- ✅ **Safe editing**: Save button is disabled when viewing non-HEAD commits
- ✅ **Real-time sync**: Changes are automatically synced via HEAD polling
- ✅ **Branch sharing**: Share your document with others via invite links

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the demo.

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
  const { data, setData, history, getPastState } = useLegitFile(
    '/document.txt',
    { initialData: 'This is a document that you can edit! 🖋️' }
  );

  // ... rest of component
}
```

## Customization

### Change the File Path

Edit the file path in `src/App.tsx`:

```tsx
const legitFile = useLegitFile('/your-file.txt', {
  initialData: INITIAL_TEXT,
});
```

### Change Initial Content

Edit `INITIAL_TEXT` in `src/App.tsx`:

```tsx
const INITIAL_TEXT = 'Your initial content here';
```

### Manual File Creation

Remove `initialData` option to handle file creation manually:

```tsx
const legitFile = useLegitFile('/document.txt');
```

## Features Explained

### Auto-initialization

When `initialData` is provided, the hook automatically creates the file if it doesn't exist:

```tsx
useLegitFile('/document.txt', { initialData: 'Hello World' });
```

### History & Checkout

- Click any history item to view that commit's content
- Active commit is highlighted
- Save button is disabled when viewing non-HEAD commits

### Sync Behavior

- Content syncs automatically when HEAD changes
- User edits are preserved (won't be overwritten by sync)
- Save clears checkout state and returns to HEAD

### Branch Sharing

Click the "Share" button to generate an invite link that allows others to collaborate on the same document branch.

## Project Structure

```
src/
  App.tsx                    # Main editor component
  App.css                     # Component styles
  main.tsx                    # Application entry point
  index.css                   # Global styles
  LegitBrand.tsx              # Legit branding components
  LegitProviderComponent.tsx  # Legit provider setup
public/
  logo.svg                    # Legit logo
  avatar.svg                  # Avatar icon
  file.svg                    # File icon
```

## Learn More

- [Legit SDK Documentation](../../packages/sdk-react/spec.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)

## Building Your Own Starter

1. Copy this starter to your project
2. Customize the file path and initial content
3. Modify the UI to match your needs
4. Add more files with multiple `useLegitFile` hooks
