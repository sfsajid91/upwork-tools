<!-- Claude Code configuration: imports AGENTS.md and mirrors project guidelines -->
@AGENTS.md

# Repository Guidelines

## Project Overview

Upwork Tools is a local-first Manifest V3 browser extension built with WXT, React, TypeScript, Tailwind CSS, and Bun. It reads an authenticated Upwork job-details GraphQL response and renders transparent job-quality insights for the active tab.

`docs/architecture.md` and `PRODUCT.md` define product boundaries, architecture, and data flow. Verify implementation in `src/entrypoints/` and `src/lib/` before changing or documenting behavior.

## Architecture & Data Flow

WXT discovers and builds independent extension entrypoints and generates the extension manifest/output.

- `src/entrypoints/interceptor.content.ts`: MAIN-world content script installed at `document_start`; observes only the supported job-details GraphQL response.
- `src/entrypoints/content.ts`: isolated content script; validates same-origin page events and forwards normalized insights to the background worker.
- `src/entrypoints/background.ts`: service worker; validates runtime messages, stores the latest normalized snapshot per tab in `browser.storage.session`, clears tab data on navigation/removal, and updates the action badge.
- `src/entrypoints/popup/`: React popup application. `main.tsx` mounts `App.tsx`; popup styling uses Tailwind CSS utilities and `style.css` only imports Tailwind.
- `src/entrypoints/options/`: React options application for profile, portfolio, watchlist, and data management.
- `src/lib/interceptor.ts`: fetch, Response, JSON, and XHR inspection with deduplication and host-page safety guards.
- `src/lib/insights.ts`: nullable normalized `JobInsights` model, parser, derived metrics, warning detection, client history, related-job matching, and runtime validation.
- `src/lib/protocol.ts`: versioned page-event and runtime-message contracts.
- `src/lib/format.ts`: popup formatting for numbers, money, percentages, dates, statuses, ratings, and relative activity.

Preserve the boundaries: local session data, no duplicate Upwork requests, no Upwork DOM mutation, no backend, no telemetry, and no fabricated scores or recommendations.

## Key Directories

- `src/entrypoints/`: WXT entrypoints for background, content, interceptor, popup, and options contexts.
- `src/entrypoints/popup/`: popup HTML, React components, mount file, and Tailwind import.
- `src/lib/`: normalized model, protocol, interceptor, database, and formatting logic.
- `assets/`: source assets imported by the React UI.
- `public/`: static assets copied into the extension output.
- `.wxt/`: generated WXT types/configuration; ignored by Git and never hand-edited.

## Development Commands

Use Bun because `bun.lock` is committed and the project context specifies Bun.

```sh
bun install                 # install dependencies; postinstall runs wxt prepare
bun run dev                 # start WXT development mode
bun run compile            # TypeScript no-emit check
bun run test               # run Bun tests
bun run lint               # run Biome lint
bun run format:check       # check Biome formatting
bun run build              # build the default extension
bun run zip                # package the default extension
```

## Strict Clean Code & Engineering Guidelines

All contributors and AI agents must follow these strict clean code principles:

### 1. File & Module Size Limits (Strict Rule)
- **Maximum 500 Lines per File**: No single source code or test file should exceed 500 lines. Files approaching or exceeding 500 lines must be proactively decomposed into smaller, single-responsibility modules, subcomponents, custom hooks, or utility files.
- **Function/Method Length**: Functions must stay focused and concise (ideally under 30–50 lines). If a function requires complex branching or multi-step orchestration, break it down into well-named helper functions maintaining a Single Level of Abstraction (SLAP).
- **Component Decomposition**: React components must avoid massive monolithic JSX trees. Split complex views into reusable, isolated subcomponents and extract complex state/effects into custom hooks (`use*`).
- **Function Parameter Count**: Keep function parameter counts low (preferably 1–3 parameters). When a function requires 4 or more parameters, group them into a well-typed options or configuration object.

### 2. SOLID Design Principles
- **Single Responsibility Principle (SRP)**: Every module, class, hook, and function must have exactly one reason to change. Separate data parsing, business calculations, storage orchestration, and UI rendering into distinct layers.
- **Open/Closed Principle (OCP)**: Code should be open for extension but closed for modification. Favor composition, configuration objects, and strategy patterns over complex cascading switch/if-else ladders.
- **Liskov Substitution Principle (LSP)**: Derived implementations or subtype structures must conform strictly to expected interface contracts without surprising behavior, phantom errors, or breaking invariants.
- **Interface Segregation Principle (ISP)**: Design small, cohesive, client-specific interfaces. Do not force modules or components to depend on large, monolithic types containing fields they do not use.
- **Dependency Inversion Principle (DIP)**: Depend on abstractions (interfaces, types, protocols), not volatile concrete implementations. Domain logic must remain independent of external browser APIs (e.g., wrap `chrome.storage` / `browser.storage` behind storage abstractions).

