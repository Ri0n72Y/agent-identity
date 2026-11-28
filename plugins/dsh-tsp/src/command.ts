import type { CommandDefinition, CommandInvocation } from '@deepseek-ai/dsh-commands'
import type { TurnSummaryRecord } from './turn-summary/types.ts'

/** Native user command; the execution function can also be used independently. */
export function createSummarizeCommand(
  summarize: (invocation: CommandInvocation) => Promise<TurnSummaryRecord | undefined>,
): CommandDefinition {
  return {
    name: 'summarize',
    description: 'Summarize the current completed turn',
    handler: async invocation => {
      if (invocation.rawInput.trim().length > 0) {
        return { kind: 'error', text: '/summarize does not accept arguments' }
      }
      try {
        const record = await summarize(invocation)
        return record === undefined
          ? { kind: 'success', text: 'No complete local turn to summarize.' }
          : { kind: 'success', text: 'Turn ' + record.turn + ' summary saved.\n\n' + record.summary }
      } catch (error) {
        invocation.signal.throwIfAborted()
        const detail = error instanceof Error ? error.message : String(error)
        return { kind: 'error', text: 'TSP summarization failed: ' + detail }
      }
    },
  }
}
