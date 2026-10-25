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

- **Core** — the universal method for investigating reality, prioritizing contradictions, acting, and revising judgments;
- **Soul** — durable identity;
- **Principles** — durable cross-project defaults distilled from repeated evidence;
- **project constraints** — hard requirements owned by the project;
- **task context** — facts and instructions specific to one request;
- **general model capability** — behavior the model already performs reliably without extra instruction.

Operational references inside a skill should be reusable across its executions. A file, PR, requirement, or fact needed only for a current task belongs in task context, not runtime guidance. A historical task or PR may instead be documented in a dated provenance archive when its evidence is necessary to recover why a reusable instruction was chosen; that archive is not loaded for ordinary execution.

A skill should add task-specific guidance beyond the [universal Core](../../../../core/CORE.md), not duplicate its general methodology as a checklist. The Core is a methodological starting point; a proposed instruction still needs evidence that it improves this recurring task.

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

The diagram concerns operational references. Historical research archives do not belong to the ordinary task-loading path.

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

An instruction is load-bearing when removing it materially worsens behavior within the intended scope. Assess this against concrete tasks, outcomes, and plausible counterexamples, not only a persuasive source or the author's preference.

Useful evidence includes repeated failures, a stable ambiguity, a recurring tool mistake, an omitted validation step, premature completion, or another correctness risk that the task itself does not reliably resolve.

An instruction is a weak candidate when it merely sounds desirable, restates general competence, protects against a speculative one-off edge case, duplicates deterministic enforcement, or repeats information available from a canonical source.

Do not preserve historical scaffolding by default. A rule that helped an older model may become noise for a newer one.

Negative evidence matters: if removing a rule does not materially worsen real executions, narrow it, move it out of the runtime core, or delete it.

## 5. Let skills evolve from practice

Do not try to derive a complete skill from theory before it has been used.

Start from the available concrete tasks and evidence. Where a dominant failure or friction is evident, prioritize it rather than trying to fix every possible weakness at once. For a new skill, act on the best available evidence and test the provisional design in practice.

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

The skill is therefore a provisional model of practice, not a finished constitution. Practitioner feedback is useful evidence, not an unquestioned rule: compare reports with artifacts, outcomes, and counterexamples.

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

## 7. Preserve the derivation, not just the compressed result

A skill is compressed operational knowledge. Its metadata identifies **when** to activate it; its runtime core contains the smallest sufficient **decisions and workflow** that change recurring behavior. Compression is intentionally lossy: it omits the observations and arguments used to derive those instructions.

The discarded material can still be valuable. A durable rule is easier to review when a future maintainer can recover **why it was chosen, what alternatives were rejected, which sources supported or contradicted it, and under what conditions it was expected to work**. Missing provenance must not prevent correction when current practice disproves a rule.

Keep two kinds of supporting material distinct:

- **Operational references:** schemas, examples, domain details, or procedures needed for some executions. Link or load them conditionally when they improve those executions.
- **Provenance / research archives:** dated questions, source links, comparisons, practical failures, rejected hypotheses, and decisions behind a skill. They support *re-examination* of the skill, not its normal execution. Store them in the skill's `references/` when skill-specific, or under `docs/` for cross-skill design rationale. They need not be linked from `SKILL.md`.

An archive is not a shadow runtime prompt or proof that the old decision remains valid. Distinguish observations from interpretations and unresolved assumptions; point to canonical primary sources rather than duplicating them indiscriminately. When new practice contradicts the archive's rationale, update the skill instead of defending the archived conclusion. Preserve enough context to challenge the rule, without copying every conversation or making archival work mandatory for a trivial skill revision.

For this design guide, the wider evidence lives in [research-history.md](./research-history.md). The [dependency-risk-testing research history](../../dependency-risk-testing/references/research-history.md) illustrates retaining domain-specific reasoning outside the runtime skill.

This repository's Reflection model provides the same boundary at a higher level: evidence may justify a durable change without being copied wholesale into durable state.

## Repository boundary

This document guides reusable skill design. It does not make skill instructions part of Soul or Principles, and it does not move project constraints into identity.

A pattern observed while authoring or running skills may become Reflection evidence. Only a durable cross-project tendency that survives review should be proposed as a Principle.
