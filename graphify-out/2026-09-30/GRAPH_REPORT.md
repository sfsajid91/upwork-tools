# Graph Report - upwork-tools  (2026-09-30)

## Corpus Check
- 106 files · ~70,463 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .lock 1, .css 1)

## Summary
- 1044 nodes · 2242 edges · 86 communities (49 shown, 37 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0e90ab10`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- protocol.ts
- interceptor.test.ts
- devDependencies
- JobInsights
- dependencies
- options/App.tsx
- popup/App.tsx
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
- SettingsContent.tsx
- agents_skills_impeccable_scripts_detector_shared_constants_em_dash_chars_per_dash
- PortfolioComponents.tsx
- ref_node_readline
- ProfileSection.tsx
- DataSection.tsx
- Strict Clean Code & Engineering Guidelines
- theme.ts
- agents_skills_impeccable_scripts_hook_lib_matchconfiguredextension
- alert.tsx
- options/main.tsx
- src_lib_theme_thememode
- PopupComponents.tsx
- SettingsComponents.tsx
- background.ts
- pay-profile.ts
- agents_skills_impeccable_scripts_detector_shared_constants_wcag_large_bold_text_px
- insights.ts
- settings.ts
- ref_node_module
- ref_puppeteer
- portfolio-match.ts
- ref_node_net
- portfolio.ts
- qualification.ts
- ref_node_zlib
- Repository Guidelines
- ref_node_path
- FakeObjectStore
- vcs
- background.test-support.ts
- source
- scripts
- storage.ts
- package.json
- src_entrypoints_popup_insightsview_availablestate
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
- src_entrypoints_popup_insightsview_emptystate
- formatter
- Repository Guidelines
- src_entrypoints_popup_insightsview_loadingstate
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
- src_entrypoints_popup_insightsview_popuppersonalization
- src_entrypoints_popup_insightsview_watchliststatus
- components.json
- .oxlintrc.json
- ref_node_crypto
- applicant-metrics.ts
- src_lib_insights_isjobinsights

## God Nodes (most connected - your core abstractions)
1. `JobInsights` - 34 edges
2. `normalizeJobId()` - 29 edges
3. `runTransaction()` - 26 edges
4. `isJobInsights()` - 26 edges
5. `normalizeJobInsights()` - 22 edges
6. `react` - 19 edges
7. `SettingsApp()` - 19 edges
8. `cn` - 14 edges
9. `AvailableState()` - 14 edges
10. `requestResult()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `3. Cross the page boundary` --references--> `isJobInsights()`  [INFERRED]
  docs/architecture.md → src/lib/insights-validation.ts
- `2. Normalize the payload` --references--> `JobInsights`  [INFERRED]
  docs/architecture.md → src/lib/insights.ts
- `Session storage` --references--> `JobInsights`  [INFERRED]
  docs/architecture.md → src/lib/insights.ts
- `How It Works` --references--> `JobInsights`  [INFERRED]
  README.md → src/lib/insights.ts
- `Technical Specifications & Details` --references--> `JobInsights`  [INFERRED]
  README.md → src/lib/insights.ts

## Import Cycles
- 3-file cycle: `src/entrypoints/options/App.tsx -> src/entrypoints/options/SettingsContent.tsx -> src/entrypoints/options/PortfolioComponents.tsx -> src/entrypoints/options/App.tsx`
- 3-file cycle: `src/entrypoints/options/App.tsx -> src/entrypoints/options/SettingsContent.tsx -> src/entrypoints/options/ProfileSection.tsx -> src/entrypoints/options/App.tsx`

## Communities (86 total, 37 thin omitted)

### Community 0 - "protocol.ts"
Cohesion: 0.18
Nodes (16): ViewerMode, ClientPayProfile, isClientPayProfile(), isConversionStats(), isJobHistoryCapture(), isJobHistoryResponse(), isNullableFiniteNumber(), isOptionalReplay() (+8 more)

### Community 1 - "interceptor.test.ts"
Cohesion: 0.13
Nodes (10): events, fakeWindow, fetchBody, globals, messageListeners, nativeJsonParseDescriptor, nativeResponseJsonDescriptor, nativeResponseTextDescriptor (+2 more)

### Community 2 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @biomejs/biome, oxlint, @shadcn/lint, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+4 more)

### Community 3 - "JobInsights"
Cohesion: 0.27
Nodes (10): 4. Naming Conventions & Expressiveness, Architecture & Data Flow, 4. Naming Conventions & Expressiveness, Architecture & Data Flow, BackgroundHistoryDependencies, JobInsights, ClientPayProfileInput, PageEvent (+2 more)

### Community 4 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, @base-ui/react, class-variance-authority, cn, lucide-react, react, react-dom, shadcn (+1 more)

### Community 5 - "options/App.tsx"
Cohesion: 0.16
Nodes (22): draftFromEntry(), EMPTY_DRAFT, isHttpPortfolioUrl(), isSettingsPortfolioEntry(), isSettingsProfile(), LocalStorageArea, parseHourlyRate(), PortfolioDraft (+14 more)

### Community 6 - "popup/App.tsx"
Cohesion: 0.21
Nodes (15): @tailwindcss/vite, wxt, App(), EMPTY_PERSONALIZATION, mergePopupReadResult(), normalizedJobId(), PopupReadDependencies, readPopupInsights() (+7 more)

### Community 9 - "protocol.test.ts"
Cohesion: 0.18
Nodes (15): ContentWindow, main(), PendingReplay, ReplayTimer, isPageEvent(), isReplayStoreMetadata(), isRuntimeMessage(), isRuntimeReplayRequest() (+7 more)

### Community 10 - "database.ts"
Cohesion: 0.07
Nodes (61): persistJobInsights(), BackgroundHistoryState, createJobHistoryReader(), ALL_STORES, appendJobSnapshotIfChanged(), clearAllLocalData(), clearHistory(), clearStores() (+53 more)

### Community 19 - "SettingsContent.tsx"
Cohesion: 0.17
Nodes (18): @base-ui/react, Badge(), badgeVariants, Separator(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger() (+10 more)

### Community 21 - "PortfolioComponents.tsx"
Cohesion: 0.16
Nodes (14): PortfolioItemCard(), SettingsStatusAlert(), AlertCircleIcon(), CheckCircle2Icon(), CheckIcon(), CopyIcon(), ExternalLinkIcon(), PencilIcon() (+6 more)

### Community 23 - "ProfileSection.tsx"
Cohesion: 0.21
Nodes (8): cn, react, Input(), Label(), Textarea(), ProfileSection(), RATE_PRESETS, SUGGESTED_SKILLS

### Community 24 - "DataSection.tsx"
Cohesion: 0.24
Nodes (10): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogTitle() (+2 more)

### Community 25 - "Strict Clean Code & Engineering Guidelines"
Cohesion: 0.15
Nodes (13): 7. Error Handling & Defensive Boundaries, 10. Testing & Verification Rigor, 1. File & Module Size Limits (Strict Rule), 2. SOLID Design Principles, 3. Core Software Principles: KISS, YAGNI, and DRY, 5. Functions & Control Flow, 6. Strict TypeScript & Type Safety, 7. Error Handling & Defensive Boundaries (+5 more)

### Community 26 - "theme.ts"
Cohesion: 0.46
Nodes (6): getLegacyTheme(), applyThemeClass(), getStoredTheme(), resolveIsDark(), setStoredTheme(), useTheme()

### Community 28 - "alert.tsx"
Cohesion: 0.33
Nodes (4): class-variance-authority, Alert(), AlertDescription(), alertVariants

### Community 29 - "options/main.tsx"
Cohesion: 0.40
Nodes (4): react-dom, root, root, src_entrypoints_popup_style

### Community 32 - "PopupComponents.tsx"
Cohesion: 0.08
Nodes (55): Button(), buttonVariants, WatchlistSection(), ViewState, ApplicantHistoryChart(), AvailableTail(), FitSection(), AvailableState() (+47 more)

### Community 36 - "SettingsComponents.tsx"
Cohesion: 0.22
Nodes (10): Card(), CardAction(), CardContent(), CardDescription(), CardHeader(), SettingsNav(), BookmarkIcon(), BriefcaseIcon() (+2 more)

### Community 39 - "background.ts"
Cohesion: 0.06
Nodes (67): advanceTabGeneration(), currentTabJobId(), enqueueTabMutation(), getTabState(), isJobDetailsPage(), isValidCaptureMetadata(), metadataKey(), readJobHistory (+59 more)

### Community 43 - "pay-profile.ts"
Cohesion: 0.31
Nodes (10): ClientHistoryEntry, averageRecentFixedPayment(), deriveClientPayProfile(), fixedPayments(), HistoricalHourlyRateRecord, medianRecentFixedPayment(), PayProfileHistoryEntry, positiveFinite() (+2 more)

### Community 46 - "insights.ts"
Cohesion: 0.10
Nodes (37): ref_node_fs, ref_node_url, deriveHiringWarnings(), hasHistoryAfterIdentityFilter(), HiringApplicationState, HiringHistoryEntry, HiringWarningLabel, HiringWarnings (+29 more)

### Community 56 - "settings.ts"
Cohesion: 0.13
Nodes (28): enqueueThemeOperation(), ExtensionApi, getStorageArea(), getUiSettings(), getUserProfile(), initializeTheme(), isRecord(), isThemeMode() (+20 more)

### Community 62 - "portfolio-match.ts"
Cohesion: 0.14
Nodes (18): canonical(), matchPortfolio, overlap(), PortfolioMatch, PortfolioMatchJob, rankPortfolioMatches(), STOP_WORDS, tokens() (+10 more)

### Community 69 - "portfolio.ts"
Cohesion: 0.17
Nodes (21): adjustEditingIndex(), deletePortfolioEntry(), savePortfolioEntry(), startNewPortfolioEntry(), createPortfolio(), createPortfolioEntry, ExtensionApi, listPortfolio() (+13 more)

### Community 73 - "qualification.ts"
Cohesion: 0.19
Nodes (19): deriveQualificationSummary, detailFrom(), firstText(), isAny(), isDefaultLabel(), isDefaultZeroRequirement(), isJssRequirement(), isMeaninglessClientRequirement() (+11 more)

### Community 81 - "Repository Guidelines"
Cohesion: 0.10
Nodes (19): 10. Testing & Verification Rigor, 1. File & Module Size Limits (Strict Rule), 2. SOLID Design Principles, 3. Core Software Principles: KISS, YAGNI, and DRY, 5. Functions & Control Flow, 6. Strict TypeScript & Type Safety, 8. UI & Component Architecture (React & Tailwind), 9. Code Cleanliness, Formatting & Linting (+11 more)

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
Cohesion: 0.05
Nodes (50): ref_bun_test, aggregateConversionStats(), ConversionStats, compareSnapshots(), getJobSnapshotSummary, JobSnapshotSummary, listValidJobSnapshots, queryJobSnapshots() (+42 more)

### Community 112 - "package.json"
Cohesion: 0.11
Nodes (18): description, name, packageManager, private, type, version, @biomejs/biome, lucide-react (+10 more)

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
Cohesion: 0.13
Nodes (15): Upwork Tools Product Definition, 1. 🎯 Competition Intelligence, 2. 🔍 Client Quality & Payment Reality, 3. ⚖️ Your Fit & Qualification Audit, 4. ⚡ Local Power-User Workflow, Contributing, Development & Testing, How It Works (+7 more)

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
Cohesion: 0.12
Nodes (15): 1. Observe an existing response, 2. Normalize the payload, 3. Cross the page boundary, 4. Persist and isolate by tab, Architecture, Capture lifecycle, Failure and security boundaries, IndexedDB (+7 more)

### Community 156 - "watchlist.test.ts"
Cohesion: 0.10
Nodes (9): JobRecord, FakeDatabase, FakeIndexedDB, FakeObjectStore, FakeRequest, FakeTransaction, RequestHandler, StoreData (+1 more)

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
- **323 isolated node(s):** `$schema`, `jsPlugins`, `ignorePatterns`, `correctness`, `shadcn/no-restyle` (+318 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 425 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `JobInsights` connect `JobInsights` to `PopupComponents.tsx`, `protocol.ts`, `background.test-support.ts`, `popup/App.tsx`, `background.ts`, `protocol.test.ts`, `database.ts`, `pay-profile.ts`, `insights.ts`, `storage.ts`, `SettingsContent.tsx`, `Architecture`, `watchlist.test.ts`, `Upwork Tools`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `react` connect `ProfileSection.tsx` to `PopupComponents.tsx`, `SettingsComponents.tsx`, `options/App.tsx`, `popup/App.tsx`, `package.json`, `SettingsContent.tsx`, `PortfolioComponents.tsx`, `DataSection.tsx`, `theme.ts`, `alert.tsx`, `options/main.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `JobInsights` (e.g. with `4. Naming Conventions & Expressiveness` and `Architecture & Data Flow`) actually correct?**
  _`JobInsights` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `isJobInsights()` (e.g. with `3. Cross the page boundary` and `isHistoryEntry()`) actually correct?**
  _`isJobInsights()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `jsPlugins`, `ignorePatterns` to the rest of the system?**
  _323 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `interceptor.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._