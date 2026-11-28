import type { SessionEvent } from '@deepseek-ai/dsh-session'

/** One turn summary tied to its source Session and turn. */
export interface TurnSummaryRecord {
  readonly sessionId: string
  readonly turn: number
  readonly summary: string
}

/** A complete turn selected from the original Session log. */
export interface TurnSummaryInput {
  readonly turn: number
  readonly events: readonly SessionEvent[]
}
