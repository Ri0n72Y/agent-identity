# Effective testing — research and design rationale

Research synthesis, 2026-11-28. Evidence and design judgments are separated here. This is an on-demand reference for reviewing the skill, not a second set of runtime instructions.

## Primary sources

| Source | Contribution |
| --- | --- |
| [Google: Change-Detector Tests Considered Harmful](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html) | Tests that merely mirror production code can fail on intentional changes without detecting defects. |
| [Google: Increase Test Fidelity By Avoiding Mocks](https://testing.googleblog.com/2024/02/increase-test-fidelity-by-avoiding-mocks.html) | Prefer real implementations, then fakes, then mocks, balancing fidelity with feasibility. Custom substitutes need maintenance and contract fidelity. |
| [Software Engineering at Google: Unit Testing](https://abseil.io/resources/swe-book/html/ch12.html) | Stable public behavior, clear expectations, DAMP, readable tests, and a predominance of narrow tests. |
| [Software Engineering at Google: Test Doubles](https://abseil.io/resources/swe-book/html/ch13.html) | Fidelity of doubles, trade-offs between state and interaction verification, and realistic substitute boundaries. |
| [Software Engineering at Google: Testing Overview](https://abseil.io/resources/swe-book/html/ch11.html) | A rough portfolio mix of 80% unit, 15% integration, 5% end-to-end. The figures are guidance. |
| [Ham Vocke: The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) | Test layering, consumer contracts, avoiding redundant verification, and the role of exploratory testing. |
| [Kent C. Dodds: Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) | Observe behavior from a consumer's perspective; reduce false positives and false negatives from implementation coupling. |

## Community skill comparison

Selected repositories were active when inspected. Repository stars or installation counts are not evidence that a particular rule is effective.

- [Matt Pocock: TDD](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd) — stable seams, independent expectations, and vertical slices instead of batches of speculative tests. Adopt the design principles; do not require approval of every seam or a mandatory TDD cycle.
- [Superpowers: TDD and Writing Good Tests](https://github.com/obra/superpowers/tree/main/skills/test-driven-development) — name the break, exercise real logic, preserve dependency side effects, inspect the requests, and consider plausible mutations. Adopt the discriminating checks; reject the blanket requirement to test every new method, always test first, or discard useful implementation because of development order.
- [Anthropic: Testing Strategy](https://github.com/anthropics/knowledge-work-plugins/tree/main/engineering/skills/testing-strategy) — match test types to components and concentrate on consequential behavior. Adopt component-specific examples without requiring every type or coverage target.
- [Trail of Bits: Property-Based Testing](https://github.com/trailofbits/skills/tree/main/plugins/property-based-testing/skills/property-based-testing) and [Mutation Testing](https://github.com/trailofbits/skills/tree/main/plugins/mutation-testing/skills/mutation-testing) — useful properties, tautology, vacuity, and equivalent mutants. Adopt those reasoning techniques without mandatory tooling or campaigns.
- [Wshobson: JavaScript Testing Patterns](https://github.com/wshobson/agents/tree/main/plugins/javascript-typescript/skills/javascript-testing-patterns) — framework-specific examples are useful when implementing a chosen technique. A general skill should not prescribe its example coverage thresholds or private-state and mock patterns.

## Practice-derived design decisions

Earlier dependency-oriented research and subsequent test audits showed recurring failure modes:

- Tests that fabricate private service state may pass while actual initialization or dependency registration is broken. They can also fail after a harmless internal reorganization. Select a stable supported boundary, which may contain several functions.
- A large simulated DOM or runtime can cause widespread failures when its own matcher or fixture changes. Conversely, unconditional stub responses can allow wrong message text, missing revision parameters, or a wrong operation to pass. Keep substitutes small, observe relevant requests independently, and validate real integrations in their own environment.
- A transport timeout before an effect and loss of the response after an effect imply different recovery behavior. Test the relevant failure boundary rather than asserting a preselected error label.
- Real persistence, concurrent writes, cancellation, routing identity, and duplicate effects can have independent risks even in a small system. Retain their protection regardless of suite size.

These observations support risk analysis as a case-selection technique, not a restriction on what behavior is worth testing. White-box and black-box describe case-design methods; they do not fix test scope or execution cadence. Neither test count nor coverage is an independent measure of engineering value.

## Decisions and limits

The skill uses a value-based admission decision before case selection. It permits fixed, independently checked test data and some repeated setup (DAMP), while removing redundant protection and brittle implementation assertions. It permits interaction checks when the interaction is a meaningful external effect, and static checks for independently justified structural constraints.

The skill recommends incremental development and test-first feedback when useful without imposing mandatory TDD. Targeted fault checks are evidence of discrimination, not proof of total coverage; equivalent mutations, unrelated failures, and test setup errors require interpretation. It does not require exhaustive mutation runs.

Real integration evidence takes precedence over an elaborate substitute. When the real environment is unavailable, local evidence and remaining risks must be separated. A small useful integration test can be cheaper than maintaining a fake. The suggested Google ratio is a starting heuristic rather than a quota.

The lifecycle and scoped audit rules address AI-generated test accumulation: adding tests is inexpensive relative to long-term maintenance. Review only affected behavior during ordinary changes; expand the audit when requested or when evidence shows systemic problems. The instruction design is based on comparative reading and engineering observations; no controlled agent evaluation has yet established its effectiveness.

Revisit these decisions if behavior-preserving changes repeatedly break tests, important faults escape them, substitutes drift from real contracts, or verification costs change. Do not load this reference by default.
