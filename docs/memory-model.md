# Memory consolidation and self-continuity

> Status: agreed conceptual model, not an implemented storage schema or automatic runtime.
> Scope: explain how memory supports identity. The owning agent/project workspace, not this repository, holds its actual conversation, episode, and bookshelf data.

## From short-term state to durable evidence

| Layer | Responsibility | Boundary |
| --- | --- | --- |
| **Working** | The live conversation and task context. | It is not itself a durable record. |
| **Short** | Short-lived **factual memory across context boundaries**: recent events, current state, decisions, and unresolved matters needed to continue. | It is not a full transcript or a permanent knowledge store. |
| **Episode** | A consolidated, durable record from relevant Short state. Classify it as **Experience** when relevant to Self, User, or their relationship; otherwise classify it as an **Event**. Capture **when**, **why the interaction happened**, **what was discussed or done**, and **what conclusion was reached**. | Preserve temporal context and historical conclusions. Split long histories into dated blocks when useful; later corrections must not rewrite earlier records or source Sessions. |
| **Diary** | A period-partitioned natural-language index that aggregates Episode blocks. Update it in the same consolidation operation that turns Short into Episode. | Each period opens with a compressed carry-forward of earlier activity, then detailed records for the current period. Archive completed periods and link to Episodes rather than replacing them. |
| **Bookshelf** | Stores concrete facts, source material, and supporting knowledge, including facts extracted from episodes. | Facts and references live here rather than inside Episode as a separate `Facts` category. |
| **LTM** | A lightweight index into the bookshelf. | The index points to material; it does not repeat the bookshelf as another knowledge body. |

The conceptual progression is **Working → Short → Reflection → Episode** for records worth consolidating, with the corresponding **Diary** period created or updated in the same consolidation operation. Here, Reflection means examining and classifying Short history before consolidation; it does not require a separate runtime or a Soul-Ralph identity review for every event. An Experience can later inform the reviewed identity Reflection that produces mPFC evidence. Concrete facts and their sources are stored in the **Bookshelf**, with **LTM** as its index. This is a conceptual flow, not a requirement that every chat, fact, or external source pass through each layer.

An Episode answers: *When and why did we discuss this? What did we discuss? What did we conclude?* The Bookshelf answers: *What concrete information or source supports a claim?* An episode may link to bookshelf material instead of embedding it.

Keep the earlier event and its historical conclusion distinguishable from a later correction. Current understanding can change without making the earlier record pretend that the later evidence was already known.

## Episode types, temporal blocks, and Diary

**Experience** is an Episode whose relevance to Self, User, or their relationship has been identified. It is a direct candidate for Reflection that may inform mPFC. **Event** is an Episode for which no such relevance has been identified. These are the two formal Episode classifications, not separate memory systems or required separate files. If later reflection identifies Self/User relevance in an Event, preserve the original record and add a linked update rather than silently rewriting its history.

Episode history may be divided into dated blocks so that a long-running topic does not become one unbounded record. Preserve the sequence and the state known at each point. New evidence can correct or supersede an earlier conclusion, but must not alter what the earlier record said at the time.

**Diary** is the natural-language aggregation and index of these Episode blocks. It is partitioned into periods, such as weeks or months. Each period begins with a compressed carry-forward summary of what happened in earlier periods, followed by detailed records for the current period. When a period closes, archive it and carry its compressed summary forward into the next period. Create or update the relevant Diary period synchronously when Short is consolidated into Episode; Diary must not lag behind the Episode record.

Diary helps navigate and maintain continuity across periods. Its summaries and links do not replace Episode records or create a second store of concrete facts. Use the consuming Harness's existing storage and search mechanisms to support this structure rather than building a separate retrieval service.

## From lived experience to self-understanding

An interaction can reveal something about the user, the agent's response, and their relationship at the same time. During reflection on Short or Episode, **Self** and **User** are related perspectives used to identify which parts of an experience matter to the agent, the user, or their relationship. They are not mandatory separate Episode categories or documents, and they do not replace the Episode record.

