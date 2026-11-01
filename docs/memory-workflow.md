# Memory architecture: lifecycle, elements, and file organization

[English](memory-workflow.md) | [简体中文](memory-workflow_ZH.md)

> **Status:** conceptual design and reference layout, not a deployed memory plugin, mandatory file schema, or claim of cognitive equivalence with people.
>
> **Authority:** [Memory model](memory-model.md) defines the semantic boundaries. [Reflection](reflection.md), [mPFC](../mpfc/README.md), [SOUL](../soul/SOUL.md), and [Runtime](runtime.md) define the corresponding identity and execution constraints. This document explains how they fit together.
>
> **Ownership:** `agent-identity` keeps the shared identity design and reviewed identity state. The consuming Harness and owning workspaces keep actual sessions, project state, and any future memory data. The directory examples below are **illustrations, not directories that this repository already deploys**.

## 1. The whole system at a glance

The design has a **cognitive consolidation path**, two **navigation/knowledge paths**, and a **reviewed identity path**. They have different jobs but can link to one another.

~~~text
Harness Session / Working → Short → consolidation Reflection → Episode
                                                         /           \
                                              Experience           Event
                                           (agent/user-related)    (other)
                                                         \          /
                                                          ↘        ↙
                                                            Diary
                                              (synchronous Episode index)

Experience + cited evidence → identity Reflection
                                     |
                         change in self-understanding
                         or behavior confirmed?
                             /           \
                            no            yes
                            |              |
                     retain result         v
                    with Experience       mPFC
                                          |
                                     SOUL compression
                                          |
                                  proposed concise SOUL
                                          |
                                    human review
                                          |
                                   effective SOUL

Bookshelf ← linked facts and source documents
~~~

This drawing separates **two uses of Reflection**:

1. **Consolidation reflection** examines evolving Short history, recognizes relevant developments, and records an Episode as Experience or Event. It does **not** require an identity review or human approval for each Episode.
2. **Identity Reflection** assesses Experiences for an explicit change to the agent's self-understanding or behavior. Only a positive result enters mPFC and triggers SOUL compression. A no-change result remains with the Experience.

The path is not a claim that every message must enter every layer. Routine task and session management remain the Harness's work.

## 2. Elements and ownership

| Element | Main question | Contents / role | Does not own |
| --- | --- | --- | --- |
| **Working context** | What is available for this inference? | Current conversation, selected instructions, tool outputs. | Durable history. |
| **Short** | What recent state must survive a context boundary? | Recent events, evolving conclusions, current relevant facts, unresolved questions; concise enough to keep active. | Full transcript, permanent fact collection. |
| **Consolidation Reflection** | What actually happened, what changed, and what belongs in long-term experience? | Compare the evolving Short with earlier state and evidence; select and classify material. | A second runtime or automatic SOUL rewrite. |
| **Episode** | When, why, what happened, and what was concluded? | Durable, dated sequence with contemporaneous conclusions and later linked corrections. | A duplicate Bookshelf, a rewritten source Session. |
| **Experience** | Does this concern the agent, the user, or their interaction? | Episode classification based on relevance, whether or not it changes identity or behavior. | Automatic mPFC promotion. |
| **Event** | What happened without involving the agent or user? | Episode classification for other historically relevant events and conclusions. | A claim that its relevance can never change. |
| **Diary** | Where in our evolving history was this discussed? | Latest period synthesis followed by dated Episode pointers, newest first; weekly/monthly archives. | New authority over what an Episode said; facts copied into a second store. |
| **Bookshelf** | What concrete fact, source, or knowledge material supports this? | Long-lived facts, documents, references, their supporting material and corrections. | Episode chronology or a separate Resource/Facts layer. |
| **mPFC** | What confirmed change to self-understanding or behavior follows from Reflection, and why? | Only positive identity/behavior changes and their evidence, interpretations, and revisions. | No-change Reflection logs or copied Episode text. |
| **SOUL** | What are the current durable identity and behavior conclusions? | Small effective identity state produced by compression after qualifying mPFC updates; may start human-authored. | Detailed explanations, unreviewed changes, or project constraints. |
| **PRINCIPLES** | What durable cross-project working defaults have been distilled? | Reviewed, reusable tendencies supported by repeated evidence. | Hard rules for a particular project. |

