# dsh-tsp

A DeepSeek Harness plugin package for the Turn Summary Protocol.

## Turn Summary

Run `/summarize` in the target Session. The command reads the latest complete local turn, renders the source events as Markdown, and makes one auxiliary LLM request for a natural-language summary. It saves a single JSON record and displays the result.

Each record contains only sessionId, turn and summary. Records are stored independently under `$DSH_HOME/state/tsp/turn-summary/<hex-session-id>/<turn>.json`. Repeated execution for the same turn replaces that record. Skipped turns require no handling. Model or storage failure returns an error without replacing a previously saved record. The plugin does not truncate source text or generated summaries.

## Configuration

The plugin requires llm, sessionQuery and commands. The auxiliary request uses the Session model route unless provider and model are configured together. Optional timeoutMs defaults to 60000.

## Development

```sh
cd plugins/dsh-tsp
npm install
npm run check
```

Tests cover standalone event selection, Markdown rendering, response validation and JSON storage. Native command execution and live model calls require a running DSH environment.
