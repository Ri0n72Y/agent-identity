# agent-identity

A minimal workspace for experimenting with persistent agent identity and reflection.

The repository separates three concerns:

- `soul/` — the current, effective identity presented to the Root Agent.
- `runtime/` — task-local contracts and constraints compiled by the Root Agent.
- `mpfc/` — reflection records that preserve evidence and identity state transitions.

## Core invariants

1. **Soul is Root-only.** Task Ralph workers never inherit Soul directly.
2. **Constraints are task-local.** The Root Agent compiles objective, context, and constraints for workers at task start.
3. **Reflection is still Ralph.** Reflection uses the same Ralph Task and Ralph Report contract as ordinary work.
4. **mPFC adds metadata, not a second report schema.** Reflection records wrap the native Ralph Report with derived identity metadata.
5. **Negative reflection results are first-class records.** A reflection that concludes “no Soul change” is still retained.
6. **Soul changes require review.** A Soul-Ralph proposes changes; it does not silently become the identity it edits.

See `docs/` for the runtime and reflection model.
