---
name: reel-build
description: Turn the owner's recorded voiceover WAV into a finished 1080x1920 Remotion reel with the Internet Toolbox brand kit (mascot, subtitles, original music), then render the MP4 and cover. Use when a voice file for a scripted reel arrives.
---

# Reel build

1. Read `AGENTS.md`, `docs/workflow.md`, `docs/brand.md` and `docs/render-gotchas.md`.
2. Copy the WAV (the owner's file or the chosen Gemini TTS take) unchanged to `studio/public/<reel>/voice.wav`; record its MD5 and length. For 3D skits follow `docs/3d-skits.md` instead.
3. Transcribe it locally (workflow step 3). Use the real words for subtitles. Note any line that differs from the
   script, and any fact in the voice that is now wrong (correct it on screen with a dated update).
4. Create `src/episodes/<reel>.ts`, `src/<reel>/Scenes.tsx`, `src/<reel>/Cover.tsx`, `src/Reel<Name>.tsx`, register
   them in `src/Root.tsx`, and add `render:`, `cover:` and `music:` scripts. Copy the TOKENS reel's structure.
5. Write `scripts/make-audio-<reel>.mjs` (copy the TOKENS one, change the section map) and run it.
6. Render contact sheets, look at every frame for overlaps, cut-off text and timing, fix, repeat.
7. Render the MP4 and the cover. Check with ffprobe. Report the file paths, the length and anything unverified.
8. Never publish or schedule. Never commit or push without the owner's yes.
