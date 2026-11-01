# mPFC

mPFC is the agent's **evolving account of how experience informs “who I should be.”** Episodes are classified as **Experience** when they provide lasting insight into the agent's conduct, self-understanding, or collaboration, and **Event** otherwise. mPFC explains how Experiences form, challenge, or revise self-understanding. It preserves interpretations, contradictions, and revisions, with links to the underlying Episodes and evidence.

The current `mpfc/` directory is the **audit trail for reviewed identity Reflection**, not a complete deployed autobiographical memory service. It stores what was examined, the evidence and reasoning supporting an identity conclusion or non-change, and whether the effective identity changed. A negative result is still a result and must be retained. The retained reports may support a later synthesis of self-understanding without defining a separate report schema.

Concrete facts and reference material belong in the Bookshelf; Episodes preserve when, why, what was discussed, and the conclusion. mPFC links to relevant experiences and evidence instead of duplicating their complete content. See [memory model](../docs/memory-model.md).

Reflection preserves its evidence and outcome using the consuming Harness's available review and recording mechanisms. Its memory record uses the same latest-first header and descending history as Short and Episode: `[YYYY-MM-DD HH:MM:SS][项目[:会话]] 最终结论`, followed by dated `- [YYYY-MM-DD HH:MM:SS]` history lines. The head states the latest reviewed interpretation or an explicit no-change conclusion. Earlier interpretations and evidence links follow from newest to oldest. No separate execution report format is required.

The entry's head timestamp is the date of the reviewed conclusion. Record the review outcome (changed or unchanged), the relevant identity revision, and links to supporting evidence directly in the natural-language item when useful. Repository commits can identify identity revisions; no mandatory YAML metadata or status field is added to the common entry syntax.

The record must retain evidence and its traceable provenance. A Reflection may explain how a specific event led to, challenged, or failed to change an identity conclusion in the ordinary report content; the event record remains in its Episode rather than being duplicated in mPFC. Project constraints may appear as evidence; they are not copied into identity merely because they were examined. SOUL preserves the current conclusion, which may start from a human-authored definition and later change through reviewed Reflection, not this rationale. When the conclusion is questioned, consult mPFC and its referenced evidence.

When the review concludes that identity is unchanged, the head should explicitly state that result and why; retain the earlier dated assessments and cited evidence. The effective identity revision may remain the same.

Use `reflection.template.md` as the minimal record shape.
