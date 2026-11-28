import { randomUUID } from 'node:crypto'
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import { join } from 'node:path'

import type { TurnSummaryRecord } from './types.ts'

/** One independent JSON record per Session and turn. */
export class TurnSummaryStore {
  constructor(private readonly root: string) {}

  pathFor(sessionId: string, turn: number): string {
    if (!sessionId || !Number.isSafeInteger(turn) || turn < 1) {
      throw new Error('dsh-tsp: invalid Session or turn identity')
    }
    return join(this.root, Buffer.from(sessionId, 'utf8').toString('hex'), String(turn) + '.json')
  }

  async read(sessionId: string, turn: number): Promise<TurnSummaryRecord | undefined> {
    const target = this.pathFor(sessionId, turn)
    try {
      return validateRecord(JSON.parse(await readFile(target, 'utf8')), sessionId, turn)
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return undefined
      throw error
    }
  }

  /** Replace only the selected turn; no Session-level state or cache is maintained. */
  async write(record: TurnSummaryRecord): Promise<void> {
    validateRecord(record, record.sessionId, record.turn)
    const target = this.pathFor(record.sessionId, record.turn)
    await mkdir(join(this.root, Buffer.from(record.sessionId, 'utf8').toString('hex')), { recursive: true, mode: 0o700 })
    const temporary = target + '.' + randomUUID() + '.tmp'
    let renamed = false
    try {
      const handle = await open(temporary, 'wx', 0o600)
      try {
        await handle.writeFile(JSON.stringify(record, null, 2) + '\n', 'utf8')
        await handle.sync()
      } finally {
        await handle.close()
      }
      await rename(temporary, target)
      renamed = true
    } finally {
      if (!renamed) await unlink(temporary).catch(() => {})
    }
  }
}

export function validateRecord(value: unknown, sessionId: string, turn: number): TurnSummaryRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('dsh-tsp: invalid Turn Summary record')
  }
  const record = value as Record<string, unknown>
  if (Object.keys(record).length !== 3 || record.sessionId !== sessionId
    || record.turn !== turn || !Number.isSafeInteger(turn) || turn < 1 || !sessionId
    || typeof record.summary !== 'string' || record.summary.trim().length === 0) {
    throw new Error('dsh-tsp: invalid Turn Summary record')
  }
  return { sessionId, turn, summary: record.summary }
}
