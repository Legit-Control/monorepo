import { Tokens } from './sessionManager.js';
import git from 'isomorphic-git';
import * as nodeFs from 'node:fs';
import {
  decodeConfigJson,
  encodeConfigJson,
} from './util/config-en-decoder.js';

export type TokenStore = {
  getUserTokens: (userId: string) => Promise<Tokens>;
  setUserTokens: (userId: string, tokens: Tokens) => Promise<void>;
};

const legitTokensConfigKey = 'user.legit-tokens';

export function createGitConfigTokenStore({
  storageFs,
  gitRoot,
}: {
  storageFs: typeof nodeFs;
  gitRoot: string;
}): TokenStore {
  return {
    getUserTokens: async (userId: string) => {
      let tokensRaw = await git.getConfig({
        fs: storageFs,
        dir: gitRoot,
        path: legitTokensConfigKey,
      });
      const tokens = tokensRaw
        ? (decodeConfigJson(tokensRaw) as Tokens)
        : { accessTokens: [] };
      return tokens;
    },
    setUserTokens: async (userId: string, tokens: Tokens) => {
      return await git.setConfig({
        fs: storageFs,
        dir: gitRoot,
        path: legitTokensConfigKey,
        value: encodeConfigJson(tokens),
      });
    },
  };
}
