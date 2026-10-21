---
name: dependency-risk-testing
description: Design, review, or simplify tests and CI around production dependency risk. Use when choosing stability tests, auditing white-box coupling or weak black-box cases, removing duplicated coverage, or separating routine checks from integration and release verification.
---

# Dependency-risk testing

Derive lasting tests from real dependency risk and observable contracts, not feature counts, past bugs, or coverage targets. Explicit project verification requirements still apply.

## Trace the owned dependency

Inspect the actual production path before changing tests: responsible owner, its callers and consumers, public contract, state, side effects, transformations, lifecycle, timing, and error propagation. Do not reconstruct that path from test names or intended architecture.

Identify the first boundary where a plausible defect becomes observable. Prefer structural risks: shared mutable state, converging inputs, fan-out, ordering, cancellation, retries, persistence, representation changes, caching, and fail-closed decisions. A past bug alone does not justify a permanent test; the underlying recurring risk might.

## Choose the smallest meaningful test

Keep the test near the responsible function or dependency edge. If `A -> B -> C -> D` fails because of `B -> C`, test that contract rather than replaying the entire chain. Test the whole chain only when its composition has an independent failure mode.

Separate **design method**, **scope**, and **cadence**:

- **White-box:** Use implementation knowledge for local branches, invariants, or function dependencies that genuinely require it. Keep that knowledge inside the owned unit; do not encode unrelated components' internals.
- **Black-box:** Derive cases from the unit's external contract. Choose meaningful equivalence classes, boundary values, invalid inputs, state transitions, or properties; do not equate black-box testing with E2E or with sheer case volume.
- **Integration / E2E:** Exercise actual boundaries when unit-level substitutes cannot establish their contract. A mocked integration must not be presented as proof of the real runtime, network, native addon, device, or model.

Prefer asserting observable output, state, persistence, errors, and externally meaningful ordering over incidental call sequences. A contract-preserving refactor should ordinarily leave its tests unchanged.

## Make the protection discriminating

For each test, identify a plausible incorrect implementation that its assertions would reject. Select cases where the contract is fragile, rather than a convenient happy path that would pass almost any implementation.

Where useful, check an invariant across representative partitions or transitions instead of enumerating arbitrary examples. Consider rejected inputs and failure effects, not just returned values. No fixed number of boundary cases, tests per function, or coverage percentage is required.

## Preserve production encapsulation

Exercise the unit through its supported entry points and observe its real effects. Substitute dependencies only at genuine external ports, preserving the contract relevant to the test.

Do not bypass initialization, populate private fields, call private orchestration methods, or recreate a fictitious runtime merely to make a test pass. If this seems necessary, reconsider the test boundary first; do not add production abstractions or test-only hooks without an independent design reason.

## Remove duplication and assign cadence

Keep one nearest meaningful protection per invariant. Remove or shrink another test when it repeats that protection without a distinct failure mode, when ownership changes, or when the invalid state becomes unrepresentable. Prefer deleting duplicated setup to building a fixture framework.

- **Routine CI:** Keep fast, deterministic checks for structural risks and contracts affected by ordinary changes.
- **Dependency integration:** Run real compatibility and composition checks when their owning boundary changes, or at a justified scheduled or manual gate.
- **Release / acceptance:** Reserve costly full-flow, device, model, graphical, or production-like regression for appropriate release gates unless its risk warrants more frequent checks.

These are scheduling choices, not definitions of unit, regression, white-box, or black-box tests. Preserve required release gates. Do not add change-detection frameworks, CI matrices, or orchestration solely to reduce a small suite.

## Review and verify

For each proposed protection, ask: **owner and contract → structural risk → discriminating case → observable failure**. Reconsider tests that break under behavior-preserving refactors or whose substitutes conceal the risk they claim to protect.

Remove duplicate protection. Exercise changed verification paths before claiming completion; report anything not run as unverified. Do not count mocked success as real integration acceptance.
