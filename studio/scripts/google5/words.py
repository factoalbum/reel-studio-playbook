"""Print each whisper clip as 'word@absolute-seconds'. Usage (from reel-01): python -I scripts/google5/words.py out/google5-asr hi"""
import glob, json, os, sys

folder, lang = sys.argv[1], sys.argv[2]
files = glob.glob(os.path.join(folder, f"c-*-{lang}.json"))
files.sort(key=lambda f: float(os.path.basename(f).split("-")[1]))
for f in files:
    start = float(os.path.basename(f).split("-")[1])
    with open(f, encoding="utf-8") as h:
        data = json.load(h)
    words = []
    for seg in data.get("transcription", []):
        txt = seg.get("text", "").strip()
        if not txt or txt.startswith("[") or txt.startswith("("):
            continue
        at = seg["offsets"]["from"] / 1000 + start
        words.append(f"{txt}@{at:.2f}")
    print(os.path.basename(f), "|", " ".join(words))
