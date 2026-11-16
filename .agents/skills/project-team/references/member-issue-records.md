# Member Issue records: Request, Result, and role status

These records are short, human-readable work explanations. The reader should
understand what is being requested or delivered without reconstructing
the meaning of a PR number, an internal phase code, or a test tally.

## Shared writing standard

- **Request:** say what the recipient should do and which project outcome it
  advances. Use an action verb and a comprehensible work object.
- **Result:** say what the member achieved or established and where the outcome
  lives. Describe the product capability, workflow improvement, or finding.
  Do not replace the outcome with “PR opened,” “CI passed,” or “review pending.”
- Write the meaningful sentence first, with the authoritative work link on
  the next line. Keep the link as a direct URL; its issue or PR number need
  not be repeated in the sentence.
- Keep essential meaning and uncertainty. “Short” means no duplicated history,
  specifications, or evidence; it does not mean few characters at any cost.
  Put implementation details, tests, reasons, and scope changes in the owning
  Issue, PR, review, or document.
- If the work is partial or unverified, state the completed portion accurately.
  A conclusion or finding is itself a result when it directly answers the task.

Bad: `A1 complete; PR #58; 33 tests passed.`

Better:

```text
工作台已支持按状态筛选任务，方便查看待处理事项。
https://github.com/owner/repo/pull/58
```

## Request comment

Post as a YAML-fenced comment on the **recipient's** Member Issue. Use only
`from` and `request`; `from` is the sender's Member Issue URL or `user`.
The comment URL is the durable identity of the request.
The following placeholders illustrate one linked task chain.

Lead posts an implementation Request on Coder Member Issue #40:

```yaml
from: https://github.com/owner/repo/issues/10
request: |-
  为工作台增加按状态筛选任务的功能。
  https://github.com/owner/repo/issues/57
```

Coder posts a review Request on Reviewer Member Issue #42:

```yaml
from: https://github.com/owner/repo/issues/40
request: |-
  核对任务筛选的实现与边界条件。
  https://github.com/owner/repo/pull/58
```

These Requests have comment URLs
`issues/40#issuecomment-100` and `issues/42#issuecomment-101`.

For a small task, the action and required context may fit in the sentence.
For a larger task, link the authoritative work Issue/PR and mention only
constraints not already recorded there. A `request` may be a short list of
distinct actions, each using the same human-readable action + source pattern.

## Result comment

Post as a YAML-fenced comment on the **completing member's** Issue.
`task` is the exact originating Request comment URL, not its Work Issue.
`start` and `end` are ISO 8601 timestamps with an explicit timezone.
`result` accepts a YAML scalar or list; a list starts with the concise
natural-language outcome, followed by evidence links.
Use `handoff` only after posting a new Request to **another** Member Issue;
include the next action and the actual Request comment URL.

Coder posts this Result on Member Issue #40 after sending the review Request:

```yaml
task: https://github.com/owner/repo/issues/40#issuecomment-100
result:
  - "工作台已支持按状态筛选任务，方便查看待处理事项。"
  - https://github.com/owner/repo/pull/58
start: "2026-11-16T09:55:00+08:00"
end: "2026-11-16T10:45:00+08:00"
handoff: |-
  核对任务筛选的实现与边界条件。
  https://github.com/owner/repo/issues/42#issuecomment-101
```

Omit `handoff` when no new Request was actually posted. When several
outcomes matter, give the concise meaningful conclusion first and link the
artifact containing the rest; a detailed report does not belong here.

## Role-status snapshot

The Member Issue body keeps these two fields, maintained by the member
responsible for that role:

```yaml
status: busy
latestwork: "正在实现任务状态筛选：https://github.com/owner/repo/issues/40#issuecomment-100"
```

Use only `busy` or `idle`. `latestwork` points to the current Request
or latest Result with a short, meaningful description. It is a shared
snapshot, not an exclusive task lock or complete queue. Keep the role
contract outside this YAML block.
