# Turn Summary Protocol (TSP)

TSP defines a natural-language summary of one DSH turn, identified by its Session ID and turn number. The original Session log remains authoritative evidence.

## Turn Summary

The dsh-tsp package provides a Turn Summary operation. It selects the latest complete local turn and reuses the Session's existing DSH model-visible context and tool declarations. A fixed summary directive is appended after the original message prefix, with supplemental facts extracted from the selected turn's events when needed to identify the turn, account for failures, or recover evidence omitted from the model-visible context. The plugin does not construct a Markdown transcript or truncate the source text.

One auxiliary LLM call returns a JSON object containing exactly one non-empty string field, `summary`, describing the selected turn: the user request, actual tool calls and their results, failed attempts with concise causes, and the final response or deliverable. Earlier conversation serves as background only. The original request prefix is retained to enable provider caching, without assuming a cache hit.

The response must be valid JSON without surrounding prose or code fences. The plugin validates the response before persistence. The current DSH request interface does not expose a native structured-output option; the fixed directive and strict parser enforce the application-level contract without bypassing the native model route.

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
