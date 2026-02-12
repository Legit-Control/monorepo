# CONTRIBUTING
## Contributing with Changesets
We use [Changesets](https://github.com/changesets/changesets/) to manage versioning and changelogs for our packages. This ensures consistent version bumps and automatic changelog generation.
When you created changes on a branch please run changesets to trigger a new version or update the changelog:
```bash
pnpm changeset
```
This will prompt you to:
1. Select the packages affected by your changes.
1. Choose a bump type:
- `patch` → bug fixes, small improvements
- `minor` → new features, backwards-compatible
- `major` → breaking changes
1. Add a summary describing your changes.
After completion, a markdown file will be created in .changeset/ (e.g., red-fox.md).
Commit these together with your changes. The publishing will be done manually by the maintainers when merged.
Hallo Hallo This is the first pieps from colibriassadasd
Collaboration on markdown <3 