# Turn Summary Protocol (TSP)

TSP provides Session-level working memory. The original DSH Session log remains the source of evidence. Amadeus may consume TSP in its memory workflow.

## Execution

1. The user executes /summarize in the target Session.
2. Read the latest complete local turn from the original Session events.
3. Render the turn as Markdown, preserving the user input, tool invocations and results, failed attempts with concise causes, and final delivered output. Include the Session ID in the input. Exclude hidden reasoning and runtime context snapshots.
4. Submit the full rendered turn and the previous Session Summary to one auxiliary LLM request.
5. Validate the two Markdown summaries in the JSON response: turnSummary and sessionSummary.
6. Atomically persist the new Turn Summary and updated Session Summary in the Session's JSON document.
7. Subsequent prompt assembly reads the persisted TSP as Markdown.

Every command invocation summarizes exactly one turn: the latest complete local turn. Users choose when to run the command. Skipped turns are valid and are not backfilled. Repeated invocation for the same turn replaces its Turn Summary. A failed request or write returns an error without committing the new summary.

The plugin does not truncate source text, generated summaries, stored turn records, or injected Markdown. If the model cannot process the input or finish its response, the command fails without saving partial output.

## Persistence

Location: $DSH_HOME/state/turn-summary/. Each Session has a JSON file named by its UTF-8 Session ID encoded in hexadecimal.

The document contains sessionId, sessionSummary and turnSummaries. Each turn entry contains turn and markdown. Turn numbers identify the source turn in the corresponding Session. Summary content is natural language, with no actor, type or status taxonomy.

The Session Summary represents the current working state. Turn Summaries preserve the individual turns the user chose to summarize. They are not required to be consecutive.

Implementation: [dsh-turn-summary](../plugins/dsh-turn-summary/README.md).
