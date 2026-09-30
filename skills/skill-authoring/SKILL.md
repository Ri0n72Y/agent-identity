---
name: skill-authoring
description: Design, extract, refactor, or review reusable agent skills. Use when deciding what belongs in a skill, writing or simplifying SKILL.md instructions, separating runtime guidance from references and task context, or evaluating whether skill rules are actually load-bearing.
---

# Skill authoring

Create the smallest sufficient reusable skill for the recurring work.

## Scope the skill correctly

A skill is a reusable, task-scoped package of instructions and resources that materially improves a recurring class of work.

Keep one-off facts, files, PRs, requirements, and current-request instructions in task context rather than copying them into the skill.

Keep durable identity in Soul, cross-project defaults in Principles, and project-owned hard requirements in project constraints.

When a behavior can be enforced more reliably by a type, schema, test, validator, permission, script, or tool contract, prefer that mechanism over prompt prose.

## Make activation discoverable

Metadata should identify the recurring work and the conditions that make the skill relevant.

Use enough specificity for reliable routing, but do not reproduce the skill procedure in the description.

Do not add a task taxonomy unless observed routing failures show that explicit routing materially improves behavior.

## Optimize context loading

Keep the runtime core focused on the common path.

Use progressive disclosure when deferred material is not normally required and the saved context outweighs the cost of retrieving it later.

Keep material inline when it is small, load-bearing for ordinary execution, and likely to be needed on most runs. Avoid splitting content merely to achieve a cleaner file hierarchy if doing so adds an extra tool call, cache miss, or retrieval failure mode without enough context savings.

Move large or infrequently needed domain knowledge, examples, schemas, edge cases, and supporting scripts into references or other resources that can be loaded when needed.

Prefer canonical sources over duplicated copies.

## Write load-bearing instructions

Write instructions that tell the model when behavior must change and how.

Avoid vague traits such as "be rigorous" or "use best practices."

Avoid exhaustive case trees when model judgment can handle the variation.

Do not turn every desirable property into a checklist. Use a checklist only when omission is materially costly, each item broadly applies, and completion is observable.

Preserve model judgment unless fixed ordering is required for correctness, safety, state, or reproducibility.

Retain an instruction only when removing it would materially worsen behavior within the skill's scope.

## Evolve from evidence

Start with the smallest version that can succeed.

Add or revise rules when real executions reveal a repeated failure, stable ambiguity, tool misuse, omitted validation step, premature completion, or another material correctness risk.

If a rule has no material effect, creates rigidity, duplicates another enforcement mechanism, or compensates for behavior the current model now handles reliably, narrow it, move it out of the runtime core, or remove it.

Treat negative results as evidence too.

## Define verification when it is meaningful

When the work has a meaningful completion or verification boundary, define it in observable terms.

Distinguish work performed, work verified, and work inferred but not verified.

Do not treat a successful tool call, edit, search, or draft as proof that the requested state was reached.

## References

Read [../../docs/skill-design.md](../../docs/skill-design.md) when design rationale or layer placement is ambiguous.

Read [../../docs/skill-design-research.md](../../docs/skill-design-research.md) only when evaluating or revising the methodology itself.
