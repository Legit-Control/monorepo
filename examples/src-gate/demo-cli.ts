#!/usr/bin/env node

/**
 * Demo script to showcase the new resolvePackageWithVersion functionality
 *
 * This demonstrates the integration of:
 * 1. Lockfile version detection
 * 2. Registry API resolution
 * 3. Path construction
 */

import { resolvePackageWithVersion } from './lib/resolve-path/index.js';
import * as path from 'node:path';

const basePath = path.join(process.env.HOME || '', '.src-gate');
const fixturesDir = './lib/resolve-version/__tests__/fixtures';

async function demo() {
  console.log('🚀 src-gate Package Resolution Demo\n');
  console.log('=========================================\n');

  // Example 1: Resolve react with version detection from lockfile
  console.log('1️⃣  Resolving "react" (version detected from lockfile)');
  console.log('   Command: src-gate path react --cwd .');
  try {
    const result = await resolvePackageWithVersion('react', {
      cwd: fixturesDir,
      basePath,
    });
    console.log('   ✅ Success!');
    console.log(`   Package: ${result.spec}`);
    console.log(`   Version: ${result.version}`);
    console.log(`   Git Ref: ${result.gitRef}`);
    console.log(`   Registry: ${result.registry}`);
    console.log(`   Path: ${result.path}`);
  } catch (error) {
    console.log('   ❌ Error:', (error as Error).message);
  }
  console.log();

  // Example 2: Resolve with explicit version
  console.log('2️⃣  Resolving "react@18.2.0" (explicit version)');
  console.log('   Command: src-gate path react@18.2.0');
  try {
    const result = await resolvePackageWithVersion('react@18.2.0', {
      cwd: fixturesDir,
      basePath,
    });
    console.log('   ✅ Success!');
    console.log(`   Path: ${result.path}`);
  } catch (error) {
    console.log('   ❌ Error:', (error as Error).message);
  }
  console.log();

  // Example 3: Resolve scoped package
  console.log('3️⃣  Resolving "@types/react" (scoped package)');
  console.log('   Command: src-gate path @types/react');
  try {
    const result = await resolvePackageWithVersion('@types/react', {
      cwd: fixturesDir,
      basePath,
    });
    console.log('   ✅ Success!');
    console.log(`   Package: ${result.spec}`);
    console.log(`   Version: ${result.version}`);
    console.log(`   Path: ${result.path}`);
  } catch (error) {
    console.log('   ❌ Error:', (error as Error).message);
  }
  console.log();

  // Example 4: Resolve repo spec
  console.log('4️⃣  Resolving "facebook/react" (repo spec)');
  console.log('   Command: src-gate path facebook/react');
  try {
    const result = await resolvePackageWithVersion('facebook/react', {
      basePath,
    });
    console.log('   ✅ Success!');
    console.log(`   Registry: ${result.registry}`);
    console.log(`   Path: ${result.path}`);
  } catch (error) {
    console.log('   ❌ Error:', (error as Error).message);
  }
  console.log();

  // Example 5: Resolve repo spec with git ref
  console.log('5️⃣  Resolving "vercel/next.js@v14.0.0" (repo with git ref)');
  console.log('   Command: src-gate path vercel/next.js@v14.0.0');
  try {
    const result = await resolvePackageWithVersion('vercel/next.js@v14.0.0', {
      basePath,
    });
    console.log('   ✅ Success!');
    console.log(`   Path: ${result.path}`);
  } catch (error) {
    console.log('   ❌ Error:', (error as Error).message);
  }
  console.log();

  console.log('=========================================');
  console.log('✨ Demo complete!');
  console.log();
  console.log('Note: This demo makes REAL API calls to npm registry.');
  console.log('      Version detection reads from lockfiles in:', fixturesDir);
}

demo().catch(console.error);
