---
name: effective-testing
description: Design, write, review, simplify, and run effective software tests. Use when implementing or fixing behavior, choosing test cases or test doubles, reviewing existing tests, reducing test debt, or deciding test scope, integration checks, and CI strategy.
---

# Effective testing

## Purpose and value

Tests should increase confidence in software correctness and reduce the cost of changing software. Treat test code as maintained code with its own costs and failure modes.

Before adding a test, identify the behavior worth protecting, the plausible defect it would catch, and whether existing verification already detects that defect. Add protection when its independent value justifies its cost. Strengthen existing protection where sufficient. Not adding a test is a valid decision.

Prioritize critical business rules, data integrity, authorization, failure handling, and behavior that is difficult to reason about or costly to break. Ordinary successful behavior can be worth testing. Trivial getters, setters, forwarding functions, framework mechanics, and disposable scripts usually need no dedicated test unless they enforce a meaningful contract or produce consequential effects. Do not add tests solely because a function, feature, or historical bug exists.

Test counts, assertion counts, coverage, and green CI are signals, not proof of quality. Respect explicit project verification requirements.

## Behavior and contract

Identify the actual consumer of the behavior and its stable contract. Read the production path and relevant specifications, domain vocabulary, and architectural decisions. Trace callers, transformations, state, dependencies, side effects, and error propagation where they affect the behavior.

Choose the smallest stable interface that can expose the defect. Exercise production code through its supported entry points and normal initialization. A unit may be a function, class, or cohesive group of components. Do not test every private method or reproduce the internal call graph.

Assert observable results, errors, state changes, persistence, and side effects. Assert interaction arguments, counts, or ordering when they constitute a consequential contract, such as dispatching to the correct recipient, preventing duplicate writes, or preserving queue order. Prefer observing the real outcome when feasible. Avoid assertions on incidental implementation choices.

A behavior-preserving refactor should ordinarily leave tests unchanged. Use internal knowledge to discover risks, while selecting observations that remain meaningful after refactoring.

Keep independently justified structural checks (schemas, generated artifacts, build invariants, dependency boundaries) distinct from behavioral tests. Use appropriate static tools for those checks; do not infer runtime correctness from them. Do not assert source text, private structure, or prompt wording as evidence of behavior.

## Risk and case selection

Select cases from the contract and the actual failure mechanisms. Trace dependency ownership and choose the boundary at which the defect can be meaningfully detected. Exercise a wider composition when its interaction introduces a distinct risk.

Use relevant equivalence classes, boundary values, invalid inputs, state transitions, and consequences of failure. Consider shared state, isolation, ordering, concurrency, cancellation, retries, persistence, cache invalidation, representation changes, and partial side effects when applicable. Include the successful path where it establishes a necessary capability. Do not enumerate arbitrary cases or treat coverage gaps as automatic instructions to add tests.

For each case, be able to name a plausible faulty implementation that the test would reject: an incorrect value, missing validation, wrong target, lost state change, duplicate effect, or incorrect transition. If the case does not distinguish intended behavior from the defect, redesign or omit it.

Use example-based tests for concrete rules and representative cases. Where a contract has a meaningful property over many inputs, consider property-based tests: round trips, idempotence, invariants, ordering, or an independently established reference result. Select properties that constrain behavior without merely restating the implementation. Ensure valid inputs and assertions actually execute; reject vacuous tests, over-filtered generators, and properties that pass without exercising the intended domain. Do not introduce property-testing infrastructure without sufficient value.

## Fidelity and test boundaries

Keep the production logic responsible for the claimed behavior real. Prefer real, deterministic dependencies when practical; otherwise prefer a sufficiently faithful fake, then a minimal stub or mock. Choose the boundary according to the behavior being tested, not convenience alone.

Understand a dependency's contract and side effects before substituting it. Preserve all behavior and data relevant to the test, including state changes that other real components rely on. Do not mock the logic whose correctness the test claims to establish or mock internal collaborators merely to isolate every class.

Prefer dependency-maintained fakes. Ground custom fakes in an independently established contract and compare them with the real dependency where feasible. Do not build a parallel browser, DOM, database, scheduler, or runtime merely to make local tests possible. Reassess the boundary if the substitute is costly or cannot preserve the relevant semantics.

Use doubles to control genuine dependency ports, difficult failure conditions, timing, and external effects. Verify consequential outgoing requests and reject unexpected interactions; a sequence of unconditional successful responses cannot prove correct dispatch. Where production error handling might catch a mock assertion, capture the interaction and check it after execution. Do not require incidental fields or call order. Simulate failures at the right point, including after a side effect when the outcome can be uncertain.

