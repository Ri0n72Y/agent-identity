---
name: dependency-risk-testing
description: Design, review, or simplify automated tests by tracing production dependencies and placing focused stability checks at structurally fragile functions and boundaries. Use when deciding which tests deserve routine CI, reducing duplicate scenario coverage, or replacing feature-, bug-, or coverage-driven test growth.
---

# Dependency-risk testing

Derive long-lived stability tests from production dependency risk.

Features, bugs, issues, and coverage can reveal risk, but they do not by themselves justify permanent routine tests. Explicit project verification requirements still apply.

## Trace the real dependency

Before changing tests, inspect the production path that actually carries the behavior: authoritative owner, callers, consumers, mutable state, side effects, transformations, lifecycle or timing dependencies, caches, and error propagation.

Do not infer this graph from test names, file layout, or intended architecture when the real call path can be inspected.

## Protect structurally fragile points

Prefer focused stability tests where unrelated changes can plausibly destabilize behavior: converging inputs, high fan-out outputs, shared mutable state, state transitions, ordering or timing, side-effect-sensitive queries, representation transforms, cache invalidation, fail-closed boundaries, reset/cancel/retry, or shared owners used by multiple callers.

Do not create a permanent stability test merely because a feature exists or a bug once occurred. When a failure reveals a real structural risk, protect that risk.

## Test at the minimum diagnostic cut

Place the test as close as practical to the responsible function or dependency edge.

If `A -> B -> C -> D` fails and the fragile contract is `B -> C`, test `B -> C` directly unless the complete chain is itself the contract.

For a high-level failure, identify the first responsible boundary before adding a permanent test.

A useful failure should localize wrong output, wrong mutation, unintended side effects, stale state, or lifecycle/timing behavior without requiring another large scenario to diagnose it.

## Keep one nearest meaningful protection

Do not define the same invariant at every layer.

Keep the protection nearest the authoritative owner. Add a higher-level test only when that boundary has its own independent failure mode.

Delete or shrink tests when their dependency disappeared, ownership moved, the invalid state became unrepresentable, or a nearer test already protects the same risk.

Prefer removing duplicated setup over abstracting it into a larger test framework.

Broader acceptance, composition, integration, E2E, or graphical checks may belong in a heavier verification path rather than routine stability CI.

Do not add orchestration machinery merely to implement this method; add it only when actual project scale or execution cost justifies it.

## Verification

When redesigning a suite, completion requires that:

- each routine stability test can name the structural risk it protects and fail close to that risk;
- duplicate higher-level coverage has been removed or deliberately retained for an independent boundary;
- changed verification paths have actually been exercised, and anything not run is reported as unverified.
