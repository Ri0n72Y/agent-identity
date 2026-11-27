# dsh-turn-summary

A Cordis plugin that maintains the Turn Summary Protocol (TSP) for each DeepSeek Harness Session.

## Responsibilities

- Observe committed turn/end events.
- Read the validated source log through ctx.sessionQuery.readSession().
- Make one auxiliary LLM request for each completed turn.
- Generate that turn's Markdown summary and the updated Session Summary in the same request.
- Persist the derived state as JSON under dshPath('state', 'turn-summary').
- Inject the latest Session Summary and recent Turn Summaries as Markdown through ctx.systemPrompt.context().

The original DSH Session remains the authoritative evidence. TSP is derived state and does not append summaries to the Session log or use the internal-only appendPluginRecord() API.

## Installation

Install the package in a DSH composition and add it to the Cordis bundle:

```yaml
- name: dsh-turn-summary
  config:
    maxRecentTurns: 12
```

The plugin requires the llm, sessionQuery, and systemPrompt services. The summarization route defaults to the latest request route recorded in the Session. Set both provider and model to override it:

```yaml
- name: dsh-turn-summary
  config:
    provider: deepseek
    model: deepseek-chat
    maxTokens: 1800
    timeoutMs: 60000
    maxRecentTurns: 12
```

## Freshness and failure behavior

session/event observers are fire-and-forget. The plugin registers each turn-end job synchronously, then processes jobs serially per Session. The next system-prompt/assemble waits for an active job before refreshing the TSP context, so it cannot capture the previous turn's stale summary.

A failed generation leaves the source watermark unchanged. The job remains queued and is retried when another turn ends. The next prompt does not wait indefinitely after a failed job; it continues with the last successfully persisted summary. The next successful processing catches up completed turns in source order.

A new JSON document starts at the first turn observed by this plugin. It does not retroactively summarize older turns in an existing Session. Original Session history remains available through DSH.

## State files

Files are stored below:

```text
$DSH_HOME/state/turn-summary/
```

Each Session has one JSON file. The filename is the UTF-8 Session ID encoded as lowercase hexadecimal, preventing path traversal and case-insensitive filename collisions. The document stores the schema version, Session ID, processed source-event watermark, current Session Summary, and bounded recent Turn Summaries.

## Development

```sh
pnpm install
pnpm --filter dsh-turn-summary check
```