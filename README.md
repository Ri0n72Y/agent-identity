# agent-identity

A minimal workspace for experimenting with persistent agent identity and reflection.

This repository owns identity state. It does **not** own project constraints.

- `soul/` — the current effective identity presented to the Root Agent.
- `principles/` — durable cross-project working principles distilled from repeated evidence.
- `mpfc/` — reflection records that preserve evidence and identity state transitions.
- `skills/` — reusable task-scoped runtime skills.
- `docs/` — integration, Reflection semantics, and reusable design references.

## Repository layout

```text
agent-identity/
├── soul/
│   └── SOUL.md
├── principles/
│   └── PRINCIPLES.md
├── mpfc/
│   ├── README.md
│   └── reflection.template.md
├── skills/
│   ├── skill-authoring/
│   │   └── SKILL.md
│   └── core-authoring/
│       └── SKILL.md
└── docs/
    ├── runtime.md
    ├── task-contract.md
    ├── reflection.md
    ├── skill-design.md
    └── skill-design-research.md
```

A project keeps its own constraints in that project's workspace. The exact filename and structure are project concerns, not part of the identity schema.

## Core invariants

1. **Soul is Root-only.** Task Ralph workers never inherit Soul directly.
2. **Constraints belong to projects.** Identity does not generate, store, or masquerade as project constraints.
3. **Principles are distilled defaults, not constraints.** They may emerge from repeated project evidence, but explicit project constraints always remain project-owned.
4. **Reflection is still Ralph.** Reflection uses the same Ralph Task and Ralph Report contract as ordinary work.
5. **mPFC adds metadata, not a second report schema.** Reflection records wrap the native Ralph Report with derived identity metadata.
6. **Negative reflection results are first-class records.** A reflection that concludes “no identity change” is still retained.
7. **Identity changes require review.** A Soul-Ralph may propose changes to Soul or Principles; it does not silently apply them.

## First experiment

1. Put the initial effective identity into `soul/SOUL.md`.
2. Keep any durable initial working defaults in `principles/PRINCIPLES.md`.
3. Select evidence from real work, including project constraints when they are relevant evidence.
4. Run an ordinary Reflection Ralph over the identity workspace and selected evidence.
5. Review any proposed Soul or Principle diff.
6. Record the result in `mpfc/` whether identity changed or not.
7. Apply the identity patch only after review.

The integration boundary is documented in `docs/runtime.md`; the shared Ralph contract is in `docs/task-contract.md`; the Reflection loop is in `docs/reflection.md`.

The reusable skill design method lives in `skills/skill-authoring/SKILL.md`. The first dogfooding target, `skills/core-authoring/SKILL.md`, is intentionally self-contained: it combines the Core's Marxist methodological interpretation with the rules for designing and reviewing that Core in one runtime document.

The broader skill-design rationale is in `docs/skill-design.md`, with comparative research and dogfooding evidence in `docs/skill-design-research.md`.
