# Runtime integration

Identity and project execution are separate concerns.

```text
Project workspace
  ├─ project constraints
  └─ task context
          +
User input
          +
Core (if provided to this runtime)
          +
Identity workspace
  ├─ SOUL
  └─ PRINCIPLES
          |
          v
      Root Agent
          |
          | prepares Ralph Task
          | constraints come from the project/request,
          | not from identity
          v
      Ralph worker
          |
          | native Ralph Report
          v
      Root Agent
          |
          | interprets the result with current identity
          v
         User
```

## Universal Core is separate from identity

[Core v1.0.3](../core/CORE.md) records the human-authored general method: investigate actual conditions, identify the current principal contradiction, learn critically from practice, act, and revise claims against outcomes. It is distinct from Soul, Principles, project constraints, and task-scoped skills.

This repository stores Core but does not automatically inject it into the Root Agent or Ralph workers; loading must be configured by the consuming runtime. Do not copy its general instructions into each skill as boilerplate.

## Soul and Principles are Root context

The Root Agent may use `soul/SOUL.md` and `principles/PRINCIPLES.md` when interpreting the user, selecting emphasis, and deciding how to approach work.

A normal Ralph worker does not inherit the identity workspace directly. It receives only the task contract required for its work.

## Memory is a separate runtime concern

The [memory model](memory-model.md) distinguishes live context, cross-context Short, consolidated Episode, concrete facts in a Bookshelf, and LTM as its index. Episode owns the event record and conclusion; mPFC holds the interpretation and rationale for how relevant experience informs self-understanding. SOUL contains current identity conclusions, which may begin with a human-authored definition and can later be revised through reviewed Reflection.

This repository describes these relationships but does not provision a universal memory store or automatically load, consolidate, or retrieve those layers. The consuming runtime and owning projects supply the actual evidence and retrieval mechanism. When the Root needs to explain or reconsider a SOUL conclusion, it can consult mPFC and the underlying episodes and sources, subject to the runtime's available access.

## Constraints are project-owned

Hard operational constraints belong in the project that owns the work.

The Root Agent may select, normalize, or summarize relevant project constraints when preparing a Ralph Task, but identity is not the source of those constraints.

Current user instructions, tool/safety requirements, and project-local constraints may all contribute to the task contract. Soul and Principles do not become hidden mandatory constraints merely because they are loaded by the Root.

## Principles are defaults

Principles are durable defaults distilled from repeated evidence across work. They help the Root choose among otherwise acceptable approaches.

When an explicit project constraint conflicts with a general Principle, the project constraint governs that project.

## Results return through the Root

A worker's report is not the final identity-aware interpretation. The Root Agent receives the result and interprets it using the current Soul and Principles before continuing the conversation.
