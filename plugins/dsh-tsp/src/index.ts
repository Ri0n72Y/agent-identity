import type { Context } from '@deepseek-ai/cordis'
import { dshPath } from '@deepseek-ai/dsh-home-paths'
import type {} from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-commands'
import type {} from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-session-query'

import { Config, resolveConfig } from './config.ts'
import type { TurnSummaryConfig } from './config.ts'
import { createSummarizeCommand } from './command.ts'
import { summarizeCurrentTurn, TurnSummaryStore } from './turn-summary/index.ts'

export const name = 'dsh-tsp'
export const inject = ['llm', 'sessionQuery', 'commands']

export function apply(ctx: Context, config: TurnSummaryConfig = {}): void {
  const resolved = resolveConfig(config)
  const store = new TurnSummaryStore(dshPath('state', 'tsp', 'turn-summary'))
  ctx.effect(
    () => ctx.commands.register(createSummarizeCommand(invocation =>
      summarizeCurrentTurn(ctx, resolved, store, invocation.agent.session, invocation.signal))),
    'dsh-tsp: /summarize',
  )
}

export { Config }
export type { TurnSummaryConfig }
export { summarizeCurrentTurn, generateTurnSummary, TurnSummaryStore } from './turn-summary/index.ts'
export type { TurnSummaryInput, TurnSummaryRecord } from './turn-summary/index.ts'

export default { name, inject, Config, apply }
