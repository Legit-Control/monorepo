# Testing Philosophy Update: Real APIs Over Mocks

## The Change

After questioning the testing approach, I've updated the implementation plan to **use real registry APIs instead of mocks** for integration tests.

## Why This Matters

### Problems with Mocking Registry APIs

1. **Mock Drift**: Your mock might not match the real API response format
2. **False Confidence**: Tests pass with mocks but fail in production
3. **Maintenance Burden**: Keep mocks in sync with actual API changes
4. **False Security**: You think you're testing integration, but you're not

### Benefits of Real APIs

1. **True Integration Tests**: Validate actual behavior with npm/PyPI/crates.io
2. **No Mock Drift**: Tests always use current API format
3. **Catches Real Changes**: API format changes break tests immediately (good thing!)
4. **What You Ship**: We're building a package resolver - it should resolve real packages
5. **Stable APIs**: npm, PyPI, and crates.io have stable, versioned, rate-limited public APIs

## The Three-Tier Strategy

### Tier 1: Fast Unit Tests (No Network)
- **What**: Pure functions, parsers, formatters
- **Speed**: ⚡⚡⚡ Instant (milliseconds)
- **Example**: `normalizeRepoUrl()`, `parsePnpmLock()`, `parsePackageSpec()`
- **Run**: Every save during development

```typescript
describe('normalizeRepoUrl', () => {
  it('should remove git+ prefix', () => {
    expect(normalizeRepoUrl('git+https://github.com/owner/repo'))
      .toBe('https://github.com/owner/repo');
  });
});
```

### Tier 2: Integration Tests (Real APIs)
- **What**: Actual registry API calls
- **Speed**: 🐢 Slower (seconds)
- **Example**: `resolveNpmPackage('react', '18.2.0')` → hits real npm registry
- **Run**: Before committing, in CI (with `INTEGRATION_TESTS=true`)

```typescript
describe('NpmClient (integration)', () => {
  it.skipUnless(process.env.INTEGRATION_TESTS,
    'should resolve real packages', async () => {
    const result = await resolveNpmPackage('react', '18.2.0');
    expect(result.repoUrl).toBe('https://github.com/facebook/react');
  });
});
```

### Tier 3: End-to-End Tests
- **What**: Full CLI workflow with real lockfiles + real APIs
- **Speed**: 🐢🐢 Slowest
- **Example**: Run `src-gate path react` in real project
- **Run**: Before releases (with `E2E_TESTS=true`)

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",                                 // Tier 1 only
    "test:integration": "INTEGRATION_TESTS=true vitest run",
    "test:e2e": "E2E_TESTS=true vitest run",
    "test:all": "vitest run"                          // Everything
  }
}
```

## Recommended Test Packages

Use stable, well-known packages:

**npm:**
- `react` → facebook/react
- `zod` → colinhubberts/zod
- `lodash` → lodash/lodash
- `@babel/core` → babel/babel

**PyPI:**
- `requests` → psf/requests
- `flask` → pallets/flask

**crates.io:**
- `serde` → serde-rs/serde

## Comparison: Before vs After

### Before (Mocked)
```typescript
// ❌ Tests pass but production might fail
vi.mock('npm-client', () => ({
  resolvePackageToRepo: async () => ({
    repoUrl: 'https://github.com/facebook/react',  // Assumption!
    gitRef: 'v18.2.0'
  })
}));
```

### After (Real)
```typescript
// ✅ Tests validate actual behavior
it('should resolve react from npm registry', async () => {
  const result = await resolveNpmPackage('react', '18.2.0');
  expect(result.repoUrl).toBe('https://github.com/facebook/react');
});
```

## Files Updated

- `DEEP_UNDERSTANDING_AND_PLAN.md` - Updated testing sections
- Added "Testing Philosophy: Real > Mocked" section
- Updated Registry Client Tests section
- Updated Sprint 2 tasks

## Next Steps

When implementing:
1. Write fast unit tests for parsers (no network)
2. Write integration tests with real APIs (skip by default)
3. Run integration tests before committing
4. Use stable, well-known packages in tests

This approach ensures our tests actually validate that src-gate works with the REAL npm, PyPI, and crates.io registries!
