---
name: ralph
description: >
  Prepare, execute, continue, and hand off bounded Ralph engineering tasks. Use
  when creating or receiving a `ralph: 1` task, when an active worker can take a
  directly adjacent Ralph plan without reconstructing context, or when work should
  cross to another worker with workspace-first recovery and evidence-based completion.
---

# Ralph

Ralph is a lightweight protocol for carrying bounded engineering work through one or more workers without carrying unnecessary conversation history. It defines task, continuation, and handoff contracts; it does not implement its own runtime loop, session manager, or orchestration engine.

## Core model

A full Ralph task has one immutable objective. A Ralph plan is a new bounded adjacent task that may reuse the current worker's useful working context instead of reconstructing it.

Reuse the current worker when it already holds the material context needed for an adjacent task. Cross a worker boundary when independent judgment requires a different responsible worker, or when retaining the current context is less reliable or efficient than recovering state from the workspace.

The workspace is the source of truth. A Ralph report is only a bounded handoff or terminal record and must never override current workspace evidence.

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

- Keep `objective` stable for the lifetime of the full task.
- Treat the workspace as authoritative.
- Do not copy workspace-readable facts into `context` unless they are needed to disambiguate intent.
- Use `previousReport` only as bounded execution continuity. It may guide inspection, but verify material state against the workspace before relying on it.
- Preserve valid work already present in the workspace.
- Do not expand scope beyond `objective` and `constraints`.

If the next work is a small adjacent task and the current worker already holds the needed context, use a Ralph plan instead of reconstructing a full task.

## Adjacent plan

Use a minimal Ralph plan when the current worker can safely execute a small adjacent task from its existing working context:

```yaml
ralph: 1

plan: |
  <small adjacent task, including any new local bounds that matter>
```

A plan may define a new bounded goal and may replace constraints that belonged only to the previous Ralph unit.

A plan must not override higher-layer instructions or constraints owned by the user, project, tools, permissions, or runtime.

Do not restate workspace, background context, or still-active constraints unless the plan would otherwise be ambiguous.

Use a full task when crossing a context boundary or when the adjacent task cannot be understood safely from the current working context plus the plan.

## Execution

- Work from the current relevant workspace state.
- Use handed-off reports to orient work, not as authority.
- Perform only the work required by the active Ralph task or plan and its applicable constraints.
- Verify material completion claims with observable evidence.
- Do not stop merely because a previous attempt failed while the task remains achievable.
- Use `blocked` only when the current worker cannot resolve the blocking condition with its available authority, tools, workspace, and applicable constraints.

When independent judgment is required, the worker making that judgment must be different from the worker responsible for the work being judged. It need not be globally fresh if it remains independent and its retained context is still useful.

## Report

Each bounded Ralph task or plan produces exactly one terminal Ralph report when that unit ends. Do not emit reports between its internal steps unless a durable checkpoint is itself required.

A terminal report may also serve as the bounded handoff across a context boundary.

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

Use when the current Ralph unit is not yet satisfied and clear work remains after the report.

- `summary` states the current verified state, not the execution diary or a restatement of the objective.
- `evidence` contains only concrete facts that materially support continuation or prevent likely repeated work.
- `nextSteps` contains the smallest clear continuation path.
- `blocker` is an empty string.

### `complete`

Use when the current Ralph unit and its observable completion conditions are satisfied.

- `summary` states what is now complete.
- `evidence` is concrete and sufficient to support completion, including material negative findings when they affect the conclusion.
- `nextSteps` is an empty array.
- `blocker` is an empty string.

Activity alone is not evidence of completion.

### `blocked`

Use only when further progress cannot be made within the current worker's available authority, tools, workspace, and applicable constraints.

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
