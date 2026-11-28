import { describe, expect, it } from 'vitest'
import { SessionSeq } from '@deepseek-ai/dsh-session'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import type { Message, MessageId, ToolCallId } from '@deepseek-ai/dsh-llm'

import { collectCurrentTurn } from '../src/turn-summary/turn-collector.ts'
import { validateSummaryOutput } from '../src/turn-summary/summary-generator.ts'
import { buildSummaryMessages, TURN_SUMMARY_INSTRUCTION } from '../src/turn-summary/request.ts'

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


describe('Turn Summary request', () => {
  it('selects only the latest complete local turn', () => {
    const second: SessionEvent[] = [
      { type: 'turn/start', seq: SessionSeq(7), time: 170, data: { turn: 2 } },
      { type: 'turn/end', seq: SessionSeq(8), time: 180, data: { turn: 2, reason: { kind: 'completed' } } },
    ]
    expect(collectCurrentTurn(events)?.turn).toBe(1)
    expect(collectCurrentTurn([...events, ...second])?.events).toEqual(second)
    expect(collectCurrentTurn(second.slice(1))).toBeUndefined()
    expect(collectCurrentTurn(second.slice(0, 1))).toBeUndefined()
  })

  it('keeps the native message prefix unchanged and appends one fixed instruction', () => {
    const context: Message[] = events.flatMap(event => {
      if (event.type === 'user/message') return [event.data]
      if (event.type === 'assistant/message' || event.type === 'tool/result') return [event.data.message]
      return []
    })
    const turn = collectCurrentTurn(events)
    if (!turn) throw new Error('Expected a complete turn')
    const request = buildSummaryMessages(context, 's1', turn)
    expect(request).toHaveLength(context.length + 1)
    for (const [index, message] of context.entries()) expect(request[index]).toBe(message)
    const last = request.at(-1)
    expect(last?.role).toBe('user')
    expect(last?.content.at(-1)).toEqual({ type: 'text', text: TURN_SUMMARY_INSTRUCTION })
    const metadata = last?.content[0]
    if (metadata?.type !== 'text') throw new Error('Expected metadata')
    expect(metadata.text).toContain('Inspect the repository')
    expect(metadata.text).toContain('Not found')
    expect(metadata.text).not.toContain('Internal trace')
    expect(metadata.text).not.toContain('Previous TSP content')
  })

  it('preserves a complete long native message and output without re-rendering it', () => {
    const long = '输入'.repeat(70000) + ' FINAL RESPONSE'
    const assistant = events.find(event => event.type === 'assistant/message')
    if (!assistant || assistant.type !== 'assistant/message') throw new Error('Expected an assistant message')
    const message: Message = { ...assistant.data.message, content: [{ type: 'text', text: long }] }
    const turn = collectCurrentTurn(events)
    if (!turn) throw new Error('Expected a complete turn')
    const request = buildSummaryMessages([message], 's1', turn)
    expect(request[0]).toBe(message)
    expect(request[0]?.content[0]).toEqual({ type: 'text', text: long })
    expect(validateSummaryOutput(JSON.stringify({ summary: long }))).toBe(long)
  })
  it('accepts only the expected JSON object and preserves the summary string', () => {
    const summary = '  first line\nsecond line  '
    expect(validateSummaryOutput(JSON.stringify({ summary }))).toBe(summary)
    for (const invalid of ['', '  ', 'plain text', '{"summary":', 'null', '[]',
      '"text"', '{}', '{"summary":""}', '{"summary":"  "}', '{"summary":1}',
      '{"summary":"ok","turn":7}', '~~~json\n{"summary":"ok"}\n~~~']) {
      expect(() => validateSummaryOutput(invalid)).toThrow()
    }
  })
})
