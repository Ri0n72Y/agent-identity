# Memory architecture: lifecycle, elements, and file organization

> **Status:** conceptual design and reference layout, not a deployed memory plugin, mandatory file schema, or claim of cognitive equivalence with people.
>
> **Authority:** [Memory model](memory-model.md) defines the semantic boundaries. [Reflection](reflection.md), [mPFC](../mpfc/README.md), [SOUL](../soul/SOUL.md), and [Runtime](runtime.md) define the corresponding identity and execution constraints. This document explains how they fit together.
>
> **Ownership:** `agent-identity` keeps the shared identity design and reviewed identity state. The consuming Harness and owning workspaces keep actual sessions, project state, and any future memory data. The directory examples below are **illustrations, not directories that this repository already deploys**.

## 1. The whole system at a glance

The design has a **cognitive consolidation path**, two **navigation/knowledge paths**, and a **reviewed identity path**. They have different jobs but can link to one another.

~~~text
Harness live session / current context
                 |
                 v
       Short (cross-context, evolving)
                 |
                 v
     Reflection for consolidation
   (select, compare, classify, revise)
                 |
                 v
      Episode (dated, historical)
        /                \
 Experience             Event
 (Self/User-related)    (other event)
        |                    |
        +----------+---------+
                   |
               Diary
        (weekly/monthly natural-language
         index; same consolidation)
                   |
              Episode IDs
                   |
        Source Session / evidence

 Facts and external materials <--> Bookshelf <--- LTM index
         ^                      ^
         |                      |
         +-- Episode/Diary/mPFC links (without duplicating facts)

 Experience + relevant evidence + current SOUL/PRINCIPLES
                 |
                 v
       Reviewed identity Reflection
                 |
                 v
       mPFC (interpretation, rationale,
             counterevidence, revisions)
                 |
                 v
          reviewed update, if justified
                 |
                 v
       SOUL / PRINCIPLES
   (compressed effective conclusions)
~~~

This drawing separates **two uses of Reflection**:

1. **Consolidation reflection** examines evolving Short history, recognizes relevant developments, and records an Episode as Experience or Event. It does **not** require a separate Soul-Ralph run or human approval for each Episode.
2. **Identity Reflection** considers selected Experiences and evidence to decide whether the agent's self-understanding or durable principles should change. In this repository it is an ordinary Ralph task with human review. It records the result in mPFC even when the answer is *no change*.

The path is not a claim that every message must enter every layer. Routine task and session management remain the Harness's work.

## 2. Elements and ownership

| Element | Main question | Contents / role | Does not own |
| --- | --- | --- | --- |
| **Working context** | What is available for this inference? | Current conversation, selected instructions, tool outputs. | Durable history. |
| **Short** | What recent state must survive a context boundary? | Recent events, evolving conclusions, current relevant facts, unresolved questions; concise enough to keep active. | Full transcript, permanent fact collection. |
| **Consolidation Reflection** | What actually happened, what changed, and what belongs in long-term experience? | Compare the evolving Short with earlier state and evidence; select and classify material. | A second runtime or automatic SOUL rewrite. |
| **Episode** | When, why, what happened, and what was concluded? | Durable, dated sequence with contemporaneous conclusions and later linked corrections. | A duplicate Bookshelf, a rewritten source Session. |
| **Experience** | How does this Episode concern Self, User, or their relationship? | One of the two official Episode classifications, eligible as input to identity Reflection. | A separate persona file or a guaranteed identity change. |
| **Event** | What happened without identified Self/User relevance? | The other official Episode classification, still historically useful. | A permanent assertion that the event can never become relevant. |
| **Diary** | Where in our evolving history was this discussed? | Natural-language summaries and dated pointers to Episodes, in weekly/monthly periods. | New authority over what an Episode said; facts copied into a second store. |
| **Bookshelf** | What concrete fact, source, or knowledge material supports this? | Long-lived facts, documents, references, their supporting material and corrections. | Episode chronology or a separate Resource/Facts layer. |
| **LTM** | Which Bookshelf material should be opened? | Index/pointers into Bookshelf, not an additional knowledge body. | Independent copies of Bookshelf facts. |
| **mPFC** | How and why did an Experience shape, challenge, or revise self-understanding? | Identity interpretations, evidence links, competing explanations and revisions; reviewed Reflection records. | Rewriting Episode events or embedding all source material. |
| **SOUL** | What are the current durable identity conclusions? | Small, normally available conclusions; may start with a human-authored definition. | Detailed explanations, tasks, permissions, project constraints. |
| **PRINCIPLES** | What durable cross-project working defaults have been distilled? | Reviewed, reusable tendencies supported by repeated evidence. | Hard rules for a particular project. |

**Self and User are related lenses**, not additional Episode categories or mandatory documents. The two Episode types are **Experience** and **Event**. “Others” fits Event unless an interaction also reveals relevance to Self, User, or their relationship.

