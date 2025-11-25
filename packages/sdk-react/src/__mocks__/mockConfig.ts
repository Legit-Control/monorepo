import { GetSyncToken, LegitConfig } from '../LegitProvider';

export const mockConfig: LegitConfig = {
  sync: {
    serverUrl: 'http://mockUrl.com/api',
    gitRepoPath: '/',
  },
};

export const mockGetSyncToken: GetSyncToken = async () => {
  return 'token';
};
