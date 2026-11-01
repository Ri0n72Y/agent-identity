# Reflection

The memory model also describes reflection as part of Short-to-Episode consolidation. That conceptual classification step does not require a separate identity review for each event. This document defines **identity Reflection**: it decides whether an Experience should change the agent's self-understanding or behavior. Only a positive conclusion enters mPFC and triggers SOUL compression.

Identity Reflection examines selected evidence against the current identity workspace. It can use the consuming Harness's available agent or review workflow. The review process does not inherit or embody SOUL as a separate identity; it reads only the evidence and identity material needed to assess a proposed change.

## Flow

```text
Episode classification:
  related to agent or user?  -> Experience
  otherwise                  -> Event

Experience + sources + current SOUL / PRINCIPLES
                    |
                    v
              Identity Reflection
                    |
              changes self-understanding
              or behavior?
               /           \
              no            yes
              |              |
   retain decision with      v
    Experience history      mPFC
                             |
                     SOUL compression
                             |
                     proposed SOUL update
                             |
                        human review
                       /           \
                   accept          reject
                     |               |
              apply update     retain review outcome
                                with Experience;
                                SOUL unchanged
```

A reflection without a confirmed identity or behavior change **does not enter mPFC** and **does not trigger SOUL compression**. Keep its outcome in the relevant Experience or Harness review record. A rejected proposed SOUL patch leaves the effective identity unchanged, with its review outcome linked to the Experience; do not treat the proposal as an accepted conclusion.

## Project constraints are evidence, not identity

A project constraint may reveal a useful recurring preference or working rule, but it stays owned by that project.

Reflection may ask whether repeated constraints across several projects should change the agent's durable behavior. Only a positive identity/behavior change passes the mPFC gate; a proposed cross-project Principle is then reviewed before adoption.

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

A no-change Reflection is still part of the Experience history and can inform later Reflection. It is not stored as a separate mPFC entry.

## How experience becomes self-understanding

The [memory model](memory-model.md) separates three responsibilities: an Episode records when and why an interaction took place, what was discussed or done, and what conclusion was reached; the Bookshelf stores concrete facts and source material; mPFC explains how relevant experiences affect the agent's understanding of **who it should be**.

Episodes are classified as **Experience** whenever they concern the agent, the user, or their interaction, and **Event** otherwise. Identity Reflection assesses Experiences for a consequential change to the agent's self-understanding or behavior. Only an explicit positive conclusion is written to mPFC and triggers SOUL compression. If an Event later proves related to the agent or user, preserve the original record and add a dated linked reclassification. mPFC preserves the reasons and evidence supporting actual proposed identity evolution, not the Episode text. Mere relevance does not establish a durable identity change.

Writing a qualifying identity change to mPFC **triggers SOUL compression**. The compression step distills the updated interpretation into a concise proposed SOUL state; human review is required before applying it. SOUL may start from a human-authored definition. The rationale remains recoverable through mPFC, its linked Experiences, and their sources.

## Human review

An identity change is first established by Reflection and recorded in mPFC, then used to trigger compression into a proposed SOUL update. Canonical SOUL or PRINCIPLES are not silently rewritten; review applies to the resulting patch.

For this repository, a Git diff or pull request is a suitable review surface for a proposed SOUL or PRINCIPLES patch. A no-change reflection remains with the corresponding Experience, without an mPFC write or SOUL compression.

## Record content

Use the common latest-first memory entry shape: `[YYYY-MM-DD HH:MM:SS][项目[:会话]] 最终结论`, followed by historical `- [YYYY-MM-DD HH:MM:SS]` bullets from newer to older. The head states the positive determination that the Experience changes the agent's self-understanding or behavior. Historical bullets retain earlier interpretations, evidence links, identity revisions, and why the decision changed. Do not replace an original Episode. See [mPFC](../mpfc/README.md) and its [reference template](../mpfc/reflection.template.md). No separate worker protocol or report schema is required.
