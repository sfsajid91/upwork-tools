# Graph Report - upwork-tools  (2026-08-26)

## Corpus Check
- 222 files · ~434,476 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4160 nodes · 9672 edges · 172 communities (163 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 119 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `159282f2`
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
- svelte-component.mjs
- InsightsView.tsx
- concept-seed.mjs
- setLiveState
- database.ts
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
- initGlobalBar
- doctor.mjs
- hook-before-edit.mjs
- live-copy-edit-agent.mjs
- checkHtmlPatterns
- live-accept.mjs
- live-poll.mjs
- detect-html.mjs
- design-parser.mjs
- scanCssTextForPulsingDot
- live-wrap.mjs
- background.ts
- runHook
- new-work.md
- applyEditing
- impeccable-paths.mjs
- parseRgb
- context-signals.mjs
- qualification.ts
- parseAnyColor
- event-validation.mjs
- insights.ts
- roots.mjs
- resolveLengthPx
- insert-ui.mjs
- live-manual-edit-evidence.mjs
- Responsive Design
- handleManualEditActivity
- scaffoldSvelteComponentSession
- manual-edits-buffer.mjs
- JobInsights
- storage.ts
- live-inject.mjs
- svelte-ast.mjs
- onboard.md
- parseAnyColor
- detect-url.mjs
- session-store.mjs
- history.ts
- settings.ts
- sveltekit-adapter.mjs
- tanstack-adapter.mjs
- Operate mode depth (and Read notes)
- The Toolkit
- serve-question.mjs
- staleness-deep.mjs
- collectBrowserFindings
- live.mjs
- renderGroupedTemplate
- watchlist.ts
- sampleCssBackground
- background.test.ts
- onAnnotDown
- FakeObjectStore
- tag-strategy.mjs
- generate-image.mjs
- surface-briefs.mjs
- createLiveBrowserSessionState
- animate.md
- manual-edit-routes.mjs
- live.md
- Handle `generate`
- applicant-metrics.ts
- checkQuality
- pay-profile.ts
- checkHeadingRhythmDOM
- Generate Report
- interceptor.ts
- mountSvelteComponentVariant
- skills.ts
- provider.mjs
- resolveLiveInjectionAnchor
- createLiveBrowserDomHelpers
- detect-utils.mjs
- journal.mjs
- live-status.mjs
- FakeObjectStore
- Impeccable Asset Producer
- checkElementGptBorderShadowDOM
- Optimization Strategy
- template-extensions.mjs
- frameworks/index.mjs
- Scan mode (approach C: auto-extract, then confirm descriptive language)
- StaticElement
- embed-prompt.mjs
- browser-script-parts.mjs
- pin.mjs
- hiring-warnings.ts
- restrictions.ts
- Theme Handling
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
- document.md
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
- Upwork Tools Product Definition
- Shape
- FakeDatabase
- instructions.mjs
- formatter
- adapt.native.md
- Project Context
- Android platform
- colorize.md
- Persona-Based Design Testing
- Extract Flow
- live-setup.md
- checkElementBorders
- Generate Report
- Cognitive Load Assessment
- Impeccable Finish Reviewer
- Impeccable Manual Edit Applier
- nuxt.mjs
- checkHeadingRhythmDOM
- filterFindings
- Diagnostic Scan
- bolder.md
- correctness
- tsconfig.json
- Heuristics Scoring Guide
- detect.mjs
- source-lock.mjs
- hook.mjs
- content.test.ts
- source
- Matchers
- protocol.ts
- routing.md
- isScreenReaderOnlyTextStyle
- Main-world Interceptor

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
- `clearLocalData()` --calls--> `clearAllLocalData()`  [EXTRACTED]
  entrypoints/options/App.tsx → lib/database.ts
- `persistJobInsights()` --calls--> `normalizeJobId()`  [EXTRACTED]
  entrypoints/background.ts → lib/job-page.ts
- `persistJobInsights()` --calls--> `createApplicationRecord()`  [EXTRACTED]
  entrypoints/background.ts → lib/tracker.ts
- `persistJobInsights()` --calls--> `transitionApplicationRecord()`  [EXTRACTED]
  entrypoints/background.ts → lib/tracker.ts
- `readVerifiedSession()` --calls--> `isJobInsights()`  [EXTRACTED]
  entrypoints/background.ts → lib/insights.ts

## Import Cycles
- None detected.

## Communities (172 total, 9 thin omitted)

### Community 0 - "live-browser.js"
Cohesion: 0.03
Nodes (133): acceptedDomAlreadyClean(), applyGlobalBarLabelState(), applyPlaceholderSizingStyles(), averageRgb01(), bindEditBadgeProxy(), bufferToBase64(), buildCollapsible(), buildColorModels() (+125 more)

### Community 1 - "checks.mjs"
Cohesion: 0.03
Nodes (117): ANIMATION_VALUE_KEYWORDS, borderColorsFromStyle(), borderWidthsFromStyle(), checkClippedOverflow(), checkEdgeFlushCardsDOM(), checkElementBlinkingCursorDOM(), checkElementClippedOverflow(), checkElementClippedOverflowDOM() (+109 more)

### Community 2 - "context.mjs"
Cohesion: 0.05
Nodes (93): appendAutonomyCounterDirective(), appendBuildPathDirective(), appendDetectorFallback(), appendImageGenDirective(), appendImageToolsDirective(), appendSubagentAuthorizationDirective(), appendSurfaceBriefContext(), automaticHookMode() (+85 more)

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
Nodes (61): eventPriority(), selectAvailablePendingEvent(), acknowledgePendingEvent(), activeSessionSummaries(), agentPollingConnected(), annotRoot, args, broadcast() (+53 more)

### Community 8 - "hook-lib.mjs"
Cohesion: 0.05
Nodes (61): ACK_EXTS, ADVISORY_RULES, ALLOWED_EXTS, applyConfigSource(), applyDetectorConfigSource(), applyPatchText(), canonicalPath(), canonicalPathCache (+53 more)

### Community 9 - "svelte-component.mjs"
Cohesion: 0.08
Nodes (59): bakeParamValues(), collectAllSelectors(), collectSelectorsFromNodes(), collectUnusedSelectors(), escapeRegExp(), formatBody(), isToggleOn(), normalizeSelector() (+51 more)

### Community 10 - "InsightsView.tsx"
Cohesion: 0.09
Nodes (17): AvailableState(), EmptyState(), HistoryRow(), LoadingState(), ThemeToggle(), WARNING_COPY, WatchlistStatus, formatApplicationState() (+9 more)

### Community 11 - "concept-seed.mjs"
Cohesion: 0.07
Nodes (53): API_BASE, API_TIMEOUT_MS, apiBudgetMs(), dealCompositions(), driveSelection(), fetchRoll(), here, loadLocal() (+45 more)

### Community 12 - "setLiveState"
Cohesion: 0.11
Nodes (56): abandonForeignSession(), cancelEditing(), cancelEditingToPicking(), cancelInsertConfigure(), cleanup(), cleanupAcceptedSession(), clearAnnotations(), clearInsertPicking() (+48 more)

### Community 13 - "database.ts"
Cohesion: 0.08
Nodes (46): persistJobInsights(), ALL_STORES, appendJobSnapshotIfChanged(), clearAllLocalData(), clearHistory(), clearStores(), configureDatabaseSchema(), createStore() (+38 more)

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
Cohesion: 0.09
Nodes (48): armPageChatForTyping(), attachSteerFocusDebug(), attachSteerFocusGuard(), buildSteerProcessingDots(), buildSteerQueueHint(), clearSteerAwaitTimer(), clearSteerFocusRecoverTimer(), collapsePageChat() (+40 more)

### Community 19 - "live-commit-manual-edits.mjs"
Cohesion: 0.10
Nodes (49): allEntryIds(), argVal(), buildRepairBatch(), candidatesForEntry(), changedFilesSinceSnapshot(), collectApplyOwnedFiles(), collectRollbackFiles(), commitManualEdits() (+41 more)

### Community 20 - "detect-text.mjs"
Cohesion: 0.07
Nodes (40): blankCssComments(), BLOCK_BRACE_PREFIX_KEYWORDS, CSS_IN_JS_EXTENSIONS, detectText(), extFromFilePath(), extractCSSinJS(), extractStyleBlocks(), findCSSinJSTemplates() (+32 more)

### Community 21 - "impeccable-config.mjs"
Cohesion: 0.10
Nodes (45): applyDetectionConfigSource(), clampByte(), cleanIgnoreValueDisplay(), cloneDetectionConfig(), cloneRawDetectionConfig(), COLOR_CHANNEL_FORMATS, colorIgnoreKey(), DEFAULT_DETECTION_CONFIG (+37 more)

### Community 22 - "detect-antipatterns.mjs"
Cohesion: 0.10
Nodes (38): confirm(), detectCli(), detectLocalFile(), dim(), fileUrlToLocalPath(), formatAdvisorySection(), formatFindings(), formatFindingsBody() (+30 more)

### Community 23 - "scripts"
Cohesion: 0.04
Nodes (44): @biomejs/biome, dependencies, react, react-dom, description, devDependencies, @biomejs/biome, tailwindcss (+36 more)

### Community 24 - "hook-admin.mjs"
Cohesion: 0.12
Nodes (42): ACTIONS, addIgnoreFile(), addIgnoreRule(), addIgnoreValue(), DETECTOR_CONFIG_KEYS, detectorSection(), fileHasImpeccableHookMarker(), HOOK_MANIFEST_TARGETS (+34 more)

### Community 25 - "initGlobalBar"
Cohesion: 0.08
Nodes (42): agentHasWorkInFlight(), agentStatusText(), barPaletteForTheme(), brandMarkSvg(), buildDesignHeader(), cursorForInsertAxis(), designPanelCss(), detectPageTheme() (+34 more)

### Community 26 - "doctor.mjs"
Cohesion: 0.11
Nodes (38): applyFixes(), cli(), collect(), parseArgs(), readProjectRootPatterns(), rel(), renderText(), safeRead() (+30 more)

### Community 27 - "hook-before-edit.mjs"
Cohesion: 0.11
Nodes (42): bumpCursorDenial(), cursorBlockMessage(), detectProposedHtml(), escapeRegExp(), findingSignature(), firstMatch(), firstString(), hasFragmentEditContent() (+34 more)

### Community 28 - "live-copy-edit-agent.mjs"
Cohesion: 0.12
Nodes (42): applyMockWrites(), buildCopyEditBatchPrompt(), checkFrameworkSourceSyntax(), chooseCopyEditAgent(), COMMAND_AUTH_CACHE, commandAuthed(), commandExists(), compactBatchCandidates() (+34 more)

### Community 29 - "checkHtmlPatterns"
Cohesion: 0.13
Nodes (27): buildHtmlPatternCorpora(), checkHtmlPatterns(), collectCssCustomProps(), collectMarqueeKeyframes(), collectPulseKeyframes(), cssLengthToPx(), cssTextHasDarkRootBg(), enclosingCssSelector() (+19 more)

### Community 30 - "live-accept.mjs"
Cohesion: 0.12
Nodes (37): safeSessionId(), acceptCli(), acceptReceiptPath(), argVal(), buildAcceptedWrappedSource(), buildCarbonizeReplacement(), decodeHtmlAttr(), deindentContent() (+29 more)

### Community 31 - "live-poll.mjs"
Cohesion: 0.14
Nodes (29): completionAckForAcceptResult(), completionTypeForAcceptResult(), PREVIEW_MODES_WITHOUT_SOURCE_MARKERS, augmentEventWithAcceptHandling(), buildAcceptScriptArgs(), buildPollReplyPayload(), completeAcceptHandling(), DEFAULT_EVENT_LEASE_MS (+21 more)

### Community 32 - "detect-html.mjs"
Cohesion: 0.09
Nodes (27): runTextContentAnalyzers(), collectStaticCssText(), checkStaticPageTypography(), detectHtml(), STATIC_ELEMENT_RULES, checkCreamPalette(), checkPageQualityDOM(), checkPageQualityFromDoc() (+19 more)

### Community 33 - "design-parser.mjs"
Cohesion: 0.14
Nodes (37): assessCoverage(), buildColor(), CANONICAL_SECTIONS, collectBullets(), collectColorValues(), collectParagraphs(), detectFormat(), extractColors() (+29 more)

### Community 34 - "scanCssTextForPulsingDot"
Cohesion: 0.10
Nodes (36): buildHtmlPatternCorpora(), checkElementGlow(), checkElementRadialSpotlight(), checkElementRadialSpotlightDOM(), checkGlow(), checkHtmlPatterns(), checkRadialSpotlight(), collectCssCustomProps() (+28 more)

### Community 35 - "live-wrap.mjs"
Cohesion: 0.13
Nodes (38): hasGeneratedHeader(), HEADER_MARKERS, isGeneratedFile(), isGitIgnored(), resolveSourceTraits(), argVal(), buildInsertWrapperLines(), computeInsertLine() (+30 more)

### Community 36 - "background.ts"
Cohesion: 0.15
Nodes (26): advanceTabGeneration(), currentTabJobId(), enqueueTabMutation(), getTabState(), isJobDetailsPage(), isValidCaptureMetadata(), metadataKey(), readJobHistory() (+18 more)

### Community 37 - "runHook"
Cohesion: 0.16
Nodes (20): appendDesignSystemNote(), appendDesignSystemNoteOnce(), bumpEditCount(), consumeSessionNoticeFlag(), dedupeAgainstCache(), depthIsSet(), ensureFile(), ensureSession() (+12 more)

### Community 38 - "new-work.md"
Cohesion: 0.07
Nodes (25): Recommended Actions, Craft (deprecated alias), Impeccable Documenter, Input Contract, Output Contract, Workflow, Monorepo notes, Opting out of the boot check (+17 more)

### Community 39 - "applyEditing"
Cohesion: 0.08
Nodes (35): addManualContextText(), applyEditing(), buildLocatorForLeaf(), canRestoreManualEditElement(), collectEditableTextRows(), visit(), contextElementForManualEdit(), copyEditContainerContext() (+27 more)

### Community 40 - "impeccable-paths.mjs"
Cohesion: 0.17
Nodes (21): resolveProjectRoot(), CRITIQUE_DIR, firstExisting(), getDesignSidecarCandidates(), getDesignSidecarPath(), getImpeccableDir(), getLegacyLiveAnnotationsDir(), getLegacyLiveConfigPath() (+13 more)

### Community 41 - "parseRgb"
Cohesion: 0.13
Nodes (32): checkColors(), checkElementAIPaletteDOM(), checkElementColors(), checkElementColorsDOM(), checkElementGlowDOM(), checkElementHoverContrast(), checkElementIconTile(), checkElementIconTileDOM() (+24 more)

### Community 42 - "context-signals.mjs"
Cohesion: 0.14
Nodes (24): cli(), COMMON_DEV_PORTS, devServerSignals(), gatherSignals(), gitSignals(), hasCode(), isVendoredPath(), latestCritique() (+16 more)

### Community 43 - "qualification.ts"
Cohesion: 0.19
Nodes (19): deriveQualificationSummary, detailFrom(), firstText(), isAny(), isDefaultLabel(), isDefaultZeroRequirement(), isJssRequirement(), isMeaninglessClientRequirement() (+11 more)

### Community 44 - "parseAnyColor"
Cohesion: 0.09
Nodes (51): checkColors(), checkElementAIPaletteDOM(), checkElementColors(), checkElementColorsDOM(), checkElementGlow(), checkElementGlowDOM(), checkElementHoverContrast(), checkElementIconTile() (+43 more)

### Community 45 - "event-validation.mjs"
Cohesion: 0.12
Nodes (26): AGENT_PHASE_SET, FORBIDDEN_MANUAL_EDIT_TEXT_CHARS, INSERT_POSITIONS, isValidId(), isValidMountVariant(), isValidVariantId(), MOUNT_ERROR_MAX_LENGTH, MOUNT_URL_MAX_LENGTH (+18 more)

### Community 46 - "insights.ts"
Cohesion: 0.18
Nodes (25): firstNumber(), firstString(), historyTimestamp(), isHistoryEntry(), isJobInsights(), isNullableBooleanValue(), isNullableNumberValue(), isNullableStringValue() (+17 more)

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

### Community 53 - "scaffoldSvelteComponentSession"
Cohesion: 0.11
Nodes (21): applyLegacyDeferredAcceptsOnStartup(), buildPropsScriptV2(), loadSvelteCompiler(), applyDeferredSvelteComponentAccepts(), buildInsertVariantStub(), buildPropsScript(), buildVariantStub(), buildVariantStubV2() (+13 more)

### Community 54 - "manual-edits-buffer.mjs"
Cohesion: 0.19
Nodes (16): scrubManualEditsAgainstFile(), scrubManualEditsAgainstOriginalBlock(), clearAppliedEntries(), args, buffer, cwd, pageUrlFilter, remaining (+8 more)

### Community 55 - "JobInsights"
Cohesion: 0.11
Nodes (13): JobInsights, ClientPayProfileInput, PageEvent, QualificationDetail, JobRecord, LatestJobCaptureRecord, WatchlistRecord, FakeDatabase (+5 more)

### Community 56 - "storage.ts"
Cohesion: 0.07
Nodes (38): aggregateConversionStats(), ConversionStats, ApplicationState, ALIASES, canonical(), matchPortfolio, overlap(), PortfolioMatch (+30 more)

### Community 57 - "live-inject.mjs"
Cohesion: 0.18
Nodes (20): describeInjectArtifacts(), frameworkIgnorePatterns(), resolveFramework(), clearInjectJournal(), recordInjection(), removeTag(), revertCspMeta(), unpatchTagFile() (+12 more)

### Community 58 - "svelte-ast.mjs"
Cohesion: 0.21
Nodes (20): Analysis, analyzeAttributes(), analyzeFragment(), analyzeNode(), analyzeSvelteMarkup(), applyReplacements(), classifyEachKey(), classifyRoots() (+12 more)

### Community 59 - "onboard.md"
Cohesion: 0.09
Nodes (22): Assess Onboarding Needs, Context Over Ceremony, Contextual Help, Design Onboarding Experiences, Documentation & Help, Empty State Design, Feature Discovery & Adoption, Guided Tours & Walkthroughs (+14 more)

### Community 60 - "parseAnyColor"
Cohesion: 0.11
Nodes (25): checkCreamPalette(), checkTextOcclusionDOM(), clamp01(), colorFunctionToRgb(), creamFromClassList(), decodeSrgbChannel(), elementDirectText(), encodeSrgbChannel() (+17 more)

### Community 61 - "detect-url.mjs"
Cohesion: 0.21
Nodes (18): detectUrl(), launchBrowser(), measureContentHiddenAfterReveal(), runVisualContrastFallback(), serializeDesignSystemForBrowser(), captureVisualContrastCandidate(), compareScreenshotContrast(), sanitizeScreenshotClip() (+10 more)

### Community 62 - "session-store.mjs"
Cohesion: 0.20
Nodes (16): applyEvent(), baseSnapshot(), COMPLETED_PHASES, getReadableJournalPath(), persist(), readState(), deriveRenderState(), GENERATION_FENCED_PHASES (+8 more)

### Community 63 - "history.ts"
Cohesion: 0.29
Nodes (9): compareSnapshots(), getJobSnapshotSummary, JobSnapshotSummary, listValidJobSnapshots, queryJobSnapshots(), summarizeJobSnapshots(), validJobId(), validSnapshot() (+1 more)

### Community 64 - "settings.ts"
Cohesion: 0.05
Nodes (79): adjustEditingIndex(), draftFromEntry(), EMPTY_DRAFT, isHttpPortfolioUrl(), isOptionsPortfolioEntry(), isOptionsProfile(), LocalStorageArea, OptionsApp() (+71 more)

### Community 65 - "sveltekit-adapter.mjs"
Cohesion: 0.18
Nodes (20): applySvelteKitLiveAdapter(), buildSvelteLiveRootComponent(), defaultSvelteLayout(), detectSvelteKitProject(), ensureSvelteLiveRootComponent(), escapeRegExp(), fileIncludes(), findSvelteKitAppHtml() (+12 more)

### Community 66 - "tanstack-adapter.mjs"
Cohesion: 0.16
Nodes (20): tanstackStart, applyTanStackLiveAdapter(), buildTanStackLiveRootComponent(), detectTanStackStartProject(), escapeRegExp(), findRootRouteFile(), insertAfterLastImport(), isManagedComponent() (+12 more)

### Community 67 - "Operate mode depth (and Read notes)"
Cohesion: 0.10
Nodes (18): Craft floor, Refuse, Verify, Constraints, Failure modes, Flow, $impeccable hooks, Routing (+10 more)

### Community 68 - "The Toolkit"
Cohesion: 0.10
Nodes (20): Animate complex properties, Assess What "Extraordinary" Means Here, For data-heavy interfaces, For functional UI, For performance-critical UI, For visual/marketing surfaces, Implement with Discipline, Interact with the device (+12 more)

### Community 69 - "serve-question.mjs"
Cohesion: 0.14
Nodes (17): browserOpenCommand(), openSystemBrowser(), answerFile(), esc(), flipFile(), idleGraceArg, loadRound(), localImages (+9 more)

### Community 70 - "staleness-deep.mjs"
Cohesion: 0.17
Nodes (20): checkDesignCoverage(), checkDesignDrift(), checkDetectorIgnores(), checkHookInstallation(), checkLegacyLiveState(), checkWorkspaces(), collectHookCommands(), finding() (+12 more)

### Community 71 - "collectBrowserFindings"
Cohesion: 0.16
Nodes (20): browserFindingsFromMap(), checkBorders(), checkEdgeFlushCardsDOM(), checkElementBlinkingCursorDOM(), checkElementBorders(), checkElementBordersDOM(), checkElementPseudoStripeDOM(), checkElementTextOverflowDOM() (+12 more)

### Community 72 - "live.mjs"
Cohesion: 0.19
Nodes (15): parseCliOptions(), resolveTargetSelection(), parseTargetOptions(), parseTargetPath(), TargetArgError, __dirname, ensureServerRunning(), globToRegex() (+7 more)

### Community 73 - "renderGroupedTemplate"
Cohesion: 0.36
Nodes (10): clampGroupedToBudget(), clampLastLine(), clampToBudget(), directiveFooter(), footerFallbacks(), formatDedupedFindingLine(), formatFindingLine(), isFindingLine() (+2 more)

### Community 74 - "watchlist.ts"
Cohesion: 0.11
Nodes (29): App(), normalizedJobId(), PopupReadDependencies, readPopupInsights(), readWatchlistStatus(), readyWithWatchlist(), ViewState, root (+21 more)

### Community 75 - "sampleCssBackground"
Cohesion: 0.16
Nodes (18): analyzeVisualContrastCandidate(), blendRgba(), clampByte(), firstCssUrl(), getLayerValue(), loadVisualContrastImage(), parseObjectPosition(), parsePositionPair() (+10 more)

### Community 76 - "background.test.ts"
Cohesion: 0.12
Nodes (14): GET_JOB_INSIGHTS, badgeBackgroundCalls, badgeTextCalls, Deferred, fakeBrowser, insights, pendingStorageOperations, ReplayResponder (+6 more)

### Community 77 - "onAnnotDown"
Cohesion: 0.18
Nodes (18): beginEditPin(), buildAnnotationsForCapture(), buildPinElement(), cancelEditingPin(), finalizeEditingPin(), initAnnotOverlay(), localCoords(), materializePlaceholderWidth() (+10 more)

### Community 79 - "tag-strategy.mjs"
Cohesion: 0.22
Nodes (14): appendOriginToDirective(), buildTagBlock(), commentClose(), commentOpen(), detectLineEnding(), findCspMetaTags(), getAttr(), insertTag() (+6 more)

### Community 80 - "generate-image.mjs"
Cohesion: 0.17
Nodes (13): crc32(), hash32(), hslToRgb(), out, palette(), pngChunk(), pngFake(), promptFile (+5 more)

### Community 81 - "surface-briefs.mjs"
Cohesion: 0.29
Nodes (13): getSurfaceBriefDir(), listSurfaceBriefs(), normalizeRouteTarget(), normalizeSurfaceTarget(), parseSurfaceBrief(), resolveSurfaceBrief(), SURFACE_BRIEF_VERSION, surfaceBriefPathForTarget() (+5 more)

### Community 82 - "createLiveBrowserSessionState"
Cohesion: 0.20
Nodes (14): createLiveBrowserSessionState(), clearHandled(), clearScrollY(), clearSession(), isHandled(), loadSession(), markHandled(), nextCheckpointRevision() (+6 more)

### Community 83 - "animate.md"
Cohesion: 0.12
Nodes (14): Accessibility and control, Choose material by meaning, Find the job, Implement to the runtime, Set the motion thesis, Timing and easing, Verify, Visitor mode (+6 more)

### Community 84 - "manual-edit-routes.mjs"
Cohesion: 0.57
Nodes (7): compactManualLogText(), summarizeManualApplyFailures(), summarizeManualDiagnostics(), summarizeManualLogFile(), createManualEditRoutes(), sendJson(), summarizePendingManualEditBatch()

### Community 85 - "live.md"
Cohesion: 0.12
Nodes (15): Cleanup, Exit, First-time setup, Handle `accept`, Handle `discard`, Handle fallback, Handle `manual_edit_apply`, Handle `prefetch` (+7 more)

### Community 86 - "Handle `generate`"
Cohesion: 0.12
Nodes (16): 1. Read the screenshot (if present), 2. Wrap the element, 3. Load the action's reference, 4. Plan three variants: identity first, then mode, then axes, 5. Apply the freeform prompt (if present), 6. Deliver variants, 7. Parameters (composition-sized, 0-4 per variant), 8. Signal done (+8 more)

### Community 87 - "applicant-metrics.ts"
Cohesion: 0.36
Nodes (9): ApplicantMetrics, ApplicantSnapshot, deriveApplicantMetrics(), firstSeenApplicantDelta(), hasValidOrder(), isValidCount(), latestApplicantCount(), recentApplicantDelta() (+1 more)

### Community 88 - "checkQuality"
Cohesion: 0.14
Nodes (16): checkElementOversizedH1(), checkElementOversizedH1DOM(), checkElementQuality(), checkElementQualityDOM(), checkOversizedH1(), checkQuality(), colorsNearlyMatch(), cssColorAlpha() (+8 more)

### Community 89 - "pay-profile.ts"
Cohesion: 0.31
Nodes (10): ClientHistoryEntry, averageRecentFixedPayment(), deriveClientPayProfile(), fixedPayments(), HistoricalHourlyRateRecord, medianRecentFixedPayment(), PayProfileHistoryEntry, positiveFinite() (+2 more)

### Community 90 - "checkHeadingRhythmDOM"
Cohesion: 0.18
Nodes (16): checkHeadingRhythmDOM(), clusterTop(), edgeAbove(), edgeBelow(), hasOwnTopBoundary(), insideSmallCard(), isVisibleFlow(), overlapsX() (+8 more)

### Community 91 - "Generate Report"
Cohesion: 0.13
Nodes (14): 1. Accessibility (A11y), 2. Performance, 3. Theming, 4. Responsive Design, 5. Implementation Integrity (CRITICAL), Audit Health Score, Detailed Findings by Severity, Diagnostic Scan (+6 more)

### Community 92 - "interceptor.ts"
Cohesion: 0.23
Nodes (17): main(), defendInspectionHook(), emitInsights(), inspectPayload(), installFetchAndResponseHooks(), installInterceptors(), installReplayListener(), installXhrHooks() (+9 more)

### Community 93 - "mountSvelteComponentVariant"
Cohesion: 0.19
Nodes (14): applyOriginalAttrsToSvelteAnchor(), commitAcceptedSvelteComponentToDom(), componentModuleCandidates(), describeMountFailure(), detectDevServerBase(), importFirstReachable(), loadSvelteRuntime(), maybePrefetchPage() (+6 more)

### Community 94 - "skills.ts"
Cohesion: 0.27
Nodes (8): matchSkills(), SkillMatchInput, SkillMatchSummary, ALIASES, NormalizedSkill, normalizeSkillName(), normalizeSkills(), skillKey()

### Community 95 - "provider.mjs"
Cohesion: 0.50
Nodes (3): IMPECCABLE_COMMAND, IMPECCABLE_COMMAND_PREFIX, IMPECCABLE_PROVIDER_ID

### Community 96 - "resolveLiveInjectionAnchor"
Cohesion: 0.22
Nodes (15): buildSvelteExpressionTextMap(), buildSveltePropValuesFromLiveElement(), buildSveltePropValuesV2(), cloneWithoutElements(), collectTextNodes(), collectVisibleTexts(), cssEscapeIdent(), elementMatchesOriginalMarkup() (+7 more)

### Community 97 - "createLiveBrowserDomHelpers"
Cohesion: 0.19
Nodes (10): createLiveBrowserDomHelpers(), cssId(), liveUiRoot(), makeFrozenAnchor(), own(), pickable(), rectIsUsableAnchor(), uiAppend() (+2 more)

### Community 98 - "detect-utils.mjs"
Cohesion: 0.27
Nodes (13): astro, detectAstroProject(), fileExists(), findConfigFile(), firstExistingFile(), hasAnyDependency(), literalConfigFiles(), readPackageDeps() (+5 more)

### Community 99 - "journal.mjs"
Cohesion: 0.27
Nodes (12): PATCH_UNDOERS, healArtifact(), healInjectJournal(), INJECT_JOURNAL_RELPATH, INJECT_JOURNAL_VERSION, injectJournalPath(), insideProject(), normalizeRel() (+4 more)

### Community 100 - "live-status.mjs"
Cohesion: 0.17
Nodes (22): readLiveServerInfo(), FORBIDDEN, verifyAcceptedFile(), verifyAcceptedSource(), completeCli(), completeThroughServer(), parseArgs(), readServerInfo() (+14 more)

### Community 102 - "Impeccable Asset Producer"
Cohesion: 0.14
Nodes (12): Core Rule, Decision Comps, Impeccable Asset Producer, Input Contract, Output Contract, Prompt Pattern, Workflow, Generate three compositional options (+4 more)

### Community 103 - "checkElementGptBorderShadowDOM"
Cohesion: 0.38
Nodes (7): borderColorsFromStyle(), borderWidthsFromStyle(), checkElementGptBorderShadow(), checkElementGptBorderShadowDOM(), checkGptThinBorderWideShadow(), shadowLayerAlpha(), shadowMaxBlurPx()

### Community 104 - "Optimization Strategy"
Cohesion: 0.14
Nodes (13): Animation Performance, Assess Performance Issues, Core Web Vitals Optimization, Cumulative Layout Shift (CLS < 0.1), Interaction to Next Paint (INP < 200ms), Largest Contentful Paint (LCP < 2.5s), Loading Performance, Network Optimization (+5 more)

### Community 105 - "template-extensions.mjs"
Cohesion: 0.18
Nodes (13): IMPECCABLE_DIR, extensionCache, LIVE_TEMPLATE_EXTENSIONS, matchesTemplateExtension(), normalizeExtensionEntries(), readLiveTemplateExtensions(), resolveLiveTemplateExtensions(), safeReadJson() (+5 more)

### Community 106 - "frameworks/index.mjs"
Cohesion: 0.18
Nodes (10): COMMENT_SYNTAXES, FRAMEWORKS, INJECT_KINDS, PREVIEW_MODES, SOURCE_TRAIT_DEFAULTS, STYLE_MODES, TAG_PATCH_KIND, staticHtml (+2 more)

### Community 107 - "Scan mode (approach C: auto-extract, then confirm descriptive language)"
Cohesion: 0.15
Nodes (13): Component translation rules, Narrative mapping, Scan mode (approach C: auto-extract, then confirm descriptive language), Schema, Step 1: Find the design assets, Step 2: Auto-extract what can be auto-extracted, Step 2b: Stage the frontmatter, Step 3: Ask the user for qualitative language (+5 more)

### Community 109 - "embed-prompt.mjs"
Cohesion: 0.19
Nodes (11): args, buf, crc32(), crcTable, file, pngChunk(), promptOf(), readJpegCom() (+3 more)

### Community 110 - "browser-script-parts.mjs"
Cohesion: 0.19
Nodes (10): assembleLiveBrowserScript(), assertLiveBrowserScriptParts(), LIVE_BROWSER_SCRIPT_PARTS, readLiveBrowserScriptParts(), resolveLiveBrowserScriptParts(), loadBrowserScripts(), LIVE_CHROME_MOUNT_CONTRACT, LIVE_UI_COMPONENT_IDS (+2 more)

### Community 111 - "pin.mjs"
Cohesion: 0.22
Nodes (11): CODEX_HARNESSES, commandPrefixForSkillsDir(), __dirname, findHarnessDirs(), generatePinnedSkill(), HARNESS_DIRS, loadCommandMetadata(), pin() (+3 more)

### Community 112 - "hiring-warnings.ts"
Cohesion: 0.27
Nodes (8): deriveHiringWarnings(), hasHistoryAfterIdentityFilter(), HiringApplicationState, HiringHistoryEntry, HiringWarningLabel, HiringWarnings, HiringWarningsInput, validCount()

### Community 113 - "restrictions.ts"
Cohesion: 0.44
Nodes (9): earningsLabel(), firstString(), labels(), meaningfulString(), parseRestrictions, positiveNumber(), record(), RecordValue (+1 more)

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
Cohesion: 0.17
Nodes (11): files, ignoreUnknown, includes, maxSize, **, !!.agents, !!coverage, !!dist (+3 more)

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

### Community 126 - "document.md"
Cohesion: 0.18
Nodes (10): Pitfalls, Seed mode, Step 1: Route through new-work's workshop, Step 2: Write seed DESIGN.md, Step 3: Confirm, Style guidelines, The frontmatter: token schema, The markdown body: eight sections (canonical order) (+2 more)

### Community 127 - "New visual work"
Cohesion: 0.18
Nodes (11): 1. Decide what is already true, 2. Ask what will change the work, 3. Choose the right amount of invention, 4. Commit the world, 5. Record the decision, 6. Build with full commitment, 7. Inspect and finish, Create a whole surface inside an established world (+3 more)

### Community 128 - "New Features Implementation Plan"
Cohesion: 0.40
Nodes (5): Audit Issues Report, New Features Specification, New Features Implementation Plan, Options Page, Insights Scope

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
Cohesion: 0.33
Nodes (10): appendStalenessDirective(), designSidecarCandidatesFor(), buildStalenessDirective(), cachePath(), filterFreshFindings(), pruneCache(), readCache(), readJson() (+2 more)

### Community 135 - "Common Cognitive Load Violations"
Cohesion: 0.22
Nodes (9): 1. The Wall of Options, 2. The Memory Bridge, 3. The Hidden Navigation, 4. The Jargon Barrier, 5. The Visual Noise Floor, 6. The Inconsistent Pattern, 7. The Multi-Task Demand, 8. The Context Switch (+1 more)

### Community 136 - "iOS platform"
Cohesion: 0.22
Nodes (9): Color & materials, Components & controls, iOS platform, Layout & structure, Motion, The iOS slop test, Touch targets, Typography (+1 more)

### Community 137 - "Upwork Tools Product Definition"
Cohesion: 0.50
Nodes (4): Repository Guidelines, Impeccable Design Skill, Upwork Tools Product Definition, Upwork Tools

### Community 138 - "Shape"
Cohesion: 0.22
Nodes (8): Cadence, Confirm and stop, Phase 1: Discovery interview, Phase 2: Resolve the design direction, Phase 3: Write the brief, Round 1: purpose, people, and outcome, Round 2: material, behavior, and boundaries, Shape

### Community 140 - "instructions.mjs"
Cohesion: 0.40
Nodes (9): acceptInstructions(), bootInstructions(), deferredWrapperInstructions(), generateInstructions(), insertScaffoldInstructions(), instructionsForEvent(), pollCmd(), replyCmd() (+1 more)

### Community 141 - "formatter"
Cohesion: 0.22
Nodes (9): formatter, attributePosition, bracketSpacing, enabled, formatWithErrors, indentStyle, indentWidth, lineEnding (+1 more)

### Community 142 - "adapt.native.md"
Cohesion: 0.25
Nodes (7): Adaptation Strategies, Assess Adaptation Challenge, Implement & Verify, Orientation & foldables, Phone → Tablet (iPad / large screens), Platform → platform (iOS ↔ Android), Web → native (porting a website or web app)

### Community 144 - "Android platform"
Cohesion: 0.25
Nodes (8): Android platform, Color & theming, Components & motion, Layout & structure, The Android slop test, Touch targets, Typography, Verifying the build

### Community 145 - "colorize.md"
Cohesion: 0.25
Nodes (7): Apply at system scale, Audit before choosing, Choose a strategy, Contrast and perception, Live-mode signature params, Verify, Visitor mode

### Community 146 - "Persona-Based Design Testing"
Cohesion: 0.25
Nodes (8): 1. Impatient Power User: "Alex", 2. Confused First-Timer: "Jordan", 3. Accessibility-Dependent User: "Sam", 4. Deliberate Stress Tester: "Riley", 5. Distracted Mobile User: "Casey", Persona-Based Design Testing, Project-Specific Personas, Selecting Personas

### Community 147 - "Extract Flow"
Cohesion: 0.25
Nodes (7): Extract Flow, Step 1: Discover the Design System, Step 2: Identify Patterns, Step 3: Plan Extraction, Step 4: Extract & Enrich, Step 5: Migrate, Step 6: Document

### Community 148 - "live-setup.md"
Cohesion: 0.25
Nodes (7): append-arrays, append-string, Config drift, Consent prompt (use this phrasing), CSP detection (first-time only), Troubleshooting, Write the config

### Community 149 - "checkElementBorders"
Cohesion: 0.47
Nodes (6): checkBorders(), checkElementBorders(), checkElementBordersDOM(), isStatusContextElement(), isTabContextElement(), isNeutralColor()

### Community 150 - "Generate Report"
Cohesion: 0.29
Nodes (7): Audit Health Score, Detailed Findings by Severity, Executive Summary, Generate Report, Patterns & Systemic Issues, Platform Conformance Verdict, Positive Findings

### Community 151 - "Cognitive Load Assessment"
Cohesion: 0.29
Nodes (7): Cognitive Load Assessment, Cognitive Load Checklist, Extraneous Load: Bad Design, Germane Load: Learning Effort, Intrinsic Load: The Task Itself, The Working Memory Rule, Three Types of Cognitive Load

### Community 152 - "Impeccable Finish Reviewer"
Cohesion: 0.29
Nodes (6): Checks, in order, Disposition, Impeccable Finish Reviewer, Input Contract, Output Contract, Verdict Pass

### Community 153 - "Impeccable Manual Edit Applier"
Cohesion: 0.29
Nodes (6): Checks, Entry Atomicity, Impeccable Manual Edit Applier, Input Contract, Output Contract, Workflow

### Community 154 - "nuxt.mjs"
Cohesion: 0.31
Nodes (7): applyNuxtLiveAdapter(), buildNuxtPlugin(), nuxt, NUXT_PLUGIN_MARKER, NUXT_PLUGIN_NAME, removeNuxtLiveAdapter(), buildLiveScriptSrc()

### Community 155 - "checkHeadingRhythmDOM"
Cohesion: 0.62
Nodes (7): checkHeadingRhythmDOM(), clusterTop(), edgeAbove(), edgeBelow(), hasOwnTopBoundary(), isVisibleFlow(), overlapsX()

### Community 156 - "filterFindings"
Cohesion: 0.19
Nodes (16): cleanIgnoreValueDisplay(), extractFindingIgnoreValue(), extractFindingIgnoreValueRaw(), extractMotionIgnoreValue(), filterFindings(), findingMatchesScopedIgnoreFile(), formatFindingIgnoreHint(), globToRegex() (+8 more)

### Community 157 - "Diagnostic Scan"
Cohesion: 0.33
Nodes (6): 1. Accessibility (VoiceOver / TalkBack), 2. Performance, 3. Appearance & Theming, 4. Platform Conformance (CRITICAL), 5. Adaptivity, Diagnostic Scan

### Community 158 - "bolder.md"
Cohesion: 0.33
Nodes (5): Before you finish, Scope is sovereign, The amplification, The skeleton test, Why it reads flat

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

### Community 166 - "content.test.ts"
Cohesion: 0.29
Nodes (6): fakeBrowser, fakeWindow, globals, MessageListener, runtimeListeners, windowListeners

### Community 167 - "source"
Cohesion: 0.50
Nodes (4): source, assist, actions, organizeImports

### Community 171 - "protocol.ts"
Cohesion: 0.07
Nodes (39): ContentWindow, main(), PendingReplay, ReplayTimer, ClientPayProfile, GET_JOB_HISTORY, isClientPayProfile(), isJobHistoryResponse() (+31 more)

### Community 173 - "isScreenReaderOnlyTextStyle"
Cohesion: 0.47
Nodes (6): clippedByInset(), clippedByRect(), expandBoxShorthand(), firstMetricLengthPx(), isScreenReaderOnlyTextStyle(), metricLengthPx()

## Knowledge Gaps
- **842 isolated node(s):** `here`, `API_BASE`, `API_TIMEOUT_MS`, `localStates`, `PING_KINDS` (+837 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `loadContext()` connect `context.mjs` to `live-server.mjs`, `hook-lib.mjs`, `context-signals.mjs`, `surface-briefs.mjs`, `doctor.mjs`, `hook-before-edit.mjs`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `enterLiveRoot()` connect `roots.mjs` to `live-wrap.mjs`, `live-status.mjs`, `live-server.mjs`, `live-inject.mjs`, `live-accept.mjs`, `live-poll.mjs`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `parseDesignMd()` connect `design-parser.mjs` to `doctor.mjs`, `live-server.mjs`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `here`, `API_BASE`, `API_TIMEOUT_MS` to the rest of the system?**
  _842 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `live-browser.js` be split into smaller, more focused modules?**
  _Cohesion score 0.029187396351575457 - nodes in this community are weakly interconnected._
- **Should `checks.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.03235294117647059 - nodes in this community are weakly interconnected._
- **Should `context.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.04658454647256439 - nodes in this community are weakly interconnected._