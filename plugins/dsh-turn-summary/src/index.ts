import type { Context } from '@deepseek-ai/cordis'
import { dshPath } from '@deepseek-ai/dsh-home-paths'
import type {} from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-commands'
import type {} from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-session-query'
import type {} from '@deepseek-ai/dsh-system-prompt'

import { Config, resolveConfig } from './config.ts'
import type { TurnSummaryConfig } from './config.ts'
import { createSummarizeCommand } from './command.ts'
import { SessionSummaryCoordinator } from './session-summary.ts'

export const name = 'dsh-turn-summary'
export const inject = ['llm', 'sessionQuery', 'systemPrompt', 'commands']

/** Install TSP persistence, Markdown context, and the explicit /summarize command. */
export function apply(ctx: Context, config: TurnSummaryConfig = {}): void {
  const resolved = resolveConfig(config)
  const coordinator = new SessionSummaryCoordinator(ctx, resolved, dshPath('state', 'turn-summary'))

  ctx.effect(
    () => ctx.commands.register(createSummarizeCommand(coordinator)),
    'dsh-turn-summary: /summarize',
  )
}

export { Config }
export type { TurnSummaryConfig }

export default {
  name,
  inject,
  Config,
  apply,
}
