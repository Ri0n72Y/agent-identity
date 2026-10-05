---
name: dependency-risk-testing
description: Design, review, clean up, or tier automated tests and CI from production dependency risk. Use when deciding what deserves routine CI, replacing feature-, bug-, or coverage-driven suites, reducing brittle scenario tests, or adding focused stability tests around mutable state, ownership boundaries, transformations, timing, side effects, caches, and high fan-in or fan-out dependencies.
---

# Dependency-risk testing

Choose tests from the production dependency graph, not from the feature list, bug history, issue history, or coverage targets.

## Start from production structure

Before changing tests, trace the relevant production owners, functions, and dependency edges.

Identify where authoritative truth lives, what each unit consumes, who consumes its output, what mutable state it reads or writes, what side effects it can cause, and whether correctness depends on lifecycle, timing, caching, invalidation, or representation changes.

Do not start from the existing test inventory. Existing tests are evidence about the current suite, not the specification for what must remain.

## Select structurally risky dependencies

Prioritize nodes and edges that are easy for unrelated changes to destabilize, especially when:

- several upstream inputs converge;
- one output has many downstream consumers;
- the same function reads and mutates shared state;
- correctness depends on ordering, lifecycle, async behavior, signals, concurrency, or timing;
- a query, readiness, validation, or availability path must remain side-effect free;
- one authoritative representation is transformed into another;
- cache or published state must be invalidated correctly;
- fail-closed error propagation is part of the boundary;
- reset, cancel, retry, or re-entry can leave stale state;
- several callers share the same owner or command path.

Usually give lower priority to trivial getters, immutable constant mappings, leaf presentation formatting, purely graphical fidelity, and states the current architecture cannot legally construct.

## Test at the minimum diagnostic cut

Place the test as close as practical to where the error can originate, not where the user finally observes it.

For a chain:

```text
A -> B -> C -> D
```

if the risky dependency is `B -> C`, test that edge directly. Do not route through `A` and `D` unless the complete chain is itself the contract.

A useful failure should point to a specific owner, function, or boundary and make clear whether the problem is wrong output, wrong mutation, an unintended side effect, stale state, or lifecycle/timing behavior.

## Design stability checks from the real risk

For stateful logic, check the precondition, returned result, intended mutation, and that unrelated state remains unchanged. Add repeat, cancel, reset, or retry cases only when those transitions are structurally relevant.

For query-like logic such as readiness, availability, validation, or probes, check both the result and required purity: no unintended mutation, publication, cache change, or lifecycle transition.

Do not create Cartesian state matrices, arbitrary scenario combinations, pixel-level assertions, or tests of private call order unless those details are themselves the supported contract.

## Treat features and bugs as signals, not qualifications

A new feature does not automatically deserve a permanent routine test. If it introduces a structurally risky dependency, test that dependency. If it is mainly leaf behavior or presentation, acceptance or Full Suite coverage may be enough.

A bug does not automatically deserve a permanent regression test. Analyze the root cause. Add or adjust a stability test only when the bug exposes an unprotected structural risk in the dependency graph.

Historical failures may help reveal where the architecture is fragile, but history alone does not determine test placement.

## Keep one nearest meaningful protection

Avoid defining the same invariant at several layers.

If the same truth is checked in an owner test, controller test, scene integration test, and E2E test, keep the protection nearest the authoritative owner unless a higher-level boundary can independently fail and therefore deserves its own focused test.

Delete or shrink tests when the dependency disappeared, ownership moved, the invalid state became unrepresentable, a more direct test already protects the same risk, or the test has become historical reproduction with little diagnostic value.

Prefer deleting duplicated setup over abstracting it into a larger testing framework.

## Tier verification by purpose

When the project distinguishes routine CI from heavier verification, keep routine CI focused on build/import/static gates plus a small stability suite derived from dependency risk.

Keep broader feature acceptance, composition, integration, E2E, and graphical verification in a Full Suite or equivalent heavier gate that can run for major refactors, milestone closeout, merge preparation, or suspected cross-subsystem impact.

Do not build dynamic changed-file test selection, dependency-graph tooling, or a generic test framework merely to implement this principle unless the project independently needs them.

## Completion

When reviewing or redesigning a test suite, completion should be observable:

- every routine stability test can name the risky production node or edge it protects;
- each such test is close enough to the owner to provide useful root-cause localization;
- duplicate black-box coverage has been removed or moved to the appropriate heavier suite;
- the routine stability suite passes;
- any relevant Full Suite path that was changed remains runnable and is verified when practical;
- unrun verification is reported as unverified, not assumed.

A test is justified by the structural risk it protects, not by how important the feature sounds, how memorable the bug was, or how much coverage it adds.
