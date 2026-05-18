# Deep Understanding of opensrc and Implementation Plan for src-gate

## Ultra-Deep Understanding of opensrc's Mechanism

### The Complete Flow

When you run `opensrc path react`, here's what happens:

#### 1. Package Spec Parsing

- Input: `"react"`
- Output: `{ registry: Npm, name: "react", version: None }`

#### 2. Version Detection (if not specified)

**Priority Order:**

1. **node_modules** - Read `node_modules/react/package.json` → get `version` field
2. **package-lock.json** (npm v7+): Check `packages["node_modules/react"].version`
3. **package-lock.json** (npm v6): Check `dependencies.react.version`
4. **pnpm-lock.yaml**: Parse complex YAML structure
   - Check `importers.{any}.{dependencies,devDependencies,optionalDependencies}`
   - Check top-level `dependencies/devDependencies/optionalDependencies` (v5/v6)
   - BFS through `snapshots:` (v9) or `packages:` (v6-v8) dependency graph
   - Handle peer dependency suffixes: `18.2.0(react@18.2.0)` → `18.2.0`
5. **yarn.lock**: Parse yarn lockfile format
6. **package.json** (fallback): Strip `^~>=<` prefixes from dependency spec

**Result:** `"18.2.0"` (or whatever version is installed)

#### 3. Package → Repository Resolution

**For npm packages:**

- Call npm registry API: `https://registry.npmjs.org/react`
- Response contains:
  ```json
  {
    "repository": {
      "url": "git+https://github.com/facebook/react.git",
      "directory": "packages/react" // optional
    },
    "versions": {
      "18.2.0": {
        "repository": {
          // version-specific override
          "url": "..."
        }
      }
    }
  }
  ```
- Extract repository URL and normalize:
  - Remove `git+` prefix
  - Convert `git://` to `https://`
  - Convert `git+ssh://git@` to `https://`
  - Remove `.git` suffix
  - Handle `github:owner/repo` format
- Result: `"https://github.com/facebook/react"`

**For PyPI packages:**

- Call PyPI API: `https://pypi.org/pypi/{package}/json`
- Extract `project_urls` (Source, Repository, Code)
- Parse to get GitHub/GitLab/Bitbucket URL

**For crates.io:**

- Call crates API: `https://crates.io/api/v1/crates/{crate}`
- Extract `repository` field from crate metadata

#### 4. Git Ref Resolution

**For npm packages:**

- Git tag format: `v{version}`
- Example: `18.2.0` → tag `v18.2.0`
- Result: The git tag to checkout

**For direct repo specs:**

- From `owner/repo@main` → use `main`
- From `owner/repo#v1.0.0` → use `v1.0.0`
- Default: `main` branch

#### 5. Cache Path Construction

**Structure:** `~/.opensrc/repos/{host}/{owner}/{repo}/{git-ref}/`

**Example:** `react@18.2.0`

1. Repository URL: `https://github.com/facebook/react`
2. Parse: `github.com/facebook/react`
3. Git ref: `v18.2.0`
4. Cache path: `~/.opensrc/repos/github.com/facebook/react/v18.2.0/`

#### 6. Git Cloning (if not cached)

- Shallow clone at the specific tag/branch
- Cache in the calculated path
- Update `~/.opensrc/sources.json` with metadata

#### 7. Path Output

- Print absolute path to cached repository
- Example: `/Users/user/.opensrc/repos/github.com/facebook/react/v18.2.0`

---

## For src-gate: Key Differences

### src-gate's Virtual Filesystem Structure

Based on the src-gate readme:

```
~/src-gate/
├── storage/                        # Real folder for cached data
│   └── bookmarks/                  # Bookmarked (checked out) repositories
│       └── github.com/
│           └── username/
│               └── reponame/       # Cloned repository
└── repos/                          # NFS mount point (virtual filesystem)
    └── github.com/
        └── username/
            └── reponame/          # Virtual folder - LAZY LOOKUP
                └── branch-tag-commitOid/           # the branch name, the tag or the 40 char commit oid,
                    └── path/           # Files served from git tree
```

