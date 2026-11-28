import type { Context } from '@deepseek-ai/cordis'
import type { Session } from '@deepseek-ai/dsh-session'

import type { ResolvedTurnSummaryConfig } from './config.ts'
import { SessionSummaryStore } from './json-store.ts'
import { renderSessionSummaryMarkdown } from './markdown-renderer.ts'
import { generateTurnSummary } from './summary-generator.ts'
import { collectCurrentTurn } from './turn-collector.ts'
import type { SessionSummaryDocument } from './types.ts'

const CONTEXT_NAME = 'turn-summary:session'

/** Runs the current-turn summary on explicit command invocation. */
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
        : renderSessionSummaryMarkdown(this.store.peek(context.session.id)),
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
      const text = renderSessionSummaryMarkdown(this.store.peek(session.id))
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

  /** Summarize only the latest complete local turn, once per invocation. */
  async summarize(session: Session, signal: AbortSignal): Promise<number | undefined> {
    const sessionId = session.id
    if (this.activeSessions.has(sessionId)) {
      throw new Error('dsh-turn-summary: /summarize is already running for this Session')
    }
    this.activeSessions.add(sessionId)
    try {
      signal.throwIfAborted()
      const snapshot = await this.ctx.sessionQuery.readSession(sessionId)
      signal.throwIfAborted()
      const current = collectCurrentTurn(snapshot.events.slice(snapshot.inheritedEventCount))
      if (current === undefined) return undefined

      const previous: SessionSummaryDocument = await this.store.load(sessionId) ?? {
        sessionId,
        sessionSummary: '',
        turnSummaries: [],
      }
      signal.throwIfAborted()
      const generated = await generateTurnSummary(this.ctx, this.config, session, previous, current, signal)
      signal.throwIfAborted()

      await this.store.write({
        sessionId,
        sessionSummary: generated.sessionSummary,
        turnSummaries: [
          ...previous.turnSummaries.filter(item => item.turn !== current.turn),
          { turn: current.turn, markdown: generated.turnSummary },
        ].sort((a, b) => a.turn - b.turn),
      })
      return current.turn
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

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
