# Reflection

Reflection is an ordinary Ralph process aimed at the identity workspace.

A Reflection Ralph is **not** a worker that inherits or embodies Soul. It is a normal Ralph whose workspace is the identity material it has been asked to examine.

## Flow

```text
Current SOUL + PRINCIPLES
          +
selected evidence
(project constraints, decisions,
reviews, outcomes, prior mPFC records)
          |
          v
Root prepares Reflection Ralph Task
          |
          v
Soul-Ralph examines identity workspace
          |
          | native Ralph Report
          | + proposed identity diff when justified
          v
Human review
          |
          +--> accept change --> apply Soul / Principle patch
          |
          +--> no change / reject --> keep identity unchanged
          |
          v
write mPFC record in either case
```

## Project constraints are evidence, not identity

A project constraint may reveal a useful recurring preference or working rule, but it stays owned by that project.

Reflection may ask whether repeated constraints across several projects point to a more durable Principle. This is a distillation step, not a copy step.

For example:

```text
project-specific constraints
        |
        | repeated pattern + successful outcomes
        v
candidate Principle
        |
        | review
        v
PRINCIPLES.md
```

A project-specific filename, framework version, deadline, API choice, or one-off implementation rule should normally remain in the project and never enter identity.

## Evidence before identity change

Reflection should distinguish a durable identity signal from a one-off task outcome.

Evidence may support:

- reinforcing or revising Soul;
- adding or revising a durable Principle;
- rejecting a candidate Principle as too project-specific;
- explicitly making no identity change.

A reviewed Reflection that makes no change is still useful evidence for later, deeper Reflection.

## Human review

Reflection may propose an identity change, but canonical Soul or Principles are not silently rewritten merely because a Reflection ran.

For this repository, a Git diff or pull request is the simplest review surface: identity changes are visible, the associated mPFC record is preserved, and a negative Reflection can be committed without modifying Soul or Principles.

## Record shape

Use the native Ralph Report exactly as defined in `task-contract.md`.

Wrap it only with Reflection metadata from `../mpfc/reflection.template.md`.
