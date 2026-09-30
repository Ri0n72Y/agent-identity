# Skill design research notes

> Evidence and comparative notes behind [skill-design.md](./skill-design.md).

This file is not runtime guidance. It records the observations that motivated the current skill-design principles so those principles can later be challenged, revised, or removed without carrying the full research history into every execution.

Distilled on 2026-09-30.

## Research question

How should reusable agent skills be written so that they improve behavior without becoming large, rigid prompt frameworks that duplicate model capability or consume unnecessary context?

The comparison focused on both positive patterns and failure modes across current agent instruction systems.

## Cross-source observations

### Small, high-signal context is preferable to accumulated scaffolding

Anthropic's context-engineering guidance frames context as a limited attention budget and recommends finding the smallest set of high-signal tokens sufficient for the desired behavior.

OpenAI's recent Codex prompting guidance reaches a related conclusion from a different direction: instructions accumulated for weaker models can become unnecessary or counterproductive as model capability improves. It recommends revisiting old scaffolding instead of treating it as permanent.

**Design implication:** skill size should be justified by behavioral effect, not by methodological completeness.

### Progressive disclosure is useful when retrieval saves more than it costs

Anthropic's Agent Skills design uses progressive disclosure: expose enough information to identify and use a skill, then load deeper references only when needed.

This contrasts with older memory-bank patterns that required agents to load a broad fixed set of documents before every task.

The core-authoring dogfooding added an important qualification: deferred retrieval itself has a cost. A small reference that is load-bearing and needed on nearly every run may be cheaper and more reliable inline, especially when a separate read creates another tool call, cache miss, latency boundary, or retrieval failure mode.

**Positive lesson:** defer large or infrequently needed material when doing so reduces effective runtime context.

**Negative lesson:** neither "always read everything first" nor "always split references out" should become a ritual. Optimize the whole execution path, not the apparent cleanliness of the file tree.

### Instructions need the right level of abstraction

Anthropic's context-engineering work warns against both overly specific prompt logic and overly vague guidance.

Specific-vs-general Constitutional AI research likewise suggests that general principles can guide broad behavior while more specific principles are useful where finer control is actually needed.

**Design implication:** instructions should normally describe observable conditions and behavioral changes, rather than either generic virtues or exhaustive case trees.

### Persistent rules should come from observed failures

Cursor and GitHub Copilot guidance both favor focused, scoped instructions and caution against turning general best practices, full style guides, or rare edge cases into persistent context.

Their practical recommendation is close to an empirical maintenance loop: add instructions where repeated agent behavior demonstrates the need.

**Design implication:** a theoretically correct statement is not sufficient reason to make it permanent runtime guidance.

### Deterministic enforcement should not be duplicated in prose

Across coding-agent environments, tests, types, schemas, tool contracts, and repository-native automation provide stronger enforcement than natural-language reminders when the behavior is deterministic.

**Design implication:** prompts should carry judgment and non-deterministic behavioral guidance; deterministic constraints should live in deterministic mechanisms when possible.

### Completion needs evidence

Coding-agent prompts commonly include explicit completion and verification boundaries because agents can confuse performing an action with reaching the requested state.

A successful edit, tool invocation, or plausible-looking answer is not itself proof of completion.

**Design implication:** reusable skills should define observable completion where the domain has a meaningful completion state.

### Stronger models justify less ritual, not no structure

SWE-agent demonstrates one extreme: a very small system prompt can still support substantial software-engineering work when the environment and task provide the necessary context.

At the same time, OpenAI and Anthropic both retain explicit behavioral constraints where they materially shape correctness.

**Design implication:** do not infer that "minimal" means "empty." Keep instructions that are genuinely load-bearing.

## Negative patterns observed

These patterns were useful during research because they reveal how skill prompts tend to grow.

### Taxonomy as workflow

A prompt enumerates task categories and assigns each a thinking mode even when the model can infer the relevant behavior from context.

Risk: adds a routing decision that can itself be wrong and encourages mechanical execution.

### Checklist inflation

Every good principle becomes a mandatory preflight item.

Risk: judgment is replaced by ritual; attention is spent proving that the checklist was visited rather than solving the task.

### Honor information

The prompt accumulates statements such as "be rigorous," "think deeply," or "use best practices."

Risk: text sounds desirable but adds little observable behavioral signal.

### Prompt as archive

Long standards, examples, source material, and project documentation are copied into the runtime prompt.

Risk: duplication, stale knowledge, larger context, and weaker source-of-truth boundaries.

### Edge-case accumulation

A rare failure becomes a permanent universal rule.

Risk: common-path behavior is gradually buried under exceptions.

### Historical scaffolding

Instructions originally added to compensate for an older model remain indefinitely.

Risk: a useful guardrail becomes needless rigidity or context noise.

### Completion by assertion

The agent is allowed to treat a successful action as proof that the objective was achieved.

Risk: unfinished or unverified work is reported as complete.

## Dogfooding result: 2026-09-30

The first version of `skill-design.md` reproduced several of the failure modes it described.

It had:

- a dedicated anti-pattern section that repeated earlier principles;
- an 11-item review checklist after warning against checklist inflation;
- both a runtime-like procedure and a full research bibliography in the same document;
- an ambiguous reference to "task-specific references" even though task-specific facts were assigned to task context;
- a model-capability-dependent justification for avoiding task taxonomies.

The self-review led to the following changes:

- collapsed repeated anti-patterns into their corresponding design principles;
- removed the large review checklist;
- changed "task-specific references" to reusable skill references and kept one-off facts in task context;
- replaced "capable models already infer this" with an evidence-driven rule: add routing only when observed failures justify it;
- marked the `SKILL.md` layout as one common implementation shape rather than a universal definition;
- separated research evidence into this file.

This dogfooding result is itself evidence for a broader lesson:

> Even when authors explicitly value concise prompts, useful observations naturally accumulate into permanent sections unless the prompt is periodically reviewed for duplicated behavioral signal.

## Dogfooding result: core-authoring single-file revision

The first `core-authoring` candidate followed progressive disclosure mechanically by moving its philosophical interpretation into `references/methodology.md`.

In practice, that interpretation was not optional background. It was required to correctly judge whether a Core rewrite still preserved investigation, concrete contradiction analysis, the mass-line structure, critical-but-non-performative disagreement, and the practice/knowledge loop.

Loading it separately therefore created likely recurring retrieval overhead without meaningful context savings.

The skill was changed back to a single self-contained `SKILL.md`.

This produced a new design principle:

> Progressive disclosure is a context-cost optimization, not a file-organization virtue. Inline small, load-bearing material that the common path usually needs; defer material when the expected context savings outweigh retrieval cost and failure risk.

## Sources

- OpenAI, *Rethinking skills and prompts for GPT-6 Astra*  
  https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra
- Anthropic, *Effective context engineering for AI agents*  
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic, *Equipping agents for the real world with Agent Skills*  
  https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- GitHub Docs, *Optimizing your AI usage to maximize efficiency and reduce cost*  
  https://docs.github.com/en/copilot/tutorials/optimize-ai-usage
- GitHub Docs, *About customizing GitHub Copilot responses*  
  https://docs.github.com/en/copilot/concepts/prompting/response-customization
- Cursor Docs, *Rules*  
  https://cursor.com/docs/rules
- SWE-agent, default agent configuration  
  https://github.com/SWE-agent/SWE-agent/blob/main/config/default.yaml
- Kundu et al., *Specific versus General Principles for Constitutional AI*  
  https://arxiv.org/abs/2310.13798
