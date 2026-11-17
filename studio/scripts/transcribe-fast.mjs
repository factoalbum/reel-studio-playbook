// One greedy Hindi pass per clip (fast check of the words; phrase timing comes from the pauses).
// Usage: node scripts/transcribe-fast.mjs public/agent/voice16k.wav "0-4.3,4.3-9.2" out/agent-clips
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { transcribe } from "@remotion/install-whisper-cpp";
const input = path.resolve(process.argv[2]);
const clips = process.argv[3].split(",").map((c) => c.split("-").map(Number));
const outDir = process.argv[4] ?? "out/clips";
fs.mkdirSync(outDir, { recursive: true });
for (const [a, b] of clips) {
  const clip = path.resolve(outDir, `clip-${a}-${b}.wav`);
  execFileSync("npx", ["remotion", "ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-ss", String(a), "-to", String(b), "-i", input, "-c:a", "pcm_s16le", clip], { shell: true });
  const out = await transcribe({ inputPath: clip, whisperPath: path.resolve("..", "whisper"), whisperCppVersion: "1.5.5", model: "small", tokenLevelTimestamps: true, splitOnWord: true, language: process.env.LANG2 ?? "hi", additionalArgs: [["-t", "4"]], printOutput: false });
  console.log(`${a}-${b}: ` + out.transcription.map((s) => (process.env.TIMES ? `${s.text.trim()}@${(a + (s.offsets?.from ?? 0) / 1000).toFixed(2)}` : s.text.trim())).filter((w) => w && !w.startsWith("@")).join(" "));
}
