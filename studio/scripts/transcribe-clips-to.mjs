// Re-transcribes chosen stretches of a voiceover on their own (beam search), to double-check uncertain words
// and to get usable timings where the full-file pass drifts. Like transcribe-clips.mjs, but the clips are arguments.
// Usage: node scripts/transcribe-clips-to.mjs public/ep02/voice16k.wav "2.7-4.9,22.6-26.4" out/ep02-clips
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { transcribe } from "@remotion/install-whisper-cpp";

const input = path.resolve(process.argv[2]);
const clips = process.argv[3].split(",").map((c) => c.split("-").map(Number));
const outDir = process.argv[4] ?? "out/clips";
const whisperPath = path.resolve("..", "whisper");
const passes = [
  { name: "hi", language: "hi", args: [["-bs", "5"]] },
  { name: "hi+roman", language: "hi", args: [["-bs", "5"], ["--prompt", "Hinglish reel voiceover in Roman script: Bhai, ye dekho! Comment karo aur follow karo."]] },
  { name: "en", language: "en", args: [["-bs", "5"]] },
];
fs.mkdirSync(outDir, { recursive: true });
for (const [a, b] of clips) {
  const clip = path.resolve(outDir, `clip-${a}-${b}.wav`);
  execFileSync("npx", ["remotion", "ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-ss", String(a), "-to", String(b), "-i", input, "-c:a", "pcm_s16le", clip], { shell: true });
  console.log(`\n### ${a}-${b}s`);
  for (const p of passes) {
    const out = await transcribe({
      inputPath: clip,
      whisperPath,
      whisperCppVersion: "1.5.5",
      model: "small",
      tokenLevelTimestamps: true,
      splitOnWord: true,
      language: p.language,
      additionalArgs: p.args,
      printOutput: false,
    });
    const words = out.transcription
      .map((s) => `${s.text.trim()}@${(a + (s.offsets?.from ?? 0) / 1000).toFixed(2)}`)
      .filter((w) => !w.startsWith("@"))
      .join(" ");
    console.log(`  ${p.name.padEnd(9)} ${words}`);
  }
}
