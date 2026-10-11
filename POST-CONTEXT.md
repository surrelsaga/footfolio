# footfolio: everything you need to write the DEV post

This is a **fact sheet, not the post**. It collects what was built, why, with what, and the numbers, from this repo and from the six Claude Code sessions in `map-MVP` and `walking-maxxing`. It does not write your answers. The parts only you can supply (the walk itself, how it felt, who tried it) are listed at the end.

Legend: **✔** checked against the repo or a live URL while writing this · **~** reported by a session, not re-checked · **?** only you know.
Read on 2026-10-11 (~10:40 SGT). The deadline is **2026-10-11 11:59 PM PDT = 2026-10-12 about 14:59 SGT**, so roughly 28 hours from the time of reading.

---

## 0. Read this first: things to sort out before you submit

1. **Which URL is the final build?** ✔ `map-mvp-frontend-v3.onrender.com` returns **404** (no such service). ✔ `map-mvp-frontend-v2.onrender.com` is live but serves the **older Phase 8 build** (Today button only: no Gemma, no riddles, no badges). ✔ The places API `map-mvp-api.onrender.com` is live. The sessions told you to deploy `feat/legends-and-trails` (now merged into `main`, merge commit `ed71e36`). Either the final build is on a service whose name I don't know, or it hasn't been redeployed. Judges need a working link; open it on a phone before you write it into the post.
2. **Redeploy the places service from the final code**, or the Michelin/Wikipedia "famous place" tags won't show outside Singapore (the Singapore eatery list is in the app and works without it).
3. **Gemma on a real phone: ?** No session recorded a successful run on a phone. The only phone report is yours: it said "browser lacks WebGPU" on two phones (Oct 10 13:55), after which the CPU fallback (Gemma 3 270M via wllama) was added. Whether it then ran on those phones is not recorded anywhere.
4. **The docs were brought up to date on 2026-10-11:** `README.md`, `PLAN.md` (condensed; older detail is in git history), `GEMMA.md` (now covers riddles, wisp, badges, legends, trails and the CPU fallback) and `CLAUDE.md` describe the current build.
5. **AI disclosure.** You built this with Claude Code. DEV has rules for disclosing AI assistance in a post; check the current rule and the template's disclosure field (the DevRelay `devrelay-knowledge` skill has the DEV guidelines).
6. **Teammates.** Git shows commits by "Daniel Nguyen" (two accounts, 34 commits) and "Jared" (1 commit). A team post is published by one person who credits teammates by DEV username in the body; decide who to credit.
7. **The name.** The app is **footfolio** (all lowercase) in the page title, README and docs; the repo is still `map-mvp`, and the storage keys keep their old `fogwalk:` prefix so saved progress survives.

---

## 1. What the challenge asks for (so you can check your answers against it)

Source: the DEV challenge page, "Hacktoberfest Open-Source AI Challenge: Week 1" (Touch Grass).

- **Prompt:** build something with open-source AI at its core that gets people off the screen and into the world. "The best builds here should make the screen the shortest part of the experience." The open pieces "should be what makes your project work".
- **The post should say** why open matters for what you built: does it run offline, keep location data off a server you don't control, let you fine-tune or swap models, cost nothing to run? "Tell us where your open-based approach worked better than a closed one." **Bonus points** for taking it outside, using it, and telling how it went.
- **Judging:** Writing quality (weighted most) · Relevance to the prompt · Creativity · Technical execution · Use of partner technology (optional).
- **Categories you targeted:** overall, **Best Use of Gemma**, **Best Use of Render**. A project can enter every category it genuinely uses but wins once.
- **Rules:** tag `#hf26challenge`; one entry; a new project built during the window (first commit **2026-10-07 23:49**, inside it); submit by the deadline above. Saving your agent session with DevRelay and embedding it is optional.

---

## 2. Timeline (from git and the sessions)

