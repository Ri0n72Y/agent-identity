import type { ContentBlock, ToolHistory, ToolSchema } from '@deepseek-ai/dsh-llm'
import type { DeepSeekLlmApiExtensionRequest, PreparedDeepSeekLlmApiExtension } from '@deepseek-ai/dsh-deepseek-llm-api-extensions'

type StructuredOutputChoice = { type: 'tool'; name: string }

declare module '@deepseek-ai/dsh-deepseek-llm-api-extensions/types' {
  interface DeepSeekLlmApiExtensionMap {
    tool_choice: StructuredOutputChoice
  }
}

/** Request-local output tool. Its arguments are the input to summary persistence. */
export const STRUCTURED_OUTPUT_TOOL: ToolSchema = {
  name: 'structured_output',
  description: 'Submit the summary of the selected completed turn exactly once.',
  parameters: {
    type: 'object',
    properties: { summary: { type: 'string', description: 'Concise natural-language turn summary.' } },
    required: ['summary'],
    additionalProperties: false,
  },
}

/** Add the provider constraint only to TSP's auxiliary request. */
export function prepareStructuredOutputChoice(
  request: DeepSeekLlmApiExtensionRequest,
): PreparedDeepSeekLlmApiExtension<StructuredOutputChoice> | undefined {
  if (request.purpose !== 'turn-summary') return undefined
  return { value: { type: 'tool', name: STRUCTURED_OUTPUT_TOOL.name } }
}

/** Include the output tool in both native tool declarations and their historical projection. */
export function withStructuredOutput(
  tools: readonly ToolSchema[],
  history: ToolHistory,
): { tools: ToolSchema[]; toolHistory: ToolHistory } {
  const name = STRUCTURED_OUTPUT_TOOL.name
  if ([...tools, ...history.tools, ...history.updates.flatMap(update => update.additions)]
    .some(tool => tool.name === name)) {
    throw new Error('dsh-tsp: structured_output already exists in the Session tool declarations')
  }
  return {
    tools: [...tools, STRUCTURED_OUTPUT_TOOL],
    toolHistory: { ...history, tools: [...history.tools, STRUCTURED_OUTPUT_TOOL] },
  }
}

/** Read exactly one output call. Other requested tools are never dispatched. */
export function readStructuredOutput(blocks: readonly ContentBlock[]): string {
  const calls = blocks.filter(block => block.type === 'tool-call')
  if (calls.length !== 1 || calls[0]?.name !== STRUCTURED_OUTPUT_TOOL.name) {
    throw new Error('dsh-tsp: expected exactly one structured_output tool call')
  }
  let value: unknown
  try {
    value = JSON.parse(calls[0].arguments)
  } catch (error) {
    throw new Error('dsh-tsp: structured_output arguments are not valid JSON', { cause: error })
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)
    || Object.keys(value).length !== 1 || !('summary' in value)
    || typeof value.summary !== 'string' || value.summary.trim().length === 0) {
    throw new Error('dsh-tsp: expected a JSON object containing only a non-empty summary string')
  }
  return value.summary
}
