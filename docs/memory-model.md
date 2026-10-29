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

An interaction can reveal something about the user, the agent's response, and their relationship at the same time. During reflection on Short or Episode, **Self** and **User** are related perspectives used to identify which parts of an experience matter to the agent, the user, or their relationship. They are not mandatory separate Episode categories or documents, and they do not replace the Episode's event record.

Relevant experiences can inform **mPFC**: the evolving explanation of **how and why an event contributed to an understanding of “who I should be.”** The Episode remains the record of what happened and the conclusion reached. mPFC explains how an experience identified as relevant to Self, User, or their relationship forms, challenges, or revises self-understanding. It retains causal context, competing interpretations, contradictions, and later revisions, with links back to Episodes and other evidence rather than duplicating the event record. This is not a table of fixed personality traits. Not every episode justifies changing self-understanding.

**SOUL** is the compressed, routinely usable state of current identity conclusions, not their explanations. It may begin from a human-authored initial definition; reviewed Reflection can later revise it using mPFC's interpretation and linked evidence. mPFC explains how conclusions form and change, but it is not the required origin of every SOUL entry. In this limited engineering sense, SOUL is the agent's “subconscious” or immediate judgment tendency. It does not reproduce the events, arguments, or evidence used to form those conclusions.

When asked *“Why do I think or act this way?”*, or when a conclusion needs re-examination, follow **SOUL → mPFC → cited Episode / Bookshelf evidence**. Do not fabricate a history to explain an existing SOUL entry. Change a conclusion when the evidence supports revision; retain the relevant history separately.

```text
Live context -> Short -> Episode ----> Bookshelf <---- LTM index
                         |
                         | reflection identifies relevance to Self/User
                         v
                  mPFC: interpretation,
                  rationale and revisions
                         |
                         | reviewed consolidation
                         v
human-authored initial definition ---> SOUL
                                       current conclusions
```

The two inputs to SOUL represent different paths: an explicit human-authored starting definition is allowed, and reviewed Reflection may later revise current conclusions. The diagram does not require every conclusion to originate in mPFC.

The Bookshelf can also contain independently sourced reference material. The arrows show relationships, not an exclusive write path or a prescribed file layout.

## Harness responsibilities and optional Diary index

This model defines the meaning and relationships of memory records; it does not define a parallel runtime. Use the consuming Harness and project workspace for capabilities they already provide, including session persistence, context compaction, task and plan state, search and retrieval, Skill/Workflow execution, permissions, scheduling, and execution audit. Do not reproduce these facilities as new identity-memory layers. If a concrete gap remains, first identify it against the actual runtime and prefer extending or integrating the existing mechanism over creating a competing subsystem.

Failures and corrections belong to the existing time-ordered history. Short can be updated as an ongoing situation develops. Preserve prior states and conclusions; a later Short update or Episode can correct or supersede an earlier understanding without rewriting the original Session or making later evidence appear to have been known earlier. Reflection can use these records to retain what failed, what changed, and why; no separate failure-memory layer is required.

The Bookshelf already owns concrete facts, source material, and supporting knowledge. Episodes, mPFC records, and other memory views may link to or index Bookshelf entries. Do not add separate Facts or Resource layers merely to duplicate these responsibilities.

**Diary is optional, not a required cognitive stage or authoritative record.** Add it only if the consuming Harness's existing search cannot adequately find relevant Episodes from natural-language descriptions. If needed, Diary is a rebuildable navigation index that points to Episodes; it must not become a second source of truth or duplicate Episode events and Bookshelf facts. If existing search is sufficient, do not add Diary.

## Repository and runtime boundaries

- This repository maintains the **identity model**, SOUL, and the mPFC Reflection record contract. It does **not** currently implement Short, Episode, Bookshelf, or LTM persistence, ingestion, retrieval, or scheduling.
- The `mpfc/` directory currently preserves **reviewed Reflection evidence and state transitions**. These records can ground evolving self-understanding; the model does not require separate Self/User documents or a new report schema.
- SOUL remains Root-only. Task workers receive the task evidence they need, not identity by default.
- Project facts and hard constraints remain project-owned. Becoming evidence for Reflection does not make them an identity rule.
- Proposed SOUL or Principle changes require review under [Reflection](reflection.md). No automatic identity rewrite is implied by this model.
- This description does not claim machine consciousness, human-like cognition, or that the proposed memory process has been empirically validated.

See [Reflection](reflection.md), [runtime integration](runtime.md), [mPFC](../mpfc/README.md), and [SOUL](../soul/SOUL.md) for the current identity-specific rules.
