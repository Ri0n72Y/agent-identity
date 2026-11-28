# dsh-turn-summary

A Cordis plugin implementing the Session-level Turn Summary Protocol (TSP).

## Usage

Run `/summarize` in the target DSH Session. The command summarizes its latest complete local turn and updates its Session Summary with one auxiliary LLM request.

The command does not backfill skipped turns. Running it again for the same turn replaces the stored Turn Summary. If a request or JSON write fails, the command returns an error and preserves the previous committed document. The user may invoke the command again at any time.

The original Session events remain unchanged. The full textual turn and the previous Session Summary form the Markdown model input. The plugin validates and atomically writes both generated summaries as JSON. Subsequent prompts receive the persisted Session Summary and stored Turn Summaries as Markdown.

No source text or summaries are truncated by the plugin. Model input/output limits still apply; incomplete model output is rejected.

## Configuration

The plugin requires the llm, sessionQuery, systemPrompt and commands services. By default, the auxiliary request uses the Session's latest model route. An optional explicit provider/model pair and request timeout can be configured:

```yaml
- name: dsh-turn-summary
  config:
    provider: deepseek
    model: deepseek-chat
    timeoutMs: 60000
```

## State

JSON files are stored under `$DSH_HOME/state/turn-summary/`. Each filename is the hexadecimal encoding of the UTF-8 Session ID. The persisted fields are:

```json
{
  "sessionId": "example-session",
  "sessionSummary": "Current state",
  "turnSummaries": [
    { "turn": 2, "markdown": "Summary of turn 2" },
    { "turn": 7, "markdown": "Summary of turn 7" }
  ]
}
```

## Development

```sh
cd plugins/dsh-turn-summary
npm install
npm run check
```

Tests cover standalone turn extraction, Markdown rendering, model-response validation, and JSON storage. Actual DSH command and prompt behavior require a running DSH environment.
