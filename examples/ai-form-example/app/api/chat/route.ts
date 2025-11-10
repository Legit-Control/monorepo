import { azure } from '@ai-sdk/azure';
import { frontendTools } from '@assistant-ui/react-ai-sdk';
import { convertToModelMessages, streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const result = streamText({
    model: azure('gpt-4o'),
    messages: convertToModelMessages(messages),
    system,
    tools: {
      ...frontendTools(tools),
    },
  });

  return result.toUIMessageStreamResponse();
}
