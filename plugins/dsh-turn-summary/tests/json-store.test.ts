import { mkdtemp, rm, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SessionSummaryStore, validateDocument } from '../src/json-store.ts'
import type { SessionSummaryDocument } from '../src/types.ts'

describe('JSON persistence', () => {
  it('writes and restores manually selected turns without requiring consecutive numbers', async () => {
    const root = await mkdtemp(join(tmpdir(), 'tsp-'))
    try {
      const doc: SessionSummaryDocument = {
        sessionId: '../s1',
        sessionSummary: 'Current state',
        turnSummaries: [{ turn: 2, markdown: 'First selected turn' }, { turn: 7, markdown: 'Latest selected turn' }],
      }
      const store = new SessionSummaryStore(root)
      expect(await store.load(doc.sessionId)).toBeUndefined()
      await store.write(doc)
      expect(store.pathFor(doc.sessionId)).toBe(join(root, Buffer.from(doc.sessionId).toString('hex') + '.json'))
      expect(JSON.parse(await readFile(store.pathFor(doc.sessionId), 'utf8'))).toEqual(doc)
      expect(await new SessionSummaryStore(root).load(doc.sessionId)).toEqual(doc)
      store.evict(doc.sessionId)
      expect(store.peek(doc.sessionId)).toBeUndefined()
      expect(await store.load(doc.sessionId)).toEqual(doc)
      expect(() => validateDocument(doc, 's2')).toThrow()
      expect(() => validateDocument({ ...doc, turnSummaries: [doc.turnSummaries[0], doc.turnSummaries[0]] }, doc.sessionId)).toThrow()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
