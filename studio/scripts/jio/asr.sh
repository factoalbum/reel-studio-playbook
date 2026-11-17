#!/usr/bin/env bash
# Transcribe the Jio Gemini voiceover clip by clip with whisper.cpp (word timings), as for the Immich reel.
# Cuts sit in the middle of pauses found with silencedetect. Usage (from reel-01): bash scripts/google5/asr.sh [lang]
set -u
LANG_=${1:-hi}
C=node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe
W=../whisper/main.exe
M=../whisper/ggml-small.bin
OUT=out/jio-asr
mkdir -p "$OUT"
CUTS="0 4.45 6.10 8.51 12.19 13.44 15.64 17.06 20.36 24.61 26.66 30.10 32.34 35.99 40.22 44.06 45.77 48.46 50.03 52.94 54.64 57.62 59.87 62.28 65.2"
set -- $CUTS
prev=$1; shift
for t in "$@"; do
  clip="$OUT/c-$prev-$t.wav"
  "$C" -y -hide_banner -loglevel error -ss "$prev" -to "$t" -i public/jio/voice16k.wav -af apad=pad_dur=0.6 -c:a pcm_s16le "$clip"
  timeout 150 "$W" -m "$M" -f "$clip" -l "$LANG_" -t 8 -nf -bs 1 -bo 1 -mc 0 -ml 1 -sow -oj -of "$OUT/c-$prev-$t-$LANG_" \
    --prompt "Hinglish voiceover in Roman script: Jio ne 35,000 ka AI free diya. Tum sirf chat kar rahe ho? Ye 5 kaam karo. Number 5, photo editing, Nano Banana. Gmail, Gemini, summary, reply. 18 mahine. Storage, TBs, backup. Google Docs. NotebookLM, PDF, YouTube link, Hindi podcast. Gemini CLI. Auto-renew, 15 GB, activation date. Comment karo GEMINI." >/dev/null 2>&1
  echo "done $prev-$t ($?)"
  prev=$t
done
echo ALLDONE
