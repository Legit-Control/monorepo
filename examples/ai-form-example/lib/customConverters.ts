import type {
  JSONValue,
  ModelMessage,
  StreamTextResult,
  TextPart,
  ToolCallPart,
  ToolResultPart,
} from 'ai';
import {
  createAssistantStreamController,
  type AssistantStreamController,
  DataStreamEncoder,
  AssistantStream,
} from 'assistant-stream';

const serializeStructuredData = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value === undefined) {
    return '';
  }

  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
};

export type UIMessageContent = Record<string, unknown>;

export type UIMessage = {
  role: string;
  content?: UIMessageContent[];
};

const toText = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value === undefined || value === null) {
    return '';
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const toJsonValue = (value: unknown): JSONValue => {
  if (value === undefined || value === null) {
    return null;
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(item => toJsonValue(item));
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        toJsonValue(val),
      ])
    );
  }
  return JSON.stringify(value);
};

const buildToolResultOutput = (
  value: unknown,
  isError: boolean
): ToolResultPart['output'] => {
  if (isError) {
    return typeof value === 'string'
      ? { type: 'error-text', value }
      : { type: 'error-json', value: toJsonValue(value) };
  }

  return typeof value === 'string'
    ? { type: 'text', value }
    : { type: 'json', value: toJsonValue(value) };
};

const mapAssistantContentPart = (
  part: UIMessageContent
): ToolCallPart | TextPart | null => {
  const type = part.type;
  switch (type) {
    case 'text':
      return {
        type: 'text',
        text: typeof part.text === 'string' ? part.text : '',
      };
    case 'tool-call':
      return {
        type: 'tool-call',
        toolCallId:
          typeof part.toolCallId === 'string'
            ? part.toolCallId
            : `unknown-${Date.now()}`,
        toolName: typeof part.toolName === 'string' ? part.toolName : 'unknown',
        input: toJsonValue(part.args ?? part.input ?? {}),
      };
    default:
      return null;
  }
};

const mapToolContentPart = (part: UIMessageContent): ToolResultPart | null => {
  if (part.type !== 'tool-result') {
    return null;
  }
  return {
    type: 'tool-result',
    toolCallId:
      typeof part.toolCallId === 'string'
        ? part.toolCallId
        : `unknown-${Date.now()}`,
    toolName: typeof part.toolName === 'string' ? part.toolName : 'unknown',
    output: buildToolResultOutput(
      part.result ?? part.output,
      Boolean(part.isError)
    ),
  };
};

export const convertMessagesToModelMessages = (
  messages: UIMessage[]
): ModelMessage[] =>
  messages
    .map<ModelMessage | null>(message => {
      const contentArray = Array.isArray(message.content)
        ? message.content
        : [];
      switch (message.role) {
        case 'system': {
          const systemText = contentArray
            .map(part =>
              part.type === 'text' && typeof part.text === 'string'
                ? part.text
                : ''
            )
            .join('');
          return {
            role: 'system',
            content: systemText,
          };
        }
        case 'user': {
          const content = contentArray
            .map(part => {
              switch (part.type) {
                case 'text':
                  return {
                    type: 'text',
                    text: typeof part.text === 'string' ? part.text : '',
                  };
                default:
                  return null;
              }
            })
            .filter(Boolean) as TextPart[];
          return {
            role: 'user',
            content,
          };
        }
        case 'assistant': {
          const content = contentArray
            .map(part => mapAssistantContentPart(part))
            .filter(Boolean) as Array<TextPart | ToolCallPart>;
          return {
            role: 'assistant',
            content,
          };
        }
        case 'tool': {
          const content = contentArray
            .map(part => mapToolContentPart(part))
            .filter(Boolean) as ToolResultPart[];
          return content.length > 0
            ? {
                role: 'tool',
                content,
              }
            : null;
        }
        default:
          return null;
      }
    })
    .filter((message): message is ModelMessage => message !== null);

/**
 * Converts a streamText result to a Data Stream Response for use with useDataStreamRuntime
 */
