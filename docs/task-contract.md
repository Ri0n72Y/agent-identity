# Ralph task contract

Identity does not introduce a special worker protocol. Ordinary work and Reflection share the same Ralph contract.

## Ralph Task

The task object uses only these fields:

- `ralph`
- `objective`
- `workspace`
- `context`
- `constraints`
- `previousReport`

The `constraints` field belongs to task execution. Its content comes from the current project, the user's explicit request, and other applicable runtime requirements.

Identity may help the Root Agent interpret or prioritize work, but Soul and Principles are not themselves copied into `constraints`.

Do not add parallel fields such as `plan`, `background`, `reasoning`, `decisions`, or `acceptanceCriteria` merely for identity work. Put necessary information into the existing contract.

The `ralph` operation may be used by the Ralph skill for its normal `prepare`, `execute`, and `report` flow.

## Ralph Report

The report shape is fixed to:

- `status`
- `summary`
- `evidence`
- `nextSteps`
- `blocker`

Reflection uses these same fields unchanged.

mPFC-specific values such as time, Reflection round, identity revision, whether identity changed, and the state transition are metadata around the report, not additions to the report itself.
