import { describe, expect, it } from 'vitest'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import { collectNextTurnInput, collectTurnInputForEnd } from '../src/turn-collector.ts'
import { buildInput, parseSummaryOutput } from '../src/summary-generator.ts'
import { renderSessionSummaryMarkdown } from '../src/markdown-renderer.ts'
import type { SessionSummaryDocument } from '../src/types.ts'

const event = (value: unknown) => value as SessionEvent
const events = [
  event({type: 'turn/start', seq: 0, time: 100, data: {turn: 1}}),
  event({type: 'user/message', seq: 1, time: 110, data: {source: {kind: 'user'}, content: [{type: 'text', text: 'Inspect the repository'}]}}),
  event({type: 'user/message', seq: 2, time: 120, data: {source: {kind: 'runtime-context'}, content: [{type: 'text', text: 'Previous TSP content'}]}}),
  event({type: 'tool/call', seq: 3, time: 130, data: {name: 'read_file', callId: 'call-1', step: 1, arguments: '{}'}}),
  event({type: 'tool/result', seq: 4, time: 140, data: {step: 1, message: {toolCallId: 'call-1', isError: true, content: [{type: 'text', text: 'Missing file'}]}, error: {message: 'Not found'}}}),
  event({type: 'assistant/message', seq: 5, time: 150, data: {step: 1, message: {content: [{type: 'text', text: 'File not found'}, {type: 'reasoning', text: 'Internal trace'}]}}}),
  event({type: 'turn/end', seq: 6, time: 160, data: {turn: 1, reason: {kind: 'completed'}}}),
]
const end = events[6] as Extract<SessionEvent, {type: 'turn/end'}>
const empty: SessionSummaryDocument = {schemaVersion: 1, sessionId: 's1', processedThroughSeq: -1, updatedAt: 0, sessionSummary: '', recentTurnSummaries: []}

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
    const input = buildInput(empty, {...turn, sourceMarkdown: '输入'.repeat(5000) + ' FINAL RESPONSE'}, 1024)
    expect(Buffer.byteLength(input, 'utf8')).toBeLessThanOrEqual(1024)
    expect(input).toContain('FINAL RESPONSE')
    expect(input).toContain('omitted middle')
  })

  it('validates one exact turn and renders both continuity sections', () => {
    const result = parseSummaryOutput(JSON.stringify({turnSummaries: [{turn: 1, markdown: 'Inspected; file missing.'}], sessionSummary: 'Repository inspection pending.'}), 1, 1000)
    const turn = collectTurnInputForEnd(events, end, 1000)
    const {sourceMarkdown: _, ...metadata} = turn
    const doc = {...empty, processedThroughSeq: 6, sessionSummary: result.sessionSummary, recentTurnSummaries: [{...metadata, markdown: result.turnSummary}]}
    expect(renderSessionSummaryMarkdown(doc)).toContain('Repository inspection pending.')
    expect(renderSessionSummaryMarkdown(doc)).toContain('Inspected; file missing.')
    expect(() => parseSummaryOutput(JSON.stringify({turnSummaries: [{turn: 2, markdown: 'wrong'}], sessionSummary: 'state'}), 1, 1000)).toThrow()
    expect(() => parseSummaryOutput('not JSON', 1, 1000)).toThrow()
  })
})
