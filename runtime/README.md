# Runtime

Runtime state is intentionally separate from Soul.

At task start, the Root Agent reads the current Soul and the user's request, then compiles the task-local contract for a Ralph worker.

`constraints.md` is the optional local scratch representation of those compiled constraints. It is ignored by Git because it is task-specific runtime state, not identity.

The worker receives the task contract. It does **not** receive Soul directly.

See `../docs/runtime.md` and `../docs/task-contract.md`.
