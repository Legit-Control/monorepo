import { LegitThreadMessages } from './LegitThreadMessages';
import {
  type AssistantCloudThreadsCreateBody,
  type AssistantCloudThreadsCreateResponse,
  type AssistantCloudThreadsListQuery,
  type AssistantCloudThreadsListResponse,
  type AssistantCloudThreadsUpdateBody,
} from './types';
import { listBranches } from './storage';

export class LegitThreads {
  public readonly messages = new LegitThreadMessages();

  public async list(
    _query?: AssistantCloudThreadsListQuery
  ): Promise<AssistantCloudThreadsListResponse> {
    const threads = await listBranches();

    return {
      threads: threads.map(threadName => ({
        id: threadName,
        title: threadName,
        last_message_at: new Date(),
        metadata: {},
        external_id: null,
        project_id: '',
        created_at: new Date(),
        updated_at: new Date(),
        workspace_id: 'local-workspace',
        is_archived: false,
      })),
    } as AssistantCloudThreadsListResponse;
  }

  public async create(
    body: AssistantCloudThreadsCreateBody
  ): Promise<AssistantCloudThreadsCreateResponse> {
    // TODO: create a new branch
    return { thread_id: 'main' };
  }

  public async update(
    threadId: string,
    body: AssistantCloudThreadsUpdateBody
  ): Promise<void> {
    // TODO: update the branch name
  }

  public async delete(threadId: string): Promise<void> {
    // TODO: delete the branch
  }
}