| When (SGT) | What |
|---|---|
| Oct 7 14:50–16:30 | Read the challenge; chose the idea (a fogged map + side quests); decided the map is built first in `map-MVP`, quests planned separately. |
| Oct 7 23:49 | First commit. Phases 1–5: live map and dot, fog, saved progress, place discovery, a UI pass. |
| Oct 8 | Moved from plain JS to Vite + TypeScript. Fixed GPS accuracy confusion. Phase 5b stats redesign. Phase 6: two simple quests (reach a spot, find places). |
| Oct 9 | Phase 7: **2 km regions that follow you** + the **Render places service**. Phase 7.1: finds counted wherever the fog came from (a bug you found by testing away from SUTD). Phase 8: the "Today" button. Architecture decisions: Gemma on the phone, not on Render. |
| Oct 10 02:07–04:30 | Gemma-written quests built (first on the old map), then merged onto the region map (Phase 9). |
| Oct 10 10:52–12:16 | Narrator riddles with three clues, the **wisp**, the **Explorer badge**, then **Local legend / Landmark** badges, trail and legend quests, an iconic-eateries list. |
| Oct 10 13:55–16:22 | Gemma wouldn't turn on (no WebGPU on your phones) → **CPU fallback** with Gemma 3 270M. |
| Oct 11 00:28 | Final merge of `feat/legends-and-trails` into `main` ("all core features are built and tested"). 35 commits in total. |

---

## 3. "What I Built": the facts

**One line (from `CLAUDE.md`):** a map of your neighbourhood covered in fog that clears where you physically walk, with AI-written side quests that pull you toward real places you haven't explored. Stated goal: *make walking more interesting*.

**The loop as a player sees it** (✔ thresholds: wisp after 2 minutes or 40 m past your closest point, last clue within 60 m, 40 m reveal radius, GPS better than 50 m: all in `src/config.ts`)
1. Open the app: dark fog over an OpenStreetMap map, a dot where you are. A bubble says to walk to clear the fog.
2. Walking clears fog (40 m around each good GPS fix). Places hidden under the fog appear as gold pins when you uncover them: "Found Kopi Corner".
3. A **quest pill** (top right) shows a riddle-style hint about a real place hidden in the fog and how far it is; a card holds the clue. Gemma writes the clue on the phone.
4. Look for it by walking. If you try for a couple of minutes (or walk past your closest point), a **wisp** (a small light) appears and the second clue unlocks. Within 60 m the last clue unlocks. Walk away and it says "colder".
5. Arrive: the card says "Found it: <place>" and the hint resolves.
6. **Today** button (top left): today's goal, places found by kind, % of the neighbourhood explored, settings. **Badges** (bottom left): Explorer (5/10/12 places), **Local legend** (a famous place to eat or drink), **Landmark** (another famous place).

**Quest types ✔** reach (a hidden place 150–400 m away), find (uncover N new places), trail (3 places of one kind within 1 km), legend (a famous place up to 1.5 km away). **~** From the session summaries, not re-read in the code: a legend is at least 150 m away, comes at most once a day, and is never the first quest.

**Why it gets people off the screen (the design choices that serve the prompt)**
- Quests are completed by **walking** (GPS decides). Nothing is completed by tapping.
- The screen is glanced at: the pill carries distance/progress; the card is one short line; the map is the game board.
- The user asked for exactly this on Oct 10 02:31: *"I have to read a lot of text and I feel it doesn't sound human… maybe to have some visuals like arrows"* → riddles in one narrator voice, no compass words, three short clues, the wisp as visual help earned by trying.

**Scope and scale ✔**
- Works in any city: the region is a 2 km circle around where you are, loaded when you arrive.
- Live measurements through the places service: SUTD 267 places (shipped seed has 283), central Tokyo 1,801, central London 8,536.
- ~2,100 lines of TypeScript in `src/`, ~2,850 lines of tests, 12 Node test files plus a headless-Chrome suite.

**Who it's for: ?** The sessions never wrote this down. Evidence you can use: you built and tested it at SUTD (you live there); the app was made so that "people can test it on their own" anywhere (your Oct 9 words); it asks nothing of the player but walking. The audience statement is yours to write.

