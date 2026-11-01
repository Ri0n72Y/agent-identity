# mPFC

mPFC stores **reflected changes to the agent's self-understanding and behavior**, with their reasoning and evidence. An Episode becomes **Experience** whenever it concerns the agent, the user, or their interactions. Relevance alone does not qualify it for mPFC.

## Entry gate

Identity Reflection evaluates Experiences against the agent's current behavior and self-understanding. **Only when Reflection explicitly determines that an Experience changes self-understanding or behavior does it create or update an mPFC entry.** A result that leaves both unchanged remains in the dated Experience history or the consuming Harness's review record; it does not produce an mPFC entry.

A qualifying mPFC record explains what changed, why, the supporting and conflicting evidence, and how it relates to existing conclusions. Link to the original Experience and Bookshelf sources; do not duplicate Episode narratives or concrete facts. Preserve revision history with the common latest-first entry syntax:

~~~text
[YYYY-MM-DD HH:MM:SS][项目[:会话]] 自我认知或行为发生的变化及依据
- [YYYY-MM-DD HH:MM:SS] 前一次相关认识或行为及其修订依据
~~~

## SOUL compression

A qualifying mPFC update **triggers SOUL compression**. The compression reads current effective SOUL and the updated mPFC interpretation, then produces a concise candidate SOUL state. The rationale and historical evidence stay in mPFC; SOUL only retains the effective identity conclusions.

A proposed SOUL or PRINCIPLES change requires review before it becomes effective. A rejected proposal does not become a current SOUL conclusion; retain the review outcome with the Experience or the Harness's audit trail. The initial SOUL may be human-authored and does not need a fictitious mPFC origin.

This repository defines the semantics, not a new execution service. Use the consuming Harness's existing review, storage, and scheduling capabilities. See [memory model](../docs/memory-model.md), [Reflection](../docs/reflection.md), and [template](reflection.template.md).
