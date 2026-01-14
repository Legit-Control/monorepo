Legit Claude: Store Your AI Conversations Next to Your Code

`legit-claude` is a CLI wrapper around claude that stores your claude conversations next to your code - right in your Repository.

# The Pain - Background story - Motivation

I lost my last position as Staff of Engeneering at Opral because of AI - kind of. 
The Founder was based in New york while I was working from Berlin. 

AI really gave a boost regarding throughput - but Timezone killed the productivety.

I was looking at huge Piles of changes thoughout the code base.
While AI helped a lot to summarize what was done pretty - an impoartant information was missing... 

THE WHY. Why was a Problem Solved in a particular way?

The craftmen ship of software development is not to solve a Problem - its to know which solution should be taken. 

In Software ther is not the one solution its more choosing among manz options with different tradeoffs. 

Ai can be a great sparring partner to brainstorm and helps a lot to navigate the problem space.
And the outcome of such sessions often produce suprisingly elegant solutions.

This ideation process finally leads to a result - a pr with wonderfull "crafted" new iteration of your code, your new architecture, your new design that solution that turned all the tests green and works just great... for now. 
But this is only the tip of the iceberg - the results are missing all the failed attemts the rejected alternatives. All the process 
torwards your result is burried in the conversation with the ai. 

After some time of reflection on my previous job I think the small time overlap could have been used way better if the reasoning for a result would have been
accessible to the team. 

# The probelem

When you work with AI coding assistants, your converstation are valuable information you want to keep:

- Your Messages/Propts - precice Problem description
- Conversation and discussions with the AI the lead to decision rationale for architectural choices
- Iterative refinements that shaped the final code
- Learning moments from the AI's explanations

This context is typically lost when the chat session ends, making it difficult to:

- Reconstruct why certain decisions were made
- Share the full development context with teammates
- Review and learn from past AI interactions
- Maintain an audit trail of AI-assisted development
- Give Future AI Session context for contnious improvments

We solved this for agentic communication in our first Demo App (Legit Chat) - https://www.legitcontrol.com/docs/concepts/chat-app
While I was working on Legit SDK I was curious if i could dogfood the SDK to approach the problem in a similiar way for claude cli as well.

# The Approach

Add claudes conversation history to your Git repository, turning every AI interaction into a commit.

- Your prompt as the commit message
- AI responses stored in commit metadata
- Code changes as the actual diff
- Session context preserved in the branch structure

## Where and how does it store conversations?

When you start a new session Legit creates three branches. 

1. Session Branch - "Feature-A": Think of it like your normal feature branch.

2. Claude Session Branch - "claude/Feature-a": This branch contains a commit for every change claude applies to a file in the repo

3. Claude conversation branch - "claude/Feature-a-operations": This branch stores all prompts, all toolcalls, all answers. A commit for every state of claud's session. It maps 1:1 to a commit per row in claudes sesseion file (*.jsonl). 

## How do you get the History from and into Claude cli?

Claude stores its sessions localy - usually under the folder `~/.claude/local` inside of jsonl files.
Each line of the `jsonl` file represents an operation inside of claude - this can be a prompt by the user, a tool call or a response. The Location can be configured by changing `CLAUDE_CONFIG_DIR`.

Now legit enters the game. When you start legit-claude it mounts a LegitFS (https://www.legitcontrol.com/docs/concepts/filesystem-api) based on the current Folder via NFS3. 
By configuring claude (via CLAUDE_CONFIG_DIR) to write to a folder managed by LegitFS we control every read and write of claudes `jsonl` session files.

When claude write a new line to the session `jsonl` file legit adds a commit with Human friendly description followed by original payload of claude.

When claude reads the session - for example to continue it, legit jusst projects the payload from the commits back into the session file. 


2. Conversational Commits

Every interaction with Claude becomes a commit:

# Your prompt becomes the commit

git commit -m "Add authentication middleware to protect API endpoints"

# Claude's response and suggested changes are captured

# The actual file modifications represent the implemented solution

3. Session Management

After your AI session ends, Legit Claude prompts you to:

- Apply changes to your main session branch with a descriptive commit
- Discard changes and revert to the starting state
- Continue later and preserve the work-in-progress

4. NFS Mount Technology

The tool uses Network File System mounting:

- Spins up an NFS server exposing your Legit repository (legit-mount.js:329-340)
- Mounts the repository locally using macOS NFS client (legit-mount.js:342-343)
- Provides transparent file access while tracking all operations

Features

Complete Conversation History

- Every prompt and response preserved in Git history
- Searchable through standard Git tools
- Audit trail of AI-assisted development

Session Isolation

- Each AI session gets its own branch
- Experimental work doesn't affect your main codebase
- Switch between different development threads

Change Management

- Choose which AI suggestions to keep
- Apply changes with meaningful commit messages
- Revert unwanted suggestions cleanly

Team Collaboration

- Share AI conversations through Git branches
- Review teammates' AI interactions and decisions
- Learn from collective AI-assisted development

Developer Workflow Integration

- Works with existing tools
- Transparent file system integration
- No changes to existing workflow

Installation & Usage

# Install the legit-claude CLI tool

npm install -g legit-claude

# Start a new AI session in your repository

legit-claude --new-session

# Continue an existing session

legit-claude

# Use a specific command instead of claude

legit-claude --spawn "claude-code"

Technical Implementation

Legit Framework Integration

Legit Claude uses the Legit SDK for version-controlled file systems:

- Core SDK (@legit-sdk/core) provides the version control engine
- NFS Server (@legit-sdk/nfs-serve) exposes the repository over NFS
- In-memory filesystem (memfs) for efficient file operations

Session Management (legit-mount.js:351-414)

The tool handles session creation and selection:
// Read available claude sessions from branches
const branches = fsDisk.readdirSync(branchesPath);
const claudeBranches = branches
.filter(branch => branch.startsWith('claude.') && !branch.endsWith('-operation'))
.map(branch => branch.replace('claude.', ''));

Change Application (legit-mount.js:437-452)

Changes are applied through Legit's built-in operations:
// Write commit message to trigger change application
fsDisk.writeFileSync(legitPath + '/apply-changes', commitMessage, 'utf-8');

Use Cases

Personal Development

- Maintain a searchable history of your problem-solving process
- Reconstruct reasoning for complex implementations
- Track learning progress with AI assistance

Team Collaboration

- Share AI-driven insights with teammates
- Review and discuss AI suggestions as a team
- Build collective knowledge from AI interactions

Learning & Documentation

- Create tutorials from real AI conversations
- Document decision-making processes
- Build a knowledge base of solved problems

Code Review & Audit

- Trace every change back to its originating prompt
- Understand implementation decisions
- Maintain compliance through complete change tracking

Get Started

Transform your AI coding sessions from disposable chats into permanent development assets.

npm install -g legit-claude
legit-claude --new-session "my-first-session"

---

This is a draft. Questions for refinement:

1. What aspects need more detail? - Technical implementation, benefits, use cases?
2. Is the tone appropriate? - More technical, more benefit-focused, or more tutorial-style?
3. What's missing? - Important features, workflows, or integrations?
4. Who should this target? - Individual developers, teams, managers?
5. Should I add more examples? - Specific commands, workflows, or integrations?
