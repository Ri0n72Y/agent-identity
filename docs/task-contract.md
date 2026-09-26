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

mPFC-specific values such as time, Reflection round, Soul revision/hash, and `soulChanged` are runtime-derived metadata around the report, not additions to the report itself.
