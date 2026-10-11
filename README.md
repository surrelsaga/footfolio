<p align="center"><img src=".github/logo.jpg" alt="footfolio logo: a pixel-art sneaker" width="480"></p>

# footfolio

**Clear the fog, one walk at a time.**

footfolio covers your neighbourhood map in fog. Walk outside and the fog clears where you go; the cafes, parks and shops underneath appear as you uncover them. A small open AI model, Gemma, runs **on your phone** and writes riddles about places still hidden in the fog, so you end up walking streets you have never tried. Over time the map becomes a record of everywhere you have been.

The screen is meant to be the shortest part: read a riddle, put the phone away, look around.

Built for the DEV "Hacktoberfest Open-Source AI Challenge: Week 1" (Touch Grass).

## How it plays

| | |
|---|---|
| **Fog** | Each good GPS fix clears about 40 m around you. Your uncovered map is saved on the phone. |
| **Places** | Real places from OpenStreetMap, within 2 km of you. They appear as gold pins when your walk uncovers them. The area follows you when you move to a new neighbourhood. |
| **Today** (top left) | Today's goal (3 places), places found by kind, % of the area explored, the last find, and settings. |
| **Quests** (top right) | A riddle about a hidden place 150 to 400 m away, in three clues. Other kinds: uncover new places, a trail of three places of one kind, or a famous local place. You complete them by walking there. |
| **Wisp** | A small light that shows up after you have searched for a while, so help is earned. If you are still stuck, the spot is marked. |
| **Badges** (bottom left) | Explorer (5, 10, 12 places), Local legend (a famous place to eat or drink), Landmark (another famous place). |

## Why open source, on the device

- **Your location history stays yours.** Your path, fog, finds, badges and quests never leave the phone. No accounts, no database.
- **The AI runs locally.** Gemma generates the riddles in the browser, so no prompt, place or position is sent to an AI service, and it costs nothing to run.
- **Code decides, Gemma words.** The app picks the target and checks arrival by GPS; Gemma only writes the clue. Every answer is checked (no place name, no numbers we did not give, no compass directions) and falls back to a plain line if it fails.
- **Swappable.** The model is one line in `src/config.ts`.

## Architecture

```
Phone (browser)                                    Render
┌──────────────────────────────────┐             ┌──────────────────────────┐
│ Leaflet map + fog canvas         │  one point   │ places service           │
│ GPS → fog, finds, quests, badges │  rounded to  │ (server/places.ts)       │ ──► OpenStreetMap
│ saved in localStorage            │ ───────────► │ fetch, filter, cache,    │     Overpass API
│ Gemma: WebGPU or CPU, on device  │   ~550 m     │ gzip; no coordinates     │
└──────────────────────────────────┘ ◄─────────── │ logged, no database      │
          ▲                            places     └──────────────────────────┘
          │ model files, once, opt-in
     Hugging Face
```

- **Front end:** TypeScript + Vite, Leaflet with OpenStreetMap tiles. The fog is a grid of ~11 m cells drawn on a canvas. Small ES modules with one job each; pure logic is tested in Node.
- **Places service:** one Node endpoint on Render, `GET /places?lat&lng`. Browsers can't call the public Overpass servers reliably (slow, rate-limited, and they need a User-Agent browsers can't set), so the service asks up to three Overpass mirrors, keeps a 7-day cache and gzips the answer (a dense city is about 1 MB of JSON, 100 KB zipped).
- **Gemma, two ways:**
  - With WebGPU: **Gemma 3 1B** instruct (4-bit ONNX, ~800 MB) through **Transformers.js**.
  - Without WebGPU (many phones and in-app browsers): **Gemma 3 270M** (4-bit GGUF, ~240 MB) on the CPU through **wllama** (llama.cpp in WebAssembly).
  - The download is opt-in and shows its size first; after that it loads from the browser cache.

## Run it

Needs Node 24.

```
npm install
npm run dev        # the app on http://localhost:3000
npm run server     # the places service on :3001
```

Open `http://localhost:3000/?debug` and tap the map to walk from your desk. Real GPS needs HTTPS, so use a deployed copy on a phone.

`npm test` (logic and service), `npm run test:browser` (headless Chrome, with `npm run dev` running), `npm run build`.

## Deploy (Render)

- **Static site:** build `npm ci && npm test && npm run build`, publish `dist`, env `NODE_VERSION=24` and `VITE_PLACES_API=<places service URL>`.
- **Web service:** build `npm ci`, start `node server/places.ts`, env `NODE_VERSION=24`, health check `/`.

## What leaves your phone

For each new area, the places service receives **one point rounded to about 550 m** (Render's request logs may record it with your IP). Map tiles come from OpenStreetMap, which sees roughly the area on screen. If you turn Gemma on, the model downloads once from Hugging Face (the runtime from jsDelivr); those requests carry no location or quest data.

## Credits

- **Gemma 3** by Google, used under the [Gemma Terms of Use](https://ai.google.dev/gemma/terms): [onnx-community/gemma-3-1b-it-ONNX-GQA](https://huggingface.co/onnx-community/gemma-3-1b-it-ONNX-GQA) and [ggml-org/gemma-3-270m-it-qat-GGUF](https://huggingface.co/ggml-org/gemma-3-270m-it-qat-GGUF).
- [Transformers.js](https://github.com/huggingface/transformers.js) (Apache-2.0) with ONNX Runtime Web (MIT).
- [wllama](https://github.com/ngxson/wllama) (MIT), built on [llama.cpp](https://github.com/ggml-org/llama.cpp) (MIT).
- [Leaflet](https://leafletjs.com) (BSD-2-Clause) and [Vite](https://vite.dev) (MIT).
- [Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont/) font by the Braille Institute (SIL OFL).
- Map tiles and place data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL), via the Overpass API.
