# New Features Implementation Plan

## Decision

Implement the requested features as deterministic, local-only capabilities. Do not add an LLM, backend, telemetry, duplicate Upwork requests, or page UI.

The feature specification changes one existing product boundary: historical snapshots must become persistent local data. Update the product contract before implementing storage:

- `browser.storage.session`: latest per-tab snapshot used by the popup.
- IndexedDB: persistent, growing job snapshots, jobs, applications, and watchlist data.
- `browser.storage.local`: small profile, portfolio, preferences, and UI settings.
- No cloud sync, cross-device sync, analytics, or server-side history.
- Add a user-visible clear-data path and a bounded retention policy before shipping persistent history.

The existing audit fixes are prerequisites, not separate follow-up work. Historical persistence makes stale writes, wrong payload paths, and false interceptor events more damaging.

## Actual goal

Turn Upwork Tools into a deterministic, local job-intelligence extension that
records naturally observed competition over time and surfaces useful historical
competition, client-pay, qualification, personal-fit, application, and
watchlist context. It must remain transparent and local:

- no LLM or backend;
- no duplicate Upwork requests or polling;
- no Upwork DOM/page changes;
- no cloud sync, telemetry, or hidden scoring;
- no invented values, recommendations, or Connect-spending data.

## Task completion and review protocol

Every task ID in this plan is complete only after its implementation, review,
fixes, verification, and commit:

1. Implement all subtasks for the task ID.
2. Run the smallest task-specific test or smoke check.
3. Ask a code-reviewer subagent to review the task diff independently.
4. Fix every confirmed reviewer finding before integration.
5. Re-run the task-specific check and the affected contract tests.
6. Commit the reviewed task with a detailed Conventional Commit message.

For parallel work, each task uses an isolated branch/worktree. The task owner
must provide the reviewer with the task ID, acceptance criteria, changed files,
and verification output. Reviewers do not edit the task directly; the owner
applies fixes, then requests re-review when the fix changes behavior.

Required commit-message content:

- imperative subject with task scope;
- body explaining non-obvious behavior, migrations, or privacy impact;
- tests and smoke checks run;
- explicit migration notes for IndexedDB/schema or product-boundary changes.

Example:

```text
feat(storage): persist applicant snapshots

Append normalized per-job competition snapshots to IndexedDB while keeping the
latest popup snapshot in storage.session. Avoid raw GraphQL persistence and
preserve session-only behavior when IndexedDB is unavailable.

Checks: bun run test, bun run compile
```

Do not merge or commit an unreviewed task. Integration commits are separate from
task commits and must identify the task commits they combine.

## Current implementation matrix

| Feature | Current state | Plan status |
| --- | --- | --- |
| Applicant History | Not implemented | Build in Phase 1 |
| Proposal Velocity | Not implemented | Build in Phase 2 |
| Competition Snapshot | Implemented in `lib/insights.ts` and popup | Preserve |
| Interview Rate | Implemented | Preserve |
| Client Hire Rate | Implemented | Preserve |
| Client Pay Profile | Partial: spend and average hourly rate exist; fixed-payment profile absent; history source is broken | Fix in Phase 2 |
| Similar Previous Hires | Partial/broken: title matcher exists, but production history path is wrong and current job is not excluded | Fix in Phase 2 |
| Rate Context | Implemented | Preserve |
| Qualification Match | Implemented as a count; detailed expansion absent | Extend in Phase 3 |
| Job Restriction Detector | Basic meaningful-default filtering implemented | Extend in Phase 3 |
| Client Activity | Implemented as relative time | Preserve; optional classification |
| Filled / Already Hired Warning | Partial: status and current-user state exist; same-job history is not integrated | Fix in Phase 2 |
| Application State | Applied, invited, and hired states exist | Extend only where response data is reliable |
| Personal Skill Match | Not implemented | Build in Phase 3 |
| Portfolio Matcher | Not implemented | Build in Phase 3 |
| Job/Application Tracker | Not implemented | Build in Phase 4 |
| Personal Conversion Stats | Not implemented | Build in Phase 4 |
| Job Watchlist | Not implemented | Build in Phase 4 |

