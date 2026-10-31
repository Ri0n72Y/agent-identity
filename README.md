# agent-identity

A minimal workspace for experimenting with persistent agent identity and reflection.

This repository preserves the universal Core, identity state, and reusable skills. It does **not** own project constraints.

- `core/` — the explicitly maintained universal execution method (currently Core v1.0.3); storing it does not automatically load it into any agent runtime.
- `soul/` — the current effective identity presented to the Root Agent.
- `principles/` — durable cross-project working principles distilled from repeated evidence.
- `mpfc/` — reflection records that preserve evidence and identity state transitions.
- `.agents/skills/` — reusable task-scoped runtime skills.
- `docs/` — memory and self-continuity design, runtime integration, Reflection semantics, and reusable references.
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
│       ├── agents-md-authoring/
│       ├── core-authoring/
│       ├── dependency-risk-testing/
│       ├── evidence-led-ui-design/
│       ├── frontend-development/
│       ├── paper-writing/
│       ├── ponytail/
│       ├── project-team/
│       ├── react-component-coding/
│       ├── react-component-review/
│       ├── skill-authoring/
│       └── systematic-pipeline-debugging/
├── docs/
│   ├── memory-model.md
│   ├── memory-workflow.md
│   ├── reflection.md
│   └── runtime.md
├── library/
│   ├── function-first-cordis-plugin-programming.md
│   └── react-cordis.md
└── research/
    └── slow-reading/
        ├── background.md
        └── paper-plan.md
```

Each Skill directory contains a `SKILL.md`; some also contain on-demand `references/` or other supporting files. The layout above lists primary entries rather than every reference file.

A project keeps its own constraints in that project's workspace. The exact filename and structure are project concerns, not part of the identity schema.

## Repository invariants

1. **SOUL is Root-only.** Task workers do not inherit the identity workspace by default.
2. **Constraints belong to projects.** Identity does not generate, store, or masquerade as project constraints.
3. **Principles are distilled defaults, not constraints.** They may emerge from repeated project evidence, but explicit project constraints always remain project-owned.
4. **Reflection uses the consuming Harness.** The identity model does not prescribe a separate worker protocol or execution framework.
5. **mPFC preserves reviewed reasoning and evidence.** Reflection records retain interpretations, relevant sources, and identity state transitions without prescribing a worker report schema.
6. **Negative reflection results are first-class records.** A reflection that concludes “no identity change” is still retained.
7. **Identity changes require review.** Reflection may propose changes to SOUL or Principles; it does not silently apply them.
8. **Conclusions and provenance stay distinct.** SOUL carries current conclusions and may begin from a human-authored definition; mPFC explains how experience informs and revises those conclusions. Short preserves cross-context state, Episode records events and conclusions, and concrete facts and source materials belong in a Bookshelf, outside this repository's current runtime implementation.

## First experiment

1. Put the initial effective identity into `soul/SOUL.md`.
2. Keep any durable initial working defaults in `principles/PRINCIPLES.md`.
3. Select evidence from real work, including project constraints when they are relevant evidence.
4. Review relevant evidence through the consuming Harness's available reflection process.
5. Review any proposed Soul or Principle diff.
6. Record the result in `mpfc/` whether identity changed or not.
7. Apply the identity patch only after review.

The [memory model](docs/memory-model.md) defines the agreed Short → Reflection → Episode (Experience/Event) consolidation path, Diary indexing, Bookshelf, and mPFC/SOUL boundaries. The [memory workflow guide](docs/memory-workflow.md) explains the lifecycle, contents, retrieval routes, and illustrative file layout. Both describe the design, not a deployed memory service. The integration boundary is documented in `docs/runtime.md`; the identity Reflection loop is in `docs/reflection.md`.

The canonical, human-authored [Core v1.0.3](core/CORE.md) defines the universal method. The separate `.agents/skills/core-authoring/SKILL.md` explains how to design and review a Core, not what is currently loaded. The reusable skill design method lives in `.agents/skills/skill-authoring/SKILL.md`.

`.agents/skills/evidence-led-ui-design/SKILL.md` is a reusable AI UI/UX design and review method. Its references cover design discovery, evaluation, and research evidence.

`.agents/skills/dependency-risk-testing/SKILL.md` captures a reusable testing method that derives focused stability tests from production dependency risk rather than from feature lists, bug history, or coverage targets.

`.agents/skills/project-team/SKILL.md` coordinates an evolving team of persistent ChatGPT Project conversations, using project artifacts and GitHub rather than a custom team runtime.

The broader skill-design rationale lives in [design-rationale.md](.agents/skills/skill-authoring/references/design-rationale.md), with comparative research and dogfooding evidence in [research-history.md](.agents/skills/skill-authoring/references/research-history.md).

The [React + Cordis Web guide](library/react-cordis.md) distills the plugin/runtime/UI integration pattern as an on-demand reference.

The [Function-first Cordis Plugin Programming guide](library/function-first-cordis-plugin-programming.md) records practical patterns for explicit state, pure computation, and lifecycle-owned effects without banning Cordis `Service` classes.
