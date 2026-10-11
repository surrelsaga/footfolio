# The AI quests: how Gemma, the clues, the wisp and the badges work

**Rule from the brief:** Gemma runs on the phone, not on a server of ours. The one server (the places service) never sees a quest, a clue or a prompt.

## What the player gets

- **A quest pill** (top right) with a ring and the distance ("250 m", "1/2", "Done"). Tapping it shows the card; tapping the map closes it. One card is open at a time (Today panel or quest card).
- **Reach quest = a riddle.** A hidden place 150 to 400 m away. Gemma writes three short clues in one narrator voice, about what the place *is like* (never its name, never a compass direction; many people can't use "north-east"). Clue 1 shows at the start; clue 2 when the wisp appears; clue 3 when you are within 60 m. Arriving shows "Found it: <place>" with the riddle under it.
- **The wisp = help you earn.** A small pale light appears after 2 minutes of looking, or once you are 40 m past the closest you have been. It circles an off-centre ring over the area. Walking away says "Colder".
- **If you still can't find it:** after 5 minutes (or after getting 60 m closer and drifting 60 m back out) the spot is marked on the map. At 1.5x the starting distance you get one "heading away" alert with the way back.
- **Other quests, in rotation:** *find* (uncover 2 new places), *trail* (find 3 places of one kind within 1 km), *legend* (a famous place 150 m to 1.5 km away; at most once a day, never the first quest, never auto-marked on the map).
- **Badges** (bottom-left medal, a dot when new): *Explorer* at 5, 10 and 12 places discovered; *Local legend* (a famous place to eat or drink); *Landmark* (any other famous place). Each famous badge records the place and the day.
- **Famous** = a Michelin tag, or its own Wikipedia/Wikidata entry (a chain's brand entry doesn't count), or a name on `ICONIC` in `src/places.ts` (a hand-picked list of Singapore eateries, matched by whole words). Schools and hospitals are excluded.
- **No Gemma?** One short plain line per clue ("A cafe is hiding in the fog nearby. Can you find it?"). The card offers Gemma with its download size.

## How it is built

| Part | Choice | Why |
|---|---|---|
| Who decides | **Code** picks the quest, target and rule; GPS completes it. **Gemma only words it.** | A 1B model can't be trusted with places or game rules. |
| With WebGPU | **Gemma 3 1B instruct** (`onnx-community/gemma-3-1b-it-ONNX-GQA`, 4-bit, ~800 MB) through **Transformers.js** | Measured: usable lines. The 270M model mostly copied the prompt's examples or wrote as the player. |
| Without WebGPU | **Gemma 3 270M** (`gemma-3-270m-it-qat-Q4_0.gguf`, ~240 MB) on the CPU through **wllama** (llama.cpp in WebAssembly) | iPhones before iOS 26, many Android GPUs and in-app browsers have no WebGPU. Slower and plainer, but it works; clues are written ahead in the background. |
| Why not MediaPipe / WebLLM | MediaPipe's Gemma 3 web models are **gated** (a Hugging Face login token, which a static site can't keep); the only open build was 2 GB. WebLLM stopped at Gemma 2. | The ungated ONNX and GGUF builds are open. Transformers.js pinned to 4.3.0 (4.3.1 was 3 days old). |
| Download | **Opt-in** switch (Today panel, Settings, or the quest card) with progress; remembered, then loads from the browser cache | 240 to 800 MB must never start by surprise on mobile data. |
| Where it runs | Page main thread, GPU or CPU | A Web Worker was skipped: one ~1 s generation per quest doesn't stall the map. |
| Swapping models | One line each in `config.ts` (`GEMMA_MODEL`, `GEMMA_SMALL_*`) | |

**What Gemma is told:** where you are (a place you found within 100 m), the target's *name and kind* (to hint at), and the nearest place you already found near it (clue 2 points from there); for find quests, the kinds of places still hidden nearby. Two worked examples go in as real chat turns (in one message both models kept continuing the pattern).

**Checks on every answer** (`questText.clean`; each rule came from a real bad answer): first line only; markdown, quotes, emoji and labels stripped; cut to whole sentences within 120 characters; **rejected** if it contains a number we didn't give, names the hidden place (a distinctive word of its name, so "Bedok Reservoir Park" bans *bedok* and *reservoir*, not *park*), is written as the player, echoes the prompt or an example, or uses a direction word. Up to 5 tries (`GEMMA_TRIES`), then the plain line. Gemma's text and OSM names reach the page only through `textContent`.

## Measured (laptop, Intel GPU, Chrome)

| | Gemma 3 270M | Gemma 3 1B |
|---|---|---|
| Download | ~300 MB | ~800 MB |
| Load (first time) | ~12 s | ~22 to 37 s |
| One line | ~0.7 s | ~1.2 s |
| Usable | very few | 16/16 reach lines |

CPU path with WebGPU hidden: loaded in 7.5 s; three clues took 28 s in the background. Example 1B lines: "Head north-east to a cafe concealed by the fog." (an early, direction-worded version), "Continue south towards a fast food establishment veiled in fog."

## Known limits

- **Not verified on a phone.** Phone GPUs and CPUs are slower than the laptop, and 800 MB may be too much for older iPhones (Safari closes tabs that use too much memory). Switch `GEMMA_MODEL` to the 270M if so.
- Hints come from the model's general knowledge of a name: an obscure name can give a vague or wrong hint. That is why the spot gets marked after a while (not for legends).
- Local legend away from Singapore needs OpenStreetMap volunteers to have tagged a place; the `ICONIC` list is Singapore only and hand-picked.
- Switching Gemma off frees memory but leaves the download in the browser cache (no delete button).
- The plain line shows first and Gemma's replaces it a second or two later.

## Files

`src/gemma.ts` (load, unload, run; WebGPU or CPU) · `src/questText.ts` (pure: facts, prompt, plain lines, checks) · `src/quests.ts` (pure + store: the quest kinds, wisp and reveal rules) · `src/badges.ts` (pure + store) · `src/questLayer.ts` (map marker, wisp) · `src/discovery.ts` (asks Gemma, saves clues, drives the pill). Tests: `tests/questText.test.ts`, `quests.test.ts`, `badges.test.ts`, and the browser suite (`GEMMA=1` for the real model).
