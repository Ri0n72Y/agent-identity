import { mkdtemp, rm, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SessionSummaryStore, validateDocument } from '../src/json-store.ts'
import type { SessionSummaryDocument } from '../src/types.ts'

describe('JSON persistence', () => {
  it('atomically persists and restores per-Session state', async () => {
    const root = await mkdtemp(join(tmpdir(), 'tsp-'))
    try {
      const doc: SessionSummaryDocument = {schemaVersion: 1, sessionId: '../s1', processedThroughSeq: 1, updatedAt: 1, sessionSummary: 'Current state', recentTurnSummaries: [{turn: 1, startSeq: 0, endSeq: 1, startedAt: 1, endedAt: 2, reason: {kind: 'completed'}, markdown: 'Delivered'}]}
      const store = new SessionSummaryStore(root)
      expect(await store.load(doc.sessionId)).toBeUndefined()
      await store.write(doc)
      expect(store.pathFor(doc.sessionId)).toBe(join(root, Buffer.from(doc.sessionId).toString('hex') + '.json'))
      expect(JSON.parse(await readFile(store.pathFor(doc.sessionId), 'utf8'))).toEqual(doc)
      expect(await new SessionSummaryStore(root).load(doc.sessionId)).toEqual(doc)
      store.evict(doc.sessionId)
      expect(store.peek(doc.sessionId)).toBeUndefined()
      expect(await store.load(doc.sessionId)).toEqual(doc)
      expect(await store.load('s2')).toBeUndefined()
      expect(() => validateDocument({...doc, processedThroughSeq: 0}, doc.sessionId)).toThrow()
      expect(() => validateDocument(doc, 's2')).toThrow()
    } finally {
      await rm(root, {recursive: true, force: true})
    }
  })
})
