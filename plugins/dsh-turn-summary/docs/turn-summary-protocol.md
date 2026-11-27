# Turn Summary Protocol (TSP)

TSP provides Session-level working memory. The DSH Session log remains the source of truth; native Session query and compaction remain available. Amadeus consumes TSP for future long-term memory processing. This plugin does not implement long-term memory, agent identity changes, or a separate retrieval system.

## Explicit lifecycle

1. The user runs `/summarize` in the target Session. The native DSH command registry invokes the handler directly against that Agent; no model message is created for the command.
2. The plugin reads the validated source log and finds the latest complete turn. On the first invocation, it establishes the baseline immediately before that turn; earlier history is not backfilled.
3. On later invocations, the plugin finds complete turns after the persisted source watermark. If more than one turn is pending, it processes them in source order.
4. For each turn, the plugin renders the exact source interval as Markdown. It includes user input, tool invocations and results, failed attempts with concise causes, and final delivered output. Runtime-injected TSP context and hidden reasoning are excluded.
5. One auxiliary LLM request produces both the new Turn Summary and the updated Session Summary. The semantic content is natural-language Markdown; the response uses a strict JSON envelope for validation.
6. After validating the response, the plugin atomically replaces the Session JSON document. Only after a successful write does the in-memory TSP context advance.
7. Subsequent Prompt assembly reads the latest persisted Session Summary and recent Turn Summaries and injects them as bounded Markdown.

## Persistence

Location: $DSH_HOME/state/turn-summary/. Each Session has a JSON file named by its UTF-8 Session ID encoded in hexadecimal.

The document contains schemaVersion, sessionId, processedThroughSeq, updatedAt, sessionSummary and recentTurnSummaries. Each recent entry contains turn, startSeq, endSeq, startedAt, endedAt, reason and markdown. The source interval and timestamps identify the original evidence; the substantive summary remains natural language. Do not introduce actor/type/status taxonomies for events inside the summary.

Session Summary is the single Session-level working memory. Recent Turn Summaries are a bounded window (default 12), not an archive. Historical details remain available through native Session query. The default retention and token budgets are implementation parameters, not protocol requirements.

## Failure and retry

A failed model request or JSON write returns an error from `/summarize`. The failed turn does not advance the watermark. Earlier turns that were successfully persisted during the same invocation remain committed. The user can invoke `/summarize` again to retry.

The plugin rejects a concurrent `/summarize` invocation for the same Session; it does not queue work. It does not automatically observe `turn/end`, retry failures, or backfill after process restart. Automatic scheduling and its failure policy are a separate phase.

## Amadeus boundary

TSP is the Session-scoped working memory and replaces the previous Working Memory layer. Amadeus may later consume the Session Summary and Turn Summaries as inputs to Experience and subsequent long-term memory processing. This plugin does not decide what becomes Experience, mPFC, or SOUL.
