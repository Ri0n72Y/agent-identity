# mPFC

mPFC is the agent's **evolving account of how experience informs “who I should be.”** Episodes are classified as **Experience** when relevance to Self, User, or their relationship has been identified, and **Event** otherwise. mPFC explains how Experiences form, challenge, or revise self-understanding. It preserves interpretations, contradictions, and revisions, with links to the underlying Episodes and evidence. Self and User are related perspectives, not separate required documents.

The current `mpfc/` directory is the **audit trail for reviewed identity Reflection**, not a complete deployed autobiographical memory service. It stores what was examined, the evidence and reasoning supporting an identity conclusion or non-change, and whether the effective identity changed. A negative result is still a result and must be retained. The retained reports may support a later synthesis of self-understanding without defining a separate report schema.

Concrete facts and reference material belong in the Bookshelf; Episodes preserve when, why, what was discussed, and the conclusion. mPFC links to relevant experiences and evidence instead of duplicating their complete content. See [memory model](../docs/memory-model.md).

Reflection preserves its evidence and outcome using the consuming Harness's available review and recording mechanisms. Each retained record has concise contextual metadata and an explanation of the assessment, with links to its source Episodes or Bookshelf material. No separate execution report format is required.

Derived metadata may include:

- `reflected_at`
- `reflection_round`
- `identity_revision_before`
- `identity_revision_after`
- `identityChanged`
- `state_transition`

The revision may be the repository commit that identifies the effective identity state before and after Reflection.

`state_transition` is a compact description of the final identity transition, for example `unchanged`, `principle added`, or `soul preference revised`.

The record must retain evidence and its traceable provenance. A Reflection may explain how a specific event led to, challenged, or failed to change an identity conclusion in the ordinary report content; the event record remains in its Episode rather than being duplicated in mPFC. Project constraints may appear as evidence; they are not copied into identity merely because they were examined. SOUL preserves the current conclusion, which may start from a human-authored definition and later change through reviewed Reflection, not this rationale. When the conclusion is questioned, consult mPFC and its referenced evidence.

When `identityChanged: false`, the record should still explain the reviewed evidence and why no identity update was justified. The before/after revision may remain identical.

Use `reflection.template.md` as the minimal record shape.
