# Skill design

> A design reference for deciding what deserves to become a reusable agent skill, what belongs inside it, and what should be left out.

This document is not an always-on runtime prompt. It defines the design method from which a concrete skill-authoring skill may be derived.

Its central claim is:

> A good skill contains the smallest sufficient set of high-signal instructions that materially improves behavior for a recurring class of work.

The goal is not minimum length. The goal is minimum sufficient structure.

## 1. Put knowledge at the correct layer

A skill is reusable, task-triggered behavioral knowledge.

Use a skill when recurring work needs behavior that is not reliably supplied by the task alone, such as a domain-specific procedure, a repeated failure correction, a stable tool contract, reusable reference material, or observable completion criteria.

Do not use a skill as a substitute for:

- **Soul** — durable identity;
- **Principles** — durable cross-project defaults distilled from repeated evidence;
- **project constraints** — hard requirements owned by the project;
- **task context** — facts and instructions specific to one request;
- **general model capability** — behavior the model already performs reliably without extra instruction.

References inside a skill should therefore be reusable across instances of that skill. A file, PR, requirement, or fact that belongs only to the current task remains task context.

If a behavior can be enforced more reliably by a type, schema, test, validator, permission, script, or tool contract, prefer that mechanism over prompt prose.

## 2. Optimize context loading

Do not preload everything that might become relevant, but do not split material merely because progressive disclosure is available.

Choose between inline context and deferred retrieval by effective runtime cost.

Keep material inline when it is small, load-bearing for the common path, and likely to be needed on most runs. Splitting such material can add tool calls, cache misses, latency, and retrieval failure modes without saving meaningful context.

Defer material when it is large, infrequently needed, or only relevant to narrower branches of the workflow.

One common deferred shape is:

```text
skill metadata
    |
    | enough to decide relevance
    v
SKILL.md
    |
    | common-path workflow and decisions
    v
references / examples / scripts
    |
    | loaded when needed
    v
task execution
```

The exact file layout is runtime-specific; the principle is not.

The objective is the smallest **effective** runtime context, not the smallest individual file.

Prefer links to canonical sources over duplicated copies when deferred retrieval is actually beneficial. Duplicate knowledge still consumes context and drifts out of date.

## 3. Write instructions at the right altitude

A useful instruction tells the model **when behavior must change and how**, without replacing reasoning with a miniature program.

Avoid instructions that are too vague to alter behavior:

```text
Be rigorous.
Think deeply.
Use best practices.
Produce high-quality work.
```

Avoid instructions that enumerate cases the model can handle through judgment:

```text
If A, do B.
If A and C, do D.
If A and C but not E, do F.
```

Prefer conditional, observable rules:

```text
When a claim materially affects the result and can be verified, verify it.
If verification is unavailable, distinguish evidence from inference.
```

Do not add an explicit task taxonomy merely because tasks can be categorized. Add routing rules only when observed routing failures show that explicit routing materially improves behavior.

Likewise, do not turn every desirable property into a mandatory checklist. Use a checklist only when each item is independently easy to omit, materially important, broadly applicable to the skill, and observably complete.

A skill should constrain known failure modes while preserving model judgment where judgment is useful. Require a fixed sequence only when order affects correctness, safety, state, or reproducibility.

## 4. Keep only load-bearing instructions

Before retaining an instruction, test whether it earns its place.

An instruction is load-bearing when removing it materially worsens behavior within the intended scope.

Useful evidence includes repeated failures, a stable ambiguity, a recurring tool mistake, an omitted validation step, premature completion, or another correctness risk that the task itself does not reliably resolve.

An instruction is a weak candidate when it merely sounds desirable, restates general competence, protects against a speculative one-off edge case, duplicates deterministic enforcement, or repeats information available from a canonical source.

Do not preserve historical scaffolding by default. A rule that helped an older model may become noise for a newer one.

Negative evidence matters: if removing a rule does not materially worsen real executions, narrow it, move it out of the runtime core, or delete it.

## 5. Let skills evolve from practice

Do not try to derive a complete skill from theory before it has been used.

Start with the smallest workflow that can succeed. Run it on real tasks. Observe where execution fails, becomes ambiguous, wastes attention, or reaches an unverifiable conclusion.

Then make the smallest change that addresses the observed problem.

```text
real task
   |
   v
observe failure / friction / repeated workflow
   |
   v
identify the missing behavioral signal
   |
   v
place it at the correct layer
   |
   v
add the smallest sufficient change
   |
   v
run again
   |
   +--> materially improves behavior --> keep
   |
   +--> no material effect --> remove or revise
   |
   +--> creates rigidity or noise --> narrow, defer, or move elsewhere
   |
   v
repeat
```

The skill is therefore a provisional model of practice, not a finished constitution.

Its own rules remain subject to empirical revision.

## 6. Define completion by observable state

A skill should make completion distinguishable from activity.

Avoid instructions such as:

```text
Review carefully.
Make sure everything is correct.
Finish completely.
```

Prefer states that can actually be checked: a requested artifact exists, a relevant test passes, a changed path is exercised, a cited source supports the claim, required fields are present, or unresolved uncertainty is explicitly identified.

Keep these states distinct:

- work performed;
- work verified;
- work inferred but not verified.

A successful tool call, code edit, search, or draft is evidence of activity, not automatically evidence that the task is complete.

## 7. Separate runtime guidance from its evidence

The runtime core should contain only the instructions needed to perform the recurring work.

Research, design rationale, experiments, rejected alternatives, historical failures, and source comparisons are valuable evidence for maintaining the skill, but they do not need to consume runtime context.

For this document, that evidence lives in [skill-design-research.md](./skill-design-research.md).

This repository's Reflection model provides the same boundary at a higher level: evidence may justify a durable change without being copied wholesale into durable state.

## Repository boundary

This document guides reusable skill design. It does not make skill instructions part of Soul or Principles, and it does not move project constraints into identity.

A pattern observed while authoring or running skills may become Reflection evidence. Only a durable cross-project tendency that survives review should be proposed as a Principle.
