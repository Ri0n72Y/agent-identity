# Memory consolidation and self-continuity

> Status: agreed conceptual model, not an implemented storage schema or automatic runtime.
> Scope: explain how memory supports identity. The owning agent/project workspace, not this repository, holds its actual conversation, episode, and bookshelf data.

## From short-term state to durable evidence

| Layer | Responsibility | Boundary |
| --- | --- | --- |
| **Working** | The live conversation and task context. | It is not itself a durable record. |
| **Short** | Short-lived **factual memory across context boundaries**: recent events, current state, decisions, and unresolved matters needed to continue. | It is not a full transcript or a permanent knowledge store. |
| **Episode** | A consolidated, durable record from relevant Short state. Classify it as **Experience** whenever it concerns the agent, the user, or their interaction; otherwise classify it as an **Event**. The classification requires relevance, not demonstrated identity or behavior change. Capture **when**, **why the interaction happened**, **what was discussed or done**, and **what conclusion was reached**. | Preserve temporal context and historical conclusions. Split long histories into dated blocks when useful; later corrections must not rewrite earlier records or source Sessions. |
| **Diary** | A period-partitioned natural-language index that aggregates Episode blocks. Update it in the same consolidation operation that turns Short into Episode. | The latest dated synthesis comes first and carries compressed prior context; historical entries for the current period follow newest-first. Archive completed periods and link to Episodes. |
| **Bookshelf** | Stores concrete facts, source material, and supporting knowledge, including facts extracted from episodes. | Facts and references live here rather than inside Episode as a separate `Facts` category. |

The conceptual progression is **Working → Short → Reflection → Episode** for records worth consolidating, with the corresponding **Diary** period created or updated in the same consolidation operation. Here, Reflection means examining and classifying Short history before consolidation; it does not require a separate runtime or a reviewed identity update for every event. An Experience is eligible for identity Reflection. Only a Reflection that explicitly concludes it should change the agent's self-understanding or behavior passes the mPFC gate; writing mPFC then triggers SOUL compression. Concrete facts and their sources are stored in the **Bookshelf**, and may be located using the consuming Harness's existing retrieval capabilities. This is a conceptual flow, not a requirement that every chat, fact, or external source pass through each layer.

An Episode answers: *When and why did we discuss this? What did we discuss? What did we conclude?* The Bookshelf answers: *What concrete information or source supports a claim?* An episode may link to bookshelf material instead of embedding it.

Keep the earlier event and its historical conclusion distinguishable from a later correction. Current understanding can change without making the earlier record pretend that the later evidence was already known.

## Common memory entry format

All retained memory entries use one **latest-first** natural-language format: Short, Episode (Experience or Event), Diary, Bookshelf, mPFC, SOUL, and PRINCIPLES.

~~~text
[YYYY-MM-DD HH:MM:SS][项目[:会话]] 最终结论
- [YYYY-MM-DD HH:MM:SS] 当时的历史结论，对上一条的修改
- [YYYY-MM-DD HH:MM:SS] 最开始的结论、动作、讨论内容、想法等
~~~

The first line contains the **latest effective conclusion**, its timestamp, and its project (with optional session). Bullets below are ordered **newest to oldest** and preserve the conclusions, actions, discussion, or interpretation actually held at each time. A new record may have no history yet. A later update moves the previous conclusion into the history and writes the new conclusion at the top. Original Sessions and archived blocks are never rewritten. If an earlier block is sealed, the newer block contains the new head and references that earlier block.

This syntax defines the readable structure of a memory entry. Each entry has a timestamped conclusion and optional dated history; source links can appear inline. The consuming Harness provides storage, processing state, permissions, and retrieval. The record's *scope* remains unchanged: Short is concise, Episode preserves relevant history, Diary is a period-indexed synthesis, Bookshelf owns facts and sources, mPFC owns reviewed reasoning, and SOUL/PRINCIPLES keep only compact current conclusions and short dated history pointers, leaving detailed justification in mPFC.

## Episode types, temporal blocks, and Diary

**Experience** records an event, interaction, or outcome related to the agent, the user, or their relationship, including ordinary preferences, feedback, and corrections. This relevance alone is sufficient; no lasting identity effect is required. **Event** records other historically relevant occurrences. These are the two Episode classifications. If an Event is later found to concern the agent or user, add a dated linked reclassification without rewriting the original history.

Episode history may be divided into dated blocks so that a long-running topic does not become one unbounded record. Preserve the sequence and the state known at each point. New evidence can correct or supersede an earlier conclusion, but must not alter what the earlier record said at the time.

**Diary** is the natural-language aggregation and index of these Episode blocks. It is partitioned into periods, such as weeks or months. Each period begins with its latest timestamped synthesis, including a compressed carry-forward from earlier periods, followed by dated entries for the current period in descending time order. When a period closes, archive it and carry its compressed summary forward into the next period. Create or update the relevant Diary period synchronously when Short is consolidated into Episode; Diary must not lag behind the Episode record.

