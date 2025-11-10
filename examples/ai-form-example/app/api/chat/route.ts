import { azure } from '@ai-sdk/azure';
import { frontendTools } from '@assistant-ui/react-ai-sdk';
import { convertToModelMessages, streamText } from 'ai';

import { getLegitFsContext } from '@/lib/server/legitFsContext';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const { legitFs } = await getLegitFsContext();

  const result = streamText({
    model: azure('gpt-4o'),
    messages: convertToModelMessages(messages),
    system,
    tools: {
      ...frontendTools(tools),
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: finalMessages }) => {
      try {
        await legitFs.promises.writeFile(
          '/.legit/branches/main/messages.json',
          JSON.stringify(finalMessages, null, 2),
          'utf8'
        );
        console.log(
          'finalMessages',
          JSON.stringify(
            JSON.parse(
              await legitFs.promises.readFile(
                '/.legit/branches/main/messages.json',
                'utf8'
              )
            ),
            null,
            2
          )
        );
      } catch (error) {
        console.error('Failed to persist chat messages', error);
      }
    },
  });
}
