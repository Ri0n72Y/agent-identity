import z from '@deepseek-ai/schemastery'

/** Optional auxiliary model route and request timeout. */
export interface TurnSummaryConfig {
  provider?: string
  model?: string
  timeoutMs?: number
}

export interface ResolvedTurnSummaryConfig {
  readonly provider?: string
  readonly model?: string
  readonly timeoutMs: number
}

export const Config: z<TurnSummaryConfig> = z.object({
  provider: z.string(),
  model: z.string(),
  timeoutMs: z.number().step(1).min(1000).max(600000).default(60000),
})

export function resolveConfig(config: TurnSummaryConfig = {}): ResolvedTurnSummaryConfig {
  if ((config.provider === undefined) !== (config.model === undefined)) {
    throw new Error('dsh-turn-summary: provider and model must be supplied together')
  }
  if (config.provider?.trim() === '' || config.model?.trim() === '') {
    throw new Error('dsh-turn-summary: provider and model overrides must be non-empty')
  }
  const timeoutMs = config.timeoutMs ?? 60000
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 600000) {
    throw new Error('dsh-turn-summary: timeoutMs must be an integer from 1000 to 600000')
  }
  return Object.freeze({
    ...(config.provider === undefined ? {} : { provider: config.provider }),
    ...(config.model === undefined ? {} : { model: config.model }),
    timeoutMs,
  })
}
