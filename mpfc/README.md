# mPFC

`mpfc/` is the audit trail for identity Reflection.

It stores what was examined, what evidence supported the examination, and whether the effective Soul changed. A negative result is still a result and must be retained.

Reflection does not invent a second report format. Every record contains:

1. derived Reflection metadata; and
2. the ordinary Ralph Report fields unchanged.

Derived metadata may include:

- `reflected_at`
- `reflection_round`
- `soul_revision_before`
- `soul_hash_before`
- `soul_revision_after`
- `soul_hash_after`
- `soulChanged`
- `state_transition`

`state_transition` is a compact description of the final identity transition (for example, `unchanged` or a short `before -> after` summary). It does not replace the revision/hash fields.

The actual evidence belongs in the Ralph Report's `evidence` field.

When `soulChanged: false`, the record should still explain the reviewed evidence and why no identity update was justified. The before/after revision or hash may remain identical.

Use `reflection.template.md` as the minimal record shape.
