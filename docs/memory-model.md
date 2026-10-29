# Memory consolidation and self-continuity

> Status: agreed conceptual model, not an implemented storage schema or automatic runtime.
> Scope: explain how memory supports identity. The owning agent/project workspace, not this repository, holds its actual conversation, episode, and bookshelf data.

## From short-term state to durable evidence

| Layer | Responsibility | Boundary |
| --- | --- | --- |
| **Working** | The live conversation and task context. | It is not itself a durable record. |
| **Short** | Short-lived **factual memory across context boundaries**: recent events, current state, decisions, and unresolved matters needed to continue. | It is not a full transcript or a permanent knowledge store. |
| **Episode** | A consolidated, durable form of relevant Short records. Capture **when**, **why the interaction happened**, **what was discussed or done**, and **what conclusion was reached**. | Preserve event context and outcomes; do not use episodes to duplicate the complete body of facts. |
| **Bookshelf** | Stores concrete facts, source material, and supporting knowledge, including facts extracted from episodes. | Facts and references live here rather than inside Episode as a separate `Facts` category. |
| **LTM** | A lightweight index into the bookshelf. | The index points to material; it does not repeat the bookshelf as another knowledge body. |

The progression is **Working → Short → Episode** for events worth consolidating. Concrete facts and their sources are stored in the **Bookshelf**, with **LTM** as its index. This is a conceptual flow, not a requirement that every chat, fact, or external source pass through each layer.

An Episode answers: *When and why did we discuss this? What did we discuss? What did we conclude?* The Bookshelf answers: *What concrete information or source supports a claim?* An episode may link to bookshelf material instead of embedding it.

Keep the earlier event and its historical conclusion distinguishable from a later correction. Current understanding can change without making the earlier record pretend that the later evidence was already known.

## From lived experience to self-understanding

An interaction can reveal something about the user, the agent's response, and their relationship at the same time. **Self** and **User** are related perspectives on experience, not mandatory separate Episode categories or documents. They may be captured together.

Relevant experiences can inform **mPFC**: the evolving explanation of **how and why an event contributed to an understanding of “who I should be.”** mPFC retains causal context, competing interpretations, contradictions, and later revisions, with links back to episodes and other evidence. This is not a table of fixed personality traits. Not every episode justifies changing self-understanding.

**SOUL** is the compressed, routinely usable outcome of mPFC: **current conclusions, not their explanations**. In this limited engineering sense, SOUL is the agent's “subconscious” or immediate judgment tendency. It does not reproduce the events, arguments, or evidence used to form those conclusions.

When asked *“Why do I think or act this way?”*, or when a conclusion needs re-examination, follow **SOUL → mPFC → cited Episode / Bookshelf evidence**. Do not fabricate a history to explain an existing SOUL entry. Change a conclusion when the evidence supports revision; retain the relevant history separately.

```text
Live context -> Short -> Episode ----> Bookshelf <---- LTM index
                         |
                         | relevant lived experience
                         | (Self and User perspectives together)
                         v
                        mPFC
               experience -> interpretation
                 -> revision and rationale
                         |
                         | reviewed consolidation
                         v
                        SOUL
               current conclusions only
```

The Bookshelf can also contain independently sourced reference material. The arrows show relationships, not an exclusive write path or a prescribed file layout.

## Repository and runtime boundaries

- This repository maintains the **identity model**, SOUL, and the mPFC Reflection record contract. It does **not** currently implement Short, Episode, Bookshelf, or LTM persistence, ingestion, retrieval, or scheduling.
- The `mpfc/` directory currently preserves **reviewed Reflection evidence and state transitions**. These records can ground evolving self-understanding; the model does not require separate Self/User documents or a new report schema.
- SOUL remains Root-only. Task workers receive the task evidence they need, not identity by default.
- Project facts and hard constraints remain project-owned. Becoming evidence for Reflection does not make them an identity rule.
- Proposed SOUL or Principle changes require review under [Reflection](reflection.md). No automatic identity rewrite is implied by this model.
- This description does not claim machine consciousness, human-like cognition, or that the proposed memory process has been empirically validated.

See [Reflection](reflection.md), [runtime integration](runtime.md), [mPFC](../mpfc/README.md), and [SOUL](../soul/SOUL.md) for the current identity-specific rules.
