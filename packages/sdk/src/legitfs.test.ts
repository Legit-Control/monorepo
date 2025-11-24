import { describe, it, expect, beforeEach } from 'vitest';
import { Volume, createFsFromVolume } from 'memfs';
import * as isogit from 'isomorphic-git';
import { openLegitFs } from './legitfs.js';
import fs from 'fs';

const repoPath = '/repo';
const files = {
  '/a.txt': 'A file',
  '/f/b.txt': 'B file',
  '/f/c.txt': 'C file',
};

// .legit/branches/main/.legit/operation <- new commit may also creates the operation branch if not exists
// creates the branch legit____main-operation -> commits with operation in commit message
// mv('legit____main-operation', 'legit__my_awesem_branch_name__main-operation)
// writeFile('.legit/branches/main/.legit/metaname', 'my awesome path name')

let memfs: any;
let legitfs: ReturnType<typeof openLegitFs>;
let secondLegitfs: ReturnType<typeof openLegitFs>;

async function setupRepo() {
  memfs = createFsFromVolume(
    Volume.fromNestedJSON({
      [repoPath]: {
        'a.txt': files['/a.txt'],
        f: {
          'b.txt': files['/f/b.txt'],
          'c.txt': files['/f/c.txt'],
        },
        '.git': {},
      },
    })
  );

  await isogit.init({ fs: memfs, dir: repoPath, defaultBranch: 'main' });
  await isogit.add({ fs: memfs, dir: repoPath, filepath: 'a.txt' });
  await isogit.add({ fs: memfs, dir: repoPath, filepath: 'f/b.txt' });
  await isogit.add({ fs: memfs, dir: repoPath, filepath: 'f/c.txt' });
  await isogit.commit({
    fs: memfs,
    dir: repoPath,
    message: 'Initial commit',
    author: { name: 'Test', email: 'test@example.com' },
  });
}