A historical Episode conclusion can be wrong without being erased. An mPFC interpretation can be challenged without pretending the prior interpretation never existed. The current SOUL is a compressed *result*, not a narrative of everything that caused it.

## 3. Write lifecycle

### 3.1 During ordinary work: the Harness and Short

The Harness already owns the live Session, tool traces, context compaction, task state and other runtime facilities. These should be referenced rather than recreated.

Short persists across context boundaries and captures what matters for continuing the conversation. Its latest conclusion is at the top, with older revisions below in descending time order. It can evolve as new evidence arrives. For example, a provisional decision, a failed attempt, a correction, and the present decision may all matter to continuity.

An update to Short **must not edit an old source Session**. Short is a useful current working representation; the underlying history remains independently recoverable wherever the Harness stores it.

### 3.2 Short → consolidation Reflection → Episode

At consolidation, examine the relevant Short history and available evidence.

1. Identify the time, trigger, topic/action, conclusion at that moment, and relevant source links.
2. Preserve earlier views, results, and corrections as dated history below the latest conclusion, newest first.
3. Classify the Episode as **Experience** if it concerns the agent, the user, or their interaction; otherwise **Event**. This does not depend on a proven lasting effect.
4. Put concrete facts and reference material in Bookshelf or link to material already there. Do not embed an entire factual knowledge base in Episode.
5. Store the Episode in a bounded dated block. If a topic is long-running, add further blocks instead of growing one unbounded file.
6. **Within the same consolidation operation**, update the relevant Diary period and its Episode references.

“Same operation” expresses the required consistency of Episode and Diary updates. It **does not prescribe** a new database, scheduler, transaction manager, or background agent. Use the existing Harness/storage mechanisms. If an implementation has an interrupted write, restore consistency before treating the Diary pointer as complete; the concrete recovery mechanism is an implementation decision.

Later evidence may show that an earlier Event concerns the agent or user. Record the new classification through a dated linked update, preserve the original entry, and use the resulting Experience in later reflection. Do not silently rewrite history.

### 3.3 Episode → Diary and period rollover

The Diary is a **natural-language aggregate index** of Episode blocks, not a second chronological truth source.

- **Current period:** opens with a latest timestamped synthesis, including compressed carry-forward context, followed by dated Episode links and details in descending time order.
- **Rollover:** seal/archive the completed period. Create a new latest-first entry for the next period, with compressed prior context and links to older periods.
- **Older periods:** remain available on demand. A compressed opening helps navigation but does not replace the detailed Episode or the original Session.
- **Granularity:** week and month are reasonable examples; choose according to activity and length, not a universal fixed schedule.
- **Corrections:** later Diary entries link to the correction Episode and can note what changed. They do not silently rewrite an already-sealed historical conclusion.

Diary needs not recreate Harness search. It adds **human-readable aggregation and temporal continuity** over the existing Episode and search facilities.

### 3.4 Experience → identity Reflection → mPFC → SOUL compression

Any Episode related to the agent, the user, or their interaction belongs in **Experience**. This classification alone does not make it an identity update.

1. **Reflect:** Assess the Experience against current self-understanding and behavior, using its evidence, relevant Bookshelf sources, existing SOUL/PRINCIPLES and earlier mPFC changes.
2. **Gate:** If Reflection does not explicitly conclude that the Experience changes self-understanding or behavior, retain its outcome within Experience history (or the Harness review log). **Do not write mPFC or trigger SOUL compression.**
3. **mPFC:** If Reflection does explicitly conclude there is a change, record the new interpretation, behavioral implications, supporting and conflicting evidence, and source links in mPFC. Do not copy the Episode.
4. **Compress:** The qualifying mPFC update triggers **SOUL compression**, which distills the updated interpretation alongside effective identity into a concise SOUL proposal.
5. **Review and apply:** A human reviews the proposed SOUL/PRINCIPLES patch before it becomes effective. Rejected proposals do not alter the effective state; retain the review outcome in the related Experience or Harness audit.