Relevant experiences can inform **mPFC**: the evolving explanation of **how and why an event contributed to an understanding of “who I should be.”** The Episode remains the record of what happened and the conclusion reached. mPFC explains how an experience identified as relevant to Self, User, or their relationship forms, challenges, or revises self-understanding. It retains causal context, competing interpretations, contradictions, and later revisions, with links back to Episodes and other evidence rather than duplicating the event record. This is not a table of fixed personality traits. Not every episode justifies changing self-understanding.

**SOUL** is the compressed, routinely usable state of current identity conclusions, not their explanations. It may begin from a human-authored initial definition; reviewed Reflection can later revise it using mPFC's interpretation and linked evidence. mPFC explains how conclusions form and change, but it is not the required origin of every SOUL entry. In this limited engineering sense, SOUL is the agent's “subconscious” or immediate judgment tendency. It does not reproduce the events, arguments, or evidence used to form those conclusions.

When asked *“Why do I think or act this way?”*, or when a conclusion needs re-examination, follow **SOUL → mPFC → cited Episode / Bookshelf evidence**. Do not fabricate a history to explain an existing SOUL entry. Change a conclusion when the evidence supports revision; retain the relevant history separately.

```text
Live context -> Short -> Reflection -> Episode (Experience | Event)
                         (consolidation)       |                 |
                                        |                 +--> Diary (same consolidation)
                                        |                      period summary + Episode index
                                        +--> Bookshelf <---- LTM index
                                        |
                                    Experience
                                        |
                               reviewed identity Reflection
                                        v
                                       mPFC
                            interpretation and revisions
                                        |
                                reviewed conclusion
                                        v
human-authored initial definition ---> SOUL
                                 current conclusions
```

The two inputs to SOUL represent different paths: an explicit human-authored starting definition is allowed, and reviewed Reflection may later revise current conclusions. The diagram does not require every conclusion to originate in mPFC.

The Bookshelf can also contain independently sourced reference material. The arrows show relationships, not an exclusive write path or a prescribed file layout.

## Harness responsibilities and storage ownership

This model defines memory semantics and relationships; it does not define a parallel runtime. Reuse the consuming Harness and project workspace for capabilities they already provide, including session persistence, context compaction, task and plan state, underlying search and retrieval, Skill/Workflow execution, permissions, scheduling, and execution audit. Do not reproduce these facilities as new identity-memory layers. If a concrete gap remains, identify it against the actual runtime and prefer extending or integrating the existing mechanism over creating a competing subsystem.

Failures and corrections belong to the existing time-ordered history. Short can be updated as an ongoing situation develops. Preserve prior states and conclusions; a later Short update or Episode can correct or supersede an earlier understanding without rewriting the original Session or making later evidence appear to have been known earlier. Reflection can use these records to retain what failed, what changed, and why; no separate failure-memory layer is required.

The Bookshelf owns concrete facts, source material, and supporting knowledge. Episodes, Diary, mPFC records, and other memory views may link to or index Bookshelf entries. Do not add separate Facts or Resource layers merely to duplicate these responsibilities.

## Repository and runtime boundaries

- This repository maintains the **identity model**, SOUL, and the mPFC Reflection record contract. It does **not** currently implement Short, Episode, Bookshelf, or LTM persistence, ingestion, retrieval, or scheduling.
- The `mpfc/` directory currently preserves **reviewed Reflection evidence and state transitions**. These records can ground evolving self-understanding; the model does not require separate Self/User documents or a new report schema.
- SOUL remains Root-only. Task workers receive the task evidence they need, not identity by default.
- Project facts and hard constraints remain project-owned. Becoming evidence for Reflection does not make them an identity rule.
- Proposed SOUL or Principle changes require review under [Reflection](reflection.md). No automatic identity rewrite is implied by this model.
- This description does not claim machine consciousness, human-like cognition, or that the proposed memory process has been empirically validated.

For a complete walkthrough of the write/read lifecycle, Episode and Diary boundaries, and a non-binding example file layout, see [Memory workflow](memory-workflow.md). See [Reflection](reflection.md), [runtime integration](runtime.md), [mPFC](../mpfc/README.md), and [SOUL](../soul/SOUL.md) for the current identity-specific rules.
