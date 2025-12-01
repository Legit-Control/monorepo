import { TokenStore } from './createGitConfigTokenStore.js';

export type LegitUser = {
  type: string;
  id: string;
  name: string;
  email: string;
};

export type LegitAuth = {
  getUser: () => Promise<{
    type: string;
    id: string;
    name: string;
    email: string;
  }>;
  signInAnonymously: () => Promise<void>;
  getMaxAccessTokenForBranch: (branchId: string) => Promise<string | undefined>;
  addAccessToken: (token: string) => Promise<void>;
};

export type Tokens = {
  accessTokens: string[];
};

export const createSessionManager = (
  tokenStore: TokenStore,
  publicKey?: string
): LegitAuth => {
  // get this from legitFs.getUserMeta();
  const userMeta = {
    type: 'local',
    id: 'local',
    name: 'Local User',
    email: 'local@legitcontrol.com',
  };

  return {
    getUser: async () => {
      return userMeta;
    },
    signInAnonymously: async () => {
      userMeta.type = 'anonymous';
      userMeta.id = crypto.randomUUID();
      userMeta.email = `anonymous-sha1-${userMeta.id}-@legitcontrol.com`;
      // token stays the same for now
      // commits also stay unchanged

      // rename anonymous branch to user id branch -> later namespaced
    },
    addAccessToken: async (_token: string): Promise<void> => {
      const currentTokens = await tokenStore.getUserTokens(userMeta.id);

      currentTokens.accessTokens.push(_token);
      await tokenStore.setUserTokens(userMeta.id, currentTokens);
    },
    getMaxAccessTokenForBranch: async (_branchId: string) => {
      const currentTokens = await tokenStore.getUserTokens(userMeta.id);
      if (
        currentTokens.accessTokens === undefined ||
        currentTokens.accessTokens.length === 0
      ) {
        // TODO for now we just use the public key - which is not a refresh token but the access token.
        return publicKey;
      }
      // for now we only have one token
      return currentTokens.accessTokens[0];
    },
  };
};
