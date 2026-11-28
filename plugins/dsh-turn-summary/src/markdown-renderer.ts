import type { ContentBlock, FinishReason } from '@deepseek-ai/dsh-llm'
import type { SessionEvent } from '@deepseek-ai/dsh-session'

import type { SessionSummaryDocument } from './types.ts'

/** Render all stored summaries without a character or byte cutoff. */
export function renderSessionSummaryMarkdown(document: SessionSummaryDocument | undefined): string {
  if (document === undefined) return ''
  return [
    '# Session continuity — ' + document.sessionId,
    '## Session Summary\n\n' + document.sessionSummary,
    ...(document.turnSummaries.length === 0 ? [] : [
      '## Turn Summaries',
      ...document.turnSummaries.map(turn => '### Turn ' + turn.turn + '\n\n' + turn.markdown),
    ]),
  ].join('\n\n')
}

/** Render one validated Session turn as Markdown for the summarization model. */
export function renderTurnEvents(events: readonly SessionEvent[]): string {
  const start = events.find((event): event is Extract<SessionEvent, { type: 'turn/start' }> => event.type === 'turn/start')
  const end = events.findLast((event): event is Extract<SessionEvent, { type: 'turn/end' }> => event.type === 'turn/end')
  if (start === undefined || end === undefined) {
    throw new Error('dsh-turn-summary: a turn transcript requires matching start and end events')
  }

  const sections: string[] = [
    '# Turn ' + String(start.data.turn),
    '- Started: ' + new Date(start.time).toISOString(),
    '- Ended: ' + new Date(end.time).toISOString(),
    '- Outcome: ' + JSON.stringify(end.data.reason),
    '- Source event range: ' + start.seq + '–' + end.seq,
  ]

  for (const event of events) {
    const rendered = renderEvent(event)
    if (rendered !== undefined) sections.push(rendered)
  }

  if (sections.length === 5) {
    sections.push('No user message, assistant response, tool activity, or failed attempt was committed in this turn.')
  }
  return sections.join('\n\n')
}

function renderEvent(event: SessionEvent): string | undefined {
  const position = eventPosition(event)
  switch (event.type) {
    case 'user/message': {
      const source = event.data.source.kind
      if (String(source) === 'runtime-context') return undefined
      const heading = source === 'user' ? 'Human input' : 'User-role context (' + source + ')'
      const text = contentText(event.data.content)
      return heading + position + '\n\n' + fence(text || '[no text content]', 'text')
    }
    case 'developer/message': {
      const text = contentText(event.data.message.content)
      if (text.length === 0) return undefined
      return 'Developer context update' + position + '\n\n' + fence(text, 'text')
    }
    case 'assistant/message': {
      const text = contentText(event.data.message.content)
      if (text.length === 0) return undefined
      const status = event.data.interrupted === true ? ' (interrupted)' : ''
      return 'Assistant response' + status + position + '\n\n' + fence(text, 'text')
    }
    case 'assistant/attempt': {
      const finish = event.data.stream.findLast(record =>
        record.type === 'chunk' && record.chunk.type === 'finish',
      )
      const detail = finish?.type === 'chunk' && finish.chunk.type === 'finish'
        ? finishReasonText(finish.chunk.reason)
        : 'The attempt settled without a recorded finish reason.'
      return 'Failed or uncommitted assistant attempt' + position + '\n\n' + detail
    }
    case 'tool/call':
      return [
        'Tool call: ' + event.data.name + ' (' + event.data.callId + ')' + position,
        '',
        fence(event.data.arguments, 'json'),
      ].join('\n')
    case 'tool/result': {
      const content = contentText(event.data.message.content)
      const error = event.data.error === undefined
        ? (event.data.message.isError ? '\n\nTool result marked as error.' : '')
        : '\n\nTool error: ' + JSON.stringify(event.data.error)
      return [
        'Tool result: ' + event.data.message.toolCallId + position,
        '',
        fence(content || '[empty tool result]', 'text') + error,
      ].join('\n')
    }
    default:
      return undefined
  }
}

function contentText(content: readonly ContentBlock[]): string {
  const parts: string[] = []
  for (const block of content) {
    switch (block.type) {
      case 'text':
        parts.push(block.text)
        break
      case 'reasoning':
        break
      case 'image':
        parts.push('[image attachment]')
        break
      case 'file':
        parts.push('[file attachment]')
        break
      case 'tool-call':
        parts.push('[tool call: ' + block.name + ']')
        break
      case 'tool-addition':
        parts.push('[tool enabled: ' + block.toolName + ']')
        break
      case 'tool-removal':
        parts.push('[tool disabled: ' + block.toolName + ']')
        break
    }
  }
  return parts.join('\n')
}

function finishReasonText(reason: FinishReason): string {
  switch (reason.kind) {
    case 'error':
    case 'aborted':
      return reason.kind + ' (' + reason.failure.code + '): ' + reason.failure.message
    default:
      return 'Finish reason: ' + reason.kind
  }
}

function eventPosition(event: SessionEvent): string {
  const data = event.data as { step?: number }
  return ' [seq ' + event.seq + (data.step === undefined ? '' : ', step ' + data.step) + ']'
}

function fence(text: string, language: string): string {
  const runs = text.match(/\x60+/g) ?? []
  const size = runs.reduce((size, run) => Math.max(size, run.length + 1), 3)
  const marker = String.fromCharCode(96).repeat(size)
  return marker + language + '\n' + text + '\n' + marker
}
