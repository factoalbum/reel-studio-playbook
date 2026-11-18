# 3D desk skits (low-poly, Remotion + three.js)

A second reel format: a short low-poly 3D comedy skit at a desk with two characters, the owner's mascot ("You")
and our own Claude buddy. The first finished skit is "Claude ko reels ki lat" (keyword WATCH, 18 Nov 2026):
`studio/src/skit/ReelWatch.tsx`. Copy it for the next skit.

## Files

| File | What it holds |
|---|---|
| `src/skit/kit3d.tsx` | `Mascot3D`, `Buddy3D`, `Phone`, `DeskSet`, `RoomSet({neon})`, `Lights({warm})`, `CameraRig`, hand rest points (`REST_L`, `REST_R`, `PHONE_L`) |
| `src/skit/Stage.tsx` | `Stage({shot})`: a blurred room layer behind a sharp desk layer (fake depth of field), a vignette, `night` mode (blue wash, dim warm light, bright neon) and an optional `propPhone` |
| `src/skit/ReelWatch.tsx` | The skit: shot list (`BEATS`), lip sync, blinks, hook title, punch zooms, screen shake, speaker chip |
| `src/skit/Inserts.tsx` | 2D pop-ups drawn on top of the 3D (story props, terminal, frames, clock, CTA comment box) |
| `src/skit/CoverWatch.tsx` | The cover: one posed 3D frame plus the title |
| `src/episodes/watch.ts` | `LINES` (who speaks when), cue times `C`, captions, sound effects |
| `scripts/make-audio-watch.mjs` | The synthesised music bed (quiet sections under talk, a break for the time jump) |

Libraries (exact versions in `package.json`): `three@0.187.0`, `@react-three/fiber@9.8.2`, `@remotion/three@4.0.539`.

## Characters (keep them the same in every skit)

- **You (mascot)**: the owner's look from `docs/brand.md`: middle-part hair, black hoodie, lime headphones.
  Voice: Gemini **Puck**.
- **Claude buddy**: OUR OWN design, never Anthropic's logo: a terracotta low-poly gumdrop, dark visor, lime
  eyes, a spark above the head, sitting on a lime coaster on a riser. Voice: Gemini **Charon**.
- Poses: `MascotPose` (yaw, gaze, blink, brow, smile, mouth, handL/handR, phone, lean, bob, roll) and
  `BuddyPose` (yaw, tilt, gaze, eye size, mood -1 to 1, mouth, stretch, hop, spark, spin).

## How to make a skit, step by step

1. **Script**: the owner writes it or approves it. Two speakers, short lines, one twist (in WATCH: a time jump
   to 3 AM). Learn the format from reference reels, never copy their jokes or characters.
2. **Voice**: Gemini two-speaker mode, see `docs/voice-gemini-tts.md`. Two takes, Whisper check, line table,
   extra silence for the time jump, mouth envelope.
3. **Episode file**: `LINES` with `{who, a, b}` per line, cue times `C`, captions with `card()`, sound effects.
4. **Lip sync**: one envelope for the whole voice; each character's mouth gets it only while `LINES` says that
   character is speaking. Blinks run on two timers so they never blink together.
5. **Shot list (`BEATS`)**: a hard cut on every line. Five cameras are enough: wide, mascot close-up, Claude
   close-up, two-shot, end shot. Inside each shot add a slow push-in (5 to 20 percent) so nothing is static.
   Close-ups on whoever speaks; reactions in the wide shots.
6. **Acting**: every beat gets its own pose: gestures with the hands, Claude's eyes growing, the spark spinning
   when Claude is hooked, a sad mood when the phone is taken away.
7. **2D inserts** on top of the 3D, one per line, top area of the frame (from about y 360), never over the faces
   and never under the captions (captions start at y 1466). Draw story props ourselves (in WATCH: Chachu, his
   cooker, his wedding video). Show the real tool honestly: real name, real install commands from its README.
8. **Make it catchy** (the owner's rule: "proper attractive, catchy"):
   - a big hook title on the very first frame (WATCH: "CLAUDE KO / REELS KI LAT 😳"), gone after about 1.8 s
   - punch-in zooms (6 to 10 percent, quick decay) on every punchline
   - a short screen shake on the physical joke ("Phone wapas")
   - a full-screen time-jump card ("3 GHANTE BAAD", spinning clock, a pile of thumbnails)
   - a whoosh or pop sound on every cut and pop-up
   - a "YOU" or "CLAUDE" speaker chip above the subtitles
9. **Theme**: the skit room is the brand room, but props and inserts follow the topic (`docs/script-and-hooks.md`).
10. **CTA**: a comment box that types the keyword, then "ya link in bio pe KEYWORD type karo". Never show a DM.
11. **Check, then render** (below), then cover and caption.

## Render

```bash
# 3D always needs the ANGLE GL backend on our Windows laptop
npx remotion still src/index.ts ReelWatch out/check/f.png --frame=470 --scale=0.3 --gl=angle --timeout=120000
npx remotion render src/index.ts ReelWatch out/skit/<name>.mp4 --gl=angle --codec=h264 --crf=18 --concurrency=1 --timeout=240000 --disallow-parallel-encoding
npx remotion still src/index.ts CoverWatch out/skit/<name>-cover.png --gl=angle --timeout=120000
```

- Before the full render, render 6 stills spread across the skit, join them side by side with ffmpeg `hstack`
  and look for: pop-ups covering faces or the brand bug, props hiding a face, cut-off text.
- Speed: the 41.7 s WATCH skit (1,252 frames) rendered in **4 minutes** at full size. A single still takes about
  14 s because of bundling, so batch stills in one command.
- After rendering, extract 16 frames from the MP4 (ffmpeg `select` + `tile=8x2`) and run `volumedetect`. Our
  good level: mean about -22 dB, max about -3 dB.

## Problems we hit (and the fixes)

- Pop-ups covered the "Internet Toolbox" bug: move the whole insert layer down 110 px.
- The plugin terminal covered the mascot's face: place wide cards low over the desk instead.
- A prop phone in front of Claude hid its face in close-ups: put it at Claude's side, and hide it in Claude's
  close-ups.
- The cover title covered the mascot's eyes: use a wider camera for the cover.
- Still open: the mascot's beard shading reads as a pale band on the face.
