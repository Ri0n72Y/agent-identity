# Ralph task contract

Identity does not introduce a special worker protocol. Ordinary work and Reflection share the same Ralph contract.

## Ralph Task

The **full** Ralph Task uses only these fields:

- `ralph`
- `objective`
- `workspace`
- `context`
- `constraints`
- `previousReport`

The `constraints` field belongs to task execution. Its content comes from the current project, the user's explicit request, and other applicable runtime requirements.

Identity may help the Root Agent interpret or prioritize work, but Soul and Principles are not themselves copied into `constraints`.

An **adjacent Ralph Plan** is a separate, supported task form with only `ralph` and `plan`, for a bounded nearby objective when the same worker already holds sufficient context. It is **not** an extra field to add to a full Ralph Task. When crossing a worker or context boundary, use the full task form.

Identity work must not invent parallel full-task fields such as `background`, `reasoning`, `decisions`, or `acceptanceCriteria`. Use the existing contract instead. The [Ralph Skill](../.agents/skills/ralph/SKILL.md) is the authority for the current full Task, adjacent Plan, execution, and report semantics; this document only states identity-specific boundaries.

## Ralph Report

The report shape is fixed to:

- `status`
- `summary`
- `evidence`
- `nextSteps`
- `blocker`

Reflection uses these same fields unchanged.

mPFC-specific values such as time, Reflection round, identity revision, whether identity changed, and the state transition are metadata around the report, not additions to the report itself.
