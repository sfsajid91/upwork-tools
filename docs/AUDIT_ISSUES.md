# Upwork Tools Audit Issues

This report records findings independently verified against the current source and the documented GraphQL response shape. It does not include speculative features or findings that could not be confirmed.

## Confirmed issues

### P1 — Client history reads the wrong response path

- **Location:** `lib/insights.ts:287`
- **Evidence:** The parser reads `details.workHistory`. The documented response stores work history under `jobAuthDetails.buyer.workHistory` (`PROJECT_CONTEXT.md:299` onward).
- **Impact:** Production snapshots normalize with empty `recentJobs` and `relatedJobs`; both history sections silently disappear.
- **Fix:** Read `valueAt(buyer, 'workHistory')` and update fixtures to match the documented response shape.
- **Test gap:** Existing fixtures place `workHistory` at the details root, so they do not catch this production mismatch.

### P1 — Background messaging is incompatible with the advertised Chrome floor

- **Location:** `entrypoints/background.ts:33-40`; `wxt.config.ts:13`
- **Evidence:** The runtime message listener is declared `async` and returns a Promise, while the manifest supports Chrome 111. Promise-returning `onMessage` listeners are not supported across the full advertised Chrome range.
- **Impact:** On older supported Chrome versions, `GET_JOB_INSIGHTS` can fail to deliver the stored snapshot and the popup may show an empty state despite available data.
- **Fix:** Use the callback form with `sendResponse` and a literal `return true`, or raise the minimum Chrome version to the first version that reliably supports Promise listeners.

### P1 — Navigation cleanup races with snapshot writes

- **Location:** `entrypoints/background.ts:40-45, 62-65`
- **Evidence:** Snapshot writes and navigation cleanup each start independent asynchronous storage operations.
- **Impact:** A late response from the old page can resurrect stale insights after cleanup. A new-page write can also be deleted by a late cleanup operation.
- **Fix:** Serialize per-tab storage mutations or use a navigation generation/token so old-page writes are rejected after loading begins.

### P2 — Rejected fetch inspection promises can affect the host page

- **Location:** `lib/interceptor.ts:83-85`
- **Evidence:** The inspection chain attaches only a fulfillment handler to `result.then(...)`. A rejected fetch creates an unhandled derived rejection.
- **Impact:** Upwork's page can receive an unhandled rejection even though the original fetch behavior remains intact.
- **Fix:** Add a rejection handler that resolves to `undefined`.

### P2 — Global `JSON.parse` inspection bypasses the supported URL filter

- **Location:** `lib/interceptor.ts:120-124`
- **Evidence:** The global JSON parser wrapper marker-matches arbitrary strings and calls `inspectPayload(payload)` without a verified URL.
- **Impact:** Unrelated page code that parses a matching-shaped object can emit a job-details event even though it did not come from the supported GraphQL response.
- **Fix:** Tie JSON parsing to verified response context, or remove this URL-less capture path and rely on the URL-aware fetch, `Response`, and XHR paths.

### P2 — Related history can include the current job

- **Location:** `lib/insights.ts:198-228`
- **Evidence:** Related matching uses title tokens only and does not exclude the current job. The documented response includes the current opening in buyer work history with the same ID/title.
- **Impact:** After fixing the history path, the active job can appear as a previous or related job.
- **Fix:** Pass the current job ID into the matcher and exclude that entry before scoring. Require strong title matches after exclusion.

### P2 — README is still the starter template

- **Location:** `README.md:1-3`
- **Evidence:** The file only describes a generic WXT + React template.
- **Impact:** Users and release operators cannot discover installation, build/package commands, supported pages, popup states, or local session-data boundaries.
- **Fix:** Replace it with project-specific setup, development, packaging, privacy, and troubleshooting guidance.

## Recommended additions

These are improvements, not confirmed scope failures:

1. Add a popup retry/refresh action that re-reads session storage without making another Upwork request.
2. Add focused tests for the production history path, current-job exclusion, rejected fetches, JSON.parse filtering, and tab cleanup races.
3. Add a compact optional job-details section for already-normalized workload, duration, category, contractor tier, and skills.
4. Expand meaningful restriction parsing for non-default language, location, hours, and on-site requirements.
5. Handle hourly jobs with a zero placeholder budget without displaying misleading `$0.00`.

## Verified as already implemented

- `interviewRate`
- `memberSince`
- `positionsToHire`
- valid zero preservation
- default restriction suppression
- nullable runtime validation
- per-tab session storage architecture
- loading, empty, error, and available popup states
- no backend, telemetry, duplicate requests, or persistent cross-tab history

## Explicitly out of scope

Do not add AI job scores, winning probabilities, good/bad client labels, apply/skip recommendations, AI summaries, proposal generation, Connect-spending tracking, or automatic applications.
