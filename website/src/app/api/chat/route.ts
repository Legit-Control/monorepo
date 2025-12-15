import {
  AssistantStream,
  DataStreamEncoder,
  createAssistantStreamController,
} from 'assistant-stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type UIMessageContent = {
  type?: string;
  text?: unknown;
};

type UIMessage = {
  role?: string;
  content?: UIMessageContent[];
};

const MOCK_RESPONSES: { match: (input: string) => boolean; reply: string }[] = [
  {
    match: input => /hello|hi|hey/i.test(input),
    reply:
      "Hey! I'm your mock agent 🤖. I'm not actually calling any real model right now, " +
      'but I can still show you what a chat would look like.',
  },
  {
    match: input => /what can you do|help/i.test(input),
    reply:
      "Right now I'm a fully mocked assistant. My responses are prewritten and streamed " +
      'back to you with a small delay so it *feels* like a real model.',
  },
  {
    match: () => true,
    reply:
      'I have . ' +
      'In a real setup, this is where we would call an LLM or your own backend logic.',
  },
];

const MOCK_TOOL_VERSIONS = [
  {
    title: 'Create paragraphs',
    content: `# Machine Learning

Traditional software is deterministic. Given the same input, running the program again will always produce the same output. This is because a developer has explicitly written the logic to handle every possible case the software might encounter.

Most modern AI models do not work this way. Instead of following explicitly programmed rules, they are probabilistic systems. Their outputs are influenced by probabilities learned during training, which means the same input can lead to different results across multiple runs.

Machine learning is a technique that allows software to learn patterns from data rather than relying on fixed instructions. During training, the model is exposed to large datasets and adjusts internal parameters to capture statistical relationships.

Popular AI models such as GPT (OpenAI), Claude (Anthropic), and Gemini (Google) are trained on vast collections of text from the internet. Through this process, they learn how language is structured and how concepts relate to one another.
`,
  },
  {
    title: 'Adjust voice',
    content: `# Machine Learning

Traditional software behaves in a predictable, deterministic way. If you provide the same input, the program will always return the same output. This is because developers explicitly define how the software should respond in every situation.

AI models work differently. Most modern machine learning systems are probabilistic, meaning their behavior is shaped by likelihoods rather than fixed rules. Developers don’t hard-code every instruction. Instead, the model decides what to output based on patterns it learned during training.

Machine learning enables software to recognize patterns in data and make decisions based on those patterns. As a result, the same input can sometimes produce different outputs, especially in generative systems.

Models like GPT, Claude, and Gemini are trained on massive datasets containing text from across the internet. During training, they learn statistical relationships between words, concepts, and structures, allowing them to generate human-like responses.
`,
  },
  {
    title: 'Write summary',
    content: `# Machine Learning

Traditional software behaves in a predictable, deterministic way. If you provide the same input, the program will always return the same output. This is because developers explicitly define how the software should respond in every situation.

AI models work differently. Most modern machine learning systems are probabilistic, meaning their behavior is shaped by likelihoods rather than fixed rules. Developers don’t hard-code every instruction. Instead, the model decides what to output based on patterns it learned during training.

Machine learning enables software to recognize patterns in data and make decisions based on those patterns. As a result, the same input can sometimes produce different outputs, especially in generative systems.

Models like GPT, Claude, and Gemini are trained on massive datasets containing text from across the internet. During training, they learn statistical relationships between words, concepts, and structures, allowing them to generate human-like responses.

---

## Summary

- Traditional software follows explicit rules and produces deterministic results.  
- Machine learning models are probabilistic and learn behavior from data.  
- The same input can lead to different outputs in AI systems.  
- Large language models learn patterns by training on massive datasets.
`,
  },
];

const getMockReply = (userText: string): string => {
  const trimmed = userText.trim();
  const scenario = MOCK_RESPONSES.find(s => s.match(trimmed));
  return scenario
    ? scenario.reply
    : MOCK_RESPONSES[MOCK_RESPONSES.length - 1]!.reply;
};

