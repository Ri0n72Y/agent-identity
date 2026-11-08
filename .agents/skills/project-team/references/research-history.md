# Project Team protocol — design evidence (2026-11-08)

This is a **historical, non-runtime** account of decisions behind
[`project-team/SKILL.md`](../SKILL.md). It supports later review of the
compressed rules; current execution follows the Skill and the live project
artifacts. Links below point to the concrete development and trial records.

## Problems observed

- **Member visibility and stale shared state.** The team needed to discover
  ongoing responsibilities and work from another conversation. An initial
  [shared Team Index #7](https://github.com/Ri0n72Y/agent-identity/issues/7)
  included member work status in its body. A completed independent review was
  still represented as waiting until Lead reconciled the index. This exposed
  cross-member update ownership and duplication of current task state.
- **Requests from several members.** Allowing teammates to edit a shared
  member-status YAML comment would create competing writes and make task
  attribution ambiguous. GitHub comments already support independently
  appended requests with stable URLs.
- **Durable handoff and work evidence.** A task-only next-hop prompt can tell
  a person which conversation to open; it does not establish which GitHub
  request was sent or what was completed. A stable Request URL plus an
  append-only Result record supplies that connection.
- **Completion versus backlog.** An `idle` member can still have pending
  incoming Requests. In the initial trial, [Reviewer Issue #23](https://github.com/Ri0n72Y/agent-identity/issues/23)
  was idle while its first Request existed. Treating the body status as the
  task queue would miss that assignment.

## Chosen structure

The [Team Index #7](https://github.com/Ri0n72Y/agent-identity/issues/7)
is a directory of members and Member Issue URLs, maintained by Lead.
Each member has one long-lived Issue, created by Lead at initialization:
the body contains the role's continuing responsibility and the member-owned
`busy/idle` status with a short `latestwork` link. The initialization
prompt includes that Issue URL. Lead also has a
[Member Issue #22](https://github.com/Ri0n72Y/agent-identity/issues/22):
other members can assign work to Lead through it.

A sender appends a YAML Request comment in the recipient's Issue:
`from` is the sender's Member Issue URL (or `user`), and `request`
is a brief task or a list of tasks. A comment groups one request batch;
its GitHub comment URL identifies it. The recipient updates only its own
Issue body when starting or finishing that batch.

On completion the recipient appends a YAML Result comment:
`task` points to the original Request comment; `result` begins with a
natural-language outcome and may include artifact links; `start` and
`end` record the work interval. The optional `handoff` contains a short
description **and the URL of an outgoing Request actually posted by that
member in another Member Issue**. A copy-ready user-mediated next-hop
prompt should point to that same Request. The member then changes its
Issue body to `idle` and links to the Result.

Pending work is recovered by matching Request comment URLs with Result
`task` references. For multiple unmatched Requests, the oldest-comment
order is a simple default; explicit user or Lead priority may override
it. This requires no secondary queue, per-task board, or status store.

## Alternatives considered and reasons rejected

- **All member statuses and Requests in the Team Index body:** multiple
  writers would replace the same document, and status would duplicate
  the authoritative task artifacts. The roster still belongs there.
- **One Status comment per member under the shared Team Index:** separated
  write ownership but left every recipient filtering a shared comment
  stream and made member-level requests difficult to locate.
- **One shared Issue with Request comments tagged by recipient:** saves
  Issue count, but each member must filter all members' requests and results,
  and pending-work discovery becomes more error-prone as the team grows.
- **One Member Issue plus an editable Status comment:** still requires
  separate lookups for the current status. The body already holds role
  information and can expose the compact `busy/idle` and `latestwork`.
- **A distinct Issue for every task or a dedicated board/queue runtime:**
  increases artifact and synchronization work without evidence that
  append-only comments and single-member execution are insufficient.
- **Using `handoff` for a suggested next action or a PR link:** would
  misrepresent an unassigned action as a dispatched task. Only a posted
  outbound Request counts.

These are current design judgments, not permanent platform guarantees.

## Evidence from the trial

- [PR #21](https://github.com/Ri0n72Y/agent-identity/pull/21)
  contains the protocol iterations and their reviews.
- [Lead Request and Result comments in #22](https://github.com/Ri0n72Y/agent-identity/issues/22)
  demonstrate request acceptance, body updates, timed labor records,
  and an outbound Reviewer handoff.
- [Reviewer Result in #23](https://github.com/Ri0n72Y/agent-identity/issues/23#issuecomment-6721119750)
  links the completed independent review to the incoming Request;
  [the outgoing Lead Request](https://github.com/Ri0n72Y/agent-identity/issues/22#issuecomment-6721117600)
  identifies the next assignment.
- [The final PR #21 review](https://github.com/Ri0n72Y/agent-identity/pull/21#pullrequestreview-5817757604)
  found no High, Medium, or Low issues for the reviewed HEAD; its evidence
  covers documentation and real GitHub Issue operations.
- [Lead's merge Result](https://github.com/Ri0n72Y/agent-identity/issues/22#issuecomment-6721154851)
  links the accepted review to the resulting merged change.

The trial exercised ordinary handoff and status transitions. It did **not**
verify simultaneous writers to one Issue body, crash recovery at every
intermediate step, automatic ChatGPT conversation activation, or a large
backlog. A common GitHub account does not enforce member-level write
permissions; behavioral ownership is a convention.

## Why the current Skill revision is narrow

The post-merge review identified four text-level issues:

1. The old prohibition against *any* task-report protocol contradicted
   the now-adopted Request/Result format. Restrict additional, parallel
   trackers instead.
2. The Skill specified pending Requests but did not tell a resumed member
   to read and match the Issue comments. Add a one-step discovery rule,
   with a simple order for multiple pending requests.
3. The activation description said GitHub was merely an especially common
   option, although the Skill now depends on Member Issues and comment
   URLs. Align the description with the actual workflow.
4. An outgoing `Result.handoff` and a copy-ready next-hop prompt could
   refer to different assignments. Require the same posted Request link.

The updated runtime text retains only these operative constraints.
This account is stored separately in accordance with the
[skill-authoring evolution rules](../../skill-authoring/SKILL.md)
and the [design rationale](../../skill-authoring/references/design-rationale.md):
revise from concrete evidence, keep the smallest sufficient common-path
instructions, and preserve substantial reasoning without loading it
during routine execution.

Revisit queue ordering or conflict handling only if actual use shows
starvation, duplicate execution, lost writes, or multiple simultaneous
sessions for the same member. Those failures would justify a narrower
mechanism at the observed boundary, not an automatic expansion of the
whole protocol.