### 3. Core Software Principles: KISS, YAGNI, and DRY
- **KISS (Keep It Simple, Stupid)**: Write straightforward, readable code. Avoid clever tricks, premature micro-optimizations, and unnecessary architectural layers. The clearest implementation is the best implementation.
- **YAGNI (You Aren't Gonna Need It)**: Do not write speculative code, unused parameters, or anticipatory abstractions for hypothetical future features. Implement only what is immediately required.
- **DRY (Don't Repeat Yourself) with Rule of Three**: Avoid duplicating core domain logic, metric formulas, and validation rules. Extract shared logic into `src/lib/`. Avoid hasty abstractions across superficially similar code that serves fundamentally different business domains.
- **Boy Scout Rule**: Leave the codebase cleaner than you found it. Proactively clean up minor dead code, inconsistent types, or outdated comments in files you touch.

### 4. Naming Conventions & Expressiveness
- **Intention-Revealing & Searchable**: Variable, function, type, and file names must clearly explain *what* they represent and *why* they exist. Avoid ambiguous abbreviations (`ctx`, `tmp`, `val`, `res`, `d`).
- **Boolean Prefixes**: Booleans must be prefixed with auxiliary verbs: `is`, `has`, `should`, `can`, `did` (e.g., `isClientVerified`, `hasHireHistory`, `shouldDisplayWarning`).
- **Action-Oriented Functions**: Functions and methods must begin with active verbs describing their operation (e.g., `calculateDerivedRates`, `formatCurrency`, `parseJobDetails`, `normalizePayload`).
- **Domain Consistency**: Use established domain terminology consistently across all layers (`JobInsights`, `ClientHistory`, `RuntimeMessage`, `PageEvent`).

### 5. Functions & Control Flow
- **Guard Clauses & Early Exits**: Return early to eliminate nested `if/else` ladders and "arrow anti-patterns" (pyramids of doom). Handle precondition checks, invalid states, and edge cases at the top of the function.
- **Pure Functions & Immutability**: Core calculations, aggregations, and formatting must be pure functions with deterministic outputs and zero side effects.
- **No Hidden Side Effects**: Functions must not silently mutate input arguments or global state. Always return new immutable data structures.

### 6. Strict TypeScript & Type Safety
- **Strict Typing (Zero `any`)**: The `any` type is strictly forbidden. Use `unknown` with runtime type narrowing, exhaustive type guards, or validation schemas.
- **Explicit Boundary Typing**: Always provide explicit return types and parameter types on exported functions, library modules, and API boundaries.
- **Discriminated Unions**: Model multi-state workflows (e.g., `type ViewState = { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: JobInsights } | { status: 'error'; message: string }`) instead of multiple independent boolean flags (`isLoading`, `isError`, `isSuccess`).
- **Nullable Rigor**: Distinguish clearly between `null` (explicit absence or unknown upstream field) and `undefined` (optional property). Avoid unsafe non-null assertions (`!`) unless strictly proven by preceding compiler invariants.
- **Immutability Modifiers**: Use `readonly`, `ReadonlyArray`, and `as const` for fixed configurations, protocol constants, and lookup maps.

### 7. Error Handling & Defensive Boundaries
- **Graceful Boundary Isolation**: Extension entrypoints (interceptor, content scripts, background worker) must never throw uncaught exceptions into the host page context or crash the background service worker.
- **Defensive Ingestion**: Validate all external inputs at trust boundaries (GraphQL payloads, DOM events, `chrome.runtime` messages, `storage` reads) using schema validators or type guards before processing.
- **No Swallowed Exceptions**: Never use empty `catch {}` blocks. Log handled errors with structured diagnostics via internal logging helpers (`src/lib/logger.ts`).

### 8. UI & Component Architecture (React & Tailwind)
- **Separation of Presentation & Logic**: Keep UI components focused on layout and rendering. Extract state management, asynchronous data fetching, and business computations into custom hooks and utility modules.
- **Unidirectional Data Flow**: Pass data down via props and bubble events up via explicit callbacks. Maintain local component state where possible and avoid unnecessary global stores.
- **Semantic & Accessible Markup**: Use native, semantic HTML elements (e.g., `<details>`, `<button>`, `<section>`, `<nav>`) with appropriate ARIA attributes.
- **Clean Tailwind Usage**: Use Tailwind utility classes consistently. Avoid arbitrary ad-hoc pixel values and inline styles unless strictly necessary for dynamic runtime values.

### 9. Code Cleanliness, Formatting & Linting
- **Clean Code Base**: Remove commented-out code, dead code, unused imports, and console debugging statements before submitting changes.
- **Biome Compliance**: All code must conform to project Biome formatting and linting rules (2-space indent, LF line endings, 100-column width, semicolons, single quotes in TS, double quotes in JSX).
- **Self-Documenting Code**: Prefer expressive code and clear naming over redundant comments. Use comments only to document non-obvious domain rationale, edge-case workarounds, or upstream quirks.

### 10. Testing & Verification Rigor
- **Test Behavior, Not Implementation**: Write unit and integration tests verifying user-observable behavior, business logic accuracy, and edge-case handling rather than internal implementation details.
- **Mandatory Quality Gates**: Every change must cleanly pass:
  1. `bun run compile` (TypeScript type check)
  2. `bun run lint` (Biome linting)
  3. `bun run format:check` (Biome formatting)
  4. `bun run test` (Full Bun test suite)

## Code Conventions & Common Patterns

- Use TypeScript ES modules (`"type": "module"`) and WXT APIs such as `defineConfig`, `defineBackground`, and `defineContentScript`.
- Keep entrypoint files focused on their browser context. Put popup UI in React components and mount it through `main.tsx`.
- Use Tailwind CSS utilities for popup presentation. Keep `src/entrypoints/popup/style.css` limited to the Tailwind import unless a documented browser-surface requirement cannot be expressed with utilities.
- Follow Biome style: two-space indentation, LF endings, 100-column width, single quotes in JavaScript/TypeScript, double quotes in JSX, semicolons, and trailing commas.
- Use PascalCase for React components (`App.tsx`) and lowercase context entrypoints (`background.ts`, `content.ts`).
- Prefer nullable normalized fields for upstream values. Valid zeroes remain zero; missing or invalid values become `null`.
- Validate every page event, runtime message, sender tab ID, and normalized payload at context boundaries.
- Preserve the host page's original request/response behavior. Inspection failures must never affect Upwork.
- Keep popup content transparent: show factual metrics and explicitly derived rates; never add AI scores, winning probabilities, good/bad client labels, apply/skip recommendations, or proposal generation.
- Use native `<details>` for expandable client history and related jobs. Do not add duplicate requests or page overlays to support popup interactions.
- Do not edit generated `.wxt/` files or add behavior to the host page's DOM unless the product boundary changes explicitly.

## Important Files

- `package.json`: scripts, dependencies, and module type.
- `bun.lock`: Bun dependency lockfile.
- `wxt.config.ts`: WXT React and Tailwind Vite configuration.
- `tsconfig.json`: project TypeScript settings; extends generated WXT config.
- `biome.json`: formatting, linting, and import-organization rules.
- `PRODUCT.md`: product behavior, positioning, and boundaries.
- `docs/architecture.md`: system architecture, runtime topology, storage schemas, and protocol contracts.
- `src/entrypoints/popup/App.tsx`: popup states, hierarchy, and Tailwind UI.
- `src/lib/insights.ts`: normalized model, parser, validation, and derived insight data.
- `src/entrypoints/background.ts`, `src/entrypoints/content.ts`, `src/entrypoints/interceptor.content.ts`: extension runtime flow.

## Runtime/Tooling Preferences

- Primary runtime/package manager: Bun.
- Extension tooling: WXT (`wxt`), with `@wxt-dev/module-react`.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite` and `@import "tailwindcss"`.
- Language/UI: TypeScript 5.9 and React 19.
- Browser target: Chromium 111+ (Chrome, Brave, Edge).
- WXT owns manifest generation and build orchestration. Keep configuration in `wxt.config.ts` instead of maintaining generated output manually.

## Testing & QA

Product tests live in `tests/`. Use Bun's built-in test runner (`bun run test`) to verify behavior across all layers (188+ tests). Test parser boundary validation, nullable normalization, derived rates, warning precedence, related-history matching, and per-tab state behavior rather than implementation details.

For current changes, run `bun run compile`, `bun run lint`, and `bun run format:check`. Manually smoke-test the affected extension context with `bun run dev` in a browser. For popup changes, open the generated extension popup in a Chromium tab containing the supported Upwork response; for content/background changes, exercise the matching page and inspect extension consoles. Run `bun run build` for a production bundle check before shipping.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