Do not bypass initialization, fabricate private state, or add test-only production methods and abstractions without independent production justification. Run tests with consequential external effects only in an authorized, safe environment. Prefer isolated or disposable resources, test accounts, and test credentials; use a controlled substitute when necessary. Do not modify production or shared state, send real messages, or incur charges without explicit authorization for those effects. If no safe real integration environment is available, verify meaningful owned behavior locally and identify the remaining unverified integration or acceptance risk. Never represent a substitute's behavior as real dependency acceptance.

## Test construction

Write each test as a readable specification of one coherent behavior. Use domain language in its name and keep setup, action, and assertions visible (Arrange–Act–Assert is a useful default). Prefer descriptive and meaningful phrases (DAMP) over aggressive deduplication. Small helpers and standard fixtures are useful when they preserve clarity; avoid complex shared fixtures that hide inputs, control flow, and expected outcomes.

Derive expected results independently from the production implementation: a specification, hand-checked literal, trusted fixture, independent oracle, or meaningful property. Fixed data is useful when it illustrates the rule. Avoid irrelevant data coupling, self-comparison, copying the algorithm into the assertion, and snapshots whose contents have not been independently reviewed. Use exact values when the contract requires exactness.

Verify the outcome and relevant failure effects, including the absence of a prohibited side effect. Multiple assertions are appropriate when they establish one coherent behavior. Parameterize equivalent cases when it improves clarity without hiding which case failed. Prefer deterministic inputs, controlled time and randomness, isolated resources, explicit synchronization, and reliable cleanup. Failures should reveal the violated behavior and help locate the defect.

Develop incrementally in vertical behavior slices. When useful, prefer red–green–refactor: see a focused test fail for the intended reason, implement the behavior, see it pass, and refactor with the contract preserved. Avoid writing a large suite against speculative interfaces before learning how the implementation works. Do not force test-first development or a new permanent test for every change.

## Test portfolio and execution

Choose a combination of tests and other verification that establishes the behavior with reasonable speed, fidelity, and maintenance cost.

- Unit tests: focused behavior, calculations, transformations, state transitions, and owned dependency policies.
- Integration and contract tests: real component composition, storage, transport, serialization, registration, and consumer/provider compatibility when these introduce independent risks.
- End-to-end and acceptance checks: essential user journeys and real runtime, device, graphical, or model behavior that narrower tests cannot establish. Use automated or manual checks according to their value and feasibility.
- Static checks: build, type, schema, lint, and structural constraints for which static evidence is sufficient.

For example, an API may need tests of its business rules and actual HTTP contract; a data pipeline may need transformation and idempotence tests; a UI may need meaningful interaction and accessibility checks in a real environment. Choose only the checks that fit the product's risks. Do not test a framework's documented mechanics unless a specific assumption needs characterization.

As a starting point for a balanced test portfolio, Google's rough guideline is about 80% narrow-scoped unit tests and 20% broader-scoped tests (roughly 15% integration and 5% end-to-end). Adapt the mix to the system's risks, architecture, and verification costs; the ratio is guidance, not a quota or acceptance criterion.

Prefer fast, deterministic routine checks. Run genuine integration and full-flow checks at a frequency justified by their risks, change rate, and resource costs. A cheap critical end-to-end check may belong in routine CI; costly device or model checks may belong at a release or manual gate. Scope, test design method, and cadence are separate choices. Preserve project-required verification gates; do not add CI orchestration, coverage thresholds, or test infrastructure without an independent need.

## Effectiveness review and lifecycle

Review tests against their claimed protection:

- Does the test exercise the relevant real logic and distinguish a plausible defect from correct behavior?
- Does it observe an independently justified result or consequential interaction?
- Would an implementation-only change make it fail? Does another test already provide equivalent protection?
- Does the protection justify its maintenance cost and chosen verification boundary?

For new regression tests, new or materially changed tests protecting consequential behavior, and questionable existing tests, demonstrate the intended failure where feasible: observe a test-first failure, run the test against the defective implementation, or temporarily introduce a plausible fault. Confirm failure for the intended reason and success with the correct implementation. Setup errors, incidental runner timeouts, and unrelated assertions do not establish detection; an explicitly verified violation of a contractual deadline or liveness bound can. Use targeted fault checks as needed; do not require mutation tooling or scores. A surviving mutation may be equivalent under the contract; inspect it before adding coverage. Never commit deliberate faults.

Keep effective protection, strengthen weak cases, simplify costly setup, remove redundant or obsolete checks, and move tests to a better boundary when warranted. Delete unused fixtures. Do not merely combine cases to lower the reported count, weaken assertions to make CI green, or preserve every historical regression test indefinitely. Preserve distinct failure detection, and identify the replacement verification or explicitly report remaining risk when removing necessary coverage.

During ordinary changes, review the affected contracts and related tests. Reserve full-suite audits for explicit requests or evidence of systemic problems. Do not require a separate risk record or review document for every test.

Run the relevant changed verification and required project checks before claiming success. Report failures, checks not run, and the limits of the evidence. Do not claim that passing tests alone establish full correctness or integration acceptance.
