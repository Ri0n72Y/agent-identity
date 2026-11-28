import type { Context } from '@deepseek-ai/cordis'
import { BlockAssembler, ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import type { FinishReason, GenerateOptions } from '@deepseek-ai/dsh-llm'
import type { Session } from '@deepseek-ai/dsh-session'

import type { ResolvedTurnSummaryConfig } from '../config.ts'
import type { TurnSummaryInput } from './types.ts'
import { buildSummaryMessages } from './request.ts'
import { readStructuredOutput, withStructuredOutput } from './structured-output.ts'

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
    ...withStructuredOutput(header?.tools ?? [], session.toolHistory()),
    reasoningEffort: ReasoningEffortId('off'),
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
  assertSuccessfulFinish(assembler.finish)
  signal.throwIfAborted()
  return readStructuredOutput(assembler.blocks())
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
  if (provider !== 'deepseek-official' && provider !== 'deepseek-account') {
    throw new Error('dsh-tsp: forced structured output requires a native DeepSeek provider (deepseek-official or deepseek-account)')
  }
  return { provider, model }
}

function assertSuccessfulFinish(finish: FinishReason): void {
  switch (finish.kind) {
    case 'tool-calls':
      return
    case 'stop':
      throw new Error('dsh-tsp: model did not submit structured_output')
    case 'error':
    case 'aborted':
      throw new Error('dsh-tsp: summarization failed (' + finish.failure.code + '): ' + finish.failure.message)
    case 'max-tokens':
      throw new Error('dsh-tsp: model output limit reached before completing the summary')
    default:
      throw new Error('dsh-tsp: summarizer returned an unsupported finish reason')
  }
}
