# Graph Report - upwork-tools  (2026-09-30)

## Corpus Check
- 111 files · ~69,852 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .lock 1, .css 1)

## Summary
- 1056 nodes · 2300 edges · 73 communities (42 shown, 31 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dfa797e8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- protocol.ts
- interceptor.test.ts
- devDependencies
- JobInsights
- dependencies
- interceptor.ts
- @tailwindcss/vite
- agents_skills_impeccable_scripts_detector_rules_checks_parseanycolor
- agents_skills_impeccable_scripts_detector_shared_constants_em_dash_floor
- protocol.test.ts
- database.ts
- agents_skills_impeccable_scripts_lib_concept_catalog_well_tiers
- agents_skills_impeccable_scripts_detector_shared_constants_wcag_large_text_px
- ref_css_select
- ref_css_tree
- ref_domutils
- agents_skills_impeccable_scripts_detector_rules_checks_css_named_colors
- ref_htmlparser2
- ref_node_http
- SettingsComponents.tsx
- agents_skills_impeccable_scripts_detector_shared_constants_em_dash_chars_per_dash
- Strict Clean Code & Engineering Guidelines
- ref_node_readline
- Strict Clean Code & Engineering Guidelines
- logger.ts
- agents_skills_impeccable_scripts_hook_lib_matchconfiguredextension
- PopupComponents.tsx
- isJobInsights
- pay-profile.ts
- agents_skills_impeccable_scripts_detector_shared_constants_wcag_large_bold_text_px
- insights.ts
- ref_node_module
- ref_puppeteer
- popup/App.tsx
- ref_node_net
- settings.ts
- qualification.ts
- ref_node_zlib
- Repository Guidelines
- ref_node_path
- database.test-support.ts
- vcs
- background.test-support.ts
- source
- scripts
- storage.ts
- package.json
- rules
- ref_node_util
- biome.json
- mock
- formatter
- Upwork Tools
- nextGetGate
- nextRemoveGate
- ref_node_os
- Product
- formatter
- Repository Guidelines
- nextSetGate
- resolveBadgeTextApplied
- Architecture
- watchlist.test.ts
- [0.2.0] - 2026-09-03
- correctness
- compilerOptions
- ref_node_child_process
- For Developers & Contributors
- Matchers
- components.json
- .oxlintrc.json
- ref_node_crypto
- applicant-metrics.ts

## God Nodes (most connected - your core abstractions)
1. `JobInsights` - 36 edges
2. `normalizeJobId()` - 29 edges
3. `runTransaction()` - 26 edges
4. `isJobInsights()` - 24 edges
5. `normalizeJobInsights()` - 22 edges
6. `react` - 20 edges
7. `SettingsApp()` - 19 edges
8. `cn` - 16 edges
9. `FakeObjectStore` - 14 edges
10. `requestResult()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `2. Normalize the payload` --references--> `JobInsights`  [INFERRED]
  docs/architecture.md → src/lib/insights.ts
- `Session storage` --references--> `JobInsights`  [INFERRED]
  docs/architecture.md → src/lib/insights.ts
- `How It Works` --references--> `JobInsights`  [INFERRED]
  README.md → src/lib/insights.ts
- `3. Cross the page boundary` --references--> `isJobInsights()`  [INFERRED]
  docs/architecture.md → src/lib/insights-validation.ts
- `Architecture & Data Flow` --references--> `JobInsights`  [INFERRED]
  AGENTS.md → src/lib/insights.ts

## Import Cycles
- 3-file cycle: `src/entrypoints/options/App.tsx -> src/entrypoints/options/SettingsContent.tsx -> src/entrypoints/options/PortfolioComponents.tsx -> src/entrypoints/options/App.tsx`
- 3-file cycle: `src/entrypoints/options/App.tsx -> src/entrypoints/options/SettingsContent.tsx -> src/entrypoints/options/ProfileSection.tsx -> src/entrypoints/options/App.tsx`

## Communities (73 total, 31 thin omitted)

### Community 0 - "protocol.ts"
Cohesion: 0.14
Nodes (19): SimilarJob, ViewerMode, ClientPayProfile, isClientPayProfile(), isConversionStats(), isJobHistoryCapture(), isJobHistoryResponse(), isNullableFiniteNumber() (+11 more)

### Community 1 - "interceptor.test.ts"
Cohesion: 0.13
Nodes (10): events, fakeWindow, fetchBody, globals, messageListeners, nativeJsonParseDescriptor, nativeResponseJsonDescriptor, nativeResponseTextDescriptor (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @biomejs/biome, oxlint, @shadcn/lint, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+4 more)

### Community 3 - "JobInsights"
Cohesion: 0.27
Nodes (10): 4. Naming Conventions & Expressiveness, Architecture & Data Flow, 4. Naming Conventions & Expressiveness, Architecture & Data Flow, Technical Specifications & Details, BackgroundHistoryDependencies, JobInsights, ClientPayProfileInput (+2 more)

### Community 4 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, @base-ui/react, class-variance-authority, cn, lucide-react, react, react-dom, shadcn (+1 more)

### Community 5 - "interceptor.ts"
Cohesion: 0.21
Nodes (17): main(), defendInspectionHook(), emitInsights(), inspectPayload(), installFetchAndResponseHooks(), installInterceptors(), installReplayListener(), installXhrHooks() (+9 more)

### Community 9 - "protocol.test.ts"
Cohesion: 0.21
Nodes (13): ContentWindow, main(), PendingReplay, ReplayTimer, isPageEvent(), isRuntimeMessage(), isRuntimeReplayRequest(), PAGE_EVENT_SOURCE (+5 more)

### Community 10 - "database.ts"
Cohesion: 0.06
Nodes (91): advanceTabGeneration(), currentTabJobId(), enqueueTabMutation(), getTabState(), isJobDetailsPage(), isValidCaptureMetadata(), metadataKey(), persistJobInsights() (+83 more)

### Community 19 - "SettingsComponents.tsx"
Cohesion: 0.05
Nodes (62): cn, lucide-react, react, Alert(), AlertDescription(), alertVariants, AlertDialog(), AlertDialogAction() (+54 more)

### Community 21 - "Strict Clean Code & Engineering Guidelines"
Cohesion: 0.22
Nodes (9): 10. Testing & Verification Rigor, 1. File & Module Size Limits (Strict Rule), 2. SOLID Design Principles, 3. Core Software Principles: KISS, YAGNI, and DRY, 5. Functions & Control Flow, 6. Strict TypeScript & Type Safety, 8. UI & Component Architecture (React & Tailwind), 9. Code Cleanliness, Formatting & Linting (+1 more)

### Community 25 - "Strict Clean Code & Engineering Guidelines"
Cohesion: 0.15
Nodes (13): 7. Error Handling & Defensive Boundaries, 10. Testing & Verification Rigor, 1. File & Module Size Limits (Strict Rule), 2. SOLID Design Principles, 3. Core Software Principles: KISS, YAGNI, and DRY, 5. Functions & Control Flow, 6. Strict TypeScript & Type Safety, 7. Error Handling & Defensive Boundaries (+5 more)

### Community 32 - "PopupComponents.tsx"
Cohesion: 0.07
Nodes (64): @base-ui/react, class-variance-authority, Badge(), badgeVariants, Button(), buttonVariants, Skeleton(), WatchlistSection() (+56 more)

### Community 39 - "isJobInsights"
Cohesion: 0.44
Nodes (10): JobWarning, isHistoryEntry(), isJobInsights(), isNullableBooleanValue(), isNullableNumberValue(), isNullableStringValue(), isQualificationDetail(), isSimilarJob() (+2 more)

### Community 43 - "pay-profile.ts"
Cohesion: 0.31
Nodes (10): ClientHistoryEntry, averageRecentFixedPayment(), deriveClientPayProfile(), fixedPayments(), HistoricalHourlyRateRecord, medianRecentFixedPayment(), PayProfileHistoryEntry, positiveFinite() (+2 more)

### Community 46 - "insights.ts"
Cohesion: 0.10
Nodes (38): ref_node_fs, ref_node_url, deriveHiringWarnings(), hasHistoryAfterIdentityFilter(), HiringApplicationState, HiringHistoryEntry, HiringWarningLabel, HiringWarnings (+30 more)

### Community 62 - "popup/App.tsx"
Cohesion: 0.06
Nodes (41): react-dom, root, App(), EMPTY_PERSONALIZATION, mergePopupReadResult(), normalizedJobId(), PopupReadDependencies, readPopupInsights() (+33 more)

### Community 69 - "settings.ts"
Cohesion: 0.05
Nodes (82): wxt, adjustEditingIndex(), draftFromEntry(), EMPTY_DRAFT, isHttpPortfolioUrl(), isSettingsPortfolioEntry(), isSettingsProfile(), LocalStorageArea (+74 more)

### Community 73 - "qualification.ts"
Cohesion: 0.18
Nodes (19): deriveQualificationSummary, detailFrom(), firstText(), isAny(), isDefaultLabel(), isDefaultZeroRequirement(), isJssRequirement(), isMeaninglessClientRequirement() (+11 more)

### Community 81 - "Repository Guidelines"
Cohesion: 0.18
Nodes (10): Code Conventions & Common Patterns, Development Commands, graphify, Important Files, Key Directories, Maintaining this file, Project Overview, Repository Guidelines (+2 more)

### Community 89 - "database.test-support.ts"
Cohesion: 0.08
Nodes (10): day, FakeDatabase, FakeIndex, fakeIndexedDB, FakeObjectStore, FakeRequest, FakeTransaction, latestInsights (+2 more)

### Community 99 - "vcs"
Cohesion: 0.40
Nodes (5): vcs, clientKind, defaultBranch, enabled, useIgnoreFile

### Community 100 - "background.test-support.ts"
Cohesion: 0.11
Nodes (25): GET_JOB_HISTORY, GET_JOB_INSIGHTS, badgeBackgroundCalls, badgeTextCalls, deferred, fakeBrowser, insights, listener (+17 more)

### Community 103 - "source"
Cohesion: 0.50
Nodes (4): source, assist, actions, organizeImports

### Community 107 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, check, compile, dev, format, format:check, lint (+4 more)

### Community 110 - "storage.ts"
Cohesion: 0.06
Nodes (49): ref_bun_test, aggregateConversionStats(), ConversionStats, compareSnapshots(), getJobSnapshotSummary, JobSnapshotSummary, listValidJobSnapshots, queryJobSnapshots() (+41 more)

### Community 112 - "package.json"
Cohesion: 0.11
Nodes (17): description, name, packageManager, private, type, version, @biomejs/biome, oxlint (+9 more)

### Community 115 - "rules"
Cohesion: 0.15
Nodes (13): noBannedTypes, noForEach, linter, enabled, rules, complexity, preset, style (+5 more)

### Community 120 - "biome.json"
Cohesion: 0.18
Nodes (10): css, parser, files, ignoreUnknown, includes, maxSize, parser, allowComments (+2 more)

### Community 122 - "formatter"
Cohesion: 0.18
Nodes (11): arrowParentheses, bracketSameLine, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas, javascript (+3 more)

### Community 126 - "Upwork Tools"
Cohesion: 0.12
Nodes (14): Upwork Tools Product Definition, 1. 🎯 Competition Intelligence, 2. 🔍 Client Quality & Payment Reality, 3. ⚖️ Your Fit & Qualification Audit, 4. ⚡ Local Power-User Workflow, Contributing, Development & Testing, How It Works (+6 more)

### Community 137 - "Product"
Cohesion: 0.15
Nodes (12): Brand Commitments, Capabilities and Constraints, Evidence on Hand, Local data boundary, Operating Context, Platform, Positioning, Product (+4 more)

### Community 141 - "formatter"
Cohesion: 0.22
Nodes (9): formatter, attributePosition, bracketSpacing, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding (+1 more)

### Community 142 - "Repository Guidelines"
Cohesion: 0.18
Nodes (10): Code Conventions & Common Patterns, Development Commands, graphify, Important Files, Key Directories, Maintaining this file, Project Overview, Repository Guidelines (+2 more)

### Community 154 - "Architecture"
Cohesion: 0.13
Nodes (15): 1. Observe an existing response, 2. Normalize the payload, 3. Cross the page boundary, 4. Persist and isolate by tab, Architecture, Capture lifecycle, Failure and security boundaries, IndexedDB (+7 more)

### Community 156 - "watchlist.test.ts"
Cohesion: 0.10
Nodes (8): FakeDatabase, FakeIndexedDB, FakeObjectStore, FakeRequest, FakeTransaction, RequestHandler, StoreData, TestGlobals

### Community 159 - "[0.2.0] - 2026-09-03"
Cohesion: 0.25
Nodes (7): [0.2.0] - 2026-09-03, [0.4.0] - 2026-09-04, Architecture, Changelog, Features, Features, Highlights

### Community 160 - "correctness"
Cohesion: 0.33
Nodes (6): noUnusedImports, noUnusedVariables, useExhaustiveDependencies, fix, level, correctness

### Community 161 - "compilerOptions"
Cohesion: 0.25
Nodes (7): ./.wxt/tsconfig.json, compilerOptions, allowImportingTsExtensions, baseUrl, jsx, paths, extends

### Community 166 - "For Developers & Contributors"
Cohesion: 0.33
Nodes (6): For Developers & Contributors, 🚀 For Freelancers & Users (No Coding Required), Installation & Quick Start, Prerequisites, Production Builds, Setup & Development

### Community 173 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 176 - ".oxlintrc.json"
Cohesion: 0.15
Nodes (12): categories, correctness, ignorePatterns, jsPlugins, overrides, rules, shadcn/no-arbitrary-values, shadcn/no-inline-styles (+4 more)

### Community 182 - "applicant-metrics.ts"
Cohesion: 0.36
Nodes (9): ApplicantMetrics, ApplicantSnapshot, deriveApplicantMetrics(), firstSeenApplicantDelta(), hasValidOrder(), isValidCount(), latestApplicantCount(), recentApplicantDelta() (+1 more)

## Knowledge Gaps
- **325 isolated node(s):** `PopupReadDependencies`, `EMPTY_PERSONALIZATION`, `EMPTY_POPUP_PERSONALIZATION`, `EMPTY_POPUP_PERSONALIZATION`, `WARNING_COPY` (+320 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 426 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `JobInsights` connect `JobInsights` to `PopupComponents.tsx`, `protocol.ts`, `Upwork Tools`, `background.test-support.ts`, `interceptor.ts`, `isJobInsights`, `qualification.ts`, `database.ts`, `pay-profile.ts`, `protocol.test.ts`, `insights.ts`, `storage.ts`, `SettingsComponents.tsx`, `database.test-support.ts`, `Architecture`, `watchlist.test.ts`, `popup/App.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `react` connect `SettingsComponents.tsx` to `package.json`, `PopupComponents.tsx`, `settings.ts`, `popup/App.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `JobInsights` (e.g. with `4. Naming Conventions & Expressiveness` and `Architecture & Data Flow`) actually correct?**
  _`JobInsights` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `isJobInsights()` (e.g. with `3. Cross the page boundary` and `isHistoryEntry()`) actually correct?**
  _`isJobInsights()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PopupReadDependencies`, `EMPTY_PERSONALIZATION`, `EMPTY_POPUP_PERSONALIZATION` to the rest of the system?**
  _325 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `protocol.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14210526315789473 - nodes in this community are weakly interconnected._