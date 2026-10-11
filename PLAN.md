# footfolio: architecture, phases and decisions

Condensed on 2026-10-11. The per-phase build notes that used to live here (every deviation and review finding) are in git history: `git log -p -- PLAN.md`. This file keeps what you need to understand and change the app.

## What it is
A phone web app. The map is covered in fog that clears where you walk; places under it appear as you uncover them; quests written by Gemma on the phone send you toward places hidden in the fog. It runs without any server of ours except one small place-lookup service.

## Architecture
TypeScript ES modules bundled by Vite. Each module has one job; `src/main.ts` is the only file that knows all the others.

| Area | Files | Job |
|---|---|---|
| Position | `gps.ts`, `debugWalk.ts`, `me.ts` | Both sources call `onFix({lat,lng,accuracy})`; `me.ts` draws the dot and follows it |
| Fog | `fog.ts` (pure), `fogLayer.ts`, `storage.ts` | Grid cells of 0.0001° (~11 m); reveal 40 m per fix with a 50 m accuracy gate; saved in `localStorage` |
| Places | `places.ts` (pure), `placesLayer.ts`, `coverage.ts` (pure) | Parse and sanitise places, find newly cleared ones, pins, % explored |
| Regions | `region.ts` (pure), `overpass.ts` (pure), `server/places.ts` | A 2 km circle of places around you; the service fetches and caches |
| Game state | `discovery.ts`, `today.ts`, `badges.ts` (pure + stores) | What is found, today's goal, badges, quest driving |
| Quests and AI | `quests.ts`, `questText.ts` (pure), `gemma.ts`, `questLayer.ts` | See [GEMMA.md](GEMMA.md) |
| UI | `hud.ts`, `ui.ts`, `icons.ts`, `sound.ts`, `style.css`, `theme.ts`, `flags.ts` | Today button and panel, quest pill and card, toasts, badges sheet |
| Config and tests | `config.ts`; `tests/*.test.ts`, `tests/browser.mjs` | All tunables in one file; Node tests plus a headless-Chrome suite |

Rules: pure logic never touches the DOM or Leaflet; shared state is read through small exported functions; constants live in `config.ts`; `window.fogMap` is the one handle for browser tests; text from OSM or the model reaches the page only through `textContent`.

Storage keys (all `localStorage`; `:debug` is added in debug mode so simulated walks never mix with real ones): `fogwalk:v1:<cell>` fog, `fogwalk:regions:v2` kept regions, `fogwalk:found:v1` every place found, `fogwalk:today`, `fogwalk:quest`, `fogwalk:badge:v1`, `fogwalk:gemma`, plus small flags.

## Phases

| # | What | Notes |
|---|---|---|
| 1 | Live map + dot | Leaflet + OSM tiles; `?debug` tap-to-walk uses the same path as real GPS |
| 2 | Fog | Grid cells; reveal along the line between fixes (skipped over 200 m or faster than 3 m/s); fixes worse than 50 m show the dot but clear nothing |
| 2.5 | Vite + TypeScript | Moved from a no-build page (a plain HTML file can't run modules from `file://`) |
| 3 | Saved progress | Debounced 2 s, flushed on page hide, merged across tabs |
| 4 | Discover places | OpenStreetMap places via Overpass; pins; % explored |
| 5, 5b | UI pass and stats | Palette fog navy, gold = discovered, blue = you; Atkinson Hyperlegible; daily goal of 3 places; chime |
| 6 | Two simple quests | Reach a spot, find places (no AI). Its logic became the quest engine |
| 7 | **Regions** | A 2 km circle around your first good fix (rounded to ~550 m); a new one when you are 1.5 km away; last 3 kept; the Render places service |
| 7.1 | Finds count anywhere | The device remembers every place found, so places loaded over old fog still count |
| 8 | **Today button** | One small button opens one panel: today's goal, found by kind, area, last find, settings |
| 9 | **Gemma quests on the region map** | Quest pill top right; hint written on the phone; spot hidden until you need help |
| 10 | Riddles, wisp, Explorer badge | Narrator voice, three clues, no compass words; help earned by trying |
| 11 | Legends and trails | Famous places, Local legend and Landmark badges, trail and legend quests |
| 12 | CPU fallback | Gemma 3 270M through wllama when there is no WebGPU |

## Key decisions (and why)
- **Fog and finds on the device only.** Location history is sensitive; this is the project's "why open" story. Storage grows with how much you *walk*, not with the area loaded.
- **Regions, not one city.** A fixed area only works where you test it. A 2 km circle that follows you works anywhere; the re-centre rule (1.5 km) keeps 500 m of places always ahead of you and stops flip-flopping at an edge.
- **One tiny backend.** Public Overpass servers are slow and rate-limited, and browsers can't set the User-Agent they require, so a Render service fetches, filters, caches and gzips (a dense city is ~1 MB of JSON, ~100 KB gzipped). It tries three Overpass servers in turn (the official one was down on Oct 9). No database, no accounts; it rounds the point itself and logs no coordinates.
- **Gemma on the phone, not Render.** Render has no GPUs; CPU Ollama would be slow and paid and would see place names and a rough position; a static site has nowhere to keep an API key.
- **Code decides, Gemma words.** See GEMMA.md.
- **A find is new when it isn't on the device's found list**, wherever the fog came from; devices with fog saved before that list existed keep what they saw, once.
- **Gold means "discovered", nothing else** (enforced by `tests/design.test.ts`, with contrast checks).

## Deployment
Two Render services from this repo (see README for the settings): a Static Site for the app and a Web Service (`node server/places.ts`) for places.

- API: `https://map-mvp-api.onrender.com` (up when checked on 2026-10-11).
- App: `https://map-mvp-frontend-v2.onrender.com`. When checked on 2026-10-11 it still served the **Phase 8 build** (no Gemma, riddles or badges), so its branch or deploy is out of date; `…-frontend-v3` returned 404. Point the static site at `main` and redeploy.
- Redeploy the places service from `main` too: it carries the famous-place tags for other cities.
- The cache is in memory: after a deploy or restart, request the regions you will show, e.g. `curl --compressed "https://map-mvp-api.onrender.com/places?lat=1.3413&lng=103.9638"` (~10 s the first time).
- Free instances sleep after 15 minutes and wake in about a minute; use Starter (~$7/month) for demos. Render credits apply at the end of the billing period. The GitHub Pages workflow on `main` still exists but has no places service, so it only works near SUTD.

## Known limits
- GPS pauses when the phone's screen locks; the screen has to stay on.
- Gemma has not been recorded running on a real phone. 800 MB (GPU) or 240 MB (CPU) downloads are opt-in.
- Famous-place badges depend on OpenStreetMap tags (Michelin, own Wikipedia entry); the eatery list is Singapore only and hand-picked.
- A big place (park, campus) is one point, so it counts only when that spot is cleared.
- Fog redraw scans the cells in view; `localStorage` holds ~400k cells (move to IndexedDB if reached).
- Tiles come from OpenStreetMap's own server (fine for light use).
- Nothing has been run in Safari or Firefox outside the browser tests (Chrome only).

## Verify
1. `npm test` and `npm run typecheck` pass; `npm run build` passes.
2. `npm run dev` + `npm run server`, then `npm run test:browser` passes (`GEMMA=1` also runs the real model on a WebGPU machine).
3. On a phone, over HTTPS: the fog clears along a real walk, places appear, a quest pill shows a distance, the Today panel opens.
