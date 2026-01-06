import { describe, it, expect } from 'vitest';
import { PathRouter } from './PathRouterRework.js';
import { BaseCompositeSubFs } from './subsystems/BaseCompositeSubFs.js';

// Mock SubFS class for testing
class MockSubFs extends BaseCompositeSubFs {
  constructor(
    public override name: string,
    fsType: 'folder' | 'file' | 'fs'
  ) {
    super({ name, rootPath: '/test' });
    this.fsType = fsType;
  }

  override async responsible(_path: string): Promise<boolean> {
    return true;
  }

  override fileType(): number {
    return 10; // Unique type for copy-on-write
  }
}

describe('PathRouter', () => {
  describe('Legit Sample routes', () => {
    it('should match exact static path', () => {
      const router = new PathRouter(
        {
          // We define the catch all at the very top to enure prioritization works correctly
          '[[...filePath]]': {
            '.': new MockSubFs('[[...filePath]]', 'folder'),
            '.legit': {
              '.': new MockSubFs('[...filePath]/.legit', 'folder'),
              changes: new MockSubFs('[[...filePath]]/.legit/changes', 'file'),
              dublicate: new MockSubFs(
                '[[...filePath]]/.legit/dublicate',
                'file'
              ),
            },
          },
          // this should have a higher prio than [[...filePath]/.legit
          '.legit': {
            '.': new MockSubFs('.legit', 'folder'),
            head: new MockSubFs('.legit/head', 'file'),
            branches: {
              '.': new MockSubFs('.legit/branches', 'folder'),
              '[branchName]': {
                // branch names could include / so this is not a good delimiter here
                '.legit': {
                  '.': new MockSubFs(
                    '.legit/branches/[branchName]/.legit',
                    'folder'
                  ),
                  head: new MockSubFs(
                    '.legit/branches/[branchName]/.legit/head',
                    'file'
                  ),
                },
                '[[...filePath]]': {
                  '.': new MockSubFs(
                    '.legit/branches/[branchName]/[[...filePath]]',
                    'fs'
                  ),
                  // under each subfolder within a branch there should be a .legit folder too
                  '.legit': new MockSubFs(
                    '.legit/branches/[branchName]/[[...filePath]]/.legit',
                    'folder'
                  ),
                },
              },
            },
            commits: {
              '.': new MockSubFs('.legit/commits', 'folder'),
              '[sha_1_1_2]': {
                '.': new MockSubFs('.legit/commits/[sha_1_1_2]', 'folder'),
                '[sha1_3__40]': {
                  '[[...filePath]]': new MockSubFs(
                    '.legit/commits/[sha_1_1_2]/[sha1_3__40]/[[...filePath]]',
                    'fs'
                  ),
                },
              },
            },
          },
          '.claude': {
            '[[...filePath]]': new MockSubFs('.claude/[[...filePath]]', 'fs'),
          },
        },
        '/root'
      );

      const result = router.match('/root/.legit/branches/main/src/index.ts');
      expect(result).toBeDefined();
      expect(result?.handler.name).toBe(
        '.legit/branches/[branchName]/[[...filePath]]'
      );
      expect(
        result?.params,
        'branch and filePath Parameter should be extracted from path'
      ).toEqual({
        branchName: 'main',
        filePath: 'src/index.ts',
      });

      const legitInRoot = router.match('/root/.legit');
      expect(legitInRoot).toBeDefined();
      expect(
        legitInRoot?.handler.name,
        'for the root the .legit folder since it has a higher priority'
      ).toBe('.legit');
      expect(
        legitInRoot?.staticSiblings,
        'the .legit folder in root should have static siblings'
      ).toEqual([
        { segment: 'head', type: 'file' },
        { segment: 'branches', type: 'folder' },
        { segment: 'commits', type: 'folder' },
      ]);

      const legitInSubfolder = router.match('/root/path/to/folder/.legit');
      expect(legitInSubfolder).toBeDefined();
      expect(
        legitInSubfolder?.handler.name,
        '[[...filePath]] has no handler'
      ).toBe('.legit');
      expect(
        legitInSubfolder?.staticSiblings,
        'the .legit folder in root should have static siblings'
      ).toEqual([
        {
          segment: 'head',
          type: 'file',
        },
        {
          segment: 'branches',
          type: 'folder',
        },
        {
          segment: 'commits',
          type: 'folder',
        },
      ]);
    });

    it('should match commit SHA paths correctly', () => {
      const router = new PathRouter(
        {
          '.': new MockSubFs('/', 'folder'),
          '.legit': {
            '.': new MockSubFs('/', 'folder'),
            commits: {
              '.': new MockSubFs('.legit/commits', 'folder'),
              '[sha_1_1_2]': {
                '.': new MockSubFs('.legit/commits/[sha_1_1_2]', 'folder'),
                '[sha1_3__40]': {
                  '[[...filePath]]': new MockSubFs(
                    '.legit/commits/[sha_1_1_2]/[sha1_3__40]/[[...filePath]]',
                    'fs'
                  ),
                },
              },
            },
          },
        },
        '/root'
      );

      const result = router.match(
        '/root/.legit/commits/abc/def123456789/src/index.ts'
      );
      expect(result).toBeDefined();
      expect(result?.handler.name).toBe(
        '.legit/commits/[sha_1_1_2]/[sha1_3__40]/[[...filePath]]'
      );
      expect(result?.params).toEqual({
        sha_1_1_2: 'abc',
        sha1_3__40: 'def123456789',
        filePath: 'src/index.ts',
      });
    });

    it('should match .claude catch-all route', () => {
      const router = new PathRouter(
        {
          '.': new MockSubFs('/', 'folder'),
          '.claude': {
            '[[...filePath]]': new MockSubFs('.claude/[[...filePath]]', 'fs'),
          },
        },
        '/root'
      );

      const result = router.match('/root/.claude/sessions/123/messages');
      expect(result).toBeDefined();
      expect(result?.handler.name).toBe('.claude/[[...filePath]]');
      expect(result?.params).toEqual({
        filePath: 'sessions/123/messages',
      });
    });

    it('should return undefined for non-matching paths', () => {
      const router = new PathRouter(
        {
          '.': new MockSubFs('/', 'folder'),
          '.legit': {
            '.': new MockSubFs('.legit', 'folder'),
          },
        },
        '/root'
      );

      const result = router.match('/root/nonexistent/path');
      expect(result?.handler.name).toBe('/');
    });

    it('should handle empty filePath parameter', () => {
      const router = new PathRouter(
        {
          '[[...filePath]]': {
            '.': new MockSubFs('[[...filePath]]', 'fs'),
          },
        },
        '/root'
      );

      const result = router.match('/root');
      expect(result).toBeDefined();
      expect(result?.params).toEqual({ filePath: '' });
    });

    it('should prioritize static .legit over catchall .legit in root', () => {
      const router = new PathRouter(
        {
          '[[...filePath]]': {
            '.': new MockSubFs('[[...filePath]]', 'folder'),
            '.legit': {
              '.': new MockSubFs('/', 'folder'),
              changes: new MockSubFs('[[...filePath]]/.legit/changes', 'file'),
            },
          },
          '.legit': {
            '.': new MockSubFs('.legit', 'folder'),
            head: new MockSubFs('.legit/head', 'file'),
          },
        },
        '/root'
      );

      const result = router.match('/root/.legit');
      expect(result?.handler.name).toBe('.legit');
      expect(result?.staticSiblings).toContainEqual({
        segment: 'head',
        type: 'file',
      });
      expect(result?.staticSiblings).not.toContainEqual({
        segment: 'changes',
        type: 'file',
      });
    });
  });

  describe('Static siblings discovery', () => {
    it('should return no static siblings for branches folder', () => {
      const router = new PathRouter(
        {
          '.': new MockSubFs('.', 'folder'),
          '.legit': {
            '.': new MockSubFs('.legit/branches/.', 'folder'),
            branches: {
              '.': new MockSubFs('.legit/branches', 'folder'),
              '[branchName]': {
                '.': new MockSubFs('.legit/branches', 'folder'),
                '.legit': {
                  '.': new MockSubFs(
                    '.legit/branches/[branchName]/.legit',
                    'folder'
                  ),
                },
              },
            },
          },
        },
        '/root'
      );

      const result = router.match('/root/.legit/branches');
      expect(result?.staticSiblings).toEqual([]);
    });

    it('should discover  no static siblings for commits folder', () => {
      const router = new PathRouter(
        {
          '.': new MockSubFs('.', 'folder'),
          '.legit': {
            '.': new MockSubFs('.legit', 'folder'),
            commits: {
              '.': new MockSubFs('.legit/commits', 'folder'),
              '[sha_1_1_2]': {
                '.': new MockSubFs('.legit/commits/[sha_1_1_2]', 'folder'),
              },
            },
          },
        },
        '/root'
      );

      const result = router.match('/root/.legit/commits');
      expect(result?.staticSiblings).toEqual([]);
    });

    it('should return empty static siblings when no siblings exist', () => {
      const router = new PathRouter(
        {
          '[[...filePath]]': {
            '.': new MockSubFs('[[...filePath]]', 'folder'),
          },
        },
        '/root'
      );

      const result = router.match('/root/some/deep/path');
      expect(result?.staticSiblings).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should handle trailing slashes in paths', () => {
      const router = new PathRouter(
        {
          '[[...filePath]]': {
            '.': new MockSubFs('[[...filePath]]', 'folder'),
          },
        },
        '/root'
      );

      const result = router.match('/root/some/path/');
      expect(result).toBeDefined();
      expect(result?.params.filePath).toContain('some/path');
    });

    it('should handle special characters in path parameters', () => {
      const router = new PathRouter(
        {
          '.': new MockSubFs('/', 'folder'),
          '[branchName]': {
            '.': new MockSubFs('[branchName]', 'folder'),
          },
        },
        '/root'
      );

      const result = router.match('/root/feature');
      expect(result?.params.branchName).toBe('feature');
    });

    it('should handle deeply nested catch-all paths', () => {
      const router = new PathRouter(
        {
          '[[...filePath]]': {
            '.': new MockSubFs('[[...filePath]]', 'folder'),
          },
        },
        '/root'
      );

      const deepPath = 'a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z';
      const result = router.match(`/root/${deepPath}`);
      expect(result).toBeDefined();
      expect(result?.params.filePath).toBe(deepPath);
    });
  });

  describe('Priority and precedence', () => {
    it('should prefer more specific routes over catch-all', () => {
      const router = new PathRouter(
        {
          '[[...filePath]]': {
            '.': new MockSubFs('catchall', 'folder'),
          },
          '.legit': {
            '.': new MockSubFs('.legit', 'folder'),
          },
        },
        '/root'
      );

      const result = router.match('/root/.legit');
      expect(result?.handler.name).toBe('.legit');
    });

    it('should explicit matching paths', () => {
      const router = new PathRouter(
        {
          '.': new MockSubFs('/', 'folder'),
          '[branchName]': {
            '.': new MockSubFs('[branchName]', 'folder'),
          },
          '.legit': {
            '.': new MockSubFs('.legit', 'folder'),
            branches: {
              '.': new MockSubFs('.legit/branches/.', 'folder'),
              '[branchName]': {
                '.': new MockSubFs('.legit/branches/[branchName]', 'folder'),
              },
            },
          },
        },
        '/root'
      );

      const result = router.match('/root/.legit/branches/main');
      expect(result?.handler.name).toBe('.legit/branches/[branchName]');
    });
  });

  describe('Branch-specific .legit folders', () => {
    it('should match .legit inside branch path', () => {
      const router = new PathRouter(
        {
          '.': new MockSubFs('.', 'folder'),
          '.legit': {
            '.': new MockSubFs('.legit/.', 'folder'),
            branches: {
              '.': new MockSubFs('.legit/branches/.', 'folder'),
              '[branchName]': {
                '[[...filePath]]': {
                  '.': new MockSubFs(
                    '.legit/branches/[branchName]/[[...filePath]]',
                    'folder'
                  ),
                  '.legit': new MockSubFs(
                    '.legit/branches/[branchName]/[[...filePath]]/.legit',
                    'folder'
                  ),
                },
              },
            },
          },
        },
        '/root'
      );

      const result = router.match(
        '/root/.legit/branches/main/src/components/.legit'
      );
      expect(result?.handler.name).toBe(
        '.legit/branches/[branchName]/[[...filePath]]/.legit'
      );
      expect(result?.params).toEqual({
        branchName: 'main',
        filePath: 'src/components',
      });
    });

    it('should prioritize branch .legit over catchall .legit', () => {
      const router = new PathRouter(
        {
          '[[...filePath]]': {
            '.': new MockSubFs('catchall', 'folder'),
            '.legit': {
              '.': new MockSubFs('[[...filePath]].legit/branches', 'folder'),
              changes: new MockSubFs('catchall/.legit/changes', 'folder'),
            },
          },
          '.legit': {
            '.': new MockSubFs('.legit', 'folder'),
            branches: {
              '.': new MockSubFs('.legit/branches', 'folder'),
              '[branchName]': {
                '[[...filePath]]': {
                  '.': new MockSubFs('.legit/branches/[branchName]/[[...filePath]]/.', 'folder'),
                  '.legit': {
                    '.': new MockSubFs('.legit/branches/[branchName]/[[...filePath]]/.legit/.', 'folder'),
                    head: new MockSubFs(
                      '.legit/branches/[branchName]/[[...filePath]]/.legit/head',
                      'file'
                    ),
                  },
                },
              },
            },
          },
        },
        '/root'
      );

      const result = router.match('/root/.legit/branches/main/src/.legit/head');
      expect(result?.handler.name).toBe(
        '.legit/branches/[branchName]/[[...filePath]]/.legit/head'
      );
      // The .legit folder under a branch path should have 'head' as a static sibling
      expect(result?.staticSiblings).toEqual([
        
      ]);
    });
  });
});
