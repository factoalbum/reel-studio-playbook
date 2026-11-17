// Local speech-to-text with word timings (whisper.cpp). Nothing is uploaded.
// Usage: node scripts/transcribe.mjs public/voice16k.wav hi,en
import fs from "node:fs";
import path from "node:path";
import { downloadWhisperModel, installWhisperCpp, transcribe } from "@remotion/install-whisper-cpp";

const whisperPath = path.resolve("..", "whisper");
const whisperCppVersion = "1.5.5";
const model = "small";

await installWhisperCpp({ to: whisperPath, version: whisperCppVersion, printOutput: true });
await downloadWhisperModel({ model, folder: whisperPath, printOutput: true });

const input = path.resolve(process.argv[2] ?? "public/voice16k.wav");
const languages = (process.argv[3] ?? "hi").split(",");
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
  fs.writeFileSync(`scripts/transcript-${language}.json`, JSON.stringify(out, null, 1));
  console.log(`\n=== ${language} ===`);
  for (const seg of out.transcription) {
    const words = seg.tokens
      .filter((t) => !t.text.startsWith("[_"))
      .map((t) => `${t.text.trim()}@${(t.offsets.from / 1000).toFixed(2)}-${(t.offsets.to / 1000).toFixed(2)}`)
      .join(" ");
    console.log(`${(seg.offsets.from / 1000).toFixed(2)}-${(seg.offsets.to / 1000).toFixed(2)} | ${seg.text.trim()}`);
    console.log(`   ${words}`);
  }
}
