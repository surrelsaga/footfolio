# Fog Walk map (map-MVP)

A map covered in fog that clears where you walk, with quests written by Gemma on the phone. Part of a Hacktoberfest "Touch Grass" entry; the challenge brief and deadline are in `../walking-maxxing/CLAUDE.md`. The brand hook is **walking made more interesting**, and the screen should be the shortest part of the experience.

## Where things stand
All planned features are built and merged to `main` (Phases 1 to 11 and the CPU fallback; see `PLAN.md`). What is left is the challenge submission: a working live link, a real walk, and the DEV post. Notes for the post are in `POST-CONTEXT.md`.

## Read these
- `README.md`: what it is, how to run it, deploy, privacy.
- `PLAN.md`: architecture, phases, decisions, known limits.
- `GEMMA.md`: how the AI quests, Gemma and the wisp/badges work.
- `POST-CONTEXT.md`: facts for the challenge write-up.

## Rules for working here
- **Stack:** Vite + TypeScript, Leaflet + OSM tiles, fog as grid cells on a canvas, `localStorage`. The only backend is `server/places.ts` (Overpass proxy + cache); there is no database, and no user data leaves the phone beyond a ~550 m-rounded point.
- **Modules:** small ES modules, one job each, wired in `src/main.ts`. Pure logic (no DOM, no Leaflet) stays Node-testable. Constants live in `src/config.ts`.
- **Gemma words, code decides.** Code picks the quest and completes it by GPS; Gemma only writes clue text, and every answer is checked before use. Text from OSM or the model reaches the page only through `textContent`.
- **UI:** use the `ui-ux-pro-max` skill, design phone first, check at 390 x 780 and 320 x 640. The gold colour means "discovered" and nothing else (`tests/design.test.ts` enforces it).
- **Each change:** build, `npm test`, `npm run typecheck`, `npm run test:browser` (against `npm run dev`), then review with `code-review` and `ponytail-review`, then the user checks and commits. Near the deadline: review only if really necessary, test once, commit.
- Context first: read and summarise, and wait for a go before writing code.
