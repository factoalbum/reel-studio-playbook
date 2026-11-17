// Re-transcribes each spoken line on its own (beam search), to double-check uncertain words.
// Usage: node scripts/transcribe-clips.mjs public/voice16k.wav
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { transcribe } from "@remotion/install-whisper-cpp";

const input = path.resolve(process.argv[2] ?? "public/voice16k.wav");
const whisperPath = path.resolve("..", "whisper");
const clips = [
  [0.0, 3.0],
  [3.0, 6.0],
  [6.2, 9.1],
  [9.2, 10.7],
  [10.8, 13.9],
  [14.2, 18.0],
];
const passes = [
  { name: "hi", language: "hi", args: [["-bs", "5"]] },
  { name: "hi+roman", language: "hi", args: [["-bs", "5"], ["--prompt", "Hinglish reel voiceover in Roman script: Bhai, ye dekho! Follow karo."]] },
  { name: "en", language: "en", args: [["-bs", "5"]] },
];
fs.mkdirSync("out/clips", { recursive: true });
for (const [a, b] of clips) {
  const clip = path.resolve(`out/clips/clip-${a}-${b}.wav`);
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
    });
    const words = out.transcription
      .map((s) => `${s.text.trim()}@${(a + s.offsets.from / 1000).toFixed(2)}`)
      .filter((w) => !w.startsWith("@"))
      .join(" ");
    console.log(`  ${p.name.padEnd(9)} ${words}`);
  }
}
