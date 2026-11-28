# Turn Summary Protocol (TSP)

TSP defines a natural-language summary of one DSH turn, identified by its Session ID and turn number. The original Session log remains authoritative evidence.

## Turn Summary

The dsh-tsp package provides a Turn Summary operation. It selects the latest complete local turn and reuses the Session's existing DSH model-visible context and tool declarations. A fixed summary directive is appended after the original message prefix, with supplemental facts extracted from the selected turn's events when needed to identify the turn, account for failures, or recover evidence omitted from the model-visible context. The plugin does not construct a Markdown transcript or truncate the source text.

One auxiliary LLM call exposes a request-local `structured_output` tool with an object parameter schema containing exactly one required string field, `summary`, describing the selected turn: the user request, actual tool calls and their results, failed attempts with concise causes, and the final response or deliverable. Earlier conversation serves as background only. The original message prefix and existing tool declarations are retained. Adding the output tool and disabling thinking may change provider cache eligibility.

The fixed directive requires exactly one call to the output tool, following DSH's Subagent structured-output pattern. The plugin validates the returned tool arguments before persistence and never dispatches other tools. A missing or invalid output call fails without automatic retry. The tool is declared only for the auxiliary request, with no global executable registration. The native `deepseekLlmApiExtensions` registry contributes `tool_choice: { type: 'tool', name: 'structured_output' }` only to requests with purpose `turn-summary`. These requests set `reasoningEffort: 'off'`, as DeepSeek Messages requires thinking to be disabled for a named tool choice. The operation supports the native `deepseek-official` and `deepseek-account` routes; other routes fail rather than silently omit the constraint.

A stored JSON record has exactly three fields:

```json
{
  "sessionId": "example-session",
  "turn": 7,
  "summary": "The user requested ... The assistant called ... The result was ..."
}
```

Storage: $DSH_HOME/state/tsp/turn-summary/<hex-session-id>/<turn>.json.

The native /summarize command displays the saved summary. The user may skip turns or summarize the same turn again; repeated execution replaces only that record. A failed operation does not replace a saved summary.

Implementation: [dsh-tsp](../plugins/dsh-tsp/README.md).
