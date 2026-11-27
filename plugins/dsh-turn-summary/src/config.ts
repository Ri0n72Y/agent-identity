import z from '@deepseek-ai/schemastery'

/** User-configurable controls for TSP generation and retention. */
export interface TurnSummaryConfig {
  /** Optional explicit route; omitted values use the Session's latest request route. */
  provider?: string
  model?: string
  /** Output-token limit for one TSP generation request. */
  maxTokens?: number
  /** End-to-end timeout for one TSP generation request. */
  timeoutMs?: number
  /** Maximum UTF-8 bytes in one Markdown generation input. */
  maxInputBytes?: number
  /** Maximum UTF-8 bytes injected into one Agent prompt as TSP context. */
  maxContextBytes?: number
  /** Maximum characters retained from one source event. */
  maxEventTextChars?: number
  /** Maximum characters accepted in each generated Markdown summary. */
  maxSummaryChars?: number
  /** Number of recent Turn Summaries retained in the JSON document. */
  maxRecentTurns?: number
}

/** Resolved immutable runtime configuration. */
export interface ResolvedTurnSummaryConfig {
  readonly provider?: string
  readonly model?: string
  readonly maxTokens: number
  readonly timeoutMs: number
  readonly maxInputBytes: number
  readonly maxContextBytes: number
  readonly maxEventTextChars: number
  readonly maxSummaryChars: number
  readonly maxRecentTurns: number
}

/** Loader schema. Defaults keep the common path usable without configuration. */
export const Config: z<TurnSummaryConfig> = z.object({
  provider: z.string(),
  model: z.string(),
  maxTokens: z.number().step(1).min(1).max(10000).default(1800),
  timeoutMs: z.number().step(1).min(1000).max(600000).default(60000),
  maxInputBytes: z.number().step(1).min(1024).max(10000000).default(120000),
  maxContextBytes: z.number().step(1).min(1024).max(1000000).default(24000),
  maxEventTextChars: z.number().step(1).min(256).max(100000).default(6000),
  maxSummaryChars: z.number().step(1).min(512).max(100000).default(12000),
  maxRecentTurns: z.number().step(1).min(1).max(100).default(12),
})

/** Resolve defaults and reject an incomplete explicit model route. */
export function resolveConfig(config: TurnSummaryConfig = {}): ResolvedTurnSummaryConfig {
  const hasProvider = config.provider !== undefined
  const hasModel = config.model !== undefined

  if (hasProvider !== hasModel) {
    throw new Error('dsh-turn-summary: provider and model must be supplied together')
  }
  if (hasProvider && (config.provider?.trim().length === 0 || config.model?.trim().length === 0)) {
    throw new Error('dsh-turn-summary: provider and model overrides must be non-empty')
  }

  return Object.freeze({
    ...(config.provider === undefined ? {} : { provider: config.provider }),
    ...(config.model === undefined ? {} : { model: config.model }),
    maxTokens: boundedInteger('maxTokens', config.maxTokens ?? 1800, 1, 10000),
    timeoutMs: boundedInteger('timeoutMs', config.timeoutMs ?? 60000, 1000, 600000),
    maxInputBytes: boundedInteger('maxInputBytes', config.maxInputBytes ?? 120000, 1024, 10000000),
    maxContextBytes: boundedInteger('maxContextBytes', config.maxContextBytes ?? 24000, 1024, 1000000),
    maxEventTextChars: boundedInteger('maxEventTextChars', config.maxEventTextChars ?? 6000, 256, 100000),
    maxSummaryChars: boundedInteger('maxSummaryChars', config.maxSummaryChars ?? 12000, 512, 100000),
    maxRecentTurns: boundedInteger('maxRecentTurns', config.maxRecentTurns ?? 12, 1, 100),
  })
}

function boundedInteger(name: string, value: number, min: number, max: number): number {
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new Error('dsh-turn-summary: ' + name + ' must be an integer from ' + min + ' to ' + max)
  }
  return value
}
