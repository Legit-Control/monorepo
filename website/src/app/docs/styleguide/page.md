---
title: Style Guide - Naming Conventions & Writing Standards
description: A guide to writing consistent documentation for Legit, including naming conventions, terminology, and style standards.
---

# Style Guide

This guide defines naming conventions and writing standards for Legit documentation to ensure consistency across all content.

This guide helps maintain a consistent voice, terminology, and structure throughout our documentation. It also serves as a reference for AI-assisted writing, ensuring that AI-generated content meets our quality standards and aligns with Legit's style and technical accuracy. 
## Naming Conventions

### Product Names

- **Legit SDK** - Always use "SDK" (not "sdk")
- **Legit FS** - Use "FS" (not "Fs" or "Filesystem" when referring to the product)
- **Legit Hub** - Always separated (two words), capital H

## Writing Style

### Voice & Tone

- Write in a friendly, approachable tone
- Use "you" to address the reader directly
- Be clear and direct—avoid jargon when possible
- Explain concepts simply before diving into technical details

### Terminology

#### Always Use:
- "AI agents" (not "AI" alone when referring to agents)
- "rollback" (one word, not "roll back")
- "auditable" (prefer over "traceable" when emphasizing compliance)

#### Avoid:
- "infrastructure" (too generic)—use "Legit" or specific product names
- "solution" (overused)—be specific about what it does

## Structure Standards

### Headings

Use a clear heading hierarchy to organize content:

- **H1** - Main page title (e.g., "Meet Legit SDK", "The Problem", "The Chat App")
- **H2** - Major section headings (e.g., "Creating a Sandbox Branch", "How It Works")
- **H3** - Subsection headings within H2 sections
- **H4** - Minor sections within subsections

#### Guidelines:
- Use descriptive headings that outline what follows
- Keep headings short and scannable
- Use sentence case for headings
- Never skip heading levels (e.g., don't go from H2 to H4)

### Lists

- **Bullet points** - For unordered lists, features, or options
- **Numbered lists** - For sequential steps or ordered processes
- Keep items parallel in structure
- Use consistent punctuation (usually no period for short items)

### Links

- Use descriptive link text (not "here" or "click here")
- Example: `See [Tracking Intent](/docs/concepts/chat-app#tracking-intent)`

## Special Sections

### Story Beats

Use the "Story Beat" section format for real-world examples:

> "Quote or narrative here."<br><br>
> — Source or attribution

### Takeaways

End major sections with clear takeaways that summarize key points.

## Technical Documentation

### Code Examples

Always include language tags in code blocks and use realistic, simple examples:

```typescript
// Write content to a file
await legitFs.writeFile("hello.txt", "Hello world!");

// Behind the scenes: This automatically creates a Git commit
// Commit: abc123 "Updated hello.txt"
```

**Guidelines:**
- Always include language tags in code blocks
- Use real, working code from actual use cases
- Add comments to explain non-obvious behavior
- Show the outcome or expected result
- Keep examples focused on a single concept
- Include error handling when relevant
- Don't use placeholder values like `your-api-key`
- Don't assume prior knowledge of domain-specific APIs
- Document side effects (what happens behind the scenes like commits created, files modified)
- Document parameters: data type, whether required/optional, default values, description
- Document return values: type and what the value represents
- Document exceptions: possible errors and when they occur

## Design System

### Typography

Legit uses two primary font families:

- **Aspekta** - Main typeface for all headings, body text, and UI elements
- **GeistMono** - Monospace font for code blocks, technical references, and labels

### Colors

Legit's color palette emphasizes clarity and accessibility:

#### Primary Colors
- **Background**: `#FFFFFF` (white) for main content areas
- **Background Secondary**: `#FAFAFA` for documentation sidebar
- **Foreground**: `#171717` (near-black) for primary text

#### Accent Colors
- **Primary (Orange)**: `#FF611A`
  - Used for CTAs, links, and key interactive elements
- **Border**: `#E5E5E5` (light gray)
  - Used for subtle borders and dividers

#### Semantic Colors

Legit uses the Zinc color scale for UI elements:
- **Zinc 100**: `#F4F4F5` - Backgrounds for badges/labels
- **Zinc 200**: `#E4E4E7` - Second-level backgrounds
- **Zinc 500**: `#71717A` - Secondary text and captions
- **Zinc 600**: `#52525B` - Muted text

#### Usage Guidelines

- **Text Hierarchy**: Use foreground (#171717) for primary text, zinc-500 for secondary
- **Backgrounds**: Keep backgrounds light to maintain readability
- **Accents**: Use the primary orange sparingly for emphasis and interactive elements
- **Borders**: Use very light borders (#E5E5E5) for subtle separation

## Visual Content

### When to Use Visuals

Use diagrams and visuals when they:
- Show relationships between concepts (e.g., branches, commits, operations)
- Illustrate workflows or processes (e.g., "Creating a Sandbox Branch")
- Explain architectural concepts (e.g., filesystem structure)
- Demonstrate visual differences (e.g., before/after states)
- Clarify complex data flows or system interactions

### Image Standards

#### File Formats
- Use SVG for diagrams and illustrations (scalable, crisp at any size)
- Use PNG for screenshots when detail matters
- Use JPG only for photographs

#### Design Guidelines
- **Style**: Clean, minimal design matching the Legit brand
- **Colors**: Use brand colors (orange #FF611A for emphasis, neutral grays)
- **Typography**: Use Aspekta for labels when possible
- **File naming**: Descriptive names like `legit-chat.png`, `filesystem-structure.svg`

#### Accessibility
- Include alt text for all images
- Ensure sufficient color contrast in diagrams
- Don't rely solely on color to convey information

## Questions?

This is a living document. If you're unsure about naming or style, ask or make a decision that prioritizes clarity for developers.
