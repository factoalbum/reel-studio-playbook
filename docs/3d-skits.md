# 3D desk skits (low-poly, Remotion + three.js)

A second reel format: a short low-poly 3D skit at a desk, starring the owner's mascot and our own Claude buddy.
Started 15 Nov 2026. The kit works; the first skit's script is still open.

## The kit (`studio/src/skit/`)

| File | What it holds |
|---|---|
| `kit3d.tsx` | `Mascot3D` (the owner's mascot in 3D), `Buddy3D` (our Claude buddy), `DeskSet`, `RoomSet`, `Lights`, `CameraRig` |
| `Stage.tsx` | Two layers: a blurred room behind, a sharp desk in front (fake depth of field, cheap to render) |
| `LookSkit.tsx` | Composition `LookSkit`: 5 look-test frames to check the characters and lighting |

Libraries (exact versions, already in `package.json`): `three@0.187.0`, `@react-three/fiber@9.8.2`,
`@remotion/three@4.0.539`, `@types/three@^0.187.0`.

## Characters (keep them consistent)

- **Mascot**: the owner's look from `docs/brand.md` (middle-part hair, black hoodie, lime headphones).
- **Claude buddy**: OUR OWN design, not Anthropic's logo: a terracotta gumdrop body, dark visor, lime eyes, a
  small spark above its head, sitting on a lime coaster.

## Render

```bash
# Always use the ANGLE GL backend for 3D (what works on our Windows laptop):
npx remotion still src/index.ts LookSkit out/check/skit.png --gl=angle --scale=0.5
npx remotion render src/index.ts <SkitComposition> out/<skit>.mp4 --gl=angle --concurrency=1 --timeout=120000
```

Speed on a low-end laptop (Intel UHD, 8 GB RAM): about 5 s per frame at half scale. A 45 s skit is about
1,350 frames, so render in parts (`--frames=`) and join them (see `render-gotchas.md`).

## How to make a skit

1. Format only from any reference reel: never copy its lines, jokes or characters.
2. Script = two speakers (mascot and buddy). The owner records it (for example a two-speaker take). Never
   generate their voice.
3. Transcribe it like any reel; give each line to the right character for lip sync and poses.
4. Block the shots with `CameraRig`: wide desk shot, close-ups on whoever is speaking, one reveal shot.
5. Subtitles, music and the keyword CTA work the same as the 2D reels.

## Known issues

- The mascot's beard-shadow shell reads as a pale band on the face: needs polish before the first skit.
- The planned first skit is about the watch-video plugin (github.com/MarcinSufa/claude-watch-video, MIT:
  ffmpeg keyframes + local Whisper). Our own test: a 43 s reel became 87 frames (one every 0.5 s) + a transcript.
