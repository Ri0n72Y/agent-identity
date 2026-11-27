import type { Context } from '@deepseek-ai/cordis'
import type { Session, SessionEvent } from '@deepseek-ai/dsh-session'

import type { ResolvedTurnSummaryConfig } from './config.ts'
import { SessionSummaryStore } from './json-store.ts'
import { renderSessionSummaryMarkdown } from './markdown-renderer.ts'
import { generateTurnSummary } from './summary-generator.ts'
import { collectNextTurnInput, collectTurnInputForEnd } from './turn-collector.ts'
import type { SessionSummaryDocument } from './types.ts'

const CONTEXT_NAME = 'turn-summary:session'
type TurnEndEvent = Extract<SessionEvent, { type: 'turn/end' }>

/** Result of one explicit /summarize invocation. */
export interface SummarizeResult {
  readonly processedTurns: number
  readonly firstTurn?: number
  readonly lastTurn?: number
}

/**
 * Executes TSP only when explicitly requested by /summarize.
 * No turn-end observer, background queue, or automatic retry is installed.
 */
export class SessionSummaryCoordinator {
  private readonly store: SessionSummaryStore
  private readonly activeSessions = new Set<string>()
  private readonly evictWhenIdle = new Set<string>()
  private readonly warnedLoadFailures = new Set<string>()

  constructor(
    private readonly ctx: Context,
    private readonly config: ResolvedTurnSummaryConfig,
    stateDirectory: string,
  ) {
    this.store = new SessionSummaryStore(stateDirectory)

    ctx.systemPrompt.context({
      name: CONTEXT_NAME,
      order: 5000,
      interpolate: false,
      text: context => context.session === undefined
        ? ''
        : renderSessionSummaryMarkdown(this.store.peek(context.session.id), this.config.maxContextBytes),
    })

    ctx.on('session/disposed', session => this.evict(session.id))

    ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
      const session = context.session
      if (session === undefined) return next()

      try {
        await this.store.load(session.id)
        this.warnedLoadFailures.delete(session.id)
      } catch (error) {
        this.warnLoadFailure(session.id, error)
        return next()
      }

      const assembly = await next()
      const text = renderSessionSummaryMarkdown(this.store.peek(session.id), this.config.maxContextBytes)
      const contribution = assembly.contexts.find(entry => entry.name === CONTEXT_NAME)
      if (contribution !== undefined) {
        contribution.text = text
        contribution.interpolate = false
      } else if (text.length > 0) {
        assembly.contexts.push({ name: CONTEXT_NAME, text, interpolate: false })
      }
      return assembly
    }, { prepend: true })
  }

  /**
   * Summarize every complete turn not yet represented by this Session's TSP.
   * A new TSP document starts at the latest complete local turn; inherited
   * history and older local history are not backfilled.
   */
  async summarize(session: Session, signal: AbortSignal): Promise<SummarizeResult> {
    const sessionId = session.id
    if (this.activeSessions.has(sessionId)) {
      throw new Error('dsh-turn-summary: /summarize is already running for this Session')
    }

    this.activeSessions.add(sessionId)
    try {
      signal.throwIfAborted()
      const snapshot = await this.ctx.sessionQuery.readSession(sessionId)
      signal.throwIfAborted()
      const localEvents = snapshot.events.filter(event => event.seq >= snapshot.inheritedEventCount)

      const latestEnd = localEvents.findLast(
        (event): event is TurnEndEvent => event.type === 'turn/end',
      )
      if (latestEnd === undefined) return { processedTurns: 0 }

      let document = await this.store.load(sessionId)
      if (document === undefined) {
        const latestTurn = collectTurnInputForEnd(
          localEvents,
          latestEnd,
          this.config.maxEventTextChars,
        )
        document = emptyDocument(sessionId, latestTurn.startSeq - 1)
      }

      let processedTurns = 0
      let firstTurn: number | undefined
      let lastTurn: number | undefined

      while (true) {
        signal.throwIfAborted()
        const input = collectNextTurnInput(
          localEvents,
          document.processedThroughSeq,
          latestEnd.seq,
          this.config.maxEventTextChars,
        )
        if (input === undefined) {
          const unprocessedEnd = localEvents.find(event =>
            event.type === 'turn/end'
            && event.seq > document!.processedThroughSeq
            && event.seq <= latestEnd.seq,
          )
          if (unprocessedEnd !== undefined) {
            throw new Error('dsh-turn-summary: cannot locate the start of an unprocessed completed turn')
          }
          break
        }

        const generated = await generateTurnSummary(
          this.ctx,
          this.config,
          session,
          document,
          input,
          signal,
        )
        signal.throwIfAborted()

        const turnSummary = {
          turn: input.turn,
          startSeq: input.startSeq,
          endSeq: input.endSeq,
          startedAt: input.startedAt,
          endedAt: input.endedAt,
          reason: input.reason,
          markdown: generated.turnSummary,
        }
        const updated: SessionSummaryDocument = {
          ...document,
          processedThroughSeq: input.endSeq,
          updatedAt: Date.now(),
          sessionSummary: generated.sessionSummary,
          recentTurnSummaries: [
            ...document.recentTurnSummaries.filter(item => item.endSeq < input.startSeq),
            turnSummary,
          ].slice(-this.config.maxRecentTurns),
        }

        // The in-memory context changes only after the atomic JSON replacement succeeds.
        await this.store.write(updated)
        document = updated
        processedTurns += 1
        firstTurn ??= input.turn
        lastTurn = input.turn
      }

      return {
        processedTurns,
        ...(firstTurn === undefined ? {} : { firstTurn }),
        ...(lastTurn === undefined ? {} : { lastTurn }),
      }
    } catch (error) {
      if (!signal.aborted) {
        this.ctx.logger.warn(
          'dsh-turn-summary: explicit summarization failed for Session '
          + sessionId + ': ' + errorMessage(error),
        )
      }
      throw error
    } finally {
      this.activeSessions.delete(sessionId)
      if (this.evictWhenIdle.delete(sessionId)) this.store.evict(sessionId)
    }
  }

  private evict(sessionId: string): void {
    this.warnedLoadFailures.delete(sessionId)
    if (this.activeSessions.has(sessionId)) {
      this.evictWhenIdle.add(sessionId)
      return
    }
    this.store.evict(sessionId)
  }

  private warnLoadFailure(sessionId: string, error: unknown): void {
    if (this.warnedLoadFailures.has(sessionId)) return
    this.warnedLoadFailures.add(sessionId)
    this.ctx.logger.warn(
      'dsh-turn-summary: cannot load Session state for ' + sessionId + ': ' + errorMessage(error),
    )
  }
}

function emptyDocument(sessionId: string, processedThroughSeq: number): SessionSummaryDocument {
  return {
    schemaVersion: 1,
    sessionId,
    processedThroughSeq,
    updatedAt: Date.now(),
    sessionSummary: '',
    recentTurnSummaries: [],
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
