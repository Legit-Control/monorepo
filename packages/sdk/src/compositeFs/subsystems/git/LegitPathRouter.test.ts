import { describe, it, expect } from 'vitest';
import { LegitPathRouter } from './LegitPathRouter.js';
import { VirtualFileDefinition } from './virtualFiles/gitVirtualFiles.js';

// Mock VirtualFileDefinition objects
const stub = async () => undefined;
const stubStats = async () =>
  ({
    isFile: () => true,
    isDirectory: () => false,
    size: 0,
    mode: 0,
    mtime: new Date(),
    ctime: new Date(),
    atime: new Date(),
    birthtime: new Date(),
  }) as any;
const vfd = {
  noAdditionalFiles: {
    type: 'directory',
    rootType: 'folder',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
  listBranches: {
    type: 'listBranches',
    rootType: 'folder',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
  branchFile: {
    type: 'branchFile',
    rootType: 'folder',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
  branchHead: {
    type: 'branchHead',
    rootType: 'file',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
  branchTip: {
    type: 'branchTip',
    rootType: 'file',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
  branchOperation: {
    type: 'branchOperation',
    rootType: 'file',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
  listCommits: {
    type: 'listCommits',
    rootType: 'file',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
  commitsTwoChars: {
    type: 'commitsTwoChars',
    rootType: 'folder',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
  commitsThirtyEightChars: {
    type: 'commitsThirtyEightChars',
    rootType: 'folder',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
  commitFile: {
    type: 'commitFile',
    rootType: 'folder',

    getFile: stub,
    getStats: stubStats,
    rename: stub,
    mkdir: stub,
  },
} satisfies Record<string, VirtualFileDefinition>;

describe('createRouteMatcher', () => {
  // a handler resolves the files/folders in a tree
  // chrildren are sub paths

  //   [[filepath]]: /docs or /docs/abc

  // [...filepath]: /docs/abc/def (at least one)

  // [[...filepath]]: /docs, /docs/abc, /docs/abc/def

  const router = new LegitPathRouter({
    // .legit/branches
    branches: {
      // '.' special case for folder entry
      '.': vfd.listBranches!,
      // branch name is not optional (single brackets [parameter_name]) for all sub handlers
      '[branch-name]': {
        '.legit': {
          head: vfd.branchHead,
          tip: vfd.branchTip,
          operation: vfd.branchOperation,
        },
        // filepath is optional - could be undefined for root
        // .legit/branches/main/src/utils.ts
        '[[...filepath]]': vfd.branchFile,
      },
    },
    commits: {
      // '.' special case for folder entry

      '.': vfd.commitsTwoChars,
      // commit char is not optional (single brackets [parameter_name]) for all sub handlers
      '[sha_1_1_2]': {
        '.': vfd.commitsThirtyEightChars,
        // commit char is not optional (single brackets [parameter_name]) for all sub handlers
        '[sha1_3__40]': {
          // filepath is optional - could be undefined for root
          '[[...filepath]]': vfd.commitFile,
        },
      },
    },
  });

  it('matches literal route', () => {
    const result = router.match('branches');
    expect(result?.handler).toBe(vfd.listBranches);
  });

  it('matches branch file with catch-all', () => {
    const result = router.match('branches/main/src/utils.ts');
    expect(result?.handler).toBe(vfd.branchFile);
    expect(result?.params).toEqual({
      'branch-name': 'main',
      filepath: 'src/utils.ts',
    });
  });

  it('matches branch root', () => {
    const result = router.match('branches/main/');
    expect(result?.handler).toBe(vfd.branchFile);
    expect(result?.params).toEqual({
      'branch-name': 'main',
    });
  });

  it('matches branch head route', () => {
    const result = router.match('branches/dev/.legit/head');
    expect(result?.handler).toBe(vfd.branchHead);
    expect(result?.params).toEqual({
      'branch-name': 'dev',
    });
  });

  it('matches branch tip route', () => {
    const result = router.match('branches/feature-x/.legit/tip');
    expect(result?.handler).toBe(vfd.branchTip);
    expect(result?.params).toEqual({
      'branch-name': 'feature-x',
    });
  });

  it('matches commit list handler', () => {
    const result = router.match('commits');
    expect(result?.handler.type).toBe(vfd.commitsTwoChars?.type);
    expect(result?.params).toEqual({});
  });

  it('matches commit list handler with leading /', () => {
    const result = router.match('commits/');
    expect(result?.handler.type).toBe(vfd.commitsTwoChars?.type);
    expect(result?.params).toEqual({});
  });

  it('matches commit file with multi-part sha and filepath', () => {
    const result = router.match('commits/ab/def123/src/index.ts');
    expect(result?.handler).toBe(vfd.commitFile);
    expect(result?.params).toEqual({
      sha_1_1_2: 'ab',
      sha1_3__40: 'def123',
      filepath: 'src/index.ts',
    });
  });

  it('returns null for unknown route', () => {
    const result = router.match('/some/invalid/path.ts');
    expect(result).toBeUndefined();
  });

  it('decodes URL-encoded values in params', () => {
    const result = router.match('branches/feature%2Flogin/src/index.ts');
    expect(result?.params['branch-name']).toBe('feature/login');
  });
});
