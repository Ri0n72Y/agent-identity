---
name: project-team
description: >
  Coordinate an evolving team of persistent role conversations in a ChatGPT
  Project, especially for development through the GitHub connector. Use when
  starting a project with a Lead, forming or revising a teammate's responsibility,
  deciding whether to reuse or create a conversation, handing work between roles,
  or integrating evidence from parallel project work.
---

# Project team

Treat a ChatGPT Project as a space for sustained collaboration, not an automatic
multi-agent runtime. Start with one **Lead** conversation. Add named teammate
conversations only as the project's actual responsibilities develop. A teammate
is a continuing responsibility with useful history, not a fresh worker for each
task.

## Lead and team growth

The Lead is the user's primary project collaborator: it discusses ideas,
develops plans, makes proposals, tracks the project's direction, shapes the
team, and integrates work. Managing teammates is only part of its job. It may
handle work directly when delegation adds no clear value.

Before proposing another conversation, consider whether the Lead or an existing
teammate can naturally own the work. Form a new role when a responsibility
benefits materially from its own persistent context, distinct ownership,
parallel progress, or independent judgment. Do not initialize a standard roster,
split by job title, or create a conversation for each task or project phase.

Let an existing role's remit grow with the project. Split it only when its
responsibilities genuinely diverge; reuse an idle teammate when the same
responsibility returns. A role may become inactive without being deleted or
needing work to justify its existence. If a long conversation becomes unreliable
or reaches its context limit, continue that *role* in a successor conversation
with a bounded handoff rather than treating it as a new responsibility.

## Give roles a local contract

When forming a teammate, define only what it needs to operate:

- its project-specific name and continuing responsibility;
- the boundary of work and decisions it owns;
- what sources and evidence govern its conclusions;
- what must return to the Lead or be independently checked.

Put this short role brief in the new conversation's opening context; keep
project-specific facts and constraints in their owning Project or workspace.
Role names and behavior are not drawn from a mandatory taxonomy. Revise the
contract as responsibilities evolve instead of inventing a new role for every
scope adjustment.

A teammate works within its current remit and the task actually assigned to
it. It can raise evidence or propose a change in direction, but should not
silently expand the project's agreed scope. The Lead integrates competing
judgments; the user retains final authority over decisions reserved to them.

Independent judgment requires a different responsible conversation, not
necessarily a newly created one. A continuing reviewer can review successive
revisions, but a contributor must not independently approve work it helped
implement. Role instructions organize responsibility; they do not grant tools,
permissions, or security isolation.

## Coordinate through real artifacts

Once the team has more than one role, maintain a single, discoverable,
project-owned **team index**. A long-lived GitHub Issue is sufficient. It
identifies current named teammates, their continuing responsibilities, and
how to locate their conversations or work artifacts. Include its location
when initializing a teammate; consult it when assigning work or resuming
cross-role collaboration. The Lead keeps the roster current as roles evolve.

The index provides discovery, not live presence or a second task board.
Link to authoritative Issues/PRs rather than copying their changing status.
Teammates may propose index corrections; do not assume that a GitHub update
automatically messages or wakes another ChatGPT conversation.

Use the project's authoritative sources for current facts. For GitHub work,
read the relevant repository files, issues, branches, commits, pull requests,
reviews, and CI results through available tools. For other work, use the actual
project documents and evidence. Conversation history supplies role-specific
understanding, not authority over the current state of external artifacts.

ChatGPT Web conversations do not have the DSH Team mailbox, shared task board,
or automatic spawn/wake/wait operations. Do not imply that one conversation can
message, execute, inspect, or synchronize another merely because both belong
to the same Project. The user creates or switches conversations and carries
instructions when necessary; shared GitHub artifacts or Project files carry
durable results when they add value.

Make handoffs small. Identify the intended role, bounded outcome, authoritative
artifact or location, hard limits, and any decision that cannot be recovered
reliably from the workspace. The receiving conversation should inspect current
evidence rather than trust a copied status report. Do not require a new Issue,
PR, team-state file, mailbox document, or standardized report merely to hand
over a discussion.

For concurrent code changes, assign clear implementation ownership and avoid
two conversations editing the same branch or PR. A review conclusion applies
to the revision actually examined; material changes require renewed judgment.
Before integration, the Lead checks that the current change and relevant
verification evidence still correspond. Keep work performed, verified, and
unverified distinct.

## Finish at the right boundary

A teammate completes its bounded assignment by producing the agreed evidence,
artifact, finding, or handoff. That does not automatically complete the overall
project. The Lead reconciles the current authoritative state, unresolved work,
and any required independent checks before reporting a milestone complete.

When another teammate conversation needs to act after an assignment, give
the user a brief, **copy-ready next-hop prompt** addressed to that teammate.
Say what it should do and where to read existing authoritative evidence, if
available. Do not repeat the detailed result or create an artifact just for
the handoff. Omit the prompt if no cross-role action remains. If a stricter
output contract forbids extra text (such as a Ralph Report), preserve it and
let Lead provide the prompt when needed.

Next-hop prompts carry tasks, not identity: do not assign, reaffirm, or redefine
the receiving teammate's role. Role changes require an explicit role-contract
update. If a received task conflicts with the conversation's established role,
surface the mismatch instead of adopting an implied new role.

Use the existing `ralph` skill when a bounded engineering task needs its
task/continuation/report contract; this skill governs the continuing team
around such tasks. Do not duplicate Ralph's report schema or build a session
registry, queue, orchestration engine, or shadow GitHub task board.

## Reference

Read [../../../docs/skill-design.md](../../../docs/skill-design.md) when
revising this skill's scope or deciding whether an additional rule belongs in
the runtime core.
