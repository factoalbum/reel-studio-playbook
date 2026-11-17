#!/usr/bin/env bash
# Re-check stretches the first pass missed or looped on (beam search, English and Hindi passes).
# Usage (from reel-01): bash scripts/immich/recheck.sh
set -u
C=node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe
W=../whisper/main.exe
M=../whisper/ggml-small.bin
OUT=out/immich-asr/recheck
mkdir -p "$OUT"
for pair in "0 1.15" "33.9 36.3" "43.05 44.8"; do
  set -- $pair
  a=$1; b=$2
  clip="$OUT/r-$a-$b.wav"
  "$C" -y -hide_banner -loglevel error -ss "$a" -to "$b" -i public/immich/voice16k.wav -af "apad=pad_dur=0.6" -c:a pcm_s16le "$clip"
  for lang in en hi; do
    timeout 120 "$W" -m "$M" -f "$clip" -l $lang -t 8 -nf -bs 5 -mc 0 -ml 1 -sow -oj -of "$OUT/r-$a-$b-$lang" \
      --prompt "Hinglish voiceover: Bhai, storage limit hai, aur setup thoda technical hai. Comment karo PHOTO." >/dev/null 2>&1
    echo "done $a-$b $lang"
  done
done
echo ALLDONE
