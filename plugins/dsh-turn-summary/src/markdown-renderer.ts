import type { ContentBlock, FinishReason } from '@deepseek-ai/dsh-llm'
import type { SessionEvent } from '@deepseek-ai/dsh-session'

import type { SessionSummaryDocument } from './types.ts'

const TRUNCATION_MARKER = '\n[older TSP context omitted]'

/** Render TSP Markdown within one aggregate UTF-8 context budget. */
export function renderSessionSummaryMarkdown(
  document: SessionSummaryDocument | undefined,
  maxBytes = 24000,
): string {
  if (document === undefined) return ''

  const heading = '# Session continuity — ' + document.sessionId
  const headingBytes = Buffer.byteLength(heading, 'utf8')
  if (headingBytes >= maxBytes) return takeUtf8Prefix(heading, maxBytes)

  const sessionBudget = Math.floor((maxBytes - headingBytes) * 0.6)
  const sessionText = document.sessionSummary.trim()
  const sessionSection = sessionText.length === 0
    ? ''
    : '## Session Summary\n\n' + truncateUtf8(sessionText, sessionBudget)

  const selectedNewestFirst: string[] = []
  const recent = [...document.recentTurnSummaries].reverse()
  for (const turn of recent) {
    const section = [
      '### Turn ' + turn.turn + ' — ' + turn.reason.kind,
      '- Time: ' + new Date(turn.startedAt).toISOString() + ' to ' + new Date(turn.endedAt).toISOString(),
      '- Source events: ' + turn.startSeq + '–' + turn.endSeq,
      '',
      turn.markdown.trim(),
    ].join('\n')
    const candidate = [
      heading,
      sessionSection,
      '## Recent Turn Summaries',
      ...[...selectedNewestFirst, section].reverse(),
    ].filter(Boolean).join('\n\n')
    if (Buffer.byteLength(candidate, 'utf8') <= maxBytes) {
      selectedNewestFirst.push(section)
      continue
    }

    if (selectedNewestFirst.length === 0) {
      const fixed = [heading, sessionSection, '## Recent Turn Summaries'].filter(Boolean).join('\n\n')
      const remaining = maxBytes - Buffer.byteLength(fixed, 'utf8') - 2
      if (remaining > 0) {
        selectedNewestFirst.push(truncateUtf8(section, remaining))
      }
    }
    break
  }

  const sections = [
    heading,
    sessionSection,
    ...(selectedNewestFirst.length === 0
      ? []
      : ['## Recent Turn Summaries', ...selectedNewestFirst.reverse()]),
  ].filter(Boolean)
  return sections.join('\n\n')
}

function truncateUtf8(value: string, maxBytes: number): string {
  if (Buffer.byteLength(value, 'utf8') <= maxBytes) return value
  const markerBytes = Buffer.byteLength(TRUNCATION_MARKER, 'utf8')
  if (maxBytes <= markerBytes) return takeUtf8Prefix(value, maxBytes)
  const available = maxBytes - markerBytes
  const head = takeUtf8Prefix(value, Math.ceil(available * 0.7))
  const tail = takeUtf8Suffix(value, available - Buffer.byteLength(head, 'utf8'))
  return head + TRUNCATION_MARKER + tail
}

function takeUtf8Prefix(value: string, maxBytes: number): string {
  let output = ''
  let size = 0
  for (const character of value) {
    const next = Buffer.byteLength(character, 'utf8')
    if (size + next > maxBytes) break
    output += character
    size += next
  }
  return output
}

function takeUtf8Suffix(value: string, maxBytes: number): string {
  let output = ''
  let size = 0
  for (const character of [...value].reverse()) {
    const next = Buffer.byteLength(character, 'utf8')
    if (size + next > maxBytes) break
    output = character + output
    size += next
  }
  return output
}

/** Render one validated Session turn as Markdown for the summarization model. */
export function renderTurnEvents(events: readonly SessionEvent[], maxEventTextChars: number): string {
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
    const rendered = renderEvent(event, maxEventTextChars)
    if (rendered !== undefined) sections.push(rendered)
  }

  if (sections.length === 5) {
    sections.push('No user message, assistant response, tool activity, or failed attempt was committed in this turn.')
  }
  return sections.join('\n\n')
}

function renderEvent(event: SessionEvent, maxChars: number): string | undefined {
  const position = eventPosition(event)
  switch (event.type) {
    case 'user/message': {
      const source = event.data.source.kind
      if (String(source) === 'runtime-context') return undefined
      const heading = source === 'user' ? 'Human input' : 'User-role context (' + source + ')'
      const text = contentText(event.data.content)
      return heading + position + '\n\n' + fence(clip(text || '[no text content]', maxChars), 'text')
    }
    case 'developer/message': {
      const text = contentText(event.data.message.content)
      if (text.length === 0) return undefined
      return 'Developer context update' + position + '\n\n' + fence(clip(text, maxChars), 'text')
    }
    case 'assistant/message': {
      const text = contentText(event.data.message.content)
      if (text.length === 0) return undefined
      const status = event.data.interrupted === true ? ' (interrupted)' : ''
      return 'Assistant response' + status + position + '\n\n' + fence(clip(text, maxChars), 'text')
    }
    case 'assistant/attempt': {
      const finish = event.data.stream.findLast(record =>
        record.type === 'chunk' && record.chunk.type === 'finish',
      )
      const detail = finish?.type === 'chunk' && finish.chunk.type === 'finish'
        ? finishReasonText(finish.chunk.reason)
        : 'The attempt settled without a recorded finish reason.'
      return 'Failed or uncommitted assistant attempt' + position + '\n\n' + clip(detail, maxChars)
    }
    case 'tool/call':
      return [
        'Tool call: ' + event.data.name + ' (' + event.data.callId + ')' + position,
        '',
        fence(clip(event.data.arguments, maxChars), 'json'),
      ].join('\n')
    case 'tool/result': {
      const content = contentText(event.data.message.content)
      const error = event.data.error === undefined
        ? (event.data.message.isError ? '\n\nTool result marked as error.' : '')
        : '\n\nTool error: ' + clip(JSON.stringify(event.data.error), maxChars)
      return [
        'Tool result: ' + event.data.message.toolCallId + position,
        '',
        fence(clip(content || '[empty tool result]', maxChars), 'text') + error,
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
  return parts.map(part => part.trim()).filter(Boolean).join('\n')
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

function clip(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars) + '\n[content truncated by dsh-turn-summary]'
}

function fence(text: string, language: string): string {
  const runs = text.match(/\x60+/g) ?? []
  const size = Math.max(3, ...runs.map(run => run.length + 1))
  const marker = String.fromCharCode(96).repeat(size)
  return marker + language + '\n' + text + '\n' + marker
}
