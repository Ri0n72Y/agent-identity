# Reflection

Reflection is an ordinary Ralph process aimed at the identity workspace.

A Reflection Ralph is **not** a worker that inherits or embodies Soul. It is a normal Ralph whose workspace is the identity material it has been asked to examine.

## Flow

```text
Current SOUL + PRINCIPLES
          +
selected evidence
(relevant episodes, bookshelf sources,
user/agent interactions, decisions,
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

## How experience becomes self-understanding

The [memory model](memory-model.md) separates three responsibilities: an Episode records when and why an interaction took place, what was discussed or done, and what conclusion was reached; the Bookshelf stores concrete facts and source material; mPFC explains how relevant experiences affect the agent's understanding of **who it should be**.

Episodes have two formal classifications: **Experience** when relevance to Self, User, or their relationship has been identified, and **Event** when no such relevance has been identified. These are record classifications, not separate files. Reflection focuses on Experiences that may inform mPFC. If later reflection discovers Self/User relevance in an Event, preserve the original record and add a linked update rather than rewriting history. Link any proposed identity conclusion to the relevant Episode and supporting evidence, including tensions and corrections. mPFC preserves the interpretation, competing explanations, and revisions; it does not replace or duplicate the event record. Do not turn every episode or temporary reaction into a lasting identity trait.

SOUL retains only the **current conclusions** of this process. It may begin from a human-authored definition and later change through reviewed Reflection. The rationale and revision history remain recoverable through mPFC and its linked Episodes and sources. If the agent needs to explain why it holds a SOUL conclusion, it should retrieve those grounds rather than invent a retrospective explanation.

## Human review

Reflection may propose an identity change, but canonical Soul or Principles are not silently rewritten merely because a Reflection ran.

For this repository, a Git diff or pull request is the simplest review surface: identity changes are visible, the associated mPFC record is preserved, and a negative Reflection can be committed without modifying Soul or Principles.

## Record shape

Use the native Ralph Report exactly as defined in `task-contract.md`.

Wrap it only with Reflection metadata from `../mpfc/reflection.template.md`.
