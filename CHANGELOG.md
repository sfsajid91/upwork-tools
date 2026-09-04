# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-09-04

### Features
- **Interactive Applicant History Chart**: Added a native, zero-dependency SVG sparkline and area gradient chart visualizing proposal count progression across historical job captures.
- **User-Friendly Metrics**: Replaced cryptic internal labels with clear, actionable insights:
  - **Since last check** (`+X`)
  - **Total growth** (`+X`)
  - **Proposals/hour** velocity
  - **Elapsed tracking horizon** (`N captures · X min/hrs`)
- **Capture Details & Microcopy**: Individual capture points provide rich hover details (exact timestamp, proposals, and delta), with starting and latest counts highlighted directly on the chart.
- **Responsive & Accessible Visual Design**: Clean single-card visual layout following UI/UX Pro Max standards, WCAG AA contrast compliance, and full light/dark mode support.

## [0.2.0] - 2026-09-03

### Highlights
- Initial release of Upwork Tools local job intelligence extension for Chrome and Chromium-based browsers.

### Features
- **Real-Time Client Insights**: Calculates true hire rate, total spend, client rating, historical hourly rate averages, and median fixed contract amounts.
- **Deterministic Hiring Warnings**: Automatically flags critical signals such as position filled, already hired, already applied, and interview progress.
- **Proposal Velocity & Unmasking**: Unmasks exact applicant counts directly from authenticated GraphQL responses and calculates real-time application velocity (`proposals/hour`).
- **Personal Skill & Portfolio Matching**: Matches job ontology skills against locally stored skills and portfolio tags with custom ranking.
- **Application Funnel Tracking**: Tracks application lifecycle milestones (`Viewed` → `Applied` → `Interview` → `Hired`) with conversion rates.
- **Offline Watchlist & Profile Settings**: Save jobs locally across sessions, set target hourly rate, and manage offline data.
- **Theme Support**: Seamless theme engine supporting System, Dark, and Light themes.

### Architecture
- **100% Local-First**: Zero telemetry, zero tracking, and zero duplicate network requests via `document_start` observer.
- **Modern Stack**: Built on WXT, Manifest V3, React 19, TypeScript 5.9, Tailwind CSS v4, and Bun.
- **Comprehensive Testing**: 176 automated unit and integration tests covering parser boundary validation, derived metrics, warning precedence, and database retention.
