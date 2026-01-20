

## Issue 3: Support other AI assistants

**Title:** Support other AI assistants (Cursor, Windsurf, etc.)

**Labels:** enhancement, integration, feature

**Body:**
```markdown
## Feature Request: Multi-Assistant Support

### Summary
legit-code currently requires the Anthropic Claude CLI. This issue tracks adding support for other AI-powered development assistants.

### Current Behavior
When the Claude CLI is not installed, users receive:
```
❌ Error: Claude CLI not found.

legit-code currently requires the Claude CLI to be installed.

Please install Claude first:
   https://claude.ai/download
```

### Desired Behavior
Users should be able to use legit-code with their preferred AI assistant, including:
- Cursor (cursor.sh)
- Windsurf (codeium.com/windsurf)
- GitHub Copilot
- Other AI coding assistants

### Requirements
- [ ] Detect available AI assistants on the system
- [ ] Allow users to specify which assistant to use via CLI flag
- [ ] Generate appropriate settings/config for each assistant
- [ ] Document integration steps for each supported assistant
- [ ] Add tests for each integration

### Proposed API
```bash
# Use Claude (default)
legit-code

# Use Cursor
legit-code --assistant cursor

# Use Windsurf
legit-code --assistant windsurf

# Auto-detect
legit-code --assistant auto
```

### Assistant-Specific Notes

#### Cursor
- CLI command: `cursor`
- Config location: `~/.cursor/mcp.json` or similar
- Settings format: TBD

#### Windsurf
- CLI command: `windsurf`
- Config location: `~/.windsurf/mcp.json` or similar
- Settings format: TBD

### Priority
🔥 Medium - Claude support is working, but multi-assistant support would expand our user base

### Supporters
<!-- Leave a comment to upvote this issue -->
```

---

## Usage Instructions

### Creating Issues on GitHub

1. Go to https://github.com/Legit-Control/legit-code/issues
2. Click "New Issue"
3. Choose appropriate labels (enhancement, bug, help wanted, etc.)
4. Copy the title and body from the template above
5. Submit the issue

### Linking Issues in Code

The error messages in `bin/legit-mount.js` currently link to the general issues page:
```
https://github.com/Legit-Control/legit-code/issues
```

Once individual issues are created, update the links to point to specific issues:
```javascript
// Example for Linux
console.error(`   https://github.com/Legit-Control/legit-code/issues/1\n`);

// Example for Windows
console.error(`   https://github.com/Legit-Control/legit-code/issues/2\n`);
```

### Tracking Progress

Use these issues to:
- Collect community feedback and requirements
- Track implementation progress with checklists
- Allow users to upvote features they want
- Coordinate contributors who want to help
