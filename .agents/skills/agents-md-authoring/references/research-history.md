# AGENTS.md authoring — research and decision history

> Compiled 2026-10-25 from the RDDSH AGENTS.md investigation and a direct inspection of upstream practice. Historical provenance, **not runtime instructions**. The associated `SKILL.md` is intentionally smaller. Source assertions, interpretation, and open questions are separated below.

## 1. Research questions and process

The investigation asked what a concise and effective repository `AGENTS.md` should say; whether root and nested guidance should differ; what belongs in docs versus a Skill; and whether persistent instructions help coding agents in practice.

Process: (1) inspect the open AGENTS.md convention and runtime documentation; (2) examine real repository files, especially DeepSeek Harness (DSH) and the OpenAI Agents Python SDK; (3) compare the GitHub practitioner guide with formal Copilot documentation; (4) read two empirical studies with different outcomes; (5) translate the findings into small, testable authoring decisions.

The target repository `Ri0n72Y/agent-identity` was also inspected on its default branch on 2026-10-25. No `agents-md-authoring` Skill or repository `AGENTS.md` existed in its tree. Its `skill-authoring/SKILL.md` and `docs/skill-design.md` already establish the separation of compressed runtime decisions from dated provenance archives. This research stays in the new Skill rather than duplicating repository-wide design documents.

## 2. Sources and direct observations

### Open AGENTS.md convention

