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

interface SessionWorkState {
  readonly queue: TurnEndEvent[]
  running: Promise<void> | undefined
  retryRequested: boolean
}

/** Coordinates post-turn generation, persistence, and the next prompt's freshness barrier. */
export class SessionSummaryCoordinator {
  private readonly store: SessionSummaryStore
  private readonly states = new Map<string, SessionWorkState>()
  private readonly operations = new Set<Promise<void>>()
  private readonly warnedLoadFailures = new Set<string>()
  private readonly lifecycle = new AbortController()

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

    ctx.on('session/event', (session, event) => {
      if (event.type === 'turn/end') this.enqueue(session, event)
    })

    ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
      const session = context.session
      if (session === undefined) return next()

      try {
        await this.store.load(session.id)
      } catch (error) {
        this.warnLoadFailure(session.id, error)
        return next()
      }

      await this.waitForPending(session.id, context.signal)
      const assembly = await next()
      const text = renderSessionSummaryMarkdown(this.store.peek(session.id))
      const contribution = assembly.contexts.find(entry => entry.name === CONTEXT_NAME)
      if (contribution !== undefined) {
        contribution.text = text
        contribution.interpolate = false
      }
      return assembly
    }, { prepend: true })

    ctx.effect(() => async () => {
      this.lifecycle.abort(new Error('dsh-turn-summary disposed'))
      await Promise.allSettled([...this.operations])
    })
  }

  private enqueue(session: Session, event: TurnEndEvent): void {
    if (this.lifecycle.signal.aborted) return

    let state = this.states.get(session.id)
    if (state === undefined) {
      state = { queue: [], running: undefined, retryRequested: false }
      this.states.set(session.id, state)
    }
    state.queue.push(event)

    if (state.running !== undefined) {
      state.retryRequested = true
      return
    }
    this.startDrain(session, state)
  }

  private startDrain(session: Session, state: SessionWorkState): void {
    const operation = this.drain(session, state)
    state.running = operation
    this.operations.add(operation)
    void operation.then(
      () => this.finishDrain(session, state, operation),
      () => this.finishDrain(session, state, operation),
    )
  }

  private async drain(session: Session, state: SessionWorkState): Promise<void> {
    while (state.queue.length > 0 && !this.lifecycle.signal.aborted) {
      const pending = state.queue[0]
      if (pending === undefined) return
      try {
        const reachedPendingEnd = await this.processTurn(session, pending)
        if (reachedPendingEnd) state.queue.shift()
      } catch (error) {
        if (!this.lifecycle.signal.aborted) {
          this.ctx.logger.warn(
            'dsh-turn-summary: Session ' + session.id + ', turn ' + pending.data.turn
            + ' was not summarized: ' + errorMessage(error),
          )
        }
        break
      }
    }
  }

  private finishDrain(session: Session, state: SessionWorkState, operation: Promise<void>): void {
    this.operations.delete(operation)
    if (state.running === operation) state.running = undefined

    const retry = state.retryRequested
    state.retryRequested = false
    if (retry && state.queue.length > 0 && !this.lifecycle.signal.aborted) {
      this.startDrain(session, state)
    }
  }

  private async processTurn(session: Session, pending: TurnEndEvent): Promise<boolean> {
    const snapshot = await this.ctx.sessionQuery.readSession(session.id)
    let document = await this.store.load(session.id)

    if (document !== undefined && pending.seq <= document.processedThroughSeq) return true

    if (document === undefined) {
      const firstObservedTurn = collectTurnInputForEnd(
        snapshot.events,
        pending,
        this.config.maxEventTextChars,
      )
      document = emptyDocument(session.id, firstObservedTurn.startSeq - 1)
      await this.store.write(document)
    }

    const input = collectNextTurnInput(
      snapshot.events,
      document.processedThroughSeq,
      pending.seq,
      this.config.maxEventTextChars,
    )
    if (input === undefined) throw new Error('dsh-turn-summary: missing complete turn in source log')

    const generated = await generateTurnSummary(
      this.ctx,
      this.config,
      session,
      document,
      input,
      this.lifecycle.signal,
    ).catch((error: unknown) => {
      this.lifecycle.signal.throwIfAborted()
      const detail = errorMessage(error).replace(/\s+/g, ' ').slice(0, 400)
      this.ctx.logger.warn('dsh-turn-summary: generation failed for ' + session.id + ' turn ' + input.turn + ': ' + detail)
      return {
        turnSummary: 'TSP generation failed: ' + detail + '. Consult the original Session events ' + input.startSeq + '–' + input.endSeq + ' for this turn.',
        sessionSummary: document!.sessionSummary,
      }
    })
    this.lifecycle.signal.throwIfAborted()

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
      recentTurnSummaries: [...document.recentTurnSummaries, turnSummary].slice(-this.config.maxRecentTurns),
    }
    await this.store.write(updated)
    return input.endSeq >= pending.seq
  }

  private async waitForPending(sessionId: string, signal?: AbortSignal): Promise<void> {
    while (true) {
      const running = this.states.get(sessionId)?.running
      if (running === undefined) return
      await waitWithSignal(running, signal)
      if (this.states.get(sessionId)?.running === running) return
    }
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

function waitWithSignal(promise: Promise<void>, signal?: AbortSignal): Promise<void> {
  if (signal === undefined) return promise
  signal.throwIfAborted()

  return new Promise((resolve, reject) => {
    const abort = () => {
      cleanup()
      reject(signal.reason ?? new Error('dsh-turn-summary: prompt assembly aborted'))
    }
    const cleanup = () => signal.removeEventListener('abort', abort)
    signal.addEventListener('abort', abort, { once: true })
    if (signal.aborted) {
      abort()
      return
    }
    promise.then(
      () => {
        cleanup()
        resolve()
      },
      error => {
        cleanup()
        reject(error)
      },
    )
  })
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
