import type { SessionEvent } from '@deepseek-ai/dsh-session'

import { renderTurnEvents } from './markdown-renderer.ts'
import type { TurnSummaryInput } from './types.ts'

type TurnStartEvent = Extract<SessionEvent, { type: 'turn/start' }>
type TurnEndEvent = Extract<SessionEvent, { type: 'turn/end' }>

/** Locate the start event paired with one committed turn end. */
export function collectTurnInputForEnd(
  events: readonly SessionEvent[],
  endEvent: TurnEndEvent,
  maxEventTextChars: number,
): TurnSummaryInput {
  const endIndex = events.findIndex(event => event.seq === endEvent.seq && event.type === 'turn/end')
  if (endIndex < 0) throw new Error('dsh-turn-summary: turn/end was absent from the Session query snapshot')

  let startIndex = -1
  for (let index = 0; index < endIndex; index += 1) {
    const event = events[index]
    if (event?.type === 'turn/start' && event.data.turn === endEvent.data.turn) startIndex = index
  }
  if (startIndex < 0) {
    throw new Error('dsh-turn-summary: turn/start was absent for turn ' + endEvent.data.turn)
  }

  const start = events[startIndex] as TurnStartEvent
  const end = events[endIndex] as TurnEndEvent
  const window = events.slice(startIndex, endIndex + 1)

  return {
    turn: start.data.turn,
    startSeq: start.seq,
    endSeq: end.seq,
    startedAt: start.time,
    endedAt: end.time,
    reason: end.data.reason,
    sourceMarkdown: renderTurnEvents(window, maxEventTextChars),
  }
}

/** Find the earliest complete, unprocessed turn before one observed turn-end watermark. */
export function collectNextTurnInput(
  events: readonly SessionEvent[],
  processedThroughSeq: number,
  throughSeq: number,
  maxEventTextChars: number,
): TurnSummaryInput | undefined {
  let start: TurnStartEvent | undefined

  for (const event of events) {
    if (event.seq <= processedThroughSeq) continue
    if (event.seq > throughSeq) break

    if (event.type === 'turn/start') {
      start = event
      continue
    }

    if (event.type === 'turn/end' && start?.data.turn === event.data.turn) {
      const window = events.filter(candidate =>
        candidate.seq >= start!.seq && candidate.seq <= event.seq,
      )
      return {
        turn: start.data.turn,
        startSeq: start.seq,
        endSeq: event.seq,
        startedAt: start.time,
        endedAt: event.time,
        reason: event.data.reason,
        sourceMarkdown: renderTurnEvents(window, maxEventTextChars),
      }
    }
  }

  return undefined
}