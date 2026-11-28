# Turn Summary Protocol (TSP)

TSP defines a natural-language summary of one DSH turn, identified by its Session ID and turn number. The original Session log remains authoritative evidence.

## Turn Summary

The dsh-tsp package provides a Turn Summary operation. Its input is Markdown derived from the selected complete turn, including the user input, tools invoked, tool results, failed attempts with concise causes, and the final user-facing response. The Session ID identifies the source. Runtime context snapshots and hidden reasoning are excluded. The plugin does not truncate source text.

One auxiliary LLM call returns a single natural-language summary in a JSON response. The plugin validates and saves the result independently of all other turns. A stored JSON record has exactly three fields:

```json
{
  "sessionId": "example-session",
  "turn": 7,
  "summary": "The user requested ... The assistant called ... The result was ..."
}
```

Storage: $DSH_HOME/state/tsp/turn-summary/<hex-session-id>/<turn>.json.

The native /summarize command selects the latest complete local turn in the receiving Session. It displays the saved summary. The user may skip turns or summarize the same turn again; repeated execution replaces only that record. A failed operation does not replace a saved summary.

Implementation: [dsh-tsp](../plugins/dsh-tsp/README.md).
