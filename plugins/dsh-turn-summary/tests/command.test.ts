import { describe, expect, it, vi } from 'vitest'
import type { CommandDefinition, CommandInvocation } from '@deepseek-ai/dsh-commands'
import type { Agent } from '@deepseek-ai/dsh-agent'

import { createSummarizeCommand } from '../src/command.ts'
import type { SessionSummaryCoordinator } from '../src/session-summary.ts'

function invocation(rawInput = ''): CommandInvocation {
  const session = { id: 'session-1' }
  const agent = { id: session.id, session } as unknown as Agent
  return {
    commandId: 'command-1' as CommandInvocation['commandId'],
    agent,
    rawInput,
    attachments: [],
    signal: new AbortController().signal,
  }
}

describe('/summarize command', () => {
  it('runs the coordinator against the receiving Agent Session', async () => {
    const summarize = vi.fn(async () => ({ processedTurns: 1, firstTurn: 7, lastTurn: 7 }))
    const command: CommandDefinition = createSummarizeCommand({ summarize } as unknown as SessionSummaryCoordinator)

    const result = await command.handler(invocation())

    expect(summarize).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'session-1' }),
      expect.any(AbortSignal),
    )
    expect(result).toEqual({
      kind: 'success',
      text: 'TSP updated: summarized 1 turn 7.',
    })
  })

  it('rejects command arguments instead of silently ignoring them', async () => {
    const summarize = vi.fn()
    const command = createSummarizeCommand({ summarize } as unknown as SessionSummaryCoordinator)

    const result = await command.handler(invocation(' --force'))

    expect(summarize).not.toHaveBeenCalled()
    expect(result).toEqual({ kind: 'error', text: '/summarize does not accept arguments' })
  })

  it('returns a command error when generation fails', async () => {
    const summarize = vi.fn(async () => { throw new Error('provider unavailable') })
    const command = createSummarizeCommand({ summarize } as unknown as SessionSummaryCoordinator)

    const result = await command.handler(invocation())

    expect(result).toEqual({ kind: 'error', text: 'TSP summarization failed: provider unavailable' })
  })
})
