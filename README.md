# agent-identity

A minimal workspace for experimenting with persistent agent identity and reflection.

This repository preserves the universal Core, identity state, and reusable skills. It does **not** own project constraints.

- `core/` — the explicitly maintained universal execution method (currently Core v1.0.3); storing it does not automatically load it into any agent runtime.
- `soul/` — the current effective identity presented to the Root Agent.
- `principles/` — durable cross-project working principles distilled from repeated evidence.
- `mpfc/` — reflection records that preserve evidence and identity state transitions.
- `.agents/skills/` — reusable task-scoped runtime skills.
- `docs/` — integration, Reflection semantics, and reusable design references.
- `library/` — reusable, on-demand technical development guides (not runtime Skills).

## Repository layout

```text
agent-identity/
├── core/
│   └── CORE.md
├── soul/
│   └── SOUL.md
├── principles/
│   └── PRINCIPLES.md
├── mpfc/
│   ├── README.md
│   └── reflection.template.md
├── .agents/
│   └── skills/
│       ├── ponytail/
│       │   └── SKILL.md
│       ├── ralph/
│       │   └── SKILL.md
│       ├── project-team/
│       │   └── SKILL.md
│       ├── systematic-pipeline-debugging/
│       │   └── SKILL.md
│       ├── skill-authoring/
│       │   └── SKILL.md
│       ├── core-authoring/
│       │   └── SKILL.md
│       ├── dependency-risk-testing/
│       │   └── SKILL.md
│       └── evidence-led-ui-design/
│           ├── SKILL.md
│           ├── README.md
│           └── references/
├── docs/
│   ├── runtime.md
│   ├── task-contract.md
│   ├── reflection.md
│   ├── skill-design.md
│   └── skill-design-research.md
└── library/
    └── react-cordis.md
```

A project keeps its own constraints in that project's workspace. The exact filename and structure are project concerns, not part of the identity schema.

## Repository invariants

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

The canonical, human-authored [Core v1.0.3](core/CORE.md) defines the universal method. The separate `.agents/skills/core-authoring/SKILL.md` explains how to design and review a Core, not what is currently loaded. The reusable skill design method lives in `.agents/skills/skill-authoring/SKILL.md`.

`.agents/skills/evidence-led-ui-design/SKILL.md` is a provisional AI UI/UX design and review method. Its references preserve research, evaluation boundaries, and questions for professional review; it has not yet been validated in a real product.

`.agents/skills/dependency-risk-testing/SKILL.md` captures a reusable testing method that derives focused stability tests from production dependency risk rather than from feature lists, bug history, or coverage targets.

`.agents/skills/project-team/SKILL.md` coordinates an evolving team of persistent ChatGPT Project conversations, using project artifacts and GitHub rather than a custom team runtime.

The broader skill-design rationale is in `docs/skill-design.md`, with comparative research and dogfooding evidence in `docs/skill-design-research.md`.

The [React + Cordis Web guide](library/react-cordis.md) distills the plugin/runtime/UI integration pattern as an on-demand reference.

The [Function-first Cordis Plugin Programming guide](library/function-first-cordis-plugin-programming.md) records practical patterns for explicit state, pure computation, and lifecycle-owned effects without banning Cordis `Service` classes.
