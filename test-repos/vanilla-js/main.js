import { openLegitFsWithMemoryFs } from '@legit-sdk/core';

// Get DOM elements
const initBtn = document.getElementById('initBtn');
const writeBtn = document.getElementById('writeBtn');
const readBtn = document.getElementById('readBtn');
const listBtn = document.getElementById('listBtn');
const statusEl = document.getElementById('status');
const fileContentEl = document.getElementById('fileContent');
const outputEl = document.getElementById('output');

let legitFs = null;

// Status helper
function setStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

// Output helper
function appendOutput(text) {
  outputEl.textContent += text + '\n';
  outputEl.scrollTop = outputEl.scrollHeight;
}

function clearOutput() {
  outputEl.textContent = '';
}

// Initialize LegitFS
initBtn.addEventListener('click', async () => {
  try {
    setStatus('Initializing LegitFS with memfs...', 'info');
    clearOutput();
    appendOutput('🚀 Initializing LegitFS...');
    
    legitFs = await openLegitFsWithMemoryFs({
      gitRoot: '/',
    });
    
    setStatus('✅ LegitFS initialized successfully!', 'success');
    appendOutput('✅ LegitFS initialized');
    appendOutput(`Current branch: ${await legitFs.getCurrentBranch()}`);
    
    // Enable buttons
    writeBtn.disabled = false;
    readBtn.disabled = false;
    listBtn.disabled = false;
    initBtn.disabled = true;
  } catch (error) {
    setStatus(`❌ Error: ${error.message}`, 'error');
    appendOutput(`❌ Error: ${error.message}`);
    console.error('Initialization error:', error);
  }
});

// Write file
writeBtn.addEventListener('click', async () => {
  if (!legitFs) {
    setStatus('Please initialize LegitFS first', 'error');
    return;
  }
  
  try {
    const content = fileContentEl.value;
    setStatus('Writing file...', 'info');
    clearOutput();
    appendOutput('📝 Writing file...');
    
    await legitFs.promises.writeFile('/test.txt', content, 'utf8');
    
    setStatus('✅ File written successfully!', 'success');
    appendOutput('✅ File written: /test.txt');
    appendOutput(`Content length: ${content.length} characters`);
  } catch (error) {
    setStatus(`❌ Error: ${error.message}`, 'error');
    appendOutput(`❌ Error: ${error.message}`);
    console.error('Write error:', error);
  }
});

// Read file
readBtn.addEventListener('click', async () => {
  if (!legitFs) {
    setStatus('Please initialize LegitFS first', 'error');
    return;
  }
  
  try {
    setStatus('Reading file...', 'info');
    clearOutput();
    appendOutput('📖 Reading file...');
    
    const content = await legitFs.promises.readFile('/test.txt', 'utf8');
    
    fileContentEl.value = content;
    setStatus('✅ File read successfully!', 'success');
    appendOutput('✅ File read: /test.txt');
    appendOutput('--- Content ---');
    appendOutput(content);
    appendOutput('--- End Content ---');
  } catch (error) {
    setStatus(`❌ Error: ${error.message}`, 'error');
    appendOutput(`❌ Error: ${error.message}`);
    console.error('Read error:', error);
  }
});

// List directory
listBtn.addEventListener('click', async () => {
  if (!legitFs) {
    setStatus('Please initialize LegitFS first', 'error');
    return;
  }
  
  try {
    setStatus('Listing directory...', 'info');
    clearOutput();
    appendOutput('📂 Listing root directory...');
    
    const files = await legitFs.promises.readdir('/', 'utf8');
    
    setStatus('✅ Directory listed successfully!', 'success');
    appendOutput('✅ Directory contents:');
    appendOutput(`Files and directories: ${files.length}`);
    files.forEach((file, index) => {
      appendOutput(`  ${index + 1}. ${file}`);
    });
  } catch (error) {
    setStatus(`❌ Error: ${error.message}`, 'error');
    appendOutput(`❌ Error: ${error.message}`);
    console.error('List error:', error);
  }
});

