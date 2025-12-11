#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get project name from command line arguments
const projectName = process.argv[2];

if (!projectName) {
  console.error('Error: Project name is required');
  console.log('Usage: npx @legit-sdk/next-starter <project-name>');
  process.exit(1);
}

// Validate project name (npm package name rules)
const npmNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
if (!npmNameRegex.test(projectName)) {
  console.error(
    'Error: Invalid project name. Project name must be a valid npm package name.'
  );
  console.log(
    'Rules: lowercase letters, numbers, hyphens, underscores, dots, and tildes only'
  );
  process.exit(1);
}

// Find template directory
// When installed via npx, the package is in node_modules
// The script is at .bin/cli.js, so package root is 1 level up
const templateDir = resolve(__dirname, '..');
const packageJsonPath = join(templateDir, 'package.json');

if (!existsSync(packageJsonPath)) {
  console.error('Error: Could not find template directory');
  console.error(`Looked in: ${templateDir}`);
  process.exit(1);
}

// Verify it's the correct package
try {
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  if (pkg.name !== '@legit-sdk/next-starter') {
    console.error('Error: Found package.json but it is not @legit-sdk/next-starter');
    process.exit(1);
  }
} catch (error) {
  console.error('Error: Could not read package.json');
  process.exit(1);
}

// Target directory
const targetDir = resolve(process.cwd(), projectName);

if (existsSync(targetDir)) {
  console.error(`Error: Directory "${projectName}" already exists`);
  process.exit(1);
}

console.log(`Creating new Next.js project: ${projectName}...`);

// Create target directory
mkdirSync(targetDir, { recursive: true });

// Files and directories to copy
const filesToCopy = [
  'app',
  'public',
  'next.config.ts',
  'tsconfig.json',
  'eslint.config.mjs',
  'postcss.config.mjs',
  '.gitignore',
  'README.md',
];

// Copy files
for (const item of filesToCopy) {
  const sourcePath = join(templateDir, item);
  const targetPath = join(targetDir, item);

  if (existsSync(sourcePath)) {
    cpSync(sourcePath, targetPath, { recursive: true });
  }
}

// Read and modify package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// Create new package.json for the project
const newPackageJson = {
  ...packageJson,
  name: projectName,
  version: '0.0.0',
  private: true,
};

// Remove bin field if it exists
delete newPackageJson.bin;

// Remove files field if it exists
delete newPackageJson.files;

// Remove publishConfig if it exists
delete newPackageJson.publishConfig;

// Replace workspace dependencies with published versions
if (newPackageJson.dependencies) {
  if (newPackageJson.dependencies['@legit-sdk/react']?.startsWith('workspace:')) {
    newPackageJson.dependencies['@legit-sdk/react'] = '^0.2.15';
  }
}

// Write new package.json
writeFileSync(
  join(targetDir, 'package.json'),
  JSON.stringify(newPackageJson, null, 2) + '\n'
);

// Handle tsconfig.json path mappings
const tsconfigPath = join(targetDir, 'tsconfig.json');
if (existsSync(tsconfigPath)) {
  try {
    const tsconfigContent = readFileSync(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(tsconfigContent);
    
    // Remove any path mappings that reference local packages
    if (tsconfig.compilerOptions?.paths) {
      const filteredPaths = Object.fromEntries(
        Object.entries(tsconfig.compilerOptions.paths).filter(
          ([, value]) => !Array.isArray(value) || !value.some(v => v.includes('../../'))
        )
      );
      if (Object.keys(filteredPaths).length === 0) {
        delete tsconfig.compilerOptions.paths;
      } else {
        tsconfig.compilerOptions.paths = filteredPaths;
      }
      
      // Remove exclude entries that reference monorepo paths
      if (tsconfig.exclude) {
        tsconfig.exclude = tsconfig.exclude.filter(
          (exclude) => !exclude.includes('../../')
        );
      }
      
      writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');
    }
  } catch (error) {
    console.error('Error parsing tsconfig.json:', error.message);
    console.error('Note: If the file contains comments (// or /* */), please remove them as Node\'s JSON.parse() cannot handle them.');
    process.exit(1);
  }
}

// For new standalone projects, always use npm to avoid workspace detection issues
// This ensures dependencies are installed correctly in the new project directory
// Users can switch to pnpm/yarn later if they prefer
console.log('Installing dependencies with npm...');

// Install dependencies
try {
  execSync('npm install', { stdio: 'inherit', cwd: targetDir });
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}

console.log('\n✅ Project created successfully!');
console.log(`\n📁 Project location: ${targetDir}`);
console.log(`\n🚀 Starting development server...\n`);

// Start dev server
try {
  execSync('npm run dev', { stdio: 'inherit', cwd: targetDir });
} catch (error) {
  // If user stops the server (Ctrl+C), exit gracefully
  if (error.signal === 'SIGINT' || error.signal === 'SIGTERM') {
    console.log('\n\nDevelopment server stopped.');
    process.exit(0);
  }
  console.error('Error starting development server:', error.message);
  process.exit(1);
}
