---
name: ralph
description: >
  Prepare bounded Ralph tasks for fresh worker agents and produce structured Ralph
  reports for continuation, completion, or genuine external blockers. Use when a
  larger engineering task should be handed to a fresh worker with an immutable
  objective, workspace-first context recovery, explicit constraints, and a compact
  evidence-based handoff.
---

# Ralph

Ralph is a lightweight protocol for delegating a bounded engineering objective to a fresh worker and returning a compact structured handoff. It defines the task contract and report format; it does not implement its own runtime loop, session manager, or orchestration engine.

## Core model

A Ralph task has one immutable objective. Each worker starts fresh, recovers the real state from the workspace, performs only the work required by the objective and constraints, then returns a structured report.

The workspace is the long-term source of truth. A previous Ralph report is only a bounded handoff and must never override the workspace.

## Task format

Use this shape when preparing a Ralph task:

```yaml
ralph: 1

objective: |
  <immutable completion goal>

workspace:
  - <repository, branch, PR, paths, or other authoritative locations>

context:
  - <only facts the worker cannot cheaply recover from the workspace>

constraints:
  - <hard boundaries, exclusions, completion rules, or process requirements>

previousReport: null
```

### Task rules

- Keep `objective` stable for the lifetime of the task. If the goal changes materially, start a new Ralph task.
- Treat the workspace as authoritative. Read it before trusting remembered or handed-off state.
- Do not copy workspace-readable facts into `context` unless they are needed to disambiguate intent.
- Use `previousReport` only to preserve bounded execution continuity between fresh workers.
- Preserve valid work already present in the workspace; do not redo completed work just because a new worker started.
- Do not expand scope beyond `objective` and `constraints`.
- Prefer a fresh worker/new chat for execution so hidden conversational assumptions do not accumulate.

Suggested size discipline: keep `context` under roughly 4,000 characters and the terminal report under roughly 6,000 characters unless the task genuinely requires more evidence.

## Execution procedure

1. Read the immutable objective and constraints.
2. Inspect the workspace and establish the current real state.
3. Read `previousReport` only after the workspace, if one exists.
4. Determine the smallest remaining work required to satisfy the objective.
5. Execute within the stated boundaries.
6. Verify the result using concrete evidence from the workspace, tests, CI, review, or observable behavior as appropriate.
7. Return exactly one Ralph report.

Do not stop merely because a previous attempt failed. Continue while the objective can still be completed from the current workspace. Use `blocked` only for a genuine external blocker that cannot be resolved within the task.

## Report format

Return exactly these five fields:

```json
{
  "status": "continue | complete | blocked",
  "summary": "...",
  "evidence": [],
  "nextSteps": [],
  "blocker": ""
}
```

Do not add extra top-level fields.

### `continue`

Use when useful work has been completed but the immutable objective is not yet satisfied.

Requirements:

- `summary` states the current verified state, not a diary of every action.
- `evidence` contains concrete facts that the next worker can verify or use.
- `nextSteps` contains the smallest clear continuation path for a fresh worker.
- `blocker` is an empty string.

### `complete`

Use when the objective and completion criteria are satisfied.

Requirements:

- `summary` states what is now complete and preserves important constraints or negative findings.
- `evidence` contains concrete proof such as commits, PR state, tests, CI, review results, files, commands, or observed behavior.
- `nextSteps` is an empty array.
- `blocker` is an empty string.

A valid completion report may explicitly record negative findings, such as an independent review finding no remaining must-fix issues.

### `blocked`

Use only when a real external dependency prevents further progress.

Requirements:

- `summary` states what was completed before the block.
- `evidence` shows why progress cannot continue locally.
- `nextSteps` contains only the action that becomes possible once the blocker is removed.
- `blocker` clearly names the external blocker.

Do not use `blocked` for uncertainty, a failed attempt, missing investigation, or work that is merely difficult.

## Report quality

A good Ralph report lets a fresh worker answer five questions without reconstructing the whole conversation:

1. What objective is being pursued?
2. What is the workspace's current verified state?
3. What was actually completed or discovered?
4. What evidence supports that state, including failed branches or negative findings that matter?
5. Is the task complete, genuinely blocked, or what is the smallest next step?

For review/fix/merge workflows, include enough evidence to preserve the real chain of work: the target, constraints, inspected state, material changes, tests or CI, independent review findings, corrective iterations, and final status. Do not inflate the report with recoverable workspace details.

## Boundaries

Ralph is a protocol, not an excuse to create infrastructure. Do not add a custom runtime, state machine, session store, queue, or orchestration framework unless the surrounding project explicitly requires one. The protocol should remain usable as plain task text plus a terminal report.
