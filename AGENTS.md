# How we make reels (read this first)

You are helping make short vertical reels (1080x1920, 30 fps, 30 to 95 seconds) for the Internet Toolbox brand
(Instagram @internetoolbox, YouTube @internettoolbox, Facebook /internetoolbox, site internetoolbox.com).
Every reel is made entirely in code with Remotion (React). No AI video model, no stock footage, no paid tools.

This file works for Claude Code, Codex, GitHub Copilot, Cursor, Gemini and any other coding agent.

## The pipeline (always in this order)

1. **Idea**: teach one useful thing (a free tool, a money fact, a trick). The brand is an afterthought. Ask:
   "would this reel still be worth watching with our name removed?" If no, rethink it. See `docs/script-and-hooks.md`.
2. **Fact check** every number, date, price and limit from a primary source (the official site, docs or README).
   Write the date you checked it. See `docs/honesty-rules.md`.
3. **Script**: Roman Hinglish, a hook in the first 3 seconds, 3 to 5 steps, one honest note, a keyword call to
   action. Give the script to the owner. **The owner records the voice. Never generate or clone their voice.**
4. **Voice in**: copy the owner's WAV to `studio/public/<reel>/voice.wav` unchanged (note its MD5).
5. **Transcribe the real recording** (it always differs from the script). Local Whisper only, nothing uploaded.
   See `docs/workflow.md`, step 3.
6. **Build**: a new episode file, a scene file and a composition, using the brand kit in `studio/src/brand`.
   Copy the pattern of `studio/src/ReelTokens.tsx` + `studio/src/tokens/` + `studio/src/episodes/tokens.ts`.
7. **Music and sound**: synthesise an original bed with a `make-audio-<reel>.mjs` script (no samples, no licences).
8. **Check**: render contact sheets at key moments, look at them, fix, then render the full MP4 and the cover.
9. **Caption**: see `docs/captions-and-posting.md`. Hand the MP4, cover and caption to the owner.

## Hard rules

- Never publish, schedule, post, comment, DM, commit, push or spend money without the owner's explicit yes for
  that exact action.
- Never invent numbers, earnings, testimonials, comments, screenshots, sales or DMs. Real numbers only.
- Never promise income. Say "results vary" when money is the topic.
- Never show or promise automatic DMs (our Instagram DMs are restricted). Use "link in bio pe KEYWORD type karo".
- Never copy another creator's script, jokes, characters or art. Learn the format, write our own.
- No third-party logos or game art you have no right to use (for example no Rockstar/GTA artwork). Names in text
  are fine.
- Keep the voice exactly as recorded. If the voice says something outdated, keep it and correct it on screen
  with a dated "update" note.
- Always use the brand kit and `docs/brand.md`: paper #FAF9F6, ink #171717, lime #C8F169, olive #3F5F12,
  IBM Plex Sans and Mono, the owner's mascot (`Avatar`), grey-until-spoken subtitles with a lime marker.
- No em dashes, en dashes or ellipses in on-screen text or captions.

## Where things are

- `studio/`: the real Remotion project (every past reel is in `studio/src`). `public/` media is not in git;
  see `studio/public/README.md`.
- `docs/`: the how-to, step by step. Start with `docs/workflow.md`. For 3D desk skits (low-poly three.js
  mascot + Claude buddy), read `docs/3d-skits.md`.
- `skills/`: ready-made agent skills (Claude Code format, readable by any agent): script, build, caption.
