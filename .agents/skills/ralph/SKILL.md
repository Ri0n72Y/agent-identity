---
name: ralph
description: >
  Prepare, execute, continue, and hand off bounded Ralph engineering tasks. Use
  when creating or receiving a `ralph: 1` task, when an active Ralph worker can
  cheaply continue with a directly adjacent step, or when work should cross to a
  fresh worker with workspace-first recovery and evidence-based completion.
---

# Ralph

Ralph is a lightweight protocol for carrying a bounded engineering objective through one or more workers without carrying unnecessary conversation history. It defines task, continuation, and handoff contracts; it does not implement its own runtime loop, session manager, or orchestration engine.

## Core model

A Ralph task has one immutable objective.

Preserve useful working context when the current worker can continue cheaply. Cross to a fresh worker when context reset or independence materially improves correctness or effective context cost.

The workspace is the source of truth. A Ralph report is only a bounded handoff and must never override current workspace evidence.

## Choose continuity deliberately

Continue with the current worker when the next step is a small, direct continuation of the same objective and its existing working context is still useful. Do not force a fresh worker merely to follow a ritual.

Use a fresh worker when independence is part of correctness, the current context has become stale or noisy, or recovering the required state from the workspace is cheaper or safer than retaining the current working context.

For example, implementation -> independent review usually benefits from a fresh worker. Review clean -> merge usually does not.

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

- Keep `objective` stable for the lifetime of the task. If the goal changes materially, start a new Ralph task.
- Treat the workspace as authoritative.
- Do not copy workspace-readable facts into `context` unless they are needed to disambiguate intent.
- Use `previousReport` only as bounded execution continuity. It may guide where to inspect, but material state must be verified against the workspace before relying on it.
- Preserve valid work already present in the workspace; do not redo completed work merely because a new worker started.
- Do not expand scope beyond `objective` and `constraints`.

## Same-worker continuation

When the current worker already holds the useful context for a small adjacent step, continue with a minimal Ralph plan instead of reconstructing a full task or generating an intermediate handoff:

```yaml
ralph: 1

plan: |
  <small next action under the existing objective and constraints>
```

A continuation plan does not redefine the objective and should not restate workspace, context, or constraints already active in the worker.

Use a full task instead when continuation requires a material objective change, new task-specific constraints, or a context boundary.

## Execution

For a full task:

1. Establish the current relevant workspace state.
2. Use `previousReport`, if present, to orient continuation without treating it as truth.
3. Perform the smallest remaining work required by the objective and constraints.
4. Verify material results using concrete evidence from the workspace, tests, CI, review, or observable behavior as appropriate.

For a continuation plan, use the current worker's working state and proceed directly. Do not reconstruct context it already holds unless verification requires it.

Do not stop merely because a previous attempt failed. Continue while the objective remains achievable within the task. Use `blocked` only when the current worker cannot resolve the blocking condition with its available authority, tools, workspace, and constraints.

## Report

Produce a Ralph report when handing work across a context boundary or closing the Ralph objective. Same-worker continuation does not require an intermediate report unless a durable checkpoint is genuinely useful.

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

Use when the objective is not yet satisfied and another worker should continue.

- `summary` states the current verified state, not the execution diary or a restatement of the objective.
- `evidence` contains only concrete facts that materially support the handoff or prevent likely repeated work.
- `nextSteps` contains the smallest clear continuation path.
- `blocker` is an empty string.

### `complete`

Use when the objective and its observable completion conditions are satisfied.

- `summary` states what is now complete.
- `evidence` contains concrete proof such as repository state, commits, tests, CI, review results, files, commands, or observed behavior.
- Material negative findings may be evidence, such as an independent review finding no remaining must-fix issue.
- `nextSteps` is an empty array.
- `blocker` is an empty string.

A successful edit, tool call, or attempted review is activity, not by itself evidence of completion.

### `blocked`

Use only when further progress cannot be made within the current worker's available authority, tools, workspace, and task constraints.

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
