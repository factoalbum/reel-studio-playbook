#!/usr/bin/env bash
# Transcribe the "5 Google AI tools" voiceover clip by clip with whisper.cpp (word timings), as for the Immich reel.
# Cuts sit in the middle of pauses found with silencedetect. Usage (from reel-01): bash scripts/google5/asr.sh [lang]
set -u
LANG_=${1:-hi}
C=node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe
W=../whisper/main.exe
M=../whisper/ggml-small.bin
OUT=out/google5-asr
mkdir -p "$OUT"
CUTS="0 6.52 12.27 15.02 17.09 22.30 24.33 29.47 36.61 39.12 44.52 45.68 47.17 52.69 55.91 64.2"
set -- $CUTS
prev=$1; shift
for t in "$@"; do
  clip="$OUT/c-$prev-$t.wav"
  "$C" -y -hide_banner -loglevel error -ss "$prev" -to "$t" -i public/google5/voice16k.wav -af apad=pad_dur=0.6 -c:a pcm_s16le "$clip"
  timeout 150 "$W" -m "$M" -f "$clip" -l "$LANG_" -t 8 -nf -bs 1 -bo 1 -mc 0 -ml 1 -sow -oj -of "$OUT/c-$prev-$t-$LANG_" \
    --prompt "Hinglish voiceover in Roman script: Kal raat Google ne 18,000 rupay ke 5 paid AI tools free. Canva, Cursor, v0, subscriptions. Number 1 Google Stitch, Google Opal, Pomelli, Google Antigravity, Mixboard, NotebookLM, Google AI Studio. Beta. Comment karo Google Paanch. Follow." >/dev/null 2>&1
  echo "done $prev-$t ($?)"
  prev=$t
done
echo ALLDONE
