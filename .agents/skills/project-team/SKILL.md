---
name: project-team
description: >
  Coordinate persistent teammate conversations in a ChatGPT Project using
  GitHub Issues for member discovery, task requests, work status, and results.
  Use when forming roles, assigning or resuming work, coordinating reviews,
  or integrating cross-conversation results.
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

When starting the Lead conversation, create its Member Issue with its
continuing responsibility, `status: idle` and `latestwork: "-"` in the
body, then post the first Request. Lead does the same for each new
teammate and includes that Member Issue link in its initialization prompt.
Once another member joins, Lead maintains a **team index** linking their
Member Issues. Lead also receives and handles work through its own Issue.

To assign work, append a YAML-fenced comment to the recipient's Issue.
Use only `from` (sender's member Issue URL, or `user`) and `request`
(a short task or list of tasks). Its comment URL identifies the request
batch. Multiple senders may append requests without editing each other's
records.

On activation or resumption, read the member Issue. If `status: busy`,
inspect the Request linked in `latestwork` and any matching Result before
starting different work. Match Request comments against Result `task`
links to find pending work. Otherwise take the oldest pending Request,
unless the user or Lead sets another priority. `idle` does not mean
all requests are complete.

Each member maintains `status` and `latestwork` in **its own Issue
body**, alongside its responsibility. Use `busy` while working and
`idle` after finishing. `latestwork` is one short sentence with the
current request comment URL when busy, or the latest result comment URL
when idle. The member edits its own body when starting and finishing;
other members only append requests.

On completion, append a YAML-fenced **result** comment with `task`
(the request comment URL), `result`, `start`, and `end`; include
`handoff` only when the completing member has posted a next request
to **another member's Issue**. Its value is a short description of that
next assignment followed by its Request comment URL. Do not use `handoff`
for incoming tasks, suggested actions, or PR links. `result` begins
with a short natural-language outcome; when a list,
put that sentence first and evidence links after it.
Record start and end as ISO 8601 timestamps with time zone. Post the
result before changing the Issue body to `idle`. Detailed work stays
in the linked Issue, PR, or project artifact.

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

Next-hop prompts carry tasks, not identity: do not assign, reaffirm, or redefine
the receiving teammate's role. Role changes require an explicit role-contract
update. If a received task conflicts with the conversation's established role,
surface the mismatch instead of adopting an implied new role.

Use the member Issue Request/Result protocol for team coordination. Do not
add a second task board, status store, queue, or reporting format.

## Reference

Read [../skill-authoring/references/design-rationale.md](../skill-authoring/references/design-rationale.md)
when reconsidering this skill's scope. Review
[references/research-history.md](references/research-history.md) when revisiting
the member-Issue protocol or its design evidence; do not load it for routine work.