### Critical Insight

**src-gate DOES NOT clone by default!**

- When you access `~/src-gate/repos/github.com/facebook/react/v18.2.0/`
- The virtual filesystem **LAZILY** fetches files using git smart protocol
- It serves content from the `.git` folder using the tree at that tag/commit
- No full clone needed until you bookmark it

### Path Format for src-gate

For `react@18.2.0`:

```
~/src-gate/repos/github.com/facebook/react/v18.2.0/
```

This matches src-gate's virtual mount structure where:

- `repos/` is the NFS mount point
- `github.com/facebook/react/` is the virtual folder path
- `v18.2.0/` is the specific version/tag/commit

---

## Implementation Plan for src-gate

### Phase 1: Lockfile Version Detection

#### 1.1 Create Lockfile Parsers

**Files to create:**

```
lib/resolve-version/
├── types.ts
├── index.ts
├── parsers/
│   ├── package-lock.ts      # npm package-lock.json parser
│   ├── pnpm-lock.ts         # ppnpm-lock.yaml parser
│   ├── yarn-lock.ts         # yarn.lock parser
│   └── package-json.ts      # package.json fallback parser
└── __tests__/
    ├── package-lock.test.ts
    ├── pnpm-lock.test.ts
    ├── yarn-lock.test.ts
    └── integration.test.ts
```

**Function signature:**

```typescript
export function detectInstalledVersion(
  packageName: string,
  options: {
    cwd?: string;
  }
): Promise<string | null>;
```

**Priority order:**

1. Check `node_modules/{package}/package.json`
2. Parse `package-lock.json` (handle v6 and v7+ formats)
3. Parse `pnpm-lock.yaml` (handle v5/v6/v7/v8/v9 formats)
4. Parse `yarn.lock` (handle Berry and v1 formats)
5. Fallback: Parse `package.json` (strip `^~>=<` prefixes)

#### 1.2 Testing Strategy with Fixtures

**Create test fixtures:**

```
lib/resolve-version/__tests__/fixtures/
├── package-lock-v6.json      # npm v6 format
├── package-lock-v7.json      # npm v7+ format
├── pnpm-lock-v5.yaml         # pnpm v5 format
├── pnpm-lock-v9-workspace.yaml  # pnpm v9 workspace
├── yarn-lock-v1.lock         # yarn v1 format
└── yarn-lock-berry.lock      # yarn Berry format
```

**Test cases:**

```typescript
// Should return version from lockfile
detectInstalledVersion('react', { cwd: './fixtures/pnpm-v9' });
// → '18.2.0'

// Should handle scoped packages
detectInstalledVersion('@types/react', { cwd: './fixtures/pnpm-v9' });
// → '18.2.45'

// Should handle peer dependency suffixes
// pnpm: "18.2.0(react@18.2.0)" → "18.2.0"

// Should return null if package not found
detectInstalledVersion('nonexistent', { cwd: './fixtures' });
// → null
```

### Phase 2: Registry API Integration

#### 2.1 Create Registry Clients

**Files to create:**

```
lib/registry-clients/
├── types.ts
├── index.ts
├── npm-client.ts            # npm registry API
├── pypi-client.ts           # PyPI API
├── crates-client.ts         # crates.io API
└── __tests__/
    ├── npm-client.test.ts
    ├── pypi-client.test.ts
    └── crates-client.test.ts
```

**Function signature:**

```typescript
export async function resolvePackageToRepo(
  packageName: string,
  version: string,
  registry: Registry
): Promise<{
  repoUrl: string;
  gitRef: string;
  repoDirectory?: string;
}>;
```

**Implementation for npm:**

```typescript
// Fetch from npm registry
const response = await fetch(`https://registry.npmjs.org/${encodedName}`);
const data = await response.json();

// Extract repository URL
const repoUrl = data.repository?.url || data.versions[version]?.repository?.url;

// Normalize URL
const normalized = normalizeRepoUrl(repoUrl);

