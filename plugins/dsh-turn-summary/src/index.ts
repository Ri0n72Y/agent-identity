import type { Context } from '@deepseek-ai/cordis'
import { dshPath } from '@deepseek-ai/dsh-home-paths'
import type {} from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-session-query'
import type {} from '@deepseek-ai/dsh-system-prompt'

import { Config, resolveConfig } from './config.ts'
import type { TurnSummaryConfig } from './config.ts'
import { SessionSummaryCoordinator } from './session-summary.ts'

export const name = 'dsh-turn-summary'
export const inject = ['llm', 'sessionQuery', 'systemPrompt']

/** Install the TSP event collector, JSON store, and Markdown context provider. */
export function apply(ctx: Context, config: TurnSummaryConfig = {}): void {
  const resolved = resolveConfig(config)
  const stateDirectory = dshPath('state', 'turn-summary')
  new SessionSummaryCoordinator(ctx, resolved, stateDirectory)
}

export { Config }
export type { TurnSummaryConfig }

export default {
  name,
  inject,
  Config,
  apply,
}