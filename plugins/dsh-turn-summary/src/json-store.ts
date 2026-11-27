import { randomUUID } from 'node:crypto'
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import { join } from 'node:path'

import { TSP_SCHEMA_VERSION } from './types.ts'
import type { SessionSummaryDocument, TurnSummaryRecord } from './types.ts'

/** JSON-backed per-Session store with atomic replacement and in-memory read-through. */
export class SessionSummaryStore {
  private readonly loads = new Map<string, Promise<SessionSummaryDocument | undefined>>()
  private readonly snapshots = new Map<string, SessionSummaryDocument | undefined>()

  constructor(private readonly root: string) {}

  /** Read one Session document once per store instance. */
  load(sessionId: string): Promise<SessionSummaryDocument | undefined> {
    const existing = this.loads.get(sessionId)
    if (existing !== undefined) return existing

    let loading: Promise<SessionSummaryDocument | undefined>
    loading = this.read(sessionId).then(document => {
      if (this.loads.get(sessionId) === loading) this.snapshots.set(sessionId, document)
      return document
    }).catch((error: unknown) => {
      if (this.loads.get(sessionId) === loading) this.loads.delete(sessionId)
      throw error
    })
    this.loads.set(sessionId, loading)
    return loading
  }

  /** Read the already-loaded snapshot without filesystem I/O. */
  peek(sessionId: string): SessionSummaryDocument | undefined {
    return this.snapshots.get(sessionId)
  }

  /** Drop one Session's in-memory cache without touching its JSON file. */
  evict(sessionId: string): void {
    this.loads.delete(sessionId)
    this.snapshots.delete(sessionId)
  }

  /** Persist a complete replacement before publishing it to readers. */
  async write(document: SessionSummaryDocument): Promise<void> {
    validateDocument(document, document.sessionId)

    const target = this.pathFor(document.sessionId)
    await mkdir(this.root, { recursive: true })

    const temporary = target + '.' + process.pid + '.' + randomUUID() + '.tmp'
    let renamed = false
    try {
      const handle = await open(temporary, 'wx', 0o600)
      try {
        await handle.writeFile(JSON.stringify(document, null, 2) + '\n', 'utf8')
        await handle.sync()
      } finally {
        await handle.close()
      }
      await rename(temporary, target)
      renamed = true
    } finally {
      if (!renamed) await unlink(temporary).catch(() => {})
    }

    const snapshot = structuredClone(document)
    this.snapshots.set(document.sessionId, snapshot)
    this.loads.set(document.sessionId, Promise.resolve(snapshot))
  }

  /** Derive a collision-free filename without allowing Session IDs to escape the state directory. */
  pathFor(sessionId: string): string {
    const encoded = Buffer.from(sessionId, 'utf8').toString('hex')
    return join(this.root, encoded + '.json')
  }

  private async read(sessionId: string): Promise<SessionSummaryDocument | undefined> {
    let source: string
    try {
      source = await readFile(this.pathFor(sessionId), 'utf8')
    } catch (error) {
      if (isNodeError(error) && error.code === 'ENOENT') return undefined
      throw error
    }

    let value: unknown
    try {
      value = JSON.parse(source)
    } catch (error) {
      throw new Error('dsh-turn-summary: invalid JSON for Session ' + JSON.stringify(sessionId), { cause: error })
    }
    return validateDocument(value, sessionId)
  }
}

/** Validate persisted data before it can become model context or be overwritten. */
export function validateDocument(value: unknown, expectedSessionId: string): SessionSummaryDocument {
  if (!isRecord(value)) throw new Error('dsh-turn-summary: summary document must be an object')
  if (value.schemaVersion !== TSP_SCHEMA_VERSION) {
    throw new Error('dsh-turn-summary: unsupported schemaVersion ' + String(value.schemaVersion))
  }
  if (value.sessionId !== expectedSessionId) {
    throw new Error('dsh-turn-summary: Session ID does not match the requested file')
  }
  if (!isInteger(value.processedThroughSeq) || value.processedThroughSeq < -1) {
    throw new Error('dsh-turn-summary: processedThroughSeq must be an integer >= -1')
  }
  if (!isInteger(value.updatedAt) || value.updatedAt < 0) {
    throw new Error('dsh-turn-summary: updatedAt must be a non-negative integer')
  }
  if (typeof value.sessionSummary !== 'string') {
    throw new Error('dsh-turn-summary: sessionSummary must be a string')
  }
  if (!Array.isArray(value.recentTurnSummaries)) {
    throw new Error('dsh-turn-summary: recentTurnSummaries must be an array')
  }

  let last = -1
  for (const item of value.recentTurnSummaries) {
    validateTurnSummary(item)
    if (item.startSeq <= last || item.endSeq > value.processedThroughSeq) {
      throw new Error('dsh-turn-summary: unordered or out-of-range Turn Summary')
    }
    last = item.endSeq
  }
  return value as unknown as SessionSummaryDocument
}

function validateTurnSummary(value: unknown): asserts value is TurnSummaryRecord {
  if (!isRecord(value)) throw new Error('dsh-turn-summary: Turn Summary must be an object')
  if (!isInteger(value.turn) || value.turn < 1) throw new Error('dsh-turn-summary: invalid turn number')
  if (!isInteger(value.startSeq) || value.startSeq < 0) throw new Error('dsh-turn-summary: invalid startSeq')
  if (!isInteger(value.endSeq) || value.endSeq < value.startSeq) throw new Error('dsh-turn-summary: invalid endSeq')
  if (!isInteger(value.startedAt) || !isInteger(value.endedAt)) {
    throw new Error('dsh-turn-summary: invalid turn timestamps')
  }
  if (!isRecord(value.reason) || typeof value.reason.kind !== 'string') {
    throw new Error('dsh-turn-summary: invalid turn end reason')
  }
  if (typeof value.markdown !== 'string') throw new Error('dsh-turn-summary: Turn Summary markdown must be a string')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value)
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}