Diary helps navigate and maintain continuity across periods. Its summaries and links do not replace Episode records or create a second store of concrete facts. Use the consuming Harness's existing storage and search mechanisms to support this structure rather than building a separate retrieval service.

## From lived experience to self-understanding

Experience enters **identity Reflection** for assessment, but does not enter mPFC merely because it concerns the agent or user. If Reflection explicitly concludes that an Experience **changes the agent's self-understanding or behavior**, record the resulting interpretation and its evidence in **mPFC**. Otherwise retain the Experience and the reflection outcome in its Episode history; do not create an mPFC entry. mPFC preserves causal context, competing interpretations, contradictions, and revisions linked to their Episodes and other evidence. It is not a second event archive or a table of fixed traits.

**SOUL** is the compressed, routinely usable state of current identity conclusions, not their explanations. A substantive mPFC update **triggers SOUL compression**, which distills the updated self-understanding and behavioral conclusions into a concise proposed identity state. Review the proposed change before applying it to the effective SOUL; do not silently rewrite identity. SOUL may begin from a human-authored initial definition, so mPFC is not the origin of every SOUL entry. SOUL contains no duplicate event narratives or reasoning.

When asked *“Why do I think or act this way?”*, or when a conclusion needs re-examination, follow **SOUL → mPFC → cited Episode / Bookshelf evidence**. Do not fabricate a history to explain an existing SOUL entry. Change a conclusion when the evidence supports revision; retain the relevant history separately.

```text
Live context -> Short -> consolidation Reflection -> Episode
                                                /        \
                                        Experience      Event
                                        (agent/user)    (other)
                                              |             |
                                              +----+--------+---> Diary (same consolidation)
                                                   |
                            Experience -> identity Reflection
                                                   |
                                          change confirmed?
                                           /          \
                                         no            yes
                                         |              |
                              retain in Experience     v
                                       history        mPFC
                                                     |
                                                     v
                                              SOUL compression
                                                     |
                                                proposed SOUL
                                                     |
                                                   review
                                                     |
                                                approved SOUL

Bookshelf: facts and sources, linked by Episodes / reflections
```

The initial SOUL can be written by a human. Subsequent Experience-based changes follow the gated mPFC → SOUL compression path. A no-change Reflection does not update mPFC or trigger SOUL compression.

The Bookshelf can also contain independently sourced reference material. The arrows show relationships, not an exclusive write path or a prescribed file layout.

## Harness responsibilities and storage ownership

This model defines memory semantics and relationships; it does not define a parallel runtime. Reuse the consuming Harness and project workspace for capabilities they already provide, including session persistence, context compaction, task and plan state, underlying search and retrieval, Skill/Workflow execution, permissions, scheduling, and execution audit. Do not reproduce these facilities as new identity-memory layers. If a concrete gap remains, identify it against the actual runtime and prefer extending or integrating the existing mechanism over creating a competing subsystem.

Failures and corrections belong to the existing time-ordered history. Short can be updated as an ongoing situation develops: put the newest conclusion first and preserve prior states and conclusions below in descending time order. A later Short update or Episode can correct or supersede an earlier understanding without rewriting the original Session or making later evidence appear to have been known earlier. Reflection can use these records to retain what failed, what changed, and why; no separate failure-memory layer is required.

The Bookshelf owns concrete facts, source material, and supporting knowledge. Episodes, Diary, mPFC records, and other memory views may link to or index Bookshelf entries. Do not add separate Facts or Resource layers merely to duplicate these responsibilities.

## Repository and runtime boundaries

- This repository maintains the **identity model**, SOUL, and the mPFC Reflection evidence model. It does **not** currently implement Short, Episode, Diary, or Bookshelf persistence, ingestion, retrieval, or scheduling.
- The `mpfc/` directory preserves **positive identity-change interpretations and their supporting evidence**. Reflections that do not establish a change remain with their Experiences or Harness review records.
- SOUL remains Root-only. Task workers receive the task evidence they need, not identity by default.
- Project facts and hard constraints remain project-owned. Becoming evidence for Reflection does not make them an identity rule.
- An eligible mPFC update triggers SOUL compression; its proposed SOUL or Principle changes require review under [Reflection](reflection.md) before becoming effective.
- This description does not claim machine consciousness, human-like cognition, or that the proposed memory process has been empirically validated.

For the write/read lifecycle, the common latest-first memory entry notation, Diary period organization, and a non-binding example file layout, see the memory workflow guide: [English](memory-workflow.md) / [简体中文](memory-workflow_ZH.md). See [Reflection](reflection.md), [runtime integration](runtime.md), [mPFC](../mpfc/README.md), and [SOUL](../soul/SOUL.md) for the current identity-specific rules.
