import { mkdtemp, rm, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { TurnSummaryStore, validateRecord } from '../src/turn-summary/json-store.ts'

describe('Turn Summary JSON storage', () => {
  it('stores each turn independently and replaces only the selected turn', async () => {
    const root = await mkdtemp(join(tmpdir(), 'tsp-'))
    try {
      const store = new TurnSummaryStore(root)
      const first = { sessionId: '../s1', turn: 2, summary: 'First selected turn' }
      const second = { sessionId: first.sessionId, turn: 7, summary: 'Latest selected turn' }
      expect(await store.read(first.sessionId, 2)).toBeUndefined()
      await store.write(first)
      await store.write(second)
      await store.write({ ...second, summary: 'Revised summary' })
      expect(await store.read(first.sessionId, 2)).toEqual(first)
      expect(await store.read(first.sessionId, 7)).toEqual({ ...second, summary: 'Revised summary' })
      expect(await store.read(first.sessionId, 3)).toBeUndefined()
      expect(JSON.parse(await readFile(store.pathFor(first.sessionId, 2), 'utf8'))).toEqual(first)
      expect(store.pathFor(first.sessionId, 2)).toBe(join(root, Buffer.from(first.sessionId).toString('hex'), '2.json'))
      expect(() => validateRecord(first, 's2', 2)).toThrow()
      expect(() => validateRecord(first, first.sessionId, 3)).toThrow()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
