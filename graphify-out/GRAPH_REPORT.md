# Graph Report - upwork-tools  (2026-09-30)

## Corpus Check
- 248 files · ~454,888 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .toml 4, (none) 3, .lock 1)

## Summary
- 4454 nodes · 10634 edges · 188 communities (173 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 153 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f07fdeab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- live-browser.js
- checks.mjs
- context.mjs
- connectSSE
- detect-antipatterns-browser.js
- design-system.mjs
- injected/index.mjs
- live-server.mjs
- hook-lib.mjs
- protocol.ts
- database.ts
- concept-seed.mjs
- setLiveState
- detect-html.mjs
- modern-screenshot.umd.js
- el
- css-cascade.mjs
- manual-apply.mjs
- syncPageChatFocus
- live-commit-manual-edits.mjs
- detect-text.mjs
- impeccable-config.mjs
- detect-antipatterns.mjs
- history.ts
- hook-admin.mjs
- ref_node_fs
- AvailableState.tsx
- hook-before-edit.mjs
- live-copy-edit-agent.mjs
- initGlobalBar
- live-accept.mjs
- live-poll.mjs
- PopupComponents.tsx
- design-parser.mjs
- scanCssTextForPulsingDot
- live-wrap.mjs
- SettingsComponents.tsx
- runHook
- SKILL.md
- background.ts
- impeccable-paths.mjs
- parseRgb
- session-store.mjs
- JobInsights
- parseAnyColor
- event-validation.mjs
- insights.ts
- roots.mjs
- resolveLengthPx
- insert-ui.mjs
- live-manual-edit-evidence.mjs
- Responsive Design
- showToast
- nuxt.mjs
- manual-edits-buffer.mjs
- applyEditing
- settings.ts
- popup/App.tsx
- svelte-ast.mjs
- onboard.md
- parseAnyColor
- detect-url.mjs
- ref_bun_test
- button.tsx
- context-signals.mjs
- sveltekit-adapter.mjs
- tanstack-adapter.mjs
- watchlist.ts
- The Toolkit
- options/App.tsx
- accept-css.mjs
- collectBrowserFindings
- live.mjs
- qualification.ts
- journal.mjs
- sampleCssBackground
- checkHtmlPatterns
- onAnnotDown
- dependencies
- tag-strategy.mjs
- generate-image.mjs
- Repository Guidelines
- createLiveBrowserSessionState
- animate.md
- expandScanTargets
- live.md
- Handle `generate`
- source-search.mjs
- checkQuality
- FakeObjectStore
- checkHeadingRhythmDOM
- Generate Report
- content.test.ts
- mountSvelteComponentVariant
- live-status.mjs
- Adaptation Strategies
- restrictions.ts
- createLiveBrowserDomHelpers
- detect-utils.mjs
- vcs
- background.test-support.ts
- browser-script-parts.mjs
- Impeccable Asset Producer
- source
- Optimization Strategy
- readConfig
- frameworks/index.mjs
- scripts
- StaticElement
- Capture lifecycle
- storage.ts
- pin.mjs
- package.json
- stateOf
- src_entrypoints_popup_insightsview_availablestate
- rules
- critique.md
- Simplify the Design
- Hardening Dimensions
- generation-preflight.mjs
- biome.json
- mock
- formatter
- Rewrite by function
- Nielsen's 10 Heuristics
- Generate Combined Critique Report
- Upwork Tools
- New visual work
- resolveLiveInjectionAnchor
- 4. Polish the whole path
- Refine the Design
- nextGetGate
- nextRemoveGate
- Init flow
- staleness-notice.mjs
- Common Cognitive Load Violations
- iOS platform
- Product
- Shape
- addVisualContrastFindings
- src_entrypoints_popup_insightsview_emptystate
- formatter
- Repository Guidelines
- source-lock.mjs
- Android platform
- live-setup.md
- Persona-Based Design Testing
- src_entrypoints_popup_insightsview_loadingstate
- nextSetGate
- svelte-component.mjs
- resolveBadgeTextApplied
- Cognitive Load Assessment
- Impeccable Finish Reviewer
- Impeccable Manual Edit Applier
- Architecture
- checkHeadingRhythmDOM
- FakeObjectStore
- Operate mode depth (and Read notes)
- Strict Clean Code & Engineering Guidelines
- [0.2.0] - 2026-09-03
- correctness
- compilerOptions
- Heuristics Scoring Guide
- Strict Clean Code & Engineering Guidelines
- isScreenReaderOnlyTextStyle
- serve-question.mjs
- For Developers & Contributors
- composition-catalog.mjs
- Matchers
- doctor.mjs
- src_entrypoints_popup_insightsview_popuppersonalization
- Key Features
- src_entrypoints_popup_insightsview_watchliststatus
- components.json
- live-inject.mjs
- roll-selection.mjs
- .oxlintrc.json
- document.md
- Extract Flow
- palette.mjs
- checkElementRadialSpotlightDOM
- devDependencies
- applicant-metrics.ts
- detect-csp.mjs
- hook.mjs
- Generate Report
- src_lib_insights_isjobinsights
- src_lib_theme_thememode

## God Nodes (most connected - your core abstractions)
1. `parseAnyColor()` - 45 edges
2. `parseAnyColor()` - 40 edges
3. `runHook()` - 40 edges
4. `collectBrowserFindings()` - 37 edges
5. `JobInsights` - 34 edges
6. `detectHtml()` - 33 edges
7. `setLiveState()` - 32 edges
8. `connectSSE()` - 30 edges
9. `el()` - 29 edges
10. `showToast()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `3. Cross the page boundary` --references--> `isJobInsights()`  [INFERRED]
  docs/architecture.md → src/lib/insights-validation.ts
- `Architecture & Data Flow` --references--> `JobInsights`  [INFERRED]
  AGENTS.md → src/lib/insights.ts
- `Architecture & Data Flow` --references--> `JobInsights`  [INFERRED]
  CLAUDE.md → src/lib/insights.ts
- `2. Normalize the payload` --references--> `JobInsights`  [INFERRED]
  docs/architecture.md → src/lib/insights.ts
- `Session storage` --references--> `JobInsights`  [INFERRED]
  docs/architecture.md → src/lib/insights.ts

## Import Cycles
- None detected.

## Communities (188 total, 15 thin omitted)

### Community 0 - "live-browser.js"
Cohesion: 0.03
Nodes (117): applyGlobalBarLabelState(), applyPlaceholderSizingStyles(), averageRgb01(), bindEditBadgeProxy(), bufferToBase64(), buildCollapsible(), buildColorModels(), buildListHtml() (+109 more)

### Community 1 - "checks.mjs"
Cohesion: 0.03
Nodes (112): ANIMATION_VALUE_KEYWORDS, borderColorsFromStyle(), borderWidthsFromStyle(), checkClippedOverflow(), checkEdgeFlushCardsDOM(), checkElementBlinkingCursorDOM(), checkElementClippedOverflow(), checkElementClippedOverflowDOM() (+104 more)

### Community 2 - "context.mjs"
Cohesion: 0.04
Nodes (96): appendAutonomyCounterDirective(), appendBuildPathDirective(), appendDetectorFallback(), appendImageGenDirective(), appendImageToolsDirective(), appendSubagentAuthorizationDirective(), appendSurfaceBriefContext(), automaticHookMode() (+88 more)

### Community 3 - "connectSSE"
Cohesion: 0.06
Nodes (88): abortSvelteComponentInjection(), applyParamDefaults(), applyParamValue(), applyPlaceholderDimensions(), applySavedSessionMeta(), buildInsertPlaceholderSnapshotFromDom(), buildParamsPanel(), buildPickedAnchorSnapshot() (+80 more)

### Community 4 - "detect-antipatterns-browser.js"
Cohesion: 0.06
Nodes (57): browserColorsClose(), browserDesignSystemConfig(), browserHasDirectText(), browserPrimaryFont(), browserRadiusTokens(), browserSampleText(), buildSelectorSegment(), checkBrowserDesignSystemSources() (+49 more)

### Community 5 - "design-system.mjs"
Cohesion: 0.06
Nodes (71): addClampEndpoints(), addColorObject(), addDesignColor(), addFontSizeStep(), addRoundedScale(), addRoundedToken(), addSidecarColors(), addSidecarRadii() (+63 more)

### Community 6 - "injected/index.mjs"
Cohesion: 0.06
Nodes (69): addBrowserFindings(), addVisualContrastFindings(), addVisualContrastResult(), analyzeVisualContrast(), analyzeVisualContrastCandidate(), blendRgba(), browserColorsClose(), browserDesignSystemConfig() (+61 more)

### Community 7 - "live-server.mjs"
Cohesion: 0.07
Nodes (61): eventPriority(), selectAvailablePendingEvent(), acknowledgePendingEvent(), activeSessionSummaries(), agentPollingConnected(), annotRoot, args, broadcast() (+53 more)

### Community 8 - "hook-lib.mjs"
Cohesion: 0.06
Nodes (60): ACK_EXTS, ADVISORY_RULES, ALLOWED_EXTS, appendDesignSystemNote(), appendDesignSystemNoteOnce(), applyPatchText(), canonicalPath(), canonicalPathCache (+52 more)

### Community 9 - "protocol.ts"
Cohesion: 0.07
Nodes (41): wxt, ContentWindow, main(), PendingReplay, ReplayTimer, SimilarJob, ViewerMode, isClientPayProfile() (+33 more)

### Community 10 - "database.ts"
Cohesion: 0.08
Nodes (59): persistJobInsights(), BackgroundHistoryState, createJobHistoryReader(), ALL_STORES, appendJobSnapshotIfChanged(), clearAllLocalData(), clearHistory(), clearStores() (+51 more)

### Community 11 - "concept-seed.mjs"
Cohesion: 0.14
Nodes (25): API_BASE, API_TIMEOUT_MS, apiBudgetMs(), dealCompositions(), driveSelection(), fetchRoll(), here, loadLocal() (+17 more)

### Community 12 - "setLiveState"
Cohesion: 0.11
Nodes (51): cancelEditing(), cancelEditingToPicking(), cancelInsertConfigure(), cleanup(), cleanupAcceptedSession(), clearAnnotations(), clearInsertPicking(), clearMountErrorCard() (+43 more)

### Community 13 - "detect-html.mjs"
Cohesion: 0.09
Nodes (28): mergeDesignSystemFindings(), collectStaticCssText(), detectHtml(), STATIC_ELEMENT_RULES, checkCreamPalette(), checkPageLayout(), checkPageQualityDOM(), checkPageQualityFromDoc() (+20 more)

### Community 14 - "modern-screenshot.umd.js"
Cohesion: 0.09
Nodes (55): ae(), be(), bt(), Ce(), s(), Ct(), de(), dt() (+47 more)

### Community 15 - "el"
Cohesion: 0.07
Nodes (54): actionLabel(), bindConfigureCountPillTooltip(), bindConfigureInlineControlHover(), bindConfigureModifierPillHover(), buildConfigureActionControl(), buildConfigureCountControl(), buildConfigureRow(), buildConfigureSubmitButton() (+46 more)

### Community 16 - "css-cascade.mjs"
Cohesion: 0.06
Nodes (39): Step 2b: Stage the frontmatter, applyStaticDeclaration(), buildBorderOverrideMap(), parseShorthand(), resolveVar(), buildStaticStyleMap(), buildStaticWindow(), collectStaticCssRules() (+31 more)

### Community 17 - "manual-apply.mjs"
Cohesion: 0.09
Nodes (48): addOpToManualApplyChunk(), APPLY_EVENT_HARD_TIMEOUT_MS, APPLY_EVENT_SOFT_DEADLINE_MS, buildManualApplyAgentAction(), clearManualApplyTransaction(), collectManualApplyFiles(), compactManualApplyBatch(), compactManualApplyCandidates() (+40 more)

### Community 18 - "syncPageChatFocus"
Cohesion: 0.08
Nodes (55): agentHasWorkInFlight(), applyConfigureBarChrome(), armPageChatForTyping(), attachSteerFocusDebug(), attachSteerFocusGuard(), buildSteerProcessingDots(), buildSteerQueueHint(), clearSteerAwaitTimer() (+47 more)

### Community 19 - "live-commit-manual-edits.mjs"
Cohesion: 0.11
Nodes (48): allEntryIds(), argVal(), buildRepairBatch(), candidatesForEntry(), changedFilesSinceSnapshot(), clearAppliedEntries(), collectApplyOwnedFiles(), collectRollbackFiles() (+40 more)

### Community 20 - "detect-text.mjs"
Cohesion: 0.07
Nodes (44): blankCssComments(), BLOCK_BRACE_PREFIX_KEYWORDS, CSS_IN_JS_EXTENSIONS, detectText(), extFromFilePath(), extractCSSinJS(), extractStyleBlocks(), findCSSinJSTemplates() (+36 more)

### Community 21 - "impeccable-config.mjs"
Cohesion: 0.10
Nodes (46): applyDetectionConfigSource(), clampByte(), cleanIgnoreValueDisplay(), cloneDetectionConfig(), cloneRawDetectionConfig(), COLOR_CHANNEL_FORMATS, colorIgnoreKey(), DEFAULT_DETECTION_CONFIG (+38 more)

### Community 22 - "detect-antipatterns.mjs"
Cohesion: 0.08
Nodes (42): confirm(), detectCli(), detectLocalFile(), dim(), fileUrlToLocalPath(), formatAdvisorySection(), formatFindings(), formatFindingsBody() (+34 more)

### Community 23 - "history.ts"
Cohesion: 0.16
Nodes (15): compareSnapshots(), getJobSnapshotSummary, JobSnapshotSummary, listValidJobSnapshots, queryJobSnapshots(), summarizeJobSnapshots(), validJobId(), validSnapshot() (+7 more)

### Community 24 - "hook-admin.mjs"
Cohesion: 0.12
Nodes (44): ACTIONS, addIgnoreFile(), addIgnoreRule(), addIgnoreValue(), DETECTOR_CONFIG_KEYS, detectorSection(), fileHasImpeccableHookMarker(), HOOK_MANIFEST_TARGETS (+36 more)

### Community 25 - "ref_node_fs"
Cohesion: 0.12
Nodes (31): coerceSlug(), listSnapshots(), main(), nowFilenameStamp(), parseFrontmatter(), readLatestSnapshot(), readLatestSnapshotAcrossTargets(), readLatestSnapshotMatching() (+23 more)

### Community 26 - "AvailableState.tsx"
Cohesion: 0.27
Nodes (18): ApplicantHistoryChart(), AvailableTail(), FitSection(), AvailableState(), EMPTY_POPUP_PERSONALIZATION, ConversionSummary(), HistoryRow(), formatApplicationState() (+10 more)

### Community 27 - "hook-before-edit.mjs"
Cohesion: 0.10
Nodes (46): allow(), bumpCursorDenial(), cursorBlockMessage(), deny(), detectProposedHtml(), done(), escapeRegExp(), findingSignature() (+38 more)

### Community 28 - "live-copy-edit-agent.mjs"
Cohesion: 0.12
Nodes (41): applyMockWrites(), buildCopyEditBatchPrompt(), checkFrameworkSourceSyntax(), chooseCopyEditAgent(), COMMAND_AUTH_CACHE, commandAuthed(), commandExists(), compactBatchCandidates() (+33 more)

### Community 29 - "initGlobalBar"
Cohesion: 0.09
Nodes (39): agentStatusText(), barPaletteForTheme(), brandMarkSvg(), buildDesignHeader(), cursorForInsertAxis(), designPanelCss(), detectPageTheme(), ensureAgentPollTooltip() (+31 more)

### Community 30 - "live-accept.mjs"
Cohesion: 0.11
Nodes (40): resolveLiveTemplateExtensions(), acceptCli(), acceptReceiptPath(), argVal(), buildAcceptedWrappedSource(), buildCarbonizeReplacement(), decodeHtmlAttr(), deindentContent() (+32 more)

### Community 31 - "live-poll.mjs"
Cohesion: 0.10
Nodes (38): completionAckForAcceptResult(), completionTypeForAcceptResult(), PREVIEW_MODES_WITHOUT_SOURCE_MARKERS, acceptInstructions(), bootInstructions(), deferredWrapperInstructions(), generateInstructions(), insertScaffoldInstructions() (+30 more)

### Community 32 - "PopupComponents.tsx"
Cohesion: 0.10
Nodes (31): EMPTY_POPUP_PERSONALIZATION, externalPortfolioUrl(), HistoryDetails(), MetricCell(), PopupPersonalization, PortfolioMatches(), QualificationDetails(), SimilarOpportunities() (+23 more)

### Community 33 - "design-parser.mjs"
Cohesion: 0.14
Nodes (37): assessCoverage(), buildColor(), CANONICAL_SECTIONS, collectBullets(), collectColorValues(), collectParagraphs(), detectFormat(), extractColors() (+29 more)

### Community 34 - "scanCssTextForPulsingDot"
Cohesion: 0.10
Nodes (37): buildHtmlPatternCorpora(), checkColors(), checkElementAIPaletteDOM(), checkElementGlow(), checkGlow(), checkHtmlPatterns(), checkRadialSpotlight(), collectCssCustomProps() (+29 more)

### Community 35 - "live-wrap.mjs"
Cohesion: 0.14
Nodes (34): resolveSourceTraits(), argVal(), buildInsertWrapperLines(), computeInsertLine(), INSERT_POSITIONS, insertCli(), isInsertPosition(), resolveElementMatch() (+26 more)

### Community 36 - "SettingsComponents.tsx"
Cohesion: 0.10
Nodes (31): lucide-react, react, Card(), CardAction(), CardContent(), CardDescription(), CardHeader(), Input() (+23 more)

### Community 37 - "runHook"
Cohesion: 0.13
Nodes (27): bumpEditCount(), clampGroupedToBudget(), clampLastLine(), clampToBudget(), dedupeAgainstCache(), depthIsSet(), directiveFooter(), ensureFile() (+19 more)

### Community 38 - "SKILL.md"
Cohesion: 0.05
Nodes (38): Assess Adaptation Challenge, Implement & Verify, 1. Accessibility (VoiceOver / TalkBack), 2. Performance, 3. Appearance & Theming, 4. Platform Conformance (CRITICAL), 5. Adaptivity, Diagnostic Scan (+30 more)

### Community 39 - "background.ts"
Cohesion: 0.10
Nodes (39): advanceTabGeneration(), currentTabJobId(), enqueueTabMutation(), getTabState(), isJobDetailsPage(), isValidCaptureMetadata(), metadataKey(), readJobHistory (+31 more)

### Community 40 - "impeccable-paths.mjs"
Cohesion: 0.12
Nodes (26): CRITIQUE_DIR, firstExisting(), getDesignSidecarCandidates(), getDesignSidecarPath(), getImpeccableDir(), getLegacyLiveConfigPath(), getLegacyLiveServerPath(), getLegacyLiveSessionsDir() (+18 more)

### Community 41 - "parseRgb"
Cohesion: 0.13
Nodes (30): checkCreamPalette(), checkElementColors(), checkElementColorsDOM(), checkElementGlowDOM(), checkElementHoverContrast(), checkElementIconTile(), checkElementIconTileDOM(), checkHoverContrast() (+22 more)

### Community 42 - "session-store.mjs"
Cohesion: 0.19
Nodes (17): safeSessionId(), applyEvent(), baseSnapshot(), COMPLETED_PHASES, getReadableJournalPath(), persist(), readState(), deriveRenderState() (+9 more)

### Community 43 - "JobInsights"
Cohesion: 0.12
Nodes (22): 4. Naming Conventions & Expressiveness, 4. Naming Conventions & Expressiveness, BackgroundHistoryDependencies, JobInsights, averageRecentFixedPayment(), ClientPayProfileInput, deriveClientPayProfile(), fixedPayments() (+14 more)

### Community 44 - "parseAnyColor"
Cohesion: 0.08
Nodes (60): checkBorders(), checkColors(), checkElementAIPaletteDOM(), checkElementBorders(), checkElementBordersDOM(), checkElementColors(), checkElementColorsDOM(), checkElementGlow() (+52 more)

### Community 45 - "event-validation.mjs"
Cohesion: 0.12
Nodes (26): AGENT_PHASE_SET, FORBIDDEN_MANUAL_EDIT_TEXT_CHARS, INSERT_POSITIONS, isValidId(), isValidMountVariant(), isValidVariantId(), MOUNT_ERROR_MAX_LENGTH, MOUNT_URL_MAX_LENGTH (+18 more)

### Community 46 - "insights.ts"
Cohesion: 0.15
Nodes (26): deriveHiringWarnings(), hasHistoryAfterIdentityFilter(), HiringApplicationState, HiringHistoryEntry, HiringWarningLabel, HiringWarnings, HiringWarningsInput, validCount() (+18 more)

### Community 47 - "roots.mjs"
Cohesion: 0.15
Nodes (27): CANDIDATE_SCAN_IGNORED, consumeTargetArg(), CONTEXT_FALLBACK_DIRS, DESIGN_NAMES, DEV_CONFIG_MARKERS, discoverAppCandidates(), enterLiveRoot(), exists() (+19 more)

### Community 48 - "resolveLengthPx"
Cohesion: 0.13
Nodes (21): checkElementHeroEyebrow(), checkElementHeroEyebrowDOM(), checkHeroEyebrow(), checkKickerAboveHeading(), checkKickerAboveHeadingDOM(), checkKickerAboveHeadingFromDoc(), checkNumberedSectionLabels(), checkNumberedSectionLabelsDOM() (+13 more)

### Community 49 - "insert-ui.mjs"
Cohesion: 0.09
Nodes (13): canCreateInsert(), clampPlaceholderSize(), computeInsertPosition(), groupSiblingRows(), hitSiblingInsertGap(), horizontalOverlap(), insertCreateDisabledReason(), insertLineCoords() (+5 more)

### Community 50 - "live-manual-edit-evidence.mjs"
Cohesion: 0.12
Nodes (32): hasGeneratedHeader(), HEADER_MARKERS, isGeneratedFile(), isGitIgnored(), normalizeProjectSourcePath(), scanRollbackDir(), analyzeSourceHint(), buildCandidatesForOp() (+24 more)

### Community 51 - "Responsive Design"
Cohesion: 0.08
Nodes (25): Assess Adaptation Challenge, Breakpoints: Content-Driven, Content Adaptation, Desktop Adaptation (Mobile → Desktop), Detect Input Method, Not Just Screen Size, Email Adaptation (Web → Email), Implement Adaptations, Layout Adaptation Patterns (+17 more)

### Community 52 - "showToast"
Cohesion: 0.15
Nodes (29): clearStoredManualApplyState(), dismissToast(), fetchPendingCount(), handleManualEditActivity(), hidePendingApplyDock(), manualApplyLoadingText(), manualApplyStateKey(), manualEditEventForCurrentPage() (+21 more)

### Community 53 - "nuxt.mjs"
Cohesion: 0.29
Nodes (7): applyNuxtLiveAdapter(), buildNuxtPlugin(), detectNuxtProject(), nuxt, NUXT_PLUGIN_MARKER, NUXT_PLUGIN_NAME, removeNuxtLiveAdapter()

### Community 54 - "manual-edits-buffer.mjs"
Cohesion: 0.19
Nodes (22): args, buffer, cwd, pageUrlFilter, remaining, compactManualLogText(), rollbackManualApplyTransaction(), summarizeManualApplyFailures() (+14 more)

### Community 55 - "applyEditing"
Cohesion: 0.07
Nodes (40): addManualContextText(), applyEditing(), buildLocatorForLeaf(), canRestoreManualEditElement(), collectEditableTextRows(), visit(), collectManualContextPieces(), walk() (+32 more)

### Community 56 - "settings.ts"
Cohesion: 0.10
Nodes (38): readPopupPersonalization(), enqueueThemeOperation(), ExtensionApi, getLegacyTheme(), getPortfolio(), getStorageArea(), getUiSettings(), getUserProfile() (+30 more)

### Community 57 - "popup/App.tsx"
Cohesion: 0.13
Nodes (20): react-dom, root, App(), EMPTY_PERSONALIZATION, mergePopupReadResult(), normalizedJobId(), PopupReadDependencies, readPopupInsights() (+12 more)

### Community 58 - "svelte-ast.mjs"
Cohesion: 0.20
Nodes (21): Analysis, analyzeAttributes(), analyzeFragment(), analyzeNode(), analyzeSvelteMarkup(), applyReplacements(), classifyEachKey(), classifyRoots() (+13 more)

### Community 59 - "onboard.md"
Cohesion: 0.09
Nodes (22): Assess Onboarding Needs, Context Over Ceremony, Contextual Help, Design Onboarding Experiences, Documentation & Help, Empty State Design, Feature Discovery & Adoption, Guided Tours & Walkthroughs (+14 more)

### Community 60 - "parseAnyColor"
Cohesion: 0.13
Nodes (22): checkTextOcclusionDOM(), clamp01(), colorFunctionToRgb(), decodeSrgbChannel(), elementDirectText(), encodeSrgbChannel(), hslToRgb(), hwbToRgb() (+14 more)

### Community 61 - "detect-url.mjs"
Cohesion: 0.18
Nodes (21): createBrowserDetector(), detectUrl(), launchBrowser(), measureContentHiddenAfterReveal(), runVisualContrastFallback(), serializeDesignSystemForBrowser(), captureVisualContrastCandidate(), compareScreenshotContrast() (+13 more)

### Community 62 - "ref_bun_test"
Cohesion: 0.12
Nodes (20): ref_bun_test, canonical(), matchPortfolio, overlap(), PortfolioMatch, PortfolioMatchJob, rankPortfolioMatches(), STOP_WORDS (+12 more)

### Community 63 - "button.tsx"
Cohesion: 0.16
Nodes (11): @base-ui/react, class-variance-authority, cn, Alert(), AlertDescription(), alertVariants, Badge(), badgeVariants (+3 more)

### Community 64 - "context-signals.mjs"
Cohesion: 0.22
Nodes (13): cli(), COMMON_DEV_PORTS, devServerSignals(), gatherSignals(), gitSignals(), hasCode(), isVendoredPath(), latestCritique() (+5 more)

### Community 65 - "sveltekit-adapter.mjs"
Cohesion: 0.18
Nodes (20): applySvelteKitLiveAdapter(), buildSvelteLiveRootComponent(), defaultSvelteLayout(), detectSvelteKitProject(), ensureSvelteLiveRootComponent(), escapeRegExp(), fileIncludes(), findSvelteKitAppHtml() (+12 more)

### Community 66 - "tanstack-adapter.mjs"
Cohesion: 0.14
Nodes (21): buildLiveScriptSrc(), tanstackStart, applyTanStackLiveAdapter(), buildTanStackLiveRootComponent(), detectTanStackStartProject(), escapeRegExp(), findRootRouteFile(), insertAfterLastImport() (+13 more)

### Community 67 - "watchlist.ts"
Cohesion: 0.16
Nodes (24): JobWarning, isHistoryEntry(), isJobInsights(), isNullableBooleanValue(), isNullableNumberValue(), isNullableStringValue(), isQualificationDetail(), isSimilarJob() (+16 more)

### Community 68 - "The Toolkit"
Cohesion: 0.10
Nodes (20): Animate complex properties, Assess What "Extraordinary" Means Here, For data-heavy interfaces, For functional UI, For performance-critical UI, For visual/marketing surfaces, Implement with Discipline, Interact with the device (+12 more)

### Community 69 - "options/App.tsx"
Cohesion: 0.09
Nodes (42): adjustEditingIndex(), draftFromEntry(), EMPTY_DRAFT, isHttpPortfolioUrl(), isSettingsPortfolioEntry(), isSettingsProfile(), LocalStorageArea, parseHourlyRate() (+34 more)

### Community 70 - "accept-css.mjs"
Cohesion: 0.20
Nodes (23): bakeParamValues(), collectAllSelectors(), collectSelectorsFromNodes(), escapeRegExp(), formatBody(), isToggleOn(), normalizeSelector(), normalizeToggleForVar() (+15 more)

### Community 71 - "collectBrowserFindings"
Cohesion: 0.14
Nodes (22): browserFindingsFromMap(), checkBorders(), checkEdgeFlushCardsDOM(), checkElementBlinkingCursorDOM(), checkElementBorders(), checkElementBordersDOM(), checkElementPseudoStripeDOM(), checkElementTextOverflowDOM() (+14 more)

### Community 72 - "live.mjs"
Cohesion: 0.16
Nodes (19): parseCliOptions(), resolveProjectRoot(), resolveTargetSelection(), getLegacyLiveAnnotationsDir(), parseTargetOptions(), parseTargetPath(), TargetArgError, __dirname (+11 more)

### Community 73 - "qualification.ts"
Cohesion: 0.13
Nodes (25): Constraints, Failure modes, Flow, $impeccable hooks, Routing, Triage findings, deriveQualificationSummary, detailFrom() (+17 more)

### Community 74 - "journal.mjs"
Cohesion: 0.26
Nodes (14): PATCH_UNDOERS, clearInjectJournal(), healArtifact(), healInjectJournal(), INJECT_JOURNAL_RELPATH, INJECT_JOURNAL_VERSION, injectJournalPath(), insideProject() (+6 more)

### Community 75 - "sampleCssBackground"
Cohesion: 0.16
Nodes (18): analyzeVisualContrastCandidate(), blendRgba(), clampByte(), firstCssUrl(), getLayerValue(), loadVisualContrastImage(), parseObjectPosition(), parsePositionPair() (+10 more)

### Community 76 - "checkHtmlPatterns"
Cohesion: 0.13
Nodes (27): buildHtmlPatternCorpora(), checkHtmlPatterns(), collectCssCustomProps(), collectMarqueeKeyframes(), collectPulseKeyframes(), cssLengthToPx(), cssTextHasDarkRootBg(), enclosingCssSelector() (+19 more)

### Community 77 - "onAnnotDown"
Cohesion: 0.20
Nodes (17): beginEditPin(), buildAnnotationsForCapture(), buildPinElement(), cancelEditingPin(), clampPlaceholderSize(), finalizeEditingPin(), initAnnotOverlay(), localCoords() (+9 more)

### Community 78 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, @base-ui/react, class-variance-authority, cn, lucide-react, react, react-dom, shadcn (+1 more)

### Community 79 - "tag-strategy.mjs"
Cohesion: 0.22
Nodes (14): appendOriginToDirective(), buildTagBlock(), commentClose(), commentOpen(), detectLineEnding(), findCspMetaTags(), getAttr(), insertTag() (+6 more)

### Community 80 - "generate-image.mjs"
Cohesion: 0.09
Nodes (25): args, buf, crc32(), crcTable, file, pngChunk(), promptOf(), readJpegCom() (+17 more)

### Community 81 - "Repository Guidelines"
Cohesion: 0.17
Nodes (11): Architecture & Data Flow, Code Conventions & Common Patterns, Development Commands, graphify, Important Files, Key Directories, Maintaining this file, Project Overview (+3 more)

### Community 82 - "createLiveBrowserSessionState"
Cohesion: 0.20
Nodes (14): createLiveBrowserSessionState(), clearHandled(), clearScrollY(), clearSession(), isHandled(), loadSession(), markHandled(), nextCheckpointRevision() (+6 more)

### Community 83 - "animate.md"
Cohesion: 0.12
Nodes (14): Accessibility and control, Choose material by meaning, Find the job, Implement to the runtime, Set the motion thesis, Timing and easing, Verify, Visitor mode (+6 more)

### Community 84 - "expandScanTargets"
Cohesion: 0.36
Nodes (8): coLocatedStylesheets(), expandScanTargets(), hasPathTraversal(), isInsideProject(), looksLikeProjectRoot(), normalizeScanTargets(), parseStaticStyleImports(), resolveCacheCwd()

### Community 85 - "live.md"
Cohesion: 0.08
Nodes (22): Apply at system scale, Audit before choosing, Choose a strategy, Contrast and perception, Live-mode signature params, Verify, Visitor mode, Cleanup (+14 more)

### Community 86 - "Handle `generate`"
Cohesion: 0.12
Nodes (16): 1. Read the screenshot (if present), 2. Wrap the element, 3. Load the action's reference, 4. Plan three variants: identity first, then mode, then axes, 5. Apply the freeform prompt (if present), 6. Deliver variants, 7. Parameters (composition-sized, 0-4 per variant), 8. Signal done (+8 more)

### Community 87 - "source-search.mjs"
Cohesion: 0.38
Nodes (6): IMPECCABLE_DIR, matchesTemplateExtension(), findSourceFile(), NEVER_SOURCE_DIRS, SOURCE_SEARCH_DIRS, walk()

### Community 88 - "checkQuality"
Cohesion: 0.14
Nodes (18): borderColorsFromStyle(), borderWidthsFromStyle(), checkElementGptBorderShadow(), checkElementGptBorderShadowDOM(), checkElementQualityDOM(), checkGptThinBorderWideShadow(), checkQuality(), colorsNearlyMatch() (+10 more)

### Community 89 - "FakeObjectStore"
Cohesion: 0.10
Nodes (4): FakeDatabase, FakeIndex, FakeObjectStore, FakeTransaction

### Community 90 - "checkHeadingRhythmDOM"
Cohesion: 0.18
Nodes (16): checkHeadingRhythmDOM(), clusterTop(), edgeAbove(), edgeBelow(), hasOwnTopBoundary(), insideSmallCard(), isVisibleFlow(), overlapsX() (+8 more)

### Community 91 - "Generate Report"
Cohesion: 0.13
Nodes (14): 1. Accessibility (A11y), 2. Performance, 3. Theming, 4. Responsive Design, 5. Implementation Integrity (CRITICAL), Audit Health Score, Detailed Findings by Severity, Diagnostic Scan (+6 more)

### Community 92 - "content.test.ts"
Cohesion: 0.29
Nodes (6): fakeBrowser, fakeWindow, globals, MessageListener, runtimeListeners, windowListeners

### Community 93 - "mountSvelteComponentVariant"
Cohesion: 0.12
Nodes (24): abandonForeignSession(), acceptedDomAlreadyClean(), applyOriginalAttrsToSvelteAnchor(), commitAcceptedSvelteComponentToDom(), componentModuleCandidates(), describeMountFailure(), detectDevServerBase(), discardOrphanedSession() (+16 more)

### Community 94 - "live-status.mjs"
Cohesion: 0.29
Nodes (14): collectManualApplyFiles(), manualApplyReplyCommand(), manualApplyResumeHint(), mountFailureAction(), parseArgs(), renderSummary(), resumeCli(), summarizeManualApplyEvent() (+6 more)

### Community 95 - "Adaptation Strategies"
Cohesion: 0.40
Nodes (5): Adaptation Strategies, Orientation & foldables, Phone → Tablet (iPad / large screens), Platform → platform (iOS ↔ Android), Web → native (porting a website or web app)

### Community 96 - "restrictions.ts"
Cohesion: 0.44
Nodes (9): earningsLabel(), firstString(), labels(), meaningfulString(), parseRestrictions, positiveNumber(), record(), RecordValue (+1 more)

### Community 97 - "createLiveBrowserDomHelpers"
Cohesion: 0.19
Nodes (10): createLiveBrowserDomHelpers(), cssId(), liveUiRoot(), makeFrozenAnchor(), own(), pickable(), rectIsUsableAnchor(), uiAppend() (+2 more)

### Community 98 - "detect-utils.mjs"
Cohesion: 0.37
Nodes (10): detectAstroProject(), fileExists(), findConfigFile(), firstExistingFile(), hasAnyDependency(), literalConfigFiles(), readPackageDeps(), detectNextProject() (+2 more)

### Community 99 - "vcs"
Cohesion: 0.40
Nodes (5): vcs, clientKind, defaultBranch, enabled, useIgnoreFile

### Community 100 - "background.test-support.ts"
Cohesion: 0.11
Nodes (25): GET_JOB_HISTORY, GET_JOB_INSIGHTS, badgeBackgroundCalls, badgeTextCalls, deferred, fakeBrowser, insights, listener (+17 more)

### Community 101 - "browser-script-parts.mjs"
Cohesion: 0.19
Nodes (10): assembleLiveBrowserScript(), assertLiveBrowserScriptParts(), LIVE_BROWSER_SCRIPT_PARTS, readLiveBrowserScriptParts(), resolveLiveBrowserScriptParts(), loadBrowserScripts(), LIVE_CHROME_MOUNT_CONTRACT, LIVE_UI_COMPONENT_IDS (+2 more)

### Community 102 - "Impeccable Asset Producer"
Cohesion: 0.14
Nodes (12): Core Rule, Decision Comps, Impeccable Asset Producer, Input Contract, Output Contract, Prompt Pattern, Workflow, Generate three compositional options (+4 more)

### Community 103 - "source"
Cohesion: 0.50
Nodes (4): source, assist, actions, organizeImports

### Community 104 - "Optimization Strategy"
Cohesion: 0.14
Nodes (13): Animation Performance, Assess Performance Issues, Core Web Vitals Optimization, Cumulative Layout Shift (CLS < 0.1), Interaction to Next Paint (INP < 200ms), Largest Contentful Paint (LCP < 2.5s), Loading Performance, Network Optimization (+5 more)

### Community 105 - "readConfig"
Cohesion: 0.13
Nodes (17): applyConfigSource(), applyDetectorConfigSource(), cloneDefaultConfig(), detectorSection(), hookSection(), ignoreValueFilesKey(), mergeIgnoreValues(), numberOr() (+9 more)

### Community 106 - "frameworks/index.mjs"
Cohesion: 0.15
Nodes (12): astro, COMMENT_SYNTAXES, FRAMEWORKS, INJECT_KINDS, PREVIEW_MODES, SOURCE_TRAIT_DEFAULTS, STYLE_MODES, TAG_PATCH_KIND (+4 more)

### Community 107 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, check, compile, dev, format, format:check, lint (+4 more)

### Community 109 - "Capture lifecycle"
Cohesion: 0.40
Nodes (5): 1. Observe an existing response, 2. Normalize the payload, 3. Cross the page boundary, 4. Persist and isolate by tab, Capture lifecycle

### Community 110 - "storage.ts"
Cohesion: 0.10
Nodes (27): aggregateConversionStats(), ConversionStats, ApplicationState, ApplicationRecord, CLEARABLE_STORAGE_SCOPES, ClearableStorageScope, HISTORY_RETENTION_DAYS, LocalStorageRecord (+19 more)

### Community 111 - "pin.mjs"
Cohesion: 0.22
Nodes (11): CODEX_HARNESSES, commandPrefixForSkillsDir(), __dirname, findHarnessDirs(), generatePinnedSkill(), HARNESS_DIRS, loadCommandMetadata(), pin() (+3 more)

### Community 112 - "package.json"
Cohesion: 0.10
Nodes (18): description, name, packageManager, private, type, version, @biomejs/biome, oxlint (+10 more)

### Community 115 - "rules"
Cohesion: 0.15
Nodes (13): noBannedTypes, noForEach, linter, enabled, rules, complexity, preset, style (+5 more)

### Community 116 - "critique.md"
Cohesion: 0.17
Nodes (11): Action Summary, Ask the User, Assessment A: Design Review, Assessment B: Detector + Browser Evidence, Assessment Orchestration, Deliver the Report, Hard Invariants, Persist the Snapshot (+3 more)

### Community 117 - "Simplify the Design"
Cohesion: 0.17
Nodes (11): Assess Current State, Code Simplification, Content Simplification, Document Removed Complexity, Information Architecture, Interaction Simplification, Layout Simplification, Plan Simplification (+3 more)

### Community 118 - "Hardening Dimensions"
Cohesion: 0.17
Nodes (11): Accessibility Resilience, Assess Hardening Needs, Edge Cases & Boundary Conditions, Error Handling, Hardening Dimensions, Input Validation & Sanitization, Internationalization (i18n), Performance Resilience (+3 more)

### Community 119 - "generation-preflight.mjs"
Cohesion: 0.30
Nodes (10): buildGenerationPreflight(), compactError(), execFileAsync, insertTarget(), normalizeTarget(), replaceTarget(), runGenerationPreflight(), sourceResolutionCache (+2 more)

### Community 120 - "biome.json"
Cohesion: 0.18
Nodes (10): css, parser, files, ignoreUnknown, includes, maxSize, parser, allowComments (+2 more)

### Community 122 - "formatter"
Cohesion: 0.18
Nodes (11): arrowParentheses, bracketSameLine, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas, javascript (+3 more)

### Community 123 - "Rewrite by function"
Cohesion: 0.18
Nodes (10): Actions and navigation, Audit the language, Errors and permissions, Forms, Help and instructional text, Loading, empty, and success states, Rewrite by function, Set the message hierarchy (+2 more)

### Community 124 - "Nielsen's 10 Heuristics"
Cohesion: 0.18
Nodes (11): 10. Help and Documentation, 1. Visibility of System Status, 2. Match Between System and Real World, 3. User Control and Freedom, 4. Consistency and Standards, 5. Error Prevention, 6. Recognition Rather Than Recall, 7. Flexibility and Efficiency of Use (+3 more)

### Community 125 - "Generate Combined Critique Report"
Cohesion: 0.18
Nodes (11): Design Health Score, Design Specificity Verdict, Generate Combined Critique Report, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider (+3 more)

### Community 126 - "Upwork Tools"
Cohesion: 0.20
Nodes (10): Upwork Tools Product Definition, Contributing, Development & Testing, How It Works, License, Privacy & Security First, Project Directory Structure, Technical Specifications & Details (+2 more)

### Community 127 - "New visual work"
Cohesion: 0.18
Nodes (11): 1. Decide what is already true, 2. Ask what will change the work, 3. Choose the right amount of invention, 4. Commit the world, 5. Record the decision, 6. Build with full commitment, 7. Inspect and finish, Create a whole surface inside an established world (+3 more)

### Community 128 - "resolveLiveInjectionAnchor"
Cohesion: 0.18
Nodes (17): buildSvelteExpressionTextMap(), buildSveltePropValuesFromLiveElement(), buildSveltePropValuesV2(), cloneWithoutElements(), collectTextNodes(), collectVisibleTexts(), cssEscapeIdent(), elementMatchesOriginalMarkup() (+9 more)

### Community 129 - "4. Polish the whole path"
Cohesion: 0.18
Nodes (10): 1. Establish the system, 2. Gather the evidence, 3. Triage, 4. Polish the whole path, 5. Verify and finish, Color, imagery, and icons, Content and code, Flow and hierarchy (+2 more)

### Community 130 - "Refine the Design"
Cohesion: 0.18
Nodes (10): Assess Current State, Color Refinement, Composition Refinement, Motion Reduction, Plan Refinement, Refine the Design, Simplification, Verify Quality (+2 more)

### Community 133 - "Init flow"
Cohesion: 0.20
Nodes (10): Completion gate, Init flow, Step 1: Load current state, Step 2: Explore the project, Step 3: Interview for product truth, Step 4: Write PRODUCT.md, Step 5: Record workflow defaults, Step 6: Wrap up or resume (+2 more)

### Community 134 - "staleness-notice.mjs"
Cohesion: 0.38
Nodes (9): appendStalenessDirective(), buildStalenessDirective(), cachePath(), filterFreshFindings(), pruneCache(), readCache(), readJson(), stalenessCheckDisabled() (+1 more)

### Community 135 - "Common Cognitive Load Violations"
Cohesion: 0.22
Nodes (9): 1. The Wall of Options, 2. The Memory Bridge, 3. The Hidden Navigation, 4. The Jargon Barrier, 5. The Visual Noise Floor, 6. The Inconsistent Pattern, 7. The Multi-Task Demand, 8. The Context Switch (+1 more)

### Community 136 - "iOS platform"
Cohesion: 0.22
Nodes (9): Color & materials, Components & controls, iOS platform, Layout & structure, Motion, The iOS slop test, Touch targets, Typography (+1 more)

### Community 137 - "Product"
Cohesion: 0.15
Nodes (12): Brand Commitments, Capabilities and Constraints, Evidence on Hand, Local data boundary, Operating Context, Platform, Positioning, Product (+4 more)

### Community 138 - "Shape"
Cohesion: 0.22
Nodes (8): Cadence, Confirm and stop, Phase 1: Discovery interview, Phase 2: Resolve the design direction, Phase 3: Write the brief, Round 1: purpose, people, and outcome, Round 2: material, behavior, and boundaries, Shape

### Community 139 - "addVisualContrastFindings"
Cohesion: 0.16
Nodes (16): addBrowserFindings(), addVisualContrastFindings(), addVisualContrastResult(), analyzeVisualContrast(), clearOverlays(), detachOverlay(), disconnectLazyVisualContrastObserver(), postExtensionError() (+8 more)

### Community 141 - "formatter"
Cohesion: 0.22
Nodes (9): formatter, attributePosition, bracketSpacing, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding (+1 more)

### Community 142 - "Repository Guidelines"
Cohesion: 0.17
Nodes (11): Architecture & Data Flow, Code Conventions & Common Patterns, Development Commands, graphify, Important Files, Key Directories, Maintaining this file, Project Overview (+3 more)

### Community 143 - "source-lock.mjs"
Cohesion: 0.50
Nodes (7): isLiveServerPidReachable(), clearStaleLock(), readLock(), releaseOwnLock(), sleepSync(), sourceLockPath(), withSourceLockSync()

### Community 144 - "Android platform"
Cohesion: 0.25
Nodes (8): Android platform, Color & theming, Components & motion, Layout & structure, The Android slop test, Touch targets, Typography, Verifying the build

### Community 145 - "live-setup.md"
Cohesion: 0.25
Nodes (7): append-arrays, append-string, Config drift, Consent prompt (use this phrasing), CSP detection (first-time only), Troubleshooting, Write the config

### Community 146 - "Persona-Based Design Testing"
Cohesion: 0.25
Nodes (8): 1. Impatient Power User: "Alex", 2. Confused First-Timer: "Jordan", 3. Accessibility-Dependent User: "Sam", 4. Deliberate Stress Tester: "Riley", 5. Distracted Mobile User: "Casey", Persona-Based Design Testing, Project-Specific Personas, Selecting Personas

### Community 149 - "svelte-component.mjs"
Cohesion: 0.07
Nodes (58): collectUnusedSelectors(), verifyAcceptedSource(), applyLegacyDeferredAcceptsOnStartup(), buildPropsScriptV2(), loadSvelteCompiler(), appendCssToSvelteStyle(), appendSanitizedCssRule(), applyDeferredSvelteComponentAccepts() (+50 more)

### Community 151 - "Cognitive Load Assessment"
Cohesion: 0.29
Nodes (7): Cognitive Load Assessment, Cognitive Load Checklist, Extraneous Load: Bad Design, Germane Load: Learning Effort, Intrinsic Load: The Task Itself, The Working Memory Rule, Three Types of Cognitive Load

### Community 152 - "Impeccable Finish Reviewer"
Cohesion: 0.29
Nodes (6): Checks, in order, Disposition, Impeccable Finish Reviewer, Input Contract, Output Contract, Verdict Pass

### Community 153 - "Impeccable Manual Edit Applier"
Cohesion: 0.29
Nodes (6): Checks, Entry Atomicity, Impeccable Manual Edit Applier, Input Contract, Output Contract, Workflow

### Community 154 - "Architecture"
Cohesion: 0.17
Nodes (10): Architecture, Failure and security boundaries, IndexedDB, Local settings, Popup read flow, Runtime topology, Session storage, Settings flow (+2 more)

### Community 155 - "checkHeadingRhythmDOM"
Cohesion: 0.62
Nodes (7): checkHeadingRhythmDOM(), clusterTop(), edgeAbove(), edgeBelow(), hasOwnTopBoundary(), isVisibleFlow(), overlapsX()

### Community 156 - "FakeObjectStore"
Cohesion: 0.12
Nodes (5): FakeDatabase, FakeIndexedDB, FakeObjectStore, FakeRequest, FakeTransaction

### Community 157 - "Operate mode depth (and Read notes)"
Cohesion: 0.13
Nodes (12): Craft floor, Refuse, Verify, Color, Components, Layout, Motion, Operate mode depth (and Read notes) (+4 more)

### Community 158 - "Strict Clean Code & Engineering Guidelines"
Cohesion: 0.15
Nodes (13): 10. Testing & Verification Rigor, 1. File & Module Size Limits (Strict Rule), 2. SOLID Design Principles, 3. Core Software Principles: KISS, YAGNI, and DRY, 5. Functions & Control Flow, 6. Strict TypeScript & Type Safety, 7. Error Handling & Defensive Boundaries, 8. UI & Component Architecture (React & Tailwind) (+5 more)

### Community 159 - "[0.2.0] - 2026-09-03"
Cohesion: 0.25
Nodes (7): [0.2.0] - 2026-09-03, [0.4.0] - 2026-09-04, Architecture, Changelog, Features, Features, Highlights

### Community 160 - "correctness"
Cohesion: 0.33
Nodes (6): noUnusedImports, noUnusedVariables, useExhaustiveDependencies, fix, level, correctness

### Community 161 - "compilerOptions"
Cohesion: 0.25
Nodes (7): ./.wxt/tsconfig.json, compilerOptions, allowImportingTsExtensions, baseUrl, jsx, paths, extends

### Community 162 - "Heuristics Scoring Guide"
Cohesion: 0.50
Nodes (4): Heuristics Scoring Guide, Issue Severity (P0–P3), Reference Material, Score Summary

### Community 163 - "Strict Clean Code & Engineering Guidelines"
Cohesion: 0.22
Nodes (9): 10. Testing & Verification Rigor, 1. File & Module Size Limits (Strict Rule), 2. SOLID Design Principles, 3. Core Software Principles: KISS, YAGNI, and DRY, 5. Functions & Control Flow, 6. Strict TypeScript & Type Safety, 8. UI & Component Architecture (React & Tailwind), 9. Code Cleanliness, Formatting & Linting (+1 more)

### Community 164 - "isScreenReaderOnlyTextStyle"
Cohesion: 0.47
Nodes (6): clippedByInset(), clippedByRect(), expandBoxShorthand(), firstMetricLengthPx(), isScreenReaderOnlyTextStyle(), metricLengthPx()

### Community 165 - "serve-question.mjs"
Cohesion: 0.13
Nodes (19): browserOpenCommand(), openSystemBrowser(), answerFile(), esc(), flipFile(), idleGraceArg, loadRound(), localImages (+11 more)

### Community 166 - "For Developers & Contributors"
Cohesion: 0.33
Nodes (6): For Developers & Contributors, 🚀 For Freelancers & Users (No Coding Required), Installation & Quick Start, Prerequisites, Production Builds, Setup & Development

### Community 167 - "composition-catalog.mjs"
Cohesion: 0.16
Nodes (18): COMPOSITION_GRAMMAR_PREFIXES, COMPOSITION_SURFACES, compositionContentHash(), validateCompositionCatalog(), validateCompositionEntry(), CONCEPT_BREADTHS, CONCEPT_STATUSES, CONCEPT_STRENGTHS (+10 more)

### Community 169 - "doctor.mjs"
Cohesion: 0.07
Nodes (59): applyFixes(), cli(), collect(), parseArgs(), readProjectRootPatterns(), rel(), renderText(), safeRead() (+51 more)

### Community 171 - "Key Features"
Cohesion: 0.40
Nodes (5): 1. 🎯 Competition Intelligence, 2. 🔍 Client Quality & Payment Reality, 3. ⚖️ Your Fit & Qualification Audit, 4. ⚡ Local Power-User Workflow, Key Features

### Community 173 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 174 - "live-inject.mjs"
Cohesion: 0.21
Nodes (16): describeInjectArtifacts(), frameworkIgnorePatterns(), resolveFramework(), removeTag(), revertCspMeta(), unpatchTagFile(), CONFIG_PATH_GET(), __dirname (+8 more)

### Community 175 - "roll-selection.mjs"
Cohesion: 0.26
Nodes (11): challengerTickets(), compositionTickets(), emptyMatch(), modeAllows(), rank(), RATING_TICKETS, selectApprovedChallengers(), pickRound() (+3 more)

### Community 176 - ".oxlintrc.json"
Cohesion: 0.15
Nodes (12): categories, correctness, ignorePatterns, jsPlugins, overrides, rules, shadcn/no-arbitrary-values, shadcn/no-inline-styles (+4 more)

### Community 177 - "document.md"
Cohesion: 0.09
Nodes (22): Component translation rules, Narrative mapping, Pitfalls, Scan mode (approach C: auto-extract, then confirm descriptive language), Schema, Seed mode, Step 1: Find the design assets, Step 1: Route through new-work's workshop (+14 more)

### Community 178 - "Extract Flow"
Cohesion: 0.13
Nodes (12): Before you finish, Scope is sovereign, The amplification, The skeleton test, Why it reads flat, Extract Flow, Step 1: Discover the Design System, Step 2: Identify Patterns (+4 more)

### Community 179 - "palette.mjs"
Cohesion: 0.21
Nodes (8): args, buildWeights(), hashUnit(), pickSeed(), seed, SEEDS, weightedPick(), ref_node_crypto

### Community 180 - "checkElementRadialSpotlightDOM"
Cohesion: 0.67
Nodes (4): checkElementRadialSpotlight(), checkElementRadialSpotlightDOM(), elementGradientValue(), spotlightLabel()

### Community 181 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @biomejs/biome, oxlint, @shadcn/lint, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+4 more)

### Community 182 - "applicant-metrics.ts"
Cohesion: 0.36
Nodes (9): ApplicantMetrics, ApplicantSnapshot, deriveApplicantMetrics(), firstSeenApplicantDelta(), hasValidOrder(), isValidCount(), latestApplicantCount(), recentApplicantDelta() (+1 more)

### Community 183 - "detect-csp.mjs"
Cohesion: 0.20
Nodes (10): detectCsp(), INLINE_HEADER_SIGNALS, LAYOUT_EXTS, MONOREPO_HELPER_SIGNALS, NUXT_ROUTE_RULES_SIGNALS, NUXT_SECURITY_SIGNALS, SCAN_EXTS, SKIP_DIRS (+2 more)

### Community 184 - "hook.mjs"
Cohesion: 0.83
Nodes (3): isStopEvent(), main(), readStdin()

### Community 185 - "Generate Report"
Cohesion: 0.29
Nodes (7): Audit Health Score, Detailed Findings by Severity, Executive Summary, Generate Report, Patterns & Systemic Issues, Platform Conformance Verdict, Positive Findings

## Knowledge Gaps
- **944 isolated node(s):** `here`, `API_BASE`, `API_TIMEOUT_MS`, `localStates`, `PING_KINDS` (+939 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1128 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `init()` connect `initGlobalBar` to `live-browser.js`, `connectSSE`, `Init flow`, `SKILL.md`, `setLiveState`, `onAnnotDown`, `syncPageChatFocus`, `showToast`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **Why does `summary()` connect `ref_node_fs` to `SKILL.md`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **Why does `Step 1: Run the pass` connect `SKILL.md` to `ref_node_fs`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **What connects `here`, `API_BASE`, `API_TIMEOUT_MS` to the rest of the system?**
  _944 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `live-browser.js` be split into smaller, more focused modules?**
  _Cohesion score 0.033473389355742296 - nodes in this community are weakly interconnected._
- **Should `checks.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.03369042074212079 - nodes in this community are weakly interconnected._
- **Should `context.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.04411461554318697 - nodes in this community are weakly interconnected._