import { AssistantCloud } from 'assistant-cloud';
import type { AssistantRuntime } from '@assistant-ui/react';
import { AssistantStream, PlainTextDecoder } from 'assistant-stream';

import { LegitThreads } from './LegitThreads';
import type { AssistantCloudConfig } from './types';
import { type LegitFsInstance } from './types';

export class LegitLocal extends AssistantCloud {
  public runtime?: AssistantRuntime;
  public legitFs: LegitFsInstance | null = null;

  constructor(config: AssistantCloudConfig) {
    super(config);
    this.legitFs = config.legitFs;

    // Override the default thread handler with our LegitFS-backed implementation.
    // @ts-expect-error - AssistantCloud threads property is readonly in types.
    this.threads = new LegitThreads();

    const originalStream = this.runs.stream;

    this.runs.stream = async (args: any) => {
      if (!this.runtime) {
        throw new Error('LegitLocal runtime not set');
      }

      const internalBinding = (this.runtime.thread as any)
        .__internal_threadBinding;
      const chatModel = internalBinding?.getState?.()?.adapters?.chatModel;
      const options = chatModel?.options ?? {};

      const headers = new Headers();
      headers.set('Content-Type', 'application/json');

      try {
        const response = await fetch(options.api ?? '/api/chat', {
          method: 'POST',
          headers,
          credentials: options.credentials ?? 'same-origin',
          body: JSON.stringify({
            messages: args.messages,
            system: args.system,
            tools: args.tools,
            runConfig: options.runConfig ?? {},
          }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return AssistantStream.fromResponse(response, new PlainTextDecoder());
      } catch (error) {
        console.error(
          'LegitLocal stream failed, falling back to default handler.',
          error
        );
        return originalStream.call(this.runs, args);
      }
    };
  }
}
