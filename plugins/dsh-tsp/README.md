# dsh-tsp

A DeepSeek Harness plugin package for the Turn Summary Protocol.

## Turn Summary

Run `/summarize` in the target Session. The command selects the latest complete local turn and reuses DSH's native model-visible context (including its existing system messages and tool history). It appends a fixed summary directive and only the supplemental target-turn facts needed to identify the turn and report failures or omitted messages. One auxiliary LLM request exposes a request-local `structured_output` tool whose argument schema is `{"summary":"..."}` (one required string field). The fixed instruction requires exactly one call to that tool. The plugin reads its JSON arguments, rejects malformed, empty, extra-field or unexpected tool calls, and persists the validated summary. It does not dispatch tools or enter an agent loop.

The original message prefix and existing tool definitions are retained, following DSH's native compaction request pattern. The additional output-tool declaration can change provider prefix-cache eligibility. No transcript is rendered or reserialized as Markdown. The actual cache hit depends on the provider, route, and retained prefix.

Each record contains only sessionId, turn and summary. Records are stored independently under `$DSH_HOME/state/tsp/turn-summary/<hex-session-id>/<turn>.json`. Repeated execution for the same turn replaces that record. Skipped turns require no handling. Model or storage failure returns an error without replacing a previously saved record. The plugin does not truncate source text or generated summaries.

The output-tool approach follows DSH's native [Subagent structured output](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/subagent/subagent/src/structured.ts). The declaration is local to the auxiliary request; it does not register a global executable tool or use provider-specific forced-tool parameters. A plain-text response is an error, with no automatic retry. Existing Session tools are never executed by the auxiliary request. A pre-existing tool named `structured_output` causes the request to fail rather than silently replace its schema.

## Configuration

The plugin requires llm, sessionQuery and commands. The auxiliary request uses the Session model route unless provider and model are configured together. Optional timeoutMs defaults to 60000. A different model route can prevent cache reuse.

## Development

```sh
cd plugins/dsh-tsp
npm install
npm run check
```

Tests cover standalone turn selection, unchanged native request prefix, output-tool declaration, argument validation and JSON storage. Native command execution, model calls and actual cache hits require a running DSH environment.
