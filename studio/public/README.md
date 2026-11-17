# public/ (media, not in git)

Remotion serves files from here with `staticFile()`. Media is kept out of git (voice recordings, music, logos,
screenshots). For a new reel put:

- `public/<reel>/voice.wav`: the owner's recording, unchanged
- `public/<reel>/music.wav`: made by `scripts/make-audio-<reel>.mjs`
- `public/sfx/*.wav`: shared effects, made by `scripts/make-audio.mjs`
- any logos or screenshots the scenes load (only ones we have the right to use)

Old reels in `src/` will not render without their media. Use them as code examples.