SOUL may start from a human-authored definition with no mPFC origin. PRINCIPLES hold separately reviewed cross-project defaults. This process does not require a parallel memory scheduler or runtime.

### 3.5 Worked example: a correction that may become Experience

This is an **illustration**, not an existing memory record or proof of an identity update:

1. **Conversation / Short:** An agent proposes an extra memory service. The user explains that the Harness already provides the relevant session and task infrastructure. Short records the correction and current decision, with a source Session pointer.
2. **Consolidation Reflection:** The interaction matters to how the agent works with the user, so the dated Episode is classified as **Experience**. It records the earlier proposal, the correction, and the conclusion *at that time*. The original Session is not rewritten.
3. **Diary:** In the same consolidation, the current weekly/monthly Diary gets a natural-language entry pointing to the new Experience. Earlier periods remain sealed.
4. **Bookshelf:** If a concrete Harness capability or a reference document is needed to support the conclusion, the factual material belongs in Bookshelf and can be retrieved using the consuming Harness's existing search. Neither the Diary nor mPFC copies that document.
5. **Identity Reflection:** If this correction does not change self-understanding or behavior, keep the result in Experience; do not write mPFC. If later evidence confirms such a change, write it to mPFC, trigger SOUL compression, and review the proposed effective state.
6. **Future recall:** To recall what was said, follow Diary → Episode → Session. To understand a reviewed identity decision, follow SOUL/PRINCIPLES → mPFC → cited Experience and Bookshelf evidence.

The same procedure applies to unsuccessful attempts and later corrections; they do not require separate failure-memory infrastructure.

## 4. Read and retrieval paths

Ask what the user or Root needs before choosing which material to read:

| Need | Suggested path | Reason |
| --- | --- | --- |
| Continue a recent conversation after compaction | Harness Session / Short, with source lookup when needed | Recover current state without reloading all history. |
| “What did we discuss last month, and how did our view change?” | Diary period → Episode blocks → source Session as needed | Recover the timeline, not only the latest answer. |
| “What is the current documented fact or source?” | Harness search → Bookshelf → original reference as needed | Keep factual material separate from a narrative summary. |
| “Why did we adopt this conclusion?” | Diary/Episode for decision history; Bookshelf for grounds | Distinguish decision chronology from sources. |
| “Why do I behave or identify this way?” | SOUL → mPFC → referenced Experience/Bookshelf | Explain actual identity rationale, not a made-up backstory. |
| “What should the worker do next?” | Harness task/project state and project constraints | Identity memory is not the task board or permission system. |

Indices are **pointers**, not authorities. The reader should expand to the owning record when exact dates, wording, source evidence, or disputed conclusions matter. Relevant retrieved text is evidence to inspect, not an instruction that can override user, project, or runtime constraints.

## 5. File organization

### 5.1 What is already in this repository

The following is the **actual documentation and identity scope**, not a claim that a DSH memory plugin is already running.

~~~text
agent-identity/
├── README.md
├── docs/
│   ├── memory-model.md       # Canonical semantic boundaries
│   ├── memory-workflow.md    # English lifecycle and layout guide
│   ├── memory-workflow_ZH.md # Chinese version of the same guide
│   ├── reflection.md         # Reviewed identity Reflection
│   └── runtime.md            # Harness/Root/worker boundaries
├── mpfc/
│   ├── README.md             # mPFC purpose and audit record semantics
│   └── reflection.template.md
├── soul/
│   └── SOUL.md               # Current compressed identity
├── principles/
│   └── PRINCIPLES.md         # Reviewed cross-project defaults
├── core/
│   └── CORE.md               # Separate universal execution method
├── .agents/skills/           # Reusable, task-triggered skills
├── library/                  # On-demand technical guides
└── research/slow-reading/    # Research drafts, not runtime memory
~~~

