import { describe, expect, it } from 'vitest'
import { SessionSeq } from '@deepseek-ai/dsh-session'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import type { MessageId, ToolCallId } from '@deepseek-ai/dsh-llm'

import { collectNextTurnInput, collectTurnInputForEnd } from '../src/turn-collector.ts'
import { buildInput, parseSummaryOutput } from '../src/summary-generator.ts'
import { renderSessionSummaryMarkdown } from '../src/markdown-renderer.ts'
import type { SessionSummaryDocument } from '../src/types.ts'

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

const end = events[6] as Extract<SessionEvent, { type: 'turn/end' }>
const empty: SessionSummaryDocument = {
  schemaVersion: 1,
  sessionId: 's1',
  processedThroughSeq: -1,
  updatedAt: 0,
  sessionSummary: '',
  recentTurnSummaries: [],
}

describe('TSP protocol', () => {
  it('collects the complete turn without injected runtime context or reasoning', () => {
    const turn = collectTurnInputForEnd(events, end, 1000)
    expect(turn.startSeq).toBe(0)
    expect(turn.endSeq).toBe(6)
    expect(turn.sourceMarkdown).toContain('Inspect the repository')
    expect(turn.sourceMarkdown).toContain('read_file (call-1)')
    expect(turn.sourceMarkdown).toContain('Missing file')
    expect(turn.sourceMarkdown).toContain('File not found')
    expect(turn.sourceMarkdown).not.toContain('Previous TSP content')
    expect(turn.sourceMarkdown).not.toContain('Internal trace')
    expect(collectNextTurnInput(events, 6, 6, 1000)).toBeUndefined()
  })

  it('bounds large Markdown while preserving the final response', () => {
    const turn = collectTurnInputForEnd(events, end, 1000)
    const input = buildInput(empty, { ...turn, sourceMarkdown: '输入'.repeat(5000) + ' FINAL RESPONSE' }, 1024)
    expect(Buffer.byteLength(input, 'utf8')).toBeLessThanOrEqual(1024)
    expect(input).toContain('FINAL RESPONSE')
    expect(input).toContain('omitted middle')
  })

  it('validates one exact turn and renders both continuity sections', () => {
    const result = parseSummaryOutput(JSON.stringify({
      turnSummaries: [{ turn: 1, markdown: 'Inspected; file missing.' }],
      sessionSummary: 'Repository inspection pending.',
    }), 1, 1000)
    const turn = collectTurnInputForEnd(events, end, 1000)
    const { sourceMarkdown: _, ...metadata } = turn
    const doc = {
      ...empty,
      processedThroughSeq: 6,
      sessionSummary: result.sessionSummary,
      recentTurnSummaries: [{ ...metadata, markdown: result.turnSummary }],
    }
    const markdown = renderSessionSummaryMarkdown(doc, 4096)
    expect(markdown).toContain('Repository inspection pending.')
    expect(markdown).toContain('Inspected; file missing.')
    expect(() => parseSummaryOutput(JSON.stringify({
      turnSummaries: [{ turn: 2, markdown: 'wrong' }],
      sessionSummary: 'state',
    }), 1, 1000)).toThrow()
    expect(() => parseSummaryOutput('not JSON', 1, 1000)).toThrow()
  })

  it('keeps the injected Markdown within the aggregate UTF-8 budget', () => {
    const doc: SessionSummaryDocument = {
      ...empty,
      sessionSummary: '当前状态'.repeat(5000),
      recentTurnSummaries: [{
        turn: 1,
        startSeq: 0,
        endSeq: 6,
        startedAt: 100,
        endedAt: 160,
        reason: { kind: 'completed' },
        markdown: '历史摘要'.repeat(5000),
      }],
    }
    const markdown = renderSessionSummaryMarkdown(doc, 2048)
    expect(Buffer.byteLength(markdown, 'utf8')).toBeLessThanOrEqual(2048)
  })
})