**Honest limits to be upfront about ✔**
- **GPS needs the screen on**; browsers pause GPS when it locks (`PLAN.md`, Known limits).
- **Gemma isn't verified on a phone** (see §0).
- **Gemma 1B is ~800 MB; 270M is ~240 MB.** That is a real cost on mobile data; both are opt-in.
- Hints come from the model's general knowledge of a place name; an obscure name can give a vague or slightly wrong hint (GEMMA.md). That is why the spot gets marked on the map after a while (not for legends).
- The "iconic eateries" list is a **hand-picked list of Singapore eateries**, not data; Local legend elsewhere depends on OpenStreetMap volunteers having tagged a place (Michelin or its own Wikipedia entry).
- Place data is only as complete as OpenStreetMap.

---

## 4. "How I Built It": the facts

### The open pieces ✔ (from `package.json`, `src/config.ts`, `GEMMA.md`)

| Piece | Role | Notes |
|---|---|---|
| **Gemma 3 1B instruct** (`onnx-community/gemma-3-1b-it-ONNX-GQA`, 4-bit, ~800 MB) | Writes the riddle clues, in the browser | Via **Transformers.js** (`@huggingface/transformers` ^4.3.0) on **WebGPU**. Opt-in download, cached by the browser. |
| **Gemma 3 270M** (`ggml-org/gemma-3-270m-it-qat-GGUF`, Q4_0, ~240 MB) | Same job when the phone has no WebGPU | Via **wllama** (`@wllama/wllama` ^3.6.1: llama.cpp compiled to WebAssembly), on the CPU. Slower, plainer riddles. |
| **OpenStreetMap** data via the **Overpass API** | The real places (name, kind, position, "famous" tags) | ODbL. The service falls back across three Overpass servers. |
| **OpenStreetMap** tiles + **Leaflet** | The map | Tiles come from OSM's own server. |
| **Atkinson Hyperlegible Next** font | UI text | Self-hosted (`@fontsource`). |

Licences of each package: **?** check before quoting them (Gemma has its own terms of use).

### Architecture in one picture ✔
```
Phone (all of the game runs here)
 ├─ GPS → fog grid (cells you walked) → localStorage         path/fog/finds/badges never leave
 ├─ Places for the 2 km region ← Render places service       only a ~550 m-rounded point goes out
 ├─ Gemma writes clue text  ← model files cached in browser  no prompt, place or position leaves
 └─ Code decides quest, target, clues' timing, completion (GPS)

Render
 ├─ Static site: the app (Vite build)
 └─ Web service: GET /places?lat&lng → Overpass → per-region cache → gzip → phone
```

### The decisions that shaped it (each with why)

1. **Code picks, Gemma only words.** `quests.makeQuest` chooses the place, distance and rule; the GPS check completes the quest. Gemma writes one line. *Why:* "A 1B model can't be trusted with places or game rules" (GEMMA.md). A bad answer is thrown away and a plain line shows instead. ✔
2. **Every Gemma answer is checked** before it is shown: one line, no emoji, no numbers we didn't give, must not name the hidden place, not written as the player, not an echo of the prompt or an example, must carry the direction. Up to 5 tries, then the plain line. Each rule came from a real bad answer in the spike. ✔
3. **On the phone, not on a server.** Render has no GPUs; CPU Ollama would be slow and paid, and it would receive nearby place names and a rough position. A static site also has nowhere to keep an API key. ✔ (the research is in the Oct 9 session `4024f7d8`, and in the older `PLAN.md` Phase 9 text: `git log -p -- PLAN.md`)
4. **Model choice was measured, not guessed** (laptop, Intel GPU, Chrome) ✔ from `GEMMA.md`:
   | | Gemma 3 270M | Gemma 3 1B |
   |---|---|---|
   | Download | ~300 MB | ~800 MB |
   | Load (first time) | ~12 s | ~22–37 s |
   | One line | ~0.7 s | ~1.2 s |
   | Quality | copied the examples, wrote as the player, made-up stories | 16/16 reach lines usable |
   CPU fallback, WebGPU hidden: loaded in 7.5 s, three clues in 28 s in the background (**~**, from the session, laptop).
