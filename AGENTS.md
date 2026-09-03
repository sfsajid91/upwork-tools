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
bun run dev:firefox        # start Firefox-targeted development mode
bun run compile            # TypeScript no-emit check
bun run test               # run Bun tests
bun run lint               # run Biome lint
bun run format:check       # check Biome formatting
bun run build              # build the default extension
bun run build:firefox      # build the Firefox extension
bun run zip                # package the default extension
bun run zip:firefox        # package the Firefox build
```

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
- Browser target: Chromium 111+; Firefox-specific commands are also provided.
- WXT owns manifest generation and build orchestration. Keep configuration in `wxt.config.ts` instead of maintaining generated output manually.

## Testing & QA

Product tests live in `tests/`. Use Bun's built-in test runner (`bun run test`) to verify behavior across all layers (176+ tests). Test parser boundary validation, nullable normalization, derived rates, warning precedence, related-history matching, and per-tab state behavior rather than implementation details.

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
