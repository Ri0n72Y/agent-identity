import type { CommandDefinition, CommandInvocation } from '@deepseek-ai/dsh-commands'
import type {} from '@deepseek-ai/dsh-agent'

import type { SessionSummaryCoordinator } from './session-summary.ts'

/** Registerable DSH command definition for explicit TSP generation. */
export function createSummarizeCommand(coordinator: SessionSummaryCoordinator): CommandDefinition {
  return {
    name: 'summarize',
    description: 'Summarize completed turns and update this Session’s TSP',
    handler: async (invocation: CommandInvocation) => {
      if (invocation.rawInput.trim().length > 0) {
        return { kind: 'error', text: '/summarize does not accept arguments' }
      }

      try {
        const result = await coordinator.summarize(invocation.agent.session, invocation.signal)
        if (result.processedTurns === 0) {
          return {
            kind: 'success',
            text: 'TSP is up to date. No new completed turns were found.',
          }
        }

        const range = result.firstTurn === result.lastTurn
          ? 'turn ' + result.firstTurn
          : 'turns ' + result.firstTurn + '–' + result.lastTurn
        return {
          kind: 'success',
          text: 'TSP updated: summarized ' + result.processedTurns + ' ' + range + '.',
        }
      } catch (error) {
        invocation.signal.throwIfAborted()
        const detail = error instanceof Error ? error.message : String(error)
        return { kind: 'error', text: 'TSP summarization failed: ' + detail }
      }
    },
  }
}
