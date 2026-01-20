# Legit Code

**Store Your AI Conversations Next to Your Code**

`legit-code` is a CLI wrapper around Claude that stores your Claude conversations next to your code—right in your repository. Every AI interaction becomes a Git commit, preserving the full context of your development decisions.

📹 **[Watch Demo Video](https://www.loom.com/share/e8178d35096c4be3a512d5dad37eeca6)**

## Installation

**Option 1: Use without installing (via npx)**

```bash
npx legit-code
```

**Option 2: Install globally (npm install -g)**

```bash
npm install -g legit-code
legit-code
```

## Usage

Simply run:

```bash
legit-code
```

This will:
- Create or continue a session branch
- Set up the Claude conversation tracking branches
- Start Claude in the mounted environment

If multiple sessions exist, you'll be prompted to select one.

### Session Management

After your AI session ends, Legit Code prompts you to:

- **Apply changes** — Apply changes to your main session branch with a descriptive commit
- **Discard changes** — Revert to the starting state
- **Continue later** — Preserve the work-in-progress

## What It Does

Legit Code automatically stores your Claude conversations in Git, turning every AI interaction into version-controlled commits. This preserves:

- **Your prompts** — precise problem descriptions
- **AI responses** — decision rationale and explanations
- **Code changes** — the actual implementation
- **Conversation history** — complete context for future reference

## How It Works

### Three Branches Per Session

When you start a new session, Legit creates three branches:

1. **Session Branch** (`Feature-A`) — Your normal feature branch
2. **Claude Session Branch** (`claude/Feature-a`) — Commits for every file change Claude makes
3. **Claude Conversation Branch** (`claude/Feature-a-operations`) — All prompts, tool calls, and responses (1:1 mapping to Claude's session file)

### NFS Mounting Technology

Legit Code uses Network File System (NFS) mounting to intercept Claude's session file operations:

1. Spawns an NFS server backed by [LegitFS](https://www.legitcontrol.com/docs/concepts/filesystem-api)
2. Mounts the repository locally (current folder + `-nfs`)
3. Starts Claude within the mounted folder

By configuring Claude (via `CLAUDE_CONFIG_DIR`) to write to the LegitFS-managed folder, every read and write operation on Claude's `jsonl` session files is intercepted and stored as Git commits.

## Features & Use Cases

- **Complete conversation history** — Every prompt and response preserved in Git, searchable and auditable
- **Session isolation** — Each AI session gets its own branch, keeping experimental work separate
- **Change management** — Choose which suggestions to keep, apply with meaningful commits, or revert cleanly
- **Team collaboration** — Share AI conversations through Git branches and review teammates' decision-making process

- **Code review & audit** — Trace every change back to its originating prompt and understand implementation decisions
- **Workflow integration** — Works with existing tools, transparent file system integration, no workflow changes required

## Viewing Stored Conversations

All conversations are stored in Git branches. To view them:

```bash
# View all branches with conversation history
git log --all --decorate --oneline --graph
```

**For better visualization**, consider using:

- **[git-graph](https://github.com/git-bahn/git-graph)** — Command-line tool for clearer Git history graphs
  ```bash
  brew install git-graph # or: cargo install git-graph
  git-graph
  ```

- **[Sourcetree](https://www.sourcetreeapp.com/)** — Free Git GUI for Mac and Windows with visual branch diagrams

## Technical Details

### Legit Framework Integration

Legit Code uses the Legit SDK for version-controlled file systems:

- **Core SDK** (`@legit-sdk/core`) — Version control engine
- **NFS Server** (`@legit-sdk/nfs-serve`) — Exposes repository over NFS


## Requirements

- Node.js (v14 or higher)
- macOS (for NFS mounting support)
- Git repository initialized in your project directory
- Claude CLI installed and configured


## Related Projects

- [Legit Chat](https://www.legitcontrol.com/docs/concepts/chat-app) — Agentic communication with conversation history
- [Legit SDK](https://www.legitcontrol.com/docs) — Version-controlled file systems


