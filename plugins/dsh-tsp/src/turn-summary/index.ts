import type { Context } from '@deepseek-ai/cordis'
import type { Session } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-session-query'
import type { ResolvedTurnSummaryConfig } from '../config.ts'

import { collectCurrentTurn } from './turn-collector.ts'
import { generateTurnSummary } from './summary-generator.ts'
import type { TurnSummaryStore } from './json-store.ts'
import type { TurnSummaryRecord } from './types.ts'

/** Execute one independent summary of the latest complete local turn. */
export async function summarizeCurrentTurn(
  ctx: Context,
  config: ResolvedTurnSummaryConfig,
  store: TurnSummaryStore,
  session: Session,
  signal: AbortSignal,
): Promise<TurnSummaryRecord | undefined> {
  signal.throwIfAborted()
  const snapshot = await ctx.sessionQuery.readSession(session.id)
  signal.throwIfAborted()
  const turn = collectCurrentTurn(snapshot.events.slice(snapshot.inheritedEventCount))
  if (turn === undefined) return undefined
  const summary = await generateTurnSummary(ctx, config, session, turn, signal)
  signal.throwIfAborted()
  const record = { sessionId: session.id, turn: turn.turn, summary }
  await store.write(record)
  return record
}

export { generateTurnSummary } from './summary-generator.ts'
export { TurnSummaryStore } from './json-store.ts'
export type { TurnSummaryInput, TurnSummaryRecord } from './types.ts'
