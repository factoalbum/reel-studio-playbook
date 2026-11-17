# Workflow, step by step

All commands run inside `studio/`. Windows PowerShell and Git Bash both work; notes say where they differ.

## 0. One-time setup

```bash
cd studio
npm install
# Local Whisper (whisper.cpp + the "small" model, about 488 MB) into ../whisper (the playbook root), used by the transcribe scripts:
node -e "import('@remotion/install-whisper-cpp').then(async m=>{await m.installWhisperCpp({to:'../whisper',version:'1.5.5'});await m.downloadWhisperModel({model:'small',folder:'../whisper'})})"
npm run studio   # opens Remotion Studio in the browser
```

## 1. Script

Write it with `skills/reel-script/SKILL.md`. Give it to the owner as plain text with time marks. Wait for the WAV.

## 2. Bring the voice in

```bash
mkdir -p public/<reel>
cp "<owner's file>.wav" public/<reel>/voice.wav          # never edit or re-encode the original
md5sum public/<reel>/voice.wav                           # write the MD5 in the episode file header
npx remotion ffmpeg -i public/<reel>/voice.wav -ar 16000 -ac 1 -c:a pcm_s16le public/<reel>/voice16k.wav
```

## 3. Transcribe the real words and find the timing

```bash
# Pauses = phrase edges:
npx remotion ffmpeg -i public/<reel>/voice.wav -af silencedetect=noise=-38dB:d=0.12 -f null - 2>&1 | grep silence_
# Words per phrase (Hindi by default; LANG2=en for English). TIMES=1 adds word times:
node scripts/transcribe-fast.mjs public/<reel>/voice16k.wav "0-4.3,4.3-9.2" out/<reel>-clips
# Loudness per frame, drives lip sync and music ducking:
node scripts/voice-env.mjs public/<reel>/voice.wav src/episodes/<reel>-voice-env.json 30
```

Subtitles follow what the voice really says (Roman Hinglish), timed to the pauses.

## 4. Build the reel

Copy the TOKENS reel as the pattern:

| File | What it holds |
|---|---|
| `src/episodes/<reel>.ts` | Header comment with the fact check + sources + dates; `captions` (word timings), `avatarKeys` (poses/expressions over time), `avatarPlaces`, `sfx`, `voiceSeconds`, file paths |
| `src/<reel>/Scenes.tsx` | One component per scene, each takes `t` (seconds) and shows itself only in its time window |
| `src/<reel>/Cover.tsx` | The cover still |
| `src/Reel<Name>.tsx` | Stacks Backdrop, scenes, Avatar, Subtitles, ProgressBar, ReelAudio |
| `src/Root.tsx` | Register `Reel<Name>`, `Cover<Name>` and a few `Sheet<Name>` compositions |
| `package.json` | `render:<reel>`, `cover:<reel>`, `music:<reel>` scripts |

Craft rules: show, don't tell (each step gets its own visual metaphor); one camera/zoom system per reel; a bookend
ending that returns to the hook image; numbers on screen must match the source, with an "update" note if the voice
is out of date. See `docs/brand.md` for the look.

## 5. Music and effects

```bash
node scripts/make-audio-<reel>.mjs <voice seconds>   # copy make-audio-tokens.mjs and edit its SECTIONS map
node scripts/levels.mjs public/<reel>/music.wav       # loudness check
```

## 6. Check, then render

```bash
npx remotion still src/index.ts Sheet<Name> out/check/<reel>-a.png     # contact sheet: look at it before rendering
npm run render:<reel>
npm run cover:<reel>
```

See `docs/render-gotchas.md` before a long render.

## 7. Hand over

MP4 + cover PNG + `<reel file name>.caption.txt`. The owner posts. Nothing is published by the agent.