5. **Which runtime — a real "open vs gated" story ✔** (`GEMMA.md`): Google's MediaPipe web models for Gemma 3 are **gated** on Hugging Face (they need a login token, which a static site cannot keep); the only open MediaPipe build was Gemma 4 E2B at 2 GB; WebLLM stopped at Gemma 2. The ungated **ONNX** builds run in Transformers.js, so that was chosen. Transformers.js 4.3.0 was picked over 4.3.1 because 4.3.1 was 3 days old.
6. **Regions instead of "all of Singapore".** Storing progress doesn't grow with what is loaded (only cells you walked are stored), but one fixed area only works where you were testing. A 2 km region centred on your first good fix, moving when you're more than 1.5 km away, with the last three kept offline. ✔
7. **A tiny backend, only because of OpenStreetMap's public servers.** The places service exists because public Overpass servers are slow/rate-limited/unreliable and browsers can't set the User-Agent they require; it also caches. It stores nothing about people. ✔ On Oct 9 the official server was down and `overpass-api.de` timed out all day; the service now falls back to OSM France's mirror and kumi.systems.
8. **Privacy by construction.** The app rounds your position to ~550 m *before* sending it; the server rounds again and never logs it (Render's own request logs may). The README states exactly what leaves the phone and what doesn't. ✔

### Engineering stories with real detail (good material, all in the transcripts)
- **"Why is it all fog?"** (Oct 8): your phone and a Windows laptop showed a dot surrounded by fog. Cause: GPS accuracy was ±100 m, worse than the 50 m the app needs to clear fog safely. Fix: an explicit "GPS ±N m, try outdoors" message and a click-to-walk debug mode.
- **The find-counting bug found by walking elsewhere** (Oct 9): "POI is shown on the map but it's not tracked in the quest or stats". A place counted only if its fog was cleared *after* the page opened, so places loaded over old fog were silently skipped. Fixed by remembering which places the device has found. A code review of that branch also found a stall that could block all loading.
- **Gemma that wouldn't turn on** (Oct 10): the switch said "Needs WebGPU" on two phones. Many phones lack WebGPU (iPhones before iOS 26, many Android phones, in-app browsers). The fix was a CPU path with a smaller model rather than telling those users "no".
- **Making the AI sound human** (Oct 10): from "robotic, I can't tell north-east" to narrator riddles in one voice, three-step clues, a handwritten riddle bank as the fallback, and a wisp that rewards trying.
- **Testing:** unit tests for the pure logic (fog, regions, Overpass filtering vs the old tool's output, the places service against a fake Overpass, the quest text checks), and a headless-Chrome suite at 390 and 320 px that includes a real-model run behind `GEMMA=1`. Behaviours were broken on purpose to confirm the tests catch them.
- **Way of working:** one phase at a time: build → test → review (code-review and an over-engineering review) → your check → commit. Skills used: ui-ux-pro-max (all UI), code-review, ponytail-review.

### Render ✔ (for the "Best Use of Render" category)
- **Static Site:** the app (`npm ci && npm test && npm run build`, publish `dist`; `VITE_PLACES_API` baked in at build time).
- **Web Service:** `node server/places.ts` (Node 24 runs the TypeScript directly), health check `/`; Starter plan recommended because the free tier sleeps and empties the in-memory cache.
- Uses the $50 credit; credits are applied at the end of the billing period.
- What Render does *for this project*, in your words to choose: it hosts the app over HTTPS (needed for phone GPS) and runs the one service that makes the map work in any city.

---

## 5. "Why Does Open Innovation Matter?": the evidence you have

Map the prompt's own questions to what really happened in this project:

| The prompt asks | What this project can say | Status |
|---|---|---|
| **Keep location off a server you don't control?** | The quest prompt, the places you found, your path and your fog never leave the phone. The only thing sent is a point rounded to ~550 m, to a service we run. | ✔ (README, code) |
| **Run offline / no signal?** | Once the model is downloaded it loads from the browser cache; the game logic and stored regions work without a network. The map tiles and new regions still need one. | ~ say it only if you test it (airplane mode, previously visited area) |
| **Swap or change models?** | The model is one line in `config.ts` (`GEMMA_MODEL`). It was actually swapped twice: 270M → 1B for quality, and a 270M GGUF added for phones without WebGPU. | ✔ |
| **Cost nothing to run?** | The model has no per-call cost and no key to protect. Costs: the places service on Render (~$7/month Starter; $50 credit) and a one-off 240–800 MB download for the player. | ✔ |
| **Where open was *harder* or *worse* than closed** (the prompt asks for this) | Gated "open" models (MediaPipe's Gemma 3) were not usable from a static site; small models need prompts and answer-checks a big API wouldn't; 800 MB is heavy on mobile; many phones lack WebGPU; slower on CPU. A hosted API would have given better riddles with no download. | ✔ (GEMMA.md, sessions) |
| **The data is open too** | Places, tiles and famous-place tags are OpenStreetMap, ODbL; the public Overpass servers failed on Oct 9 and the open ecosystem offered mirrors to fall back on; Overpass could be self-hosted if even the rounded point is too much. | ✔ |

Things *only* a closed API would have made you do (use only the ones that are true for you): send each player's position and nearby place names to a third party every quest; ship or proxy an API key; pay per quest; depend on one vendor's availability and policy changes.

---

## 6. "My Agent Session": what exists

Claude Code sessions for this project (files under `~/.claude/projects/`):

| Project | Session | Dates | What it covers |
|---|---|---|---|
| walking-maxxing | `078c4ee7` | Oct 7–8 | Choosing the idea and the quest design (gamified, small, open-model capable), planning how quests integrate with the map |
| map-MVP | `d17d6ca9` | Oct 7–8 | The whole map build: phases 1–6 (fog, GPS, places, UI, simple quests, Vite/TS move) |
| walking-maxxing | `4024f7d8` | Oct 9 | Regions, Render service, hosting/model-hosting decisions, the review-driven fixes, docs for handoff |
| map-MVP | `9403e991` | Oct 9–11 | Merging Gemma quests onto the region map, riddles, wisp, badges, legends, trails, the CPU fallback |
| map-MVP | `13277098` | Oct 10 | A merge-conflict fix |
| walking-maxxing | `0c16093c` | Oct 9–11 | The "Today" button redesign, the found-counting fix follow-up, this file |

Notes:
- DevRelay can save a session and give you an `agent_session` embed (the `devrelay-sessions` skill); decide which of these to share. The largest are 12–29 MB.
- **Check before sharing:** transcripts contain local file paths and tool outputs, and the project instructions include your email address in some sessions' context. Read what you embed.
- The most "story-shaped" sessions are `d17d6ca9` (first working map, the GPS-accuracy confusion) and `9403e991` (making the AI sound human, then fixing it on phones without WebGPU).

---

## 7. What only you can supply (the post's heart)

The judges weight the writing most and ask for the outside experience. None of this is recorded anywhere I could read:

- **The walk.** Where, how long, with what phone. What happened when a fog cleared, a place appeared, a riddle landed or didn't. The moment you looked up from the screen. What surprised you.
- **Whether a riddle actually worked in the field** and an example of a real one Gemma wrote for you (the transcripts show test lines like "Head north-east to a cafe concealed by the fog", but not what you got on your walk).
- **Who else tried it** and what they said.
- **Why you wanted this** beyond the brief: walking with a purpose, a neighbourhood you thought you knew, etc.
- **What you'd do next** and what you'd cut.
- **Screenshots/GIF to capture:** the first open (fog + bubble), the quest pill and clue card, the wisp, the Today panel, a badge. Take them on the final build.

---

## 8. Source index

- Repo: `github.com/surrelsaga/map-mvp` (public status **?**). Docs: `README.md`, `PLAN.md` (architecture, phases, decisions, deployment, limits), `GEMMA.md` (the AI quests: decisions, spike results, limits), `CLAUDE.md`.
- Final commits: `ed71e36` (merge), `50d79a3` (CPU fallback), `b947206` (iconic eateries), `8b4b48a` (legend/Landmark badges, trail & legend quests), `a80b182` (famous places data), `6cb0999` (wisp), `b238d31` (narrator riddles), `788f6d3` (Phase 9 docs), `cfdd2e7` (regions).
- Live: `https://map-mvp-api.onrender.com` ✔ up; `https://map-mvp-frontend-v2.onrender.com` ✔ up but an older build; `…frontend-v3…` ✔ 404.
- Challenge page: `https://dev.to/challenges/hacktoberfest-week1-2026-10-05`.
