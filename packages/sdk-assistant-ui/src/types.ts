import { initLegitFs } from '@legit-sdk/core';

export type LegitFsInstance = Awaited<ReturnType<typeof initLegitFs>>;

export type AssistantCloudConfig = {
  baseUrl: string;
  authToken: () => Promise<string | null>;
  legitFs: LegitFsInstance;
};

export type MetadataLike = {
  custom?: unknown;
  [key: string]: unknown;
};

export type CloudMessage = {
  id: string;
  parent_id: string | null;
  height: number;
  created_at: Date;
  updated_at: Date;
  format: string;
  content: Record<string, unknown>;
  metadata?: MetadataLike;
};

export type AssistantCloudThreadMessageListQuery = {
  format?: string;
};

export type AssistantCloudThreadMessageListResponse = {
  messages: CloudMessage[];
};

export type AssistantCloudThreadMessageCreateBody = {
  parent_id: string | null;
  format: string;
  content: Record<string, unknown>;
};

export type AssistantCloudMessageCreateResponse = {
  message_id: string;
};

export type CloudThread = {
  id: string;
  title: string;
  last_message_at: Date;
  metadata: unknown;
  external_id: string | null;
  project_id: string;
  created_at: Date;
  updated_at: Date;
  workspace_id: string;
  is_archived: boolean;
};

export type AssistantCloudThreadsListQuery = {
  is_archived?: boolean;
  limit?: number;
  after?: string;
};

export type AssistantCloudThreadsListResponse = {
  threads: CloudThread[];
};

export type AssistantCloudThreadsCreateBody = {
  title?: string;
  last_message_at?: Date;
  metadata?: unknown;
  external_id?: string | null;
};

export type AssistantCloudThreadsCreateResponse = {
  thread_id: string;
};

export type AssistantCloudThreadsUpdateBody = {
  title?: string;
  last_message_at?: Date;
  metadata?: unknown;
  is_archived?: boolean;
};

export type CloudMessageWithoutId = Omit<
  CloudMessage,
  'id' | 'height' | 'parent_id'
>;
