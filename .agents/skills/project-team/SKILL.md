---
name: project-team
description: >
  Coordinate persistent roles across one or more ChatGPT Project conversations,
  sharing GitHub Member Issues for role contracts, task requests, work status,
  and results. Use when creating roles, assigning or resuming work, coordinating
  reviews, or integrating cross-conversation results.
---

# Project team

Treat a ChatGPT Project as a space for sustained collaboration without an
automatic multi-agent runtime. Start with the **Lead** role. A role is a
continuing responsibility; multiple conversations may serve the same role
and share its Member Issue, task pool, and linked project background.

## Lead and team growth

The Lead is the user's primary project collaborator: it discusses ideas,
develops plans, makes proposals, tracks the project's direction, shapes the
team, and integrates work. Managing teammates is only part of its job. It may
handle work directly when delegation adds no clear value.

Before adding a role, consider whether Lead or an existing role can own the
responsibility. Create a new role when its continuing work needs distinct
ownership, context, or independent judgment. For additional capacity or a
conversation reaching its context limit, open another conversation under the
existing role and reuse its Member Issue. Do not create roles per task or phase.

A role's remit can grow or become inactive. Split it only when continuing
responsibilities diverge; a successor conversation retains the same role.

## Give roles a local contract

When forming a teammate, define only what it needs to operate:

- its project-specific name and continuing responsibility;
- the boundary of work and decisions it owns;
- what sources and evidence govern its conclusions;
- what must return to the Lead or be independently checked.

The Member Issue body is the source for the role's current responsibilities
and boundaries. Initialize every conversation with the role identity and
Member Issue link; it reads the current remit and linked background there.
After an explicit role change is agreed, update that Issue's contract;
a new task or conversation does not change the role. Keep project
constraints in their owning Project or workspace.

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

When a role is created, Lead creates its one long-lived Member Issue,
including for Lead itself. Write the role's responsibility and initial
`status: idle` / `latestwork: "-"` in the body, then post the first
Request. All conversations of that role reuse its Issue and shared task
records; opening another conversation does not create another Member Issue.
When a second role joins, Lead maintains a **team index** linking role Issues.
Lead also receives and handles work through its own Issue.

To assign work, append a YAML-fenced comment to the recipient's Issue.
Use only `from` (sender's member Issue URL, or `user`) and `request`
(a short task or list of tasks). Its comment URL identifies the request
batch. Multiple senders may append requests without editing each other's
records.

On activation or resumption, read the role's Member Issue and linked work.
Match Request comment URLs with Result `task` links to identify pending work.
When `status: busy`, inspect `latestwork` but do not assume it lists all
active work. Resume only this conversation's work or an explicitly handed-off
Request; assign distinct Requests explicitly before working in parallel.
When `status: idle`, take the oldest pending Request unless the user or Lead
sets another priority. An unmatched Request may already be in progress;
`idle` does not imply an empty task pool.

Conversations serving a role maintain `status` and `latestwork` in
that role's Issue body. Use `busy` for active work and `idle` when no
work is known to be active; `latestwork` is a short description and
Request or Result comment URL. These fields are a shared snapshot, not a
claim lock or a complete list of active conversations. Read the current
body before updating it; do not mark the role idle while another known
conversation is working. Other roles only append Requests.

On completion, append a YAML-fenced **result** comment with `task`
(the request comment URL), `result`, `start`, and `end`; include
`handoff` only when the completing member has posted a next request
to **another member's Issue**. Its value is a short description of that
next assignment followed by its Request comment URL. Do not use `handoff`
for incoming tasks, suggested actions, or PR links. `result` begins
with a short natural-language outcome; when a list,
put that sentence first and evidence links after it.
Record start and end as ISO 8601 timestamps with time zone. Post the
Result before updating the role status; set `idle` only if no other
role conversation is known to be working. Detailed work stays in
linked Issues, PRs, or project artifacts.

Consult current project artifacts for work facts; check relevant files,
Issues/PRs, reviews, and CI rather than relying on copied conversation status.
Member conversations cannot automatically message or wake each other.
The user activates the receiving conversation; GitHub records retain the work.

Keep handoffs short: intended member, outcome, Request or artifact link,
and material constraints. The recipient reads the current evidence;
do not create separate handoff documents.

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
available. When `Result.handoff` assigns that work, reference the same
posted Request comment URL in the copy-ready prompt. Do not repeat the
detailed result or create an artifact just for the handoff. Omit the prompt
if no cross-role action remains. If a stricter output contract forbids
extra text, preserve it and let Lead provide the prompt when needed.

Next-hop prompts carry tasks, not identity: they do not redefine the
receiving role. If a Request conflicts with the Member Issue's current
role contract, surface the mismatch rather than silently changing roles.

Use the member Issue Request/Result protocol for team coordination. Do not
add a second task board, status store, queue, or reporting format.

## Reference

Read [../skill-authoring/references/design-rationale.md](../skill-authoring/references/design-rationale.md)
when reconsidering this skill's scope. Review
[references/research-history.md](references/research-history.md) when revisiting
the member-Issue protocol or its design evidence; do not load it for routine work.
