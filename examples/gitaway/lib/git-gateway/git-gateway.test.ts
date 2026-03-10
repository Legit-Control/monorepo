import { describe, it, expect, beforeEach } from 'vitest';
import { GitGateway } from './git-gateway.js';

describe('GitGateway.parsePath', () => {
  let gitGateway: GitGateway;

  beforeEach(() => {
    gitGateway = new GitGateway('/tmp/test-cache');
    gitGateway.initializeSampleData();
  });

  describe('Root and basic paths', () => {
    it('should parse root directory', () => {
      const result = gitGateway.parsePath('/');
      expect(result.type).toBe('root');
    });

    it('should parse root directory with trailing slashes', () => {
      const result = gitGateway.parsePath('///');
      expect(result.type).toBe('root');
    });

    it('should parse domain directory', () => {
      const result = gitGateway.parsePath('/github.com');
      expect(result.type).toBe('domain');
      expect(result.domain).toBe('github.com');
    });
  });

  describe('Long username sharding (4+ characters)', () => {
    it('should parse first shard level', () => {
      const result = gitGateway.parsePath('/github.com/m');
      expect(result.type).toBe('first-shard');
      expect(result.domain).toBe('github.com');
      expect(result.shardLevel).toBe(1);
      expect(result.prefix).toBe('m');
    });

    it('should parse second shard level', () => {
      const result = gitGateway.parsePath('/github.com/m/a');
      expect(result.type).toBe('second-shard');
      expect(result.domain).toBe('github.com');
      expect(result.shardLevel).toBe(2);
      expect(result.prefix).toBe('ma');
    });

    it('should parse third shard level', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r');
      expect(result.type).toBe('third-shard');
      expect(result.domain).toBe('github.com');
      expect(result.shardLevel).toBe(3);
      expect(result.prefix).toBe('mar');
    });

    it('should parse third shard level with _repos', () => {
      const result = gitGateway.parsePath('/github.com/m/a/_repos');
      expect(result.type).toBe('repos-shard');
      expect(result.domain).toBe('github.com');
      expect(result.shardLevel).toBe(3);
      expect(result.prefix).toBe('ma');
    });

    it('should parse username shard (remainder of username)', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/tin-lysk');
      expect(result.type).toBe('username-shard');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('martin-lysk');
      expect(result.shardLevel).toBe(4);
      expect(result.prefix).toBe('martin-lysk');
    });

    it('should parse username shard with dash in middle', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/cus-w');
      expect(result.type).toBe('username-shard');
      expect(result.username).toBe('marcus-w');
      expect(result.prefix).toBe('marcus-w');
    });

    it('should parse _repos at level 4', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/_repos');
      expect(result.type).toBe('repos-shard');
      expect(result.domain).toBe('github.com');
      expect(result.shardLevel).toBe(4);
      expect(result.prefix).toBe('mar');
    });

    it('should parse repository path', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/tin-lysk/my-repo');
      expect(result.type).toBe('repo');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('my-repo');
    });

    it('should parse repository with dash in username', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/cus-w/test-repo');
      expect(result.type).toBe('repo');
      expect(result.username).toBe('marcus-w');
      expect(result.repoName).toBe('test-repo');
    });
  });

  describe('Short username sharding (1-3 characters)', () => {
    it('should parse _repos at domain level', () => {
      const result = gitGateway.parsePath('/github.com/_repos');
      expect(result.type).toBe('repos-shard');
      expect(result.domain).toBe('github.com');
      expect(result.shardLevel).toBe(0);
    });

    it('should parse short username at domain level', () => {
      const result = gitGateway.parsePath('/github.com/_repos/ab');
      expect(result.type).toBe('username-shard');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('ab');
      expect(result.shardLevel).toBe(0);
    });

    it('should parse repository for short username', () => {
      const result = gitGateway.parsePath('/github.com/_repos/ab/test-repo');
      expect(result.type).toBe('repo');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('ab');
      expect(result.repoName).toBe('test-repo');
    });

    it('should parse _repos at first shard level', () => {
      const result = gitGateway.parsePath('/github.com/a/_repos');
      expect(result.type).toBe('repos-shard');
      expect(result.domain).toBe('github.com');
      expect(result.shardLevel).toBe(3);
      expect(result.prefix).toBe('a');
    });

    it('should parse _repos at second shard level', () => {
      const result = gitGateway.parsePath('/github.com/a/b/_repos');
      expect(result.type).toBe('repos-shard');
      expect(result.domain).toBe('github.com');
      expect(result.shardLevel).toBe(4);
      expect(result.prefix).toBe('ab');
    });
  });

  describe('Bookmark-related paths', () => {
    it('should parse bookmark directory', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked');
      expect(result.type).toBe('bookmark-dir');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('my-repo');
    });

    it('should parse bookmark file "no"', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked/no');
      expect(result.type).toBe('bookmark-file');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('my-repo');
      expect(result.bookmarkFile).toBe('no');
    });

    it('should parse bookmark file "yes"', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked/yes');
      expect(result.type).toBe('bookmark-file');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('my-repo');
      expect(result.bookmarkFile).toBe('yes');
    });

    it('should parse bookmark directory for short username', () => {
      const result = gitGateway.parsePath('/github.com/_repos/ab/test-repo/.gateway-bookmarked');
      expect(result.type).toBe('bookmark-dir');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('ab');
      expect(result.repoName).toBe('test-repo');
    });

    it('should parse bookmark file for short username', () => {
      const result = gitGateway.parsePath('/github.com/_repos/ab/test-repo/.gateway-bookmarked/no');
      expect(result.type).toBe('bookmark-file');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('ab');
      expect(result.repoName).toBe('test-repo');
      expect(result.bookmarkFile).toBe('no');
    });
  });

  describe('Bookmarked section', () => {
    it('should parse bookmarked root', () => {
      const result = gitGateway.parsePath('/bookmarked');
      expect(result.type).toBe('bookmarked-root');
    });

    it('should parse bookmarked section entry', () => {
      // First bookmark a repo
      gitGateway.addRepo('github.com', 'martin-lysk', 'my-repo', true);

      const result = gitGateway.parsePath('/bookmarked/github.com/martin-lysk/my-repo');
      expect(result.type).toBe('bookmarked-section');
      expect(result.domain).toBe('github.com');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('my-repo');
    });

    it('should return not-found for non-bookmarked repo in bookmarked section', () => {
      // Repo is not bookmarked
      gitGateway.addRepo('github.com', 'martin-lysk', 'my-repo', false);

      const result = gitGateway.parsePath('/bookmarked/github.com/martin-lysk/my-repo');
      expect(result.type).toBe('not-found');
    });

    it('should return not-found for unknown repo in bookmarked section', () => {
      const result = gitGateway.parsePath('/bookmarked/github.com/unknown-user/repo');
      expect(result.type).toBe('not-found');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle paths with extra slashes', () => {
      const result = gitGateway.parsePath('/github.com//m///a/');
      expect(result.type).toBe('second-shard');
      expect(result.domain).toBe('github.com');
    });

    it('should return not-found for unknown repository', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/tin-lysk/unknown-repo');
      expect(result.type).toBe('not-found');
    });

    it('should return not-found for incomplete sharded path', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/unknown-remainder/repo');
      expect(result.type).toBe('not-found');
    });

    it('should handle numeric first character', () => {
      const result = gitGateway.parsePath('/github.com/1');
      expect(result.type).toBe('first-shard');
      expect(result.prefix).toBe('1');
    });

    it('should handle dash at second level', () => {
      const result = gitGateway.parsePath('/github.com/m/-');
      expect(result.type).toBe('second-shard');
      expect(result.prefix).toBe('m-');
    });

    it('should handle dash at third level', () => {
      const result = gitGateway.parsePath('/github.com/m/a/-');
      expect(result.type).toBe('third-shard');
      expect(result.prefix).toBe('ma-');
    });
  });

  describe('Character sets', () => {
    it('should accept all lowercase letters', () => {
      for (const char of 'abcdefghijklmnopqrstuvwxyz') {
        const result = gitGateway.parsePath(`/github.com/${char}`);
        expect(result.type).toBe('first-shard');
        expect(result.prefix).toBe(char);
      }
    });

    it('should accept all digits', () => {
      for (const char of '0123456789') {
        const result = gitGateway.parsePath(`/github.com/${char}`);
        expect(result.type).toBe('first-shard');
        expect(result.prefix).toBe(char);
      }
    });

    it('should accept dash at second level', () => {
      const result = gitGateway.parsePath('/github.com/m/-');
      expect(result.type).toBe('second-shard');
    });

    it('should accept dash at third level', () => {
      const result = gitGateway.parsePath('/github.com/m/a/-');
      expect(result.type).toBe('third-shard');
    });
  });

  describe('Real-world examples', () => {
    it('should parse path for plate-sdk repo', () => {
      const result = gitGateway.parsePath('/github.com/p/l/ate/plate-sdk');
      expect(result.type).toBe('repo');
      expect(result.username).toBe('plate');
      expect(result.repoName).toBe('plate-sdk');
    });

    it('should parse path for about-me repo', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/tin-lysk/about-me');
      expect(result.type).toBe('repo');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('about-me');
    });

    it('should parse bookmark state for my-repo', () => {
      const result = gitGateway.parsePath('/github.com/m/a/r/tin-lysk/my-repo/.gateway-bookmarked/no');
      expect(result.type).toBe('bookmark-file');
      expect(result.username).toBe('martin-lysk');
      expect(result.repoName).toBe('my-repo');
      expect(result.bookmarkFile).toBe('no');
    });
  });
});