// Git ref for npm: v{version}
const gitRef = `v${version}`;

return { repoUrl: normalized, gitRef };
```

#### 2.2 Testing Strategy

**IMPORTANT: Don't mock the registry APIs!**

Use real API calls against stable, well-known packages:

```typescript
// Integration tests with REAL npm registry
describe('NpmClient (integration)', () => {
  it('should resolve react to facebook/react', async () => {
    const result = await resolveNpmPackage('react', '18.2.0');
    expect(result.repoUrl).toBe('https://github.com/facebook/react');
    expect(result.gitRef).toBe('v18.2.0');
  });

  it('should resolve zod to ColinHuberts/zod', async () => {
    const result = await resolveNpmPackage('zod', '3.22.0');
    expect(result.repoUrl).toBe('https://github.com/colinhubberts/zod');
    expect(result.gitRef).toBe('v3.22.0');
  });

  it('should handle scoped packages', async () => {
    const result = await resolveNpmPackage('@babel/core', '7.23.0');
    expect(result.repoUrl).toContain('babel');
    expect(result.gitRef).toBe('v7.23.0');
  });
});
```

**Why real APIs instead of mocks?**

- ✅ Tests validate actual integration with npm/PyPI/crates.io
- ✅ No mock drift - tests always use current API format
- ✅ Catches real-world API changes early
- ✅ These are stable, public APIs with rate limits
- ✅ We're building a package resolver - should resolve real packages!

**Test organization:**

```typescript
// Fast unit tests (run on every save)
describe('normalizeRepoUrl', () => { ... });

// Integration tests (run with pnpm test:integration)
describe('NpmClient (integration)', () => {
  // Skip unless INTEGRATION_TESTS=true
  it.skipUnless(process.env.INTEGRATION_TESTS, 'should resolve real packages', async () => {
    // Real API calls
  });
});
```

### Phase 3: Path Resolution for src-gate

#### 3.1 Update Path Resolution

**Modify:** `lib/resolve-path/index.ts`

**New function:**

```typescript
export async function resolvePackageWithVersion(
  packageSpec: string,
  options: {
    cwd?: string;
    basePath: string;
  }
): Promise<{
  spec: string;
  path: string;
  registry: Registry | 'repo';
  version: string;
  gitRef: string;
}>;
```

**Flow:**

1. Parse package spec → get name and optional version
2. If no version and npm → detect from lockfiles
3. Resolve package+version to repo URL and git ref (via registry API)
4. Parse repo URL → host, owner, repo
5. Construct path: `{basePath}/repos/{host}/{owner}/{repo}/{gitRef}/`

**Example:**

```typescript
// Input: "react"
// Detects version: "18.2.0"
// Resolves to: https://github.com/facebook/react
// Git ref: v18.2.0
// Returns:
{
  spec: "react",
  path: "/Users/user/src-gate/repos/github.com/facebook/react/v18.2.0",
  registry: Registry.Npm,
  version: "18.2.0",
  gitRef: "v18.2.0"
}
```

#### 3.2 Testing Strategy

**Integration tests:**

```typescript
// Test full flow with mocked registry API
const result = await resolvePackageWithVersion('react', {
  cwd: './fixtures/pnpm-v9',
  basePath: '/tmp/test',
});

expect(result.path).toBe('/tmp/test/repos/github.com/facebook/react/v18.2.0');
expect(result.version).toBe('18.2.0');
expect(result.gitRef).toBe('v18.2.0');
```

### Phase 4: CLI Integration

#### 4.1 Update CLI

**Modify:** `bin/src-gate.ts`

**Update path command:**

```typescript
program
  .command('path')
  .argument('[packages...]')
  .option('--cwd <path>', 'Working directory for lockfile version resolution')
  .action(async (packages, options) => {
    for (const pkg of packages) {
      const resolution = await resolvePackageWithVersion(pkg, {
        cwd: options.cwd,
        basePath: options.path,
      });

      console.log(resolution.path);
    }
  });
