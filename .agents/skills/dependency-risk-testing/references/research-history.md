# Dependency-risk testing — research and decision history

> Historical design evidence, compiled 2026-10-21. **Not runtime instructions** and not a mandatory dependency of `SKILL.md`. Read when the skill's guidance conflicts with practice, its assumptions change, or a rule needs to be challenged. Evidence and interpretation are distinguished below.

## Research question and original problem

Can tests remain useful as the production architecture becomes more modular, without reintroducing coupling through fixtures, private-state access, repeated scenarios, or large mandatory CI runs?

The investigation began with `Ri0n72Y/dsh-meeting` PR [#8](https://github.com/Ri0n72Y/dsh-meeting/pull/8) (Issue [#7](https://github.com/Ri0n72Y/dsh-meeting/issues/7)). An earlier suite contained 49 ordinary JavaScript/TypeScript tests, a Windows native build with 9 simulated adapter tests repeated from Linux, and a full DSH Web-profile smoke job. All were green, yet the Windows desktop playback/SenseVoice/Sidebar/LLM path had not been validated on a physical device. Green CI did not establish the user-facing acceptance claim.

The original `dependency-risk-testing` skill addressed one real problem: tests grew from features, past bugs, and coverage counts rather than dependency hazards. It recommended tracing the actual production call graph and protecting the nearest fragile contract. The subsequent review uncovered a second problem: even a test placed near a risk can pin down internal orchestration and resist behavior-preserving refactors.

## The discussion, including points of disagreement

1. **Initial thesis:** White-box checks should be local to a function or fixed function dependency; black-box checks should cover meaningful edge conditions, not a trivial happy path; long end-to-end runs often belong at release/regression gates instead of every code commit.
2. **Qualification:** These are reasonable *project choices*, not universal definitions. White-box and black-box describe how cases are derived (internal structure versus specification), not whether the scope is function-level or system-level. Regression means checking for unintended effects of change at *any* scope; it is not a synonym for full-flow tests. A canary/gray rollout is a deployment-risk control, not a test category.
3. **Further correction:** “Many edge cases” is not itself evidence of good black-box coverage. Prefer meaningful partitions, boundaries, transitions, properties and failure effects; ask what plausible faulty implementation each check would reject. Test volume and line coverage are poor substitutes for discrimination.
4. **Boundary principle:** Production systems aim for low coupling and high cohesion; tests that fabricate foreign private state undo those properties. White-box insight can justify local implementation-aware checks, but it should not turn another component's private fields or a mock runtime into a public contract.
5. **Cadence principle:** Frequent tiny tests, change-scoped genuine integration checks, and less frequent realistic acceptance are useful defaults, not rigid tiers. A cheap essential E2E smoke may run on every PR; a costly hardware/model path may be a release gate. Preserve explicit project verification requirements.

The final skill encodes the *decision criteria*, rather than imposing a fixed white-box/black-box taxonomy, case quota, testing-pyramid ratio, or mandatory CI design.

## Concrete evidence from dsh-meeting

### 1. The coupling failure in a test fixture

`tests/meeting-control.test.ts` manufactured an object with `Object.create(MeetingControl.prototype)`, populated `ctx`, `live`, `summaries`, `state`, and `deferredTimers`, then invoked internal `close()`, `makeSummary()` and `generate()`. It could pass while the actual Cordis service constructor, dependency injection, or Host Gateway registration was broken. A change to internal maps or task scheduling could fail the test without changing any externally promised behavior.

**Lesson:** Assert a stable outcome through a genuine component boundary; mock only real dependency ports. If the public boundary cannot support a meaningful check, investigate whether the fixture is at the wrong level before adding test-only accessors or an abstraction.

**Limit:** Sometimes a genuinely load-bearing implementation property (such as caching) deserves an internal assertion. This is an exception justified by the risk, not a universal ban on all white-box observations.

### 2. An unconvincing 'integration' result

In `tests/windows-loopback.test.ts`, a fake native addon supplied callback bytes and an end marker. These tests verified JavaScript conversion, queueing, and drain behavior, but could not prove Windows Media Foundation callback synchronization or actual system playback capture. Loading a compiled N-API binary proves the native entry exists; it does not prove physical device behavior either.

**Lesson:** Name the real boundary and what the substitute cannot prove. Do not promote a mocked adapter test into a claim of hardware, model, or production runtime acceptance.

### 3. Duplicated CI and its measured effect

`dsh-meeting` [CI #60](https://github.com/Ri0n72Y/dsh-meeting/actions/runs/39606259236) completed with 49 Linux tests, 9 Windows simulated adapter tests, and Web-profile smoke. Inspection found a second Linux typecheck, mock-based `pnpm proof`, two separate DSH Profile installations, and five similar non-existent-Session Gateway calls. A non-existent-Session error proves registration/dispatch, **not** valid-Session start, recording, streaming watch, or final summary.

The [subsequent change](https://github.com/Ri0n72Y/dsh-meeting/commit/6d51dc1c929578290925e192e1a94cdd5acbe218) split routine, Windows-native, and DSH-Web workflows. [Focused #61](https://github.com/Ri0n72Y/dsh-meeting/actions/runs/39608786004) passed **47/47** tests, typecheck and build; [Windows #1](https://github.com/Ri0n72Y/dsh-meeting/actions/runs/39608785641) compiled and loaded the addon; [DSH Web #1](https://github.com/Ri0n72Y/dsh-meeting/actions/runs/39608785970) installed a real profile, started Web and made one authenticated RPC call. All were green. The two deleted JavaScript cases were a static bundle-manifest test and a repeated Markdown speaker-label assertion, **not** evidence that the other 47 were all optimal.

**Lesson:** First eliminate repeated *verification of the same boundary*. The PR path filter selects the full PR diff, so both heavy workflows still ran on this particular feature-heavy PR. Narrow CI by ownership and independent risks, not by trying to achieve a target test count.

### 4. Where tests did have a clear owner

`ContinuousCapture.push()/stop()` and `MeetingStore` could be exercised via their supported methods. Fail-closed persistent writes, a resumed sample offset, backpressure under slow recognition, and an interrupted capture's already-accepted audio are distinct contracts. Path-confinement checks at different filesystem levels may also be independently justified. Fewer tests are not inherently better if deletion removes independent failure detection.

**Lesson:** Preserve an observable contract test if its removal would leave a plausible incorrect implementation undetected, even if the case was first noticed in a historical bug.

## External references and what they actually support

Sources were reviewed or cross-checked during the October 2026 discussion. Links are preserved to support re-evaluation; they are *evidence and alternative viewpoints*, not automatic instructions.

- **ISTQB Glossary**, [white-box test technique](https://glossary.istqb.org/en_US/term/white-box-test-technique); [black-box test technique](https://glossary.istqb.org/en_US/term/black-box-test-technique). The distinction concerns *test design based on internal structure versus specifications*, not a mandated test level. This corrects the original function-only/edge-only terminology.
- **Andrew Trenk, Google Testing Blog (2013)**, [Test Behavior, Not Implementation](https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html). Behavior-preserving refactors should generally preserve test assertions; the article notes that implementation checks can sometimes be justified (e.g., checking cache usage). Strong support for limiting private-state coupling, not a categorical ban on all white-box testing.
- **Mike Wacker, Google Testing Blog (2015)**, [Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html). Large E2E suites often have slow, unreliable, poorly localized feedback; small focused tests and a smaller number of genuine E2E checks are preferred. It does *not* recommend never running E2E on PRs.
- **Ham Vocke (2018), Martin Fowler site**, [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html). Prefer moving failures to a nearer unit/interface test and delete redundant high-level scenarios; retain a higher-level test when it provides *independent* evidence, such as a live HTTP boundary.
- **Adam Bender, Google Testing Blog (2024)**, [SMURF: Beyond the Test Pyramid](https://testing.googleblog.com/2024/10/smurf-beyond-test-pyramid.html). Trade off speed, maintainability, resource use, reliability and production fidelity rather than imposing a fixed test-count ratio.
- **Microsoft Engineering Playbook**, [Automated testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/), [Integration testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/integration-testing/), and [E2E comparison](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/e2e-testing/testing-comparison/). Unit checks can be PR gates; integration/E2E should run at justified frequency. Its guidance that integration tests can run early and often is a useful *counterexample* to an unconditional “release only” policy.

The practice-derived prioritization (which checks to keep and when they run) is **our engineering judgment**, not a rule asserted by any one source. A green adapter CI does not validate physical desktop recording.

## Rejected alternatives and why

- **“Every discovered feature or past bug gets a permanent test.”** Rejected: creates one-off historical scaffolding instead of protecting reusable structural risk.
- **“White-box must always equal functions, black-box must always equal large edge suites.”** Rejected as definitions: confuses design technique with scope and case volume.
- **“Every complete flow belongs only to release time.”** Rejected as universal cadence: a small fast integration smoke may be the cheapest protection for a fragile protocol boundary.
- **“Mock the whole production runtime and assert every internal step.”** Rejected: fixture complexity grows with production internals while leaving actual initialization/registration untested.
- **“Retain exhaustive cases to reach a fixed number or coverage target.”** Rejected: volume does not show a plausible faulty implementation would be caught.
- **“Introduce test-only hooks, service coordinators, or a change-detection framework.”** Rejected without independent production/scale need; violates the small-boundary/Ponytail principle.

## How to reopen this design

Revisit the runtime skill when a behavior-preserving refactor breaks several supposedly contract-focused tests; a real integration failure escapes mock-based tests; a class of faulty implementations passes the chosen partitions; a release gate repeatedly finds issues that a cheaper boundary test could catch; or the cost/frequency of a check changes materially.

Reconstruct the actual dependency graph first, compare the present architecture and validation costs with these dated examples, re-read the primary sources if still applicable, and **revise or remove only the decision rule whose evidence no longer holds**. Do not load this archive for ordinary test writing or copy its historical CI details into runtime instructions.
