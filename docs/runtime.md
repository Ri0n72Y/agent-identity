# Runtime model

The identity model has one important separation:

```text
User input
   +
SOUL
   |
   v
Root Agent
   |
   | compiles objective / context / constraints
   v
Ralph worker
   |
   | native Ralph Report
   v
Root Agent
   |
   | interprets result with current SOUL
   v
User
```

## Invariants

### Soul is Root-only

The Root Agent may use `soul/SOUL.md` to understand how it should interpret the user, choose emphasis, and compile a task.

A normal Ralph worker does not inherit Soul. It receives only the task contract required to perform the work.

This prevents identity context from spreading through every child execution and keeps worker context explicit.

### Constraints are compiled per task

Soul describes durable identity and tendencies. It is not the place for project-specific or task-specific operational rules.

At the beginning of a task, the Root Agent compiles the relevant rules into the task's `constraints` field. A local runtime may also materialize them as `runtime/constraints.md`.

### Results return through the Root

A worker's report is not the final identity-aware interpretation. The Root Agent receives the result and interprets it using the current Soul before continuing the conversation.
