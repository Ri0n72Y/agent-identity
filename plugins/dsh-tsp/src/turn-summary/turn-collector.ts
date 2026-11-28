import type { SessionEvent } from '@deepseek-ai/dsh-session'

import { renderTurnEvents } from './markdown-renderer.ts'
import type { TurnSummaryInput } from './types.ts'

/** Select the latest complete turn in the supplied local event log. */
export function collectCurrentTurn(events: readonly SessionEvent[]): TurnSummaryInput | undefined {
  let startIndex: number | undefined
  let latest: { start: number; end: number; turn: number } | undefined
  for (const [index, event] of events.entries()) {
    if (event.type === 'turn/start') {
      startIndex = index
    } else if (event.type === 'turn/end') {
      const start = startIndex === undefined ? undefined : events[startIndex]
      if (startIndex !== undefined && start?.type === 'turn/start' && start.data.turn === event.data.turn) {
        latest = { start: startIndex, end: index, turn: event.data.turn }
      }
      startIndex = undefined
    }
  }
  if (latest === undefined) return undefined
  return {
    turn: latest.turn,
    sourceMarkdown: renderTurnEvents(events.slice(latest.start, latest.end + 1)),
  }
}
