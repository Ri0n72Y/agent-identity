---
name: agents-md-authoring
description: Create, update, review, or simplify repository AGENTS.md instructions, including nested guidance and separating standing project constraints from documentation and on-demand Skills. Use for AGENTS.md authoring or audits, not for agent persona definitions or general Skill creation.
---

# AGENTS.md authoring

Create the smallest useful, repository-owned standing instructions. `AGENTS.md` is not a second README, a complete project manual, or an agent persona.

## Author or revise

1. Inspect the target repository before writing: existing instruction files and their applicable scopes, actual code and docs, build/test commands, supported versions, and any user-specified constraints. Check the target agent runtime when precedence or discovery matters.
2. Keep a rule only if it changes recurring agent behavior: a non-obvious project boundary, an expensive failure to avoid, a special convention, a critical verification seam, or a precise route to the source of truth. Prefer verified project facts over generic advice.
3. Place broadly applicable standing rules in root `AGENTS.md`; place genuinely local rules in a scoped `AGENTS.md` when supported. Put detailed explanations in owned docs, task workflows in Skills, transient plans in task artifacts, and enforceable checks in tooling. Link to the authoritative owner instead of duplicating it.
4. Write each retained rule as a concrete, actionable constraint or conditional instruction. Give exact paths and commands only after checking them. Scope validation to affected behavior; do not require blanket reading, full-suite testing, or ceremony without a project-specific reason.
5. On revision, preserve still-valid project constraints. Remove duplicates, vague virtues, obsolete instructions, conflicting guidance, and rules that simply describe what code already makes obvious. Avoid adding compatibility or process requirements the project does not support.
6. Verify the resulting Markdown, paths, links, commands, scopes, and interactions with existing instructions. Distinguish checks performed from behavior that still requires a real-agent run. Report the changes and unresolved assumptions.

## Judgment boundary

- Prefer a missing but useful rule over a polished but unnecessary one. Do not target an arbitrary line count or mandatory section template.
- Do not transplant another repository’s rules or assume that all agent runtimes load nested files identically.
- Review a sample of representative tasks when evidence is needed to decide whether an instruction helps. Revise or remove rules that cause needless exploration or testing.

The dated research and source comparisons live in `references/research-history.md`; **do not load that archive during routine AGENTS.md authoring**. Read it when revisiting the rationale, studying conflicting guidance, or evaluating the Skill itself.
