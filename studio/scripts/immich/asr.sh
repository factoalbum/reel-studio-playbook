#!/usr/bin/env bash
# Transcribe the Immich voiceover clip by clip with whisper.cpp (word timings), as for the bonus reel.
# Cuts sit in the middle of pauses found with silencedetect. Usage (from reel-01): bash scripts/immich/asr.sh
set -u
C=node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe
W=../whisper/main.exe
M=../whisper/ggml-small.bin
OUT=out/immich-asr
mkdir -p "$OUT"
CUTS="0 0.99 4.35 8.99 12.58 14.2 16.6 19.33 21.85 24.82 26.39 28.54 29.89 32.69 35.4 36.1 39.4 41.31 43.05 44.75 47.34 48.72"
set -- $CUTS
prev=$1; shift
for t in "$@"; do
  clip="$OUT/c-$prev-$t.wav"
  "$C" -y -hide_banner -loglevel error -ss "$prev" -to "$t" -i public/immich/voice16k.wav -c:a pcm_s16le "$clip"
  "$W" -m "$M" -f "$clip" -l hi -t 8 -nf -bs 1 -bo 1 -mc 0 -ml 1 -sow -oj -of "$OUT/c-$prev-$t" \
    --prompt "Hinglish voiceover in Roman script: Bhai, Google Photos jaisa storage, subscription, Immich, open-source photo app, auto backup, face recognition, albums, Beach Sunset, server, Oracle Cloud Always Free, setup, Comment karo PHOTO, Internet Toolbox." >/dev/null 2>&1
  echo "done $prev-$t"
  prev=$t
done
echo ALLDONE
