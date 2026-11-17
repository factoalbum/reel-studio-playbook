#!/usr/bin/env bash
# Re-transcribe short stretches with beam search, Hindi and English passes, to confirm uncertain words.
# Usage (from reel-01): bash scripts/bonus/recheck.sh "27.9-29.6 2.3-4.3"
set -u
C=node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe
W=../whisper/main.exe
M=../whisper/ggml-small.bin
OUT=out/bonus-asr/recheck
mkdir -p "$OUT"
for r in $1; do
  a=${r%-*}; b=${r#*-}
  clip="$OUT/r-$a-$b.wav"
  "$C" -y -hide_banner -loglevel error -ss "$a" -to "$b" -i public/bonus/voice16k.wav -c:a pcm_s16le "$clip"
  for lang in hi en; do
    txt=$("$W" -m "$M" -f "$clip" -l "$lang" -t 8 -bs 5 -mc 0 2>/dev/null | tr -s ' \n' ' ')
    echo "$a-$b [$lang] $txt"
  done
done