- [AGENTS.md project](https://agents.md/) — plain Markdown without required headings or schema; root files and nested files are supported as a convention. It describes nearby instructions taking precedence. This does **not** specify every runtime’s exact discovery and conflict handling.
- [Codex prompting guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide) — describes loading from user scope through root to the working directory, ordered from general to specific. Treat its semantics as Codex-specific.
- [GitHub Copilot custom instructions](https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions) — explicitly distinguishes repository instruction files from custom agent definitions in `.github/agents`; feature and client support varies, as can precedence.
- [GitHub Copilot Skills](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills) — distinguishes broad standing custom instructions from task-scoped Skills. Supports the content ownership split, not an absolute maximum file size.

### Actual repository and runtime examples

- [DeepSeek Harness root AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/AGENTS.md) — a large monorepo standing-order file with real package commands, version and persistence constraints, Cordis lifecycle rules, and links to specialized Skills and architecture documents. Strong example of precise project-specific hazards, **not** a suitable length/template for a small plugin.
- [DeepSeek Harness docs/AGENTS.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/AGENTS.md) — assigns facts to owning document tiers: root AGENTS.md for standing instructions, subtree AGENTS.md for local rules, architecture/reference for explanation, and Skills for procedures. Its one-to-three-line guidance is a DSH editorial choice, not a universal requirement.
- [DSH agent instructions package](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/context/agent-instructions/README.md) and [product documentation](https://dsh.pub/zh/plugins/agent-instructions/) — DSH has its own candidate, budget, refresh, and deduplication behavior. Filesystem-mediated discovery does not imply that shell-only directory switching loads a nested instruction file. Do not transfer these details to Codex/Copilot.
- [OpenAI Agents Python AGENTS.md](https://github.com/openai/openai-agents-python/blob/main/AGENTS.md) — release- and security-critical policies, conditional Skill triggers, and task-specific verification. A complex production SDK needs more detail than a small repository, but the useful transferable feature is a precise condition linked to an owned workflow.
- [OpenAI OSS maintenance case](https://developers.openai.com/blog/skills-agents-sdk) — illustrates division between repo-wide policy, Skills, and automated checks. The report of higher PR throughput is observational and cannot isolate the effect of AGENTS.md alone.
- [GitHub practitioner article](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — recommends exact commands, boundaries, and concrete examples from 2,500+ files. Its illustrative `.github/agents/docs-agent.md` is a **custom agent definition**, not the same artifact as root `AGENTS.md`; do not import its persona/frontmatter advice as a root AGENTS.md requirement.

### Empirical evidence and its limits

- [Gloaguen et al., Evaluating AGENTS.md (2026)](https://arxiv.org/abs/2602.11988) — compared agent performance with generated and developer-provided context in different tasks. Reports no general success-rate benefit (some comparisons worsen) and more than 20% additional inference cost; notes that agents do follow instructions and can be driven toward excessive exploration. This supports caution about unnecessary requirements, not a universal ban on AGENTS.md.
- [Lulla et al., On the Impact of AGENTS.md (2026)](https://arxiv.org/abs/2601.20404) — 10 repositories, 124 PR-derived tasks, with/without the historical AGENTS.md. Reports median runtime 28.64% lower and output tokens 16.58% lower, with comparable completion behavior. The setting and measured outcomes differ from the preceding study; no single number establishes a causal benefit for every agent, task, or repository.

## 3. Comparison and design judgments

**Observed agreement:** Project boundaries, risky compatibility contracts, and exact usable commands can be helpful when they are not easily inferred. A link to a canonical owner avoids turning the root instruction into an encyclopedia. Scoped instructions and on-demand Skills reduce irrelevant standing context when the runtime supports them.

**Observed tension:** How much information to provide is contested. Practitioner articles often favor broad coverage and examples; the negative study shows that additional requirements can increase exploration cost; the positive study suggests that a well-matched file can reduce search effort. A fixed 20–40-line limit, six mandatory sections, or a requirement to document the whole tech stack is therefore not justified as an invariant.

**Adopted judgment:** Treat each instruction as a candidate behavioral intervention. Include it when the task would plausibly go wrong or waste effort without it, and when a link, exact fact, or conditional rule improves that failure. Preserve important safety/data/compatibility constraints even if a very small file would be aesthetically cleaner.

**Authoring sequence:** inspect actual repository and supported runtime → locate instruction ownership → identify high-value non-obvious standing constraints → express them briefly and conditionally → cross-check paths/commands/overlays → test with relevant representative tasks when practical. This is an authoring method, not a script every coding task must perform.

**File ownership:** root AGENTS.md covers broadly recurring repo behavior; nested AGENTS.md only local deltas; README/docs explain why and how; Skills provide task-specific workflows; plans/issues/PRs hold transient decisions; CI/types/linters/permissions enforce deterministic constraints. An instruction may link a Skill where activation on a significant class of work is essential; it should not import its full body or require every Skill on every task.

## 4. Rejected approaches and counterexamples

- **Copy the upstream DSH AGENTS.md:** rejected for small plugins because it includes monorepo-specific architecture, releases, and checks. Copy only a verified invariant that exists in the target project.
- **Give every AGENTS.md a persona and YAML frontmatter:** rejected. This confuses root repository instructions with custom agent definition formats; AGENTS.md uses ordinary Markdown.
- **Always list every directory and dependency:** rejected. Code and manifests usually already provide them. Include navigation only if it solves a real discovery problem.
- **Always read all docs/Skills first or always run the full CI suite:** rejected as universal. Both may create redundant work. Some high-risk projects do have justified gates; preserve those gates explicitly.
- **Make all instructions ultra-short by counting lines:** rejected. High-impact state-preservation or compatibility rules may need more text than a cosmetic style preference.
- **Duplicate the same rule in README, root instructions, and every subtree:** rejected. This creates conflicting owners and stale copies; local files should add only local differences.
- **Assume writing AGENTS.md guarantees compliance:** rejected. Tool permissions, tests, and genuine runtime checks remain separate evidence and controls.

## 5. Practical audit probes (proposed, not completed experiments)

Compare an unchanged agent/runtime and repository snapshot with and without one candidate instruction. Suitable representative cases are: a docs-only edit that should not trigger a full test suite; a behavior fix requiring a focused test; and a DSH plugin integration where a successful source import does not establish installed-host behavior.

Observe task outcome, unrelated files touched, unnecessary reads/checks, actual validation fidelity, execution time, token use, and errors induced by the rule. One successful run is weak evidence. Preserve rules that help a real recurring risk; remove or narrow rules whose effect is only ceremony.

## 6. When to revisit

Reopen this archive if the target runtime changes discovery/precedence semantics, a new empirical result resolves part of the evidence conflict, repeated agent failures expose an absent project constraint, or a current AGENTS.md rule causes demonstrably unnecessary work. Retest the smallest affected rule rather than adding a new taxonomy or compulsory workflow.

Source claims above are dated to the review and may change. Archive citations explain the origin of the Skill; they are not authority over the target repository’s current code or user instructions.