A historical Episode conclusion can be wrong without being erased. An mPFC interpretation can be challenged without pretending the prior interpretation never existed. The current SOUL is a compressed *result*, not a narrative of everything that caused it.

## 3. Write lifecycle

### 3.1 During ordinary work: the Harness and Short

The Harness already owns the live Session, tool traces, context compaction, task state and other runtime facilities. These should be referenced rather than recreated.

Short persists across context boundaries and captures what matters for continuing the conversation. It can evolve as new evidence arrives. For example, a provisional decision, a failed attempt, a correction, and the present decision may all matter to continuity.

An update to Short **must not edit an old source Session**. Short is a useful current working representation; the underlying history remains independently recoverable wherever the Harness stores it.

### 3.2 Short → consolidation Reflection → Episode

At consolidation, examine the relevant Short history and available evidence.

1. Identify the time, trigger, topic/action, conclusion at that moment, and relevant source links.
2. Keep changes in sequence: initial view, observed outcome, correction and revised conclusion when relevant.
3. Classify the resulting Episode as **Experience** if it involves Self, User, or their relationship; otherwise **Event**.
4. Put concrete facts and reference material in Bookshelf or link to material already there. Do not embed an entire factual knowledge base in Episode.
5. Store the Episode in a bounded dated block. If a topic is long-running, add further blocks instead of growing one unbounded file.
6. **Within the same consolidation operation**, update the relevant Diary period and its Episode references.

“Same operation” expresses the required consistency of Episode and Diary updates. It **does not prescribe** a new database, scheduler, transaction manager, or background agent. Use the existing Harness/storage mechanisms. If an implementation has an interrupted write, restore consistency before treating the Diary pointer as complete; the concrete recovery mechanism is an implementation decision.

A later insight may identify Self/User relevance in an earlier Event. Add a dated linked classification/update, preserve the earlier record, and use the relevant Experience in later reflection. Do not silently rewrite the historical event.

### 3.3 Episode → Diary and period rollover

The Diary is a **natural-language aggregate index** of Episode blocks, not a second chronological truth source.

- **Current period:** opens with a compressed carry-forward (“What we did before”), then gives more detailed dated entries and Episode links for the present week or month.
- **Rollover:** seal/archive the completed period. Make the following period's carry-forward summary from the appropriate previous history, retaining links when they support recall.
- **Older periods:** remain available on demand. A compressed opening helps navigation but does not replace the detailed Episode or the original Session.
- **Granularity:** week and month are reasonable examples; choose according to activity and length, not a universal fixed schedule.
- **Corrections:** later Diary entries link to the correction Episode and can note what changed. They do not silently rewrite an already-sealed historical conclusion.

Diary needs not recreate Harness search. It adds **human-readable aggregation and temporal continuity** over the existing Episode and search facilities.

### 3.4 Episode/Bookshelf → identity Reflection → mPFC → SOUL

An Experience is **eligible evidence**, not an automatic personality update.

The Root selects relevant Experiences, Bookshelf sources, existing SOUL/PRINCIPLES and earlier mPFC records. An ordinary Reflection Ralph examines them and may propose a change. A human reviews the proposed change. Accepted changes update the effective identity; an unchanged or rejected result is still retained as mPFC evidence.

mPFC should preserve *why* a conclusion was formed, reinforced, challenged, revised, or not adopted, using references to actual Episodes and sources. It must not become another Episode transcript.

SOUL retains only the current conclusions. It can initially be human-authored, so an initial entry may have **no mPFC origin**. Do not invent a retrospective causal explanation for such an entry. Future evolution through Reflection must keep its actual review history. PRINCIPLES similarly hold reviewed durable defaults, not project-local instructions.

There is **no automatic propagation** from a single Experience to SOUL.

## 4. Read and retrieval paths

Ask what the user or Root needs before choosing which material to read:

| Need | Suggested path | Reason |
| --- | --- | --- |
| Continue a recent conversation after compaction | Harness Session / Short, with source lookup when needed | Recover current state without reloading all history. |
| “What did we discuss last month, and how did our view change?” | Diary period → Episode blocks → source Session as needed | Recover the timeline, not only the latest answer. |
| “What is the current documented fact or source?” | LTM → Bookshelf → original reference as needed | Keep factual material separate from a narrative summary. |
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
│   ├── memory-workflow.md    # This lifecycle and layout guide
│   ├── reflection.md         # Reviewed identity Reflection
│   ├── runtime.md            # Harness/Root/worker boundaries
│   └── task-contract.md      # Identity use of native Ralph contract
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

This guide and the other `docs/` files describe the system; they **do not** create the Short, Episode, Diary, Bookshelf, or LTM stores shown below.

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
├── bookshelf/
│   ├── topics/                    # Concrete facts and knowledge
│   └── sources/                   # References and source material
└── ltm/
    └── index.md                   # Pointers into bookshelf only

