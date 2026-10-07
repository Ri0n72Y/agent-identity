# Slow Reading for Large Language Models — Paper Plan

> Status: research plan, not manuscript prose
> Purpose: keep the research question, argument, evidence, experiment, and writing boundaries stable before drafting.
> Working title: **Slow Reading for Large Language Models: What Changes When the Model Cannot See the Future?**

## 1. Research question

The paper asks one primary question:

> **How does genuinely future-blind, incremental reading with persistent intermediate interpretations affect LLM understanding compared with reading a completed text?**

The study is about **slow reading**.

It is not primarily a paper about persistent identity, autobiographical memory, agent persona, or long-term memory. Those topics may appear as theoretical background or future work only where they help explain why an interpretation trajectory may matter.

The shortest version of the question is:

> **What changes when an LLM is forced to read without knowing the future?**

## 2. Central idea

Typical LLM reading gives the model a completed text and then asks for interpretation:

```text
T[1:n] -> interpretation
```

Human reading normally unfolds under a different information condition. At time `t`, later text is unavailable, provisional interpretations can form, unresolved gaps remain open, and later evidence may confirm or contradict earlier expectations.

The slow-reading protocol operationalizes this difference:

```text
reveal
  -> interpret
  -> commit
  -> reveal
  -> compare
  -> revise
  -> continue
```

The experiment tests whether this temporal constraint matters.

The paper does **not** assume that slow reading is better. It may improve interpretation, make no material difference, or introduce anchoring and other errors.

## 3. Claims and non-claims

### Claims the paper may establish

Only claim these if supported by the final experiment:

1. True future blindness changes some aspect of final interpretation relative to whole-text reading.
2. True future blindness changes the trajectory by which interpretations are formed.
3. True slow reading differs from simulated slow reading performed after the full text is already visible.
4. Particular trajectory features, such as prediction, revision, unresolved tension, or recovery from an early error, correlate with later comprehension or recall.

### Claims that require separate evidence

Do not silently upgrade these into conclusions:

- slow reading is generally superior;
- slow reading is more human;
- LLM cognition works by the same mechanism as human cognition;
- intermediate interpretations reveal the model's hidden chain of thought;
- historical cognition creates a persistent personality;
- preserving reading traces produces long-term agent identity;
- the protocol improves all reading tasks or all model families.

### Explicit non-claim

This paper does not make a claim about machine consciousness, subjective experience, or a metaphysical self.

## 4. Core experimental distinction

The study uses four conditions with pre-specified pairwise contrasts rather than treating them as a fully crossed factorial design.

| Condition | Future text | Persistent intermediate interpretation |
| --- | --- | --- |
| **Whole Reading** | visible as a completed text | no |
| **Chunked Reading** | hidden beyond the current segment | no |
| **Simulated Slow Reading** | visible | yes |
| **True Slow Reading** | hidden beyond the current segment | yes |

The key contrasts are:

1. **True Slow vs. Simulated Slow** — tests actual future visibility while keeping the segment schedule and persistent interpretive protocol as similar as possible.
2. **True Slow vs. Chunked** — tests persistent intermediate interpretation under future-blind segmented exposure.
3. **True Slow vs. Whole** — the main practical comparison against the conventional completed-text baseline; interpret cautiously because more than one procedural factor differs.

### Whole Reading

The complete text is available before interpretation.

### Chunked Reading

Text is revealed incrementally, but no durable interpretive state is committed between segments beyond the minimum context needed to continue.

### Simulated Slow Reading

The full text remains available while the model follows the same segment-by-segment interpretive procedure used in slow reading.

### True Slow Reading

Unrevealed future text is technically unavailable. After each segment, the model commits a compact provisional interpretation before the next segment is released.

## 5. Slow-reading trace

The protocol should preserve an auditable reading history without forcing every segment into an elaborate cognitive schema.

Base record:

```text
[date][document:run][time][segment]

evolution description
```

Recommended state after a segment:

```text
Current interpretation
Unresolved tension
Optional prediction
Confidence
```

After new evidence appears:

```text
What remained stable?
What changed?
What was contradicted?
What remains unresolved?
```

Rules:

- future material must not be available before reveal;
- earlier committed interpretations are append-only evidence;
- later interpretations may revise but must not rewrite earlier states;
- prediction is optional and should appear only when the text supports a meaningful expectation;
- raw hidden chain-of-thought is neither required nor treated as evidence.

## 6. Argument spine

The manuscript should preserve this short logical chain:

```text
Human reading is normally incremental
        |
        v
Incremental reading permits provisional interpretation,
uncertainty, prediction, contradiction, and revision
        |
        v
Typical LLM reading often begins with a completed text
        |
        v
Chunking, CoT, and iterative prompting reproduce only
parts of the temporal structure of reading
        |
        v
Future visibility is therefore a separable experimental variable
        |
        v
Compare Whole / Chunked / Simulated Slow / True Slow
        |
        v
Measure both final outcomes and interpretive trajectories
```

Every section should serve this chain.

## 7. Background map

Background is intentionally substantial. It is not a citation inventory.

Its purpose is to reconstruct how the research question emerges from several adjacent traditions, while keeping their evidence and assumptions distinct.

Readers interested mainly in implementation should be able to skip directly to the protocol section.

### 7.1 Incremental language comprehension and situation models

Question answered:

> Is human text understanding normally constructed over time rather than only after the completed text is available?

Use this literature as the strongest empirical basis for treating reading temporality as a real variable.

Relevant concepts:

- incremental language processing;
- situation models;
- online updating of event representations.

Do not infer that LLMs implement the same mechanism.

### 7.2 Gaps, ambiguity, suspense, and provisional interpretation

Question answered:

> What is lost when the reader never occupies a state of genuine uncertainty about later text?

Reader-response work, especially Iser's discussion of blanks or gaps, is useful as a description of reading phenomena.

Treat literary theory as phenomenological or interpretive evidence, not as a verified cognitive mechanism.

### 7.3 Prediction and prediction error

Question answered:

> Why can information received after a prediction have a different cognitive role from the same information received simultaneously?

Core distinction:

```text
new information
!=
new information that contradicts an earlier commitment
```

Prediction-error and memory-updating research motivates explicit, optional predictions in the trace.

Do not assume neural or biological mechanisms transfer directly to transformers.

### 7.4 Incomplete and wrong interpretations

Question answered:

> Are provisional misunderstandings merely noise, or can their later correction be informative about the reading process?

Use Good-Enough Processing and related work to motivate measuring:

- early hypotheses;
- anchoring;
- revision;
- failure to revise;
- recovery after contradiction.

The paper must allow slow reading to perform worse.

### 7.5 Retrieval, reconstruction, and historical interpretation

Conway's Self-Memory System and later work are useful for one narrow reason: current understanding can reorganize how earlier material is interpreted.

Engineering implication:

```text
evidence -> later interpretation
```

must remain distinguishable from:

```text
later interpretation -> rewrite old evidence
```

The experiment should therefore preserve earlier committed states.

Do not reproduce human memory limitations merely because they are human.

### 7.6 Reasoning about change

Habermas and autobiographical-reasoning work are relevant to the relation:

```text
interpretation A
    -> new evidence
    -> interpretation B
```

The useful object is the transition and its evidence, not a broad claim that identity or understanding is fundamentally narrative.

Use Strawson and other critiques as a counterweight against treating narrative coherence as a universal or inherently desirable property.

### 7.7 Existing LLM practice

Organize LLM related work by what part of the problem it already addresses.

#### Whole-context and long-context reading

Solves information availability.

Does not by itself preserve the temporal condition under which interpretations form.

#### Chunking and RAG

Solves context and retrieval constraints.

Chunking alone is not slow reading if previous interpretive commitments do not persist.

#### Chain-of-thought, reasoning, and self-refinement

Creates intermediate computational or textual states after input is available.

The key difference is that slow reading manipulates **what information exists at each state**, not merely how many reasoning steps are produced.