const extractLastUserText = (messages: UIMessage[]): string => {
  const reversed = [...messages].reverse();
  for (const message of reversed) {
    if (message.role !== 'user') continue;
    const contentArray = Array.isArray(message.content) ? message.content : [];
    for (const part of contentArray) {
      if (part?.type === 'text' && typeof part.text === 'string') {
        return part.text;
      }
    }
  }
  return 'Hi there!';
};

export async function POST(req: Request): Promise<Response> {
  try {
    const payload = await req.json().catch(() => ({}));
    const uiMessages: UIMessage[] = Array.isArray(payload?.messages)
      ? payload.messages
      : [];

    const lastUserText = extractLastUserText(uiMessages);
    const reply = getMockReply(lastUserText);

    console.log('[mock-chat] received', { lastUserText, reply });

    const [assistantStream, controller] = createAssistantStreamController();

    (async () => {
      try {
        // Special flow for "Finish my blog post"
        if (lastUserText.trim() === 'Finish my blog post') {
          // First message: "I'm turning your notes into a complete blog post."
          const textController1 = controller.addTextPart();
          const message1 = "I'm turning your notes into a complete blog post. ";
          const words1 = message1.split(/\s+/);
          for (const [index, word] of words1.entries()) {
            textController1.append(
              word + (index < words1.length - 1 ? ' ' : '')
            );
            await sleep(80);
          }
          textController1.close();

          // Second message: "I'll work in a separate branch so you can review everything before applying it."
          const textController2 = controller.addTextPart();
          const message2 =
            "I'll work in a separate branch so you can review everything before applying it.";
          const words2 = message2.split(/\s+/);
          for (const [index, word] of words2.entries()) {
            textController2.append(
              word + (index < words2.length - 1 ? ' ' : '')
            );
            await sleep(80);
          }
          textController2.close();

          await sleep(1000);

          // Three tool calls with descriptions
          for (let i = 0; i < MOCK_TOOL_VERSIONS.length; i++) {
            const toolCallId = `tc-${Date.now()}-${i}-${Math.random()
              .toString(36)
              .slice(2)}`;
            const toolCall = controller.addToolCallPart({
              toolCallId,
              toolName: 'update-document',
            });

            const args = {
              action: 'update_document',
              source: 'frontend-demo',
              body: {
                title: MOCK_TOOL_VERSIONS[i].title,
                content: MOCK_TOOL_VERSIONS[i].content,
              },
            };
            toolCall.argsText.append(JSON.stringify(args, null, 2));

            // Simulate 1000ms loading time before tool finishes
            await sleep(1000);

            toolCall.setResponse({
              result: `Mock update document tool executed (step ${i + 1})`,
              isError: false,
            });
            toolCall.close();

            // 1000ms delay between tool runs after finishing
            if (i < MOCK_TOOL_VERSIONS.length - 1) {
              await sleep(1000);
            }
          }

          // Final message: "I'm done. All changes are ready for review in the agent branch. You can accept them, discard them, or explore the differences."
          const textController3 = controller.addTextPart();
          const message3 =
            "I'm done. All changes are ready for review in the agent branch.";
          const words3 = message3.split(/\s+/);
          for (const [index, word] of words3.entries()) {
            textController3.append(
              word + (index < words3.length - 1 ? ' ' : '')
            );
            await sleep(80);
          }
          textController3.close();
        } else {
          // Default flow for other messages
          const textController = controller.addTextPart();
          const words = reply.split(/\s+/);
          for (const [index, word] of words.entries()) {
            textController.append(word + (index < words.length - 1 ? ' ' : ''));
            await sleep(80);
          }
          textController.close();
        }

        controller.close();
      } catch (error) {
        console.error('[mock-chat] stream error', error);
        controller.enqueue({
          type: 'error',
          path: [],
          error:
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : 'Unknown error in mock chat route',
        });
        controller.close();
      }
    })();

    const encoder = new DataStreamEncoder();
    return AssistantStream.toResponse(assistantStream, encoder);
  } catch (error) {
    console.error('[mock-chat] route error', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