The prior audit's claims that `interviewRate`, `memberSince`, or `positionsToHire` are missing are invalid. They are already implemented and tested. The audit report should be amended when the corresponding fixes land: persistent local history is no longer out of scope, but remote/persistent cross-device history remains out of scope.

## Phase 0 — Contract and audit corrections

### Product/document changes

Update:

- `PRODUCT.md`
- `PROJECT_CONTEXT.md`
- `Upwork Tools - Insights Scope.md`
- `docs/AUDIT_ISSUES.md`
- `README.md`

Document:

- local persistent history and its clear/retention behavior;
- IndexedDB versus `browser.storage.session` versus `browser.storage.local`;
- that snapshots are captured only when the user naturally opens a job;
- no polling, duplicate requests, Connect spending, automatic applications, or cloud sync;
- that metrics are unavailable when the source response lacks values.

### Required audit fixes

1. **Correct client history source**
   - Change `lib/insights.ts:287` from `details.workHistory` to `buyer.workHistory`.
   - Update fixtures to use the documented GraphQL shape.

2. **Exclude the current job from history**
   - Pass the current job ID into `relatedHistory`.
   - Exclude exact current-job IDs before title matching.
   - Keep only strong deterministic matches.

3. **Make background messaging compatible with Chrome 111**
   - Replace the Promise-returning `async` message listener with `sendResponse` and `return true`, or raise the manifest floor deliberately.
   - Keep popup GET and content-script STORE behavior unchanged.

4. **Serialize per-tab cleanup and writes**
   - Add a per-tab navigation generation or serialized mutation queue.
   - Reject old-page STORE messages after `tabs.onUpdated({ status: 'loading' })`.
   - Ensure fresh-page writes cannot be deleted by an older cleanup.

5. **Prevent host-page rejection noise**
   - Add a rejection handler to the fetch inspection chain in `lib/interceptor.ts:83-85`.

6. **Tie JSON parsing to supported response context**
   - Remove or constrain the URL-less global `JSON.parse` path in `lib/interceptor.ts:120-124`.
   - Do not persist snapshots generated from arbitrary page JSON.

### Phase 0 acceptance

- The documented sample response produces non-empty recent history.
- The current job never appears as a previous/related job.
- Popup GET works on the advertised browser floor.
- Navigation cannot resurrect stale per-tab data.
- Failed Upwork requests do not produce unhandled inspection rejections.
- Only the supported job-details response can create a persisted snapshot.

## Phase 1 — Storage foundation and applicant snapshots

### Storage modules

Add a small native IndexedDB adapter, preferably `lib/database.ts`, with one versioned database and these stores:

```text
jobs
  key: non-null jobId (skip persistence when normalized id is null)
  value: normalized job/client metadata

jobSnapshots
  key: auto-increment snapshot ID
  indexes: jobId, capturedAt
  value: non-null jobId, applicants, interviewed, hired, positions, capturedAt

applications
  key: non-null jobId
  value: application state and timestamps

watchlist
  key: non-null jobId
  value: saved job metadata and latest snapshot reference

Records without a normalized job ID remain available in `storage.session` for
the current tab but are never written to IndexedDB. This prevents key
collisions and keeps historical data attributable to a real job.


Use `browser.storage.local` for:

```text
userProfile
  hourlyRate fallback, skills[], preferences

portfolio
  title, skills[], tags[], url

uiSettings
  theme and feature preferences
