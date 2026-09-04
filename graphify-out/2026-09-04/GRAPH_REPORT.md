# Graph Report - upwork-tools  (2026-09-04)

## Corpus Check
- 236 files · ~481,698 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4288 nodes · 10079 edges · 177 communities (172 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 123 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `27cac2d5`
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
- PopupComponents.tsx
- design-parser.mjs
- scanCssTextForPulsingDot
- live-wrap.mjs
- AvailableState.tsx
- runHook
- SKILL.md
- background.ts
- impeccable-paths.mjs
- parseRgb
- session-store.mjs
- storage.ts
- parseAnyColor
- event-validation.mjs
- insights.ts
- roots.mjs
- resolveLengthPx
- insert-ui.mjs
- live-manual-edit-evidence.mjs
- Responsive Design
- handleManualEditActivity
- nuxt.mjs
- manual-edit-routes.mjs
- applyEditing
- settings.ts
- popup/App.tsx
- svelte-ast.mjs
- onboard.md
- parseAnyColor
- detect-html.mjs
- portfolio-match.ts
- surface-briefs.mjs
- tracker.ts
- sveltekit-adapter.mjs
- tanstack-adapter.mjs
- watchlist.ts
- The Toolkit
- serve-question.mjs
- accept-css.mjs
- collectBrowserFindings
- live.mjs
- qualification.ts
- live-inject.mjs
- sampleCssBackground
- checkHtmlPatterns
- onAnnotDown
- history.ts
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
- handlePollPost
- discoverTargetCandidates
- restrictions.ts
- createLiveBrowserDomHelpers
- detect-utils.mjs
- live-status.mjs
- background.test-support.ts
- browser-script-parts.mjs
- Impeccable Asset Producer
- content.test.ts
- Optimization Strategy
- template-extensions.mjs
- frameworks/index.mjs
- document.md
- StaticElement
- embed-prompt.mjs
- critique-storage.mjs
- pin.mjs
- bolder.md
- renderGroupedTemplate
- FakeObjectStore
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
- Upwork Tools
- New visual work
- scaffoldSvelteComponentSession
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
- resolveLiveInjectionAnchor
- theme.ts
- formatter
- Extract Flow
- Android platform
- resolveProject
- Persona-Based Design Testing
- Operate mode depth (and Read notes)
- live-setup.md
- svelte-component.mjs
- checkElementGptBorderShadowDOM
- Cognitive Load Assessment
- Impeccable Finish Reviewer
- Impeccable Manual Edit Applier
- Architecture
- checkHeadingRhythmDOM
- Generate Report
- Diagnostic Scan
- isScreenReaderOnlyTextStyle
- [0.2.0] - 2026-09-03
- correctness
- tsconfig.json
- Heuristics Scoring Guide
- detect.mjs
- source-lock.mjs
- hook.mjs
- For Developers & Contributors
- source
- Matchers
- normalizeGitHubEvent
- Capture lifecycle
- Key Features
- Impeccable Documenter
- Storage model
- selectAvailablePendingEvent
- provider.mjs
- Adaptation Strategies

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
10. `normalizeJobId()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `Upwork Tools` --conceptually_related_to--> `Upwork Tools Product Definition`  [INFERRED]
  README.md → PRODUCT.md
- `stats()` --calls--> `aggregateConversionStats()`  [EXTRACTED]
  tests/lib/tracker-conversion.test.ts → src/lib/conversion.ts
- `Repository Guidelines` --references--> `Upwork Tools`  [EXTRACTED]
  AGENTS.md → README.md
- `collect()` --indirect_call--> `extractPlatform()`  [INFERRED]
  .agents/skills/impeccable/scripts/doctor.mjs → .agents/skills/impeccable/scripts/context.mjs
- `collect()` --indirect_call--> `parseDesignMd()`  [INFERRED]
  .agents/skills/impeccable/scripts/doctor.mjs → .agents/skills/impeccable/scripts/lib/design-parser.mjs

## Import Cycles
- 2-file cycle: `src/lib/insights-validation.ts -> src/lib/insights.ts -> src/lib/insights-validation.ts`

## Communities (177 total, 5 thin omitted)

### Community 0 - "live-browser.js"
Cohesion: 0.03
Nodes (130): applyGlobalBarLabelState(), applyParamDefaults(), applyParamValue(), applyPlaceholderSizingStyles(), averageRgb01(), bindEditBadgeProxy(), bufferToBase64(), buildCollapsible() (+122 more)

### Community 1 - "checks.mjs"
Cohesion: 0.03
Nodes (110): ANIMATION_VALUE_KEYWORDS, borderColorsFromStyle(), borderWidthsFromStyle(), checkBorders(), checkClippedOverflow(), checkEdgeFlushCardsDOM(), checkElementBlinkingCursorDOM(), checkElementBorders() (+102 more)

### Community 2 - "context.mjs"
Cohesion: 0.07
Nodes (52): appendAutonomyCounterDirective(), appendBuildPathDirective(), appendDetectorFallback(), appendImageGenDirective(), appendImageToolsDirective(), appendSubagentAuthorizationDirective(), appendSurfaceBriefContext(), automaticHookMode() (+44 more)

### Community 3 - "resumeSession"
Cohesion: 0.07
Nodes (71): abortSvelteComponentInjection(), applyPlaceholderDimensions(), applySavedSessionMeta(), buildInsertPlaceholderSnapshotFromDom(), buildPickedAnchorSnapshot(), captureAndEmit(), checkpointPayload(), clampVariantIndex() (+63 more)

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
Cohesion: 0.08
Nodes (42): activeSessionSummaries(), agentPollingConnected(), annotRoot, args, broadcast(), cleanupSvelteComponentSessionsBeforeExit(), createRequestHandler(), DEBUG_MANUAL_EDIT_EVENTS (+34 more)

### Community 8 - "hook-lib.mjs"
Cohesion: 0.06
Nodes (59): ACK_EXTS, ADVISORY_RULES, applyConfigSource(), applyDetectorConfigSource(), canonicalPathCache, clampByte(), cleanIgnoreValueDisplay(), cloneDefaultConfig() (+51 more)

### Community 9 - "protocol.ts"
Cohesion: 0.07
Nodes (38): ContentWindow, main(), PendingReplay, ReplayTimer, isClientPayProfile(), isConversionStats(), isJobHistoryCapture(), isJobHistoryResponse() (+30 more)

### Community 10 - "database.ts"
Cohesion: 0.09
Nodes (50): persistJobInsights(), ALL_STORES, appendJobSnapshotIfChanged(), clearAllLocalData(), clearHistory(), clearStores(), configureDatabaseSchema(), createStore() (+42 more)

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
Nodes (36): applyStaticDeclaration(), buildBorderOverrideMap(), parseShorthand(), resolveVar(), buildStaticStyleMap(), buildStaticWindow(), collectStaticCssRules(), compareStaticPriority() (+28 more)

### Community 17 - "manual-apply.mjs"
Cohesion: 0.09
Nodes (49): addOpToManualApplyChunk(), APPLY_EVENT_HARD_TIMEOUT_MS, APPLY_EVENT_SOFT_DEADLINE_MS, buildManualApplyAgentAction(), clearManualApplyTransaction(), collectManualApplyFiles(), compactManualApplyBatch(), compactManualApplyCandidates() (+41 more)

### Community 18 - "initPageChat"
Cohesion: 0.08
Nodes (53): armPageChatForTyping(), attachSteerFocusDebug(), attachSteerFocusGuard(), buildSteerProcessingDots(), buildSteerQueueHint(), clearSteerAwaitTimer(), clearSteerFocusRecoverTimer(), collapsePageChat() (+45 more)

### Community 19 - "live-commit-manual-edits.mjs"
Cohesion: 0.10
Nodes (49): allEntryIds(), argVal(), buildRepairBatch(), candidatesForEntry(), changedFilesSinceSnapshot(), clearAppliedEntries(), collectApplyOwnedFiles(), collectRollbackFiles() (+41 more)

### Community 20 - "detect-text.mjs"
Cohesion: 0.06
Nodes (47): blankCssComments(), BLOCK_BRACE_PREFIX_KEYWORDS, CSS_IN_JS_EXTENSIONS, detectText(), extFromFilePath(), extractCSSinJS(), extractStyleBlocks(), findCSSinJSTemplates() (+39 more)

### Community 21 - "impeccable-config.mjs"
Cohesion: 0.10
Nodes (46): applyDetectionConfigSource(), clampByte(), cleanIgnoreValueDisplay(), cloneDetectionConfig(), cloneRawDetectionConfig(), COLOR_CHANNEL_FORMATS, colorIgnoreKey(), DEFAULT_DETECTION_CONFIG (+38 more)

### Community 22 - "detect-antipatterns.mjs"
Cohesion: 0.09
Nodes (42): confirm(), detectCli(), detectLocalFile(), dim(), fileUrlToLocalPath(), formatAdvisorySection(), formatFindings(), formatFindingsBody() (+34 more)

### Community 23 - "scripts"
Cohesion: 0.05
Nodes (41): @biomejs/biome, dependencies, react, react-dom, description, devDependencies, @biomejs/biome, tailwindcss (+33 more)

### Community 24 - "hook-admin.mjs"
Cohesion: 0.12
Nodes (42): ACTIONS, addIgnoreFile(), addIgnoreRule(), addIgnoreValue(), DETECTOR_CONFIG_KEYS, detectorSection(), fileHasImpeccableHookMarker(), HOOK_MANIFEST_TARGETS (+34 more)

### Community 25 - "context-signals.mjs"
Cohesion: 0.20
Nodes (16): extractPlatform(), hasVisualImplementation(), loadContext(), cli(), COMMON_DEV_PORTS, devServerSignals(), gatherSignals(), gitSignals() (+8 more)

### Community 26 - "doctor.mjs"
Cohesion: 0.08
Nodes (58): applyFixes(), cli(), collect(), parseArgs(), readProjectRootPatterns(), rel(), renderText(), safeRead() (+50 more)

### Community 27 - "hook-before-edit.mjs"
Cohesion: 0.10
Nodes (42): allow(), bumpCursorDenial(), cursorBlockMessage(), deny(), detectProposedHtml(), done(), escapeRegExp(), findingSignature() (+34 more)

### Community 28 - "live-copy-edit-agent.mjs"
Cohesion: 0.12
Nodes (42): applyMockWrites(), buildCopyEditBatchPrompt(), checkFrameworkSourceSyntax(), chooseCopyEditAgent(), COMMAND_AUTH_CACHE, commandAuthed(), commandExists(), compactBatchCandidates() (+34 more)

### Community 29 - "initGlobalBar"
Cohesion: 0.09
Nodes (41): agentHasWorkInFlight(), agentStatusText(), barPaletteForTheme(), brandMarkSvg(), buildDesignHeader(), cursorForInsertAxis(), designPanelCss(), detectPageTheme() (+33 more)

### Community 30 - "live-accept.mjs"
Cohesion: 0.12
Nodes (39): acceptCli(), acceptReceiptPath(), argVal(), buildAcceptedWrappedSource(), buildCarbonizeReplacement(), decodeHtmlAttr(), deindentContent(), detectCommentSyntax() (+31 more)

### Community 31 - "live-poll.mjs"
Cohesion: 0.10
Nodes (38): completionAckForAcceptResult(), completionTypeForAcceptResult(), PREVIEW_MODES_WITHOUT_SOURCE_MARKERS, acceptInstructions(), bootInstructions(), deferredWrapperInstructions(), generateInstructions(), insertScaffoldInstructions() (+30 more)

### Community 32 - "PopupComponents.tsx"
Cohesion: 0.10
Nodes (27): EMPTY_POPUP_PERSONALIZATION, externalPortfolioUrl(), HistoryDetails(), PopupPersonalization, PortfolioMatches(), QualificationDetails(), ThemeToggle(), VisitorQualifications() (+19 more)

### Community 33 - "design-parser.mjs"
Cohesion: 0.14
Nodes (37): assessCoverage(), buildColor(), CANONICAL_SECTIONS, collectBullets(), collectColorValues(), collectParagraphs(), detectFormat(), extractColors() (+29 more)

### Community 34 - "scanCssTextForPulsingDot"
Cohesion: 0.10
Nodes (36): buildHtmlPatternCorpora(), checkElementGlow(), checkElementRadialSpotlight(), checkElementRadialSpotlightDOM(), checkGlow(), checkHtmlPatterns(), checkRadialSpotlight(), collectCssCustomProps() (+28 more)

### Community 35 - "live-wrap.mjs"
Cohesion: 0.13
Nodes (38): hasGeneratedHeader(), HEADER_MARKERS, isGeneratedFile(), isGitIgnored(), resolveSourceTraits(), argVal(), buildInsertWrapperLines(), computeInsertLine() (+30 more)

### Community 36 - "AvailableState.tsx"
Cohesion: 0.23
Nodes (21): ApplicantHistoryChart(), AvailableTail(), FitSection(), AvailableState(), EMPTY_POPUP_PERSONALIZATION, ConversionSummary(), HistoryRow(), MetricCell() (+13 more)

### Community 37 - "runHook"
Cohesion: 0.11
Nodes (36): appendDesignSystemNote(), appendDesignSystemNoteOnce(), bumpEditCount(), canonicalPath(), coLocatedStylesheets(), commitFooterShown(), consumeSessionNoticeFlag(), dedupeAgainstCache() (+28 more)

### Community 38 - "SKILL.md"
Cohesion: 0.07
Nodes (28): Assess Adaptation Challenge, Implement & Verify, Recommended Actions, Craft (deprecated alias), Monorepo notes, Opting out of the boot check, Step 1: Run the pass, Step 2: Act by severity (+20 more)

### Community 39 - "background.ts"
Cohesion: 0.18
Nodes (23): advanceTabGeneration(), currentTabJobId(), enqueueTabMutation(), getTabState(), BackgroundHistoryState, createJobHistoryReader(), isJobDetailsPage(), isValidCaptureMetadata() (+15 more)

### Community 40 - "impeccable-paths.mjs"
Cohesion: 0.15
Nodes (23): CRITIQUE_DIR, firstExisting(), getDesignSidecarCandidates(), getDesignSidecarPath(), getImpeccableDir(), getLegacyLiveConfigPath(), getLegacyLiveServerPath(), getLiveAnnotationsDir() (+15 more)

### Community 41 - "parseRgb"
Cohesion: 0.13
Nodes (32): checkColors(), checkElementAIPaletteDOM(), checkElementColors(), checkElementColorsDOM(), checkElementGlowDOM(), checkElementHoverContrast(), checkElementIconTile(), checkElementIconTileDOM() (+24 more)

### Community 42 - "session-store.mjs"
Cohesion: 0.18
Nodes (20): getLegacyLiveSessionsDir(), getLiveSessionsDir(), safeSessionId(), applyEvent(), baseSnapshot(), COMPLETED_PHASES, createLiveSessionStore(), getReadableJournalPath() (+12 more)

### Community 43 - "storage.ts"
Cohesion: 0.05
Nodes (32): BackgroundHistoryDependencies, OptionsContent(), OptionsContentProps, PortfolioDraft, Status, JobInsights, PageEvent, CLEARABLE_STORAGE_SCOPES (+24 more)

### Community 44 - "parseAnyColor"
Cohesion: 0.09
Nodes (53): checkColors(), checkElementAIPaletteDOM(), checkElementColors(), checkElementColorsDOM(), checkElementGlowDOM(), checkElementHoverContrast(), checkElementIconTile(), checkElementIconTileDOM() (+45 more)

### Community 45 - "event-validation.mjs"
Cohesion: 0.12
Nodes (26): AGENT_PHASE_SET, FORBIDDEN_MANUAL_EDIT_TEXT_CHARS, INSERT_POSITIONS, isValidId(), isValidMountVariant(), isValidVariantId(), MOUNT_ERROR_MAX_LENGTH, MOUNT_URL_MAX_LENGTH (+18 more)

### Community 46 - "insights.ts"
Cohesion: 0.11
Nodes (30): deriveHiringWarnings(), hasHistoryAfterIdentityFilter(), HiringApplicationState, HiringHistoryEntry, HiringWarningLabel, HiringWarnings, HiringWarningsInput, validCount() (+22 more)

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
Cohesion: 0.15
Nodes (26): analyzeSourceHint(), buildCandidatesForOp(), buildContextHintsByRef(), buildManualEditEvidence(), collectSearchFiles(), countOps(), decodeBasicHtml(), escapeRegExp() (+18 more)

### Community 51 - "Responsive Design"
Cohesion: 0.08
Nodes (25): Assess Adaptation Challenge, Breakpoints: Content-Driven, Content Adaptation, Desktop Adaptation (Mobile → Desktop), Detect Input Method, Not Just Screen Size, Email Adaptation (Web → Email), Implement Adaptations, Layout Adaptation Patterns (+17 more)

### Community 52 - "handleManualEditActivity"
Cohesion: 0.18
Nodes (26): clearStoredManualApplyState(), fetchPendingCount(), handleManualEditActivity(), hidePendingApplyDock(), manualApplyLoadingText(), manualApplyStateKey(), manualEditEventForCurrentPage(), numberOrNull() (+18 more)

### Community 53 - "nuxt.mjs"
Cohesion: 0.27
Nodes (8): applyNuxtLiveAdapter(), buildNuxtPlugin(), detectNuxtProject(), nuxt, NUXT_PLUGIN_MARKER, NUXT_PLUGIN_NAME, removeNuxtLiveAdapter(), buildLiveScriptSrc()

### Community 54 - "manual-edit-routes.mjs"
Cohesion: 0.18
Nodes (21): args, buffer, cwd, pageUrlFilter, remaining, compactManualLogText(), summarizeManualApplyFailures(), summarizeManualDiagnostics() (+13 more)

### Community 55 - "applyEditing"
Cohesion: 0.07
Nodes (41): addManualContextText(), applyEditing(), buildLocatorForLeaf(), canRestoreManualEditElement(), collectEditableTextRows(), visit(), collectManualContextPieces(), walk() (+33 more)

### Community 56 - "settings.ts"
Cohesion: 0.13
Nodes (28): enqueueThemeOperation(), ExtensionApi, getPortfolio(), getStorageArea(), getUiSettings(), getUserProfile(), initializeTheme(), isRecord() (+20 more)

### Community 57 - "popup/App.tsx"
Cohesion: 0.14
Nodes (20): App(), EMPTY_PERSONALIZATION, mergePopupReadResult(), normalizedJobId(), PopupReadDependencies, readPopupInsights(), readWatchlistStatus(), readyWithWatchlist() (+12 more)

### Community 58 - "svelte-ast.mjs"
Cohesion: 0.21
Nodes (20): Analysis, analyzeAttributes(), analyzeFragment(), analyzeNode(), analyzeSvelteMarkup(), applyReplacements(), classifyEachKey(), classifyRoots() (+12 more)

### Community 59 - "onboard.md"
Cohesion: 0.09
Nodes (22): Assess Onboarding Needs, Context Over Ceremony, Contextual Help, Design Onboarding Experiences, Documentation & Help, Empty State Design, Feature Discovery & Adoption, Guided Tours & Walkthroughs (+14 more)

### Community 60 - "parseAnyColor"
Cohesion: 0.11
Nodes (25): checkCreamPalette(), checkTextOcclusionDOM(), clamp01(), colorFunctionToRgb(), creamFromClassList(), decodeSrgbChannel(), elementDirectText(), encodeSrgbChannel() (+17 more)

### Community 61 - "detect-html.mjs"
Cohesion: 0.09
Nodes (33): detectUrl(), launchBrowser(), measureContentHiddenAfterReveal(), runVisualContrastFallback(), serializeDesignSystemForBrowser(), runRegexMatchers(), runTextContentAnalyzers(), collectStaticCssText() (+25 more)

### Community 62 - "portfolio-match.ts"
Cohesion: 0.14
Nodes (17): readPopupPersonalization(), canonical(), matchPortfolio, overlap(), PortfolioMatchJob, rankPortfolioMatches(), STOP_WORDS, tokens() (+9 more)

### Community 63 - "surface-briefs.mjs"
Cohesion: 0.35
Nodes (11): getSurfaceBriefDir(), listSurfaceBriefs(), normalizeRouteTarget(), normalizeSurfaceTarget(), parseSurfaceBrief(), resolveSurfaceBrief(), SURFACE_BRIEF_VERSION, surfaceBriefPathForTarget() (+3 more)

### Community 64 - "tracker.ts"
Cohesion: 0.14
Nodes (20): aggregateConversionStats(), ConversionStats, ApplicationState, ApplicationRecord, APPLICATION_STATES, copyRecord(), createApplicationRecord(), isApplicationState() (+12 more)

### Community 65 - "sveltekit-adapter.mjs"
Cohesion: 0.17
Nodes (21): sveltekit, applySvelteKitLiveAdapter(), buildSvelteLiveRootComponent(), defaultSvelteLayout(), detectSvelteKitProject(), ensureSvelteLiveRootComponent(), escapeRegExp(), fileIncludes() (+13 more)

### Community 66 - "tanstack-adapter.mjs"
Cohesion: 0.16
Nodes (20): tanstackStart, applyTanStackLiveAdapter(), buildTanStackLiveRootComponent(), detectTanStackStartProject(), escapeRegExp(), findRootRouteFile(), insertAfterLastImport(), isManagedComponent() (+12 more)

### Community 67 - "watchlist.ts"
Cohesion: 0.16
Nodes (24): isHistoryEntry(), isJobInsights(), isNullableBooleanValue(), isNullableNumberValue(), isNullableStringValue(), isQualificationDetail(), isSimilarJob(), record() (+16 more)

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
Cohesion: 0.15
Nodes (19): parseCliOptions(), resolveProjectRoot(), resolveTargetSelection(), getLegacyLiveAnnotationsDir(), parseTargetOptions(), parseTargetPath(), TargetArgError, __dirname (+11 more)

### Community 73 - "qualification.ts"
Cohesion: 0.19
Nodes (19): deriveQualificationSummary, detailFrom(), firstText(), isAny(), isDefaultLabel(), isDefaultZeroRequirement(), isJssRequirement(), isMeaninglessClientRequirement() (+11 more)

### Community 74 - "live-inject.mjs"
Cohesion: 0.14
Nodes (27): describeInjectArtifacts(), frameworkIgnorePatterns(), PATCH_UNDOERS, resolveFramework(), clearInjectJournal(), healArtifact(), healInjectJournal(), INJECT_JOURNAL_RELPATH (+19 more)

### Community 75 - "sampleCssBackground"
Cohesion: 0.16
Nodes (18): analyzeVisualContrastCandidate(), blendRgba(), clampByte(), firstCssUrl(), getLayerValue(), loadVisualContrastImage(), parseObjectPosition(), parsePositionPair() (+10 more)

### Community 76 - "checkHtmlPatterns"
Cohesion: 0.12
Nodes (29): buildHtmlPatternCorpora(), checkElementGlow(), checkGlow(), checkHtmlPatterns(), collectCssCustomProps(), collectMarqueeKeyframes(), collectPulseKeyframes(), cssLengthToPx() (+21 more)

### Community 77 - "onAnnotDown"
Cohesion: 0.20
Nodes (17): beginEditPin(), buildAnnotationsForCapture(), buildPinElement(), cancelEditingPin(), clampPlaceholderSize(), finalizeEditingPin(), initAnnotOverlay(), localCoords() (+9 more)

### Community 78 - "history.ts"
Cohesion: 0.16
Nodes (15): compareSnapshots(), getJobSnapshotSummary, JobSnapshotSummary, listValidJobSnapshots, queryJobSnapshots(), summarizeJobSnapshots(), validJobId(), validSnapshot() (+7 more)

### Community 79 - "tag-strategy.mjs"
Cohesion: 0.21
Nodes (16): appendOriginToDirective(), buildTagBlock(), commentClose(), commentOpen(), detectLineEnding(), findCspMetaTags(), getAttr(), insertTag() (+8 more)

### Community 80 - "generate-image.mjs"
Cohesion: 0.17
Nodes (13): crc32(), hash32(), hslToRgb(), out, palette(), pngChunk(), pngFake(), promptFile (+5 more)

### Community 81 - "Repository Guidelines"
Cohesion: 0.17
Nodes (11): Architecture & Data Flow, Code Conventions & Common Patterns, Development Commands, graphify, Important Files, Key Directories, Maintaining this file, Project Overview (+3 more)

### Community 82 - "createLiveBrowserSessionState"
Cohesion: 0.20
Nodes (14): createLiveBrowserSessionState(), clearHandled(), clearScrollY(), clearSession(), isHandled(), loadSession(), markHandled(), nextCheckpointRevision() (+6 more)

### Community 83 - "animate.md"
Cohesion: 0.12
Nodes (14): Accessibility and control, Choose material by meaning, Find the job, Implement to the runtime, Set the motion thesis, Timing and easing, Verify, Visitor mode (+6 more)

### Community 85 - "live.md"
Cohesion: 0.08
Nodes (22): Apply at system scale, Audit before choosing, Choose a strategy, Contrast and perception, Live-mode signature params, Verify, Visitor mode, Cleanup (+14 more)

### Community 86 - "Handle `generate`"
Cohesion: 0.12
Nodes (16): 1. Read the screenshot (if present), 2. Wrap the element, 3. Load the action's reference, 4. Plan three variants: identity first, then mode, then axes, 5. Apply the freeform prompt (if present), 6. Deliver variants, 7. Parameters (composition-sized, 0-4 per variant), 8. Signal done (+8 more)

### Community 87 - "interceptor.ts"
Cohesion: 0.17
Nodes (18): main(), defendInspectionHook(), emitInsights(), inspectPayload(), installFetchAndResponseHooks(), installInterceptors(), installReplayListener(), installXhrHooks() (+10 more)

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

### Community 94 - "handlePollPost"
Cohesion: 0.23
Nodes (16): acknowledgePendingEvent(), broadcastAgentPollingIfChanged(), cancelQueuedAnonymousExitEvents(), findAvailablePendingEvent(), findOpenPort(), findPendingEventById(), flushPendingPolls(), handlePollGet() (+8 more)

### Community 95 - "discoverTargetCandidates"
Cohesion: 0.15
Nodes (20): directChildDirs(), discoverRootsForPattern(), discoverTargetCandidates(), escapeRegExp(), expandSimplePattern(), extractSectionValue(), findTargetExample(), hasFallbackWorkspaceChildren() (+12 more)

### Community 96 - "restrictions.ts"
Cohesion: 0.44
Nodes (9): earningsLabel(), firstString(), labels(), meaningfulString(), parseRestrictions, positiveNumber(), record(), RecordValue (+1 more)

### Community 97 - "createLiveBrowserDomHelpers"
Cohesion: 0.19
Nodes (10): createLiveBrowserDomHelpers(), cssId(), liveUiRoot(), makeFrozenAnchor(), own(), pickable(), rectIsUsableAnchor(), uiAppend() (+2 more)

### Community 98 - "detect-utils.mjs"
Cohesion: 0.37
Nodes (10): detectAstroProject(), fileExists(), findConfigFile(), firstExistingFile(), hasAnyDependency(), literalConfigFiles(), readPackageDeps(), detectNextProject() (+2 more)

### Community 99 - "live-status.mjs"
Cohesion: 0.30
Nodes (13): collectManualApplyFiles(), manualApplyReplyCommand(), manualApplyResumeHint(), mountFailureAction(), parseArgs(), renderSummary(), resumeCli(), summarizeManualApplyEvent() (+5 more)

### Community 100 - "background.test-support.ts"
Cohesion: 0.13
Nodes (22): GET_JOB_HISTORY, GET_JOB_INSIGHTS, badgeBackgroundCalls, badgeTextCalls, deferred, fakeBrowser, insights, pendingStorageOperations (+14 more)

### Community 101 - "browser-script-parts.mjs"
Cohesion: 0.19
Nodes (10): assembleLiveBrowserScript(), assertLiveBrowserScriptParts(), LIVE_BROWSER_SCRIPT_PARTS, readLiveBrowserScriptParts(), resolveLiveBrowserScriptParts(), loadBrowserScripts(), LIVE_CHROME_MOUNT_CONTRACT, LIVE_UI_COMPONENT_IDS (+2 more)

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
Cohesion: 0.18
Nodes (14): IMPECCABLE_DIR, extensionCache, LIVE_TEMPLATE_EXTENSIONS, matchesTemplateExtension(), mergeExtensions(), normalizeExtensionEntries(), readLiveTemplateExtensions(), resolveLiveTemplateExtensions() (+6 more)

### Community 106 - "frameworks/index.mjs"
Cohesion: 0.15
Nodes (12): astro, COMMENT_SYNTAXES, FRAMEWORKS, INJECT_KINDS, PREVIEW_MODES, SOURCE_TRAIT_DEFAULTS, STYLE_MODES, TAG_PATCH_KIND (+4 more)

### Community 107 - "document.md"
Cohesion: 0.08
Nodes (23): Component translation rules, Narrative mapping, Pitfalls, Scan mode (approach C: auto-extract, then confirm descriptive language), Schema, Seed mode, Step 1: Find the design assets, Step 1: Route through new-work's workshop (+15 more)

### Community 109 - "embed-prompt.mjs"
Cohesion: 0.19
Nodes (11): args, buf, crc32(), crcTable, file, pngChunk(), promptOf(), readJpegCom() (+3 more)

### Community 110 - "critique-storage.mjs"
Cohesion: 0.27
Nodes (13): coerceSlug(), listSnapshots(), main(), nowFilenameStamp(), parseFrontmatter(), readLatestSnapshot(), readLatestSnapshotMatching(), readTrend() (+5 more)

### Community 111 - "pin.mjs"
Cohesion: 0.22
Nodes (11): CODEX_HARNESSES, commandPrefixForSkillsDir(), __dirname, findHarnessDirs(), generatePinnedSkill(), HARNESS_DIRS, loadCommandMetadata(), pin() (+3 more)

### Community 112 - "bolder.md"
Cohesion: 0.33
Nodes (5): Before you finish, Scope is sovereign, The amplification, The skeleton test, Why it reads flat

### Community 113 - "renderGroupedTemplate"
Cohesion: 0.42
Nodes (9): clampGroupedToBudget(), clampLastLine(), clampToBudget(), directiveFooter(), footerFallbacks(), formatDedupedFindingLine(), isFindingLine(), renderGroupedTemplate() (+1 more)

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

### Community 126 - "Upwork Tools"
Cohesion: 0.18
Nodes (11): Upwork Tools Product Definition, Contributing, Development & Testing, How It Works, License, Privacy & Security First, Project Directory Structure, Roadmap (+3 more)

### Community 127 - "New visual work"
Cohesion: 0.18
Nodes (11): 1. Decide what is already true, 2. Ask what will change the work, 3. Choose the right amount of invention, 4. Commit the world, 5. Record the decision, 6. Build with full commitment, 7. Inspect and finish, Create a whole surface inside an established world (+3 more)

### Community 128 - "scaffoldSvelteComponentSession"
Cohesion: 0.29
Nodes (8): buildPropsScriptV2(), buildVariantStubV2(), componentSessionDir(), ensureRuntimeHelper(), manifestPathForSession(), safeReadSource(), scaffoldSvelteComponentInsertSession(), scaffoldSvelteComponentSession()

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

### Community 139 - "resolveLiveInjectionAnchor"
Cohesion: 0.16
Nodes (19): buildSvelteExpressionTextMap(), buildSveltePropValuesFromLiveElement(), buildSveltePropValuesV2(), cloneWithoutElements(), collectTextNodes(), collectVisibleTexts(), cssEscapeIdent(), elementMatchesOriginalMarkup() (+11 more)

### Community 140 - "theme.ts"
Cohesion: 0.46
Nodes (6): getLegacyTheme(), applyThemeClass(), getStoredTheme(), resolveIsDark(), setStoredTheme(), useTheme()

### Community 141 - "formatter"
Cohesion: 0.22
Nodes (9): formatter, attributePosition, bracketSpacing, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding (+1 more)

### Community 143 - "Extract Flow"
Cohesion: 0.25
Nodes (7): Extract Flow, Step 1: Discover the Design System, Step 2: Identify Patterns, Step 3: Plan Extraction, Step 4: Extract & Enrich, Step 5: Migrate, Step 6: Document

### Community 144 - "Android platform"
Cohesion: 0.25
Nodes (8): Android platform, Color & theming, Components & motion, Layout & structure, The Android slop test, Touch targets, Typography, Verifying the build

### Community 145 - "resolveProject"
Cohesion: 0.14
Nodes (18): contextSourcePath(), contextSourceStatus(), findMonorepoRoot(), firstExisting(), hasGitBoundary(), isCandidateProjectRoot(), isPathInside(), isPathInsideOrEqual() (+10 more)

### Community 146 - "Persona-Based Design Testing"
Cohesion: 0.25
Nodes (8): 1. Impatient Power User: "Alex", 2. Confused First-Timer: "Jordan", 3. Accessibility-Dependent User: "Sam", 4. Deliberate Stress Tester: "Riley", 5. Distracted Mobile User: "Casey", Persona-Based Design Testing, Project-Specific Personas, Selecting Personas

### Community 147 - "Operate mode depth (and Read notes)"
Cohesion: 0.10
Nodes (18): Craft floor, Refuse, Verify, Constraints, Failure modes, Flow, $impeccable hooks, Routing (+10 more)

### Community 148 - "live-setup.md"
Cohesion: 0.25
Nodes (7): append-arrays, append-string, Config drift, Consent prompt (use this phrasing), CSP detection (first-time only), Troubleshooting, Write the config

### Community 149 - "svelte-component.mjs"
Cohesion: 0.07
Nodes (51): collectUnusedSelectors(), FORBIDDEN, verifyAcceptedFile(), verifyAcceptedSource(), applyLegacyDeferredAcceptsOnStartup(), loadSvelteCompiler(), appendCssToSvelteStyle(), appendSanitizedCssRule() (+43 more)

### Community 150 - "checkElementGptBorderShadowDOM"
Cohesion: 0.38
Nodes (7): borderColorsFromStyle(), borderWidthsFromStyle(), checkElementGptBorderShadow(), checkElementGptBorderShadowDOM(), checkGptThinBorderWideShadow(), shadowLayerAlpha(), shadowMaxBlurPx()

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
Cohesion: 0.22
Nodes (7): Architecture, Extension contexts, Failure and security boundaries, Options flow, Popup read flow, Runtime topology, Verification map

### Community 155 - "checkHeadingRhythmDOM"
Cohesion: 0.20
Nodes (15): checkHeadingRhythmDOM(), clusterTop(), edgeAbove(), edgeBelow(), hasOwnTopBoundary(), insideSmallCard(), isVisibleFlow(), overlapsX() (+7 more)

### Community 156 - "Generate Report"
Cohesion: 0.29
Nodes (7): Audit Health Score, Detailed Findings by Severity, Executive Summary, Generate Report, Patterns & Systemic Issues, Platform Conformance Verdict, Positive Findings

### Community 157 - "Diagnostic Scan"
Cohesion: 0.33
Nodes (6): 1. Accessibility (VoiceOver / TalkBack), 2. Performance, 3. Appearance & Theming, 4. Platform Conformance (CRITICAL), 5. Adaptivity, Diagnostic Scan

### Community 158 - "isScreenReaderOnlyTextStyle"
Cohesion: 0.47
Nodes (6): clippedByInset(), clippedByRect(), expandBoxShorthand(), firstMetricLengthPx(), isScreenReaderOnlyTextStyle(), metricLengthPx()

### Community 159 - "[0.2.0] - 2026-09-03"
Cohesion: 0.33
Nodes (5): [0.2.0] - 2026-09-03, Architecture, Changelog, Features, Highlights

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
Cohesion: 0.83
Nodes (3): isStopEvent(), main(), readStdin()

### Community 166 - "For Developers & Contributors"
Cohesion: 0.33
Nodes (6): For Developers & Contributors, For Freelancers & Users (Load Unpacked), Installation & Quick Start, Prerequisites, Production Builds, Setup & Development

### Community 167 - "source"
Cohesion: 0.50
Nodes (4): source, assist, actions, organizeImports

### Community 169 - "normalizeGitHubEvent"
Cohesion: 0.47
Nodes (6): applyPatchText(), envProjectDir(), looksLikeApplyPatch(), normalizeGitHubEvent(), normalizeHookEvent(), parseGitHubToolArgs()

### Community 170 - "Capture lifecycle"
Cohesion: 0.40
Nodes (5): 1. Observe an existing response, 2. Normalize the payload, 3. Cross the page boundary, 4. Persist and isolate by tab, Capture lifecycle

### Community 171 - "Key Features"
Cohesion: 0.40
Nodes (5): 1. 🎯 Competition Intelligence, 2. 🔍 Client Quality & Payment Reality, 3. ⚖️ Your Fit & Qualification Audit, 4. ⚡ Local Power-User Workflow, Key Features

### Community 172 - "Impeccable Documenter"
Cohesion: 0.40
Nodes (4): Impeccable Documenter, Input Contract, Output Contract, Workflow

### Community 173 - "Storage model"
Cohesion: 0.50
Nodes (4): IndexedDB, Local settings, Session storage, Storage model

### Community 175 - "provider.mjs"
Cohesion: 0.50
Nodes (3): IMPECCABLE_COMMAND, IMPECCABLE_COMMAND_PREFIX, IMPECCABLE_PROVIDER_ID

### Community 176 - "Adaptation Strategies"
Cohesion: 0.40
Nodes (5): Adaptation Strategies, Orientation & foldables, Phone → Tablet (iPad / large screens), Platform → platform (iOS ↔ Android), Web → native (porting a website or web app)

## Knowledge Gaps
- **885 isolated node(s):** `here`, `API_BASE`, `API_TIMEOUT_MS`, `localStates`, `PING_KINDS` (+880 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `loadContext()` connect `context-signals.mjs` to `context.mjs`, `live-server.mjs`, `hook-lib.mjs`, `resolveProject`, `doctor.mjs`, `hook-before-edit.mjs`, `surface-briefs.mjs`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `enterLiveRoot()` connect `roots.mjs` to `live-wrap.mjs`, `live-status.mjs`, `live-server.mjs`, `impeccable-paths.mjs`, `live-inject.mjs`, `live-accept.mjs`, `live-poll.mjs`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `here`, `API_BASE`, `API_TIMEOUT_MS` to the rest of the system?**
  _885 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `live-browser.js` be split into smaller, more focused modules?**
  _Cohesion score 0.030534351145038167 - nodes in this community are weakly interconnected._
- **Should `checks.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.0347661188369153 - nodes in this community are weakly interconnected._
- **Should `context.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06848357791754019 - nodes in this community are weakly interconnected._
- **Should `resumeSession` be split into smaller, more focused modules?**
  _Cohesion score 0.06690140845070422 - nodes in this community are weakly interconnected._