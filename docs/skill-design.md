# Skill design

> A skill for making skills: how to decide what deserves to become a reusable agent skill, what belongs inside it, and what should be left out.

This document is a design reference, not an always-on execution rule. It captures lessons from current agent systems and from this repository's own identity/reflection work.

Its central claim is simple:

> A good skill contains the smallest sufficient set of high-signal instructions that materially improves behavior for a recurring class of work.

A skill should not try to restate everything a capable model already knows. It should preserve the parts that are load-bearing.

## 1. What a skill is for

A skill is reusable, task-triggered behavioral knowledge.

It is appropriate when a recurring workflow benefits from one or more of the following:

- domain-specific procedure that is not reliably inferred from the task alone;
- repeated failure modes that need explicit correction;
- tool or environment usage that requires a stable sequence or contract;
- canonical validation or completion criteria;
- task-specific references, scripts, schemas, or examples that should be loaded only when relevant.

A skill is not a substitute for:

- **Soul** — durable identity;
- **Principles** — durable cross-project defaults distilled from repeated evidence;
- **project constraints** — hard requirements owned by the project doing the work;
- **task context** — facts and instructions specific to the current request;
- **general model capability** — knowledge or reasoning the model already performs reliably without instruction.

If information belongs to one of those layers, keep it there instead of copying it into a skill.

## 2. Design for progressive disclosure

Do not preload the whole manual.

A skill should expose only enough information for the agent to recognize when it is relevant, then reveal deeper material only when the task actually needs it.

A useful structure is:

```text
skill metadata
    |
    | enough to decide relevance
    v
SKILL.md
    |
    | core workflow and decisions
    v
optional references / examples / scripts
    |
    | loaded only when needed
    v
task execution
```

The main skill file should remain lean. Large examples, edge cases, source material, forms, schemas, and detailed references should normally live in linked files rather than being copied into the core instructions.

Prefer references to canonical project files over duplicated content. Duplicated instructions consume context and become stale.

## 3. Put instructions at the right altitude

A useful instruction sits between two failure modes.

Too specific:

```text
If A, do B.
If A and C, do D.
If A and C but not E, do F.
...
```

This turns the prompt into brittle program logic, increases maintenance cost, and prevents a capable model from adapting to cases that were not anticipated.

Too vague:

```text
Be thoughtful.
Use best practices.
Think critically.
Produce high-quality work.
```

These statements provide little new behavioral signal.

Prefer conditional, observable guidance:

```text
When a claim materially affects the result and can be verified, verify it.
If verification is unavailable, distinguish evidence from inference.
```

or:

```text
Do not accept a user's premise merely because the user proposed it.
Challenge it when there is a substantive contradiction, missing premise, or unsupported causal claim; otherwise continue without manufacturing disagreement.
```

The instruction should tell the model **when behavior must change and how** without attempting to enumerate every possible case.

## 4. Test whether an instruction is load-bearing

Before adding a sentence to a skill, ask:

1. If this sentence is removed, does agent behavior materially worsen?
2. Is it correcting a real or plausibly recurring failure, rather than stating something merely desirable?
3. Does it apply across the intended scope of this skill?
4. Is the behavior better enforced somewhere else — by a tool contract, type system, test, linter, script, schema, or project constraint?
5. Is it knowledge the model can already infer reliably from the current task and environment?
6. Does the instruction justify the attention budget it consumes?

If the answer to (1) is no, the sentence is probably honor information rather than an instruction.

If the answer to (4) is yes, prefer the external mechanism. Prompts should not duplicate enforcement that can be made deterministic.

If the answer to (5) is yes, omit it unless observed failures show that the reminder is actually necessary.

## 5. Add rules from evidence, not imagination

Do not try to design a complete skill in advance.

Start with the smallest workflow that can succeed. Run it on real work. Add or revise instructions when evidence shows a recurring failure, ambiguity, or missing boundary.

Good reasons to add an instruction include:

- the agent repeatedly makes the same wrong assumption;
- the agent uses the wrong source of truth;
- the agent stops before the task is actually complete;
- the agent repeatedly misuses a tool or interface;
- a domain-specific validation step is consistently omitted;
- different reasonable interpretations create an unacceptable correctness risk.

Weak reasons include:

- the sentence sounds professional;
- the rule is theoretically true;
- an edge case could conceivably happen once;
- the author wants to demonstrate methodological completeness.

A negative result matters too. If a suspected problem does not recur, or newer models handle it reliably without help, do not preserve the rule merely because it once seemed useful.

## 6. Keep task classification out of the skill unless routing itself is the skill

Do not begin by teaching the model a taxonomy such as:

```text
If this is coding, use coding mode.
If this is research, use research mode.
If this is product work, use product mode.
```

Capable models already infer much of this from context. Explicit taxonomies introduce an additional routing decision that can be wrong and encourage mechanical behavior.

A skill may define activation conditions because the runtime needs to know when the skill is relevant. That is different from asking the model to repeatedly classify the task after the skill has already been activated.

Once inside a skill, describe the behavior required for the work rather than restating a category name.

