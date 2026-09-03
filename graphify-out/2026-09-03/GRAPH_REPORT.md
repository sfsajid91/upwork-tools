# Graph Report - upwork-tools  (2026-09-02)

## Corpus Check
- 224 files · ~442,848 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4275 nodes · 9902 edges · 167 communities (161 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 118 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d15d1426`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- live-browser.js
- checks.mjs
- context.mjs
- resumeSession
- detect-antipatterns-browser.js
- design-system.mjs
- injected/index.mjs
- live-server.mjs
- hook-lib.mjs
- protocol.ts
- database.ts
- concept-seed.mjs
- setLiveState
- options/App.tsx
- modern-screenshot.umd.js
- el
- css-cascade.mjs
- manual-apply.mjs
- initPageChat
- live-commit-manual-edits.mjs
- detect-text.mjs
- impeccable-config.mjs
- detect-antipatterns.mjs
- scripts
- hook-admin.mjs
- context-signals.mjs
- doctor.mjs
- hook-before-edit.mjs
- live-copy-edit-agent.mjs
- initGlobalBar
- live-accept.mjs
- live-poll.mjs
- detect-html.mjs
- design-parser.mjs
- scanCssTextForPulsingDot
- live-wrap.mjs
- InsightsView.tsx
- runHook
- new-work.md
- background.ts
- impeccable-paths.mjs
- parseRgb
- settings.ts
- storage.ts
- parseAnyColor
- event-validation.mjs
- insights.ts
- roots.mjs
- resolveLengthPx
- insert-ui.mjs
- live-manual-edit-evidence.mjs
- adapt.md
- handleManualEditActivity
- nuxt.mjs
- manual-edit-routes.mjs
- applyEditing
- checkHtmlPatterns
- popup/App.tsx
- svelte-ast.mjs
- onboard.md
- parseAnyColor
- detect-url.mjs
- portfolio-match.ts
- surface-briefs.mjs
- tracker.ts
- sveltekit-adapter.mjs
- tanstack-adapter.mjs
- Operate mode depth (and Read notes)
- The Toolkit
- serve-question.mjs
- accept-css.mjs
- collectBrowserFindings
- live.mjs
- qualification.ts
- live-inject.mjs
- sampleCssBackground
- history.ts
- onAnnotDown
- handlePollPost
- tag-strategy.mjs
- generate-image.mjs
- Repository Guidelines
- createLiveBrowserSessionState
- animate.md
- FakeObjectStore
- live.md
- Handle `generate`
- interceptor.ts
- checkQuality
- pay-profile.ts
- checkHeadingRhythmDOM
- Generate Report
- applicant-metrics.ts
- mountSvelteComponentVariant
- readConfig
- critique-storage.mjs
- restrictions.ts
- createLiveBrowserDomHelpers
- detect-utils.mjs
- Responsive Design
- expandScanTargets
- checkElementGptBorderShadowDOM
- Impeccable Asset Producer
- content.test.ts
- Optimization Strategy
- template-extensions.mjs
- frameworks/index.mjs
- document.md
- StaticElement
- embed-prompt.mjs
- browser-script-parts.mjs
- pin.mjs
- bolder.md
- source-search.mjs
- checkElementRadialSpotlightDOM
- rules
- critique.md
- Simplify the Design
- Hardening Dimensions
- generation-preflight.mjs
- biome.json
- includes
- formatter
- Rewrite by function
- Nielsen's 10 Heuristics
- Generate Combined Critique Report
- Resolved issues
- New visual work
- New Features Implementation Plan
- 4. Polish the whole path
- Refine the Design
- detect-csp.mjs
- palette.mjs
- Init flow
- staleness-notice.mjs
- Common Cognitive Load Violations
- iOS platform
- Product
- Shape
- FakeDatabase
- FakeIndex
- formatter
- Project Context
- Android platform
- Upwork Tools — Insights Scope
- Persona-Based Design Testing
- SKILL.md
- live-setup.md
- svelte-component.mjs
- Cognitive Load Assessment
- Impeccable Finish Reviewer
- Impeccable Manual Edit Applier
- checkHeadingRhythmDOM
- Diagnostic Scan
- correctness
- tsconfig.json
- Heuristics Scoring Guide
- detect.mjs
- source-lock.mjs
- hook.mjs
- source
- Matchers
- Upwork Tools — High-Level Context
- Impeccable Documenter
- normalizeGitHubEvent
- NEW_FEATURES.md

## God Nodes (most connected - your core abstractions)
1. `parseAnyColor()` - 45 edges
2. `parseAnyColor()` - 40 edges
3. `runHook()` - 40 edges
4. `collectBrowserFindings()` - 37 edges
5. `setLiveState()` - 32 edges
6. `connectSSE()` - 30 edges
7. `el()` - 29 edges
8. `showToast()` - 29 edges
9. `initGlobalBar()` - 29 edges
10. `detectHtml()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Upwork Tools` --conceptually_related_to--> `Upwork Tools Product Definition`  [INFERRED]
  README.md → PRODUCT.md
- `stats()` --calls--> `aggregateConversionStats()`  [EXTRACTED]
  tests/lib/tracker-conversion.test.ts → src/lib/conversion.ts
- `getLegacyLiveAnnotationsDir()` --calls--> `resolveProjectRoot()`  [EXTRACTED]
  .agents/skills/impeccable/scripts/lib/impeccable-paths.mjs → .agents/skills/impeccable/scripts/context.mjs
- `collect()` --indirect_call--> `extractPlatform()`  [INFERRED]
  .agents/skills/impeccable/scripts/doctor.mjs → .agents/skills/impeccable/scripts/context.mjs
- `collect()` --indirect_call--> `parseDesignMd()`  [INFERRED]
  .agents/skills/impeccable/scripts/doctor.mjs → .agents/skills/impeccable/scripts/lib/design-parser.mjs

## Import Cycles
- None detected.

## Communities (167 total, 6 thin omitted)

### Community 0 - "live-browser.js"
Cohesion: 0.03
Nodes (140): applyGlobalBarLabelState(), applyPlaceholderSizingStyles(), averageRgb01(), bindEditBadgeProxy(), bufferToBase64(), buildCollapsible(), buildColorModels(), buildListHtml() (+132 more)

### Community 1 - "checks.mjs"
Cohesion: 0.03
Nodes (119): ANIMATION_VALUE_KEYWORDS, borderColorsFromStyle(), borderWidthsFromStyle(), checkBorders(), checkClippedOverflow(), checkEdgeFlushCardsDOM(), checkElementBlinkingCursorDOM(), checkElementBorders() (+111 more)

### Community 2 - "context.mjs"
Cohesion: 0.05
Nodes (90): appendAutonomyCounterDirective(), appendBuildPathDirective(), appendDetectorFallback(), appendImageGenDirective(), appendImageToolsDirective(), appendSubagentAuthorizationDirective(), appendSurfaceBriefContext(), automaticHookMode() (+82 more)

### Community 3 - "resumeSession"
Cohesion: 0.05
Nodes (87): abortSvelteComponentInjection(), applyParamDefaults(), applyParamValue(), applyPlaceholderDimensions(), applySavedSessionMeta(), buildInsertPlaceholderSnapshotFromDom(), buildParamsPanel(), buildPickedAnchorSnapshot() (+79 more)

### Community 4 - "detect-antipatterns-browser.js"
Cohesion: 0.05
Nodes (71): addBrowserFindings(), addVisualContrastFindings(), addVisualContrastResult(), analyzeVisualContrast(), browserColorsClose(), browserDesignSystemConfig(), browserHasDirectText(), browserPrimaryFont() (+63 more)

### Community 5 - "design-system.mjs"
Cohesion: 0.06
Nodes (72): addClampEndpoints(), addColorObject(), addDesignColor(), addFontSizeStep(), addRoundedScale(), addRoundedToken(), addSidecarColors(), addSidecarRadii() (+64 more)

### Community 6 - "injected/index.mjs"
Cohesion: 0.06
Nodes (69): addBrowserFindings(), addVisualContrastFindings(), addVisualContrastResult(), analyzeVisualContrast(), analyzeVisualContrastCandidate(), blendRgba(), browserColorsClose(), browserDesignSystemConfig() (+61 more)

### Community 7 - "live-server.mjs"
Cohesion: 0.07
Nodes (47): getDesignSidecarPath(), getImpeccableDir(), getLiveAnnotationsDir(), getLiveDir(), eventPriority(), selectAvailablePendingEvent(), activeSessionSummaries(), annotRoot (+39 more)

### Community 8 - "hook-lib.mjs"
Cohesion: 0.06
Nodes (57): cursorBlockMessage(), ACK_EXTS, ADVISORY_RULES, canonicalPath(), canonicalPathCache, clampByte(), clampGroupedToBudget(), clampLastLine() (+49 more)

### Community 9 - "protocol.ts"
Cohesion: 0.05
Nodes (54): ContentWindow, main(), PendingReplay, ReplayTimer, ClientPayProfile, GET_JOB_HISTORY, GET_JOB_INSIGHTS, isClientPayProfile() (+46 more)

### Community 10 - "database.ts"
Cohesion: 0.08
Nodes (52): persistJobInsights(), ALL_STORES, appendJobSnapshotIfChanged(), clearAllLocalData(), clearHistory(), clearStores(), configureDatabaseSchema(), createStore() (+44 more)

### Community 11 - "concept-seed.mjs"
Cohesion: 0.07
Nodes (53): API_BASE, API_TIMEOUT_MS, apiBudgetMs(), dealCompositions(), driveSelection(), fetchRoll(), here, loadLocal() (+45 more)

### Community 12 - "setLiveState"
Cohesion: 0.11
Nodes (56): abandonForeignSession(), cancelEditing(), cancelEditingToPicking(), cancelInsertConfigure(), cleanup(), cleanupAcceptedSession(), clearAnnotations(), clearInsertPicking() (+48 more)

### Community 13 - "options/App.tsx"
Cohesion: 0.09
Nodes (46): adjustEditingIndex(), draftFromEntry(), EMPTY_DRAFT, isHttpPortfolioUrl(), isOptionsPortfolioEntry(), isOptionsProfile(), LocalStorageArea, OptionsApp() (+38 more)

### Community 14 - "modern-screenshot.umd.js"
Cohesion: 0.09
Nodes (55): ae(), be(), bt(), Ce(), s(), Ct(), de(), dt() (+47 more)

### Community 15 - "el"
Cohesion: 0.07
Nodes (56): actionLabel(), applyConfigureBarChrome(), bindConfigureCountPillTooltip(), bindConfigureInlineControlHover(), bindConfigureModifierPillHover(), buildConfigureActionControl(), buildConfigureCountControl(), buildConfigureRow() (+48 more)

### Community 16 - "css-cascade.mjs"
Cohesion: 0.07
Nodes (35): applyStaticDeclaration(), buildBorderOverrideMap(), parseShorthand(), resolveVar(), buildStaticStyleMap(), buildStaticWindow(), collectStaticCssRules(), compareStaticPriority() (+27 more)

### Community 17 - "manual-apply.mjs"
Cohesion: 0.09
Nodes (49): addOpToManualApplyChunk(), APPLY_EVENT_HARD_TIMEOUT_MS, APPLY_EVENT_SOFT_DEADLINE_MS, buildManualApplyAgentAction(), clearManualApplyTransaction(), collectManualApplyFiles(), compactManualApplyBatch(), compactManualApplyCandidates() (+41 more)

### Community 18 - "initPageChat"
Cohesion: 0.08
Nodes (52): armPageChatForTyping(), attachSteerFocusDebug(), attachSteerFocusGuard(), buildSteerProcessingDots(), buildSteerQueueHint(), clearSteerAwaitTimer(), clearSteerFocusRecoverTimer(), collapsePageChat() (+44 more)

### Community 19 - "live-commit-manual-edits.mjs"
Cohesion: 0.10
Nodes (49): allEntryIds(), argVal(), buildRepairBatch(), candidatesForEntry(), changedFilesSinceSnapshot(), clearAppliedEntries(), collectApplyOwnedFiles(), collectRollbackFiles() (+41 more)

### Community 20 - "detect-text.mjs"
Cohesion: 0.07
Nodes (42): blankCssComments(), BLOCK_BRACE_PREFIX_KEYWORDS, CSS_IN_JS_EXTENSIONS, detectText(), extFromFilePath(), extractCSSinJS(), extractStyleBlocks(), findCSSinJSTemplates() (+34 more)

### Community 21 - "impeccable-config.mjs"
Cohesion: 0.10
Nodes (46): applyDetectionConfigSource(), clampByte(), cleanIgnoreValueDisplay(), cloneDetectionConfig(), cloneRawDetectionConfig(), COLOR_CHANNEL_FORMATS, colorIgnoreKey(), DEFAULT_DETECTION_CONFIG (+38 more)

### Community 22 - "detect-antipatterns.mjs"
Cohesion: 0.09
Nodes (41): confirm(), detectCli(), detectLocalFile(), dim(), fileUrlToLocalPath(), formatAdvisorySection(), formatFindings(), formatFindingsBody() (+33 more)

### Community 23 - "scripts"
Cohesion: 0.04
Nodes (44): @biomejs/biome, dependencies, react, react-dom, description, devDependencies, @biomejs/biome, tailwindcss (+36 more)

### Community 24 - "hook-admin.mjs"
Cohesion: 0.12
Nodes (44): ACTIONS, addIgnoreFile(), addIgnoreRule(), addIgnoreValue(), DETECTOR_CONFIG_KEYS, detectorSection(), fileHasImpeccableHookMarker(), HOOK_MANIFEST_TARGETS (+36 more)

### Community 25 - "context-signals.mjs"
Cohesion: 0.21
Nodes (15): extractPlatform(), hasVisualImplementation(), loadContext(), cli(), COMMON_DEV_PORTS, devServerSignals(), gatherSignals(), gitSignals() (+7 more)

### Community 26 - "doctor.mjs"
Cohesion: 0.07
Nodes (59): applyFixes(), cli(), collect(), parseArgs(), readProjectRootPatterns(), rel(), renderText(), safeRead() (+51 more)

### Community 27 - "hook-before-edit.mjs"
Cohesion: 0.11
Nodes (31): bumpCursorDenial(), detectProposedHtml(), escapeRegExp(), findingSignature(), firstMatch(), firstString(), hasFragmentEditContent(), projectedEditContent() (+23 more)

### Community 28 - "live-copy-edit-agent.mjs"
Cohesion: 0.12
Nodes (42): applyMockWrites(), buildCopyEditBatchPrompt(), checkFrameworkSourceSyntax(), chooseCopyEditAgent(), COMMAND_AUTH_CACHE, commandAuthed(), commandExists(), compactBatchCandidates() (+34 more)

### Community 29 - "initGlobalBar"
Cohesion: 0.08
Nodes (42): agentHasWorkInFlight(), agentStatusText(), barPaletteForTheme(), brandMarkSvg(), buildDesignHeader(), cursorForInsertAxis(), designPanelCss(), detectPageTheme() (+34 more)

### Community 30 - "live-accept.mjs"
Cohesion: 0.12
Nodes (37): acceptCli(), acceptReceiptPath(), argVal(), buildAcceptedWrappedSource(), buildCarbonizeReplacement(), decodeHtmlAttr(), deindentContent(), detectCommentSyntax() (+29 more)

### Community 31 - "live-poll.mjs"
Cohesion: 0.10
Nodes (38): completionAckForAcceptResult(), completionTypeForAcceptResult(), PREVIEW_MODES_WITHOUT_SOURCE_MARKERS, acceptInstructions(), bootInstructions(), deferredWrapperInstructions(), generateInstructions(), insertScaffoldInstructions() (+30 more)

### Community 32 - "detect-html.mjs"
Cohesion: 0.10
Nodes (24): collectStaticCssText(), checkStaticPageTypography(), detectHtml(), STATIC_ELEMENT_RULES, checkCreamPalette(), checkPageLayout(), checkPageQualityDOM(), checkPageQualityFromDoc() (+16 more)

### Community 33 - "design-parser.mjs"
Cohesion: 0.14
Nodes (37): assessCoverage(), buildColor(), CANONICAL_SECTIONS, collectBullets(), collectColorValues(), collectParagraphs(), detectFormat(), extractColors() (+29 more)

### Community 34 - "scanCssTextForPulsingDot"
Cohesion: 0.10
Nodes (37): buildHtmlPatternCorpora(), checkColors(), checkElementAIPaletteDOM(), checkElementGlow(), checkGlow(), checkHtmlPatterns(), checkRadialSpotlight(), collectCssCustomProps() (+29 more)

### Community 35 - "live-wrap.mjs"
Cohesion: 0.12
Nodes (41): hasGeneratedHeader(), HEADER_MARKERS, isGeneratedFile(), isGitIgnored(), resolveLiveTemplateExtensions(), findSessionFile(), resolveSourceTraits(), argVal() (+33 more)

### Community 36 - "InsightsView.tsx"
Cohesion: 0.09
Nodes (18): AvailableState(), ConversionSummary(), EMPTY_POPUP_PERSONALIZATION, externalPortfolioUrl(), HistoryRow(), PortfolioMatches(), WARNING_COPY, WatchlistStatus (+10 more)

### Community 37 - "runHook"
Cohesion: 0.16
Nodes (32): main(), appendDesignSystemNote(), appendDesignSystemNoteOnce(), bumpEditCount(), commitFooterShown(), consumeSessionNoticeFlag(), dedupeAgainstCache(), depthIsSet() (+24 more)

### Community 38 - "new-work.md"
Cohesion: 0.07
Nodes (28): Audit Health Score, Detailed Findings by Severity, Executive Summary, Generate Report, Patterns & Systemic Issues, Platform Conformance Verdict, Positive Findings, Recommended Actions (+20 more)

### Community 39 - "background.ts"
Cohesion: 0.13
Nodes (34): advanceTabGeneration(), currentTabJobId(), enqueueTabMutation(), getTabState(), isJobDetailsPage(), isValidCaptureMetadata(), metadataKey(), readJobHistory() (+26 more)

### Community 40 - "impeccable-paths.mjs"
Cohesion: 0.12
Nodes (23): CRITIQUE_DIR, firstExisting(), getDesignSidecarCandidates(), getLegacyLiveAnnotationsDir(), getLegacyLiveConfigPath(), getLegacyLiveServerPath(), getLiveConfigPath(), getLiveServerPath() (+15 more)

### Community 41 - "parseRgb"
Cohesion: 0.13
Nodes (30): checkCreamPalette(), checkElementColors(), checkElementColorsDOM(), checkElementGlowDOM(), checkElementHoverContrast(), checkElementIconTile(), checkElementIconTileDOM(), checkHoverContrast() (+22 more)

### Community 42 - "settings.ts"
Cohesion: 0.12
Nodes (32): enqueueThemeOperation(), ExtensionApi, getLegacyTheme(), getStorageArea(), getUiSettings(), initializeTheme(), isRecord(), isThemeMode() (+24 more)

### Community 43 - "storage.ts"
Cohesion: 0.07
Nodes (18): JobInsights, CLEARABLE_STORAGE_SCOPES, ClearableStorageScope, HISTORY_RETENTION_DAYS, JobRecord, LatestJobCaptureRecord, LocalStorageRecord, MAX_SNAPSHOTS_PER_JOB (+10 more)

### Community 44 - "parseAnyColor"
Cohesion: 0.10
Nodes (50): checkColors(), checkElementAIPaletteDOM(), checkElementColors(), checkElementColorsDOM(), checkElementGlow(), checkElementGlowDOM(), checkElementHoverContrast(), checkElementIconTile() (+42 more)

### Community 45 - "event-validation.mjs"
Cohesion: 0.12
Nodes (26): AGENT_PHASE_SET, FORBIDDEN_MANUAL_EDIT_TEXT_CHARS, INSERT_POSITIONS, isValidId(), isValidMountVariant(), isValidVariantId(), MOUNT_ERROR_MAX_LENGTH, MOUNT_URL_MAX_LENGTH (+18 more)

### Community 46 - "insights.ts"
Cohesion: 0.12
Nodes (30): deriveHiringWarnings(), hasHistoryAfterIdentityFilter(), HiringApplicationState, HiringHistoryEntry, HiringWarningLabel, HiringWarnings, HiringWarningsInput, validCount() (+22 more)

### Community 47 - "roots.mjs"
Cohesion: 0.07
Nodes (60): getLegacyLiveSessionsDir(), getLiveSessionsDir(), safeSessionId(), collectManualApplyFiles(), manualApplyReplyCommand(), manualApplyResumeHint(), mountFailureAction(), parseArgs() (+52 more)

### Community 48 - "resolveLengthPx"
Cohesion: 0.10
Nodes (27): checkElementHeroEyebrow(), checkElementHeroEyebrowDOM(), checkHeroEyebrow(), checkKickerAboveHeading(), checkKickerAboveHeadingDOM(), checkKickerAboveHeadingFromDoc(), checkNumberedSectionLabels(), checkNumberedSectionLabelsDOM() (+19 more)

### Community 49 - "insert-ui.mjs"
Cohesion: 0.09
Nodes (13): canCreateInsert(), clampPlaceholderSize(), computeInsertPosition(), groupSiblingRows(), hitSiblingInsertGap(), horizontalOverlap(), insertCreateDisabledReason(), insertLineCoords() (+5 more)

### Community 50 - "live-manual-edit-evidence.mjs"
Cohesion: 0.15
Nodes (26): analyzeSourceHint(), buildCandidatesForOp(), buildContextHintsByRef(), buildManualEditEvidence(), collectSearchFiles(), countOps(), decodeBasicHtml(), escapeRegExp() (+18 more)

### Community 51 - "adapt.md"
Cohesion: 0.08
Nodes (22): Assess Adaptation Challenge, Content Adaptation, Desktop Adaptation (Mobile → Desktop), Email Adaptation (Web → Email), Implement Adaptations, Layout Adaptation Techniques, Mobile Adaptation (Desktop → Mobile), Adaptation Strategies (+14 more)

### Community 52 - "handleManualEditActivity"
Cohesion: 0.18
Nodes (26): clearStoredManualApplyState(), fetchPendingCount(), handleManualEditActivity(), hidePendingApplyDock(), manualApplyLoadingText(), manualApplyStateKey(), manualEditEventForCurrentPage(), numberOrNull() (+18 more)

### Community 53 - "nuxt.mjs"
Cohesion: 0.31
Nodes (7): applyNuxtLiveAdapter(), buildNuxtPlugin(), nuxt, NUXT_PLUGIN_MARKER, NUXT_PLUGIN_NAME, removeNuxtLiveAdapter(), buildLiveScriptSrc()

### Community 54 - "manual-edit-routes.mjs"
Cohesion: 0.17
Nodes (22): scrubManualEditsAgainstOriginalBlock(), args, buffer, cwd, pageUrlFilter, remaining, compactManualLogText(), summarizeManualApplyFailures() (+14 more)

### Community 55 - "applyEditing"
Cohesion: 0.08
Nodes (34): addManualContextText(), applyEditing(), buildLocatorForLeaf(), canRestoreManualEditElement(), collectManualContextPieces(), walk(), contextElementForManualEdit(), copyEditContainerContext() (+26 more)

### Community 56 - "checkHtmlPatterns"
Cohesion: 0.13
Nodes (27): buildHtmlPatternCorpora(), checkHtmlPatterns(), collectCssCustomProps(), collectMarqueeKeyframes(), collectPulseKeyframes(), cssLengthToPx(), cssTextHasDarkRootBg(), enclosingCssSelector() (+19 more)

### Community 57 - "popup/App.tsx"
Cohesion: 0.13
Nodes (21): App(), EMPTY_PERSONALIZATION, mergePopupReadResult(), normalizedJobId(), PopupReadDependencies, readPopupInsights(), readPopupPersonalization(), readWatchlistStatus() (+13 more)

### Community 58 - "svelte-ast.mjs"
Cohesion: 0.21
Nodes (20): Analysis, analyzeAttributes(), analyzeFragment(), analyzeNode(), analyzeSvelteMarkup(), applyReplacements(), classifyEachKey(), classifyRoots() (+12 more)

### Community 59 - "onboard.md"
Cohesion: 0.09
Nodes (22): Assess Onboarding Needs, Context Over Ceremony, Contextual Help, Design Onboarding Experiences, Documentation & Help, Empty State Design, Feature Discovery & Adoption, Guided Tours & Walkthroughs (+14 more)

### Community 60 - "parseAnyColor"
Cohesion: 0.13
Nodes (22): checkTextOcclusionDOM(), clamp01(), colorFunctionToRgb(), decodeSrgbChannel(), elementDirectText(), encodeSrgbChannel(), hslToRgb(), hwbToRgb() (+14 more)

### Community 61 - "detect-url.mjs"
Cohesion: 0.19
Nodes (20): createBrowserDetector(), detectUrl(), launchBrowser(), measureContentHiddenAfterReveal(), runVisualContrastFallback(), serializeDesignSystemForBrowser(), captureVisualContrastCandidate(), compareScreenshotContrast() (+12 more)

### Community 62 - "portfolio-match.ts"
Cohesion: 0.13
Nodes (20): PopupPersonalization, canonical(), matchPortfolio, overlap(), PortfolioMatch, PortfolioMatchJob, rankPortfolioMatches(), STOP_WORDS (+12 more)

### Community 63 - "surface-briefs.mjs"
Cohesion: 0.35
Nodes (11): getSurfaceBriefDir(), listSurfaceBriefs(), normalizeRouteTarget(), normalizeSurfaceTarget(), parseSurfaceBrief(), resolveSurfaceBrief(), SURFACE_BRIEF_VERSION, surfaceBriefPathForTarget() (+3 more)

### Community 64 - "tracker.ts"
Cohesion: 0.14
Nodes (20): aggregateConversionStats(), ConversionStats, ApplicationState, ApplicationRecord, APPLICATION_STATES, copyRecord(), createApplicationRecord(), isApplicationState() (+12 more)

### Community 65 - "sveltekit-adapter.mjs"
Cohesion: 0.18
Nodes (20): applySvelteKitLiveAdapter(), buildSvelteLiveRootComponent(), defaultSvelteLayout(), detectSvelteKitProject(), ensureSvelteLiveRootComponent(), escapeRegExp(), fileIncludes(), findSvelteKitAppHtml() (+12 more)

### Community 66 - "tanstack-adapter.mjs"
Cohesion: 0.16
Nodes (20): tanstackStart, applyTanStackLiveAdapter(), buildTanStackLiveRootComponent(), detectTanStackStartProject(), escapeRegExp(), findRootRouteFile(), insertAfterLastImport(), isManagedComponent() (+12 more)

### Community 67 - "Operate mode depth (and Read notes)"
Cohesion: 0.22
Nodes (9): Color, Components, Layout, Motion, Operate mode depth (and Read notes), Product constraints, Product permissions, The product slop test (+1 more)

### Community 68 - "The Toolkit"
Cohesion: 0.10
Nodes (20): Animate complex properties, Assess What "Extraordinary" Means Here, For data-heavy interfaces, For functional UI, For performance-critical UI, For visual/marketing surfaces, Implement with Discipline, Interact with the device (+12 more)

### Community 69 - "serve-question.mjs"
Cohesion: 0.14
Nodes (17): browserOpenCommand(), openSystemBrowser(), answerFile(), esc(), flipFile(), idleGraceArg, loadRound(), localImages (+9 more)

### Community 70 - "accept-css.mjs"
Cohesion: 0.20
Nodes (23): bakeParamValues(), collectAllSelectors(), collectSelectorsFromNodes(), escapeRegExp(), formatBody(), isToggleOn(), normalizeSelector(), normalizeToggleForVar() (+15 more)

### Community 71 - "collectBrowserFindings"
Cohesion: 0.16
Nodes (20): browserFindingsFromMap(), checkBorders(), checkEdgeFlushCardsDOM(), checkElementBlinkingCursorDOM(), checkElementBorders(), checkElementBordersDOM(), checkElementPseudoStripeDOM(), checkElementTextOverflowDOM() (+12 more)

### Community 72 - "live.mjs"
Cohesion: 0.16
Nodes (18): parseCliOptions(), resolveProjectRoot(), resolveTargetSelection(), parseTargetOptions(), parseTargetPath(), TargetArgError, __dirname, ensureServerRunning() (+10 more)

### Community 73 - "qualification.ts"
Cohesion: 0.18
Nodes (20): deriveQualificationSummary, detailFrom(), firstText(), isAny(), isDefaultLabel(), isDefaultZeroRequirement(), isJssRequirement(), isMeaninglessClientRequirement() (+12 more)

### Community 74 - "live-inject.mjs"
Cohesion: 0.13
Nodes (28): describeInjectArtifacts(), frameworkIgnorePatterns(), PATCH_UNDOERS, resolveFramework(), clearInjectJournal(), healArtifact(), healInjectJournal(), INJECT_JOURNAL_RELPATH (+20 more)

### Community 75 - "sampleCssBackground"
Cohesion: 0.16
Nodes (18): analyzeVisualContrastCandidate(), blendRgba(), clampByte(), firstCssUrl(), getLayerValue(), loadVisualContrastImage(), parseObjectPosition(), parsePositionPair() (+10 more)

### Community 76 - "history.ts"
Cohesion: 0.16
Nodes (15): compareSnapshots(), getJobSnapshotSummary, JobSnapshotSummary, listValidJobSnapshots, queryJobSnapshots(), summarizeJobSnapshots(), validJobId(), validSnapshot() (+7 more)

### Community 77 - "onAnnotDown"
Cohesion: 0.20
Nodes (17): beginEditPin(), buildAnnotationsForCapture(), buildPinElement(), cancelEditingPin(), clampPlaceholderSize(), finalizeEditingPin(), initAnnotOverlay(), localCoords() (+9 more)

### Community 78 - "handlePollPost"
Cohesion: 0.19
Nodes (19): acknowledgePendingEvent(), agentPollingConnected(), broadcast(), broadcastAgentPollingIfChanged(), cancelQueuedAnonymousExitEvents(), findAvailablePendingEvent(), findPendingEventById(), flushPendingPolls() (+11 more)

### Community 79 - "tag-strategy.mjs"
Cohesion: 0.21
Nodes (16): appendOriginToDirective(), buildTagBlock(), commentClose(), commentOpen(), detectLineEnding(), findCspMetaTags(), getAttr(), insertTag() (+8 more)

### Community 80 - "generate-image.mjs"
Cohesion: 0.17
Nodes (13): crc32(), hash32(), hslToRgb(), out, palette(), pngChunk(), pngFake(), promptFile (+5 more)

### Community 81 - "Repository Guidelines"
Cohesion: 0.04
Nodes (43): Architecture & Data Flow, Code Conventions & Common Patterns, Development Commands, graphify, Important Files, Key Directories, Maintaining this file, Project Overview (+35 more)

### Community 82 - "createLiveBrowserSessionState"
Cohesion: 0.20
Nodes (14): createLiveBrowserSessionState(), clearHandled(), clearScrollY(), clearSession(), isHandled(), loadSession(), markHandled(), nextCheckpointRevision() (+6 more)

### Community 83 - "animate.md"
Cohesion: 0.12
Nodes (14): Accessibility and control, Choose material by meaning, Find the job, Implement to the runtime, Set the motion thesis, Timing and easing, Verify, Visitor mode (+6 more)

### Community 84 - "FakeObjectStore"
Cohesion: 0.11
Nodes (3): FakeIndexedDB, FakeObjectStore, FakeTransaction

### Community 85 - "live.md"
Cohesion: 0.08
Nodes (22): Apply at system scale, Audit before choosing, Choose a strategy, Contrast and perception, Live-mode signature params, Verify, Visitor mode, Cleanup (+14 more)

### Community 86 - "Handle `generate`"
Cohesion: 0.12
Nodes (16): 1. Read the screenshot (if present), 2. Wrap the element, 3. Load the action's reference, 4. Plan three variants: identity first, then mode, then axes, 5. Apply the freeform prompt (if present), 6. Deliver variants, 7. Parameters (composition-sized, 0-4 per variant), 8. Signal done (+8 more)

### Community 87 - "interceptor.ts"
Cohesion: 0.23
Nodes (16): main(), defendInspectionHook(), emitInsights(), inspectPayload(), installFetchAndResponseHooks(), installInterceptors(), installReplayListener(), installXhrHooks() (+8 more)

### Community 88 - "checkQuality"
Cohesion: 0.14
Nodes (16): checkElementOversizedH1(), checkElementOversizedH1DOM(), checkElementQuality(), checkElementQualityDOM(), checkOversizedH1(), checkQuality(), colorsNearlyMatch(), cssColorAlpha() (+8 more)

### Community 89 - "pay-profile.ts"
Cohesion: 0.28
Nodes (11): ClientHistoryEntry, averageRecentFixedPayment(), ClientPayProfileInput, deriveClientPayProfile(), fixedPayments(), HistoricalHourlyRateRecord, medianRecentFixedPayment(), PayProfileHistoryEntry (+3 more)

### Community 90 - "checkHeadingRhythmDOM"
Cohesion: 0.18
Nodes (16): checkHeadingRhythmDOM(), clusterTop(), edgeAbove(), edgeBelow(), hasOwnTopBoundary(), insideSmallCard(), isVisibleFlow(), overlapsX() (+8 more)

### Community 91 - "Generate Report"
Cohesion: 0.13
Nodes (14): 1. Accessibility (A11y), 2. Performance, 3. Theming, 4. Responsive Design, 5. Implementation Integrity (CRITICAL), Audit Health Score, Detailed Findings by Severity, Diagnostic Scan (+6 more)

### Community 92 - "applicant-metrics.ts"
Cohesion: 0.36
Nodes (9): ApplicantMetrics, ApplicantSnapshot, deriveApplicantMetrics(), firstSeenApplicantDelta(), hasValidOrder(), isValidCount(), latestApplicantCount(), recentApplicantDelta() (+1 more)

### Community 93 - "mountSvelteComponentVariant"
Cohesion: 0.14
Nodes (20): acceptedDomAlreadyClean(), applyOriginalAttrsToSvelteAnchor(), commitAcceptedSvelteComponentToDom(), componentModuleCandidates(), describeMountFailure(), detectDevServerBase(), ensureAcceptedDomClean(), findAcceptedRuntimeWrappers() (+12 more)

### Community 94 - "readConfig"
Cohesion: 0.20
Nodes (11): applyConfigSource(), applyDetectorConfigSource(), cloneDefaultConfig(), detectorSection(), hookSection(), ignoreValueFilesKey(), mergeIgnoreValues(), numberOr() (+3 more)

### Community 95 - "critique-storage.mjs"
Cohesion: 0.25
Nodes (14): coerceSlug(), listSnapshots(), main(), nowFilenameStamp(), parseFrontmatter(), readLatestSnapshot(), readLatestSnapshotAcrossTargets(), readLatestSnapshotMatching() (+6 more)

### Community 96 - "restrictions.ts"
Cohesion: 0.44
Nodes (9): earningsLabel(), firstString(), labels(), meaningfulString(), parseRestrictions, positiveNumber(), record(), RecordValue (+1 more)

### Community 97 - "createLiveBrowserDomHelpers"
Cohesion: 0.19
Nodes (10): createLiveBrowserDomHelpers(), cssId(), liveUiRoot(), makeFrozenAnchor(), own(), pickable(), rectIsUsableAnchor(), uiAppend() (+2 more)

### Community 98 - "detect-utils.mjs"
Cohesion: 0.27
Nodes (13): astro, detectAstroProject(), fileExists(), findConfigFile(), firstExistingFile(), hasAnyDependency(), literalConfigFiles(), readPackageDeps() (+5 more)

### Community 99 - "Responsive Design"
Cohesion: 0.20
Nodes (10): Breakpoints: Content-Driven, Detect Input Method, Not Just Screen Size, Layout Adaptation Patterns, Mobile-First: Write It Right, Picture Element for Art Direction, Responsive Design, Responsive Images: Get It Right, Safe Areas: Handle the Notch (+2 more)

### Community 100 - "expandScanTargets"
Cohesion: 0.36
Nodes (8): coLocatedStylesheets(), expandScanTargets(), hasPathTraversal(), isInsideProject(), looksLikeProjectRoot(), normalizeScanTargets(), parseStaticStyleImports(), resolveCacheCwd()

### Community 101 - "checkElementGptBorderShadowDOM"
Cohesion: 0.38
Nodes (7): borderColorsFromStyle(), borderWidthsFromStyle(), checkElementGptBorderShadow(), checkElementGptBorderShadowDOM(), checkGptThinBorderWideShadow(), shadowLayerAlpha(), shadowMaxBlurPx()

### Community 102 - "Impeccable Asset Producer"
Cohesion: 0.14
Nodes (12): Core Rule, Decision Comps, Impeccable Asset Producer, Input Contract, Output Contract, Prompt Pattern, Workflow, Generate three compositional options (+4 more)

### Community 103 - "content.test.ts"
Cohesion: 0.29
Nodes (6): fakeBrowser, fakeWindow, globals, MessageListener, runtimeListeners, windowListeners

### Community 104 - "Optimization Strategy"
Cohesion: 0.14
Nodes (13): Animation Performance, Assess Performance Issues, Core Web Vitals Optimization, Cumulative Layout Shift (CLS < 0.1), Interaction to Next Paint (INP < 200ms), Largest Contentful Paint (LCP < 2.5s), Loading Performance, Network Optimization (+5 more)

### Community 105 - "template-extensions.mjs"
Cohesion: 0.36
Nodes (6): extensionCache, LIVE_TEMPLATE_EXTENSIONS, mergeExtensions(), normalizeExtensionEntries(), readLiveTemplateExtensions(), safeReadJson()

### Community 106 - "frameworks/index.mjs"
Cohesion: 0.18
Nodes (10): COMMENT_SYNTAXES, FRAMEWORKS, INJECT_KINDS, PREVIEW_MODES, SOURCE_TRAIT_DEFAULTS, STYLE_MODES, TAG_PATCH_KIND, staticHtml (+2 more)

### Community 107 - "document.md"
Cohesion: 0.08
Nodes (23): Component translation rules, Narrative mapping, Pitfalls, Scan mode (approach C: auto-extract, then confirm descriptive language), Schema, Seed mode, Step 1: Find the design assets, Step 1: Route through new-work's workshop (+15 more)

### Community 109 - "embed-prompt.mjs"
Cohesion: 0.19
Nodes (11): args, buf, crc32(), crcTable, file, pngChunk(), promptOf(), readJpegCom() (+3 more)

### Community 110 - "browser-script-parts.mjs"
Cohesion: 0.19
Nodes (10): assembleLiveBrowserScript(), assertLiveBrowserScriptParts(), LIVE_BROWSER_SCRIPT_PARTS, readLiveBrowserScriptParts(), resolveLiveBrowserScriptParts(), loadBrowserScripts(), LIVE_CHROME_MOUNT_CONTRACT, LIVE_UI_COMPONENT_IDS (+2 more)

### Community 111 - "pin.mjs"
Cohesion: 0.22
Nodes (11): CODEX_HARNESSES, commandPrefixForSkillsDir(), __dirname, findHarnessDirs(), generatePinnedSkill(), HARNESS_DIRS, loadCommandMetadata(), pin() (+3 more)

### Community 112 - "bolder.md"
Cohesion: 0.33
Nodes (5): Before you finish, Scope is sovereign, The amplification, The skeleton test, Why it reads flat

### Community 113 - "source-search.mjs"
Cohesion: 0.40
Nodes (5): IMPECCABLE_DIR, matchesTemplateExtension(), NEVER_SOURCE_DIRS, SOURCE_SEARCH_DIRS, walk()

### Community 114 - "checkElementRadialSpotlightDOM"
Cohesion: 0.67
Nodes (4): checkElementRadialSpotlight(), checkElementRadialSpotlightDOM(), elementGradientValue(), spotlightLabel()

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
Cohesion: 0.35
Nodes (9): buildGenerationPreflight(), compactError(), execFileAsync, insertTarget(), normalizeTarget(), replaceTarget(), runGenerationPreflight(), sourceResolutionCache (+1 more)

### Community 120 - "biome.json"
Cohesion: 0.17
Nodes (11): css, parser, parser, allowComments, tailwindDirectives, $schema, vcs, clientKind (+3 more)

### Community 121 - "includes"
Cohesion: 0.15
Nodes (12): files, ignoreUnknown, includes, maxSize, **, !!.agents, !!coverage, !!dist (+4 more)

### Community 122 - "formatter"
Cohesion: 0.17
Nodes (12): arrowParentheses, bracketSameLine, jsxQuoteStyle, quoteProperties, quoteStyle, semicolons, trailingCommas, javascript (+4 more)

### Community 123 - "Rewrite by function"
Cohesion: 0.18
Nodes (10): Actions and navigation, Audit the language, Errors and permissions, Forms, Help and instructional text, Loading, empty, and success states, Rewrite by function, Set the message hierarchy (+2 more)

### Community 124 - "Nielsen's 10 Heuristics"
Cohesion: 0.18
Nodes (11): 10. Help and Documentation, 1. Visibility of System Status, 2. Match Between System and Real World, 3. User Control and Freedom, 4. Consistency and Standards, 5. Error Prevention, 6. Recognition Rather Than Recall, 7. Flexibility and Efficiency of Use (+3 more)

### Community 125 - "Generate Combined Critique Report"
Cohesion: 0.18
Nodes (11): Design Health Score, Design Specificity Verdict, Generate Combined Critique Report, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider (+3 more)

### Community 126 - "Resolved issues"
Cohesion: 0.15
Nodes (12): Chrome 111 runtime messaging, Client history source, Documentation, Explicitly out of scope, Interception safety, Navigation and tab lifecycle safety, Related history identity, Remaining recommendations (+4 more)

### Community 127 - "New visual work"
Cohesion: 0.18
Nodes (11): 1. Decide what is already true, 2. Ask what will change the work, 3. Choose the right amount of invention, 4. Commit the world, 5. Record the decision, 6. Build with full commitment, 7. Inspect and finish, Create a whole surface inside an established world (+3 more)

### Community 128 - "New Features Implementation Plan"
Cohesion: 0.13
Nodes (14): Audit Issues Report, New Features Specification, Actual goal, Current implementation matrix, Decision, New Features Implementation Plan, Phase 0 acceptance, Phase 0 — Contract and audit corrections (+6 more)

### Community 129 - "4. Polish the whole path"
Cohesion: 0.18
Nodes (10): 1. Establish the system, 2. Gather the evidence, 3. Triage, 4. Polish the whole path, 5. Verify and finish, Color, imagery, and icons, Content and code, Flow and hierarchy (+2 more)

### Community 130 - "Refine the Design"
Cohesion: 0.18
Nodes (10): Assess Current State, Color Refinement, Composition Refinement, Motion Reduction, Plan Refinement, Refine the Design, Simplification, Verify Quality (+2 more)

### Community 131 - "detect-csp.mjs"
Cohesion: 0.20
Nodes (10): detectCsp(), INLINE_HEADER_SIGNALS, LAYOUT_EXTS, MONOREPO_HELPER_SIGNALS, NUXT_ROUTE_RULES_SIGNALS, NUXT_SECURITY_SIGNALS, SCAN_EXTS, SKIP_DIRS (+2 more)

### Community 132 - "palette.mjs"
Cohesion: 0.24
Nodes (7): args, buildWeights(), hashUnit(), pickSeed(), seed, SEEDS, weightedPick()

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

### Community 141 - "formatter"
Cohesion: 0.22
Nodes (9): formatter, attributePosition, bracketSpacing, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding (+1 more)

### Community 144 - "Android platform"
Cohesion: 0.25
Nodes (8): Android platform, Color & theming, Components & motion, Layout & structure, The Android slop test, Touch targets, Typography, Verifying the build

### Community 145 - "Upwork Tools — Insights Scope"
Cohesion: 0.18
Nodes (10): 1. Competition, 2. Client Quality, 3. Your Fit, 4. Client History, 5. Related Previous Jobs, 6. Important Warnings, Do Not Add Yet, Main UI Priority (+2 more)

### Community 146 - "Persona-Based Design Testing"
Cohesion: 0.25
Nodes (8): 1. Impatient Power User: "Alex", 2. Confused First-Timer: "Jordan", 3. Accessibility-Dependent User: "Sam", 4. Deliberate Stress Tester: "Riley", 5. Distracted Mobile User: "Casey", Persona-Based Design Testing, Project-Specific Personas, Selecting Personas

### Community 147 - "SKILL.md"
Cohesion: 0.08
Nodes (21): Craft floor, Refuse, Verify, Extract Flow, Step 1: Discover the Design System, Step 2: Identify Patterns, Step 3: Plan Extraction, Step 4: Extract & Enrich (+13 more)

### Community 148 - "live-setup.md"
Cohesion: 0.25
Nodes (7): append-arrays, append-string, Config drift, Consent prompt (use this phrasing), CSP detection (first-time only), Troubleshooting, Write the config

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

### Community 155 - "checkHeadingRhythmDOM"
Cohesion: 0.62
Nodes (7): checkHeadingRhythmDOM(), clusterTop(), edgeAbove(), edgeBelow(), hasOwnTopBoundary(), isVisibleFlow(), overlapsX()

### Community 157 - "Diagnostic Scan"
Cohesion: 0.33
Nodes (6): 1. Accessibility (VoiceOver / TalkBack), 2. Performance, 3. Appearance & Theming, 4. Platform Conformance (CRITICAL), 5. Adaptivity, Diagnostic Scan

### Community 160 - "correctness"
Cohesion: 0.33
Nodes (6): noUnusedImports, noUnusedVariables, useExhaustiveDependencies, fix, level, correctness

### Community 161 - "tsconfig.json"
Cohesion: 0.33
Nodes (5): ./.wxt/tsconfig.json, compilerOptions, allowImportingTsExtensions, jsx, extends

### Community 162 - "Heuristics Scoring Guide"
Cohesion: 0.50
Nodes (4): Heuristics Scoring Guide, Issue Severity (P0–P3), Reference Material, Score Summary

### Community 163 - "detect.mjs"
Cohesion: 0.50
Nodes (3): candidates, detectorPath, __dirname

### Community 164 - "source-lock.mjs"
Cohesion: 0.50
Nodes (7): isLiveServerPidReachable(), clearStaleLock(), readLock(), releaseOwnLock(), sleepSync(), sourceLockPath(), withSourceLockSync()

### Community 165 - "hook.mjs"
Cohesion: 0.39
Nodes (7): allow(), deny(), done(), isStopEvent(), writeAuditLog(), main(), readStdin()

### Community 167 - "source"
Cohesion: 0.50
Nodes (4): source, assist, actions, organizeImports

### Community 169 - "Upwork Tools — High-Level Context"
Cohesion: 0.29
Nodes (6): Explicit boundaries, Goal, Implementation, Persistent local boundary, Stack, Upwork Tools — High-Level Context

### Community 172 - "Impeccable Documenter"
Cohesion: 0.40
Nodes (4): Impeccable Documenter, Input Contract, Output Contract, Workflow

### Community 175 - "normalizeGitHubEvent"
Cohesion: 0.38
Nodes (7): applyPatchText(), envProjectDir(), looksLikeApplyPatch(), normalizeGitHubEvent(), normalizeHookEvent(), parseGitHubToolArgs(), resolveProjectCwd()

## Knowledge Gaps
- **918 isolated node(s):** `here`, `API_BASE`, `API_TIMEOUT_MS`, `localStates`, `PING_KINDS` (+913 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `loadContext()` connect `context-signals.mjs` to `context.mjs`, `runHook`, `live-server.mjs`, `hook-lib.mjs`, `doctor.mjs`, `surface-briefs.mjs`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `enterLiveRoot()` connect `roots.mjs` to `live-wrap.mjs`, `live-server.mjs`, `impeccable-paths.mjs`, `live-inject.mjs`, `live-accept.mjs`, `live-poll.mjs`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `parseDesignMd()` connect `design-parser.mjs` to `doctor.mjs`, `live-server.mjs`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `here`, `API_BASE`, `API_TIMEOUT_MS` to the rest of the system?**
  _918 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `live-browser.js` be split into smaller, more focused modules?**
  _Cohesion score 0.028668464688842273 - nodes in this community are weakly interconnected._
- **Should `checks.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.03224495325836608 - nodes in this community are weakly interconnected._
- **Should `context.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.04730052556139513 - nodes in this community are weakly interconnected._