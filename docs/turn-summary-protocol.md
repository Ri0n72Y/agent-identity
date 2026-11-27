# Turn Summary Protocol (TSP)

TSP provides Session-level working memory. The DSH Session log remains the source of truth; DSH session query and compaction remain available. Amadeus consumes TSP for future long-term memory processing. This plugin does not implement long-term memory, agent identity changes, or a separate retrieval system.

## Lifecycle

1. Observe the committed turn/end event and enqueue its Session ID and event sequence.
2. Query the original Session, locate the paired turn/start and render the completed interval as Markdown. Include user input, tool invocations and results, failed attempts with concise causes, and final delivered output. Preserve source identifiers and distinguish completed actions from proposals.
3. Make one auxiliary LLM request, producing a turn summary and the updated Session Summary together. The semantic content is natural-language Markdown. The generation response uses a JSON envelope for validation.
4. Validate and atomically persist the Session JSON document. Process each Session serially, independently of other Sessions.
5. Render the Session Summary and recent Turn Summaries as Markdown through the native system prompt context provider. Prompt assembly waits for the preceding queued generation, subject to cancellation and generation timeout.

## Persistence

Location: $DSH_HOME/state/turn-summary/. Each Session has a JSON file named by its UTF-8 Session ID encoded in hexadecimal.

The document contains schemaVersion, sessionId, processedThroughSeq, updatedAt, sessionSummary and recentTurnSummaries. Each recent entry contains turn, startSeq, endSeq, startedAt, endedAt, reason and markdown. The source interval and timestamps identify the original evidence; the substantive summary remains natural language. Do not introduce actor/type/status taxonomies for the events within the summary.

Session Summary is the single Session-level working memory. Recent Turn Summaries are a bounded window (default 12), not an archive. Historical details remain available through native Session query. The default retention and token budgets are implementation parameters, not protocol requirements.

## Failure and recovery

Model errors produce a concise failure note with the source interval and preserve the previous Session Summary. Subsequent turns continue to be processed. Source query and JSON write failures keep the watermark unchanged so the next turn can retry. Oversized inputs are explicitly marked as truncated. Original Session records remain untouched.

Installation begins with the first observed completed turn. Existing state is loaded on prompt assembly; missed turns after an existing watermark are processed on the next observed turn/end. Historical backfill before the first observed turn, multi-process coordination over a shared state directory, and long-term memory consolidation are outside this version's scope.

Implementation: [dsh-turn-summary](../plugins/dsh-turn-summary/README.md).
