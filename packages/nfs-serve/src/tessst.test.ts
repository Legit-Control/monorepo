import { describe, it, expect } from 'vitest';
import fs from 'fs/promises';

describe('NFS access sanity', () => {
  it('should readdir the NFS mount', async () => {
    const dir =
      '/Users/martinlysk/legit/monorepo-private/packages/nfs-serve/testmount';
    const entries = await fs.readdir(dir);
    console.log('Entries:', entries);
    expect(entries.length).toBeGreaterThanOrEqual(0);
  });
});
