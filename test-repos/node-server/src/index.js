import { openLegitFsWithMemoryFs } from '@legit-sdk/core/server';

async function main() {
  console.log(
    '🚀 Starting Node.js server example with @legit-sdk/core/server...\n'
  );

  try {
    // Initialize LegitFS with in-memory filesystem
    console.log('📦 Initializing LegitFS with memfs...');
    const legitFs = await openLegitFsWithMemoryFs({
      gitRoot: '/',
    });
    console.log('✅ LegitFS initialized\n');

    // Create and write a file
    console.log('📝 Creating test file...');
    const testContent =
      'Hello from Node.js server!\nThis is a test file created with @legit-sdk/core/server.';
    await legitFs.promises.writeFile('/test.txt', testContent, 'utf8');
    console.log('✅ File written\n');

    // Read the file back
    console.log('📖 Reading file back...');
    const content = await legitFs.promises.readFile('/test.txt', 'utf8');
    console.log('Content:', content);
    console.log();

    // List directory contents
    console.log('📂 Listing root directory...');
    const files = await legitFs.promises.readdir('/', 'utf8');
    console.log('Files:', files);
    console.log();

    // Get current branch
    console.log('🌿 Getting current branch...');
    const branch = await legitFs.getCurrentBranch();
    console.log('Current branch:', branch);
    console.log();

    console.log('✅ All operations completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
