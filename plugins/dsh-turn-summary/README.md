# dsh-turn-summary

A Cordis plugin that maintains the Turn Summary Protocol (TSP) for each DeepSeek Harness Session.

## Explicit execution

Run `/summarize` in the target Session when you want to update its TSP.

The command is registered through DSH's native command registry. It executes directly against the receiving Agent and does not send the command or its result as a model message.

One invocation:
- Reads the target Session's validated source log.
- Selects all complete turns not yet represented in TSP.
- On the first invocation, summarizes only the latest complete turn; older history is not backfilled.
- Makes one auxiliary LLM request per selected turn. Each request generates that Turn Summary and the updated Session Summary together.
- Atomically persists each successful turn before moving to the next one.
- Returns a command result indicating the number of turns processed.

If generation or persistence fails, the command returns an error. The source watermark advances only after a successful JSON write. Run `/summarize` again to retry. Concurrent invocations for the same Session are rejected rather than queued.

## Responsibilities

- Read the validated source log through `ctx.sessionQuery.readSession()`.
- Preserve the original DSH Session as authoritative evidence.
- Persist derived TSP state as JSON under `dshPath('state', 'turn-summary')`.
- Inject the latest Session Summary and recent Turn Summaries as Markdown through `ctx.systemPrompt.context()`.

TSP does not append summaries to the Session log or use the internal-only `appendPluginRecord()` API. This version does not automatically listen to `turn/end`; automatic scheduling is a separate future phase.

## Installation

Install the package in a DSH composition and add it to the Cordis bundle:

```yaml
- name: dsh-turn-summary
  config:
    maxRecentTurns: 12
    maxContextBytes: 24000
```

The plugin requires the llm, sessionQuery, systemPrompt, and commands services. The summarization route defaults to the latest request route recorded in the live Session. Set both provider and model to override it:

```yaml
- name: dsh-turn-summary
  config:
    provider: deepseek
    model: deepseek-chat
    maxTokens: 1800
    timeoutMs: 60000
    maxRecentTurns: 12
    maxContextBytes: 24000
```

## Persistence

Files are stored below:

```text
$DSH_HOME/state/turn-summary/
```

Each Session has one JSON file. The filename is the UTF-8 Session ID encoded as lowercase hexadecimal, preventing path traversal and case-insensitive filename collisions. The document stores the schema version, Session ID, processed source-event watermark, current Session Summary, and bounded recent Turn Summaries.

The Session Summary is the sole Session-level working memory. Recent Turn Summaries are a bounded window, not an archive. Historical details remain available through native Session query.

## Failure behavior

- A failed model request does not advance the watermark or write a failure placeholder.
- If a command processes several pending turns and a later turn fails, earlier successful turns remain persisted.
- A failed JSON replacement does not publish the new in-memory context.
- Re-running `/summarize` retries the first turn not yet persisted.
- The next Prompt reads the latest successfully persisted TSP. If no TSP exists, no TSP context is injected.

## Development

```sh
cd plugins/dsh-turn-summary
npm install
npm run check
```