CoT faithfulness work is important here: explicit reasoning text must not be treated as privileged access to hidden internal computation.

#### Reflection and persistent-thought agents

Generative Agents, Reflexion, Think-in-Memory, and related systems show that language-form intermediate states can persist across inference steps and influence later behavior.

They provide technical precedent, but their primary question is usually task performance, experience reuse, or long-term agent behavior rather than incremental reading.

### 7.8 Missing comparison

End Background with the gap, not with a novelty slogan:

> Existing work separately studies incremental human comprehension, prediction and revision, long-context LLMs, chunking, iterative reasoning, and persistent agent memory. The central unresolved comparison for this paper is the effect of **actual future visibility** during reading.

The experiment therefore uses targeted contrasts among Whole, Chunked, Simulated Slow, and True Slow reading rather than claiming a fully crossed factorial design.

## 8. Paper outline and section contracts

### 1. Introduction

Must establish:

- reading is normally temporally constrained;
- common LLM evaluation often begins with a completed text;
- seeing the future and reasoning step by step are different variables;
- the paper tests this difference.

Must not:

- review the entire literature;
- claim that slow reading is superior;
- introduce long-term persona as a main problem.

### 2. Background: Reading as a Process

Must establish:

- why temporality, uncertainty, prediction, and revision are plausible variables;
- how different traditions describe or test different parts of the process;
- where theoretical assumptions diverge;
- which parts of existing LLM practice reproduce or omit these conditions;
- why the four-condition design and its pre-specified contrasts follow from this analysis.

May be longer than other conceptual sections if every subsection advances the research question.

Must not become a history of cognitive science or literary theory.

### 3. Slow Reading Protocol

Must define operationally:

- segmentation;
- reveal;
- future blindness;
- commit-before-continue;
- persistent trace;
- revision;
- auditability.

A reader should be able to implement the protocol without adopting the paper's theoretical interpretation.

### 4. Experimental Design

Must specify:

- corpus;
- segmentation policy;
- models;
- prompting held constant where possible;
- four conditions;
- randomization and run structure;
- contamination controls;
- replication;
- primary and secondary outcomes.

No result language belongs here.

### 5. Evaluation

Separate:

#### Outcome measures

Possible examples:

- factual comprehension;
- causal understanding;
- character or intention inference;
- thematic interpretation;
- delayed recall.

#### Process measures

Possible examples:

- hypothesis creation;
- prediction calibration;
- revision frequency;
- revision magnitude;
- unresolved tension;
- anchoring;
- recovery from contradicted hypotheses;
- confidence dynamics.

Predefine which measures are primary before running the final experiment.

### 6. Results

Organize around questions, not around every metric:

1. Does True Slow differ from Whole?
2. Does True Slow differ from Simulated Slow?
3. Which trajectory properties explain or accompany the differences?

Report negative results.

Do not turn trajectory richness into quality without evidence.

### 7. Discussion

Interpret the results against the Background.

Possible outcomes must remain open:

- future blindness materially changes final understanding;
- it changes process but not final answers;
- simulated slow reading approximates true slow reading;
- true slow reading produces beneficial revision;
- true slow reading mainly produces anchoring or other costs.

A short future-work paragraph may ask whether persistent reading histories later affect long-term cognitive style or agent continuity. Do not answer that question here.

### 8. Conclusion

Very short.

Return to the empirical question:

> Is reading a completed text equivalent to reading a text before its future is known?

## 9. Claim-evidence ledger

This ledger should be maintained before and during drafting.

Allowed status values:

- `supported`
- `partial`
- `planned`
- `unsupported`
- `contradicted`