describe('openLegitFs', () => {
  beforeEach(async () => {
    await setupRepo();
    legitfs = openLegitFs(memfs, repoPath);
    secondLegitfs = openLegitFs(memfs, repoPath, 'main', true);
  });

  it('should read files from branch', async () => {
    const mainBranchPath = `${repoPath}/.legit/branches/main/a.txt`;
    const handle = await legitfs.promises.open(mainBranchPath, 'r');
    const buffer = Buffer.alloc(6);
    const { bytesRead } = await handle.read(buffer, 0, 6, 0);
    expect(buffer.toString('utf-8', 0, bytesRead)).toBe('A file');
    await handle.close();
  });

  it('should list files in branch folder', async () => {
    const entries = await legitfs.promises.readdir(
      `${repoPath}/.legit/branches/main/f`
    );
    expect(entries).toContain('b.txt');
    expect(entries).toContain('c.txt');
  });

  it('should stat and lstat files', async () => {
    const stats = await legitfs.promises.stat(
      `${repoPath}/.legit/branches/main/a.txt`
    );
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBe(files['/a.txt'].length);
    const lstats = await legitfs.promises.lstat(
      `${repoPath}/.legit/branches/main/a.txt`
    );
    expect(lstats.isFile()).toBe(true);
  });

  it('should write a new file to branch', async () => {
    const newFilePath = `${repoPath}/.legit/branches/main/new.txt`;
    await legitfs.promises.writeFile(newFilePath, 'New file');
    const content = await legitfs.promises.readFile(newFilePath, 'utf-8');
    expect(content).toBe('New file');
  });

  it('should override the file content and truncate the file if needed', async () => {
    const newFilePath = `${repoPath}/.legit/branches/main/new.txt`;
    await legitfs.promises.writeFile(newFilePath, 'Content before truncate');
    const contentBefor = await legitfs.promises.readFile(newFilePath, 'utf-8');
    expect(contentBefor).toBe('Content before truncate');

    await legitfs.promises.writeFile(newFilePath, 'Content after');
    const contentAfter = await legitfs.promises.readFile(newFilePath, 'utf-8');
    expect(contentAfter).toBe('Content after');
  });

  it('should add a keep file when removing the last file in a folder', async () => {
    const folderAPath = `${repoPath}/.legit/branches/main/folderA`;
    const folderBPath = `${folderAPath}/folderB`;
    /**
     * folderA/
     * └── folderB/
     *     └── myfile.txt <- remove should create a .keep file to keep the folder alive
     */
    await legitfs.promises.mkdir(folderBPath, { recursive: true });

    let folderContentFolderA =
      await secondLegitfs.promises.readdir(folderAPath);
    expect(
      folderContentFolderA,
      'Keep file should not exist in folderA only in folderB'
    ).not.toContain('.keep');

    let folderContentFolderB =
      await secondLegitfs.promises.readdir(folderBPath);
    expect(
      folderContentFolderB,
      'Keep file should  exist for folderB'
    ).toContain('.keep');

    await legitfs.promises.writeFile(`${folderBPath}/myfile.txt`, 'content');

    folderContentFolderB = await secondLegitfs.promises.readdir(folderBPath);
    expect(
      folderContentFolderB,
      'Keep file should be gone after adding a file to folderB'
    ).not.toContain('.keep');

    await legitfs.promises.unlink(`${folderBPath}/myfile.txt`);

    folderContentFolderB = await secondLegitfs.promises.readdir(folderBPath);
    expect(
      folderContentFolderB,
      'Keep file should be added after removing last file from folderB'
    ).toContain('.keep');

    await legitfs.promises.rmdir(`${folderBPath}`);
  });

  it('should create, rename, remove and move folders and files in branch', async () => {
    let commits = async () =>
      await isogit.log({ fs: memfs, dir: repoPath, depth: 100 });

    expect((await commits()).length).toBe(1);

    // Create folder
    const folderPath = `${repoPath}/.legit/branches/main/newfolder/subfolder`;
    await legitfs.promises.mkdir(folderPath);
    const stats = await legitfs.promises.stat(folderPath);
    expect(stats.isDirectory()).toBe(true);

    expect((await commits()).length).toBe(2);

    // Verify folder is empty
    const folderContents = await secondLegitfs.promises.readdir(folderPath);
    expect(folderContents, 'Keep file should exists').toContain('.keep');

    const folderContentsWithKeep = await legitfs.promises.readdir(folderPath);
    expect(
      folderContentsWithKeep,
      'The created .keep file should not be visible from legitFs'
    ).toHaveLength(0);

    // Write a file into the folder
    const testFilePath = `${folderPath}/test.txt`;
    await legitfs.promises.writeFile(testFilePath, 'content');
    const fileContent = await legitfs.promises.readFile(testFilePath, 'utf-8');
    expect(fileContent).toBe('content');

    const folderContentsAfterFileWrite =
      await legitfs.promises.readdir(folderPath);
    expect(
      folderContentsAfterFileWrite,
      'The created .keep file should not be visible from legitFs'
    ).toHaveLength(1);

    expect((await commits()).length).toBe(3);

    // Rename folder
    const renamedFolder = `${repoPath}/.legit/branches/main/renamedfolder`;
    await legitfs.promises.rename(folderPath, renamedFolder);
    const statsRenamed = await legitfs.promises.stat(renamedFolder);
    expect(statsRenamed.isDirectory()).toBe(true);

    const folderBeforeRenamed = await legitfs.promises
      .access(folderPath)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
    expect(folderBeforeRenamed).toBe(false);

    expect((await commits()).length).toBe(4);

    // Move the test file into the root folder
    const testFileInFolder = `${renamedFolder}/test.txt`;
    const testFileInRoot = `${repoPath}/.legit/branches/main/test.txt`;
    await legitfs.promises.rename(testFileInFolder, testFileInRoot);
    const movedContent = await legitfs.promises.readFile(
      testFileInRoot,
      'utf-8'
    );
    expect(movedContent).toBe('content');

    expect((await commits()).length).toBe(5);

    // TODO this stat is working on the memfs - while
    const statsRenamedAferMove = await legitfs.promises.stat(renamedFolder);
    expect(statsRenamedAferMove.isDirectory()).toBe(true);

    // Move file into folder
    const fileInRoot = `${repoPath}/.legit/branches/main/a.txt`;
    const fileInFolder = `${renamedFolder}/a.txt`;
    await legitfs.promises.rename(fileInRoot, fileInFolder);
    const content = await legitfs.promises.readFile(fileInFolder, 'utf-8');
    expect(content).toBe('A file');

    expect((await commits()).length).toBe(6);

    // Rerename folder
    const rerenamedFolder = `${repoPath}/.legit/branches/main/rerenamedfolder`;
    await legitfs.promises.rename(renamedFolder, rerenamedFolder);
    const statsRerenamed = await legitfs.promises.stat(rerenamedFolder);
    expect(statsRerenamed.isDirectory()).toBe(true);

    expect((await commits()).length).toBe(7);

    // Move file back to root
    const fileBackToRoot = `${repoPath}/.legit/branches/main/a.txt`;
    const fileInRereNamedFolder = `${rerenamedFolder}/a.txt`;
    await legitfs.promises.rename(fileInRereNamedFolder, fileBackToRoot);
    const contentBack = await legitfs.promises.readFile(
      fileBackToRoot,
      'utf-8'
    );

    // Verify folder is empty
    const folderContentsAfterMove = await legitfs.promises.readdir(
      fileInRereNamedFolder
    );
    expect(
      folderContentsAfterMove,
      'The created .keep file should not be visible from legitFs'
    ).toHaveLength(0);

    expect(contentBack).toBe('A file');
    const commitsNow = await commits();
    expect((await commits()).length).toBe(8);
  });

  it('should get consistent stats for the branch folder over time', async () => {
    const legitFolderPath = `${repoPath}/.legit/branches/main`;
    const stats1 = await legitfs.promises.stat(legitFolderPath);
    await new Promise(resolve => setTimeout(resolve, 20));
    const legitFolderPath2 = `${repoPath}/.legit/branches/main/.legit`;
    const stats12 = await legitfs.promises.stat(legitFolderPath2);
    const stats2 = await legitfs.promises.stat(legitFolderPath);

    expect(stats1.isDirectory()).toBe(true);
    expect(stats2.isDirectory()).toBe(true);
    expect(stats1.ino).toBe(stats2.ino);
    expect(stats1.size).toBe(stats2.size);
    expect(stats1.mtimeMs).toBe(stats2.mtimeMs);
  });

  it('should get consistent stats for .legit folder in main branch over time', async () => {
    const legitFolderPath = `${repoPath}/.legit/branches/main`;
    const stats1 = await legitfs.promises.stat(legitFolderPath);
    await new Promise(resolve => setTimeout(resolve, 20));
    const stats2 = await legitfs.promises.stat(legitFolderPath);

    expect(stats1.isDirectory()).toBe(true);
    expect(stats2.isDirectory()).toBe(true);
    expect(stats1.ino).toBe(stats2.ino);
    expect(stats1.size).toBe(stats2.size);
    expect(stats1.mtimeMs).toBe(stats2.mtimeMs);
  });

  it('should not list hidden files in branch', async () => {
    const entries = await legitfs.promises.readdir(
      `${repoPath}/.legit/branches/main`
    );
    expect(entries).not.toContain('.git');
  });

  it('should delete files in branch', async () => {
    const filePath = `${repoPath}/.legit/branches/main/a.txt`;
    await legitfs.promises.unlink(filePath);
    await expect(legitfs.promises.stat(filePath)).rejects.toThrow();
  });

  it('should handle hidden and ephemeral files', async () => {
    // Create hidden file
    const hiddenFile = `${repoPath}/.git/refs/heads/main`;
    await expect(
      legitfs.promises.writeFile(hiddenFile, 'hidden')
    ).rejects.toThrow(/hidden/i);
    // Create ephemeral file
    const ephemeralFile = `${repoPath}/.legit/branches/main/._temp`;
    await legitfs.promises.writeFile(ephemeralFile, 'ephemeral');
    await expect(memfs.promises.open(ephemeralFile, 'r')).rejects.toThrow(
      /ENOENT/i
    );
  });

  it('should reflect a new commit in the head file', async () => {
    const filePath = `${repoPath}/.legit/branches/main/a.txt`;
    const headFilePath = `${repoPath}/.legit/branches/main/.legit/head`;

    const initialHead = await legitfs.promises.readFile(headFilePath, 'utf-8');
    expect(initialHead).toMatch(/^[0-9a-f]{40}$/);

    // Make a new commit by writing a new file
    await legitfs.promises.writeFile(
      `${repoPath}/.legit/branches/main/newfile.txt`,
      'New file content'
    );

    const newHead = await legitfs.promises.readFile(headFilePath, 'utf-8');
    expect(newHead).toMatch(/^[0-9a-f]{40}$/);
    expect(newHead).not.toBe(initialHead);
  });

  it('should reflect a new commit in the head file when using open and filehandler', async () => {
    const filePath = `${repoPath}/.legit/branches/main/a.txt`;
    const headFilePath = `${repoPath}/.legit/branches/main/.legit/head`;

    const headFileHandler = await legitfs.promises.open(headFilePath, 'r');
    const headBytes = new Uint8Array(40);
    const bytesRead = await headFileHandler.read(headBytes, 0, 40, 0);

    // Make a new commit by writing a new file
    await legitfs.promises.writeFile(
      `${repoPath}/.legit/branches/main/newfile.txt`,
      'New file content'
    );

    const headBytesAfter = new Uint8Array(40);
    const bytesReadAfter = await headFileHandler.read(headBytesAfter, 0, 40, 0);

    const headStr = Buffer.from(headBytes).toString('utf-8');
    const headStrAfter = Buffer.from(headBytesAfter).toString('utf-8');

    expect(headStr).not.toBe(headStrAfter);
  });

  it('should reflect the new content of a file - updated by another process when using open and filehandler', async () => {
    const filePath = `${repoPath}/.legit/branches/main/a.txt`;
    const headFilePath = `${repoPath}/.legit/branches/main/.legit/head`;

    const contentAfter = 'A file updated';

    memfs.promises.writeFile(`${repoPath}/a.txt`, contentAfter);

    // create a file handler that keeps the file open over the commit
    const aFileHandler = await legitfs.promises.open(filePath, 'r');
    const aFileContent = Buffer.alloc(6);
    await aFileHandler.read(aFileContent, 0, 6, 0);
    expect(aFileContent.toString('utf-8')).toBe('A file');

    await isogit.add({ fs: memfs, dir: repoPath, filepath: 'a.txt' });
    await isogit.commit({
      fs: memfs,
      dir: repoPath,
      message: 'Update a.txt',
      author: { name: 'Test', email: 'test@example.com' },
    });

    const aFileContentAfter = Buffer.alloc(14);
    await aFileHandler.read(aFileContentAfter, 0, 14, 0);
    expect(aFileContentAfter.toString('utf-8')).toBe('A file updated');
  });

  it('should create a new file in the branch', async () => {
    const newFilePath = `${repoPath}/.legit/branches/main/created.txt`;
    const content = 'This is a new file';

    const exists = await legitfs.promises
      .stat(newFilePath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(false);

    await legitfs.promises.writeFile(newFilePath, content);
    const readContent = await legitfs.promises.readFile(newFilePath, 'utf-8');
    expect(readContent).toBe(content);
  });

  it('should create a new file in the branch using open with wx flag', async () => {
    const newFilePath = `${repoPath}/.legit/branches/main/created-wx.txt`;
    const content = 'This is a new file (wx)';

    const exists = await legitfs.promises
      .stat(newFilePath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(false);

    const handle = await legitfs.promises.open(newFilePath, 'wx');
    await handle.write(Buffer.from(content, 'utf-8'));
    await handle.close();

    const readContent = await legitfs.promises.readFile(newFilePath, 'utf-8');
    expect(readContent).toBe(content);
  });

  it('should not create a commit when writing an ephemeral file matching .~lock.* pattern', async () => {
    const getCommitCount = async () =>
      (await isogit.log({ fs: memfs, dir: repoPath, depth: 100 })).length;

    const initialCommits = await getCommitCount();

    // Write ephemeral file at repo root
    const ephemeralRoot = `${repoPath}/.~lock.test1`;
    await legitfs.promises.writeFile(ephemeralRoot, 'ephemeral root');
    expect(await legitfs.promises.readFile(ephemeralRoot, 'utf-8')).toBe(
      'ephemeral root'
    );

    // No new commit should be created
    const afterCommits = await getCommitCount();
    expect(afterCommits).toBe(initialCommits);

    // Write ephemeral file in legit branch
    const ephemeralBranch = `${repoPath}/.legit/branches/main/.~lock.test1`;
    await legitfs.promises.writeFile(ephemeralBranch, 'ephemeral branch');
    expect(await legitfs.promises.readFile(ephemeralBranch, 'utf-8')).toBe(
      'ephemeral branch'
    );

    // No new commit should be created
    const afterCommits2 = await getCommitCount();
    expect(afterCommits2).toBe(initialCommits);
  });

  it('should create operation commits with correct parentage and messages', async () => {
    const textFilePath = `${repoPath}/.legit/branches/main/text.txt`;
    const operationFilePath = `${repoPath}/.legit/branches/main/.legit/operation`;
    const operationBranch = `refs/heads/${'legit/__main-operation'}`;

    // 1. Create text.txt in main branch
    await legitfs.promises.writeFile(textFilePath, 'hello world');

    // Get the commit after writing text.txt
    const mainCommits = await isogit.log({
      fs: memfs,
      dir: repoPath,
      ref: 'main',
      depth: 2,
    });
    const mainCommit1 = mainCommits[0]?.oid;

    // 2. Write "first operation" to operation file
    await legitfs.promises.writeFile(operationFilePath, 'first operation');

    const branches = await isogit.listBranches({ fs: memfs, dir: repoPath });
    expect(branches).toContain('main');
    expect(branches.some(b => b.endsWith('_main-operation'))).toBe(true);

    // Get the first operation commit
    const opCommits1 = await isogit.log({
      fs: memfs,
      dir: repoPath,
      ref: operationBranch,
      depth: 1,
    });
    expect(opCommits1[0]?.commit.message.trim()).toBe('first operation');
    const opCommit1 = opCommits1[0]?.oid;
    expect(opCommits1[0]?.commit.parent[0]).toBe(mainCommit1);

    // Read the operation file and expect its content is the commit sha of opCommits1[0]?.commit
    const operationFileContent = await legitfs.promises.readFile(
      operationFilePath,
      'utf-8'
    );
    expect(operationFileContent.trim()).toBe(opCommits1[0]?.oid);

    // 3. Overwrite operation file with "second operation"
    await legitfs.promises.writeFile(operationFilePath, 'second operation');

    // Get the second operation commit
    const opCommits2 = await isogit.log({
      fs: memfs,
      dir: repoPath,
      ref: operationBranch,
      depth: 2,
    });
    expect(opCommits2[0]?.commit.message.trim()).toBe('second operation');
    const opCommit2 = opCommits2[0]?.oid;
    expect(opCommits2[0]?.commit.parent[0]).toBe(opCommit1);

    // 4. Update text.txt with "hello legit"
    await legitfs.promises.writeFile(textFilePath, 'hello legit');
    const mainCommits2 = await isogit.log({
      fs: memfs,
      dir: repoPath,
      ref: 'main',
      depth: 1,
    });
    const mainCommit2 = mainCommits2[0]?.oid;

    // 5. Write "third operation" to operation file
    await legitfs.promises.writeFile(operationFilePath, 'third operation');

    // Get the third operation commit
    const opCommits3 = await isogit.log({
      fs: memfs,
      dir: repoPath,
      ref: operationBranch,
      depth: 3,
    });
    expect(opCommits3[0]?.commit.message.trim()).toBe('third operation');
    const opCommit3 = opCommits3[0]?.oid;
    // Should have two parents: first is opCommit2, second is mainCommit2
    expect(opCommits3[0]?.commit.parent[0]).toBe(opCommit2);
    expect(opCommits3[0]?.commit.parent[1]).toBe(mainCommit2);

    // Read the operation history file and check if all operations are present
    const operationHistoryPath = `${repoPath}/.legit/branches/main/.legit/operationHistory`;
    const operationHistoryContent = await legitfs.promises.readFile(
      operationHistoryPath,
      'utf-8'
    );
    expect(operationHistoryContent).toContain('first operation');
    expect(operationHistoryContent).toContain('second operation');
    expect(operationHistoryContent).toContain('third operation');
  });

  it.todo('should handle undo and redo operations', async () => {
    const textFilePath = `${repoPath}/.legit/branches/main/text.txt`;
    const operationFilePath = `${repoPath}/.legit/branches/main/.legit/operation`;
    const operationBranch = `refs/heads/${'legit____main-operation'}`;

    // Create text.txt in main branch
    // await legitfs.promises.writyxeFile(textFilePath, 'hello world');

    const undoFilePath = `${repoPath}/.legit/branches/main/.legit/undo`;
    const undoHash = await legitfs.promises.readFile(undoFilePath, 'utf-8');
    expect(undoHash.trim()).toBe('');

    await legitfs.promises.writeFile(textFilePath, 'hello legit');

    // read the undo file to see if we can undo
    // read the redo file - it should be empty at this point
    const redoFilePath = `${repoPath}/.legit/branches/main/.legit/redo`;
    const redoHash = await legitfs.promises.readFile(redoFilePath, 'utf-8');
    expect(redoHash.trim()).toBe('');

    // now perform the undo by writing the undo hash to the operation file
    const headFilePath = `${repoPath}/.legit/branches/main/.legit/head`;
    await legitfs.promises.writeFile(headFilePath, `${undoHash.trim()}`);

    // read the undo file to see if we can undo
    const updatedUndoHash = await legitfs.promises.readFile(
      undoFilePath,
      'utf-8'
    );
    // hash should be different now
    expect(updatedUndoHash.trim()).not.toBe(undoHash.trim());

    const updatedRedoHash = await legitfs.promises.readFile(
      redoFilePath,
      'utf-8'
    );

    expect(redoHash.trim()).toBe(undoHash);
  });

  it('should allow reading and setting the head file to change branch state', async () => {
    const textFilePath = `${repoPath}/.legit/branches/main/text.txt`;
    const headFilePath = `${repoPath}/.legit/branches/main/.legit/head`;

    // Create initial file and get first commit
    await legitfs.promises.writeFile(textFilePath, 'initial content');
    const firstHead = await legitfs.promises.readFile(headFilePath, 'utf-8');
    expect(firstHead).toMatch(/^[0-9a-f]{40}$/);

    // Create second file and get second commit
    await legitfs.promises.writeFile(textFilePath, 'second content');
    const secondHead = await legitfs.promises.readFile(headFilePath, 'utf-8');
    expect(secondHead).toMatch(/^[0-9a-f]{40}$/);
    expect(secondHead).not.toBe(firstHead);

    // Verify both files exist at second commit
    expect(await legitfs.promises.readFile(textFilePath, 'utf-8')).toBe(
      'second content'
    );

    // Set head back to first commit
    await legitfs.promises.writeFile(headFilePath, firstHead);
    const currentHead = await legitfs.promises.readFile(headFilePath, 'utf-8');
    expect(currentHead).toBe(firstHead);

    // Verify only first file exists now
    expect(await legitfs.promises.readFile(textFilePath, 'utf-8')).toBe(
      'initial content'
    );

    // TODO #filehandle add when filehandles are implemented properly
    // await expect(
    //   legitfs.promises.readFile(
    //     `${repoPath}/.legit/branches/main/second.txt`,
    //     'utf-8'
    //   )
    // ).rejects.toThrow();

    // Set head back to second commit
    await legitfs.promises.writeFile(headFilePath, secondHead);

    // Verify both files exist again
    expect(await legitfs.promises.readFile(textFilePath, 'utf-8')).toBe(
      'second content'
    );
  });

  it('should handle invalid commit hash when setting head file', async () => {
    const headFilePath = `${repoPath}/.legit/branches/main/.legit/head`;
    const invalidHash = '0000000000000000000000000000000000000000';

    // Get current valid head
    const validHead = await legitfs.promises.readFile(headFilePath, 'utf-8');
    expect(validHead).toMatch(/^[0-9a-f]{40}$/);

    // Try to set invalid commit hash
    await expect(
      legitfs.promises.writeFile(headFilePath, invalidHash)
    ).rejects.toThrow();

    // Verify head is unchanged
    const currentHead = await legitfs.promises.readFile(headFilePath, 'utf-8');
    expect(currentHead).toBe(validHead);

    // Try with malformed hash (wrong length)
    const malformedHash = '123abc';
    await expect(
      legitfs.promises.writeFile(headFilePath, malformedHash)
    ).rejects.toThrow();

    // Verify head is still unchanged
    const stillCurrentHead = await legitfs.promises.readFile(
      headFilePath,
      'utf-8'
    );
    expect(stillCurrentHead).toBe(validHead);
  });

  it('truncate and write file', async () => {
    const filePath = `${repoPath}/.legit/branches/main/test.txt`;

    // Get current valid head
    await legitfs.promises.writeFile(filePath, 'content');

    const fsHandle = await legitfs.promises.open(filePath, 'a+');

    const statsBefore = await fsHandle.stat();

    expect(statsBefore.size).toBe(7);

    await fsHandle.truncate(Number(0));

    const fsHandle2 = await legitfs.promises.open(filePath, 'a+');

    const statsAfter = await fsHandle.stat();

    expect(statsAfter.size).toBe(0);
    await fsHandle2.close();
  });

  it.todo('should read files from previous commit');
  it.todo('should list files from previous commit');
  it.todo('should handle branch creation and switching');
});
