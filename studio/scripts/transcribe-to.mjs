// Local speech-to-text with word timings (whisper.cpp), like transcribe.mjs but into a chosen folder,
// so a new episode never overwrites another episode's transcripts. Nothing is uploaded.
// Usage: node scripts/transcribe-to.mjs public/ep02/voice16k.wav hi,en scripts/ep02
import fs from "node:fs";
import path from "node:path";
import { downloadWhisperModel, installWhisperCpp, transcribe } from "@remotion/install-whisper-cpp";

const whisperPath = path.resolve("..", "whisper");
const whisperCppVersion = "1.5.5";
const model = "small";

await installWhisperCpp({ to: whisperPath, version: whisperCppVersion, printOutput: false });
await downloadWhisperModel({ model, folder: whisperPath, printOutput: false });

const input = path.resolve(process.argv[2]);
const languages = (process.argv[3] ?? "hi").split(",");
const outDir = process.argv[4] ?? "scripts";
fs.mkdirSync(outDir, { recursive: true });
for (const language of languages) {
  const out = await transcribe({
    inputPath: input,
    whisperPath,
    whisperCppVersion,
    model,
    tokenLevelTimestamps: true,
    splitOnWord: true,
    language,
    printOutput: false,
  });
  fs.writeFileSync(path.join(outDir, `transcript-${language}.json`), JSON.stringify(out, null, 1));
  console.log(`\n=== ${language} ===`);
  // With splitOnWord each segment is one word; Hindi tokens are byte pieces, so print the words only.
  console.log(out.transcription.map((seg) => `${seg.text.trim()}@${((seg.offsets?.from ?? 0) / 1000).toFixed(2)}`).join(" "));
}