## 7. Avoid checklist inflation

Checklists are useful when every item is genuinely mandatory and independently easy to miss.

They become harmful when every good principle is converted into an obligatory preflight step:

```text
Before every answer:
- inspect assumptions;
- inspect priorities;
- inspect evidence;
- inspect uncertainty;
- inspect scope;
- inspect alternatives;
- inspect risks;
...
```

This creates ritual rather than judgment.

Prefer a smaller number of rules that naturally constrain behavior. Introduce an explicit checklist only when:

- omission has a material cost;
- every item applies to the skill's scope;
- completion can be observed;
- the list is more reliable than letting the model prioritize dynamically.

## 8. Separate knowledge, procedure, and evidence

A skill becomes easier to maintain when these are not mixed together.

### Core procedure

Keep the stable decisions and workflow in `SKILL.md`.

### Reference knowledge

Put long-lived domain material, schemas, examples, or external documentation in linked reference files.

### Executable enforcement

Use scripts, tests, validators, or tools for deterministic operations whenever possible.

### Evidence

Keep design rationale, experiments, failures, and rejected alternatives outside the runtime core. They may justify future revisions, but they do not need to consume context every time the skill runs.

This repository's Reflection model offers a useful analogy: evidence should support a durable change without being copied wholesale into the durable state.

## 9. Define completion by observable state

Avoid vague completion language such as:

```text
Make sure the result is good.
Review everything carefully.
Finish the task completely.
```

Prefer conditions that can be checked:

- tests pass;
- the requested artifact exists;
- the changed interface is exercised;
- the cited source actually supports the claim;
- the requested fields are present;
- unresolved uncertainty is explicitly identified.

A skill should distinguish between:

- **work performed**;
- **work verified**;
- **work inferred but not verified**.

Do not let a successful action call automatically imply task completion.

## 10. Preserve model agency where judgment is useful

A skill should constrain failure, not replace reasoning.

Do not prescribe an exact sequence merely because a sequence can be written down. Require order only where order affects correctness, safety, state, or reproducibility.

Prefer:

```text
Inspect the relevant implementation before editing it.
```

over:

```text
Always read files A, B, C, D, and E in that order before making any change.
```

Prefer just-in-time retrieval over loading every potentially relevant document up front.

As model capability improves, previously useful scaffolding may become counterproductive. Skills should therefore be periodically pruned, not only expanded.

## 11. Common anti-patterns

### Honor information

Statements that are admirable but do not materially change behavior.

Examples:

- be professional;
- think deeply;
- follow best practices;
- provide a high-quality result.

### Taxonomy as workflow

Teaching categories instead of giving useful behavioral constraints.

### Prompt as style guide archive

Copying large standards, documentation, or repository knowledge into the skill rather than pointing to canonical sources.

### Edge-case accumulation

Adding permanent rules for rare failures until the core workflow is buried.

### Always-read-everything

Forcing unrelated context into every run because it might someday matter.

### Personality in place of conditions

Using traits such as "be critical" or "be rigorous" where an observable decision rule would be clearer.

### Duplicate enforcement

Encoding in prose something already enforced by tests, schemas, types, permissions, or tooling.

### Completion by assertion

Allowing the agent to declare success without evidence that the requested state was reached.

### Historical scaffolding

Keeping instructions that compensated for an older, weaker model even after they cease to improve current behavior.

## 12. A compact authoring loop

Use this loop when creating or revising a skill:

```text
real task
   |
   v
observe failure / friction / repeated workflow
   |
   v
identify the smallest missing behavioral signal
   |
   v
place it at the correct layer
   |
   v
write the smallest sufficient instruction
   |
   v
run on real tasks
   |
   +--> improves behavior --> keep
   |
   +--> no material effect --> remove or rewrite
   |
   +--> creates rigidity/noise --> narrow, defer, or move to reference/tool
   |
   v
repeat
```

The skill itself is therefore a provisional model of practice, not a finished constitution.

## 13. Review questions

When reviewing a skill, ask:

- What recurring work is this skill actually responsible for?
- What would the model probably do correctly without this skill?
- Which instructions are truly load-bearing?
- Which instructions merely restate general competence or desirable behavior?
- Are any project-specific constraints leaking into reusable guidance?
- Are references being copied where they could be loaded just in time?
- Are rare edge cases dominating the common path?
- Are vague traits used where conditions and actions would be clearer?
- Can deterministic checks replace prose?
- Does the skill define what counts as verified completion?
- Has newer model capability made any old scaffolding unnecessary?

The goal is not the shortest possible skill. The goal is the **smallest sufficient skill**.

## Research basis

This document was distilled on 2026-09-30 from a comparative review of current agent instruction practices. The sources are references, not authorities; the principles above are the repository's synthesis.

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

## Repository boundary

This document is guidance for designing reusable skills.

It does not make skill instructions part of Soul or Principles, and it does not move project constraints into identity.

A pattern discovered while authoring or running skills may later become Reflection evidence. Only a durable cross-project tendency that survives review should be proposed as a Principle.
