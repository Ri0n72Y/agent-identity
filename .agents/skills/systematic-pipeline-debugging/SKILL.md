---
name: systematic-pipeline-debugging
description: "Use when a bug appears at the final output but data passes through multiple transformations. Locate the first stage where actual data diverges from the expected shape before changing final rendering."
---

# Systematic Pipeline Debugging

## Core Principle

Random fixes waste time and create new bugs. **Do not propose a fix before completing root-cause investigation.** Symptom fixes are failures.

## Iron Law

**No fix without root-cause investigation.** If Phase 1 evidence gathering is incomplete, do not propose any fix.

## Phase 1: Locate the Root Cause

### 1. Write the transformation chain

Before changing code, explicitly list the fixed path the data follows:

```text
raw input
→ parse / decode
→ normalize
→ semantic model
→ layout / transform
→ renderer input
→ framework / library conversion
→ final output
```

Do not skip intermediate stages just because they seem obviously correct.

### 2. Define the contract for each stage

For the failing datum, write down what each stage **should** contain:

```text
stage: parser-output
input:  "value = { a, b, c }"
expected output: { type: "assignment", name: "value", value: [...] }
```

### 3. Instrument the boundaries

Add one compact structured debug log per transformation boundary:

```ts
console.debug('[debug:pipeline]', {
  stage,
  id,
  input,
  output,
  length: output?.length,
  lastChar: output?.at(-1),
})
```

For string truncation bugs, also log the last few `charCodes` to distinguish **data already truncated** from **data intact but rendering hides it**.

### 4. Use one minimal reproduction

Reduce the failing input to the smallest case that preserves the bug. It must pass through the complete real pipeline, not a mocked path.

### 5. Find the first divergence

Compare actual output with expected output stage by stage:

```text
stage A ✓ → stage B ✓ → stage C ✓ → stage D ✗
```

Once the first divergence is identified, **stop investigating downstream symptoms** until that boundary is understood.

## Phase 2: Fix and Verify

### 6. Fix the narrowest responsible layer

The first layer that violates its contract owns the fix.

| First divergence | Fix layer |
|---|---|
| Parser output already wrong | Fix parser |
| Semantic data correct, renderer input wrong | Fix renderer lowering |
| Renderer input correct, third-party conversion wrong | Investigate / adapt around library conversion |

Do **not** tolerate bad data downstream. Do **not** compensate upstream for a downstream bug.

### 7. Circuit breaker

If 3 fix attempts fail, **stop fixing** and question the architecture. Pattern signals: each fix reveals new coupling or shared state; the fix requires a “large refactor”; the fix creates new symptoms elsewhere. Discuss architecture with a human partner instead of attempting fix #4.

### 8. Re-run all checkpoints after the fix

Complete only when:

- Every intermediate stage matches expectation.
- Final behavior is correct.
- Temporary debug instrumentation is removed or gated behind a debug switch.

## Safety Constraints

Debug logging must be temporary or gated behind a debug switch. **Never log** secrets, credentials, personal information, tokens, private customer data, or full production payloads. For sensitive data, log only structural information: `type`, `length`, `keys`, `hash`, first/last few safe characters.

## Red Flags

If any of these appear, return to Phase 1:

- “Let me quickly patch this first, then investigate.”
- “I think it is X, so I will change it and see.”
- “I do not fully understand it, but this might work.”
- Proposing a solution before tracing the data flow.

## Completion Criteria

A fix is complete if and only if:

1. The transformation chain is known, and each relevant stage has an expected shape.
2. The first divergent stage has been identified, and the fix is applied at that layer.
3. All intermediate outputs match expectations, the final output is correct, and debug instrumentation is cleaned up.
