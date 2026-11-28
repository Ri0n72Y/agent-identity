import type { Context } from '@deepseek-ai/cordis'
import { BlockAssembler } from '@deepseek-ai/dsh-llm'
import type { FinishReason, GenerateOptions } from '@deepseek-ai/dsh-llm'
import type { Session } from '@deepseek-ai/dsh-session'

import type { ResolvedTurnSummaryConfig } from '../config.ts'
import type { TurnSummaryInput } from './types.ts'
import { buildSummaryMessages } from './request.ts'

declare module '@deepseek-ai/dsh-llm/types' {
  interface LlmRequestPurposeMap {
    'turn-summary': true
  }
}

/** Generate one independent Turn Summary with one auxiliary model request. */
export async function generateTurnSummary(
  ctx: Context,
  config: ResolvedTurnSummaryConfig,
  session: Session,
  turn: TurnSummaryInput,
  invocationSignal: AbortSignal,
): Promise<string> {
  const header = session.requestHeader()
  const route = resolveRoute(config, session)
  const messages = buildSummaryMessages(session.deriveMessages(), session.id, turn)

  const signal = AbortSignal.any([invocationSignal, AbortSignal.timeout(config.timeoutMs)])
  const options: GenerateOptions = {
    ...route,
    messages,
    toolHistory: session.toolHistory(),
    ...(header?.tools === undefined ? {} : { tools: [...header.tools] }),
    ...(header?.config.provider === route.provider && header.config.model === route.model
      && header.config.reasoningEffort !== undefined ? { reasoningEffort: header.config.reasoningEffort } : {}),
    sessionId: session.id,
    purpose: 'turn-summary',
    signal,
  }

  const assembler = new BlockAssembler()
  let finished = false
  for await (const chunk of ctx.llm.stream(options)) {
    signal.throwIfAborted()
    assembler.push(chunk)
    if (chunk.type === 'finish') finished = true
  }

  if (!finished) throw new Error('dsh-tsp: model stream ended without a finish event')
  const text = textOutput(assembler.blocks())
  assertSuccessfulFinish(assembler.finish)
  signal.throwIfAborted()
  return validateSummaryOutput(text)
}

/** Validate the model's JSON response before persisting its summary. */
export function validateSummaryOutput(text: string): string {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch (error) {
    throw new Error('dsh-tsp: model output is not valid JSON', { cause: error })
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)
    || Object.keys(value).length !== 1 || !('summary' in value)
    || typeof value.summary !== 'string' || value.summary.trim().length === 0) {
    throw new Error('dsh-tsp: expected a JSON object containing only a non-empty summary string')
  }
  return value.summary
}

function resolveRoute(
  config: ResolvedTurnSummaryConfig,
  session: Session,
): Pick<GenerateOptions, 'provider' | 'model'> {
  const header = session.requestHeader()
  const provider = config.provider ?? header?.config.provider
  const model = config.model ?? header?.config.model
  if (provider === undefined || model === undefined || provider.length === 0 || model.length === 0) {
    throw new Error('dsh-tsp: no model route is available; configure provider and model together')
  }
  return { provider, model }
}

function textOutput(blocks: ReturnType<BlockAssembler['blocks']>): string {
  const unsupported = blocks.find(block => block.type !== 'text' && block.type !== 'reasoning')
  if (unsupported !== undefined) {
    throw new Error('dsh-tsp: summarizer output must contain text only')
  }
  return blocks
    .filter((block): block is Extract<(typeof blocks)[number], { type: 'text' }> => block.type === 'text')
    .map(block => block.text)
    .join('')
}

function assertSuccessfulFinish(finish: FinishReason): void {
  switch (finish.kind) {
    case 'stop':
      return
    case 'error':
    case 'aborted':
      throw new Error('dsh-tsp: summarization failed (' + finish.failure.code + '): ' + finish.failure.message)
    case 'max-tokens':
      throw new Error('dsh-tsp: model output limit reached before completing the summary')
    case 'tool-calls':
      throw new Error('dsh-tsp: summarizer attempted to call a tool')
    default:
      throw new Error('dsh-tsp: summarizer returned an unsupported finish reason')
  }
}
