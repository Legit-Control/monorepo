import type {
  AssistantCloudMessageCreateResponse,
  AssistantCloudThreadMessageCreateBody,
  AssistantCloudThreadMessageListQuery,
  AssistantCloudThreadMessageListResponse,
  CloudMessage,
  CloudMessageWithoutId,
} from './types';
import { readOperationHistory, writeOperation } from './storage';
import { createUIMessages } from './createUIMessages';

export class LegitThreadMessages {
  public async list(
    threadId: string,
    _query?: AssistantCloudThreadMessageListQuery
  ): Promise<AssistantCloudThreadMessageListResponse> {
    const operationHistory = await readOperationHistory(threadId);
    const operationHistoryUI = await createUIMessages(operationHistory);

    const messages: CloudMessage[] = operationHistoryUI.map(
      (message, index) => ({
        ...message,
        height: index,
        created_at: new Date(message.created_at),
        updated_at: new Date(message.updated_at),
      })
    );

    return { messages };
  }

  public async create(
    threadId: string,
    body: AssistantCloudThreadMessageCreateBody
  ): Promise<AssistantCloudMessageCreateResponse> {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const newMessageData: CloudMessageWithoutId = {
      // TODO also dont save created_at since we gain this from the commit date
      created_at: new Date(),
      // TODO open question when does a message update
      updated_at: new Date(),
      format: body.format,
      content: body.content,
    };

    await writeOperation(threadId, JSON.stringify(newMessageData));

    return { message_id: messageId };
  }
}
