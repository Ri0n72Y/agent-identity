# Reflection

Reflection is an ordinary Ralph process aimed at the identity workspace.

A Reflection Ralph is **not** a worker that inherits or embodies Soul. It is a normal Ralph whose workspace is the Soul material it has been asked to examine.

## Flow

```text
Current SOUL
   +
selected evidence / prior mPFC records
   |
   v
Root prepares Reflection Ralph Task
   |
   v
Soul-Ralph examines identity workspace
   |
   | native Ralph Report + proposed Soul diff when justified
   v
Human review
   |
   +--> accept change --> apply Soul patch
   |
   +--> no change / reject --> keep Soul unchanged
   |
   v
write mPFC record in either case
```

## Evidence before identity change

Reflection should distinguish a durable identity signal from a one-off task outcome.

Evidence may support:

- reinforcing an existing Soul statement;
- revising an existing Soul statement;
- adding a newly stable tendency; or
- explicitly making no change.

The fourth outcome is important. A reviewed Reflection that does not justify a Soul edit still becomes useful evidence for later deeper Reflection.

## Human review

Reflection may propose a Soul change, but canonical Soul is not silently rewritten merely because a Reflection ran.

For this repository, the simplest review surface is a Git diff or pull request: Soul changes are visible, the associated mPFC record is preserved, and a negative Reflection can be committed without modifying Soul.

## Record shape

Use the native Ralph Report exactly as defined in `task-contract.md`.

Wrap it only with runtime-derived metadata from `../mpfc/reflection.template.md`.
