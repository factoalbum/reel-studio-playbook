#!/usr/bin/env bash
# Transcribe the bonus voiceover clip by clip with whisper.cpp (word timings), as in GOOGLE-PROGRESS.md.
# Usage (from reel-01): bash scripts/bonus/asr.sh
set -u
C=node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe
W=../whisper/main.exe
M=../whisper/ggml-small.bin
OUT=out/bonus-asr
mkdir -p "$OUT"
CUTS="0 6.42 12.35 17.14 23.16 29.73 35.84 42.31 47.55 51.52"
set -- $CUTS
prev=$1; shift
for t in "$@"; do
  clip="$OUT/c-$prev-$t.wav"
  "$C" -y -hide_banner -loglevel error -ss "$prev" -to "$t" -i public/bonus/voice16k.wav -c:a pcm_s16le "$clip"
  "$W" -m "$M" -f "$clip" -l hi -t 8 -nf -bs 1 -bo 1 -mc 0 -ml 1 -sow -oj -of "$OUT/c-$prev-$t" \
    --prompt "Hinglish voiceover in Roman script: Diwali bonus nahi mila? Code on Wages, salary, HR, check kar." >/dev/null 2>&1
  echo "done $prev-$t"
  prev=$t
done
echo ALLDONE
