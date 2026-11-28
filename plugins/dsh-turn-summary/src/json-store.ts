import { randomUUID } from 'node:crypto'
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import { join } from 'node:path'

import type { SessionSummaryDocument } from './types.ts'

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

/** Validate the minimal persisted document and unique turn identities. */
export function validateDocument(value: unknown, expectedSessionId: string): SessionSummaryDocument {
  if (!isRecord(value) || value.sessionId !== expectedSessionId) {
    throw new Error('dsh-turn-summary: invalid document or Session ID mismatch')
  }
  if (typeof value.sessionSummary !== 'string' || !Array.isArray(value.turnSummaries)) {
    throw new Error('dsh-turn-summary: invalid Session Summary or Turn Summaries')
  }
  const turns = new Set<number>()
  for (const item of value.turnSummaries) {
    if (!isRecord(item) || !isInteger(item.turn) || item.turn < 1
      || typeof item.markdown !== 'string' || turns.has(item.turn)) {
      throw new Error('dsh-turn-summary: invalid or duplicate Turn Summary')
    }
    turns.add(item.turn)
  }
  return value as unknown as SessionSummaryDocument
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
