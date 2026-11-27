import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SessionId, SessionSeq } from '@deepseek-ai/dsh-session'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'
import type { Context } from '@deepseek-ai/cordis'

import { SessionSummaryCoordinator } from '../src/session-summary.ts'
import { generateTurnSummary } from '../src/summary-generator.ts'
import type { ResolvedTurnSummaryConfig } from '../src/config.ts'

vi.mock('../src/summary-generator.ts', () => ({
  generateTurnSummary: vi.fn(),
}))

const generate = vi.mocked(generateTurnSummary)
let root = ''

function turnEvents(turns: number): SessionEvent[] {
  const events: SessionEvent[] = []
  for (let turn = 1; turn <= turns; turn += 1) {
    const start = (turn - 1) * 2
    events.push({
      type: 'turn/start',
      seq: SessionSeq(start),
      time: turn * 1000,
      data: { turn },
    })
    events.push({
      type: 'turn/end',
      seq: SessionSeq(start + 1),
      time: turn * 1000 + 500,
      data: { turn, reason: { kind: 'completed' } },
    })
  }
  return events
}

function makeSession(): Session {
  return {
    id: SessionId('tsp-test-session'),
    requestHeader: () => ({ config: { provider: 'test-provider', model: 'test-model' } }),
  } as unknown as Session
}

function makeContext(events: SessionEvent[]): Context {
  return {
    systemPrompt: { context: vi.fn() },
    sessionQuery: {
      readSession: vi.fn(async () => ({
        session: { id: SessionId('tsp-test-session'), version: 4, createdAt: 1, isSeeded: false },
        inheritedEventCount: 0,
        events,
      })),
    },
    on: vi.fn(),
    logger: { warn: vi.fn() },
  } as unknown as Context
}

const config: ResolvedTurnSummaryConfig = {
  maxTokens: 1800,
  timeoutMs: 60000,
  maxInputBytes: 120000,
  maxContextBytes: 24000,
  maxEventTextChars: 6000,
  maxSummaryChars: 12000,
  maxRecentTurns: 12,
}

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'dsh-tsp-coordinator-'))
  generate.mockReset()
  generate.mockImplementation(async (_ctx, _config, _session, _previous, input) => ({
    turnSummary: 'Turn ' + input.turn + ' summary',
    sessionSummary: 'Current through turn ' + input.turn,
  }))
})

afterEach(async () => {
  await rm(root, { recursive: true, force: true })
})

describe('SessionSummaryCoordinator explicit execution', () => {
  it('summarizes only the latest complete turn on first invocation and is idempotent', async () => {
    const events = turnEvents(2)
    const ctx = makeContext(events)
    const coordinator = new SessionSummaryCoordinator(ctx, config, root)
    const session = makeSession()

    const first = await coordinator.summarize(session, new AbortController().signal)
    const second = await coordinator.summarize(session, new AbortController().signal)

    expect(first).toEqual({ processedTurns: 1, firstTurn: 2, lastTurn: 2 })
    expect(second).toEqual({ processedTurns: 0 })
    expect(generate).toHaveBeenCalledTimes(1)
    expect(generate.mock.calls[0]?.[4].turn).toBe(2)
    const saved = JSON.parse(await readFile(join(root, Buffer.from(session.id).toString('hex') + '.json'), 'utf8'))
    expect(saved.processedThroughSeq).toBe(3)
    expect(saved.sessionSummary).toBe('Current through turn 2')
  })

  it('processes later unprocessed turns in source order on an explicit invocation', async () => {
    let events = turnEvents(2)
    const ctx = makeContext(events)
    const coordinator = new SessionSummaryCoordinator(ctx, config, root)
    const session = makeSession()
    await coordinator.summarize(session, new AbortController().signal)

    events = turnEvents(4)
    const query = ctx.sessionQuery.readSession as unknown as ReturnType<typeof vi.fn>
    query.mockImplementation(async () => ({
      session: { id: session.id, version: 4, createdAt: 1, isSeeded: false },
      inheritedEventCount: 0,
      events,
    }))

    const result = await coordinator.summarize(session, new AbortController().signal)
    expect(result).toEqual({ processedTurns: 2, firstTurn: 3, lastTurn: 4 })
    expect(generate.mock.calls.map(call => call[4].turn)).toEqual([2, 3, 4])
  })

  it('does not advance the watermark after generation failure and retries on the next command', async () => {
    const events = turnEvents(1)
    const ctx = makeContext(events)
    const coordinator = new SessionSummaryCoordinator(ctx, config, root)
    const session = makeSession()
    generate.mockRejectedValueOnce(new Error('provider unavailable'))

    await expect(coordinator.summarize(session, new AbortController().signal)).rejects.toThrow('provider unavailable')
    await expect(readFile(join(root, Buffer.from(session.id).toString('hex') + '.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })

    const result = await coordinator.summarize(session, new AbortController().signal)
    expect(result.processedTurns).toBe(1)
    expect(generate).toHaveBeenCalledTimes(2)
  })

  it('rejects overlapping explicit invocations for the same Session without queuing', async () => {
    const events = turnEvents(1)
    const ctx = makeContext(events)
    const coordinator = new SessionSummaryCoordinator(ctx, config, root)
    const session = makeSession()
    let release: (() => void) | undefined
    generate.mockImplementationOnce(() => new Promise(resolve => {
      release = () => resolve({ turnSummary: 'Done', sessionSummary: 'Done' })
    }))

    const first = coordinator.summarize(session, new AbortController().signal)
    await Promise.resolve()
    await expect(coordinator.summarize(session, new AbortController().signal)).rejects.toThrow('already running')
    release?.()
    await expect(first).resolves.toMatchObject({ processedTurns: 1 })
  })
})
