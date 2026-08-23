For now, I’d keep everything **deterministic and local**. No LLM, no backend.

Use **IndexedDB for growing historical data** such as applicant snapshots, applications, and client/job history. Use `browser.storage.local` only for small settings/current state such as your profile, preferences, and UI configuration.

Your captured response already gives you applicants, interviews, hires, positions, client activity, client stats, work history, and qualification matches.  

### Features for the AI agent to implement

| Feature                                | What it shows                                                       | How to implement                                                                                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Applicant History**               | `8 → 17 → 31 proposals`, `+23 in 6h`                                | On every job view save `{jobId, applicants, interviewed, hired, capturedAt}` in **IndexedDB**. Compare latest snapshot with previous snapshots.                      |
| **2. Proposal Velocity**               | `+4.2 proposals/hour`, `Competition rising fast`                    | Use applicant-history snapshots. `(latestApplicants - previousApplicants) / hoursElapsed`. Require enough elapsed time before showing velocity.                      |
| **3. Competition Snapshot**            | `38 proposals · 4 interviewed · 1 hired · 1 position`               | Directly use `clientActivity.totalApplicants`, `totalInvitedToInterview`, `totalHired`, and `numberOfPositionsToHire`.                                               |
| **4. Interview Rate**                  | `10.5% interviewed`                                                 | Calculate `interviewed / applicants * 100`. Hide when applicants is `0/null`.                                                                                        |
| **5. Client Hire Rate**                | `79% historical hire rate`                                          | Calculate `totalJobsWithHires / postedCount * 100`. The response already exposes both values.                                                                        |
| **6. Client Pay Profile**              | `$3.4K spent`, `$10.16/hr avg`, typical fixed jobs `$255–$400`      | Use client summary stats plus `buyer.workHistory`. Calculate median/average recent fixed payments and hourly rates. Store normalized results or calculate on demand. |
| **7. Similar Previous Hires**          | `Client previously hired for a similar landing-page project — $400` | Compare current title + skills against `workHistory.jobInfo.title`. Start with lowercase token overlap/Jaccard similarity. No AI needed.                             |
| **8. Rate Context**                    | `Your rate $25/hr · Client avg $10.16/hr · 2.5×`                    | Compare `currentUserInfo.freelancerInfo.hourlyRate.amount` with `buyer.info.avgHourlyJobsRate.amount`. Do not label it good/bad.                                     |
| **9. Qualification Match**             | `6/6 requirements matched`                                          | Count `qualificationsMatches.matches[].qualified === true`. Allow expansion to show English, JSS, earnings, hours, etc.                                              |
| **10. Job Restriction Detector**       | `US only`, `90%+ JSS`, `Fluent English`                             | Parse `opening.qualifications`. Ignore meaningless defaults such as JSS `0` or "Any". Only show real restrictions.                                                   |
| **11. Client Activity**                | `Client active 2h ago`                                              | Convert `lastBuyerActivity` to relative time. Can also classify simply as recent / stale based on deterministic thresholds.                                          |
| **12. Filled / Already Hired Warning** | `⚠ Position filled`, `1/1 hired`                                    | Combine `job.status`, `totalHired`, `numberOfPositionsToHire`, and same-job entries in `workHistory`.                                                                |
| **13. Application State**              | `Already applied`, `Client invited you`, `Hired`                    | Use `currentUserInfo.freelancerInfo.applied`, `pendingInvite`, `hired`, `contract`, etc. Only show meaningful states.                                                |
| **14. Personal Skill Match**           | `7/8 job skills match`                                              | Store your skills in `storage.local`. Compare them against `ontologySkills` + `additionalSkills` using normalized exact aliases.                                     |
| **15. Portfolio Matcher**              | `Best project: Cloudflare API project`                              | Store portfolio entries locally with `{title, skills, tags, url}`. Rank by overlap between job skills/title tokens and project tags.                                 |
| **16. Job/Application Tracker**        | `Viewed → Applied → Interview → Hired`                              | IndexedDB table keyed by `jobId`. Store title, viewedAt, appliedAt, bid, connects, status, interview/hire state.                                                     |
| **17. Personal Conversion Stats**      | `23 applications → 5 interviews → 1 hire`                           | Aggregate application-tracker records. Calculate apply→interview and interview→hire rates.                                                                           |
| **18. Job Watchlist**                  | Saved jobs with latest competition changes                          | Let user bookmark a captured job. Store job metadata + last snapshot in IndexedDB. Update only when the user naturally opens the job unless you later add polling.   |

### Storage model I'd use

```text
browser.storage.local
├── userProfile
│   ├── hourlyRate
│   ├── skills[]
│   └── preferences
│
├── portfolio[]
└── uiSettings

IndexedDB
├── jobs
│   └── jobId, title, client info...
│
├── jobSnapshots
│   └── jobId, applicants, interviewed,
│       hired, capturedAt
│
├── applications
│   └── jobId, appliedAt, bid,
│       connects, status...
│
└── watchlist
```

For **applicant history specifically**, don't overwrite the previous value. Append snapshots:

```text
Job ABC

10:00  applicants=8
12:00  applicants=13
15:00  applicants=26
18:00  applicants=33
```

Then derive:

```text
Current proposals: 33
+25 since first seen
+7 in last 3 hours
2.3 proposals/hour recently
```

I'd tell your agent to implement in this order:

**Applicant History → Proposal Velocity → Client Pay Profile → Similar Previous Hires → Qualification/Skill Match → Portfolio Match → Application Tracker → Personal Conversion Stats.**

Those give you useful advantages for actually applying to jobs, without introducing AI complexity.
