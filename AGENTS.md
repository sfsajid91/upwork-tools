# Repository Guidelines

## Project Overview

Upwork Tools is a local-first Manifest V3 browser extension built with WXT, React, TypeScript, Tailwind CSS, and Bun. It reads an authenticated Upwork job-details GraphQL response and renders transparent job-quality insights for the active tab.

`PROJECT_CONTEXT.md` defines product boundaries and the sample GraphQL response. `Upwork Tools - Insights Scope.md` defines the popup's information hierarchy and explicit anti-goals. Verify implementation in `entrypoints/` and `lib/` before changing or documenting behavior.

## Architecture & Data Flow

WXT discovers and builds independent extension entrypoints and generates the extension manifest/output.

- `entrypoints/interceptor.content.ts`: MAIN-world content script installed at `document_start`; observes only the supported job-details GraphQL response.
- `entrypoints/content.ts`: isolated content script; validates same-origin page events and forwards normalized insights to the background worker.
- `entrypoints/background.ts`: service worker; validates runtime messages, stores the latest normalized snapshot per tab in `browser.storage.session`, clears tab data on navigation/removal, and updates the action badge.
- `entrypoints/popup/`: React popup application. `main.tsx` mounts `App.tsx`; popup styling uses Tailwind CSS utilities and `style.css` only imports Tailwind.
- `lib/interceptor.ts`: fetch, Response, JSON, and XHR inspection with deduplication and host-page safety guards.
- `lib/insights.ts`: nullable normalized `JobInsights` model, parser, derived metrics, warning detection, client history, related-job matching, and runtime validation.
- `lib/protocol.ts`: versioned page-event and runtime-message contracts.
- `lib/format.ts`: popup formatting for numbers, money, percentages, dates, statuses, ratings, and relative activity.

Preserve the boundaries: local session data, no duplicate Upwork requests, no Upwork DOM mutation, no backend, no telemetry, and no fabricated scores or recommendations.

## Key Directories

- `entrypoints/`: WXT entrypoints for background, content, interceptor, and popup contexts.
- `entrypoints/popup/`: popup HTML, React components, mount file, and Tailwind import.
- `lib/`: normalized model, protocol, interceptor, and formatting logic.
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
- Use Tailwind CSS utilities for popup presentation. Keep `entrypoints/popup/style.css` limited to the Tailwind import unless a documented browser-surface requirement cannot be expressed with utilities.
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
- `PROJECT_CONTEXT.md`: product behavior, source response, data model expectations, and boundaries.
- `Upwork Tools - Insights Scope.md`: popup content priority, derived metrics, expandable sections, warnings, and anti-goals.
- `entrypoints/popup/App.tsx`: popup states, hierarchy, and Tailwind UI.
- `lib/insights.ts`: normalized model, parser, validation, and derived insight data.
- `entrypoints/background.ts`, `entrypoints/content.ts`, `entrypoints/interceptor.content.ts`: extension runtime flow.

## Runtime/Tooling Preferences

- Primary runtime/package manager: Bun.
- Extension tooling: WXT (`wxt`), with `@wxt-dev/module-react`.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite` and `@import "tailwindcss"`.
- Language/UI: TypeScript 5.9 and React 19.
- Browser target: Chromium 111+; Firefox-specific commands are also provided.
- WXT owns manifest generation and build orchestration. Keep configuration in `wxt.config.ts` instead of maintaining generated output manually.

## Testing & QA

No product test suite is checked in yet. When adding logic tests, use Bun's built-in test runner and document the behavior covered. Test parser boundary validation, nullable normalization, derived rates, warning precedence, related-history matching, and per-tab state behavior rather than implementation details.

For current changes, run `bun run compile`, `bun run lint`, and `bun run format:check`. Manually smoke-test the affected extension context with `bun run dev` in a browser. For popup changes, open the generated extension popup in a Chromium tab containing the supported Upwork response; for content/background changes, exercise the matching page and inspect extension consoles. Run `bun run build` for a production bundle check before shipping.
