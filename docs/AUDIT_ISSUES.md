# Upwork Tools Audit Issues

This report records findings independently verified against the current source and the documented GraphQL response shape. It does not include speculative features or findings that could not be confirmed.

## Revised product boundary

The extension captures only naturally observed supported responses when the user opens a job: no polling, duplicate requests, or page UI. `browser.storage.session` remains the latest per-tab snapshot; IndexedDB is the persistent store for normalized job snapshots, applications, and watchlist; `browser.storage.local` is for small profile, portfolio, preference, and UI settings. Persistent history is retained for exactly 90 days and at most 100 snapshots per job. One clear-data operation clears extension history, applications, and watchlist without clearing unrelated browser storage. Missing source values are unavailable, not inferred.

Cloud sync, telemetry, Connect tracking, automatic applications, backend storage, and cross-device history are excluded.

## Resolved issues

The following audit findings are fixed and covered by focused tests:

### Client history source

- `lib/insights.ts` reads `buyer.workHistory`, matching the documented
  `jobAuthDetails.buyer.workHistory` response shape.
- Production-shaped fixtures and regression tests verify non-empty history.

### Chrome 111 runtime messaging

- `entrypoints/background.ts` uses callback-based `sendResponse` handling and
  literal `return true` for asynchronous GET and STORE messages.
- Sender validation, session reads/writes, and badge updates remain intact.

### Navigation and tab lifecycle safety

- Per-tab generations, stable state tokens, removed-state invalidation, and
  serialized mutations reject stale writes and protect reused tab IDs.
- Focused tests cover stale stores, fresh stores, cleanup ordering, and
  storage failure.

### Interception safety

- Rejected inspection chains are consumed without replacing host-visible
  fetch/Response promises.
- URL-less global `JSON.parse` capture was removed; supported URL-aware fetch,
  Response, and XHR paths remain.
- Interceptor tests cover supported/unsupported URLs, arbitrary JSON parsing,
  rejected fetches, response body/status preservation, and prototype cleanup.

### Related history identity

- The current job ID is excluded before strong deterministic title matching,
  with a maximum of three related jobs.

### Documentation

- README now documents installation, Bun commands, packaging, supported
  responses, local persistence, retention, clear-data scope, and troubleshooting.

## Remaining recommendations

These are follow-up improvements, not confirmed scope failures:

1. Add popup retry/refresh and historical metrics integration without network
   requests.
2. Add qualification, restriction, skill, and pay sections to the popup or
   options surface.
3. Add application tracker, conversion statistics, watchlist UI, and manual
   Chromium release scenarios.

## Verified boundaries

- `interviewRate`, `memberSince`, and `positionsToHire`
- valid zero preservation and nullable runtime validation
- per-tab session storage with bounded persistent local history
- loading, empty, error, and available popup states
- no backend, telemetry, polling, duplicate requests, or cross-device history

## Explicitly out of scope

Do not add cloud sync, telemetry, polling, duplicate requests, Connect-spending tracking, automatic applications, Upwork page UI, AI job scores, winning probabilities, good/bad client labels, apply/skip recommendations, AI summaries, or proposal generation.
