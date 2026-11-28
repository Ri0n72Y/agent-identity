---
name: dependency-risk-testing
description: Design, review, or simplify tests and CI around production dependency risk. Use when writing regression tests, auditing test effectiveness, reviewing test doubles and refactoring coupling, removing redundant coverage, or selecting integration and acceptance checks.
---

# Dependency-risk testing

Keep tests that detect consequential defects in production behavior at a reasonable maintenance cost. Derive them from actual dependency risks and observable contracts. Explicit project verification requirements still apply.

## Trace the owned dependency

Inspect the actual production path before changing tests: owner, callers, consumers, contract, state, side effects, transformations, lifecycle, timing, and error propagation. Do not infer the path from test names or intended architecture.

Find the nearest boundary where a plausible defect becomes observable. Prioritize shared mutable state, converging inputs, fan-out, ordering, concurrency, cancellation, retries, persistence, representation changes, caching, and fail-closed decisions. Include ordinary behavior when it protects a consequential contract. A feature or historical bug alone does not justify another permanent test.

## Choose the smallest meaningful test

Keep the test near the responsible unit or dependency edge. If `A -> B -> C -> D` fails because of `B -> C`, test that contract; exercise the whole chain only when its composition introduces an independent risk.

Separate design method, scope, and execution cadence:

- **White-box:** Use implementation knowledge to identify local risks and invariants. Assert stable behavior through supported entry points; constrain implementation properties only when they are themselves necessary to the contract.
- **Black-box:** Derive cases from the contract using meaningful equivalence classes, boundaries, invalid inputs, transitions, or properties. Black-box testing does not imply E2E or large case counts.
- **Integration / E2E:** Exercise real dependency boundaries when a narrower test cannot establish their behavior. Test composition and runtime compatibility rather than repeating unit coverage.

Prefer observable results, state, persistence, errors, and consequential side effects. Assert outgoing requests, interaction counts, or ordering when these are part of a boundary contract (e.g. correct destination, no duplicate write). Avoid incidental internal calls and private-state assertions.

## Require discriminating evidence

Before adding or retaining a test, identify the contract, a plausible defect, the case that exposes it, and the observable failure. Reject tests that cannot distinguish the intended behavior from that defect.

- Execute the actual production logic under test. Derive expected results independently from the contract; do not copy the implementation, assert its source text, or preconfigure the result being claimed as evidence.
- Choose data for the risk it exposes. Verify relevant transformations, boundary values, relationships, state transitions, and failure effects. Do not freeze unrelated sample data, wording, formatting, or configuration. Assert exact values when the contract requires exactness.
- Prefer one coherent behavior per test. Combine equivalent cases where helpful; retain distinct cases when they protect independent failures. Keep setup, action, and assertions concise and readable without a fixture framework.
- For a regression or a questionable test, demonstrate the relevant failure when feasible: run against the defective implementation or temporarily inject a plausible fault. Confirm failure for the intended reason and success after restoration. Use targeted checks; do not mandate mutation tooling or scores. Never commit deliberate faults.

A behavior-preserving refactor should ordinarily leave tests unchanged. Investigate both harmless changes that break tests and consequential defects that pass them. Delete or rewrite change-detector tests that merely mirror production code.

## Preserve fidelity and encapsulation

Prefer a real, deterministic dependency; otherwise use a maintained, sufficiently faithful fake, then a minimal stub or mock where needed. Substitute only at genuine dependency ports. Keep the logic responsible for the claimed protection real.

A test double must preserve the contract relevant to the test. Verify consequential request contents, identity, and side effects where appropriate; a stub that returns success for any input cannot establish correct dispatch. Simulate failures at the correct boundary (including after a side effect when testing an uncertain outcome). Do not infer real dependency behavior from a substitute that performs the expected outcome itself.

Use supported entry points and normal initialization. Do not fabricate private state, invoke private orchestration, or rebuild an external runtime, browser, DOM, database, or scheduler merely to make tests pass. Do not add test-only hooks or production abstractions without an independent design reason.

If the necessary environment is unavailable, run meaningful local tests of owned logic and document the remaining integration or acceptance checks as unverified. Do not invent a simulated integration to claim real runtime, network, device, graphical, or model acceptance.

## Remove duplication and assign cadence

Audit existing tests when fixing bugs, changing contracts, or refactoring. Keep the nearest meaningful protection for each risk; remove or shrink checks that repeat it, protect obsolete behavior, or assert an invalid state that is now unrepresentable. Strengthen an existing case before adding another. Remove unused fixtures with their tests. Do not hide unchanged test complexity by combining cases solely to reduce the count.

- **Routine CI:** Fast, deterministic checks for structural risks and stable contracts; use controlled timing and isolated resources where feasible.
- **Dependency integration:** Real compatibility and composition checks at the frequency justified by their risks, costs, and change rate.
- **Release / acceptance:** Realistic full-flow, device, model, graphical, or production-like checks at appropriate gates, automated or manual as justified.

As a starting point for a balanced test portfolio, Google's rough guideline is about 80% narrow-scoped unit tests and 20% broader-scoped tests (roughly 15% integration and 5% end-to-end). Adapt the mix to the system's risks, architecture, and verification costs; the ratio is guidance, not a quota or acceptance criterion.

Cadence is independent of test design and scope. Preserve required verification gates. Do not impose test counts, coverage thresholds, pyramid ratios, or new CI orchestration without a separate project need.

## Review and verify

For each proposed or existing test, decide to keep, strengthen, simplify, remove, or move it to a more appropriate verification boundary. Base the decision on:

1. **Contract and risk:** Which production behavior and plausible failure does it protect?
2. **Discrimination:** Would the defect actually fail the test for the intended reason?
3. **Fidelity:** Does the relevant production logic execute, and do substitutes preserve the necessary contract?
4. **Stability and cost:** Would a harmless refactor break it? Is there already sufficient protection at a cheaper boundary?

Keep independent risk coverage; do not weaken assertions merely to restore green CI. When removing coverage that remains necessary, identify the replacement check or explicitly record the unverified risk. Run changed verification paths before claiming completion. Report checks not run and limits of the evidence. A passing suite, test count, or line coverage alone does not establish effectiveness.

## References

- Google Testing Blog: [Change-Detector Tests Considered Harmful](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html), [Increase Test Fidelity By Avoiding Mocks](https://testing.googleblog.com/2024/02/increase-test-fidelity-by-avoiding-mocks.html).
- Software Engineering at Google: [Unit Testing](https://abseil.io/resources/swe-book/html/ch12.html), [Test Doubles](https://abseil.io/resources/swe-book/html/ch13.html).
- Ham Vocke: [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html).
- Kent C. Dodds: [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details).