```

#### 4.2 Testing Strategy

**End-to-end tests:**

```bash
# Test with fixtures
cd fixtures/pnpm-v9-workspace
src-gate path react
# → /Users/user/src-gate/repos/github.com/facebook/react/v18.2.0

src-gate path @types/react
# → /Users/user/src-gate/repos/github.com/DefinitelyTyped/Typescript/tree/master/types/react

src-gate path next
# → /Users/user/src-gate/repos/github.com/vercel/next.js/v14.0.0
```

---

## Testing Philosophy: Real > Mocked

### Key Principle: Test What You Ship

We're building a package resolver that integrates with real registries (npm, PyPI, crates.io). Our tests should validate that this integration actually works.

### Three-Tier Testing Strategy

#### Tier 1: Fast Unit Tests (No Network, No Mocking)
**What:** Pure functions, parsers, formatters
**Speed:** ⚡⚡⚡ Instant (milliseconds)
**When:** Every save, during development

```typescript
// URL normalization, parsing logic
describe('normalizeRepoUrl', () => {
  it('should remove git+ prefix', () => {
    expect(normalizeRepoUrl('git+https://github.com/owner/repo'))
      .toBe('https://github.com/owner/repo');
  });
});

// Lockfile parsing (uses fixtures, no network)
describe('parsePnpmLock', () => {
  it('should extract version from pnpm-lock.yaml', () => {
    const content = fs.readFileSync('fixtures/pnpm-lock.yaml');
    const version = parsePnpmLock(content, 'react');
    expect(version).toBe('18.2.0');
  });
});
```

#### Tier 2: Integration Tests (Real APIs)
**What:** Actual registry API calls
**Speed:** 🐢 Slower (seconds, depends on network)
**When:** Before committing, in CI

```typescript
describe('NpmClient (integration)', () => {
  it.skipUnless(process.env.INTEGRATION_TESTS,
    'should resolve real packages from npm registry', async () => {
    const result = await resolveNpmPackage('react', '18.2.0');
    expect(result.repoUrl).toBe('https://github.com/facebook/react');
  });
});
```

**Why real APIs?**
- ✅ Catches real API format changes
- ✅ Tests actual behavior, not assumptions
- ✅ No mock maintenance burden
- ✅ These are stable, public APIs
- ✅ We're building a resolver - should resolve real packages!

#### Tier 3: End-to-End Tests (Full Flow)
**What:** CLI commands with real lockfiles + real APIs
**Speed:** 🐢🐢 Slowest
**When:** Before major releases

```typescript
describe('CLI (e2e)', () => {
  it.skipUnless(process.env.E2E_TESTS,
    'should resolve package from real project', async () => {
      const result = execSync('src-gate path react', {
        cwd: 'fixtures/real-pnpm-project'
      });
      expect(result.toString()).toMatch(/github.com\/facebook\/react\/v18.2.0/);
    });
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",                                 // Tier 1 only (fast)
    "test:integration": "INTEGRATION_TESTS=true vitest run",
    "test:e2e": "E2E_TESTS=true vitest run",
    "test:all": "vitest run"                          // Run everything
  }
}
```

### Choosing Test Packages

Use well-known, stable packages for integration tests:

**npm:**
- `react` → facebook/react
- `zod` → colinhubberts/zod
- `lodash` → lodash/lodash
- `@babel/core` → babel/babel

**PyPI:**
- `requests` → psf/requests
- `flask` → pallets/flask
- `django` → django/django

**crates.io:**
- `serde` → serde-rs/serde
- `tokio` → tokio-rs/tokio

These packages:
- Are widely used and stable
- Won't disappear or change radically
- Have good repository metadata
- Cover different scenarios (scoped, monorepos, etc.)

---

## Detailed Testing Strategy

### Test Fixture Structure

Create realistic fixtures based on opensrc's approach:

```
lib/resolve-version/__tests__/fixtures/
├── npm-project/
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
│       └── react/
│           └── package.json
│
├── pnpm-workspace/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── apps/
│   │   └── web/
│   │       ├── package.json
│   │       └── node_modules/
│   │           └── react/
│   │               └── package.json
│   └── apps/
│       └── legacy/
│           ├── package.json
│           └── node_modules/
│               └── react/
│                   └── package.json
│
└── yarn-project/
    ├── package.json
    ├── yarn.lock
    └── node_modules/
        └── react/
            └── package.json
