# Upwork Tools — Insights Scope

The goal is to show only insights that help answer:

**Is this job worth applying to?**

## Product boundary

This scope is local-only and deterministic. A snapshot is captured only from the supported response naturally received when the user opens a job; there is no polling, duplicate request, or page UI. The latest per-tab value uses `browser.storage.session`; persistent normalized snapshots, applications, and watchlist data use IndexedDB; small profile, portfolio, preferences, and UI settings use `browser.storage.local`. Retain history for 90 days and no more than 100 snapshots per job. One clear-data operation removes extension history, applications, and watchlist while preserving unrelated browser storage. If the source does not provide a value, show it as unavailable.

Out of scope: cloud sync, telemetry, polling, duplicate requests, Connect tracking, automatic applications, backend storage, Upwork page UI, and invented scores or recommendations.

## 1. Competition

Show:

- Exact proposals
- Interviewed count
- Hired count
- Number of positions
- Job status: Open / Filled
- Client last activity

Derived:

- Interview rate = interviewed / applicants

Example:

```text
38 proposals
4 interviewed · 1 hired
1 position
10.5% interviewed
Client active recently
```

## 2. Client Quality

Show:

- Payment verified
- Client rating
- Review count
- Total spend
- Jobs posted
- Jobs with hires
- Historical hire rate
- Average hourly rate paid
- Member since
- Location

Derived:

- Hire rate = jobs with hires / jobs posted

Example:

```text
✓ Payment verified
★ 4.99 · 40 reviews
$3.4K spent
79% hire rate
62 jobs posted
$10.16/hr avg paid
Member since 2009
Norway
```

## 3. Your Fit

Show:

- Number of Upwork qualification requirements matched
- Current freelancer hourly rate
- Client historical average hourly rate
- Existing application/invite/hire state when relevant

Derived:

- Rate context = freelancer rate / client historical average

Example:

```text
✓ 6/6 requirements matched

Your rate     $25/hr
Client avg    $10.16/hr
~2.5× client historical average
```

Do not label the rate difference as good or bad.

## 4. Client History

Expandable section showing the most recent 3–5 jobs:

- Job title
- Fixed/hourly
- Amount paid
- Freelancer feedback score
- Status

Example:

```text
Recent jobs

Premium Landing Page Design
$400 fixed · 5★

Logo Redesign
$255 fixed · 5★
```

## 5. Related Previous Jobs

Identify previous client jobs that appear related to the current job.

Show only strong matches.

Example:

```text
Related history

Premium domain landing page template
$400 fixed · 5★
```

This can reveal whether the current project is a continuation of previous work.

## 6. Important Warnings

Surface only when applicable:

```text
⚠ Position already filled
⚠ Client already hired for this job
⚠ Already applied
Client invited you
```

Also show meaningful job restrictions when present, such as:

```text
US only
90%+ JSS
Fluent English
```

Do not display meaningless defaults.

## Main UI Priority

Keep the default card compact:

```text
38
EXACT PROPOSALS

4 interviewed · 1 hired
1 position

CLIENT
✓ Payment verified
★ 4.99 · 40 reviews
$3.4K spent · 79% hire rate
62 jobs · $10.16/hr avg paid
Member since 2009 · Norway

YOUR FIT
✓ 6/6 requirements
Your rate $25/hr · Client avg $10.16/hr

▸ Client history
▸ Related jobs
```

## Do Not Add Yet

Do not show:

- AI job score
- Winning probability
- Good/bad client labels
- Apply/skip recommendation
- AI summary
- Proposal generation
- Arbitrary opportunity score

Prefer transparent facts and derived metrics over unexplained scores.