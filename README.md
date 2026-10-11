# footfolio

A map of your neighbourhood covered in fog. Walk and the fog clears; real places appear as you uncover them, and a narrator gives you riddles about places hidden in the fog. Gemma, a small open model, writes the riddles **on your phone**. Progress never leaves the device.

Built for the DEV "Hacktoberfest Open-Source AI Challenge: Week 1" (Touch Grass).

## What you see

| | |
|---|---|
| **Fog and dot** | The map is fogged; each good GPS fix clears 40 m around you. Places under the fog show as gold pins when found. |
| **Today** (top left) | One panel: today's goal, places found by kind, % of the neighbourhood explored, the last find, and settings (sound, Gemma). |
| **Quest pill** (top right) | A riddle about a hidden place and how far it is. The card holds the clue; arriving resolves it. |
| **Wisp** | A small light that appears if you have tried for a while, so help is earned, not given. |
| **Badges** (bottom left) | Explorer (5, 10, 12 places), Local legend (a famous place to eat), Landmark (another famous place). |

How the quests and Gemma work: [GEMMA.md](GEMMA.md). Architecture, phases and decisions: [PLAN.md](PLAN.md). Notes for writing the challenge post: [POST-CONTEXT.md](POST-CONTEXT.md).

## Run it

```
npm install
npm run dev        # http://localhost:3000
npm run server     # the places service on :3001 (needed away from SUTD)
```

Open `http://localhost:3000/?debug` and tap the map to walk without leaving your desk (`?debug=10` is 10x faster). The red badge has a **reset fog** button. Real GPS needs HTTPS (or localhost), so test on a phone with the deployed page. `index.html` can't be opened by double-click.

| Command | What it does |
|---|---|
| `npm test` | Node tests for the pure logic and the places service (no framework) |
| `npm run test:browser` | Headless-Chrome suite; start `npm run dev` first. `GEMMA=1` also runs the real model |
| `npm run typecheck` / `npm run build` | TypeScript check / production build |
| `node tools/fetch-places.mjs` | Regenerates `public/places.json` (the SUTD region) |

## Deploy

Two services on Render, from this repo:

- **Static site** (the app): build `npm ci && npm test && npm run build`, publish `dist`, env `NODE_VERSION=24` and `VITE_PLACES_API=<the web service URL>` (baked in at build time).
- **Web service** (places): build `npm ci`, start `node server/places.ts`, `NODE_VERSION=24`, health check `/`. Use the Starter plan for demos; the free tier sleeps and empties its in-memory cache, so request the regions you will show after each deploy.

## What leaves your phone

Your path, fog, finds, badges and quests never do. Per new region, the places service gets **one point rounded to about 550 m** and asks OpenStreetMap's Overpass API for places within 2 km; Render's request logs may record it with your IP. Map tiles come from OpenStreetMap, which sees roughly the area on screen. If you turn Gemma on, the model files download once from Hugging Face (and the runtime from jsDelivr); those requests carry no location or quest data, and the model then runs on your phone.

Place data © OpenStreetMap contributors, ODbL.