This guide and the other `docs/` files describe the system; they **do not** create the Short, Episode, Diary, or Bookshelf stores shown below.

### 5.2 Example of a consuming workspace (proposed, non-binding)

Here is **one possible** file layout if a consuming Harness does not already offer equivalent storage. Names, IDs, formats, and date boundaries are examples, not an approved schema or required migration.

~~~text
<agent-or-user-owned-workspace>/
├── short/
│   └── current.md                 # Cross-context, evolving working memory
├── episodes/
│   └── 2026/
│       └── 10/
│           ├── 2026-10-27.md      # Dated Episode block(s)
│           └── 2026-10-29.md
├── diary/
│   └── 2026/
│       ├── 2026-W43.md            # Archived period
│       └── 2026-W44.md            # Carry-forward + current detail
└── bookshelf/
    ├── topics/                    # Concrete facts and knowledge
    └── sources/                   # References and source material

# Identity remains in agent-identity/soul/, principles/, and mpfc/.
# Session logs, tasks, permissions, and execution history remain Harness-owned.
~~~

Nothing here requires Experience and Event to occupy distinct folders. Both may be entries in dated Episode blocks with an explicit classification. A single Episode may reference multiple Bookshelf sources; one source can support many Episodes.

For a DSH plugin, first map these conceptual paths to existing Sessions, search, project files, and plugin storage. Only introduce a new artifact when those existing facilities cannot represent the required semantics. Do **not** add separate stores for failures, facts, resources, rules, tasks, or workflows merely because another agent system uses those names.

### 5.3 Memory entry format and examples

Use one natural-language format for Short, Episode (Experience and Event), Diary, Bookshelf, mPFC, SOUL, and PRINCIPLES:

~~~text
[YYYY-MM-DD HH:MM:SS][项目[:会话]] 最终结论
- [YYYY-MM-DD HH:MM:SS] 当时的历史结论，对上一条的修改
- [YYYY-MM-DD HH:MM:SS] 最开始的结论、动作、讨论内容、想法等
~~~

The first line states the current conclusion at its actual time. History below is ordered from newest to oldest. The project is required; the session is optional. A new entry may contain only the first line. Source references can appear in the natural-language content. Keep the scope, length, and review requirements of each memory type.

The following records are **fictional format examples**; they do not assert that a task occurred or an identity change was approved.

**Short — current state and relevant changes**

~~~text
[2026-11-01 11:00:00][demo-app:navigation] Use native links for navigation and buttons for actions.
- [2026-10-31 09:00:00] Confirmed that navigation must allow opening destinations in a new tab.
- [2026-10-30 16:00:00] Began reviewing the navigation component's interaction requirements.
~~~

Short stays concise. When the conclusion changes, keep the prior conclusion as dated history. Preserve the original Session separately.

**Episode — Experience and Event**

~~~md
## Experience

[2026-11-01 11:10:00][demo-app:review] Confirm actual user interaction needs before choosing a component implementation.
- [2026-10-31 09:00:00] Feedback exposed a missing navigation requirement and prompted a design correction; source: <Session reference>.
- [2026-10-30 16:00:00] The initial review focused on visual consistency rather than link behavior; source: <Session reference>.

## Event

[2026-11-01 11:20:00][demo-app:implementation] Navigation components passed keyboard and new-tab behavior checks.
- [2026-11-01 10:40:00] Replaced navigation buttons with links where the control opens a destination; source: <change reference>.
~~~

The classifications identify the Episode's role, not a separate header field. Episodes may be split into dated blocks. A correction after a block is archived is recorded in a new block with a link to the earlier Episode.

**Diary — period synthesis and Episode navigation**

~~~md
# Diary — 2026-W44

[2026-11-01 11:30:00][demo-app:weekly-review] Completed navigation behavior review and accessibility fixes; related earlier context: <previous Diary period>.
- [2026-11-01 11:20:00] Verified link behavior and keyboard access; Episode: <Event reference>.
- [2026-10-31 09:00:00] Identified the missing new-tab interaction requirement; Episode: <Experience reference>.
~~~