# Identity remains in agent-identity/soul/, principles/, and mpfc/.
# Session logs, tasks, permissions, and execution history remain Harness-owned.
~~~

Nothing here requires Experience and Event to occupy distinct folders. Both may be entries in dated Episode blocks with an explicit classification. A single Episode may reference multiple Bookshelf sources; one source can support many Episodes.

For a DSH plugin, first map these conceptual paths to existing Sessions, search, project files, and plugin storage. Only introduce a new artifact when those existing facilities cannot represent the required semantics. Do **not** add separate stores for failures, facts, resources, rules, tasks, or workflows merely because another agent system uses those names.

### 5.3 Illustrative record bodies (not schemas)

**Short** can be compact and current:

~~~md
# Current Short
- Continuing topic: memory consolidation
- Current decision: divide Episodes into Experience and Event
- Open question: how to handle the next Diary period
- Recent change: weekly Diary selected; earlier alternative remains in history
- Source: <Session reference>
~~~

**Episode** carries an event and the conclusion **as known at that point**:

~~~md
## Episode example-001 — 2026-10-29
Type: Event
Why: review how to navigate dated Episode blocks
Discussed: weekly versus monthly Diary periods
Conclusion at the time: use weekly periods for this example
Sources: <Session reference>, <Bookshelf reference if relevant>

## Episode example-002 — 2026-10-30
Type: Event
Why: revisit the period boundary with new information
Discussed: different activity levels and document length
Conclusion at the time: allow weekly or monthly periods
Relation: revises example-001 without deleting it
~~~

**Diary** aggregates and points back to dated Episodes:

~~~md
# Diary — 2026-W44

## Carry-forward from earlier periods
We previously established Short-to-Episode consolidation and the
need for an index that does not replace source events.
References: <previous Diary periods>, <Episode IDs>

## This period
### 2026-10-29
Compared weekly and monthly grouping; chose weekly for an example.
Episode: example-001

### 2026-10-30
Revised the grouping decision to allow activity-dependent periods.
Episode: example-002
~~~

**Bookshelf / LTM:** Bookshelf holds the referenced facts and documents; LTM points to those items. Neither copies the Episode/Dairy narrative as its own factual record. **mPFC:** when an Experience leads to reviewed self-understanding, its existing Ralph Report and metadata record the rationale and links; the SOUL file holds only the effective conclusion.

These examples illustrate content ownership. The field labels are **not** a proposed mandatory parser contract; `example-001` and the placeholder references are not real Session IDs.

## 6. Invariants and failure modes

1. **History is not overwritten.** Corrections create new, linked states. Old Sessions and historical conclusions remain distinguishable.
2. **Short is cross-context.** It is not merely a name for the current prompt window, nor a replacement transcript archive.
3. **Episode has exactly two formal types.** Experience is Self/User-related; Event is otherwise. Self/User are relevance lenses, not required files.
4. **Diary and Episode are updated together at consolidation.** Diary is a dated natural-language index and carry-forward summary, not an independent store of facts.
5. **Bookshelf owns facts and supporting materials; LTM indexes Bookshelf.** Other records may link to Bookshelf. Do not create a duplicate Facts or Resource layer.
6. **mPFC explains identity evolution; Episode records what happened.** A retrieved Experience does not automatically become an identity trait.
7. **SOUL is small and conclusion-only.** Human initialization is allowed. Later changes follow reviewed Reflection; no invented origin stories.
8. **Project constraints, task state, workflows, permissions, session logs, and execution facilities remain with their owners.** The memory model does not grant authority or implement a second Harness.
9. **Negative results and disagreements matter.** A failed attempt may remain an Episode; a Reflection ending in no identity change still produces an mPFC record.
10. **This is a design description, not performance evidence.** No automatic consolidation, storage consistency, retrieval quality, or long-term cognition has been verified by this document.

## 7. What has not been implemented or decided

This repository does not yet supply a DSH memory implementation, storage backend, schema, scheduler, parser, migrated dataset, or running index. A consumer still must decide **where and how** to represent Short, Episode, Diary, Bookshelf and LTM in the Harness it actually uses.

Specific filename patterns, stable identifiers, rollover triggers, cross-file atomicity, and retrieval indexes are not defined here. They should be chosen only after inspecting the actual Harness capabilities and testing a concrete gap.

The [slow-reading research](../research/slow-reading/paper-plan.md) is separate: preserving interpretation traces under genuinely limited future visibility is an experimental question, not a property established by this memory architecture.

---

For the concise canonical definitions, see [Memory model](memory-model.md). For the identity review procedure, see [Reflection](reflection.md) and [mPFC](../mpfc/README.md). For runtime ownership, see [Runtime](runtime.md).
