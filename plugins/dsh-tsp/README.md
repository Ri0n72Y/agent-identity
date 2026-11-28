# dsh-tsp

A DeepSeek Harness plugin package for the Turn Summary Protocol.

## Turn Summary

Run `/summarize` in the target Session. The command selects the latest complete local turn and reuses DSH's native model-visible context (including its existing system messages and tool history). It appends a fixed summary directive and only the supplemental target-turn facts needed to identify the turn and report failures or omitted messages. One auxiliary LLM request returns a JSON object of the form `{"summary":"..."}`. The plugin requires exactly one non-empty string field and rejects malformed, incomplete, or extra-field output before writing.

The original message prefix and tool definitions are reused, following DSH's native compaction request pattern, to allow provider prefix-cache reuse. No transcript is rendered or reserialized as Markdown. The actual cache hit depends on the provider, route, and retained prefix.

Each record contains only sessionId, turn and summary. Records are stored independently under `$DSH_HOME/state/tsp/turn-summary/<hex-session-id>/<turn>.json`. Repeated execution for the same turn replaces that record. Skipped turns require no handling. Model or storage failure returns an error without replacing a previously saved record. The plugin does not truncate source text or generated summaries.

The fixed directive requests JSON explicitly. The current DSH `GenerateOptions` contract exposes no JSON output mode, and the native DeepSeek Messages endpoint does not support output-format enforcement. The plugin retains the Session's native model route and validates the JSON locally; it does not send unsupported parameters or bypass DSH. See [DeepSeek JSON Output](https://api-docs.deepseek.com/guides/json_mode/) and [Messages API](https://api-docs.deepseek.com/api/create-message/).

## Configuration

The plugin requires llm, sessionQuery and commands. The auxiliary request uses the Session model route unless provider and model are configured together. Optional timeoutMs defaults to 60000. A different model route can prevent cache reuse.

## Development

```sh
cd plugins/dsh-tsp
npm install
npm run check
```

Tests cover standalone turn selection, unchanged native request prefix, JSON response validation and JSON storage. Native command execution, model calls and actual cache hits require a running DSH environment.