```

Migrate the theme preference from popup `localStorage` to `browser.storage.local` so settings follow the extension storage model.

Migration order:

1. Read and validate `uiSettings.theme` from `browser.storage.local`.
2. If absent, read and validate legacy `upwork-tools-theme` from popup
   `localStorage`.
3. Write the validated legacy value to `browser.storage.local` before switching
   reads to the new store.
4. Keep the legacy value as a fallback if the new write fails; remove it only
   after a successful migration.

Add a regression case for each legacy mode and for migration/storage failure.

### Snapshot capture flow

- Persist from the background worker after a validated `STORE_JOB_INSIGHTS` message.
- Do not depend on the popup being open.
- Capture `capturedAt` with the service-worker receipt time.
- Append snapshots; never overwrite prior applicant values.
- Deduplicate only identical adjacent captures for the same job and capture window.
- Keep `browser.storage.session` as the latest per-tab snapshot for fast popup reads.
- Apply the Phase 0 navigation generation before writing either session or IndexedDB data.

### Data integrity

- Preserve nullable values and valid zeroes.
- Do not invent applicants, rates, timestamps, or application states.
- Store only normalized data required by the feature set; do not persist raw GraphQL responses or review comments.
- Add clear-all history and retention behavior before enabling persistent storage in production.
- Skip IndexedDB persistence when `job.id` is null; keep the snapshot session-only.


### Phase 1 acceptance

- Opening a job naturally records one normalized snapshot without a duplicate network request.
- Reopening the same job later appends a new snapshot.
- Snapshots from different jobs remain isolated by `jobId`.
- Old-page messages cannot write after navigation cleanup.
- IndexedDB failures degrade to the existing session-only popup behavior.
- A null job ID never creates a history key or collides with another job.

## Phase 2 — Historical competition and client pay insights

### Applicant History

Add pure derived functions, preferably in `lib/metrics.ts`:

- latest applicant count;
- first-seen applicant count and delta;
- recent applicant delta;
- elapsed time between valid snapshots.

Do not show a trend when there are fewer than two valid snapshots or timestamps are missing/out of order.

### Proposal Velocity

Calculate:

```text
(latestApplicants - previousApplicants) / elapsedHours
```

Recommended v1 rules:

- require at least one hour between snapshots;
- require finite, non-negative elapsed time;
- hide the rate when applicants or timestamps are unavailable;
- display factual velocity first; use “rising” only for a documented deterministic threshold;
- never call the job good, bad, hot, or worth applying to.

### Client Pay Profile

Use corrected `buyer.workHistory` data plus buyer summary stats:

- existing total spend;
- existing average hourly rate;
- median recent fixed payments;
- optional average recent fixed payment;
- hourly historical rate only when the work-history response supplies a valid rate.

Do not calculate an hourly rate from fixed payments or zero-hour entries. Show `Not available` when the response does not provide enough data.

### Similar Previous Hires

- Compare current title and available skills against historical job data.
- The documented work-history sample exposes titles but not historical skills, so v1 must not pretend to perform skill similarity where those fields are absent.
- Use normalized lowercase token overlap/Jaccard on titles as the fallback.
- Exclude the current job ID.
- Require a strong match threshold and show at most three results.

### Filled and already-hired warning

Combine:

- `job.status`;
- `totalHired` and `positionsToHire`;
- current-user `hired`/`contract` state;
- same-job history entries after the history path is fixed.

Do not infer that the current freelancer was hired merely because the job has one or more hires.

### Phase 2 acceptance

- A single snapshot still renders the existing competition view with no trend claim.
- Two valid snapshots render delta and velocity only after the elapsed-time threshold.
- Fixed-payment statistics exclude invalid, missing, and zero-placeholder values as appropriate.
- Similar history never includes the current job.
- Filled and current-user-hired signals remain distinct and factual.

## Phase 3 — Personal profile, qualification, skill, and portfolio matching

### Qualification details

Extend the normalized model to retain meaningful matched requirements, not just counts:

- requirement name;
- client requirement label;
- freelancer value/label;
- matched boolean.

Keep the summary compact (`matched/total`) with an expandable details section. Suppress defaults such as `Any`, JSS `0`, empty strings, and false flags.

### Job restrictions

Extend deterministic parsing for real values such as:

- countries and locations;
- minimum JSS;
- language level;
- minimum hours or earnings;
- portfolio requirement;
- on-site requirements.

Do not display meaningless defaults.

### Personal skill match

- Store `userProfile.skills[]` in `browser.storage.local`.
- Normalize case, whitespace, punctuation, and a small explicit alias map.
- Compare against both `ontologySkills` and `additionalSkills`.
- Display matched/total only when a profile exists; otherwise show no invented score.

### Portfolio matcher

- Store local entries as `{ title, skills, tags, url }`.
- Rank using deterministic title/tag/skill overlap.
- Show only strong matches, with a bounded result count.
- Treat URLs as user-provided data; open externally with normal extension-safe link behavior.

### Phase 3 acceptance

- Users can configure skills and portfolio entries without a backend.
- Matching is explainable by visible overlap, not an opaque score.
- Empty profiles do not produce false zero-match claims.
- Qualification and restriction details remain compact and default-free.

## Phase 4 — Application tracker, conversion stats, and watchlist

### Application tracker

Persist one record per job in IndexedDB:

```text
jobId
job title
viewedAt
appliedAt when observed or manually marked
status
interview state when directly observed
hire state when directly observed
```

The response can reliably provide viewed/current snapshot and some application states. It cannot be assumed to provide bid or Connect counts. Do not add Connect-spending storage under the current product boundary.

If manual tracking is later requested, add explicit user actions and label manually entered values. Never infer an application from opening a job.

### Personal conversion stats

Aggregate only tracker records with known states:

- applications;
- interviews;
- hires;
- apply-to-interview rate;
- interview-to-hire rate.

Show sample sizes beside percentages. Hide rates when the denominator is zero or unknown.

### Watchlist

- Add a bookmark action for a captured job.
- Store job metadata and the latest snapshot in IndexedDB.
- Update watchlisted jobs only when the user naturally opens them.
- Do not poll Upwork or create background requests.
- Add an explicit remove action and include watchlist data in clear-all controls.

### Phase 4 acceptance

- Tracker transitions are based only on observed or explicitly user-entered states.
- Conversion metrics exclude unknown states and show denominators.
- Watchlist updates occur only from naturally captured responses.
- No application, bid, Connect, or polling behavior is introduced implicitly.

## Phase 5 — Popup information architecture and release hardening

Keep the default popup compact:

1. exact proposals and competition snapshot;
2. applicant delta/velocity only when enough history exists;
3. client quality and pay profile;
4. fit, qualification, skill, and rate context;
5. warnings;
6. expandable related history, tracker, and watchlist controls.

Add a settings/options surface for profile skills and portfolio rather than expanding the main popup indefinitely.

Update README with:

- install/load-unpacked steps;
- Bun development and build commands;
- Chrome/Firefox packaging;
- supported Upwork response and page behavior;
- local storage and clear-data behavior;
- troubleshooting for missing snapshots.

### Release acceptance

- `bun run test`
- `bun run compile`
- `bun run lint`
- `bun run format:check`
- `bun run build`
- manual Chromium smoke test on an authenticated supported job page;
- navigation, empty state, delayed capture, storage failure, and clear-data scenarios exercised.

## Dependency order

```text
Contract update + audit fixes
          ↓
