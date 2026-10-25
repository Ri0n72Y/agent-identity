---
name: paper-writing
description: Plan, draft, revise, or review a research paper while keeping claims traceable to evidence and the manuscript centered on one research question. Use for academic paper outlines, section drafting, related-work synthesis, claim/evidence audits, experiment writeups, cross-section coherence review, and final prose revision.
---

# Paper writing

Build the argument before the prose.

A research paper should communicate one central research idea through claims that are proportionate to evidence. Writing may reveal problems in the research, but polished language must never substitute for missing evidence.

## Start from the research question

Before drafting a section, identify the paper's current:

- research question;
- central idea;
- argument spine;
- scope and explicit non-claims;
- evidence already available;
- evidence still planned or missing.

When the project already has a paper plan, treat it as the local source of truth for these items.

Do not silently broaden the paper because adjacent theory, experiments, or applications are interesting.

## Maintain a claim-evidence ledger

For each material claim, keep its evidence state explicit.

Use a small vocabulary such as:

- `supported`;
- `partial`;
- `planned`;
- `unsupported`;
- `contradicted`.

A claim may be written as a result only when the available evidence supports it.

Planned experiments remain plans. Predictions remain predictions. Author-reported facts remain author-reported unless independently verified.

When evidence weakens, narrow the claim before adding rhetoric.

## Give each section a contract

Before prose, state what the section must establish and what it must not claim.

A section contract should answer:

- What question does this section resolve for the reader?
- Which claims and evidence belong here?
- What must the reader understand before moving on?
- Which tempting adjacent topics are out of scope?

Do not draft to a word count. Draft until the contract is satisfied.

## Synthesize background and related work

Do not write a citation inventory.

Organize prior work around the problem, assumptions, evidence, and unresolved comparison relevant to the paper.

When fields use different kinds of evidence, keep them distinct. For example:

- controlled empirical evidence;
- theoretical models;
- phenomenological or interpretive descriptions;
- engineering practice;
- community observations.

A useful analogy is not mechanism proof.

A prior paper's framing is not automatically this paper's framing.

Background should make the research question feel necessary, not merely well referenced.

## Draft from evidence outward

Prefer this order when possible:

```text
evidence / method
    -> claim
    -> paragraph purpose
    -> prose
```

Do not write confident prose first and search for support afterward.

When a needed source is missing, mark the gap and retrieve or verify it before finalizing the claim.

Prefer primary sources for important factual or scientific claims.

Never fabricate citations, bibliographic details, quotations, experiments, numbers, baselines, ablations, or results.

## Keep reasoning claims auditable

Distinguish:

- what was observed;
- what was measured;
- what was inferred;
- what is a theoretical interpretation;
- what remains unknown.

Use verbs proportionate to evidence.

Use stronger verbs such as `shows` or `demonstrates` only when the evidence directly supports the claim.

Use weaker formulations such as `suggests`, `supports`, `is consistent with`, or `motivates` when evidence is indirect or partial.

Do not turn correlation into causation through wording.

## Treat model-generated reasoning carefully

Do not treat chain-of-thought, self-explanation, reflection text, or other generated rationales as privileged access to hidden internal computation.

They may be experimental outputs, commitments, or observable traces when the study defines them that way.

Describe them according to what was actually recorded and tested.

## Preserve the difference between method and result

Methods describe what was designed, implemented, controlled, and measured.

Results describe what actually happened.

Do not use result language in a method section for experiments that have not run.

Do not describe a successful tool call, completed generation, or plausible output as validation of a scientific hypothesis.

## Review global coherence

After local drafting, review the manuscript as one argument.

Check:

- every section advances the same research question;
- terminology remains stable;
- Background leads naturally to the experimental comparison;
- Methods actually test the stated question;
- Results answer the questions Methods made measurable;
- Discussion does not claim more than Results support;
- Conclusion does not introduce a stronger thesis than the paper established.

Strong local paragraphs do not guarantee a coherent paper.

## Revise prose only after structure is stable

Use the final prose pass to improve clarity, precision, rhythm, and economy.

Prefer direct statements over generic academic filler.

Avoid unsupported prestige language and stock phrases such as claims that work is automatically novel, comprehensive, human-like, robust, or transformative.

Do not imitate a venue's surface style at the expense of the paper's actual argument.

A longer section is acceptable when it carries necessary reasoning. A shorter paper is preferable when additional prose adds no evidence or inference.

## Write title and abstract late

Finalize the title and abstract only after the argument, methods, and results are stable.

The abstract must reflect the paper that exists, not the paper that was planned.

Do not report unrun experiments or desired outcomes in past tense.

## Define completion observably

A paper section is ready for review when:

- its contract is satisfied;
- material claims are traceable to evidence or explicitly marked as unresolved;
- citations support the claims they are attached to;
- planned and completed work are distinguishable;
- the section does not exceed the paper's scope.

A manuscript is not complete merely because every heading contains prose.

## References

Read [../skill-authoring/references/design-rationale.md](../skill-authoring/references/design-rationale.md) when deciding whether a writing rule belongs in this reusable skill or in a project-specific paper plan.
