import { azure } from '@ai-sdk/azure';
import { frontendTools } from '@assistant-ui/react-ai-sdk';
import { streamText } from 'ai';
import {
  convertMessagesToModelMessages,
  streamTextToDataStreamResponse,
  type UIMessage,
} from '@legit-sdk/assistant-ui/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const payload = await req.json();
  const uiMessages: UIMessage[] = Array.isArray(payload?.messages)
    ? payload.messages
    : [];
  const system = payload?.system;
  const tools = payload?.tools;

  try {
    const toolDefinitions = {
      ...frontendTools(tools ?? {}),
    };
    const modelMessages =
      // TODO: This is a temporary solution to convert the UI messages to model messages.
      uiMessages.length > 0 ? convertMessagesToModelMessages(uiMessages) : [];

    const result = streamText({
      model: azure('gpt-4o'),
      messages: modelMessages,
      system,
      tools: toolDefinitions,
      onError: console.error,
      onFinish: () => console.log('Stream finished cleanly'),
    });

    // TODO: This is a temporary solution to get the data stream response.
    return streamTextToDataStreamResponse(result);
  } catch (error) {
    console.error('Failed to stream chat response', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
