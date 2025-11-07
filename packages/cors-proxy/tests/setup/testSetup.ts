import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock handlers for GitHub API
export const githubHandlers = [
  // Git smart protocol - info/refs
  rest.get('https://api.github.com/repos/:owner/:repo/git/info/refs', (req, res, ctx) => {
    const { owner, repo } = req.params;
    const url = new URL(req.url);
    const service = url.searchParams.get('service');

    if (service === 'git-upload-pack') {
      return res(
        ctx.set('Content-Type', 'application/x-git-upload-pack-advertisement'),
        ctx.status(200),
        ctx.body('001e# service=git-upload-pack\n0000009594f89d094c5f7c0e42a6ad8377144ec2c8c4d9 refs/heads/main\n0000')
      );
    }

    return res(ctx.status(400));
  }),

  // Git upload-pack endpoint
  rest.post('https://api.github.com/repos/:owner/:repo/git-upload-pack', (req, res, ctx) => {
    return res(
      ctx.set('Content-Type', 'application/x-git-upload-pack-result'),
      ctx.status(200),
      ctx.body('0008NAK\n0000')
    );
  })
];

// Setup MSW server
export const server = setupServer(...githubHandlers);

// Vitest setup
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error'
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Global test utilities
declare global {
  namespace Vi {
    interface Context {
      githubToken: string;
      testUserId: string;
      testRepo: string;
    }
  }
}