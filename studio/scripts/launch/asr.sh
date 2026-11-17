#!/usr/bin/env bash
# Transcribe the ebook launch voiceover clip by clip with whisper.cpp (word timings), as for the Jio reel.
# Cuts sit in the middle of pauses found with silencedetect (-35 dB). Usage (from reel-01): bash scripts/launch/asr.sh [lang]
set -u
LANG_=${1:-en}
C=node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe
W=../whisper/main.exe
M=../whisper/ggml-small.bin
OUT=out/launch-asr
mkdir -p "$OUT"
CUTS="0 1.69 3.52 5.96 7.05 8.48 9.82 19.23 22.0 25.3 26.4 27.27 28.97 33.28 35.9 37.5 42.74 43.68"
set -- $CUTS
prev=$1; shift
for t in "$@"; do
  clip="$OUT/c-$prev-$t.wav"
  "$C" -y -hide_banner -loglevel error -ss "$prev" -to "$t" -i public/launch/voice16k.wav -af apad=pad_dur=0.6 -c:a pcm_s16le "$clip"
  timeout 150 "$W" -m "$M" -f "$clip" -l "$LANG_" -t 8 -nf -bs 1 -bo 1 -mc 0 -ml 1 -sow -oj -of "$OUT/c-$prev-$t-$LANG_" \
    --prompt "Hinglish voiceover in Roman script: Ebook bana toh loge, par bechoge kaise? Socho, ChatGPT se ebook likh li, cover bhi bana liya. Lekin khareedega kaun? Bechoge kahaan? Isiliye maine banaya hai Ebook Launch Kit for India. Ikkis ready-to-use AI prompts. Editable landing page aur offer templates. Ebook planning guide, Excel workbook aur outline worksheet. Pehli ebook ki planning se launch ki taiyari tak, sab ek kit mein. Aur keemat? Sirf ninyanve rupaye. Reels se bechna seekhna hai? Marketing journey. Link bio mein hai. Follow karo Internet Toolbox." >/dev/null 2>&1
  echo "done $prev-$t ($?)"
  prev=$t
done
echo ALLDONE
