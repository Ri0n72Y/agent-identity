---
name: ralph
description: >
  Prepare, execute, continue, and hand off bounded Ralph engineering tasks. Use
  when creating or receiving a `ralph: 1` task, when an active worker can cheaply
  take a directly adjacent Ralph plan, or when work should cross to another worker
  with workspace-first recovery and evidence-based completion.
---

# Ralph

Ralph is a lightweight protocol for carrying bounded engineering work through one or more workers without carrying unnecessary conversation history. It defines task, continuation, and handoff contracts; it does not implement its own runtime loop, session manager, or orchestration engine.

## Core model

A full Ralph task has one immutable objective. A Ralph plan is a new bounded adjacent task that may reuse the current worker's useful working context instead of reconstructing it.

Preserve useful working context while it has positive value. Cross a worker boundary when independence requires a different responsible worker, or when the current context has become more costly or misleading than recovering state from the workspace.

The workspace is the source of truth. A Ralph report is only a bounded handoff or terminal record and must never override current workspace evidence.

## Choose continuity deliberately

Continue with the current worker when the next task is small and directly adjacent to work it already understands. The plan may introduce a new bounded goal or narrow task-local constraints; it does not need to remain inside the previous task's objective or constraints.

When independence matters, use a different responsible worker from the one that produced the work being judged. That worker need not be globally fresh if it remains independent of the work and its existing context is still useful.

Use a fresh worker when the current context has become stale or noisy, or when recovering the required state from the workspace is cheaper or safer than retaining the current working context.

For example:

- implementation worker A -> independent review worker B;
- fix by A -> post-fix review may reuse B;
- review clean -> merge may continue on B.

## Full task

Use the full task form when starting a Ralph objective or crossing a context boundary:

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

- Keep `objective` stable for the lifetime of the full task. If the goal changes materially within that task, start another Ralph task or use an adjacent plan when the current worker can continue cheaply.
- Treat the workspace as authoritative.
- Do not copy workspace-readable facts into `context` unless they are needed to disambiguate intent.
- Use `previousReport` only as bounded execution continuity. It may guide where to inspect, but material state must be verified against the workspace before relying on it.
- Preserve valid work already present in the workspace; do not redo completed work merely because a new worker started.
- Do not expand scope beyond `objective` and `constraints`.

## Same-worker continuation

When the current worker already holds useful context for a small adjacent task, use a minimal Ralph plan instead of reconstructing a full task or generating an intermediate handoff:

```yaml
ralph: 1

plan: |
  <small adjacent task, including any new local bounds that matter>
```

The plan may define a new bounded goal and may supersede task-local constraints from the previous Ralph task. It should not restate workspace, background context, or constraints that remain obvious and active.

Use a full task instead when crossing a context boundary or when the next task cannot be understood safely and unambiguously from the worker's current context plus the plan.

## Execution

For a full task:

1. Establish the current relevant workspace state.
2. Use `previousReport`, if present, to orient continuation without treating it as truth.
3. Perform the smallest remaining work required by the objective and constraints.
4. Verify material results using concrete evidence from the workspace, tests, CI, review, or observable behavior as appropriate.

For a continuation plan, use the current worker's working state and execute the new bounded task directly. Do not reconstruct context it already holds unless verification requires it, and do not carry forward superseded task-local constraints merely because they belonged to the previous task.

Do not stop merely because a previous attempt failed. Continue while the current task remains achievable. Use `blocked` only when the current worker cannot resolve the blocking condition with its available authority, tools, workspace, and active constraints.

## Report

Every Ralph full task or Ralph plan ends with exactly one terminal Ralph report. A report may also serve as the bounded handoff when work crosses a context boundary.

Internal same-worker stages do not require intermediate reports unless a durable checkpoint is genuinely useful.

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

Use when the current Ralph task is not yet satisfied and work should continue after the report.

- `summary` states the current verified state, not the execution diary or a restatement of the objective.
- `evidence` contains only concrete facts that materially support the handoff or prevent likely repeated work.
- `nextSteps` contains the smallest clear continuation path.
- `blocker` is an empty string.

### `complete`

Use when the current Ralph task and its observable completion conditions are satisfied.

- `summary` states what is now complete.
- `evidence` contains concrete proof such as repository state, commits, tests, CI, review results, files, commands, or observed behavior.
- Material negative findings may be evidence, such as an independent review finding no remaining must-fix issue.
- `nextSteps` is an empty array.
- `blocker` is an empty string.

A successful edit, tool call, or attempted review is activity, not by itself evidence of completion.

### `blocked`

Use only when further progress cannot be made within the current worker's available authority, tools, workspace, and active task constraints.

- `summary` states the verified state reached before the block.
- `evidence` shows the condition preventing further progress.
- `nextSteps` contains only the action that becomes possible once the blocker is removed.
- `blocker` names the unresolved condition clearly.

Do not use `blocked` for uncertainty, a failed attempt, missing investigation, or work that is merely difficult.

## Context discipline

Ralph exists to preserve useful state without preserving unnecessary history.

Keep task-only context and reports compact. Before carrying information across a boundary, ask whether the next worker can recover it cheaply and reliably from the workspace. If yes, leave it there.

Preserve failed branches or negative findings only when losing them would materially increase the chance of repeated work or an incorrect conclusion.

## Boundaries

Ralph is a protocol, not an excuse to create infrastructure. Do not add a custom runtime, state machine, session store, queue, or orchestration framework unless the surrounding project explicitly requires one.
