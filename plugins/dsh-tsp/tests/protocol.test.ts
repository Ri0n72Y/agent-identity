import { describe, expect, it } from 'vitest'
import { SessionSeq } from '@deepseek-ai/dsh-session'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import type { MessageId, ToolCallId } from '@deepseek-ai/dsh-llm'

import { collectCurrentTurn } from '../src/turn-summary/turn-collector.ts'
import { buildInput, parseSummaryOutput } from '../src/turn-summary/summary-generator.ts'

declare module '@deepseek-ai/dsh-llm' {
  interface MessageSourceMap {
    'runtime-context': { kind: 'runtime-context' }
  }
}

const messageId = (value: string) => value as MessageId
const callId = 'call-1' as ToolCallId

const events = [
  {
    type: 'turn/start',
    seq: SessionSeq(0),
    time: 100,
    data: { turn: 1 },
  },
  {
    type: 'user/message',
    seq: SessionSeq(1),
    time: 110,
    surfaceOp: 'append',
    data: {
      id: messageId('user-1'),
      role: 'user',
      source: { kind: 'user' },
      content: [{ type: 'text', text: 'Inspect the repository' }],
    },
  },
  {
    type: 'user/message',
    seq: SessionSeq(2),
    time: 120,
    surfaceOp: 'append',
    data: {
      id: messageId('context-1'),
      role: 'user',
      source: { kind: 'runtime-context' },
      content: [{ type: 'text', text: 'Previous TSP content' }],
    },
  },
  {
    type: 'tool/call',
    seq: SessionSeq(3),
    time: 130,
    data: { turn: 1, step: 1, name: 'read_file', callId, arguments: '{}' },
  },
  {
    type: 'tool/result',
    seq: SessionSeq(4),
    time: 140,
    surfaceOp: 'append',
    data: {
      turn: 1,
      step: 1,
      message: {
        id: messageId('tool-1'),
        role: 'tool',
        source: { kind: 'tool', callId },
        toolCallId: callId,
        isError: true,
        content: [{ type: 'text', text: 'Missing file' }],
      },
      error: { name: 'NotFoundError', code: 'ENOENT', reason: 'Not found' },
    },
  },
  {
    type: 'assistant/message',
    seq: SessionSeq(5),
    time: 150,
    surfaceOp: 'append',
    data: {
      turn: 1,
      step: 1,
      message: {
        id: messageId('assistant-1'),
        role: 'assistant',
        source: { kind: 'model', provider: 'test', model: 'test-model' },
        content: [{ type: 'text', text: 'File not found' }, { type: 'reasoning', text: 'Internal trace' }],
      },
      stream: [],
    },
  },
  {
    type: 'turn/end',
    seq: SessionSeq(6),
    time: 160,
    data: { turn: 1, reason: { kind: 'completed' } },
  },
] satisfies SessionEvent[]


describe('TSP protocol', () => {
  it('renders the current complete turn, omitting runtime snapshots and reasoning', () => {
    const turn = collectCurrentTurn(events)
    expect(turn?.turn).toBe(1)
    expect(turn?.sourceMarkdown).toContain('Inspect the repository')
    expect(turn?.sourceMarkdown).toContain('read_file (call-1)')
    expect(turn?.sourceMarkdown).toContain('Missing file')
    expect(turn?.sourceMarkdown).toContain('Not found')
    expect(turn?.sourceMarkdown).toContain('File not found')
    expect(turn?.sourceMarkdown).not.toContain('Previous TSP content')
    expect(turn?.sourceMarkdown).not.toContain('Internal trace')
  })

  it('selects one complete turn without backfilling earlier turns', () => {
    const second: SessionEvent[] = [
      { type: 'turn/start', seq: SessionSeq(7), time: 170, data: { turn: 2 } },
      { type: 'turn/end', seq: SessionSeq(8), time: 180, data: { turn: 2, reason: { kind: 'completed' } } },
    ]
    expect(collectCurrentTurn([...events, ...second])?.turn).toBe(2)
    expect(collectCurrentTurn([...events, ...second])?.sourceMarkdown).not.toContain('Inspect the repository')
    expect(collectCurrentTurn(second.slice(1))).toBeUndefined()
    expect(collectCurrentTurn(second.slice(0, 1))).toBeUndefined()
  })

  it('preserves complete long text in input and output', () => {
    const long = '输入'.repeat(70000) + ' FINAL RESPONSE'
    const turn = collectCurrentTurn(events.map(event => event.type === 'assistant/message'
      ? { ...event, data: { ...event.data, message: { ...event.data.message, content: [{ type: 'text' as const, text: long }] } } }
      : event))
    if (!turn) throw new Error('Expected a complete turn')
    expect(turn.sourceMarkdown).toContain(long)
    expect(buildInput('s1', turn)).toContain(long)
    expect(buildInput('s1', turn)).toContain('s1')
    expect(parseSummaryOutput(JSON.stringify({ summary: long }))).toBe(long)
  })

  it('validates the single summary field', () => {
    expect(parseSummaryOutput(JSON.stringify({ summary: 'Inspected; file missing.' }))).toBe('Inspected; file missing.')
    expect(() => parseSummaryOutput('not JSON')).toThrow()
    expect(() => parseSummaryOutput(JSON.stringify({ summary: '' }))).toThrow()
    expect(() => parseSummaryOutput(JSON.stringify({ summary: 'state', extra: true }))).toThrow()
  })
})