```

### Unit Tests

**package-lock parser:**

```typescript
describe('parsePackageLock', () => {
  it('should parse npm v7+ format', () => {
    const content = fs.readFileSync('fixtures/npm-project/package-lock.json');
    const version = parsePackageLock(content, 'react');
    expect(version).toBe('18.2.0');
  });

  it('should parse npm v6 format', () => {
    const content = fs.readFileSync('fixtures/npm-v6/package-lock.json');
    const version = parsePackageLock(content, 'react');
    expect(version).toBe('18.2.0');
  });

  it('should return null for missing package', () => {
    const version = parsePackageLock('{}', 'nonexistent');
    expect(version).toBeNull();
  });
});
```

**pnpm-lock parser:**

```typescript
describe('parsePnpmLock', () => {
  it('should parse pnpm v9 workspace format', () => {
    const content = fs.readFileSync('fixtures/pnpm-workspace/pnpm-lock.yaml');
    const version = parsePnpmLock(content, 'react', {
      cwd: 'fixtures/pnpm-workspace',
    });
    expect(version).toBe('18.2.0');
  });

  it('should handle peer dependency suffixes', () => {
    const version = parsePnpmLock(content, 'react-dom');
    expect(version).toBe('18.2.0'); // from "18.2.0(react@18.2.0)"
  });

  it('should handle scoped packages', () => {
    const version = parsePnpmLock(content, '@types/react');
    expect(version).toBe('18.2.45');
  });

  it('should find version in different importer', () => {
    const version = parsePnpmLock(content, 'react', {
      cwd: 'fixtures/pnpm-workspace/apps/legacy',
    });
    expect(version).toBe('17.0.2');
  });
});
```

### Integration Tests

```typescript
describe('detectInstalledVersion', () => {
  it('should detect version from node_modules', async () => {
    const version = await detectInstalledVersion('react', {
      cwd: 'fixtures/npm-project',
    });
    expect(version).toBe('18.2.0');
  });

  it('should fallback to lockfile if node_modules missing', async () => {
    const version = await detectInstalledVersion('react', {
      cwd: 'fixtures/npm-project-no-modules',
    });
    expect(version).toBe('18.2.0');
  });

  it('should prioritize node_modules over lockfile', async () => {
    // node_modules has 18.2.0, lockfile has 18.1.0
    const version = await detectInstalledVersion('react', {
      cwd: 'fixtures/mismatched-versions',
    });
    expect(version).toBe('18.2.0');
  });
});
```

### Registry Client Tests (Real APIs)

```typescript
/**
 * Integration tests with REAL registry APIs
 *
 * These tests make actual network calls to npm/PyPI/crates.io
 * Run with: INTEGRATION_TESTS=true pnpm test
 */
describe('NpmClient (integration)', () => {
  it.skipUnless(process.env.INTEGRATION_TESTS,
    'should resolve react to facebook/react', async () => {
    const result = await resolveNpmPackage('react', '18.2.0');
    expect(result.repoUrl).toBe('https://github.com/facebook/react');
    expect(result.gitRef).toBe('v18.2.0');
  });

  it.skipUnless(process.env.INTEGRATION_TESTS,
    'should handle scoped packages', async () => {
    const result = await resolveNpmPackage('@babel/core', '7.23.0');
    expect(result.repoUrl).toBe('https://github.com/babel/babel');
    expect(result.gitRef).toBe('v7.23.0');
  });

  it.skipUnless(process.env.INTEGRATION_TESTS,
    'should use version-specific repository URL if available', async () => {
    // Some packages have different repos for different versions
    const result = await resolveNpmPackage('some-package', '1.0.0');
    expect(result.repoUrl).toBeTruthy();
    expect(result.gitRef).toBe('v1.0.0');
  });
});

