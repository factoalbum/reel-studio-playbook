# Voice with Gemini TTS (one or two speakers)

Since 18 Nov 2026 the owner allows the voiceover to be made with Gemini text-to-speech. It is the same engine as
the speech page in Google AI Studio, where the owner made their own voice files.

## The owner's voice settings (do not change them)

| Setting | Value |
|---|---|
| Model | `gemini-3.1-flash-tts-preview` (Gemini 3.1 Flash TTS) |
| Voice | **Puck** (this is "the owner's voice" in every reel) |
| Style | AI Studio's "Promote" preset, written as: `Read this like an energetic, upbeat promo: confident, punchy and excited, in natural Hinglish` |
| Output | 24 kHz, 16-bit, mono WAV |

For a second character (for example Claude in the 3D skits) use a clearly different voice. We used **Charon**,
which is calmer and deeper. Gemini allows exactly two speakers in one request.

## The API key (free, never printed)

- The key lives in the Windows user environment variable `GEMINI_API_KEY`. It belongs to a free-tier Google
  project with no billing, so it cannot cost money.
- Load it in a PowerShell session without printing it:
  `$env:GEMINI_API_KEY = [Environment]::GetEnvironmentVariable('GEMINI_API_KEY','User')`
- Never echo the key, never write it to a file, a commit, a log or a chat.
- Before a big batch, check the free daily limit in AI Studio > Rate limit.

## Commands (`studio/scripts/tts-gemini.mjs`)

```bash
# One speaker (normal reels): the script is plain text
node scripts/tts-gemini.mjs public/<reel>/script.txt public/<reel>/take1.wav

# Two speakers (skits): every line starts with a speaker label
node scripts/tts-gemini.mjs public/skit/script.txt public/skit/take1.wav --speakers "You=Puck,Claude=Charon" --style "$(cat public/skit/style.txt)"
```

Two-speaker script format (labels must match the `--speakers` names exactly):

```
You: Claude, ye reel dekh. Chachu viral kaise ho gaye?
Claude: Main Instagram nahi khol sakta.
You: Ruk. Video file deta hoon. Ye plugin laga.
```

The style file is a short acting note per character, for example: "You is upbeat and playful. Claude is calm and
deadpan, then gets hooked and starts pleading. Leave a longer pause before the time jump. The last line is said
to the viewer."

## The steps every time

1. Write the script in Roman Hinglish. Use commas or "..." for pauses in the TTS script only (never on screen).
2. Make **two takes**. TTS is different every time; keep the better one.
3. **Transcribe the take** with local Whisper and compare it to the script word by word. Redo the take if a word
   is wrong or swallowed. Captions always come from the transcript, never from the script.
4. Find line edges with ffmpeg `silencedetect` (`noise=-38dB:d=0.22`). Write them as a table: line, speaker,
   start, end, pauses inside.
5. Need a longer pause (a time jump, a punchline)? Insert silence with ffmpeg at the gap and shift every later
   time by the same amount.
6. Make the mouth envelope for lip sync: `node scripts/voice-env.mjs public/<reel>/voice.wav src/episodes/<reel>-voice-env.json 30`
7. Two speakers: check the pitch of each speaker's lines (ours: You about 140 to 230 Hz, Claude about 90 to 165
   Hz) so the voices are clearly different. Then ask the owner to listen.

## Honesty

- The voice is a synthetic voice chosen by the owner. Never clone a real person's voice.
- If the voice says something that is out of date, keep it and correct it on screen with a dated "update" note.
