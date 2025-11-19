import { CloudMessage, CloudMessageWithoutId } from './types';
import { Operation } from '@legit-sdk/core';

export const createUIMessages = async (
  operationHistory: Operation[]
): Promise<CloudMessage[]> => {
  const messages: CloudMessage[] = [];

  for (const operation of operationHistory) {
    let cloudMessageWithoutId: CloudMessageWithoutId;
    let composedMessage: CloudMessage;
    try {
      cloudMessageWithoutId = JSON.parse(
        operation.message
      ) satisfies CloudMessageWithoutId;

      composedMessage = {
        id: operation.oid,
        height: messages.length,
        parent_id:
          operation.parentOids[0] === operation.parentOids[1]
            ? null
            : operation.parentOids[0]!,
        metadata: {
          custom: {
            depending_branch_commit_id: operation.originBranchOid ?? null,
          },
        },
        ...cloudMessageWithoutId,
      };
      messages.unshift(composedMessage);
    } catch {
      console.log('Skipping operation with invalid JSON message:', operation);
      continue;
    }
  }

  return messages;
};
