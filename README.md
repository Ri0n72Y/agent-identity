# agent-identity

A minimal workspace for experimenting with persistent agent identity and reflection.

This repository preserves the universal Core, identity state, and reusable skills. It does **not** own project constraints.

- `core/` — the explicitly maintained universal execution method (currently Core v1.0.3); storing it does not automatically load it into any agent runtime.
- `soul/` — the current effective identity presented to the Root Agent.
- `principles/` — durable cross-project working principles distilled from repeated evidence.
- `mpfc/` — explanations and evidence for reflected changes to self-understanding or behavior; its updates trigger SOUL compression.
- `.agents/skills/` — reusable task-scoped runtime skills.
- `docs/` — memory and slow-reading workflows, self-continuity design, runtime integration, Reflection semantics, and reusable references.
- `research/slow-reading/` — the optional slow-reading research paper and its background; this is not the operational workflow.
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
│   ├── memory-workflow_ZH.md
│   ├── slow-reading-workflow.md
│   ├── reflection.md
│   ├── runtime.md
│   └── slow-reading-workflow.md
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
5. **mPFC has a change gate.** Only an Experience that Reflection explicitly determines changes the agent's self-understanding or behavior enters mPFC; the change retains its explanation and evidence.
6. **No-change Reflection remains in Experience.** It does not write mPFC or trigger SOUL compression.
7. **mPFC updates trigger SOUL compression.** The resulting concise identity proposal requires review before becoming effective; it is never silently applied.
8. **Conclusions and provenance stay distinct.** SOUL carries compressed current conclusions and may begin from a human-authored definition; mPFC explains Experience-driven changes to cognition or behavior. Short preserves cross-context state, Episode records relevant Experiences and other Events, and concrete facts and source materials belong in a Bookshelf, outside this repository's current runtime implementation.

## First experiment

1. Put the initial effective identity into `soul/SOUL.md`.
2. Keep any durable initial working defaults in `principles/PRINCIPLES.md`.
3. Consolidate Episodes; classify agent-related, user-related, or shared interactions as Experience, and other events as Event.
4. Reflect on selected Experiences. Retain no-change results with Experience; only a determination that self-understanding or behavior changes enters `mpfc/`.
5. A qualifying mPFC update triggers compression into a concise proposed SOUL state.
6. Review the proposed SOUL or Principle change before applying it.

The [memory model](docs/memory-model.md) defines Short → Reflection → Episode (Experience/Event), Diary indexing, Bookshelf, and the change-gated Experience → Reflection → mPFC → SOUL compression path. The memory workflow guides — [English](docs/memory-workflow.md) / [简体中文](docs/memory-workflow_ZH.md) — explain the lifecycle, the shared latest-first memory entry notation, Diary aggregation, retrieval routes, and illustrative file layout. Both describe the design, not a deployed memory service. The integration boundary is documented in `docs/runtime.md`; the identity Reflection loop is in `docs/reflection.md`.

The canonical, human-authored [Core v1.0.3](core/CORE.md) defines the universal method. The separate `.agents/skills/core-authoring/SKILL.md` explains how to design and review a Core, not what is currently loaded. The reusable skill design method lives in `.agents/skills/skill-authoring/SKILL.md`.

`.agents/skills/evidence-led-ui-design/SKILL.md` is a reusable AI UI/UX design and review method. Its references cover design discovery, evaluation, and research evidence.

`.agents/skills/dependency-risk-testing/SKILL.md` captures a reusable testing method that derives focused stability tests from production dependency risk rather than from feature lists, bug history, or coverage targets.

`.agents/skills/project-team/SKILL.md` coordinates an evolving team of persistent ChatGPT Project conversations, using project artifacts and GitHub rather than a custom team runtime.

The broader skill-design rationale lives in [design-rationale.md](.agents/skills/skill-authoring/references/design-rationale.md), with comparative research and dogfooding evidence in [research-history.md](.agents/skills/skill-authoring/references/research-history.md).

The [React + Cordis Web guide](library/react-cordis.md) distills the plugin/runtime/UI integration pattern as an on-demand reference.

The [Function-first Cordis Plugin Programming guide](library/function-first-cordis-plugin-programming.md) records practical patterns for explicit state, pure computation, and lifecycle-owned effects without banning Cordis `Service` classes.

The [slow-reading workflow](docs/slow-reading-workflow.md) describes staged reading, provisional interpretation, meaningful checkpoints, revision, continuation, and memory boundaries. It is a general working method alongside the memory architecture, not an experiment or a deployed plugin. The separate [paper plan](research/slow-reading/paper-plan.md) and [background](research/slow-reading/background.md) remain research materials and do not define runtime behavior.