IndexedDB/storage.local foundation
          ↓
Applicant snapshots
          ↓
Velocity + pay profile + corrected related history
          ↓
Qualification/skill/profile/portfolio matching
          ↓
Application tracker + conversion stats + watchlist
          ↓
Popup/options UX + release hardening
```

Do not start portfolio matching, conversion statistics, or watchlist UI before the storage foundation and data-retention behavior exist. Do not ship persistent history while the per-tab write/cleanup race and wrong work-history path remain unresolved.

## Open decisions to resolve before implementation

1. **Retention:** default snapshot retention window and maximum snapshots per job.
2. **Clear data:** whether one clear button removes all history, or whether jobs, applications, portfolio, and watchlist can be cleared separately.
3. **Manual tracker fields:** whether bid is manually entered; Connect counts remain excluded unless the product boundary changes explicitly.
4. **Velocity threshold:** keep the proposed one-hour minimum or choose another deterministic threshold.
5. **Options surface:** use a dedicated WXT options entrypoint for profile and portfolio editing, recommended over a larger popup.

## Task and subtask breakdown

### Phase 0 — Contract and audit corrections

- [ ] **P0.1 — Update product boundaries**
  - [ ] Define persistent local history and retention.
  - [ ] Define clear-data behavior.
  - [ ] Keep cloud sync, telemetry, polling, and Connect tracking excluded.
  - [ ] Update `PRODUCT.md`, `PROJECT_CONTEXT.md`, and the scope document.
- [x] **P0.2 — Correct history normalization**
  - [x] Read `buyer.workHistory`.
  - [x] Update fixtures to the documented response shape.
  - [x] Add a production-shaped regression test.
- [x] **P0.3 — Fix related-history identity**
  - [x] Pass current job ID into matching.
  - [x] Exclude the current job before title matching.
  - [x] Require strong deterministic matches.
- [x] **P0.4 — Fix runtime messaging compatibility**
  - [x] Replace the Promise-only listener with `sendResponse`.
  - [x] Preserve popup GET and content STORE contracts.
  - [x] Verify the Chrome 111 compatibility path.
- [x] **P0.5 — Serialize tab lifecycle mutations**
  - [x] Add per-tab navigation generation or mutation sequencing.
  - [x] Reject stale STORE messages after navigation starts.
  - [x] Prevent cleanup from deleting fresh-page data.
- [x] **P0.6 — Harden interception**
  - [x] Handle rejected fetch inspection promises.
  - [x] Remove or constrain URL-less global `JSON.parse` capture.
  - [x] Preserve original host-page behavior.
- [x] **P0.7 — Add audit regression tests**
  - [x] Test history source and current-job exclusion.
  - [x] Test protocol/runtime boundary behavior.
  - [x] Test interceptor failure paths.

### Phase 1 — Storage foundation and applicant snapshots

- [x] **P1.1 — Define storage ownership**
  - [x] Keep latest per-tab data in `storage.session`.
  - [x] Put growing records in IndexedDB.
  - [x] Put profile, portfolio, and settings in `storage.local`.
- [x] **P1.2 — Build the IndexedDB schema**
  - [x] Add versioned database initialization.
  - [x] Add `jobs` store and `jobId` key.
  - [x] Add append-only `jobSnapshots` store and indexes.
  - [x] Add `applications` and `watchlist` stores.
- [x] **P1.3 — Build local-settings storage**
  - [x] Store profile and skills.
  - [x] Store portfolio entries.
  - [x] Store UI preferences.
  - [x] Migrate theme preference from `localStorage`.
- [x] **P1.4 — Persist normalized job captures**
  - [x] Persist after validated background STORE messages.
  - [x] Capture local `capturedAt`.
  - [x] Deduplicate identical adjacent captures.
  - [x] Never persist raw GraphQL payloads.
- [x] **P1.5 — Add retention and clear-data APIs**
  - [x] Enforce snapshot retention limits.
  - [x] Add clear-history operation.
  - [x] Include applications and watchlist in clear-data policy.
- [ ] **P1.6 — Handle storage degradation**
  - [ ] Keep session-only popup behavior when IndexedDB fails.
  - [ ] Avoid blocking host-page message handling.
  - [ ] Test storage failure behavior.

### Phase 2 — Historical competition and client pay insights

- [x] **P2.1 — Add snapshot queries**
  - [x] Query snapshots by job ID and capture time.
  - [x] Return latest, first-seen, and recent snapshots.
- [x] **P2.2 — Add applicant deltas**
  - [x] Calculate first-seen proposal delta.
  - [x] Calculate recent proposal delta.
  - [x] Hide deltas with insufficient valid data.
- [x] **P2.3 — Add proposal velocity**
  - [x] Require at least the chosen elapsed-time threshold.
  - [x] Reject invalid or out-of-order timestamps.
  - [x] Calculate proposals per hour.
  - [x] Use factual labels only.
- [x] **P2.4 — Add client pay profile**
  - [x] Calculate median recent fixed payments.
  - [x] Calculate optional average fixed payment.
  - [x] Use historical hourly rates only when supplied.
  - [x] Keep zero placeholders and missing values unavailable.
- [ ] **P2.5 — Finish similar previous hires**
  - [ ] Use title overlap as the documented v1 fallback.
  - [ ] Use skills only when historical skills exist.
  - [ ] Exclude current job and weak matches.
  - [ ] Limit displayed results.
- [ ] **P2.6 — Complete hiring warnings**
  - [ ] Combine status, positions, and hired counts.
  - [ ] Keep client hires distinct from freelancer hired state.
  - [ ] Use same-job history only after identity filtering.
- [ ] **P2.7 — Add historical UI**
  - [ ] Add applicant history summary.
  - [ ] Add velocity only when valid.
  - [ ] Add client pay profile details.
  - [ ] Keep default popup compact.
- [ ] **P2.8 — Test historical metrics**
  - [ ] Test zero applicants and zero elapsed time.
  - [ ] Test missing and invalid timestamps.
  - [ ] Test fixed/hourly payment boundaries.
  - [ ] Test related-history thresholds.

### Phase 3 — Personal profile, qualification, skill, and portfolio matching

- [ ] **P3.1 — Add profile/options editing**
  - [ ] Create a settings surface for skills and profile values.
  - [ ] Persist settings in `storage.local`.
  - [ ] Keep captured Upwork rate as the primary source.
- [x] **P3.2 — Normalize skill names**
  - [x] Normalize case and punctuation.
  - [x] Add a small explicit alias map.
  - [x] Preserve source labels for display.
- [x] **P3.3 — Add personal skill match**
  - [x] Compare profile skills with both job skill arrays.
  - [x] Display matched/total only when a profile exists.
  - [x] Avoid opaque scoring.
- [ ] **P3.4 — Expand qualification details**
  - [ ] Preserve requirement labels and freelancer values.
  - [ ] Preserve each qualified boolean.
  - [ ] Add an expandable details section.
- [x] **P3.5 — Expand restriction detection**
  - [x] Parse real location restrictions.
  - [x] Parse language, JSS, hours, earnings, and on-site values.
  - [x] Suppress `Any`, zero, false, and empty defaults.
- [x] **P3.6 — Add portfolio storage**
  - [x] Store title, skills, tags, and URL locally.
  - [x] Add create, edit, and remove operations.
- [x] **P3.7 — Add portfolio ranking**
  - [x] Rank title/tag/skill overlap deterministically.
  - [x] Require a strong match.
  - [x] Bound displayed results.
- [x] **P3.8 — Test personal matching**
  - [x] Test aliases and punctuation normalization.
  - [x] Test empty profile behavior.
  - [x] Test default restriction suppression.
  - [x] Test portfolio ranking boundaries.

### Phase 4 — Application tracker, conversion stats, and watchlist

- [ ] **P4.1 — Define application state model**
  - [ ] Store viewed, applied, interview, and hired timestamps when known.
  - [ ] Separate observed states from manual values.
  - [ ] Exclude Connect counts under the current boundary.
- [ ] **P4.2 — Record observed transitions**
  - [ ] Record viewed when a normalized capture is received.
  - [ ] Record applied/invited/hired only from reliable response fields.
  - [ ] Never infer applied from viewing.
- [ ] **P4.3 — Add optional manual tracker actions**
  - [ ] Decide whether bid is manually entered.
  - [ ] Label all manual values.
  - [ ] Do not add automatic application behavior.
- [ ] **P4.4 — Add conversion metrics**
  - [ ] Aggregate known application records.
  - [ ] Calculate apply-to-interview rate.
  - [ ] Calculate interview-to-hire rate.
  - [ ] Display denominators and hide zero/unknown rates.
- [ ] **P4.5 — Add watchlist operations**
  - [ ] Bookmark captured jobs.
  - [ ] Store latest metadata and snapshot reference.
  - [ ] Remove watchlisted jobs.
  - [ ] Update only on natural job captures.
- [ ] **P4.6 — Add tracker/watchlist UI**
  - [ ] Add compact controls to the popup.
  - [ ] Add a watchlist view or options surface.
  - [ ] Add clear-data integration.
- [ ] **P4.7 — Test tracker behavior**
  - [ ] Test observed state transitions.
  - [ ] Test unknown-state exclusion from metrics.
  - [ ] Test watchlist isolation and removal.

### Phase 5 — Popup information architecture and release hardening

- [ ] **P5.1 — Rework popup hierarchy**
  - [ ] Keep competition metrics above the fold.
  - [ ] Add conditional applicant history and velocity.
  - [ ] Keep pay, fit, warnings, and history expandable where possible.
- [ ] **P5.2 — Add refresh and failure actions**
  - [ ] Add retry for empty/error reads.
  - [ ] Re-read session data without making network requests.
  - [ ] Explain session-only fallback when persistent storage fails.
- [ ] **P5.3 — Add clear-data controls**
  - [ ] Expose history/application/watchlist clearing.
  - [ ] Confirm destructive local deletion.
  - [ ] Preserve unrelated browser data.
- [ ] **P5.4 — Replace the starter README**
  - [ ] Document install and load-unpacked steps.
  - [ ] Document Bun development/build/package commands.
  - [ ] Document privacy, retention, and supported response behavior.
  - [ ] Document troubleshooting.
- [ ] **P5.5 — Run automated checks**
  - [ ] Run `bun run test`.
  - [ ] Run `bun run compile`.
  - [ ] Run `bun run lint`.
  - [ ] Run `bun run format:check`.
  - [ ] Run `bun run build`.
- [ ] **P5.6 — Run manual smoke scenarios**
  - [ ] Capture an authenticated supported job.
  - [ ] Navigate before a response completes.
  - [ ] Open popup before and after capture.
  - [ ] Exercise storage failure fallback.
  - [ ] Exercise clear-data behavior.
- [ ] **P5.7 — Close documentation loop**
  - [ ] Update `docs/AUDIT_ISSUES.md` statuses.
  - [ ] Mark persistent local history as in scope.
  - [ ] Keep cloud sync, telemetry, polling, and Connect tracking out of scope.

## Parallel execution map

Use dependency barriers between waves. Tasks in the same wave are independent only
when they have separate file ownership or separate interfaces. Do not let two
workers edit the same integration file at the same time.

### Ownership rules

- `lib/insights.ts`: one owner for `P0.2 → P0.3`, then integrate parser/model
  changes from `P2.5`, `P2.6`, `P3.4`, and `P3.5` sequentially.
- `entrypoints/background.ts`: one owner for `P0.4 → P0.5 → P1.4 → P4.2`.
- IndexedDB adapter: one owner for `P1.2 → P1.4 → P1.5`, then `P4.1` and
  `P4.5` against the stabilized interface.
- Popup components: one owner for `P2.7`, `P3.3`, `P3.7`, `P4.6`, and `P5.1`
  unless each task owns a separate component file.
- Tests may run in parallel with implementation only when they target a
  stabilized interface; integration tests wait for the owning implementation.

### Barrier 0 — Decisions and contracts

Complete before persistent-data implementation:

- `P0.1` product-boundary update.
- Open decisions 1–5 in this plan.
- Define the normalized snapshot, IndexedDB record, and local-profile contracts.

### Wave 1 — Independent audit corrections

Run these in parallel after Barrier 0:

- `P0.2` correct `buyer.workHistory`.
- `P0.4` fix runtime messaging compatibility.
- `P0.6` harden interception.
- `P1.1` define storage ownership and interfaces.
- `P5.4` may begin README content once the revised boundaries are agreed.

### Wave 2 — Dependent audit fixes and storage schema

Start after the relevant Wave 1 task:

- `P0.3` after `P0.2`.
- `P0.5` after `P0.4`; both share `entrypoints/background.ts` ownership.
- `P1.2` after `P1.1`.
- `P1.3` after `P1.1`; independent of the IndexedDB schema.
- `P0.7` after `P0.2`, `P0.3`, `P0.4`, `P0.5`, and `P0.6`.

`P1.2` and `P1.3` can run in parallel because they use separate storage
adapters. `P0.7` is the integration barrier for audit corrections.

### Wave 3 — Persistence and pure model work

Start after `P0.7`, `P1.2`, and the required dependencies:

- `P1.4` after `P1.2` and `P0.5`.
- `P1.5` after `P1.2`; it can run alongside `P1.4` only if both use a
  stabilized database interface and a single integration owner.
- `P1.6` after `P1.4`.
- `P2.1` after `P1.4`.
- `P3.2` after the profile contract from `P1.3`.
- `P3.4` and `P3.5` after `P0.2`; implement them in separate pure modules
  before integrating their model fields.
- `P3.6` after `P1.3`.

### Wave 4 — Independent derived features

Start after the snapshot/query and profile contracts:

- `P2.2` and `P2.3` after `P2.1`; these can run in parallel as pure metrics.
- `P2.4` after `P1.4` and corrected history normalization.
- `P2.5` after `P0.2` and `P0.3`.
- `P2.6` after `P0.2` and `P0.3`.
- `P3.3` after `P3.2` and `P1.3`.
- `P3.7` after `P3.2` and `P3.6`.
- `P4.1` after `P1.2`; define the application record without editing the
  background integration yet.

`P2.2`, `P2.3`, `P2.4`, `P3.3`, `P3.7`, and `P4.1` are parallelizable when
they return independent typed results.

### Wave 5 — UI and tracker integration

Start after the corresponding derived contracts:

- `P2.7` after `P2.2`, `P2.3`, and `P2.4`.
- `P2.8` after the Phase 2 pure metrics; it can run alongside `P2.7`.
- `P3.8` after `P3.3`, `P3.4`, `P3.5`, and `P3.7`.
- `P4.2` after `P4.1`, `P1.4`, and the stabilized background owner.
- `P4.5` after `P4.1`; watchlist DAO work can run alongside `P4.2`.
- `P5.2` and `P5.3` after the storage clear/fallback contracts; they can run
  in parallel in separate popup/settings files.

### Wave 6 — Final tracker and release integration

Start after tracker records and UI contracts stabilize:

- `P4.3` after `P4.1`; keep manual fields explicitly labeled.
- `P4.4` after `P4.1` and `P4.2`; pure aggregation can run alongside `P4.5`.
- `P4.6` after `P4.4`, `P4.5`, `P5.2`, and `P5.3`.
- `P4.7` after `P4.2`, `P4.4`, and `P4.5`.
- `P5.1` after the Phase 2–4 display contracts.
- `P5.5` only after all implementation waves finish.
- `P5.6` after `P5.5`.
- `P5.7` after `P5.6`; documentation must describe exercised behavior.

### Critical path

```text
P0.1
  ↓
P0.2 → P0.3
P0.4 → P0.5
P0.6
  ↓
P0.7
  ↓
P1.1 → P1.2 → P1.4 → P2.1 → P2.2/P2.3 → P2.7
       └────→ P1.5 → P5.3
P1.3 → P3.2 → P3.3
P1.3 → P3.6 → P3.7
P1.2 → P4.1 → P4.2 → P4.4 → P4.6
```

The longest shared integration path is the release blocker. Optional UI,
portfolio, and pure-metric workers may finish earlier, but they must not be
merged ahead of the storage, navigation-generation, and normalized-data
contracts.
