import type { CommandDefinition, CommandInvocation } from '@deepseek-ai/dsh-commands'
import type {} from '@deepseek-ai/dsh-agent'

import type { SessionSummaryCoordinator } from './session-summary.ts'

/** Registerable DSH command definition for explicit TSP generation. */
export function createSummarizeCommand(coordinator: SessionSummaryCoordinator): CommandDefinition {
  return {
    name: 'summarize',
    description: 'Summarize the current completed turn and update this Session’s TSP',
    handler: async (invocation: CommandInvocation) => {
      if (invocation.rawInput.trim().length > 0) {
        return { kind: 'error', text: '/summarize does not accept arguments' }
      }

      try {
        const turn = await coordinator.summarize(invocation.agent.session, invocation.signal)
        return turn === undefined
          ? { kind: 'success', text: 'No complete local turn to summarize.' }
          : { kind: 'success', text: 'TSP updated for turn ' + turn + '.' }
      } catch (error) {
        invocation.signal.throwIfAborted()
        const detail = error instanceof Error ? error.message : String(error)
        return { kind: 'error', text: 'TSP summarization failed: ' + detail }
      }
    },
  }
}
