import type { TurnEndReason } from '@deepseek-ai/dsh-session'

/** Current JSON persistence protocol version. */
export const TSP_SCHEMA_VERSION = 1 as const

/** One generated, human-readable summary tied to an exact source turn. */
export interface TurnSummaryRecord {
  readonly turn: number
  readonly startSeq: number
  readonly endSeq: number
  readonly startedAt: number
  readonly endedAt: number
  readonly reason: TurnEndReason
  readonly markdown: string
}

/** One Session's complete derived TSP state. */
export interface SessionSummaryDocument {
  readonly schemaVersion: typeof TSP_SCHEMA_VERSION
  readonly sessionId: string
  /** Highest source event seq represented by the summaries. -1 means no turn has been processed. */
  readonly processedThroughSeq: number
  readonly updatedAt: number
  /** The sole Session-scoped working summary. */
  readonly sessionSummary: string
  /** A bounded, newest-last list of detailed recent interactions. */
  readonly recentTurnSummaries: readonly TurnSummaryRecord[]
}

/** Exact source interval and Markdown transcript supplied for one generation. */
export interface TurnSummaryInput {
  readonly turn: number
  readonly startSeq: number
  readonly endSeq: number
  readonly startedAt: number
  readonly endedAt: number
  readonly reason: TurnEndReason
  readonly sourceMarkdown: string
}

/** Validated model output. The JSON wrapper carries Markdown values. */
export interface SummaryModelOutput {
  readonly turnSummary: string
  readonly sessionSummary: string
}