describe('PyPIClient (integration)', () => {
  it.skipUnless(process.env.INTEGRATION_TESTS,
    'should resolve requests to kennethreitz/requests', async () => {
    const result = await resolvePyPiPackage('requests', '2.31.0');
    expect(result.repoUrl).toBe('https://github.com/psf/requests');
    expect(result.gitRef).toBe('v2.31.0');
  });
});

describe('CratesClient (integration)', () => {
  it.skipUnless(process.env.INTEGRATION_TESTS,
    'should resolve serde to serde-rs/serde', async () => {
    const result = await resolveCrate('serde', '1.0.0');
    expect(result.repoUrl).toBe('https://github.com/serde-rs/serde');
    expect(result.gitRef).toBe('v1.0.0');
  });
});
```

**Test configuration:**

Add to `vitest.config.ts`:
```typescript
export default defineConfig({
  test: {
    // Skip integration tests by default
    testIgnore: () => {
      if (!process.env.INTEGRATION_TESTS) {
        return ['**/*.integration.test.ts'];
      }
      return [];
    }
  }
});
```

**Package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest",                               // Unit tests only (fast)
    "test:integration": "INTEGRATION_TESTS=true vitest",  // Integration tests
    "test:all": "vitest --run"                     // All tests
  }
}
```

---

## Implementation Order

### Sprint 1: Lockfile Parsing

- [ ] Create lockfile parser modules
- [ ] Implement package-lock.json parser (v6 and v7+)
- [ ] Implement pnpm-lock.yaml parser (v5-v9)
- [ ] Implement yarn.lock parser (v1 and Berry)
- [ ] Add package.json fallback
- [ ] Write comprehensive tests with fixtures
- [ ] Test with real-world lockfiles

### Sprint 2: Registry Integration

- [ ] Create registry client modules
- [ ] Implement npm registry client
- [ ] Implement PyPI client
- [ ] Implement crates.io client
- [ ] Add URL normalization
- [ ] Write tests with mocked APIs
- [ ] Test with real packages

### Sprint 3: Path Resolution

- [ ] Update resolve-path module
- [ ] Integrate version detection
- [ ] Integrate registry clients
- [ ] Handle repo directory (monorepo subpackages)
- [ ] Write integration tests
- [ ] Test end-to-end flow

### Sprint 4: CLI Integration

- [ ] Update src-gate.ts
- [ ] Add --cwd option
- [ ] Add --verbose logging
- [ ] Handle errors gracefully
- [ ] Write CLI tests
- [ ] Document usage

---

## Success Criteria

✅ **Given:** A project with `pnpm-lock.yaml` containing `react@18.2.0`

✅ **When:** `src-gate path react --cwd /path/to/project`

✅ **Then:** Outputs `/Users/user/src-gate/repos/github.com/facebook/react/v18.2.0`

✅ **And:** The path can be used immediately with src-gate's virtual filesystem

✅ **And:** No actual cloning occurs (lazy lookup by NFS gateway)

---

## Key Differences from opensrc

| Aspect                 | opensrc                            | src-gate                           |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| **Cache location**     | `~/.opensrc/repos/`                | `~/src-gate/repos/`                |
| **Access method**      | Clones repositories                | Virtual NFS mount                  |
| **When files appear**  | After clone                        | On-demand (lazy)                   |
| **Git operation**      | Full clone                         | Git tree fetch                     |
| **Path format**        | `{host}/{owner}/{repo}/{version}/` | `{host}/{owner}/{repo}/{git-ref}/` |
| **Version resolution** | ✅ Implemented                     | 🔨 To implement                    |
| **Registry APIs**      | ✅ Implemented                     | 🔨 To implement                    |

---

This plan provides a clear roadmap to implement proper package resolution for src-gate, following opensrc's proven approach while adapting to src-gate's unique virtual filesystem architecture.
