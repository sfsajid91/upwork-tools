# Repository Guidelines

## Project Overview

Upwork Tools is a local-first Manifest V3 browser-extension project built with WXT, React, TypeScript, and Bun. The checked-in source is currently a small WXT + React starter: the background and content entrypoints log placeholder messages, and the popup renders a counter.

`PROJECT_CONTEXT.md` describes the intended Upwork product—reading authenticated job-details GraphQL responses and showing local job insights. Treat it as the target behavior, not proof that those modules already exist; verify implementation in `entrypoints/` before changing or documenting behavior.

## Architecture & Data Flow

WXT discovers and builds independent extension entrypoints and generates the extension manifest/output.

- `entrypoints/background.ts`: background service-worker entrypoint; currently only logs the runtime ID.
- `entrypoints/content.ts`: content-script entrypoint; currently matches `*://*.google.com/*` and logs when loaded.
- `entrypoints/popup/`: React popup application. `main.tsx` mounts `App.tsx`; CSS is kept beside the popup components.
- Current data flow is local to each entrypoint. No runtime messaging, shared model, storage, or network interception is implemented in the starter source.

The intended flow in `PROJECT_CONTEXT.md` is: a MAIN-world script observes Upwork's job-details GraphQL response → an isolated content script validates and forwards a normalized event → the background worker stores the latest snapshot per tab in session storage → the popup requests and renders that snapshot. Preserve the stated boundaries when implementing it: local session data, no duplicate requests, no Upwork DOM mutation, and no backend or telemetry.

## Key Directories

- `entrypoints/`: WXT entrypoints for background, content, and popup contexts.
- `entrypoints/popup/`: popup HTML, React components, and styles.
- `assets/`: source assets imported by the React UI.
- `public/`: static assets copied into the extension output.
- `.wxt/`: generated WXT types/configuration; ignored by Git and not hand-edited.

There is no `src/` application directory in the current tree; references to `src/App.tsx` in the starter UI are stale template text.

## Development Commands

Use Bun because `bun.lock` is committed and the project context specifies Bun.

```sh
bun install                 # install dependencies; postinstall runs wxt prepare
bun run dev                 # start WXT development mode
bun run dev:firefox        # start Firefox-targeted development mode
bun run compile            # TypeScript no-emit check
bun run build               # build the default extension
bun run build:firefox       # build for Firefox
bun run zip                 # package the default extension
bun run zip:firefox         # package the Firefox build
```

`package.json` has no `test`, `lint`, or `format` scripts. `biome.json` is the repository's formatter/linter configuration, but Biome is not declared in `package.json`; do not assume a local Biome CLI exists.

## Code Conventions & Common Patterns

- Use TypeScript ES modules (`"type": "module"`) and WXT APIs such as `defineConfig`, `defineBackground`, and `defineContentScript`.
- Keep entrypoint files focused on their browser context. Put popup UI in React components and mount it through `main.tsx`.
- Follow the existing Biome style: two-space indentation, LF endings, 100-column width, single quotes in JavaScript/TypeScript, double quotes in JSX, semicolons, and trailing commas.
- Use PascalCase for React components (`App.tsx`) and lower-case context entrypoints (`background.ts`, `content.ts`).
- React state currently uses hooks (`useState`) and functional components. There is no established dependency-injection or global-state abstraction; add one only when a real cross-context requirement needs it.
- For the planned page-integration path, validate messages/events at context boundaries, preserve the host page's original request/response behavior, and keep inspection failures from affecting Upwork. Prefer nullable normalized models for missing upstream values, as specified by `PROJECT_CONTEXT.md`.
- Do not edit generated `.wxt/` files or add behavior to the host page's DOM unless the product boundary changes explicitly.

## Important Files

- `package.json`: scripts, dependencies, and module type.
- `bun.lock`: Bun dependency lockfile.
- `wxt.config.ts`: WXT React module and build configuration.
- `tsconfig.json`: project TypeScript settings; extends generated WXT config.
- `biome.json`: formatting, linting, and import-organization rules.
- `PROJECT_CONTEXT.md`: target product behavior, data model expectations, and explicit boundaries.
- `entrypoints/background.ts`, `entrypoints/content.ts`: extension runtime entrypoints.
- `entrypoints/popup/main.tsx`, `entrypoints/popup/App.tsx`: popup mount and UI.

## Runtime/Tooling Preferences

- Primary runtime/package manager: Bun.
- Extension tooling: WXT (`wxt`), with `@wxt-dev/module-react`.
- Language/UI: TypeScript 5.9 and React 19.
- Browser target in the project context: Chromium 111+; Firefox-specific commands are also provided.
- WXT owns manifest generation and development/build orchestration. Keep configuration in `wxt.config.ts` instead of manually maintaining generated output.

## Testing & QA

No automated tests, test directories, test dependencies, or coverage configuration currently exist. Do not claim test coverage for the starter.

For current changes, run `bun run compile` and manually smoke-test the affected extension context with `bun run dev` in a browser. For popup changes, open the generated extension popup; for content/background changes, exercise the matching page and inspect the extension console. If product logic is added, introduce a test framework only with the corresponding behavior and commands documented here; test boundary validation, normalization edge cases, and per-tab state behavior rather than implementation details.
