import { User } from './User.js';

export type HistoryItem = {
  oid: string;
  message: string;
  parent: string[];
  author: User;
};
