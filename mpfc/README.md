# mPFC

`mpfc/` is the audit trail for identity Reflection.

It stores what was examined, what evidence supported the examination, and whether the effective identity changed. A negative result is still a result and must be retained.

Reflection does not invent a second report format. Every record contains:

1. derived Reflection metadata; and
2. the ordinary Ralph Report fields unchanged.

Derived metadata may include:

- `reflected_at`
- `reflection_round`
- `identity_revision_before`
- `identity_revision_after`
- `identityChanged`
- `state_transition`

The revision may be the repository commit that identifies the effective identity state before and after Reflection.

`state_transition` is a compact description of the final identity transition, for example `unchanged`, `principle added`, or `soul preference revised`.

The actual evidence belongs in the Ralph Report's `evidence` field. Project constraints may appear there when they are evidence for Reflection; they are not copied into identity merely because they were examined.

When `identityChanged: false`, the record should still explain the reviewed evidence and why no identity update was justified. The before/after revision may remain identical.

Use `reflection.template.md` as the minimal record shape.
