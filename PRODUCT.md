# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

WXT, Manifest V3, TypeScript, React, and Bun. Chromium 111+ is the primary target; Firefox build commands are also configured.

## Users

Independent Upwork freelancers evaluating jobs while viewing an authenticated Upwork job-details page. Their immediate job is deciding whether an opportunity is worth pursuing and applying to.

## Product Purpose

Upwork Tools shows useful job-quality information already present in Upwork's authenticated job-details response. It helps a freelancer assess an opportunity quickly, with Exact Proposals as the primary metric and supporting applicant, activity, and client signals. Success means showing the current job's latest available insight for the active browser tab without disrupting Upwork.

## Positioning

A local-first browser extension for broad job-quality intelligence: it combines exact applicant activity with client and job signals from the response the user already received, rather than creating duplicate job-details requests or depending on a backend.

## Operating Context

The user opens an Upwork job in a browser tab, lets its details load normally, and opens the extension popup to review the latest captured snapshot for that tab. The popup must remain useful when data is missing, unavailable, loading, or cannot be read. Each browser tab is evaluated independently; only its latest `browser.storage.session` snapshot is cleared when a tab starts loading a new page or closes. Persistent IndexedDB history is retained independently.
 
## Local data boundary

Captures are created only when the user naturally opens an Upwork job and the supported response is already received; there is no polling or duplicate request. The latest per-tab snapshot uses `browser.storage.session`. Persistent normalized job snapshots, applications, and watchlist data use IndexedDB; small profile, portfolio, preference, and UI settings use `browser.storage.local`. Persistent history is retained for 90 days and at most 100 snapshots per job. One clear-data operation removes this extension's history, applications, and watchlist while preserving unrelated browser storage. Missing source values remain unavailable; the extension never invents them.

Cloud sync, telemetry, Connect tracking, automatic applications, backend storage, and Upwork page UI remain out of scope.


## Capabilities and Constraints

- A MAIN-world content script observes Upwork's job-details GraphQL response at document start, cloning matching responses before inspection.
- Inspection failures must not affect the original Upwork request, response, or page behavior.
- Only the supported `gql-query-get-auth-job-details-v2` response is inspected and normalized into nullable `JobInsights` data; missing or invalid values become `null`, while valid zeroes remain `0`.
- An isolated content script validates page events and forwards normalized snapshots to the background service worker.
- The background worker validates sender tab identity, stores the latest snapshot per tab in `browser.storage.session`, and appends normalized job metadata and competition snapshots to IndexedDB when a job ID exists.
- The popup requests the active tab's snapshot and renders loading, empty, error, or available states. Exact Proposals leads transparent competition metrics, followed by client quality, Your Fit, applicable warnings, and expandable client history or related jobs.
- Formatting handles money, percentages, dates, relative activity, statuses, ratings, rate context, and unavailable values. Historical client hire rate uses jobs with hires divided by jobs posted; no AI score or apply/skip recommendation is generated.
- No backend, accounts, analytics, telemetry, cloud sync, automatic applications, Connect-spending data, polling, duplicate job-details requests, or Upwork DOM/page UI.
- Persistent normalized history is local, bounded, and clearable; it is not merged across tabs or synced to the cloud.

## Brand Commitments

The product name is **Upwork Tools**. The extension describes itself as showing locally captured Upwork job insights for the active tab. Existing extension icon assets are in `public/icon/`.

## Evidence on Hand

- Product and implementation brief: `PROJECT_CONTEXT.md`.
- Popup implementation: `entrypoints/popup/App.tsx`.
- Network integration: `entrypoints/interceptor.content.ts`, `entrypoints/content.ts`, and `lib/interceptor.ts`.
- Background tab storage: `entrypoints/background.ts`.
- Normalized model, protocol validation, and formatting: `lib/insights.ts`, `lib/protocol.ts`, and `lib/format.ts`.
- No testimonials, customer logos, case studies, or external proof assets are present; future work must not fabricate them.

## Product Principles

- Read from the user's existing authenticated response; do not create duplicate requests.
- Keep insight data local, bounded, clearable, and isolated per tab/job; use session storage for the latest tab snapshot and IndexedDB for persistent history.
- Never interfere with Upwork's normal page behavior.
- Make the most decision-relevant signal, Exact Proposals, immediately legible.
- Treat missing upstream data as a normal state rather than inventing certainty.
