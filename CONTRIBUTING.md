# Contributing

## Setup

```sh
npm ci
npm run build
npm test
```

The plugin is a single client bundle: `src/*.cjs` is bundled by `build.mjs` into the committed `client.js`, which is what Harness loads through `window.__ModuleLoader__`. **Commit the rebuilt `client.js` with every source change**; CI rebuilds and fails when the bundle is stale.

`index.js` is the empty Host half. It exists because a Harness bundle needs a Host entry; the real work is in the client.

## Tests

```sh
npm test               # unit: geometry, selectors, caption format, dictionaries, bundle loading
npm run test:harness   # headless Edge, real React + mocked webview; needs ../test-tools
npm run test:bench     # annotation capacity sweep, writes docs/stress-results.json
```

`test:harness` covers the full interaction path: pick → comment card → Add → Insert, the host image/canvas snapshot, and live locale switching. Add a regression there for any behavior that spans React, capture and the composer.

## Conventions

- **i18n**: every user-facing string lives in `DICT_EN` and `DICT_ZH`; `test/package.test.cjs` fails when the key sets differ.
- **Capture**: host snapshots must tolerate unreadable media; never let one broken image reject the whole screenshot.
- **Insert target**: resolve the main-view chat (`uiSession.current`), not the session that owns the Browser pane.
- **Limits**: one screenshot per viewport state; block inserts above the message image limit reported by the session (fallback 20).
- **Comments**: the composer textarea is uncontrolled on purpose; do not move keystrokes into React state.

## Pull requests

Keep changes focused, include tests for behavior changes, and describe the affected surface (Browser panel, Document Preview, Harness UI). For visual changes, attach a before/after screenshot taken with the plugin itself.