| ID | Claim | Status | Evidence needed / source |
| --- | --- | --- | --- |
| C1 | Human language comprehension is substantially incremental. | supported | Incremental-processing and situation-model literature |
| C2 | Genuine future blindness permits provisional uncertainty and prediction that full-text access removes as an information condition. | supported as protocol logic; empirical consequence untested | Definition of conditions; avoid claiming behavioral effect yet |
| C3 | Chunking alone is equivalent to slow reading. | unsupported | This is a baseline question, not an assumption |
| C4 | Simulated slow reading is equivalent to true slow reading. | planned | Primary experiment |
| C5 | True slow reading changes final comprehension. | planned | Primary experiment |
| C6 | True slow reading changes interpretive trajectories. | planned | Primary experiment |
| C7 | Prediction/revision history improves later comprehension. | planned | Process/outcome analysis |
| C8 | Slow reading is generally better or more human. | unsupported | Do not claim |
| C9 | Explicit reading traces reveal hidden internal reasoning. | unsupported | Do not claim |
| C10 | Persistent slow-reading history creates persona continuity. | unsupported in this paper | Possible future work only |

## 10. Falsification and negative results

The study remains useful if the strong hypothesis fails.

Examples:

### No meaningful difference

If:

```text
True Slow ~= Whole ~= Simulated Slow
```

then future visibility may matter less than expected for the chosen tasks/models, or the protocol may not isolate a consequential mechanism.

### Chunking explains the effect

If:

```text
True Slow ~= Chunked
```

then segmentation rather than persistent interpretation may explain the result.

### Simulation is sufficient

If:

```text
True Slow ~= Simulated Slow
```

then explicit stepwise interpretation after full-text access may approximate the tested effects of genuine future blindness.

### Slow reading harms performance

If True Slow increases early anchoring or reduces final comprehension, report this directly.

The paper is about the effect of temporally constrained reading, not proving its superiority.

## 11. Implementation boundary

The paper, experiment skill, and DSH plugin should share a protocol but remain separate artifacts.

### Paper

Explains the question, prior work, experiment, and findings.

### Slow-reading experiment skill

Defines agent behavior during the experiment:

```text
read
-> stop
-> interpret
-> identify tension
-> optionally predict
-> commit
-> continue
-> compare
-> revise
```

### DSH plugin

Enforces conditions that should not depend on prompt obedience:

- text segmentation;
- future blindness;
- commit-before-next;
- append-only trace;
- run metadata and audit log.

The plugin is an experimental protocol executor, not a general memory or identity framework.

## 12. Writing workflow

Do not draft the manuscript linearly from Introduction to Conclusion.

Use:

```text
research question
    -> argument spine
    -> claim-evidence ledger
    -> section contracts
    -> verified protocol/method
    -> section drafts
    -> evidence audit
    -> cross-section coherence review
    -> prose/style pass
    -> abstract and title last
```

Results prose must wait for results.

Unknowns remain explicit rather than being filled by plausible language.

## 13. Starter literature map

This is a working map, not the final bibliography.

### Human reading and cognition

- Incremental language comprehension.
- Situation-model construction and updating.
- Good-Enough Processing.
- Prediction error and memory updating.
- Generation and retrieval effects where relevant.

### Interpretation and historical revision

- Wolfgang Iser on blanks/gaps — descriptive literary theory, not mechanism evidence.
- Martin Conway and colleagues on Self-Memory System, correspondence, and coherence — use selectively.
- Tilmann Habermas and colleagues on autobiographical reasoning and continuity through change — use selectively.
- Galen Strawson, *Against Narrativity* — counterweight to over-narrativization.

### LLM and agent systems

- Long-context utilization and Lost in the Middle.
- Chain-of-thought and reasoning.
- Self-Refine.
- CoT faithfulness / unfaithful explanations.
- Generative Agents.
- Reflexion.
- Think-in-Memory.
- Relevant long-term memory and dynamic-persona work only when it clarifies the boundary.

## 14. Paper quality rules

- One paper, one main question.
- Background may be rich, but every subsection must advance the main question.
- Distinguish experimental evidence, theoretical interpretation, phenomenological description, and engineering practice.
- Prefer direct primary sources for important claims.
- Never invent a citation, result, ablation, number, or novelty claim.
- Do not write a planned experiment as if it already ran.
- Do not equate local sentence polish with global coherence.
- Avoid generic AI-paper filler such as unsupported claims that a method is “more natural,” “human-like,” “robust,” or “comprehensive.”
- Let negative evidence change the paper.