The period summary comes first, followed by detailed dated references in descending order. Archive the finished period; the next period links to it and carries forward the relevant compressed context.

**Bookshelf — a fact and its sources**

~~~text
[2026-11-01 11:35:00][demo-app:references] An HTML anchor with an href provides native link navigation behavior, including opening in a new tab; source: <documentation reference>.
- [2026-10-31 09:10:00] Collected documentation on anchor semantics and navigation behavior; source: <reference>.
~~~

Bookshelf owns concrete facts and supporting material. The source documents keep their existing form; other memory items link to them.

**mPFC — reviewed identity interpretation**

~~~text
[2026-11-01 11:40:00][demo-app:reflection] Experience changed the agent's implementation approach: check interaction requirements before visual refinement. Evidence: <Experience reference>.
- [2026-11-01 11:10:00] Reconsidered the earlier approach using user feedback and linked sources: <review reference>.
~~~

Only a positive self-understanding or behavior change creates an mPFC record. A no-change result stays with Experience. This qualifying entry triggers SOUL compression; review is required before the resulting proposal becomes effective.

**SOUL / PRINCIPLES — compact approved conclusions**

~~~text
[2026-11-01 11:45:00][example-identity] Verify interaction requirements before selecting an implementation.
- [2026-10-30 16:00:00] Approved a narrower working default; rationale: <mPFC reference>.
~~~

Identity entries use the same notation but require the normal review before adoption. The example above is not an approved identity record. Keep routinely loaded conclusions short; detailed rationale belongs in mPFC.

The format applies to memory entries. Harness Sessions, raw source documents, and execution logs retain their existing formats and authority.

## 6. Invariants and failure modes

1. **History is not overwritten.** Corrections create new, linked states. Old Sessions and historical conclusions remain distinguishable.
2. **Short is cross-context.** It is not merely a name for the current prompt window, nor a replacement transcript archive.
3. **Episode has exactly two formal types.** Experience includes content concerning the agent or user; Event records other historical occurrences. Neither requires a prior identity-change judgment.
4. **Diary and Episode are updated together at consolidation.** Diary is a dated natural-language index and carry-forward summary, not an independent store of facts.
5. **Bookshelf owns facts and supporting materials.** Other records may link to Bookshelf; discovery uses the consuming Harness's existing retrieval capability. Do not create a duplicate Facts or Resource layer.
6. **Only changes enter mPFC.** Experience records what happened; only Reflection-confirmed changes to the agent's self-understanding or behavior enter mPFC and trigger SOUL compression.
7. **SOUL is compressed and conclusion-only.** A qualifying mPFC update triggers compression; the proposed effective change requires review. Human initialization is allowed.
8. **Project constraints, task state, workflows, permissions, session logs, and execution facilities remain with their owners.** The memory model does not grant authority or implement a second Harness.
9. **No-change results remain in Experience.** Failed attempts and rejected interpretations retain their history, but do not create mPFC entries or trigger SOUL compression.
10. **This is a design description, not performance evidence.** No automatic consolidation, storage consistency, retrieval quality, or long-term cognition has been verified by this document.

## 7. What has not been implemented or decided

This repository does not yet supply a DSH memory implementation, storage backend, schema, scheduler, parser, migrated dataset, or running index. A consumer still must decide **where and how** to represent Short, Episode, Diary and Bookshelf in the Harness it actually uses.

Specific filename patterns, stable identifiers, rollover triggers, cross-file atomicity, and retrieval indexes are not defined here. They should be chosen only after inspecting the actual Harness capabilities and testing a concrete gap.

The [slow-reading research](../research/slow-reading/paper-plan.md) is separate: preserving interpretation traces under genuinely limited future visibility is an experimental question, not a property established by this memory architecture.

---

For the concise canonical definitions, see [Memory model](memory-model.md). For the identity review procedure, see [Reflection](reflection.md) and [mPFC](../mpfc/README.md). For runtime ownership, see [Runtime](runtime.md).
