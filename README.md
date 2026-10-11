<p align="center"><img src=".github/logo.jpg" alt="footfolio logo: a pixel-art sneaker" width="480"></p>

# footfolio

A walking game: your map starts covered in fog that clears where you walk, and Gemma, running on your phone, writes riddles about real places still hidden in it.

- **Play:** [footfolio.onrender.com](https://footfolio.onrender.com) (made for phones; add `?debug` to tap-to-walk from a desk)
- **The story behind it:** [Achievement unlocked: left my room, thanks to my walking game](https://dev.to/daniel_ng/achievement-unlocked-left-my-room-thanks-to-my-walking-game-3pma) on DEV

## Architecture

Everything personal (your path, fog, finds, badges) stays in the browser. Render hosts the app and one small service that fetches places around a point rounded to ~550 m.

```
footfolio/
├── index.html
├── src/                      the app (Vite + TypeScript, runs on the phone)
│   ├── main.ts               wires every module together
│   ├── gps.ts, debugWalk.ts  where you are: real GPS, or tap-to-walk
│   ├── fog.ts, fogLayer.ts   ~11 m fog cells, cleared as you walk, drawn on a canvas
│   ├── region.ts             the 2 km circle of places that follows you
│   ├── overpass.ts           asks OpenStreetMap for places, filters them
│   ├── discovery.ts          what's found, today's goal, drives the quests
│   ├── quests.ts             quest kinds and rules (code decides, GPS completes)
│   ├── gemma.ts              Gemma 3 1B on WebGPU, or 270M on the CPU
│   ├── questText.ts          Gemma's prompt and the checks on every answer
│   ├── badges.ts             Explorer, Local legend, Landmark
│   ├── hud.ts, ui.ts         Today panel, quest pill and card
│   └── config.ts             every tunable number in one place
├── server/
│   └── places.ts             Render Web Service: GET /places?lat&lng → Overpass, cached, gzipped
├── public/places.json        places for our campus (SUTD), shipped with the app
└── tests/                    Node tests for the logic, plus a headless-Chrome suite
```

## Run it

```
npm install
npm run dev       # the app on :3000
npm run server    # the places service on :3001
npm test
```

On Render: a **Static Site** (`npm ci && npm test && npm run build`, publish `dist`, env `VITE_PLACES_API`) and a **Web Service** (`node server/places.ts`), both on Node 24.

## Credits

- [Gemma 3](https://ai.google.dev/gemma) by Google, under the [Gemma Terms of Use](https://ai.google.dev/gemma/terms): [onnx-community/gemma-3-1b-it-ONNX-GQA](https://huggingface.co/onnx-community/gemma-3-1b-it-ONNX-GQA), [ggml-org/gemma-3-270m-it-qat-GGUF](https://huggingface.co/ggml-org/gemma-3-270m-it-qat-GGUF)
- [Transformers.js](https://github.com/huggingface/transformers.js) (Apache-2.0), [wllama](https://github.com/ngxson/wllama) and [llama.cpp](https://github.com/ggml-org/llama.cpp) (MIT)
- [Leaflet](https://leafletjs.com) (BSD-2-Clause), [Vite](https://vite.dev) (MIT), [Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont/) (SIL OFL)
- Map tiles and places © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL), via the Overpass API