export async function streamTextToDataStreamResponse(
  result: StreamTextResult<any, never>
): Promise<Response> {
  const [assistantStream, controller] = createAssistantStreamController();

  // Process the stream asynchronously
  (async () => {
    try {
      let textController: ReturnType<
        AssistantStreamController['addTextPart']
      > | null = null;
      const toolCallControllers = new Map<
        string,
        ReturnType<AssistantStreamController['addToolCallPart']>
      >();

      for await (const part of result.fullStream) {
        switch (part.type) {
          case 'text-start':
            textController = controller.addTextPart();
            break;

          case 'text-delta':
            if (!textController) {
              textController = controller.addTextPart();
            }
            textController.append(part.text);
            break;

          case 'text-end':
            textController?.close();
            textController = null;
            break;

          case 'tool-input-start': {
            const toolCallId = part.id;
            if (!toolCallControllers.has(toolCallId)) {
              const toolCallController = controller.addToolCallPart({
                toolCallId,
                toolName: part.toolName,
              });
              toolCallControllers.set(toolCallId, toolCallController);
            }
            break;
          }

          case 'tool-input-delta': {
            const toolCallId = part.id;
            const toolCallController = toolCallControllers.get(toolCallId);
            if (toolCallController) {
              toolCallController.argsText.append(part.delta);
            }
            break;
          }

          case 'tool-input-end': {
            const toolCallId = part.id;
            const toolCallController = toolCallControllers.get(toolCallId);
            if (toolCallController) {
              toolCallController.argsText.close();
            }
            break;
          }

          case 'tool-call': {
            const toolCallId = part.toolCallId;
            const existingController = toolCallControllers.get(toolCallId);

            if (!existingController) {
              const toolCallController = controller.addToolCallPart({
                toolCallId,
                toolName: part.toolName,
                args: part.input as any,
              });
              toolCallControllers.set(toolCallId, toolCallController);
            }
            break;
          }

          case 'tool-result': {
            const toolCallId = part.toolCallId;
            const toolCallController = toolCallControllers.get(toolCallId);

            if (toolCallController) {
              toolCallController.setResponse({
                result: serializeStructuredData(part.output),
                isError: false,
              });
            }
            break;
          }

          case 'tool-error': {
            const toolCallId = part.toolCallId;
            const toolCallController = toolCallControllers.get(toolCallId);

            if (toolCallController) {
              toolCallController.setResponse({
                result: serializeStructuredData(part.error),
                isError: true,
              });
            }
            break;
          }

          case 'start-step': {
            // Generate a message ID for the step
            const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            controller.enqueue({
              type: 'step-start',
              path: [],
              messageId,
            });
            break;
          }

          case 'finish-step': {
            const usage = part.usage as any;
            controller.enqueue({
              type: 'step-finish',
              path: [],
              finishReason: part.finishReason as any,
              usage: {
                promptTokens: usage.promptTokens ?? usage.prompt?.tokens ?? 0,
                completionTokens:
                  usage.completionTokens ?? usage.completion?.tokens ?? 0,
              },
              isContinued: false,
            });
            break;
          }

          case 'finish': {
            const usage = part.totalUsage as any;
            controller.enqueue({
              type: 'message-finish',
              path: [],
              finishReason: part.finishReason as any,
              usage: {
                promptTokens: usage.promptTokens ?? usage.prompt?.tokens ?? 0,
                completionTokens:
                  usage.completionTokens ?? usage.completion?.tokens ?? 0,
              },
            });
            break;
          }

          case 'error': {
            controller.enqueue({
              type: 'error',
              path: [],
              error:
                part.error instanceof Error
                  ? part.error.message
                  : typeof part.error === 'string'
                    ? part.error
                    : 'Unknown error',
            });
            break;
          }

          // Ignore other part types for now
          case 'start':
          case 'abort':
          case 'raw':
          case 'reasoning-start':
          case 'reasoning-delta':
          case 'reasoning-end':
          case 'source':
          case 'file':
            break;
        }
      }

      // Close any remaining controllers
      textController?.close();
      toolCallControllers.forEach(ctrl => ctrl.close());
      controller.close();
    } catch (error) {
      controller.enqueue({
        type: 'error',
        path: [],
        error:
          error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : 'Unknown error',
      });
      controller.close();
    }
  })();

  // Create the DataStream encoder
  const encoder = new DataStreamEncoder();

  // Return the response using AssistantStream.toResponse
  return AssistantStream.toResponse(assistantStream, encoder);
}
